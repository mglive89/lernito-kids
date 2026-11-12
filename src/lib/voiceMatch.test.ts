import { describe, expect, it } from 'vitest';
import { matchOption, parseSpokenNumber, phraseScore, SPEAK_PASS, wordsHeard } from './voiceMatch';
import { generateLesson, COURSES, coursesFor, tokens } from '../lingue/course';
import { UNITS } from '../lingue/data';
import { createRng } from './random';

describe('Aussprache bewerten', () => {
  it('akzeptiert richtige und fast richtige Aussprache', () => {
    expect(phraseScore('Good morning', ['good morning'])).toBe(1);
    expect(phraseScore('I have a cat.', ['I have a cap'])).toBeGreaterThanOrEqual(SPEAK_PASS);
    expect(phraseScore('J’ai un chat.', ["j'ai un chat"])).toBeGreaterThanOrEqual(SPEAK_PASS);
    expect(phraseScore('¿Cómo estás?', ['como estas'])).toBe(1);
    expect(phraseScore('der Hund', ['Hund'])).toBeGreaterThanOrEqual(SPEAK_PASS);
  });
  it('lehnt falsche Antworten ab', () => {
    expect(phraseScore('The sky is blue.', ['I like pizza'])).toBeLessThan(SPEAK_PASS);
    expect(phraseScore('dog', ['cat'])).toBeLessThan(SPEAK_PASS);
  });
  it('versteht Ziffern als Zahlwort der Kurssprache', () => {
    expect(phraseScore('seven', ['7'], 'en-GB')).toBe(1);
    expect(phraseScore('I am seven years old.', ['I am 7 years old'], 'en-GB')).toBeGreaterThanOrEqual(0.95);
    expect(phraseScore('Ho sette anni.', ['ho 7 anni'], 'it-IT')).toBeGreaterThanOrEqual(0.95);
  });
  it('markiert fehlende Wörter', () => {
    expect(wordsHeard('I have a red pencil.', ['I have a pencil'])).toEqual([true, true, true, false, true]);
  });
});

describe('Antwort per Sprache wählen', () => {
  it('findet die gesagte Möglichkeit', () => {
    expect(matchOption(['Berlino'], ['Roma', 'Berlino', 'Parigi'])).toBe(1);
    expect(matchOption(['ich glaube Paris'], ['Rom', 'Berlin', 'Paris'])).toBe(2);
    expect(matchOption(['dodici'], ['10', '12', '14'], 'it')).toBe(1);
    expect(matchOption(['quark'], ['Rom', 'Berlin', 'Paris'])).toBeNull();
  });
  it('liest Zahlen aus Ziffern und Zahlwörtern', () => {
    expect(parseSpokenNumber('42')).toBe(42);
    expect(parseSpokenNumber('das sind zweiundvierzig')).toBe(42);
    expect(parseSpokenNumber('ventitré')).toBe(23);
    expect(parseSpokenNumber('meno 5')).toBe(-5);
    expect(parseSpokenNumber('minus drei')).toBe(-3);
    expect(parseSpokenNumber('hallo')).toBeNull();
  });
});

describe('Sprachkurse', () => {
  it('bietet die eigene Sprache nicht als Kurs an', () => {
    expect(coursesFor('it').map((c) => c.id)).toEqual(['en', 'de', 'fr', 'es']);
    expect(coursesFor('de').map((c) => c.id)).toEqual(['en', 'it', 'fr', 'es']);
  });
  it('jede Lektion enthält Sprechen, und Sätze sind lösbar', () => {
    for (const course of COURSES) {
      for (const unit of UNITS) {
        for (const lv of [1, 2, 3] as const) {
          const tasks = generateLesson(unit, course, lv, createRng(lv * 7), course.id === 'it' ? 'de' : 'it');
          expect(tasks.some((t) => t.type === 'speak'), `${course.id}/${unit.id}/${lv}`).toBe(true);
          for (const t of tasks) if (t.type === 'sentence') expect(t.words.length).toBeGreaterThan(0);
        }
      }
    }
  });
  it('trennt Satzzeichen von Wörtern', () => {
    expect(tokens('¿Dónde está mi libro?')).toEqual(['Dónde', 'está', 'mi', 'libro']);
    expect(tokens('Comment ça va ?')).toEqual(['Comment', 'ça', 'va']);
  });
});

describe('Theorie der Sprachkurse', () => {
  it('hat für jede Einheit und Sprache Regeln mit Schritten und Aussprache-Tipps', async () => {
    const { NOTES, PRONUNCIATION, genderOf } = await import('../lingue/theory');
    for (const course of COURSES) {
      expect(PRONUNCIATION[course.id].length, course.id).toBeGreaterThanOrEqual(4);
      for (const unit of UNITS) {
        const notes = NOTES[unit.id]?.[course.id] ?? [];
        expect(notes.length, `${course.id}/${unit.id}`).toBeGreaterThan(0);
        for (const n of notes) expect(n.steps.length, `${course.id}/${unit.id}`).toBeGreaterThan(0);
      }
    }
    expect(genderOf('das Pferd', 'de')).toBe('n');
    expect(genderOf('la mela', 'it')).toBe('f');
    expect(genderOf('dog', 'en')).toBeNull();
  });
});
