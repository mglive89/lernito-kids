import { Check, X } from 'lucide-react';
import { L, tr } from '../../i18n';
import { RoadSign, signById } from '../../fuehrerschein/signs';
import type { DrivingQuestion } from '../../fuehrerschein/bank';

/**
 * Eine Prüfungsfrage. DE: Antworten ankreuzen (eine oder mehrere). IT: Vero oder Falso.
 * Mit `reveal` werden richtige und falsche Antworten markiert.
 */
export function QuestionCard({ q, chosen, onChange, reveal, index, total }: {
  q: DrivingQuestion; chosen: number[]; onChange: (c: number[]) => void; reveal?: boolean; index?: number; total?: number;
}) {
  const toggle = (i: number) => {
    if (reveal) return;
    if (q.kind === 'vf') onChange([i]);
    else onChange(chosen.includes(i) ? chosen.filter((x) => x !== i) : [...chosen, i].sort());
  };
  const sign = q.sign ? signById(q.sign) : undefined;
  return (
    <div className="karte-3d flex flex-col gap-4 p-4 sm:p-6" data-testid="fs-frage" data-kind={q.kind}>
      <div className="flex flex-wrap items-center gap-2">
        {index !== undefined && total !== undefined && <span className="eyebrow">{L(`Frage ${index + 1} von ${total}`, `Domanda ${index + 1} di ${total}`)}</span>}
        {q.kind === 'multi' && <span className="chip ml-auto bg-sonne-100 px-2.5 py-0.5 text-xs text-sonne-700" data-testid="fs-punkte">{L(`${q.points} Punkte`, `${q.points} punti`)}</span>}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {sign && <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5"><RoadSign id={sign.id} size={132} title={L('Verkehrszeichen', 'Segnale stradale')} /></div>}
        <p className="font-display text-lg font-bold leading-snug sm:text-xl" data-testid="fs-frage-text">{tr(q.q)}</p>
      </div>
      {q.kind === 'multi' && !reveal && <p className="text-sm text-tinte/55">{L('Eine oder mehrere Antworten sind richtig.', 'Una o più risposte sono corrette.')}</p>}
      <div className={q.kind === 'vf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'} role={q.kind === 'vf' ? 'radiogroup' : 'group'}>
        {q.options.map((o, i) => {
          const on = chosen.includes(i);
          const state = !reveal ? (on ? 'on' : 'off') : o.ok ? 'richtig' : on ? 'falsch' : 'off';
          const cls = {
            on: 'bg-himmel-50 ring-2 ring-himmel-500',
            off: 'bg-flaeche ring-1 ring-tinte/10 hover:bg-tinte/[0.03]',
            richtig: 'bg-minze-50 ring-2 ring-minze-500',
            falsch: 'bg-koralle-50 ring-2 ring-koralle-500'
          }[state];
          return (
            <button key={i} type="button" onClick={() => toggle(i)} aria-pressed={on} disabled={reveal}
              role={q.kind === 'vf' ? 'radio' : 'checkbox'} aria-checked={on}
              data-testid={`fs-antwort-${i}`} data-ok={o.ok ? 'true' : 'false'}
              className={`flex min-h-[3.25rem] items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${cls} ${q.kind === 'vf' ? 'justify-center text-lg' : ''}`}>
              {q.kind === 'multi' && (
                <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-2 ${on ? 'bg-himmel-500 text-white ring-himmel-500' : 'ring-tinte/25'}`}>
                  {on && <Check size={16} strokeWidth={3} />}
                </span>
              )}
              <span className={`min-w-0 flex-1 ${q.kind === 'vf' ? 'text-center' : ''}`}>{tr(o.t)}</span>
              {reveal && o.ok && <Check size={20} className="shrink-0 text-minze-600" aria-label={L('richtig', 'corretta')} />}
              {reveal && !o.ok && on && <X size={20} className="shrink-0 text-koralle-600" aria-label={L('falsch', 'sbagliata')} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
