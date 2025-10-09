import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { ArrowRight, Store, Briefcase, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#174c4e] to-[#072526] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Wujudkan Potensi
              <span className="text-[#fba635]"> Wirausaha</span> Anda
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Platform terintegrasi untuk manajemen event bazaar/marketplace dan
              pembinaan UMKM yang mendukung perkembangan wirausaha mahasiswa dan
              UMKM lokal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#fba635] hover:bg-[#fdac58] text-white"
              >
                <Link href={ROUTES.USER_MARKETPLACE}>
                  Jelajahi Marketplace
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-black hover:text-[#fdac58] hover:bg-white/10"
              >
                <Link href={ROUTES.ABOUT}><p >Pelajari Lebih Lanjut</p></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Layanan Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan untuk mendukung perkembangan
              bisnis Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-[#fba635]/10 flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-[#fba635]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Event Marketplace
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ikuti berbagai event bazaar dan marketplace untuk
                mempromosikan produk Anda
              </p>
              <Link
                href={ROUTES.USER_MARKETPLACE}
                className="text-[#fba635] hover:text-[#fdac58] font-medium inline-flex items-center"
              >
                Lihat Event
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-[#174c4e]/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-[#174c4e]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Pembinaan UMKM
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Daftarkan UMKM Anda dan dapatkan pembinaan bertahap dari ide
                hingga pemasaran
              </p>
              <Link
                href={ROUTES.USER_UMKM}
                className="text-[#174c4e] hover:text-[#072526] font-medium inline-flex items-center"
              >
                Daftar UMKM
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-[#b81202]/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-[#b81202]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Monitoring Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pantau perkembangan bisnis Anda melalui sistem pembinaan
                terstruktur
              </p>
              <Link
                href={ROUTES.ABOUT}
                className="text-[#b81202] hover:text-[#8a0e01] font-medium inline-flex items-center"
              >
                Pelajari Lebih
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#fba635]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Memulai Perjalanan Wirausaha Anda?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas wirausaha kami dan kembangkan bisnis
            Anda bersama UPT-PIK
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-[#fba635] hover:bg-gray-100"
          >
            <Link href={ROUTES.REGISTER}>Daftar Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}