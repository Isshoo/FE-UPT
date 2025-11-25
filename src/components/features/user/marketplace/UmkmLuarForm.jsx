'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KATEGORI_USAHA } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function UmkmLuarForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    namaProduk: '',
    kategori: '',
    deskripsi: '',
    namaPemilik: '',
    alamat: '',
    telepon: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.namaProduk ||
      !formData.kategori ||
      !formData.deskripsi ||
      !formData.namaPemilik ||
      !formData.alamat ||
      !formData.telepon
    ) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informasi Produk</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="namaProduk">
              Nama Produk <span className="text-red-500">*</span>
            </Label>
            <Input
              id="namaProduk"
              placeholder="e.g., Keripik Pisang"
              value={formData.namaProduk}
              onChange={(e) => handleChange('namaProduk', e.target.value)}
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
            Deskripsi Produk <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="deskripsi"
            placeholder="Deskripsikan produk Anda..."
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
            placeholder="Nama lengkap pemilik usaha"
            value={formData.namaPemilik}
            onChange={(e) => handleChange('namaPemilik', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat">
            Alamat Usaha <span className="text-red-500">*</span>
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
          disabled={isSubmitting}
          className="flex-1 bg-[#fba635] hover:bg-[#fdac58]"
        >
          {isSubmitting ? 'Memproses...' : 'Daftar Sekarang'}
        </Button>
      </div>
    </form>
  );
}
