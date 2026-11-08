import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/** Hinweis bei neuer App-Version bzw. wenn die App offline bereit ist. */
export function UpdatePrompt() {
  const { offlineReady: [offlineReady, setOfflineReady], needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);
  if (!offlineReady && !needRefresh) return null;
  return (
    <div className="fixed left-1/2 top-3 z-[70] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl bg-tinte p-4 text-white shadow-karte" role="status" style={{ marginTop: 'var(--safe-top)' }}>
      <p className="mb-3 font-bold">{needRefresh ? 'Eine neue Version von Lernito ist da.' : 'Lernito funktioniert jetzt auch offline.'}</p>
      <div className="flex gap-2">
        {needRefresh && <button className="rounded-xl bg-sonne-500 px-4 py-2 font-bold text-tinte" onClick={() => void updateServiceWorker(true)}>Aktualisieren</button>}
        <button className="rounded-xl bg-white/20 px-4 py-2" onClick={() => { setOfflineReady(false); setNeedRefresh(false); }}>OK</button>
      </div>
    </div>
  );
}
