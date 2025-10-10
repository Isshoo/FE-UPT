'use client';

import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#072526] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row md:justify-between lg:gap-40">
          <div className="flex flex-1 flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
            {/* About Section */}
            <div className="w-[80%] space-y-4 lg:w-[50%]">
              <h3 className="text-xl font-bold text-[#fba635]">{APP_NAME}</h3>
              <p className="justify text-sm leading-6 text-gray-300">
                Platform manajemen event bazaar/marketplace dan pembinaan UMKM
                untuk mendukung perkembangan wirausaha mahasiswa dan UMKM lokal.
              </p>
            </div>
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Ikuti Kami</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#fba635]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#fba635]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#fba635]"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-start justify-between gap-10 md:flex-row lg:justify-between lg:gap-20">
            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Menu</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.HOME}
                    className="text-sm text-gray-300 transition-colors hover:text-[#fba635]"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.USER_MARKETPLACE}
                    className="text-sm text-gray-300 transition-colors hover:text-[#fba635]"
                  >
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.USER_UMKM}
                    className="text-sm text-gray-300 transition-colors hover:text-[#fba635]"
                  >
                    UMKM Binaan
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.ABOUT}
                    className="text-sm text-gray-300 transition-colors hover:text-[#fba635]"
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
                  <span>Jl. Kampus De La Salle, Kombos, Manado</span>
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
