import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCheck, Delete, Lightbulb, RefreshCw } from 'lucide-react';
import { createCrossword, wordCells, type PlacedWord } from '../../denkspiele/crossword';
import { CROSS_WORDS, crossLevel, LETTERS, type CrossLevel } from '../../denkspiele/crosswordWords';
import { createRng } from '../../lib/random';
import { sfx } from '../../lib/sound';
import { speak } from '../../lib/speech';
import { getLang, L } from '../../i18n';
import { ChipGroup, GameEnd } from './shared';
import type { GameProps } from './BrainGames';

const SETUP: Record<CrossLevel, { count: number; maxDim: number }> = { 1: { count: 5, maxDim: 9 }, 2: { count: 7, maxDim: 11 }, 3: { count: 8, maxDim: 13 } };

export default function CrosswordGame({ year }: GameProps) {
  const lang = getLang();
  const [level, setLevel] = useState<CrossLevel>(crossLevel(year));
  const [round, setRound] = useState(0);
  const cw = useMemo(() => createCrossword(createRng(Date.now() + round), CROSS_WORDS[lang][level], SETUP[level].count, SETUP[level].maxDim), [lang, level, round]);
  const [entries, setEntries] = useState<string[]>([]);
  const [wi, setWi] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setEntries(cw.grid.map(() => ''));
    setWi(0);
    setCursor(cw.words[0] ? wordCells(cw, cw.words[0])[0]! : 0);
    setChecked(false);
  }, [cw]);

  const word: PlacedWord | undefined = cw.words[wi];
  const cells = useMemo(() => (word ? wordCells(cw, word) : []), [cw, word]);
  const solved = entries.length > 0 && cw.grid.every((ch, i) => ch === null || entries[i] === ch);
  const numbers = useMemo(() => {
    const m = new Map<number, number>();
    for (const w of cw.words) m.set(w.row * cw.cols + w.col, w.num);
    return m;
  }, [cw]);

  const selectWord = (k: number, at?: number) => {
    const w = cw.words[k];
    if (!w) return;
    setWi(k);
    const cs = wordCells(cw, w);
    setCursor(at ?? cs.find((i) => !entries[i]) ?? cs[0]!);
  };

  const tapCell = (i: number) => {
    if (cw.grid[i] === null) return;
    sfx.tap();
    const owners = cw.words.map((w, k) => ({ k, cs: wordCells(cw, w) })).filter((o) => o.cs.includes(i));
    if (owners.length === 0) return;
    // Erneutes Tippen auf dasselbe Feld wechselt die Richtung
    const current = owners.find((o) => o.k === wi);
    const target = current && cursor === i && owners.length > 1 ? owners.find((o) => o.k !== wi)! : current ?? owners[0]!;
    selectWord(target.k, i);
  };

  const type = useCallback((ch: string) => {
    if (solved || !word) return;
    sfx.select();
    setChecked(false);
    setEntries((e) => {
      const next = [...e];
      next[cursor] = ch;
      const all = cw.grid.every((g, i) => g === null || next[i] === g);
      if (all) setTimeout(() => sfx.win(), 120);
      else {
        const done = cells.every((i) => next[i] === cw.grid[i]);
        if (done) sfx.correct();
      }
      return next;
    });
    const pos = cells.indexOf(cursor);
    if (pos >= 0 && pos < cells.length - 1) setCursor(cells[pos + 1]!);
  }, [solved, word, cursor, cells, cw]);

  const back = useCallback(() => {
    if (solved) return;
    setChecked(false);
    const pos = cells.indexOf(cursor);
    if (entries[cursor]) setEntries((e) => { const n = [...e]; n[cursor] = ''; return n; });
    else if (pos > 0) {
      const prev = cells[pos - 1]!;
      setCursor(prev);
      setEntries((e) => { const n = [...e]; n[prev] = ''; return n; });
    }
  }, [solved, cells, cursor, entries]);

  const hint = () => {
    const i = cells.find((c) => entries[c] !== cw.grid[c]);
    if (i === undefined) return;
    sfx.help();
    setCursor(i);
    setEntries((e) => { const n = [...e]; n[i] = cw.grid[i]!; return n; });
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      const k = ev.key.toUpperCase();
      if (k.length === 1 && LETTERS[lang].includes(k)) { type(k); ev.preventDefault(); }
      else if (ev.key === 'Backspace') { back(); ev.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [type, back, lang]);

  const rows = lang === 'de' ? [LETTERS.de.slice(0, 11), LETTERS.de.slice(11, 22), LETTERS.de.slice(22)] : [LETTERS.it.slice(0, 10), LETTERS.it.slice(10, 19), LETTERS.it.slice(19)];
  const dirName = (w: PlacedWord) => (w.dir === 'waagerecht' ? L('waagerecht', 'orizzontale') : L('senkrecht', 'verticale'));
  const textSize = cw.cols <= 7 ? 'text-2xl sm:text-3xl' : cw.cols <= 10 ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl';

  return (
    <div className="flex flex-col gap-4">
      <ChipGroup label={L('Stufe', 'Livello')} value={level} testid="kreuzwort-stufe" onChange={(v) => { sfx.tap(); setLevel(v); }}
        options={[{ id: 1, label: L('Bilder', 'Immagini') }, { id: 2, label: L('Schule', 'Scuola') }, { id: 3, label: L('Profi', 'Esperto') }]} />

      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        <div className="flex w-full max-w-[32rem] flex-col gap-3">
          <div className="mx-auto grid w-full gap-[3px]" style={{ gridTemplateColumns: `repeat(${cw.cols}, minmax(0, 1fr))`, maxWidth: `min(${Math.min(32, cw.cols * 3.4)}rem, calc((100dvh - 25rem) * ${cw.cols / cw.rows}))`, minWidth: `min(100%, ${cw.cols * 1.6}rem)` }}
            role="grid" aria-label={L('Kreuzworträtsel', 'Cruciverba')} data-testid="kreuzwort-gitter">
            {cw.grid.map((ch, i) => {
              if (ch === null) return <span key={i} aria-hidden className="aspect-square" />;
              const inWord = cells.includes(i);
              const wrong = checked && entries[i] && entries[i] !== ch;
              const num = numbers.get(i);
              return (
                <button key={i} type="button" onClick={() => tapCell(i)} data-testid={`kw-zelle-${i}`} data-loesung={ch}
                  aria-label={`${num ? `${num}, ` : ''}${entries[i] || L('leer', 'vuota')}`}
                  className={`relative flex aspect-square items-center justify-center rounded-md font-display font-extrabold uppercase ring-1 transition-colors ${textSize}
                    ${cursor === i ? 'bg-lila-500 text-white ring-lila-600' : wrong ? 'bg-koralle-100 text-koralle-700 ring-koralle-300' : solved ? 'bg-minze-100 text-minze-700 ring-minze-300' : inWord ? 'bg-lila-100 ring-lila-300' : 'bg-flaeche ring-tinte/25'}`}>
                  {num && <span className={`absolute left-0.5 top-0 text-[9px] font-bold leading-none sm:left-1 sm:top-0.5 sm:text-[11px] ${cursor === i ? 'text-white/80' : 'text-tinte/55'}`}>{num}</span>}
                  {entries[i]}
                </button>
              );
            })}
          </div>

          {solved ? (
            <GameEnd text={L('Super! Alle Wörter sind richtig.', 'Bravissimo! Tutte le parole sono giuste.')} onAgain={() => setRound((r) => r + 1)} />
          ) : word && (
            <>
              <button type="button" onClick={() => speak(word.clue)} className="karte-3d flex items-center gap-3 px-4 py-3 text-left" data-testid="kw-hinweis">
                {word.emoji && <span className="emoji text-4xl" aria-hidden>{word.emoji}</span>}
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block">{word.num} · {dirName(word)} · {[...word.word].length} {L('Buchstaben', 'lettere')}</span>
                  <span className="block font-display text-lg font-bold leading-snug">{word.clue}</span>
                </span>
              </button>
              <div className="flex flex-col gap-1.5" aria-label={L('Buchstaben', 'Lettere')}>
                {rows.map((row, ri) => (
                  <div key={ri} className="flex justify-center gap-1">
                    {row.map((ch) => (
                      <button key={ch} type="button" onClick={() => type(ch)} data-testid={`taste-${ch}`}
                        className="flex h-11 min-w-0 flex-1 basis-0 items-center justify-center rounded-lg bg-flaeche font-display text-lg font-bold shadow-weich ring-1 ring-tinte/10 active:translate-y-px sm:h-12 sm:max-w-[2.75rem]">
                        {ch}
                      </button>
                    ))}
                    {ri === 2 && (
                      <button type="button" onClick={back} aria-label={L('Löschen', 'Cancella')} data-testid="taste-loeschen"
                        className="flex h-11 flex-[1.6] basis-0 items-center justify-center rounded-lg bg-tinte/[0.06] ring-1 ring-tinte/10 sm:h-12 sm:max-w-[4rem]">
                        <Delete size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="knopf bg-flaeche px-2 text-sm sm:text-base" onClick={() => { sfx.tap(); setChecked(true); }} data-testid="kw-pruefen"><CheckCheck size={18} aria-hidden /> {L('Prüfen', 'Controlla')}</button>
                <button type="button" className="knopf bg-sonne-100 px-2 text-sm text-sonne-700 sm:text-base" onClick={hint} data-testid="kw-tipp"><Lightbulb size={18} aria-hidden /> {L('Tipp', 'Aiuto')}</button>
                <button type="button" className="knopf bg-flaeche px-2 text-sm text-tinte/70 sm:text-base" onClick={() => { sfx.tap(); setRound((r) => r + 1); }}><RefreshCw size={18} aria-hidden /> {L('Neu', 'Nuovo')}</button>
              </div>
            </>
          )}
        </div>

        <ol className="w-full max-w-[32rem] columns-1 gap-6 text-sm sm:columns-2 lg:w-72 lg:columns-1" aria-label={L('Hinweise', 'Definizioni')}>
          {(['waagerecht', 'senkrecht'] as const).map((d) => (
            <li key={d} className="mb-3 break-inside-avoid">
              <p className="eyebrow mb-1">{d === 'waagerecht' ? L('Waagerecht →', 'Orizzontali →') : L('Senkrecht ↓', 'Verticali ↓')}</p>
              <ul className="flex flex-col gap-1">
                {cw.words.map((w, k) => w.dir === d && (
                  <li key={k}>
                    <button type="button" onClick={() => { sfx.tap(); selectWord(k); }}
                      className={`flex w-full items-start gap-2 rounded-lg px-2 py-1 text-left ${k === wi ? 'bg-lila-100 font-bold' : 'hover:bg-tinte/[0.04]'} ${wordCells(cw, w).every((i) => entries[i] === cw.grid[i]) ? 'text-tinte/40 line-through' : ''}`}>
                      <span className="w-5 shrink-0 text-right font-bold tabular-nums">{w.num}</span>
                      {w.emoji && <span className="emoji" aria-hidden>{w.emoji}</span>}
                      <span>{w.clue}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
