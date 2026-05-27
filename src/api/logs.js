import api from './axios';

export const getLogs = async (params) => {
  const response = await api.get('/logs/', { params });
  return response.data;
};
