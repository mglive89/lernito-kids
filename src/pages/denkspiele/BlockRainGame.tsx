import { useEffect, useReducer, useRef, useState } from 'react';
import { ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, Pause, Play, RotateCw } from 'lucide-react';
import { blockColor, blockStep, ghostRow, newBlockGame, nextPreview, tickMs, type BlockAction, type BlockState } from '../../denkspiele/blocks';
import { createRng } from '../../lib/random';
import { sfx } from '../../lib/sound';
import { L } from '../../i18n';
import { LinoSays } from '../../components/Lino';
import { GameEnd, getBest, saveBest, Stat } from './shared';
import type { GameProps } from './BrainGames';

/** Farben der Blöcke aus der Lernito-Palette (kein Vorbild nachgebaut). */
const COLORS = ['', '#2F6FEB', '#F5A524', '#7A5AF8', '#12B886', '#F0614E', '#0C9A70', '#DB8B0B'];

type Msg = { type: 'act'; action: BlockAction } | { type: 'reset'; state: BlockState };
function reducer(s: BlockState, m: Msg): BlockState { return m.type === 'reset' ? m.state : blockStep(s, m.action); }

export default function BlockRainGame({ year, profileId }: GameProps) {
  const kids = year <= 2;
  const [state, dispatch] = useReducer(reducer, undefined, () => newBlockGame(createRng(), kids));
  const [phase, setPhase] = useState<'bereit' | 'laeuft' | 'pause'>('bereit');
  const [best, setBest] = useState(() => getBest(profileId, 'blockregen'));
  const running = phase === 'laeuft' && !state.over;
  const speed = tickMs(state);
  const act = (action: BlockAction) => { if (running) dispatch({ type: 'act', action }); };

  // Fallen im Takt
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => dispatch({ type: 'act', action: 'tick' }), speed);
    return () => clearInterval(t);
  }, [running, speed]);

  // Klänge bei Reihen und Spielende, Rekord speichern
  const lastLines = useRef(0);
  useEffect(() => {
    if (state.lines > lastLines.current) sfx.correct();
    lastLines.current = state.lines;
  }, [state.lines]);
  useEffect(() => {
    if (!state.over) return;
    sfx.tryAgain();
    if (saveBest(profileId, 'blockregen', state.score)) setBest(state.score);
  }, [state.over, state.score, profileId]);

  // Pause, wenn die App in den Hintergrund geht
  useEffect(() => {
    const onVis = () => { if (document.hidden) setPhase((p) => (p === 'laeuft' ? 'pause' : p)); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const keys: Record<string, BlockAction> = { ArrowLeft: 'links', ArrowRight: 'rechts', ArrowUp: 'drehen', ArrowDown: 'runter', ' ': 'fallen', a: 'links', d: 'rechts', w: 'drehen', s: 'runter' };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'p' || ev.key === 'Escape') { setPhase((p) => (p === 'laeuft' ? 'pause' : p === 'pause' ? 'laeuft' : p)); return; }
      const a = keys[ev.key];
      if (a) { ev.preventDefault(); act(a); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Wischen und Tippen auf dem Spielfeld: Tippen dreht, seitlich wischen schiebt, nach unten wischen lässt fallen
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, moved: false }; };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 28) { act(dx > 0 ? 'rechts' : 'links'); d.x = e.clientX; d.moved = true; }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (e.clientY - d.y > 60) act('fallen');
    else if (!d.moved && Math.abs(e.clientY - d.y) < 12) act('drehen');
  };

  /** Knöpfe reagieren sofort beim Drücken; Enter/Leertaste über onClick (detail 0). */
  const press = (a: BlockAction) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); act(a); },
    onClick: (e: React.MouseEvent) => { if (e.detail === 0) act(a); }
  });
  const restart = () => { sfx.tap(); lastLines.current = 0; dispatch({ type: 'reset', state: newBlockGame(createRng(), kids) }); setPhase('laeuft'); };

  // Brett mit aktueller Form und Schatten
  const cells = [...state.board];
  const ghost = new Set<number>();
  if (!state.over) {
    const gr = ghostRow(state);
    for (const [r, c] of state.piece.cells) {
      const g = (gr + r) * state.width + state.piece.col + c;
      if (gr + r >= 0) ghost.add(g);
      const y = state.piece.row + r;
      if (y >= 0) cells[y * state.width + state.piece.col + c] = blockColor(state.piece.kind);
    }
  }
  const preview = nextPreview(state.next);
  const pw = Math.max(...preview.map(([, c]) => c)) + 1, ph = Math.max(...preview.map(([r]) => r)) + 1;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-3">
      <div className="flex items-stretch gap-2">
        <div className="karte-3d flex min-w-[4.5rem] flex-col items-center px-3 py-1.5" aria-label={L('Nächste Form', 'Prossimo blocco')}>
          <span className="eyebrow">{L('Nächste', 'Prossimo')}</span>
          <div className="mt-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${pw}, 0.7rem)`, gridTemplateRows: `repeat(${ph}, 0.7rem)` }}>
            {preview.map(([r, c], i) => <span key={i} className="rounded-[3px]" style={{ gridRow: r + 1, gridColumn: c + 1, background: COLORS[blockColor(state.next)] }} />)}
          </div>
        </div>
        <Stat label={L('Reihen', 'Righe')} value={state.lines} testid="blockregen-reihen" />
        <Stat label={L('Punkte', 'Punti')} value={state.score} testid="blockregen-punkte" />
        <Stat label={L('Rekord', 'Record')} value={best} />
        <button type="button" className="knopf ml-auto bg-flaeche px-3" disabled={phase === 'bereit' || state.over}
          onClick={() => { sfx.tap(); setPhase((p) => (p === 'laeuft' ? 'pause' : 'laeuft')); }}
          aria-label={running ? L('Pause', 'Pausa') : L('Weiter', 'Riprendi')} data-testid="blockregen-pause">
          {running ? <Pause size={22} /> : <Play size={22} />}
        </button>
      </div>

      <div className="relative mx-auto touch-none select-none" style={{ width: `min(100%, calc((100dvh - 19rem) * ${state.width / state.height}))` }}>
        <div className="grid gap-[2px] rounded-2xl bg-tinte/[0.08] p-[3px] ring-1 ring-tinte/10"
          style={{ gridTemplateColumns: `repeat(${state.width}, minmax(0, 1fr))` }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}
          role="application" aria-label={L('Spielfeld: tippen zum Drehen, wischen zum Schieben', 'Campo: tocca per ruotare, scorri per spostare')}
          data-testid="blockregen-feld" data-lines={state.lines} data-over={state.over || undefined}>
          {cells.map((v, i) => (
            <span key={i} className={`aspect-square rounded-[4px] ${v ? 'shadow-[inset_0_-3px_0_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.35)]' : ghost.has(i) ? 'bg-tinte/[0.12] ring-1 ring-inset ring-tinte/25' : 'bg-flaeche/80'}`}
              style={v ? { background: COLORS[v] } : undefined} />
          ))}
        </div>
        {(phase !== 'laeuft' || state.over) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-flaeche/85 p-4 backdrop-blur-sm">
            {state.over ? (
              <GameEnd confetti={state.lines > 0} mood={state.lines > 0 ? 'jubel' : 'denken'} onAgain={restart}
                text={L(`Fertig! Du hast ${state.lines} Reihen geschafft.`, `Fine! Hai completato ${state.lines} righe.`)} />
            ) : (
              <div className="flex flex-col items-center gap-3">
                {phase === 'bereit' && <LinoSays size={70} mood="freude" text={L('Fülle ganze Reihen mit den fallenden Formen!', 'Completa le righe con i blocchi che cadono!')} />}
                <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" data-testid="blockregen-start"
                  onClick={() => { sfx.tap(); setPhase('laeuft'); }}>
                  <Play size={20} aria-hidden /> {phase === 'bereit' ? L('Los geht’s', 'Inizia') : L('Weiter', 'Riprendi')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2" aria-label={L('Steuerung', 'Comandi')}>
        <button type="button" className="knopf knopf-3d bg-flaeche px-0" {...press('links')} aria-label={L('Links', 'Sinistra')} data-testid="block-links"><ArrowLeft size={24} /></button>
        <button type="button" className="knopf knopf-3d bg-flaeche px-0" {...press('drehen')} aria-label={L('Drehen', 'Ruota')} data-testid="block-drehen"><RotateCw size={24} /></button>
        <button type="button" className="knopf knopf-3d bg-flaeche px-0" {...press('rechts')} aria-label={L('Rechts', 'Destra')} data-testid="block-rechts"><ArrowRight size={24} /></button>
        <button type="button" className="knopf knopf-3d bg-flaeche px-0" {...press('runter')} aria-label={L('Schneller', 'Più veloce')} data-testid="block-runter"><ArrowDown size={24} /></button>
        <button type="button" className="knopf knopf-3d bg-himmel-500 px-0 text-white" {...press('fallen')} aria-label={L('Fallen lassen', 'Fai cadere')} data-testid="block-fallen"><ArrowDownToLine size={24} /></button>
      </div>
    </div>
  );
}
