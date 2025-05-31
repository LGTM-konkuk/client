import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API 요청을 백엔드로 프록시
  async rewrites() {
    const apiBaseUrl =
      process.env.API_BASE_URL;

    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },  
};

export default nextConfig;
