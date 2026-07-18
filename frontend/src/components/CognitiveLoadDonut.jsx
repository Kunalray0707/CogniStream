import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = { Low: "#2DD4BF", Medium: "#F5B940", High: "#FB7185" };

function CognitiveLoadDonut({ data }) {
  const total = data.reduce((sum, d) => sum + d.session_count, 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-2">
        <h3 className="font-semibold text-ink">Cognitive Load Mix</h3>
        <p className="text-xs text-muted">Share of sessions by load level</p>
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="session_count"
              nameKey="level"
              innerRadius={62}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.level} fill={COLORS[entry.level] || "#8891A5"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#181C2A",
                border: "1px solid #232A3B",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-ink">{total}</span>
          <span className="text-[10px] uppercase tracking-wide text-muted">sessions</span>
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-4">
        {data.map((d) => (
          <span key={d.level} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: COLORS[d.level] || "#8891A5" }}
            />
            {d.level}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CognitiveLoadDonut;
