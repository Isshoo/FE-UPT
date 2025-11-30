'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#174c4e] via-[#072526] to-[#174c4e] py-20 text-white lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#fba635] blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#fdac58] blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fba635]/20 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-[#fba635]" />
              Platform Manajemen UMKM & Event
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold lg:text-6xl">
              Kembangkan Bisnis Anda Bersama{' '}
              <span className="text-[#fba635]">UPT-PIK</span>
            </h1>

            <p className="mb-8 text-lg text-gray-300 lg:text-xl">
              Platform terpadu untuk manajemen event marketplace, pembinaan
              UMKM, dan pengembangan usaha mahasiswa di lingkungan kampus.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[#fba635] text-lg hover:bg-[#fdac58]"
              >
                <Link href={ROUTES.USER_MARKETPLACE}>
                  Mulai Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {/* <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-lg text-black hover:bg-white/10 hover:text-white dark:text-white"
              >
                <Link href={ROUTES.ABOUT}>Pelajari Lebih Lanjut</Link>
              </Button> */}
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#fba635]/20 to-transparent p-8">
              <div className="grid h-full grid-cols-2 gap-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="mb-2 text-3xl">🏪</div>
                  <p className="text-sm font-medium">Event Marketplace</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="mt-8 rounded-xl bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="mb-2 text-3xl">📊</div>
                  <p className="text-sm font-medium">Analytics</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="mb-2 text-3xl">🎯</div>
                  <p className="text-sm font-medium">Pembinaan UMKM</p>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  className="mt-8 rounded-xl bg-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="mb-2 text-3xl">🏆</div>
                  <p className="text-sm font-medium">Penilaian</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
