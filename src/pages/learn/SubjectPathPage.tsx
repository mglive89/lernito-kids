import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Camera, Check, ChevronRight, Crown, Lock, Star, Trophy } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { COLOR_CLASSES, ProgressBar, SubjectIcon, TopBar } from '../../components/ui';
import { sfx } from '../../lib/sound';
import { Lino, LinoSays } from '../../components/Lino';
import { schoolModules } from '../../learning/registry';
import type { LearningModule } from '../../learning/types';
import { L, tr } from '../../i18n';
import { yearLabel } from '../../school/systems';
import { subjectDef, subjectName } from '../../school/subjects';
import { pathDoneOf } from '../../learning/adaptive';
import { PATH_LESSONS, lessonLabel } from '../../learning/lessons';

/** Versatz der Knoten im Pfad (Schlangenlinie) */
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];

/** Lernpfad eines Fachs: Einheiten mit je drei Lektionen. */
export function SubjectPage() {
  const { year, subject } = useParams();
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const country = profile?.country ?? 'DE';
  const y = Number(year) || 1;
  const mods = useMemo(() => schoolModules(country, y, subject ?? '', custom), [country, y, subject, custom]);
  const total = mods.length * 3;
  const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
  // Aktueller Knoten: erste offene Lektion im ganzen Pfad
  const currentId = mods.find((m) => pathDoneOf(progress.modules[m.id]) < 3)?.id;
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  const def = subjectDef(subject ?? '');
  const c = COLOR_CLASSES[def?.color ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
  let k = 0;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={`${subjectName(subject ?? '', country)} · ${yearLabel(country, y).replace(/ · .*/, '')}`} back={`/schule?jahr=${y}`} stars={progress.stars} />
      <main className="seite max-w-2xl">
        {mods.length === 0 ? (
          <LinoSays text={L('Hier gibt es noch keine Übungen. Schau bald wieder vorbei!', 'Qui non ci sono ancora esercizi. Torna presto!')} mood="denken" />
        ) : (
          <>
            <div className="karte-3d mb-6 flex items-center gap-4 p-4">
              <SubjectIcon id={subject ?? ''} color={def?.color} size="lg" />
              <div className="flex-1">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <p className="font-display font-bold">{L('Dein Lernpfad', 'Il tuo percorso')}</p>
                  <p className="text-sm font-semibold text-tinte/60" data-testid="pfad-fortschritt">{done}/{total} {L('Lektionen', 'lezioni')}</p>
                </div>
                <ProgressBar value={total ? done / total : 0} color={c.bg} />
              </div>
            </div>
            {subject === 'mathe' && (
              <Link to="/hausaufgaben" className="karte-3d -mt-2 mb-6 flex items-center gap-4 p-4" data-testid="hausaufgaben-hilfe">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-himmel-500 text-white"><Camera size={24} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display font-bold">{L('Hausaufgaben-Hilfe', 'Aiuto compiti')}</span>
                  <span className="block text-sm text-tinte/60">{L('Aufgabe fotografieren oder eintippen – Puppy erklärt den Lösungsweg', 'Fotografa o scrivi un esercizio: Puppy ti spiega come si risolve')}</span>
                </span>
                <ChevronRight size={22} className="shrink-0 text-tinte/40" />
              </Link>
            )}
            <ol className="flex flex-col gap-4" aria-label={L('Lernpfad', 'Percorso')}>
              {mods.map((m, ui) => {
                const pd = pathDoneOf(progress.modules[m.id]);
                return (
                  <li key={m.id} className="flex flex-col items-center gap-4" data-testid={`einheit-${m.id}`}>
                    <UnitHeader m={m} index={ui} done={pd} />
                    <div className="flex flex-col items-center gap-4 py-2">
                      {PATH_LESSONS().map((les) => {
                        const off = OFFSETS[k++ % OFFSETS.length]!;
                        const state = pd >= les.n ? 'done' : pd + 1 === les.n ? 'open' : 'locked';
                        const isCurrent = m.id === currentId && state === 'open';
                        return (
                          <PathNode key={les.n} m={m} n={les.n} name={les.name} state={state} current={isCurrent} offset={off}
                            testId={state === 'open' || (pd >= 3 && les.n === 3) ? `modul-${m.id}` : undefined}
                            onLocked={() => setToast(L(`Schließe zuerst Lektion ${les.n - 1} ab.`, `Completa prima la lezione ${les.n - 1}.`))} />
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-10 flex flex-col items-center gap-2 text-center text-tinte/60">
              <Trophy size={36} className={done === total ? 'text-sonne-500' : 'text-tinte/20'} />
              <p className="font-display font-bold">{done === total ? L('Alles gemeistert! Super gemacht.', 'Tutto completato! Bravissimo.') : L('Ziel: alle Lektionen meistern', 'Obiettivo: completare tutte le lezioni')}</p>
            </div>
          </>
        )}
      </main>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} role="status"
            className="fixed inset-x-4 bottom-24 z-40 lg:bottom-6 mx-auto max-w-sm rounded-2xl bg-tinte-fest px-5 py-3 text-center font-semibold text-white shadow-karte" style={{ marginBottom: 'var(--safe-bottom)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnitHeader({ m, index, done }: { m: LearningModule; index: number; done: number }) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
  // Gelb ist zu hell für weiße Schrift
  const light = m.color === 'sonne';
  return (
    <div className={`w-full rounded-blob p-4 shadow-weich sm:p-5 ${c.bg} ${light ? 'text-tinte [&_.u-sub]:text-tinte/75' : 'text-white [&_.u-sub]:text-white/85'}`}>
      <div className="flex items-start gap-3">
        <span className="emoji flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl" aria-hidden>{m.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="u-sub text-xs font-bold uppercase tracking-wider">{L('Einheit', 'Unità')} {index + 1}{done >= 3 ? ` · ${L('gemeistert', 'completata')}` : ''}</p>
          <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">{tr(m.title)}</h2>
          <p className="u-sub text-sm sm:text-base">{tr(m.subtitle)}</p>
        </div>
        <Link to={`/thema/${m.id}`} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-flaeche px-3 py-2 text-sm font-bold text-tinte shadow-weich transition hover:bg-white/90" data-testid={`theorie-${m.id}`}>
          <BookOpen size={18} /> <span className="hidden sm:inline">{L('Theorie', 'Teoria')}</span>
        </Link>
      </div>
    </div>
  );
}

function PathNode({ m, n, name, state, current, offset, testId, onLocked }: {
  m: LearningModule; n: number; name: string; state: 'done' | 'open' | 'locked'; current: boolean; offset: number; testId?: string; onLocked: () => void;
}) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
  const label = `${lessonLabel(n)}${state === 'done' ? L(' (erledigt)', ' (completata)') : state === 'locked' ? L(' (gesperrt)', ' (bloccata)') : ''}`;
  const circle = `relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full transition active:translate-y-1 ${
    state === 'locked' ? 'bg-tinte/[0.08] text-tinte/30 shadow-[0_3px_0_rgba(24,33,61,0.08)]' : `${c.bg} text-white shadow-[0_4px_0_rgba(24,33,61,0.18)]`}`;
  const icon = state === 'done' ? (n === 3 ? <Crown size={30} /> : <Check size={32} strokeWidth={3} />) : state === 'locked' ? <Lock size={26} /> : <Star size={30} className="fill-white" />;
  const inner = (
    <motion.span className="flex flex-col items-center gap-1.5" initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
      whileHover={state === 'locked' ? undefined : { scale: 1.06 }} whileTap={{ scale: 0.94 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>
      <span className={circle}>
        {current && <span className={`absolute -inset-2 animate-ping rounded-full opacity-20 ${c.bg}`} aria-hidden />}
        {current && <span className={`absolute -inset-1.5 rounded-full ring-4 ${c.ring} ring-offset-2 ring-offset-creme`} aria-hidden />}
        <span className="relative">{icon}</span>
      </span>
      <span className={`text-sm font-bold ${state === 'locked' ? 'text-tinte/35' : 'text-tinte/75'}`}>{name}</span>
    </motion.span>
  );
  return (
    <div className="relative" style={{ transform: `translateX(${offset}px)` }}>
      {current && (
        <motion.span initial={{ y: 0 }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className={`absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-flaeche px-3 py-1 text-sm font-extrabold uppercase tracking-wide shadow-weich ring-1 ring-tinte/10 ${c.text}`}>
          {L('Start', 'Inizia')}
        </motion.span>
      )}
      {current && <span className={`absolute top-0 ${offset > 0 ? '-left-24' : '-right-24'} hidden sm:block`} aria-hidden><Lino mood="winken" size={78} /></span>}
      {state === 'locked'
        ? <button type="button" onClick={onLocked} aria-label={label} data-testid={`lektion-${m.id}-${n}`}>{inner}</button>
        : <Link to={`/spiel/${m.id}?lektion=${n}`} aria-label={label} data-testid={testId ?? `lektion-${m.id}-${n}`} onClick={() => sfx.tap()}>{inner}</Link>}
    </div>
  );
}

