import apiClient from './client';

export const marketplaceAPI = {
  // Events
  listEvents: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      semester = '',
      tahunAjaran = '',
      orderBy = 'createdAt',
      order = 'desc',
    } = params;

    const response = await apiClient.get('/marketplace/events', {
      params: {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        semester: semester || undefined,
        tahunAjaran: tahunAjaran || undefined,
        orderBy,
        order,
      },
    });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await apiClient.get(`/marketplace/events/${id}`);
    return response.data;
  },

  createEvent: async (payload) => {
    const response = await apiClient.post('/marketplace/events', payload);
    return response.data;
  },

  updateEvent: async (id, payload) => {
    const response = await apiClient.put(`/marketplace/events/${id}`, payload);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/marketplace/events/${id}`);
    return response.data;
  },

  lockEvent: async (id) => {
    const response = await apiClient.post(`/marketplace/events/${id}/lock`);
    return response.data;
  },

  unlockEvent: async (id) => {
    const response = await apiClient.post(`/marketplace/events/${id}/unlock`);
    return response.data;
  },

  uploadLayout: async (id, file) => {
    const formData = new FormData();
    formData.append('layout', file);
    
    const response = await apiClient.post(`/marketplace/events/${id}/layout`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Sponsors
  listSponsors: async (eventId) => {
    const response = await apiClient.get(`/marketplace/events/${eventId}/sponsors`);
    return response.data;
  },

  createSponsor: async (eventId, payload) => {
    const response = await apiClient.post(`/marketplace/events/${eventId}/sponsors`, payload);
    return response.data;
  },

  updateSponsor: async (id, payload) => {
    const response = await apiClient.put(`/marketplace/sponsors/${id}`, payload);
    return response.data;
  },

  deleteSponsor: async (id) => {
    const response = await apiClient.delete(`/marketplace/sponsors/${id}`);
    return response.data;
  },

  // Assessment Categories
  listKategori: async (eventId) => {
    const response = await apiClient.get(`/marketplace/events/${eventId}/kategori`);
    return response.data;
  },

  createKategori: async (eventId, payload) => {
    const response = await apiClient.post(`/marketplace/events/${eventId}/kategori`, payload);
    return response.data;
  },

  updateKategori: async (id, payload) => {
    const response = await apiClient.put(`/marketplace/kategori/${id}`, payload);
    return response.data;
  },

  deleteKategori: async (id) => {
    const response = await apiClient.delete(`/marketplace/kategori/${id}`);
    return response.data;
  },

  assignPenilai: async (kategoriId, dosenIds) => {
    const response = await apiClient.post(`/marketplace/kategori/${kategoriId}/assign-penilai`, {
      dosenIds,
    });
    return response.data;
  },

  // Assessment Criteria
  listKriteria: async (kategoriId) => {
    const response = await apiClient.get(`/marketplace/kategori/${kategoriId}/kriteria`);
    return response.data;
  },

  createKriteria: async (kategoriId, payload) => {
    const response = await apiClient.post(`/marketplace/kategori/${kategoriId}/kriteria`, payload);
    return response.data;
  },

  updateKriteria: async (id, payload) => {
    const response = await apiClient.put(`/marketplace/kriteria/${id}`, payload);
    return response.data;
  },

  deleteKriteria: async (id) => {
    const response = await apiClient.delete(`/marketplace/kriteria/${id}`);
    return response.data;
  },

  validateBobot: async (kategoriId) => {
    const response = await apiClient.get(`/marketplace/kategori/${kategoriId}/validate-bobot`);
    return response.data;
  },

  setPemenang: async (kategoriId, usahaId) => {
    const response = await apiClient.post(`/marketplace/kategori/${kategoriId}/set-pemenang`, {
      usahaId,
    });
    return response.data;
  },
};