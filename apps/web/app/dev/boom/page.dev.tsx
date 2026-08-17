"use client";

// Дев-витрина для error boundary: бросает при рендере, чтобы e2e мог
// детерминированно проверить app/error.tsx. В production-манифест не попадает
// (расширение .dev.tsx исключено из pageExtensions).
export default function BoomDevPage() {
  throw new Error("Intentional dev crash for error-boundary e2e.");
}
