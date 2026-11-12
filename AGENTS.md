<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PWA instalable (LACV)

Toda aplicación que se cree o modifique para LACV debe ser una PWA instalable siguiendo el patrón de lacvHacks/aplicoo (Serwist): manifest completo, iconos, service worker, botón Instalar app, verificación de installability en Chrome.

Checklist:

- Manifest con `id`, `start_url`, `scope`, `display: standalone`, `name` / `short_name` y `theme_color`. En este repo las URLs del manifest son relativas al propio manifest para convivir con `NEXT_PUBLIC_BASE_PATH=/androidcanvas` (lacv.space y android-canvas.vercel.app).
- Iconos PNG 192 y 512 (`purpose: any`) y maskable, generados del logo.
- Screenshots `wide` y `narrow`.
- Service worker Serwist (`app/sw.ts`, servido en `/sw.js`) con fetch handler. No redirigir `/sw.js` ni las navegaciones de los assets de instalación al login. Excluir `/sw.js`, el manifest, los iconos y `/~offline` del proxy de auth.
- Caché de app shell y fallback `/~offline`.
- Botón «Instalar app» / «Install app» oculto si la app ya está instalada (`display-mode: standalone`).
- `<meta name="theme-color">` y `apple-touch-icon`.
- Verificación en Chrome DevTools (Application > Manifest) sin errores de installability.
