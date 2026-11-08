import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ChoiceOption, ChoiceTask } from '../learning/types';
import { Shape } from '../components/Shape';
import { speak } from '../lib/speech';
import type { TaskViewProps } from './types';
import { L } from '../i18n';

export function ChoiceView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<ChoiceTask>) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  useEffect(() => { setWrong([]); setChosen(null); }, [task.id]);

  const choose = (o: ChoiceOption) => {
    if (done || reveal || wrong.includes(o.id)) return;
    if (o.speak) speak(o.speak);
    if (o.id === task.correctId) { setChosen(o.id); onCorrect(); }
    else { setWrong((w) => [...w, o.id]); onWrong(); }
  };

  const style = task.optionStyle ?? 'text';
  const n = task.options.length;
  const grid =
    style === 'text' ? (n > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')
      : style === 'color' ? (n > 4 ? 'grid-cols-3' : n === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3')
        : n === 2 ? 'grid-cols-2' : n === 3 ? 'grid-cols-3' : n === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';

  return (
    <div className={`grid w-full gap-3 sm:gap-4 ${style === 'text' ? 'max-w-3xl' : 'max-w-2xl'} ${grid}`} role="group" aria-label={L('Antwortmöglichkeiten', 'Risposte possibili')}>
      {task.options.map((o) => {
        const isWrong = wrong.includes(o.id);
        const isRight = (chosen === o.id || (reveal && o.id === task.correctId));
        return (
          <motion.button
            key={o.id}
            type="button"
            data-testid={`option-${o.id}`}
            data-correct={o.id === task.correctId ? 'true' : undefined}
            onClick={() => choose(o)}
            disabled={isWrong || done}
            aria-label={ariaFor(o)}
            animate={isWrong ? { x: [0, -10, 10, -6, 6, 0] } : isRight ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.45 }}
            whileTap={{ scale: 0.94 }}
            className={[
              'knopf relative flex-col bg-white text-tinte',
              style === 'text' ? 'min-h-[4.5rem] justify-center px-4 text-xl sm:text-2xl' : 'aspect-square min-h-[5.5rem] p-2',
              style === 'big' ? 'font-display text-5xl sm:text-6xl' : '',
              isWrong ? 'opacity-40' : '',
              isRight ? 'ring-8 ring-minze-500 disabled:opacity-100' : '',
              reveal && o.id === task.correctId ? 'animate-pulse' : ''
            ].join(' ')}
          >
            <OptionContent o={o} style={style} />
            {isRight && <span className="absolute -right-2 -top-2 rounded-full bg-minze-500 p-1 text-white"><Check size={22} /></span>}
          </motion.button>
        );
      })}
    </div>
  );
}

function ariaFor(o: ChoiceOption): string {
  return o.label ?? o.speak ?? (o.scale ? (o.scale > 1.2 ? 'großes Bild' : o.scale < 0.7 ? 'kleines Bild' : 'mittleres Bild') : o.emoji ?? o.id);
}

function OptionContent({ o, style }: { o: ChoiceOption; style: string }) {
  if (style === 'color' && o.color) {
    return (
      <>
        <span className="block h-[70%] w-[70%] rounded-full border-4 border-tinte/10" style={{ background: o.color }} aria-hidden />
        <span className="mt-1 text-sm font-bold sm:text-base">{o.label}</span>
      </>
    );
  }
  if (style === 'shape' && o.shape) return <Shape shape={o.shape} color={o.color} size={96} />;
  if (o.emoji) {
    return (
      <span className={`emoji ${o.silhouette ? 'silhouette' : ''}`} style={{ fontSize: `${(o.scale ?? 1) * 3.6}rem` }} aria-hidden>
        {o.emoji}
      </span>
    );
  }
  return <span className="break-words leading-tight">{o.label}</span>;
}
