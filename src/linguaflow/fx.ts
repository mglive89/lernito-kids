/**
 * Effekte von LinguaFlow: Töne (WebAudio, offline, keine Dateien) und kleine Animationen.
 * Abschaltbar in den Einstellungen („Suoni ed effetti“); Animationen entfallen bei „Weniger Bewegung“.
 */
import { burstAt } from '../lib/effects';
import { sfx } from '../lib/sound';
import { useOwner } from './store';

export function useFx() {
  const on = useOwner().effects !== false;
  const play = (f: () => void) => { if (on) { try { f(); } catch { /* ohne Ton geht es auch */ } } };
  return {
    on,
    select: () => play(sfx.select),
    pop: () => play(sfx.pop),
    start: () => play(sfx.whoosh),
    correct: (el?: Element | null) => { play(sfx.correct); if (on && el) burstAt(el, 'sterne', 10); },
    streak: (el?: Element | null) => { play(sfx.streak); if (on && el) burstAt(el, 'funken', 12); },
    wrong: () => play(sfx.tryAgain),
    win: () => play(sfx.win),
    star: () => play(sfx.unlock)
  };
}

/** 1–3 Sterne je nach Anteil richtiger Antworten */
export const starsFor = (score: number, total: number) => (total <= 0 ? 0 : score / total >= 0.99 ? 3 : score / total >= 0.7 ? 2 : 1);
