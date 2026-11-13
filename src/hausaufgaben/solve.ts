/**
 * Hausaufgaben-Erklärer: löst eine Matheaufgabe und erklärt sie Schritt für Schritt.
 * Läuft komplett auf dem Gerät, ohne Internet und ohne KI-Dienst.
 *
 * Unterstützt: Grundrechenarten (Kopfrechnen bis 20, Einmaleins, schriftlich mit Überträgen,
 * Division mit Rest), Dezimalzahlen, Rechenausdrücke mit Klammern (Punkt vor Strich),
 * Brüche, Potenzen, Prozent („20 % von 150“), Platzhalter („7 + ? = 15“) und lineare Gleichungen.
 */
import { L } from '../i18n';
import { add, div, eq, fmt, isInt, isZero, lcm, mul, neg as rneg, rat, sub, terminatingDigits, toNum, type R } from './rational';
import { MINUS, ParseError, normalize, opSign, parseTask, show, showNum, timesSign, type Node, type Op, type Parsed } from './parse';
import { columnAdd, columnDiv, columnMul, columnSub } from './columns';
import type { Solution, SolveResult, Step } from './types';

export function solveTask(raw: string): SolveResult {
  let p: Parsed;
  try {
    p = parseTask(raw);
  } catch (e) {
    if (e instanceof ParseError) return { ok: false, reason: L('Diese Aufgabe kann ich nicht lesen. Prüfe, ob alle Zahlen und Rechenzeichen stimmen.', 'Non riesco a leggere questo esercizio. Controlla che numeri e segni siano giusti.') };
    return { ok: false, reason: L('Die Zahlen sind zu groß für mich.', 'I numeri sono troppo grandi per me.') };
  }
  try {
    const sol = p.hasVar ? solveEquation(p) : p.right ? solveCheck(p) : solveExpression(p);
    return sol;
  } catch (e) {
    const m = (e as Error).message;
    if (m === 'div0') return { ok: false, reason: L('Durch 0 kann man nicht teilen.', 'Non si può dividere per 0.') };
    if (m === 'nonlinear') return { ok: false, reason: L('Diese Gleichung ist zu schwer für mich (x kommt mit Hochzahl oder mehrfach multipliziert vor).', 'Questa equazione è troppo difficile per me (la x compare con un esponente o moltiplicata per sé stessa).') };
    if (m === 'big') return { ok: false, reason: L('Die Zahlen sind zu groß für mich.', 'I numeri sono troppo grandi per me.') };
    return { ok: false, reason: L('Diese Aufgabe kann ich leider noch nicht erklären.', 'Questo esercizio non so ancora spiegarlo.') };
  }
}

// ───────────── Hilfen ─────────────

const numStr = (v: R) => (isInt(v) ? String(v.n) : fmt(v).replace(',', '.'));
const isPlainNum = (n: Node): n is Extract<Node, { t: 'num' }> => n.t === 'num' && !n.frac && !n.pct && !n.br;

/** Wert eines Ausdrucks ohne Unbekannte */
export function evaluate(n: Node): R {
  switch (n.t) {
    case 'num': return n.v;
    case 'var': throw new Error('var');
    case 'neg': return rneg(evaluate(n.e));
    case 'pow': return powR(evaluate(n.b), n.e);
    case 'bin': {
      const a = evaluate(n.l), b = evaluate(n.r);
      return n.op === '+' ? add(a, b) : n.op === '-' ? sub(a, b) : n.op === '*' ? mul(a, b) : div(a, b);
    }
  }
}
function powR(b: R, e: number): R { let r = rat(1); for (let i = 0; i < e; i++) r = mul(r, b); return r; }

function solution(s: Omit<Solution, 'answer'> & { answer?: string }, preferFraction: boolean): SolveResult {
  const answer = s.answer ?? (s.value ? showNum(s.value, preferFraction) : '');
  return { ok: true, solution: { ...s, answer } };
}

// ───────────── Einzelne Rechnung ─────────────

function solveExpression(p: Parsed): SolveResult {
  const e = p.left;
  if (p.percent) return solvePercent(p.percent.p, p.percent.of);
  if (e.t === 'bin' && isPlainNum(e.l) && isPlainNum(e.r) && e.l.v.n >= 0 && e.r.v.n >= 0) {
    const r = solveSingle(e.op, e.l.v, e.r.v);
    if (r) return r;
  }
  return reduceExpression(p);
}

function solveSingle(op: Op, a: R, b: R): SolveResult | null {
  const A = numStr(a), B = numStr(b);
  const ints = isInt(a) && isInt(b);
  const T = timesSign();
  const task = `${showNum(a)} ${opSign(op)} ${showNum(b)}`;
  if (op === '+') {
    const v = add(a, b);
    if (ints && v.n <= 20) return solution({ kind: L('Plusrechnen', 'Addizione'), task, steps: mentalAdd(a.n, b.n), value: v }, false);
    const c = columnAdd(A, B);
    return solution({ kind: L('Schriftliche Addition', 'Addizione in colonna'), task, steps: c.steps, value: v }, false);
  }
  if (op === '-') {
    const v = sub(a, b);
    if (v.n < 0) return null;
    if (ints && a.n <= 20) return solution({ kind: L('Minusrechnen', 'Sottrazione'), task, steps: mentalSub(a.n, b.n), value: v }, false);
    const c = columnSub(A, B);
    c.steps.push({ title: L('Probe', 'Prova'), text: L(`Rechne zur Kontrolle plus: ${c.result} + ${showNum(b)} = ${showNum(a)}.`, `Per controllare fai l’addizione: ${c.result} + ${showNum(b)} = ${showNum(a)}.`) });
    return solution({ kind: L('Schriftliche Subtraktion', 'Sottrazione in colonna'), task, steps: c.steps, value: v }, false);
  }
  if (op === '*') {
    const v = mul(a, b);
    if (ints && a.n <= 10 && b.n <= 10) return solution({ kind: L('Einmaleins', 'Tabelline'), task, steps: tableMul(a.n, b.n), value: v }, false);
    if (ints && (isPow10(b.n) || isPow10(a.n)) && Math.min(a.n, b.n) >= 10) {
      const [x, ten] = isPow10(b.n) ? [a.n, b.n] : [b.n, a.n];
      const zeros = String(ten).length - 1;
      return solution({ kind: L('Mal 10, 100, 1000', 'Per 10, 100, 1000'), task, value: v, steps: [{
        title: `${x} ${T} ${ten} = ${v.n}`,
        text: L(`Mal ${ten} heißt: jede Ziffer rückt ${zeros} ${zeros === 1 ? 'Stelle' : 'Stellen'} nach links. Du hängst einfach ${zeros === 1 ? 'eine 0' : `${zeros} Nullen`} an: ${v.n}.`,
          `Per ${ten} vuol dire: ogni cifra si sposta di ${zeros} ${zeros === 1 ? 'posto' : 'posti'} a sinistra. Basta aggiungere ${zeros === 1 ? 'uno 0' : `${zeros} zeri`} in fondo: ${v.n}.`)
      }] }, false);
    }
    const c = columnMul(A, B);
    return solution({ kind: L('Schriftliche Multiplikation', 'Moltiplicazione in colonna'), task, steps: c.steps, value: v }, false);
  }
  // Division
  if (isZero(b)) throw new Error('div0');
  if (!ints) return null;
  if (a.n <= 100 && b.n <= 10 && a.n % b.n === 0) {
    const k = a.n / b.n;
    return solution({ kind: L('Geteiltrechnen', 'Divisione'), task, value: rat(k), steps: [
      { title: L('Denke an das Einmaleins', 'Pensa alle tabelline'), text: L(`Frage dich: Welche Zahl mal ${b.n} ergibt ${a.n}?`, `Chiediti: quale numero per ${b.n} fa ${a.n}?`) },
      { title: `${k} ${T} ${b.n} = ${a.n}`, text: L(`Also ist ${a.n} : ${b.n} = ${k}.`, `Quindi ${a.n} : ${b.n} = ${k}.`) }
    ] }, false);
  }
  if (b.n > 9999) return null;
  const c = columnDiv(a.n, b.n);
  const restTxt = c.rest ? ` ${L('Rest', 'resto')} ${c.rest}` : '';
  c.steps.push({
    title: L('Probe', 'Prova'),
    text: c.rest
      ? L(`${c.quotient} ${T} ${b.n} + ${c.rest} = ${a.n}. Es bleibt ein Rest von ${c.rest}, weil ${c.rest} kleiner als ${b.n} ist.`, `${c.quotient} ${T} ${b.n} + ${c.rest} = ${a.n}. Resta ${c.rest}, perché ${c.rest} è più piccolo di ${b.n}.`)
      : L(`${c.quotient} ${T} ${b.n} = ${a.n}. Es geht ohne Rest auf.`, `${c.quotient} ${T} ${b.n} = ${a.n}. Non c’è resto.`)
  });
  return solution({ kind: L('Schriftliche Division', 'Divisione in colonna'), task, steps: c.steps, value: rat(c.quotient), rest: c.rest, answer: `${c.quotient}${restTxt}` }, false);
}

const isPow10 = (n: number) => n >= 10 && /^10+$/.test(String(n));

function mentalAdd(a: number, b: number): Step[] {
  const s = a + b;
  if (a < 10 && s > 10) {
    const fill = 10 - a, restB = b - fill;
    return [
      { title: L(`Erst bis zur 10`, `Prima arriva a 10`), text: L(`${a} + ${fill} = 10. Von der ${b} hast du ${fill} schon benutzt, es bleiben ${restB}.`, `${a} + ${fill} = 10. Del ${b} hai già usato ${fill}, ne restano ${restB}.`), expr: `${a} + ${fill} + ${restB}` },
      { title: L('Dann den Rest dazu', 'Poi aggiungi il resto'), text: `10 + ${restB} = ${s}`, expr: String(s) }
    ];
  }
  return [{ title: `${a} + ${b} = ${s}`, text: L(`Zähle von ${Math.max(a, b)} aus ${Math.min(a, b)} weiter: ${s}.`, `Parti da ${Math.max(a, b)} e conta avanti di ${Math.min(a, b)}: ${s}.`), expr: String(s) }];
}

function mentalSub(a: number, b: number): Step[] {
  const d = a - b;
  if (a > 10 && d < 10 && b > a - 10) {
    const first = a - 10, rest = b - first;
    return [
      { title: L('Erst bis zur 10', 'Prima arriva a 10'), text: L(`${a} ${MINUS} ${first} = 10. Von der ${b} hast du ${first} schon abgezogen, es bleiben ${rest}.`, `${a} ${MINUS} ${first} = 10. Del ${b} hai già tolto ${first}, ne restano ${rest}.`), expr: `${a} ${MINUS} ${first} ${MINUS} ${rest}` },
      { title: L('Dann den Rest weg', 'Poi togli il resto'), text: `10 ${MINUS} ${rest} = ${d}`, expr: String(d) }
    ];
  }
  return [{ title: `${a} ${MINUS} ${b} = ${d}`, text: L(`Zähle von ${a} aus ${b} zurück: ${d}. Probe: ${d} + ${b} = ${a}.`, `Parti da ${a} e conta indietro di ${b}: ${d}. Prova: ${d} + ${b} = ${a}.`), expr: String(d) }];
}

function tableMul(a: number, b: number): Step[] {
  const T = timesSign();
  const p = a * b;
  if (a === 0 || b === 0) return [{ title: `${a} ${T} ${b} = 0`, text: L('Alles mal 0 ergibt 0.', 'Qualsiasi numero per 0 fa 0.') }];
  const times = Math.min(a, b), n = Math.max(a, b);
  if (times <= 5) {
    return [{ title: L(`${times}-mal die ${n}`, `${times} volte ${n}`), text: L(`${a} ${T} ${b} heißt ${times}-mal die ${n} zusammenzählen: ${Array(times).fill(n).join(' + ')} = ${p}.`, `${a} ${T} ${b} vuol dire sommare ${n} per ${times} volte: ${Array(times).fill(n).join(' + ')} = ${p}.`), expr: String(p) }];
  }
  const rest = times - 5;
  return [
    { title: L('Zerlegen mit der 5', 'Spezza con il 5'), text: L(`${times} = 5 + ${rest}. Erst 5 ${T} ${n} = ${5 * n}.`, `${times} = 5 + ${rest}. Prima 5 ${T} ${n} = ${5 * n}.`) },
    { title: L(`Dann ${rest} ${T} ${n}`, `Poi ${rest} ${T} ${n}`), text: `${rest} ${T} ${n} = ${rest * n}` },
    { title: L('Zusammenzählen', 'Somma'), text: `${5 * n} + ${rest * n} = ${p}`, expr: String(p) }
  ];
}

function solvePercent(pct: R, of: R): SolveResult {
  const T = timesSign();
  const one = div(of, rat(100));
  const v = mul(one, pct);
  const P = showNum(pct), O = showNum(of);
  return solution({
    kind: L('Prozentrechnung', 'Percentuale'), task: `${P} % ${L('von', 'di')} ${O}`, value: v,
    steps: [
      { title: L('1 % ausrechnen', 'Calcola l’1 %'), text: L(`Prozent heißt „von Hundert“. 1 % ist der hundertste Teil: ${O} : 100 = ${showNum(one)}.`, `Percento vuol dire “su cento”. L’1 % è la centesima parte: ${O} : 100 = ${showNum(one)}.`) },
      { title: L(`Mal ${P}`, `Per ${P}`), text: `${P} % = ${showNum(one)} ${T} ${P} = ${showNum(v)}`, expr: showNum(v) }
    ]
  }, false);
}

// ───────────── Rechenausdrücke (Klammern, Punkt vor Strich, Brüche) ─────────────

type Path = ('l' | 'r' | 'e' | 'b')[];
interface Cand { path: Path; depth: number; rank: number; idx: number; br: string | null }

function candidates(n: Node): Cand[] {
  const out: Cand[] = [];
  let idx = 0;
  const walk = (x: Node, path: Path, depth: number, br: string | null) => {
    const d = depth + (x.br ? 1 : 0);
    const b = x.br ?? br;
    if (x.t === 'bin') {
      walk(x.l, [...path, 'l'], d, b);
      if (x.l.t === 'num' && x.r.t === 'num') out.push({ path, depth: d, rank: x.op === '*' || x.op === ':' ? 2 : 1, idx: idx++, br: b });
      walk(x.r, [...path, 'r'], d, b);
    } else if (x.t === 'neg') {
      if (x.e.t === 'num') out.push({ path, depth: d, rank: 4, idx: idx++, br: b });
      else walk(x.e, [...path, 'e'], d, b);
    } else if (x.t === 'pow') {
      if (x.b.t === 'num') out.push({ path, depth: d, rank: 3, idx: idx++, br: b });
      else walk(x.b, [...path, 'b'], d, b);
    }
  };
  walk(n, [], 0, null);
  return out;
}
function getAt(n: Node, path: Path): Node {
  return path.reduce<Node>((x, k) => (x as Record<string, unknown>)[k] as Node, n);
}
function setAt(n: Node, path: Path, v: Node): Node {
  if (!path.length) return v;
  const [k, ...rest] = path;
  return { ...n, [k!]: setAt((n as Record<string, unknown>)[k!] as Node, rest, v) } as Node;
}
function hasOps(n: Node, ranks: number[]): boolean {
  if (n.t === 'bin') return ranks.includes(n.op === '*' || n.op === ':' ? 2 : 1) || hasOps(n.l, ranks) || hasOps(n.r, ranks);
  if (n.t === 'neg') return hasOps(n.e, ranks);
  if (n.t === 'pow') return ranks.includes(3) || hasOps(n.b, ranks);
  return false;
}
function countOps(n: Node): number {
  if (n.t === 'bin') return 1 + countOps(n.l) + countOps(n.r);
  if (n.t === 'neg') return n.e.t === 'num' ? 0 : countOps(n.e);
  if (n.t === 'pow') return 1 + countOps(n.b);
  return 0;
}
/** Klammern um einzelne positive Zahlen sind nach dem Ausrechnen überflüssig */
function tidy(n: Node): Node {
  switch (n.t) {
    case 'num': return n.br && n.v.n >= 0 ? { ...n, br: undefined } : n;
    case 'bin': return { ...n, l: tidy(n.l), r: tidy(n.r) };
    case 'neg': return { ...n, e: tidy(n.e) };
    case 'pow': return { ...n, b: tidy(n.b) };
    default: return n;
  }
}

const BR_NAME: Record<string, () => string> = {
  '(': () => L('runden Klammer', 'parentesi tonda'),
  '[': () => L('eckigen Klammer', 'parentesi quadra'),
  '{': () => L('geschweiften Klammer', 'parentesi graffa')
};

function reduceExpression(p: Parsed): SolveResult {
  const pf = p.fractions;
  let cur = tidy(p.left);
  const task = show(cur, pf);
  const steps: Step[] = [];
  for (let guard = 0; guard < 40; guard++) {
    if (cur.t === 'num') break;
    const cs = candidates(cur);
    if (!cs.length) throw new Error('stuck');
    cs.sort((a, b) => b.depth - a.depth || b.rank - a.rank || a.idx - b.idx);
    const c = cs[0]!;
    const node = getAt(cur, c.path);
    const { value, calc, detail } = reduceOne(node, pf);
    const replaced: Node = { t: 'num', v: value, br: node.br && value.n < 0 && c.path.length ? '(' : undefined };
    const next = tidy(setAt(cur, c.path, replaced));
    let why: string;
    if (c.depth > 0 && countOps(cur) > 1) {
      why = L(`Zuerst rechnest du in der ${BR_NAME[c.br ?? '(']!()}.`, `Prima si calcola dentro la ${BR_NAME[c.br ?? '(']!()}.`);
    } else if (c.rank === 3) {
      why = L('Potenzen rechnest du vor Mal/Geteilt und Plus/Minus.', 'Le potenze si calcolano prima di moltiplicazioni, divisioni, addizioni e sottrazioni.');
    } else if (c.rank === 2 && hasOps(cur, [1])) {
      why = L('Punkt vor Strich: Mal und Geteilt kommen vor Plus und Minus.', 'Prima moltiplicazioni e divisioni, poi addizioni e sottrazioni.');
    } else if (countOps(cur) > 1) {
      why = L('Von links nach rechts.', 'Da sinistra verso destra.');
    } else {
      why = steps.length ? L('Letzter Rechenschritt.', 'Ultimo calcolo.') : '';
    }
    steps.push({ title: calc, text: [why, detail].filter(Boolean).join(' ') || undefined, expr: show(next, pf) });
    cur = next;
  }
  if (cur.t !== 'num') throw new Error('stuck');
  const value = cur.v;
  // Bruch, der kein schöner Dezimalbruch ist: zusätzlich Dezimal-Näherung nennen
  if (!isInt(value) && !pf && terminatingDigits(value) < 0) {
    steps.push({ title: L('Als Bruch', 'Come frazione'), text: L(`Das Ergebnis ist der Bruch ${showNum(value)} (ungefähr ${toNum(value).toFixed(2).replace('.', ',')}).`, `Il risultato è la frazione ${showNum(value)} (circa ${toNum(value).toFixed(2).replace('.', ',')}).`) });
  }
  return solution({ kind: pf ? L('Rechnen mit Brüchen', 'Calcolo con le frazioni') : L('Rechenausdruck', 'Espressione'), task, steps, value }, pf);
}

/** Einen einzelnen Rechenschritt ausführen und erklären. */
function reduceOne(n: Node, pf: boolean): { value: R; calc: string; detail?: string } {
  const T = timesSign();
  if (n.t === 'neg') {
    const v = rneg((n.e as Extract<Node, { t: 'num' }>).v);
    return { value: v, calc: `${MINUS}${show(n.e, pf, false)} = ${showNum(v, pf)}` };
  }
  if (n.t === 'pow') {
    const b = (n.b as Extract<Node, { t: 'num' }>).v;
    const v = powR(b, n.e);
    const bs = show({ ...n.b, br: b.n < 0 || !isInt(b) ? '(' : undefined } as Node, pf);
    return { value: v, calc: `${show({ ...n, br: undefined }, pf)} = ${showNum(v, pf)}`, detail: n.e >= 2 && n.e <= 5 ? `${Array(n.e).fill(bs).join(` ${T} `)} = ${showNum(v, pf)}.` : undefined };
  }
  if (n.t !== 'bin') throw new Error('stuck');
  const a = (n.l as Extract<Node, { t: 'num' }>).v, b = (n.r as Extract<Node, { t: 'num' }>).v;
  if (n.op === ':' && isZero(b)) throw new Error('div0');
  const value = n.op === '+' ? add(a, b) : n.op === '-' ? sub(a, b) : n.op === '*' ? mul(a, b) : div(a, b);
  const calc = `${show({ ...n, br: undefined }, pf)} = ${showNum(value, pf)}`;
  let detail: string | undefined;
  const fracInvolved = pf && (!isInt(a) || !isInt(b));
  if (fracInvolved) detail = fractionDetail(n.op, a, b, value);
  else if (a.n < 0 || b.n < 0 || value.n < 0) detail = signDetail(n.op, a, b);
  return { value, calc, detail };
}

function fs(v: R): string { return v.d === 1 ? showNum(v) : `${v.n < 0 ? MINUS : ''}${Math.abs(v.n)}/${v.d}`; }

function fractionDetail(op: Op, a: R, b: R, value: R): string {
  const T = timesSign();
  const reduced = (n: number, d: number) => {
    const r = rat(n, d);
    return r.n !== n || r.d !== d ? L(` Kürzen: ${n}/${d} = ${fs(r)}.`, ` Semplifica: ${n}/${d} = ${fs(r)}.`) : '';
  };
  if (op === '+' || op === '-') {
    const m = lcm(a.d, b.d);
    const an = a.n * (m / a.d), bn = b.n * (m / b.d);
    const rn = op === '+' ? an + bn : an - bn;
    const same = a.d === b.d;
    const head = same
      ? L(`Die Nenner sind gleich (${m}): Zähler ${op === '+' ? 'addieren' : 'subtrahieren'}, Nenner bleibt.`, `I denominatori sono uguali (${m}): ${op === '+' ? 'sommi' : 'sottrai'} i numeratori, il denominatore resta.`)
      : L(`Erst auf den gleichen Nenner bringen. Der kleinste gemeinsame Nenner von ${a.d} und ${b.d} ist ${m}: ${fs(a)} = ${an}/${m} und ${fs(b)} = ${bn}/${m}.`, `Prima porta le frazioni allo stesso denominatore. Il minimo comune denominatore di ${a.d} e ${b.d} è ${m}: ${fs(a)} = ${an}/${m} e ${fs(b)} = ${bn}/${m}.`);
    return `${head} ${an}/${m} ${opSign(op)} ${bn}/${m} = ${rn}/${m}.${reduced(rn, m)}`;
  }
  if (op === '*') {
    return L(`Zähler mal Zähler, Nenner mal Nenner: (${a.n} ${T} ${b.n})/(${a.d} ${T} ${b.d}) = ${a.n * b.n}/${a.d * b.d}.`, `Numeratore per numeratore, denominatore per denominatore: (${a.n} ${T} ${b.n})/(${a.d} ${T} ${b.d}) = ${a.n * b.n}/${a.d * b.d}.`) + reduced(a.n * b.n, a.d * b.d);
  }
  const inv = rat(b.d, b.n);
  return L(`Durch einen Bruch teilen heißt: mit dem Kehrwert malnehmen. ${fs(a)} : ${fs(b)} = ${fs(a)} ${T} ${fs(inv)} = ${fs(value)}.`, `Dividere per una frazione vuol dire moltiplicare per la sua inversa. ${fs(a)} : ${fs(b)} = ${fs(a)} ${T} ${fs(inv)} = ${fs(value)}.`);
}

function signDetail(op: Op, a: R, b: R): string | undefined {
  if (op === '*' || op === ':') {
    const negs = (a.n < 0 ? 1 : 0) + (b.n < 0 ? 1 : 0);
    if (!negs) return undefined;
    return negs === 2
      ? L('Minus mal Minus ergibt Plus.', 'Meno per meno fa più.')
      : L('Plus mal Minus ergibt Minus.', 'Più per meno fa meno.');
  }
  if (op === '-' && b.n < 0) return L(`Minus eine negative Zahl ist dasselbe wie plus ${showNum(rneg(b))}.`, `Togliere un numero negativo è come aggiungere ${showNum(rneg(b))}.`);
  if (op === '-' && a.n >= 0 && sub(a, b).n < 0) return L(`Du ziehst mehr ab, als da ist: das Ergebnis ist negativ.`, `Togli più di quello che c’è: il risultato è negativo.`);
  return undefined;
}

// ───────────── Aufgabe mit Ergebnis (zum Kontrollieren) ─────────────

function solveCheck(p: Parsed): SolveResult {
  const rightVal = evaluate(p.right!);
  const res = solveExpression({ ...p, right: undefined });
  if (!res.ok) return res;
  const correct = res.solution.value ? eq(res.solution.value, rightVal) : false;
  return { ok: true, solution: { ...res.solution, check: { written: show(p.right!, p.fractions), correct } } };
}

// ───────────── Gleichungen ─────────────

/** a·x + b */
interface Lin { a: R; b: R }
function linearize(n: Node): Lin {
  switch (n.t) {
    case 'num': return { a: rat(0), b: n.v };
    case 'var': return { a: rat(1), b: rat(0) };
    case 'neg': { const e = linearize(n.e); return { a: rneg(e.a), b: rneg(e.b) }; }
    case 'pow': {
      const e = linearize(n.b);
      if (!isZero(e.a)) { if (n.e === 1) return e; throw new Error('nonlinear'); }
      return { a: rat(0), b: powR(e.b, n.e) };
    }
    case 'bin': {
      const l = linearize(n.l), r = linearize(n.r);
      if (n.op === '+') return { a: add(l.a, r.a), b: add(l.b, r.b) };
      if (n.op === '-') return { a: sub(l.a, r.a), b: sub(l.b, r.b) };
      if (n.op === '*') {
        if (!isZero(l.a) && !isZero(r.a)) throw new Error('nonlinear');
        return isZero(l.a) ? { a: mul(r.a, l.b), b: mul(r.b, l.b) } : { a: mul(l.a, r.b), b: mul(l.b, r.b) };
      }
      if (!isZero(r.a)) throw new Error('nonlinear');
      if (isZero(r.b)) throw new Error('div0');
      return { a: div(l.a, r.b), b: div(l.b, r.b) };
    }
  }
}

function showLin(l: Lin, pf: boolean, v = 'x'): string {
  const parts: string[] = [];
  if (!isZero(l.a)) {
    const c = l.a;
    const cs = eq(c, rat(1)) ? '' : eq(c, rat(-1)) ? MINUS : isInt(c) ? showNum(c, pf) : `(${showNum(c, pf)})`;
    parts.push(`${cs}${v}`);
  }
  if (!isZero(l.b) || !parts.length) {
    if (parts.length) parts.push(l.b.n < 0 ? `${MINUS} ${showNum(rneg(l.b), pf)}` : `+ ${showNum(l.b, pf)}`);
    else parts.push(showNum(l.b, pf));
  }
  return parts.join(' ');
}

function solveEquation(p: Parsed): SolveResult {
  if (!p.right) {
    return { ok: false, reason: L('Hier fehlt das Gleichheitszeichen. Schreib die ganze Gleichung, z. B. 3x + 5 = 20.', 'Manca il segno uguale. Scrivi tutta l’equazione, ad es. 3x + 5 = 20.') };
  }
  const pf = p.fractions;
  const L0 = linearize(p.left), R0 = linearize(p.right);
  const a = sub(L0.a, R0.a), c = sub(R0.b, L0.b);
  const v = p.placeholder ? '?' : 'x';
  const task = `${show(p.left, pf).replace(/x/g, v)} = ${show(p.right, pf).replace(/x/g, v)}`;
  if (isZero(a)) {
    const all = isZero(c);
    return solution({
      kind: L('Gleichung', 'Equazione'), task, noValue: true,
      answer: all ? L('Jede Zahl passt', 'Va bene qualsiasi numero') : L('Keine Lösung', 'Nessuna soluzione'),
      steps: [{ title: L('Die Unbekannte fällt weg', 'L’incognita sparisce'), text: all ? L('Beide Seiten sind immer gleich: jede Zahl ist eine Lösung.', 'I due lati sono sempre uguali: ogni numero è una soluzione.') : L('Übrig bleibt eine falsche Aussage: Es gibt keine Lösung.', 'Resta un’uguaglianza falsa: non c’è soluzione.') }]
    }, pf);
  }
  const x = div(c, a);
  const preferF = pf || (!isInt(x) && terminatingDigits(x) < 0);

  // Grundschule: „7 + ? = 15“ mit der Umkehraufgabe
  if (p.placeholder) {
    const simple = missingNumber(p.left, p.right, x);
    if (simple) return solution({ kind: L('Fehlende Zahl', 'Numero mancante'), task, steps: simple, value: x, answer: `? = ${showNum(x, preferF)}` }, preferF);
  }

  const steps: Step[] = [];
  const T = timesSign();
  const ls = show(p.left, pf), rs = show(p.right, pf);
  const lsimple = showLin(L0, pf), rsimple = showLin(R0, pf);
  let cur = `${lsimple} = ${rsimple}`;
  if (ls !== lsimple || rs !== rsimple) {
    steps.push({ title: L('Jede Seite vereinfachen', 'Semplifica ogni lato'), text: L('Klammern auflösen und gleiche Teile zusammenfassen: alle x zusammen, alle Zahlen zusammen.', 'Togli le parentesi e raccogli i termini simili: tutte le x insieme, tutti i numeri insieme.'), expr: cur });
  }
  let la = L0.a, lb = L0.b, rb = R0.b;
  if (!isZero(R0.a)) {
    const term = showLin({ a: R0.a, b: rat(0) }, pf);
    la = sub(L0.a, R0.a);
    cur = `${showLin({ a: la, b: lb }, pf)} = ${showNum(rb, pf)}`;
    steps.push({
      title: L('Alle x nach links', 'Tutte le x a sinistra'),
      text: R0.a.n > 0
        ? L(`Rechne auf beiden Seiten ${MINUS} ${term}. So steht x nur noch links.`, `Togli ${term} da entrambi i lati. Così la x resta solo a sinistra.`)
        : L(`Rechne auf beiden Seiten + ${showLin({ a: rneg(R0.a), b: rat(0) }, pf)}. So steht x nur noch links.`, `Aggiungi ${showLin({ a: rneg(R0.a), b: rat(0) }, pf)} a entrambi i lati. Così la x resta solo a sinistra.`),
      expr: cur
    });
  }
  if (!isZero(lb)) {
    const rbNew = sub(rb, lb);
    steps.push({
      title: L('Zahlen nach rechts', 'I numeri a destra'),
      text: lb.n > 0
        ? L(`Rechne auf beiden Seiten ${MINUS} ${showNum(lb, pf)}: ${showNum(rb, pf)} ${MINUS} ${showNum(lb, pf)} = ${showNum(rbNew, pf)}.`, `Togli ${showNum(lb, pf)} da entrambi i lati: ${showNum(rb, pf)} ${MINUS} ${showNum(lb, pf)} = ${showNum(rbNew, pf)}.`)
        : L(`Rechne auf beiden Seiten + ${showNum(rneg(lb), pf)}: ${showNum(rb, pf)} + ${showNum(rneg(lb), pf)} = ${showNum(rbNew, pf)}.`, `Aggiungi ${showNum(rneg(lb), pf)} a entrambi i lati: ${showNum(rb, pf)} + ${showNum(rneg(lb), pf)} = ${showNum(rbNew, pf)}.`),
      expr: `${showLin({ a: la, b: rat(0) }, pf)} = ${showNum(rbNew, pf)}`
    });
    lb = rat(0); rb = rbNew;
  }
  if (!eq(la, rat(1))) {
    const by = isInt(la) ? showNum(la, pf) : `(${showNum(la, pf)})`;
    steps.push({
      title: L(`Durch ${showNum(la, pf)} teilen`, `Dividi per ${showNum(la, pf)}`),
      text: eq(la, rat(-1))
        ? L('Auf beiden Seiten das Vorzeichen umdrehen (mal −1).', 'Cambia il segno su entrambi i lati (per −1).')
        : L(`Teile beide Seiten durch ${by}, damit x allein steht: ${showNum(rb, pf)} : ${by} = ${showNum(x, preferF)}.`, `Dividi entrambi i lati per ${by}, così la x resta da sola: ${showNum(rb, pf)} : ${by} = ${showNum(x, preferF)}.`),
      expr: `x = ${showNum(x, preferF)}`
    });
  } else if (steps.length === 0 || steps[steps.length - 1]!.expr !== `x = ${showNum(x, preferF)}`) {
    steps.push({ title: L('Fertig', 'Fatto'), expr: `x = ${showNum(x, preferF)}` });
  }
  // Probe
  const lv = add(mul(L0.a, x), L0.b), rv = add(mul(R0.a, x), R0.b);
  steps.push({
    title: L('Probe', 'Verifica'),
    text: L(`Setze x = ${showNum(x, preferF)} ein: links kommt ${showNum(lv, preferF)} heraus, rechts ${showNum(rv, preferF)}. Beide Seiten sind gleich.`, `Sostituisci x = ${showNum(x, preferF)}: a sinistra viene ${showNum(lv, preferF)}, a destra ${showNum(rv, preferF)}. I due lati sono uguali.`)
  });
  void T;
  return solution({ kind: L('Gleichung', 'Equazione'), task, steps, value: x, answer: `x = ${showNum(x, preferF)}` }, preferF);
}

/** „a + ? = c“ und Verwandte mit der Umkehraufgabe erklären. */
function missingNumber(left: Node, right: Node, x: R): Step[] | null {
  if (left.t !== 'bin' || right.t !== 'num') return null;
  const c = right.v;
  const varLeft = left.l.t === 'var' && left.r.t === 'num';
  const varRight = left.r.t === 'var' && left.l.t === 'num';
  if (!varLeft && !varRight) return null;
  const k = (varLeft ? left.r : left.l) as Extract<Node, { t: 'num' }>;
  const K = showNum(k.v), C = showNum(c), X = showNum(x, !isInt(x));
  const T = timesSign();
  let inverse: string;
  switch (left.op) {
    case '+': inverse = `${C} ${MINUS} ${K} = ${X}`; break;
    case '-': inverse = varLeft ? `${C} + ${K} = ${X}` : `${K} ${MINUS} ${C} = ${X}`; break;
    case '*': inverse = `${C} : ${K} = ${X}`; break;
    case ':': inverse = varLeft ? `${C} ${T} ${K} = ${X}` : `${K} : ${C} = ${X}`; break;
  }
  const probe = show(varLeft ? { ...left, l: { t: 'num', v: x } } : { ...left, r: { t: 'num', v: x } }) + ` = ${C}`;
  const why: Record<Op, () => string> = {
    '+': () => L('Plus und Minus sind Umkehraufgaben: Rechne minus.', 'Addizione e sottrazione sono operazioni inverse: fai la sottrazione.'),
    '-': () => varLeft ? L('Rechne umgekehrt: Was weggenommen wurde, zählst du wieder dazu.', 'Fai al contrario: aggiungi di nuovo quello che è stato tolto.') : L('Frage dich: Wie viel muss ich wegnehmen? Rechne die Zahl minus das Ergebnis.', 'Chiediti: quanto devo togliere? Fai il numero meno il risultato.'),
    '*': () => L('Mal und Geteilt sind Umkehraufgaben: Rechne geteilt.', 'Moltiplicazione e divisione sono operazioni inverse: fai la divisione.'),
    ':': () => varLeft ? L('Rechne umgekehrt: mal statt geteilt.', 'Fai al contrario: moltiplica invece di dividere.') : L('Frage dich: Durch welche Zahl muss ich teilen? Rechne die Zahl geteilt durch das Ergebnis.', 'Chiediti: per quale numero devo dividere? Fai il numero diviso il risultato.')
  };
  return [
    { title: L('Umkehraufgabe', 'Operazione inversa'), text: why[left.op](), expr: inverse },
    { title: L('Probe', 'Prova'), text: L(`Setze ${X} ein: ${probe}. Stimmt!`, `Metti ${X} al posto del ?: ${probe}. Giusto!`) }
  ];
}

// ───────────── Ergebnis des Kindes prüfen ─────────────

export function checkAnswer(sol: Solution, input: string): boolean {
  if (sol.noValue || !sol.value) return false;
  let s = input.trim().replace(/^\s*(x|\?)\s*=\s*/i, '');
  let rest = 0;
  const m = /^(.*?)\s*(r|rest|resto)\.?\s*(\d+)\s*$/i.exec(s);
  if (m) { s = m[1]!; rest = Number(m[3]); }
  if ((sol.rest ?? 0) !== rest) return false;
  try {
    const p = parseTask(s);
    if (p.hasVar || p.right) return false;
    return eq(evaluate(p.left), sol.value);
  } catch {
    return false;
  }
}

/** Zeilen aus der Texterkennung in einzelne Aufgaben zerlegen (Leerzeilen und Text ohne Zahlen weg). */
export function splitTasks(text: string): string[] {
  return text
    .split(/\n|;|\s{3,}/)
    .map((l) => l.trim())
    .filter((l) => /\d/.test(l) && /[+\-−–×x*:÷/=·%²]/.test(l))
    .map((l) => l.replace(/\s+/g, ' '))
    .slice(0, 20);
}

export { normalize };
