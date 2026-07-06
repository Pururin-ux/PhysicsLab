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

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: isProduction ? ["tsx", "ts"] : ["dev.tsx", "dev.ts", "tsx", "ts"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
