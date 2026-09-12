"use client";

import { useCallback, useId, useRef, useState, useSyncExternalStore } from "react";
import { PixelIcon } from "@/components/pixel-icon";

const dismissed = new Set<string>();
const eventName = "mi-casa:guide-change";
const subscribe = (callback: () => void) => {
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(eventName, callback); window.removeEventListener("storage", callback); };
};
const tips = {
  sealed: "Tap the envelope or Open your letter to begin. Your soundtrack starts with your first interaction; the sound button lets you mute it anytime.",
  greeting: "Tap a photo to open the album viewer. Use Next and Previous, or your arrow keys; Escape closes it. Our memories is waiting at the end.",
  lock: "Enter the date hinted at below to unlock the memories. Your place stays saved in this tab, so you can take your time.",
  slots: "Open a save file to collect its memory. You can revisit every file, or continue to The letter whenever you like.",
  letter: "This page is yours to read at your own pace. The chapter buttons let you revisit your memories; One more thing opens the ending.",
  end: "You can reread the letter, return to the birthday, or visit Playground for a little game. Your memories stay collected in this tab.",
  playground: "Choose a challenge. Tap a piece, then its place on the board, or drag it there. Peek shows the picture; Fullscreen gives you more room. Reset only restarts the current challenge.",
} as const;

export function PageGuide({ page, screen, compact = false }: { page: "birthday" | "memories" | "playground"; screen: keyof typeof tips; compact?: boolean }) {
  const key = `mi-casa:guide:${page}:v1`;
  const snapshot = useCallback(() => {
    try { return dismissed.has(key) || localStorage.getItem(key) === "done"; }
    catch { return dismissed.has(key); }
  }, [key]);
  const seen = useSyncExternalStore(subscribe, snapshot, () => true);
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? (!seen && !compact);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    dismissed.add(key);
    try { localStorage.setItem(key, "done"); } catch { /* Keep the dismissal for this visit. */ }
    window.dispatchEvent(new Event(eventName));
    setManual(false);
    trigger.current?.focus({ preventScroll: true });
  };
  return <aside className={`page-guide ${open ? "page-guide--open" : ""}`} aria-label="Quick guide">
    <button ref={trigger} className="guide-toggle" aria-expanded={open} aria-controls={id} onClick={() => open ? close() : setManual(true)}><PixelIcon name="help" />{open ? "A little help, if you need it" : "Quick guide"}</button>
    <div id={id} hidden={!open} className="guide-content"><p>{tips[screen]}</p><button onClick={close}>Got it <PixelIcon name="check" /></button></div>
  </aside>;
}
