/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // plugin config, etc
    config.resolve.fallback = { fs: false };
    return config;}
}

module.exports = nextConfig
