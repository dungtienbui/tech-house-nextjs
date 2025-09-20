import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdnv2.tgdd.vn',
        pathname: '/mwg-static/tgdd/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.tgdd.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'johnsoulsby.com',
        pathname: '/wp-content/themes/johnsoulsby/assets/img/no-product-image.png',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};


export default nextConfig;
