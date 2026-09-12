import Link from "next/link";
import type { ReactNode } from "react";
import { PixelHeart } from "@/components/pixel-art";

export function ExperienceShell({ children, kind }: { children: ReactNode; kind: "greet" | "memories" }) {
  return <div className="desktop-shell">
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Mi Casa home"><PixelHeart />mi casa<span className="wordmark__dot">®</span></Link>
      <nav className="desktop-nav" aria-label="Main navigation"><Link href="/" aria-current={kind === "greet" ? "page" : undefined}><span>01</span> The birthday</Link><Link href="/memories" aria-current={kind === "memories" ? "page" : undefined}><span>02</span> Our memories</Link></nav>
      <span className="header-note"><span className="status-dot" /> made for one of one</span>
    </header>
    <main id="main" className={`experience experience--${kind}`}>{children}</main>
    <footer className="site-footer"><span><span className="status-dot" /> ALL FEELINGS SAVED</span><span>A LITTLE DISTANCE. A LOT OF LOVE.</span><span>PLAYER 01 <PixelHeart /> PLAYER 02</span></footer>
  </div>;
}
