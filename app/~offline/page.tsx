import Link from "next/link";

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        background: "#FFFBFE",
        color: "#1d1b20",
      }}
    >
      <svg width="72" height="72" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="8" fill="#6750A4" />
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          d="M13 2h14a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 5v24h14V7H13Zm4.5 27.2a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
        />
      </svg>
      <h1 style={{ margin: "24px 0 8px", fontSize: 24 }}>Sin conexión</h1>
      <p style={{ margin: "0 0 24px", maxWidth: 420, color: "#49454f" }}>
        No hay internet en este momento. Revisa tu conexión e inténtalo de nuevo.
      </p>
      <Link
        href="/app"
        style={{
          background: "#6750A4",
          color: "#FFFFFF",
          borderRadius: 12,
          padding: "12px 20px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Reintentar
      </Link>
    </main>
  );
}
