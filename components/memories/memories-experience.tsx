"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";
import { usePixelTransition } from "@/lib/use-pixel-transition";
import { useSessionState } from "@/lib/use-session-state";
import { PixelIcon } from "@/components/pixel-icon";
import { PixelHeart, PixelStar } from "@/components/pixel-art";
import { PixelKeepsake } from "@/components/pixel-keepsake";

type Stage = "lock" | "slots" | "letter" | "end";
type Save = { stage: Stage; loaded: number[]; finished: boolean };
const initialSave: Save = { stage: "lock", loaded: [], finished: false };
const titles = ["Until morning", "Player two", "The midnight assignments", "A little someday", "Every version of you"];

export function MemoriesExperience() {
  const [save, setSave] = useSessionState<Save>("mi-casa:memories:v1", initialSave);
  const { stage, loaded: loadedSlots } = save;
  const { leaving, transition } = usePixelTransition();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasFailed, setHasFailed] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(stage);

  useEffect(() => {
    if (previousStage.current !== stage) {
      headingRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      previousStage.current = stage;
    }
  }, [stage]);

  const goTo = (next: Stage) => {
    if (next !== stage) transition(() => setSave(current => ({ ...current, stage: next, finished: current.finished || next === "end" })));
  };
  const unlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = password.replace(/\D/g, "");
    if (siteContent.passwords.includes(typed as (typeof siteContent.passwords)[number])) {
      setError(""); setHasFailed(false); setPassword(""); goTo("slots");
      return;
    }
    setError(siteContent.wrongMsg);
    setHasFailed(false);
    window.requestAnimationFrame(() => setHasFailed(true));
    passwordRef.current?.focus(); passwordRef.current?.select();
  };
  const loadSlot = (index: number) => {
    setSave(current => ({ ...current, loaded: current.loaded.includes(index) ? current.loaded : [...current.loaded, index] }));
    setExpanded(current => current === index ? null : index);
  };
  const allLoaded = loadedSlots.length === siteContent.slots.length;

  return <section key={stage} aria-busy={leaving} className={`screen memories-screen chapter-arrival ${leaving ? "scene-leaving" : ""} ${stage === "end" ? "memories-screen--ending" : ""}`}>
    <nav className="chapter-nav" aria-label="Memory chapters">
      {(["slots", "letter", "end"] as const).map((chapter, index) => <button key={chapter} onClick={() => goTo(chapter)} disabled={stage === "lock" || (chapter === "end" && !save.finished)} aria-current={stage === chapter ? "step" : undefined}><span>0{index + 1}</span>{["Memories", "The letter", "Always"][index]}</button>)}
    </nav>
    {stage === "lock" && <>
      <div className="archive-emblem"><PixelIcon name="lock" /></div>
      <h2 ref={headingRef} tabIndex={-1}>A little secret.</h2>
      <p className="lede">{siteContent.lockHint}</p>
      <form className="lock-form" onSubmit={unlock} autoComplete="off">
        <label className="eyebrow" htmlFor="memory-password">THE NIGHT IT STARTED</label>
        <input id="memory-password" ref={passwordRef} className={hasFailed ? "lock-form__input lock-form__input--shake" : "lock-form__input"} value={password} onChange={(event) => { setPassword(event.target.value); setError(""); setHasFailed(false); }} inputMode="numeric" placeholder="Enter our date" aria-label="Password" aria-invalid={!!error} aria-describedby="password-feedback" />
        <button className="pixel-button" type="submit" disabled={!password.trim()}>Unlock our memories <PixelIcon name="arrow-right" /></button>
        <p id="password-feedback" className="form-error" aria-live="polite">{error}</p>
      </form>
      <footer className="screen-footer"><Link href="/" className="quiet-link"><PixelIcon name="arrow-left" /> Back to your birthday</Link></footer>
    </>}
    {stage === "slots" && <>
      <PixelKeepsake variant="garden" />
      <span className="eyebrow">SMALL MOMENTS. MY WHOLE WORLD.</span>
      <h2 ref={headingRef} tabIndex={-1}>Our save files.</h2>
      <p className="lede slots-intro">Five little things I never want to forget. Open one.</p>
      <div className="collection-status"><span aria-live="polite">{allLoaded ? "Every little moment, collected." : `${loadedSlots.length} of ${siteContent.slots.length} memories collected`}</span><PixelIcon name={allLoaded ? "check" : "save"} /><div className="collection-meter" role="progressbar" aria-label="Memories collected" aria-valuemin={0} aria-valuemax={5} aria-valuenow={loadedSlots.length}>{siteContent.slots.map((_, index) => <span key={index} className={index < loadedSlots.length ? "is-filled" : ""} />)}</div></div>
      <div className="slot-list">
        {siteContent.slots.map((memory, index) => {
          const isLoaded = loadedSlots.includes(index);
          const isExpanded = expanded === index;
          return <div className={`memory-card ${isLoaded ? "memory-card--collected" : ""}`} key={memory}>
            <button className="memory-slot" onClick={() => loadSlot(index)} aria-expanded={isExpanded} aria-controls={`memory-${index}`}>
              <span className="memory-slot__number">0{index + 1}</span><span className="memory-slot__title">{titles[index]}<small>{isExpanded ? "Click to tuck away" : isLoaded ? "Collected · open again" : "A memory waiting for you"}</small></span><PixelIcon name={isLoaded ? "check" : "arrow-up-right"} />
            </button>
            <div id={`memory-${index}`} className="memory-reveal" hidden={!isExpanded}><p>{memory}</p><span><PixelHeart /> A MOMENT WORTH KEEPING</span></div>
          </div>;
        })}
      </div>
      <div className="slots-complete">{allLoaded && <p className="collection-complete"><PixelStar /> Collection complete. There’s more to say.</p>}<button className="pixel-button" onClick={() => goTo("letter")}>{allLoaded ? "Read the letter" : "Continue to the letter"}<PixelIcon name="arrow-right" /></button>{!allLoaded && <p className="helper-note">Take your time. You can come back to these.</p>}</div>
      <footer className="screen-footer"><Link href="/" className="quiet-link"><PixelIcon name="arrow-left" /> Back to your birthday</Link><span className="session-note"><PixelIcon name="save" /> Your place is saved in this tab.</span></footer>
    </>}
    {stage === "letter" && <>
      <div className="letter-toolbar"><button className="quiet-link" onClick={() => goTo("slots")}><PixelIcon name="arrow-left" /> Back to our memories</button><span>JUST US / A FEW QUIET MINUTES</span></div>
      <PixelKeepsake />
      <article className="letter-paper"><h2 className="letter-salutation" ref={headingRef} tabIndex={-1}>{siteContent.letterSalutation}</h2>{siteContent.letter.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="letter-signature">{siteContent.signature}</p></article>
      <PixelKeepsake variant="garden" />
      <footer className="screen-footer"><button className="pixel-button" onClick={() => goTo("end")}>One more thing <PixelIcon name="arrow-right" /></button></footer>
    </>}
    {stage === "end" && <>
      <div className="pixel-celebration" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <PixelStar key={i} className={`confetti confetti--${i % 4}`} />)}</div>
      <span className="eyebrow">ACHIEVEMENT UNLOCKED</span><h2 ref={headingRef} tabIndex={-1}>You feel like home.</h2>
      <div className="ending-heart"><PixelHeart /></div>
      <div className="name-list">{siteContent.names.map(name => <span key={name}>{name}</span>)}</div><p className="save-line">{siteContent.saveLine}</p>
      <footer className="screen-footer"><button className="pixel-button" onClick={() => goTo("letter")}><PixelIcon name="arrow-left" /> Read it again</button><Link href="/" className="quiet-link ending-home">Back to your birthday <PixelIcon name="arrow-up-right" /></Link></footer>
    </>}
  </section>;
}
