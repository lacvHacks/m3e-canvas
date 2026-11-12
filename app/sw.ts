/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/** Scope is `/` or `/androidcanvas/` depending on where this script was registered. */
function scopeBase(): string {
  return new URL(self.registration.scope).pathname.replace(/\/$/, "");
}

function offlineUrl(): string {
  return `${scopeBase()}/~offline`;
}

function isWorkerScript(pathname: string): boolean {
  return pathname === "/sw.js" || pathname.endsWith("/sw.js");
}

function isInstallAsset(pathname: string): boolean {
  return (
    isWorkerScript(pathname) ||
    pathname.endsWith("/manifest.webmanifest") ||
    pathname.includes("/icons/") ||
    pathname.includes("/screenshots/") ||
    pathname.endsWith("/~offline") ||
    pathname.endsWith("/apple-icon.png")
  );
}

const APP_SHELL = "app-shell";

/**
 * Fetch handler rules:
 * - sw.js, the manifest, icons and /~offline are never answered with a redirect to /login
 *   (that response is HTML and Chrome refuses to install the app).
 * - Navigations are not sent to /login by this worker. A same-origin auth redirect that
 *   the server already issued is forwarded as an opaque redirect so signing in still works.
 *   If that navigation is one of the install assets, or the network is down, the worker
 *   answers 200 from the app shell or the offline page instead.
 */
const runtimeCaching: RuntimeCaching[] = [
  {
    matcher({ url, sameOrigin }) {
      return sameOrigin && (isWorkerScript(url.pathname) || url.pathname.endsWith("/manifest.webmanifest"));
    },
    handler: async ({ request }) => {
      const response = await fetch(request, { redirect: "manual", cache: "no-store" });
      if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
        return new Response("/* service worker refused an auth redirect */\n", {
          status: 504,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      return response;
    },
  },
  {
    matcher({ request, sameOrigin }) {
      return sameOrigin && request.mode === "navigate";
    },
    handler: async ({ request, event }) => {
      const url = new URL(request.url);
      // Precache keys include ?__WB_REVISION__=, so ignoreSearch is required.
      const fallback = async () =>
        (await caches.match(request, { ignoreSearch: true })) ??
        (await caches.match(offlineUrl(), { ignoreSearch: true }));
      try {
        const response = await fetch(request);
        const redirected = response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400) || response.redirected;
        if (redirected && isInstallAsset(url.pathname)) {
          const cached = await fallback();
          if (cached) return cached;
          return new Response("<!doctype html><title>Offline</title>", {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8" },
          });
        }
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          event.waitUntil(caches.open(APP_SHELL).then((cache) => cache.put(request, copy)));
        }
        return response;
      } catch {
        const cached = await fallback();
        if (cached) return cached;
        return new Response("offline", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
      }
    },
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [
      {
        url: offlineUrl(),
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
