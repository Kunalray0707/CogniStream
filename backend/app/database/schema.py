"""
DDL statements for CogniStream's ClickHouse tables.

Kept in one place so create_tables.py (schema setup) and any future
migration script both reference the same definitions.
"""

CREATE_DEVELOPERS_TABLE = """
CREATE TABLE IF NOT EXISTS developers
(
    id UInt32,
    name String,
    email String,
    role String,
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
ORDER BY id
"""

# One row per coding session. The source dataset (ai_dev_productivity.csv)
# has one record per day/session for a single developer, so developer_id
# defaults to 1. context_switch_rate and flow_state are derived columns
# computed by the Polars ingestion pipeline (see scripts/import_csv.py).
CREATE_CODING_SESSIONS_TABLE = """
CREATE TABLE IF NOT EXISTS coding_sessions
(
    id UInt32,
    developer_id UInt32,
    session_date Date,
    hours_coding Float32,
    coffee_intake_mg UInt32,
    distractions UInt32,
    sleep_hours Float32,
    commits UInt32,
    bugs_reported UInt32,
    ai_usage_hours Float32,
    context_switch_rate Float32,
    flow_state UInt8
)
ENGINE = MergeTree()
ORDER BY id
"""

# One row per session, holding the cognitive-load side of the analysis.
CREATE_COGNITIVE_METRICS_TABLE = """
CREATE TABLE IF NOT EXISTS cognitive_metrics
(
    id UInt32,
    session_id UInt32,
    cognitive_load Float32,
    cognitive_load_level String,
    task_success UInt8,
    productivity_score Float32,
    recommendation String
)
ENGINE = MergeTree()
ORDER BY id
"""

ALL_TABLES = [
    ("developers", CREATE_DEVELOPERS_TABLE),
    ("coding_sessions", CREATE_CODING_SESSIONS_TABLE),
    ("cognitive_metrics", CREATE_COGNITIVE_METRICS_TABLE),
]
