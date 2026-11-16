/**
 * Lektion abspielen: Ziel → Dialog (mit Audio, Übersetzung und Umschrift getrennt) → Wörter → Übungen → Abschluss-Situation.
 * Nach einem Fehler: Erklärung in der Ausgangssprache des Kurses, die Übung kommt in den Ripasso.
 * Dieselbe Abfolge dient auch dem Ripasso (nur die gespeicherten Übungen).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { animate, motion, useAnimationControls } from 'framer-motion';
import { Star, Target, Volume2, X } from 'lucide-react';
import { Confetti } from '../components/ui/Confetti';
import { starsFor, useFx } from './fx';
import { Lino } from '../components/Lino';
import { useApp } from '../store/useApp';
import { useLangPlay } from '../lingue/play-state';
import { stopSpeaking } from '../lib/speech';
import { dirOf } from './catalog';
import { bigButton, cn, Loading, LoadError, PlayButton, QualityNote, SourceText, TargetText, VoiceNote } from './components';
import { ExerciseView, Feedback, type CheckResult } from './exercises';
import { useT } from './i18n';
import { useCourse } from './packs';
import { useCourseProgress, useFlowStore, useOwner, useOwnerId } from './store';
import { playItem, useVoice } from './voice';
import { useDocumentLang } from './pages';
import type { Exercise, Item, Lesson, LoadedCourse } from './types';

function Frame({ children, onClose, progress }: { children: React.ReactNode; onClose: () => void; progress?: number }) {
  const { t, ui } = useT();
  useDocumentLang();
  return (
    <div className="min-h-[100dvh] bg-creme" lang={ui} dir={dirOf(ui)} data-testid="lf-lezione">
      <header className="sticky top-0 z-20 border-b border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-tinte/[0.05]" aria-label={t('lesson.close')} data-testid="chiudi-lezione"><X /></button>
          {progress !== undefined && (
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-tinte/[0.08]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <motion.div className="h-full rounded-full bg-minze-500" animate={{ width: `${progress * 100}%` }} />
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-5">{children}</main>
    </div>
  );
}

function Line({ item, course, voice, showTr, showTranslit, speakerSide, index = 0 }: { index?: number; item: Item; course: LoadedCourse; voice: ReturnType<typeof useVoice>; showTr: boolean; showTranslit: boolean; speakerSide?: 'a' | 'b' }) {
  const { t } = useT();
  const target = course.entry.target;
  return (
    <motion.li initial={{ opacity: 0, x: speakerSide === 'b' ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.12, type: 'spring', stiffness: 300, damping: 26 }}
      className={cn('flex gap-3', speakerSide === 'b' && 'flex-row-reverse')} data-testid="riga">
      <div className={cn('max-w-[88%] rounded-2xl px-3.5 py-2.5 ring-1 ring-tinte/[0.07]', speakerSide === 'b' ? 'bg-himmel-50' : 'bg-flaeche')}>
        {item.speaker && <p className="text-xs font-bold text-tinte/50" lang={target} dir={dirOf(target)}>{item.speaker}</p>}
        <div className="flex items-start gap-2">
          <TargetText item={item} lang={target} showTranslit={showTranslit} className="text-lg font-semibold" />
          <PlayButton item={item} lang={target} voice={voice} label={t('lesson.play')} />
        </div>
        {showTr && <SourceText lang={course.entry.source} className="mt-1 block text-sm text-tinte/60" testId="traduzione">{course.tr.items[item.id]}</SourceText>}
      </div>
    </motion.li>
  );
}

function Intro({ course, lesson, onStart }: { course: LoadedCourse; lesson: Lesson; onStart: () => void }) {
  const { t } = useT();
  const o = useOwner();
  const owner = useOwnerId();
  const patch = useFlowStore((s) => s.patch);
  const voice = useVoice(course.entry.target);
  const lt = course.tr.lessons[lesson.id];
  const target = course.entry.target;
  const hasTranslit = [...lesson.dialogue, ...lesson.vocabulary].some((i) => i.translit);
  const speakers = [...new Set(lesson.dialogue.map((d) => d.speaker))];
  const playAll = () => {
    // nacheinander vorlesen (Gerätestimme stellt sie in eine Warteschlange)
    lesson.dialogue.forEach((d, i) => setTimeout(() => playItem(d, target, voice), i * 2600));
  };
  const toggle = (k: 'showTranslation' | 'showTranslit', label: string) => (
    <button type="button" onClick={() => patch(owner, { [k]: !o[k] })} aria-pressed={o[k]} data-testid={`mostra-${k}`}
      className={cn('rounded-full px-3 py-1 text-sm font-bold ring-1', o[k] ? 'bg-minze-50 text-minze-700 ring-minze-300' : 'bg-flaeche text-tinte/55 ring-tinte/15')}>{label}</button>
  );
  return (
    <div className="flex flex-col gap-5" data-testid="lf-intro">
      <div className="flex items-center gap-3">
        <Lino mood="freude" size={74} still />
        <div className="min-w-0" lang={course.entry.source} dir={dirOf(course.entry.source)}>
          <h1 className="font-display text-2xl font-extrabold" data-testid="titolo-lezione">{lt?.title}</h1>
          <p className="flex items-start gap-1.5 text-tinte/70" data-testid="obiettivo"><Target size={18} className="mt-0.5 shrink-0 text-minze-600" /> <span><span className="sr-only">{t('lesson.goal')}: </span>{lt?.goal}</span></p>
        </div>
      </div>
      <VoiceNote voice={voice} lang={target} />
      <div className="flex flex-wrap items-center gap-2">
        {toggle('showTranslation', t('lesson.showTr'))}
        {hasTranslit && toggle('showTranslit', t('lesson.showTranslit'))}
        {voice === 'yes' && <button type="button" onClick={playAll} className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-himmel-500 px-3 py-1 text-sm font-bold text-white" data-testid="ascolta-dialogo"><Volume2 size={16} /> {t('lesson.listenAll')}</button>}
      </div>
      <section>
        <h2 className="mb-2 font-display text-lg font-bold">{t('lesson.dialogue')}</h2>
        <ul className="flex flex-col gap-2.5" data-testid="dialogo">
          {lesson.dialogue.map((d, i) => <Line key={d.id} index={i} item={d} course={course} voice={voice} showTr={o.showTranslation} showTranslit={o.showTranslit} speakerSide={speakers.indexOf(d.speaker) % 2 ? 'b' : 'a'} />)}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 font-display text-lg font-bold">{t('lesson.words')}</h2>
        <ul className="grid gap-2 sm:grid-cols-2" data-testid="vocabolario">
          {lesson.vocabulary.map((v) => (
            <li key={v.id} className="flex items-start gap-2 rounded-xl bg-flaeche p-3 ring-1 ring-tinte/[0.07]">
              <span className="min-w-0 flex-1">
                <TargetText item={v} lang={target} showTranslit={o.showTranslit} className="font-bold" />
                <SourceText lang={course.entry.source} className="block text-sm text-tinte/60">{course.tr.items[v.id]}</SourceText>
              </span>
              <PlayButton item={v} lang={target} voice={voice} label={t('lesson.play')} />
            </li>
          ))}
        </ul>
      </section>
      <QualityNote quality={course.tr.quality} />
      <button type="button" className={bigButton('primary', 'w-full')} onClick={onStart} data-testid="inizia-esercizi">{t('lesson.startEx')}</button>
    </div>
  );
}

/** Übungen nacheinander; meldet Fehler/Erfolge an den Speicher */
function Runner({ course, exercises, lessonOf, onFinish, mode, onProgress }: {
  course: LoadedCourse; exercises: Exercise[]; lessonOf: (exId: string) => string; mode: 'lesson' | 'review';
  onFinish: (score: number, wrong: number) => void; onProgress?: (done: number) => void;
}) {
  const { t } = useT();
  const o = useOwner();
  const owner = useOwnerId();
  const voice = useVoice(course.entry.target);
  const addMistake = useFlowStore((s) => s.addMistake);
  const clearMistake = useFlowStore((s) => s.clearMistake);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const fx = useFx();
  const shake = useAnimationControls();
  const ex = exercises[i]!;
  useEffect(() => { fx.start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const onChecked = (r: CheckResult) => {
    setResult(r);
    onProgress?.(i + 1);
    if (r.ok) { setScore((s) => s + 1); setStreak((n) => n + 1); clearMistake(owner, course.entry.id, ex.id); }
    else {
      setWrong((w) => w + 1); setStreak(0); addMistake(owner, course.entry.id, ex.id, lessonOf(ex.id));
      if (fx.on) void shake.start({ x: [0, -10, 10, -7, 7, -3, 0], transition: { duration: 0.45 } });
    }
  };
  const next = () => {
    stopSpeaking();
    if (i + 1 >= exercises.length) { onFinish(score, wrong); return; }
    setResult(null);
    setI(i + 1);
  };
  return (
    <div className="flex flex-col gap-5" data-testid="lf-esercizi" data-mode={mode} data-index={i}>
      <p className="text-sm font-semibold text-tinte/55" data-testid="numero-esercizio">{t('lesson.of', { i: i + 1, n: exercises.length })}</p>
      {ex.type === 'listen' && <VoiceNote voice={voice} lang={course.entry.target} />}
      <motion.div key={`wrap-${i}`} initial={fx.on ? { opacity: 0, x: 40 } : false} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}>
        <motion.div animate={shake}>
          <ExerciseView key={`${ex.id}-${i}`} ex={ex} course={course} voice={voice} showTranslit={o.showTranslit} onChecked={onChecked} locked={!!result} />
        </motion.div>
      </motion.div>
      {result && <Feedback key={`fb-${i}`} result={result} explain={course.tr.exercises[ex.id]?.explain ?? ''} source={course.entry.source} onNext={next} saved={!result.ok} streak={streak} />}
    </div>
  );
}

export function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { t } = useT();
  const nav = useNavigate();
  const owner = useOwnerId();
  const pid = useApp((s) => s.activeProfileId);
  const course = useCourse(courseId);
  const prog = useCourseProgress(courseId);
  const finishLesson = useFlowStore((s) => s.finishLesson);
  const [phase, setPhase] = useState<'intro' | 'ex' | 'done'>('intro');
  const [res, setRes] = useState<{ score: number; wrong: number } | null>(null);
  const [answered, setAnswered] = useState(0);
  const close = () => { stopSpeaking(); nav('/corso'); };

  if (course.missing) return <Frame onClose={close}><p data-testid="corso-mancante">{t('notfound')}</p></Frame>;
  if (course.error) return <Frame onClose={close}><LoadError /></Frame>;
  if (!course.data) return <Frame onClose={close}><Loading /></Frame>;
  const c = course.data;
  const idx = c.lessons.findIndex((l) => l.id === lessonId);
  const lesson = c.lessons[idx];
  if (!lesson) return <Navigate to="/corso" replace />;
  const nextLesson = c.lessons[idx + 1];
  const total = lesson.exercises.length;

  if (phase === 'intro') return <Frame onClose={close} progress={0}><Intro course={c} lesson={lesson} onStart={() => setPhase('ex')} /></Frame>;
  if (phase === 'ex') {
    return (
      <Frame onClose={close} progress={0.05 + 0.95 * (answered / total)}>
        <Runner course={c} exercises={lesson.exercises} lessonOf={() => lesson.id} mode="lesson" onProgress={setAnswered} onFinish={(score, wrong) => {
          finishLesson(owner, c.entry.id, lesson.id, score, total);
          if (pid) useLangPlay.getState().lessonDone(pid, 10 + score * 2);
          setRes({ score, wrong });
          setPhase('done');
        }} />
      </Frame>
    );
  }
  const mistakes = Object.keys(prog.mistakes).length;
  return (
    <Frame onClose={close} progress={1}>
      <DoneScreen score={res?.score ?? 0} wrong={res?.wrong ?? 0} total={total}>
        <div className="flex w-full flex-col gap-2.5">
          {nextLesson && <Link to={`/lezione/${c.entry.id}/${nextLesson.id}`} onClick={() => { setPhase('intro'); setRes(null); setAnswered(0); }} className={bigButton('primary', 'w-full')} data-testid="lezione-successiva">{t('done.next')}</Link>}
          {mistakes > 0 && <Link to={`/ripasso/${c.entry.id}`} className={bigButton('secondary', 'w-full')} data-testid="fine-ripasso">{t('done.review')}</Link>}
          <Link to="/corso" className={bigButton('outline', 'w-full')} data-testid="torna-lezioni">{t('done.home')}</Link>
        </div>
      </DoneScreen>
    </Frame>
  );
}

/** Zahl, die hochzählt */
function CountUp({ to, on }: { to: number; on: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!on || !ref.current) { if (ref.current) ref.current.textContent = String(to); return; }
    const c = animate(0, to, { duration: 0.9, ease: 'easeOut', onUpdate: (v) => { if (ref.current) ref.current.textContent = String(Math.round(v)); } });
    return () => c.stop();
  }, [to, on]);
  return <span ref={ref}>{to}</span>;
}

/** Abschluss: Konfetti, Puppy jubelt, Sterne erscheinen nacheinander, Punkte zählen hoch */
function DoneScreen({ score, wrong, total, children }: { score: number; wrong: number; total: number; children: React.ReactNode }) {
  const { t } = useT();
  const fx = useFx();
  const stars = starsFor(score, total);
  useEffect(() => {
    fx.win();
    const ids = [0, 1, 2].filter((k) => k < stars).map((k) => setTimeout(() => fx.star(), 700 + k * 280));
    return () => ids.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex flex-col items-center gap-4 text-center" data-testid="lf-fine" data-score={score} data-total={total} data-stars={stars}>
      <Confetti show={fx.on} count={stars === 3 ? 60 : 36} />
      <motion.div initial={fx.on ? { scale: 0.5, y: 30, opacity: 0 } : false} animate={{ scale: 1, y: [30, -18, 0], opacity: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
        <Lino mood="jubel" size={130} />
      </motion.div>
      <h1 className="font-display text-3xl font-extrabold">{t('done.title')}</h1>
      <div className="flex items-end gap-2" role="img" aria-label={t('done.stars', { n: stars })} data-testid="stelle">
        {[0, 1, 2].map((k) => (
          <motion.span key={k} initial={fx.on ? { scale: 0, rotate: -120 } : false} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7 + k * 0.28, type: 'spring', stiffness: 420, damping: 13 }} className={k === 1 ? '-translate-y-2' : ''}>
            <Star size={k === 1 ? 54 : 42} className={k < stars ? 'fill-sonne-500 text-sonne-600' : 'fill-tinte/10 text-tinte/15'} />
          </motion.span>
        ))}
      </div>
      <p className="text-lg font-semibold" data-testid="punteggio" aria-label={t('done.score', { score, total })}>
        <span className="font-display text-3xl font-extrabold text-minze-700"><CountUp to={score} on={fx.on} /></span> / {total}
      </p>
      {wrong === 0 ? <p className="font-bold text-minze-700">{t('done.perfect')}</p> : <p className="text-tinte/65">{t('done.mistakes', { n: wrong })}</p>}
      {children}
    </div>
  );
}

/** Ripasso: nur die gespeicherten Fehler dieses Kurses */
export function ReviewPage() {
  const { courseId } = useParams();
  const { t } = useT();
  const course = useCourse(courseId);
  const prog = useCourseProgress(courseId);
  const [run, setRun] = useState<Exercise[] | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const pending = useMemo(() => {
    if (!course.data) return [];
    const all = new Map(course.data.lessons.flatMap((l) => l.exercises.map((e) => [e.id, e] as const)));
    return Object.entries(prog.mistakes).sort((a, b) => a[1].at - b[1].at).map(([id]) => all.get(id)).filter((e): e is Exercise => !!e);
  }, [course.data, prog.mistakes]);
  const lessonOfMap = useMemo(() => new Map(course.data?.lessons.flatMap((l) => l.exercises.map((e) => [e.id, l.id] as const)) ?? []), [course.data]);

  if (course.missing) return <p data-testid="corso-mancante">{t('notfound')}</p>;
  if (course.error) return <LoadError />;
  if (!course.data) return <Loading />;
  const c = course.data;
  if (run) {
    return (
      <div data-testid="lf-ripasso-attivo">
        <Runner course={c} exercises={run} lessonOf={(id) => lessonOfMap.get(id) ?? ''} mode="review" onFinish={(score) => { setSolved(score); setRun(null); }} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4 text-center" data-testid="lf-ripasso" data-n={pending.length}>
      <h1 className="font-display text-2xl font-extrabold">{t('review.title')}</h1>
      <p className="text-sm text-tinte/60" lang={c.entry.source} dir={dirOf(c.entry.source)}>{c.tr.course.title}</p>
      {solved !== null && <ReviewDone n={solved} all={!pending.length} />}
      {pending.length ? (
        <>
          <Lino mood="denken" size={100} still />
          <p data-testid="ripasso-restanti">{t('review.left', { n: pending.length })}</p>
          <button type="button" className={bigButton('primary', 'w-full max-w-sm')} onClick={() => { setSolved(null); setRun(pending); }} data-testid="inizia-ripasso">{t('review.start')}</button>
        </>
      ) : (
        <>
          <Lino mood="jubel" size={100} still />
          <p data-testid="ripasso-vuoto">{t('review.empty')}</p>
        </>
      )}
    </div>
  );
}

function ReviewDone({ n, all }: { n: number; all: boolean }) {
  const { t } = useT();
  const fx = useFx();
  useEffect(() => { if (all) fx.win(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Confetti show={fx.on && all} count={40} />
      <motion.p initial={fx.on ? { scale: 0.8, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} className="rounded-xl bg-minze-50 px-3 py-2 font-semibold text-minze-700" data-testid="ripasso-finito">{t('review.done', { n })}</motion.p>
    </>
  );
}
