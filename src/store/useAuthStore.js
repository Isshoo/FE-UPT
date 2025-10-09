/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.login(credentials);
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Login gagal';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authAPI.register(userData);
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || 'Registrasi gagal';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Get current user
      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const data = await authAPI.getCurrentUser();
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);