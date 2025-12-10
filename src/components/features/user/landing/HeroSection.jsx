'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants/routes';
import { marketplaceAPI, dashboardAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils/date';

export default function HeroSection() {
  const [latestEvent, setLatestEvent] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalPeserta: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest event
        const eventsResponse = await marketplaceAPI.getEvents({
          page: 1,
          limit: 10,
        });
        const events = eventsResponse.data || [];
        const openEvent = events.find((event) => event.status === 'TERBUKA');
        if (openEvent) {
          setLatestEvent(openEvent);
        } else {
          setLatestEvent(events[0]);
        }

        // Fetch stats
        const statsResponse = await dashboardAPI.getGeneralStats();
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsData = [
    {
      value: stats.totalEvents,
      label: 'Event',
      icon: Calendar,
    },
    {
      value: stats.totalPeserta,
      label: 'Peserta',
      icon: Users,
    },
    {
      value: stats.totalUsers,
      label: 'Pengguna',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative mt-3 min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#fba635]/20 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-[#174c4e]/20 blur-3xl" />
      </div>

      {/* Gradient Overlay - fades to white (light) / dark (dark mode) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Text & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#174c4e]/20 bg-[#174c4e]/5 px-4 py-2 text-sm font-medium text-[#174c4e] dark:border-[#fba635]/30 dark:bg-[#fba635]/10 dark:text-[#fba635]"
            >
              <Sparkles className="h-4 w-4" />
              Platform Event Marketplace & UMKM
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
            >
              Kembangkan Bisnis
              <br />
              <span className="bg-gradient-to-r from-[#174c4e] to-[#fba635] bg-clip-text text-transparent dark:from-[#fba635] dark:to-[#fdac58]">
                Bersama UPT-PIK
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 max-w-lg text-lg text-gray-600 dark:text-gray-400"
            >
              Platform terpadu untuk manajemen event marketplace dan
              pengembangan usaha mahasiswa di lingkungan kampus.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 flex flex-wrap gap-6"
            >
              {statsData.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#174c4e]/10 dark:bg-[#fba635]/20">
                    <stat.icon className="h-5 w-5 text-[#174c4e] dark:text-[#fba635]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {stat.value}+
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="bg-[#174c4e] text-lg font-semibold hover:bg-[#174c4e]/90 dark:bg-[#fba635] dark:hover:bg-[#fdac58]"
              >
                <Link href={ROUTES.USER_MARKETPLACE}>
                  Jelajahi Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#174c4e]/30 text-lg font-semibold hover:bg-[#174c4e]/5 dark:border-[#fba635]/30 dark:hover:bg-[#fba635]/10"
              >
                <Link href={ROUTES.ABOUT}>Tentang Kami</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Event Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {!loading && latestEvent ? (
              <Card className="gap-0 overflow-hidden border-0 bg-white/80 pt-0 pb-0 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
                {/* Event Cover */}
                <div className="relative h-50 overflow-hidden bg-gradient-to-br from-[#174c4e] to-[#072526]">
                  {latestEvent.gambarCover ? (
                    <Image
                      src={latestEvent.gambarCover}
                      alt={latestEvent.nama}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Store className="h-16 w-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-[#fba635] text-white">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Event Terbuka
                  </Badge>
                </div>

                {/* Event Details */}
                <div className="p-5">
                  {/* Title with status */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-lg leading-tight font-bold text-gray-900 dark:text-white">
                      {latestEvent.nama}
                    </h3>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-[#174c4e] text-[#174c4e] dark:border-[#fba635] dark:text-[#fba635]"
                    >
                      {latestEvent.status}
                    </Badge>
                  </div>

                  {/* Info Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 dark:bg-gray-700/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fba635]/20">
                        <Calendar className="h-4 w-4 text-[#fba635]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tanggal
                        </p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(latestEvent.tanggalPelaksanaan)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5 dark:bg-gray-700/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174c4e]/20 dark:bg-[#fba635]/20">
                        <MapPin className="h-4 w-4 text-[#174c4e] dark:text-[#fba635]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Lokasi
                        </p>
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {latestEvent.lokasi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4 rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-3 dark:border-gray-700 dark:from-gray-800 dark:to-gray-700/50">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#174c4e] dark:text-[#fba635]" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Kuota Peserta
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#174c4e] dark:text-[#fba635]">
                        {latestEvent._count?.usaha || 0} /{' '}
                        {latestEvent.kuotaPeserta}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#174c4e] to-[#fba635] transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            ((latestEvent._count?.usaha || 0) /
                              latestEvent.kuotaPeserta) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-center text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(
                        ((latestEvent._count?.usaha || 0) /
                          latestEvent.kuotaPeserta) *
                          100
                      )}
                      % terisi
                    </p>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#174c4e] to-[#fba635] text-white shadow-lg transition-all hover:opacity-90"
                  >
                    <Link href={`${ROUTES.USER_MARKETPLACE}/${latestEvent.id}`}>
                      Lihat Detail Event
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden border-0 bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#174c4e]/10 dark:bg-[#fba635]/20">
                    <Award className="h-8 w-8 text-[#174c4e] dark:text-[#fba635]" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    Belum Ada Event Terbuka
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-400">
                    Nantikan event marketplace selanjutnya!
                  </p>
                  <Button asChild variant="outline">
                    <Link href={ROUTES.USER_MARKETPLACE}>
                      Lihat Semua Event
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 -z-10 h-32 w-32 rounded-full bg-[#fba635]/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 -z-10 h-32 w-32 rounded-full bg-[#174c4e]/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
