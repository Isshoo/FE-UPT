'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Target, Eye, Award, Users } from 'lucide-react';

export default function AboutContent() {
  return (
    <section className="py-20">
      <div className="container mx-auto my-auto px-4">
        {/* Tentang UPT-PIK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-start gap-10">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Apa itu UPT-PIK?</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    Unit Pelaksana Teknis - Pusat Inkubator Kewirausahaan
                    (UPT-PIK) adalah unit pendukung akademik yang bertugas untuk
                    mengembangkan dan membina kewirausahaan di lingkungan
                    Universitas Klabat.
                  </p>
                  <p>
                    UPT-PIK berfokus pada pengembangan jiwa kewirausahaan
                    mahasiswa dan masyarakat sekitar melalui program-program
                    pembinaan, pendampingan, dan penyelenggaraan event
                    marketplace.
                  </p>
                  <p>
                    Melalui platform digital ini, UPT-PIK mempermudah
                    pengelolaan event bazaar/marketplace, pembinaan UMKM
                    bertahap, dan sistem penilaian yang terstruktur untuk
                    mendukung pertumbuhan usaha.
                  </p>
                </div>
              </div>
              <div>
                <h2 className="mb-6 text-3xl font-bold">Sejarah UPT-PIK</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p>
                    UPT-PIK didirikan dengan tujuan untuk menjadi pusat
                    pengembangan kewirausahaan di Universitas Klabat. Berawal
                    dari kebutuhan untuk memfasilitasi mahasiswa yang memiliki
                    minat dalam berwirausaha, UPT-PIK terus berkembang menjadi
                    unit yang tidak hanya melayani mahasiswa tetapi juga
                    masyarakat sekitar.
                  </p>
                  <p>
                    Dengan berkembangnya teknologi dan kebutuhan akan sistem
                    yang terintegrasi, UPT-PIK menghadirkan platform digital
                    untuk memudahkan pengelolaan event marketplace dan pembinaan
                    UMKM secara bertahap dan terstruktur.
                  </p>
                  <p>
                    Hingga saat ini, UPT-PIK telah menyelenggarakan berbagai
                    event bazaar/marketplace dan membina puluhan UMKM dari tahap
                    ide bisnis hingga tahap marketing dan legalitas.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#fba635]/20 to-[#174c4e]/20 lg:aspect-auto xl:aspect-square">
                <div className="grid h-full grid-cols-2 gap-4 p-8 lg:grid-cols-1 xl:grid-cols-2">
                  <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fba635]/20">
                      <Target className="h-6 w-6 text-[#fba635]" />
                    </div>
                    <p className="text-sm font-semibold">Event Marketplace</p>
                  </Card>
                  <Card className="mt-8 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#174c4e]/20">
                      <Award className="h-6 w-6 text-[#174c4e]" />
                    </div>
                    <p className="text-sm font-semibold">Pembinaan UMKM</p>
                  </Card>
                  <Card className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#fba635]/20">
                      <Users className="h-6 w-6 text-[#fba635]" />
                    </div>
                    <p className="text-sm font-semibold">Pendampingan</p>
                  </Card>
                  <Card className="mt-8 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#174c4e]/20">
                      <Eye className="h-6 w-6 text-[#174c4e]" />
                    </div>
                    <p className="text-sm font-semibold">Monitoring</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
