function FlowStateCard({ data }) {
  const flow = data.find((d) => d.flow_state) || { session_count: 0, avg_productivity_score: 0, avg_commits: 0 };
  const broken = data.find((d) => !d.flow_state) || { session_count: 0, avg_productivity_score: 0, avg_commits: 0 };
  const maxScore = Math.max(flow.avg_productivity_score, broken.avg_productivity_score, 1);

  const rows = [
    { label: "In flow state", ...flow, color: "bg-flow", text: "text-flow" },
    { label: "Flow interrupted", ...broken, color: "bg-interrupt", text: "text-interrupt" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-semibold text-ink">Flow State Impact</h3>
        <p className="text-xs text-muted">
          Deep flow = 3+ focused hours with 2 or fewer interruptions
        </p>
      </div>
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className={`text-sm font-medium ${row.text}`}>{row.label}</span>
              <span className="font-mono text-xs text-muted">
                {row.session_count} sessions · {row.avg_commits} commits/session
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${(row.avg_productivity_score / maxScore) * 100}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-xs text-muted">
              avg productivity {row.avg_productivity_score}/100
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlowStateCard;
