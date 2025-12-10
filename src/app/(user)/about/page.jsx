'use client';

import AboutContent from '@/components/features/user/about/AboutContent';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Lightbulb,
  Award,
  BookOpen,
  Leaf,
  MessageSquare,
  Search,
  Heart,
  ChevronRight,
  Calendar,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import Image from 'next/image';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const missionItems = [
    {
      icon: BookOpen,
      title: 'Pendidikan & Pelatihan',
      text: 'Menyediakan dukungan pendidikan, pelatihan dan jejaring yang berkesinambungan dengan berdasarkan Spiritualitas Lasallian.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Layanan Profesional',
      text: 'Menyediakan layanan bisnis professional dalam kaitan dengan manusia, proses dan teknologi.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Leaf,
      title: 'Lingkungan Berkelanjutan',
      text: 'Meningkatkan kesejahteraan masyarakat di Sulawesi dengan mempromosikan lingkungan hijau dan biru secara berkesinambungan.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: MessageSquare,
      title: 'Konsultasi Kewirausahaan',
      text: 'Menyediakan konsultasi dan panduan kewirausahaan terpercaya untuk mahasiswa, para dosen, alumni dan masyarakat.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Search,
      title: 'Penelitian & Inovasi',
      text: 'Mengadakan penelitian untuk peningkatan pengetahuan dan praktek kewirausahaan di Indonesia.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Heart,
      title: 'Layanan Prima',
      text: 'Menyediakan layanan yang nyaman dan bersahabat bagi pelanggan.',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  const timelineData = [
    {
      year: '2003',
      title: 'Pendirian Inkubator Bisnis',
      desc: 'Awal mula perjalanan sebagai Inkubator Bisnis di lingkungan kampus',
    },
    {
      year: '2014',
      title: 'Transformasi EC-DLSU',
      desc: 'Metamorfosis menjadi Entrepreneurship Centre dengan visi lebih besar',
    },
    {
      year: '2024',
      title: 'Platform Digital',
      desc: 'Launching platform terintegrasi untuk manajemen event UMKM',
    },
  ];

  return (
    <div className="mt-17 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#174c4e] to-[#072526]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="About Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-[#fba635]/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.2, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute -right-48 -bottom-48 h-96 w-96 rounded-full bg-[#fba635]/20 blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#fba635]/30 bg-[#fba635]/20 px-5 py-2.5 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-[#fba635]" />
              <span className="font-semibold text-[#fba635]">Tentang Kami</span>
            </motion.div>

            <h1 className="mb-6 text-4xl leading-tight font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
              UPT Pusat Inovasi dan
              <span className="mt-2 block bg-gradient-to-r from-[#fba635] to-[#fdac58] bg-clip-text text-transparent">
                Kewirausahaan
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-200 drop-shadow-md md:text-xl">
              Membangun ekosistem kewirausahaan yang inovatif dan berkelanjutan
              untuk kemajuan mahasiswa dan masyarakat
            </p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-white to-transparent dark:from-gray-900" />
      </section>

      {/* Profile Section */}
      <AboutContent />

      {/* Vision Section */}
      <section className="bg-gradient-to-br from-[#174c4e] to-[#0a3738] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-5xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fba635]/20 backdrop-blur-sm"
              >
                <Target className="h-10 w-10 text-[#fba635]" />
              </motion.div>
              <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
                Visi Kami
              </h2>
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-12">
                {/* Quote marks */}
                <div className="absolute top-4 left-6 font-serif text-6xl text-[#fba635]/30">
                  "
                </div>
                <p className="relative text-lg leading-relaxed text-white md:text-xl">
                  Entrepreneurship Centre, Universitas Katolik De La Salle ingin
                  menjadi{' '}
                  <span className="font-bold text-[#fba635]">
                    pusat kewirausahaan unggulan di Sulawesi
                  </span>{' '}
                  yang menyediakan keunggulan bisnis dalam mendidik, melatih dan
                  berjejaring dengan budaya adaptif, inovatif dan dapat
                  dipercaya.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fba635]/10">
                <Lightbulb className="h-8 w-8 text-[#fba635]" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-[#174c4e] md:text-4xl dark:text-white">
                Misi Kami
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
                Komitmen kami dalam membangun ekosistem kewirausahaan yang
                berkelanjutan
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {missionItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                >
                  {/* Top gradient accent */}
                  <div
                    className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${item.color}`}
                  />

                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#fba635]/20 to-[#174c4e]/10 transition-transform group-hover:scale-110">
                    <item.icon className="h-7 w-7 text-[#fba635]" />
                  </div>

                  <h3 className="mb-3 font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="border-t bg-gradient-to-b from-slate-100 to-white py-20 dark:border-gray-800 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#174c4e]/10">
              <Calendar className="h-8 w-8 text-[#174c4e]" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-[#174c4e] md:text-4xl dark:text-white">
              Perjalanan Kami
            </h2>
          </motion.div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 left-8 h-full w-0.5 bg-gradient-to-b from-[#fba635] via-[#174c4e] to-[#fba635] md:left-1/2" />

              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -30 : 30,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative mb-12 ${
                    index % 2 === 0
                      ? 'md:mr-auto md:w-[calc(50%-3rem)] md:pr-12 md:text-right'
                      : 'md:ml-auto md:w-[calc(50%-3rem)] md:pl-12'
                  }`}
                >
                  <div className="group relative ml-16 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:border-[#fba635] hover:shadow-2xl md:ml-0 dark:border-gray-700 dark:bg-gray-800">
                    {/* Timeline dot */}
                    <div
                      className={`absolute top-8 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#fba635] to-[#fdac58] shadow-lg ${
                        index % 2 === 0
                          ? '-left-[3.25rem] md:-right-[3.25rem] md:left-auto'
                          : '-left-[3.25rem]'
                      }`}
                    >
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </div>

                    <div className="mb-2 inline-block rounded-full bg-[#fba635]/10 px-3 py-1 text-xl font-bold text-[#fba635]">
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-[#174c4e] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#174c4e]/10">
                <Award className="h-8 w-8 text-[#174c4e]" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-[#174c4e] md:text-4xl dark:text-white">
                Kepemimpinan
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 shadow-xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-800">
              <div className="flex flex-col items-center gap-8 p-8 md:flex-row md:p-12">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#174c4e] to-[#0a3738] shadow-xl">
                      <span className="text-5xl font-bold text-white">DT</span>
                    </div>
                    <div className="absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#fba635] shadow-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="mb-3 inline-block rounded-full bg-[#fba635]/10 px-4 py-1.5">
                    <span className="text-sm font-semibold text-[#fba635]">
                      Kepala UPT
                    </span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-[#174c4e] md:text-3xl dark:text-white">
                    Deiby Neltje Fransisca Tiwow
                  </h3>
                  <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">
                    S.Pd., M.Pd.
                  </p>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                    Memimpin UPT Pusat Inovasi dan Kewirausahaan dengan dedikasi
                    tinggi dalam mengembangkan ekosistem wirausaha mahasiswa dan
                    UMKM lokal.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fba635] via-[#fdac58] to-[#fba635] py-20">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 -left-48 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Mari Bergabung Bersama Kami
            </h2>
            <p className="mb-10 text-lg text-white/90 md:text-xl">
              Jadilah bagian dari komunitas wirausaha yang inovatif dan
              berkembang
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="group transform bg-white text-[#fba635] transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-2xl"
              >
                <Link
                  href={ROUTES.REGISTER}
                  className="flex items-center font-semibold"
                >
                  Daftar Sekarang
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Link href={ROUTES.USER_MARKETPLACE}>Jelajahi Program</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
