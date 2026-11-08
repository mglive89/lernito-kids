import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lightbulb, RotateCcw, Star, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LearningModule, Task } from '../learning/types';
import { createRng } from '../lib/random';
import { speak, stopSpeaking } from '../lib/speech';
import { sfx } from '../lib/sound';
import { Lino, type LinoMood } from '../components/Lino';
import { Confetti, ProgressBar, SpeakButton } from '../components/ui';
import { Visual } from '../components/Visual';
import { TaskView } from './TaskView';
import { MULTI_STEP } from './types';
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
}

type Phase = 'answer' | 'correct' | 'reveal';

export function GameRunner({ module, level, speechOn, onFinish, preview, backTo }: Props) {
  const nav = useNavigate();
  const [seed, setSeed] = useState(() => Date.now());
  const tasks = useMemo<Task[]>(() => {
    try { return module.generate(level, createRng(seed)); } catch (e) { console.error(e); return []; }
  }, [module, level, seed]);
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState<Phase>('answer');
  const [feedback, setFeedback] = useState<{ text: string; mood: LinoMood } | null>(null);
  const stats = useRef({ firstTry: 0, solved: 0, hints: 0, start: Date.now() });
  const [result, setResult] = useState<{ round: RoundResult; rec: RecordResult } | null>(null);
  const [revealHelp, setRevealHelp] = useState(false);
  useEffect(() => setRevealHelp(false), [index, seed]);

  const task = tasks[index];
  const multi = task ? MULTI_STEP.includes(task.type) : false;

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
      setIndex((i) => i + 1);
    } else {
      const round: RoundResult = {
        moduleId: module.id, total: tasks.length, firstTry: stats.current.firstTry, solved: stats.current.solved,
        hintsUsed: stats.current.hints, durationSec: Math.round((Date.now() - stats.current.start) / 1000)
      };
      const rec = onFinish(round);
      sfx.win();
      setResult({ round, rec });
      if (speechOn) speak(L(`Geschafft! Du hast ${rec.stars} Sterne gesammelt.`, `Fatto! Hai raccolto ${rec.stars} stelle.`));
    }
  }, [index, tasks.length, module.id, onFinish, speechOn]);

  const onCorrect = useCallback(() => {
    if (phase !== 'answer') return;
    if (attempts === 0) stats.current.firstTry++;
    stats.current.solved++;
    sfx.correct();
    const text = pickOf(LOB);
    setFeedback({ text, mood: 'jubel' });
    if (speechOn) speak(text);
    setPhase('correct');
  }, [phase, attempts, speechOn]);

  const onWrong = useCallback(() => {
    if (phase !== 'answer' || !task) return;
    sfx.tryAgain();
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) {
      stats.current.hints++;
      const text = `${pickOf(NOCHMAL)} ${task.hint}`;
      setFeedback({ text, mood: 'denken' });
      if (speechOn) speak(text);
    } else if (n >= 2) {
      if (multi) {
        // Bei mehrschrittigen Aufgaben zeigen wir die Hilfe, das Kind macht selbst weiter.
        setFeedback({ text: `${L('Ich helfe dir:', 'Ti aiuto io:')} ${task.explain[0] ?? task.hint}`, mood: 'denken' });
        setRevealHelp(true);
      } else {
        setFeedback({ text: L('Schau mal, so geht es:', 'Guarda, si fa così:'), mood: 'ruhig' });
        if (speechOn) speak(`${L('Schau mal, so geht es.', 'Guarda, si fa così.')} ${task.explain.join(' ')}`);
        setPhase('reveal');
      }
    }
  }, [phase, task, attempts, speechOn, multi]);


  // Automatisch weiter nach richtiger Antwort
  useEffect(() => {
    if (phase !== 'correct') return;
    const t = setTimeout(next, 1400);
    return () => clearTimeout(t);
  }, [phase, next]);

  const restart = () => {
    stats.current = { firstTry: 0, solved: 0, hints: 0, start: Date.now() };
    setResult(null); setIndex(0); setAttempts(0); setPhase('answer'); setFeedback(null); setSeed(Date.now());
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

  if (result) return <Summary module={module} result={result} onAgain={restart} onBack={() => nav(backTo)} preview={preview} />;
  if (!task) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3">
        <button className="knopf h-12 w-12 shrink-0 bg-white px-0" onClick={() => { stopSpeaking(); nav(backTo); }} aria-label={L('Spiel beenden', 'Esci dal gioco')}>
          <X size={24} />
        </button>
        <div className="flex-1">
          <ProgressBar value={(index + (phase === 'answer' ? 0 : 1)) / tasks.length} label={L(`Aufgabe ${index + 1} von ${tasks.length}`, `Esercizio ${index + 1} di ${tasks.length}`)} />
        </div>
        <span className="font-display text-lg font-bold" aria-hidden>{index + 1}/{tasks.length}</span>
        {preview && <span className="rounded-full bg-lila-100 px-3 py-1 text-sm font-bold">{L('Vorschau', 'Anteprima')}</span>}
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-5 px-4 pb-40 pt-2 sm:gap-6" data-testid="task-area" data-index={index} data-phase={phase}>
        <AnimatePresence mode="wait">
          <motion.div key={task.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex w-full flex-col items-center gap-5 sm:gap-6">
            <div className="flex w-full max-w-3xl items-center gap-3">
              <SpeakButton text={task.speak ?? task.prompt} />
              <h1 className="flex-1 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl" data-testid="task-prompt">{task.prompt}</h1>
              {task.sound && <SoundButton sound={task.sound} />}
            </div>
            {task.visual && <Visual v={task.visual} />}
            <TaskView task={task} onCorrect={onCorrect} onWrong={onWrong} reveal={phase === 'reveal' || revealHelp} done={phase !== 'answer'} />
            {phase === 'reveal' && (
              <motion.ol initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="karte w-full max-w-2xl list-decimal space-y-2 py-4 pl-10 pr-5 text-lg sm:text-xl" aria-label={L('Erklärung Schritt für Schritt', 'Spiegazione passo per passo')}>
                {task.explain.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.6 }}>{s}</motion.li>
                ))}
              </motion.ol>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }}
              className={`mx-auto flex max-w-5xl items-end gap-3 rounded-t-[2rem] px-4 pb-3 pt-2 shadow-karte ${feedback.mood === 'jubel' ? 'bg-minze-100' : 'bg-sonne-100'} ring-1 ring-tinte/5`}
              role="status" aria-live="assertive" data-testid="feedback"
            >
              <Lino mood={feedback.mood} size={72} />
              <p className="mb-3 flex-1 font-display text-lg font-semibold sm:text-xl">
                {feedback.mood === 'denken' && <Lightbulb className="mr-1 inline text-sonne-700" size={22} aria-hidden />}
                {feedback.text}
              </p>
              {phase === 'reveal' && (
                <button className="knopf mb-3 bg-himmel-500 text-white" onClick={next} data-testid="weiter">
                  {L('Weiter', 'Avanti')} <ArrowRight />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Confetti show={phase === 'correct'} count={18} />
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

function Summary({ module, result, onAgain, onBack, preview }: { module: LearningModule; result: { round: RoundResult; rec: RecordResult }; onAgain: () => void; onBack: () => void; preview?: boolean }) {
  const { round, rec } = result;
  const rs = roundStars(round);
  const change = (rec.difficultyAfter - rec.difficultyBefore) as -1 | 0 | 1;
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center gap-5 px-4 py-10 text-center" data-testid="summary">
      <Confetti show />
      <Lino mood="jubel" size={150} />
      <h1 className="font-display text-4xl font-bold tracking-tight">{L('Geschafft!', 'Fatto!')}</h1>
      <p className="text-xl text-tinte/80">{tr(module.title)}</p>
      <div className="flex gap-2" aria-label={L(`${rs} von 3 Sternen`, `${rs} stelle su 3`)}>
        {[1, 2, 3].map((i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3 * i, type: 'spring' }}>
            <Star size={64} className={i <= rs ? 'fill-sonne-500 text-sonne-500' : 'text-tinte/20'} />
          </motion.span>
        ))}
      </div>
      <p className="karte px-6 py-4 font-display text-xl">{roundMessage(round, change)}</p>
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="karte p-4"><div className="font-display text-3xl font-bold" data-testid="stars-earned">+{rec.stars}</div><div>{L('Sterne', 'Stelle')}</div></div>
        <div className="karte p-4"><div className="font-display text-3xl font-bold">{round.solved}/{round.total}</div><div>{L('Aufgaben gelöst', 'Esercizi risolti')}</div></div>
      </div>
      {rec.levelAfter > rec.levelBefore && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full rounded-3xl bg-lila-100 p-4 font-display text-xl font-bold">
          🎉 {L(`Neues Level: ${rec.levelAfter}! Schau mal bei deinem Avatar vorbei.`, `Nuovo livello: ${rec.levelAfter}! Passa dal tuo avatar.`)}
        </motion.div>
      )}
      {rec.badges.length > 0 && (
        <div className="w-full rounded-3xl bg-sonne-100 p-4">
          <h2 className="mb-2 font-display text-xl font-bold">{L('Neues Abzeichen!', 'Nuovo distintivo!')}</h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {rec.badges.map((b) => <li key={b.id} className="flex items-center gap-2 rounded-full bg-white px-4 py-2"><span className="emoji text-2xl">{b.emoji}</span>{tr(b.title)}</li>)}
          </ul>
        </div>
      )}
      {preview && <p className="text-tinte/60">{L('Vorschau-Modus: Es wurde nichts gespeichert.', 'Modalità anteprima: non è stato salvato nulla.')}</p>}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <button className="knopf flex-1 bg-sonne-500" onClick={onAgain} data-testid="nochmal"><RotateCcw /> {L('Nochmal spielen', 'Gioca ancora')}</button>
        <button className="knopf flex-1 bg-white" onClick={onBack} data-testid="zurueck">{L('Weiter lernen', 'Continua a imparare')} <ArrowRight /></button>
      </div>
    </main>
  );
}
