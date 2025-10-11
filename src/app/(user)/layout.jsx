import { Header, Footer } from '@/components/layout';
import ScrollToTop from '@/components/ui/ScrollToTop';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
