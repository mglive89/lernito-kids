import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { WordBuildTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { speak } from '../lib/speech';
import { sfx } from '../lib/sound';

export function WordBuildView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<WordBuildTask>) {
  const [placed, setPlaced] = useState<(number | null)[]>(() => task.solution.map(() => null));
  const [shake, setShake] = useState(0);
  useEffect(() => setPlaced(task.solution.map(() => null)), [task.id, task.solution]);

  const usedIdx = placed.filter((p): p is number => p !== null);
  const tapTile = (idx: number) => {
    if (done || usedIdx.includes(idx)) return;
    sfx.tap();
    speak(task.tiles[idx]!.toLowerCase());
    const slot = placed.indexOf(null);
    if (slot < 0) return;
    const next = [...placed];
    next[slot] = idx;
    setPlaced(next);
    if (!next.includes(null)) {
      const word = next.map((i) => task.tiles[i!]!);
      if (word.join('') === task.solution.join('')) onCorrect();
      else {
        onWrong();
        setShake((s) => s + 1);
        // Richtige Anfangsbausteine behalten, Rest zurücklegen
        const keep = next.map((i, k) => (task.tiles[i!] === task.solution[k] ? i : null));
        const firstWrong = keep.indexOf(null);
        setTimeout(() => setPlaced(keep.map((v, k) => (k < firstWrong ? v : null))), 500);
      }
    }
  };
  const tapSlot = (k: number) => {
    if (done || placed[k] === null) return;
    const next = [...placed];
    for (let j = k; j < next.length; j++) next[j] = null;
    setPlaced(next);
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} className="flex flex-wrap justify-center gap-2" aria-label="Dein Wort" aria-live="polite">
        {task.solution.map((s, k) => {
          const tileIdx = placed[k];
          const content = tileIdx !== null && tileIdx !== undefined ? task.tiles[tileIdx] : reveal ? s : '';
          return (
            <button
              key={k}
              type="button"
              onClick={() => tapSlot(k)}
              data-testid={`slot-${k}`}
              className={`flex h-16 min-w-[4rem] items-center justify-center rounded-2xl border-4 border-dashed px-3 font-display text-4xl font-bold sm:h-20 sm:min-w-[5rem] ${tileIdx !== null ? 'border-solid border-minze-500 bg-white' : reveal ? 'border-sonne-500 text-tinte/30' : 'border-tinte/25 bg-white/60'}`}
              aria-label={content ? `Platz ${k + 1}: ${content}` : `Platz ${k + 1}: leer`}
            >
              {content}
            </button>
          );
        })}
      </motion.div>
      <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Bausteine">
        {task.tiles.map((t, i) => (
          <motion.button
            key={i}
            type="button"
            data-testid={`tile-${t}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => tapTile(i)}
            disabled={usedIdx.includes(i) || done}
            className={`knopf h-16 min-w-[4rem] bg-sonne-300 font-display text-3xl sm:h-20 sm:min-w-[5rem] sm:text-4xl ${usedIdx.includes(i) ? 'invisible' : ''}`}
          >
            {t}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
