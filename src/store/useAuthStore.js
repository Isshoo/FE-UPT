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
      isInitialized: false,
      error: null,

      initialize: async () => {
        // Check if already initialized
        if (get().isInitialized) {
          return;
        }

        const { token } = get();
        if (!token) {
          set({ isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // Token invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          return { success: true, user };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login gagal';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
          return { success: true, user };
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
          // Call API to invalidate token on server
          const { token } = get();
          if (token) {
            try {
              await authAPI.logout();
            } catch (error) {
              // Even if API call fails, still logout locally
              console.error('Logout API error:', error);
            }
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear auth state (Zustand persist will handle localStorage)
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: false,
            error: null,
          });
        }
      },

      // Get current user
      getCurrentUser: async () => {
        const { token } = get();

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear auth state (for 401 handler)
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: false,
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
