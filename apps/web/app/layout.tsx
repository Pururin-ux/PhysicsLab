import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConditionalAppShell } from "../components/layout/ConditionalAppShell";
import { PersistenceHydrator } from "../components/layout/PersistenceHydrator";
import { PersistenceNotice } from "../components/layout/PersistenceNotice";
import { StarField } from "../components/layout/StarField";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// Реальный production-домен пока не зафиксирован в репозитории (не найден ни
// в package.json/README, ни в конфиге деплоя). Читаем его из переменной
// окружения NEXT_PUBLIC_SITE_URL, чтобы metadataBase, OG-теги и sitemap были
// корректны сразу после выбора домена — без этого файла придётся редактировать
// вручную. Плейсхолдер ниже — временный, до появления реального домена.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physicslab.example";
const siteName = "PhysicsLab";
const siteDescription =
  "Тренажёр по физике для подготовки к ЦЭ/ЦТ в Беларуси: короткие тренировки по 10 задач, разбор типичных ошибок и честный прогресс.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — подготовка к ЦЭ/ЦТ по физике`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "физика",
    "ЦЭ по физике",
    "ЦТ по физике",
    "подготовка к экзамену",
    "тренажёр по физике",
    "репетитор по физике",
  ],
  authors: [{ name: siteName }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: `${siteName} — подготовка к ЦЭ/ЦТ по физике`,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — подготовка к ЦЭ/ЦТ по физике`,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans`}>
        <PersistenceHydrator />
        <StarField />
        <ConditionalAppShell>{children}</ConditionalAppShell>
        <PersistenceNotice />
      </body>
    </html>
  );
}
