export function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-ink">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-flow" />
      <p className="font-mono text-sm text-muted">Reading the event logs…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
      <div className="rounded-full border border-interrupt/40 bg-interrupt/10 p-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-interrupt">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-2.96L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-ink">Dashboard couldn't load</p>
        <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="rounded-lg border border-flow/40 bg-flow/10 px-4 py-2 text-sm font-medium text-flow transition hover:bg-flow/20"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <p className="font-mono text-sm text-muted">No session data yet</p>
      <p className="max-w-sm text-xs text-muted">
        Run the ingestion pipeline to load coding sessions into ClickHouse:{" "}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 text-flow">
          python -m app.scripts.import_csv
        </code>
      </p>
    </div>
  );
}
