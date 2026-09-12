"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/audio-provider";
import { Envelope } from "@/components/greet/envelope";
import { PhotoAlbum } from "@/components/greet/photo-album";
import { PixelHeart, PixelStar, RetroComputer } from "@/components/pixel-art";
import { PixelIcon } from "@/components/pixel-icon";
import { usePixelTransition } from "@/lib/use-pixel-transition";
import { useSessionState } from "@/lib/use-session-state";
import { siteContent } from "@/lib/site-content";

export function GreetingExperience() {
  const { play } = useAudio();
  const { leaving, transition } = usePixelTransition();
  const [opened, setOpened] = useSessionState("mi-casa:birthday:v1", false);
  const [opening, setOpening] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const phase = opened ? "greeting" : opening ? "opening" : "sealed";
  const openEnvelope = () => {
    if (phase !== "sealed") return;
    setOpening(true);
    play();
  };

  useEffect(() => {
    if (phase !== "opening") return;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1100;
    const timer = window.setTimeout(() => setOpened(true), delay);
    return () => window.clearTimeout(timer);
  }, [phase, setOpened]);

  useEffect(() => {
    if (opened) headingRef.current?.focus();
  }, [opened]);

  if (phase !== "greeting") {
    return (
      <section className={`screen screen--envelope ${opening ? "envelope-delivery" : ""}`} aria-label="Birthday envelope" aria-busy={opening}>
        <div className="hero-topline"><span>EST. WITH LOVE / ALWAYS & FOREVER</span><span>YOUR BIRTHDAY EDITION <span className="tiny-cross">✚</span></span></div>
        <div className="birthday-hero">
          <div className="hero-copy">
            <span className="eyebrow">HEY, BIRTHDAY GIRL <PixelIcon name="arrow-up-right" /></span>
            <h1>A little<br />world.<br />All <span className="outlined-word">yours.</span><PixelStar className="heading-star" /></h1>
            <p>For my favorite person,<br />in every universe.</p>
            <button className="pixel-button hero-cta" onClick={openEnvelope} disabled={phase === "opening"}>{phase === "opening" ? "Opening…" : "Open your letter"}<PixelIcon name="arrow-up-right" /></button>
            <span className="cta-footnote">CLICK THE ENVELOPE. MAKE YOURSELF AT HOME.</span>
          </div>
          <RetroComputer><Envelope isOpen={phase === "opening"} isUnlocked recipient={siteContent.envelopeTo} onOpen={openEnvelope} /></RetroComputer>
          <aside className="hero-aside"><div className="love-meter"><PixelHeart /><strong>100<span>%</span></strong><span className="eyebrow">MY FAVORITE HUMAN</span><p>No high score could ever<br />come close to you.</p></div><div className="delivery-note"><PixelIcon name="turn-right" className="delivery-note__icon" /><p>I can’t be there today.<br />So I made you somewhere<br />we can always be.</p><span className="pixel-caption">WITH LOVE, PLAYER ONE</span></div></aside>
        </div>
        <div className="hero-bottom"><span className="edition-label">A BIRTHDAY<br />WORTH SAVING.<span>FILE 001 / ∞</span></span><div className="giant-title" aria-hidden="true">MI CASA<PixelStar /></div></div>
        <div className="hero-ticker"><span>♥ A LETTER FROM ME TO YOU</span><span>✦ LITTLE MOMENTS, FOREVER SAVED</span><span>♥ YOU FEEL LIKE HOME</span><span>✦ PRESS START ON A GOOD DAY</span></div>
      </section>
    );
  }

  return (
    <section className={`screen screen--greeting greeting-enter ${leaving ? "scene-leaving" : ""}`} aria-busy={leaving}>
      <div className="window-title"><span>birthday_letter.txt</span><PixelHeart /></div><div className="letter-toolbar"><span><PixelIcon name="check" /> Yours to keep</span><button className="quiet-link" onClick={() => transition(() => { setOpening(false); setOpened(false); window.scrollTo({ top: 0 }); })}><PixelIcon name="arrow-left" /> Back to the envelope</button></div><span className="eyebrow">LEVEL UP, BIRTHDAY GIRL</span><h1 tabIndex={-1} ref={headingRef}>{siteContent.greetTitle}</h1>
      <div className="lede">{siteContent.greetLede.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <PhotoAlbum />
      <div className="lede">{siteContent.greetClose.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <footer className="screen-footer"><Link href="/memories" className="pixel-button">Explore our memories <PixelIcon name="arrow-up-right" /></Link></footer>
    </section>
  );
}
