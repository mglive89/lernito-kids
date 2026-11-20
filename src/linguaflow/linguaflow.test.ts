import { describe, expect, it } from 'vitest';
import { isAccepted, joinSegments, normalizeAnswer } from './answer';
import { catalog, dirOf, searchCatalog } from './catalog';
import { availability } from './packs';
import { validatePacks, type PackFiles } from './validate';
import type { ContentFile, CourseIndex, TranslationFile } from './types';

// Alle Kurspakete aus public/linguaflow und das Beispielpaket aus docs
const pub = import.meta.glob('/public/linguaflow/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const ex = import.meta.glob('/docs/linguaflow/example/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

function files(all: Record<string, unknown>, root: string): PackFiles {
  const get = (p: string) => all[`${root}/${p}`];
  const index = get('courses.json') as CourseIndex;
  const content: PackFiles['content'] = {};
  const translations: PackFiles['translations'] = {};
  for (const c of index.courses) { content[c.content] = get(c.content) as ContentFile; translations[c.translations] = get(c.translations) as TranslationFile; }
  return { index, content, translations, exists: (p) => `${root}/${p}` in all };
}
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe('Kurspakete', () => {
  const real = files(pub, '/public/linguaflow');
  it('alle veröffentlichten Pakete sind fehlerfrei', () => {
    expect(validatePacks(real).filter((i) => i.level === 'error')).toEqual([]);
    expect(validatePacks(files(ex, '/docs/linguaflow/example')).filter((i) => i.level === 'error')).toEqual([]);
  });
  it('die verlangten Kombinationen haben die richtige Zahl Lektionen', () => {
    const n = (s: string, t: string) => real.index.courses.filter((c) => c.source === s && c.target === t).map((c) => [c.kind, c.lessons.length]);
    expect(n('it', 'de')).toEqual([['course', 10]]);
    expect(n('de', 'it')).toEqual([['course', 10]]);
    // alle Sprachen als vollständige Module – keine Einführungen, keine Demos
    for (const t of ['en', 'fr', 'es', 'pt-PT', 'nl', 'ro', 'pl', 'tr', 'ru', 'el', 'ar', 'ja']) {
      expect(n('it', t)).toEqual([['course', 10]]);
      expect(n('de', t)).toEqual([['course', 10]]);
    }
    expect(real.index.courses.filter((c) => c.kind !== 'course')).toEqual([]);
  });
  it('jede Lektion hat mindestens 6 Übungen und endet mit einer Situation', () => {
    for (const c of Object.values(real.content)) for (const l of c!.lessons) {
      expect(l.exercises.length).toBeGreaterThanOrEqual(6);
      expect(l.exercises.at(-1)!.type).toBe('situation');
    }
  });
  it('erkennt doppelte IDs, fehlende Übersetzungen, unvollständige Übungen und fehlende Audiodateien', () => {
    const f = clone(real);
    f.exists = real.exists;
    const de = f.content['content/de/a1.json']!;
    de.lessons[1]!.dialogue[0]!.id = de.lessons[0]!.dialogue[0]!.id;
    de.lessons[0]!.vocabulary[0]!.audio = 'audio/fehlt.mp3';
    const ord = de.lessons[0]!.exercises.find((e) => e.type === 'order')!;
    if (ord.type === 'order') ord.segments = ['Ich', 'komme'];
    delete f.translations['translations/de/a1.it.json']!.items['de-a1-01-v2'];
    const msgs = validatePacks(f).filter((i) => i.level === 'error').map((i) => i.message).join('\n');
    expect(msgs).toMatch(/doppelte ID/);
    expect(msgs).toMatch(/Audiodatei fehlt/);
    expect(msgs).toMatch(/Segmente ergeben nicht/);
    expect(msgs).toMatch(/Übersetzung fehlt: de-a1-01-v2/);
  });
  it('Verfügbarkeit: kein Kurs → Ausgangssprachen, die es gibt; keine automatische Änderung', () => {
    const a = availability(real.index, 'en', 'de');
    expect(a.exact).toEqual([]);
    expect(a.otherSources).toEqual(['it']);
    expect(availability(real.index, 'it', 'de-AT').variants.map((c) => c.id)).toEqual(['it-de-a1']);
  });
});

describe('Antworten', () => {
  it('ignoriert Groß/Klein und Satzzeichen am Rand, aber keine Akzente', () => {
    expect(isAccepted('  ich habe fieber ', ['Ich habe Fieber.'], 'de')).toBe(true);
    expect(isAccepted('Ich hatte gern', ['Ich hätte gern'], 'de')).toBe(false);
    expect(isAccepted('Adios', ['Adiós'], 'es')).toBe(false);
    expect(isAccepted('¿Dónde está la estación?', ['Dónde está la estación'], 'es')).toBe(true);
    expect(isAccepted('Où est la gare?', ['Où est la gare ?'], 'fr')).toBe(true);
    expect(isAccepted('dov’è la stazione', ["Dov'è la stazione?"], 'it')).toBe(true);
  });
  it('setzt Segmente ohne Leerzeichen für Japanisch zusammen', () => {
    expect(joinSegments(['イタリア', 'から', 'きました'], 'ja')).toBe('イタリアからきました');
    expect(normalizeAnswer('イタリアからきました。', 'ja')).toBe('イタリアからきました');
  });
});

describe('Katalog', () => {
  it('findet Sprachen über übersetzten Namen, Originalnamen und Kennung', () => {
    const list = catalog('it');
    expect(searchCatalog(list, 'tedesco')[0]!.tag).toBe('de');
    expect(searchCatalog(list, 'Deutsch').map((l) => l.tag)).toContain('de');
    expect(searchCatalog(list, 'العربية')[0]!.tag).toBe('ar');
    expect(searchCatalog(list, '日本語')[0]!.tag).toBe('ja');
    expect(searchCatalog(list, 'pt-BR')[0]!.tag).toBe('pt-BR');
    expect(list.length).toBeGreaterThan(140);
  });
  it('Schreibrichtung', () => {
    expect(dirOf('ar')).toBe('rtl');
    expect(dirOf('he')).toBe('rtl');
    expect(dirOf('de')).toBe('ltr');
  });
});
