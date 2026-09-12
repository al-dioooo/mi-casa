"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { PageGuide } from "@/components/page-guide";
import { PixelHeart, PixelStar } from "@/components/pixel-art";
import { PixelIcon } from "@/components/pixel-icon";
import { useSessionState } from "@/lib/use-session-state";

const challenges = [
  { id: "moonlit", title: "Moonlit us", image: "/art/moonlit-us.png", key: "mi-casa:puzzle:v1", alt: "Pixel-art sweethearts on a moonlit lakeside dock beside a cottage and a sleeping cat.", ending: "A quiet evening, your head on my shoulder, and nowhere else to be.", pieces: [6, 2, 4, 8, 0, 7, 1, 5, 3] },
  { id: "cafe", title: "Rainy day us", image: "/art/rainy-day-us.png", key: "mi-casa:puzzle:cafe:v1", alt: "Pixel-art sweethearts sharing tea and cake in a flower-filled café while rain falls outside.", ending: "Let it rain. We have tea, a little cake, and each other.", pieces: [3, 7, 0, 5, 8, 1, 6, 2, 4] },
] as const;
const empty: number[] = [];
const position = (piece: number) => `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`;

export function Playground() {
  const [challenge, setChallenge] = useSessionState("mi-casa:challenge:v1", 0);
  const [full, setFull] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const exit = () => {
    setFull(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  };
  const enter = () => {
    setFull(true);
    // In-page fullscreen remains available when the browser API is unsupported or denied.
    if (document.documentElement.requestFullscreen) void document.documentElement.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    if (!full) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings = [...document.body.children].filter((item): item is HTMLElement => item instanceof HTMLElement && item !== consoleRef.current);
    const previous = siblings.map(item => item.inert);
    siblings.forEach(item => { item.inert = true; });
    consoleRef.current?.querySelector<HTMLButtonElement>("[data-game-fullscreen]")?.focus();
    const changed = () => { if (!document.fullscreenElement) setFull(false); };
    document.addEventListener("fullscreenchange", changed);
    return () => {
      document.body.style.overflow = overflow;
      siblings.forEach((item, i) => { item.inert = previous[i]; });
      document.removeEventListener("fullscreenchange", changed);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("[data-game-fullscreen]")?.focus({ preventScroll: true }));
    };
  }, [full]);

  const game = <div ref={consoleRef} className={`game-console ${full ? "game-console--full" : ""}`} role={full ? "dialog" : undefined} aria-modal={full ? true : undefined} aria-label="Playground puzzle" onKeyDown={event => {
    if (!full) return;
    if (event.key === "Escape") { event.preventDefault(); exit(); }
    if (event.key === "Tab") {
      const buttons = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]')].filter(item => item.getClientRects().length > 0);
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }}>
    <PuzzleChallenge key={challenge} challenge={challenges[challenge] ?? challenges[0]} full={full} onFullscreen={full ? exit : enter} onChallenge={index => { setChallenge(index); requestAnimationFrame(() => consoleRef.current?.querySelector<HTMLButtonElement>(`[data-challenge="${index}"]`)?.focus({ preventScroll: true })); }} />
  </div>;

  return <section className="screen playground-screen">
    <div className="playground-topline"><span className="eyebrow">THE TWO-PLAYER HEART CLUB</span><span>TWO LITTLE WORLDS</span></div>
    <div className="playground-intro"><h1>Piece by piece.<br /><span>Closer to you.</span></h1><p>Two challenges. Two places I’d love to be with you.</p></div>
    {full ? createPortal(game, document.body) : game}
    <footer className="playground-footer"><PixelStar /><p>Some things are better when they come together.</p><Link className="quiet-link" href="/memories">Back to our memories <PixelIcon name="arrow-right" /></Link></footer>
  </section>;
}

function PuzzleChallenge({ challenge, full, onFullscreen, onChallenge }: { challenge: typeof challenges[number]; full: boolean; onFullscreen: () => void; onChallenge: (index: number) => void }) {
  const [placed, setPlaced] = useSessionState<number[]>(challenge.key, empty);
  const [selected, setSelected] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [restart, setRestart] = useState(false);
  const [message, setMessage] = useState("Tap a piece below, then tap its home on the board.");
  const tray = useRef<HTMLDivElement>(null);
  const reward = useRef<HTMLAnchorElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const complete = placed.length === 9;
  const place = (target: number, piece = selected) => {
    if (!ready || peek || piece === null || placed.includes(target) || placed.includes(piece)) return;
    if (piece !== target) { setMessage("Not quite. Keep this piece and try another spot."); return; }
    setPlaced(current => current.includes(piece) ? current : [...current, piece]);
    setSelected(null);
    setMessage("A perfect fit. Pick your next piece.");
    requestAnimationFrame(() => (tray.current?.querySelector<HTMLButtonElement>("button:not(:disabled)") ?? reward.current)?.focus({ preventScroll: true }));
  };
  const select = (piece: number) => {
    setSelected(current => current === piece ? null : piece);
    setMessage(selected === piece ? "Piece tucked away. Pick any piece." : "Piece selected. Tap an empty spot on the board.");
  };
  const closeReset = () => { setRestart(false); resetButton.current?.focus({ preventScroll: true }); };

  return <>
    <div className="game-toolbar">
      <div className="challenge-switch" role="group" aria-label="Choose a challenge">{challenges.map((item, i) => <button key={item.id} data-challenge={i} aria-pressed={item.id === challenge.id} onClick={() => onChallenge(i)}><span>0{i + 1}</span> {item.title}</button>)}</div>
      <div className="game-actions" role="group" aria-label="Puzzle controls">
        <button disabled={!ready || complete} aria-pressed={peek} onClick={() => setPeek(value => !value)}><PixelIcon name={peek ? "arrow-left" : "help"} />{peek ? "Back to puzzle" : "Peek"}</button>
        <button ref={resetButton} aria-expanded={restart} onClick={() => setRestart(value => !value)}><PixelIcon name="reset" />Reset</button>
        <button data-game-fullscreen aria-pressed={full} onClick={onFullscreen}><PixelIcon name={full ? "close" : "fullscreen"} />{full ? "Exit fullscreen" : "Fullscreen"}</button>
      </div>
      {restart && <div className="game-reset-confirm" role="group" aria-label="Confirm reset"><p>Reset {challenge.title}? Your other challenge stays saved.</p><button onClick={() => { setPlaced([]); setSelected(null); setPeek(false); setMessage("A fresh start. Pick any piece."); closeReset(); }}>Reset this challenge</button><button onClick={closeReset}>Cancel</button></div>}
    </div>
    <div className="game-play-area" style={{ "--puzzle-image": `url('${challenge.image}')` } as CSSProperties}>
      <div className="game-board-area">
        <div className="game-board-label"><span><PixelHeart /> {challenge.title}</span><span role="status">{placed.length} / 9 pieces</span></div>
        <div className={`puzzle-board ${peek ? "puzzle-board--peek" : ""} ${complete ? "puzzle-board--complete" : ""}`} role="group" aria-label="Puzzle board, three rows and three columns">
          <Image className="puzzle-guide" src={challenge.image} alt={challenge.alt} width={1254} height={1254} unoptimized loading="eager" onLoad={() => setReady(true)} onError={() => setFailed(true)} />
          {Array.from({ length: 9 }, (_, index) => <button key={index} className={`puzzle-cell ${placed.includes(index) ? "is-placed" : ""}`} style={{ backgroundPosition: position(index) }} aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}${placed.includes(index) ? ", complete" : ", empty"}`} disabled={!ready || placed.includes(index) || peek} onClick={() => selected === null ? setMessage("Choose a piece below first, then tap its home.") : place(index)} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={event => { event.preventDefault(); const raw = event.dataTransfer.getData("text/plain"); if (/^[0-8]$/.test(raw)) place(index, Number(raw)); }}><span>{placed.includes(index) ? "" : <PixelIcon name="save" />}</span></button>)}
        </div>
        <p className="game-feedback" role="status">{failed ? "The picture couldn’t load. Refresh to try again." : !ready ? "Unpacking our little world…" : complete ? "All nine pieces found their way home." : peek ? "Take a little look. Tap Back to puzzle when you’re ready." : message}</p>
      </div>
      <div className="game-tray-area">
        {complete ? <div className="puzzle-reward"><PixelHeart /><h2>Challenge complete.</h2><p>{challenge.ending}</p><a ref={reward} className="quiet-link" href={challenge.image} download={`${challenge.id}-us.png`}>Keep this picture <PixelIcon name="save" /></a><button className="pixel-button" onClick={() => onChallenge(challenge.id === "moonlit" ? 1 : 0)}>Visit the other world <PixelIcon name="arrow-right" /></button></div> : <>
          <div className="game-tray-label"><span>YOUR PIECES</span><span className="tray-swipe-hint">Swipe to see all nine <PixelIcon name="arrow-right" /></span></div>
          <div ref={tray} className="puzzle-tray" role="group" aria-label="Puzzle pieces">{challenge.pieces.map((piece, index) => <div className="puzzle-tray-slot" key={piece}>{placed.includes(piece) ? <span className="puzzle-tray-saved"><PixelIcon name="check" /><span>HOME</span></span> : <button className={`puzzle-piece ${selected === piece ? "is-selected" : ""}`} style={{ backgroundPosition: position(piece) }} disabled={!ready || peek} draggable={ready && !peek} onDragStart={event => { setSelected(piece); event.dataTransfer.setData("text/plain", String(piece)); event.dataTransfer.effectAllowed = "move"; }} aria-label={`Select piece ${index + 1}`} aria-pressed={selected === piece} onClick={() => select(piece)}><span>{String(index + 1).padStart(2, "0")}</span></button>}</div>)}</div>
        </>}
        <p className="game-save-note"><PixelIcon name="save" /> Each challenge saves separately in this tab.</p>
      </div>
    </div>
    <PageGuide page="playground" screen="playground" compact={full} />
  </>;
}
