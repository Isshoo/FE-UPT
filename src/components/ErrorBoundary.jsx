'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="max-w-md p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold">Oops! Terjadi Kesalahan</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba refresh
              halaman atau kembali ke beranda.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 rounded-lg bg-gray-100 p-4 text-left dark:bg-gray-800">
                <summary className="cursor-pointer font-medium">
                  Detail Error (Development Mode)
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#fba635] hover:bg-[#fdac58]"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Halaman
              </Button>
              <Button asChild variant="outline">
                <Link href={ROUTES.HOME}>
                  <Home className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
