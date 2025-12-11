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
      // Fetch scores and kategori details (includes event status and pemenang)
      const [scoresResponse, kategoriResponse] = await Promise.all([
        assessmentAPI.getScoresByCategory(kategoriId),
        assessmentAPI.getCategoryById(kategoriId),
      ]);

      // Merge data with event info and pemenang
      setData({
        ...scoresResponse.data,
        event: kategoriResponse.data?.event,
        pemenang: kategoriResponse.data?.pemenang,
      });
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

  // Note: Confirmation should be handled by the consuming component before calling this
  const handleSetWinner = async (usahaId) => {
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
