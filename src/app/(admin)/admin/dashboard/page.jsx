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
import StatsCard from '@/components/features/admin/dashboard/StatsCard';
import BarChartCard from '@/components/features/admin/dashboard/BarChartCard';
import PieChartCard from '@/components/features/admin/dashboard/PieChartCard';
import LineChartCard from '@/components/features/admin/dashboard/LineChartCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import DashboardSkeleton from '@/components/features/admin/dashboard/DashboardSkeleton';

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
      <div className="flex min-h-[60vh] items-center justify-center">
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
    <div className="space-y-4">
      {/* Header - Compact */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview statistik UPT-PIK</p>
      </div>

      {/* Stats Cards - Smaller padding & text */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6">
        <StatsCard
          title="Pengguna"
          value={generalStats.totalUsers}
          icon={Users}
          color="blue"
          compact
        />
        <StatsCard
          title="Event"
          value={generalStats.totalEvents}
          icon={Calendar}
          description={`${generalStats.activeEvents} aktif`}
          color="green"
          compact
        />
        <StatsCard
          title="UMKM"
          value={generalStats.totalUmkm}
          icon={Store}
          color="orange"
          compact
        />
        <StatsCard
          title="Peserta"
          value={generalStats.totalPeserta}
          icon={TrendingUp}
          color="purple"
          compact
        />
        <StatsCard
          title="Event Aktif"
          value={generalStats.activeEvents}
          icon={Activity}
          color="teal"
          compact
        />
        <StatsCard
          title="Pending"
          value={generalStats.pendingUmkmValidation}
          icon={Clock}
          description="Validasi UMKM"
          color="red"
          compact
        />
      </div>

      {/* Charts Row 1 - 3 columns for better space usage */}
      <div className="grid gap-4 lg:grid-cols-3">
        <BarChartCard
          title="Peserta per Semester"
          data={marketplaceAnalytics.participantsPerSemester.slice(0, 6)}
          dataKey="count"
          xAxisKey="semester"
          color="#fba635"
          height={240}
        />
        <PieChartCard
          title="Kategori Usaha"
          data={marketplaceAnalytics.categoryDistribution.slice(0, 6)}
          dataKey="count"
          nameKey="kategori"
          height={240}
        />
        <PieChartCard
          title="Jenis Usaha"
          data={marketplaceAnalytics.businessTypeComparison.map((item) => ({
            name: item.type === 'MAHASISWA' ? 'Mahasiswa' : 'UMKM Luar',
            value: item.count,
          }))}
          dataKey="value"
          nameKey="name"
          height={240}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <BarChartCard
          title="Fakultas"
          data={marketplaceAnalytics.facultyComparison.slice(0, 6)}
          dataKey="count"
          xAxisKey="fakultas"
          color="#174c4e"
          height={240}
        />
        <PieChartCard
          title="UMKM per Tahap"
          data={umkmAnalytics.umkmPerStage.map((item) => ({
            name: `Tahap ${item.tahap}`,
            value: item.count,
          }))}
          dataKey="value"
          nameKey="name"
          height={240}
        />
        <Card className="gap-6 p-4">
          <h3 className="text-sm font-semibold">Info Tambahan</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-[#fba635]/10 p-3 text-center">
              <p className="text-3xl font-bold text-[#fba635]">
                {marketplaceAnalytics.approvalRate}%
              </p>
              <p className="mt-1 text-xs text-gray-600">Tingkat Persetujuan</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-gray-600">
                Penyelesaian Tahap UMKM
              </p>
              {umkmAnalytics.stageCompletionRate.map((stage) => (
                <div
                  key={stage.tahap}
                  className="flex items-center justify-between text-xs"
                >
                  <span>Tahap {stage.tahap}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-[#fba635]"
                        style={{ width: `${stage.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="w-8 font-medium">
                      {stage.completionRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Chart - Full width but shorter */}
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
        height={240}
      />

      {/* Recent Activities - More compact */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Events */}
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Event Terbaru</h3>
          <div className="space-y-2">
            {recentActivities.recentEvents.length === 0 ? (
              <p className="text-xs text-gray-500">Belum ada event</p>
            ) : (
              recentActivities.recentEvents.slice(0, 4).map((event) => (
                <Link
                  key={event.id}
                  href={`${ROUTES.ADMIN_MARKETPLACE}/${event.id}`}
                  className="block rounded border p-2 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{event.nama}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Recent Business */}
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">Pendaftaran Terbaru</h3>
          <div className="space-y-2">
            {recentActivities.recentBusinesses.length === 0 ? (
              <p className="text-xs text-gray-500">Belum ada pendaftaran</p>
            ) : (
              recentActivities.recentBusinesses.slice(0, 4).map((business) => (
                <div key={business.id} className="rounded border p-2 text-xs">
                  <p className="truncate font-medium">{business.namaProduk}</p>
                  <p className="truncate text-xs text-gray-600">
                    {business.pemilik.nama}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {business.tipeUsaha === 'MAHASISWA'
                        ? 'Mahasiswa'
                        : 'UMKM'}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(business.createdAt).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'short',
                        }
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent UMKM */}
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-semibold">UMKM Baru</h3>
          <div className="space-y-2">
            {recentActivities.recentUmkm.length === 0 ? (
              <p className="text-xs text-gray-500">Belum ada UMKM</p>
            ) : (
              recentActivities.recentUmkm.slice(0, 4).map((umkm) => (
                <Link
                  key={umkm.id}
                  href={`${ROUTES.ADMIN_UMKM}/${umkm.id}`}
                  className="block rounded border p-2 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <p className="truncate font-medium">{umkm.nama}</p>
                  <p className="truncate text-xs text-gray-600">
                    {umkm.user.nama}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Tahap {umkm.tahapSaatIni}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(umkm.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
