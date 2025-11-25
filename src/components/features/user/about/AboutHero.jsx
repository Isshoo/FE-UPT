'use client';

import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#174c4e] via-[#072526] to-[#174c4e] py-20 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#fba635] blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#fdac58] blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
            Tentang <span className="text-[#fba635]">UPT-PIK</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-300 lg:text-xl">
            Unit Pelaksana Teknis - Pusat Inkubator Kewirausahaan (UPT-PIK)
            adalah unit yang berkomitmen untuk mengembangkan ekosistem
            kewirausahaan di lingkungan kampus.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
