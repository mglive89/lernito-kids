import { describe, expect, it } from 'vitest';
import { HEART_REGEN_MS, MAX_HEARTS, freshPlay, settle, useLangPlay } from './play-state';

describe('Herzen und Missionen im Sprachkurs', () => {
  it('Herzen wachsen mit der Zeit nach, höchstens bis zum Maximum', () => {
    const t0 = new Date(2026, 10, 16, 10, 0).getTime();
    const p = { ...freshPlay(t0), hearts: 2, nextAt: t0 + HEART_REGEN_MS };
    expect(settle(p, t0 + HEART_REGEN_MS - 1).hearts).toBe(2);
    const later = settle(p, t0 + HEART_REGEN_MS * 2 + 5);
    expect(later.hearts).toBe(4);
    expect(later.nextAt).toBe(t0 + HEART_REGEN_MS * 3);
    expect(settle(p, t0 + HEART_REGEN_MS * 10).hearts).toBe(MAX_HEARTS);
    expect(settle(p, t0 + HEART_REGEN_MS * 10).nextAt).toBeNull();
  });
  it('Tageszähler beginnen jeden Tag neu', () => {
    const t0 = new Date(2026, 10, 16, 23, 0).getTime();
    const p = { ...freshPlay(t0), dayXp: 40, dayLessons: 3, claimed: ['xp20'], xp: 120 };
    const next = settle(p, t0 + 2 * 3600_000);
    expect(next.dayXp).toBe(0);
    expect(next.claimed).toEqual([]);
    expect(next.xp).toBe(120);
  });
  it('Fehler kosten Herzen, Missionen geben eins zurück', () => {
    const s = useLangPlay.getState();
    const t = new Date(2026, 10, 16, 9, 0).getTime();
    for (let i = 0; i < 5; i++) s.loseHeart('kind', t);
    expect(useLangPlay.getState().loseHeart('kind', t)).toBe(0);
    expect(useLangPlay.getState().claim('kind', 'xp20', t)).toBe(false);
    useLangPlay.getState().lessonDone('kind', 25, t);
    expect(useLangPlay.getState().claim('kind', 'xp20', t)).toBe(true);
    expect(useLangPlay.getState().claim('kind', 'xp20', t)).toBe(false);
    expect(settle(useLangPlay.getState().byProfile.kind, t).hearts).toBe(1);
  });
});
