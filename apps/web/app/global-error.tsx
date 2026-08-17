"use client";

// Глобальный fallback: рендерится, когда сломан сам root layout, поэтому
// содержит собственные <html>/<body> и не зависит от AppShell/дизайн-системы.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[global-error]", error);
  }

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F17",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main role="alert" style={{ maxWidth: 480, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>Приложение не запустилось</h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.75, marginBottom: 20 }}>
            Произошла внутренняя ошибка. Попробуй ещё раз — сохранённый прогресс
            не пострадал.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid #00E0FF",
              background: "#00E0FF",
              color: "#0B0F17",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              marginRight: 12,
            }}
          >
            Попробовать снова
          </button>
          <a href="/" style={{ color: "#00E0FF", fontSize: 14 }}>
            На главную
          </a>
        </main>
      </body>
    </html>
  );
}
