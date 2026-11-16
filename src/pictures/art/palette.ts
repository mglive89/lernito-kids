/* Farben für die Illustrationen. Linien und Text folgen dem Thema (hell/dunkel), kräftige Farben bleiben gleich. */
export const INK = 'rgb(var(--c-tinte))';
export const MUTED = 'rgb(var(--c-tinte) / 0.55)';
export const LINE = 'rgb(var(--c-tinte) / 0.22)';
export const FAINT = 'rgb(var(--c-tinte) / 0.08)';
export const PAPER = 'rgb(var(--c-flaeche))';
export const SOFT = 'rgb(var(--c-himmel-50))';
export const SOFT_Y = 'rgb(var(--c-sonne-50))';
export const SOFT_G = 'rgb(var(--c-minze-50))';

export const BLUE = '#2F6FEB';
export const BLUE_D = '#1D4FB8';
export const BLUE_L = '#9DBEFB';
export const GREEN = '#12B886';
export const GREEN_D = '#0B8A64';
export const RED = '#F0614E';
export const RED_D = '#C2412F';
export const YELLOW = '#F5A524';
export const YELLOW_L = '#FFD66B';
export const PURPLE = '#7A5AF8';
export const ORANGE = '#F28C28';
export const PINK = '#F27BA6';
export const BROWN = '#A26B3F';
export const BROWN_D = '#6E4527';
export const LEAF = '#3DA35D';
export const LEAF_D = '#2A7A43';
export const GRASS = '#8CCB6E';
export const WATER = '#4BA3E3';
export const WATER_L = '#BFE1FA';
export const GREY = '#8C93A3';
export const GREY_D = '#5B6170';
export const GREY_L = '#D5D9E2';
export const STONE = '#C9B79C';
export const DARK = '#2B3245';
export const WHITE = '#FFFFFF';
export const SKIN = '#F2C9A0';

/** Farben für Reihen/Kategorien (Diagramme) */
export const SERIES: string[] = [BLUE, GREEN, YELLOW, RED, PURPLE, ORANGE];
/** Farbe Nr. i aus SERIES (zyklisch) */
export const ser = (i: number): string => SERIES[((i % SERIES.length) + SERIES.length) % SERIES.length]!;

export const FONT = 'var(--font-display), system-ui, sans-serif';
