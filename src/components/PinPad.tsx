import { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
import { L } from '../i18n';

/** PIN-Eingabe für Erwachsene (4–6 Ziffern). */
export function PinPad({ onSubmit, label, error, minLength = 4, testId = 'pin' }: { onSubmit: (pin: string) => void; label?: string; error?: string | null; minLength?: number; testId?: string }) {
  label = label ?? L('PIN eingeben', 'Inserisci il PIN');
  const [pin, setPin] = useState('');
  const press = (k: string) => {
    if (k === 'del') setPin((p) => p.slice(0, -1));
    else if (k === 'ok') { if (pin.length >= minLength) { onSubmit(pin); setPin(''); } }
    else setPin((p) => (p.length < 6 ? p + k : p));
  };
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <label className="w-full text-center text-lg font-bold" htmlFor={`${testId}-field`}>{label}</label>
      <motion.input
        id={`${testId}-field`}
        data-testid={`${testId}-field`}
        key={error ?? 'ok'}
        animate={error ? { x: [0, -10, 10, -6, 6, 0] } : {}}
        type="password"
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9]*"
        maxLength={6}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => e.key === 'Enter' && press('ok')}
        className="feld text-center font-mono text-3xl tracking-[0.5em]"
        aria-invalid={!!error}
        aria-describedby={error ? `${testId}-err` : undefined}
      />
      {error && <p id={`${testId}-err`} className="text-center font-bold text-koralle-700" role="alert">{error}</p>}
      <div className="grid w-full grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map((k) => (
          <button key={k} type="button" onClick={() => press(k)} className={`knopf h-14 text-2xl ${k === 'ok' ? 'bg-minze-500 text-white' : 'bg-flaeche'}`} aria-label={k === 'del' ? L('Löschen', 'Cancella') : k === 'ok' ? L('Bestätigen', 'Conferma') : k} data-testid={`${testId}-key-${k}`}>
            {k === 'del' ? <Delete /> : k === 'ok' ? 'OK' : k}
          </button>
        ))}
      </div>
    </div>
  );
}
