import type { DragMatchTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { DragBoard } from './DragBoard';
import { Shape } from '../components/Shape';

export function DragMatchView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<DragMatchTask>) {
  return (
    <DragBoard
      resetKey={task.id}
      reveal={reveal}
      done={done}
      onWrongDrop={onWrong}
      onComplete={onCorrect}
      targetLayout="flex flex-wrap justify-center gap-3 sm:gap-4"
      pieces={task.pieces.map((p) => ({
        id: p.id,
        label: p.label ?? p.emoji ?? p.id,
        render: () => (p.shape ? <Shape shape={p.shape} color={p.color} size={76} /> : <span className="emoji text-6xl">{p.emoji}</span>)
      }))}
      targets={task.targets.map((t) => ({
        id: t.id,
        accepts: t.accepts,
        label: t.label ?? 'Schatten',
        render: () => (t.shape ? <Shape shape={t.shape} outline size={84} /> : <span className={`emoji text-6xl ${t.silhouette ? 'silhouette' : ''}`}>{t.emoji}</span>)
      }))}
    />
  );
}
