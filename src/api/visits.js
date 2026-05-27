import api from './axios';

// ── List Visits (Paginated & Filtered) ──
// GET /visits/
export const getVisits = async (params = {}) => {
  // params: { status, outcome, agent, ordering, page }
  const response = await api.get('/visits/', { params });
  return response.data;
};

// ── Get Single Visit Detail ──
// GET /visits/{id}/
export const getVisitById = async (id) => {
  const response = await api.get(`/visits/${id}/`);
  return response.data;
};

// ── Create Visit ──
// POST /visits/
export const createVisit = async (data) => {
  // data: { location, task_id?, agent_id? }
  const response = await api.post('/visits/', data);
  return response.data;
};

// ── Start Visit ──
// POST /visits/{id}/start/
export const startVisit = async (id) => {
  const response = await api.post(`/visits/${id}/start/`, {});
  return response.data;
};

// ── Add/Update Notes (Triggers AI Analysis) ──
// PATCH /visits/{id}/notes/
export const updateVisitNotes = async (id, data) => {
  // data: { notes, outcome? }
  const response = await api.patch(`/visits/${id}/notes/`, data);
  return response.data;
};

// ── Complete Visit ──
// POST /visits/{id}/complete/
export const completeVisit = async (id, outcome) => {
  // outcome: "successful" | "failed" | "partial"
  const response = await api.post(`/visits/${id}/complete/`, { outcome });
  return response.data;
};

// ── Get AI Output directly (optional, included in detail anyway) ──
// GET /visits/{id}/ai-output/
export const getAiOutput = async (id) => {
  const response = await api.get(`/visits/${id}/ai-output/`);
  return response.data;
};
