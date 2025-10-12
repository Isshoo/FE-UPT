import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ErrorMessage({ title, message, onRetry }) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || 'Error'}</AlertTitle>
      <AlertDescription className="mt-2">
        {message || 'Terjadi kesalahan. Silakan coba lagi.'}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
