import type { NextConfig } from "next";

// Route handlers (e.g. /api/admin/projects) are incompatible with static export.
// Force a dynamic build to avoid "export const dynamic ... cannot be used with output: export".
if (process.env.ENABLE_STATIC_EXPORT === 'true') {
  throw new Error(
    'Static export is not supported while API route handlers exist. Remove or relocate them before enabling ENABLE_STATIC_EXPORT.'
  );
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;

