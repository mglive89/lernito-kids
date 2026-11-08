import type { ChoiceTask, LearningModule, Rng, Task } from '../learning/types';
import { shuffle } from '../lib/random';

export interface Cue { start: number; end: number; text: string }
export interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  emoji: string;
  duration: number;
  cues: Cue[];
  quiz: (rng: Rng) => Task[];
  /** Eingebaute animierte Lektion oder hochgeladene Videodatei */
  kind: 'animiert' | 'datei';
  mediaId?: string;
  subtitleMediaId?: string;
}

const q = (id: string, prompt: string, a: string, f: string[], hint: string, rng: Rng, emoji?: string): ChoiceTask => ({
  id, type: 'choice', prompt, visual: emoji ? { kind: 'bigEmoji', emoji } : undefined,
  options: shuffle(rng, [a, ...f]).map((x) => ({ id: x, label: x })), correctId: a, optionStyle: 'big', hint, explain: [`Richtig ist ${a}.`, hint]
});

export const LESSONS: Lesson[] = [
  {
    id: 'video-plus', kind: 'animiert', title: 'Was bedeutet Plus?', emoji: '🍎', subject: 'mathe', topic: 'Addition',
    description: 'Puppy zeigt dir mit Äpfeln, wie Zusammenzählen funktioniert.',
    duration: 40,
    cues: [
      { start: 0, end: 5, text: 'Hallo! Ich bin Puppy. Heute lernen wir, was Plus bedeutet.' },
      { start: 5, end: 11, text: 'Schau mal: In meinem Korb liegen drei Äpfel.' },
      { start: 11, end: 17, text: 'Jetzt kommen noch zwei Äpfel dazu!' },
      { start: 17, end: 26, text: 'Wir zählen alle zusammen: eins, zwei, drei, vier, fünf.' },
      { start: 26, end: 34, text: 'Das schreibt man so: drei plus zwei gleich fünf.' },
      { start: 34, end: 40, text: 'Plus heißt: zusammenzählen. Probier es gleich selbst im Quiz!' }
    ],
    quiz: (rng) => [
      q('vq1', 'Drei Äpfel und zwei Äpfel. Wie viele sind es zusammen?', '5', ['4', '6'], 'Zähle alle Äpfel zusammen.', rng, '🍎'),
      q('vq2', 'Was bedeutet Plus?', 'zusammenzählen', ['wegnehmen', 'teilen'], 'Bei Plus kommt etwas dazu.', rng, '➕'),
      q('vq3', 'Wie viel ist 2 + 2?', '4', ['3', '5'], 'Zwei und noch zwei dazu.', rng),
      q('vq4', 'Wie viel ist 4 + 1?', '5', ['6', '3'], 'Eins mehr als vier.', rng)
    ]
  }
];

export function lessonQuizModule(lesson: Lesson): LearningModule {
  return {
    id: `quiz-${lesson.id}`, title: `Quiz: ${lesson.title}`, subtitle: 'Nach dem Video', emoji: '🎬', color: 'lila',
    area: 'video', subject: lesson.subject, topic: lesson.topic, roundSize: 4,
    generate: (_l, rng) => lesson.quiz(rng)
  };
}

export function activeCue(cues: Cue[], t: number): Cue | undefined {
  return cues.find((c) => t >= c.start && t < c.end);
}

/** Parser für einfache WebVTT-Untertitel (für hochgeladene Videos). */
export function parseVtt(vtt: string): Cue[] {
  const toSec = (s: string) => {
    const parts = s.trim().split(':').map((p) => parseFloat(p.replace(',', '.')));
    return parts.reduce((acc, p) => acc * 60 + p, 0);
  };
  const cues: Cue[] = [];
  for (const block of vtt.replace(/\r/g, '').split(/\n\n+/)) {
    const lines = block.split('\n');
    const idx = lines.findIndex((l) => l.includes('-->'));
    if (idx < 0) continue;
    const [a, b] = lines[idx]!.split('-->');
    if (!a || !b) continue;
    cues.push({ start: toSec(a), end: toSec(b.trim().split(' ')[0]!), text: lines.slice(idx + 1).join(' ').trim() });
  }
  return cues;
}
