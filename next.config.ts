import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.waynspace.com',
      },
      {
        protocol: 'https',
        hostname: 'waynspace.com',
      },
    ],
  },
};

export default nextConfig;
