/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['patient-bee-cba03aa48e.media.strapiapp.com'],
  },
};

export default nextConfig;
