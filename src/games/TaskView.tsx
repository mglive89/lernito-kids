import type { Task } from '../learning/types';
import type { TaskViewProps } from './types';
import { ChoiceView } from './ChoiceView';
import { InputView } from './InputView';
import { WordBuildView } from './WordBuildView';
import { OrderView } from './OrderView';
import { MemoryView } from './MemoryView';
import { DragMatchView } from './DragMatchView';
import { PuzzleView } from './PuzzleView';
import { Pick3DView } from './Pick3DView';
import { SpeakView } from './SpeakView';
import { SentenceView } from './SentenceView';

export function TaskView(props: TaskViewProps<Task>) {
  const { task } = props;
  switch (task.type) {
    case 'choice': return <ChoiceView {...props} task={task} />;
    case 'input': return <InputView {...props} task={task} />;
    case 'wordbuild': return <WordBuildView {...props} task={task} />;
    case 'order': return <OrderView {...props} task={task} />;
    case 'memory': return <MemoryView {...props} task={task} />;
    case 'dragmatch': return <DragMatchView {...props} task={task} />;
    case 'puzzle': return <PuzzleView {...props} task={task} />;
    case 'pick3d': return <Pick3DView {...props} task={task} />;
    case 'speak': return <SpeakView {...props} task={task} />;
    case 'sentence': return <SentenceView {...props} task={task} />;
  }
}
