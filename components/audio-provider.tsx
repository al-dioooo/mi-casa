"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";
import { PixelIcon } from "@/components/pixel-icon";

type AudioContextValue = { play: () => void };
const AudioContext = createContext<AudioContextValue>({ play: () => undefined });

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantsMusicRef = useRef(true);
  const [wantsMusic, setWantsMusic] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = siteContent.musicVolume;
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !wantsMusicRef.current) return;
    setError(false);
    audio.play().catch(() => { setIsPlaying(false); setError(true); });
  }, []);

  useEffect(() => {
    const start = (event: PointerEvent | KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest(".music-control")) return;
      play();
    };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [play]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!wantsMusic || error) {
      wantsMusicRef.current = true;
      setWantsMusic(true);
      play();
    } else {
      wantsMusicRef.current = false;
      setWantsMusic(false);
      audio.pause();
    }
  };

  return <AudioContext.Provider value={{ play }}>
    <audio ref={audioRef} src={siteContent.music} loop preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => { setError(true); setIsPlaying(false); }} />
    {children}
    <button className={`music-control ${isPlaying ? "music-control--playing" : ""}`} onClick={toggle} aria-label={wantsMusic ? "Mute music" : "Play music"} aria-pressed={wantsMusic} title={error ? "Music couldn’t play. Click to retry." : "Your birthday soundtrack"}>
      <PixelIcon name={wantsMusic ? "sound" : "muted"} /><span>{error ? "Retry music" : wantsMusic ? "Music on" : "Music off"}</span><span className="equalizer" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  </AudioContext.Provider>;
}

export function useAudio() { return useContext(AudioContext); }
