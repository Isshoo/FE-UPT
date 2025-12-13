'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { assessmentAPI, marketplaceAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, Award, Edit, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function PenilaianFormPage() {
  const router = useRouter();
  const params = useParams();
  const { eventId, kategoriId } = params;

  const [event, setEvent] = useState(null);
  const [category, setCategory] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [existingScores, setExistingScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalScores, setModalScores] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Save confirmation state
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, kategoriId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventResponse, scoresDataResponse] = await Promise.all([
        marketplaceAPI.getEventById(eventId),
        assessmentAPI.getScoresByCategory(kategoriId),
      ]);

      setEvent(eventResponse.data);

      const {
        kategori,
        kriteria,
        businesses: businessesData,
      } = scoresDataResponse.data;

      setCategory({
        ...kategori,
        kriteria: kriteria,
      });

      // Extract businesses from scores data
      const businessesList = businessesData.map((b) => ({
        id: b.usahaId,
        namaProduk: b.namaProduk,
        kategori: b.kategoriUsaha,
        nomorBooth: b.nomorBooth,
        pemilik: b.pemilik,
      }));
      setBusinesses(businessesList);

      // Organize existing scores by business and kriteria
      const scoresMap = {};
      businessesData.forEach((business) => {
        scoresMap[business.usahaId] = {};
        business.scoreDetails.forEach((score) => {
          scoresMap[business.usahaId][score.kriteriaId] = score.nilai;
        });
      });
      setExistingScores(scoresMap);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (business) => {
    setSelectedBusiness(business);

    // Initialize modal scores with existing scores or empty
    const initialScores = {};
    category.kriteria.forEach((kriteria) => {
      initialScores[kriteria.id] =
        existingScores[business.id]?.[kriteria.id]?.toString() || '';
    });
    setModalScores(initialScores);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBusiness(null);
    setModalScores({});
  };

  const handleModalScoreChange = (kriteriaId, value) => {
    const numValue = parseInt(value);
    if (value === '' || (numValue >= 0 && numValue <= 100)) {
      setModalScores((prev) => ({
        ...prev,
        [kriteriaId]: value,
      }));
    }
  };

  const handleSubmitClick = () => {
    // Validate all scores are filled
    const emptyScores = category.kriteria.filter(
      (k) => !modalScores[k.id] || modalScores[k.id] === ''
    );

    if (emptyScores.length > 0) {
      toast.error('Semua kriteria harus diisi');
      return;
    }

    // setShowSaveConfirm(true);
    handleSubmitScores();
  };

  const handleSubmitScores = async () => {
    try {
      setSubmitting(true);

      // Submit all scores for this business
      const promises = category.kriteria.map((kriteria) =>
        assessmentAPI.submitScore({
          usahaId: selectedBusiness.id,
          kategoriId,
          kriteriaId: kriteria.id,
          nilai: parseInt(modalScores[kriteria.id]),
        })
      );

      await Promise.all(promises);

      toast.success('Nilai berhasil disimpan');
      setShowSaveConfirm(false);
      handleCloseModal();
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan nilai');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter((business) => {
    const query = searchQuery.toLowerCase();
    return (
      business.namaProduk.toLowerCase().includes(query) ||
      business.nomorBooth?.toLowerCase().includes(query) ||
      business.kategori.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#fba635]"></div>
      </div>
    );
  }

  if (!event || !category) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="mb-4 text-gray-500">Data tidak ditemukan</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>
    );
  }

  const canAssess = event.status === 'BERLANGSUNG';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push(`/dosen/penilaian`)}
          className="mb-4 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div>
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold">
            <Award className="h-8 w-8 text-[#fba635]" />
            {category.nama}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {event.nama} - {category.deskripsi || 'Penilaian peserta'}
          </p>
        </div>
      </div>

      {/* Alert */}
      {!canAssess ? (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="py-0">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              ⚠️ Penilaian hanya dapat dilakukan saat event sedang berlangsung
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="py-0">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Beri nilai dengan menekan tombol Beri Nilai di kolom Aksi pada
              tabel
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kriteria Info - Compact */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Kriteria:
            </span>
            {category.kriteria.map((kriteria, index) => (
              <Badge
                key={kriteria.id}
                variant="outline"
                className="px-3 py-1 text-sm"
              >
                <span className="font-semibold text-[#fba635]">
                  K{index + 1}
                </span>
                <span className="mx-1">-</span>
                <span>{kriteria.nama}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({kriteria.bobot}%)
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Daftar Peserta ({filteredBusinesses.length})</CardTitle>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari peserta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBusinesses.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                {searchQuery
                  ? 'Tidak ada peserta yang sesuai dengan pencarian'
                  : 'Belum ada peserta yang disetujui untuk dinilai'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Booth</TableHead>
                    {category.kriteria.map((kriteria, index) => (
                      <TableHead key={kriteria.id} className="text-center">
                        K{index + 1}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBusinesses.map((business, index) => {
                    const hasAllScores = category.kriteria.every(
                      (k) => existingScores[business.id]?.[k.id] !== undefined
                    );

                    return (
                      <TableRow key={business.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {business.namaProduk}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{business.kategori}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{business.nomorBooth || '-'}</Badge>
                        </TableCell>
                        {category.kriteria.map((kriteria) => {
                          const score =
                            existingScores[business.id]?.[kriteria.id];
                          return (
                            <TableCell
                              key={kriteria.id}
                              className="text-center"
                            >
                              <span
                                className={`font-semibold ${
                                  score !== undefined
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                                }`}
                              >
                                {score !== undefined ? score : '-'}
                              </span>
                            </TableCell>
                          );
                        })}
                        {/* NILAI rata-rata */}
                        <TableCell className="text-center font-bold text-[#fba635]">
                          {category.kriteria.length > 0 &&
                          (
                            Object.values(
                              existingScores[business.id] || {}
                            ).reduce((a, b) => a + b, 0) /
                            category.kriteria.length
                          ).toFixed(2) > 0
                            ? (
                                Object.values(
                                  existingScores[business.id] || {}
                                ).reduce((a, b) => a + b, 0) /
                                category.kriteria.length
                              ).toFixed(2)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleOpenModal(business)}
                            disabled={!canAssess}
                            variant={hasAllScores ? 'outline' : 'default'}
                            className={
                              hasAllScores
                                ? ''
                                : 'bg-[#fba635] hover:bg-[#fdac58]'
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {hasAllScores ? 'Edit Nilai' : 'Beri Nilai'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Scoring */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Beri Nilai</DialogTitle>
            <DialogDescription>
              {selectedBusiness?.namaProduk} - Booth{' '}
              {selectedBusiness?.nomorBooth}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {category.kriteria.map((kriteria) => (
              <div key={kriteria.id} className="space-y-2">
                <Label htmlFor={kriteria.id}>
                  {kriteria.nama}{' '}
                  <span className="text-sm text-gray-500">
                    (Bobot: {kriteria.bobot}%)
                  </span>
                </Label>
                <Input
                  id={kriteria.id}
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Masukkan nilai 1-100"
                  value={modalScores[kriteria.id] || ''}
                  onChange={(e) =>
                    handleModalScoreChange(kriteria.id, e.target.value)
                  }
                  disabled={submitting}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmitClick}
              disabled={submitting}
              className="bg-[#fba635] hover:bg-[#fdac58]"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Nilai'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Legend */}
      <Card>
        <CardContent className="py-0">
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Petunjuk:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Klik tombol Beri Nilai untuk membuka form penilaian</li>
              <li>Masukkan nilai antara 0-100 untuk setiap kriteria</li>
              <li>Semua kriteria harus diisi sebelum dapat menyimpan</li>
              <li>
                Nilai yang sudah disimpan dapat diubah dengan klik Edit Nilai
              </li>
              <li>Gunakan search bar untuk mencari peserta tertentu</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Save Scores Confirmation Dialog */}
      <ConfirmDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        title="Simpan Nilai"
        description={`Apakah Anda yakin ingin menyimpan nilai untuk "${selectedBusiness?.namaProduk}"?`}
        confirmText="Simpan"
        cancelText="Batal"
        variant="info"
        onConfirm={handleSubmitScores}
        loading={submitting}
      />
    </div>
  );
}
