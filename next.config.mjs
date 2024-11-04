const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://produx.ztomas.eu/api/:path*'
      }
    ]
  },
};

export default nextConfig;
