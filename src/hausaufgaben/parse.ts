/**
 * Liest eine Matheaufgabe als Text (getippt oder per Texterkennung aus einem Foto)
 * und macht daraus einen Rechenbaum.
 */
import { rat, fmt, type R } from './rational';
import { getLang } from '../i18n';

export type Op = '+' | '-' | '*' | ':';
export type Bracket = '(' | '[' | '{';
export type Node =
  | { t: 'num'; v: R; frac?: boolean; fn?: number; fd?: number; pct?: string; br?: Bracket }
  | { t: 'var'; br?: Bracket }
  | { t: 'bin'; op: Op; l: Node; r: Node; br?: Bracket }
  | { t: 'neg'; e: Node; br?: Bracket }
  | { t: 'pow'; b: Node; e: number; br?: Bracket };

export interface Parsed {
  /** Linke Seite (oder ganze Aufgabe) */
  left: Node;
  /** Rechte Seite einer Gleichung, falls vorhanden */
  right?: Node;
  /** Enthält eine Unbekannte (x, ?, _) */
  hasVar: boolean;
  /** Die Unbekannte war ein Fragezeichen/Kästchen (Grundschul-Platzhalter) */
  placeholder: boolean;
  /** Enthält Brüche wie 3/4 */
  fractions: boolean;
  /** „20 % von 150“ */
  percent?: { p: R; of: R };
  /** Aufbereiteter Text */
  clean: string;
}

export class ParseError extends Error {}

const SUP: Record<string, string> = { '²': '^2', '³': '^3' };

/** Text aus Foto oder Tastatur vereinheitlichen. */
export function normalize(raw: string): string {
  let s = raw.trim();
  // Aufgabennummern am Anfang: „a)“, „1)“, „1.“, „Nr. 3“
  s = s.replace(/^\s*(nr\.?\s*\d+\s*[:.)]?|\(?[a-hA-H]\)|\(?\d{1,2}[.)])\s+/i, '');
  s = s.replace(/^\s*\(?[a-hA-H]\)\s*/, '');
  s = s
    .replace(/[−–—‐]/g, '-')
    .replace(/[×✕✖∙•⋅·*]/g, '*')
    .replace(/÷/g, ':')
    .replace(/[□☐▢_…]+/g, '?')
    .replace(/[²³]/g, (c) => SUP[c] ?? c)
    .replace(/(\d)\s*,\s*(\d)/g, '$1.$2')
    .replace(/\b(di|del|della|von|vom|of)\b/gi, ' * ')
    .replace(/\s+\.\s+/g, ' * ')
    .replace(/\s+/g, ' ')
    .trim();
  // „= ?“ oder „=“ am Ende: einfach ausrechnen
  s = s.replace(/=\s*\??\s*$/, '').trim();
  // x/X zwischen zwei Zahlen ist ein Malzeichen (3 x 4), sonst eine Unbekannte (3x + 5 = 20)
  s = s.replace(/([\d)\]}])\s*[xX]\s*(?=[\d([{])/g, '$1 * ');
  s = s.replace(/X/g, 'x');
  return s;
}

type Tok = { k: 'num'; v: string } | { k: 'op'; v: string };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i]!;
    if (c === ' ') { i++; continue; }
    const m = /^\d+(\.\d+)?|^\.\d+/.exec(s.slice(i));
    if (m) { out.push({ k: 'num', v: m[0] }); i += m[0].length; continue; }
    if ('+-*:/()[]{}=?x^%'.includes(c)) { out.push({ k: 'op', v: c }); i++; continue; }
    throw new ParseError(c);
  }
  return out;
}

class P {
  i = 0;
  sawVar = false;
  sawPlaceholder = false;
  sawFrac = false;
  constructor(private toks: Tok[]) {}
  peek(): Tok | undefined { return this.toks[this.i]; }
  isOp(v: string) { const t = this.peek(); return !!t && t.k === 'op' && t.v === v; }
  take(v: string) { if (!this.isOp(v)) throw new ParseError(v); this.i++; }
  done() { return this.i >= this.toks.length; }

  expr(): Node {
    let n = this.term();
    while (this.isOp('+') || this.isOp('-')) {
      const op = (this.toks[this.i++] as Tok).v as Op;
      n = { t: 'bin', op, l: n, r: this.term() };
    }
    return n;
  }
  term(): Node {
    let n = this.factor();
    for (;;) {
      if (this.isOp('*') || this.isOp(':')) {
        const op = (this.toks[this.i++] as Tok).v as Op;
        n = { t: 'bin', op, l: n, r: this.factor() };
      } else if (this.isOp('/')) {
        this.i++;
        n = { t: 'bin', op: ':', l: n, r: this.factor() };
      } else if (this.startsAtom()) {
        // 3x, 2(x + 1), (a)(b)
        n = { t: 'bin', op: '*', l: n, r: this.power() };
      } else break;
    }
    return n;
  }
  startsAtom() {
    const t = this.peek();
    return !!t && (t.k === 'num' ? false : ['(', '[', '{', 'x', '?'].includes(t.v));
  }
  factor(): Node {
    if (this.isOp('-')) { this.i++; return { t: 'neg', e: this.factor() }; }
    if (this.isOp('+')) { this.i++; return this.factor(); }
    return this.power();
  }
  power(): Node {
    const b = this.atom();
    if (this.isOp('^')) {
      this.i++;
      const t = this.peek();
      if (!t || t.k !== 'num' || t.v.includes('.')) throw new ParseError('^');
      this.i++;
      const e = Number(t.v);
      if (e > 12) throw new ParseError('^');
      return { t: 'pow', b, e };
    }
    return b;
  }
  atom(): Node {
    const t = this.peek();
    if (!t) throw new ParseError('end');
    if (t.k === 'num') {
      this.i++;
      const v = rat(Number(t.v));
      // 3/4 aus zwei ganzen Zahlen ist ein Bruch und bindet stärker als „:“
      const nx = this.toks[this.i + 1];
      if (this.isOp('/') && nx && nx.k === 'num' && !t.v.includes('.') && !nx.v.includes('.') && Number(nx.v) !== 0) {
        this.i += 2;
        this.sawFrac = true;
        return { t: 'num', v: rat(Number(t.v), Number(nx.v)), frac: true, fn: Number(t.v), fd: Number(nx.v) };
      }
      if (this.isOp('%')) { this.i++; return { t: 'num', v: rat(v.n, v.d * 100), pct: t.v }; }
      return { t: 'num', v };
    }
    const close: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
    if (close[t.v]) {
      this.i++;
      const e = this.expr();
      this.take(close[t.v]!);
      return { ...e, br: t.v as Bracket } as Node;
    }
    if (t.v === 'x' || t.v === '?') {
      this.i++;
      this.sawVar = true;
      if (t.v === '?') this.sawPlaceholder = true;
      return { t: 'var' };
    }
    throw new ParseError(t.v);
  }
}

function parseSide(toks: Tok[], p?: P): { node: Node; p: P } {
  const q = new P(toks);
  if (p) { q.sawVar = p.sawVar; q.sawPlaceholder = p.sawPlaceholder; q.sawFrac = p.sawFrac; }
  const node = q.expr();
  if (!q.done()) throw new ParseError('rest');
  return { node, p: q };
}

export function parseTask(raw: string): Parsed {
  const clean = normalize(raw);
  if (!clean || !/\d|x|\?/.test(clean)) throw new ParseError('empty');
  const toks = tokenize(clean);
  const eqAt = toks.findIndex((t) => t.k === 'op' && t.v === '=');
  if (eqAt >= 0 && toks.slice(eqAt + 1).some((t) => t.k === 'op' && t.v === '=')) throw new ParseError('==');
  if (eqAt === 0) throw new ParseError('=');
  const leftToks = eqAt >= 0 ? toks.slice(0, eqAt) : toks;
  const a = parseSide(leftToks);
  let right: Node | undefined;
  let p = a.p;
  if (eqAt >= 0 && eqAt < toks.length - 1) {
    const b = parseSide(toks.slice(eqAt + 1), a.p);
    right = b.node; p = b.p;
  }
  const out: Parsed = { left: a.node, right, hasVar: p.sawVar, placeholder: p.sawPlaceholder, fractions: p.sawFrac, clean };
  // „20 % von 150“
  const L0 = a.node;
  if (!right && L0.t === 'bin' && L0.op === '*' && L0.l.t === 'num' && !!L0.l.pct && L0.r.t === 'num') {
    out.percent = { p: rat(L0.l.v.n * 100, L0.l.v.d), of: L0.r.v };
  }
  return out;
}

// ───────────── Ausgabe ─────────────

export const MINUS = '−';
export function timesSign(): string { return getLang() === 'it' ? '×' : '·'; }
export function opSign(op: Op): string {
  return op === '+' ? '+' : op === '-' ? MINUS : op === '*' ? timesSign() : ':';
}

/** Zahl für die Anzeige (mit echtem Minuszeichen). */
export function showNum(v: R, preferFraction = false): string {
  return fmt(v, preferFraction).replace('-', MINUS);
}

const CLOSE: Record<Bracket, string> = { '(': ')', '[': ']', '{': '}' };

export function show(n: Node, preferFraction = false, top = true): string {
  let s: string;
  switch (n.t) {
    case 'num': {
      if (n.pct) s = `${n.pct.replace('.', ',')} %`;
      else if (n.fn !== undefined) s = `${n.fn}/${n.fd}`;
      else s = showNum(n.v, preferFraction);
      if (!top && !n.br && n.v.n < 0) s = `(${s})`;
      break;
    }
    case 'var': s = 'x'; break;
    case 'neg': s = `${MINUS}${show(n.e, preferFraction, false)}`; break;
    case 'pow': s = `${show(n.b, preferFraction, false)}${n.e === 2 ? '²' : n.e === 3 ? '³' : `^${n.e}`}`; break;
    case 'bin': {
      const l = show(n.l, preferFraction, true);
      const r = show(n.r, preferFraction, false);
      // 3x statt 3 · x
      if (n.op === '*' && n.r.t === 'var' && !n.r.br && n.l.t === 'num' && !n.l.br) s = `${l}x`;
      else s = `${l} ${opSign(n.op)} ${r}`;
      break;
    }
  }
  return n.br ? `${n.br}${s}${CLOSE[n.br]}` : s;
}
