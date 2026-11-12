import { describe, expect, it } from 'vitest';
import { createRng } from '../lib/random';
import { canPlace, countSolutions, createSudoku, type SudokuSize } from './sudoku';
import { newTwinGame, slide, move, type TwinState } from './twins';
import { blockStep, newBlockGame, fits } from './blocks';
import { createCrossword, wordCells } from './crossword';
import { CROSS_WORDS } from './crosswordWords';

describe('Sudoku', () => {
  for (const size of [4, 6, 9] as SudokuSize[]) {
    it(`${size}×${size}: gültige Lösung, eindeutig lösbar`, () => {
      const p = createSudoku(createRng(size * 7), size, 'mittel');
      expect(p.solution.every((v, i) => v >= 1 && v <= size && canPlace(p.solution, size, i, v))).toBe(true);
      expect(p.givens.every((v, i) => v === 0 || v === p.solution[i])).toBe(true);
      expect(p.givens.filter((v) => v === 0).length).toBeGreaterThan(size);
      expect(countSolutions(p.givens, size)).toBe(1);
    });
  }
});

describe('Zahlen-Zwillinge', () => {
  const state = (vals: number[][]): TwinState => ({
    size: 4, score: 0, nextId: 100, goal: 64, won: false, over: false,
    tiles: vals.flatMap((row, r) => row.map((v, c) => ({ id: r * 4 + c + 1, value: v, row: r, col: c }))).filter((t) => t.value > 0)
  });
  it('verschmilzt Zwillinge nur einmal pro Zug', () => {
    const s = slide(state([[2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'links')!;
    const row = s.tiles.filter((t) => t.row === 0).sort((a, b) => a.col - b.col).map((t) => t.value);
    expect(row).toEqual([4, 4]);
    expect(s.score).toBe(8);
  });
  it('kein Zug, wenn sich nichts bewegt', () => {
    expect(slide(state([[2, 4, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'links')).toBeNull();
  });
  it('schiebt nach rechts und unten', () => {
    const s = slide(state([[2, 0, 2, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0]]), 'runter')!;
    expect(s.tiles.find((t) => t.value === 2 && t.col === 0)?.row).toBe(2);
    expect(s.tiles.find((t) => t.value === 2 && t.col === 2)?.row).toBe(3);
    const r = slide(state([[2, 0, 2, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'rechts')!;
    expect(r.tiles.filter((t) => t.row === 0).sort((a, b) => a.col - b.col).map((t) => t.value)).toEqual([4, 4]);
  });
  it('erkennt Ziel und Spielende', () => {
    const won = slide(state([[32, 32, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 'links')!;
    expect(won.won).toBe(true);
    const full = state([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [8, 16, 8, 0]]);
    const after = move(full, 'rechts', () => 0.95);
    expect(after?.over).toBe(true);
  });
  it('neues Spiel hat zwei Plättchen', () => {
    expect(newTwinGame(createRng(1), 64).tiles).toHaveLength(2);
  });
});

describe('Blockregen', () => {
  it('Form fällt, landet und eine volle Reihe verschwindet', () => {
    let s = newBlockGame(createRng(3), false);
    // unterste Reihe bis auf die Breite der Form füllen
    const w = s.width, h = s.height;
    const board = [...s.board];
    const pieceCols = new Set(s.piece.cells.filter(([r]) => r === Math.max(...s.piece.cells.map(([rr]) => rr))).map(([, c]) => s.piece.col + c));
    for (let x = 0; x < w; x++) if (!pieceCols.has(x)) board[(h - 1) * w + x] = 1;
    s = { ...s, board };
    const lines = s.lines;
    s = blockStep(s, 'fallen');
    expect(s.lines).toBeGreaterThanOrEqual(lines + 1);
    expect(fits(s, s.piece)).toBe(true);
  });
  it('Drehen und Bewegen bleiben im Feld', () => {
    let s = newBlockGame(createRng(9), true);
    for (let i = 0; i < 20; i++) s = blockStep(s, 'links');
    s = blockStep(s, 'drehen');
    expect(fits(s, s.piece)).toBe(true);
    expect(Math.min(...s.piece.cells.map(([, c]) => s.piece.col + c))).toBe(0);
  });
  it('Spielende, wenn kein Platz mehr ist', () => {
    let s = newBlockGame(createRng(5), false);
    for (let i = 0; i < 200 && !s.over; i++) s = blockStep(s, 'fallen');
    expect(s.over).toBe(true);
  });
});

describe('Kreuzworträtsel', () => {
  for (const lang of ['de', 'it'] as const) {
    for (const level of [1, 2, 3] as const) {
      it(`${lang} Stufe ${level}: Wörter kreuzen sich korrekt`, () => {
        const pool = CROSS_WORDS[lang][level];
        expect(pool.every((w) => /^[A-ZÄÖÜ]+$/.test(w.word))).toBe(true);
        if (lang === 'it') expect(pool.every((w) => /^[A-Z]+$/.test(w.word))).toBe(true);
        const count = level === 1 ? 5 : level === 2 ? 7 : 8;
        const cw = createCrossword(createRng(level * 11), pool, count, level === 1 ? 9 : 13);
        expect(cw.words.length).toBeGreaterThanOrEqual(count - 1);
        for (const w of cw.words) {
          expect(wordCells(cw, w).map((i) => cw.grid[i]).join('')).toBe(w.word);
        }
        expect(Math.max(cw.rows, cw.cols)).toBeLessThanOrEqual(level === 1 ? 9 : 13);
      });
    }
  }
});
