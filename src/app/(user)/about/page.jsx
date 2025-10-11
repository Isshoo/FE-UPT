'use client';

import AboutContent from '@/components/about/AboutContent';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Target,
  Lightbulb,
  Users,
  Award,
  BookOpen,
  Leaf,
  MessageSquare,
  Search,
  Heart,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';

export default function AboutPage() {
  const profileRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const leaderRef = useRef(null);
  const timelineRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [visionVisible, setVisionVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [leaderVisible, setLeaderVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === profileRef.current) setProfileVisible(true);
          else if (entry.target === visionRef.current) setVisionVisible(true);
          else if (entry.target === missionRef.current) setMissionVisible(true);
          else if (entry.target === leaderRef.current) setLeaderVisible(true);
          else if (entry.target === timelineRef.current)
            setTimelineVisible(true);
        }
      });
    }, observerOptions);

    if (profileRef.current) observer.observe(profileRef.current);
    if (visionRef.current) observer.observe(visionRef.current);
    if (missionRef.current) observer.observe(missionRef.current);
    if (leaderRef.current) observer.observe(leaderRef.current);
    if (timelineRef.current) observer.observe(timelineRef.current);

    return () => observer.disconnect();
  }, []);

  const missionItems = [
    {
      icon: BookOpen,
      text: 'Menyediakan dukungan pendidikan, pelatihan dan jejaring yang berkesinambungan dengan berdasarkan Spiritualitas Lasallian.',
    },
    {
      icon: Users,
      text: 'Menyediakan layanan bisnis professional dalam kaitan dengan manusia, proses dan teknologi.',
    },
    {
      icon: Leaf,
      text: 'Meningkatkan kesejahteraan masyarakat di Sulawesi dengan mempromosikan lingkungan hijau dan biru secara berkesinambungan.',
    },
    {
      icon: MessageSquare,
      text: 'Menyediakan konsultasi dan panduan kewirausahaan terpercaya untuk mahasiswa, para dosen, alumni dan masyarakat.',
    },
    {
      icon: Search,
      text: 'Mengadakan penelitian untuk peningkatan pengetahuan dan praktek kewirausahaan di Indonesia.',
    },
    {
      icon: Heart,
      text: 'Menyediakan layanan yang nyaman dan bersahabat bagi pelanggan.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#174c4e] via-[#0a3738] to-[#072526]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="About Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#174c4e]/90 via-[#0a3738]/80 to-[#072526]/90"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -left-48 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"></div>
          <div
            className="absolute -right-48 -bottom-48 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div
            className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-6 inline-block rounded-full border border-[#fba635]/30 bg-[#fba635]/20 px-4 py-2 backdrop-blur-sm">
              <span className="font-semibold text-[#fba635]">Tentang Kami</span>
            </div>

            <h1 className="mb-6 text-5xl leading-tight font-bold text-white drop-shadow-lg md:text-6xl">
              UPT Pusat Inovasi dan
              <span className="mt-2 block bg-gradient-to-r from-[#fba635] to-[#fdac58] bg-clip-text text-transparent">
                Kewirausahaan
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-200 drop-shadow-md">
              Membangun ekosistem kewirausahaan yang inovatif dan berkelanjutan
              untuk kemajuan mahasiswa dan masyarakat
            </p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <AboutContent />

      {/* Timeline Section */}
      <section
        ref={timelineRef}
        className="border-t bg-gradient-to-b from-slate-100 to-white py-20 dark:border-gray-800 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div
            className={`mb-16 text-center transition-all duration-700 ${
              timelineVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#174c4e]/10">
              <Calendar className="h-8 w-8 text-[#174c4e]" />
            </div>
            <h2 className="mb-4 text-4xl font-bold text-[#174c4e] dark:text-white">
              Perjalanan Kami
            </h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 left-8 h-full w-0.5 bg-gradient-to-b from-[#fba635] to-[#174c4e] md:left-1/2"></div>

              {[
                {
                  year: '2003',
                  title: 'Pendirian Inkubator Bisnis',
                  desc: 'Awal mula perjalanan sebagai Inkubator Bisnis',
                },
                {
                  year: '2014',
                  title: 'Transformasi EC-DLSU',
                  desc: 'Metamorfosis menjadi Entrepreneurship Centre',
                },
                {
                  year: '2024',
                  title: 'Platform Digital',
                  desc: 'Launching platform terintegrasi untuk UMKM',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`relative mb-12 transition-all duration-700 ${
                    timelineVisible
                      ? 'translate-x-0 opacity-100'
                      : index % 2 === 0
                        ? '-translate-x-10 opacity-0'
                        : 'translate-x-10 opacity-0'
                  } ${index % 2 === 0 ? 'md:mr-auto md:w-[calc(50%-3rem)] md:pr-12 md:text-right' : 'md:ml-auto md:w-[calc(50%-3rem)] md:pl-12'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:border-[#fba635] hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                    <div className="absolute top-8 -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#fba635] to-[#fdac58] shadow-lg md:-right-4 md:left-auto md:group-odd:right-auto md:group-odd:-left-4">
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                    <div className="mb-2 text-2xl font-bold text-[#fba635]">
                      {item.year}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-[#174c4e] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        ref={visionRef}
        className="bg-gradient-to-br from-[#174c4e] to-[#0a3738] py-20"
      >
        <div className="container mx-auto px-4">
          <div
            className={`mx-auto max-w-5xl transition-all duration-700 ${
              visionVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fba635]/20 backdrop-blur-sm">
                <Target className="h-10 w-10 text-[#fba635]" />
              </div>
              <h2 className="mb-8 text-4xl font-bold text-white">Visi Kami</h2>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-12">
                <p className="text-xl leading-relaxed text-white md:text-2xl">
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
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-700 ${
              missionVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fba635]/10">
                <Lightbulb className="h-8 w-8 text-[#fba635]" />
              </div>
              <h2 className="mb-4 text-4xl font-bold text-[#174c4e] dark:text-white">
                Misi Kami
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                Komitmen kami dalam membangun ekosistem kewirausahaan yang
                berkelanjutan
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {missionItems.map((item, index) => (
                <div
                  key={index}
                  className={`group rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-700 hover:-translate-y-2 hover:border-[#fba635] hover:shadow-2xl dark:border-gray-700 dark:from-gray-800 dark:to-gray-800 ${
                    missionVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#fba635]/10 transition-all group-hover:scale-110 group-hover:rotate-6">
                    <item.icon className="h-7 w-7 text-[#fba635]" />
                  </div>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section
        ref={leaderRef}
        className="bg-gradient-to-b from-slate-100 to-white pt-15 pb-20 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div
            className={`mx-auto max-w-4xl transition-all duration-700 ${
              leaderVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#174c4e]/10">
                <Award className="h-8 w-8 text-[#174c4e]" />
              </div>
              <h2 className="mb-4 text-4xl font-bold text-[#174c4e] dark:text-white">
                Kepemimpinan
              </h2>
            </div>

            <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-xl transition-all hover:shadow-2xl md:p-12 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-shrink-0">
                  <div className="relative h-40 w-40 overflow-hidden rounded-3xl bg-gradient-to-br from-[#174c4e] to-[#0a3738] shadow-xl">
                    <div className="flex h-full items-center justify-center text-5xl font-bold text-white">
                      DT
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 inline-block rounded-full bg-[#fba635]/10 px-4 py-1">
                    <span className="text-sm font-semibold text-[#fba635]">
                      Kepala UPT
                    </span>
                  </div>
                  <h3 className="mb-2 text-3xl font-bold text-[#174c4e] dark:text-white">
                    Deiby Neltje Fransisca Tiwow
                  </h3>
                  <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">
                    S.Pd., M.Pd.
                  </p>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    Memimpin UPT Pusat Inovasi dan Kewirausahaan dengan dedikasi
                    tinggi dalam mengembangkan ekosistem wirausaha mahasiswa dan
                    UMKM lokal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fba635] via-[#fdac58] to-[#fba635] py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-48 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"></div>
          <div
            className="absolute -right-48 bottom-0 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Mari Bergabung Bersama Kami
            </h2>
            <p className="mb-10 text-xl text-white/90">
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
          </div>
        </div>
      </section>
    </div>
  );
}
