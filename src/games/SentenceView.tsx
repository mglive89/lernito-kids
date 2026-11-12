import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { SentenceTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { speak } from '../lib/speech';
import { sfx } from '../lib/sound';
import { normalize } from '../lib/voiceMatch';
import { L } from '../i18n';

const same = (a: string, b: string) => normalize(a) === normalize(b);

/** Satz aus Wortkärtchen bauen: Wörter antippen, oben erscheint der Satz. */
export function SentenceView({ task, onCorrect, onWrong, reveal, done, onPending }: TaskViewProps<SentenceTask>) {
  const [picked, setPicked] = useState<number[]>([]);
  const [shake, setShake] = useState(0);
  useEffect(() => setPicked([]), [task.id]);

  const evaluate = (p: number[]) => {
    const said = p.map((i) => task.tiles[i]!);
    if (said.length === task.words.length && said.every((w, k) => same(w, task.words[k]!))) { onCorrect(); return; }
    onWrong();
    setShake((s) => s + 1);
    // Richtigen Anfang behalten
    let keep = 0;
    while (keep < said.length && keep < task.words.length && same(said[keep]!, task.words[keep]!)) keep++;
    setTimeout(() => setPicked(p.slice(0, keep)), 450);
  };

  // Prüfen-Modus: Prüfen-Knopf aktiv, sobald Wörter gewählt sind
  useEffect(() => {
    if (!onPending) return;
    if (!picked.length || done) { onPending(null); return; }
    const p = picked;
    onPending(() => evaluate(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, done, onPending]);

  const tap = (i: number) => {
    if (done || picked.includes(i)) return;
    sfx.tap();
    speak(task.tiles[i]!, { force: true, lang: task.lang, rate: 0.9, pitch: 1 });
    const next = [...picked, i];
    setPicked(next);
    // Ohne Prüfen-Knopf (Kindergarten) automatisch prüfen, wenn genug Wörter liegen
    if (!onPending && next.length === task.words.length) evaluate(next);
  };
  const untap = (k: number) => {
    if (done) return;
    sfx.tap();
    setPicked((p) => p.filter((_, j) => j !== k));
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6" lang={task.lang}>
      <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        className={`flex min-h-[7.5rem] w-full flex-wrap content-start gap-2 border-b-2 border-t-2 py-3 ${done ? 'border-minze-300' : 'border-tinte/10'}`}
        aria-label={L('Dein Satz', 'La tua frase')} aria-live="polite" data-testid="satz-antwort">
        {picked.map((i, k) => (
          <motion.button key={`${i}-${k}`} layout type="button" onClick={() => untap(k)} data-testid={`antwort-${k}`}
            className={`knopf h-12 px-4 text-lg font-semibold sm:text-xl ${done ? 'bg-minze-50 text-minze-700 ring-2 ring-minze-300' : 'bg-flaeche'}`}>
            {task.tiles[i]}
          </motion.button>
        ))}
      </motion.div>
      {reveal && !done && (
        <p className="w-full rounded-2xl bg-sonne-50 px-4 py-3 text-center text-lg ring-1 ring-sonne-300" data-testid="satz-loesung">{task.words.join(' ')}</p>
      )}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={L('Wörter', 'Parole')}>
        {task.tiles.map((t, i) => {
          const used = picked.includes(i);
          return (
            <button key={i} type="button" onClick={() => tap(i)} disabled={used || done} data-testid={`wort-${t}`}
              className={`knopf h-12 px-4 text-lg font-semibold sm:text-xl ${used ? 'bg-tinte/[0.06] text-transparent shadow-none' : 'bg-flaeche'}`}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
