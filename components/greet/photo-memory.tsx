"use client";

/* eslint-disable @next/next/no-img-element -- supplied photos need an error fallback. */

import { useState } from "react";
import { PixelHeart, PixelStar } from "@/components/pixel-art";

export function PhotoMemory({ file, caption }: { file: string; caption: string }) {
  const [missing, setMissing] = useState(false);
  const number = file.match(/\d+/)?.[0] ?? "1";
  const placeholder = caption === "Write your caption here.";
  return (
    <figure className={missing ? "photo-memory photo-memory--missing" : "photo-memory"}>
      {!missing && <img src={`/${file}`} alt={placeholder ? `Memory ${number}` : caption} onError={() => setMissing(true)} />}
      {missing && <div className={`memory-illustration memory-illustration--${number}`}><PixelStar /><PixelHeart /><span>MORE MEMORIES<br />TO MAKE.</span><PixelStar /></div>}
      <figcaption><span>0{number}</span>{placeholder ? ["A little closer, even from here.", "My favorite place is with you.", "The best is still to come."][Number(number) - 1] : caption}<span>♡</span></figcaption>
    </figure>
  );
}
