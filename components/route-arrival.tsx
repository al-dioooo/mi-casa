"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function RouteArrival({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="route-arrival" key={pathname}>
    <div className="pixel-shutters" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i} />)}</div>
    {children}
  </div>;
}
