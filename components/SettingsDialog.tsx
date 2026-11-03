"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Palette, Theme } from "@/lib/tokens";
import { Lang, t, useLang } from "@/lib/i18n";
import { Icon } from "./M3Node";
import { IconBtn } from "./ui";
import { MobileLang, MobileSettings } from "./Mobile";

/** App-wide preferences. Language and theme already exist; this gathers them
 *  into one Material 3 dialog. The rail's language and logout buttons stay. */
export function SettingsDialog({
  open,
  onClose,
  p,
  onLang,
  paletteKey,
  onPalette,
  theme,
  onTheme,
}: {
  open: boolean;
  onClose: () => void;
  p: Palette;
  onLang: (l: Lang) => void;
  paletteKey: string;
  onPalette: (key: string) => void;
  theme: Theme;
  onTheme: (patch: Partial<Theme>) => void;
}) {
  const lang = useLang();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  const label = t("settingsLabel", lang);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="settings-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 600,
            background: "rgba(0,0,0,0.32)",
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-label={label}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(100%, 420px)",
              maxHeight: "min(640px, calc(100vh - 48px))",
              display: "flex",
              flexDirection: "column",
              borderRadius: 28,
              background: p.surfaceContainerLow,
              color: p.onSurface,
              boxShadow: "0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 12px 8px 20px", flex: "0 0 auto" }}>
              <Icon name="settings" size={24} />
              <div style={{ flex: 1, fontSize: 22 }}>{label}</div>
              <IconBtn icon="close" p={p} onClick={onClose} title={t("close", lang)} size={40} />
            </div>
            <div className="no-scrollbar" style={{ overflowY: "auto", padding: "4px 16px 20px", minHeight: 0 }}>
              <MobileLang palette={p} lang={lang} onLang={onLang} />
              <MobileSettings palette={p} paletteKey={paletteKey} onPalette={onPalette} theme={theme} onTheme={onTheme} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
