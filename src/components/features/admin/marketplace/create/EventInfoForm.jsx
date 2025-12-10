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
import { SEMESTER_OPTIONS } from '@/lib/constants/labels';
import { generateTahunAjaranOptions } from '@/lib/constants/tahunAjaran';
import {
  toDatetimeLocal,
  //  getUserTimezone
} from '@/lib/utils/date';
// import { Info } from 'lucide-react';

export default function EventInfoForm({ data, onUpdate }) {
  const tahunAjaranOptions = generateTahunAjaranOptions();
  // const userTimezone = getUserTimezone();

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Timezone Info Banner */}
      {/* <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <div>
          <p className="font-medium">Timezone Anda: {userTimezone}</p>
          <p className="mt-1 text-xs">
            Semua waktu akan disimpan dalam UTC dan ditampilkan sesuai timezone
            Anda
          </p>
        </div>
      </div> */}

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
          <Select
            value={data.tahunAjaran}
            onValueChange={(value) => handleChange('tahunAjaran', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahun ajaran" />
            </SelectTrigger>
            <SelectContent>
              {tahunAjaranOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lokasi */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lokasi">
            Lokasi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lokasi"
            placeholder="e.g., Sporthall Unika De La Salle"
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
            type="datetime-local"
            value={toDatetimeLocal(data.tanggalPelaksanaan)}
            onChange={(e) => handleChange('tanggalPelaksanaan', e.target.value)}
            required
          />
          {/* <p className="text-xs text-gray-500">
            Waktu dalam timezone Anda ({userTimezone})
          </p> */}
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
      </div>
    </div>
  );
}
