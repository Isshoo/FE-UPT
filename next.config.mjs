/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL('https://images.unsplash.com/**')],
  },
};

export default nextConfig;
