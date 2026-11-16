import { useSyncExternalStore } from 'react';

/** Fortschritt in Lernito Adult – nur auf diesem Gerät (localStorage), ohne Profil. */
export interface AdultProgress {
  done: string[];
  /** zuletzt geöffneter Schritt je Anleitung */
  step: Record<string, number>;
  last?: string;
}

const KEY = 'lernito-adult';
const EMPTY: AdultProgress = { done: [], step: {} };
let cache: AdultProgress | null = null;
const listeners = new Set<() => void>();

function read(): AdultProgress {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    const d = raw ? JSON.parse(raw) : null;
    cache = d && Array.isArray(d.done) ? { done: d.done, step: d.step ?? {}, last: d.last } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: AdultProgress) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* privat/voll */ }
  listeners.forEach((l) => l());
}

export function useAdultProgress(): AdultProgress {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, read, () => EMPTY);
}

export function setStep(id: string, step: number) {
  const p = read();
  write({ ...p, step: { ...p.step, [id]: step }, last: id });
}

export function markDone(id: string) {
  const p = read();
  if (p.done.includes(id)) return;
  write({ ...p, done: [...p.done, id], last: id });
}

/** Welt merken: Schule oder Erwachsene (für den nächsten App-Start). */
export type World = 'school' | 'adult';
const WORLD_KEY = 'lernito-world';
export function getWorld(): World {
  try { return localStorage.getItem(WORLD_KEY) === 'adult' ? 'adult' : 'school'; } catch { return 'school'; }
}
export function setWorld(w: World) {
  try { localStorage.setItem(WORLD_KEY, w); } catch { /* egal */ }
}
