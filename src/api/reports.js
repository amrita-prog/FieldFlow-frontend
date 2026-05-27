import api from './axios';

export const getDashboardSummary = async () => {
  const response = await api.get('/reports/dashboard-summary/');
  return response.data;
};

export const getPendingTasksReport = async () => {
  const response = await api.get('/reports/pending-tasks/');
  return response.data;
};

export const getAgentPerformanceReport = async () => {
  const response = await api.get('/reports/agent-performance/');
  return response.data;
};

export const getRecentVisitsReport = async () => {
  const response = await api.get('/reports/recent-visits/');
  return response.data;
};

export const getTaskDistributionReport = async () => {
  const response = await api.get('/reports/task-distribution/');
  return response.data;
};
