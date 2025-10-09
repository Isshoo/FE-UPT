import { Oxygen } from 'next/font/google';
import './globals.css';
import { ThemeProvider, ToastProvider } from '@/components/providers';

const oxygen = Oxygen({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'UPT-PIK - Manajemen Event & UMKM',
  description:
    'Aplikasi manajemen event bazaar/marketplace dan manajemen UMKM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={oxygen.className}>
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}