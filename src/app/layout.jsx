import { Oxygen } from 'next/font/google';
import '../styles/globals.css';
import {
  ThemeProvider,
  ToastProvider,
  AuthProvider,
} from '@/components/providers';

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'UPT-PIK | Platform Manajemen UMKM & Event Marketplace',
    template: '%s | UPT-PIK',
  },
  description:
    'Platform terpadu untuk manajemen event marketplace, pembinaan UMKM, dan pengembangan usaha mahasiswa di Universitas Katolik De La Salle Manado.',
  keywords: [
    'UPT-PIK',
    'UMKM',
    'Marketplace',
    'Bazaar',
    'Kewirausahaan',
    'Universitas Katolik De La Salle Manado',
    'Inkubator Bisnis',
  ],
  authors: [{ name: 'UPT-PIK UKDLSM' }],
  creator: 'UPT-PIK UKDLSM',
  publisher: 'UPT-PIK UKDLSM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'UPT-PIK | Platform Manajemen UMKM & Event Marketplace',
    description:
      'Platform terpadu untuk manajemen event marketplace dan pembinaan UMKM',
    type: 'website',
    locale: 'id_ID',
    siteName: 'UPT-PIK',
    // images: [
    //   {
    //     url: '/images/banner.png',
    //     width: 800,
    //     height: 600,
    //     alt: 'UPT-PIK',
    //   },
    // ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UPT-PIK | Platform Manajemen UMKM & Event Marketplace',
    description:
      'Platform terpadu untuk manajemen event marketplace dan pembinaan UMKM',
    // images: [
    //   {
    //     url: '/images/banner.png',
    //     width: 800,
    //     height: 600,
    //     alt: 'UPT-PIK',
    //   },
    // ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={oxygen.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
