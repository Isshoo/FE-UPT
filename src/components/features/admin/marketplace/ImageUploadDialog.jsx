'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Upload } from 'lucide-react';

/**
 * ImageUploadDialog - Dialog to preview and confirm image upload
 *
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onOpenChange - Callback when open state changes
 * @param {File} file - The file object to display preview for
 * @param {string} previewUrl - The URL object for previewing the file
 * @param {string} type - "layout" or "cover" used for title/desc
 * @param {function} onConfirm - Callback to proceed with upload
 * @param {function} onCancel - Callback to cancel upload (clears file)
 * @param {boolean} loading - Loading state for upload button
 */
export default function ImageUploadDialog({
  open,
  onOpenChange,
  file,
  previewUrl,
  type = 'cover',
  onConfirm,
  onCancel,
  loading = false,
}) {
  const title =
    type === 'layout' ? 'Upload Layout Event' : 'Upload Cover Event';
  const description =
    type === 'layout'
      ? 'Preview layout denah booth sebelum diupload. Pastikan gambar sudah benar.'
      : 'Preview gambar sampul event sebelum diupload. Pastikan gambar menarik dan sesuai.';

  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
    if (onCancel) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                <span className="text-sm">No image selected</span>
              </div>
            )}
          </div>

          {file && (
            <div className="flex w-full items-center justify-between rounded-md border bg-gray-50 px-3 py-2 text-sm dark:bg-gray-900">
              <span className="truncate text-gray-600 dark:text-gray-300">
                {file.name}
              </span>
              <span className="ml-2 text-xs whitespace-nowrap text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading || !file}
            className="bg-[#fba635] hover:bg-[#fdac58]"
          >
            {loading ? (
              'Mengupload...'
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {type === 'layout' ? 'Layout' : 'Cover'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
