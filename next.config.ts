import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['patient-bee-cba03aa48e.media.strapiapp.com'],
  },
};

export default nextConfig;
