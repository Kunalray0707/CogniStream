const ACCENTS = {
  flow: "text-flow border-flow/30 bg-flow/5",
  interrupt: "text-interrupt border-interrupt/30 bg-interrupt/5",
  warn: "text-warn border-warn/30 bg-warn/5",
  neutral: "text-ink border-border bg-surface-2/50",
};

function StatCard({ label, value, unit, hint, accent = "neutral" }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold text-ink tabular-nums">{value}</span>
        {unit && <span className="font-mono text-sm text-muted">{unit}</span>}
      </p>
      {hint && (
        <p className={`mt-3 inline-flex rounded-md border px-2 py-1 text-xs ${ACCENTS[accent]}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export default StatCard;
