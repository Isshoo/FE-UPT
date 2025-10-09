'use client';

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
import { SEMESTER_OPTIONS } from '@/lib/constants';

export default function EventInfoForm({ data, onUpdate }) {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Nama Event */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nama">
            Nama Event <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nama"
            placeholder="e.g., Bazaar Semester Ganjil 2024/2025"
            value={data.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="deskripsi">
            Deskripsi <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="deskripsi"
            placeholder="Deskripsi event..."
            value={data.deskripsi}
            onChange={(e) => handleChange('deskripsi', e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Semester */}
        <div className="space-y-2">
          <Label htmlFor="semester">
            Semester <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.semester}
            onValueChange={(value) => handleChange('semester', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              {SEMESTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tahun Ajaran */}
        <div className="space-y-2">
          <Label htmlFor="tahunAjaran">
            Tahun Ajaran <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tahunAjaran"
            placeholder="e.g., 2024/2025"
            value={data.tahunAjaran}
            onChange={(e) => handleChange('tahunAjaran', e.target.value)}
            required
          />
        </div>

        {/* Lokasi */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lokasi">
            Lokasi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lokasi"
            placeholder="e.g., Lapangan Parkir UNSRAT"
            value={data.lokasi}
            onChange={(e) => handleChange('lokasi', e.target.value)}
            required
          />
        </div>

        {/* Tanggal Pelaksanaan */}
        <div className="space-y-2">
          <Label htmlFor="tanggalPelaksanaan">
            Tanggal Pelaksanaan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tanggalPelaksanaan"
            type="date"
            value={data.tanggalPelaksanaan}
            onChange={(e) => handleChange('tanggalPelaksanaan', e.target.value)}
            required
          />
        </div>

        {/* Kuota Peserta */}
        <div className="space-y-2">
          <Label htmlFor="kuotaPeserta">
            Kuota Peserta <span className="text-red-500">*</span>
          </Label>
          <Input
            id="kuotaPeserta"
            type="number"
            min="1"
            placeholder="e.g., 50"
            value={data.kuotaPeserta}
            onChange={(e) => handleChange('kuotaPeserta', e.target.value)}
            required
          />
        </div>

        {/* Mulai Pendaftaran */}
        <div className="space-y-2">
          <Label htmlFor="mulaiPendaftaran">
            Mulai Pendaftaran <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mulaiPendaftaran"
            type="date"
            value={data.mulaiPendaftaran}
            onChange={(e) => handleChange('mulaiPendaftaran', e.target.value)}
            required
          />
        </div>

        {/* Akhir Pendaftaran */}
        <div className="space-y-2">
          <Label htmlFor="akhirPendaftaran">
            Akhir Pendaftaran <span className="text-red-500">*</span>
          </Label>
          <Input
            id="akhirPendaftaran"
            type="date"
            value={data.akhirPendaftaran}
            onChange={(e) => handleChange('akhirPendaftaran', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}
