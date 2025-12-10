import apiClient from '../../config/apiClient';

export const exportAPI = {
  // Export users
  exportUsers: async (format = 'excel') => {
    const response = await apiClient.get('/export/users', {
      params: { format },
      responseType: 'blob',
    });
    return response;
  },

  // Export UMKM
  exportUmkm: async (format = 'excel') => {
    const response = await apiClient.get('/export/umkm', {
      params: { format },
      responseType: 'blob',
    });
    return response;
  },

  // Export event
  exportEvent: async (eventId, format = 'excel') => {
    const response = await apiClient.get(`/export/event/${eventId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response;
  },

  // Export assessment
  exportAssessment: async (kategoriId, format = 'excel') => {
    const response = await apiClient.get(`/export/assessment/${kategoriId}`, {
      params: { format },
      responseType: 'blob',
    });
    return response;
  },
  // Export marketplace events
  exportMarketplace: async (filters = {}, format = 'excel') => {
    const response = await apiClient.get('/export/marketplace', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response;
  },
  // Export marketplace detailed
  exportMarketplaceDetailed: async (filters = {}, format = 'excel') => {
    const response = await apiClient.get('/export/marketplace/detailed', {
      params: { ...filters, format },
      responseType: 'blob',
    });
    return response;
  },
};

// Helper function to download blob
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
