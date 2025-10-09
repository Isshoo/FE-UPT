'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/Pagination';

import { useAuthStore, useUserStore } from '@/store';

const ROLE_OPTIONS = [
  { label: 'Semua Role', value: 'ALL' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Dosen', value: 'DOSEN' },
  { label: 'User', value: 'USER' },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuthStore();

  const {
    items,
    page,
    limit,
    total,
    sortBy,
    order,
    role,
    loading,
    setParams,
    resetParams,
    fetchList,
    deleteById,
  } = useUserStore();

  // local UI state for debounce
  const [searchInput, setSearchInput] = useState('');

  // Ensure auth ready
  useEffect(() => {
    if (!isAuthenticated) {
      getCurrentUser().catch(() => {});
    }
  }, [isAuthenticated, getCurrentUser]);

  // Admin-only guard
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'ADMIN') {
      toast.error('Anda tidak memiliki akses');
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setParams({ search: searchInput, page: 1 });
      fetchList();
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, setParams, fetchList]);

  // initial fetch
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const onSort = (field) => {
    if (sortBy === field) {
      setParams({ order: order === 'asc' ? 'desc' : 'asc' });
    } else {
      setParams({ sortBy: field, order: 'asc' });
    }
    fetchList();
  };

  const SortHeader = ({ field, children }) => {
    const active = sortBy === field;
    return (
      <button
        onClick={() => onSort(field)}
        className="inline-flex w-full items-center gap-1 text-left hover:underline"
      >
        {children}
        {active ? (
          <span className="text-xs">{order === 'asc' ? '▲' : '▼'}</span>
        ) : null}
      </button>
    );
  };

  const onDelete = async (id) => {
    if (!window.confirm('Hapus user ini?')) return;
    const result = await deleteById(id);
    if (result.success) toast.success('User berhasil dihapus');
    else toast.error(result.error);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-semibold">Users</h1>
        <Link href="/admin/users/new">
          <Button className="cursor-pointer">Tambah User</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="Cari nama/email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />
        <Select
          value={role ? role : 'ALL'}
          onValueChange={(v) => {
            const nextRole = v === 'ALL' ? '' : v;
            setParams({ role: nextRole, page: 1 });
            fetchList();
          }}
        >
          <SelectTrigger className="cursor-pointer">
            <SelectValue placeholder="Filter Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setSearchInput('');
              resetParams();
              fetchList();
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">
                <SortHeader  field="nama"><p className="font-bold">Nama</p></SortHeader>
              </TableHead>
              <TableHead className="w-[30%]">
                <SortHeader field="email"><p className="font-bold">Email</p></SortHeader>
              </TableHead>
              <TableHead className="w-[20%]"><p className="font-bold">Role</p></TableHead>
              <TableHead className="w-[20%]"><p className="font-bold">Action</p></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Memuat...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Tidak ada data</TableCell>
              </TableRow>
            ) : (
              items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nama}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{u.role}</Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/admin/users/${u.id}`}>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        Detail
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(u.id)}
                      className="cursor-pointer"
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center w-full">
        <Pagination
          page={page}
          total={total}
          pageSize={limit}
          onPageChange={(p) => {
            setParams({ page: p });
            fetchList();
          }}
        />
      </div>
    </div>
  );
}
