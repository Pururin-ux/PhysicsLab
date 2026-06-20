import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "../components/layout/NavBar";
import { OrbitDeco } from "../components/layout/OrbitDeco";
import { StarField } from "../components/layout/StarField";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PhysicsLab V3",
  description: "PhysicsLab V3 prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans`}>
        <StarField />
        <OrbitDeco />
        <NavBar />
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
