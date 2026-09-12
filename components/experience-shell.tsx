import type { ReactNode } from "react";

export function ExperienceShell({ children, kind }: { children: ReactNode; kind: "greet" | "memories" }) {
  return <main className={`experience experience--${kind}`}>{children}</main>;
}
