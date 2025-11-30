import apiClient from '../../config/apiClient';

export const usersAPI = {
  getUsersGuest: async (params) => {
    const response = await apiClient.get('/users/guest', { params });
    return response.data;
  },
  getUsers: async (params) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  resetPassword: async (id, newPassword) => {
    const response = await apiClient.post(`/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/users/statistics');
    return response.data;
  },
};
