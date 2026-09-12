"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePixelTransition() {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transition = useCallback((update: () => void) => {
    if (timer.current !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { update(); return; }
    setLeaving(true);
    timer.current = setTimeout(() => {
      update();
      setLeaving(false);
      timer.current = null;
    }, 150);
  }, []);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  return { leaving, transition };
}
