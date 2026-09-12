import { ExperienceShell } from "@/components/experience-shell";

export default function PlaygroundLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ExperienceShell kind="playground">{children}</ExperienceShell>;
}
