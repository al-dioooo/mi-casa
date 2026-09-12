import type { Metadata } from "next";
import { AudioProvider } from "@/components/audio-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Casa",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
