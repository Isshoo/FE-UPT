'use client';

import Link from 'next/link';
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { APP_NAME, ROUTES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Description */}
          <div>
            <div className="mb-4 flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#fba635] to-[#fdac58]">
                <span className="text-xl font-bold text-white">U</span>
              </div>
              <span className="ml-2 text-xl font-bold text-[#174c4e] dark:text-[#fba635]">
                {APP_NAME}
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Platform terpadu untuk manajemen event marketplace dan pembinaan
              UMKM di lingkungan kampus.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#fba635] hover:text-white dark:bg-gray-800 dark:text-gray-400"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#fba635] hover:text-white dark:bg-gray-800 dark:text-gray-400"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-[#fba635] hover:text-white dark:bg-gray-800 dark:text-gray-400"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
              Menu
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.HOME}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.USER_MARKETPLACE}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.USER_UMKM}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  UMKM Binaan
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
              Sumber Daya
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.REGISTER}
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  Register
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  Panduan Pengguna
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 transition-colors hover:text-[#fba635] dark:text-gray-400"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>
                  Universitas Katolik De La Salle
                  <br />
                  Manado, Sulawesi Utara 95371
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a
                  href="mailto:info@upt-pik.ac.id"
                  className="hover:text-[#fba635]"
                >
                  info@upt-pik.ac.id
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+624318910031" className="hover:text-[#fba635]">
                  +62 (431) 891-031
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8 dark:border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 md:flex-row dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#fba635]">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#fba635]">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#fba635]">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
