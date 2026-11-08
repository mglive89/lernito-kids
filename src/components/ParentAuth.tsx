import { useEffect, useState } from 'react';
import { useApp } from '../store/useApp';
import { Notice } from './ui';
import { PinPad } from './PinPad';
import { numeroInParole, zahlInWorten } from '../lib/zahlInWorten';
import { L, getLang } from '../i18n';

/** Erwachsenen-Prüfung: Zahl in Worten als Ziffern eingeben (für Vorschulkinder kaum lösbar). */
export function AdultCheck({ onPass }: { onPass: () => void }) {
  const [n, setN] = useState(() => 100 + Math.floor(Math.random() * 899));
  const [val, setVal] = useState('');
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="karte flex w-full max-w-md flex-col gap-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (Number(val) === n) onPass();
        else { setErr(L('Das stimmt leider nicht. Neue Zahl:', 'Non è corretto. Nuovo numero:')); setVal(''); setN(100 + Math.floor(Math.random() * 899)); }
      }}
    >
      <h2 className="font-display text-2xl font-bold">{L('Nur für Erwachsene', 'Solo per adulti')}</h2>
      <label htmlFor="adult-check" className="text-lg">{L('Bitte schreiben Sie diese Zahl in Ziffern:', 'Scrivete questo numero in cifre:')}</label>
      <p className="rounded-xl bg-sonne-100 p-3 text-center font-display text-2xl font-bold" data-testid="adult-number" data-value={n}>{getLang() === 'it' ? numeroInParole(n) : zahlInWorten(n)}</p>
      <input id="adult-check" data-testid="adult-input" className="feld text-center text-2xl" inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value.replace(/\D/g, ''))} autoComplete="off" />
      {err && <p className="font-bold text-koralle-700" role="alert">{err}</p>}
      <button className="knopf bg-himmel-500 text-white" type="submit" data-testid="adult-submit">{L('Weiter', 'Avanti')}</button>
    </form>
  );
}

export function PinSetup({ onDone, showIntro = true }: { onDone: () => void; showIntro?: boolean }) {
  const setPin = useApp((s) => s.setPin);
  const [step, setStep] = useState<'check' | 'pin1' | 'pin2'>('check');
  const [first, setFirst] = useState('');
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-5">
      {showIntro && <Notice>{L('Willkommen im Elternbereich! Legen Sie eine PIN (4–6 Ziffern) fest. Sie schützt diesen Bereich auf diesem Gerät vor Kindern.', 'Benvenuti nell’area genitori! Impostate un PIN (4–6 cifre): protegge quest’area dai bambini su questo dispositivo.')}</Notice>}
      {step === 'check' && <AdultCheck onPass={() => setStep('pin1')} />}
      {step === 'pin1' && <PinPad testId="pin-neu" label={L('Neue PIN festlegen', 'Imposta un nuovo PIN')} onSubmit={(p) => { setFirst(p); setErr(null); setStep('pin2'); }} />}
      {step === 'pin2' && (
        <PinPad
          testId="pin-wdh"
          label={L('PIN wiederholen', 'Ripeti il PIN')}
          error={err}
          onSubmit={(p) => {
            if (p !== first) { setErr(L('Die PINs stimmen nicht überein. Bitte neu festlegen.', 'I PIN non coincidono. Impostatelo di nuovo.')); setStep('pin1'); return; }
            setPin(p);
            onDone();
          }}
        />
      )}
    </div>
  );
}

export function PinLogin({ onDone }: { onDone: () => void }) {
  const verify = useApp((s) => s.verifyPin);
  const [fails, setFails] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [forgot, setForgot] = useState(false);
  const setParent = useApp((s) => s.setParent);
  useEffect(() => { if (lockUntil > now) { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); } }, [lockUntil, now]);
  const locked = lockUntil > now;
  if (forgot) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Notice tone="warn">{L('PIN vergessen? Nach der Erwachsenen-Prüfung wird nur die PIN zurückgesetzt. Die Lernstände der Kinder bleiben erhalten.', 'PIN dimenticato? Dopo la verifica per adulti viene azzerato solo il PIN. I progressi dei bambini restano.')}</Notice>
        <AdultCheck onPass={() => { setParent({ pinHash: null, salt: null }); setForgot(false); }} />
        <button className="underline" onClick={() => setForgot(false)}>{L('Abbrechen', 'Annulla')}</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      {locked ? (
        <Notice tone="warn">{L(`Zu viele Versuche. Bitte warten Sie ${Math.ceil((lockUntil - now) / 1000)} Sekunden.`, `Troppi tentativi. Attendete ${Math.ceil((lockUntil - now) / 1000)} secondi.`)}</Notice>
      ) : (
        <PinPad
          testId="pin-login"
          label={L('Eltern-PIN eingeben', 'Inserite il PIN dei genitori')}
          error={fails > 0 ? L(`Falsche PIN (${fails}/5)`, `PIN errato (${fails}/5)`) : null}
          onSubmit={(p) => {
            if (verify(p)) { setFails(0); onDone(); return; }
            const f = fails + 1;
            setFails(f);
            if (f >= 5) { setLockUntil(Date.now() + 60_000); setNow(Date.now()); setFails(0); }
          }}
        />
      )}
      <button className="text-base underline" onClick={() => setForgot(true)}>{L('PIN vergessen?', 'PIN dimenticato?')}</button>
    </div>
  );
}


/** Zeigt den Inhalt nur Erwachsenen: PIN eingeben bzw. beim ersten Mal festlegen. */
export function ParentGate({ children }: { children: React.ReactNode }) {
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const unlockedUntil = useApp((s) => s.parentUnlockedUntil);
  const unlock = useApp((s) => s.unlockParent);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15_000); return () => clearInterval(t); }, []);
  if (unlockedUntil > now) return <>{children}</>;
  return (
    <div className="flex flex-col items-center gap-5">
      <Notice>{L('Dieser Schritt ist für Erwachsene. Bitte geben Sie die Eltern-PIN ein.', 'Questo passaggio è per gli adulti. Inserite il PIN dei genitori.')}</Notice>
      {hasPin ? <PinLogin onDone={() => { unlock(20); setNow(Date.now()); }} /> : <PinSetup onDone={() => { unlock(20); setNow(Date.now()); }} />}
    </div>
  );
}
