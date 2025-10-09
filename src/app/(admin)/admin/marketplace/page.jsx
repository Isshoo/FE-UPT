'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/Pagination';

import { useAuthStore, useMarketplaceStore } from '@/store';

const STATUS_OPTIONS = [
  { label: 'Semua Status', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Terbuka', value: 'TERBUKA' },
  { label: 'Persiapan', value: 'PERSIAPAN' },
  { label: 'Berlangsung', value: 'BERLANGSUNG' },
  { label: 'Selesai', value: 'SELESAI' },
];

const SEMESTER_OPTIONS = [
  { label: 'Semua Semester', value: 'ALL' },
  { label: 'Ganjil', value: 'Ganjil' },
  { label: 'Genap', value: 'Genap' },
];

const PAGE_LIMIT = 10;

export default function AdminMarketplacePage() {
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuthStore();

  const {
    events,
    page,
    limit,
    total,
    sortBy,
    order,
    status,
    semester,
    tahunAjaran,
    loading,
    setEventParams,
    resetEventParams,
    fetchEvents,
    deleteEvent,
    lockEvent,
    unlockEvent,
  } = useMarketplaceStore();

  const [searchInput, setSearchInput] = useState('');
  const [tahunAjaranInput, setTahunAjaranInput] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      getCurrentUser().catch(() => {});
    }
  }, [isAuthenticated, getCurrentUser]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'ADMIN') {
      toast.error('Anda tidak memiliki akses');
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const t = setTimeout(() => {
      setEventParams({ search: searchInput, page: 1 });
      fetchEvents();
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, setEventParams, fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onSort = (field) => {
    if (sortBy === field) {
      setEventParams({ order: order === 'asc' ? 'desc' : 'asc' });
    } else {
      setEventParams({ sortBy: field, order: 'asc' });
    }
    fetchEvents();
  };

  const SortHeader = ({ field, children }) => {
    const active = sortBy === field;
    return (
      <button
        onClick={() => onSort(field)}
        className="text-left w-full hover:underline inline-flex items-center gap-1"
      >
        {children}
        {active ? <span className="text-xs">{order === 'asc' ? '▲' : '▼'}</span> : null}
      </button>
    );
  };

  const onDelete = async (id) => {
    if (!window.confirm('Hapus event ini?')) return;
    const result = await deleteEvent(id);
    if (result.success) toast.success('Event berhasil dihapus');
    else toast.error(result.error);
  };

  const onLock = async (id) => {
    if (!window.confirm('Kunci event ini?')) return;
    const result = await lockEvent(id);
    if (result.success) toast.success('Event berhasil dikunci');
    else toast.error(result.error);
  };

  const onUnlock = async (id) => {
    if (!window.confirm('Buka kunci event ini?')) return;
    const result = await unlockEvent(id);
    if (result.success) toast.success('Event berhasil dibuka kunci');
    else toast.error(result.error);
  };

  const getStatusBadge = (status) => {
    const variants = {
      DRAFT: 'secondary',
      TERBUKA: 'default',
      PERSIAPAN: 'outline',
      BERLANGSUNG: 'destructive',
      SELESAI: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold">Marketplace</h1>
        <Link href="/admin/marketplace/new">
          <Button className="cursor-pointer">Buat Event Baru</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Cari nama event..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />
        <Select
          value={status ? status : 'ALL'}
          onValueChange={(v) => {
            const nextStatus = v === 'ALL' ? '' : v;
            setEventParams({ status: nextStatus, page: 1 });
            fetchEvents();
          }}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={semester ? semester : 'ALL'}
          className="!min-w-[157px]"
          onValueChange={(v) => {
            const nextSemester = v === 'ALL' ? '' : v;
            setEventParams({ semester: nextSemester, page: 1 });
            fetchEvents();
          }}
        >
          <SelectTrigger className="cursor-pointer !min-w-[157px]">
            <SelectValue placeholder="Filter Semester" />
          </SelectTrigger>
          <SelectContent>
            {SEMESTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Tahun Ajaran (2024/2025)"
          value={tahunAjaranInput}
          className="w-[30%]"
          onChange={(e) => {
            setTahunAjaranInput(e.target.value);
            setEventParams({ tahunAjaran: e.target.value, page: 1 });
            fetchEvents();
          }}
        />
        <div className="flex justify-end">
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            setSearchInput('');
            setTahunAjaranInput('');
            resetEventParams();
            fetchEvents();
          }}
        >
          Reset Filter
        </Button>
      </div>
      </div>

      

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">
                <SortHeader field="nama"><p className="font-bold cursor-pointer">Nama Event</p></SortHeader>
              </TableHead>
              <TableHead className="w-[15%]"><p className="font-bold">Semester</p></TableHead>
              <TableHead className="w-[15%]"><p className="font-bold">Tahun Ajaran</p></TableHead>
              <TableHead className="w-[15%]"><p className="font-bold">Status</p></TableHead>
              <TableHead className="w-[15%]"><p className="font-bold">Peserta</p></TableHead>
              <TableHead className="w-[15%] text-right"><p className="font-bold">Action</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Memuat...</TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Tidak ada data</TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.nama}</TableCell>
                  <TableCell>{event.semester}</TableCell>
                  <TableCell>{event.tahunAjaran}</TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>{event._count?.usaha || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/marketplace/${event.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">Detail</Button>
                    </Link>
                    {event.terkunci ? (
                      <Button variant="outline" size="sm" onClick={() => onUnlock(event.id)} className="cursor-pointer">
                        Buka Kunci
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => onLock(event.id)} className="cursor-pointer">
                        Kunci
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => onDelete(event.id)} className="cursor-pointer">
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Pagination
          page={page}
          total={total}
          pageSize={limit}
          onPageChange={(p) => {
            setEventParams({ page: p });
            fetchEvents();
          }}
        />
      </div>
    </div>
  );
}