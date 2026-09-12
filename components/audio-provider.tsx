"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { siteContent } from "@/lib/site-content";
import { PixelIcon } from "@/components/pixel-icon";

type AudioContextValue = { play: () => void };
const AudioContext = createContext<AudioContextValue>({ play: () => undefined });

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const manuallyPaused = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = siteContent.musicVolume;
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || manuallyPaused.current) return;
    setError(false);
    audio.play().catch(() => { setIsPlaying(false); setError(true); });
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { manuallyPaused.current = false; play(); }
    else { manuallyPaused.current = true; audio.pause(); }
  };

  return <AudioContext.Provider value={{ play }}>
    <audio ref={audioRef} src={siteContent.music} loop preload="metadata" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => { setError(true); setIsPlaying(false); }} />
    {children}
    <button className={`music-control ${isPlaying ? "music-control--playing" : ""}`} onClick={toggle} aria-label={isPlaying ? "Mute music" : "Play music"} aria-pressed={isPlaying} title={error ? "Music couldn’t play. Click to retry." : "Your birthday soundtrack"}>
      <PixelIcon name={isPlaying ? "sound" : "muted"} /><span>{error ? "Retry music" : isPlaying ? "Music on" : "Music off"}</span><span className="equalizer" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  </AudioContext.Provider>;
}

export function useAudio() { return useContext(AudioContext); }
