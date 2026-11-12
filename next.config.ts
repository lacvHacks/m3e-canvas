import { withSerwist } from "@serwist/turbopack";
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
      // the agent guide sits beside the editor, so share links built "next to it" open /app.
      // /sw.js is the installable worker; its script URL's directory is the default scope
      // (/ or /androidcanvas/), which has to cover start_url ./app.
      beforeFiles: [
        { source: "/app/agent.md", destination: "/agent.md" },
        { source: "/sw.js", destination: "/serwist/sw.js" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/serwist/:path*",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

// Serwist in dev recompiles sw.js and a previous worker can reload the page in a loop.
export default process.env.NODE_ENV === "production" ? withSerwist(nextConfig) : nextConfig;
