"use client";

/* eslint-disable @next/next/no-img-element -- supplied photos need an error fallback. */

import { useState } from "react";

export function PhotoMemory({ file, caption }: { file: string; caption: string }) {
  const [missing, setMissing] = useState(false);

  return (
    <figure className={missing ? "photo-memory photo-memory--missing" : "photo-memory"} data-file={file}>
      {!missing && <img src={`/${file}`} alt="" onError={() => setMissing(true)} />}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
