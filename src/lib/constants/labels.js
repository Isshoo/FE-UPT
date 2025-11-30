export const ROLES = {
  ADMIN: 'ADMIN',
  DOSEN: 'DOSEN',
  USER: 'USER',
};

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  TERBUKA: 'TERBUKA',
  PERSIAPAN: 'PERSIAPAN',
  BERLANGSUNG: 'BERLANGSUNG',
  SELESAI: 'SELESAI',
};

export const EVENT_STATUS_LABELS = {
  TERBUKA: 'Terbuka',
  PERSIAPAN: 'Persiapan',
  BERLANGSUNG: 'Berlangsung',
  SELESAI: 'Selesai',
};

export const BUSINESS_TYPES = {
  MAHASISWA: 'MAHASISWA',
  UMKM_LUAR: 'UMKM_LUAR',
};

export const BUSINESS_TYPE_LABELS = {
  MAHASISWA: 'Usaha Mahasiswa',
  UMKM_LUAR: 'UMKM Luar',
};

export const UMKM_STAGES = {
  IDE_BISNIS: 1,
  PRODUK: 2,
  LEGALITAS: 3,
  MARKETING: 4,
};

export const UMKM_STAGE_STATUS = {
  BELUM_DIMULAI: 'BELUM_DIMULAI',
  SEDANG_PROSES: 'SEDANG_PROSES',
  MENUNGGU_VALIDASI: 'MENUNGGU_VALIDASI',
  SELESAI: 'SELESAI',
};

export const SEMESTER_OPTIONS = [
  { value: 'Ganjil', label: 'Ganjil' },
  { value: 'Genap', label: 'Genap' },
];

export const KATEGORI_USAHA = [
  'Kuliner',
  'Fashion',
  'Kerajinan',
  'Teknologi',
  'Jasa',
  'Lainnya',
];

export const FAKULTAS_OPTIONS = [
  { value: 'Teknik', label: 'Teknik' },
  { value: 'Hukum', label: 'Hukum' },
  { value: 'FEB', label: 'Ekonomi dan Bisnis' },
  { value: 'Pertanian', label: 'Pertanian' },
  { value: 'Keperawatan', label: 'Keperawatan' },
  { value: 'Pariwisata', label: 'Pariwisata' },
  { value: 'PGSD', label: 'Ilmu Pendidikan' },
];

export const PRODI_BY_FAKULTAS = {
  Teknik: [
    'Teknik Elektro',
    'Teknik Industri',
    'Teknik Informatika',
    'Teknik Sipil',
  ],
  Hukum: ['Hukum'],
  FEB: ['Manajemen', 'Akuntansi'],
  Pertanian: ['Agribisnis'],
  Keperawatan: ['Ilmu Keperawatan', 'Profesi Ners', 'Fisioterapi'],
  Pariwisata: ['Hospitality dan Pariwisata'],
  PGSD: ['Pendidikan Guru Sekolah Dasar'],
};

export const UMKM_STAGE_NAMES = {
  1: 'Ide Bisnis',
  2: 'Produk',
  3: 'Legalitas',
  4: 'Marketing',
};

export const UMKM_STAGE_DESCRIPTIONS = {
  1: 'Upload Business Model Canvas dan rencana bisnis Anda',
  2: 'Upload logo, kemasan, dan dokumentasi produk',
  3: 'Upload surat izin usaha dan dokumen legalitas',
  4: 'Upload link media sosial dan strategi marketing',
};

export const UMKM_STAGE_STATUS_LABELS = {
  BELUM_DIMULAI: 'Belum Dimulai',
  SEDANG_PROSES: 'Sedang Proses',
  MENUNGGU_VALIDASI: 'Menunggu Validasi',
  SELESAI: 'Selesai',
};
