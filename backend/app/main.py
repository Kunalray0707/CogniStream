from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.routers import analytics

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
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
