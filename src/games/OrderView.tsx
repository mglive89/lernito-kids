import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { OrderTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';

export function OrderView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<OrderTask>) {
  const [picked, setPicked] = useState<string[]>([]);
  const [shakeId, setShakeId] = useState<string | null>(null);
  useEffect(() => setPicked([]), [task.id]);
  const nextId = task.correctOrder[picked.length];

  const tap = (id: string) => {
    if (done || picked.includes(id)) return;
    const label = task.items.find((i) => i.id === id)?.label ?? id;
    if (id === nextId) {
      sfx.pop();
      speak(label);
      const next = [...picked, id];
      setPicked(next);
      if (next.length === task.correctOrder.length) onCorrect();
    } else {
      setShakeId(id);
      setTimeout(() => setShakeId(null), 500);
      onWrong();
    }
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <ol className="flex min-h-[5rem] flex-wrap justify-center gap-2 rounded-3xl bg-white/70 p-3" aria-label="Deine Reihenfolge">
        {task.correctOrder.map((_, k) => (
          <li key={k} className={`flex h-16 min-w-[4.5rem] items-center justify-center rounded-2xl border-4 px-3 font-display text-2xl font-bold sm:text-3xl ${picked[k] ? 'border-minze-500 bg-minze-100' : 'border-dashed border-tinte/20'}`}>
            {picked[k] ? task.items.find((i) => i.id === picked[k])?.label : ''}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap justify-center gap-3" role="group" aria-label="Zum Antippen">
        {task.items.map((it) => (
          <motion.button
            key={it.id}
            type="button"
            data-testid={`order-${it.id}`}
            onClick={() => tap(it.id)}
            disabled={picked.includes(it.id) || done}
            animate={shakeId === it.id ? { x: [0, -10, 10, -6, 6, 0] } : {}}
            whileTap={{ scale: 0.9 }}
            className={`knopf h-20 min-w-[5rem] bg-himmel-300 px-4 font-display text-3xl ${picked.includes(it.id) ? 'invisible' : ''} ${reveal && it.id === nextId ? 'animate-bounce ring-8 ring-sonne-500' : ''}`}
          >
            {it.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
