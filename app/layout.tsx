import type { Metadata, Viewport } from "next";
import { PwaPrompts } from "@/components/PwaPrompts";
import { PwaProvider } from "@/components/PwaProvider";
import "./globals.css";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://www.lacv.space"),
  title: "Canvas Apps Movil Android",
  applicationName: "Canvas Apps Movil Android",
  alternates: { canonical: `${BASE}/app` },
  description:
    "Bocetos de pantallas Material 3 Expressive en el navegador que se convierten en prompts de vibe-coding para apps Android. Basado en M3E Canvas de lnkiai (MIT).",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canvas Android",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Canvas Apps Movil Android",
    description: "Diseña pantallas Material 3 Expressive, enlázalas, previsualízalas y copia un prompt para tu herramienta de IA.",
    images: [`${BASE}/og.png`],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: [`${BASE}/og.png`] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6750A4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The script below writes the --skel-* variables onto this element before React hydrates;
    // the DOM is meant to win over the server-rendered (empty) style.
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* before the first paint: the panel widths and the theme colours the last visit left, so
            the shell drawn while the editor loads is the one that appears. The editor reads the
            same key itself; only well-formed hex colours are taken from it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var u=JSON.parse(localStorage.getItem('m3e:ui')||'null')||{};var s=document.documentElement.style;" +
              "var n=function(v){return typeof v==='number'&&isFinite(v)};" +
              "if(u.leftOpen===false)s.setProperty('--skel-left','52px');else if(n(u.leftW))s.setProperty('--skel-left',Math.min(480,Math.max(296,u.leftW))+'px');" +
              "if(u.rightOpen===false)s.setProperty('--skel-right','0px');else if(n(u.rightW))s.setProperty('--skel-right',Math.min(480,Math.max(280,u.rightW))+'px');" +
              "var b=u.boot||{};var ok=function(c){return typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c)};" +
              "['surface','container','low','high','primary','canvas'].forEach(function(k){if(ok(b[k]))s.setProperty('--skel-'+k,b[k])});}catch(e){}",
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400..700,0..1,0&display=block"
        />
      </head>
      <body style={{ fontFamily: "Roboto, system-ui, sans-serif" }}>
        <PwaProvider>
          {children}
          <PwaPrompts />
        </PwaProvider>
      </body>
    </html>
  );
}
