/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["image.tmdb.org"],
  },
}

module.exports = nextConfig
//tes