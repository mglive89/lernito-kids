import { describe, expect, it } from 'vitest';
import { BUILTIN_MODULES } from './registry';
import { MORE_ITEMS } from './modules/more';
import { parseLine, pickByLevel, type BankItem } from './bank';
import { createRng } from '../lib/random';
import { setCountry } from '../school/systems';
import { setLang } from '../i18n';

const bankMods = BUILTIN_MODULES.filter((m) => m.area === 'schule' && m.cards);

describe('Fragenbanken: genug Aufgaben auf allen Stufen', () => {
  it('jede Zusatzfrage gehört zu einem echten Modul', () => {
    const ids = new Set(bankMods.map((m) => m.id));
    for (const id of Object.keys(MORE_ITEMS)) expect(ids.has(id), id).toBe(true);
  });

  for (const country of ['DE', 'IT'] as const) {
    it(`${country}: mindestens 18 Fragen und mindestens 5 schwere pro Thema`, () => {
      setCountry(country); setLang(country === 'DE' ? 'de' : 'it');
      for (const m of bankMods) {
        if (m.countries && !m.countries.includes(country)) continue;
        const cards = m.cards!();
        expect(cards.length, m.id).toBeGreaterThanOrEqual(18);
        expect(cards.filter((c) => c.level === 3).length, m.id).toBeGreaterThanOrEqual(5);
        expect(cards.filter((c) => c.level === 2).length, m.id).toBeGreaterThanOrEqual(5);
        const qs = cards.map((c) => `${c.q}§${c.code ?? ""}§${c.a}`);
        expect(new Set(qs).size, `${m.id}: doppelte Frage`).toBe(qs.length);
      }
    });
  }

  it('Antworten sind sauber: richtige Antwort nicht unter den falschen, mindestens eine falsche', () => {
    for (const items of Object.values(MORE_ITEMS)) {
      for (const it of items as BankItem[]) {
        for (const line of [it.de, it.it].filter(Boolean) as string[]) {
          const p = parseLine(line);
          expect(p.q.length, line).toBeGreaterThan(3);
          expect(p.a.length, line).toBeGreaterThan(0);
          expect(p.w.length, line).toBeGreaterThanOrEqual(1);
          expect(p.w, line).not.toContain(p.a);
          expect(new Set(p.w).size, line).toBe(p.w.length);
        }
      }
    }
  });

  it('Stufe 3 nimmt vor allem schwere Fragen, Stufe 1 vor allem leichte', () => {
    const items: BankItem[] = [
      ...Array.from({ length: 8 }, (_, i) => ({ de: `l${i}`, lv: 1 as const })),
      ...Array.from({ length: 8 }, (_, i) => ({ de: `m${i}`, lv: 2 as const })),
      ...Array.from({ length: 8 }, (_, i) => ({ de: `h${i}`, lv: 3 as const }))
    ];
    const rng = createRng(5);
    expect(pickByLevel(items, 3, 6, rng).every((x) => x.lv === 3)).toBe(true);
    expect(pickByLevel(items, 1, 6, rng).every((x) => x.lv === 1)).toBe(true);
    const many = pickByLevel(items, 3, 12, rng);
    expect(many.filter((x) => x.lv === 3).length).toBe(8);
    expect(many.some((x) => x.lv === 1)).toBe(false);
  });
});
