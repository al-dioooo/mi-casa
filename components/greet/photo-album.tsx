"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";
import { PhotoMemory } from "@/components/greet/photo-memory";
import { PixelIcon } from "@/components/pixel-icon";

export function PhotoAlbum() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = active === null ? null : siteContent.photos[active];
  const move = (direction: number) => setActive(current => current === null ? null : (current + direction + siteContent.photos.length) % siteContent.photos.length);

  useEffect(() => {
    if (active === null) return;
    const viewer = dialog.current;
    if (!viewer?.open) viewer?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);

  const close = () => { dialog.current?.close(); setActive(null); };

  return <section className="photo-album" aria-labelledby="album-title">
    <div className="album-heading"><span className="eyebrow">OUR CAMERA ROLL / VOL. 01</span><h2 id="album-title">Little windows<br />into us.</h2><p>Ten moments worth keeping. Tap any photo to linger.</p></div>
    <div className="photo-list">{siteContent.photos.map((item, index) => <PhotoMemory key={item.file} photo={item} index={index} onOpen={() => setActive(index)} />)}</div>
    <p className="album-signoff"><PixelIcon name="save" /> 10 files. Still making memories.</p>
    <dialog ref={dialog} className="photo-viewer" aria-label="Photo album viewer" onCancel={close} onClose={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      {photo && <div className="photo-viewer__window">
        <div className="photo-viewer__bar"><span>MI CASA / PHOTO {(active ?? 0) + 1} OF {siteContent.photos.length}</span><button autoFocus onClick={close} aria-label="Close photo viewer"><PixelIcon name="close" /></button></div>
        <div className="photo-viewer__image" key={photo.file}><Image src={`/${photo.file}`} alt={photo.alt} width={photo.width} height={photo.height} unoptimized loading="eager" /></div>
        <p className="photo-viewer__caption" aria-live="polite">{photo.caption}</p>
        <div className="photo-viewer__controls"><button onClick={() => move(-1)} aria-label="Previous photo"><PixelIcon name="arrow-left" /> Previous</button><span>TAKE YOUR TIME</span><button onClick={() => move(1)} aria-label="Next photo">Next <PixelIcon name="arrow-right" /></button></div>
      </div>}
    </dialog>
  </section>;
}
