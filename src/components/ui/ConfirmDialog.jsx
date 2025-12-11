'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, Info, HelpCircle } from 'lucide-react';

/**
 * ConfirmDialog - A reusable confirmation dialog component
 *
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onOpenChange - Callback when open state changes
 * @param {string} title - Dialog title
 * @param {string} description - Dialog description/message
 * @param {string} confirmText - Text for confirm button (default: "Konfirmasi")
 * @param {string} cancelText - Text for cancel button (default: "Batal")
 * @param {string} variant - Visual variant: "danger" | "warning" | "info" | "default"
 * @param {function} onConfirm - Callback when confirm button is clicked
 * @param {boolean} loading - Show loading state on confirm button
 */
export default function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Konfirmasi',
  description = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'default',
  onConfirm,
  loading = false,
}) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        );
      case 'warning':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
        );
      case 'info':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        );
      default:
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <HelpCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      default:
        return 'bg-[#fba635] hover:bg-[#fdac58] text-white';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="space-y-4">
          {getIcon()}
          <div className="space-y-2 text-center">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-base">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="min-w-24"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`min-w-24 ${getConfirmButtonClass()}`}
          >
            {loading ? 'Memproses...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
