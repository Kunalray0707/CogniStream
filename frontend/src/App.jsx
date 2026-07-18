import { useDashboardData } from "./hooks/useDashboardData";
import FlowPulse from "./components/FlowPulse";
import StatCard from "./components/StatCard";
import TrendCard from "./components/TrendCard";
import ContextSwitchCard from "./components/ContextSwitchCard";
import FlowStateCard from "./components/FlowStateCard";
import CognitiveLoadDonut from "./components/CognitiveLoadDonut";
import SessionsTable from "./components/SessionsTable";
import { LoadingState, ErrorState, EmptyState } from "./components/StatusStates";

function App() {
  const {
    summary,
    trend,
    contextSwitching,
    loadDistribution,
    flowState,
    sessions,
    status,
    error,
    reload,
  } = useDashboardData();

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error} onRetry={reload} />;

  const hasData = summary && summary.total_sessions > 0;

  return (
    <div className="min-h-screen bg-bg pb-16 text-ink">
      <header className="border-b border-border bg-surface/60">
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-flow">
                CogniStream
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-ink">
                Developer Flow-State &amp; Cognitive Load Analytics
              </h1>
              <p className="mt-1 text-sm text-muted">
                What actually blocks deep work — not just what shipped.
              </p>
            </div>
            <span className="hidden items-center gap-2 rounded-full border border-flow/30 bg-flow/10 px-3 py-1.5 text-xs text-flow sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flow" />
              Live from ClickHouse
            </span>
          </div>
        </div>
        <FlowPulse />
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {!hasData ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <>
            <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total sessions"
                value={summary.total_sessions}
                accent="neutral"
                hint="all-time logged"
              />
              <StatCard
                label="Avg cognitive load"
                value={summary.average_cognitive_load}
                unit="/ 10"
                accent="warn"
                hint={summary.average_cognitive_load > 7 ? "Trending high" : "Within range"}
              />
              <StatCard
                label="Task success rate"
                value={summary.success_rate}
                unit="%"
                accent="flow"
                hint="tasks completed"
              />
              <StatCard
                label="Flow state rate"
                value={summary.flow_state_rate}
                unit="%"
                accent={summary.flow_state_rate < 40 ? "interrupt" : "flow"}
                hint={`${summary.avg_context_switch_rate} switches/hr avg`}
              />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TrendCard data={trend} />
              </div>
              <CognitiveLoadDonut data={loadDistribution} />
            </section>

            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ContextSwitchCard data={contextSwitching} />
              <FlowStateCard data={flowState} />
            </section>

            <section className="mt-6">
              <SessionsTable sessions={sessions} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
