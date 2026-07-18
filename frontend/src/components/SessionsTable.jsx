const LEVEL_STYLES = {
  Low: "text-flow bg-flow/10 border-flow/30",
  Medium: "text-warn bg-warn/10 border-warn/30",
  High: "text-interrupt bg-interrupt/10 border-interrupt/30",
};

function SessionsTable({ sessions }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-semibold text-ink">Recent Sessions</h3>
        <p className="text-xs text-muted">Most recent {sessions.length} logged sessions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Hours coding</th>
              <th className="pb-2 font-medium">Interruptions</th>
              <th className="pb-2 font-medium">Commits</th>
              <th className="pb-2 font-medium">Cognitive load</th>
              <th className="pb-2 font-medium">Flow</th>
              <th className="pb-2 font-medium">Productivity</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 text-ink">{s.session_date}</td>
                <td className="py-2.5 text-muted">{s.hours_coding.toFixed(1)}h</td>
                <td className="py-2.5 text-muted">{s.distractions}</td>
                <td className="py-2.5 text-muted">{s.commits}</td>
                <td className="py-2.5">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${LEVEL_STYLES[s.cognitive_load_level]}`}
                  >
                    {s.cognitive_load.toFixed(1)} · {s.cognitive_load_level}
                  </span>
                </td>
                <td className="py-2.5">
                  {s.flow_state ? (
                    <span className="text-flow">●</span>
                  ) : (
                    <span className="text-muted/40">○</span>
                  )}
                </td>
                <td className="py-2.5 text-ink">{s.productivity_score.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionsTable;
