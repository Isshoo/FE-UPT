/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '5001',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'via.placeholder.com',
      //   port: '',
      //   pathname: '/**',
      // },
      // terima semua gambar dari semua
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
