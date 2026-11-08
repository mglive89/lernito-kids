import { lazy, Suspense, useEffect, useState } from 'react';
import type { Pick3DTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { hasWebGL } from '../lib/webgl';
import { ChoiceView } from './ChoiceView';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { L } from '../i18n';

const Pick3D = lazy(() => import('../three/Pick3D'));

export function Pick3DView(props: TaskViewProps<Pick3DTask>) {
  const { task, onCorrect, onWrong, reveal, done } = props;
  const [states, setStates] = useState<Record<string, 'normal' | 'richtig' | 'falsch' | 'aus'>>({});
  useEffect(() => setStates({}), [task.id]);
  const fallback = (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="rounded-full bg-sonne-100 px-3 py-1 text-sm">{L('2D-Ansicht (3D wird auf diesem Gerät nicht unterstützt)', 'Vista 2D (il 3D non è supportato su questo dispositivo)')}</span>
      <ChoiceView
        {...props}
        task={{ ...task, type: 'choice', options: task.items.map((i) => (/\p{Extended_Pictographic}/u.test(i.label) ? { id: i.id, emoji: i.label } : { id: i.id, label: i.label })), optionStyle: task.scene === 'wiese' ? 'emoji' : 'big' }}
      />
    </div>
  );
  if (!hasWebGL()) return fallback;
  const pick = (id: string) => {
    if (done || reveal || states[id] === 'aus') return;
    if (id === task.correctId) { setStates((s) => ({ ...s, [id]: 'richtig' })); onCorrect(); }
    else { setStates((s) => ({ ...s, [id]: 'aus' })); onWrong(); }
  };
  const shownStates = reveal ? { ...states, [task.correctId]: 'richtig' as const } : states;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <ErrorBoundary compact>
        <Suspense fallback={<div className="flex h-72 w-full max-w-2xl items-center justify-center rounded-3xl bg-white" role="status">{L('3D-Welt wird geladen …', 'Caricamento del mondo 3D …')}</div>}>
          <Pick3D scene={task.scene} items={task.items} states={shownStates} onPick={pick} />
        </Suspense>
      </ErrorBoundary>
      <p className="text-center text-base text-tinte/60">{L('Ziehe mit dem Finger, um die Welt zu drehen. Tippe auf deine Antwort.', 'Trascina con il dito per girare il mondo. Tocca la tua risposta.')}</p>
      {/* Barrierearme Alternative zur 3D-Auswahl */}
      <details className="w-full max-w-2xl">
        <summary className="cursor-pointer text-center text-base text-tinte/70 underline">{L('Antworten als Knöpfe anzeigen', 'Mostra le risposte come pulsanti')}</summary>
        <div className="mt-3 flex justify-center">{fallback}</div>
      </details>
    </div>
  );
}
