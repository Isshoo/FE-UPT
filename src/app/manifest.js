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
    orientation: 'portrait-primary',
    categories: ['business', 'education', 'productivity'],
    shortcuts: [
      {
        name: 'Marketplace',
        short_name: 'Marketplace',
        description: 'Jelajahi event marketplace',
        url: '/marketplace',
      },
      // {
      //   name: 'UMKM Binaan',
      //   short_name: 'UMKM',
      //   description: 'Lihat UMKM binaan',
      //   url: '/umkm',
      // },
      {
        name: 'Profil',
        short_name: 'Profil',
        description: 'Akses profil Anda',
        url: '/profile',
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
