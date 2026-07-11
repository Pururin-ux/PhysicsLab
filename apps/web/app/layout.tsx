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
  title: "PhysicsLab",
  description: "Тренажёр по физике с задачами и разбором.",
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
