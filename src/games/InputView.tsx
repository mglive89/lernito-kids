import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';
import type { InputTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { sfx } from '../lib/sound';
import { L } from '../i18n';

export function InputView({ task, onCorrect, onWrong, reveal, done }: TaskViewProps<InputTask>) {
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(0);
  useEffect(() => setValue(''), [task.id]);
  const maxLen = String(Math.abs(task.answer)).length + 2;
  const signed = task.signed || task.answer < 0;

  const submit = () => {
    if (!value || value === '-' || done || reveal) return;
    if (Number(value) === task.answer) onCorrect();
    else { onWrong(); setShake((s) => s + 1); setValue(''); }
  };
  const press = (k: string) => {
    if (done || reveal) return;
    sfx.tap();
    if (k === 'del') setValue((v) => v.slice(0, -1));
    else if (k === 'ok') submit();
    else if (k === '-') setValue((v) => (v.startsWith('-') ? v.slice(1) : `-${v}`));
    else setValue((v) => (v.length < maxLen ? (v === '0' ? k : v + k) : v));
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === '-' && signed) press('-');
      else if (e.key === 'Backspace') press('del');
      else if (e.key === 'Enter') press('ok');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const shown = (reveal ? String(task.answer) : value).replace('-', '−');
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <motion.output
        key={shake}
        animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}}
        className={`flex h-20 w-full items-center justify-center rounded-3xl border-4 bg-white font-display text-5xl font-bold ${done ? 'border-minze-500' : reveal ? 'border-sonne-500' : 'border-himmel-300'}`}
        aria-live="polite"
        aria-label={L('Deine Antwort', 'La tua risposta')}
        data-testid="input-display"
      >
        {shown || <span className="text-tinte/25">?</span>}
      </motion.output>
      <div className="grid w-full grid-cols-3 gap-3" role="group" aria-label={L('Zahlenfeld', 'Tastierino numerico')}>
        {(signed ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'del', 'ok'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok']).map((k) => (
          <button
            key={k}
            type="button"
            data-testid={`key-${k}`}
            onClick={() => press(k)}
            disabled={done || reveal}
            className={`knopf h-16 font-display text-3xl ${k === 'ok' ? `bg-minze-500 text-white ${signed ? 'col-span-3' : ''}` : k === 'del' ? 'bg-koralle-100' : 'bg-white'}`}
            aria-label={k === 'del' ? L('Löschen', 'Cancella') : k === 'ok' ? L('Prüfen', 'Controlla') : k === '-' ? L('Minus / Vorzeichen', 'Meno / segno') : k}
          >
            {k === 'del' ? <Delete size={30} /> : k === 'ok' ? <Check size={34} /> : k === '-' ? '±' : k}
          </button>
        ))}
      </div>
    </div>
  );
}
