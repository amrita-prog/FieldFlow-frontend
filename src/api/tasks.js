import api from './axios';

export const getTasks = async (params) => {
  const response = await api.get('/tasks/', { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}/`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks/', taskData);
  return response.data;
};

export const assignTask = async (id, userId) => {
  const response = await api.post(`/tasks/${id}/assign/`, { user_id: userId });
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status/`, { status });
  return response.data;
};
