import { create } from 'zustand';
import { marketplaceAPI } from '@/lib/api';

export const useMarketplaceStore = create((set, get) => ({
  // Events list state
  events: [],
  eventDetail: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    semester: '',
    tahunAjaran: '',
    status: '',
  },
  tahunAjaranOptions: [],

  // Fetch events list
  fetchEvents: async (params = {}) => {
    const { filters, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await marketplaceAPI.getEvents({
        ...filters,
        ...params,
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
      });

      // Filter out DRAFT events for non-admin users (if includeDraft is not true)
      const eventData = response.data.events || response.data;
      const publicEvents = params.includeDraft
        ? eventData
        : eventData.filter((event) => event.status !== 'DRAFT');

      // Extract unique tahun ajaran from events
      const uniqueTahunAjaran = [
        ...new Set(
          publicEvents.map((event) => event.tahunAjaran).filter(Boolean)
        ),
      ].sort((a, b) => {
        // Sort descending (newest first)
        const yearA = parseInt(a.split('/')[0]);
        const yearB = parseInt(b.split('/')[0]);
        return yearB - yearA;
      });

      set({
        events: publicEvents,
        tahunAjaranOptions: uniqueTahunAjaran,
        pagination: {
          ...pagination,
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        },
        isLoading: false,
      });

      return { success: true, data: publicEvents };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal memuat data event';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch event detail
  fetchEventDetail: async (eventId) => {
    set({ isLoading: true, error: null });

    try {
      const response = await marketplaceAPI.getEventById(eventId);
      set({
        eventDetail: response.data,
        isLoading: false,
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal memuat detail event';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Set filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  // Set pagination
  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  // Reset filters
  resetFilters: () => {
    set({
      filters: {
        search: '',
        semester: '',
        tahunAjaran: '',
        status: '',
      },
    });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      events: [],
      eventDetail: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: '',
        semester: '',
        tahunAjaran: '',
        status: '',
      },
      tahunAjaranOptions: [],
    }),
}));

