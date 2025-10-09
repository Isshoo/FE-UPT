export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const ROLES = {
  ADMIN: 'ADMIN',
  DOSEN: 'DOSEN',
  USER: 'USER',
};

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  OPEN: 'TERBUKA',
  PREPARATION: 'PERSIAPAN',
  ONGOING: 'BERLANGSUNG',
  COMPLETED: 'SELESAI',
};

export const BUSINESS_TYPES = {
  MAHASISWA: 'MAHASISWA',
  UMKM_LUAR: 'UMKM_LUAR',
};

export const UMKM_STAGES = {
  IDE_BISNIS: 1,
  PRODUK: 2,
  LEGALITAS: 3,
  MARKETING: 4,
};

export const UMKM_STAGE_STATUS = {
  NOT_STARTED: 'BELUM_DIMULAI',
  IN_PROGRESS: 'SEDANG_PROSES',
  WAITING_VALIDATION: 'MENUNGGU_VALIDASI',
  COMPLETED: 'SELESAI',
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
