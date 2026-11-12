import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";
import { withPwaBase } from "@/lib/pwa/paths";

const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() || randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
  additionalPrecacheEntries: [{ url: withPwaBase("/~offline"), revision }],
  esbuildOptions: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV === "development" ? "development" : "production"),
    },
  },
});
