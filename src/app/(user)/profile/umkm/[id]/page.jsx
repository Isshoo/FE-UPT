'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { umkmAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import {
  UMKM_STAGE_NAMES,
  UMKM_STAGE_DESCRIPTIONS,
  UMKM_STAGE_STATUS_LABELS,
  KATEGORI_USAHA,
} from '@/lib/constants/labels';
import { UMKM_STAGE_STATUS_COLORS } from '@/lib/constants/colors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronLeft,
  Save,
  Upload,
  FileText,
  CheckCircle,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageUmkmPage() {
  const router = useRouter();
  const params = useParams();
  const umkmId = params.id;
  const { user, isAuthenticated } = useAuthStore();

  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    deskripsi: '',
    namaPemilik: '',
    alamat: '',
    telepon: '',
  });

  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    fetchUmkmDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umkmId]);

  const fetchUmkmDetail = async () => {
    try {
      setLoading(true);
      const response = await umkmAPI.getUmkmById(umkmId);
      const data = response.data;

      // Check if user is owner
      const isOwner = isAuthenticated && user?.id === data.userId;
      if (!isOwner) {
        toast.error('Anda tidak memiliki akses');
        router.push(`/umkm/${umkmId}`);
        return;
      }

      setUmkm(data);
      setFormData({
        nama: data.nama,
        kategori: data.kategori,
        deskripsi: data.deskripsi,
        namaPemilik: data.namaPemilik,
        alamat: data.alamat,
        telepon: data.telepon,
      });
    } catch (error) {
      toast.error('Gagal memuat detail UMKM');
      console.error(error);
      router.push('/profile?tab=umkm');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await umkmAPI.updateUmkm(umkmId, formData);
      toast.success('Informasi UMKM berhasil diupdate');
      fetchUmkmDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal update informasi');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (tahap, files) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [tahap]: Array.from(files),
    }));
  };

  const handleUploadFiles = async (tahap) => {
    const files = selectedFiles[tahap];
    if (!files || files.length === 0) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    try {
      setUploading(true);
      await umkmAPI.uploadStageFiles(umkmId, tahap, files);
      toast.success('File berhasil diupload');
      setSelectedFiles((prev) => ({ ...prev, [tahap]: [] }));
      fetchUmkmDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRequestValidation = async (tahap) => {
    if (
      !confirm('Apakah Anda yakin ingin mengajukan validasi untuk tahap ini?')
    ) {
      return;
    }

    try {
      await umkmAPI.requestValidation(umkmId, tahap);
      toast.success('Request validasi berhasil dikirim');
      fetchUmkmDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal request validasi');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!umkm) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/profile?tab=umkm`)}
          className="mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar UMKM Anda
        </Button>

        <div>
          <h1 className="mb-2 text-3xl font-bold">Kelola UMKM</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {umkm.nama} - Tahap {umkm.tahapSaatIni}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informasi UMKM</TabsTrigger>
          <TabsTrigger value="stages">Tahap Pembinaan</TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Informasi UMKM</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama UMKM</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => handleChange('nama', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select
                      value={formData.kategori}
                      onValueChange={(value) => handleChange('kategori', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => handleChange('deskripsi', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="namaPemilik">Nama Pemilik</Label>
                    <Input
                      id="namaPemilik"
                      value={formData.namaPemilik}
                      onChange={(e) =>
                        handleChange('namaPemilik', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon">Telepon</Label>
                    <Input
                      id="telepon"
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => handleChange('telepon', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) => handleChange('alamat', e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#fba635] hover:bg-[#fdac58]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stages Tab */}
        <TabsContent value="stages" className="space-y-6">
          <Accordion
            type="single"
            collapsible
            defaultValue={`tahap-${umkm.tahapSaatIni}`}
          >
            {umkm.tahap
              ?.sort((a, b) => a.tahap - b.tahap)
              .map((stage) => {
                const isCurrentStage = umkm.tahapSaatIni === stage.tahap;
                const canEdit =
                  stage.status === 'SEDANG_PROSES' ||
                  stage.status === 'BELUM_DIMULAI';
                const hasFiles =
                  stage.file &&
                  Array.isArray(stage.file) &&
                  stage.file.length > 0;

                return (
                  <AccordionItem key={stage.id} value={`tahap-${stage.tahap}`}>
                    <AccordionTrigger
                      className={
                        isCurrentStage ? 'font-semibold text-[#fba635]' : ''
                      }
                    >
                      <div className="flex w-full items-center gap-3">
                        <span>
                          Tahap {stage.tahap}: {UMKM_STAGE_NAMES[stage.tahap]}
                        </span>
                        <Badge
                          className={UMKM_STAGE_STATUS_COLORS[stage.status]}
                        >
                          {UMKM_STAGE_STATUS_LABELS[stage.status]}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent className="space-y-4 pt-6">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {UMKM_STAGE_DESCRIPTIONS[stage.tahap]}
                          </p>

                          {stage.catatan && (
                            <div className="rounded bg-blue-50 p-3 text-sm dark:bg-blue-950">
                              <p className="mb-1 font-semibold text-blue-900 dark:text-blue-300">
                                Catatan dari Admin:
                              </p>
                              <p className="text-blue-800 dark:text-blue-400">
                                {stage.catatan}
                              </p>
                            </div>
                          )}

                          {/* Uploaded Files */}
                          {hasFiles && (
                            <div>
                              <Label className="mb-2 block">
                                File yang Diupload:
                              </Label>
                              <div className="space-y-2">
                                {stage.file.map((fileUrl, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2 rounded border p-2"
                                  >
                                    <FileText className="h-4 w-4 text-gray-600" />
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 truncate text-sm text-blue-600 hover:underline"
                                    >
                                      File {index + 1}
                                    </a>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Upload Section */}
                          {canEdit && (
                            <div className="space-y-3">
                              <Label htmlFor={`file-${stage.tahap}`}>
                                {hasFiles
                                  ? 'Upload File Tambahan:'
                                  : 'Upload File:'}
                              </Label>
                              <Input
                                id={`file-${stage.tahap}`}
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  handleFileSelect(stage.tahap, e.target.files)
                                }
                                disabled={uploading}
                              />
                              {selectedFiles[stage.tahap]?.length > 0 && (
                                <p className="text-xs text-gray-600">
                                  {selectedFiles[stage.tahap].length} file
                                  dipilih
                                </p>
                              )}
                              <Button
                                onClick={() => handleUploadFiles(stage.tahap)}
                                disabled={
                                  uploading ||
                                  !selectedFiles[stage.tahap]?.length
                                }
                                variant="outline"
                                className="w-full"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                {uploading ? 'Uploading...' : 'Upload File'}
                              </Button>
                            </div>
                          )}

                          {/* Request Validation Button */}
                          {canEdit && hasFiles && (
                            <Button
                              onClick={() =>
                                handleRequestValidation(stage.tahap)
                              }
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Ajukan Validasi
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
