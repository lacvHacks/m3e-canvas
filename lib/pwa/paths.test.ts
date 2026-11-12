import { describe, expect, it } from "vitest";
import { isPwaPublicPath, pwaBasePath, withPwaBase } from "./paths";

describe("PWA public paths", () => {
  it("keeps the worker, manifest, icons and offline page out of the login redirect", () => {
    for (const path of [
      "/sw.js",
      "/serwist/sw.js",
      "/manifest.webmanifest",
      "/icons/icon-192.png",
      "/icons/icon-maskable-512.png",
      "/screenshots/wide.png",
      "/~offline",
      "/apple-icon.png",
    ]) {
      expect(isPwaPublicPath(path), path).toBe(true);
    }
  });

  it("still protects the editor and the auth screens are not classified as PWA assets", () => {
    expect(isPwaPublicPath("/app")).toBe(false);
    expect(isPwaPublicPath("/login")).toBe(false);
    expect(isPwaPublicPath("/")).toBe(false);
  });
});

describe("basePath joining", () => {
  it("leaves paths alone when the app is served from the origin root", () => {
    expect(pwaBasePath()).toBe("");
    expect(withPwaBase("/sw.js")).toBe("/sw.js");
    expect(withPwaBase("/~offline")).toBe("/~offline");
  });
});
