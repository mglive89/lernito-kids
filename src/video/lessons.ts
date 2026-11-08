import type { ChoiceTask, LearningModule, Rng, Task } from '../learning/types';
import { shuffle } from '../lib/random';
import { L, tx, type Txt } from '../i18n';

const inLang = (t: Txt, l: 'de' | 'it') => (typeof t === 'string' ? t : t[l]);

export interface Cue { start: number; end: number; text: Txt }
export interface Lesson {
  id: string;
  title: Txt;
  description: Txt;
  subject: string;
  topic: Txt;
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
  options: shuffle(rng, [a, ...f]).map((x) => ({ id: x, label: x })), correctId: a, optionStyle: 'big', hint, explain: [L(`Richtig ist ${a}.`, `La risposta giusta è ${a}.`), hint]
});

export const LESSONS: Lesson[] = [
  {
    id: 'video-plus', kind: 'animiert', title: tx('Was bedeutet Plus?', 'Che cosa vuol dire più?'), emoji: '🍎', subject: 'mathe', topic: tx('Addition', 'Addizione'),
    description: tx('Puppy zeigt dir mit Äpfeln, wie Zusammenzählen funktioniert.', 'Puppy ti mostra con le mele come si fa l’addizione.'),
    duration: 40,
    cues: [
      { start: 0, end: 5, text: tx('Hallo! Ich bin Puppy. Heute lernen wir, was Plus bedeutet.', 'Ciao! Sono Puppy. Oggi impariamo che cosa vuol dire più.') },
      { start: 5, end: 11, text: tx('Schau mal: In meinem Korb liegen drei Äpfel.', 'Guarda: nel mio cestino ci sono tre mele.') },
      { start: 11, end: 17, text: tx('Jetzt kommen noch zwei Äpfel dazu!', 'Adesso arrivano altre due mele!') },
      { start: 17, end: 26, text: tx('Wir zählen alle zusammen: eins, zwei, drei, vier, fünf.', 'Contiamole tutte insieme: uno, due, tre, quattro, cinque.') },
      { start: 26, end: 34, text: tx('Das schreibt man so: drei plus zwei gleich fünf.', 'Si scrive così: tre più due uguale cinque.') },
      { start: 34, end: 40, text: tx('Plus heißt: zusammenzählen. Probier es gleich selbst im Quiz!', 'Più vuol dire: mettere insieme. Prova subito nel quiz!') }
    ],
    quiz: (rng) => [
      q('vq1', L('Drei Äpfel und zwei Äpfel. Wie viele sind es zusammen?', 'Tre mele e due mele. Quante sono in tutto?'), '5', ['4', '6'], L('Zähle alle Äpfel zusammen.', 'Conta tutte le mele insieme.'), rng, '🍎'),
      q('vq2', L('Was bedeutet Plus?', 'Che cosa vuol dire più?'), L('zusammenzählen', 'mettere insieme'), [L('wegnehmen', 'togliere'), L('teilen', 'dividere')], L('Bei Plus kommt etwas dazu.', 'Con il più si aggiunge qualcosa.'), rng, '➕'),
      q('vq3', L('Wie viel ist 2 + 2?', 'Quanto fa 2 + 2?'), '4', ['3', '5'], L('Zwei und noch zwei dazu.', 'Due e altri due.'), rng),
      q('vq4', L('Wie viel ist 4 + 1?', 'Quanto fa 4 + 1?'), '5', ['6', '3'], L('Eins mehr als vier.', 'Uno in più di quattro.'), rng)
    ]
  }
];

export function lessonQuizModule(lesson: Lesson): LearningModule {
  return {
    id: `quiz-${lesson.id}`, title: tx(`Quiz: ${inLang(lesson.title, 'de')}`, `Quiz: ${inLang(lesson.title, 'it')}`), subtitle: tx('Nach dem Video', 'Dopo il video'), emoji: '🎬', color: 'lila',
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
