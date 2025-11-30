import apiClient from '../../config/apiClient';

export const assessmentAPI = {
  // Categories
  getCategoriesByEvent: async (eventId) => {
    const response = await apiClient.get(
      `/assessment/events/${eventId}/categories`
    );
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await apiClient.get(
      `/assessment/categories/${categoryId}`
    );
    return response.data;
  },

  createCategory: async (eventId, data) => {
    const response = await apiClient.post(
      `/assessment/events/${eventId}/categories`,
      data
    );
    return response.data;
  },

  updateCategory: async (categoryId, data) => {
    const response = await apiClient.put(
      `/assessment/categories/${categoryId}`,
      data
    );
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(
      `/assessment/categories/${categoryId}`
    );
    return response.data;
  },

  // Scoring
  submitScore: async (data) => {
    const response = await apiClient.post('/assessment/scores', data);
    return response.data;
  },

  getScoresByCategory: async (categoryId) => {
    const response = await apiClient.get(
      `/assessment/categories/${categoryId}/scores`
    );
    return response.data;
  },

  setWinner: async (categoryId, usahaId) => {
    const response = await apiClient.post(
      `/assessment/categories/${categoryId}/winner`,
      { usahaId }
    );
    return response.data;
  },

  // Dosen specific
  getCategoriesByDosen: async () => {
    const response = await apiClient.get('/assessment/dosen/categories');
    return response.data;
  },

  getMentoredBusinesses: async (eventId = null) => {
    const params = eventId ? { eventId } : {};
    const response = await apiClient.get('/assessment/dosen/businesses', {
      params,
    });
    return response.data;
  },

  approveMentoredBusiness: async (businessId) => {
    const response = await apiClient.post(
      `/assessment/dosen/businesses/${businessId}/approve`
    );
    return response.data;
  },
};
