'use client';

import { useEffect, useState } from 'react';
import { onLoadingChange } from '@/config/apiClient';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onLoadingChange(setIsLoading);
    return unsubscribe;
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 z-[100] h-1 w-full">
      <div className="h-full animate-pulse bg-gradient-to-r from-[#fba635] via-[#fdac58] to-[#fba635]"></div>
    </div>
  );
}
