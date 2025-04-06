const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ❗ desactiva el bloqueo del build por errores ESLint
  },
  images: {
    domains: ['patient-bee-cba03aa48e.media.strapiapp.com'],
  },
};

export default nextConfig;
