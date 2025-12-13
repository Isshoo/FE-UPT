'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';

export default function ExportButton({
  onExport,
  formats = ['excel', 'pdf'],
  label = 'Ekspor',
  size = 'default',
  variant = 'outline',
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format) => {
    setLoading(true);
    try {
      await onExport(format);
      toast.success(`Berhasil mengekspor data ke ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  if (formats.length === 1) {
    return (
      <Button
        onClick={() => handleExport(formats[0])}
        disabled={loading}
        size={size}
        variant={variant}
      >
        <Download className="mr-2 h-4 w-4" />
        {loading ? 'Mengekspor...' : label}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={loading} size={size} variant={variant}>
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Mengekspor...' : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes('excel') && (
          <DropdownMenuItem
            onClick={() => handleExport('excel')}
            disabled={loading}
            className="cursor-pointer"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            Ekspor ke Excel
          </DropdownMenuItem>
        )}
        {formats.includes('pdf') && (
          <DropdownMenuItem
            onClick={() => handleExport('pdf')}
            disabled={loading}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4 text-red-600" />
            Ekspor ke PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
