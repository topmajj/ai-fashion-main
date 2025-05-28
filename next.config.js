/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "localhost",
      "thenewblack.ai",
      "storage.googleapis.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "firebasestorage.googleapis.com",
      "rnwyjfzplsabvygjhtns.supabase.co",
      "rnwyjfzplsabvygjhtns.supabase.in",
      "api.astria.ai",
      "api.runwayml.com",
      "replicate.delivery",
      "replicate.com",
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    // Ignore specific modules that might be causing issues
    config.resolve.alias = {
      ...config.resolve.alias,
      "@runwayml/hosted-models": false,
    }
    return config
  },
}

module.exports = nextConfig
