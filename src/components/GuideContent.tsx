import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ChevronDown, Eye, Lightbulb, Layers } from 'lucide-react';
import { Visual } from './Visual';
import { LinoSays } from './Lino';
import { TheoryContent } from './TheoryContent';
import { guideFor } from '../learning/guides';
import { workedExamples } from '../learning/examples';
import type { LearningModule, StudyCard } from '../learning/types';
import { L, tr } from '../i18n';
import { sfx } from '../lib/sound';
import { LanguageTheory } from '../lingue/LanguageTheory';

/** Theorie eines Themas: Das Wichtigste, gelöste Beispiele, Lernkarten. */
export function GuideContent({ module, compact = false }: { module: LearningModule; compact?: boolean }) {
  const guide = guideFor(module.id);
  const examples = useMemo(() => workedExamples(module, compact ? 2 : 3), [module, compact]);
  const cards = useMemo(() => module.cards?.() ?? [], [module]);
  // Sprachkurse: eigene Theorie (Wörter, Sätze, Grammatik, Aussprache) statt allgemeiner Beispiele
  if (module.area === 'lingue') {
    return (
      <div className="flex flex-col gap-7" data-testid="theorie">
        <LanguageTheory module={module} compact={compact} />
        {cards.length > 0 && <Flashcards cards={cards} max={compact ? 6 : 12} />}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6" data-testid="theorie">
      {guide && (
        <section aria-labelledby="g-wichtig">
          <h2 id="g-wichtig" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><Lightbulb size={20} className="text-sonne-700" /> {L('Das Wichtigste', 'Da sapere')}</h2>
          <p className="mb-3 text-lg leading-relaxed">{tr(guide.intro)}</p>
          <ul className="flex flex-col gap-2">
            {guide.points.map((p, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-flaeche p-3 text-base leading-relaxed shadow-weich ring-1 ring-tinte/5 sm:text-lg">
                <CheckCircle2 size={20} className="mt-1 shrink-0 text-minze-500" aria-hidden />
                <span>{tr(p)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <TheoryContent moduleId={module.id} compact={compact} />
      {examples.length > 0 && (
        <section aria-labelledby="g-beispiele">
          <h2 id="g-beispiele" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><BookOpen size={20} className="text-himmel-700" /> {L('Beispiele zum Mitdenken', 'Esempi: prova tu')}</h2>
          <ol className="flex flex-col gap-3">
            {examples.map((ex, i) => <Example key={i} ex={ex} n={i + 1} />)}
          </ol>
        </section>
      )}
      {cards.length > 0 && <Flashcards cards={cards} max={compact ? 6 : 12} />}
      {!guide && examples.length === 0 && cards.length === 0 && (
        <LinoSays text={L('Zu diesem Thema gibt es noch keine Theorie. Probier die Übungen aus!', 'Per questo argomento non c’è ancora la teoria. Prova gli esercizi!')} mood="denken" />
      )}
    </div>
  );
}

function Flashcards({ cards, max }: { cards: StudyCard[]; max: number }) {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? cards : cards.slice(0, max);
  return (
    <section aria-labelledby="g-karten">
      <h2 id="g-karten" className="mb-1 flex items-center gap-2 font-display text-xl font-bold"><Layers size={20} className="text-lila-700" /> {L('Lernkarten', 'Flashcard')}</h2>
      <p className="mb-3 text-base text-tinte/60">{L('Überlege zuerst selbst, dann tippe auf die Karte.', 'Pensa prima da solo, poi tocca la carta.')}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((c, i) => <Card key={i} c={c} />)}
      </div>
      {cards.length > max && (
        <button className="knopf mt-3 w-full bg-flaeche text-base" onClick={() => setShowAll((v) => !v)} data-testid="karten-alle">
          <ChevronDown className={showAll ? 'rotate-180' : ''} /> {showAll ? L('Weniger anzeigen', 'Mostra meno') : L(`Alle ${cards.length} Karten anzeigen`, `Mostra tutte le ${cards.length} carte`)}
        </button>
      )}
    </section>
  );
}

function Card({ c }: { c: StudyCard }) {
  const [open, setOpen] = useState(false);
  return (
    <button type="button" onClick={() => { sfx.flip(); setOpen((v) => !v); }} aria-expanded={open} data-testid="lernkarte"
      className={`flex min-h-[7rem] flex-col items-start gap-2 rounded-2xl p-4 text-left shadow-weich ring-1 transition ${open ? 'bg-lila-50 ring-lila-300' : 'bg-flaeche ring-tinte/5 hover:ring-lila-300'}`}>
      <span className="font-semibold leading-snug">{c.q}</span>
      {c.code && <pre className="w-full overflow-x-auto rounded-xl bg-tinte-fest px-3 py-2 font-mono text-sm text-white">{c.code}</pre>}
      {open ? (
        <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1">
          <span className="font-display text-lg font-bold text-lila-700">{c.a}</span>
          {c.ex && <span className="text-sm text-tinte/70">{c.ex}</span>}
        </motion.span>
      ) : (
        <span className="mt-auto text-sm font-bold text-lila-700">{L('Antwort zeigen', 'Mostra la risposta')}</span>
      )}
    </button>
  );
}


/** Gelöstes Beispiel: erst selbst überlegen, die Lösung kommt auf Knopfdruck. */
function Example({ ex, n }: { ex: ReturnType<typeof workedExamples>[number]; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-2xl bg-white p-4 shadow-weich ring-1 ring-tinte/5" data-testid="beispiel">
      <p className="eyebrow mb-1 text-tinte/50">{L('Beispiel', 'Esempio')} {n}</p>
      <p className="font-display text-lg font-bold">{ex.prompt}</p>
      {ex.visual && <div className="my-3 flex justify-center"><Visual v={ex.visual} /></div>}
      {open ? (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} data-testid="beispiel-loesung">
          <p className="mt-2"><span className="chip bg-minze-50 px-3 py-1 text-minze-700">{L('Lösung', 'Soluzione')}: {ex.answer}</span></p>
          {ex.steps.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-tinte/80">
              {ex.steps.map((s, j) => <li key={j}>{s}</li>)}
            </ul>
          )}
        </motion.div>
      ) : (
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full bg-minze-50 px-4 py-2 text-base font-bold text-minze-700 ring-1 ring-minze-100 transition hover:bg-minze-100"
          onClick={() => { sfx.flip(); setOpen(true); }} data-testid="beispiel-zeigen">
          <Eye size={18} aria-hidden /> {L('Erst selbst überlegen – dann Lösung zeigen', 'Pensa prima da solo, poi mostra la soluzione')}
        </button>
      )}
    </li>
  );
}
