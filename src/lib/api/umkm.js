import apiClient from '../../config/apiClient';

export const umkmAPI = {
  // UMKM CRUD
  getUmkms: async (params) => {
    const response = await apiClient.get('/umkm', { params });
    return response.data;
  },

  getMyUmkms: async (params) => {
    const response = await apiClient.get('/umkm/my/list', { params });
    return response.data;
  },

  getUmkmById: async (id) => {
    const response = await apiClient.get(`/umkm/${id}`);
    return response.data;
  },

  createUmkm: async (data) => {
    const response = await apiClient.post('/umkm', data);
    return response.data;
  },

  updateUmkm: async (id, data) => {
    const response = await apiClient.put(`/umkm/${id}`, data);
    return response.data;
  },

  deleteUmkm: async (id) => {
    const response = await apiClient.delete(`/umkm/${id}`);
    return response.data;
  },

  // Stage Management
  uploadStageFiles: async (umkmId, tahap, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post(
      `/umkm/${umkmId}/stages/${tahap}/files`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  requestValidation: async (umkmId, tahap) => {
    const response = await apiClient.post(
      `/umkm/${umkmId}/stages/${tahap}/validate-request`
    );
    return response.data;
  },

  validateStage: async (umkmId, tahap, isApproved, catatan = null) => {
    const response = await apiClient.post(
      `/umkm/${umkmId}/stages/${tahap}/validate`,
      { isApproved, catatan }
    );
    return response.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await apiClient.get('/umkm/statistics/overview');
    return response.data;
  },
};
