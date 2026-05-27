import api from './axios';

// ── Dashboard Summary ──
// GET /reports/dashboard-summary/
export const getDashboardSummary = async () => {
  const response = await api.get('/reports/dashboard-summary/');
  return response.data;
};

// ── Pending Tasks Report ──
// GET /reports/pending-tasks/
export const getPendingTasksReport = async (params = {}) => {
  const response = await api.get('/reports/pending-tasks/', { params });
  return response.data;
};

// ── Agent Performance Report ──
// GET /reports/agent-performance/
export const getAgentPerformanceReport = async (params = {}) => {
  const response = await api.get('/reports/agent-performance/', { params });
  return response.data;
};

// ── Recent Visits Report ──
// GET /reports/recent-visits/
export const getRecentVisitsReport = async (params = {}) => {
  // params: { days }
  const response = await api.get('/reports/recent-visits/', { params });
  return response.data;
};

// ── Task Distribution Report ──
// GET /reports/task-distribution/
export const getTaskDistributionReport = async (params = {}) => {
  const response = await api.get('/reports/task-distribution/', { params });
  return response.data;
};
