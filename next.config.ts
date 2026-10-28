import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  sassOptions: {
    additionalData: `@use "sass:math"; @use "~@/styles/helpers/_variables.scss" as *; @use "~@/styles/helpers/_mixins.scss" as *;`,
  },
};

export default nextConfig;
