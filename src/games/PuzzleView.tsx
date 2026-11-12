import { useMemo } from 'react';
import type { PuzzleTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { DragBoard } from './DragBoard';
import { PuzzleScene } from './PuzzlePictures';
import { createRng, shuffle } from '../lib/random';
import { L, getLang } from '../i18n';

const POS_DE = ['oben links', 'oben Mitte', 'oben rechts', 'Mitte links', 'Mitte', 'Mitte rechts', 'unten links', 'unten Mitte', 'unten rechts'];
const POS_IT = ['in alto a sinistra', 'in alto al centro', 'in alto a destra', 'al centro a sinistra', 'al centro', 'al centro a destra', 'in basso a sinistra', 'in basso al centro', 'in basso a destra'];

export function PuzzleView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<PuzzleTask>) {
  const g = task.grid;
  const cell = 300 / g;
  const ids = useMemo(() => Array.from({ length: g * g }, (_, i) => `teil-${i}`), [g]);
  const shuffled = useMemo(() => shuffle(createRng(), ids), [ids, task.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const posName = (i: number) => { const names = getLang() === 'it' ? POS_IT : POS_DE; return (g === 3 ? names[i] : names[[0, 2, 6, 8][i]!])!; };
  const piece = (i: number, px: string) => (
    <svg viewBox={`${(i % g) * cell} ${Math.floor(i / g) * cell} ${cell} ${cell}`} className={px} aria-hidden>
      <PuzzleScene picture={task.picture} />
    </svg>
  );
  const size = g === 2 ? 'h-28 w-28 sm:h-36 sm:w-36' : 'h-20 w-20 sm:h-28 sm:w-28';
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-base text-tinte/70">
        <svg viewBox="0 0 300 300" className="h-16 w-16 rounded-lg shadow" aria-label={L('Vorschaubild', 'Anteprima')}><PuzzleScene picture={task.picture} /></svg>
        <span>{L('So soll es aussehen', 'Ecco come deve diventare')}</span>
      </div>
      <DragBoard
        resetKey={task.id}
        reveal={reveal}
        done={done}
        onWrongDrop={onWrong}
        onComplete={onCorrect}
        targetLayout={`grid gap-1 rounded-3xl bg-flaeche p-2 ${g === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
        targetSize={`${size} !rounded-xl !border-2`}
        pieceSize={size}
        pieces={shuffled.map((id) => {
          const i = Number(id.split('-')[1]);
          return { id, label: L(`Puzzleteil (gehört ${posName(i)})`, `Pezzo del puzzle (va ${posName(i)})`), render: () => piece(i, 'h-full w-full rounded-xl') };
        })}
        targets={ids.map((id, i) => ({
          id: `ziel-${i}`, accepts: id, label: posName(i),
          render: () => <span className="opacity-20">{piece(i, 'h-full w-full grayscale')}</span>
        }))}
      />
    </div>
  );
}
