'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';

export default function ContactSection() {
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
          <h2 className="mb-4 text-3xl font-bold">Hubungi Kami</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fba635]/20">
                <MapPin className="h-6 w-6 text-[#fba635]" />
              </div>
              <h3 className="mb-2 font-semibold">Alamat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Universitas DLSM
                <br />
                Manado, Sulawesi Utara
                <br />
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#174c4e]/20">
                <Mail className="h-6 w-6 text-[#174c4e]" />
              </div>
              <h3 className="mb-2 font-semibold">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                info@upt-pik.ac.id
                <br />
                support@upt-pik.ac.id
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#fba635]/20">
                <Phone className="h-6 w-6 text-[#fba635]" />
              </div>
              <h3 className="mb-2 font-semibold">Telepon</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +62 (431) 891-031
                <br />
                +62 812-3456-7890
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#174c4e]/20">
                <Globe className="h-6 w-6 text-[#174c4e]" />
              </div>
              <h3 className="mb-2 font-semibold">Website</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                www.ukdlsm.ac.id
                <br />
                www.upt-pik.ac.id
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
