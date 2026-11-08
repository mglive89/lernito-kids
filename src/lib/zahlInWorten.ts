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

const UNITA = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
const DIECI_19 = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
const DECINE = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];

/** Zahl 1–999 als italienisches Zahlwort (für die Erwachsenen-Prüfung). */
export function numeroInParole(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 999) throw new Error('Solo 1–999');
  const h = Math.floor(n / 100), r = n % 100;
  let out = h ? (h === 1 ? 'cento' : `${UNITA[h]}cento`) : '';
  if (r) {
    let w: string;
    if (r < 10) w = UNITA[r]!;
    else if (r < 20) w = DIECI_19[r - 10]!;
    else {
      const d = DECINE[Math.floor(r / 10)]!, u = r % 10;
      w = u === 0 ? d : (u === 1 || u === 8 ? d.slice(0, -1) : d) + (u === 3 ? 'tré' : UNITA[u]);
    }
    out += w;
  }
  return out;
}
