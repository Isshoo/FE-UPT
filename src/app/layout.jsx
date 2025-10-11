import { Oxygen } from 'next/font/google';
import './globals.css';
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
  title: 'UPT-PIK | Platform Manajemen UMKM & Event Marketplace',
  description:
    'Platform terpadu untuk manajemen event marketplace, pembinaan UMKM, dan pengembangan usaha mahasiswa di Universitas Katolik De La Salle Manado.',
  keywords: [
    'UPT-PIK',
    'UMKM',
    'Marketplace',
    'Bazaar',
    'Kewirausahaan',
    'Universitas Katolik De La Salle Manado',
  ],
  authors: [{ name: 'UPT-PIK UKDLSM' }],
  openGraph: {
    title: 'UPT-PIK | Platform Manajemen UMKM & Event Marketplace',
    description:
      'Platform terpadu untuk manajemen event marketplace dan pembinaan UMKM',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={oxygen.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
