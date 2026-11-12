import type { Rng } from '../learning/types';

/**
 * „Blockregen“: Formen fallen nach unten; volle Reihen verschwinden.
 * Für die Kleinsten gibt es kleinere Formen und ein schmaleres Feld.
 */
export interface Piece { kind: number; cells: [number, number][]; row: number; col: number }

export interface BlockState {
  width: number;
  height: number;
  /** 0 = leer, sonst Farbnummer 1–7 */
  board: number[];
  piece: Piece;
  next: number;
  lines: number;
  score: number;
  over: boolean;
  seed: number;
  kids: boolean;
}

/** Formen als [Zeile, Spalte]. Die Nummer ist zugleich die Farbe. */
const SHAPES: Record<number, [number, number][]> = {
  1: [[0, 0], [0, 1], [0, 2], [0, 3]],
  2: [[0, 0], [0, 1], [1, 0], [1, 1]],
  3: [[0, 1], [1, 0], [1, 1], [1, 2]],
  4: [[0, 0], [1, 0], [1, 1], [1, 2]],
  5: [[0, 2], [1, 0], [1, 1], [1, 2]],
  6: [[0, 1], [0, 2], [1, 0], [1, 1]],
  7: [[0, 0], [0, 1], [1, 1], [1, 2]],
  // kleine Formen für jüngere Kinder
  8: [[0, 0], [0, 1]],
  9: [[0, 0], [0, 1], [0, 2]],
  10: [[0, 0], [1, 0], [1, 1]]
};
const BIG = [1, 2, 3, 4, 5, 6, 7];
const SMALL = [2, 8, 9, 10, 3];

export const blockColor = (kind: number) => ((kind - 1) % 7) + 1;

/** Zufallszahl aus dem Spielzustand (deterministisch, damit der Reducer rein bleibt). */
function nextRandom(seed: number): [number, number] {
  let t = (seed + 0x6d2b79f5) >>> 0;
  const s = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return [((t ^ (t >>> 14)) >>> 0) / 4294967296, s];
}

function randomKind(seed: number, kids: boolean): [number, number] {
  const [r, s] = nextRandom(seed);
  const set = kids ? SMALL : BIG;
  return [set[Math.floor(r * set.length)]!, s];
}

function makePiece(kind: number, width: number): Piece {
  const cells = SHAPES[kind]!.map(([r, c]) => [r, c] as [number, number]);
  const w = Math.max(...cells.map(([, c]) => c)) + 1;
  return { kind, cells, row: 0, col: Math.floor((width - w) / 2) };
}

export function fits(s: Pick<BlockState, 'width' | 'height' | 'board'>, p: Piece): boolean {
  return p.cells.every(([r, c]) => {
    const y = p.row + r, x = p.col + c;
    return x >= 0 && x < s.width && y < s.height && (y < 0 || s.board[y * s.width + x] === 0);
  });
}

export function newBlockGame(rng: Rng, kids: boolean): BlockState {
  const width = kids ? 8 : 10, height = kids ? 14 : 18;
  let seed = Math.floor(rng() * 2 ** 31);
  let a: number, b: number;
  [a, seed] = randomKind(seed, kids);
  [b, seed] = randomKind(seed, kids);
  return { width, height, board: new Array(width * height).fill(0), piece: makePiece(a, width), next: b, lines: 0, score: 0, over: false, seed, kids };
}

function rotateCells(cells: [number, number][]): [number, number][] {
  // im Uhrzeigersinn drehen und wieder an (0,0) ausrichten
  const rot = cells.map(([r, c]) => [c, -r] as [number, number]);
  const minR = Math.min(...rot.map(([r]) => r)), minC = Math.min(...rot.map(([, c]) => c));
  return rot.map(([r, c]) => [r - minR, c - minC]);
}

export type BlockAction = 'links' | 'rechts' | 'drehen' | 'runter' | 'fallen' | 'tick';

function lockPiece(s: BlockState): BlockState {
  const board = [...s.board];
  let overflow = false;
  for (const [r, c] of s.piece.cells) {
    const y = s.piece.row + r, x = s.piece.col + c;
    if (y < 0) overflow = true;
    else board[y * s.width + x] = blockColor(s.piece.kind);
  }
  // volle Reihen entfernen
  const rows: number[][] = [];
  for (let y = 0; y < s.height; y++) rows.push(board.slice(y * s.width, (y + 1) * s.width));
  const kept = rows.filter((row) => row.some((v) => v === 0));
  const cleared = s.height - kept.length;
  const fresh = Array.from({ length: cleared }, () => new Array<number>(s.width).fill(0));
  const newBoard = [...fresh, ...kept].flat();
  const points = [0, 100, 300, 500, 800][cleared] ?? 800;
  let seed = s.seed, nextKind: number;
  [nextKind, seed] = randomKind(seed, s.kids);
  const piece = makePiece(s.next, s.width);
  const next: BlockState = { ...s, board: newBoard, piece, next: nextKind, seed, lines: s.lines + cleared, score: s.score + points };
  return { ...next, over: overflow || !fits(next, piece) };
}

export function blockStep(s: BlockState, action: BlockAction): BlockState {
  if (s.over) return s;
  const p = s.piece;
  const tryPiece = (q: Piece) => (fits(s, q) ? { ...s, piece: q } : s);
  switch (action) {
    case 'links': return tryPiece({ ...p, col: p.col - 1 });
    case 'rechts': return tryPiece({ ...p, col: p.col + 1 });
    case 'drehen': {
      const cells = rotateCells(p.cells);
      for (const dx of [0, -1, 1, -2, 2]) {
        const q = { ...p, cells, col: p.col + dx };
        if (fits(s, q)) return { ...s, piece: q };
      }
      return s;
    }
    case 'runter':
    case 'tick': {
      const q = { ...p, row: p.row + 1 };
      if (fits(s, q)) return { ...s, piece: q, score: s.score + (action === 'runter' ? 1 : 0) };
      return lockPiece(s);
    }
    case 'fallen': {
      let q = p, dist = 0;
      while (fits(s, { ...q, row: q.row + 1 })) { q = { ...q, row: q.row + 1 }; dist++; }
      return lockPiece({ ...s, piece: q, score: s.score + dist * 2 });
    }
  }
}

/** Wo die Form landen würde (Schatten-Vorschau). */
export function ghostRow(s: BlockState): number {
  let q = s.piece;
  while (fits(s, { ...q, row: q.row + 1 })) q = { ...q, row: q.row + 1 };
  return q.row;
}

/** Zeit pro Schritt in ms – wird mit jeder 10. Reihe etwas schneller, bleibt aber kindgerecht. */
export function tickMs(s: BlockState): number {
  const base = s.kids ? 950 : 800;
  return Math.max(s.kids ? 450 : 220, base - Math.floor(s.lines / 10) * 70);
}

export const nextPreview = (kind: number) => SHAPES[kind]!;
