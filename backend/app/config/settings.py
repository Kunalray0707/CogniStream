"""
Centralized application configuration.

All values are read from environment variables (see .env.example).
Using a single Settings object avoids scattering os.getenv() calls
across the codebase and makes the required configuration explicit.
"""
import os
from dotenv import load_dotenv

# Load variables from a .env file if present (local development).
# In Docker, real environment variables are injected by docker-compose
# and simply override anything loaded here.
load_dotenv()


class Settings:
    # --- ClickHouse ---
    CLICKHOUSE_HOST: str = os.getenv("CLICKHOUSE_HOST", "localhost")
    CLICKHOUSE_PORT: int = int(os.getenv("CLICKHOUSE_PORT", "9000"))
    CLICKHOUSE_USER: str = os.getenv("CLICKHOUSE_USER", "admin")
    CLICKHOUSE_PASSWORD: str = os.getenv("CLICKHOUSE_PASSWORD", "admin123")
    CLICKHOUSE_DB: str = os.getenv("CLICKHOUSE_DB", "cognistream")

    # --- API ---
    API_TITLE: str = "CogniStream API"
    API_DESCRIPTION: str = "Developer Flow-State & Cognitive Load Analytics"
    API_VERSION: str = "1.0.0"

    # --- CORS ---
    # Comma-separated list of allowed origins, e.g.
    # "http://localhost:5173,http://127.0.0.1:5173"
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
