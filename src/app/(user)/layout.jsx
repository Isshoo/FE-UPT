import { Header, Footer } from '@/components/common/layout';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ScrollRestoration from '@/components/ui/ScrollRestoration';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
