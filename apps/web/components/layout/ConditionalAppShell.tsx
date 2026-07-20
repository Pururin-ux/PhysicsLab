"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "./AppShell";

export function ConditionalAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/dev") || pathname.startsWith("/design-lab")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
