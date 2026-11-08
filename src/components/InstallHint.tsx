import { useEffect, useState } from 'react';
import { Download, Share } from 'lucide-react';

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
        <p className="font-bold">Lernito auf den Home-Bildschirm legen</p>
        {isIos && !evt ? (
          <p className="text-sm text-tinte/70">In Safari auf <Share className="inline" size={16} aria-label="Teilen" /> tippen und „Zum Home-Bildschirm“ wählen.</p>
        ) : (
          <p className="text-sm text-tinte/70">Dann startet Lernito wie eine App – auch offline.</p>
        )}
      </div>
      <div className="flex gap-2">
        {evt && <button className="knopf bg-minze-500 text-white" onClick={() => void evt.prompt().then(() => setEvt(null))}><Download /> Installieren</button>}
        <button className="knopf bg-white text-base" onClick={hide}>Später</button>
      </div>
    </div>
  );
}
