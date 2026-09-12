"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAudio } from "@/components/audio-provider";
import { Envelope } from "@/components/greet/envelope";
import { PhotoMemory } from "@/components/greet/photo-memory";
import { siteContent } from "@/lib/site-content";

export function GreetingExperience() {
  const { play } = useAudio();
  const [phase, setPhase] = useState<"sealed" | "opening" | "greeting">("sealed");
  const openEnvelope = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    play();
  };

  useEffect(() => {
    if (phase !== "opening") return;
    const timer = window.setTimeout(() => setPhase("greeting"), 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase !== "greeting") {
    return (
      <section className="screen screen--envelope" aria-label="Birthday envelope">
        <div className="envelope-wrap">
          <Envelope isOpen={phase === "opening"} isUnlocked recipient={siteContent.envelopeTo} onOpen={openEnvelope} />
          <div className="countdown"><small>Break the seal.</small></div>
        </div>
      </section>
    );
  }

  return (
    <section className="screen screen--greeting greeting-enter">
      <h1>{siteContent.greetTitle}</h1>
      <div className="lede">{siteContent.greetLede.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <div className="photo-list">
        {siteContent.photos.map((photo) => <PhotoMemory key={photo.file} {...photo} />)}
      </div>
      <div className="lede">{siteContent.greetClose.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <footer className="screen-footer"><Link href="/memories" className="quiet-link">Continue?<br />There&apos;s a second save.</Link></footer>
    </section>
  );
}
