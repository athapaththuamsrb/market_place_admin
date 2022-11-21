/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ["exclusives.infura-ipfs.io"],
    formats: ["image/webp"],
  },
});

module.exports = {
  nextConfig,
  experimental: {
    // Defaults to 50MB
    isrMemoryCacheSize: 0,
  },
};
