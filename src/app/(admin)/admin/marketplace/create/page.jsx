'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceAPI } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import EventInfoForm from '@/components/admin/marketplace/EventInfoForm';
import SponsorForm from '@/components/admin/marketplace/SponsorForm';
import AssessmentForm from '@/components/admin/marketplace/AssessmentForm';

const STEPS = [
  { id: 1, name: 'Informasi Event', component: EventInfoForm },
  { id: 2, name: 'Sponsor', component: SponsorForm },
  { id: 3, name: 'Penilaian', component: AssessmentForm },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Event Info
    nama: '',
    deskripsi: '',
    semester: '',
    tahunAjaran: '',
    lokasi: '',
    tanggalPelaksanaan: '',
    mulaiPendaftaran: '',
    akhirPendaftaran: '',
    kuotaPeserta: '',

    // Sponsors
    sponsor: [],

    // Assessment
    kategoriPenilaian: [],
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate
      if (!formData.nama || !formData.semester || !formData.tahunAjaran) {
        toast.error('Mohon lengkapi semua field yang wajib');
        return;
      }

      // Validate kategoriPenilaian
      if (formData.kategoriPenilaian.length === 0) {
        toast.error('Minimal harus ada 1 kategori penilaian');
        return;
      }

      // Validate kriteria bobot = 100% for each category
      for (const kategori of formData.kategoriPenilaian) {
        const totalBobot = kategori.kriteria.reduce(
          (sum, k) => sum + parseInt(k.bobot),
          0
        );
        if (totalBobot !== 100) {
          toast.error(
            `Total bobot kriteria untuk "${kategori.nama}" harus 100%`
          );
          return;
        }
      }

      const response = await marketplaceAPI.createEvent(formData);
      toast.success('Event berhasil dibuat!');
      router.push(`${ROUTES.ADMIN_MARKETPLACE}/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat event');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold">Buat Event Baru</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Lengkapi informasi untuk membuat event marketplace
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="items-center justify-center">
          <div className="flex w-full items-center justify-center">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={
                  index < STEPS.length - 1
                    ? 'flex flex-1 items-center'
                    : 'flex items-center'
                }
              >
                <div className="flex min-w-[90px] flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                          ? 'bg-[#fba635] text-white'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    } `}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-center text-xs ${
                      currentStep === step.id
                        ? 'font-semibold text-[#fba635]'
                        : 'text-gray-600 dark:text-gray-400'
                    } `}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-4 h-1 flex-1 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    } `}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent data={formData} onUpdate={handleUpdateData} />
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Sebelumnya
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            className="bg-[#fba635] hover:bg-[#fdac58]"
          >
            Selanjutnya
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Memproses...' : 'Buat Event'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
