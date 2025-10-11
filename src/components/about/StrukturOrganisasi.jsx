'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone } from 'lucide-react';

const struktur = [
  {
    jabatan: 'Kepala UPT-PIK',
    nama: 'Dr. John Doe',
    email: 'kepala@upt-pik.ac.id',
    phone: '+62 812-3456-7890',
  },
  {
    jabatan: 'Koordinator Pembinaan UMKM',
    nama: 'Jane Smith, M.M.',
    email: 'koordinator.umkm@upt-pik.ac.id',
    phone: '+62 812-3456-7891',
  },
  {
    jabatan: 'Koordinator Event Marketplace',
    nama: 'Robert Johnson, S.E.',
    email: 'koordinator.event@upt-pik.ac.id',
    phone: '+62 812-3456-7892',
  },
  {
    jabatan: 'Staff Administrasi',
    nama: 'Emily Davis',
    email: 'admin@upt-pik.ac.id',
    phone: '+62 812-3456-7893',
  },
];

export default function StrukturOrganisasi() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold">Struktur Organisasi</h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            Tim profesional yang siap membantu perjalanan kewirausahaan Anda
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {struktur.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 text-center">
                <Avatar className="mx-auto mb-4 h-20 w-20">
                  <AvatarFallback className="bg-[#174c4e] text-xl text-white">
                    {person.nama
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mb-1 text-lg font-semibold">{person.nama}</h3>
                <p className="mb-4 text-sm text-[#fba635]">{person.jabatan}</p>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{person.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{person.phone}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
