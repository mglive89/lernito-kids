import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lino } from './Lino';
import { PinPad } from './PinPad';
import { useApp } from '../store/useApp';

/** Freundlicher Pausenhinweis, wenn das von Eltern gesetzte Tageslimit erreicht ist. */
export function TimeUpOverlay({ onUnlocked }: { onUnlocked: () => void }) {
  const nav = useNavigate();
  const verify = useApp((s) => s.verifyPin);
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const setActive = useApp((s) => s.setActiveProfile);
  const [showPin, setShowPin] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-himmel-100 p-4" role="dialog" aria-modal="true" aria-labelledby="pause-titel">
      <div className="karte flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Lino mood="ruhig" size={130} />
        <h1 id="pause-titel" className="font-display text-3xl font-bold">Zeit für eine Pause!</h1>
        <p className="text-xl">Du hast heute schon toll gelernt. Lino ruht sich jetzt auch aus. Bis morgen!</p>
        <button className="knopf w-full bg-sonne-500" onClick={() => { setActive(null); nav('/'); }}>Zur Startseite</button>
        {hasPin && !showPin && <button className="text-base underline" onClick={() => setShowPin(true)}>Für Erwachsene: Zeit verlängern</button>}
        {showPin && (
          <PinPad testId="pause-pin" label="Eltern-PIN" error={err} onSubmit={(p) => (verify(p) ? onUnlocked() : setErr('Die PIN stimmt nicht.'))} />
        )}
      </div>
    </div>
  );
}
