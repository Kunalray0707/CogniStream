"""
ClickHouse connection helper.

Provides a single get_clickhouse_client() factory used by both the
FastAPI routers (as a dependency) and the standalone scripts
(create_tables.py / import_csv.py) that seed the database.
"""
from clickhouse_driver import Client
from clickhouse_driver.errors import Error as ClickHouseError

from app.config.settings import settings


def get_clickhouse_client() -> Client:
    """Create a new ClickHouse client connected to the configured database."""
    return Client(
        host=settings.CLICKHOUSE_HOST,
        port=settings.CLICKHOUSE_PORT,
        user=settings.CLICKHOUSE_USER,
        password=settings.CLICKHOUSE_PASSWORD,
        database=settings.CLICKHOUSE_DB,
        connect_timeout=5,
    )


def get_db():
    """
    FastAPI dependency. Yields a ClickHouse client for a single request
    and raises a clean error if the database is unreachable, instead of
    letting the connection exception bubble up as an unhandled 500.
    """
    from fastapi import HTTPException

    try:
        client = get_clickhouse_client()
        # Cheap round-trip to fail fast if ClickHouse is down.
        client.execute("SELECT 1")
    except ClickHouseError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Database unavailable: {exc}",
        ) from exc
    except Exception as exc:  # connection refused, DNS failure, etc.
        raise HTTPException(
            status_code=503,
            detail=f"Could not connect to ClickHouse: {exc}",
        ) from exc

    try:
        yield client
    finally:
        client.disconnect()
