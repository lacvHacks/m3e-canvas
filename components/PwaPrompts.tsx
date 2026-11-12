"use client";

import { PwaInstallBanner } from "@/components/PwaInstallBanner";

/** In-app install affordance. Hidden once the app is already installed. */
export function PwaPrompts() {
  return <PwaInstallBanner />;
}
