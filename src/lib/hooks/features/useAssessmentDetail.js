// hooks/useAssessmentDetail.js
import { useState, useEffect, useCallback } from 'react';
import { assessmentAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export const useAssessmentDetail = (kategoriId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingWinner, setSettingWinner] = useState(false);

  const fetchData = useCallback(async () => {
    if (!kategoriId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await assessmentAPI.getScoresByCategory(kategoriId);
      setData(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Gagal memuat data penilaian';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch assessment error:', err);
    } finally {
      setLoading(false);
    }
  }, [kategoriId]);

  const handleSetWinner = async (usahaId) => {
    if (
      !confirm(
        'Apakah Anda yakin ingin menetapkan pemenang untuk kategori ini?'
      )
    ) {
      return { success: false, cancelled: true };
    }

    try {
      setSettingWinner(true);
      await assessmentAPI.setWinner(kategoriId, usahaId);
      toast.success('Pemenang berhasil ditetapkan');

      // Refresh data after setting winner
      await fetchData();

      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Gagal menetapkan pemenang';
      toast.error(errorMessage);
      console.error('Set winner error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setSettingWinner(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    settingWinner,
    refetch: fetchData,
    handleSetWinner,
  };
};
