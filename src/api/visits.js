import api from './axios';

export const getVisits = async (params) => {
  const response = await api.get('/visits/', { params });
  return response.data;
};

export const getVisitById = async (id) => {
  const response = await api.get(`/visits/${id}/`);
  return response.data;
};

export const startVisit = async (id) => {
  const response = await api.post(`/visits/${id}/start/`);
  return response.data;
};

export const updateVisitNotes = async (id, notes, outcome) => {
  const response = await api.patch(`/visits/${id}/notes/`, { notes, outcome });
  return response.data;
};

export const completeVisit = async (id) => {
  const response = await api.post(`/visits/${id}/complete/`);
  return response.data;
};
