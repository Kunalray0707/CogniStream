import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function TrendCard({ data }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-ink">Cognitive Load vs. Productivity</h3>
          <p className="text-xs text-muted">Daily average, most recent {data.length} sessions</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-2 w-2 rounded-full bg-warn" /> Cognitive load
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-2 w-2 rounded-full bg-flow" /> Productivity
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#232A3B" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="session_date"
            tick={{ fill: "#8891A5", fontSize: 11 }}
            axisLine={{ stroke: "#232A3B" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            yAxisId="load"
            tick={{ fill: "#8891A5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
            domain={[0, 10]}
          />
          <YAxis
            yAxisId="score"
            orientation="right"
            tick={{ fill: "#8891A5", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              background: "#181C2A",
              border: "1px solid #232A3B",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#E4E7ED" }}
          />
          <Line
            yAxisId="load"
            type="monotone"
            dataKey="avg_cognitive_load"
            name="Cognitive load"
            stroke="#F5B940"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="score"
            type="monotone"
            dataKey="avg_productivity_score"
            name="Productivity score"
            stroke="#2DD4BF"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendCard;
