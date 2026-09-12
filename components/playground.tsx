"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PixelHeart, PixelStar } from "@/components/pixel-art";
import { PixelIcon } from "@/components/pixel-icon";
import { useSessionState } from "@/lib/use-session-state";

const pieces = [6, 2, 4, 8, 0, 7, 1, 5, 3];
const empty: number[] = [];
const position = (piece: number) => `${(piece % 3) * 50}% ${Math.floor(piece / 3) * 50}%`;

export function Playground() {
  const [placed, setPlaced] = useSessionState<number[]>("mi-casa:puzzle:v1", empty);
  const [selected, setSelected] = useState<number | null>(null);
  const [peek, setPeek] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [restart, setRestart] = useState(false);
  const [message, setMessage] = useState("No timer. No rush. Just a little world to put together.");
  const tray = useRef<HTMLDivElement>(null);
  const reward = useRef<HTMLAnchorElement>(null);
  const complete = placed.length === 9;

  const place = (target: number, piece = selected) => {
    if (!ready || piece === null || placed.includes(target)) return;
    if (piece !== target) { setMessage("Almost. That little piece belongs somewhere else. Try another spot."); return; }
    setPlaced(current => current.includes(piece) ? current : [...current, piece]);
    setSelected(null);
    setMessage(placed.length === 8 ? "All nine pieces found their way home. Just like us." : "A perfect little fit. Choose your next piece.");
    // Move keyboard focus to the next available piece when the current one disappears.
    requestAnimationFrame(() => (tray.current?.querySelector<HTMLButtonElement>("button:not(:disabled)") ?? reward.current)?.focus({ preventScroll: true }));
  };

  return <section className="screen playground-screen">
    <div className="playground-topline"><span className="eyebrow">THE TWO-PLAYER HEART CLUB</span><span>MINI GAME 001</span></div>
    <div className="playground-intro"><span className="playground-spark"><PixelStar /></span><h1>Piece by piece.<br /><span>Closer to you.</span></h1><p>Nine little pieces. One place I’d love to be with you.</p><p className="puzzle-quick-help">Pick a piece below, then tap its home on the board.</p></div>
    <div className="puzzle-workspace">
      <div className="puzzle-window">
        <div className="puzzle-titlebar"><span><PixelHeart /> MOONLIT_US.PUZZLE</span><span>{placed.length} / 09</span></div>
        <div className={`puzzle-board ${peek ? "puzzle-board--peek" : ""} ${complete ? "puzzle-board--complete" : ""}`} role="group" aria-label="Puzzle board, three rows and three columns">
          <Image className="puzzle-guide" src="/art/moonlit-us.png" alt="Pixel-art sweethearts on a lakeside dock beneath the moon, with a cozy cottage, flowers and a sleeping cat." width={1254} height={1254} onLoad={() => setReady(true)} onError={() => setFailed(true)} preload />
          {Array.from({ length: 9 }, (_, index) => <button key={index} className={`puzzle-cell ${placed.includes(index) ? "is-placed" : ""}`} style={{ backgroundPosition: position(index) }} aria-label={`Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}${placed.includes(index) ? ", complete" : ", empty"}`} disabled={!ready || placed.includes(index) || peek} onClick={() => { if (selected === null) setMessage("Choose a piece from the tray first, then tap its home."); else place(index); }} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={event => { event.preventDefault(); const raw = event.dataTransfer.getData("text/plain"); if (/^[0-8]$/.test(raw)) place(index, Number(raw)); }}><span>{placed.includes(index) ? "" : <PixelIcon name="save" />}</span></button>)}
        </div>
        <div className="puzzle-window-footer"><span>MADE FOR TWO / YOURS TO FINISH</span><PixelStar /></div>
        <p className="puzzle-status" role="status">{failed ? "The illustration couldn’t load. Refresh the page to try again." : !ready ? "Unpacking our little world…" : complete ? "All nine pieces found their way home. Just like us." : message}</p>
      </div>
      <aside className="puzzle-sidebar">
        <span className="eyebrow">{complete ? "ACHIEVEMENT UNLOCKED" : "A LITTLE HOW-TO"}</span>
        <h2>{complete ? "Our little world." : "Every piece belongs."}</h2>
        <p>{complete ? "A quiet evening, your head on my shoulder, and absolutely nowhere else to be." : "Tap a piece, then tap where it belongs. You can also drag it from the tray. The right pieces stay put."}</p>
        <div className="puzzle-progress" role="progressbar" aria-label="Puzzle completion" aria-valuemin={0} aria-valuemax={9} aria-valuenow={placed.length}>{Array.from({ length: 9 }, (_, i) => <span key={i} className={i < placed.length ? "is-filled" : ""} />)}</div>
        {!complete && <button className="pixel-button puzzle-peek" disabled={!ready} aria-pressed={peek} onClick={() => setPeek(value => !value)}>{peek ? "Back to the puzzle" : "Peek at the picture"}<PixelIcon name={peek ? "arrow-left" : "arrow-up-right"} /></button>}
        {complete && <div className="puzzle-reward"><PixelHeart /><span>TOGETHER LOOKS GOOD ON US.</span><a ref={reward} className="quiet-link" href="/art/moonlit-us.png" download="a-little-world-for-two.png">Keep this little world <PixelIcon name="save" /></a></div>}
        <div className="puzzle-reset">{restart ? <><p>Put all nine pieces back in the tray?</p><button className="quiet-link" onClick={() => { setPlaced([]); setSelected(null); setPeek(false); setRestart(false); setMessage("A fresh little start. Pick any piece."); }}>Yes, start again</button><button className="quiet-link" onClick={() => setRestart(false)}>Keep playing</button></> : <button className="quiet-link" disabled={placed.length === 0 && selected === null} onClick={() => setRestart(true)}>Start again</button>}</div>
        <span className="session-note"><PixelIcon name="save" /> Your puzzle is saved in this tab.</span>
      </aside>
    </div>
    {!complete && <div className="puzzle-tray-section"><div className="puzzle-tray-heading"><span className="eyebrow">THE LITTLE PIECES</span><span>{9 - placed.length} waiting to come home</span></div><div ref={tray} className="puzzle-tray" role="group" aria-label="Puzzle pieces">{pieces.map((piece, index) => <div className="puzzle-tray-slot" key={piece}>{placed.includes(piece) ? <span className="puzzle-tray-saved"><PixelIcon name="check" /><span>HOME</span></span> : <button className={`puzzle-piece ${selected === piece ? "is-selected" : ""}`} style={{ backgroundPosition: position(piece) }} disabled={!ready || peek} draggable={ready && !peek} onDragStart={event => { setSelected(piece); event.dataTransfer.setData("text/plain", String(piece)); event.dataTransfer.effectAllowed = "move"; }} aria-label={`Select piece ${index + 1}`} aria-pressed={selected === piece} onClick={() => { setSelected(current => current === piece ? null : piece); setMessage("Piece selected. Choose an empty spot on the board."); }}><span>{String(index + 1).padStart(2, "0")}</span></button>}</div>)}</div></div>}
    <footer className="playground-footer"><PixelStar /><p>Some things are better when they come together.</p><Link className="quiet-link" href="/memories">Back to our memories <PixelIcon name="arrow-right" /></Link></footer>
  </section>;
}
