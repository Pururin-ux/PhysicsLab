import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { ConditionalAppShell } from "../components/layout/ConditionalAppShell";
import { PersistenceHydrator } from "../components/layout/PersistenceHydrator";
import { PersistenceNotice } from "../components/layout/PersistenceNotice";
import "../styles/globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-unbounded",
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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('physicslab-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}",
          }}
        />
      </head>
      <body className={`${manrope.variable} ${unbounded.variable} font-sans`}>
        <PersistenceHydrator />
        <ConditionalAppShell>{children}</ConditionalAppShell>
        <PersistenceNotice />
      </body>
    </html>
  );
}
