import type { Task } from '../learning/types';
import { num } from '../i18n';

/** Fehlversuche, bis Erklärung und Lösung gezeigt werden (Kita und Schule: 3). */
export function maxTries(_mode: 'auto' | 'check'): number {
  return 3;
}

/** Richtige Lösung als kurzer Text (für die Erklärung nach dem letzten Fehlversuch). */
export function solutionText(task: Task): string | undefined {
  switch (task.type) {
    case 'choice': {
      const o = task.options.find((x) => x.id === task.correctId);
      return o ? (o.label ?? o.speak ?? o.emoji) : undefined;
    }
    case 'pick3d': return task.items.find((x) => x.id === task.correctId)?.label;
    case 'input': return num(task.answer);
    case 'wordbuild': return task.solution.join('');
    case 'sentence': return task.words.join(' ');
    case 'order': return task.correctOrder.map((id) => task.items.find((x) => x.id === id)?.label ?? id).join(' → ');
    default: return undefined;
  }
}
