import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, Undo2 } from 'lucide-react';
import { move, newTwinGame, twinGoal, type Dir, type TwinState } from '../../denkspiele/twins';
import { createRng } from '../../lib/random';
import { sfx } from '../../lib/sound';
import { L } from '../../i18n';
import { GameEnd, getBest, saveBest, Stat } from './shared';
import type { GameProps } from './BrainGames';

/** Farben der Plättchen aus der Lernito-Palette: je größer die Zahl, desto kräftiger. */
const TILE: Record<number, string> = {
  2: 'bg-himmel-100 text-himmel-700',
  4: 'bg-himmel-300 text-nacht',
  8: 'bg-minze-300 text-nacht',
  16: 'bg-minze-500 text-white',
  32: 'bg-sonne-300 text-nacht',
  64: 'bg-sonne-500 text-nacht',
  128: 'bg-koralle-300 text-nacht',
  256: 'bg-koralle-500 text-white',
  512: 'bg-lila-300 text-nacht',
  1024: 'bg-lila-500 text-white',
  2048: 'bg-lila-600 text-white'
};
const tileClass = (v: number) => TILE[v] ?? 'bg-tinte-fest text-white';

const GAP = 2.6; // Prozent
export default function TwinsGame({ year, profileId }: GameProps) {
  const goal = twinGoal(year);
  const rng = useRef(createRng());
  const [state, setState] = useState<TwinState>(() => newTwinGame(rng.current, goal));
  const [prev, setPrev] = useState<TwinState | null>(null);
  const [goOn, setGoOn] = useState(false);
  const [best, setBest] = useState(() => getBest(profileId, 'zwillinge'));
  const size = state.size;
  const cell = (100 - GAP * (size + 1)) / size;

  const ref = useRef(state);
  ref.current = state;
  const doMove = useCallback((dir: Dir) => {
    const s = ref.current;
    if (s.over || (s.won && !goOn)) return;
    const next = move(s, dir, rng.current);
    if (!next) return;
    ref.current = next;
    setPrev(s);
    setState(next);
    if (next.won && !s.won) sfx.win();
    else if (next.over) sfx.tryAgain();
    else if (next.tiles.some((t) => t.merged)) sfx.pop(); else sfx.tap();
    if (saveBest(profileId, 'zwillinge', next.score)) setBest(next.score);
  }, [goOn, profileId]);

  const restart = () => { sfx.tap(); setState(newTwinGame(rng.current, goal)); setPrev(null); setGoOn(false); };

  useEffect(() => {
    const keys: Record<string, Dir> = { ArrowLeft: 'links', ArrowRight: 'rechts', ArrowUp: 'hoch', ArrowDown: 'runter', a: 'links', d: 'rechts', w: 'hoch', s: 'runter' };
    const onKey = (ev: KeyboardEvent) => { const d = keys[ev.key]; if (d) { ev.preventDefault(); doMove(d); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doMove]);

  // Wischen auf dem Spielfeld
  const start = useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const onUp = (e: React.PointerEvent) => {
    const s = start.current; start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'rechts' : 'links') : (dy > 0 ? 'runter' : 'hoch'));
  };

  const pos = (k: number) => `${GAP + k * (cell + GAP)}%`;
  const fontFor = (v: number) => (v < 100 ? 'text-3xl sm:text-5xl' : v < 1000 ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-3xl');
  const showWin = state.won && !goOn;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="min-w-0 flex-1 text-sm text-tinte/60">{L(`Schiebe gleiche Zahlen zusammen. Erreiche die ${goal}!`, `Unisci i numeri uguali. Arriva a ${goal}!`)}</p>
        <Stat label={L('Punkte', 'Punti')} value={state.score} testid="zwillinge-punkte" />
        <Stat label={L('Rekord', 'Record')} value={best} />
      </div>

      <div className="relative aspect-square w-full touch-none select-none rounded-2xl bg-tinte/[0.08] ring-1 ring-tinte/10"
        onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => { start.current = null; }}
        role="application" aria-label={L('Spielfeld: wische oder benutze die Pfeile', 'Campo di gioco: scorri o usa le frecce')} data-testid="zwillinge-feld">
        {Array.from({ length: size * size }, (_, i) => (
          <span key={i} aria-hidden className="absolute rounded-xl bg-flaeche/70" style={{ left: pos(i % size), top: pos(Math.floor(i / size)), width: `${cell}%`, height: `${cell}%` }} />
        ))}
        {state.tiles.map((t) => (
          <motion.div key={t.id} data-testid="plaettchen" data-value={t.value}
            initial={t.fresh || t.merged ? { scale: t.merged ? 1.15 : 0.4, opacity: t.fresh ? 0 : 1 } : false}
            animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.16 }}
            className={`absolute flex items-center justify-center rounded-xl font-display font-extrabold tabular-nums shadow-weich transition-[left,top] duration-100 ease-out ${tileClass(t.value)} ${fontFor(t.value)}`}
            style={{ left: pos(t.col), top: pos(t.row), width: `${cell}%`, height: `${cell}%` }}>
            {t.value}
          </motion.div>
        ))}
        {(showWin || state.over) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-flaeche/85 p-4 backdrop-blur-sm">
            <GameEnd confetti={showWin} mood={showWin ? 'jubel' : 'denken'} onAgain={restart}
              text={showWin ? L(`Toll! Du hast die ${goal} erreicht!`, `Fantastico! Hai raggiunto ${goal}!`) : L('Keine Züge mehr. Probier es gleich nochmal!', 'Nessuna mossa possibile. Riprova subito!')}>
              {showWin && <button type="button" className="knopf bg-flaeche" onClick={() => setGoOn(true)} data-testid="weiterspielen">{L('Weiterspielen', 'Continua a giocare')}</button>}
              {state.over && prev && <button type="button" className="knopf bg-flaeche" onClick={() => { setState(prev); setPrev(null); }}><Undo2 size={20} aria-hidden /> {L('Zug zurück', 'Annulla mossa')}</button>}
            </GameEnd>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex flex-col gap-2">
          <button type="button" className="knopf bg-flaeche" disabled={!prev} onClick={() => { sfx.tap(); if (prev) { setState(prev); setPrev(null); } }} data-testid="zug-zurueck"><Undo2 size={20} aria-hidden /> {L('Zurück', 'Annulla')}</button>
          <button type="button" className="knopf bg-flaeche text-tinte/70" onClick={restart}><RefreshCw size={20} aria-hidden /> {L('Neu', 'Nuovo')}</button>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-1.5" aria-label={L('Richtungen', 'Direzioni')}>
          <span />
          <button type="button" className="knopf knopf-3d w-14 bg-flaeche px-0" onClick={() => doMove('hoch')} aria-label={L('Nach oben', 'Su')} data-testid="pfeil-hoch"><ArrowUp size={22} /></button>
          <span />
          <button type="button" className="knopf knopf-3d w-14 bg-flaeche px-0" onClick={() => doMove('links')} aria-label={L('Nach links', 'Sinistra')} data-testid="pfeil-links"><ArrowLeft size={22} /></button>
          <button type="button" className="knopf knopf-3d w-14 bg-flaeche px-0" onClick={() => doMove('runter')} aria-label={L('Nach unten', 'Giù')} data-testid="pfeil-runter"><ArrowDown size={22} /></button>
          <button type="button" className="knopf knopf-3d w-14 bg-flaeche px-0" onClick={() => doMove('rechts')} aria-label={L('Nach rechts', 'Destra')} data-testid="pfeil-rechts"><ArrowRight size={22} /></button>
        </div>
        <span />
      </div>
    </div>
  );
}
