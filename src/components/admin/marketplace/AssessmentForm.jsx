'use client';

import { useState, useEffect } from 'react';
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
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AssessmentForm({ data, onUpdate }) {
  const [kategoriList, setKategoriList] = useState(
    data.kategoriPenilaian || []
  );
  const [dosenList, setDosenList] = useState([]);
  const [loadingDosen, setLoadingDosen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newKategori, setNewKategori] = useState({
    nama: '',
    deskripsi: '',
    penilaiIds: [],
    kriteria: [],
  });

  const [newKriteria, setNewKriteria] = useState({
    nama: '',
    bobot: '',
  });

  useEffect(() => {
    fetchDosen();
  }, []);

  const fetchDosen = async () => {
    try {
      setLoadingDosen(true);
      // Fetch list dosen - you'll need to create this endpoint
      // For now, we'll use a placeholder
      const response = await apiClient.get('/users?role=DOSEN');
      setDosenList(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dosen:', error);
      // Use dummy data for now
      setDosenList([]);
    } finally {
      setLoadingDosen(false);
    }
  };

  const handleAddKriteria = () => {
    if (!newKriteria.nama || !newKriteria.bobot) {
      toast.error('Nama dan bobot kriteria harus diisi');
      return;
    }

    const bobot = parseInt(newKriteria.bobot);
    if (bobot <= 0 || bobot > 100) {
      toast.error('Bobot harus antara 1-100');
      return;
    }

    const updatedKriteria = [
      ...newKategori.kriteria,
      { nama: newKriteria.nama, bobot },
    ];

    setNewKategori({ ...newKategori, kriteria: updatedKriteria });
    setNewKriteria({ nama: '', bobot: '' });
    toast.success('Kriteria ditambahkan');
  };

  const handleRemoveKriteria = (index) => {
    const updatedKriteria = newKategori.kriteria.filter((_, i) => i !== index);
    setNewKategori({ ...newKategori, kriteria: updatedKriteria });
  };

  const getTotalBobot = () => {
    return newKategori.kriteria.reduce((sum, k) => sum + parseInt(k.bobot), 0);
  };

  const handleAddKategori = () => {
    if (!newKategori.nama) {
      toast.error('Nama kategori harus diisi');
      return;
    }

    if (newKategori.penilaiIds.length === 0) {
      toast.error('Minimal harus ada 1 penilai');
      return;
    }

    if (newKategori.kriteria.length === 0) {
      toast.error('Minimal harus ada 1 kriteria');
      return;
    }

    const totalBobot = getTotalBobot();
    if (totalBobot !== 100) {
      toast.error(`Total bobot kriteria harus 100% (sekarang ${totalBobot}%)`);
      return;
    }

    let updatedKategoriList;
    if (editingIndex !== null) {
      // Update existing
      updatedKategoriList = kategoriList.map((k, i) =>
        i === editingIndex ? { ...newKategori } : k
      );
      toast.success('Kategori berhasil diupdate');
      setEditingIndex(null);
    } else {
      // Add new
      updatedKategoriList = [...kategoriList, { ...newKategori }];
      toast.success('Kategori berhasil ditambahkan');
    }

    setKategoriList(updatedKategoriList);
    onUpdate({ kategoriPenilaian: updatedKategoriList });

    // Reset form
    setNewKategori({
      nama: '',
      deskripsi: '',
      penilaiIds: [],
      kriteria: [],
    });
  };

  const handleEditKategori = (index) => {
    setNewKategori({ ...kategoriList[index] });
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setNewKategori({
      nama: '',
      deskripsi: '',
      penilaiIds: [],
      kriteria: [],
    });
    setEditingIndex(null);
  };

  const handleRemoveKategori = (index) => {
    const updatedKategoriList = kategoriList.filter((_, i) => i !== index);
    setKategoriList(updatedKategoriList);
    onUpdate({ kategoriPenilaian: updatedKategoriList });
    toast.success('Kategori dihapus');
  };

  const handleTogglePenilai = (dosenId) => {
    const penilaiIds = newKategori.penilaiIds.includes(dosenId)
      ? newKategori.penilaiIds.filter((id) => id !== dosenId)
      : [...newKategori.penilaiIds, dosenId];

    setNewKategori({ ...newKategori, penilaiIds });
  };

  const totalBobot = getTotalBobot();
  const bobotColor =
    totalBobot === 100
      ? 'text-green-600'
      : totalBobot > 100
        ? 'text-red-600'
        : 'text-yellow-600';

  return (
    <div className="space-y-6">
      {/* Form Kategori */}
      <Card className="border-2 border-[#fba635]">
        <CardHeader>
          <CardTitle>
            {editingIndex !== null
              ? 'Edit Kategori Penilaian'
              : 'Tambah Kategori Penilaian'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nama & Deskripsi */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="namaKategori">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                id="namaKategori"
                placeholder="e.g., Booth Terbaik"
                value={newKategori.nama}
                onChange={(e) =>
                  setNewKategori({ ...newKategori, nama: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsiKategori">Deskripsi</Label>
              <Input
                id="deskripsiKategori"
                placeholder="Deskripsi kategori penilaian"
                value={newKategori.deskripsi}
                onChange={(e) =>
                  setNewKategori({ ...newKategori, deskripsi: e.target.value })
                }
              />
            </div>
          </div>

          {/* Penilai */}
          <div className="space-y-2">
            <Label>
              Dosen Penilai <span className="text-red-500">*</span>
            </Label>
            {loadingDosen ? (
              <p className="text-sm text-gray-500">Loading dosen...</p>
            ) : dosenList.length === 0 ? (
              <p className="text-sm text-gray-500">
                Belum ada dosen terdaftar. Silakan tambahkan dosen terlebih
                dahulu.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {dosenList.map((dosen) => (
                  <label
                    key={dosen.id}
                    className="flex cursor-pointer items-center gap-2 rounded border p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={newKategori.penilaiIds.includes(dosen.id)}
                      onChange={() => handleTogglePenilai(dosen.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{dosen.nama}</span>
                  </label>
                ))}
              </div>
            )}
            {newKategori.penilaiIds.length > 0 && (
              <p className="text-xs text-gray-500">
                {newKategori.penilaiIds.length} penilai dipilih
              </p>
            )}
          </div>

          {/* Kriteria Penilaian */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                Kriteria Penilaian <span className="text-red-500">*</span>
              </Label>
              <span className={`text-sm font-semibold ${bobotColor}`}>
                Total Bobot: {totalBobot}%
              </span>
            </div>

            {/* Add Kriteria Form */}
            <div className="flex gap-2">
              <Input
                placeholder="Nama kriteria"
                value={newKriteria.nama}
                onChange={(e) =>
                  setNewKriteria({ ...newKriteria, nama: e.target.value })
                }
                className="flex-1"
              />
              <Input
                type="number"
                min="1"
                max="100"
                placeholder="Bobot (%)"
                value={newKriteria.bobot}
                onChange={(e) =>
                  setNewKriteria({ ...newKriteria, bobot: e.target.value })
                }
                className="w-32"
              />
              <Button
                type="button"
                onClick={handleAddKriteria}
                className="bg-[#174c4e] hover:bg-[#072526]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Kriteria List */}
            {newKategori.kriteria.length > 0 ? (
              <div className="space-y-2">
                {newKategori.kriteria.map((kriteria, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded border p-3"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <span className="font-medium">{kriteria.nama}</span>
                      <span className="text-sm text-gray-500">
                        {kriteria.bobot}%
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveKriteria(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded border-2 border-dashed py-8 text-center">
                <p className="text-sm text-gray-500">
                  Belum ada kriteria ditambahkan
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddKategori}
              className="bg-[#fba635] hover:bg-[#fdac58]"
              disabled={totalBobot !== 100}
            >
              {editingIndex !== null ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Kategori
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Kategori
                </>
              )}
            </Button>
            {editingIndex !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kategori List */}
      {kategoriList.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Daftar Kategori Penilaian ({kategoriList.length})
          </h3>
          <div className="space-y-4">
            {kategoriList.map((kategori, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-semibold">
                          {kategori.nama}
                        </h4>
                        {kategori.deskripsi && (
                          <span className="text-sm text-gray-500">
                            - {kategori.deskripsi}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <strong>Penilai:</strong> {kategori.penilaiIds.length}{' '}
                          dosen
                        </p>
                        <p>
                          <strong>Kriteria:</strong> {kategori.kriteria.length}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {kategori.kriteria.map((kriteria, kIndex) => (
                          <div
                            key={kIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fba635] text-xs text-white">
                              {kIndex + 1}
                            </span>
                            <span>{kriteria.nama}</span>
                            <span className="text-gray-500">
                              ({kriteria.bobot}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditKategori(index)}
                        disabled={editingIndex !== null}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveKategori(index)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={editingIndex !== null}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {kategoriList.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-2 text-sm text-gray-500">
              Belum ada kategori penilaian
            </p>
            <p className="text-xs text-red-500">
              Minimal harus ada 1 kategori penilaian
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
