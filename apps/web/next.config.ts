import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

// Дев-витрины (/dev/*) существуют как page.dev.tsx: в production-сборке
// расширение dev.tsx не входит в pageExtensions, поэтому маршруты
// статически отсутствуют в манифесте (первый пояс защиты; второй —
// runtime-гард в app/dev/layout.tsx). ".ts" обязан оставаться в списке,
// иначе исчезнут route.ts API-обработчики.
const isProduction = process.env.NODE_ENV === "production";

// Опциональный режим live-preview: только для sandboxed-предпросмотра.
// По умолчанию выключен, поэтому production-заголовки не меняются.
const allowPreviewEmbed = process.env.PHYSICSLAB_PREVIEW_EMBED === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

if (!allowPreviewEmbed) {
  securityHeaders.push({ key: "X-Frame-Options", value: "DENY" });
}

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  pageExtensions: isProduction ? ["tsx", "ts"] : ["dev.tsx", "dev.ts", "tsx", "ts"],
  turbopack: {
    root: projectRoot,
  },
  // Разрешаем dev-серверу принимать запросы с внешнего preview-хоста,
  // иначе Next 15.x отклоняет cross-origin обращения в разработке.
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai"],
  // Базовые security headers. CSP сознательно НЕ добавлен: непроверенный CSP
  // ломает KaTeX/inline-styles/Next-скрипты/Framer Motion — задокументирован
  // как follow-up в docs/quality/public-beta-hardening-v1.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
