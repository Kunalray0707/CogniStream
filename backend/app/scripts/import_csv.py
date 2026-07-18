"""
Data ingestion pipeline: CSV -> Polars transformation -> ClickHouse.

This is the "Data Processing (Python & Polars)" module described in the
project brief. It reads the raw productivity dataset, derives the
analytics fields CogniStream's dashboard depends on (flow state,
context-switch rate, cognitive-load bucket, a productivity score),
and loads the result into ClickHouse.

Usage (from the backend/ directory):

    python -m app.scripts.import_csv
    python -m app.scripts.import_csv --csv data/ai_dev_productivity.csv --reset

Notes on the source dataset
----------------------------
`ai_dev_productivity.csv` has one row per coding session for a single
developer, but it has no date/time column. To support time-series
charts we assign each row a synthetic sequential `session_date`
(oldest row = `--start-date`, one day per subsequent row). This is a
reasonable stand-in for the "timestamped event logs" described in the
brief, given the dataset available for this project.
"""
import argparse
import sys
from datetime import date, timedelta
from pathlib import Path

import polars as pl

from app.database.clickhouse import get_clickhouse_client

DEFAULT_CSV_PATH = Path(__file__).resolve().parents[2] / "data" / "ai_dev_productivity.csv"

# Flow state heuristic: a session counts as "deep flow" when the developer
# coded for a meaningful stretch of time with few interruptions.
FLOW_MIN_HOURS = 3.0
FLOW_MAX_DISTRACTIONS = 2

# Cognitive load buckets (cognitive_load is on a 0-10 scale in the dataset).
COGNITIVE_LOAD_LOW_MAX = 4.0
COGNITIVE_LOAD_MEDIUM_MAX = 7.0


def _cognitive_load_level(load: float) -> str:
    if load <= COGNITIVE_LOAD_LOW_MAX:
        return "Low"
    if load <= COGNITIVE_LOAD_MEDIUM_MAX:
        return "Medium"
    return "High"


def _recommendation(load: float) -> str:
    if load > COGNITIVE_LOAD_MEDIUM_MAX:
        return "Take a break and reduce workload"
    if load > COGNITIVE_LOAD_LOW_MAX:
        return "Maintain focus and monitor stress"
    return "Good productivity state"


def transform(csv_path: Path, start_date: date) -> tuple[pl.DataFrame, pl.DataFrame]:
    """Load the raw CSV and derive the coding_sessions / cognitive_metrics frames."""
    df = pl.read_csv(csv_path)

    df = df.with_row_index("id", offset=1)

    df = df.with_columns(
        (pl.col("id") - 1).cast(pl.Int64).map_elements(
            lambda offset: start_date + timedelta(days=int(offset)), return_dtype=pl.Date
        ).alias("session_date"),
        pl.lit(1).cast(pl.UInt32).alias("developer_id"),
        (pl.col("distractions") / pl.col("hours_coding").clip(lower_bound=0.01))
        .round(3)
        .alias("context_switch_rate"),
    )

    df = df.with_columns(
        (
            (pl.col("hours_coding") >= FLOW_MIN_HOURS)
            & (pl.col("distractions") <= FLOW_MAX_DISTRACTIONS)
        )
        .cast(pl.UInt8)
        .alias("flow_state"),
        # Simplified productivity heuristic combining task outcome, shipped
        # commits, bugs introduced and AI-assist usage, clipped to 0-100.
        (
            pl.col("task_success") * 50
            + pl.col("commits") * 5
            - pl.col("bugs_reported") * 3
            + pl.col("ai_usage_hours") * 2
        )
        .clip(lower_bound=0, upper_bound=100)
        .round(2)
        .alias("productivity_score"),
        pl.col("cognitive_load").map_elements(_cognitive_load_level, return_dtype=pl.Utf8).alias(
            "cognitive_load_level"
        ),
        pl.col("cognitive_load").map_elements(_recommendation, return_dtype=pl.Utf8).alias(
            "recommendation"
        ),
    )

    coding_sessions = df.select(
        "id",
        "developer_id",
        "session_date",
        "hours_coding",
        "coffee_intake_mg",
        "distractions",
        "sleep_hours",
        "commits",
        "bugs_reported",
        "ai_usage_hours",
        "context_switch_rate",
        "flow_state",
    )

    cognitive_metrics = df.select(
        "id",
        pl.col("id").alias("session_id"),
        "cognitive_load",
        "cognitive_load_level",
        pl.col("task_success").cast(pl.UInt8),
        "productivity_score",
        "recommendation",
    )

    return coding_sessions, cognitive_metrics


def load_to_clickhouse(coding_sessions: pl.DataFrame, cognitive_metrics: pl.DataFrame, reset: bool) -> None:
    client = get_clickhouse_client()

    if reset:
        print("Clearing existing rows from coding_sessions and cognitive_metrics...")
        client.execute("TRUNCATE TABLE IF EXISTS coding_sessions")
        client.execute("TRUNCATE TABLE IF EXISTS cognitive_metrics")

    client.execute(
        """
        INSERT INTO coding_sessions
        (id, developer_id, session_date, hours_coding, coffee_intake_mg,
         distractions, sleep_hours, commits, bugs_reported, ai_usage_hours,
         context_switch_rate, flow_state)
        VALUES
        """,
        coding_sessions.rows(),
    )

    client.execute(
        """
        INSERT INTO cognitive_metrics
        (id, session_id, cognitive_load, cognitive_load_level, task_success,
         productivity_score, recommendation)
        VALUES
        """,
        cognitive_metrics.rows(),
    )

    print(f"Loaded {coding_sessions.height} coding sessions and {cognitive_metrics.height} cognitive metric rows.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Import the AI dev productivity CSV into ClickHouse")
    parser.add_argument("--csv", type=Path, default=DEFAULT_CSV_PATH, help="Path to the source CSV file")
    parser.add_argument(
        "--start-date",
        type=str,
        default="2025-01-01",
        help="Synthetic start date (YYYY-MM-DD) assigned to the first session",
    )
    parser.add_argument("--reset", action="store_true", help="Truncate tables before loading")
    args = parser.parse_args()

    if not args.csv.exists():
        print(f"CSV file not found: {args.csv}", file=sys.stderr)
        sys.exit(1)

    start_date = date.fromisoformat(args.start_date)

    print(f"Reading {args.csv} ...")
    coding_sessions, cognitive_metrics = transform(args.csv, start_date)
    print(f"Transformed {coding_sessions.height} rows with Polars.")

    load_to_clickhouse(coding_sessions, cognitive_metrics, reset=args.reset)


if __name__ == "__main__":
    main()
