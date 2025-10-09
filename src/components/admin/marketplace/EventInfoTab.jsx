'use client';

import { useState } from 'react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  MapPin,
  Users,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { marketplaceAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EventInfoTab({ event, onRefresh }) {
  const [uploadingLayout, setUploadingLayout] = useState(false);

  const handleUploadLayout = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    try {
      setUploadingLayout(true);
      await marketplaceAPI.uploadLayout(event.id, file);
      toast.success('Layout berhasil diupload');
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal upload layout');
    } finally {
      setUploadingLayout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Semester & Tahun Ajaran
              </p>
              <p className="font-semibold">
                {event.semester} {event.tahunAjaran}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lokasi</p>
              <p className="font-semibold">{event.lokasi}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tanggal Pelaksanaan
              </p>
              <p className="font-semibold">
                {formatDate(event.tanggalPelaksanaan)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kuota Peserta
              </p>
              <p className="font-semibold">{event.kuotaPeserta}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pendaftaran Dibuka
              </p>
              <p className="font-semibold">
                {formatDate(event.mulaiPendaftaran)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pendaftaran Ditutup
              </p>
              <p className="font-semibold">
                {formatDate(event.akhirPendaftaran)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsors */}
      {event.sponsor && event.sponsor.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sponsor ({event.sponsor.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {event.sponsor.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4"
                >
                  {sponsor.logo ? (
                    <img
                      src={sponsor.logo}
                      alt={sponsor.nama}
                      className="h-20 w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <p className="text-center text-sm font-semibold">
                    {sponsor.nama}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Layout Denah */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Denah Booth</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.gambarLayout ? (
            <div className="space-y-4">
              <img
                src={event.gambarLayout}
                alt="Layout Denah"
                className="w-full max-w-2xl rounded-lg border"
              />
              {!event.terkunci && (
                <div>
                  <Label htmlFor="updateLayout" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-[#fba635] hover:text-[#fdac58]">
                      <Upload className="h-4 w-4" />
                      Update Layout
                    </div>
                  </Label>
                  <Input
                    id="updateLayout"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLayout}
                    disabled={uploadingLayout || event.terkunci}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed p-12 text-center">
              {!event.terkunci ? (
                <>
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Belum ada layout denah diupload
                  </p>
                  <Label htmlFor="uploadLayout">
                    <Button
                      disabled={uploadingLayout}
                      className="bg-[#fba635] hover:bg-[#fdac58]"
                      asChild
                    >
                      <span>
                        {uploadingLayout ? 'Uploading...' : 'Upload Layout'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="uploadLayout"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadLayout}
                    disabled={uploadingLayout}
                    className="hidden"
                  />
                </>
              ) : (
                <p className="text-gray-500">Belum ada layout denah</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
