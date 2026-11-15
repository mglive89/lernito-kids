import { Check, Languages, X } from 'lucide-react';
import { RoadSign } from '../../fuehrerschein/signs';
import { TrafficDiagram, diagramById } from '../../fuehrerschein/diagrams';
import { pickText, type Question, type StudyLang } from '../../fuehrerschein/schema';

/** Hinweis, wenn ein Text in der Lernsprache fehlt (nie still ersetzen). */
export function MissingBadge({ shown, lang }: { shown: StudyLang; lang: StudyLang }) {
  return (
    <span className="chip bg-koralle-100 px-2 py-0.5 text-xs text-koralle-700" data-testid="fs-mancante">
      <Languages size={12} aria-hidden /> {lang === 'it' ? `Traduzione mancante: testo in ${shown === 'de' ? 'tedesco' : 'italiano'}` : `Übersetzung fehlt: Text auf ${shown === 'de' ? 'Deutsch' : 'Italienisch'}`}
    </span>
  );
}

/** Bild einer Frage: Verkehrszeichen oder Skizze; nach der Antwort mit hervorgehobenem Detail. */
export function QuestionImage({ q, lang, reveal }: { q: Question; lang: StudyLang; reveal: boolean }) {
  if (!q.image) return null;
  const alt = pickText(q.image.alt, lang).text;
  if (q.image.type === 'sign') return <div className="self-center rounded-2xl bg-white p-3 ring-1 ring-black/5"><RoadSign id={q.image.id} size={132} title={alt} /></div>;
  const d = diagramById(q.image.id);
  return (
    <figure className="flex w-full flex-col items-center gap-2">
      <TrafficDiagram id={q.image.id} reveal={reveal} title={alt} />
      {reveal && d && <figcaption className="max-w-[300px] rounded-xl bg-sonne-100 px-3 py-2 text-sm text-tinte/80" data-testid="fs-dettaglio">{pickText(d.decisive, lang).text}</figcaption>}
    </figure>
  );
}

/**
 * Eine Frage. Die Antworten werden über ihre IDs gewählt, deshalb bleibt die Auswahl beim Sprachwechsel erhalten.
 * DE: ankreuzen (eine oder mehrere), IT: Vero/Falso.
 */
export function QuestionCard({ q, order, chosen, onChange, reveal, lang, index, total }: {
  q: Question; order: string[]; chosen: string[]; onChange: (c: string[]) => void; reveal?: boolean; lang: StudyLang; index?: number; total?: number;
}) {
  const t = (de: string, it: string) => (lang === 'it' ? it : de);
  const text = pickText(q.text, lang);
  const opts = order.map((id) => q.options.find((o) => o.id === id)!).filter(Boolean);
  const anyMissing = text.missing || opts.some((o) => pickText(o.text, lang).missing);
  const toggle = (id: string) => {
    if (reveal) return;
    if (q.format === 'vf') onChange([id]);
    else onChange(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);
  };
  return (
    <div className="karte-3d flex flex-col gap-4 p-4 sm:p-6" data-testid="fs-frage" data-kind={q.format} data-id={q.id} lang={lang}>
      <div className="flex flex-wrap items-center gap-2">
        {index !== undefined && total !== undefined && <span className="eyebrow">{t(`Frage ${index + 1} von ${total}`, `Domanda ${index + 1} di ${total}`)}</span>}
        {q.trap && reveal && <span className="chip bg-lila-100 px-2.5 py-0.5 text-xs text-lila-700">{t('Fangfrage', 'Trabocchetto')}</span>}
        {anyMissing && <MissingBadge shown={text.missing ? text.shownLang : (lang === 'de' ? 'it' : 'de')} lang={lang} />}
        {q.format === 'multi' && <span className="chip ml-auto bg-sonne-100 px-2.5 py-0.5 text-xs text-sonne-700" data-testid="fs-punkte">{t(`${q.weight} Punkte`, `${q.weight} punti`)}</span>}
      </div>
      <QuestionImage q={q} lang={lang} reveal={!!reveal} />
      <p className="font-display text-lg font-bold leading-snug sm:text-xl" data-testid="fs-frage-text">{text.text}</p>
      {q.format === 'multi' && !reveal && <p className="text-sm text-tinte/55">{t('Eine oder mehrere Antworten sind richtig.', 'Una o più risposte sono corrette.')}</p>}
      <div className={q.format === 'vf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'} role={q.format === 'vf' ? 'radiogroup' : 'group'}>
        {opts.map((o) => {
          const on = chosen.includes(o.id);
          const ok = q.correct.includes(o.id);
          const state = !reveal ? (on ? 'on' : 'off') : ok ? 'richtig' : on ? 'falsch' : 'off';
          const cls = {
            on: 'bg-himmel-50 ring-2 ring-himmel-500',
            off: 'bg-flaeche ring-1 ring-tinte/10 hover:bg-tinte/[0.03]',
            richtig: 'bg-minze-50 ring-2 ring-minze-500',
            falsch: 'bg-koralle-50 ring-2 ring-koralle-500'
          }[state];
          return (
            <button key={o.id} type="button" onClick={() => toggle(o.id)} disabled={reveal}
              role={q.format === 'vf' ? 'radio' : 'checkbox'} aria-checked={on}
              data-testid={`fs-antwort-${o.id}`} data-ok={ok ? 'true' : 'false'} data-on={on ? 'true' : 'false'}
              className={`flex min-h-[3.25rem] items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${cls} ${q.format === 'vf' ? 'justify-center text-lg' : ''}`}>
              {q.format === 'multi' && (
                <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-2 ${on ? 'bg-himmel-500 text-white ring-himmel-500' : 'ring-tinte/25'}`}>
                  {on && <Check size={16} strokeWidth={3} />}
                </span>
              )}
              <span className={`min-w-0 flex-1 ${q.format === 'vf' ? 'text-center' : ''}`}>{pickText(o.text, lang).text}</span>
              {reveal && ok && <Check size={20} className="shrink-0 text-minze-600" aria-label={t('richtig', 'corretta')} />}
              {reveal && !ok && on && <X size={20} className="shrink-0 text-koralle-600" aria-label={t('falsch', 'sbagliata')} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Erklärung und – bei Fangfragen – was in die Irre führt. */
export function Explanation({ q, lang, ok }: { q: Question; lang: StudyLang; ok?: boolean }) {
  const t = (de: string, it: string) => (lang === 'it' ? it : de);
  const ex = pickText(q.explanation, lang);
  const trap = q.trap ? pickText(q.trap, lang) : null;
  return (
    <div className="flex flex-col gap-2">
      <div className={`rounded-2xl p-4 ${ok === undefined ? 'bg-himmel-50' : ok ? 'bg-minze-50' : 'bg-koralle-50'}`} role="status" data-testid="fs-rueckmeldung" data-ok={ok === undefined ? undefined : ok ? 'true' : 'false'}>
        {ok !== undefined && <p className={`font-display font-bold ${ok ? 'text-minze-700' : 'text-koralle-700'}`}>{ok ? t('Richtig!', 'Giusto!') : t('Nicht ganz.', 'Non proprio.')}</p>}
        <p className="text-tinte/80">{ex.text}</p>
        {ex.missing && <MissingBadge shown={ex.shownLang} lang={lang} />}
      </div>
      {trap && (
        <div className="rounded-2xl bg-lila-50 p-4" data-testid="fs-trabocchetto">
          <p className="font-display font-bold text-lila-700">{t('Warum ist das eine Fangfrage?', 'Perché è un trabocchetto?')}</p>
          <p className="text-tinte/80">{trap.text}</p>
        </div>
      )}
    </div>
  );
}
