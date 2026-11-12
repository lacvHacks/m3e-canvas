"use client";

import { useEffect, type ReactNode } from "react";
import { SerwistProvider } from "@serwist/turbopack/react";
import { pwaBasePath } from "@/lib/pwa/paths";

type Props = { children: ReactNode };

/**
 * Production only. In dev, Serwist recompiles sw.js and skipWaiting reloads the
 * page in a loop under Turbopack, so any previous worker is unregistered.
 * Scope stays on the basePath (`/androidcanvas/` in production) so this worker
 * does not control the rest of lacv.space.
 */
export function PwaProvider({ children }: Props) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) void registration.unregister();
    });
  }, []);

  if (process.env.NODE_ENV === "development") return children;

  const base = pwaBasePath();
  const scope = `${base}/`;
  return (
    <SerwistProvider swUrl={`${base}/sw.js`} options={{ scope, updateViaCache: "none" }} reloadOnOnline={false}>
      {children}
    </SerwistProvider>
  );
}
