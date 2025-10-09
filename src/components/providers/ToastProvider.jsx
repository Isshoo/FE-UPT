'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#fba635',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#b81202',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}