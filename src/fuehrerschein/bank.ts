import type { Rng } from '../learning/types';
import { shuffle } from '../lib/random';
import { LESSONS } from './content/lessons';
import { PACKS } from './packs';
import type { ExamProfile } from './profiles';
import { isComplete, validateQuestion, type DrivingCountry, type Lesson, type Question, type StudyLang } from './schema';

export { DRIVING_MIN_YEAR, drivingAvailable } from './access';
export type { DrivingCountry, Question, StudyLang } from './schema';

export function questionsFor(c: DrivingCountry, packs = PACKS): Question[] {
  return packs.filter((p) => p.country === c).flatMap((p) => p.questions);
}
export const lessonsFor = (c: DrivingCountry): Lesson[] => LESSONS.filter((l) => l.country === c);

/** Fragen, die geübt werden dürfen (gültig, kein Entwurf). Fehlende Übersetzungen werden in der Oberfläche markiert. */
export const practicePool = (c: DrivingCountry, packs = PACKS) => questionsFor(c, packs).filter((q) => q.status !== 'draft' && validateQuestion(q).length === 0);
/** Fragen, die in eine Prüfung dürfen: zusätzlich vollständig in der Prüfungssprache. */
export const examPool = (c: DrivingCountry, lang: StudyLang, packs = PACKS) => practicePool(c, packs).filter((q) => isComplete(q, lang));

export type PracticeMode = string; // Kapitel-ID oder 'misto' | 'illustrati' | 'trabocchetti' | 'errori'

export function practiceQuestions(c: DrivingCountry, mode: PracticeMode, wrongIds: string[] = []): Question[] {
  const pool = practicePool(c);
  if (mode === 'misto') return pool;
  if (mode === 'illustrati') return pool.filter((q) => q.image);
  if (mode === 'trabocchetti') return pool.filter((q) => q.trap);
  if (mode === 'quiz-illustrati') return pool.filter((q) => q.trap || q.image?.type === 'diagram');
  if (mode === 'errori') return wrongIds.map((id) => pool.find((q) => q.id === id)).filter((q): q is Question => !!q);
  return pool.filter((q) => q.chapter === mode);
}

/** Eine Frage ist nur richtig, wenn genau die richtigen Antworten gewählt sind. */
export function isCorrect(q: Question, chosen: string[]): boolean {
  return q.options.every((o) => q.correct.includes(o.id) === chosen.includes(o.id));
}

/** Reihenfolge der Antworten (als IDs) – unabhängig von der Sprache. Vero/Falso bleibt fest. */
export function optionOrder(q: Question, rng: Rng): string[] {
  const ids = q.options.map((o) => o.id);
  return q.format === 'vf' ? ids : shuffle(rng, ids);
}

// ---------- Prüfung ----------
export interface BuiltExam { questions: Question[]; mini: boolean; available: number }

/**
 * Stellt eine Prüfung nach Profil zusammen: keine doppelten Fragen, höchstens eine Frage je Verkehrszeichen,
 * alle Kapitel reihum. Reicht der Vorrat nicht, entsteht ein klar gekennzeichneter Mini-Test – nie mit Wiederholungen.
 */
export function buildExam(profile: ExamProfile, pool: Question[], rng: Rng): BuiltExam {
  const signSeen = new Set<string>();
  const unique: Question[] = [];
  for (const q of shuffle(rng, pool)) {
    if (q.format !== profile.format) continue;
    const signKey = q.image?.type === 'sign' ? q.image.id : null;
    if (signKey) { if (signSeen.has(signKey)) continue; signSeen.add(signKey); }
    unique.push(q);
  }
  const signs = unique.filter((q) => q.chapter === 'segnali');
  const rest = unique.filter((q) => q.chapter !== 'segnali');
  const pick: Question[] = signs.slice(0, profile.signQuestions);
  const byChapter = new Map<string, Question[]>();
  for (const q of [...rest, ...signs.slice(profile.signQuestions)]) byChapter.set(q.chapter, [...(byChapter.get(q.chapter) ?? []), q]);
  const lists = [...byChapter.values()];
  for (let round = 0; pick.length < profile.questions && lists.some((l) => l.length > round); round++) {
    for (const l of lists) if (l[round] && pick.length < profile.questions) pick.push(l[round]!);
  }
  return { questions: shuffle(rng, pick), mini: pick.length < profile.questions, available: unique.length };
}

export interface ExamResult {
  correct: number;
  total: number;
  /** IT: Anzahl Fehler, DE: Fehlerpunkte */
  errors: number;
  wrongFives: number;
  passed: boolean;
  failedByFives: boolean;
}

export function scoreExam(profile: ExamProfile, qs: Question[], answers: Record<string, string[] | undefined>): ExamResult {
  let errors = 0, correct = 0, wrongFives = 0;
  for (const q of qs) {
    if (isCorrect(q, answers[q.id] ?? [])) { correct++; continue; }
    if (profile.scoring.type === 'errors') errors++;
    else { errors += q.weight ?? 0; if (q.weight === 5) wrongFives++; }
  }
  if (profile.scoring.type === 'errors') {
    return { correct, total: qs.length, errors, wrongFives: 0, failedByFives: false, passed: errors <= profile.scoring.maxErrors };
  }
  const failedByFives = wrongFives >= profile.scoring.failOnFives;
  return { correct, total: qs.length, errors, wrongFives, failedByFives, passed: errors <= profile.scoring.maxPoints && !failedByFives };
}

// ---------- Fortschritt: je Profil und Land getrennt, nicht je Sprache ----------
export interface DrivingStats {
  chapters: Record<string, { right: number; total: number }>;
  exams: { at: string; passed: boolean; errors: number; mini: boolean }[];
  signsKnown: string[];
  /** Fragen zum Wiederholen */
  wrong: string[];
  lessonsRead: string[];
}
export const emptyStats = (): DrivingStats => ({ chapters: {}, exams: [], signsKnown: [], wrong: [], lessonsRead: [] });
export const statsKey = (profileId: string, c: DrivingCountry) => `lernito-fahrschule-${profileId}-${c}`;
export function loadStats(profileId: string, c: DrivingCountry): DrivingStats {
  try {
    const raw = localStorage.getItem(statsKey(profileId, c));
    if (raw) return { ...emptyStats(), ...JSON.parse(raw) } as DrivingStats;
  } catch { /* egal */ }
  return emptyStats();
}
export function saveStats(profileId: string, c: DrivingCountry, s: DrivingStats) {
  try { localStorage.setItem(statsKey(profileId, c), JSON.stringify({ ...s, exams: s.exams.slice(-20) })); } catch { /* egal */ }
}
export function recordAnswer(s: DrivingStats, q: Question, ok: boolean): DrivingStats {
  const t = s.chapters[q.chapter] ?? { right: 0, total: 0 };
  const sign = q.image?.type === 'sign' ? q.image.id : undefined;
  const signsKnown = ok && sign && !s.signsKnown.includes(sign) ? [...s.signsKnown, sign] : s.signsKnown;
  const wrong = ok ? s.wrong.filter((id) => id !== q.id) : s.wrong.includes(q.id) ? s.wrong : [...s.wrong, q.id];
  return { ...s, signsKnown, wrong, chapters: { ...s.chapters, [q.chapter]: { right: t.right + (ok ? 1 : 0), total: t.total + 1 } } };
}

// ---------- Auswahl Land und Lernsprache ----------
export interface DrivingSetup { country: DrivingCountry; lang: StudyLang }
const setupKey = (profileId: string) => `lernito-fahrschule-wahl-${profileId}`;
export function loadSetup(profileId: string): Partial<DrivingSetup> {
  try { return JSON.parse(localStorage.getItem(setupKey(profileId)) ?? '{}') as Partial<DrivingSetup>; } catch { return {}; }
}
export function saveSetup(profileId: string, s: Partial<DrivingSetup>) {
  try { localStorage.setItem(setupKey(profileId), JSON.stringify(s)); } catch { /* egal */ }
}
