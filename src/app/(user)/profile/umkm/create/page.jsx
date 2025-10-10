'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { umkmAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { ROUTES, KATEGORI_USAHA } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateUmkmPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: '',
    namaPemilik: '',
    alamat: '',
    telepon: '',
  });

  if (!isAuthenticated) {
    router.push(`${ROUTES.LOGIN}?redirect=/umkm/create`);
    return null;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama || !formData.kategori || !formData.deskripsi) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }

    try {
      setSubmitting(true);
      const response = await umkmAPI.createUmkm(formData);
      toast.success('UMKM berhasil didaftarkan!');
      router.push(`/profile/umkm/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mendaftarkan UMKM');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push('/profile?tab=umkm')}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <h1 className="mb-2 text-3xl font-bold">Daftarkan UMKM Baru</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lengkapi informasi UMKM Anda untuk mengikuti program pembinaan
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p className="font-semibold">ℹ️ Informasi Program Pembinaan:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Program pembinaan terdiri dari 4 tahap</li>
              <li>Setiap tahap memerlukan validasi dari admin</li>
              <li>Anda dapat melacak progress pembinaan secara real-time</li>
              <li>Gratis dan terbuka untuk semua pelaku UMKM</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Usaha</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">
                    Nama UMKM <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama"
                    placeholder="e.g., Kopi Manado Asli"
                    value={formData.nama}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori">
                    Kategori Usaha <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.kategori}
                    onValueChange={(value) => handleChange('kategori', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {KATEGORI_USAHA.map((kategori) => (
                        <SelectItem key={kategori} value={kategori}>
                          {kategori}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">
                  Deskripsi Usaha <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Deskripsikan usaha Anda..."
                  value={formData.deskripsi}
                  onChange={(e) => handleChange('deskripsi', e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informasi Pemilik</h3>

              <div className="space-y-2">
                <Label htmlFor="namaPemilik">
                  Nama Pemilik <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="namaPemilik"
                  placeholder="Nama lengkap pemilik"
                  value={formData.namaPemilik}
                  onChange={(e) => handleChange('namaPemilik', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">
                  Alamat <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat lengkap usaha..."
                  value={formData.alamat}
                  onChange={(e) => handleChange('alamat', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telepon">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telepon"
                  type="tel"
                  placeholder="e.g., 081234567890"
                  value={formData.telepon}
                  onChange={(e) => handleChange('telepon', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#fba635] hover:bg-[#fdac58]"
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? 'Memproses...' : 'Daftarkan UMKM'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
