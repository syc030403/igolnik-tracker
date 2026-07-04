import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.tarkov.dev",
      },
    ],
    // 아이콘은 변동이 거의 없으므로 길게 캐싱해 tarkov.dev 대역폭 사용 최소화
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
