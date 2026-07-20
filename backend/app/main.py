from contextlib import asynccontextmanager
from clickhouse_driver.errors import Error as ClickHouseError

from app.config.settings import settings
from app.routers import analytics
from app.scripts.create_tables import create_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform database table check & auto-seeding on startup if ClickHouse is accessible
    try:
        create_tables(reset=False)
    except Exception as exc:
        print(f"Warning: Automatic startup database setup deferred (ClickHouse error: {exc})")
    yield


app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    lifespan=lifespan,
)

# NOTE: the original config used "https://localhost:5173" (wrong scheme)
# and was missing the Vite dev server origin, which is why the frontend
# could not call the API. CORS_ORIGINS is now driven by settings/env.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to CogniStream API",
        "status": "Running Successfully",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
