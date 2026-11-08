/**
 * Mehrsprachigkeit (Deutsch / Italiano).
 * Texte stehen direkt im Code als Paar: L('Deutsch', 'Italiano').
 * Statische Texte (z. B. Modultitel) werden als Txt-Objekt gespeichert und mit tr() aufgelöst.
 */
export type Lang = 'de' | 'it';
export const LANGS: { id: Lang; name: string; flag: string; locale: string }[] = [
  { id: 'de', name: 'Deutsch', flag: '🇩🇪', locale: 'de-DE' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹', locale: 'it-IT' }
];

export type Txt = string | { de: string; it: string };

/** Sprache des Geräts (Vorschlag, solange nichts gewählt ist) */
export const SYSTEM_LANG: Lang = detectLang();
let current: Lang = SYSTEM_LANG;

function detectLang(): Lang {
  try {
    const n = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'de';
    return n.startsWith('it') ? 'it' : 'de';
  } catch {
    return 'de';
  }
}

export function getLang(): Lang { return current; }
export function setLang(l: Lang) {
  current = l;
  if (typeof document !== 'undefined') document.documentElement.lang = l;
}
export function locale(): string { return current === 'it' ? 'it-IT' : 'de-DE'; }

/** Text in der aktuellen Sprache wählen. */
export function L(de: string, it: string): string { return current === 'it' ? it : de; }

/** Statischer, zweisprachiger Text. */
export function tx(de: string, it: string): Txt { return { de, it }; }

/** Txt auflösen. */
export function tr(t: Txt | undefined): string {
  if (t === undefined) return '';
  return typeof t === 'string' ? t : t[current];
}

/** Zahl im Format der aktuellen Sprache. */
export function num(n: number, digits?: number): string {
  return n.toLocaleString(locale(), digits === undefined ? undefined : { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
