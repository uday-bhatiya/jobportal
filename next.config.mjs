const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['localhost'], // Or specify your actual domain in production
    },
    // Ensure the `uploads` directory is served as a static file directory
    async rewrites() {
      return [
        {
          source: '/uploads/:path*',
          destination: '/uploads/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  