import { describe, expect, it } from 'vitest';
import { createRng } from '../lib/random';
import { applyRound, emptyModuleProgress, pathDoneOf } from './adaptive';
import { BUILTIN_MODULES, schoolModules } from './registry';
import { FINAL_TIERS, challengePassed, finalModule, finalUnlocked, mixedTasks, neededFor, profiTasks } from './challenge';
import { newBadges } from './rewards';

const pathMods = BUILTIN_MODULES.filter((m) => m.area === 'schule' || m.area === 'lingue');

describe('Profi-Lektion', () => {
  it('liefert für jedes Pfad-Thema mehr Aufgaben auf Stufe 3 mit eindeutigen IDs', () => {
    for (const m of pathMods) {
      const base = m.generate(3, createRng(7)).length;
      const t = profiTasks(m, createRng(7));
      expect(t.length, m.id).toBeGreaterThanOrEqual(base);
      expect(t.length, m.id).toBeLessThanOrEqual(15);
      expect(new Set(t.map((x) => x.id)).size, m.id).toBe(t.length);
    }
  });

  it('ist in den meisten Themen deutlich länger als Lektion 3', () => {
    const longer = pathMods.filter((m) => profiTasks(m, createRng(3)).length > m.generate(3, createRng(3)).length);
    expect(longer.length / pathMods.length).toBeGreaterThan(0.7);
  });

  it('gilt erst ab dem Ziel als bestanden', () => {
    expect(neededFor(12, 0.8)).toBe(10);
    expect(neededFor(10, 0.8)).toBe(8);
    expect(challengePassed({ firstTry: 7, total: 10 }, 0.8)).toBe(false);
    expect(challengePassed({ firstTry: 8, total: 10 }, 0.8)).toBe(true);
    expect(challengePassed({ firstTry: 0, total: 0 }, 0.8)).toBe(false);
  });

  it('Pfad zählt bis Lektion 4 und vergibt das Profi-Abzeichen', () => {
    const p = applyRound({ ...emptyModuleProgress(), rounds: 3, pathDone: 3 }, { moduleId: 'x', total: 10, firstTry: 9, solved: 10, hintsUsed: 0, durationSec: 60, pathStep: 4 });
    expect(pathDoneOf(p)).toBe(4);
    const ctx = { stars: 0, rounds: 1, modules: { x: p }, activeDays: 1, videosWatched: 0, avatarCustomized: false, minigamesPlayed: 0 };
    expect(newBadges(ctx, []).map((b) => b.id)).toContain('profi');
  });
});

describe('Endrunde', () => {
  const mods = schoolModules('DE', 3, 'mathe');

  it('mischt Aufgaben aus mehreren Einheiten in der Größe der Stufe', () => {
    for (const tier of FINAL_TIERS) {
      const t = finalModule(mods, 'mathe', 3, 'Mathe', tier).generate(tier.level, createRng(11));
      expect(t.length).toBe(tier.size);
      expect(new Set(t.map((x) => x.id)).size).toBe(t.length);
      expect(new Set(t.map((x) => x.id.split(':')[0])).size).toBeGreaterThan(Math.min(4, mods.length) - 1);
    }
  });

  it('Stufen werden länger und das Ziel höher', () => {
    for (let i = 1; i < FINAL_TIERS.length; i++) {
      expect(FINAL_TIERS[i]!.size).toBeGreaterThan(FINAL_TIERS[i - 1]!.size);
      expect(FINAL_TIERS[i]!.goal).toBeGreaterThan(FINAL_TIERS[i - 1]!.goal);
    }
  });

  it('öffnet sich erst, wenn jede Einheit Lektion 3 geschafft hat', () => {
    const all = Object.fromEntries(mods.map((m) => [m.id, { ...emptyModuleProgress(), rounds: 3, pathDone: 3 }]));
    expect(finalUnlocked(mods, all)).toBe(true);
    const { [mods[0]!.id]: _, ...missing } = all;
    expect(finalUnlocked(mods, missing)).toBe(false);
    expect(finalUnlocked([], {})).toBe(false);
  });

  it('funktioniert in jedem Fach und jeder Klasse', () => {
    for (const subj of ['mathe', 'deutsch', 'italiano', 'englisch', 'sachunterricht', 'scienze', 'storia', 'informatik']) {
      for (const y of [1, 4, 7, 11]) {
        const mods2 = schoolModules('IT', y, subj).concat(schoolModules('DE', y, subj));
        if (!mods2.length) continue;
        const t = mixedTasks(mods2, 3, 12, createRng(y));
        expect(t.length, `${subj} ${y}`).toBeGreaterThan(0);
      }
    }
  });
});
