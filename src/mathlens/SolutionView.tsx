/** Lösungsweg: „Dammi un indizio“ (Schritt für Schritt mit Hinweis) oder „Mostra la soluzione“ (alles). */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, Lightbulb } from 'lucide-react';
import { L } from '../i18n';
import type { Solution, Step } from '../hausaufgaben/types';
import { StepGrid } from '../pages/hausaufgaben/StepGrid';
import { FormulaView } from './formula/FormulaView';

type Mode = 'hint' | 'full';

function hintOf(s: Step): string {
  if (s.hint) return s.hint;
  const t = s.title.split('=')[0]!.trim();
  return L(`Nächster Schritt: ${t}`, `Prossimo passo: ${t}`);
}

/** Gleichung mit beiden Seiten; die Rechnung auf beiden Seiten wird darunter markiert. */
function EquationLine({ step }: { step: Step }) {
  const e = step.eq!;
  return (
    <div className="flex flex-col gap-1" data-testid="gleichung">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-creme px-3 py-2 ring-1 ring-tinte/[0.06]">
        <span className="justify-self-end"><FormulaView text={e.left} className="text-xl sm:text-2xl" /></span>
        <span className="font-display text-xl font-bold text-tinte/50 sm:text-2xl">=</span>
        <span className="justify-self-start"><FormulaView text={e.right} className="text-xl sm:text-2xl" /></span>
      </div>
      {step.both && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 text-sm font-bold text-lila-700" data-testid="beide-seiten">
          <span className="justify-self-end rounded-lg bg-lila-100 px-2 py-0.5">{step.both}</span>
          <span className="text-tinte/40">{L('beide Seiten', 'entrambi i membri')}</span>
          <span className="justify-self-start rounded-lg bg-lila-100 px-2 py-0.5">{step.both}</span>
        </div>
      )}
    </div>
  );
}

export function SolutionView({ sol }: { sol: Solution }) {
  const [mode, setMode] = useState<Mode>('hint');
  // Im Hinweis-Modus: so viele Schritte sind schon aufgedeckt
  const [shown, setShown] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const visible = mode === 'full' ? sol.steps.length : shown;
  const done = visible >= sol.steps.length;
  useEffect(() => { if (shown > 0) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [shown]);

  return (
    <div className="flex flex-col gap-4" data-testid="loesung">
      <header className="rounded-blob bg-himmel-100 p-5">
        <p className="eyebrow text-himmel-700">{sol.kind}</p>
        <div className="mt-1 text-3xl sm:text-4xl" data-testid="loesung-aufgabe"><FormulaView text={sol.task.replace(/\?/g, 'x')} /></div>
      </header>

      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label={L('Art der Hilfe', 'Tipo di aiuto')}>
        <button role="tab" aria-selected={mode === 'hint'} className={`knopf ${mode === 'hint' ? 'bg-sonne-500 text-nacht' : 'knopf-3d bg-flaeche'}`} onClick={() => setMode('hint')} data-testid="modus-hinweis">
          <Lightbulb size={20} /> {L('Gib mir einen Tipp', 'Dammi un indizio')}
        </button>
        <button role="tab" aria-selected={mode === 'full'} className={`knopf ${mode === 'full' ? 'bg-himmel-500 text-white' : 'knopf-3d bg-flaeche'}`} onClick={() => setMode('full')} data-testid="modus-loesung">
          <Eye size={20} /> {L('Zeig die Lösung', 'Mostra la soluzione')}
        </button>
      </div>

      <ol className="flex flex-col gap-3">
        {sol.steps.slice(0, visible).map((s, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="karte-3d flex flex-col gap-3 p-4 sm:p-5" data-testid={`ml-schritt-${i}`}>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-himmel-500 font-display text-sm font-bold text-white">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
                {s.text && <p className="mt-1 text-tinte/75">{s.text}</p>}
              </div>
            </div>
            {s.eq ? <EquationLine step={s} /> : s.expr && <div className="self-start rounded-xl bg-creme px-4 py-2 text-xl ring-1 ring-tinte/[0.06]"><FormulaView text={s.expr.replace(/\?/g, 'x')} className="text-xl" /></div>}
            {s.grid && <StepGrid grid={s.grid} />}
          </motion.li>
        ))}
      </ol>

      {mode === 'hint' && !done && (
        <div className="karte-3d flex flex-col gap-3 border-2 border-dashed border-sonne-500/60 p-4" data-testid="hinweis">
          <p className="flex items-start gap-2 font-semibold"><Lightbulb size={20} className="mt-0.5 shrink-0 text-sonne-600" /> <span data-testid="hinweis-text">{hintOf(sol.steps[visible]!)}</span></p>
          <p className="text-sm text-tinte/60">{L('Versuch es zuerst selbst im Heft. Dann schau nach.', 'Prova prima da solo sul quaderno. Poi controlla.')}</p>
          <button className="knopf kante-himmel bg-himmel-500 text-white" onClick={() => setShown((n) => n + 1)} data-testid="schritt-zeigen">
            {L('Diesen Schritt zeigen', 'Mostra questo passaggio')}
          </button>
        </div>
      )}
      <div ref={endRef} />

      {done && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 rounded-blob bg-minze-500 p-5 text-white shadow-karte" data-testid="ml-ergebnis">
          <CheckCircle2 size={36} className="shrink-0" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">{L('Ergebnis', 'Risultato')}</p>
            <p className="font-display text-3xl font-extrabold" data-testid="ml-ergebnis-wert">{sol.answer}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
