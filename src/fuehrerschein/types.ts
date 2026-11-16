import type { Txt } from '../i18n';

/** Kurzschreibweise beim Erfassen der Demo-Fragen (wird in content/demo.ts ins Datenmodell übertragen). */
export type RawMulti = [id: string, topic: string, points: number, q: Txt, options: [Txt, boolean][], expl: Txt, sign?: string];
export type RawVF = [id: string, topic: string, statement: Txt, ok: boolean, expl: Txt, sign?: string];
