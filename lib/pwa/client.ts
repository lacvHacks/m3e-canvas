const INSTALL_DISMISS_KEY = "m3e-pwa-install-dismissed";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function readDismiss(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) {
      localStorage.removeItem(key);
      return false;
    }
    if (Date.now() - ts < DISMISS_TTL_MS) return true;
    localStorage.removeItem(key);
    return false;
  } catch {
    return false;
  }
}

export function isInstallBannerDismissed(): boolean {
  return readDismiss(INSTALL_DISMISS_KEY);
}

export function dismissInstallBanner() {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
  } catch {
    /* storage blocked */
  }
}

/** True when Chrome/Safari already launched this origin as an installed app. */
export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIOS && isSafari;
}

/** The two labels the install affordance must use, plus the editor's other languages. */
export function installButtonLabel(lang: string): string {
  const code = lang.toLowerCase();
  if (code.startsWith("es")) return "Instalar app";
  if (code.startsWith("ja")) return "アプリをインストール";
  if (code.startsWith("zh")) return "安装应用";
  if (code.startsWith("ko")) return "앱 설치";
  return "Install app";
}
