function RecommendationsBanner({ recommendations }) {
  if (!recommendations) return null;

  return (
    <div className="rounded-xl border border-flow/30 bg-flow/5 p-5 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg border border-flow/40 bg-flow/10 p-2 text-flow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-ink">Cognitive Load Optimization Recommendation</h3>
              <span className="rounded-full bg-warn/20 px-2 py-0.5 text-[10px] font-medium text-warn">
                {recommendations.high_risk_percentage}% High-Load Sessions
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {recommendations.top_recommendation}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {recommendations.actionable_insights?.length > 0 && (
            <span className="font-mono text-xs text-flow">
              {recommendations.high_risk_session_count} Flagged Sessions
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendationsBanner;
