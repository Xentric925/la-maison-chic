/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add custom watchOptions for development mode
    if (config.mode === 'development') {
      config.watchOptions = {
        poll: 1000, // Check for file changes every 1000ms
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
