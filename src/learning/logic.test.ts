import { describe, expect, it } from 'vitest';
import { applyRound, emptyModuleProgress, needsPractice, nextDifficulty, roundMessage, roundStars } from './adaptive';
import { BADGES, levelFromXp, newBadges, starsForRound, xpForRound } from './rewards';
import { customToModule, validateCustomModule, type CustomModule } from './custom';
import { createRng, numberOptions, shuffle } from '../lib/random';
import { hashPin, sha256Hex } from '../lib/hash';
import { zahlInWorten } from '../lib/zahlInWorten';
import { parseVtt, activeCue, LESSONS } from '../video/lessons';

const round = (firstTry: number, total = 5, solved = total) => ({ moduleId: 'x', total, firstTry, solved, hintsUsed: 0, durationSec: 30 });

describe('Adaptives Lernen', () => {
  it('steigert die Schwierigkeit bei sehr guter Quote', () => {
    expect(nextDifficulty(1, 1)).toBe(2);
    expect(nextDifficulty(2, 0.9, [0.9])).toBe(3);
    expect(nextDifficulty(3, 1)).toBe(3);
  });
  it('senkt die Schwierigkeit bei vielen Fehlern', () => {
    expect(nextDifficulty(2, 0.2)).toBe(1);
    expect(nextDifficulty(1, 0)).toBe(1);
  });
  it('bleibt bei mittlerer Quote stabil', () => {
    expect(nextDifficulty(2, 0.7)).toBe(2);
  });
  it('steigt nicht nach einem Ausreißer direkt nach schwacher Runde', () => {
    expect(nextDifficulty(1, 0.85, [0.4])).toBe(1);
  });
  it('speichert Fortschritt nach Themen', () => {
    let p = emptyModuleProgress();
    p = applyRound(p, round(5));
    expect(p.level).toBe(2);
    expect(p.rounds).toBe(1);
    expect(p.tasks).toBe(5);
    expect(p.bestStars).toBe(3);
    p = applyRound(p, round(1));
    expect(p.level).toBe(1);
    expect(p.history).toEqual([1, 0.2]);
  });
  it('empfiehlt Wiederholung bei schwierigen Themen', () => {
    let p = emptyModuleProgress();
    expect(needsPractice(p)).toBe(false);
    p = applyRound(p, round(1));
    p = applyRound(p, round(2));
    expect(needsPractice(p)).toBe(true);
    p = applyRound(p, round(5));
    p = applyRound(p, round(5));
    expect(needsPractice(p)).toBe(false);
  });
  it('gibt immer mindestens einen Stern und nie negative Rückmeldung', () => {
    expect(roundStars(round(0))).toBe(1);
    expect(roundStars(round(5))).toBe(3);
    const msg = roundMessage(round(0), 0);
    expect(msg).not.toMatch(/schlecht|falsch|versagt/i);
    expect(msg.length).toBeGreaterThan(10);
  });
});

describe('Belohnungen', () => {
  it('Sterne und Punkte pro Runde', () => {
    expect(starsForRound(round(3, 5, 4))).toBe(4);
    expect(xpForRound(round(5))).toBe(5 * 10 + 5 * 2 + 10);
  });
  it('Level aus Punkten', () => {
    expect(levelFromXp(0).level).toBe(1);
    expect(levelFromXp(49).level).toBe(1);
    expect(levelFromXp(50).level).toBe(2);
    expect(levelFromXp(130).progress).toBeCloseTo(10 / 100);
    expect(levelFromXp(999999).next).toBeNull();
  });
  it('vergibt Abzeichen genau einmal', () => {
    const ctx = { stars: 12, rounds: 1, modules: {}, activeDays: 1, videosWatched: 0, avatarCustomized: false, minigamesPlayed: 0, lastRound: round(5) };
    const first = newBadges(ctx, []).map((b) => b.id);
    expect(first).toEqual(expect.arrayContaining(['erste-runde', 'sterne-10', 'perfekt']));
    expect(newBadges(ctx, first)).toEqual([]);
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });
});

describe('Eigene Inhalte (Admin)', () => {
  const base: CustomModule = {
    id: 'custom-1', title: 'Test', subtitle: '', emoji: '✨', color: 'himmel', target: 2, subject: 'mathe', difficulty: 1, published: true, updatedAt: '',
    questions: [{ id: 'q1', prompt: '2+2?', options: ['4', '5', '', ''], correctIndex: 0, hint: 'h', explain: '' }]
  };
  it('validiert Pflichtfelder', () => {
    expect(validateCustomModule(base)).toEqual([]);
    expect(validateCustomModule({ ...base, title: '' })).toHaveLength(1);
    expect(validateCustomModule({ ...base, questions: [{ ...base.questions[0]!, correctIndex: 2 }] }).length).toBeGreaterThan(0);
    expect(validateCustomModule({ ...base, questions: [{ ...base.questions[0]!, options: ['4', '4', '', ''] }] }).length).toBeGreaterThan(0);
  });
  it('wird zu spielbarem Modul ohne leere Antworten', () => {
    const m = customToModule(base);
    const [t] = m.generate(1, createRng(1));
    expect(t?.type).toBe('choice');
    if (t?.type === 'choice') {
      expect(t.options).toHaveLength(2);
      expect(t.options.find((o) => o.id === t.correctId)?.label).toBe('4');
    }
    expect(m.grade).toBe(2);
  });
});

describe('Hilfsfunktionen', () => {
  it('SHA-256 entspricht dem Standard', () => {
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Hex('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('PIN-Hash ist gesalzen', () => {
    expect(hashPin('1234', 'a', 10)).not.toBe(hashPin('1234', 'b', 10));
    expect(hashPin('1234', 'a', 10)).toBe(hashPin('1234', 'a', 10));
  });
  it('Zahl in Worten', () => {
    expect(zahlInWorten(1)).toBe('eins');
    expect(zahlInWorten(21)).toBe('einundzwanzig');
    expect(zahlInWorten(101)).toBe('einhunderteins');
    expect(zahlInWorten(348)).toBe('dreihundertachtundvierzig');
    expect(zahlInWorten(1999)).toBe('eintausendneunhundertneunundneunzig');
  });
  it('Zufall ist reproduzierbar und mischt vollständig', () => {
    expect(shuffle(createRng(5), [1, 2, 3, 4])).toEqual(shuffle(createRng(5), [1, 2, 3, 4]));
    expect(shuffle(createRng(5), [1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
    const opts = numberOptions(createRng(3), 5, 4, 1, 10);
    expect(opts).toContain(5);
    expect(new Set(opts).size).toBe(4);
  });
  it('WebVTT-Parser und Untertitel', () => {
    const cues = parseVtt('WEBVTT\n\n00:00:01.000 --> 00:00:03.500\nHallo Welt\n\n00:00:04.000 --> 00:00:06.000 align:center\nZweite Zeile');
    expect(cues).toEqual([{ start: 1, end: 3.5, text: 'Hallo Welt' }, { start: 4, end: 6, text: 'Zweite Zeile' }]);
    expect(activeCue(LESSONS[0]!.cues, 6)?.text).toMatch(/drei Äpfel/);
  });
});
