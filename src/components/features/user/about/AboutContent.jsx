'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Target, Eye, Award, Users, Sparkles, ArrowRight } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';

export default function AboutContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalPeserta: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getGeneralStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Event Marketplace',
      desc: 'Penyelenggaraan bazaar dan event UMKM',
      color: 'from-[#fba635] to-[#fdac58]',
      iconBg: 'bg-[#fba635]/20',
      iconColor: 'text-[#fba635]',
    },
    {
      icon: Award,
      title: 'Pembinaan UMKM',
      desc: 'Program mentoring bertahap',
      color: 'from-[#174c4e] to-[#0a3738]',
      iconBg: 'bg-[#174c4e]/20',
      iconColor: 'text-[#174c4e]',
    },
    {
      icon: Users,
      title: 'Pendampingan',
      desc: 'Bimbingan dari dosen ahli',
      color: 'from-[#fba635] to-[#174c4e]',
      iconBg: 'bg-[#fba635]/20',
      iconColor: 'text-[#fba635]',
    },
    {
      icon: Eye,
      title: 'Monitoring',
      desc: 'Pemantauan perkembangan usaha',
      color: 'from-[#174c4e] to-[#fba635]',
      iconBg: 'bg-[#174c4e]/20',
      iconColor: 'text-[#174c4e]',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-20 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#174c4e]/20 bg-[#174c4e]/5 px-4 py-2 text-sm font-medium text-[#174c4e] dark:border-[#fba635]/30 dark:bg-[#fba635]/10 dark:text-[#fba635]">
              <Sparkles className="h-4 w-4" />
              Tentang Kami
            </div>

            {/* Title */}
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
              Apa itu{' '}
              <span className="bg-gradient-to-r from-[#174c4e] to-[#fba635] bg-clip-text text-transparent">
                UPT-PIK?
              </span>
            </h2>

            {/* Description */}
            <div className="mb-8 space-y-4 text-gray-600 dark:text-gray-400">
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Unit Pelaksana Teknis - Pusat Inkubator Kewirausahaan
                </span>{' '}
                adalah unit pendukung akademik yang bertugas untuk mengembangkan
                dan membina kewirausahaan di lingkungan kampus.
              </p>
              <p className="leading-relaxed">
                Kami berfokus pada pengembangan jiwa kewirausahaan mahasiswa dan
                masyarakat sekitar melalui program pembinaan, pendampingan, dan
                penyelenggaraan event marketplace.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gradient-to-br from-[#174c4e]/10 to-transparent p-4 text-center">
                <p className="text-2xl font-bold text-[#174c4e] dark:text-[#fba635]">
                  {stats.totalEvents}+
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Event
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-[#fba635]/10 to-transparent p-4 text-center">
                <p className="text-2xl font-bold text-[#fba635]">
                  {stats.totalPeserta}+
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Peserta
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-[#174c4e]/10 to-transparent p-4 text-center">
                <p className="text-2xl font-bold text-[#174c4e] dark:text-[#fba635]">
                  {stats.totalUsers}+
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pengguna
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={index % 2 === 1 ? 'mt-8' : ''}
                >
                  <Card className="group relative overflow-hidden border-0 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800">
                    {/* Gradient accent */}
                    <div
                      className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${feature.color}`}
                    />

                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.iconBg} transition-transform group-hover:scale-110`}
                    >
                      <feature.icon
                        className={`h-7 w-7 ${feature.iconColor}`}
                      />
                    </div>

                    <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.desc}
                    </p>

                    <div className="mt-4 flex items-center text-sm font-medium text-[#174c4e] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#fba635]">
                      Pelajari
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 -z-10 h-32 w-32 rounded-full bg-[#fba635]/20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 -z-10 h-32 w-32 rounded-full bg-[#174c4e]/20 blur-2xl" />
          </motion.div>
        </div>

        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg md:p-12 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                  Sejarah{' '}
                  <span className="text-[#fba635]">Perjalanan Kami</span>
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    UPT-PIK didirikan dengan tujuan untuk menjadi pusat
                    pengembangan kewirausahaan di kampus. Berawal dari kebutuhan
                    untuk memfasilitasi mahasiswa yang memiliki minat dalam
                    berwirausaha.
                  </p>
                  <p>
                    Dengan berkembangnya teknologi, UPT-PIK menghadirkan
                    platform digital untuk memudahkan pengelolaan event
                    marketplace dan pembinaan UMKM secara bertahap dan
                    terstruktur.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-[#174c4e] to-[#0a3738] shadow-2xl">
                    <div className="text-center text-white">
                      <p className="text-4xl font-bold">2003</p>
                      <p className="text-sm opacity-80">Didirikan</p>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#fba635] shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
