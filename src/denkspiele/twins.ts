import type { Rng } from '../learning/types';

/**
 * „Zahlen-Zwillinge“: Zahlenplättchen in eine Richtung schieben;
 * zwei gleiche Zahlen (Zwillinge) verschmelzen zu ihrer Summe.
 * Reine Logik ohne Oberfläche – Plättchen haben eine id, damit die Oberfläche sie gleiten lassen kann.
 */
export interface TwinTile { id: number; value: number; row: number; col: number; merged?: boolean; fresh?: boolean }
export type Dir = 'links' | 'rechts' | 'hoch' | 'runter';

export interface TwinState {
  size: number;
  tiles: TwinTile[];
  score: number;
  nextId: number;
  goal: number;
  won: boolean;
  over: boolean;
}

export function twinGoal(year: number): number {
  if (year <= 2) return 64;
  if (year <= 5) return 256;
  return 1024;
}

function emptyCells(s: TwinState): [number, number][] {
  const taken = new Set(s.tiles.map((t) => t.row * s.size + t.col));
  const out: [number, number][] = [];
  for (let i = 0; i < s.size * s.size; i++) if (!taken.has(i)) out.push([Math.floor(i / s.size), i % s.size]);
  return out;
}

export function spawn(s: TwinState, rng: Rng): TwinState {
  const free = emptyCells(s);
  if (free.length === 0) return s;
  const [row, col] = free[Math.floor(rng() * free.length)]!;
  const value = rng() < 0.9 ? 2 : 4;
  return { ...s, tiles: [...s.tiles, { id: s.nextId, value, row, col, fresh: true }], nextId: s.nextId + 1 };
}

export function newTwinGame(rng: Rng, goal: number, size = 4): TwinState {
  let s: TwinState = { size, tiles: [], score: 0, nextId: 1, goal, won: false, over: false };
  s = spawn(s, rng);
  return spawn(s, rng);
}

/** Schiebt alle Plättchen; gibt null zurück, wenn sich nichts bewegt. */
export function slide(s: TwinState, dir: Dir): TwinState | null {
  const n = s.size;
  const horizontal = dir === 'links' || dir === 'rechts';
  const reverse = dir === 'rechts' || dir === 'runter';
  const grid = new Map<number, TwinTile>();
  for (const t of s.tiles) grid.set(t.row * n + t.col, { ...t, merged: false, fresh: false });
  const result: TwinTile[] = [];
  let score = s.score, nextId = s.nextId, moved = false;
  for (let line = 0; line < n; line++) {
    const cells: TwinTile[] = [];
    for (let k = 0; k < n; k++) {
      const pos = reverse ? n - 1 - k : k;
      const t = horizontal ? grid.get(line * n + pos) : grid.get(pos * n + line);
      if (t) cells.push(t);
    }
    const packed: TwinTile[] = [];
    for (const t of cells) {
      const last = packed[packed.length - 1];
      if (last && last.value === t.value && !last.merged) {
        packed[packed.length - 1] = { id: nextId++, value: t.value * 2, row: 0, col: 0, merged: true };
        score += t.value * 2;
      } else packed.push(t);
    }
    packed.forEach((t, k) => {
      const pos = reverse ? n - 1 - k : k;
      const row = horizontal ? line : pos, col = horizontal ? pos : line;
      if (t.merged || t.row !== row || t.col !== col) moved = true;
      result.push({ ...t, row, col });
    });
  }
  if (!moved) return null;
  const won = s.won || result.some((t) => t.value >= s.goal);
  return { ...s, tiles: result, score, nextId, won };
}

export function canMove(s: TwinState): boolean {
  return (['links', 'rechts', 'hoch', 'runter'] as Dir[]).some((d) => slide(s, d) !== null);
}

/** Ein ganzer Zug: schieben, neues Plättchen, Spielende prüfen. */
export function move(s: TwinState, dir: Dir, rng: Rng): TwinState | null {
  const moved = slide(s, dir);
  if (!moved) return null;
  const next = spawn(moved, rng);
  return { ...next, over: !canMove(next) };
}
