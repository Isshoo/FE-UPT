import apiClient from '../../config/apiClient';

export const marketplaceAPI = {
  // Events
  getEvents: async (params) => {
    const response = await apiClient.get('/marketplace', { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await apiClient.get(`/marketplace/${id}`);
    return response.data;
  },

  createEvent: async (data) => {
    const response = await apiClient.post('/marketplace', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await apiClient.put(`/marketplace/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/marketplace/${id}`);
    return response.data;
  },

  lockEvent: async (id) => {
    const response = await apiClient.post(`/marketplace/${id}/lock`);
    return response.data;
  },

  unlockEvent: async (id) => {
    const response = await apiClient.post(`/marketplace/${id}/unlock`);
    return response.data;
  },

  uploadLayout: async (id, file) => {
    const formData = new FormData();
    formData.append('layout', file);
    const response = await apiClient.post(
      `/marketplace/${id}/layout`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // Businesses
  getBusinessesByEvent: async (eventId, params) => {
    const response = await apiClient.get(`/marketplace/${eventId}/businesses`, {
      params,
    });
    return response.data;
  },

  registerBusiness: async (eventId, data) => {
    const response = await apiClient.post(
      `/marketplace/${eventId}/register`,
      data
    );
    return response.data;
  },

  approveBusiness: async (businessId) => {
    const response = await apiClient.post(
      `/marketplace/businesses/${businessId}/approve`
    );
    return response.data;
  },

  assignBoothNumber: async (businessId, nomorBooth) => {
    const response = await apiClient.post(
      `/marketplace/businesses/${businessId}/booth`,
      { nomorBooth }
    );
    return response.data;
  },

  // Sponsors
  addSponsor: async (eventId, data) => {
    const response = await apiClient.post(
      `/marketplace/${eventId}/sponsors`,
      data
    );
    return response.data;
  },

  updateSponsor: async (sponsorId, data) => {
    const response = await apiClient.put(
      `/marketplace/sponsors/${sponsorId}`,
      data
    );
    return response.data;
  },

  deleteSponsor: async (sponsorId) => {
    const response = await apiClient.delete(
      `/marketplace/sponsors/${sponsorId}`
    );
    return response.data;
  },

  getMyHistory: async () => {
    const response = await apiClient.get('/marketplace/my-history');
    return response.data;
  },
};
