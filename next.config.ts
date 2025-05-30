import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 클라이언트에서 접근 가능한 환경변수 설정
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
  },

  // API 요청을 특정 호스트로 프록시 설정
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
