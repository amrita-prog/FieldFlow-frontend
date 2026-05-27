import api from './axios';

// ── List Users (Paginated & Filtered) ──
// GET /users/
export const getUsers = async (params = {}) => {
  // params: { role, is_active, page }
  const response = await api.get('/users/', { params });
  return response.data;
};

// ── Get Single User ──
// GET /users/{id}/
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}/`);
  return response.data;
};

// ── Create User ──
// POST /users/
export const createUser = async (data) => {
  // data: { username, email, password, first_name, last_name, role_id, region_id?, team_id? }
  const response = await api.post('/users/', data);
  return response.data;
};

// ── Update User ──
// PATCH /users/{id}/
export const updateUser = async (id, data) => {
  // data: { first_name, last_name, is_active, role_id, region_id, team_id }
  const response = await api.patch(`/users/${id}/`, data);
  return response.data;
};

// ── Deactivate User (Soft Delete) ──
// DELETE /users/{id}/
export const deactivateUser = async (id) => {
  const response = await api.delete(`/users/${id}/`);
  return response.data;
};
