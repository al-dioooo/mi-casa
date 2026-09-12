import { ExperienceShell } from "@/components/experience-shell";

export default function GreetLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <ExperienceShell kind="greet">{children}</ExperienceShell>;
}
