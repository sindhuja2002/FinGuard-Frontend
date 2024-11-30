import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // Set to true for a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;
