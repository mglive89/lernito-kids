import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ChevronDown, Lightbulb, Layers, Play } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { TopBar, COLOR_CLASSES } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { Visual } from '../components/Visual';
import { findModule } from '../learning/registry';
import { guideFor } from '../learning/guides';
import { workedExamples } from '../learning/examples';
import { pathDoneOf } from '../learning/adaptive';
import type { LearningModule, StudyCard } from '../learning/types';
import { L, tr } from '../i18n';
import { sfx } from '../lib/sound';

/** Theorie eines Themas: Das Wichtigste, gelöste Beispiele, Lernkarten. */
export function GuideContent({ module, compact = false }: { module: LearningModule; compact?: boolean }) {
  const guide = guideFor(module.id);
  const examples = useMemo(() => workedExamples(module, compact ? 2 : 3), [module, compact]);
  const cards = useMemo(() => module.cards?.() ?? [], [module]);
  return (
    <div className="flex flex-col gap-6" data-testid="theorie">
      {guide && (
        <section aria-labelledby="g-wichtig">
          <h2 id="g-wichtig" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><Lightbulb size={20} className="text-sonne-700" /> {L('Das Wichtigste', 'Da sapere')}</h2>
          <p className="mb-3 text-lg leading-relaxed">{tr(guide.intro)}</p>
          <ul className="flex flex-col gap-2">
            {guide.points.map((p, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-white p-3 text-base leading-relaxed shadow-weich ring-1 ring-tinte/5 sm:text-lg">
                <CheckCircle2 size={20} className="mt-1 shrink-0 text-minze-500" aria-hidden />
                <span>{tr(p)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {examples.length > 0 && (
        <section aria-labelledby="g-beispiele">
          <h2 id="g-beispiele" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><BookOpen size={20} className="text-himmel-700" /> {L('Beispiele mit Lösung', 'Esempi svolti')}</h2>
          <ol className="flex flex-col gap-3">
            {examples.map((ex, i) => (
              <li key={i} className="rounded-2xl bg-white p-4 shadow-weich ring-1 ring-tinte/5" data-testid="beispiel">
                <p className="eyebrow mb-1 text-tinte/50">{L('Beispiel', 'Esempio')} {i + 1}</p>
                <p className="font-display text-lg font-bold">{ex.prompt}</p>
                {ex.visual && <div className="my-3 flex justify-center"><Visual v={ex.visual} /></div>}
                <p className="mt-2"><span className="chip bg-minze-50 px-3 py-1 text-minze-700">{L('Lösung', 'Soluzione')}: {ex.answer}</span></p>
                {ex.steps.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-tinte/80">
                    {ex.steps.map((s, j) => <li key={j}>{s}</li>)}
                  </ul>
                )}
              </li>
            ))}
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
        <button className="knopf mt-3 w-full bg-white text-base" onClick={() => setShowAll((v) => !v)} data-testid="karten-alle">
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
      className={`flex min-h-[7rem] flex-col items-start gap-2 rounded-2xl p-4 text-left shadow-weich ring-1 transition ${open ? 'bg-lila-50 ring-lila-300' : 'bg-white ring-tinte/5 hover:ring-lila-300'}`}>
      <span className="font-semibold leading-snug">{c.q}</span>
      {c.code && <pre className="w-full overflow-x-auto rounded-xl bg-tinte px-3 py-2 font-mono text-sm text-white">{c.code}</pre>}
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

export function GuidePage() {
  const { moduleId } = useParams();
  const custom = useApp((s) => s.customModules);
  const { progress } = useActiveProfile();
  const nav = useNavigate();
  const mod = moduleId ? findModule(moduleId, custom) : undefined;
  if (!mod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text={L('Dieses Thema gibt es nicht (mehr).', 'Questo argomento non esiste (più).')} mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>{L('Zur Übersicht', 'Alla pagina iniziale')}</button>
      </div>
    );
  }
  const c = COLOR_CLASSES[mod.color] ?? COLOR_CLASSES.himmel!;
  const done = pathDoneOf(progress.modules[mod.id]);
  const step = Math.min(3, done + 1);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Theorie', 'Teoria')} back={-1} stars={progress.stars} />
      <main className="seite flex max-w-3xl flex-col gap-6 pb-32">
        <header className={`flex items-center gap-4 rounded-blob p-5 ${c.soft}`}>
          <span className="emoji flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-weich" aria-hidden>{mod.emoji}</span>
          <div className="min-w-0">
            <p className={`eyebrow ${c.text}`}>{L('Thema', 'Argomento')}</p>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tr(mod.title)}</h1>
            <p className="text-tinte/70">{tr(mod.subtitle)}</p>
          </div>
        </header>
        <GuideContent module={mod} />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-white/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="mx-auto flex max-w-3xl px-4 py-3">
          <Link to={`/spiel/${mod.id}${mod.area === 'schule' ? `?lektion=${step}` : ''}`} className="knopf w-full bg-himmel-500 text-white" data-testid="theorie-ueben">
            <Play size={20} /> {done > 0 ? L('Weiter üben', 'Continua a esercitarti') : L('Jetzt üben', 'Inizia gli esercizi')}
          </Link>
        </div>
      </div>
    </div>
  );
}
