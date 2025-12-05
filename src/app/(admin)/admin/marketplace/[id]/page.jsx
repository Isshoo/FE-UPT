'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMarketplaceStore } from '@/store';
import Link from 'next/link';
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
  // Info,
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
  // getUserTimezone,
  isValidDateTime,
} from '@/lib/utils/date';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  // const userTimezone = getUserTimezone();

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

  // Edit form state
  const [editForm, setEditForm] = useState({
    nama: '',
    deskripsi: '',
    semester: '',
    tahunAjaran: '',
    lokasi: '',
    tanggalPelaksanaan: '',
    mulaiPendaftaran: '',
    akhirPendaftaran: '',
    kuotaPeserta: '',
  });

  useEffect(() => {
    fetchEventDetail(eventId);
  }, [eventId, fetchEventDetail]);

  useEffect(() => {
    if (eventDetail) {
      // Convert UTC dates to local timezone for editing
      setEditForm({
        nama: eventDetail.nama,
        deskripsi: eventDetail.deskripsi,
        semester: eventDetail.semester,
        tahunAjaran: eventDetail.tahunAjaran,
        lokasi: eventDetail.lokasi,
        tanggalPelaksanaan: toDatetimeLocal(eventDetail.tanggalPelaksanaan),
        mulaiPendaftaran: toDatetimeLocal(eventDetail.mulaiPendaftaran),
        akhirPendaftaran: toDatetimeLocal(eventDetail.akhirPendaftaran),
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
    const {
      nama,
      semester,
      tahunAjaran,
      tanggalPelaksanaan,
      mulaiPendaftaran,
      akhirPendaftaran,
      kuotaPeserta,
    } = editForm;

    if (!nama || !semester || !tahunAjaran || !kuotaPeserta) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return false;
    }

    if (!tanggalPelaksanaan || !mulaiPendaftaran || !akhirPendaftaran) {
      toast.error('Mohon isi semua tanggal');
      return false;
    }

    // Validate datetime strings
    if (
      !isValidDateTime(tanggalPelaksanaan) ||
      !isValidDateTime(mulaiPendaftaran) ||
      !isValidDateTime(akhirPendaftaran)
    ) {
      toast.error('Format tanggal tidak valid');
      return false;
    }

    // Validate date logic (in local time)
    const eventDate = new Date(tanggalPelaksanaan);
    const regStart = new Date(mulaiPendaftaran);
    const regEnd = new Date(akhirPendaftaran);

    if (regStart >= regEnd) {
      toast.error('Tanggal mulai pendaftaran harus sebelum tanggal akhir');
      return false;
    }

    if (regEnd >= eventDate) {
      toast.error(
        'Tanggal akhir pendaftaran harus sebelum tanggal pelaksanaan'
      );
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

      // Convert local datetime to UTC ISO strings
      const dataToSend = {
        ...editForm,
        tanggalPelaksanaan: toUTC(
          new Date(editForm.tanggalPelaksanaan)
        ).toISOString(),
        mulaiPendaftaran: toUTC(
          new Date(editForm.mulaiPendaftaran)
        ).toISOString(),
        akhirPendaftaran: toUTC(
          new Date(editForm.akhirPendaftaran)
        ).toISOString(),
        kuotaPeserta: parseInt(editForm.kuotaPeserta),
      };

      console.log('Updating event with UTC dates:', {
        tanggalPelaksanaan: dataToSend.tanggalPelaksanaan,
        mulaiPendaftaran: dataToSend.mulaiPendaftaran,
        akhirPendaftaran: dataToSend.akhirPendaftaran,
      });

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

  const handleLockEvent = async () => {
    if (
      !confirm(
        'Apakah Anda yakin ingin mengunci event ini? Event yang terkunci tidak dapat diubah.'
      )
    ) {
      return;
    }

    try {
      await marketplaceAPI.lockEvent(eventId);
      toast.success('Event berhasil dikunci');
      fetchEventDetail(eventId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengunci event');
    }
  };

  const handleUnlockEvent = async () => {
    if (!confirm('Apakah Anda yakin ingin membuka kunci event ini?')) {
      return;
    }

    try {
      await marketplaceAPI.unlockEvent(eventId);
      toast.success('Event berhasil dibuka kembali');
      fetchEventDetail(eventId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuka kunci event');
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
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/marketplace/`)}
          className="mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold">{eventDetail.nama}</h1>
              <Badge className={EVENT_STATUS_COLORS[eventDetail.status]}>
                {EVENT_STATUS_LABELS[eventDetail.status]}
              </Badge>
              {eventDetail.terkunci && (
                <Badge variant="outline">
                  <Lock className="mr-1 h-3 w-3" />
                  Terkunci
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {eventDetail.deskripsi}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <ExportButton
              onExport={handleExportEvent}
              formats={['excel', 'pdf']}
              label="Export"
              variant="outline"
            />

            {!eventDetail.terkunci ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowStatusDialog(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Event
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLockEvent}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Kunci Event
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={handleUnlockEvent}
                className="text-blue-600 hover:text-blue-700"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Buka Kunci
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informasi Event</TabsTrigger>
          <TabsTrigger value="participants">
            Peserta ({eventDetail.usaha?.length || 0} /{' '}
            {eventDetail.kuotaPeserta})
          </TabsTrigger>
          <TabsTrigger value="assessment">
            Penilaian ({eventDetail.kategoriPenilaian?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <EventInfoTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
          />
        </TabsContent>

        <TabsContent value="participants" className="w-full space-y-6">
          <ParticipantsTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
            isLocked={eventDetail.terkunci}
          />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <AssessmentTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
          />
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Event</DialogTitle>
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
                    {EVENT_STATUS_LABELS.TERBUKA}
                  </SelectItem>
                  <SelectItem value="PERSIAPAN">
                    {EVENT_STATUS_LABELS.PERSIAPAN}
                  </SelectItem>
                  <SelectItem value="BERLANGSUNG">
                    {EVENT_STATUS_LABELS.BERLANGSUNG}
                  </SelectItem>
                  <SelectItem value="SELESAI">
                    {EVENT_STATUS_LABELS.SELESAI}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <p className="mb-1 font-semibold">Keterangan Status:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <strong>TERBUKA:</strong> Pendaftaran dibuka
                </li>
                <li>
                  <strong>PERSIAPAN:</strong> Persiapan menjelang acara
                </li>
                <li>
                  <strong>BERLANGSUNG:</strong> Event sedang berlangsung
                </li>
                <li>
                  <strong>SELESAI:</strong> Event telah selesai
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
              {updating ? 'Memperbarui...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Perbarui informasi event marketplace
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pb-2">
            {/* Timezone Info Banner */}
            {/* <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <Info className="mt-0 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Timezone: {userTimezone}</p>
                <p className="text-xs">Waktu akan disimpan dalam UTC</p>
              </div>
            </div> */}

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

            <div className="space-y-2">
              <Label htmlFor="tanggalPelaksanaan">Tanggal Pelaksanaan *</Label>
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
              {/* <p className="text-xs text-gray-500">
                Waktu dalam timezone Anda ({userTimezone})
              </p> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mulaiPendaftaran">Mulai Pendaftaran *</Label>
                <Input
                  id="mulaiPendaftaran"
                  type="datetime-local"
                  value={editForm.mulaiPendaftaran}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      mulaiPendaftaran: e.target.value,
                    })
                  }
                />
                {/* <p className="text-xs text-gray-500">
                  Waktu dalam timezone Anda ({userTimezone})
                </p> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="akhirPendaftaran">Akhir Pendaftaran *</Label>
                <Input
                  id="akhirPendaftaran"
                  type="datetime-local"
                  value={editForm.akhirPendaftaran}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      akhirPendaftaran: e.target.value,
                    })
                  }
                />
                {/* <p className="text-xs text-gray-500">
                  Waktu dalam timezone Anda ({userTimezone})
                </p> */}
              </div>
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
    </div>
  );
}
