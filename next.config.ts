import type { NextConfig } from "next";

// Standard SSR/ISR build (no static export) to support API routes.
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

