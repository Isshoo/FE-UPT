'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Eye, Target } from 'lucide-react';

export default function VisiMisi() {
  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Visi & Misi</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Komitmen kami dalam mengembangkan ekosistem kewirausahaan
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Visi */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#fba635]/20">
                <Eye className="h-7 w-7 text-[#fba635]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Visi</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Menjadi pusat inkubator kewirausahaan terdepan yang menghasilkan
                wirausahawan muda yang inovatif, mandiri, dan berdaya saing
                tinggi, serta berkontribusi pada pengembangan ekonomi lokal dan
                nasional.
              </p>
            </Card>
          </motion.div>

          {/* Misi */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#174c4e]/20">
                <Target className="h-7 w-7 text-[#174c4e]" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">Misi</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="mt-1 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#174c4e] text-xs text-white">
                    1
                  </span>
                  Menyelenggarakan program pembinaan dan pendampingan
                  kewirausahaan yang berkelanjutan
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#174c4e] text-xs text-white">
                    2
                  </span>
                  Memfasilitasi mahasiswa dan UMKM dalam mengembangkan ide
                  bisnis menjadi usaha yang viable
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#174c4e] text-xs text-white">
                    3
                  </span>
                  Menyediakan platform dan infrastruktur untuk penyelenggaraan
                  event marketplace
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#174c4e] text-xs text-white">
                    4
                  </span>
                  Membangun jejaring kerjasama dengan berbagai pihak untuk
                  mendukung ekosistem kewirausahaan
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
