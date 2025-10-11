'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Store,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import { dashboardAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import StatsCard from '@/components/admin/dashboard/StatsCard';
import BarChartCard from '@/components/admin/dashboard/BarChartCard';
import PieChartCard from '@/components/admin/dashboard/PieChartCard';
import LineChartCard from '@/components/admin/dashboard/LineChartCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import DashboardSkeleton from '@/components/admin/dashboard/DashboardSkeleton';

export default function AdminDashboard() {
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Gagal memuat data dashboard</p>
      </div>
    );
  }

  const {
    generalStats,
    marketplaceAnalytics,
    umkmAnalytics,
    growthAnalytics,
    recentActivities,
  } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Overview statistik dan analytics UPT-PIK
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Pengguna"
          value={generalStats.totalUsers}
          icon={Users}
          description="Pengguna terdaftar"
          color="blue"
        />
        <StatsCard
          title="Total Event"
          value={generalStats.totalEvents}
          icon={Calendar}
          description={`${generalStats.activeEvents} event aktif`}
          color="green"
        />
        <StatsCard
          title="Total UMKM"
          value={generalStats.totalUmkm}
          icon={Store}
          description="UMKM binaan terdaftar"
          color="orange"
        />
        <StatsCard
          title="Total Peserta"
          value={generalStats.totalPeserta}
          icon={TrendingUp}
          description="Peserta marketplace"
          color="purple"
        />
        <StatsCard
          title="Event Aktif"
          value={generalStats.activeEvents}
          icon={Activity}
          description="Sedang berlangsung/terbuka"
          color="teal"
        />
        <StatsCard
          title="Pending Validasi"
          value={generalStats.pendingUmkmValidation}
          icon={Clock}
          description="UMKM menunggu validasi"
          color="red"
        />
      </div>

      {/* Marketplace Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Peserta per Semester"
          data={marketplaceAnalytics.participantsPerSemester}
          dataKey="count"
          xAxisKey="semester"
          color="#fba635"
        />
        <PieChartCard
          title="Kategori Usaha Populer"
          data={marketplaceAnalytics.categoryDistribution}
          dataKey="count"
          nameKey="kategori"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard
          title="Perbandingan Jenis Usaha"
          data={marketplaceAnalytics.businessTypeComparison.map((item) => ({
            name: item.type === 'MAHASISWA' ? 'Mahasiswa' : 'UMKM Luar',
            value: item.count,
          }))}
          dataKey="value"
          nameKey="name"
        />
        <BarChartCard
          title="Perbandingan Fakultas"
          data={marketplaceAnalytics.facultyComparison}
          dataKey="count"
          xAxisKey="fakultas"
          color="#174c4e"
        />
      </div>

      {/* UMKM Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PieChartCard
          title="UMKM per Tahap"
          data={umkmAnalytics.umkmPerStage.map((item) => ({
            name: `Tahap ${item.tahap}`,
            value: item.count,
          }))}
          dataKey="value"
          nameKey="name"
        />
        <BarChartCard
          title="Kategori UMKM"
          data={umkmAnalytics.umkmByCategory}
          dataKey="count"
          xAxisKey="kategori"
          color="#b81202"
        />
      </div>

      {/* Growth Analytics */}
      <LineChartCard
        title="Pertumbuhan Pengguna & UMKM"
        data={growthAnalytics.userGrowth.map((item, index) => ({
          month: item.month,
          users: item.count,
          umkm: growthAnalytics.umkmGrowth[index]?.count || 0,
        }))}
        lines={[
          { dataKey: 'users', name: 'Pengguna' },
          { dataKey: 'umkm', name: 'UMKM' },
        ]}
      />

      {/* Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Events */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Event Terbaru</h3>
          <div className="space-y-3">
            {recentActivities.recentEvents.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada event</p>
            ) : (
              recentActivities.recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`${ROUTES.ADMIN_MARKETPLACE}/${event.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{event.nama}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        event.status === 'TERBUKA'
                          ? 'default'
                          : event.status === 'BERLANGSUNG'
                            ? 'default'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {event.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Recent Business Registrations */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Pendaftaran Terbaru</h3>
          <div className="space-y-3">
            {recentActivities.recentBusinesses.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada pendaftaran</p>
            ) : (
              recentActivities.recentBusinesses.map((business) => (
                <div key={business.id} className="rounded-lg border p-3">
                  <p className="font-medium">{business.namaProduk}</p>
                  <p className="text-xs text-gray-600">
                    {business.pemilik.nama}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {business.tipeUsaha === 'MAHASISWA'
                        ? 'Mahasiswa'
                        : 'UMKM Luar'}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent UMKM Registrations */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">UMKM Terdaftar Baru</h3>
          <div className="space-y-3">
            {recentActivities.recentUmkm.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada UMKM terdaftar</p>
            ) : (
              recentActivities.recentUmkm.map((umkm) => (
                <Link
                  key={umkm.id}
                  href={`${ROUTES.ADMIN_UMKM}/${umkm.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <p className="font-medium">{umkm.nama}</p>
                  <p className="text-xs text-gray-600">{umkm.user.nama}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Tahap {umkm.tahapSaatIni}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(umkm.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Tingkat Persetujuan</h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-[#fba635]">
              {marketplaceAnalytics.approvalRate}%
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Persentase peserta yang disetujui
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Tingkat Penyelesaian Tahap UMKM
          </h3>
          <div className="space-y-2">
            {umkmAnalytics.stageCompletionRate.map((stage) => (
              <div
                key={stage.tahap}
                className="flex items-center justify-between"
              >
                <span className="text-sm">Tahap {stage.tahap}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-[#fba635]"
                      style={{ width: `${stage.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {stage.completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
