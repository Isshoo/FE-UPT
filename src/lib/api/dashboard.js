import apiClient from '../../config/apiClient';

export const dashboardAPI = {
  // Get general statistics
  getGeneralStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  // Get marketplace analytics
  getMarketplaceAnalytics: async () => {
    const response = await apiClient.get('/dashboard/marketplace-analytics');
    return response.data;
  },

  // Get UMKM analytics
  getUmkmAnalytics: async () => {
    const response = await apiClient.get('/dashboard/umkm-analytics');
    return response.data;
  },

  // Get growth analytics
  getGrowthAnalytics: async () => {
    const response = await apiClient.get('/dashboard/growth-analytics');
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async () => {
    const response = await apiClient.get('/dashboard/recent-activities');
    return response.data;
  },

  // Get full dashboard data
  getFullDashboard: async () => {
    const response = await apiClient.get('/dashboard/full');
    return response.data;
  },
};
