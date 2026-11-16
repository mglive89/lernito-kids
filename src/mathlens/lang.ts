/** Sprache von MathLens: Italienisch zum Start, die Wahl wird auf dem Gerät gemerkt. */
import { setLang, type Lang } from '../i18n';

const KEY = 'mathlens-lang';
export function initialLang(): Lang {
  try { const v = localStorage.getItem(KEY); if (v === 'de' || v === 'it') return v; } catch { /* egal */ }
  return 'it';
}
export function chooseLang(l: Lang) {
  try { localStorage.setItem(KEY, l); } catch { /* egal */ }
  setLang(l);
}
