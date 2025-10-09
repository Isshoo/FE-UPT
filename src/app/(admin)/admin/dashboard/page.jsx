import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, Briefcase, Calendar } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Pengguna',
      value: '245',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Event Marketplace',
      value: '12',
      icon: Calendar,
      color: 'text-[#fba635]',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'UMKM Binaan',
      value: '87',
      icon: Briefcase,
      color: 'text-[#174c4e]',
      bgColor: 'bg-teal-100 dark:bg-teal-950',
    },
    {
      title: 'Peserta Aktif',
      value: '156',
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-950',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selamat datang di panel admin UPT-PIK
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder untuk charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peserta Marketplace per Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Chart akan ditampilkan di sini
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Usaha Populer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400">
              Chart akan ditampilkan di sini
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}