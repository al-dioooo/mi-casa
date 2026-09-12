"use client";

import Image from "next/image";
import { useState } from "react";
import { PixelHeart } from "@/components/pixel-art";
import { PixelIcon } from "@/components/pixel-icon";

export type MemoryPhoto = { file: string; caption: string; alt: string; width: number; height: number };

export function PhotoMemory({ photo, index, onOpen }: { photo: MemoryPhoto; index: number; onOpen: () => void }) {
  const [status, setStatus] = useState("loading");
  return <figure className={`photo-memory photo-memory--${status} ${photo.width > photo.height ? "photo-memory--wide" : ""}`}>
    <button className="photo-open" onClick={onOpen} aria-label={`Open photo ${index + 1}: ${photo.caption}`}>
      <div className="photo-frame">
        <Image src={`/${photo.file}`} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 600px) 80vw, 600px" onLoad={() => setStatus("ready")} onError={() => setStatus("error")} />
        {status === "error" && <span className="photo-error">This photo couldn’t load. Open it to try again.</span>}
      </div>
      <span className="photo-open-hint">TAKE A CLOSER LOOK <PixelIcon name="arrow-up-right" /></span>
    </button>
    <figcaption><span>{String(index + 1).padStart(2, "0")}</span><p>{photo.caption}</p><PixelHeart /></figcaption>
  </figure>;
}
