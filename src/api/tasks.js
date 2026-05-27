import api from './axios';

// ── List Tasks (Paginated & Filtered) ──
// GET /tasks/
export const getTasks = async (params = {}) => {
  // params: { status, priority, assigned_to, region, team, due_date, search, ordering, page }
  const response = await api.get('/tasks/', { params });
  return response.data;
};

// ── Get Single Task Detail ──
// GET /tasks/{id}/
export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}/`);
  return response.data;
};

// ── Create Task ──
// POST /tasks/
export const createTask = async (data) => {
  const response = await api.post('/tasks/', data);
  return response.data;
};

// ── Update Task (Partial) ──
// PATCH /tasks/{id}/
export const updateTask = async (id, data) => {
  const response = await api.patch(`/tasks/${id}/`, data);
  return response.data;
};

// ── Update Task Status ──
// PATCH /tasks/{id}/status/
export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status/`, { status });
  return response.data;
};

// ── Assign Task ──
// POST /tasks/{id}/assign/
export const assignTask = async (id, assignedToId) => {
  const response = await api.post(`/tasks/${id}/assign/`, { assigned_to_id: assignedToId });
  return response.data;
};

// ── Cancel/Delete Task (Admin only) ──
// DELETE /tasks/{id}/
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}/`);
  return response.data;
};
