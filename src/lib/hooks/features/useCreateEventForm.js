// hooks/useCreateEventForm.js
import { useState } from 'react';
import { toUTC, isValidDateTime } from '@/lib/utils/date';
import toast from 'react-hot-toast';

const initialFormData = {
  nama: '',
  deskripsi: '',
  semester: '',
  tahunAjaran: '',
  lokasi: '',
  tanggalPelaksanaan: '',
  kuotaPeserta: '',
  sponsor: [],
  kategoriPenilaian: [],
};

export const useCreateEventForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const handleUpdateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const validateEventInfo = () => {
    const { nama, semester, tahunAjaran, tanggalPelaksanaan } = formData;

    if (!nama || !semester || !tahunAjaran) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return false;
    }

    if (!tanggalPelaksanaan) {
      toast.error('Mohon isi tanggal pelaksanaan');
      return false;
    }

    // Validate datetime strings
    if (!isValidDateTime(tanggalPelaksanaan)) {
      toast.error('Format tanggal tidak valid');
      return false;
    }

    return true;
  };

  const validateAssessment = () => {
    if (formData.kategoriPenilaian.length === 0) {
      toast.error('Minimal harus ada 1 kategori penilaian');
      return false;
    }

    for (const kategori of formData.kategoriPenilaian) {
      const totalBobot = kategori.kriteria.reduce(
        (sum, k) => sum + parseInt(k.bobot),
        0
      );
      if (totalBobot !== 100) {
        toast.error(`Total bobot kriteria untuk "${kategori.nama}" harus 100%`);
        return false;
      }
    }

    return true;
  };

  const prepareDataForSubmit = () => {
    return {
      ...formData,
      tanggalPelaksanaan: toUTC(
        new Date(formData.tanggalPelaksanaan)
      ).toISOString(),
    };
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!validateEventInfo()) {
        return false;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return true;
    }
    return false;
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const reset = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return {
    currentStep,
    formData,
    handleUpdateData,
    handleNext,
    handlePrevious,
    validateEventInfo,
    validateAssessment,
    prepareDataForSubmit,
    reset,
    setCurrentStep,
  };
};
