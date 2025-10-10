import { Header, Footer } from '@/components/layout';

export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mb-12 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
