/**
 * Schriftliche Rechenverfahren (untereinander rechnen) mit Erklärung Stelle für Stelle.
 * Jeder Schritt bringt ein Kästchen-Bild mit, das die App wie auf kariertem Papier zeigt.
 */
import { L } from '../i18n';
import { MINUS, timesSign } from './parse';
import type { Grid, GridRow, Step } from './types';

/** Name der Stelle: 0 = Einer, 1 = Zehner … ; negativ = Nachkommastellen (−1 = Zehntel). */
export function placeName(p: number): string {
  const de = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender', 'Millionen'];
  const it = ['unità', 'decine', 'centinaia', 'migliaia', 'decine di migliaia', 'centinaia di migliaia', 'milioni'];
  const deD = ['Zehntel', 'Hundertstel', 'Tausendstel', 'Zehntausendstel'];
  const itD = ['decimi', 'centesimi', 'millesimi', 'decimillesimi'];
  if (p >= 0) return L(de[p] ?? `${p + 1}. Stelle`, it[p] ?? `${p + 1}ª cifra`);
  return L(deD[-p - 1] ?? 'Nachkommastelle', itD[-p - 1] ?? 'cifra decimale');
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Zahl (mit Punkt als Dezimaltrenner) → Ziffern ohne Komma + Anzahl Nachkommastellen. */
interface Fixed { digits: string; dec: number }
export function toFixed(s: string): Fixed {
  const [a, b = ''] = s.split('.');
  const digits = (a! + b).replace(/^0+(?=\d)/, '');
  return { digits, dec: b.length };
}
const scaleTo = (f: Fixed, dec: number) => f.digits + '0'.repeat(dec - f.dec);

/** Ziffern mit Komma; „·“ steht für ein noch leeres Kästchen. */
function withComma(digits: string, dec: number, pad = '0'): string {
  if (dec <= 0) return digits;
  const d = digits.padStart(dec + 1, pad);
  return `${d.slice(0, -dec)},${d.slice(-dec)}`;
}
function trimDec(s: string): string {
  return s.includes(',') ? s.replace(/0+$/, '').replace(/,$/, '') : s;
}

interface Line { text: string; kind?: GridRow['kind']; op?: string; rule?: boolean }

/**
 * Zeilen rechtsbündig in Kästchen setzen. Ein Komma bekommt ein eigenes Kästchen.
 * hlDigit = Ziffernstelle von rechts (0 = Einer bzw. letzte Nachkommastelle).
 */
function rightGrid(lines: Line[], dec: number, hlDigit?: number): Grid {
  const width = Math.max(...lines.map((r) => [...r.text].length + (r.op || r.kind === 'carry' ? 0 : 1)));
  const rows: GridRow[] = lines.map((r) => {
    const cells = [...r.text].map((c) => (c === '·' || c === ' ' ? '' : c));
    while (cells.length < width) cells.unshift('');
    if (r.op) cells[0] = r.op;
    return { cells, kind: r.kind, rule: r.rule };
  });
  let hl: number | undefined;
  if (hlDigit !== undefined) {
    const fromRight = hlDigit + (dec > 0 && hlDigit >= dec ? 1 : 0);
    hl = width - 1 - fromRight;
  }
  return { width, rows, hl };
}

/** Überträge-Zeile: Ziffernposition → Zeichen, mit Lücke an der Kommastelle. */
function carryLine(carries: Record<number, string>, positions: number, dec: number): Line {
  let s = '';
  for (let p = positions - 1; p >= 0; p--) {
    s += carries[p] ?? '·';
    if (dec > 0 && p === dec) s += '·';
  }
  return { text: s, kind: 'carry' };
}

// ───────────── Addition ─────────────

export function columnAdd(aStr: string, bStr: string): { steps: Step[]; result: string } {
  const A = toFixed(aStr), B = toFixed(bStr);
  const dec = Math.max(A.dec, B.dec);
  const a = scaleTo(A, dec), b = scaleTo(B, dec);
  const n = Math.max(a.length, b.length);
  const positions = Math.max(n, String(BigInt(a) + BigInt(b)).length) + 1;
  const carries: Record<number, string> = {};
  let res = '';
  const snap = (hl?: number) => rightGrid([
    carryLine(carries, positions, dec),
    { text: withComma(a, dec), kind: 'num' },
    { text: ' ' + withComma(b, dec), op: '+', kind: 'num' },
    { text: withComma(res, dec, '·'), kind: 'result', rule: true }
  ], dec, hl);
  const steps: Step[] = [{
    title: L('Schreibe die Zahlen untereinander', 'Scrivi i numeri in colonna'),
    text: dec > 0
      ? L('Komma unter Komma, Einer unter Einer. Wo hinter dem Komma eine Ziffer fehlt, denkst du dir eine 0.', 'Virgola sotto virgola, unità sotto unità. Dove dopo la virgola manca una cifra, immagina uno 0.')
      : L('Einer unter Einer, Zehner unter Zehner. Wir rechnen von rechts nach links.', 'Unità sotto unità, decine sotto decine. Si calcola da destra verso sinistra.'),
    grid: snap()
  }];
  let carry = 0;
  for (let i = 0; i < n; i++) {
    const da = Number(a[a.length - 1 - i] ?? 0), db = Number(b[b.length - 1 - i] ?? 0);
    const s = da + db + carry;
    const digit = s % 10, out = Math.floor(s / 10);
    const parts = [da, db, ...(carry ? [carry] : [])].join(' + ');
    let text = carry ? L(`Denk an den Übertrag ${carry}. `, `Ricorda il riporto ${carry}. `) : '';
    text += out
      ? L(`${parts} = ${s}. Schreibe ${digit} und merke dir ${out} als Übertrag für die nächste Stelle.`, `${parts} = ${s}. Scrivi ${digit} e riporta ${out} nella colonna successiva.`)
      : L(`${parts} = ${s}. Schreibe ${s}.`, `${parts} = ${s}. Scrivi ${s}.`);
    res = String(digit) + res;
    delete carries[i];
    if (out) carries[i + 1] = String(out);
    steps.push({ title: `${cap(placeName(i - dec))}: ${parts} = ${s}`, text, grid: snap(i) });
    carry = out;
  }
  if (carry) {
    res = String(carry) + res;
    delete carries[n];
    steps.push({ title: L('Übertrag ganz vorne', 'Riporto in testa'), text: L(`Der Übertrag ${carry} wird ganz vorne hingeschrieben.`, `Il riporto ${carry} si scrive davanti.`), grid: snap(n) });
  }
  return { steps, result: trimDec(withComma(res, dec)) };
}

// ───────────── Subtraktion ─────────────

export function columnSub(aStr: string, bStr: string): { steps: Step[]; result: string } {
  const A = toFixed(aStr), B = toFixed(bStr);
  const dec = Math.max(A.dec, B.dec);
  const a = scaleTo(A, dec), b = scaleTo(B, dec);
  const n = a.length;
  const marks: Record<number, string> = {};
  let res = '';
  const snap = (hl?: number) => rightGrid([
    carryLine(marks, n, dec),
    { text: withComma(a, dec), kind: 'num' },
    { text: ' ' + withComma(b, dec), op: MINUS, kind: 'num' },
    { text: withComma(res, dec, '·'), kind: 'result', rule: true }
  ], dec, hl);
  const steps: Step[] = [{
    title: L('Schreibe die Zahlen untereinander', 'Scrivi i numeri in colonna'),
    text: L('Die größere Zahl steht oben, Stelle unter Stelle. Wir rechnen von rechts nach links.', 'Il numero più grande va sopra, cifra sotto cifra. Si calcola da destra verso sinistra.'),
    grid: snap()
  }];
  let borrow = 0;
  for (let i = 0; i < n; i++) {
    const top = Number(a[n - 1 - i]), db = Number(b[b.length - 1 - i] ?? 0);
    let have = top - borrow;
    let text = '';
    let out = 0;
    if (borrow && top === 0) {
      // Eine 0 kann nichts abgeben: sie leiht sich selbst 1 von der nächsten Stelle
      out = 1;
      have = 9;
      text += L(`Hier steht eine 0, die schon 1 abgegeben hat. Sie holt sich selbst 1 von der nächsten Stelle: aus 0 wird 10, nach dem Abgeben bleibt 9. `,
        `Qui c’è uno 0 che ha già prestato 1. Lo 0 chiede a sua volta 1 alla colonna successiva: diventa 10 e, dopo il prestito, resta 9. `);
      marks[i] = '9';
      const next = Number(a[n - 2 - i] ?? 0);
      if (next > 0) marks[i + 1] = String(next - 1);
    } else {
      if (borrow) text += L(`Hier hast du 1 abgegeben: aus ${top} wird ${have}. `, `Qui hai prestato 1: il ${top} diventa ${have}. `);
      if (have < db) {
        out = 1;
        text += L(`${have} ${MINUS} ${db} geht nicht. Hol dir 1 von der nächsten Stelle (${placeName(i + 1 - dec)}): so wird aus ${have} eine ${have + 10}. `,
          `${have} ${MINUS} ${db} non si può. Chiedi in prestito 1 alla colonna vicina (${placeName(i + 1 - dec)}): così ${have} diventa ${have + 10}. `);
        have += 10;
        const next = Number(a[n - 2 - i] ?? 0);
        if (next > 0) marks[i + 1] = String(next - 1);
      }
    }
    const d = have - db;
    const leadingZero = i === n - 1 && i > 0 && d === 0 && i >= dec;
    text += leadingZero
      ? L(`${have} ${MINUS} ${db} = 0. Eine 0 ganz vorne schreibt man nicht.`, `${have} ${MINUS} ${db} = 0. Uno 0 all’inizio non si scrive.`)
      : L(`${have} ${MINUS} ${db} = ${d}. Schreibe ${d}.`, `${have} ${MINUS} ${db} = ${d}. Scrivi ${d}.`);
    if (!leadingZero) res = String(d) + res;
    steps.push({ title: `${cap(placeName(i - dec))}: ${have} ${MINUS} ${db} = ${d}`, text, grid: snap(i) });
    borrow = out;
  }
  const result = trimDec(withComma(res, dec).replace(/^0+(?=\d)/, ''));
  return { steps, result };
}

// ───────────── Multiplikation ─────────────

export function columnMul(aStr: string, bStr: string): { steps: Step[]; result: string } {
  const A = toFixed(aStr), B = toFixed(bStr);
  // Die längere Zahl kommt nach oben
  const [P, Q] = A.digits.length >= B.digits.length ? [A, B] : [B, A];
  const dec = P.dec + Q.dec;
  const p = P.digits, q = Q.digits;
  const T = timesSign();
  const product = String(BigInt(p) * BigInt(q));
  const head: Line[] = [{ text: p, kind: 'num' }, { text: ' ' + q, op: T, kind: 'num' }];
  const steps: Step[] = [];
  const intro = dec > 0
    ? L(' Das Komma lassen wir erst einmal weg und setzen es am Ende.', ' Per ora ignoriamo la virgola: la mettiamo alla fine.')
    : '';

  if (q.length === 1) {
    const qd = Number(q);
    let res = '', carry = 0;
    const carries: Record<number, string> = {};
    const snap = (hl?: number) => rightGrid([carryLine(carries, p.length + 1, 0), ...head, { text: res, kind: 'result', rule: true }], 0, hl);
    steps.push({ title: L('Aufgabe untereinander schreiben', 'Scrivi l’operazione in colonna'), text: L(`Wir nehmen jede Ziffer von ${p} mal ${qd}, von rechts nach links.`, `Moltiplichiamo ogni cifra di ${p} per ${qd}, da destra verso sinistra.`) + intro, grid: snap() });
    for (let i = 0; i < p.length; i++) {
      const d = Number(p[p.length - 1 - i]);
      const s = d * qd + carry;
      const digit = s % 10, out = Math.floor(s / 10);
      const last = i === p.length - 1;
      const calc = carry ? `${d} ${T} ${qd} + ${carry} = ${s}` : `${d} ${T} ${qd} = ${s}`;
      let text = carry ? L(`${d} ${T} ${qd} = ${d * qd}, plus Übertrag ${carry} = ${s}. `, `${d} ${T} ${qd} = ${d * qd}, più il riporto ${carry} = ${s}. `) : `${calc}. `;
      if (last) text += L(`Das ist die letzte Ziffer: schreibe ${s}.`, `È l’ultima cifra: scrivi ${s}.`);
      else text += out ? L(`Schreibe ${digit}, merke dir ${out}.`, `Scrivi ${digit} e riporta ${out}.`) : L(`Schreibe ${digit}.`, `Scrivi ${digit}.`);
      res = (last ? String(s) : String(digit)) + res;
      delete carries[i];
      if (!last && out) carries[i + 1] = String(out);
      steps.push({ title: `${cap(placeName(i))}: ${calc}`, text, grid: snap(i) });
      carry = out;
    }
    const result = trimDec(withComma(res, dec));
    if (dec > 0) steps.push(commaStep(res, dec, P.dec, Q.dec, result));
    return { steps, result };
  }

  // Mehrstellig: Teilprodukte untereinander, dann addieren
  steps.push({
    title: L('Aufgabe untereinander schreiben', 'Scrivi l’operazione in colonna'),
    text: L(`Wir rechnen ${p} mal jede Ziffer von ${q} einzeln. Jede neue Zeile rückt eine Stelle nach links (die 0 am Ende hält den Platz frei).`,
      `Moltiplichiamo ${p} per ogni cifra di ${q}, una alla volta. Ogni nuova riga si sposta di un posto a sinistra (lo 0 in fondo tiene il posto).`) + intro,
    grid: rightGrid([...head, { text: product.replace(/./g, '·'), rule: true }], 0)
  });
  const partials: string[] = [];
  for (let i = 0; i < q.length; i++) {
    const d = Number(q[q.length - 1 - i]);
    const plain = String(BigInt(p) * BigInt(d));
    const prod = plain + '0'.repeat(i);
    partials.push(prod);
    const rows: Line[] = [...head, ...partials.map((t, k) => ({ text: t, kind: (k === i ? 'new' : 'num') as GridRow['kind'], rule: k === 0 })), { text: product.replace(/./g, '·') }];
    steps.push({
      title: `${p} ${T} ${d}${i ? ` ${placeName(i)}` : ''} = ${prod}`,
      text: i === 0
        ? L(`Zuerst mal die Einer: ${p} ${T} ${d} = ${prod}.`, `Prima per le unità: ${p} ${T} ${d} = ${prod}.`)
        : L(`Jetzt mal ${d} ${placeName(i)}: ${p} ${T} ${d} = ${plain}. Weil es ${placeName(i)} sind, kommt${i === 1 ? ' eine 0' : ` ${'0'.repeat(i)}`} dahinter: ${prod}.`,
          `Ora per ${d} ${placeName(i)}: ${p} ${T} ${d} = ${plain}. Sono ${placeName(i)}, quindi si aggiunge ${i === 1 ? 'uno 0' : `${'0'.repeat(i)}`} in fondo: ${prod}.`),
      grid: rightGrid(rows, 0)
    });
  }
  steps.push({
    title: L('Teilergebnisse addieren', 'Somma i risultati parziali'),
    text: `${partials.join(' + ')} = ${product}`,
    grid: rightGrid([...head, ...partials.map((t, k) => ({ text: t, kind: 'num' as const, rule: k === 0 })), { text: product, kind: 'result', rule: true }], 0)
  });
  const result = trimDec(withComma(product, dec));
  if (dec > 0) steps.push(commaStep(product, dec, P.dec, Q.dec, result));
  return { steps, result };
}

function commaStep(digits: string, dec: number, d1: number, d2: number, result: string): Step {
  const placed = withComma(digits, dec);
  const tail = placed !== result ? ` = ${result}` : '';
  return {
    title: L('Komma setzen', 'Metti la virgola'),
    text: L(`Die beiden Zahlen haben zusammen ${d1} + ${d2} = ${dec} Stellen hinter dem Komma. Also bekommt auch das Ergebnis ${dec} Stellen hinter dem Komma: ${placed}${tail}.`,
      `I due numeri hanno in tutto ${d1} + ${d2} = ${dec} cifre dopo la virgola. Quindi anche il risultato ha ${dec} cifre dopo la virgola: ${placed}${tail}.`)
  };
}

// ───────────── Division ─────────────

export function columnDiv(dividend: number, divisor: number): { steps: Step[]; quotient: number; rest: number } {
  const ds = String(dividend);
  const head = `${ds}:${divisor}=`;
  const q = Math.floor(dividend / divisor);
  const rest = dividend % divisor;
  const width = head.length + String(q).length + 2;
  const work: { text: string; start: number; kind?: GridRow['kind']; rule?: boolean; op?: string }[] = [];
  let quotient = '';
  const snap = (hl?: number): Grid => {
    const first: string[] = Array(width).fill('');
    [...head, ...quotient].forEach((c, k) => { first[k + 1] = c; });
    const rows: GridRow[] = [{ cells: first, kind: 'num' }];
    for (const w of work) {
      const cells: string[] = Array(width).fill('');
      [...w.text].forEach((c, k) => { cells[w.start + k + 1] = c; });
      if (w.op) cells[w.start] = w.op;
      rows.push({ cells, kind: w.kind, rule: w.rule });
    }
    return { width, rows, hl: hl === undefined ? undefined : hl + 1 };
  };
  const steps: Step[] = [{
    title: L('Aufgabe aufschreiben', 'Scrivi l’operazione'),
    text: L(`Wir teilen ${ds} Stück für Stück durch ${divisor}, von links nach rechts.`, `Dividiamo ${ds} per ${divisor} un pezzo alla volta, da sinistra verso destra.`),
    grid: snap()
  }];
  let cur = 0;
  let started = false;
  for (let i = 0; i < ds.length; i++) {
    cur = cur * 10 + Number(ds[i]);
    if (!started && cur < divisor && i < ds.length - 1) continue; // zu klein: nächste Ziffer dazunehmen
    const k = Math.floor(cur / divisor);
    const prod = k * divisor;
    const r = cur - prod;
    let text = '';
    if (!started && i > 0) text += L(`${divisor} passt nicht in ${ds.slice(0, i)}. Also nehmen wir die ersten ${i + 1} Ziffern: ${cur}. `, `${divisor} non sta in ${ds.slice(0, i)}. Quindi prendiamo le prime ${i + 1} cifre: ${cur}. `);
    else if (started) text += L(`Hole die nächste Ziffer ${ds[i]} herunter: ${cur}. `, `Abbassa la cifra successiva, ${ds[i]}: ${cur}. `);
    text += k === 0
      ? L(`${divisor} passt 0-mal in ${cur}. Schreibe 0 ins Ergebnis.`, `${divisor} sta 0 volte in ${cur}. Scrivi 0 nel risultato.`)
      : L(`Wie oft passt ${divisor} in ${cur}? ${k}-mal, denn ${k} ${timesSign()} ${divisor} = ${prod}. Schreibe ${k} ins Ergebnis. Rest: ${cur} ${MINUS} ${prod} = ${r}.`,
        `Quante volte sta ${divisor} in ${cur}? ${k} ${k === 1 ? 'volta' : 'volte'}, perché ${k} ${timesSign()} ${divisor} = ${prod}. Scrivi ${k} nel risultato. Resto: ${cur} ${MINUS} ${prod} = ${r}.`);
    quotient += String(k);
    // Der letzte Rest bekommt die heruntergeholte Ziffer
    const last = work[work.length - 1];
    if (last) { last.text = String(cur); last.start = i - String(cur).length + 1; }
    work.push({ text: String(prod), start: i - String(prod).length + 1, op: MINUS, kind: 'num' });
    work.push({ text: String(r), start: i - String(r).length + 1, rule: true, kind: 'new' });
    steps.push({ title: `${cur} : ${divisor} = ${k}${r ? ` (${L('Rest', 'resto')} ${r})` : ''}`, text, grid: snap(i) });
    started = true;
    cur = r;
  }
  return { steps, quotient: q, rest };
}
