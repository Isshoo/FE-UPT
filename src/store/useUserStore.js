 
import { create } from 'zustand';
import { usersAPI } from '@/lib/api';

export const useUserStore = create((set, get) => ({
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  search: '',
  role: '',
  sortBy: 'createdAt',
  order: 'desc',
  loading: false,
  error: null,

  current: null, // detail

  setParams: (params) => {
    const allowed = ['page', 'limit', 'search', 'role', 'sortBy', 'order'];
    const next = {};
    allowed.forEach((k) => {
      if (params[k] !== undefined) next[k] = params[k];
    });
    set(next);
  },

  resetParams: () => {
    set({
      page: 1,
      limit: 10,
      search: '',
      role: '',
      sortBy: 'createdAt',
      order: 'desc',
    });
  },

  fetchList: async () => {
    const { page, limit, search, role, sortBy, order } = get();
    set({ loading: true, error: null });
    try {
      const res = await usersAPI.list({ page, limit, search, role, sortBy, order });
      set({
        items: res?.data || [],
        total: res?.pagination?.total || 0,
        totalPages: res?.pagination?.totalPages || 1,
        page: res?.pagination?.page || page,
        limit: res?.pagination?.limit || limit,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat data users';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null, current: null });
    try {
      const res = await usersAPI.getById(id);
      set({ current: res?.data?.user || null, loading: false });
      return { success: true, data: res?.data?.user || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal memuat detail user';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await usersAPI.create(payload);
      set({ loading: false });
      return { success: true, data: res?.data?.user || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal membuat user';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateOne: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await usersAPI.update(id, payload);
      set({ loading: false, current: res?.data?.user || null });
      return { success: true, data: res?.data?.user || null };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal mengupdate user';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteById: async (id) => {
    try {
      await usersAPI.remove(id);
      await get().fetchList();
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || 'Gagal menghapus user';
      return { success: false, error: message };
    }
  },
}));