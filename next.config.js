/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://ecommerce-backend-g3tw.onrender.com/api/:path*',
          },
          {
            source: '/authenticate/:path*',
            destination: 'https://ecommerce-backend-g3tw.onrender.com/authenticate/:path*',
          }
        ];
      },
}

module.exports = nextConfig
