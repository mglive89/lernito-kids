import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '../../store/useApp';
import { TopBar, Notice } from '../../components/ui';
import { PinPad } from '../../components/PinPad';
import { Lino } from '../../components/Lino';
import { zahlInWorten } from '../../lib/zahlInWorten';
import { ParentDashboard } from './ParentDashboard';

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
        else { setErr('Das stimmt leider nicht. Neue Zahl:'); setVal(''); setN(100 + Math.floor(Math.random() * 899)); }
      }}
    >
      <h2 className="font-display text-2xl font-bold">Nur für Erwachsene</h2>
      <label htmlFor="adult-check" className="text-lg">Bitte schreiben Sie diese Zahl in Ziffern:</label>
      <p className="rounded-xl bg-sonne-100 p-3 text-center font-display text-2xl font-bold" data-testid="adult-number" data-value={n}>{zahlInWorten(n)}</p>
      <input id="adult-check" data-testid="adult-input" className="feld text-center text-2xl" inputMode="numeric" value={val} onChange={(e) => setVal(e.target.value.replace(/\D/g, ''))} autoComplete="off" />
      {err && <p className="font-bold text-koralle-700" role="alert">{err}</p>}
      <button className="knopf bg-himmel-500 text-white" type="submit" data-testid="adult-submit">Weiter</button>
    </form>
  );
}

function PinSetup({ onDone }: { onDone: () => void }) {
  const setPin = useApp((s) => s.setPin);
  const [step, setStep] = useState<'check' | 'pin1' | 'pin2'>('check');
  const [first, setFirst] = useState('');
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-5">
      <Notice>Willkommen im Elternbereich! Legen Sie eine PIN (4–6 Ziffern) fest. Sie schützt diesen Bereich auf diesem Gerät vor Kindern.</Notice>
      {step === 'check' && <AdultCheck onPass={() => setStep('pin1')} />}
      {step === 'pin1' && <PinPad testId="pin-neu" label="Neue PIN festlegen" onSubmit={(p) => { setFirst(p); setErr(null); setStep('pin2'); }} />}
      {step === 'pin2' && (
        <PinPad
          testId="pin-wdh"
          label="PIN wiederholen"
          error={err}
          onSubmit={(p) => {
            if (p !== first) { setErr('Die PINs stimmen nicht überein. Bitte neu festlegen.'); setStep('pin1'); return; }
            setPin(p);
            onDone();
          }}
        />
      )}
    </div>
  );
}

function PinLogin({ onDone }: { onDone: () => void }) {
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
        <Notice tone="warn">PIN vergessen? Nach der Erwachsenen-Prüfung wird nur die PIN zurückgesetzt. Die Lernstände der Kinder bleiben erhalten.</Notice>
        <AdultCheck onPass={() => { setParent({ pinHash: null, salt: null }); setForgot(false); }} />
        <button className="underline" onClick={() => setForgot(false)}>Abbrechen</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4">
      {locked ? (
        <Notice tone="warn">Zu viele Versuche. Bitte warten Sie {Math.ceil((lockUntil - now) / 1000)} Sekunden.</Notice>
      ) : (
        <PinPad
          testId="pin-login"
          label="Eltern-PIN eingeben"
          error={fails > 0 ? `Falsche PIN (${fails}/5)` : null}
          onSubmit={(p) => {
            if (verify(p)) { setFails(0); onDone(); return; }
            const f = fails + 1;
            setFails(f);
            if (f >= 5) { setLockUntil(Date.now() + 60_000); setNow(Date.now()); setFails(0); }
          }}
        />
      )}
      <button className="text-base underline" onClick={() => setForgot(true)}>PIN vergessen?</button>
    </div>
  );
}

export default function ParentArea() {
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const unlockedUntil = useApp((s) => s.parentUnlockedUntil);
  const unlock = useApp((s) => s.unlockParent);
  const lock = useApp((s) => s.lockParent);
  const nav = useNavigate();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 15_000); return () => clearInterval(t); }, []);
  const unlocked = useMemo(() => unlockedUntil > now, [unlockedUntil, now]);

  if (!unlocked) {
    return (
      <div className="min-h-[100dvh]">
        <TopBar title="Elternbereich" back={-1} />
        <main className="seite flex flex-col items-center gap-6">
          <Lino mood="ruhig" size={100} still />
          {hasPin ? <PinLogin onDone={() => unlock(20)} /> : <PinSetup onDone={() => unlock(20)} />}
          <Link to="/datenschutz" className="flex items-center gap-2 underline"><ShieldCheck size={18} /> Informationen zum Datenschutz</Link>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-[100dvh] bg-white/60">
      <TopBar
        title="Elternbereich"
        back="/"
        right={<button className="knopf bg-white text-base" onClick={() => { lock(); nav('/'); }} data-testid="eltern-abmelden"><LogOut size={20} /> Sperren</button>}
      />
      <ParentDashboard />
    </div>
  );
}
