import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
// import BackButton from '@/components/ui/BackButton';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#174c4e] to-[#072526] p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#fba635] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-300 mb-8 max-w-md">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan periksa
          kembali URL atau kembali ke halaman utama.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#fba635] hover:bg-[#fdac58]"
          >
            <Link href={ROUTES.HOME}>
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Home
            </Link>
          </Button>
          {/* <BackButton /> */}
        </div>
      </div>
    </div>
  );
}