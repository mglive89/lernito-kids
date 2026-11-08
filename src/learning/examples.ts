import type { LearningModule, Task, Visual } from './types';
import { createRng } from '../lib/random';

export interface WorkedExample { prompt: string; visual?: Visual; answer: string; steps: string[] }

/** Antwort einer Aufgabe als Text (für Beispiele auf der Theorie-Seite). */
export function answerText(t: Task): string | null {
  switch (t.type) {
    case 'choice': {
      const o = t.options.find((x) => x.id === t.correctId);
      return o ? (o.label ?? o.speak ?? o.emoji ?? o.id) : null;
    }
    case 'input': return String(t.answer).replace('-', '−');
    case 'wordbuild': return t.solution.join(t.solution.some((x) => x.length > 1) ? '-' : '');
    case 'order': return t.correctOrder.map((id) => t.items.find((i) => i.id === id)?.label ?? id).join(' → ');
    default: return null;
  }
}

/** Gelöste Beispielaufgaben, immer gleich (fester Startwert), aus Stufe 1 und 2. */
export function workedExamples(m: LearningModule, n = 3): WorkedExample[] {
  const out: WorkedExample[] = [];
  const seen = new Set<string>();
  for (const [level, seed] of [[1, 7], [2, 11], [3, 13]] as const) {
    let tasks: Task[] = [];
    try { tasks = m.generate(level, createRng(seed)); } catch { tasks = []; }
    for (const t of tasks) {
      if (out.length >= n) return out;
      const a = answerText(t);
      const key = t.prompt + (a ?? '') + JSON.stringify(t.visual ?? '');
      if (!a || seen.has(key)) continue;
      // Bild-Visuals (3D, Medien) eignen sich nicht für die statische Ansicht
      if (t.visual && (t.visual.kind === 'solid3d' || t.visual.kind === 'count3d' || t.visual.kind === 'image')) continue;
      seen.add(key);
      out.push({ prompt: t.prompt, visual: t.visual, answer: a, steps: cleanSteps(t.explain, a) });
      break; // höchstens ein Beispiel je Stufe zuerst
    }
  }
  // Mit weiteren Aufgaben aus Stufe 1 auffüllen
  if (out.length < n) {
    let tasks: Task[] = [];
    try { tasks = m.generate(1, createRng(99)); } catch { tasks = []; }
    for (const t of tasks) {
      if (out.length >= n) break;
      const a = answerText(t);
      const key = t.prompt + (a ?? '') + JSON.stringify(t.visual ?? '');
      if (!a || seen.has(key) || (t.visual && ['solid3d', 'count3d', 'image'].includes(t.visual.kind))) continue;
      seen.add(key);
      out.push({ prompt: t.prompt, visual: t.visual, answer: a, steps: cleanSteps(t.explain, a) });
    }
  }
  return out;
}

/** Schritte ohne Wiederholung der Lösung („Richtig ist: …“) */
function cleanSteps(steps: string[], answer: string): string[] {
  return steps.filter((s) => !(s.endsWith(answer) && /^(Richtig ist|La risposta giusta è)/.test(s)));
}
