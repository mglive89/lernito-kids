/**
 * Antworten prüfen – bewusst vorsichtig:
 * Groß/Klein, Leerzeichen und Satzzeichen am Rand werden ignoriert,
 * Akzente und andere Zeichen, die die Bedeutung ändern können, NICHT.
 * Weitere richtige Varianten kommen ausschließlich aus den Daten (accept).
 */
const EDGE_PUNCT = /^[\s.,;:!?¡¿…"'“”„«»‚‘’()\-–—。、！？，؟،؛·]+|[\s.,;:!?¡¿…"'“”„«»‚‘’()\-–—。、！？，؟،؛·]+$/gu;

export function normalizeAnswer(s: string, lang: string): string {
  let t = s.normalize('NFC').replace(/[’ʼ]/g, "'").replace(/\s+/g, ' ');
  t = t.replace(EDGE_PUNCT, '');
  // Satzzeichen vor Leerzeichen innerhalb des Satzes vereinheitlichen („Hallo , Anna“ = „Hallo, Anna“)
  t = t.replace(/\s+([,;:!?。、，،])/g, '$1');
  try { return t.toLocaleLowerCase(lang); } catch { return t.toLowerCase(); }
}

export function isAccepted(given: string, accepted: string[], lang: string): boolean {
  const g = normalizeAnswer(given, lang);
  if (!g) return false;
  return accepted.some((a) => normalizeAnswer(a, lang) === g);
}

/** Satz aus Segmenten: Sprachen ohne Leerzeichen (Japanisch, Chinesisch, Thai) ohne Abstand zusammensetzen */
const NO_SPACE = new Set(['ja', 'zh', 'th', 'lo', 'km', 'my', 'yue']);
export function joinSegments(segments: string[], lang: string): string {
  return segments.join(NO_SPACE.has(lang.split('-')[0]!) ? '' : ' ');
}
