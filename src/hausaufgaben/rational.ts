/** Exakte Brüche für den Hausaufgaben-Löser (keine Rundungsfehler wie bei 0,1 + 0,2). */
export interface R { n: number; d: number }

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
export const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

export function rat(n: number, d = 1): R {
  if (d === 0) throw new Error('div0');
  if (!Number.isInteger(n) || !Number.isInteger(d)) {
    // Dezimalzahl → Bruch
    const k = 10 ** Math.min(8, Math.max(decimals(n), decimals(d)));
    return rat(Math.round(n * k), Math.round(d * k));
  }
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('big');
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
}

function decimals(x: number): number {
  const s = String(x);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

export const add = (a: R, b: R) => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: R, b: R) => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: R, b: R) => rat(a.n * b.n, a.d * b.d);
export const div = (a: R, b: R) => rat(a.n * b.d, a.d * b.n);
export const neg = (a: R): R => ({ n: -a.n, d: a.d });
export const eq = (a: R, b: R) => a.n === b.n && a.d === b.d;
export const isInt = (a: R) => a.d === 1;
export const isZero = (a: R) => a.n === 0;
export const toNum = (a: R) => a.n / a.d;

/** Endet die Dezimaldarstellung (nur Faktoren 2 und 5 im Nenner)? Liefert die Nachkommastellen oder -1. */
export function terminatingDigits(a: R): number {
  let d = a.d, k2 = 0, k5 = 0;
  while (d % 2 === 0) { d /= 2; k2++; }
  while (d % 5 === 0) { d /= 5; k5++; }
  return d === 1 ? Math.max(k2, k5) : -1;
}

/** Zahl mit Dezimalkomma (DE und IT schreiben beide ein Komma). */
export function decimalString(a: R, digits: number): string {
  const sign = a.n < 0 ? '-' : '';
  const scaled = Math.round((Math.abs(a.n) * 10 ** digits) / a.d);
  let s = String(scaled).padStart(digits + 1, '0');
  if (digits > 0) s = `${s.slice(0, -digits)},${s.slice(-digits)}`;
  return sign + s;
}

/**
 * Darstellung: ganze Zahl, sonst Dezimalzahl (wenn sie endet und kurz ist), sonst Bruch.
 * preferFraction: in Bruch-Aufgaben bleiben Ergebnisse Brüche.
 */
export function fmt(a: R, preferFraction = false): string {
  if (a.d === 1) return String(a.n);
  const t = terminatingDigits(a);
  if (!preferFraction && t >= 0 && t <= 4) return decimalString(a, t);
  return `${a.n}/${a.d}`;
}
