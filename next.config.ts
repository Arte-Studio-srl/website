import type { NextConfig } from "next";

// For admin functionality, we need API routes which don't work with 'export'
// Set ENABLE_ADMIN=true in environment to use admin features
// For production static export, remove this or set ENABLE_ADMIN=false
const enableAdmin = process.env.ENABLE_ADMIN === 'true' || process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Only use static export when admin is disabled
  ...(enableAdmin ? {} : { output: 'export' }),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

