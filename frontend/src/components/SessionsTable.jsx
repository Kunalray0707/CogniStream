import { useState } from "react";

const LEVEL_STYLES = {
  Low: "text-flow bg-flow/10 border-flow/30",
  Medium: "text-warn bg-warn/10 border-warn/30",
  High: "text-interrupt bg-interrupt/10 border-interrupt/30",
};

function SessionsTable({ sessions }) {
  const [filter, setFilter] = useState("All");

  const filteredSessions = sessions.filter((s) => {
    if (filter === "All") return true;
    return s.cognitive_load_level === filter;
  });

  const handleExport = () => {
    const headers = "ID,Date,Hours Coding,Distractions,Commits,Cognitive Load,Load Level,Productivity Score,Flow State,Recommendation\n";
    const rows = filteredSessions.map(
      (s) =>
        `${s.id},"${s.session_date}",${s.hours_coding},${s.distractions},${s.commits},${s.cognitive_load},"${s.cognitive_load_level}",${s.productivity_score},${s.flow_state},"${s.recommendation}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CogniStream_Sessions_${filter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-ink">Recent Coding Sessions</h3>
          <p className="text-xs text-muted">
            Showing {filteredSessions.length} of {sessions.length} logged sessions
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1 text-xs">
            {["All", "Low", "Medium", "High"].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${
                  filter === level
                    ? "bg-bg text-ink shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="rounded-lg border border-flow/30 bg-flow/10 px-3 py-1.5 text-xs font-medium text-flow transition hover:bg-flow/20"
          >
            Export CSV
          </button>
        </div>
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
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-muted">
                  No sessions match the "{filter}" load filter.
                </td>
              </tr>
            ) : (
              filteredSessions.map((s) => (
                <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/40">
                  <td className="py-2.5 text-ink">{s.session_date}</td>
                  <td className="py-2.5 text-muted">{s.hours_coding.toFixed(1)}h</td>
                  <td className="py-2.5 text-muted">{s.distractions}</td>
                  <td className="py-2.5 text-muted">{s.commits}</td>
                  <td className="py-2.5">
                    <span
                      title={s.recommendation}
                      className={`cursor-help rounded-full border px-2 py-0.5 text-xs ${LEVEL_STYLES[s.cognitive_load_level]}`}
                    >
                      {s.cognitive_load.toFixed(1)} · {s.cognitive_load_level}
                    </span>
                  </td>
                  <td className="py-2.5">
                    {s.flow_state ? (
                      <span className="text-flow" title="Deep Flow State">●</span>
                    ) : (
                      <span className="text-muted/40" title="Interrupted">○</span>
                    )}
                  </td>
                  <td className="py-2.5 text-ink">{s.productivity_score.toFixed(0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionsTable;
