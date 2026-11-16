import { describe, expect, it } from 'vitest';
import { CATS, GUIDES } from './guides';
import { ART_KEYS } from './art';

const both = (t: unknown) => typeof t === 'object' && t !== null && (t as { de: string }).de.trim() !== '' && (t as { it: string }).it.trim() !== '';

describe('Lernito Adult – Anleitungen', () => {
  it('hat eindeutige IDs und jeden Bereich mit Inhalt', () => {
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
    for (const c of CATS) expect(GUIDES.filter((g) => g.cat === c.id).length).toBeGreaterThanOrEqual(3);
  });
  it('alle Texte auf Deutsch und Italienisch', () => {
    for (const g of GUIDES) {
      expect(both(g.title), g.id).toBe(true);
      expect(both(g.sub), g.id).toBe(true);
      for (const s of g.steps) expect(both(s.text), g.id).toBe(true);
      for (const m of g.materials ?? []) expect(both(m), g.id).toBe(true);
    }
  });
  it('jede Illustration existiert', () => {
    for (const g of GUIDES) {
      expect(ART_KEYS, g.id).toContain(g.cover);
      for (const s of g.steps) if (s.art) expect(ART_KEYS, `${g.id}: ${s.art}`).toContain(s.art);
    }
  });
  it('Programmieraufgaben sind am Anfang noch nicht gelöst', () => {
    for (const g of GUIDES) for (const s of g.steps) if (s.code) expect(s.code.check.test(s.code.start), g.id).toBe(false);
  });
  it('Quizantworten sind gültig', () => {
    for (const g of GUIDES) for (const q of g.quiz ?? []) expect(q.answer).toBeLessThan(q.options.length);
  });
  it('Rezepte haben Portionen', () => {
    for (const g of GUIDES.filter((x) => x.ingredients)) expect(g.servings, g.id).toBeGreaterThan(0);
  });
});
