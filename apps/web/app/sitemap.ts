import type { MetadataRoute } from "next";
import { getTaskCatalog } from "../lib/server/task-catalog.ts";

// См. app/robots.ts и app/layout.tsx: домен временно берётся из
// NEXT_PUBLIC_SITE_URL с плейсхолдером-фолбэком до выбора реального домена.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physicslab.example";

const staticRoutes: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/topics", changeFrequency: "weekly", priority: 0.8 },
  { path: "/tasks", changeFrequency: "weekly", priority: 0.8 },
  { path: "/formulas", changeFrequency: "monthly", priority: 0.7 },
  { path: "/practice/kinematics-demo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/practice/dynamics-demo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/practice/electro-demo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/practice/thermo-demo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/practice/optics-demo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/practice/exam-demo", changeFrequency: "monthly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // /profile и /mistakes сознательно не включены — это персональные страницы
  // с локальным состоянием пользователя (см. их metadata.robots.index=false).
  const taskFamilyEntries: MetadataRoute.Sitemap = getTaskCatalog().flatMap((entry) => [
    {
      url: `${siteUrl}/tasks/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/practice/family/${entry.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ]);

  return [...staticEntries, ...taskFamilyEntries];
}
