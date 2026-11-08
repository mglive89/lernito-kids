import type { ChoiceTask, Difficulty, Grade, LearningModule, SubjectId } from './types';
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
  /** 'kita' oder eine Klassenstufe */
  target: 'kita' | Grade;
  subject: SubjectId;
  difficulty: Difficulty;
  published: boolean;
  questions: CustomQuestion[];
  videoMediaId?: string;
  updatedAt: string;
}

export interface SubjectSetting { id: SubjectId; name: string; emoji: string; enabled: boolean; builtin: boolean }

export const DEFAULT_SUBJECTS: SubjectSetting[] = [
  { id: 'deutsch', name: 'Deutsch', emoji: '📖', enabled: true, builtin: true },
  { id: 'mathe', name: 'Mathematik', emoji: '🔢', enabled: true, builtin: true },
  { id: 'sachunterricht', name: 'Sachunterricht', emoji: '🌍', enabled: true, builtin: true },
  { id: 'englisch', name: 'Englisch', emoji: '🇬🇧', enabled: true, builtin: true }
];

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
    subtitle: c.subtitle || 'Eigene Lerneinheit',
    emoji: c.emoji || '✨',
    color: c.color,
    area: c.target === 'kita' ? 'kita' : 'schule',
    grade: c.target === 'kita' ? undefined : c.target,
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
          hint: q.hint || 'Lies die Aufgabe noch einmal in Ruhe.',
          explain: [`Richtig ist: ${q.options[q.correctIndex] ?? ''}.`, ...(q.explain ? [q.explain] : [])]
        };
      })
  };
}
