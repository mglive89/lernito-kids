import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { useApp } from '../../store/useApp';
import { TopBar } from '../../components/ui';
import { Lino } from '../../components/Lino';
import { PinLogin, PinSetup } from '../../components/ParentAuth';
export { AdultCheck } from '../../components/ParentAuth';
import { ParentDashboard } from './ParentDashboard';
import { L } from '../../i18n';

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
        <TopBar title={L('Elternbereich', 'Area genitori')} back={-1} />
        <main className="seite flex flex-col items-center gap-6">
          <Lino mood="ruhig" size={100} still />
          {hasPin ? <PinLogin onDone={() => unlock(20)} /> : <PinSetup onDone={() => unlock(20)} />}
          <Link to="/datenschutz" className="flex items-center gap-2 underline"><ShieldCheck size={18} /> {L('Informationen zum Datenschutz', 'Informazioni sulla privacy')}</Link>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-[100dvh] bg-flaeche/60">
      <TopBar
        title={L('Elternbereich', 'Area genitori')}
        back="/"
        right={<button className="knopf bg-flaeche text-base" onClick={() => { lock(); nav('/'); }} data-testid="eltern-abmelden"><LogOut size={20} /> {L('Sperren', 'Blocca')}</button>}
      />
      <ParentDashboard />
    </div>
  );
}
