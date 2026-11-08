import { describe, expect, it } from 'vitest';
import { BUILTIN_MODULES } from './registry';
import { createRng } from '../lib/random';
import type { Difficulty, Task } from './types';
import { KITA_MODULES } from './modules/kita';
import { MATH_MODULES, uhrText, euro } from './modules/math';
import { GERMAN_MODULES } from './modules/german';
import { schoolModules } from './registry';
import { setLang, type Lang } from '../i18n';
import { setCountry, stageFor, type Country } from '../school/systems';

function checkTask(t: Task, ctx: string) {
  expect(t.prompt.trim().length, `${ctx}: prompt`).toBeGreaterThan(0);
  expect(t.hint.trim().length, `${ctx}: hint`).toBeGreaterThan(0);
  expect(t.explain.length, `${ctx}: explain`).toBeGreaterThan(0);
  switch (t.type) {
    case 'choice': {
      const ids = t.options.map((o) => o.id);
      expect(new Set(ids).size, `${ctx}: eindeutige Optionen ${ids.join(',')}`).toBe(ids.length);
      expect(ids, `${ctx}: Lösung enthalten`).toContain(t.correctId);
      expect(t.options.length, `${ctx}: mind. 2 Optionen`).toBeGreaterThanOrEqual(2);
      break;
    }
    case 'input':
      expect(Number.isFinite(t.answer), ctx).toBe(true);
      if (!t.signed) expect(t.answer, `${ctx}: keine negativen Ergebnisse`).toBeGreaterThanOrEqual(0);
      break;
    case 'wordbuild': {
      const pool = [...t.tiles];
      for (const s of t.solution) {
        const i = pool.indexOf(s);
        expect(i, `${ctx}: Baustein ${s} vorhanden`).toBeGreaterThanOrEqual(0);
        pool.splice(i, 1);
      }
      break;
    }
    case 'order':
      expect([...t.items.map((i) => i.id)].sort(), ctx).toEqual([...t.correctOrder].sort());
      break;
    case 'memory':
      expect(t.pairs.length, ctx).toBeGreaterThanOrEqual(2);
      break;
    case 'dragmatch':
      for (const tg of t.targets) expect(t.pieces.map((p) => p.id), ctx).toContain(tg.accepts);
      expect(t.pieces.length, ctx).toBe(t.targets.length);
      break;
    case 'puzzle':
      expect([2, 3]).toContain(t.grid);
      break;
    case 'pick3d':
      expect(t.items.map((i) => i.id), ctx).toContain(t.correctId);
      expect(new Set(t.items.map((i) => i.id)).size, ctx).toBe(t.items.length);
      break;
  }
}

const COMBOS: [Lang, Country][] = [['de', 'DE'], ['it', 'IT'], ['it', 'DE'], ['de', 'IT']];

describe('Lernmodule erzeugen gültige Aufgaben (alle Sprachen und Länder)', () => {
  for (const m of BUILTIN_MODULES) {
    it(`${m.id} – alle Stufen, viele Seeds`, () => {
      for (const [lang, country] of COMBOS) {
        if (m.countries && !m.countries.includes(country)) continue;
        setLang(lang); setCountry(country);
        for (const level of [1, 2, 3] as Difficulty[]) {
          for (let seed = 1; seed <= 12; seed++) {
            const tasks = m.generate(level, createRng(seed * 7919 + level));
            expect(tasks.length, `${m.id} L${level}`).toBeGreaterThan(0);
            tasks.forEach((t, i) => checkTask(t, `${m.id} ${lang}/${country} L${level} s${seed} #${i}`));
          }
        }
      }
      setLang('de'); setCountry('DE');
    });
  }
});

describe('Schulsysteme: jede Klasse hat Inhalte', () => {
  for (const country of ['DE', 'IT'] as Country[]) {
    for (let year = 1; year <= 13; year++) {
      it(`${country} Klasse ${year}: Mathe, Landessprache, Englisch und Zusatzfächer`, () => {
        const st = stageFor(country, year);
        const lang = country === 'IT' ? 'italiano' : 'deutsch';
        expect(st.subjects).toContain(lang);
        for (const s of ['mathe', lang, ...st.extras]) {
          expect(schoolModules(country, year, s).length, `${country} ${year} ${s}`).toBeGreaterThan(0);
        }
        if (year >= 3) expect(schoolModules(country, year, 'englisch').length, `${country} ${year} englisch`).toBeGreaterThan(0);
        if (year >= 5) {
          const sci = country === 'IT' && year <= 8 ? ['scienze'] : ['biologie', 'physik', 'chemie'];
          expect(sci.reduce((n, s) => n + schoolModules(country, year, s).length, 0), `${country} ${year} Naturwissenschaften`).toBeGreaterThan(0);
          expect(schoolModules(country, year, 'geschichte').length, `${country} ${year} Geschichte`).toBeGreaterThan(0);
        }
      });
    }
  }
});

describe('MVP-Umfang', () => {
  it('mindestens 5 Kindergarten-Spiele, 4 Mathe- und 4 Deutschübungen', () => {
    expect(KITA_MODULES.length).toBeGreaterThanOrEqual(5);
    expect(MATH_MODULES.length).toBeGreaterThanOrEqual(4);
    expect(GERMAN_MODULES.length).toBeGreaterThanOrEqual(4);
  });
  it('jede Grundschulklasse hat Mathe und Deutsch', () => {
    for (const g of [1, 2, 3, 4]) {
      expect(MATH_MODULES.some((m) => m.years && m.years[0] <= g && m.years[1] >= g)).toBe(true);
      expect(GERMAN_MODULES.some((m) => m.years && m.years[0] <= g && m.years[1] >= g)).toBe(true);
    }
  });
  it('Modul-IDs sind eindeutig', () => {
    const ids = BUILTIN_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Rechenaufgaben sind korrekt', () => {
  it('Plus bis 20 Stufe 3 hat immer Zehnerübergang', () => {
    const m = MATH_MODULES.find((x) => x.id === 'm1-plus')!;
    for (let s = 0; s < 50; s++) for (const t of m.generate(3, createRng(s))) {
      if (t.type !== 'input') continue;
      const [a, b] = t.prompt.match(/\d+/g)!.map(Number) as [number, number];
      expect(a + b).toBe(t.answer);
      expect(a < 10 && a + b > 10).toBe(true);
    }
  });
  it('Einmaleins-Ergebnisse stimmen', () => {
    const m = MATH_MODULES.find((x) => x.id === 'm2-einmaleins')!;
    for (let s = 0; s < 30; s++) for (const t of m.generate(3, createRng(s))) {
      if (t.type !== 'input') continue;
      const [a, b] = t.prompt.match(/\d+/g)!.map(Number) as [number, number];
      expect(a * b).toBe(t.answer);
    }
  });
  it('Uhrzeit-Texte', () => {
    expect(uhrText(3, 0)).toBe('3 Uhr');
    expect(uhrText(3, 30)).toBe('halb 4');
    expect(uhrText(12, 30)).toBe('halb 1');
    expect(uhrText(7, 15)).toBe('Viertel nach 7');
    expect(uhrText(7, 45)).toBe('Viertel vor 8');
    expect(uhrText(9, 50)).toBe('10 vor 10');
  });
  it('Geldbeträge', () => {
    expect(euro(50)).toBe('50 ct');
    expect(euro(100)).toBe('1 €');
    expect(euro(235)).toBe('2,35 €');
  });
});
