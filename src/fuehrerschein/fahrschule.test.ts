import { describe, expect, it } from 'vitest';
import { createRng } from '../lib/random';
import { buildExam, drivingAvailable, emptyStats, examPool, isCorrect, lessonsFor, practicePool, practiceQuestions, questionsFor, recordAnswer, scoreExam, statsKey } from './bank';
import { CHAPTERS, COVERAGE } from './chapters';
import { CROSS_SCENES, DIAGRAMS, diagramById } from './diagrams';
import { PACKS, PACK_FORMAT, SCHEMA_VERSION, validatePack, type ContentPack } from './packs';
import { EXAM_PROFILES, profileFor } from './profiles';
import { missingLangs, pickText, validateQuestion, type DrivingCountry, type Question, type StudyLang } from './schema';
import { hasDrawing, SIGNS } from './signs';

const COUNTRIES: DrivingCountry[] = ['DE', 'IT'];
const LANGS: StudyLang[] = ['de', 'it'];
const DE = profileFor('DE');
const IT = profileFor('IT');

/** Testfrage mit Gewicht (DE) bzw. vero/falso (IT) */
function q(id: string, country: DrivingCountry, weight = 3): Question {
  return country === 'IT'
    ? { id, country, chapter: 'precedenza', format: 'vf', text: { de: 'x', it: 'x' }, options: [{ id: 'v', text: { de: 'R', it: 'V' } }, { id: 'f', text: { de: 'F', it: 'F' } }], correct: ['v'], explanation: { de: 'e', it: 'e' }, source: { kind: 'original', ref: 't' }, version: 1, status: 'demo' }
    : { id, country, chapter: 'precedenza', format: 'multi', weight, text: { de: 'x', it: 'x' }, options: [{ id: 'a', text: { de: 'a', it: 'a' } }, { id: 'b', text: { de: 'b', it: 'b' } }], correct: ['a'], explanation: { de: 'e', it: 'e' }, source: { kind: 'original', ref: 't' }, version: 1, status: 'demo' };
}
const right = (x: Question) => x.correct;
const wrong = (x: Question) => x.options.filter((o) => !x.correct.includes(o.id)).map((o) => o.id).slice(0, 1);

describe('Fahrschule – Inhalte', () => {
  it('Zugang ab Klasse 13 oder mit Freischaltung', () => {
    expect(drivingAvailable(13)).toBe(true);
    expect(drivingAvailable(12)).toBe(false);
    expect(drivingAvailable(10, true)).toBe(true);
  });

  it('alle Pakete sind gültig, IDs eindeutig, eigene und amtliche Inhalte getrennt', () => {
    const ids = new Set<string>();
    for (const p of PACKS) {
      const r = validatePack(p, ids);
      expect(r.errors).toEqual([]);
      p.questions.forEach((x) => ids.add(x.id));
    }
  });

  for (const c of COUNTRIES) {
    it(`${c}: Demo-Stichprobe ist brauchbar (Lektionen, zweisprachige eigene Fragen, Bild- und Fangfragen)`, () => {
      const qs = questionsFor(c);
      expect(lessonsFor(c).length).toBeGreaterThanOrEqual(2);
      const original = qs.filter((x) => x.source.kind === 'original' && missingLangs(x).length === 0);
      expect(original.length).toBeGreaterThanOrEqual(10);
      expect(qs.every((x) => x.status === 'demo')).toBe(true);
      expect(qs.filter((x) => x.image?.type === 'diagram').length).toBeGreaterThanOrEqual(4);
      expect(qs.filter((x) => x.trap && x.trap.de && x.trap.it).length).toBeGreaterThanOrEqual(4);
      for (const x of qs) if (x.image?.type === 'diagram') expect(DIAGRAMS.some((d) => d.id === x.image!.id), x.id).toBe(true);
    });

    it(`${c}: Abdeckungs-Matrix nennt jedes Pflichtkapitel, jedes Kapitel hat Fragen`, () => {
      const rows = COVERAGE[c];
      for (const ch of CHAPTERS) {
        const row = rows.find((r) => r.chapter === ch.id);
        expect(row, ch.id).toBeTruthy();
        expect(row!.missing.de && row!.missing.it && row!.verified.de && row!.official.it).toBeTruthy();
        expect(questionsFor(c).some((x) => x.chapter === ch.id), `${c} ${ch.id}`).toBe(true);
      }
    });

    for (const l of LANGS) {
      it(`Kombination ${c} + ${l}: vollständige Prüfung ohne doppelte Fragen und höchstens ein Mal je Zeichen`, () => {
        const pool = examPool(c, l);
        const exam = buildExam(profileFor(c), pool, createRng(42));
        expect(exam.mini).toBe(false);
        expect(exam.questions).toHaveLength(30);
        expect(new Set(exam.questions.map((x) => x.id)).size).toBe(30);
        const signs = exam.questions.filter((x) => x.image?.type === 'sign').map((x) => x.image!.id);
        expect(new Set(signs).size).toBe(signs.length);
        expect(exam.questions.every((x) => x.format === profileFor(c).format)).toBe(true);
      });
    }
  }

  it('Zeichen: jedes hat eine eigene Zeichnung', () => {
    for (const s of SIGNS) expect(hasDrawing(s.id), s.id).toBe(true);
  });
});

describe('Fahrschule – Übersetzungen und Import', () => {
  it('fehlende Sprache wird gemeldet, nicht still ersetzt', () => {
    const r = pickText({ de: 'Nur Deutsch' }, 'it');
    expect(r).toEqual({ text: 'Nur Deutsch', missing: true, shownLang: 'de' });
    const x = { ...q('it-miss-1', 'IT'), text: { it: 'solo italiano' } };
    expect(missingLangs(x)).toEqual(['de']);
  });

  it('Prüfung nimmt nur Fragen, die in der Prüfungssprache vollständig sind', () => {
    const pack: ContentPack = { format: PACK_FORMAT, schemaVersion: SCHEMA_VERSION, id: 't', packVersion: '1', country: 'IT', kind: 'original', questions: [{ ...q('it-solo-it', 'IT'), text: { it: 'solo' } }, q('it-entrambe', 'IT')] };
    expect(examPool('IT', 'de', [pack]).map((x) => x.id)).toEqual(['it-entrambe']);
    expect(examPool('IT', 'it', [pack])).toHaveLength(2);
  });

  it('Import: amtliches Paket nur mit Nutzungsbedingung, Versionen und Quellen werden geprüft', () => {
    const base = { format: PACK_FORMAT, schemaVersion: SCHEMA_VERSION, id: 'amtlich', packVersion: '2026-01', country: 'DE' as const, kind: 'official' as const };
    const off = { ...q('de-off-1', 'DE'), source: { kind: 'official' as const, ref: 'Katalog 1.1.01-001' } };
    expect(validatePack({ ...base, questions: [off] }).errors.join()).toMatch(/Nutzungsbedingung/);
    const okPack = validatePack({ ...base, license: 'schriftliche Erlaubnis vom …', questions: [{ ...off, source: { ...off.source, license: 'Erlaubnis' } }] });
    expect(okPack.ok).toBe(true);
    expect(validatePack({ ...base, license: 'x', questions: [q('de-mix-1', 'DE')] }).errors.join()).toMatch(/getrennt/);
    expect(validatePack({ ...base, schemaVersion: 99, license: 'x', questions: [off] }).errors.join()).toMatch(/schemaVersion/);
    expect(validatePack({ ...base, kind: 'original', questions: [q('de-dup', 'DE'), q('de-dup', 'DE')] }).errors.join()).toMatch(/schon vergeben/);
    expect(validateQuestion({ ...q('de-w', 'DE'), weight: 7 }).join()).toMatch(/Gewicht/);
  });
});

describe('Fahrschule – Bewertung (Grenzfälle)', () => {
  it('Italien: 3 Fehler bestanden, 4 Fehler nicht bestanden', () => {
    const qs = Array.from({ length: 30 }, (_, i) => q(`it-t-${i}`, 'IT'));
    const ans = (n: number) => Object.fromEntries(qs.map((x, i) => [x.id, i < n ? wrong(x) : right(x)]));
    expect(scoreExam(IT, qs, ans(3))).toMatchObject({ errors: 3, passed: true });
    expect(scoreExam(IT, qs, ans(4))).toMatchObject({ errors: 4, passed: false });
  });

  it('Deutschland: 10 Punkte ohne zwei 5er bestanden, 10 Punkte mit zwei 5ern nicht, 11 Punkte nicht', () => {
    const weights = [5, 5, 5, 4, 3, 3, 2, 2, ...Array(22).fill(3)];
    const qs = weights.map((w, i) => q(`de-t-${i}`, 'DE', w));
    const ans = (wrongIdx: number[]) => Object.fromEntries(qs.map((x, i) => [x.id, wrongIdx.includes(i) ? wrong(x) : right(x)]));
    // 5 + 3 + 2 = 10, nur eine 5er
    expect(scoreExam(DE, qs, ans([0, 4, 6]))).toMatchObject({ errors: 10, wrongFives: 1, passed: true });
    // 5 + 5 = 10, zwei 5er
    expect(scoreExam(DE, qs, ans([0, 1]))).toMatchObject({ errors: 10, wrongFives: 2, failedByFives: true, passed: false });
    // 4 + 3 + 2 + 2 = 11
    expect(scoreExam(DE, qs, ans([3, 4, 6, 7]))).toMatchObject({ errors: 11, passed: false, failedByFives: false });
    // nicht beantwortet zählt als Fehler
    expect(scoreExam(DE, qs, {}).passed).toBe(false);
  });

  it('nur genau die richtigen Antworten zählen, Reihenfolge egal', () => {
    const x = { ...q('de-m', 'DE'), options: [{ id: 'a', text: {} }, { id: 'b', text: {} }, { id: 'c', text: {} }], correct: ['a', 'c'] } as Question;
    expect(isCorrect(x, ['c', 'a'])).toBe(true);
    expect(isCorrect(x, ['a'])).toBe(false);
    expect(isCorrect(x, ['a', 'b', 'c'])).toBe(false);
  });

  it('zu wenig geprüfte Fragen: Mini-Test, ohne Fragen zu verdoppeln', () => {
    const pool = Array.from({ length: 12 }, (_, i) => q(`it-k-${i}`, 'IT'));
    const exam = buildExam(IT, pool, createRng(1));
    expect(exam.mini).toBe(true);
    expect(exam.questions).toHaveLength(12);
    expect(new Set(exam.questions.map((x) => x.id)).size).toBe(12);
  });

  it('Profile sind versioniert und nennen ihre Quelle', () => {
    for (const p of EXAM_PROFILES) { expect(p.version).toBeTruthy(); expect(p.source.de && p.source.it).toBeTruthy(); }
    expect(DE.scoring).toEqual({ type: 'points', maxPoints: 10, failOnFives: 2 });
    expect(IT).toMatchObject({ questions: 30, minutes: 20, scoring: { type: 'errors', maxErrors: 3 } });
  });
});

describe('Fahrschule – Fortschritt', () => {
  it('Speicher getrennt nach Land, nicht nach Sprache', () => {
    expect(statsKey('p1', 'DE')).not.toBe(statsKey('p1', 'IT'));
    expect(statsKey('p1', 'DE')).not.toMatch(/de$|it$/);
  });

  it('falsche Antworten landen in „Fehler wiederholen“ und verschwinden nach richtiger Antwort', () => {
    const x = practicePool('IT')[0]!;
    let s = recordAnswer(emptyStats(), x, false);
    expect(s.wrong).toEqual([x.id]);
    expect(practiceQuestions('IT', 'errori', s.wrong).map((y) => y.id)).toEqual([x.id]);
    s = recordAnswer(s, x, true);
    expect(s.wrong).toEqual([]);
    expect(s.chapters[x.chapter]).toEqual({ right: 1, total: 2 });
  });

  it('Bild- und Fangfragen-Modus liefert nur passende Fragen', () => {
    for (const c of COUNTRIES) {
      expect(practiceQuestions(c, 'trabocchetti').every((x) => x.trap)).toBe(true);
      expect(practiceQuestions(c, 'quiz-illustrati').length).toBeGreaterThanOrEqual(8);
    }
  });

  it('Kreuzungsaufgaben: eigene Skizzen, beide Sprachen, eigener Modus', () => {
    for (const sc of CROSS_SCENES) {
      expect(diagramById(sc.id)).toBeTruthy();
      expect(sc.decisive.de && sc.decisive.it).toBeTruthy();
      const orders = sc.cars.map((c) => c.order);
      expect(Math.min(...orders)).toBe(1);
    }
    const de = practiceQuestions('DE', 'incroci');
    const it = practiceQuestions('IT', 'incroci');
    expect(de.length).toBe(CROSS_SCENES.length);
    expect(it.length).toBe(CROSS_SCENES.length * 2);
    for (const x of [...de, ...it]) {
      expect(validateQuestion(x)).toEqual([]);
      expect(x.chapter).toBe('precedenza');
      expect(missingLangs(x)).toEqual([]);
      expect(x.image?.alt.de && x.image.alt.it).toBeTruthy();
    }
    expect(new Set(de.map((x) => x.image?.id)).size).toBe(CROSS_SCENES.length);
    for (const c of COUNTRIES) expect(lessonsFor(c).some((l) => l.id.endsWith('-l-kreuzungen'))).toBe(true);
  });
});
