import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BUILTIN_MODULES } from '../learning/registry';
import type { Difficulty, Task } from '../learning/types';
import { createRng } from '../lib/random';
import { setLang, type Lang } from '../i18n';
import { setCountry, type Country } from '../school/systems';
import Picture, { hasPicture } from './Picture';
import { PICTURE_TASKS } from './tasks';
import type { Pic } from './types';

const COMBOS: [Lang, Country][] = [['de', 'DE'], ['it', 'IT'], ['it', 'DE'], ['de', 'IT']];
const LEVELS: Difficulty[] = [1, 2, 3];

function pics(t: Task): Pic[] {
  const out: Pic[] = [];
  if (t.visual?.kind === 'pic') out.push(t.visual.pic);
  if (t.type === 'choice') for (const o of t.options) if (o.pic) out.push(o.pic);
  return out;
}

const rendered = new Set<string>();
function draw(p: Pic, ctx: string) {
  expect(hasPicture(p), `${ctx}: Zeichnung ${p.id}`).toBe(true);
  const key = JSON.stringify(p);
  if (rendered.has(key)) return;
  rendered.add(key);
  const html = renderToStaticMarkup(createElement(Picture, { pic: p, alt: 'x' }));
  expect(html, `${ctx}: ${p.id} zeichnet ein SVG`).toContain('<svg');
  expect(html, `${ctx}: ${p.id} ohne NaN`).not.toMatch(/NaN|undefined/);
}

function check(t: Task, ctx: string) {
  expect(t.prompt.trim(), `${ctx}: Frage`).not.toBe('');
  expect(t.hint.trim(), `${ctx}: Tipp`).not.toBe('');
  expect(t.explain.length, `${ctx}: Erklärung`).toBeGreaterThan(0);
  expect(pics(t).length > 0 || !!t.visual, `${ctx}: hat ein Bild`).toBe(true);
  if (t.type === 'input') expect(t.answer, `${ctx}: Zahl unter 7 Stellen`).toBeLessThan(1e6);
  if (t.type === 'choice') {
    const ids = t.options.map((o) => o.id);
    expect(new Set(ids).size, `${ctx}: eindeutige Antworten ${ids.join(' | ')}`).toBe(ids.length);
    expect(ids, `${ctx}: Lösung enthalten`).toContain(t.correctId);
    expect(ids.length, `${ctx}: mind. 2 Antworten`).toBeGreaterThanOrEqual(2);
    for (const o of t.options) expect(String(o.label).trim(), `${ctx}: Antworttext`).not.toBe('');
  }
  if (t.type === 'input') {
    expect(Number.isFinite(t.answer), `${ctx}: Zahl`).toBe(true);
    if (!t.signed) expect(t.answer, `${ctx}: nicht negativ`).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(t.answer), `${ctx}: ganze Zahl (Zahlenfeld hat kein Komma) ${t.answer}`).toBe(true);
  }
  for (const p of pics(t)) draw(p, ctx);
}

describe('Bildaufgaben', () => {
  const schoolIds = new Set(BUILTIN_MODULES.filter((m) => m.area === 'schule').map((m) => m.id));

  it('gehören zu echten Schulmodulen', () => {
    for (const id of Object.keys(PICTURE_TASKS)) expect(schoolIds.has(id), id).toBe(true);
  });

  it('jedes Schulmodul (außer Fahrschule) hat Bildaufgaben', () => {
    const missing = [...schoolIds].filter((id) => !PICTURE_TASKS[id] && !id.startsWith('fs-') && !id.startsWith('fahr'));
    expect(missing).toEqual([]);
  });

  for (const [id, gens] of Object.entries(PICTURE_TASKS)) {
    it(`${id}: alle Stufen, Sprachen und Länder`, () => {
      for (const [lang, country] of COMBOS) {
        setLang(lang); setCountry(country);
        for (const lv of LEVELS) {
          const usable = gens.filter((g) => !g.c || g.c === country);
          expect(usable.some((g) => g.lv === lv || g.lv === 0), `${id} Stufe ${lv} ${country}`).toBe(true);
        }
        gens.forEach((g, gi) => {
          if (g.c && g.c !== country) return;
          for (const lv of LEVELS) {
            for (let seed = 1; seed <= 8; seed++) {
              const ctx = `${id}#${gi} ${lang}/${country} L${lv} s${seed}`;
              check(g.make(createRng(seed * 7919 + gi), lv), ctx);
            }
          }
        });
      }
    });
  }

  it('werden in Lektionen gemischt', () => {
    setLang('it'); setCountry('IT');
    const m = BUILTIN_MODULES.find((x) => x.id === 'm1-plus')!;
    const tasks = m.generate(2, createRng(3));
    expect(tasks.some((t) => pics(t).length > 0)).toBe(true);
  });
});
