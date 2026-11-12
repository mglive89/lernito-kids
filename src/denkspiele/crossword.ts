import type { Rng } from '../learning/types';
import { shuffle } from '../lib/random';
import type { ClueWord } from './crosswordWords';

/** Kreuzworträtsel-Generator: legt Wörter so, dass sie sich kreuzen, und nummeriert die Anfänge. */
export type Across = 'waagerecht' | 'senkrecht';

export interface PlacedWord extends ClueWord { num: number; dir: Across; row: number; col: number }
export interface Crossword {
  rows: number;
  cols: number;
  /** Lösungsbuchstabe je Feld, null = schwarzes Feld */
  grid: (string | null)[];
  words: PlacedWord[];
}

interface Raw extends ClueWord { dir: Across; row: number; col: number }

const letters = (w: string) => [...w];

function tryLayout(rng: Rng, pool: ClueWord[], count: number, maxDim: number): Raw[] {
  const cells = new Map<string, { ch: string; dirs: Set<Across> }>();
  const key = (r: number, c: number) => `${r},${c}`;
  const placed: Raw[] = [];
  let minR = 0, maxR = 0, minC = 0, maxC = 0;

  const check = (w: string, row: number, col: number, dir: Across): number => {
    const ls = letters(w);
    const dr = dir === 'senkrecht' ? 1 : 0, dc = dir === 'waagerecht' ? 1 : 0;
    // Feld vor und nach dem Wort muss frei sein
    if (cells.has(key(row - dr, col - dc)) || cells.has(key(row + dr * ls.length, col + dc * ls.length))) return -1;
    let cross = 0;
    for (let i = 0; i < ls.length; i++) {
      const r = row + dr * i, c = col + dc * i;
      const cell = cells.get(key(r, c));
      if (cell) {
        if (cell.ch !== ls[i] || cell.dirs.has(dir)) return -1;
        cross++;
      } else if (cells.has(key(r + dc, c + dr)) || cells.has(key(r - dc, c - dr))) return -1; // keine Nachbarn quer
    }
    const r2 = row + dr * (ls.length - 1), c2 = col + dc * (ls.length - 1);
    if (Math.max(maxR, r2) - Math.min(minR, row) + 1 > maxDim || Math.max(maxC, c2) - Math.min(minC, col) + 1 > maxDim) return -1;
    return cross;
  };

  const put = (cw: ClueWord, row: number, col: number, dir: Across) => {
    const ls = letters(cw.word);
    const dr = dir === 'senkrecht' ? 1 : 0, dc = dir === 'waagerecht' ? 1 : 0;
    ls.forEach((ch, i) => {
      const r = row + dr * i, c = col + dc * i;
      const cell = cells.get(key(r, c)) ?? { ch, dirs: new Set<Across>() };
      cell.dirs.add(dir);
      cells.set(key(r, c), cell);
      minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, c); maxC = Math.max(maxC, c);
    });
    placed.push({ ...cw, row, col, dir });
  };

  const words = shuffle(rng, pool).sort((a, b) => letters(b.word).length - letters(a.word).length + (rng() - 0.5) * 3);
  for (const cw of words) {
    if (placed.length >= count) break;
    if (letters(cw.word).length > maxDim) continue;
    if (placed.length === 0) { put(cw, 0, 0, 'waagerecht'); continue; }
    type Spot = { row: number; col: number; dir: Across; score: number };
    let best = null as Spot | null;
    const ls = letters(cw.word);
    for (const [k, cell] of cells) {
      const [r, c] = k.split(',').map(Number) as [number, number];
      ls.forEach((ch, i) => {
        if (ch !== cell.ch) return;
        for (const dir of ['waagerecht', 'senkrecht'] as Across[]) {
          const row = dir === 'senkrecht' ? r - i : r, col = dir === 'waagerecht' ? c - i : c;
          const s = check(cw.word, row, col, dir);
          if (s > 0) {
            const score = s + rng() * 0.5;
            if (!best || score > best.score) best = { row, col, dir, score };
          }
        }
      });
    }
    const b = best as Spot | null;
    if (b) put(cw, b.row, b.col, b.dir);
  }
  return placed;
}

export function createCrossword(rng: Rng, pool: ClueWord[], count: number, maxDim: number): Crossword {
  let raw: Raw[] = [];
  for (let attempt = 0; attempt < 30 && raw.length < count; attempt++) {
    const r = tryLayout(rng, pool, count, maxDim);
    if (r.length > raw.length) raw = r;
  }
  const minR = Math.min(...raw.map((w) => w.row)), minC = Math.min(...raw.map((w) => w.col));
  const norm = raw.map((w) => ({ ...w, row: w.row - minR, col: w.col - minC }));
  let rows = 0, cols = 0;
  for (const w of norm) {
    const n = letters(w.word).length;
    rows = Math.max(rows, w.dir === 'senkrecht' ? w.row + n : w.row + 1);
    cols = Math.max(cols, w.dir === 'waagerecht' ? w.col + n : w.col + 1);
  }
  const grid: (string | null)[] = new Array(rows * cols).fill(null);
  for (const w of norm) letters(w.word).forEach((ch, i) => {
    const r = w.row + (w.dir === 'senkrecht' ? i : 0), c = w.col + (w.dir === 'waagerecht' ? i : 0);
    grid[r * cols + c] = ch;
  });
  // Nummern in Lesereihenfolge
  const starts = [...new Set(norm.map((w) => w.row * cols + w.col))].sort((a, b) => a - b);
  const words: PlacedWord[] = norm
    .map((w) => ({ ...w, num: starts.indexOf(w.row * cols + w.col) + 1 }))
    .sort((a, b) => (a.dir === b.dir ? a.num - b.num : a.dir === 'waagerecht' ? -1 : 1));
  return { rows, cols, grid, words };
}

/** Felder eines Wortes (Index im Gitter). */
export function wordCells(cw: Crossword, w: PlacedWord): number[] {
  return letters(w.word).map((_, i) => (w.row + (w.dir === 'senkrecht' ? i : 0)) * cw.cols + w.col + (w.dir === 'waagerecht' ? i : 0));
}
