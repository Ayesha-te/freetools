"use client";

import { useCallback, useSyncExternalStore } from "react";

const FAV = "fth-favorites";
const RECENT = "fth-recent";
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; val: string[] }>();
const EMPTY: string[] = [];

function read(key: string): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return EMPTY;
  }
  const c = cache.get(key);
  if (c && c.raw === raw) return c.val;
  let val: string[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    val = Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, 50) : EMPTY;
  } catch {
    val = EMPTY;
  }
  cache.set(key, { raw, val });
  return val;
}
function write(key: string, val: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage unavailable (private mode) — feature silently degrades */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = () => l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, () => read(FAV), () => EMPTY);
  const toggle = useCallback((slug: string) => {
    const cur = read(FAV);
    write(FAV, cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]);
  }, []);
  return { favorites, toggle, isFavorite: (s: string) => favorites.includes(s) };
}

export function useRecent() {
  const recent = useSyncExternalStore(subscribe, () => read(RECENT), () => EMPTY);
  const clear = useCallback(() => write(RECENT, []), []);
  return { recent, clear };
}

export function pushRecent(slug: string) {
  const cur = read(RECENT).filter((s) => s !== slug);
  write(RECENT, [slug, ...cur].slice(0, 8));
}
