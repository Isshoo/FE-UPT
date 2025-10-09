export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export const ROLES = {
  ADMIN: 'admin',
  DOSEN: 'dosen',
  USER: 'user',
};

export const EVENT_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  PREPARATION: 'preparation',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
};

export const BUSINESS_TYPES = {
  MAHASISWA: 'mahasiswa',
  UMKM_LUAR: 'umkm_luar',
};

export const UMKM_STAGES = {
  IDE_BISNIS: 1,
  PRODUK: 2,
  LEGALITAS: 3,
  MARKETING: 4,
};

export const UMKM_STAGE_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  WAITING_VALIDATION: 'waiting_validation',
  COMPLETED: 'completed',
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