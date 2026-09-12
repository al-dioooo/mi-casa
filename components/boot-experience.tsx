"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSessionState } from "@/lib/use-session-state";
import { PixelHeart, PixelStar } from "@/components/pixel-art";
import { PixelIcon } from "@/components/pixel-icon";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const messages = ["Finding our little corner of the universe…", "Unpacking the moments worth keeping…", "Leaving a little love in every pixel…", "Welcome home, Angel."];

export function BootExperience({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [seen, setSeen] = useSessionState("mi-casa:boot:v1", false);
  const [step, setStep] = useState(0);
  const [departing, setDeparting] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useCallback(() => {
    if (exitTimer.current !== null) return;
    setStep(3);
    setDeparting(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    exitTimer.current = setTimeout(() => setSeen(true), reduced ? 0 : 240);
  }, [setSeen]);

  useEffect(() => {
    if (!hydrated || seen) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduced ? [setTimeout(finish, 0)] : [
      setTimeout(() => setStep(1), 420),
      setTimeout(() => setStep(2), 850),
      setTimeout(() => setStep(3), 1250),
      setTimeout(finish, 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, [hydrated, seen, finish]);

  useEffect(() => {
    if (!hydrated || seen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      const main = document.querySelector<HTMLElement>("main");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
    };
  }, [hydrated, seen]);

  useEffect(() => () => { if (exitTimer.current !== null) clearTimeout(exitTimer.current); }, []);

  return <>
    <div className="boot-content" inert={hydrated && !seen}>{children}</div>
    {!seen && <div className={`boot-screen ${departing ? "boot-screen--departing" : ""}`} role="dialog" aria-modal="true" aria-labelledby="boot-title" onKeyDown={event => { if (event.key === "Escape") finish(); if (event.key === "Tab") { event.preventDefault(); skipRef.current?.focus(); } }}>
      <div className="boot-coordinate" aria-hidden="true">A SMALL WORLD / BUILT FOR TWO</div>
      <div className="boot-window">
        <div className="boot-titlebar"><span><PixelIcon name="save" /> MI CASA OS</span><span>PERSONAL EDITION</span></div>
        <div className="boot-window__body">
          <div className="boot-symbol" aria-hidden="true"><PixelStar /><PixelHeart /><PixelStar /></div>
          <span className="eyebrow">SOMEWHERE YOU BELONG</span>
          <h1 id="boot-title">A little world<br />is waking up<span className="boot-cursor">_</span></h1>
          <p className="boot-message" role="status">{messages[step]}</p>
          <div className="boot-progress" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <span key={index} className={index < (step + 1) * 4 ? "is-filled" : ""} />)}</div>
          <div className="boot-progress-label"><span>WELCOME SEQUENCE</span><span>0{step + 1} / 04</span></div>
          <button ref={skipRef} className="quiet-link boot-skip" onClick={finish}>Come right in <PixelIcon name="arrow-right" /></button>
        </div>
      </div>
      <p className="boot-signoff"><PixelHeart /> Made with love. Always.</p>
    </div>}
    <noscript><style>{".boot-screen { display: none !important; }"}</style></noscript>
  </>;
}
