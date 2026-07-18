from typing import List

from fastapi import APIRouter, Depends, Query
from clickhouse_driver import Client

from app.database.clickhouse import get_db
from app.services import analytics_service
from app.schemas.analytics import (
    DashboardSummary,
    TrendPoint,
    ContextSwitchBucket,
    CognitiveLoadDistribution,
    FlowStateSummary,
    SessionRecord,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=DashboardSummary)
def dashboard(client: Client = Depends(get_db)):
    """High-level KPIs shown at the top of the dashboard."""
    return analytics_service.get_dashboard_summary(client)


@router.get("/trend", response_model=List[TrendPoint])
def trend(
    limit: int = Query(30, ge=1, le=500, description="Number of most recent days to return"),
    client: Client = Depends(get_db),
):
    """Daily cognitive load / productivity / commits trend for line charts."""
    return analytics_service.get_trend(client, limit=limit)


@router.get("/context-switching", response_model=List[ContextSwitchBucket])
def context_switching(client: Client = Depends(get_db)):
    """
    The 'Context-Switching Tax': how interruption count correlates with
    cognitive load and productivity.
    """
    return analytics_service.get_context_switching(client)


@router.get("/cognitive-load-distribution", response_model=List[CognitiveLoadDistribution])
def cognitive_load_distribution(client: Client = Depends(get_db)):
    """Session counts bucketed into Low / Medium / High cognitive load."""
    return analytics_service.get_cognitive_load_distribution(client)


@router.get("/flow-state", response_model=List[FlowStateSummary])
def flow_state(client: Client = Depends(get_db)):
    """Compares sessions in vs. out of flow state on productivity and output."""
    return analytics_service.get_flow_state_summary(client)


@router.get("/sessions", response_model=List[SessionRecord])
def sessions(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    client: Client = Depends(get_db),
):
    """Paginated list of individual coding sessions, most recent first."""
    return analytics_service.get_sessions(client, limit=limit, offset=offset)
