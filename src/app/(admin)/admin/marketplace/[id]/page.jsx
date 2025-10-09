'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { marketplaceAPI, assessmentAPI } from '@/lib/api';
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
  BUSINESS_TYPE_LABELS,
  ROUTES,
} from '@/lib/constants';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Lock,
  Unlock,
  Upload,
  Edit2,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import EventInfoTab from '@/components/admin/marketplace/EventInfoTab';
import ParticipantsTab from '@/components/admin/marketplace/ParticipantsTab';
import AssessmentTab from '@/components/admin/marketplace/AssessmentTab';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getEventById(eventId);
      setEvent(response.data);
    } catch (error) {
      toast.error('Gagal memuat detail event');
      console.error(error);
    } finally {
      setLoading(false);
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
      fetchEventDetail();
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
      fetchEventDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuka kunci event');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!event) {
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

  const approvedBusinesses = event.usaha?.filter((b) => b.disetujui) || [];
  const pendingBusinesses = event.usaha?.filter((b) => !b.disetujui) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold">{event.nama}</h1>
              <Badge className={EVENT_STATUS_COLORS[event.status]}>
                {EVENT_STATUS_LABELS[event.status]}
              </Badge>
              {event.terkunci && (
                <Badge variant="outline">
                  <Lock className="mr-1 h-3 w-3" />
                  Terkunci
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {event.deskripsi}
            </p>
          </div>

          <div className="flex gap-2">
            {!event.terkunci ? (
              <>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`${ROUTES.ADMIN_MARKETPLACE}/${eventId}/edit`)
                  }
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#fba635]" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tanggal Pelaksanaan
                </p>
                <p className="font-semibold">
                  {formatDate(event.tanggalPelaksanaan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-[#174c4e]" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lokasi
                </p>
                <p className="font-semibold">{event.lokasi}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Peserta Disetujui
                </p>
                <p className="font-semibold">
                  {approvedBusinesses.length} / {event.kuotaPeserta}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kategori Penilaian
                </p>
                <p className="font-semibold">
                  {event.kategoriPenilaian?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informasi Event</TabsTrigger>
          <TabsTrigger value="participants">
            Peserta ({event.usaha?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="assessment">
            Penilaian ({event.kategoriPenilaian?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <EventInfoTab event={event} onRefresh={fetchEventDetail} />
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <ParticipantsTab
            event={event}
            onRefresh={fetchEventDetail}
            isLocked={event.terkunci}
          />
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          <AssessmentTab event={event} onRefresh={fetchEventDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
