'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, useMarketplaceStore } from '@/store';
import {
  EVENT_STATUS_LABELS,
  BUSINESS_TYPE_LABELS,
  ROLES,
} from '@/lib/constants/labels';
import { EVENT_STATUS_COLORS } from '@/lib/constants/colors';
import { ROUTES } from '@/lib/constants/routes';
import { formatDateTime } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Award,
  Trophy,
  LogIn,
  CheckCircle,
  Clock,
  XCircle,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UserEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  // Store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const eventDetail = useMarketplaceStore((state) => state.eventDetail);
  const isLoading = useMarketplaceStore((state) => state.isLoading);
  const fetchEventDetail = useMarketplaceStore(
    (state) => state.fetchEventDetail
  );

  const [userRegistration, setUserRegistration] = useState(null);

  // Check Registration Callback
  const checkUserRegistration = useCallback(
    (eventData) => {
      if (eventData && eventData.usaha && user) {
        const userBusiness = eventData.usaha.find(
          (usaha) => usaha.pemilik.id === user.id
        );
        setUserRegistration(userBusiness || null);
      } else {
        setUserRegistration(null);
      }
    },
    [user]
  );

  // Fetch Data
  useEffect(() => {
    fetchEventDetail(eventId).then((result) => {
      if (result.success && result.data) {
        if (isAuthenticated && user?.role === ROLES.USER) {
          checkUserRegistration(result.data);
        }
      }
    });
  }, [eventId, isAuthenticated, user, fetchEventDetail, checkUserRegistration]);

  // Handlers
  const handleRegister = () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push(`${ROUTES.LOGIN}?redirect=/marketplace/${eventId}/register`);
      return;
    }

    if (userRegistration) {
      toast.error('Anda sudah mendaftarkan usaha di event ini');
      return;
    }

    router.push(`/marketplace/${eventId}/register`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link event disalin ke clipboard');
  };

  // Status Badge Logic for User Registration
  const getRegistrationStatusBadge = () => {
    if (!userRegistration) return null;

    const statusConfig = {
      PENDING: {
        icon: Clock,
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        label: 'Menunggu Persetujuan',
      },
      APPROVED: {
        icon: CheckCircle,
        color:
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        label: 'Disetujui',
      },
      REJECTED: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        label: 'Ditolak',
      },
    };

    const status =
      userRegistration.disetujui === false ? 'PENDING' : 'APPROVED'; // Simplification based on current data model
    // Note: If you have a real 'REJECTED' status in DB, use that instead.

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} px-3 py-1`}>
        <Icon className="mr-2 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto mt-20 px-4 py-8">
        <div className="mb-8 h-64 w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="h-64 w-full rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!eventDetail) {
    return (
      <div className="mt-20 flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Event tidak ditemukan</p>
        <Button asChild>
          <Link href="/marketplace">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>
    );
  }

  const event = eventDetail;
  const isRegistrationOpen = event?.status === 'TERBUKA';
  const isEventCompleted = event?.status === 'SELESAI';
  const approvedBusinesses = event?.usaha?.filter((b) => b.disetujui) || [];

  // Calculate Progress
  const participationRate = Math.min(
    100,
    Math.round((approvedBusinesses.length / event.kuotaPeserta) * 100)
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 dark:bg-gray-950">
      {/* 1. HERO SECTION */}
      <div className="relative mt-16 h-[400px] w-full overflow-hidden bg-gray-900">
        {event.gambarCover ? (
          <Image
            src={event.gambarCover}
            alt={event.nama}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#174c4e] to-[#fba635] opacity-80" />
        )}

        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        <div className="relative container mx-auto flex h-full flex-col justify-center px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/marketplace')}
              className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali ke Marketplace
            </Button>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge
                className={`${EVENT_STATUS_COLORS[event.status]} border-none px-3 py-1 text-sm font-bold tracking-wide uppercase`}
              >
                {EVENT_STATUS_LABELS[event.status]}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/30 bg-black/20 text-white backdrop-blur-sm"
              >
                {event.semester} {event.tahunAjaran}
              </Badge>
            </div>

            <h1 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              {event.nama}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#fba635]" />
                <span className="font-medium">
                  {formatDateTime(event.tanggalPelaksanaan)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#fba635]" />
                <span className="font-medium">{event.lokasi}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container mx-auto -mt-8 grid gap-8 px-4 lg:-mt-12 lg:grid-cols-3">
        {/* LEFT COLUMN (Content) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="min-w-0 space-y-8 pt-20 lg:col-span-2"
        >
          {/* About Event */}
          <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
            <CardHeader className="bg-white px-8 pt-8 dark:bg-gray-900">
              <CardTitle className="text-2xl font-bold">
                Tentang Event
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white px-8 pb-8 dark:bg-gray-900">
              <p className="text-lg leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">
                {event.deskripsi}
              </p>
            </CardContent>
          </Card>

          {/* TABS: Detail Info, Layout, Sponsors, Awards */}
          <Tabs defaultValue="participants" className="space-y-6">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-white p-2 shadow-sm dark:bg-gray-900">
              <TabsTrigger
                value="participants"
                className="flex-1 rounded-xl px-3 py-2 text-sm font-medium data-[state=active]:bg-[#fba635] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-400"
              >
                Peserta ({approvedBusinesses.length})
              </TabsTrigger>
              <TabsTrigger
                value="awards"
                className="flex-1 rounded-xl px-3 py-2 text-sm font-medium data-[state=active]:bg-[#174c4e] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-400"
              >
                Penilaian ({event.kategoriPenilaian?.length || 0})
              </TabsTrigger>
              <TabsTrigger
                value="layout"
                className="flex-1 rounded-xl px-3 py-2 text-sm font-medium data-[state=active]:bg-[#174c4e] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-400"
              >
                Denah & Layout
              </TabsTrigger>
              <TabsTrigger
                value="sponsors"
                className="flex-1 rounded-xl px-3 py-2 text-sm font-medium data-[state=active]:bg-[#174c4e] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:bg-gray-800 dark:data-[state=inactive]:text-gray-400"
              >
                Sponsor
              </TabsTrigger>
            </TabsList>

            {/* TAB: Participants */}
            <TabsContent value="participants">
              <Card className="rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-[#174c4e]" />
                    Daftar Peserta Terdaftar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedBusinesses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">
                        Belum ada peserta yang disetujui untuk event ini.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
                      <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-900">
                          <TableRow>
                            <TableHead className="w-[50px] text-center">
                              No
                            </TableHead>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead className="text-center">Booth</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvedBusinesses.map((business, index) => (
                            <TableRow key={business.id}>
                              <TableCell className="text-center font-medium text-gray-500">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {business.namaProduk}
                                </span>
                                <div className="text-xs text-gray-500">
                                  {business.pemilik.nama}
                                </div>
                              </TableCell>
                              <TableCell>{business.kategori}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className="font-normal"
                                >
                                  {BUSINESS_TYPE_LABELS[business.tipeUsaha]}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {business.nomorBooth ? (
                                  <Badge className="bg-[#174c4e] hover:bg-[#174c4e]/90">
                                    {business.nomorBooth}
                                  </Badge>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Awards */}
            <TabsContent value="awards">
              <div className="grid gap-6">
                {event.kategoriPenilaian?.map((kategori) => (
                  <Card
                    key={kategori.id}
                    className="overflow-hidden rounded-3xl border-0 shadow-md"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex w-full items-center justify-center bg-gradient-to-br from-[#fba635]/10 to-[#fba635]/5 p-6 md:w-48">
                        <Award className="h-16 w-16 text-[#fba635]" />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                              {kategori.nama}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {kategori.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                          </div>
                          {kategori.pemenang && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              <Trophy className="mr-1 h-3 w-3" /> Ada Pemenang
                            </Badge>
                          )}
                        </div>

                        {/* Winner Display */}
                        {kategori.pemenang && isEventCompleted && (
                          <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-yellow-600 uppercase dark:text-yellow-400">
                                  Pemenang Kategori Ini
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  {kategori.pemenang.namaProduk}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Criteria Mini List */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {kategori.kriteria?.map((k) => (
                            <Badge
                              key={k.id}
                              variant="outline"
                              className="border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            >
                              {k.nama} ({k.bobot}%)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {(!event.kategoriPenilaian ||
                  event.kategoriPenilaian.length === 0) && (
                  <Card className="rounded-3xl border-0 p-12 text-center shadow-md">
                    <Award className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-gray-500">
                      Belum ada kategori penilaian untuk event ini.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* TAB: Layout */}
            <TabsContent value="layout">
              <Card className="overflow-hidden rounded-3xl border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Denah Lokasi Event</CardTitle>
                </CardHeader>
                <CardContent>
                  {event.gambarLayout ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={event.gambarLayout}
                        alt="Layout Denah"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-20 text-center dark:bg-gray-800/50">
                      <ImageIcon className="mb-4 h-12 w-12 text-gray-300" />
                      <p className="text-gray-500">
                        Gambar denah belum tersedia
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Sponsors */}
            <TabsContent value="sponsors">
              <Card className="rounded-3xl border-0 shadow-md">
                <CardContent className="p-8">
                  {event.sponsor && event.sponsor.length > 0 ? (
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                      {event.sponsor.map((sponsor) => (
                        <div
                          key={sponsor.id}
                          className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 p-6 transition-colors hover:border-[#fba635] hover:bg-orange-50 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          {sponsor.logo ? (
                            <div className="relative h-16 w-full">
                              <Image
                                src={sponsor.logo}
                                alt={sponsor.nama}
                                fill
                                className="object-contain opacity-70 transition-opacity group-hover:opacity-100"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gray-100" />
                          )}
                          <span className="text-center text-sm font-medium text-gray-600 group-hover:text-[#fba635] dark:text-gray-400">
                            {sponsor.nama}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      Belum ada sponsor data.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* RIGHT COLUMN (Sidebar) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* 1. Registration / User Status Card - STICKY */}
          <div className="sticky top-24 space-y-6">
            {/* Registration Status */}
            {userRegistration ? (
              <Card className="overflow-hidden rounded-3xl border-2 border-blue-500 bg-blue-50/50 shadow-lg dark:bg-blue-950/20">
                <div className="h-2 w-full bg-blue-500" />
                <CardHeader className="pb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      Terdaftar
                    </Badge>
                    {getRegistrationStatusBadge()}
                  </div>
                  <CardTitle className="text-lg">Status Pendaftaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="mb-1 text-xs text-gray-500 uppercase">
                      Nama Usaha
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {userRegistration.namaProduk}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                      <div className="mb-1 text-xs text-gray-500 uppercase">
                        Kategori
                      </div>
                      <div className="font-semibold">
                        {userRegistration.kategori}
                      </div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                      <div className="mb-1 text-xs text-gray-500 uppercase">
                        Booth
                      </div>
                      <div className="font-semibold text-[#174c4e]">
                        {userRegistration.nomorBooth || '-'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden rounded-3xl border-2 border-[#fba635] bg-white shadow-xl dark:bg-gray-900">
                <div className="h-2 w-full bg-[#fba635]" />
                <CardHeader>
                  <CardTitle className="text-xl">Ikuti Event Ini</CardTitle>
                  <CardDescription>
                    Daftarkan usaha Anda dan dapatkan kesempatan emas!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-3 text-orange-800 dark:bg-orange-950/30 dark:text-orange-200">
                    <Calendar className="h-5 w-5" />
                    <div className="text-sm font-medium">
                      {isRegistrationOpen
                        ? 'Pendaftaran sedang dibuka!'
                        : 'Pendaftaran ditutup'}
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <Button
                      className="h-12 w-full rounded-xl bg-[#fba635] text-lg font-bold text-white shadow-lg shadow-orange-200 hover:bg-[#fa9e25] dark:shadow-none"
                      onClick={handleRegister}
                      disabled={!isRegistrationOpen}
                    >
                      {isRegistrationOpen ? 'Daftar Sekarang' : 'Event Ditutup'}
                    </Button>
                  ) : (
                    <Button
                      className="h-12 w-full rounded-xl bg-[#fba635] text-white hover:bg-[#fa9e25]"
                      asChild
                    >
                      <Link
                        href={`${ROUTES.LOGIN}?redirect=/marketplace/${eventId}/register`}
                      >
                        <LogIn className="mr-2 h-4 w-4" /> Login untuk Daftar
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quota Stats */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Kuota Peserta</span>
                  <span className="text-[#174c4e]">
                    {approvedBusinesses.length} / {event.kuotaPeserta}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${participationRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r from-[#174c4e] to-[#fba635]`}
                  />
                </div>
                <p className="text-center text-xs text-gray-500">
                  {event.kuotaPeserta - approvedBusinesses.length} slot tersisa
                </p>
              </CardContent>
            </Card>

            {/* Share */}
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" /> Bagikan Event
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
