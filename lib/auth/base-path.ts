/**
 * Prefix an in-app path with NEXT_PUBLIC_BASE_PATH.
 * Next's client router adds that prefix for <Link> and redirect(), but a
 * full page load via window.location must include it.
 * Production uses /androidcanvas (https://www.lacv.space/androidcanvas).
 */
export function withBasePath(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "")
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (!base || normalized === base || normalized.startsWith(`${base}/`)) return normalized
  return `${base}${normalized}`
}
