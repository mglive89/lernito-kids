import { L, tx } from '../i18n';
import { createRng, shuffle } from '../lib/random';
import { pathDoneOf, type ModuleProgress, type RoundResult } from './adaptive';
import type { Difficulty, LearningModule, Rng, Task } from './types';

/**
 * Schwierigkeitsstufen, die zum Schluss richtig fordern:
 * - Jede Einheit hat nach „Meistern“ (Lektion 3) eine Profi-Lektion (Lektion 4):
 *   mehr Aufgaben auf der höchsten Stufe, bestanden erst ab 80 % beim ersten Versuch.
 * - Jedes Fach endet mit der Endrunde (Bronze, Silber, Gold): gemischte Aufgaben
 *   aus allen Einheiten, mit steigender Länge und steigendem Ziel.
 * Hilfe bleibt wie immer: Tipp, erster Schritt, dann Erklärung mit Lösung.
 * Durchfallen kostet nichts, man kann es sofort wieder versuchen.
 */

/** Lektion 4 jeder Einheit */
export const PROFI_STEP = 4;
/** Lektionen pro Einheit im Lernpfad (inklusive Profi) */
export const PATH_STEPS = 4;
/** Ziel der Profi-Lektion: Anteil beim ersten Versuch richtig */
export const PROFI_GOAL = 0.8;
const PROFI_MAX = 15;

export interface Challenge {
  /** Ziel: Anteil der Aufgaben, die beim ersten Versuch (ohne Hilfe) richtig sein müssen */
  goal: number;
  /** Kurzname für Anzeigen, z. B. „Profi“ oder „Gold“ */
  name: string;
}

export function challengeRate(r: Pick<RoundResult, 'firstTry' | 'total'>): number {
  return r.total > 0 ? r.firstTry / r.total : 0;
}

export function challengePassed(r: Pick<RoundResult, 'firstTry' | 'total'>, goal: number): boolean {
  return r.total > 0 && challengeRate(r) + 1e-9 >= goal;
}

/** Wie viele Aufgaben beim ersten Versuch nötig sind */
export const neededFor = (total: number, goal: number) => Math.ceil(total * goal - 1e-9);

/** Gleiche Aufgaben (bis auf die ID) nicht doppelt stellen */
const taskKey = (t: Task) => JSON.stringify({ ...t, id: '' });

/** Aufgaben der Profi-Lektion: höchste Stufe, etwa anderthalbmal so viele wie sonst. */
export function profiTasks(m: LearningModule, rng: Rng): Task[] {
  const first = m.generate(3, rng);
  const target = Math.min(PROFI_MAX, Math.max(first.length, Math.ceil(first.length * 1.5)));
  const seen = new Set(first.map(taskKey));
  const out = first.map((t, i) => ({ ...t, id: `p0-${i}-${t.id}` }));
  for (let round = 1; round <= 5 && out.length < target; round++) {
    const more = m.generate(3, createRng(Math.floor(rng() * 2 ** 31)));
    for (const [i, t] of more.entries()) {
      if (out.length >= target) break;
      const k = taskKey(t);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...t, id: `p${round}-${i}-${t.id}` });
    }
  }
  return out;
}

/** Modul für die Profi-Lektion (gleiche ID, damit Fortschritt und Theorie passen) */
export function profiModule(m: LearningModule): LearningModule {
  return { ...m, generate: (_level: Difficulty, rng: Rng) => profiTasks(m, rng) };
}

export const profiChallenge = (): Challenge => ({ goal: PROFI_GOAL, name: L('Profi', 'Esperto') });

/* ------------------------------ Endrunde ------------------------------ */

export interface FinalTier { n: 1 | 2 | 3; name: () => string; level: Difficulty; size: number; goal: number; color: 'bronze' | 'silber' | 'gold' }

export const FINAL_TIERS: FinalTier[] = [
  { n: 1, name: () => L('Bronze', 'Bronzo'), level: 2, size: 8, goal: 0.7, color: 'bronze' },
  { n: 2, name: () => L('Silber', 'Argento'), level: 3, size: 10, goal: 0.8, color: 'silber' },
  { n: 3, name: () => L('Gold', 'Oro'), level: 3, size: 12, goal: 0.9, color: 'gold' }
];

export const finalId = (subject: string, year: number) => `finale-${subject}-${year}`;

/** Endrunde ist offen, wenn jede Einheit des Fachs bis „Meistern“ (Lektion 3) geschafft ist. */
export function finalUnlocked(mods: LearningModule[], modules: Record<string, ModuleProgress>): boolean {
  return mods.length > 0 && mods.every((m) => pathDoneOf(modules[m.id]) >= 3);
}

/** Gemischte Aufgaben aus allen Einheiten, abwechselnd verteilt. */
export function mixedTasks(mods: LearningModule[], level: Difficulty, size: number, rng: Rng): Task[] {
  const pools = shuffle(rng, mods).map((m) => {
    try { return shuffle(rng, m.generate(level, rng)).map((t) => ({ ...t, id: `${m.id}:${t.id}` })); } catch { return []; }
  }).filter((p) => p.length > 0);
  const out: Task[] = [];
  for (let i = 0; out.length < size && pools.some((p) => p.length > i); i++) {
    for (const p of pools) {
      if (out.length >= size) break;
      const t = p[i];
      if (t) out.push(t);
    }
  }
  return out;
}

export function finalModule(mods: LearningModule[], subject: string, year: number, subjectTitle: string, tier: FinalTier, color: LearningModule['color'] = 'himmel'): LearningModule {
  return {
    id: finalId(subject, year),
    title: { de: `Endrunde · ${subjectTitle}`, it: `Sfida finale · ${subjectTitle}` },
    subtitle: tx('Gemischte Aufgaben aus allen Einheiten', 'Esercizi misti da tutte le unità'),
    emoji: '🏆',
    color,
    area: 'schule',
    subject,
    years: [year, year],
    topic: tx(`Endrunde ${subjectTitle}`, `Sfida finale ${subjectTitle}`),
    roundSize: tier.size,
    generate: (_level, rng) => mixedTasks(mods, tier.level, tier.size, rng)
  };
}
