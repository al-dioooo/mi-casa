import { ExperienceShell } from "@/components/experience-shell";

export default function MemoriesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ExperienceShell kind="memories">{children}</ExperienceShell>;
}
