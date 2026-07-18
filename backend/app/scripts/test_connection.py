"""
Quick sanity check that the backend can reach ClickHouse with the
currently configured environment variables.

Usage: python -m app.scripts.test_connection
"""
import sys

from app.database.clickhouse import get_clickhouse_client


def main() -> None:
    try:
        client = get_clickhouse_client()
        result = client.execute("SELECT 1")
        print(f"Connected to ClickHouse successfully. Test query result: {result}")
    except Exception as exc:
        print(f"Could not connect to ClickHouse: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
