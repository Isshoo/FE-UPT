'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  TrendingUp,
  Store,
  Plus,
  ChevronRight,
  Clock,
  Package,
} from 'lucide-react';
import { dashboardAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/constants/routes';
import { formatDateTime } from '@/lib/utils/date';
import StatsCard from '@/components/features/admin/dashboard/StatsCard';
import BarChartCard from '@/components/features/admin/dashboard/BarChartCard';
import PieChartCard from '@/components/features/admin/dashboard/PieChartCard';
import DashboardSkeleton from '@/components/features/admin/dashboard/DashboardSkeleton';

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getFullDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">Gagal memuat data dashboard</p>
      </div>
    );
  }

  const { generalStats, marketplaceAnalytics, recentActivities } =
    dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-[#174c4e] to-[#2a6b6e] p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">
              {getGreeting()}, {user?.nama?.split(' ')[0] || 'Admin'}! 👋
            </h1>
            <p className="mt-1 text-white/80">
              Selamat datang di Dashboard Admin UPT-PIK
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link href={ROUTES.ADMIN_MARKETPLACE}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Event
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link href={ROUTES.ADMIN_USERS}>
                <Users className="mr-2 h-4 w-4" />
                Kelola User
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard
          title="Total Peserta"
          value={generalStats.totalPeserta}
          icon={TrendingUp}
          color="purple"
          compact
        />
        <StatsCard
          title="Total Event"
          value={generalStats.totalEvents}
          icon={Calendar}
          color="green"
          compact
        />
        <StatsCard
          title="Total Pengguna"
          value={generalStats.totalUsers}
          icon={Users}
          color="blue"
          compact
        />
        <StatsCard
          title="Tingkat Approval"
          value={`${marketplaceAnalytics.approvalRate}%`}
          icon={Store}
          color="orange"
          compact
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Charts - Left Side (2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <BarChartCard
              title="Peserta per Semester"
              data={marketplaceAnalytics.participantsPerSemester}
              dataKey="count"
              xAxisKey="semester"
              color="#fba635"
              height={280}
            />
            <PieChartCard
              title="Kategori Usaha"
              data={marketplaceAnalytics.categoryDistribution}
              dataKey="count"
              nameKey="kategori"
              height={280}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <PieChartCard
              title="Jenis Usaha"
              data={marketplaceAnalytics.businessTypeComparison.map((item) => ({
                name: item.type === 'MAHASISWA' ? 'Mahasiswa' : 'UMKM Luar',
                value: item.count,
              }))}
              dataKey="value"
              nameKey="name"
              height={280}
            />
            <BarChartCard
              title="Usaha per Fakultas"
              data={marketplaceAnalytics.facultyComparison}
              dataKey="count"
              xAxisKey="fakultas"
              color="#174c4e"
              height={280}
            />
          </div>
        </div>

        {/* Recent Activities - Right Side (1 col) */}
        <div className="space-y-6">
          {/* Recent Events */}
          <Card className="gap-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4 text-green-500" />
                  Event Terbaru
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href={ROUTES.ADMIN_MARKETPLACE}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recentActivities?.recentEvents?.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500">
                    Belum ada event
                  </p>
                ) : (
                  recentActivities?.recentEvents?.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {event.nama}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(event.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          event.status === 'BERLANGSUNG'
                            ? 'default'
                            : event.status === 'TERBUKA'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Businesses */}
          <Card className="gap-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-blue-500" />
                  Pendaftaran Terbaru
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recentActivities?.recentBusinesses?.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500">
                    Belum ada pendaftaran
                  </p>
                ) : (
                  recentActivities?.recentBusinesses
                    ?.slice(0, 4)
                    .map((business) => (
                      <div
                        key={business.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {business.namaProduk}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {business.pemilik?.nama} • {business.event?.nama}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {business.tipeUsaha === 'MAHASISWA'
                            ? 'Mahasiswa'
                            : 'UMKM'}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="gap-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={ROUTES.ADMIN_MARKETPLACE}>
                    <Store className="mr-2 h-4 w-4" />
                    Kelola Marketplace
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={ROUTES.ADMIN_USERS}>
                    <Users className="mr-2 h-4 w-4" />
                    Kelola Pengguna
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
