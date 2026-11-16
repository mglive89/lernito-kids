/** Verlauf auf diesem Gerät: Aufgabe, Ergebnis, Datum. Fotos werden nie gespeichert. */
export interface HistoryEntry { id: string; task: string; answer: string; kind: string; date: string }

const KEY = 'mathlens-history';
const MAX = 100;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    return Array.isArray(list) ? list.filter((e) => e && typeof e.task === 'string') : [];
  } catch {
    return [];
  }
}
function save(list: HistoryEntry[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch { /* voll oder gesperrt */ }
}
export function addHistory(e: Omit<HistoryEntry, 'id' | 'date'>): HistoryEntry[] {
  const list = loadHistory().filter((x) => x.task !== e.task);
  const entry: HistoryEntry = { ...e, id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, date: new Date().toISOString() };
  const next = [entry, ...list];
  save(next);
  return next;
}
export function removeHistory(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  save(next);
  return next;
}
export function clearHistory(): HistoryEntry[] {
  try { localStorage.removeItem(KEY); } catch { /* egal */ }
  return [];
}
