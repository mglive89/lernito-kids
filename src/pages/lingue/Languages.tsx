import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Crown, Lock, Mic, MicOff, Star, Trophy } from 'lucide-react';
import { useActiveProfile, type ProfileProgress } from '../../store/useApp';
import { COLOR_CLASSES, PageHero, ProgressBar, StarCount, TopBar } from '../../components/ui';
import { Lino } from '../../components/Lino';
import { useVoiceAllowed, VoiceConsentModal } from '../../components/voice/Voice';
import { recognitionSupported } from '../../lib/listen';
import { sfx } from '../../lib/sound';
import { pathDoneOf } from '../../learning/adaptive';
import { PATH_LESSONS, lessonLabel } from '../../learning/lessons';
import type { LearningModule } from '../../learning/types';
import { courseById, courseModules, coursesFor, type Course } from '../../lingue/course';
import { getLang, L, tr } from '../../i18n';

const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];

/** Hinweis zum Mikrofon: unterstützt? freigegeben? */
function MicStatus() {
  const allowed = useVoiceAllowed();
  const [open, setOpen] = useState(false);
  const supported = recognitionSupported();
  if (!supported) {
    return (
      <div className="karte-3d flex items-start gap-3 p-4 text-sm text-tinte/70" data-testid="mikro-status">
        <MicOff size={22} className="mt-0.5 shrink-0 text-tinte/40" />
        <p>{L('Dieser Browser kann keine Sprache erkennen. Die Sprechübungen funktionieren trotzdem: anhören und laut nachsprechen. Für die Mikrofon-Prüfung eignen sich Chrome, Edge oder Safari.', 'Questo browser non riconosce la voce. Gli esercizi di pronuncia funzionano lo stesso: ascolta e ripeti ad alta voce. Per il controllo con il microfono usa Chrome, Edge o Safari.')}</p>
      </div>
    );
  }
  return (
    <div className="karte-3d flex items-center gap-3 p-4" data-testid="mikro-status">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${allowed ? 'bg-minze-50 text-minze-700' : 'bg-sonne-50 text-sonne-700'}`}><Mic size={22} /></span>
      <p className="flex-1 text-sm text-tinte/70">
        {allowed
          ? L('Mikrofon ist eingeschaltet: Puppy hört zu, wenn du sprichst.', 'Il microfono è attivo: Puppy ti ascolta quando parli.')
          : L('Mit dem Mikrofon übst du die Aussprache. Ein Erwachsener muss es einmal erlauben.', 'Con il microfono fai pratica di pronuncia. Un adulto deve consentirlo una volta.')}
      </p>
      {!allowed && <button className="knopf shrink-0 bg-white px-4 text-sm" onClick={() => setOpen(true)} data-testid="mikro-aktivieren">{L('Einschalten', 'Attiva')}</button>}
      <VoiceConsentModal open={open} onDone={() => setOpen(false)} />
    </div>
  );
}

function courseProgress(c: Course, modules: ProfileProgress['modules']) {
  const mods = courseModules(c.id);
  const done = mods.reduce((a, m) => a + pathDoneOf(modules[m.id]), 0);
  return { done, total: mods.length * 3 };
}

/** Seite „Sprachen“: Kurs wählen. */
export function LanguagesPage() {
  const { progress } = useActiveProfile();
  const courses = coursesFor(getLang());
  return (
    <div style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 sm:px-6">
        <h1 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{L('Sprachen', 'Lingue')}</h1>
        <StarCount n={progress.stars} />
      </div>
      <main className="seite" data-testid="sprachen-seite">
        <PageHero color="sonne" title={L('Welche Sprache lernst du?', 'Che lingua vuoi imparare?')}
          subtitle={L('Kurze Lektionen: hören, verstehen, Sätze bauen und sprechen.', 'Lezioni brevi: ascolta, capisci, componi frasi e parla.')}
          art={<span className="-my-8 block"><Lino mood="winken" size={104} /></span>} />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {courses.map((c) => {
            const p = courseProgress(c, progress.modules);
            return (
              <Link key={c.id} to={`/lingue/${c.id}`} onClick={() => sfx.tap()} data-testid={`kurs-${c.id}`}
                className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
                <span className="emoji flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tinte/[0.04] text-4xl" aria-hidden>{c.flag}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold leading-tight">{c.name()}</span>
                  <span className="mb-2 block text-sm text-tinte/55">{c.native} · {p.done}/{p.total} {L('Lektionen', 'lezioni')}</span>
                  <ProgressBar value={p.total ? p.done / p.total : 0} />
                </span>
                <ArrowRight size={20} className="shrink-0 text-himmel-600 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            );
          })}
        </div>
        <div className="mt-6"><MicStatus /></div>
      </main>
    </div>
  );
}

/** Lernpfad eines Sprachkurses: Einheiten mit je drei Lektionen. */
export function LanguageCoursePage() {
  const { course: cid } = useParams();
  const course = courseById(cid);
  const { progress } = useActiveProfile();
  const mods = useMemo(() => (course ? courseModules(course.id) : []), [course]);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  if (!course || course.id === getLang()) return <Navigate to="/lingue" replace />;
  const total = mods.length * 3;
  const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
  // Einheiten nacheinander freischalten: die nächste beginnt, wenn die vorige mindestens Lektion 1 hat
  const currentId = mods.find((m) => pathDoneOf(progress.modules[m.id]) < 3)?.id;
  let k = 0;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={`${course.flag} ${course.name()}`} back="/lingue" stars={progress.stars} />
      <main className="seite max-w-2xl">
        <div className="karte-3d mb-6 flex items-center gap-4 p-4">
          <span className="emoji flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tinte/[0.04] text-4xl" aria-hidden>{course.flag}</span>
          <div className="flex-1">
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <p className="font-display font-bold">{L('Dein Kurs', 'Il tuo corso')}</p>
              <p className="text-sm font-semibold text-tinte/60" data-testid="kurs-fortschritt">{done}/{total} {L('Lektionen', 'lezioni')}</p>
            </div>
            <ProgressBar value={total ? done / total : 0} />
          </div>
        </div>
        <ol className="flex flex-col gap-4" aria-label={L('Lernpfad', 'Percorso')}>
          {mods.map((m, ui) => {
            const pd = pathDoneOf(progress.modules[m.id]);
            const prevStarted = ui === 0 || pathDoneOf(progress.modules[mods[ui - 1]!.id]) >= 1;
            return (
              <li key={m.id} className="flex flex-col items-center gap-4" data-testid={`einheit-${m.id}`}>
                <UnitHeader m={m} index={ui} done={pd} />
                <div className="flex flex-col items-center gap-4 py-2">
                  {PATH_LESSONS().map((les) => {
                    const off = OFFSETS[k++ % OFFSETS.length]!;
                    const state = pd >= les.n ? 'done' : pd + 1 === les.n && prevStarted ? 'open' : 'locked';
                    return (
                      <PathNode key={les.n} m={m} n={les.n} name={les.name} state={state} current={m.id === currentId && state === 'open'} offset={off}
                        onLocked={() => setToast(!prevStarted && les.n === 1
                          ? L('Mach zuerst die erste Lektion der Einheit davor.', 'Fai prima la prima lezione dell’unità precedente.')
                          : L(`Schließe zuerst Lektion ${les.n - 1} ab.`, `Completa prima la lezione ${les.n - 1}.`))} />
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-tinte/60">
          <Trophy size={36} className={done === total ? 'text-sonne-500' : 'text-tinte/20'} />
          <p className="font-display font-bold">{done === total ? L('Kurs geschafft! Super gemacht.', 'Corso completato! Bravissimo.') : L('Ziel: alle Lektionen meistern', 'Obiettivo: completare tutte le lezioni')}</p>
        </div>
      </main>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} role="status"
            className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-sm rounded-2xl bg-tinte px-5 py-3 text-center font-semibold text-white shadow-karte lg:bottom-6" style={{ marginBottom: 'var(--safe-bottom)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnitHeader({ m, index, done }: { m: LearningModule; index: number; done: number }) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
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
        <Link to={`/thema/${m.id}`} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-bold text-tinte shadow-weich transition hover:bg-white/90" data-testid={`vokabeln-${m.id}`}>
          <BookOpen size={18} /> <span className="hidden sm:inline">{L('Wörter', 'Parole')}</span>
        </Link>
      </div>
    </div>
  );
}

function PathNode({ m, n, name, state, current, offset, onLocked }: {
  m: LearningModule; n: number; name: string; state: 'done' | 'open' | 'locked'; current: boolean; offset: number; onLocked: () => void;
}) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
  const label = `${lessonLabel(n)}${state === 'done' ? L(' (erledigt)', ' (completata)') : state === 'locked' ? L(' (gesperrt)', ' (bloccata)') : ''}`;
  const circle = `relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full transition active:translate-y-1 ${
    state === 'locked' ? 'bg-tinte/[0.08] text-tinte/30 shadow-[0_3px_0_rgba(24,33,61,0.08)]' : `${c.bg} text-white shadow-[0_4px_0_rgba(24,33,61,0.18)]`}`;
  const icon = state === 'done' ? (n === 3 ? <Crown size={30} /> : <Check size={32} strokeWidth={3} />) : state === 'locked' ? <Lock size={26} /> : n === 3 ? <Mic size={30} /> : <Star size={30} className="fill-white" />;
  const inner = (
    <span className="flex flex-col items-center gap-1.5">
      <span className={circle}>
        {current && <span className={`absolute -inset-2 animate-ping rounded-full opacity-20 ${c.bg}`} aria-hidden />}
        {current && <span className={`absolute -inset-1.5 rounded-full ring-4 ${c.ring} ring-offset-2 ring-offset-creme`} aria-hidden />}
        <span className="relative">{icon}</span>
      </span>
      <span className={`text-sm font-bold ${state === 'locked' ? 'text-tinte/35' : 'text-tinte/75'}`}>{name}</span>
    </span>
  );
  return (
    <div className="relative" style={{ transform: `translateX(${offset}px)` }}>
      {current && (
        <motion.span initial={{ y: 0 }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className={`absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1 text-sm font-extrabold uppercase tracking-wide shadow-weich ring-1 ring-tinte/10 ${c.text}`}>
          {L('Start', 'Inizia')}
        </motion.span>
      )}
      {current && <span className={`absolute top-0 ${offset > 0 ? '-left-24' : '-right-24'} hidden sm:block`} aria-hidden><Lino mood="winken" size={78} /></span>}
      {state === 'locked'
        ? <button type="button" onClick={onLocked} aria-label={label} data-testid={`lektion-${m.id}-${n}`}>{inner}</button>
        : <Link to={`/spiel/${m.id}?lektion=${n}`} aria-label={label} data-testid={`lektion-${m.id}-${n}`} onClick={() => sfx.tap()}>{inner}</Link>}
    </div>
  );
}
