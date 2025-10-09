 
import { create } from 'zustand';
import { marketplaceAPI } from '@/lib/api';

export const useMarketplaceStore = create((set, get) => ({
  // Events state
  events: [],
  currentEvent: null,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  search: '',
  status: '',
  semester: '',
  tahunAjaran: '',
  orderBy: 'createdAt',
  order: 'desc',
  loading: false,
  error: null,

  // Sponsors state
  sponsors: [],

  // Assessment state
  kategori: [],
  kriteria: [],

  // Event actions
  setEventParams: (params) => {
    const allowed = ['page', 'limit', 'search', 'status', 'semester', 'tahunAjaran', 'orderBy', 'order'];
    const next = {};
    allowed.forEach((k) => {
      if (params[k] !== undefined) next[k] = params[k];
    });
    set(next);
  },

  resetEventParams: () => {
    set({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      semester: '',
      tahunAjaran: '',
      orderBy: 'createdAt',
      order: 'desc',
    });
  },

  fetchEvents: async () => {
    const { page, limit, search, status, semester, tahunAjaran, orderBy, order } = get();
    set({ loading: true, error: null });
    try {
      const res = await marketplaceAPI.listEvents({
        page,
        limit,
        search,
        status,
        semester,
        tahunAjaran,
        orderBy,
        order,
      });
      set({
        events: res?.data || [],
        total: res?.pagination?.total || 0,
        totalPages: res?.pagination?.totalPages || 1,
        page: res?.pagination?.page || page,
        limit: res?.pagination?.limit || limit,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat data events';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchEventById: async (id) => {
    set({ loading: true, error: null, currentEvent: null });
    try {
      const res = await marketplaceAPI.getEventById(id);
      set({ currentEvent: res?.data?.event || null, loading: false });
      return { success: true, data: res?.data?.event || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat detail event';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createEvent: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await marketplaceAPI.createEvent(payload);
      set({ loading: false });
      return { success: true, data: res?.data?.event || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuat event';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateEvent: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await marketplaceAPI.updateEvent(id, payload);
      set({ loading: false, currentEvent: res?.data?.event || null });
      return { success: true, data: res?.data?.event || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal mengupdate event';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteEvent: async (id) => {
    try {
      await marketplaceAPI.deleteEvent(id);
      await get().fetchEvents();
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menghapus event';
      return { success: false, error: message };
    }
  },

  lockEvent: async (id) => {
    try {
      await marketplaceAPI.lockEvent(id);
      await get().fetchEvents();
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal mengunci event';
      return { success: false, error: message };
    }
  },

  unlockEvent: async (id) => {
    try {
      await marketplaceAPI.unlockEvent(id);
      await get().fetchEvents();
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuka kunci event';
      return { success: false, error: message };
    }
  },

  uploadLayout: async (id, file) => {
    try {
      const res = await marketplaceAPI.uploadLayout(id, file);
      return { success: true, data: res?.data };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal upload layout';
      return { success: false, error: message };
    }
  },

  // Sponsor actions
  fetchSponsors: async (eventId) => {
    try {
      const res = await marketplaceAPI.listSponsors(eventId);
      set({ sponsors: res?.data?.sponsors || [] });
      return { success: true, data: res?.data?.sponsors || [] };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat sponsor';
      return { success: false, error: message };
    }
  },

  createSponsor: async (eventId, payload) => {
    try {
      const res = await marketplaceAPI.createSponsor(eventId, payload);
      await get().fetchSponsors(eventId);
      return { success: true, data: res?.data?.sponsor };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuat sponsor';
      return { success: false, error: message };
    }
  },

  deleteSponsor: async (id, eventId) => {
    try {
      await marketplaceAPI.deleteSponsor(id);
      await get().fetchSponsors(eventId);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menghapus sponsor';
      return { success: false, error: message };
    }
  },

  // Assessment actions
  fetchKategori: async (eventId) => {
    try {
      const res = await marketplaceAPI.listKategori(eventId);
      set({ kategori: res?.data?.kategori || [] });
      return { success: true, data: res?.data?.kategori || [] };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat kategori';
      return { success: false, error: message };
    }
  },

  createKategori: async (eventId, payload) => {
    try {
      const res = await marketplaceAPI.createKategori(eventId, payload);
      await get().fetchKategori(eventId);
      return { success: true, data: res?.data?.kategori };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuat kategori';
      return { success: false, error: message };
    }
  },

  deleteKategori: async (id, eventId) => {
    try {
      await marketplaceAPI.deleteKategori(id);
      await get().fetchKategori(eventId);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menghapus kategori';
      return { success: false, error: message };
    }
  },

  fetchKriteria: async (kategoriId) => {
    try {
      const res = await marketplaceAPI.listKriteria(kategoriId);
      set({ kriteria: res?.data?.kriteria || [] });
      return { success: true, data: res?.data?.kriteria || [] };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat kriteria';
      return { success: false, error: message };
    }
  },

  createKriteria: async (kategoriId, payload) => {
    try {
      const res = await marketplaceAPI.createKriteria(kategoriId, payload);
      await get().fetchKriteria(kategoriId);
      return { success: true, data: res?.data?.kriteria };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuat kriteria';
      return { success: false, error: message };
    }
  },

  deleteKriteria: async (id, kategoriId) => {
    try {
      await marketplaceAPI.deleteKriteria(id);
      await get().fetchKriteria(kategoriId);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menghapus kriteria';
      return { success: false, error: message };
    }
  },

  assignPenilai: async (kategoriId, dosenIds) => {
    try {
      const res = await marketplaceAPI.assignPenilai(kategoriId, dosenIds);
      return { success: true, data: res?.data?.kategori };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menugaskan penilai';
      return { success: false, error: message };
    }
  },

  validateBobot: async (kategoriId) => {
    try {
      const res = await marketplaceAPI.validateBobot(kategoriId);
      return { success: true, data: res?.data };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal validasi bobot';
      return { success: false, error: message };
    }
  },
}));