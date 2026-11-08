const EINER = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'];
const ZEHN_BIS_19 = ['zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const ZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

/** Zahl 1–9999 als deutsches Zahlwort (für die Erwachsenen-Prüfung). */
export function zahlInWorten(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 9999) throw new Error('Nur 1–9999');
  const parts: string[] = [];
  const t = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), r = n % 100;
  if (t) parts.push(`${EINER[t]}tausend`);
  if (h) parts.push(`${EINER[h]}hundert`);
  if (r) {
    if (r < 10) parts.push(r === 1 ? 'eins' : EINER[r]!);
    else if (r < 20) parts.push(ZEHN_BIS_19[r - 10]!);
    else {
      const e = r % 10, z = Math.floor(r / 10);
      parts.push(e ? `${EINER[e]}und${ZEHNER[z]}` : ZEHNER[z]!);
    }
  }
  return parts.join('');
}
