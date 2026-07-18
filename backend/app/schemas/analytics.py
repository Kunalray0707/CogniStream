"""Pydantic response models for the /analytics endpoints."""
from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_sessions: int
    average_cognitive_load: float
    success_rate: float
    total_commits: int
    flow_state_rate: float
    avg_context_switch_rate: float


class TrendPoint(BaseModel):
    session_date: str
    avg_cognitive_load: float
    avg_productivity_score: float
    total_commits: int


class ContextSwitchBucket(BaseModel):
    distraction_bucket: str
    session_count: int
    avg_cognitive_load: float
    avg_productivity_score: float


class CognitiveLoadDistribution(BaseModel):
    level: str
    session_count: int


class FlowStateSummary(BaseModel):
    flow_state: bool
    session_count: int
    avg_productivity_score: float
    avg_commits: float


class SessionRecord(BaseModel):
    id: int
    session_date: str
    hours_coding: float
    distractions: int
    commits: int
    cognitive_load: float
    cognitive_load_level: str
    productivity_score: float
    flow_state: bool
    recommendation: str
