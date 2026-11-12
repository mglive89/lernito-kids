import { useEffect } from 'react';
import { Snail, Volume2 } from 'lucide-react';
import { speak } from '../../lib/speech';
import { useActiveProfile } from '../../store/useApp';
import { L } from '../../i18n';

/** Vorlesen in der Zielsprache, sobald die Aufgabe selbst fertig vorgelesen ist. */
export function playWhenIdle(text: string, lang: string, slow = false): () => void {
  let stopped = false;
  let waited = 0;
  const tick = () => {
    if (stopped) return;
    const busy = typeof window !== 'undefined' && 'speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
    if (busy && waited < 5000) { waited += 200; t = setTimeout(tick, 200); return; }
    speak(text, { force: true, lang, rate: slow ? 0.55 : 0.9, pitch: 1 });
  };
  let t = setTimeout(tick, 700);
  return () => { stopped = true; clearTimeout(t); };
}

/** Großer Lautsprecher (normal) und Schnecke (langsam) – für Hör- und Sprechaufgaben. */
export function AudioPlayer({ text, lang, showText, autoPlay = true }: { text: string; lang: string; showText?: boolean; autoPlay?: boolean }) {
  const { settings } = useActiveProfile();
  useEffect(() => {
    if (!autoPlay || !settings.speech) return;
    return playWhenIdle(text, lang);
  }, [text, lang, autoPlay, settings.speech]);
  const play = (slow: boolean) => speak(text, { force: true, lang, rate: slow ? 0.55 : 0.9, pitch: 1 });
  return (
    <div className="flex flex-col items-center gap-3" data-testid="hoeren">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => play(false)} data-testid="anhoeren" aria-label={L('Anhören', 'Ascolta')}
          className="knopf kante-himmel flex h-20 w-20 items-center justify-center bg-himmel-500 px-0 text-white">
          <Volume2 size={40} />
        </button>
        <button type="button" onClick={() => play(true)} data-testid="langsam" aria-label={L('Langsam anhören', 'Ascolta piano')}
          className="knopf flex h-14 w-14 items-center justify-center bg-himmel-50 px-0 text-himmel-700 ring-1 ring-himmel-300">
          <Snail size={28} />
        </button>
      </div>
      {showText && <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl" lang={lang}>{text}</p>}
    </div>
  );
}
