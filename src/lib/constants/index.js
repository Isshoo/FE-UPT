export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

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
  DRAFT: 'Draft',
  TERBUKA: 'Terbuka',
  PERSIAPAN: 'Persiapan',
  BERLANGSUNG: 'Berlangsung',
  SELESAI: 'Selesai',
};

export const EVENT_STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  TERBUKA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  PERSIAPAN:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  BERLANGSUNG: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  SELESAI:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
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

export const UMKM_STAGE_NAMES = {
  1: 'Ide Bisnis',
  2: 'Produk',
  3: 'Legalitas',
  4: 'Marketing',
};

export const UMKM_STAGE_STATUS = {
  BELUM_DIMULAI: 'BELUM_DIMULAI',
  SEDANG_PROSES: 'SEDANG_PROSES',
  MENUNGGU_VALIDASI: 'MENUNGGU_VALIDASI',
  SELESAI: 'SELESAI',
};

export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',

  // User
  USER_MARKETPLACE: '/marketplace',
  USER_UMKM: '/umkm',
  USER_PROFILE: '/profile',

  // Dosen
  DOSEN_PENDAMPINGAN: '/pendampingan',
  DOSEN_PENILAIAN: '/penilaian',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_MARKETPLACE: '/admin/marketplace',
  ADMIN_UMKM: '/admin/umkm',
  ADMIN_USERS: '/admin/users',
};

export const COLORS = {
  PRIMARY_ORANGE: '#fba635',
  PRIMARY_ORANGE_LIGHT: '#fdac58',
  ACCENT_RED: '#b81202',
  DARK_TEAL: '#174c4e',
  DARK_TEAL_DEEP: '#072526',
  LIGHT_GRAY: 'whitesmoke',
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
  'Pertanian',
  'Lainnya',
];

export const FAKULTAS_OPTIONS = [
  { value: 'Teknik', label: 'Teknik' },
  { value: 'Ekonomi', label: 'Ekonomi dan Bisnis' },
  { value: 'Pertanian', label: 'Pertanian' },
  { value: 'MIPA', label: 'MIPA' },
  { value: 'Peternakan', label: 'Peternakan' },
  { value: 'Kedokteran', label: 'Kedokteran' },
  { value: 'Hukum', label: 'Hukum' },
  { value: 'Ilmu Sosial dan Politik', label: 'Ilmu Sosial dan Politik' },
  { value: 'Perikanan', label: 'Perikanan dan Ilmu Kelautan' },
];

export const PRODI_BY_FAKULTAS = {
  Teknik: [
    'Teknik Sipil',
    'Teknik Elektro',
    'Teknik Mesin',
    'Arsitektur',
    'Informatika',
  ],
  Ekonomi: ['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan'],
  Pertanian: ['Agronomi', 'Teknologi Hasil Pertanian', 'Ilmu Tanah'],
  MIPA: ['Matematika', 'Fisika', 'Kimia', 'Biologi'],
  // Add more as needed
};
