'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import { KATEGORI_USAHA } from '@/lib/constants/labels';
import { usersAPI, fakultasAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function MahasiswaForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    namaProduk: '',
    kategori: '',
    deskripsi: '',
    anggota: [{ nama: '', nim: '' }],
    ketuaId: '',
    fakultasId: '',
    prodiId: '',
    pembimbingId: '',
    mataKuliah: '',
    telepon: '',
  });

  const [fakultasList, setFakultasList] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [loadingFakultas, setLoadingFakultas] = useState(false);
  const [loadingProdi, setLoadingProdi] = useState(false);
  const [loadingDosen, setLoadingDosen] = useState(false);

  // Fetch fakultas on mount
  useEffect(() => {
    fetchFakultas();
  }, []);

  // Fetch prodi when fakultas changes
  useEffect(() => {
    if (formData.fakultasId) {
      fetchProdiByFakultas(formData.fakultasId);
      // Reset prodi and pembimbing when fakultas changes
      setFormData((prev) => ({ ...prev, prodiId: '', pembimbingId: '' }));
      setDosenList([]);
    }
  }, [formData.fakultasId]);

  // Fetch dosen when prodi changes
  useEffect(() => {
    if (formData.prodiId) {
      fetchDosenByProdi(formData.prodiId);
    }
  }, [formData.prodiId]);

  const fetchFakultas = async () => {
    try {
      setLoadingFakultas(true);
      const response = await fakultasAPI.getAllFakultas();
      setFakultasList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch fakultas:', error);
      toast.error('Gagal memuat data fakultas');
    } finally {
      setLoadingFakultas(false);
    }
  };

  const fetchProdiByFakultas = async (fakultasId) => {
    try {
      setLoadingProdi(true);
      const response = await fakultasAPI.getProdiByFakultas(fakultasId);
      setProdiList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch prodi:', error);
      setProdiList([]);
    } finally {
      setLoadingProdi(false);
    }
  };

  const fetchDosenByProdi = async (prodiId) => {
    try {
      setLoadingDosen(true);
      const response = await usersAPI.getUsersGuest({ role: 'DOSEN' });

      // Filter dosen by prodiId
      const filteredDosen = (response.data || []).filter(
        (dosen) => dosen.prodi?.id === prodiId
      );

      setDosenList(filteredDosen);
    } catch (error) {
      console.error('Failed to fetch dosen:', error);
      setDosenList([]);
    } finally {
      setLoadingDosen(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAnggota = () => {
    setFormData((prev) => ({
      ...prev,
      anggota: [...prev.anggota, { nama: '', nim: '' }],
    }));
  };

  const handleRemoveAnggota = (index) => {
    if (formData.anggota.length === 1) {
      toast.error('Minimal harus ada 1 anggota');
      return;
    }

    // Reset ketua if removed anggota is ketua
    if (formData.ketuaId === formData.anggota[index].nim) {
      setFormData((prev) => ({ ...prev, ketuaId: '' }));
    }

    setFormData((prev) => ({
      ...prev,
      anggota: prev.anggota.filter((_, i) => i !== index),
    }));
  };

  const handleAnggotaChange = (index, field, value) => {
    const newAnggota = [...formData.anggota];
    newAnggota[index][field] = value;
    setFormData((prev) => ({ ...prev, anggota: newAnggota }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.namaProduk || !formData.kategori || !formData.deskripsi) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }

    if (formData.anggota.some((a) => !a.nama || !a.nim)) {
      toast.error('Mohon lengkapi data semua anggota');
      return;
    }

    if (!formData.ketuaId) {
      toast.error('Mohon pilih ketua kelompok');
      return;
    }

    if (!formData.fakultasId || !formData.prodiId || !formData.pembimbingId) {
      toast.error('Mohon lengkapi data akademik');
      return;
    }

    if (!formData.telepon) {
      toast.error('Mohon isi nomor telepon');
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
              placeholder="e.g., Kopi Bubuk Manado"
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

      {/* Team Members */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Anggota Kelompok</h3>
          <Button
            type="button"
            onClick={handleAddAnggota}
            variant="outline"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </div>

        {formData.anggota.map((anggota, index) => (
          <Card key={index} className="gap-1 pt-4">
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold">Anggota {index + 1}</h4>
                  {formData.anggota.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAnggota(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Nama lengkap"
                      value={anggota.nama}
                      onChange={(e) =>
                        handleAnggotaChange(index, 'nama', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      NIM <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="NIM"
                      value={anggota.nim}
                      onChange={(e) =>
                        handleAnggotaChange(index, 'nim', e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Set as Ketua */}
                {anggota.nim && (
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`ketua-${index}`}
                      name="ketua"
                      checked={formData.ketuaId === anggota.nim}
                      onChange={() => handleChange('ketuaId', anggota.nim)}
                      className="rounded"
                    />
                    <Label
                      htmlFor={`ketua-${index}`}
                      className="cursor-pointer"
                    >
                      <UserCheck className="mr-1 inline h-4 w-4" />
                      Jadikan sebagai Ketua
                    </Label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Academic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informasi Akademik</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fakultas">
              Fakultas <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.fakultasId}
              onValueChange={(value) => handleChange('fakultasId', value)}
              disabled={loadingFakultas}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingFakultas ? 'Loading...' : 'Pilih fakultas'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {fakultasList.map((fakultas) => (
                  <SelectItem key={fakultas.id} value={fakultas.id}>
                    {fakultas.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prodi">
              Program Studi <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.prodiId}
              onValueChange={(value) => handleChange('prodiId', value)}
              disabled={!formData.fakultasId || loadingProdi}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingProdi ? 'Loading...' : 'Pilih program studi'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {prodiList.map((prodi) => (
                  <SelectItem key={prodi.id} value={prodi.id}>
                    {prodi.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pembimbing">
              Dosen Pembimbing <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.pembimbingId}
              onValueChange={(value) => handleChange('pembimbingId', value)}
              disabled={!formData.prodiId || loadingDosen}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingDosen
                      ? 'Loading...'
                      : dosenList.length === 0
                        ? 'Tidak ada dosen'
                        : 'Pilih dosen pembimbing'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {dosenList.map((dosen) => (
                  <SelectItem key={dosen.id} value={dosen.id}>
                    {dosen.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mataKuliah">Nama Mata Kuliah</Label>
            <Input
              id="mataKuliah"
              placeholder="e.g., Kewirausahaan"
              value={formData.mataKuliah}
              onChange={(e) => handleChange('mataKuliah', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Kontak</h3>

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
