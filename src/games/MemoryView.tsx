import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { MemoryTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { shuffle, createRng } from '../lib/random';
import { sfx } from '../lib/sound';
import { L } from '../i18n';

interface Card { key: string; pair: string; face: string }

export function MemoryView({ task, onCorrect, done }: TaskViewProps<MemoryTask>) {
  const cards = useMemo<Card[]>(() => shuffle(createRng(), task.pairs.flatMap((p) => [{ key: `${p.id}-a`, pair: p.id, face: p.a }, { key: `${p.id}-b`, pair: p.id, face: p.b }])), [task]);
  const [open, setOpen] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setOpen([]); setFound([]); }, [task.id]);

  const flip = (c: Card) => {
    if (busy || done || open.includes(c.key) || found.includes(c.pair)) return;
    sfx.flip();
    const next = [...open, c.key];
    setOpen(next);
    if (next.length === 2) {
      const [a, b] = next.map((k) => cards.find((x) => x.key === k)!);
      if (a!.pair === b!.pair) {
        sfx.correct();
        const f = [...found, a!.pair];
        setFound(f);
        setOpen([]);
        if (f.length === task.pairs.length) setTimeout(onCorrect, 400);
      } else {
        setBusy(true);
        setTimeout(() => { setOpen([]); setBusy(false); }, 900);
      }
    }
  };

  const cols = cards.length <= 6 ? 'grid-cols-3' : cards.length <= 8 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-6';
  return (
    <div className={`grid w-full max-w-2xl gap-3 ${cols}`} aria-label={L(`Memory mit ${task.pairs.length} Paaren, ${found.length} gefunden`, `Memory con ${task.pairs.length} coppie, ${found.length} trovate`)}>
      {cards.map((c) => {
        const visible = open.includes(c.key) || found.includes(c.pair);
        return (
          <motion.button
            key={c.key}
            type="button"
            data-testid={`card-${c.pair}`}
            onClick={() => flip(c)}
            className={`knopf aspect-square p-0 ${c.face.length > 3 ? 'p-1.5 text-sm font-bold leading-tight sm:text-lg' : 'text-5xl sm:text-6xl'} ${found.includes(c.pair) ? 'bg-minze-100 ring-4 ring-minze-500' : visible ? 'bg-flaeche' : 'bg-lila-500'}`}
            animate={{ rotateY: visible ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            aria-label={visible ? c.face : L('Verdeckte Karte', 'Carta coperta')}
          >
            <span className={visible && c.face.length > 3 ? 'break-words hyphens-auto' : 'emoji text-5xl sm:text-6xl'} style={{ transform: visible ? undefined : 'rotateY(180deg)' }}>{visible ? c.face : '❔'}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
