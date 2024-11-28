/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  trailingSlash: true,
  assetPrefix: '/',
  distDir: 'out',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_BASE
  }
}

module.exports = nextConfig