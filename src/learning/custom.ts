import type { ChoiceTask, Difficulty, LearningModule, SubjectId } from './types';
import type { Country } from '../school/systems';
import { SUBJECTS } from '../school/subjects';
import { L } from '../i18n';
import { shuffle } from '../lib/random';

export interface CustomQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explain: string;
  emoji?: string;
  imageMediaId?: string;
}

export interface CustomModule {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: LearningModule['color'];
  /** 'kita' oder ein Schuljahr 1–13 */
  target: 'kita' | number;
  /** Land, für das die Einheit gedacht ist (Standard: alle) */
  country?: Country;
  subject: SubjectId;
  difficulty: Difficulty;
  published: boolean;
  questions: CustomQuestion[];
  videoMediaId?: string;
  updatedAt: string;
}

export interface SubjectSetting { id: SubjectId; name: string; emoji: string; enabled: boolean; builtin: boolean }

/** Fächer, die Eltern ein- und ausschalten können. Namen werden in der UI über subjectName() übersetzt. */
export const DEFAULT_SUBJECTS: SubjectSetting[] = SUBJECTS.filter((s) => s.id !== 'scienze').map((s) => ({
  id: s.id, name: typeof s.name === 'string' ? s.name : s.name.de, emoji: s.emoji, enabled: true, builtin: true
}));

export function validateCustomModule(m: CustomModule): string[] {
  const errors: string[] = [];
  if (!m.title.trim()) errors.push('Bitte einen Titel angeben.');
  if (m.questions.length === 0) errors.push('Mindestens eine Frage anlegen.');
  m.questions.forEach((q, i) => {
    if (!q.prompt.trim()) errors.push(`Frage ${i + 1}: Aufgabentext fehlt.`);
    const filled = q.options.filter((o) => o.trim());
    if (filled.length < 2) errors.push(`Frage ${i + 1}: Mindestens zwei Antworten angeben.`);
    if (!q.options[q.correctIndex]?.trim()) errors.push(`Frage ${i + 1}: Die richtige Antwort ist leer.`);
    if (new Set(filled.map((o) => o.trim())).size !== filled.length) errors.push(`Frage ${i + 1}: Antworten müssen unterschiedlich sein.`);
  });
  return errors;
}

export function customToModule(c: CustomModule): LearningModule {
  return {
    id: c.id,
    title: c.title,
    subtitle: c.subtitle || L('Eigene Lerneinheit', 'Unità personalizzata'),
    emoji: c.emoji || '✨',
    color: c.color,
    area: c.target === 'kita' ? 'kita' : 'schule',
    years: c.target === 'kita' ? undefined : [c.target, c.target],
    countries: c.country ? [c.country] : undefined,
    subject: c.target === 'kita' ? undefined : c.subject,
    topic: c.title,
    roundSize: c.questions.length,
    custom: true,
    generate: (_level, rng) =>
      shuffle(rng, c.questions).map((q, i): ChoiceTask => {
        const opts = q.options.map((o, k) => ({ text: o.trim(), k })).filter((o) => o.text);
        return {
          id: `${c.id}-${q.id}-${i}`,
          type: 'choice',
          prompt: q.prompt,
          visual: q.imageMediaId ? { kind: 'image', mediaId: q.imageMediaId, alt: q.prompt } : q.emoji ? { kind: 'bigEmoji', emoji: q.emoji } : undefined,
          options: shuffle(rng, opts).map((o) => ({ id: String(o.k), label: o.text })),
          correctId: String(q.correctIndex),
          optionStyle: 'text',
          hint: q.hint || L('Lies die Aufgabe noch einmal in Ruhe.', 'Rileggi la domanda con calma.'),
          explain: [L('Richtig ist: ', 'La risposta giusta è: ') + (q.options[q.correctIndex] ?? '') + '.', ...(q.explain ? [q.explain] : [])]
        };
      })
  };
}
