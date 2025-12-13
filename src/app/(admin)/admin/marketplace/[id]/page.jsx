'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMarketplaceStore } from '@/store';
import Link from 'next/link';
import Image from 'next/image';
import { marketplaceAPI } from '@/lib/api';
import { ROUTES } from '@/lib/constants/routes';
import { EVENT_STATUS_LABELS } from '@/lib/constants/labels';
import { EVENT_STATUS_COLORS } from '@/lib/constants/colors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft,
  Lock,
  Unlock,
  Edit2,
  RefreshCw,
  Users,
  MapPin,
  Calendar,
  Info,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import EventInfoTab from '@/components/features/admin/marketplace/EventInfoTab';
import ParticipantsTab from '@/components/features/admin/marketplace/ParticipantsTab';
import AssessmentTab from '@/components/features/admin/marketplace/AssessmentTab';
import { exportAPI, downloadBlob } from '@/lib/api';
import ExportButton from '@/components/ui/ExportButton';
import {
  toDatetimeLocal,
  toUTC,
  isValidDateTime,
  formatDateTime,
} from '@/lib/utils/date';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const eventDetail = useMarketplaceStore((state) => state.eventDetail);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  const fetchEventDetail = useMarketplaceStore(
    (state) => state.fetchEventDetail
  );
  const [activeTab, setActiveTab] = useState('info');

  // Dialog states
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // Unlock confirmation state
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    nama: '',
    deskripsi: '',
    semester: '',
    tahunAjaran: '',
    lokasi: '',
    tanggalPelaksanaan: '',
    kuotaPeserta: '',
  });

  // Computed stats
  const stats = useMemo(() => {
    if (!eventDetail) return null;
    const businesses = eventDetail.usaha || [];
    const approved = businesses.filter((b) => b.status === 'DISETUJUI');
    const pending = businesses.filter((b) => b.status === 'PENDING');
    const withBooth = businesses.filter((b) => b.nomorBooth);

    return {
      total: businesses.length,
      approved: approved.length,
      pending: pending.length,
      withBooth: withBooth.length,
      quota: eventDetail.kuotaPeserta || 0,
      categories: eventDetail.kategoriPenilaian?.length || 0,
    };
  }, [eventDetail]);

  useEffect(() => {
    fetchEventDetail(eventId);
  }, [eventId, fetchEventDetail]);

  useEffect(() => {
    if (eventDetail) {
      setEditForm({
        nama: eventDetail.nama,
        deskripsi: eventDetail.deskripsi,
        semester: eventDetail.semester,
        tahunAjaran: eventDetail.tahunAjaran,
        lokasi: eventDetail.lokasi,
        tanggalPelaksanaan: toDatetimeLocal(eventDetail.tanggalPelaksanaan),
        kuotaPeserta: eventDetail.kuotaPeserta?.toString(),
      });
      setSelectedStatus(eventDetail.status);
    }
  }, [eventDetail]);

  const handleUpdateStatus = async () => {
    if (selectedStatus === eventDetail?.status) {
      toast.error('Status tidak berubah');
      return;
    }

    try {
      setUpdating(true);
      await marketplaceAPI.updateEvent(eventId, { status: selectedStatus });
      toast.success('Status event berhasil diperbarui');
      setShowStatusDialog(false);
      fetchEventDetail(eventId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui status');
    } finally {
      setUpdating(false);
    }
  };

  const validateEditForm = () => {
    const { nama, semester, tahunAjaran, tanggalPelaksanaan, kuotaPeserta } =
      editForm;

    if (!nama || !semester || !tahunAjaran || !kuotaPeserta) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return false;
    }

    if (!tanggalPelaksanaan) {
      toast.error('Mohon isi tanggal pelaksanaan');
      return false;
    }

    if (!isValidDateTime(tanggalPelaksanaan)) {
      toast.error('Format tanggal tidak valid');
      return false;
    }

    return true;
  };

  const handleEditEvent = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      setUpdating(true);

      const dataToSend = {
        ...editForm,
        tanggalPelaksanaan: toUTC(
          new Date(editForm.tanggalPelaksanaan)
        ).toISOString(),
        kuotaPeserta: parseInt(editForm.kuotaPeserta),
      };

      await marketplaceAPI.updateEvent(eventId, dataToSend);
      toast.success('Event berhasil diperbarui');
      setShowEditDialog(false);
      fetchEventDetail(eventId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui event');
      console.error('Update event error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUnlockClick = () => {
    setShowUnlockDialog(true);
  };

  const handleUnlockConfirm = async () => {
    try {
      setUnlocking(true);
      await marketplaceAPI.unlockEvent(eventId);
      toast.success('Event berhasil dibuka kembali');
      setShowUnlockDialog(false);
      fetchEventDetail(eventId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuka kunci event');
    } finally {
      setUnlocking(false);
    }
  };

  const handleExportEvent = async (format) => {
    const response = await exportAPI.exportEvent(eventId, format);
    const filename = `laporan-event-${eventDetail?.nama || 'event'}-${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    downloadBlob(response.data, filename);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Event tidak ditemukan</p>
        <Button asChild>
          <Link href={ROUTES.ADMIN_MARKETPLACE}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#174c4e] to-[#0d2d2e] shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#fba635]/30" />
        </div>

        {/* Cover Image Overlay */}
        {eventDetail.gambarCover && (
          <div className="absolute inset-0">
            <Image
              src={eventDetail.gambarCover}
              alt={eventDetail.nama}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#174c4e]/90 via-[#174c4e]/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-6 md:p-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/marketplace/')}
            className="mb-4 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Event
          </Button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Event Info */}
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge
                  className={`${EVENT_STATUS_COLORS[eventDetail.status]} border-none px-3 py-1 text-sm font-bold tracking-wide`}
                >
                  {EVENT_STATUS_LABELS[eventDetail.status]}
                </Badge>
                {eventDetail.terkunci && (
                  <Badge
                    variant="outline"
                    className="border-orange-400 bg-orange-500/20 text-orange-300"
                  >
                    <Lock className="mr-1 h-3 w-3" />
                    Terkunci
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="border-white/30 text-white/80"
                >
                  {eventDetail.semester} {eventDetail.tahunAjaran}
                </Badge>
              </div>

              <h1 className="mb-3 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                {eventDetail.nama}
              </h1>

              <p className="mb-4 max-w-2xl text-sm text-white/70 md:text-base">
                {eventDetail.deskripsi}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#fba635]" />
                  <span>{formatDateTime(eventDetail.tanggalPelaksanaan)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#fba635]" />
                  <span>{eventDetail.lokasi}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <ExportButton
                onExport={handleExportEvent}
                formats={['excel', 'pdf']}
                label="Ekspor"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20"
              />

              {!eventDetail.terkunci ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setShowStatusDialog(true)}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Ubah Status
                  </Button>
                  <Button
                    onClick={() => setShowEditDialog(true)}
                    className="bg-[#fba635] text-white hover:bg-[#fdac58]"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Event
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handleUnlockClick}
                  className="bg-white/10 text-white hover:bg-white/20"
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Buka Kunci
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-gray-100 p-1.5 dark:bg-gray-900">
          <TabsTrigger
            value="info"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Informasi Event</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger
            value="participants"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Peserta</span>
            <Badge
              variant="secondary"
              className="ml-1 h-5 bg-gray-200 px-1.5 text-xs dark:bg-gray-700"
            >
              {stats?.total || 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="assessment"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
          >
            <Award className="h-4 w-4" />
            <span className="hidden sm:inline">Penilaian</span>
            <Badge
              variant="secondary"
              className="ml-1 h-5 bg-gray-200 px-1.5 text-xs dark:bg-gray-700"
            >
              {stats?.categories || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6 space-y-6">
          <EventInfoTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
          />
        </TabsContent>

        <TabsContent value="participants" className="mt-6 w-full space-y-6">
          <ParticipantsTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
            isLocked={eventDetail.terkunci}
          />
        </TabsContent>

        <TabsContent value="assessment" className="mt-6 space-y-6">
          <AssessmentTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
          />
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Status Event</DialogTitle>
            <DialogDescription>
              Ubah status event sesuai dengan kondisi saat ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status Event</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TERBUKA">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      {EVENT_STATUS_LABELS.TERBUKA}
                    </div>
                  </SelectItem>
                  <SelectItem value="BERLANGSUNG">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      {EVENT_STATUS_LABELS.BERLANGSUNG}
                    </div>
                  </SelectItem>
                  <SelectItem value="SELESAI">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      {EVENT_STATUS_LABELS.SELESAI}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
              <p className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                Keterangan Status:
              </p>
              <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-green-500" />
                  <span>
                    <strong>TERBUKA:</strong> Pendaftaran dibuka
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
                  <span>
                    <strong>BERLANGSUNG:</strong> Event sedang berlangsung
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-500" />
                  <span>
                    <strong>SELESAI:</strong> Event telah selesai
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={updating}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating || selectedStatus === eventDetail?.status}
              className="bg-[#fba635] hover:bg-[#fdac58]"
            >
              {updating ? 'Memperbarui...' : 'Ubah Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ubah Event</DialogTitle>
            <DialogDescription>
              Perbarui informasi event marketplace
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Event *</Label>
              <Input
                id="nama"
                value={editForm.nama}
                onChange={(e) =>
                  setEditForm({ ...editForm, nama: e.target.value })
                }
                placeholder="Contoh: Market Day 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi *</Label>
              <Textarea
                id="deskripsi"
                value={editForm.deskripsi}
                onChange={(e) =>
                  setEditForm({ ...editForm, deskripsi: e.target.value })
                }
                placeholder="Deskripsi event..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={editForm.semester}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahunAjaran">Tahun Ajaran *</Label>
                <Input
                  id="tahunAjaran"
                  value={editForm.tahunAjaran}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tahunAjaran: e.target.value })
                  }
                  placeholder="2024/2025"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi *</Label>
              <Input
                id="lokasi"
                value={editForm.lokasi}
                onChange={(e) =>
                  setEditForm({ ...editForm, lokasi: e.target.value })
                }
                placeholder="Contoh: Gedung Serbaguna"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggalPelaksanaan">
                  Tanggal Pelaksanaan *
                </Label>
                <Input
                  id="tanggalPelaksanaan"
                  type="datetime-local"
                  value={editForm.tanggalPelaksanaan}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tanggalPelaksanaan: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kuotaPeserta">Kuota Peserta *</Label>
                <Input
                  id="kuotaPeserta"
                  type="number"
                  min="1"
                  value={editForm.kuotaPeserta}
                  onChange={(e) =>
                    setEditForm({ ...editForm, kuotaPeserta: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={updating}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditEvent}
              disabled={updating}
              className="bg-[#fba635] hover:bg-[#fdac58]"
            >
              {updating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unlock Event Confirmation Dialog */}
      <ConfirmDialog
        open={showUnlockDialog}
        onOpenChange={setShowUnlockDialog}
        title="Buka Kunci Event"
        description="Apakah Anda yakin ingin membuka kunci event ini? Event yang sudah dibuka kembali dapat diedit."
        confirmText="Buka Kunci"
        cancelText="Batal"
        variant="warning"
        onConfirm={handleUnlockConfirm}
        loading={unlocking}
      />
    </div>
  );
}
