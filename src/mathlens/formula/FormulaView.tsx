/** Formel schön darstellen: Brüche übereinander, Hochzahlen, echtes Minus- und Malzeichen. */
import type { ReactNode } from 'react';
import { parseTask, showNum, timesSign, MINUS, type Node } from '../../hausaufgaben/parse';

const CLOSE = { '(': ')', '[': ']', '{': '}' } as const;

function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex flex-col items-center align-middle leading-none">
      <span className="px-1 pb-0.5">{num}</span>
      <span className="w-full border-t-2 border-current" />
      <span className="px-1 pt-0.5">{den}</span>
    </span>
  );
}

function render(n: Node, top = true): ReactNode {
  let out: ReactNode;
  switch (n.t) {
    case 'num':
      if (n.pct) out = <>{n.pct.replace('.', ',')}%</>;
      else if (n.fn !== undefined) out = <Frac num={n.fn} den={n.fd} />;
      else out = <>{!top && !n.br && n.v.n < 0 ? `(${showNum(n.v)})` : showNum(n.v)}</>;
      break;
    case 'var': out = <i className="font-serif">x</i>; break;
    case 'neg': out = <>{MINUS}{render(n.e, false)}</>; break;
    case 'pow': out = <>{render(n.b, false)}<sup className="text-[0.6em]">{n.e}</sup></>; break;
    case 'bin':
      if (n.slash) out = <Frac num={render(n.l.br ? { ...n.l, br: undefined } : n.l)} den={render(n.r.br ? { ...n.r, br: undefined } : n.r)} />;
      else if (n.op === '*' && n.r.t === 'var' && !n.r.br && n.l.t === 'num' && !n.l.br && !n.l.fn) out = <>{render(n.l)}{render(n.r)}</>;
      else if (n.op === '*' && n.r.br && n.l.t === 'num' && !n.l.br) out = <>{render(n.l)}{render(n.r, false)}</>;
      else out = <>{render(n.l)}<span className="mx-[0.25em]">{n.op === '+' ? '+' : n.op === '-' ? MINUS : n.op === '*' ? timesSign() : ':'}</span>{render(n.r, false)}</>;
      break;
  }
  return n.br ? <>{n.br}{out}{CLOSE[n.br]}</> : out;
}

/** Ganze Aufgabe darstellen; liefert null, wenn sie (noch) nicht lesbar ist. */
export function FormulaView({ text, className = '' }: { text: string; className?: string }) {
  let p;
  try { p = parseTask(text); } catch { return null; }
  return (
    <span className={`inline-flex flex-wrap items-center font-display font-bold tabular-nums ${className}`} data-testid="formel-vorschau">
      {render(p.left)}
      {p.right && <><span className="mx-[0.35em]">=</span>{render(p.right)}</>}
    </span>
  );
}

export function canParse(text: string): boolean {
  try { parseTask(text); return true; } catch { return false; }
}
