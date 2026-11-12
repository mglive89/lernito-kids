import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eraser, Lightbulb } from 'lucide-react';
import { createSudoku, sudokuDefaults, type Difficulty, type SudokuSize } from '../../denkspiele/sudoku';
import { createRng } from '../../lib/random';
import { sfx } from '../../lib/sound';
import { burst } from '../../lib/effects';
import { L } from '../../i18n';
import { ChipGroup, GameEnd } from './shared';
import type { GameProps } from './BrainGames';

/** Bilder statt Zahlen für den Kindergarten (Inhalt, nicht Oberfläche). */
const PICS = ['🍎', '🐶', '⭐', '🚗'];

export default function SudokuGame({ year }: GameProps) {
  const def = sudokuDefaults(year);
  const [size, setSize] = useState<SudokuSize>(def.size);
  const [difficulty, setDifficulty] = useState<Difficulty>(def.difficulty);
  const [round, setRound] = useState(0);
  const pictures = def.pictures && size === 4;
  const puzzle = useMemo(() => createSudoku(createRng(Date.now() + round), size, difficulty), [size, difficulty, round]);
  const [entries, setEntries] = useState<number[]>(puzzle.givens);
  const [sel, setSel] = useState<number | null>(null);
  useEffect(() => { setEntries(puzzle.givens); setSel(null); }, [puzzle]);

  const solved = entries.length === puzzle.solution.length && entries.every((v, i) => v === puzzle.solution[i]);
  const [bh, bw] = puzzle.box;
  const n = size;
  const label = (v: number) => (pictures ? PICS[v - 1] : String(v));

  const put = useCallback((v: number) => {
    if (sel === null || puzzle.givens[sel] !== 0 || solved) return;
    setEntries((e) => {
      const next = [...e];
      next[sel] = v;
      if (v !== 0) {
        if (v === puzzle.solution[sel]) sfx.select(); else sfx.tryAgain();
        if (next.every((x, i) => x === puzzle.solution[i])) setTimeout(() => sfx.win(), 150);
      }
      return next;
    });
  }, [sel, puzzle, solved]);

  const hint = () => {
    const target = sel !== null && puzzle.givens[sel] === 0 && entries[sel] !== puzzle.solution[sel]
      ? sel
      : entries.findIndex((v, i) => v !== puzzle.solution[i]);
    if (target < 0) return;
    sfx.help();
    setSel(target);
    setEntries((e) => { const next = [...e]; next[target] = puzzle.solution[target]!; return next; });
    burst(undefined, undefined, 'funken');
  };

  // Tastatur: Zahlen, Löschen, Pfeiltasten
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (/^[1-9]$/.test(ev.key) && Number(ev.key) <= n) { put(Number(ev.key)); ev.preventDefault(); }
      else if (ev.key === 'Backspace' || ev.key === 'Delete' || ev.key === '0') { put(0); ev.preventDefault(); }
      else if (ev.key.startsWith('Arrow')) {
        ev.preventDefault();
        setSel((s) => {
          const i = s ?? 0, r = Math.floor(i / n), c = i % n;
          if (ev.key === 'ArrowUp') return Math.max(0, r - 1) * n + c;
          if (ev.key === 'ArrowDown') return Math.min(n - 1, r + 1) * n + c;
          if (ev.key === 'ArrowLeft') return r * n + Math.max(0, c - 1);
          return r * n + Math.min(n - 1, c + 1);
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [put, n]);

  const selR = sel === null ? -1 : Math.floor(sel / n), selC = sel === null ? -1 : sel % n;
  const sameBox = (i: number) => sel !== null && Math.floor(Math.floor(i / n) / bh) === Math.floor(selR / bh) && Math.floor((i % n) / bw) === Math.floor(selC / bw);
  const selVal = sel === null ? 0 : entries[sel] ?? 0;
  const text = n === 4 ? 'text-3xl sm:text-4xl' : n === 6 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl';
  const remaining = (v: number) => n - entries.filter((x, i) => x === v && x === puzzle.solution[i]).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <ChipGroup label={L('Größe', 'Misura')} value={size} testid="sudoku-groesse" onChange={(v) => { sfx.tap(); setSize(v); }}
          options={[{ id: 4, label: '4×4' }, { id: 6, label: '6×6' }, { id: 9, label: '9×9' }]} />
        <ChipGroup label={L('Stufe', 'Livello')} value={difficulty} testid="sudoku-stufe" onChange={(v) => { sfx.tap(); setDifficulty(v); }}
          options={[{ id: 'leicht', label: L('leicht', 'facile') }, { id: 'mittel', label: L('mittel', 'medio') }, { id: 'schwer', label: L('schwer', 'difficile') }]} />
      </div>
      <p className="text-sm text-tinte/60">
        {pictures
          ? L('Jedes Bild darf in jeder Reihe, Spalte und jedem Kästchen nur einmal vorkommen.', 'Ogni immagine può comparire una sola volta in ogni riga, colonna e riquadro.')
          : L(`Setze die Zahlen 1 bis ${n}: jede nur einmal pro Reihe, Spalte und Kästchen.`, `Inserisci i numeri da 1 a ${n}: ognuno una sola volta per riga, colonna e riquadro.`)}
      </p>

      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        <div className="grid aspect-square w-full max-w-[min(100%,30rem)] overflow-hidden rounded-2xl bg-flaeche ring-2 ring-tinte/70"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} role="grid" aria-label="Sudoku" data-testid="sudoku-gitter" data-size={n}>
          {entries.map((v, i) => {
            const r = Math.floor(i / n), c = i % n;
            const given = puzzle.givens[i] !== 0;
            const wrong = !given && v !== 0 && v !== puzzle.solution[i];
            const isSel = sel === i;
            const related = sel !== null && (r === selR || c === selC || sameBox(i));
            const same = selVal !== 0 && v === selVal;
            const borders = [
              c % bw === bw - 1 && c !== n - 1 ? 'border-r-2 border-r-tinte/70' : c !== n - 1 ? 'border-r border-r-tinte/15' : '',
              r % bh === bh - 1 && r !== n - 1 ? 'border-b-2 border-b-tinte/70' : r !== n - 1 ? 'border-b border-b-tinte/15' : ''
            ].join(' ');
            return (
              <button key={i} type="button" role="gridcell" onClick={() => { sfx.tap(); setSel(i); }}
                aria-label={`${L('Reihe', 'Riga')} ${r + 1}, ${L('Spalte', 'Colonna')} ${c + 1}: ${v ? label(v) : L('leer', 'vuota')}`}
                aria-selected={isSel} data-testid={`zelle-${i}`} data-given={given || undefined} data-wrong={wrong || undefined}
                className={`relative flex items-center justify-center font-display font-bold tabular-nums transition-colors ${text} ${borders}
                  ${isSel ? 'bg-himmel-500 text-white' : wrong ? 'bg-koralle-100 text-koralle-700' : same ? 'bg-himmel-100' : related ? 'bg-himmel-50' : ''}
                  ${!isSel && !wrong ? (given ? 'text-tinte' : 'text-himmel-600') : ''}`}>
                <span className={pictures ? 'emoji' : ''}>{v ? label(v) : ''}</span>
              </button>
            );
          })}
        </div>

        <div className="flex w-full max-w-[30rem] flex-col gap-3 lg:w-64">
          {solved ? (
            <GameEnd text={L('Geschafft! Jede Reihe, Spalte und jedes Kästchen stimmt.', 'Fatto! Ogni riga, colonna e riquadro è giusto.')} onAgain={() => setRound((x) => x + 1)} />
          ) : (
            <>
              <div className={`grid gap-2 ${n === 9 ? 'grid-cols-5 lg:grid-cols-3' : n === 6 ? 'grid-cols-6 lg:grid-cols-3' : 'grid-cols-4 lg:grid-cols-2'}`}>
                {Array.from({ length: n }, (_, k) => k + 1).map((v) => (
                  <button key={v} type="button" onClick={() => put(v)} disabled={sel === null || puzzle.givens[sel] !== 0}
                    data-testid={`zahl-${v}`} aria-label={pictures ? `${L('Bild', 'Immagine')} ${v}` : String(v)}
                    className={`knopf knopf-3d relative bg-flaeche px-0 font-display text-2xl ${remaining(v) === 0 ? 'opacity-40' : ''}`}>
                    <span className={pictures ? 'emoji' : ''}>{label(v)}</span>
                  </button>
                ))}
                {n === 9 && (
                  <button type="button" onClick={() => put(0)} className="knopf knopf-3d bg-flaeche px-0 lg:hidden" aria-label={L('Löschen', 'Cancella')}><Eraser size={22} /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => put(0)} className={`knopf bg-flaeche ${n === 9 ? 'hidden lg:inline-flex' : ''}`} data-testid="loeschen"><Eraser size={20} aria-hidden /> {L('Löschen', 'Cancella')}</button>
                <button type="button" onClick={hint} className={`knopf bg-sonne-100 text-sonne-700 ${n === 9 ? 'col-span-2 lg:col-span-1' : ''}`} data-testid="tipp"><Lightbulb size={20} aria-hidden /> {L('Tipp', 'Aiuto')}</button>
              </div>
              <button type="button" onClick={() => { sfx.tap(); setRound((x) => x + 1); }} className="knopf bg-flaeche text-tinte/70" data-testid="neues-spiel-klein">{L('Neues Rätsel', 'Nuovo schema')}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
