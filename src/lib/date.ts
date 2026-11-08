export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function lastNDays(n: number, from: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (n - 1 - i));
    return dateKey(d);
  });
}

export function formatMinutes(sec: number): string {
  const m = Math.round(sec / 60);
  if (m < 1) return sec > 0 ? '< 1 Min.' : '0 Min.';
  if (m < 60) return `${m} Min.`;
  return `${Math.floor(m / 60)} Std. ${m % 60} Min.`;
}

import { getLang } from '../i18n';
const WT_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WT_IT = ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'];
/** Kurze Wochentagsnamen in der aktuellen Sprache (Index = Date.getDay()) */
export function wochentagKurz(d: number): string { return (getLang() === 'it' ? WT_IT : WT_DE)[d] ?? ''; }
export const WOCHENTAGE_KURZ = WT_DE;
