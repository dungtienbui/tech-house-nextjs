import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://cdnv2.tgdd.vn/mwg-static/tgdd/**'),
      new URL('https://cdn.tgdd.vn/**'),
      new URL('https://example.com/**')],
  },
};

export default nextConfig;
