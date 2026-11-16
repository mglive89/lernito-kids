import { Play } from 'lucide-react';
import { TopBar, COLOR_CLASSES } from '../../components/ui';
import { LinoSays } from '../../components/Lino';
import { GuideContent } from '../../components/GuideContent';
import type { LearningModule } from '../../learning/types';
import { L, tr } from '../../i18n';
import { sfx } from '../../lib/sound';

/**
 * Theorie vor der Übung: Erklärung, Beispiele und Lernkarten, bevor die erste Aufgabe kommt.
 * Beim ersten Mal sind alle Abschnitte offen, danach eingeklappt (zum schnellen Wiederholen).
 */
export function TheoryIntro({ module, firstTime, backTo, stars, lessonLabel, onStart }: {
  module: LearningModule; firstTime: boolean; backTo: string; stars?: number; lessonLabel?: string; onStart: () => void;
}) {
  const c = COLOR_CLASSES[module.color] ?? COLOR_CLASSES.himmel!;
  const start = () => { sfx.tap(); onStart(); };
  return (
    <div className="min-h-[100dvh]" data-testid="theorie-vorher">
      <TopBar title={L('Erst die Theorie', 'Prima la teoria')} back={backTo} stars={stars} />
      <main className="seite flex max-w-3xl flex-col gap-6 pb-36">
        <header className={`flex items-center gap-4 rounded-blob p-5 ${c.soft}`}>
          <span className="emoji flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-flaeche text-4xl shadow-weich" aria-hidden>{module.emoji}</span>
          <div className="min-w-0">
            <p className={`eyebrow ${c.text}`}>{lessonLabel ?? L('Thema', 'Argomento')}</p>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tr(module.title)}</h1>
            <p className="text-tinte/70">{tr(module.subtitle)}</p>
          </div>
        </header>
        <LinoSays mood="freude" text={firstTime
          ? L('Lies dir zuerst in Ruhe die Erklärung durch. Dann klappen die Übungen viel leichter!', 'Prima leggi con calma la spiegazione. Poi gli esercizi ti sembreranno molto più facili!')
          : L('Kurz wiederholen? Tippe auf einen Abschnitt, um ihn aufzuklappen.', 'Un ripasso veloce? Tocca una sezione per aprirla.')} />
        <GuideContent module={module} compact={!firstTime} />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="mx-auto flex max-w-3xl px-4 py-3">
          <button type="button" className="knopf w-full bg-himmel-500 text-white" onClick={start} data-testid="theorie-start">
            <Play size={20} /> {L('Verstanden, los geht’s!', 'Ho capito, iniziamo!')}
          </button>
        </div>
      </div>
    </div>
  );
}
