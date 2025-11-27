'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { marketplaceAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
  BUSINESS_TYPE_LABELS,
  ROUTES,
  ROLES,
} from '@/lib/constants';
import { formatDateTime } from '@/lib/utils';
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
  FileText,
  Trophy,
  LogIn,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function UserEventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  const { isAuthenticated, user } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRegistration, setUserRegistration] = useState(null);

  useEffect(() => {
    fetchEventDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await marketplaceAPI.getEventById(eventId);
      setEvent(response.data);
      console.log('Event Data:', response.data);

      // Check user registration after getting event data
      if (isAuthenticated && user?.role === ROLES.USER && response.data) {
        checkUserRegistration(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat detail event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = (eventData) => {
    // Cek apakah user sudah mendaftar di event ini
    if (eventData && eventData.usaha && user) {
      const userBusiness = eventData.usaha.find(
        (usaha) => usaha.pemilik.id === user.id
      );

      setUserRegistration(userBusiness || null);
    } else {
      setUserRegistration(null);
    }
  };

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
      userRegistration.disetujui === false ? 'PENDING' : 'APPROVED';

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
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
          <Link href="/marketplace">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>
    );
  }

  const isRegistrationOpen =
    event.status === 'TERBUKA' &&
    new Date() >= new Date(event.mulaiPendaftaran) &&
    new Date() <= new Date(event.akhirPendaftaran);
  const isEventCompleted = event.status === 'SELESAI';
  const approvedBusinesses = event.usaha?.filter((b) => b.disetujui) || [];
  const canRegister = isRegistrationOpen && !userRegistration;

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/marketplace')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Marketplace
        </Button>

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold md:text-4xl">{event.nama}</h1>
              {isRegistrationOpen && (
                <Badge className={EVENT_STATUS_COLORS['TERBUKA']}>
                  {EVENT_STATUS_LABELS['TERBUKA']}
                </Badge>
              )}
              {userRegistration && getRegistrationStatusBadge()}
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {event.deskripsi}
            </p>
          </div>
        </div>
      </div>

      {/* User Registration Status */}
      {userRegistration && (
        <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="pt-0">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-500 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">
                  Status Pendaftaran Anda
                </h3>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Usaha: <strong>{userRegistration.namaProduk}</strong>
                </p>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Kategori: <strong>{userRegistration.kategori}</strong>
                </p>
                {userRegistration.disetujui === false && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pendaftaran Anda sedang menunggu persetujuan dari admin.
                  </p>
                )}
                {userRegistration.disetujui === true && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selamat! Pendaftaran Anda telah disetujui.
                    {userRegistration.nomorBooth && (
                      <>
                        {' '}
                        Nomor booth:{' '}
                        <strong>{userRegistration.nomorBooth}</strong>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Info */}
      {isRegistrationOpen && !userRegistration && (
        <Card className="border-2 border-[#fba635] bg-orange-50 dark:bg-orange-950">
          <CardContent className="flex flex-col gap-4 pt-0 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-[#fba635] p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">
                  Pendaftaran Dibuka!
                </h3>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Periode pendaftaran:{' '}
                  <strong>{formatDateTime(event.mulaiPendaftaran)}</strong> s/d{' '}
                  <strong>{formatDateTime(event.akhirPendaftaran)}</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jangan lewatkan kesempatan untuk ikut serta dalam event ini!
                </p>
              </div>
            </div>
            <div className="flex w-full items-end justify-end md:w-auto md:justify-end">
              {isAuthenticated ? (
                <>
                  {user?.role === ROLES.USER && (
                    <Button
                      onClick={handleRegister}
                      size="lg"
                      disabled={!canRegister}
                      className="bg-[#fba635] hover:bg-[#fdac58] disabled:opacity-50"
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      Daftar Sekarang
                    </Button>
                  )}
                </>
              ) : (
                <Link
                  href={`${ROUTES.LOGIN}?redirect=/marketplace/${eventId}/register`}
                  className="inline-flex items-center rounded-lg bg-[#fba635] px-4 py-2 text-white hover:bg-[#fdac58]"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login untuk Daftar
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#fba635]" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tanggal Pelaksanaan
                </p>
                <p className="font-semibold">
                  {formatDateTime(event.tanggalPelaksanaan)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-0">
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
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Peserta
                </p>
                <p className="font-semibold">
                  {approvedBusinesses.length} / {event.kuotaPeserta}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-0">
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
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informasi</TabsTrigger>
          <TabsTrigger value="participants">
            Peserta ({approvedBusinesses.length})
          </TabsTrigger>
          <TabsTrigger value="awards">
            Penilaian ({event.kategoriPenilaian?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Detail Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Semester & Tahun Ajaran
                  </p>
                  <p className="font-semibold">
                    {event.semester} {event.tahunAjaran}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kuota Peserta
                  </p>
                  <p className="font-semibold">{event.kuotaPeserta}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsors */}
          {event.sponsor && event.sponsor.length > 0 && (
            <Card className="gap-3">
              <CardHeader>
                <CardTitle>Sponsor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {event.sponsor.map((sponsor) => (
                    <div
                      key={sponsor.id}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4"
                    >
                      {sponsor.logo && (
                        <Image
                          width={100}
                          height={100}
                          src={sponsor.logo}
                          alt={sponsor.nama}
                          className="h-20 w-full object-contain"
                        />
                      )}
                      <p className="text-center text-sm font-semibold">
                        {sponsor.nama}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layout */}
          {event.gambarLayout && (
            <Card className="gap-3">
              <CardHeader>
                <CardTitle>Layout Denah Booth</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  width={800}
                  height={600}
                  src={event.gambarLayout}
                  alt="Layout Denah"
                  className="mx-auto w-full max-w-3xl rounded-lg border"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants">
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>Daftar Peserta</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedBusinesses.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-gray-500">Belum ada peserta terdaftar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Booth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedBusinesses.map((business, index) => (
                        <TableRow key={business.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {business.namaProduk}
                          </TableCell>
                          <TableCell>{business.kategori}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {BUSINESS_TYPE_LABELS[business.tipeUsaha]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {business.nomorBooth ? (
                              <Badge>{business.nomorBooth}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
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

        {/* Awards Tab */}
        <TabsContent value="awards">
          <div className="space-y-6">
            {event.kategoriPenilaian && event.kategoriPenilaian.length > 0 ? (
              event.kategoriPenilaian.map((kategori) => (
                <Card key={kategori.id} className="gap-3">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-[#fba635]" />
                          {kategori.nama}
                        </CardTitle>
                        {kategori.deskripsi && (
                          <CardDescription>
                            {kategori.deskripsi}
                          </CardDescription>
                        )}
                      </div>
                      {kategori.pemenang && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          <Trophy className="mr-1 h-3 w-3" />
                          Ada Pemenang
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Kriteria */}
                      <div>
                        <p className="mb-2 text-sm font-semibold">
                          Kriteria Penilaian:
                        </p>
                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                          {kategori.kriteria?.map((kriteria) => (
                            <div
                              key={kriteria.id}
                              className="rounded border p-2 text-center"
                            >
                              <p className="text-sm font-medium">
                                {kriteria.nama}
                              </p>
                              <p className="text-xs text-gray-500">
                                {kriteria.bobot}%
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Winner */}
                      {kategori.pemenang && isEventCompleted && (
                        <div className="border-t pt-4">
                          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
                            <Trophy className="h-8 w-8 text-yellow-600" />
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Pemenang
                              </p>
                              <p className="text-lg font-bold">
                                {kategori.pemenang.namaProduk}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-gray-500">Belum ada kategori penilaian</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
