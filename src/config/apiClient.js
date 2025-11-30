import axios from 'axios';
import { API_URL } from '@/config/environment';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store (SSR-safe)
    if (typeof window !== 'undefined') {
      try {
        // Dynamic import to avoid circular dependency
        const { useAuthStore } = require('@/store');
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Fallback to localStorage if store not available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth state from store
      if (typeof window !== 'undefined') {
        try {
          const { useAuthStore } = require('@/store');
          useAuthStore.getState().clearAuth();
        } catch (storeError) {
          // Fallback: clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }

        // Only redirect if we're not already on auth pages
        // Use window.location for reliable redirect in interceptor
        if (!window.location.pathname.startsWith('/auth')) {
          // Store current path for redirect after login
          const returnUrl = window.location.pathname + window.location.search;
          window.location.href = `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`;
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Silakan coba lagi.';
      } else if (error.message === 'Network Error') {
        error.message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        error.message = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
      }
    }

    // Handle other HTTP errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 400:
          error.message = message || 'Request tidak valid';
          break;
        case 403:
          error.message = message || 'Akses ditolak';
          break;
        case 404:
          error.message = message || 'Data tidak ditemukan';
          break;
        case 500:
          error.message = message || 'Terjadi kesalahan server';
          break;
        case 503:
          error.message = 'Server sedang maintenance. Silakan coba lagi nanti.';
          break;
        default:
          error.message = message || 'Terjadi kesalahan';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
