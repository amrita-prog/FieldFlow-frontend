import api from './axios';

// ── List Activity Logs (Paginated & Filtered) ──
// GET /logs/
export const getLogs = async (params = {}) => {
  // params: { action, actor_id, target_type, from, to, page }
  const response = await api.get('/logs/', { params });
  return response.data;
};

// ── Get Single Log ──
// GET /logs/{id}/
export const getLogById = async (id) => {
  const response = await api.get(`/logs/${id}/`);
  return response.data;
};
