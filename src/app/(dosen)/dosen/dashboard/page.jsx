'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ClipboardCheck,
  Award,
  Clock,
  ChevronRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { assessmentAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';
import toast from 'react-hot-toast';

export default function DosenDashboard() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [mentoredBusinesses, setMentoredBusinesses] = useState([]);
  const [assessmentCategories, setAssessmentCategories] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [businessesRes, categoriesRes] = await Promise.all([
        assessmentAPI.getMentoredBusinesses(),
        assessmentAPI.getCategoriesByDosen(),
      ]);
      setMentoredBusinesses(businessesRes.data || []);
      setAssessmentCategories(categoriesRes.data || []);
      console.log(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const pendingApprovals = mentoredBusinesses.filter(
    (b) => b.status === 'PENDING'
  );
  const approvedBusinesses = mentoredBusinesses.filter(
    (b) => b.status === 'DISETUJUI'
  );

  // Get unique events from mentored businesses
  const uniqueEvents = [
    ...new Map(mentoredBusinesses.map((b) => [b.event.id, b.event])).values(),
  ];

  // Get active assessment events
  const activeAssessmentEvents = [
    ...new Map(
      assessmentCategories
        .filter((c) => c.event.status === 'BERLANGSUNG')
        .map((c) => [c.event.id, c.event])
    ).values(),
  ];

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-[#174c4e] to-[#2a6b6e] p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              {getGreeting()}, {user?.nama?.split(' ')[0] || 'Dosen'}! 👋
            </h1>
            <p className="mt-1 text-white/80">
              Selamat datang di Dashboard Dosen Pembimbing
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link href={ROUTES.DOSEN_PENDAMPINGAN}>
                <Users className="mr-2 h-4 w-4" />
                Pendampingan
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link href={ROUTES.DOSEN_PENILAIAN}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Penilaian
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 py-4">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Bimbingan
                </p>
                <p className="text-2xl font-bold">
                  {mentoredBusinesses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 py-4">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Menunggu Persetujuan
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingApprovals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 py-4">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sudah Disetujui
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {approvedBusinesses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 py-4">
          <CardContent className="pt-0">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Kategori Penilaian
                </p>
                <p className="text-2xl font-bold">
                  {assessmentCategories.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <Card className="gap-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Menunggu Persetujuan
              </CardTitle>
              {pendingApprovals.length > 0 && (
                <Badge className="bg-yellow-500">
                  {pendingApprovals.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p className="text-gray-500">Semua usaha sudah disetujui! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((business) => (
                  <div
                    key={business.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {business.namaProduk}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {business.event.nama}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dosen/pendampingan/${business.event.id}`}>
                        Review
                      </Link>
                    </Button>
                  </div>
                ))}
                {pendingApprovals.length > 5 && (
                  <Button asChild variant="ghost" className="w-full">
                    <Link href={ROUTES.DOSEN_PENDAMPINGAN}>
                      Lihat {pendingApprovals.length - 5} lainnya
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Assessment Events */}
        <Card className="gap-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-purple-500" />
                Event Penilaian Aktif
              </CardTitle>
              {activeAssessmentEvents.length > 0 && (
                <Badge className="bg-purple-500">
                  {activeAssessmentEvents.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeAssessmentEvents.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">
                  Tidak ada event penilaian aktif saat ini
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAssessmentEvents.map((event) => {
                  const categoriesForEvent = assessmentCategories.filter(
                    (c) => c.event.id === event.id
                  );
                  return (
                    <div
                      key={event.id}
                      className="rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{event.nama}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {categoriesForEvent.map((cat) => (
                              <Badge
                                key={cat.id}
                                variant="outline"
                                className="text-xs"
                              >
                                {cat.nama}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link
                            href={`/dosen/penilaian/${event.id}/${categoriesForEvent[0].id}`}
                          >
                            Nilai
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events Summary */}
      {uniqueEvents.length > 0 && (
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Event yang Anda Dampingi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {uniqueEvents.map((event) => {
                const businessCount = mentoredBusinesses.filter(
                  (b) => b.event.id === event.id
                ).length;
                const pendingCount = mentoredBusinesses.filter(
                  (b) => b.event.id === event.id && b.status === 'PENDING'
                ).length;
                return (
                  <Link
                    key={event.id}
                    href={`/dosen/pendampingan/${event.id}`}
                    className="block"
                  >
                    <div className="rounded-lg border p-4 transition-all hover:border-[#fba635] hover:shadow-md">
                      <p className="font-medium">{event.nama}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(event.tanggalPelaksanaan)}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline">{businessCount} Usaha</Badge>
                        {pendingCount > 0 && (
                          <Badge className="bg-yellow-500">
                            {pendingCount} Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
