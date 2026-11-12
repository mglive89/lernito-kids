import { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';
import { L } from '../i18n';

interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

/** Installationshinweis: Android/Chrome über Prompt, iOS mit kurzer Anleitung. */
export function InstallHint() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem('lernito-install-hidden') === '1'; } catch { return false; } });
  const standalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
  const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setEvt(e as BeforeInstallPromptEvent); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);

  if (standalone || hidden || (!evt && !isIos)) return null;
  const hide = () => { setHidden(true); try { localStorage.setItem('lernito-install-hidden', '1'); } catch { /* egal */ } };
  return (
    <div className="karte flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="font-bold">{L('Lernito auf den Home-Bildschirm legen', 'Aggiungi Lernito alla schermata Home')}</p>
        {isIos && !evt ? (
          <p className="text-sm text-tinte/70">{L('In Safari auf', 'In Safari tocca')} <Share className="inline" size={16} aria-label={L('Teilen', 'Condividi')} /> {L('tippen und „Zum Home-Bildschirm“ wählen.', 'e scegli «Aggiungi alla schermata Home».')}</p>
        ) : (
          <p className="text-sm text-tinte/70">{L('Dann startet Lernito wie eine App – auch offline.', 'Così Lernito si apre come un’app, anche offline.')}</p>
        )}
      </div>
      <div className="flex gap-2">
        {evt && <button className="knopf bg-minze-500 text-white" onClick={() => void evt.prompt().then(() => setEvt(null))}><Download /> {L('Installieren', 'Installa')}</button>}
        <button className="knopf bg-flaeche text-base" onClick={hide}>{L('Später', 'Più tardi')}</button>
      </div>
    </div>
  );
}
