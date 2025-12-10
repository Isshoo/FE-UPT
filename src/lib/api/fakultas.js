import apiClient from '../../config/apiClient';

export const fakultasAPI = {
  // Fakultas
  getAllFakultas: async () => {
    const response = await apiClient.get('/fakultas');
    return response.data;
  },

  getFakultasById: async (id) => {
    const response = await apiClient.get(`/fakultas/${id}`);
    return response.data;
  },

  getProdiByFakultas: async (fakultasId) => {
    const response = await apiClient.get(`/fakultas/${fakultasId}/prodi`);
    return response.data;
  },

  createFakultas: async (data) => {
    const response = await apiClient.post('/fakultas', data);
    return response.data;
  },

  updateFakultas: async (id, data) => {
    const response = await apiClient.put(`/fakultas/${id}`, data);
    return response.data;
  },

  deleteFakultas: async (id) => {
    const response = await apiClient.delete(`/fakultas/${id}`);
    return response.data;
  },

  // Prodi
  getAllProdi: async (fakultasId = null) => {
    const params = fakultasId ? { fakultasId } : {};
    const response = await apiClient.get('/fakultas/prodi/all', { params });
    return response.data;
  },

  getProdiById: async (id) => {
    const response = await apiClient.get(`/fakultas/prodi/${id}`);
    return response.data;
  },

  createProdi: async (data) => {
    const response = await apiClient.post('/fakultas/prodi', data);
    return response.data;
  },

  updateProdi: async (id, data) => {
    const response = await apiClient.put(`/fakultas/prodi/${id}`, data);
    return response.data;
  },

  deleteProdi: async (id) => {
    const response = await apiClient.delete(`/fakultas/prodi/${id}`);
    return response.data;
  },
};
