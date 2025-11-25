'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Store,
  TrendingUp,
  Award,
  Users,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: 'Manajemen Event',
    description:
      'Kelola event marketplace/bazaar dengan mudah, mulai dari pendaftaran hingga penilaian peserta.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Store,
    title: 'Marketplace',
    description:
      'Platform bagi mahasiswa dan UMKM untuk mengikuti event bazaar dan mengembangkan usaha.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Pembinaan UMKM',
    description:
      'Program pembinaan bertahap untuk UMKM, dari ide bisnis hingga marketing dan legalitas.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Award,
    title: 'Sistem Penilaian',
    description:
      'Penilaian terstruktur untuk peserta event dengan berbagai kategori dan kriteria.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Users,
    title: 'Pendampingan Dosen',
    description:
      'Dosen dapat mendampingi dan memvalidasi usaha mahasiswa yang mengikuti event.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description:
      'Dashboard lengkap dengan visualisasi data dan laporan yang dapat diekspor.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Fitur Unggulan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Platform lengkap yang dirancang untuk mendukung ekosistem
            kewirausahaan di lingkungan kampus
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full gap-3 p-6 transition-all hover:shadow-lg">
                <div
                  className={`mb-0 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-0 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
