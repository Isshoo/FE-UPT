'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#174c4e] text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#fba635]">{APP_NAME}</h3>
            <p className="text-sm text-gray-300">
              Platform manajemen event bazaar/marketplace dan pembinaan UMKM
              untuk mendukung perkembangan wirausaha mahasiswa dan UMKM lokal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Menu</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={ROUTES.HOME}
                  className="text-sm text-gray-300 hover:text-[#fba635] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.USER_MARKETPLACE}
                  className="text-sm text-gray-300 hover:text-[#fba635] transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.USER_UMKM}
                  className="text-sm text-gray-300 hover:text-[#fba635] transition-colors"
                >
                  UMKM Binaan
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="text-sm text-gray-300 hover:text-[#fba635] transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="h-5 w-5 flex-shrink-0 text-[#fba635]" />
                <span>Jl. Kampus UNSRAT, Bahu, Manado</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-5 w-5 text-[#fba635]" />
                <span>+62 xxx xxxx xxxx</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-5 w-5 text-[#fba635]" />
                <span>info@uptpik.ac.id</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#fba635] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#fba635] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#fba635] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-300">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}