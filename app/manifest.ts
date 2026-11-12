import type { MetadataRoute } from "next";

const DESCRIPTION =
  "Bocetos de pantallas Material 3 Expressive en el navegador que se convierten en prompts de vibe-coding para apps Android. Basado en M3E Canvas de lnkiai (MIT).";

/**
 * Relative URLs resolve against the manifest URL, so the same build works at
 * https://android-canvas.vercel.app/androidcanvas/ and at
 * https://www.lacv.space/androidcanvas/ (NEXT_PUBLIC_BASE_PATH=/androidcanvas).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "./",
    name: "Canvas Apps Movil Android",
    short_name: "Canvas Android",
    description: DESCRIPTION,
    start_url: "./app",
    scope: "./",
    display: "standalone",
    background_color: "#FFFBFE",
    theme_color: "#6750A4",
    lang: "es",
    dir: "ltr",
    categories: ["productivity", "graphics"],
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "screenshots/wide.png",
        sizes: "1760x1356",
        type: "image/png",
        form_factor: "wide",
        label: "Editor de pantallas Material 3",
      },
      {
        src: "screenshots/narrow.png",
        sizes: "1200x2640",
        type: "image/png",
        form_factor: "narrow",
        label: "Editor en vertical",
      },
    ],
  };
}
