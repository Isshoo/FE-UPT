'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMarketplaceStore } from '@/store';
import Link from 'next/link';
import Image from 'next/image';
import { EVENT_STATUS_LABELS } from '@/lib/constants/labels';
import { EVENT_STATUS_COLORS } from '@/lib/constants/colors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  Lock,
  Users,
  MapPin,
  Calendar,
  Info,
  Award,
} from 'lucide-react';
import EventInfoTab from '@/components/features/admin/marketplace/EventInfoTab';
import ParticipantsTab from '@/components/features/admin/marketplace/ParticipantsTab';
import AssessmentTab from '@/components/features/admin/marketplace/AssessmentTab';
import { exportAPI, downloadBlob } from '@/lib/api';
import ExportButton from '@/components/ui/ExportButton';
import { formatDateTime } from '@/lib/utils/date';

export default function WR2EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const eventDetail = useMarketplaceStore((state) => state.eventDetail);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  const fetchEventDetail = useMarketplaceStore(
    (state) => state.fetchEventDetail
  );
  const [activeTab, setActiveTab] = useState('info');

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
    if (eventId) {
      fetchEventDetail(eventId);
    }
  }, [eventId, fetchEventDetail]);

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
          <Link href="/wr2/marketplace">
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
            onClick={() => router.push('/wr2/marketplace')}
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

            {/* Action Buttons (Export Only) */}
            <div className="flex flex-wrap gap-2">
              <ExportButton
                onExport={handleExportEvent}
                formats={['excel', 'pdf']}
                label="Ekspor Laporan"
                variant="secondary"
                className="bg-white/10 text-white hover:bg-white/20"
              />
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
            readOnly={true}
          />
        </TabsContent>

        <TabsContent value="participants" className="mt-6 w-full space-y-6">
          <ParticipantsTab
            event={eventDetail}
            onRefresh={() => fetchEventDetail(eventId)}
            isLocked={eventDetail.terkunci}
            readOnly={true}
          />
        </TabsContent>

        <TabsContent value="assessment" className="mt-6 space-y-6">
          <AssessmentTab
            event={eventDetail}
            basePath="/wr2/marketplace"
            onRefresh={() => fetchEventDetail(eventId)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
