"""
Creates (or resets) all CogniStream tables in ClickHouse.

Usage (from the backend/ directory, with the venv active and
CLICKHOUSE_HOST etc. set or a .env file present):

    python -m app.scripts.create_tables
    python -m app.scripts.create_tables --reset   # drop tables first
"""
import argparse
import sys

from app.database.clickhouse import get_clickhouse_client
from app.database.schema import ALL_TABLES


def create_tables(reset: bool = False) -> None:
    client = get_clickhouse_client()

    if reset:
        for table_name, _ in reversed(ALL_TABLES):
            print(f"Dropping table '{table_name}' (if exists)...")
            client.execute(f"DROP TABLE IF EXISTS {table_name}")

    for table_name, ddl in ALL_TABLES:
        print(f"Creating table '{table_name}' (if not exists)...")
        client.execute(ddl)

    print("All CogniStream tables are ready.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create CogniStream ClickHouse tables")
    parser.add_argument("--reset", action="store_true", help="Drop tables before creating them")
    args = parser.parse_args()

    try:
        create_tables(reset=args.reset)
    except Exception as exc:
        print(f"Failed to create tables: {exc}", file=sys.stderr)
        sys.exit(1)
