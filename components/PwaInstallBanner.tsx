"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Share, Smartphone, X } from "lucide-react";
import { dismissInstallBanner, installButtonLabel, isInstallBannerDismissed, isIosSafari, isStandaloneDisplay } from "@/lib/pwa/client";
import type { BeforeInstallPromptEvent } from "@/types/pwa";

type InstallMode = "native" | "ios";

export function PwaInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<InstallMode>("native");
  const [installing, setInstalling] = useState(false);
  const [label, setLabel] = useState("Instalar app");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const lang = document.documentElement.lang || navigator.language || "es";
    setLabel(installButtonLabel(lang));
    if (isStandaloneDisplay() || isInstallBannerDismissed()) return;

    if (isIosSafari()) {
      setMode("ios");
      setVisible(true);
      return;
    }

    const onBeforeInstall = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setMode("native");
      setVisible(true);
    };
    const onInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const close = useCallback(() => {
    dismissInstallBanner();
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (mode === "ios" || !deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
      else close();
    } catch {
      close();
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [close, deferredPrompt, mode]);

  if (!visible || isStandaloneDisplay()) return null;

  const spanish = label === "Instalar app";

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
      style={{
        position: "fixed",
        right: 16,
        bottom: "max(16px, env(safe-area-inset-bottom))",
        left: "auto",
        width: "min(420px, calc(100vw - 32px))",
        zIndex: 1100,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          background: "#FFFBFE",
          color: "#1d1b20",
          border: "1px solid rgba(103,80,164,0.25)",
          borderRadius: 20,
          padding: 16,
          boxShadow: "0 12px 40px rgba(103,80,164,0.18)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            flex: "0 0 auto",
            display: "grid",
            placeItems: "center",
            borderRadius: 12,
            background: "rgba(103,80,164,0.12)",
            color: "#6750A4",
          }}
        >
          {mode === "ios" ? <Share size={20} aria-hidden /> : <Smartphone size={20} aria-hidden />}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p id="pwa-install-title" style={{ margin: 0, fontSize: 14, fontWeight: 650 }}>
            {spanish ? "Instala Canvas Android" : "Install Canvas Android"}
          </p>
          <p id="pwa-install-desc" style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.35, color: "#49454f" }}>
            {mode === "ios" ? (
              spanish ? (
                <>
                  Toca <strong>Compartir</strong> y luego <strong>Añadir a pantalla de inicio</strong>.
                </>
              ) : (
                <>
                  Tap <strong>Share</strong> and then <strong>Add to Home Screen</strong>.
                </>
              )
            ) : spanish ? (
              "Accede más rápido desde tu pantalla de inicio, como una app nativa."
            ) : (
              "Open it from your home screen, like a native app."
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {mode === "native" ? (
              <button
                type="button"
                onClick={() => void install()}
                disabled={installing}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: 0,
                  borderRadius: 12,
                  background: "#6750A4",
                  color: "#FFFFFF",
                  padding: "8px 16px",
                  fontWeight: 650,
                  cursor: installing ? "progress" : "pointer",
                }}
              >
                <Download size={16} aria-hidden />
                {installing ? (spanish ? "Instalando…" : "Installing…") : label}
              </button>
            ) : null}
            <button
              type="button"
              onClick={close}
              style={{
                border: 0,
                borderRadius: 12,
                background: "transparent",
                color: "#49454f",
                padding: "8px 16px",
                fontWeight: 550,
                cursor: "pointer",
              }}
            >
              {mode === "ios" ? (spanish ? "Entendido" : "Got it") : spanish ? "Ahora no" : "Not now"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label={spanish ? "Cerrar banner de instalación" : "Dismiss install banner"}
          style={{ border: 0, background: "transparent", color: "#79747e", cursor: "pointer", padding: 4 }}
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
