'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/utils/date';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Users,
  Clock,
  Building2,
  Sparkles,
} from 'lucide-react';
import { marketplaceAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';
import ImageUploadDialog from './ImageUploadDialog';

export default function EventInfoTab({ event, onRefresh }) {
  const [uploadingLayout, setUploadingLayout] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragOver, setDragOver] = useState({ layout: false, cover: false });

  // Upload Preview State
  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    file: null,
    previewUrl: null,
    type: 'cover', // 'cover' or 'layout'
  });

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadDialog({
      open: true,
      file,
      previewUrl,
      type,
    });

    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver((prev) => ({ ...prev, [type]: false }));

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadDialog({
      open: true,
      file,
      previewUrl,
      type,
    });
  };

  const handleConfirmUpload = async () => {
    const { file, type } = uploadDialog;
    if (!file) return;

    try {
      if (type === 'layout') {
        setUploadingLayout(true);
        await marketplaceAPI.uploadLayout(event.id, file);
        toast.success('Layout berhasil diupload');
      } else {
        setUploadingCover(true);
        await marketplaceAPI.uploadCover(event.id, file);
        toast.success('Cover berhasil diupload');
      }

      handleCloseDialog();
      onRefresh();
    } catch (error) {
      const msg = type === 'layout' ? 'layout' : 'cover';
      toast.error(error.response?.data?.message || `Gagal upload ${msg}`);
    } finally {
      setUploadingLayout(false);
      setUploadingCover(false);
    }
  };

  const handleCloseDialog = () => {
    // Revoke object URL to avoid memory leaks
    if (uploadDialog.previewUrl) {
      URL.revokeObjectURL(uploadDialog.previewUrl);
    }
    setUploadDialog({
      open: false,
      file: null,
      previewUrl: null,
      type: 'cover',
    });
  };

  // Info items configuration
  const infoItems = [
    {
      icon: Calendar,
      label: 'Semester & Tahun Ajaran',
      value: `${event.semester} ${event.tahunAjaran}`,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: MapPin,
      label: 'Lokasi',
      value: event.lokasi,
      color:
        'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      icon: Clock,
      label: 'Tanggal Pelaksanaan',
      value: formatDateTime(event.tanggalPelaksanaan),
      color:
        'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: Users,
      label: 'Kuota Peserta',
      value: `${event.kuotaPeserta} peserta`,
      color:
        'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left Column - Event Details & Sponsors */}
      <div className="space-y-6 lg:col-span-2">
        {/* Event Details */}
        <Card className="overflow-hidden rounded-2xl border-0 pt-0 shadow-md">
          <CardHeader className="border-b bg-gray-50/50 pt-3 dark:bg-gray-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-[#fba635]" />
              Detail Event
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {infoItems.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                >
                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="mt-1 truncate font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sponsors */}
        <Card className="overflow-hidden rounded-2xl border-0 pt-0 shadow-md">
          <CardHeader className="border-b bg-gray-50/50 pt-3 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-[#fba635]" />
                Sponsor
              </CardTitle>
              {event.sponsor && event.sponsor.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-[#fba635]/10 text-[#fba635]"
                >
                  {event.sponsor.length} sponsor
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {event.sponsor && event.sponsor.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {event.sponsor.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-[#fba635] hover:bg-[#fba635]/5 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-[#fba635]/50"
                  >
                    {sponsor.logo ? (
                      <div className="relative h-16 w-full">
                        <Image
                          fill
                          src={sponsor.logo}
                          alt={sponsor.nama}
                          className="object-contain opacity-80 transition-opacity group-hover:opacity-100"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                        <Building2 className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <p className="text-center text-sm font-medium text-gray-700 group-hover:text-[#fba635] dark:text-gray-300">
                      {sponsor.nama}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  Belum ada sponsor untuk event ini
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Media Uploads */}
      <div className="space-y-6">
        {/* Cover Image */}
        <Card className="overflow-hidden rounded-2xl border-0 pt-0 shadow-md">
          <CardHeader className="border-b bg-gray-50/50 pt-3 dark:bg-gray-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5 text-[#fba635]" />
              Cover Event
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {event.gambarCover ? (
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <Image
                    fill
                    src={event.gambarCover}
                    alt="Cover"
                    className="object-cover"
                  />
                </div>
                {!event.terkunci && (
                  <Label htmlFor="updateCover" className="block cursor-pointer">
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#fba635] hover:bg-[#fba635]/5 hover:text-[#fba635] dark:border-gray-700 dark:bg-gray-800">
                      <Upload className="h-4 w-4" />
                      {uploadingCover ? 'Uploading...' : 'Ganti Cover'}
                    </div>
                    <Input
                      id="updateCover"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'cover')}
                      disabled={uploadingCover || event.terkunci}
                      className="hidden"
                    />
                  </Label>
                )}
              </div>
            ) : (
              <div
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragOver.cover
                    ? 'border-[#fba635] bg-[#fba635]/5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onDragOver={(e) => handleDragOver(e, 'cover')}
                onDragLeave={(e) => handleDragLeave(e, 'cover')}
                onDrop={(e) => handleDrop(e, 'cover')}
              >
                {!event.terkunci ? (
                  <>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Drag & drop atau
                    </p>
                    <Label htmlFor="uploadCover" className="justify-center">
                      <span className="cursor-pointer text-sm font-semibold text-[#fba635] hover:underline">
                        pilih file
                      </span>
                      <Input
                        id="uploadCover"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'cover')}
                        disabled={uploadingCover}
                        className="hidden"
                      />
                    </Label>
                    <p className="mt-2 text-xs text-gray-400">
                      PNG, JPG hingga 5MB
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada cover</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Layout Denah */}
        <Card className="overflow-hidden rounded-2xl border-0 pt-0 shadow-md">
          <CardHeader className="border-b bg-gray-50/50 pt-3 dark:bg-gray-900/50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-[#fba635]" />
              Denah Booth
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {event.gambarLayout ? (
              <div className="space-y-3">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <Image
                    fill
                    src={event.gambarLayout}
                    alt="Layout Denah"
                    className="object-contain"
                  />
                </div>
                {!event.terkunci && (
                  <Label
                    htmlFor="updateLayout"
                    className="block cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#fba635] hover:bg-[#fba635]/5 hover:text-[#fba635] dark:border-gray-700 dark:bg-gray-800">
                      <Upload className="h-4 w-4" />
                      {uploadingLayout ? 'Uploading...' : 'Ganti Layout'}
                    </div>
                    <Input
                      id="updateLayout"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'layout')}
                      disabled={uploadingLayout || event.terkunci}
                      className="hidden"
                    />
                  </Label>
                )}
              </div>
            ) : (
              <div
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragOver.layout
                    ? 'border-[#fba635] bg-[#fba635]/5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onDragOver={(e) => handleDragOver(e, 'layout')}
                onDragLeave={(e) => handleDragLeave(e, 'layout')}
                onDrop={(e) => handleDrop(e, 'layout')}
              >
                {!event.terkunci ? (
                  <>
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Drag & drop atau
                    </p>
                    <Label htmlFor="uploadLayout" className="justify-center">
                      <span className="cursor-pointer text-sm font-semibold text-[#fba635] hover:underline">
                        pilih file
                      </span>
                      <Input
                        id="uploadLayout"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, 'layout')}
                        disabled={uploadingLayout}
                        className="hidden"
                      />
                    </Label>
                    <p className="mt-2 text-xs text-gray-400">
                      PNG, JPG hingga 5MB
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada layout</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Preview Dialog */}
      <ImageUploadDialog
        open={uploadDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
        file={uploadDialog.file}
        previewUrl={uploadDialog.previewUrl}
        type={uploadDialog.type}
        onConfirm={handleConfirmUpload}
        onCancel={handleCloseDialog}
        loading={
          uploadDialog.type === 'layout' ? uploadingLayout : uploadingCover
        }
      />
    </div>
  );
}
