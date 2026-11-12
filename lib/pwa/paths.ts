/**
 * Paths the auth proxy must serve as themselves. A redirect of sw.js (or the
 * offline document) to /login makes Chrome treat the worker as HTML and only
 * offer "Create shortcut" instead of "Install app".
 *
 * The Next proxy sees pathnames with the basePath already removed.
 */
const EXACT = new Set(["/sw.js", "/manifest.webmanifest", "/~offline", "/apple-icon.png"]);
const PREFIXES = ["/serwist", "/icons", "/screenshots", "/~offline"];

export function pwaBasePath(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
}

/** Prefix a root-relative URL with the build-time basePath (empty in local dev). */
export function withPwaBase(path: string): string {
  const base = pwaBasePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base || normalized === base || normalized.startsWith(`${base}/`)) return normalized;
  return `${base}${normalized}`;
}

export function isPwaPublicPath(pathname: string): boolean {
  const path = (pathname.split("?")[0] ?? pathname).replace(/\/$/, "") || "/";
  if (EXACT.has(path)) return true;
  if (path.endsWith("/sw.js") || path.endsWith("/manifest.webmanifest") || path.endsWith("/apple-icon.png")) return true;
  return PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
