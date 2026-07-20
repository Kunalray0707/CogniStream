import { useCallback, useEffect, useState } from "react";
import {
  getDashboardSummary,
  getTrend,
  getContextSwitching,
  getCognitiveLoadDistribution,
  getFlowState,
  getSessions,
  getRecommendations,
} from "../services/api";

const initialState = {
  summary: null,
  trend: [],
  contextSwitching: [],
  loadDistribution: [],
  flowState: [],
  sessions: [],
  recommendations: null,
};

export function useDashboardData() {
  const [data, setData] = useState(initialState);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const [summary, trend, contextSwitching, loadDistribution, flowState, sessions, recommendations] =
        await Promise.all([
          getDashboardSummary(),
          getTrend(30),
          getContextSwitching(),
          getCognitiveLoadDistribution(),
          getFlowState(),
          getSessions(8, 0),
          getRecommendations().catch(() => null),
        ]);
      setData({ summary, trend, contextSwitching, loadDistribution, flowState, sessions, recommendations });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong while loading the dashboard.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Fetching data on mount is the documented exception to "don't call
    // setState synchronously in an effect" (see react.dev "You Might Not
    // Need an Effect" - data fetching section): the effect synchronizes
    // component state with an external system (the API).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { ...data, status, error, reload: load };
}
