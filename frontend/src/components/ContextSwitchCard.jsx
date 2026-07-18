import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

function ContextSwitchCard({ data }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4">
        <h3 className="font-semibold text-ink">The Context-Switching Tax</h3>
        <p className="text-xs text-muted">Cognitive load by interruption count per session</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#232A3B" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="distraction_bucket"
            tick={{ fill: "#8891A5", fontSize: 11 }}
            axisLine={{ stroke: "#232A3B" }}
            tickLine={false}
            label={{
              value: "interruptions per session",
              position: "insideBottom",
              offset: -2,
              fill: "#8891A5",
              fontSize: 10,
            }}
          />
          <YAxis
            tick={{ fill: "#8891A5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "#181C2A",
              border: "1px solid #232A3B",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#E4E7ED" }}
            formatter={(value, name) => [value, name === "avg_cognitive_load" ? "Avg cognitive load" : name]}
          />
          <Bar dataKey="avg_cognitive_load" name="avg_cognitive_load" fill="#FB7185" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ContextSwitchCard;
