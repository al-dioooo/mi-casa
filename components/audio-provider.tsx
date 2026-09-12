"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";

type AudioContextValue = { play: () => void };
const AudioContext = createContext<AudioContextValue>({ play: () => undefined });

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [visible, setVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = siteContent.musicVolume;
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setVisible(true);
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      return;
    }
    audio.pause();
    setIsPlaying(false);
  }, []);

  return (
    <AudioContext.Provider value={{ play }}>
      <audio ref={audioRef} src={siteContent.music} loop preload="auto" />
      {children}
      {visible && (
        <button className={`mute ${isPlaying ? "" : "mute--off"}`} onClick={toggle} aria-label={isPlaying ? "Mute music" : "Play music"}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z" /><path className="wave" d="M15.5 8.5a5 5 0 0 1 0 7" /><path className="cross" d="M17 9l4 6M21 9l-4 6" /></svg>
        </button>
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
