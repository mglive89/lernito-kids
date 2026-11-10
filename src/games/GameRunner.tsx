import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Check, Clock, Flame, Lightbulb, RotateCcw, Star, Target, X, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LearningModule, Task } from '../learning/types';
import { createRng } from '../lib/random';
import { speak, stopSpeaking } from '../lib/speech';
import { sfx } from '../lib/sound';
import { Lino } from '../components/Lino';
import { Confetti, Modal, ProgressBar, SpeakButton } from '../components/ui';
import { guideFor } from '../learning/guides';
import { GuideContent } from '../components/GuideContent';
import { Visual } from '../components/Visual';
import { TaskView } from './TaskView';
import { MULTI_STEP } from './types';
import { helpSteps, howTo } from './coach';
import { roundMessage, roundStars, type RoundResult } from '../learning/adaptive';
import type { RecordResult } from '../store/useApp';
import { L, getLang, tr } from '../i18n';

const LOB = { de: ['Super!', 'Klasse gemacht!', 'Toll!', 'Richtig!', 'Wunderbar!', 'Spitze!', 'Genau so!', 'Prima!'], it: ['Super!', 'Bravissimo!', 'Ottimo!', 'Giusto!', 'Fantastico!', 'Grande!', 'Proprio così!', 'Perfetto!'] };
const NOCHMAL = { de: ['Fast! Versuch es nochmal.', 'Hmm, schau noch einmal genau hin.', 'Nicht ganz – du schaffst das!', 'Probier es noch einmal!'], it: ['Quasi! Riprova.', 'Mmm, guarda ancora con attenzione.', 'Non proprio, ce la puoi fare!', 'Prova ancora una volta!'] };
const pickOf = (o: { de: string[]; it: string[] }) => { const a = o[getLang()]; return a[Math.floor(Math.random() * a.length)]!; };

interface Props {
  module: LearningModule;
  level: 1 | 2 | 3;
  speechOn: boolean;
  onFinish: (r: RoundResult) => RecordResult;
  /** Vorschau (Admin) – nichts wird gespeichert */
  preview?: boolean;
  backTo: string;
  /** 'check': Antwort wählen, dann „Prüfen“ (Schule). 'auto': sofort werten und weiter (Kita). */
  mode?: 'auto' | 'check';
  /** Name der Lektion im Lernpfad, z. B. „Lektion 2 · Üben“ */
  lessonLabel?: string;
  /** Puppy erklärt zu Beginn, wie die Aufgabe funktioniert (jüngere Kinder) */
  coachIntro?: boolean;
}

type Phase = 'answer' | 'correct' | 'reveal';
type Tone = 'ok' | 'hint' | 'help';

export function GameRunner({ module, level, speechOn, onFinish, preview, backTo, mode = 'auto', lessonLabel, coachIntro = false }: Props) {
  const nav = useNavigate();
  const [seed, setSeed] = useState(() => Date.now());
  const tasks = useMemo<Task[]>(() => {
    try { return module.generate(level, createRng(seed)); } catch (e) { console.error(e); return []; }
  }, [module, level, seed]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState<Phase>('answer');
  const [feedback, setFeedback] = useState<{ title: string; text?: string; tone: Tone } | null>(null);
  const stats = useRef({ firstTry: 0, solved: 0, hints: 0, start: Date.now() });
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<{ round: RoundResult; rec: RecordResult } | null>(null);
  const [revealHelp, setRevealHelp] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  // Puppy-Hilfe: -1 = zu, 0 = nur Anleitung (automatisch), 1… = Hilfe-Schritte
  const [coach, setCoach] = useState<{ text: string; step: number } | null>(null);
  const helped = useRef(false);
  useEffect(() => { setRevealHelp(false); setPending(null); setCoach(null); helped.current = false; }, [index, seed]);
  const check = mode === 'check';
  const hasGuide = !!guideFor(module.id) || !!module.cards;

  const task = tasks[index];
  const multi = task ? MULTI_STEP.includes(task.type) : false;
  const usesCheck = check && task?.type === 'choice';
  const onPending = useCallback((fn: (() => void) | null) => setPending(() => fn), []);
  const steps = useMemo(() => (task ? helpSteps(task, check) : []), [task, check]);

  // Jüngere Kinder: Puppy erklärt bei der ersten Aufgabe jeder Art, wie es geht
  const introduced = useRef(new Set<string>());
  useEffect(() => {
    if (!coachIntro || !task) return;
    const kind = task.visual?.kind === 'robot' || task.visual?.kind === 'code' ? task.visual.kind : task.type;
    if (introduced.current.has(kind)) return;
    introduced.current.add(kind);
    setCoach({ text: howTo(task, check), step: 0 });
  }, [task, coachIntro, check]);

  const askPuppy = () => {
    if (!task || phase !== 'answer') return;
    sfx.help();
    const nextStep = Math.min((coach?.step ?? 0) + 1, steps.length);
    if (!helped.current) { helped.current = true; stats.current.hints++; }
    const text = steps[nextStep - 1] ?? task.hint;
    setCoach({ text, step: nextStep });
    if (speechOn) speak(text);
  };

  useEffect(() => {
    if (!task || !speechOn) return;
    const t = setTimeout(() => speak(task.speak ?? task.prompt), 350);
    return () => clearTimeout(t);
  }, [task, speechOn]);
  useEffect(() => () => stopSpeaking(), []);

  const next = useCallback(() => {
    stopSpeaking();
    setFeedback(null);
    setAttempts(0);
    setPhase('answer');
    if (index + 1 < tasks.length) {
      sfx.whoosh();
      setIndex((i) => i + 1);
    } else {
      const round: RoundResult = {
        moduleId: module.id, total: tasks.length, firstTry: stats.current.firstTry, solved: stats.current.solved,
        hintsUsed: stats.current.hints, durationSec: Math.round((Date.now() - stats.current.start) / 1000)
      };
      const rec = onFinish(round);
      sfx.win();
      if (rec.levelAfter > rec.levelBefore) setTimeout(() => sfx.levelUp(), 1100);
      else if (rec.badges.length) setTimeout(() => sfx.unlock(), 1100);
      setResult({ round, rec });
      if (speechOn) speak(L(`Geschafft! Du hast ${rec.stars} Sterne gesammelt.`, `Fatto! Hai raccolto ${rec.stars} stelle.`));
    }
  }, [index, tasks.length, module.id, onFinish, speechOn]);

  const onCorrect = useCallback(() => {
    if (phase !== 'answer') return;
    const first = attempts === 0 && !helped.current;
    if (first) { stats.current.firstTry++; setStreak((x) => { if (x + 1 >= 3) sfx.streak(); return x + 1; }); }
    else setStreak(0);
    stats.current.solved++;
    sfx.correct();
    setCoach(null);
    const text = pickOf(LOB);
    setFeedback({ title: text, tone: 'ok' });
    if (speechOn) speak(text);
    setPhase('correct');
  }, [phase, attempts, speechOn]);

  const onWrong = useCallback(() => {
    if (phase !== 'answer' || !task) return;
    sfx.tryAgain();
    setStreak(0);
    setCoach(null);
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) {
      stats.current.hints++;
      const title = pickOf(NOCHMAL);
      setFeedback({ title, text: task.hint, tone: 'hint' });
      if (speechOn) speak(`${title} ${task.hint}`);
    } else if (n >= 2) {
      if (multi) {
        // Bei mehrschrittigen Aufgaben zeigen wir die Hilfe, das Kind macht selbst weiter.
        setFeedback({ title: L('Ich helfe dir:', 'Ti aiuto io:'), text: task.explain[0] ?? task.hint, tone: 'hint' });
        setRevealHelp(true);
      } else {
        setFeedback({ title: L('Schau mal, so geht es:', 'Guarda, si fa così:'), tone: 'help' });
        if (speechOn) speak(`${L('Schau mal, so geht es.', 'Guarda, si fa così.')} ${task.explain.join(' ')}`);
        setPhase('reveal');
      }
    }
  }, [phase, task, attempts, speechOn, multi]);

  // Kita: automatisch weiter nach richtiger Antwort. Schule: mit „Weiter“.
  useEffect(() => {
    if (phase !== 'correct' || check) return;
    const t = setTimeout(next, 1400);
    return () => clearTimeout(t);
  }, [phase, next, check]);

  // Enter: prüfen bzw. weiter
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || guideOpen) return;
      if (phase === 'answer' && pending) { e.preventDefault(); pending(); }
      else if (phase !== 'answer' && (check || phase === 'reveal')) { e.preventDefault(); next(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, pending, check, next, guideOpen]);

  const restart = () => {
    stats.current = { firstTry: 0, solved: 0, hints: 0, start: Date.now() };
    setResult(null); setIndex(0); setAttempts(0); setPhase('answer'); setFeedback(null); setStreak(0); setSeed(Date.now());
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 p-10 text-center">
        <Lino mood="denken" />
        <p className="text-xl">{L('Für diese Übung gibt es gerade keine Aufgaben.', 'Al momento non ci sono esercizi per questa attività.')}</p>
        <button className="knopf bg-sonne-500" onClick={() => nav(backTo)}>{L('Zurück', 'Indietro')}</button>
      </div>
    );
  }

  if (result) return <Summary module={module} result={result} onAgain={restart} onBack={() => nav(backTo)} preview={preview} lessonLabel={lessonLabel} />;
  if (!task) return null;

  const tone: Tone | 'idle' = feedback?.tone ?? 'idle';
  const barBg = { idle: 'bg-white', ok: 'bg-minze-50', hint: 'bg-koralle-50', help: 'bg-sonne-50' }[tone];
  const showNext = phase === 'reveal' || (phase === 'correct' && check);

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
        <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-tinte/60 transition hover:bg-tinte/5 hover:text-tinte" onClick={() => { stopSpeaking(); nav(backTo); }} aria-label={L('Lektion beenden', 'Esci dalla lezione')}>
          <X size={26} />
        </button>
        <div className="flex-1">
          <ProgressBar value={(index + (phase === 'answer' ? 0 : 1)) / tasks.length} label={L(`Aufgabe ${index + 1} von ${tasks.length}`, `Esercizio ${index + 1} di ${tasks.length}`)} />
        </div>
        <span className="min-w-[2.5rem] text-right font-display text-base font-bold text-tinte/60" aria-hidden>{index + 1}/{tasks.length}</span>
        <button className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-sonne-100 pl-1 pr-3 text-sm font-bold text-sonne-700 transition hover:bg-sonne-300/60 disabled:opacity-40" onClick={askPuppy} disabled={phase !== 'answer'}
          aria-label={L('Puppy um Hilfe bitten', 'Chiedi aiuto a Puppy')} data-testid="puppy-hilfe">
          <img src={`${import.meta.env.BASE_URL}puppy/kopf.png`} alt="" className="h-9 w-9" /> <span className="hidden sm:inline">{L('Hilfe', 'Aiuto')}</span>
        </button>
        {hasGuide && (
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-himmel-50 text-himmel-700 transition hover:bg-himmel-100" onClick={() => setGuideOpen(true)} aria-label={L('Theorie zum Thema öffnen', 'Apri la teoria')} data-testid="theorie-oeffnen">
            <BookOpen size={22} />
          </button>
        )}
        {preview && <span className="rounded-full bg-lila-100 px-3 py-1 text-sm font-bold">{L('Vorschau', 'Anteprima')}</span>}
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-5 px-4 pb-48 pt-2 sm:gap-6" data-testid="task-area" data-index={index} data-phase={phase}>
        <AnimatePresence mode="wait">
          <motion.div key={task.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex w-full flex-col items-center gap-5 sm:gap-6">
            {lessonLabel && index === 0 && phase === 'answer' && <span className="eyebrow self-start text-himmel-700">{lessonLabel}</span>}
            <div className="flex w-full items-center gap-3">
              <SpeakButton text={task.speak ?? task.prompt} />
              <h1 className="flex-1 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl" data-testid="task-prompt">{task.prompt}</h1>
              {task.sound && <SoundButton sound={task.sound} />}
            </div>
            <AnimatePresence>
              {coach && phase === 'answer' && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
                  className="flex w-full items-end gap-2" data-testid="puppy-tipp" role="note" aria-live="polite">
                  <Lino mood={coach.step === 0 ? 'winken' : 'denken'} size={64} />
                  <div className="relative mb-2 flex-1 rounded-2xl rounded-bl-md bg-sonne-50 px-4 py-3 text-base leading-relaxed ring-1 ring-sonne-300 sm:text-lg">
                    <p className="mb-0.5 text-xs font-extrabold uppercase tracking-wider text-sonne-700">
                      {coach.step === 0 ? L('So geht’s', 'Come si fa') : L(`Puppy hilft · ${coach.step}/${steps.length}`, `Puppy ti aiuta · ${coach.step}/${steps.length}`)}
                    </p>
                    {coach.text}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {coach.step < steps.length && (
                        <button type="button" className="rounded-full bg-white px-3 py-1 text-sm font-bold text-sonne-700 ring-1 ring-sonne-300 hover:bg-sonne-100" onClick={askPuppy} data-testid="puppy-mehr">
                          {coach.step === 0 ? L('Gib mir einen Tipp', 'Dammi un suggerimento') : L('Noch ein Schritt', 'Un altro passo')}
                        </button>
                      )}
                      <button type="button" className="rounded-full px-3 py-1 text-sm font-bold text-tinte/55 hover:bg-white" onClick={() => { stopSpeaking(); setCoach(null); }} data-testid="puppy-ok">
                        {L('Alles klar!', 'Ho capito!')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {task.visual && <Visual v={task.visual} />}
            <TaskView task={task} onCorrect={onCorrect} onWrong={onWrong} reveal={phase === 'reveal' || revealHelp} done={phase !== 'answer'} onPending={usesCheck ? onPending : undefined} />
            {phase === 'reveal' && (
              <motion.ol initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="karte w-full list-decimal space-y-2 py-4 pl-10 pr-5 text-lg sm:text-xl" aria-label={L('Erklärung Schritt für Schritt', 'Spiegazione passo per passo')}>
                {task.explain.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.6 }}>{s}</motion.li>
                ))}
              </motion.ol>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {(feedback || usesCheck) && (
        <div className={`fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] ${barBg} transition-colors`} style={{ paddingBottom: 'var(--safe-bottom)' }}>
          <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-5 sm:py-5">
            <div className="flex flex-1 sm:min-h-[3.5rem] items-center gap-3" role="status" aria-live="assertive" data-testid="feedback">
              {feedback && (
                <>
                  <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative shrink-0" aria-hidden>
                    <Lino mood={tone === 'ok' ? 'jubel' : 'denken'} size={52} still={tone !== 'ok'} />
                    <span className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white ring-2 ring-white ${tone === 'ok' ? 'bg-minze-500' : tone === 'hint' ? 'bg-koralle-500' : 'bg-sonne-500'}`}>
                      {tone === 'ok' ? <Check size={15} strokeWidth={3.5} /> : tone === 'hint' ? <Lightbulb size={14} /> : <BookOpen size={13} />}
                    </span>
                  </motion.span>
                  <div className="min-w-0">
                    <p className={`font-display text-xl font-bold ${tone === 'ok' ? 'text-minze-700' : tone === 'hint' ? 'text-koralle-700' : 'text-sonne-700'}`}>
                      {feedback.title}
                      {tone === 'ok' && streak >= 3 && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-sm text-sonne-700 shadow-weich"><Flame size={14} /> {L(`${streak} in Folge`, `${streak} di fila`)}</span>}
                    </p>
                    {feedback.text && <p className="text-base text-tinte/80 sm:text-lg">{feedback.text}</p>}
                  </div>
                </>
              )}
              {!feedback && !coach && <span className="hidden sm:block"><Lino mood="ruhig" size={56} still /></span>}
            </div>
            {showNext ? (
              <button className={`knopf w-full text-white sm:w-48 ${tone === 'ok' ? 'kante-minze bg-minze-500' : 'kante-himmel bg-himmel-500'}`} onClick={next} data-testid="weiter" autoFocus>
                {L('Weiter', 'Avanti')} <ArrowRight />
              </button>
            ) : usesCheck && phase === 'answer' ? (
              <button className="knopf kante-himmel w-full bg-himmel-500 text-white disabled:bg-tinte/10 disabled:text-tinte/40 disabled:shadow-none sm:w-48" disabled={!pending} onClick={() => pending?.()} data-testid="pruefen">
                {L('Prüfen', 'Controlla')}
              </button>
            ) : null}
          </div>
        </div>
      )}
      <Confetti show={phase === 'correct' && !check} count={18} />
      {hasGuide && (
        <Modal open={guideOpen} onClose={() => setGuideOpen(false)} title={tr(module.title)} labelledBy="theorie-titel">
          <GuideContent module={module} compact />
        </Modal>
      )}
    </div>
  );
}

function SoundButton({ sound }: { sound: string }) {
  return (
    <button type="button" className="knopf h-12 shrink-0 bg-minze-300 px-3 text-base" onClick={() => speak(sound, { force: true, pitch: 1.4, rate: 0.85 })} aria-label={L('Tiergeräusch abspielen (gesprochen)', 'Ascolta il verso (letto ad alta voce)')}>
      🔊 {L('Geräusch', 'Verso')}
    </button>
  );
}

function Summary({ module, result, onAgain, onBack, preview, lessonLabel }: { module: LearningModule; result: { round: RoundResult; rec: RecordResult }; onAgain: () => void; onBack: () => void; preview?: boolean; lessonLabel?: string }) {
  const { round, rec } = result;
  const rs = roundStars(round);
  const change = (rec.difficultyAfter - rec.difficultyBefore) as -1 | 0 | 1;
  const acc = round.total ? Math.round((round.firstTry / round.total) * 100) : 0;
  const mins = Math.floor(round.durationSec / 60);
  const secs = String(round.durationSec % 60).padStart(2, '0');
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-5 px-4 py-10 text-center" data-testid="summary">
      <Confetti show />
      <Lino mood="jubel" size={150} />
      <div>
        {lessonLabel && <p className="eyebrow text-himmel-700">{lessonLabel}</p>}
        <h1 className="font-display text-4xl font-bold tracking-tight">{L('Geschafft!', 'Fatto!')}</h1>
        <p className="mt-1 text-lg text-tinte/70">{tr(module.title)}</p>
      </div>
      <div className="flex gap-2" aria-label={L(`${rs} von 3 Sternen`, `${rs} stelle su 3`)}>
        {[1, 2, 3].map((i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 * i, type: 'spring' }}>
            <Star size={56} className={i <= rs ? 'fill-sonne-500 text-sonne-500' : 'text-tinte/15'} />
          </motion.span>
        ))}
      </div>
      <div className="grid w-full grid-cols-3 gap-3">
        <Stat icon={<Zap size={18} />} tone="text-sonne-700 bg-sonne-50" value={`+${rec.xp}`} label="XP" testId="xp-earned" />
        <Stat icon={<Target size={18} />} tone="text-minze-700 bg-minze-50" value={`${acc} %`} label={L('Genauigkeit', 'Precisione')} />
        <Stat icon={<Clock size={18} />} tone="text-himmel-700 bg-himmel-50" value={`${mins}:${secs}`} label={L('Zeit', 'Tempo')} />
      </div>
      <p className="w-full rounded-2xl bg-white px-5 py-4 text-lg shadow-weich ring-1 ring-tinte/5">{roundMessage(round, change)}</p>
      <p className="text-tinte/60"><span data-testid="stars-earned" className="font-bold text-tinte">+{rec.stars}</span> {L('Sterne', 'stelle')} · {round.solved}/{round.total} {L('gelöst', 'risolti')}</p>
      {rec.levelAfter > rec.levelBefore && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full rounded-2xl bg-lila-100 p-4 font-display text-xl font-bold">
          🎉 {L(`Neues Level: ${rec.levelAfter}! Schau mal bei deinem Avatar vorbei.`, `Nuovo livello: ${rec.levelAfter}! Passa dal tuo avatar.`)}
        </motion.div>
      )}
      {rec.badges.length > 0 && (
        <div className="w-full rounded-2xl bg-sonne-100 p-4">
          <h2 className="mb-2 font-display text-xl font-bold">{L('Neues Abzeichen!', 'Nuovo distintivo!')}</h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {rec.badges.map((b) => <li key={b.id} className="flex items-center gap-2 rounded-full bg-white px-4 py-2"><span className="emoji text-2xl">{b.emoji}</span>{tr(b.title)}</li>)}
          </ul>
        </div>
      )}
      {preview && <p className="text-tinte/60">{L('Vorschau-Modus: Es wurde nichts gespeichert.', 'Modalità anteprima: non è stato salvato nulla.')}</p>}
      <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
        <button className="knopf flex-1 bg-white" onClick={onAgain} data-testid="nochmal"><RotateCcw /> {L('Nochmal', 'Ancora')}</button>
        <button className="knopf flex-1 bg-himmel-500 text-white" onClick={onBack} data-testid="zurueck" autoFocus>{L('Weiter', 'Continua')} <ArrowRight /></button>
      </div>
    </main>
  );
}

function Stat({ icon, value, label, tone, testId }: { icon: ReactNode; value: string; label: string; tone: string; testId?: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-weich ring-1 ring-tinte/5">
      <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${tone}`}>{icon}</div>
      <div className="font-display text-2xl font-bold" data-testid={testId}>{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-tinte/55">{label}</div>
    </div>
  );
}
