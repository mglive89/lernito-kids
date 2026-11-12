import type { Rng } from '../learning/types';
import { shuffle } from '../lib/random';

/**
 * Sudoku für Kinder: 4×4 (Kästchen 2×2), 6×6 (2×3) und 9×9 (3×3).
 * Erzeugt eine vollständige Lösung und entfernt dann Zahlen, solange das Rätsel eindeutig lösbar bleibt.
 * Ein Feld ist 0, wenn es leer ist.
 */
export type SudokuSize = 4 | 6 | 9;
export type Difficulty = 'leicht' | 'mittel' | 'schwer';

export interface SudokuPuzzle {
  size: SudokuSize;
  /** Höhe und Breite eines Kästchens */
  box: [number, number];
  /** Startfelder (0 = leer) */
  givens: number[];
  solution: number[];
}

export const BOX: Record<SudokuSize, [number, number]> = { 4: [2, 2], 6: [2, 3], 9: [3, 3] };

/** Anteil der Felder, die am Anfang sichtbar sind. */
const VISIBLE: Record<SudokuSize, Record<Difficulty, number>> = {
  4: { leicht: 0.62, mittel: 0.5, schwer: 0.38 },
  6: { leicht: 0.6, mittel: 0.5, schwer: 0.42 },
  9: { leicht: 0.55, mittel: 0.44, schwer: 0.36 }
};

/** Prüft, ob Wert v an Stelle i erlaubt ist (Zeile, Spalte, Kästchen). */
export function canPlace(grid: number[], size: SudokuSize, i: number, v: number): boolean {
  const [bh, bw] = BOX[size];
  const r = Math.floor(i / size), c = i % size;
  for (let k = 0; k < size; k++) {
    if (k !== c && grid[r * size + k] === v) return false;
    if (k !== r && grid[k * size + c] === v) return false;
  }
  const br = r - (r % bh), bc = c - (c % bw);
  for (let y = br; y < br + bh; y++) for (let x = bc; x < bc + bw; x++) {
    const j = y * size + x;
    if (j !== i && grid[j] === v) return false;
  }
  return true;
}

/** Zählt Lösungen (bricht bei `limit` ab). */
export function countSolutions(grid: number[], size: SudokuSize, limit = 2): number {
  const g = [...grid];
  let count = 0;
  const solve = (): boolean => {
    // Feld mit den wenigsten Möglichkeiten zuerst – schnell auch für 9×9
    let best = -1, bestOpts: number[] = [];
    for (let i = 0; i < g.length; i++) {
      if (g[i] !== 0) continue;
      const opts: number[] = [];
      for (let v = 1; v <= size; v++) if (canPlace(g, size, i, v)) opts.push(v);
      if (opts.length === 0) return false;
      if (best === -1 || opts.length < bestOpts.length) { best = i; bestOpts = opts; if (opts.length === 1) break; }
    }
    if (best === -1) { count++; return count >= limit; }
    for (const v of bestOpts) {
      g[best] = v;
      if (solve()) return true;
      g[best] = 0;
    }
    return false;
  };
  solve();
  return count;
}

function fillGrid(rng: Rng, size: SudokuSize): number[] {
  const g = new Array<number>(size * size).fill(0);
  const fill = (i: number): boolean => {
    if (i === g.length) return true;
    for (const v of shuffle(rng, Array.from({ length: size }, (_, k) => k + 1))) {
      if (canPlace(g, size, i, v)) { g[i] = v; if (fill(i + 1)) return true; g[i] = 0; }
    }
    return false;
  };
  fill(0);
  return g;
}

export function createSudoku(rng: Rng, size: SudokuSize, difficulty: Difficulty): SudokuPuzzle {
  const solution = fillGrid(rng, size);
  const givens = [...solution];
  const target = Math.round(size * size * VISIBLE[size][difficulty]);
  let visible = givens.length;
  for (const i of shuffle(rng, givens.map((_, k) => k))) {
    if (visible <= target) break;
    const keep = givens[i]!;
    givens[i] = 0;
    if (countSolutions(givens, size) !== 1) givens[i] = keep;
    else visible--;
  }
  return { size, box: BOX[size], givens, solution };
}

/** Größe und Schwierigkeit passend zum Alter (0 = Kindergarten). */
export function sudokuDefaults(year: number): { size: SudokuSize; difficulty: Difficulty; pictures: boolean } {
  if (year === 0) return { size: 4, difficulty: 'leicht', pictures: true };
  if (year <= 2) return { size: 4, difficulty: 'mittel', pictures: false };
  if (year <= 5) return { size: 6, difficulty: 'leicht', pictures: false };
  if (year <= 8) return { size: 9, difficulty: 'leicht', pictures: false };
  return { size: 9, difficulty: 'mittel', pictures: false };
}
