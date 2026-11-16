/**
 * Sprachkatalog von LinguaFlow: ISO 639 (über BCP-47-Kennungen), mit Varianten, wo es eigene Inhalte geben kann.
 * Namen kommen aus Intl.DisplayNames: übersetzt (in der Oberflächensprache) und im Original (Endonym).
 * Keine Flaggen – Sprachen werden mit Namen bezeichnet.
 */
import type { LangTag } from './types';

/** ISO 639-1 (fast vollständig) + wichtige ISO-639-3-Sprachen + Varianten mit eigenen Inhalten */
export const CATALOG_TAGS: LangTag[] = [
  'af', 'ak', 'am', 'ar', 'as', 'ay', 'az', 'be', 'bg', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'co', 'cs', 'cy', 'da',
  'de', 'de-AT', 'de-CH', 'dv', 'dz', 'ee', 'el', 'en', 'en-GB', 'en-US', 'eo', 'es', 'es-ES', 'es-419', 'et', 'eu', 'fa', 'ff', 'fi', 'fil', 'fo',
  'fr', 'fr-CA', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'ha', 'haw', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it',
  'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ckb', 'ky', 'la', 'lb', 'lg', 'ln', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk',
  'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'nb', 'ne', 'nl', 'nn', 'ny', 'oc', 'om', 'or', 'pa', 'pl', 'ps', 'pt-BR', 'pt-PT', 'qu',
  'rm', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr-Cyrl', 'sr-Latn', 'st', 'su', 'sv', 'sw',
  'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'ug', 'uk', 'ur', 'uz', 'vi', 'wo', 'xh', 'yi',
  'yo', 'yue', 'zh-Hans', 'zh-Hant', 'zu', 'nap', 'scn', 'vec', 'lij', 'fur', 'gsw', 'bar', 'nds'
];

/** Sprachen, die von rechts nach links geschrieben werden */
const RTL = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'yi', 'dv', 'ckb', 'sd', 'ug']);

export const baseOf = (tag: LangTag) => tag.split('-')[0]!.toLowerCase();
export const isRtl = (tag: LangTag) => RTL.has(baseOf(tag)) && !/-Latn/i.test(tag);
export const dirOf = (tag: LangTag): 'rtl' | 'ltr' => (isRtl(tag) ? 'rtl' : 'ltr');

const displayCache = new Map<string, Intl.DisplayNames | null>();
function display(locale: string): Intl.DisplayNames | null {
  if (!displayCache.has(locale)) {
    try { displayCache.set(locale, new Intl.DisplayNames([locale, 'en'], { type: 'language', fallback: 'none' })); } catch { displayCache.set(locale, null); }
  }
  return displayCache.get(locale)!;
}

const upperFirst = (s: string, locale: string) => (s ? s.charAt(0).toLocaleUpperCase(locale) + s.slice(1) : s);

/** Name der Sprache in der Oberflächensprache, z. B. „Tedesco“ */
export function nameOf(tag: LangTag, uiLang: LangTag): string {
  const n = display(uiLang)?.of(tag);
  return upperFirst(n ?? tag, uiLang);
}
/** Name der Sprache in ihr selbst, z. B. „Deutsch“ */
export function endonymOf(tag: LangTag): string {
  const n = display(tag)?.of(tag);
  return upperFirst(n ?? nameOf(tag, 'en'), tag);
}

export interface CatalogLang { tag: LangTag; name: string; endonym: string; english: string; dir: 'rtl' | 'ltr' }

export function catalog(uiLang: LangTag, extra: LangTag[] = []): CatalogLang[] {
  const tags = [...new Set([...CATALOG_TAGS, ...extra])];
  return tags
    .map((tag) => ({ tag, name: nameOf(tag, uiLang), endonym: endonymOf(tag), english: nameOf(tag, 'en'), dir: dirOf(tag) }))
    .sort((a, b) => a.name.localeCompare(b.name, uiLang));
}

/** Nur für die Suche: Groß/Klein und Akzente ignorieren (nicht für Antworten!) */
const fold = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

/** Suche nach übersetztem Namen, Originalname, englischem Namen oder Kennung */
export function searchCatalog(list: CatalogLang[], query: string): CatalogLang[] {
  const q = fold(query);
  if (!q) return list;
  const score = (l: CatalogLang) => {
    const fields = [l.name, l.endonym, l.english, l.tag].map(fold);
    if (fields.some((f) => f === q)) return 0;
    if (fields.some((f) => f.startsWith(q))) return 1;
    if (fields.some((f) => f.includes(q))) return 2;
    return 9;
  };
  return list.map((l) => [l, score(l)] as const).filter(([, s]) => s < 9).sort((a, b) => a[1] - b[1]).map(([l]) => l);
}

/** Oberflächensprachen, die LinguaFlow selbst spricht */
export const UI_LANGS: LangTag[] = ['it', 'de', 'en'];

/** Vorschlag für die Oberflächensprache: Gerätesprache, falls verfügbar */
export function deviceUiLang(fallback: LangTag = 'it'): LangTag {
  const langs = typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : [];
  for (const l of langs) {
    const b = baseOf(l ?? '');
    if (UI_LANGS.includes(b)) return b;
  }
  return fallback;
}
