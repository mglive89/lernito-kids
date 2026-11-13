import { describe, expect, it } from 'vitest';
import { checkAnswer, solveTask, splitTasks } from './solve';
import { setLang } from '../i18n';
import type { Solution } from './types';

function ok(raw: string): Solution {
  const r = solveTask(raw);
  if (!r.ok) throw new Error(`${raw}: ${r.reason}`);
  return r.solution;
}

describe('Hausaufgaben-Erklärer', () => {
  setLang('it');

  it('rechnet schriftlich mit Überträgen', () => {
    expect(ok('345 + 278 =').answer).toBe('623');
    expect(ok('1000 - 1').answer).toBe('999');
    expect(ok('503 − 278').answer).toBe('225');
    expect(ok('345 × 7').answer).toBe('2415');
    expect(ok('123 x 45').answer).toBe('5535');
    expect(ok('12,5 + 3,75').answer).toBe('16,25');
    expect(ok('7,2 - 3,45').answer).toBe('3,75');
    expect(ok('2,5 · 1,2').answer).toBe('3');
  });

  it('teilt schriftlich mit Rest', () => {
    const s = ok('457 : 3');
    expect(s.answer).toBe('152 resto 1');
    expect(checkAnswer(s, '152 r 1')).toBe(true);
    expect(checkAnswer(s, '152')).toBe(false);
    expect(ok('1206 ÷ 6').answer).toBe('201');
    expect(ok('42 : 6').answer).toBe('7');
  });

  it('erklärt kleine Aufgaben im Kopf', () => {
    const s = ok('8 + 5');
    expect(s.answer).toBe('13');
    expect(s.steps[0]!.text).toContain('8 + 2 = 10');
    expect(ok('13 - 5').answer).toBe('8');
    expect(ok('7 × 8').answer).toBe('56');
  });

  it('beachtet Klammern und Punkt vor Strich', () => {
    const s = ok('2 + 3 × 4');
    expect(s.answer).toBe('14');
    expect(s.steps[0]!.title).toContain('3 × 4 = 12');
    expect(ok('[ (2 + 3) × 4 - 5 ] : 3').answer).toBe('5');
    expect(ok('{ 20 - [ 3 × (4 - 2) ] } : 7').answer).toBe('2');
    expect(ok('2^3 + 1').answer).toBe('9');
    expect(ok('5 - 8').answer).toBe('−3');
  });

  it('rechnet mit Brüchen', () => {
    const s = ok('1/2 + 1/3');
    expect(s.answer).toBe('5/6');
    expect(s.steps[0]!.text).toContain('6');
    expect(ok('3/4 × 2/3').answer).toBe('1/2');
    expect(ok('1/2 : 1/4').answer).toBe('2');
  });

  it('löst Gleichungen und Platzhalter', () => {
    expect(ok('3x + 5 = 20').answer).toBe('x = 5');
    expect(ok('2(x + 1) = x + 7').answer).toBe('x = 5');
    expect(ok('5x - 3 = 2x + 9').answer).toBe('x = 4');
    expect(ok('x/2 = 3').answer).toBe('x = 6');
    expect(ok('7 + ? = 15').answer).toBe('? = 8');
    expect(ok('7 + __ = 15').answer).toBe('? = 8');
    expect(ok('? × 4 = 28').answer).toBe('? = 7');
    const s = ok('3x + 5 = 20');
    expect(checkAnswer(s, 'x = 5')).toBe(true);
    expect(checkAnswer(s, '5')).toBe(true);
  });

  it('prozent und Kontrolle eines geschriebenen Ergebnisses', () => {
    expect(ok('20% di 150').answer).toBe('30');
    const right = ok('345 + 278 = 623');
    expect(right.check?.correct).toBe(true);
    const wrong = ok('345 + 278 = 613');
    expect(wrong.check?.correct).toBe(false);
    expect(ok('3 x 4 = 12').check?.correct).toBe(true);
  });

  it('meldet unlesbare Aufgaben freundlich', () => {
    expect(solveTask('ciao').ok).toBe(false);
    expect(solveTask('5 : 0').ok).toBe(false);
    expect(solveTask('x^2 = 4').ok).toBe(false);
  });

  it('zerlegt erkannten Text in Aufgaben', () => {
    expect(splitTasks('Esercizi\na) 345 + 278 =\n\nb) 12 x 4 =\nNome: Luca')).toEqual(['a) 345 + 278 =', 'b) 12 x 4 =']);
    expect(ok('a) 345 + 278 =').answer).toBe('623');
  });

  it('schreibt auf Deutsch mit Malpunkt', () => {
    setLang('de');
    const s = ok('457 : 3');
    expect(s.answer).toBe('152 Rest 1');
    expect(ok('2 + 3 * 4').steps[0]!.title).toContain('3 · 4');
    setLang('it');
  });
});
