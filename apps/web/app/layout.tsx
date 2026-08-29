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

export const metadata: Metadata = {
  title: {
    default: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
    template: "%s | PhysicsLab",
  },
  description:
    "Тренажёр по физике для ЦЭ/ЦТ: уроки по темам, короткие тренировки, разбор каждой ошибки и честный прогресс.",
  applicationName: "PhysicsLab",
  openGraph: {
    title: "PhysicsLab — подготовка к ЦЭ/ЦТ по физике",
    description:
      "Уроки по семи темам, тренировки по 10 задач, разбор каждой ошибки и план повторения.",
    locale: "ru_RU",
    type: "website",
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
