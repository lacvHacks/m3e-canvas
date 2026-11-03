import type { NextConfig } from "next";

// Production: NEXT_PUBLIC_BASE_PATH=/androidcanvas (https://www.lacv.space/androidcanvas).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // A server build (no static export): the login needs the proxy and server actions.
  basePath,
  images: { unoptimized: true },
  devIndicators: false,
  async rewrites() {
    return {
      // the agent guide sits beside the editor, so share links built "next to it" open /app
      beforeFiles: [{ source: "/app/agent.md", destination: "/agent.md" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
