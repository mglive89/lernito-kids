import { numeroInParole, zahlInWorten } from './zahlInWorten';

/**
 * Vergleich von gesprochener Antwort (Spracherkennung) und erwarteter Antwort.
 * Bewusst großzügig: Kinder sprechen noch nicht perfekt, und die Erkennung ist nicht fehlerfrei.
 */

/** Kleinbuchstaben, ohne Akzente und Satzzeichen, einfache Leerzeichen. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`´]/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const ARTICLES = new Set([
  'the', 'a', 'an', 'to',
  'der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'einen',
  'il', 'lo', 'la', 'i', 'gli', 'le', 'l', 'un', 'uno', 'una',
  'les', 'du', 'des', 'une',
  'el', 'los', 'las', 'unos', 'unas'
]);

const stripArticles = (s: string) => s.split(' ').filter((w) => !ARTICLES.has(w)).join(' ');

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length]!;
}

/** Ähnlichkeit 0–1 zweier (normalisierter) Texte. */
export function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  return max ? 1 - levenshtein(a, b) / max : 1;
}

const WORD_OK = 0.75;

/** Zahlwörter 0–10 der Kurssprachen: die Erkennung liefert oft „7“ statt „seven“. */
const DIGIT_WORDS: Record<string, string[]> = {
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  de: ['null', 'eins', 'zwei', 'drei', 'vier', 'funf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'],
  it: ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'],
  fr: ['zero', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
  es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
};

/** Gehörtes vorbereiten: normalisieren und einzelne Ziffern als Wort der Sprache schreiben. */
function prepHeard(h: string, lang?: string): string {
  const n = normalize(h);
  const table = lang ? DIGIT_WORDS[lang.slice(0, 2)] : undefined;
  return table ? n.replace(/\b(10|\d)\b/g, (d) => table[Number(d)] ?? d) : n;
}

/** Welche Wörter des Zielsatzes wurden gehört? (für die farbige Rückmeldung) */
export function wordsHeard(target: string, heard: string[], lang?: string): boolean[] {
  const words = target.split(/\s+/).filter(Boolean);
  const pool = heard.flatMap((h) => prepHeard(h, lang).split(' '));
  return words.map((w) => {
    const n = normalize(w);
    if (!n) return true; // nur Satzzeichen
    // „J’ai“ → „j ai“: jedes Teilwort muss vorkommen
    return n.split(' ').every((part) => pool.some((p) => similarity(part, p) >= WORD_OK));
  });
}

/** Wie gut passt das Gehörte zum Ziel? 0–1, beste Alternative zählt. */
export function phraseScore(target: string, heard: string[], lang?: string): number {
  const t = normalize(target);
  if (!t) return 0;
  const tWords = t.split(' ');
  let best = 0;
  for (const h of heard) {
    const n = prepHeard(h, lang);
    if (!n) continue;
    const full = similarity(t, n);
    const bare = similarity(stripArticles(t) || t, stripArticles(n) || n);
    const hWords = n.split(' ');
    const covered = tWords.filter((w) => hWords.some((p) => similarity(w, p) >= WORD_OK)).length / tWords.length;
    // Viele zusätzliche Wörter leicht abwerten (sonst zählt „Rauschen“ mit)
    const extra = Math.max(0, hWords.length - tWords.length - 2) * 0.05;
    best = Math.max(best, full, bare, covered - extra);
  }
  return Math.max(0, Math.min(1, best));
}

/** Schwelle, ab der eine Aussprache als richtig gilt. */
export const SPEAK_PASS = 0.7;

/**
 * Welche Antwortmöglichkeit hat das Kind gesagt?
 * Liefert den Index oder null, wenn nichts eindeutig passt.
 */
export function matchOption(heard: string[], options: string[], lang: string = 'de'): number | null {
  if (!heard.length || !options.length) return null;
  // Zahlen direkt vergleichen („12“, „zwölf“, „dodici“)
  const nums = options.map((o) => (/^\s*[−-]?\d+([.,]\d+)?\s*$/.test(o) ? Number(o.replace('−', '-').replace(',', '.')) : null));
  if (nums.every((n) => n !== null)) {
    for (const h of heard) {
      const v = parseSpokenNumber(h, lang);
      if (v !== null) {
        const i = nums.indexOf(v);
        if (i >= 0) return i;
      }
    }
  }
  const scores = options.map((o) => phraseScore(o, heard));
  // Auch Optionen, deren Text im Gesagten vorkommt („ich glaube Berlin“)
  heard.forEach((h) => {
    const n = ` ${normalize(h)} `;
    options.forEach((o, i) => { const on = normalize(o); if (on && n.includes(` ${on} `)) scores[i] = Math.max(scores[i]!, 0.95); });
  });
  const order = scores.map((s, i) => [s, i] as const).sort((a, b) => b[0] - a[0]);
  const [top, second] = order;
  if (!top || top[0] < 0.6) return null;
  if (second && top[0] - second[0] < 0.1) return null;
  return top[1];
}

let numberWords: Map<string, number> | null = null;
function wordTable(): Map<string, number> {
  if (numberWords) return numberWords;
  const m = new Map<string, number>();
  for (let n = 1; n <= 1000; n++) m.set(normalize(zahlInWorten(n)).replace(/ /g, ''), n);
  for (let n = 1; n <= 999; n++) m.set(normalize(numeroInParole(n)).replace(/ /g, ''), n);
  const extra: [string, number][] = [['null', 0], ['zero', 0], ['eins', 1], ['ein', 1], ['eine', 1], ['uno', 1], ['un', 1], ['una', 1], ['mille', 1000], ['tausend', 1000], ['eintausend', 1000], ['hundert', 100]];
  for (const [w, n] of extra) m.set(w, n);
  numberWords = m;
  return m;
}

/** Gesprochene Zahl erkennen: Ziffern („-12“) oder Zahlwörter (de/it), auch „minus/meno“. */
export function parseSpokenNumber(text: string, _lang: string = 'de'): number | null {
  const raw = text.toLowerCase().replace(/−/g, '-');
  const neg = /\b(minus|meno)\b/.test(raw) || /(^|\s)-\s*\d/.test(raw);
  const digits = raw.match(/\d+([.,]\d+)?/g);
  if (digits?.length) {
    const v = Number(digits[digits.length - 1]!.replace(',', '.'));
    return Number.isFinite(v) ? (neg ? -Math.abs(v) : v) : null;
  }
  const table = wordTable();
  const words = normalize(raw).split(' ').filter((w) => w && w !== 'minus' && w !== 'meno');
  // Längste zusammenhängende Folge von hinten probieren („das sind zwei und zwanzig“ → „zweiundzwanzig“)
  for (let len = Math.min(4, words.length); len >= 1; len--) {
    for (let start = words.length - len; start >= 0; start--) {
      const v = table.get(words.slice(start, start + len).join(''));
      if (v !== undefined) return neg ? -v : v;
    }
  }
  return null;
}
