/** Farbpalette der Kacheln und Fächer. Klassen stehen ausgeschrieben, damit Tailwind sie findet. */
export interface ColorSet {
  /** kräftige Fläche */
  bg: string;
  /** zarte Fläche */
  soft: string;
  /** Text in Fachfarbe */
  text: string;
  /** Rahmen in Fachfarbe */
  ring: string;
  /** Verlauf für große Flächen */
  grad: string;
  /** „Kante“ unter kräftigen Flächen (3D-Effekt) */
  edge: string;
  /** Textfarbe auf der kräftigen Fläche */
  on: string;
}

export const COLOR_CLASSES: Record<string, ColorSet> = {
  sonne: { bg: 'bg-sonne-500', soft: 'bg-sonne-100', text: 'text-sonne-700', ring: 'ring-sonne-500', grad: 'bg-gradient-to-br from-sonne-300 to-sonne-500', edge: 'kante-sonne', on: 'text-nacht' },
  himmel: { bg: 'bg-himmel-500', soft: 'bg-himmel-100', text: 'text-himmel-700', ring: 'ring-himmel-500', grad: 'bg-gradient-to-br from-himmel-300 to-himmel-500', edge: 'kante-himmel', on: 'text-white' },
  minze: { bg: 'bg-minze-500', soft: 'bg-minze-100', text: 'text-minze-700', ring: 'ring-minze-500', grad: 'bg-gradient-to-br from-minze-300 to-minze-500', edge: 'kante-minze', on: 'text-white' },
  koralle: { bg: 'bg-koralle-500', soft: 'bg-koralle-100', text: 'text-koralle-700', ring: 'ring-koralle-500', grad: 'bg-gradient-to-br from-koralle-300 to-koralle-500', edge: 'kante-koralle', on: 'text-white' },
  lila: { bg: 'bg-lila-500', soft: 'bg-lila-100', text: 'text-lila-700', ring: 'ring-lila-500', grad: 'bg-gradient-to-br from-lila-300 to-lila-500', edge: 'kante-lila', on: 'text-white' }
};

export const colorSet = (name?: string): ColorSet => COLOR_CLASSES[name ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
