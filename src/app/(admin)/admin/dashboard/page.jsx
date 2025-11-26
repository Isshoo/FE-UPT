'use client';

import { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import StatsCard from '@/components/features/admin/dashboard/StatsCard';
import BarChartCard from '@/components/features/admin/dashboard/BarChartCard';
import PieChartCard from '@/components/features/admin/dashboard/PieChartCard';
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

  const { generalStats, marketplaceAnalytics } = dashboardData;

  return (
    <div className="space-y-4">
      {/* Header - Compact */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview statistik UPT-PIK</p>
      </div>

      {/* Stats Cards - Smaller padding & text */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          title="Peserta"
          value={generalStats.totalPeserta}
          icon={TrendingUp}
          color="purple"
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
          title="Pengguna"
          value={generalStats.totalUsers}
          icon={Users}
          color="blue"
          compact
        />
      </div>

      {/* Charts Row 1 - 3 columns for better space usage */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BarChartCard
          title="Peserta Marketplace per Semester"
          data={marketplaceAnalytics.participantsPerSemester}
          dataKey="count"
          xAxisKey="semester"
          color="#fba635"
          height={300}
        />
        <PieChartCard
          title="Kategori Usaha Peserta Marketplace"
          data={marketplaceAnalytics.categoryDistribution}
          dataKey="count"
          nameKey="kategori"
          height={300}
        />
        <PieChartCard
          title="Jenis Usaha Peserta Marketplace"
          data={marketplaceAnalytics.businessTypeComparison.map((item) => ({
            name: item.type === 'MAHASISWA' ? 'Mahasiswa' : 'UMKM Luar',
            value: item.count,
          }))}
          dataKey="value"
          nameKey="name"
          height={300}
        />
        <BarChartCard
          title="Fakultas Peserta Marketplace (jenis Usaha Mahasiswa)"
          data={marketplaceAnalytics.facultyComparison}
          dataKey="count"
          xAxisKey="fakultas"
          color="#174c4e"
          height={300}
        />
      </div>
    </div>
  );
}
