export default function manifest() {
  return {
    name: 'UPT Pusat Inovasi dan Kewirausahaan',
    short_name: 'UPT-PIK',
    description:
      'Platform terintegrasi untuk manajemen event bazaar/marketplace dan pembinaan UMKM yang mendukung perkembangan wirausaha mahasiswa dan UMKM lokal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#174c4e',
    icons: [
      {
        src: 'icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    orientation: 'portrait-primary',
    categories: ['business', 'education', 'productivity'],
    shortcuts: [
      {
        name: 'Beranda',
        short_name: 'Beranda',
        description: 'Kembali ke beranda',
        url: '/',
      },
      {
        name: 'Marketplace',
        short_name: 'Marketplace',
        description: 'Jelajahi event marketplace',
        url: '/marketplace',
      },
      {
        name: 'Profil',
        short_name: 'Profil',
        description: 'Akses profil Anda',
        url: '/profile',
      },
      {
        name: 'Tentang Kami',
        short_name: 'Tentang Kami',
        description: 'Pelajari lebih lanjut tentang kami',
        url: '/about',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    scope: '/',
    lang: 'id-ID',
    dir: 'ltr',
    iarc_rating_id: '',
  };
}
