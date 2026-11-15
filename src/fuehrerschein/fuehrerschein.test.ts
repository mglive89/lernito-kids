import { describe, expect, it } from 'vitest';
import { createRng } from '../lib/random';
import { buildExam, drivingAvailable, EXAM_RULES, isCorrect, questionsFor, recordAnswer, scoreExam, topicsFor, type DrivingCountry } from './bank';
import { hasDrawing, SIGNS } from './signs';

const COUNTRIES: DrivingCountry[] = ['DE', 'IT'];
const both = (t: unknown) => typeof t === 'object' && t !== null && (t as { de: string }).de.length > 0 && (t as { it: string }).it.length > 0;

describe('Führerschein-Theorie', () => {
  it('ist ab Klasse 13 frei, vorher nur mit Freischaltung', () => {
    expect(drivingAvailable(13)).toBe(true);
    expect(drivingAvailable(12)).toBe(false);
    expect(drivingAvailable(11, true)).toBe(true);
  });

  it('jedes Zeichen hat eine eigene Zeichnung und zweisprachige Texte', () => {
    expect(SIGNS.length).toBeGreaterThanOrEqual(35);
    for (const s of SIGNS) {
      expect(hasDrawing(s.id), s.id).toBe(true);
      expect(both(s.name) && both(s.meaning), s.id).toBe(true);
    }
    expect(new Set(SIGNS.map((s) => s.id)).size).toBe(SIGNS.length);
  });

  for (const c of COUNTRIES) {
    it(`${c}: Fragen sind gültig, eindeutig und zweisprachig`, () => {
      const qs = questionsFor(c);
      expect(qs.length).toBeGreaterThan(70);
      expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
      const topics = new Set(topicsFor(c).map((t) => t.id));
      for (const q of qs) {
        expect(topics.has(q.topic), `${q.id} Thema ${q.topic}`).toBe(true);
        expect(q.options.some((o) => o.ok), q.id).toBe(true);
        expect(both(q.q) && both(q.expl), q.id).toBe(true);
        if (c === 'IT') expect(q.options).toHaveLength(2);
        else expect(q.points).toBeGreaterThanOrEqual(2);
        if (q.sign) expect(SIGNS.some((s) => s.id === q.sign), q.id).toBe(true);
      }
      for (const t of topics) expect(qs.some((q) => q.topic === t), t).toBe(true);
    });

    it(`${c}: Prüfung hat ${EXAM_RULES[c].questions} verschiedene Fragen aus allen Themen`, () => {
      for (const seed of [1, 2, 3]) {
        const exam = buildExam(c, createRng(seed));
        expect(exam).toHaveLength(EXAM_RULES[c].questions);
        expect(new Set(exam.map((q) => q.id)).size).toBe(exam.length);
        expect(new Set(exam.map((q) => q.topic)).size).toBe(topicsFor(c).length);
      }
    });
  }

  it('Antwort zählt nur, wenn genau die richtigen Optionen gewählt sind', () => {
    const q = questionsFor('DE').find((x) => x.options.filter((o) => o.ok).length === 2)!;
    const right = q.options.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0);
    expect(isCorrect(q, right)).toBe(true);
    expect(isCorrect(q, right.slice(0, 1))).toBe(false);
    expect(isCorrect(q, [0, 1, 2])).toBe(false);
  });

  it('DE: bestanden bis 10 Fehlerpunkte, nicht bei zwei falschen 5-Punkte-Fragen', () => {
    const exam = buildExam('DE', createRng(7));
    const perfect = exam.map((q) => q.options.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0));
    expect(scoreExam('DE', exam, perfect)).toMatchObject({ passed: true, errors: 0, correct: 30 });
    const fives = exam.map((q, i) => (q.points === 5 ? i : -1)).filter((i) => i >= 0);
    if (fives.length >= 2) {
      const a = [...perfect]; a[fives[0]!] = []; a[fives[1]!] = [];
      const r = scoreExam('DE', exam, a);
      expect(r.errors).toBe(10);
      expect(r.failedByFives).toBe(true);
      expect(r.passed).toBe(false);
    }
  });

  it('IT: bestanden mit höchstens 3 Fehlern', () => {
    const exam = buildExam('IT', createRng(9));
    const perfect = exam.map((q) => [q.options.findIndex((o) => o.ok)]);
    const wrong = (n: number) => perfect.map((a, i) => (i < n ? [1 - a[0]!] : a));
    expect(scoreExam('IT', exam, wrong(3)).passed).toBe(true);
    expect(scoreExam('IT', exam, wrong(4)).passed).toBe(false);
  });

  it('Lernstand zählt pro Thema und merkt sich erkannte Zeichen', () => {
    const q = questionsFor('IT').find((x) => x.sign)!;
    const s = recordAnswer({ topics: {}, exams: [], signsKnown: [] }, q, true);
    expect(s.topics[q.topic]).toEqual({ right: 1, total: 1 });
    expect(s.signsKnown).toContain(q.sign);
  });
});
