import apiClient from './client';

export const usersAPI = {
  list: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      sortBy = 'createdAt',
      order = 'desc',
    } = params;

    const response = await apiClient.get('/users', {
      params: {
        page,
        limit,
        search: search || undefined,
        role: role || undefined,
        sortBy,
        order,
      },
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await apiClient.post('/users', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await apiClient.put(`/users/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};