/**
 * Eigene Illustrationen (SVG, keine Emojis) für Bildaufgaben.
 * `id` wählt die Zeichnung, weitere Felder sind ihre Parameter (z. B. Gradzahl, Werte, markierte Stelle).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Pic = { id: string } & Record<string, any>;
