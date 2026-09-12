"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";

type Stage = "lock" | "slots" | "letter" | "end";

export function MemoriesExperience() {
  const [stage, setStage] = useState<Stage>("lock");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasFailed, setHasFailed] = useState(false);
  const [loadedSlots, setLoadedSlots] = useState<number[]>([]);
  const passwordRef = useRef<HTMLInputElement>(null);

  const unlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typed = password.replace(/\D/g, "");
    if (siteContent.passwords.includes(typed as (typeof siteContent.passwords)[number])) {
      setError("");
      setHasFailed(false);
      setStage("slots");
      return;
    }
    setError(siteContent.wrongMsg);
    setHasFailed(false);
    window.requestAnimationFrame(() => setHasFailed(true));
    passwordRef.current?.focus();
    passwordRef.current?.select();
  };

  const loadSlot = (index: number) => {
    setLoadedSlots((loaded) => loaded.includes(index) ? loaded : [...loaded, index]);
  };

  if (stage === "lock") {
    return (
      <section className="screen memories-screen">
        <h2>Load save?</h2>
        <p className="lede">{siteContent.lockHint}</p>
        <form className="lock-form" onSubmit={unlock} autoComplete="off">
          <input ref={passwordRef} className={hasFailed ? "lock-form__input lock-form__input--shake" : "lock-form__input"} value={password} onChange={(event) => setPassword(event.target.value)} inputMode="numeric" placeholder="the date" aria-label="Password" />
          <button className="pixel-button" type="submit">Open</button>
          <p className={`form-error ${error ? "form-error--shown" : ""}`} aria-live="polite">{error}</p>
        </form>
        <footer className="screen-footer"><Link href="/" className="quiet-link">Back to your birthday</Link></footer>
      </section>
    );
  }

  if (stage === "slots") {
    const allLoaded = loadedSlots.length === siteContent.slots.length;
    return (
      <section className="screen memories-screen">
        <h2>Save data</h2>
        <p className="lede slots-intro">Tap one to load it.</p>
        <div className="slot-list">
          {siteContent.slots.map((memory, index) => {
            const isLoaded = loadedSlots.includes(index);
            return <button className={`memory-slot ${isLoaded ? "memory-slot--loaded" : ""}`} key={memory} onClick={() => loadSlot(index)} disabled={isLoaded}>
              <span className="memory-slot__number">Slot {index + 1}</span>
              <span className="memory-slot__body">{isLoaded ? memory : "Empty. Tap to load."}</span>
            </button>;
          })}
        </div>
        {allLoaded && <div className="slots-complete"><button className="pixel-button" onClick={() => setStage("letter")}>Read the letter</button></div>}
        <footer className="screen-footer"><button className="quiet-link" onClick={() => setStage("letter")}>or skip ahead</button></footer>
      </section>
    );
  }

  if (stage === "letter") {
    return (
      <section className="screen memories-screen">
        <article className="letter-paper">
          <p className="letter-salutation">{siteContent.letterSalutation}</p>
          {siteContent.letter.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="letter-signature">{siteContent.signature}</p>
        </article>
        <footer className="screen-footer"><button className="pixel-button" onClick={() => setStage("end")}>One more thing</button></footer>
      </section>
    );
  }

  return (
    <section className="screen memories-screen">
      <div className="name-list">{siteContent.names.map((name) => <span key={name}>{name}</span>)}</div>
      <p className="save-line">{siteContent.saveLine}</p>
      <footer className="screen-footer"><Link href="/" className="quiet-link">Back to the start</Link></footer>
    </section>
  );
}
