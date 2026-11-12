import { useEffect, useState } from 'react';
import { AlertTriangle, BookMarked, ChevronDown, GraduationCap, Sparkles } from 'lucide-react';
import type { Theory } from '../learning/theory';
import { L, tr } from '../i18n';

/** Ausführliche Theorie wird erst bei Bedarf geladen (eigener Chunk). */
function useTheory(moduleId: string): Theory | undefined | null {
  const [state, setState] = useState<{ id: string; t: Theory | undefined } | null>(null);
  useEffect(() => {
    let alive = true;
    import('../learning/theory').then((m) => { if (alive) setState({ id: moduleId, t: m.theoryFor(moduleId) }); }).catch(() => { if (alive) setState({ id: moduleId, t: undefined }); });
    return () => { alive = false; };
  }, [moduleId]);
  return state && state.id === moduleId ? state.t : null;
}

/** Abschnitte „Ausführlich erklärt“, „Typische Fehler“ und „Fachbegriffe“. */
export function TheoryContent({ moduleId, compact = false }: { moduleId: string; compact?: boolean }) {
  const theory = useTheory(moduleId);
  if (!theory) return null;
  return (
    <>
      <section aria-labelledby="g-theorie" data-testid="theorie-ausfuehrlich">
        <h2 id="g-theorie" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><GraduationCap size={20} className="text-lila-700" aria-hidden /> {L('Ausführlich erklärt', 'Teoria passo per passo')}</h2>
        <div className="flex flex-col gap-3">
          {theory.sections.map((s, i) => (
            <details key={i} open={!compact} className="group rounded-2xl bg-white shadow-weich ring-1 ring-tinte/5" data-testid="theorie-abschnitt">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lila-50 text-base text-lila-700" aria-hidden>{i + 1}</span>
                <span className="flex-1">{tr(s.title)}</span>
                <ChevronDown size={20} className="shrink-0 text-tinte/40 transition group-open:rotate-180" aria-hidden />
              </summary>
              <div className="flex flex-col gap-3 px-4 pb-4">
                <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg">{tr(s.text)}</p>
                {s.example && (
                  <div className="rounded-xl bg-himmel-50 p-3">
                    <p className="eyebrow mb-1 text-himmel-700">{L('Beispiel', 'Esempio')}</p>
                    <p className="whitespace-pre-line font-mono text-[0.95rem] leading-relaxed">{tr(s.example)}</p>
                  </div>
                )}
                {s.tip && (
                  <p className="flex gap-2 rounded-xl bg-sonne-50 p-3 text-base leading-relaxed">
                    <Sparkles size={18} className="mt-1 shrink-0 text-sonne-700" aria-hidden />
                    <span><strong>{L('Merke: ', 'Ricorda: ')}</strong>{tr(s.tip)}</span>
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
      {theory.mistakes.length > 0 && (
        <section aria-labelledby="g-fehler">
          <h2 id="g-fehler" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><AlertTriangle size={20} className="text-koralle-700" aria-hidden /> {L('Typische Fehler', 'Errori frequenti')}</h2>
          <ul className="flex flex-col gap-2">
            {theory.mistakes.map((m, i) => (
              <li key={i} className="rounded-2xl bg-koralle-50 p-3 text-base leading-relaxed ring-1 ring-koralle-100">{tr(m)}</li>
            ))}
          </ul>
        </section>
      )}
      {theory.terms.length > 0 && (
        <section aria-labelledby="g-begriffe">
          <h2 id="g-begriffe" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><BookMarked size={20} className="text-minze-700" aria-hidden /> {L('Fachbegriffe', 'Parole chiave')}</h2>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {theory.terms.map((t, i) => (
              <div key={i} className="rounded-2xl bg-white p-3 shadow-weich ring-1 ring-tinte/5">
                <dt className="font-bold text-minze-700">{tr(t.term)}</dt>
                <dd className="text-base text-tinte/80">{tr(t.def)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}
