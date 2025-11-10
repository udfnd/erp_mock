import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: { emotion: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
