/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // experimental: {
    serverExternalPackages: [ '@langchain/core', '@langchain/groq' ],
  // },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
