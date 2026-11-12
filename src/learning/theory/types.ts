import { tx, type Txt } from '../../i18n';

/**
 * Ausführliche Theorie zu einem Schulthema (Deutsch + Italienisch).
 * Ergänzt die Kurzfassung in guides.ts („Das Wichtigste“).
 * Reine Daten: keine UI, damit Inhalte unabhängig vom Design gepflegt werden können.
 * Zeilenumbrüche (\n) in text/example werden als neue Zeile angezeigt.
 */
export interface TheorySection {
  title: Txt;
  text: Txt;
  /** Gelöstes Beispiel zum Abschnitt */
  example?: Txt;
  /** Merksatz oder Trick */
  tip?: Txt;
}

export interface Theory {
  sections: TheorySection[];
  /** Typische Fehler und wie man sie vermeidet */
  mistakes: Txt[];
  /** Fachbegriffe mit kurzer Erklärung */
  terms: { term: Txt; def: Txt }[];
}

type P = [string, string];
const t = (p?: P): Txt | undefined => (p ? tx(p[0], p[1]) : undefined);

/** Abschnitt: Titel, Erklärung, optional Beispiel und Merksatz – jeweils [Deutsch, Italienisch]. */
export const sec = (title: P, text: P, example?: P, tip?: P): TheorySection => ({
  title: tx(title[0], title[1]),
  text: tx(text[0], text[1]),
  ...(example ? { example: t(example) } : {}),
  ...(tip ? { tip: t(tip) } : {})
});

/** Begriff: [Begriff DE, Begriff IT], [Erklärung DE, Erklärung IT]. */
export const term = (name: P, def: P) => ({ term: tx(name[0], name[1]), def: tx(def[0], def[1]) });

export const theory = (sections: TheorySection[], mistakes: P[], terms: { term: Txt; def: Txt }[]): Theory => ({
  sections,
  mistakes: mistakes.map((m) => tx(m[0], m[1])),
  terms
});
