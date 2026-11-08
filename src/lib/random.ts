import type { Rng } from '../learning/types';

/** Deterministischer Zufallsgenerator (mulberry32) – für Tests reproduzierbar. */
export function createRng(seed: number = Date.now()): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  const v = arr[Math.floor(rng() * arr.length)];
  if (v === undefined) throw new Error('pick() auf leerem Array');
  return v;
}

export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export function sample<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  return shuffle(rng, arr).slice(0, n);
}

/** Erzeugt n eindeutige Ablenker-Zahlen in der Nähe der Lösung (inkl. Lösung, gemischt). */
export function numberOptions(rng: Rng, answer: number, n: number, min: number, max: number, spread = 3): number[] {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < n && guard < 200) {
    guard++;
    const d = randInt(rng, -spread, spread);
    const v = answer + (d === 0 ? (rng() > 0.5 ? spread + 1 : -spread - 1) : d);
    if (v >= min && v <= max) set.add(v);
  }
  let fill = min;
  while (set.size < n && fill <= max) set.add(fill++);
  return shuffle(rng, [...set]);
}

let idCounter = 0;
export function uid(prefix = 'id'): string {
  idCounter++;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Hilfsfunktion: erzeugt Auswahl-Optionen aus Zahlen. */
export function numChoice(nums: number[]): { id: string; label: string }[] {
  return nums.map((n) => ({ id: String(n), label: String(n) }));
}
