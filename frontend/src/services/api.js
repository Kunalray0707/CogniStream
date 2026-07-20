import axios from "axios";

// VITE_API_URL lets the Docker/production build point at a different
// host than the local dev default without touching code.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Normalizes Axios/network errors into a single shape the UI can render,
// distinguishing "backend unreachable" from "backend returned an error".
function normalizeError(error) {
  if (error.response) {
    const detail = error.response.data?.detail || error.response.statusText;
    return new Error(detail || `Request failed with status ${error.response.status}`);
  }
  if (error.request) {
    return new Error(
      `Could not reach the CogniStream API at ${API_URL}. Is the backend running?`
    );
  }
  return new Error(error.message || "Unexpected error while calling the API.");
}

async function get(path, params) {
  try {
    const response = await client.get(path, { params });
    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export function getDashboardSummary() {
  return get("/analytics/dashboard");
}

export function getTrend(limit = 30) {
  return get("/analytics/trend", { limit });
}

export function getContextSwitching() {
  return get("/analytics/context-switching");
}

export function getCognitiveLoadDistribution() {
  return get("/analytics/cognitive-load-distribution");
}

export function getFlowState() {
  return get("/analytics/flow-state");
}

export function getSessions(limit = 10, offset = 0, loadLevel = null, flowOnly = null) {
  const params = { limit, offset };
  if (loadLevel) params.load_level = loadLevel;
  if (flowOnly !== null) params.flow_only = flowOnly;
  return get("/analytics/sessions", params);
}

export { API_URL };
