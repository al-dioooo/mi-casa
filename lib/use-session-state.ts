"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const fallback = new Map<string, string>();
const eventName = "mi-casa-save";
function read(key: string) {
  try { return fallback.get(key) ?? sessionStorage.getItem(key) ?? null; }
  catch { return fallback.get(key) ?? null; }
}
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(eventName, listener); window.removeEventListener("storage", listener); };
}
const serverSnapshot = () => null;

// A stable serialized snapshot keeps server rendering and browser hydration aligned.
export function useSessionState<T>(key: string, initial: T) {
  const snapshot = useCallback(() => read(key), [key]);
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const value = useMemo(() => {
    try { return raw === null ? initial : JSON.parse(raw) as T; }
    catch { return initial; }
  }, [raw, initial]);
  const update = useCallback((next: T | ((previous: T) => T)) => {
    let previous = initial;
    try { const stored = read(key); if (stored !== null) previous = JSON.parse(stored) as T; } catch { /* Use the fresh state if a save is unreadable. */ }
    const serialized = JSON.stringify(typeof next === "function" ? (next as (value: T) => T)(previous) : next);
    fallback.set(key, serialized);
    try { sessionStorage.setItem(key, serialized); } catch { /* Keep working when browser storage is unavailable. */ }
    window.dispatchEvent(new Event(eventName));
  }, [key, initial]);
  return [value, update] as const;
}
