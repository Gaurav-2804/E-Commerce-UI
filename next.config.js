/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/client/:path*',
            destination: 'https://ecommerce-backend-g3tw.onrender.com/client/:path*',
          },
          {
            source: '/user/:path*',
            destination: 'https://ecommerce-backend-g3tw.onrender.com/user/:path*',
          },
          {
            source: '/authenticate/:path*',
            destination: 'https://ecommerce-backend-g3tw.onrender.com/authenticate/:path*',
          }
        ];
      },
}

module.exports = nextConfig
