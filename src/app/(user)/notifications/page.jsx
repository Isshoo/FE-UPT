'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Trash2 } from 'lucide-react';
import { useNotificationStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import PaginationControls from '@/components/ui/pagination-controls';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function NotificationsPage() {
  const router = useRouter();

  // Use specific selectors to prevent unnecessary re-renders
  const notifications = useNotificationStore((state) => state.notifications);
  const pagination = useNotificationStore((state) => state.pagination);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification
  );

  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount, fetchNotifications is stable from Zustand

  const handleNotificationClick = async (notification) => {
    if (!notification.sudahBaca) {
      await markAsRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      toast.success('Semua notifikasi ditandai sebagai dibaca');
    }
  };

  const handleDeleteClick = (e, notification) => {
    e.stopPropagation();
    setNotificationToDelete(notification);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;

    try {
      setDeleting(true);
      const result = await deleteNotification(notificationToDelete.id);
      if (result.success) {
        toast.success('Notifikasi dihapus');
      }
      setShowDeleteConfirm(false);
      setNotificationToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page) => {
    fetchNotifications({ page, limit: 20 });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifikasi</h1>
        {notifications.some((n) => !n.sudahBaca) && (
          <Button onClick={handleMarkAllRead} variant="outline">
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="mx-auto mb-4 h-16 w-16 opacity-20" />
          <p className="text-gray-500">Tidak ada notifikasi</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                !notification.sudahBaca
                  ? 'border-l-4 border-l-[#fba635] bg-[#fba635]/5'
                  : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{notification.judul}</h3>
                    {!notification.sudahBaca && (
                      <span className="h-2 w-2 rounded-full bg-[#fba635]" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {notification.pesan}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: localeId,
                    })}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    handleDeleteClick(e, notification);
                  }}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Notification Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => {
          setShowDeleteConfirm(open);
          if (!open) setNotificationToDelete(null);
        }}
        title="Hapus Notifikasi"
        description={`Apakah Anda yakin ingin menghapus notifikasi "${notificationToDelete?.judul}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </div>
  );
}
