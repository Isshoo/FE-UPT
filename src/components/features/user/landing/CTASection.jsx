'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store';

export default function CTASection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fba635] to-[#fdac58] p-12 text-center text-white lg:p-20"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Bergabunglah Dengan Kami
            </div>

            <h2 className="mb-6 text-3xl font-bold lg:text-5xl">
              Siap Mengembangkan Bisnis Anda?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg lg:text-xl">
              Daftar sekarang dan mulai perjalanan kewirausahaan Anda bersama
              UPT-PIK. Dapatkan akses ke event marketplace dan program pembinaan
              UMKM.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {!isAuthenticated ? (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-lg text-[#174c4e] hover:bg-gray-100"
                  >
                    <Link href={ROUTES.REGISTER}>
                      Daftar Sekarang
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white text-lg text-white hover:bg-white/10"
                  >
                    <Link href={ROUTES.LOGIN}>Login</Link>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-lg text-[#174c4e] hover:bg-gray-100"
                >
                  <Link href={ROUTES.ABOUT}>
                    Tentang Kami
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
