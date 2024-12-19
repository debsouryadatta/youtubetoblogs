/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // experimental: {
    serverExternalPackages: [ '@langchain/core', '@langchain/groq' ],
  // },
  // experimental: {
  //   serverActions: true,
  // },

  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'],
  },
};

module.exports = nextConfig;
