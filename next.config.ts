import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['centro.localhost', 'admin.localhost'],
  experimental: { serverActions: { bodySizeLimit: '6mb' } },
  images: { remotePatterns: process.env.R2_PUBLIC_BASE_URL ? (() => {
    const url = new URL(process.env.R2_PUBLIC_BASE_URL);
    return [{ protocol: url.protocol.slice(0, -1) as 'https' | 'http', hostname: url.hostname, port: url.port, pathname: `${url.pathname.replace(/\/$/, '')}/papapasta/menu-images/**`, search: '' }];
  })() : [] },
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: '/menu-restauracji', destination: '/menu', permanent: true }];
  },
  sassOptions: {
    additionalData: `@use "sass:math"; @use "~@/styles/helpers/_variables.scss" as *; @use "~@/styles/helpers/_mixins.scss" as *;`,
  },
};

export default nextConfig;
