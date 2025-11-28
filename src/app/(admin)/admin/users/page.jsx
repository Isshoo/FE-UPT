'use client';

import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api';
import { FAKULTAS_OPTIONS, PRODI_BY_FAKULTAS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PaginationControls from '@/components/ui/pagination-controls';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  // Users as UsersIcon,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { exportAPI, downloadBlob } from '@/lib/api';
import ExportButton from '@/components/ui/ExportButton';
import { TableSkeleton } from '@/components/common/skeletons';
import EmptyState from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  // const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
  });

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'USER',
    fakultas: '',
    prodi: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [prodiOptions, setProdiOptions] = useState([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (formData.fakultas) {
      setProdiOptions(PRODI_BY_FAKULTAS[formData.fakultas] || []);
      setFormData((prev) => ({ ...prev, prodi: '' }));
    }
  }, [formData.fakultas]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse] = await Promise.all([
        usersAPI.getUsers({
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
        }),
      ]);

      setUsers(usersResponse.data.users || usersResponse.data);
      setPagination((prev) => ({
        ...prev,
        total: usersResponse.pagination?.total || 0,
        totalPages: usersResponse.pagination?.totalPages || 0,
      }));
      // setStats(statsResponse.data);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchData();
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit) => {
    setPagination({ page: 1, limit: newLimit, total: 0, totalPages: 0 });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', role: '' });
    setTimeout(() => fetchData(), 100);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nama: '',
      role: 'USER',
      fakultas: '',
      prodi: '',
    });
    setProdiOptions([]);
  };

  const handleCreate = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      nama: user.nama,
      role: user.role,
      fakultas: user.fakultas || '',
      prodi: user.prodi || '',
      password: '', // Not needed for edit
    });
    if (user.fakultas) {
      setProdiOptions(PRODI_BY_FAKULTAS[user.fakultas] || []);
    }
    setEditDialogOpen(true);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    if (formData.role === 'DOSEN' && (!formData.fakultas || !formData.prodi)) {
      toast.error('Fakultas dan Prodi wajib diisi untuk Dosen');
      return;
    }

    try {
      setSubmitting(true);
      await usersAPI.createUser(formData);
      toast.success('User berhasil dibuat');
      setCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (formData.role === 'DOSEN' && (!formData.fakultas || !formData.prodi)) {
      toast.error('Fakultas dan Prodi wajib diisi untuk Dosen');
      return;
    }

    try {
      setSubmitting(true);
      await usersAPI.updateUser(selectedUser.id, {
        nama: formData.nama,
        email: formData.email,
        fakultas: formData.fakultas,
        prodi: formData.prodi,
      });
      toast.success('User berhasil diupdate');
      setEditDialogOpen(false);
      setSelectedUser(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${user.nama}"?`)) {
      return;
    }

    try {
      await usersAPI.deleteUser(user.id);
      toast.success('User berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus user');
    }
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setResetPasswordDialogOpen(true);
  };

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    try {
      setSubmitting(true);
      await usersAPI.resetPassword(selectedUser.id, newPassword);
      toast.success('Password berhasil direset');
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportUsers = async (format) => {
    const response = await exportAPI.exportUsers(format);
    const filename = `data-pengguna-${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    downloadBlob(response.data, filename);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <TableSkeleton rows={10} columns={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="">
          <h1 className="text-3xl font-bold">Pengguna</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Kelola pengguna aplikasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            onExport={handleExportUsers}
            formats={['excel']}
            label="Ekspor Data"
          />
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="gap-2 py-6">
        <CardContent>
          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <div className="relative flex w-full">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari nama atau email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select
                value={filters.role}
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger className="w-full min-w-[110px] sm:w-auto">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DOSEN">Dosen</SelectItem>
                  <SelectItem value="USER">Pengguna Biasa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-full justify-end gap-3 md:w-auto">
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-[#fba635] hover:bg-[#fdac58]"
              >
                <Search className="mr-2 h-4 w-4" />
                Cari
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Daftar Pengguna ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Tidak Ada Pengguna"
              description="Tidak ada pengguna yang sesuai dengan kriteria pencarian."
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Fakultas/Prodi</TableHead>
                      <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={user.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {user.nama}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.fakultas && user.prodi ? (
                            <div className="text-sm">
                              <div>{user.fakultas}</div>
                              <div className="text-gray-500">{user.prodi}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResetPassword(user)}
                            >
                              <Key className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(user)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Add Pagination */}
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                pageSize={pagination.limit}
                totalItems={pagination.total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Lengkapi form untuk membuat pengguna baru
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Pengguna Biasa</SelectItem>
                    <SelectItem value="DOSEN">Dosen</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'DOSEN' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fakultas">Fakultas *</Label>
                    <Select
                      value={formData.fakultas}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fakultas: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih fakultas" />
                      </SelectTrigger>
                      <SelectContent>
                        {FAKULTAS_OPTIONS.map((fakultas) => (
                          <SelectItem
                            key={fakultas.value}
                            value={fakultas.value}
                          >
                            {fakultas.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prodi">Program Studi *</Label>
                    <Select
                      value={formData.prodi}
                      onValueChange={(value) =>
                        setFormData({ ...formData, prodi: value })
                      }
                      disabled={!formData.fakultas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prodi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prodiOptions.map((prodi) => (
                          <SelectItem key={prodi} value={prodi}>
                            {prodi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#fba635] hover:bg-[#fdac58]"
              >
                {submitting ? 'Memproses...' : 'Buat User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Update informasi pengguna</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-nama">Nama Lengkap *</Label>
                <Input
                  id="edit-nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={formData.role} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500">Role tidak dapat diubah</p>
              </div>

              {formData.role === 'DOSEN' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-fakultas">Fakultas *</Label>
                    <Select
                      value={formData.fakultas}
                      onValueChange={(value) =>
                        setFormData({ ...formData, fakultas: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih fakultas" />
                      </SelectTrigger>
                      <SelectContent>
                        {FAKULTAS_OPTIONS.map((fakultas) => (
                          <SelectItem
                            key={fakultas.value}
                            value={fakultas.value}
                          >
                            {fakultas.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-prodi">Program Studi *</Label>
                    <Select
                      value={formData.prodi}
                      onValueChange={(value) =>
                        setFormData({ ...formData, prodi: value })
                      }
                      disabled={!formData.fakultas}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih prodi" />
                      </SelectTrigger>
                      <SelectContent>
                        {prodiOptions.map((prodi) => (
                          <SelectItem key={prodi} value={prodi}>
                            {prodi}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#fba635] hover:bg-[#fdac58]"
              >
                {submitting ? 'Memproses...' : 'Update User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password untuk {selectedUser?.nama}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru *</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetPasswordDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#fba635] hover:bg-[#fdac58]"
              >
                {submitting ? 'Memproses...' : 'Reset Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
