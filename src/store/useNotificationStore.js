import { create } from 'zustand';
import { notificationAPI } from '@/lib/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // Fetch notifications
  fetchNotifications: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationAPI.getUserNotifications(params);
      const { notifications, pagination } = response.data;

      set({
        notifications,
        pagination,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal memuat notifikasi';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Fetch unread count
  fetchUnreadCount: async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      const { count } = response.data;

      set({ unreadCount: count, error: null });
      return { success: true, count };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal memuat jumlah notifikasi';
      // Don't set error state for unread count failures (silent fail)
      // Just log and return failure
      console.error('Failed to fetch unread count:', error);
      return { success: false, error: errorMessage };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);

      // Update local state (optimistic update)
      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map((notif) =>
        notif.id === notificationId ? { ...notif, sudahBaca: true } : notif
      );

      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - 1),
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal menandai notifikasi';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead();

      // Update local state (optimistic update)
      const { notifications } = get();
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        sudahBaca: true,
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal menandai semua notifikasi';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);

      // Update local state (optimistic update)
      const { notifications, unreadCount } = get();
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      const updatedNotifications = notifications.filter(
        (notif) => notif.id !== notificationId
      );

      set({
        notifications: updatedNotifications,
        unreadCount: deletedNotif?.sudahBaca
          ? unreadCount
          : Math.max(0, unreadCount - 1),
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Gagal menghapus notifikasi';
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    }),
}));
