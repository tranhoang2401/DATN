// @ts-check
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"]
  },
  images: {
    domains: ["localhost", "anphat-cloud.vercel.app", "anphat.ai.vn", "dev.anphat.ai.vn", "emr.net.vn"]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
