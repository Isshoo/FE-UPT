'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Store,
  Briefcase,
  TrendingUp,
  ChevronDown,
  Zap,
  Users,
  Award,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === statsRef.current) {
            setStatsVisible(true);
          } else if (entry.target === featuresRef.current) {
            setFeaturesVisible(true);
          } else if (entry.target === ctaRef.current) {
            setCtaVisible(true);
          }
        }
      });
    }, observerOptions);

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#174c4e] via-[#0a3738] to-[#072526]">
        {/* Hero Image Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpeg"
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#174c4e]/80 via-[#0a3738]/70 to-[#072526]/80"></div>
        </div>

        {/* Animated Overlay Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -left-48 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"></div>
          <div
            className="absolute -right-48 -bottom-48 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div
            className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <div className="mb-6 inline-block rounded-full border border-[#fba635]/30 bg-[#fba635]/20 px-4 py-2 backdrop-blur-sm">
              <span className="font-semibold text-[#fba635]">
                ✨ Platform Wirausaha Terpadu
              </span>
            </div>

            <h1 className="mb-6 text-5xl leading-tight font-bold text-white drop-shadow-lg md:text-7xl">
              Wujudkan Potensi
              <span className="mt-2 block bg-gradient-to-r from-[#fba635] to-[#fdac58] bg-clip-text text-transparent">
                Wirausaha Anda
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-200 drop-shadow-md">
              Platform terintegrasi untuk manajemen event bazaar/marketplace dan
              pembinaan UMKM yang mendukung perkembangan wirausaha mahasiswa dan
              UMKM lokal.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="group transform bg-[#fba635] text-white transition-all hover:scale-105 hover:bg-[#fdac58] hover:shadow-2xl"
              >
                <Link
                  href={ROUTES.USER_MARKETPLACE}
                  className="flex items-center"
                >
                  Jelajahi Marketplace
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="transform border-white/30 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20"
              >
                <Link href={ROUTES.ABOUT}>Pelajari Lebih Lanjut</Link>
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center">
              <ChevronDown className="h-8 w-8 animate-bounce text-white/80 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="bg-gradient-to-b from-white to-gray-50 pt-10 pb-24 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4">
          <div
            className={`mb-16 text-center transition-all duration-700 ${
              featuresVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="mb-10 inline-block rounded-full bg-[#fba635]/10 px-4 py-2">
              <span className="font-semibold text-[#fba635]">Layanan Kami</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-[#174c4e] md:text-5xl dark:text-white">
              Solusi Lengkap untuk Bisnis Anda
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
              Berbagai layanan terintegrasi untuk mendukung pertumbuhan bisnis
              Anda
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: Store,
                title: 'Event Marketplace',
                description:
                  'Ikuti berbagai event bazaar dan marketplace untuk mempromosikan produk Anda kepada ribuan pelanggan potensial',
                link: ROUTES.USER_MARKETPLACE,
                linkText: 'Lihat Event',
                bgColor: 'bg-[#fba635]/10',
                hoverColor: 'hover:border-[#fba635]',
                textColor: 'text-[#fba635]',
              },
              {
                icon: Briefcase,
                title: 'Pembinaan UMKM',
                description:
                  'Daftarkan UMKM Anda dan dapatkan pembinaan bertahap dari ide hingga pemasaran dengan mentor berpengalaman',
                link: ROUTES.USER_UMKM,
                linkText: 'Daftar UMKM',
                bgColor: 'bg-[#174c4e]/10',
                hoverColor: 'hover:border-[#174c4e]',
                textColor: 'text-[#174c4e]',
              },
              {
                icon: TrendingUp,
                title: 'Monitoring Progress',
                description:
                  'Pantau perkembangan bisnis Anda secara real-time melalui sistem pembinaan terstruktur dan terukur',
                link: ROUTES.ABOUT,
                linkText: 'Pelajari Lebih',
                bgColor: 'bg-[#b81202]/10',
                hoverColor: 'hover:border-[#b81202]',
                textColor: 'text-[#b81202]',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl border-2 border-gray-100 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 ${feature.hoverColor} transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                  featuresVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 10}ms` }}
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center ${feature.bgColor} mb-6 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.textColor}`} />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-[#174c4e] dark:text-white">
                  {feature.title}
                </h3>

                <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                <Link
                  href={feature.link}
                  className={`group/btn inline-flex items-center font-semibold ${feature.textColor} transition-all hover:gap-2`}
                >
                  {feature.linkText}
                  <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </Link>

                <div
                  className={`absolute inset-0 ${feature.bgColor} rounded-2xl opacity-0 transition-opacity group-hover:opacity-100`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-gradient-to-br from-[#174c4e] via-[#0a3738] to-[#072526] py-24"
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"></div>
          <div
            className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-[#fba635]/20 blur-3xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div
            className={`mx-auto max-w-3xl transition-all duration-700 ${
              ctaVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Siap Memulai Perjalanan Wirausaha Anda?
            </h2>
            <p className="mb-10 text-xl text-white/90">
              Bergabunglah dengan komunitas wirausaha kami dan kembangkan bisnis
              Anda bersama UPT-PIK
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
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Link href={ROUTES.ABOUT}>Hubungi Kami</Link>
              </Button>
            </div>

            <div
              className={`mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80 transition-all duration-700 ${
                ctaVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#fba635]" />
                <span>Ide Bisnis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#fba635]" />
                <span>Relasi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#fba635]" />
                <span>Marketing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        className="relative bg-white pt-15 pb-15 dark:bg-gray-900"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: '500+', label: 'UMKM Terdaftar', icon: Users },
              { number: '150+', label: 'Event Sukses', icon: Award },
              { number: '95%', label: 'Kepuasan', icon: CheckCircle },
              { number: '1000+', label: 'Transaksi', icon: Zap },
            ].map((stat, index) => (
              <div
                key={index}
                className={`transform text-center transition-all duration-700 hover:scale-110 ${
                  statsVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex h-16 w-16 transform items-center justify-center rounded-2xl bg-gradient-to-br from-[#fba635] to-[#fdac58] shadow-lg transition-transform hover:rotate-12">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-2 text-2xl font-bold text-[#174c4e] dark:text-white">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
