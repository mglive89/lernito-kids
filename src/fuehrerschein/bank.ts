import { tx, type Txt } from '../i18n';
import type { Rng } from '../learning/types';
import { shuffle } from '../lib/random';
import { SIGNS, type SignDef } from './signs';
import { RAW_DE, TOPICS_DE } from './questionsDE';
import { RAW_IT, TOPICS_IT } from './questionsIT';
import type { DrivingCountry, DrivingQuestion, DrivingTopic } from './types';

export type { DrivingCountry, DrivingQuestion, DrivingTopic } from './types';

export { DRIVING_MIN_YEAR, drivingAvailable } from './access';

export const SIGN_TOPIC: Record<DrivingCountry, string> = { DE: 'zeichen', IT: 'segnali' };

export function topicsFor(c: DrivingCountry): DrivingTopic[] { return c === 'IT' ? TOPICS_IT : TOPICS_DE; }

/** Andere Zeichen als Ablenker: zuerst aus derselben Gruppe. */
function distractors(sign: SignDef, n: number): SignDef[] {
  const i = SIGNS.indexOf(sign);
  const same = SIGNS.filter((s) => s.group === sign.group && s.id !== sign.id);
  const other = SIGNS.filter((s) => s.group !== sign.group);
  const rot = <T,>(a: T[], k: number) => a.map((_, j) => a[(j + k) % a.length]!);
  return [...rot(same, i), ...rot(other, i)].slice(0, n);
}

const VERO: Txt = tx('Richtig', 'Vero');
const FALSO: Txt = tx('Falsch', 'Falso');

function signQuestionsDE(): DrivingQuestion[] {
  return SIGNS.map((s) => ({
    id: `de-z-${s.id}`, topic: 'zeichen', points: s.group === 'vorfahrt' ? 5 : 3, kind: 'multi' as const, sign: s.id,
    q: tx('Was bedeutet dieses Verkehrszeichen?', 'Che cosa indica questo segnale?'),
    options: [{ t: s.meaning, ok: true }, ...distractors(s, 2).map((d) => ({ t: d.meaning, ok: false }))],
    expl: tx(`„${(s.name as { de: string }).de}“: ${(s.meaning as { de: string }).de}`, `“${(s.name as { it: string }).it}”: ${(s.meaning as { it: string }).it}`)
  }));
}

function signQuestionsIT(): DrivingQuestion[] {
  const out: DrivingQuestion[] = [];
  for (const s of SIGNS) {
    const n = s.name as { de: string; it: string };
    const m = s.meaning as { de: string; it: string };
    const wrong = distractors(s, 1)[0]!;
    const w = wrong.name as { de: string; it: string };
    const expl = tx(`Das Zeichen heißt „${n.de}“: ${m.de}`, `Il segnale è “${n.it}”: ${m.it}`);
    const vf = (ok: boolean) => [{ t: VERO, ok }, { t: FALSO, ok: !ok }];
    out.push({ id: `it-z-${s.id}`, topic: 'segnali', points: 1, kind: 'vf', sign: s.id, q: tx(`Das abgebildete Zeichen bedeutet: ${n.de}.`, `Il segnale raffigurato indica: ${n.it.toLowerCase()}.`), options: vf(true), expl });
    out.push({ id: `it-zf-${s.id}`, topic: 'segnali', points: 1, kind: 'vf', sign: s.id, q: tx(`Das abgebildete Zeichen bedeutet: ${w.de}.`, `Il segnale raffigurato indica: ${w.it.toLowerCase()}.`), options: vf(false), expl });
  }
  return out;
}

let cache: Partial<Record<DrivingCountry, DrivingQuestion[]>> = {};

/** Alle Fragen eines Landes (eigene Fragen + automatisch erzeugte Schilderfragen). */
export function questionsFor(c: DrivingCountry): DrivingQuestion[] {
  if (cache[c]) return cache[c]!;
  const list: DrivingQuestion[] = c === 'IT'
    ? [
      ...RAW_IT.map(([id, topic, s, ok, expl, sign]) => ({ id, topic, points: 1, kind: 'vf' as const, q: s, sign, expl, options: [{ t: VERO, ok }, { t: FALSO, ok: !ok }] })),
      ...signQuestionsIT()
    ]
    : [
      ...RAW_DE.map(([id, topic, points, q, opts, expl, sign]) => ({ id, topic, points, kind: 'multi' as const, q, sign, expl, options: opts.map(([t, ok]) => ({ t, ok })) })),
      ...signQuestionsDE()
    ];
  cache = { ...cache, [c]: list };
  return list;
}

export const questionsOfTopic = (c: DrivingCountry, topic: string) => questionsFor(c).filter((q) => q.topic === topic);

/** Antwortoptionen mischen (außer Vero/Falso). */
export function prepare(q: DrivingQuestion, rng: Rng): DrivingQuestion {
  return q.kind === 'vf' ? q : { ...q, options: shuffle(rng, q.options) };
}

/** Eine Frage ist nur richtig, wenn genau die richtigen Antworten gewählt sind. */
export function isCorrect(q: DrivingQuestion, chosen: number[]): boolean {
  return q.options.every((o, i) => o.ok === chosen.includes(i));
}

// ---------- Prüfung ----------
export interface ExamRules {
  questions: number;
  minutes: number;
  /** DE: Fehlerpunkte, IT: Anzahl Fehler */
  maxErrors: number;
  signShare: number;
}

export const EXAM_RULES: Record<DrivingCountry, ExamRules> = {
  DE: { questions: 30, minutes: 45, maxErrors: 10, signShare: 8 },
  IT: { questions: 30, minutes: 20, maxErrors: 3, signShare: 10 }
};

/** Stellt eine Prüfung zusammen: alle Themen vertreten, Schilderfragen eingestreut. */
export function buildExam(c: DrivingCountry, rng: Rng): DrivingQuestion[] {
  const rules = EXAM_RULES[c];
  const all = questionsFor(c);
  const signTopic = SIGN_TOPIC[c];
  const signs = shuffle(rng, all.filter((q) => q.topic === signTopic));
  const usedSigns = new Set<string>();
  const signPick: DrivingQuestion[] = [];
  for (const q of signs) {
    if (signPick.length >= rules.signShare) break;
    if (q.sign && usedSigns.has(q.sign)) continue;
    if (q.sign) usedSigns.add(q.sign);
    signPick.push(q);
  }
  const rest = all.filter((q) => q.topic !== signTopic);
  const byTopic = new Map<string, DrivingQuestion[]>();
  for (const q of shuffle(rng, rest)) byTopic.set(q.topic, [...(byTopic.get(q.topic) ?? []), q]);
  // reihum aus jedem Thema ziehen
  const pick: DrivingQuestion[] = [];
  const need = rules.questions - signPick.length;
  const lists = [...byTopic.values()];
  for (let round = 0; pick.length < need && lists.some((l) => l.length > round); round++) {
    for (const l of lists) if (l[round] && pick.length < need) pick.push(l[round]!);
  }
  return shuffle(rng, [...pick, ...signPick]).map((q) => prepare(q, rng));
}

export interface ExamResult {
  correct: number;
  total: number;
  errors: number;
  passed: boolean;
  /** DE: zwei falsche 5-Punkte-Fragen */
  failedByFives: boolean;
}

export function scoreExam(c: DrivingCountry, qs: DrivingQuestion[], answers: (number[] | undefined)[]): ExamResult {
  const rules = EXAM_RULES[c];
  let errors = 0, correct = 0, fives = 0;
  qs.forEach((q, i) => {
    const ok = isCorrect(q, answers[i] ?? []);
    if (ok) correct++;
    else {
      errors += c === 'IT' ? 1 : q.points;
      if (c === 'DE' && q.points === 5) fives++;
    }
  });
  const failedByFives = c === 'DE' && fives >= 2;
  return { correct, total: qs.length, errors, passed: errors <= rules.maxErrors && !failedByFives, failedByFives };
}

// ---------- Fortschritt (nur auf diesem Gerät) ----------
export interface DrivingStats {
  topics: Record<string, { right: number; total: number }>;
  exams: { at: string; passed: boolean; errors: number }[];
  signsKnown: string[];
}
const key = (profileId: string, c: DrivingCountry) => `lernito-fuehrerschein-${profileId}-${c}`;
export function loadStats(profileId: string, c: DrivingCountry): DrivingStats {
  try {
    const raw = localStorage.getItem(key(profileId, c));
    if (raw) return { topics: {}, exams: [], signsKnown: [], ...JSON.parse(raw) } as DrivingStats;
  } catch { /* egal */ }
  return { topics: {}, exams: [], signsKnown: [] };
}
export function saveStats(profileId: string, c: DrivingCountry, s: DrivingStats) {
  try { localStorage.setItem(key(profileId, c), JSON.stringify({ ...s, exams: s.exams.slice(-20) })); } catch { /* egal */ }
}
export function recordAnswer(s: DrivingStats, q: DrivingQuestion, ok: boolean): DrivingStats {
  const t = s.topics[q.topic] ?? { right: 0, total: 0 };
  const signsKnown = ok && q.sign && !s.signsKnown.includes(q.sign) ? [...s.signsKnown, q.sign] : s.signsKnown;
  return { ...s, signsKnown, topics: { ...s.topics, [q.topic]: { right: t.right + (ok ? 1 : 0), total: t.total + 1 } } };
}
