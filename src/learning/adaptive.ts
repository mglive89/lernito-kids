import { L } from '../i18n';
import type { Difficulty } from './types';

export interface RoundResult {
  moduleId: string;
  total: number;
  /** Beim ersten Versuch richtig */
  firstTry: number;
  /** Gelöst (vor Anzeigen der Lösung) */
  solved: number;
  hintsUsed: number;
  durationSec: number;
  /** Lektion im Lernpfad (1–3), falls die Runde aus dem Pfad gestartet wurde */
  pathStep?: number;
}

export interface ModuleProgress {
  level: Difficulty;
  rounds: number;
  tasks: number;
  firstTry: number;
  solved: number;
  /** Quote beim ersten Versuch der letzten Runden (neueste zuletzt) */
  history: number[];
  lastPlayed: string;
  bestStars: number;
  /** Abgeschlossene Lektionen im Lernpfad (0–3) */
  pathDone?: number;
}

export const emptyModuleProgress = (): ModuleProgress => ({
  level: 1, rounds: 0, tasks: 0, firstTry: 0, solved: 0, history: [], lastPlayed: '', bestStars: 0
});

export const LEVEL_UP_RATE = 0.85;
export const LEVEL_DOWN_RATE = 0.5;
export const NEEDS_PRACTICE_RATE = 0.6;

/** Passt den Schwierigkeitsgrad anhand der Fehlerquote an. */
export function nextDifficulty(current: Difficulty, firstTryRate: number, history: number[] = []): Difficulty {
  const recent = [...history.slice(-1), firstTryRate];
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  if (firstTryRate >= LEVEL_UP_RATE && avg >= LEVEL_UP_RATE - 0.1 && current < 3) return (current + 1) as Difficulty;
  if (firstTryRate < LEVEL_DOWN_RATE && current > 1) return (current - 1) as Difficulty;
  return current;
}

export function applyRound(prev: ModuleProgress, r: RoundResult, now = new Date()): ModuleProgress {
  const rate = r.total > 0 ? r.firstTry / r.total : 0;
  return {
    level: nextDifficulty(prev.level, rate, prev.history),
    rounds: prev.rounds + 1,
    tasks: prev.tasks + r.total,
    firstTry: prev.firstTry + r.firstTry,
    solved: prev.solved + r.solved,
    history: [...prev.history, Math.round(rate * 100) / 100].slice(-8),
    lastPlayed: now.toISOString(),
    bestStars: Math.max(prev.bestStars, roundStars(r)),
    pathDone: Math.max(pathDoneOf(prev), r.pathStep ?? 0)
  };
}

/** Thema braucht Wiederholung, wenn die letzten Runden im Mittel schwach waren. */
/** Abgeschlossene Pfad-Lektionen; ältere Fortschritte zählen als erste Lektion. */
export function pathDoneOf(p: ModuleProgress | undefined): number {
  if (!p) return 0;
  return p.pathDone ?? (p.rounds > 0 ? 1 : 0);
}

export function needsPractice(p: ModuleProgress | undefined): boolean {
  if (!p || p.history.length === 0) return false;
  const last = p.history.slice(-3);
  return last.reduce((a, b) => a + b, 0) / last.length < NEEDS_PRACTICE_RATE;
}

/** 1–3 Sterne für die Runde – es gibt immer mindestens 1 Stern fürs Mitmachen. */
export function roundStars(r: RoundResult): 1 | 2 | 3 {
  if (r.total === 0) return 1;
  const rate = r.firstTry / r.total;
  if (rate >= 0.9) return 3;
  if (rate >= 0.6) return 2;
  return 1;
}

/** Ermutigende Rückmeldung – niemals beschämend. */
export function roundMessage(r: RoundResult, levelChange: -1 | 0 | 1): string {
  if (levelChange > 0) return L('Wow, das war super! Beim nächsten Mal wird es ein kleines bisschen kniffliger.', 'Wow, bravissimo! La prossima volta sarà un pochino più difficile.');
  if (levelChange < 0) return L('Gut gemacht, dass du drangeblieben bist! Wir üben das nächste Mal in kleineren Schritten.', 'Bravo che non hai mollato! La prossima volta procediamo a passi più piccoli.');
  const rate = r.total ? r.firstTry / r.total : 0;
  if (rate >= 0.9) return L('Fantastisch! Du hast fast alles auf Anhieb geschafft!', 'Fantastico! Hai fatto quasi tutto giusto al primo colpo!');
  if (rate >= 0.6) return L('Toll gemacht! Mit jeder Runde wirst du sicherer.', 'Ottimo lavoro! A ogni turno diventi più sicuro.');
  return L('Prima, dass du durchgehalten hast! Üben macht dich jedes Mal stärker.', 'Bravo che sei arrivato fino in fondo! Esercitarsi ti rende sempre più forte.');
}
