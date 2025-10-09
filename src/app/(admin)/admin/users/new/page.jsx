'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuthStore, useUserStore } from '@/store';
import { FaArrowLeft } from 'react-icons/fa';

const ROLE_OPTIONS = [
  { label: 'User', value: 'USER' },
  { label: 'Dosen', value: 'DOSEN' },
  { label: 'Admin', value: 'ADMIN' },
];

export default function AdminUserCreatePage() {
  const router = useRouter();
  const { user, isAuthenticated, getCurrentUser } = useAuthStore();
  const { createOne, loading } = useUserStore();

  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'USER',
    fakultas: '',
    prodi: '',
  });

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

  const isDosen = form.role === 'DOSEN';

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama: form.nama.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
      fakultas: isDosen ? form.fakultas.trim() : undefined,
      prodi: isDosen ? form.prodi.trim() : undefined,
    };

    const res = await createOne(payload);
    if (res.success) {
      toast.success('User berhasil dibuat');
      router.push('/admin/users');
    } else {
      toast.error(res.error);
    }
  };

  const resetForm = () => {
    setForm({
      nama: '',
      email: '',
      password: '',
      role: 'USER',
      fakultas: '',
      prodi: '',
    });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex flex-col justify-between gap-3 sm:flex-col">
        <h1 className="text-3xl font-semibold">Tambah User</h1>
        <Link href="/admin/users">
          <Button className="cursor-pointer" variant="outline"><FaArrowLeft className="size-3" /> Kembali ke Daftar User</Button>
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Nama Lengkap</label>
            <Input
              value={form.nama}
              onChange={(e) => setForm((s) => ({ ...s, nama: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="text-sm">Role</label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm((s) => ({ ...s, role: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isDosen && (
            <>
              <div>
                <label className="text-sm">Fakultas</label>
                <Input
                  value={form.fakultas}
                  onChange={(e) => setForm((s) => ({ ...s, fakultas: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm">Program Studi</label>
                <Input
                  value={form.prodi}
                  onChange={(e) => setForm((s) => ({ ...s, prodi: e.target.value }))}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 justify-start">
          <Button disabled={loading} onClick={resetForm} className="cursor-pointer" variant="outline">
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="cursor-pointer" >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  );
}