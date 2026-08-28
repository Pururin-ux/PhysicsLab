import type { MetadataRoute } from "next";

// Домен читается из той же переменной окружения, что и metadataBase в
// app/layout.tsx (NEXT_PUBLIC_SITE_URL) — см. комментарий там про плейсхолдер
// до появления реального production-домена.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physicslab.example";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /profile и /mistakes — персональные страницы с локальным состоянием
        // пользователя (см. robots: { index: false } в их metadata); /dev/* —
        // внутренние витрины компонентов, не должны попадать в индекс;
        // /api/* — служебные эндпоинты, не HTML-контент.
        disallow: ["/profile", "/mistakes", "/dev/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
