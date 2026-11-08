import type { ChoiceTask, Difficulty, InputTask, LearningModule, Rng, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';

const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));
const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const fmt = (n: number) => n.toLocaleString('de-DE');

/* =================== Klasse 1 =================== */

/** Addition im Zahlenraum bis 20 */
export function genPlus20(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    let a: number, b: number;
    if (level === 1) { a = randInt(rng, 1, 5); b = randInt(rng, 1, 5); }
    else if (level === 2) { a = randInt(rng, 1, 9); b = randInt(rng, 1, 10 - a); if (rng() > 0.5) a += 10; }
    else { a = randInt(rng, 5, 9); b = randInt(rng, 11 - a, 9); }
    const sum = a + b;
    const explain = level === 3
      ? [`Rechne zuerst bis zur 10: ${a} + ${10 - a} = 10.`, `Dann den Rest: 10 + ${b - (10 - a)} = ${sum}.`]
      : [`Starte bei ${a} und zähle ${b} weiter.`, `${a} + ${b} = ${sum}`];
    if (level === 1) {
      return {
        id: tid('plus', i), type: 'choice', prompt: `Wie viel ist ${a} + ${b}?`,
        speak: `Wie viel ist ${a} plus ${b}?`,
        visual: { kind: 'emojis', items: [...Array(a).fill('🍎'), '➕', ...Array(b).fill('🍐')] },
        options: numberOptions(rng, sum, 3, 1, 12, 2).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(sum), optionStyle: 'big',
        hint: 'Zähle alle Früchte zusammen.', explain
      } satisfies ChoiceTask;
    }
    return {
      id: tid('plus', i), type: 'input', prompt: `${a} + ${b} = ?`, speak: `Wie viel ist ${a} plus ${b}?`,
      answer: sum, hint: level === 3 ? 'Tipp: Ergänze erst bis zur 10, dann rechne weiter.' : `Halte ${a} im Kopf und zähle ${b} Schritte weiter.`, explain
    } satisfies InputTask;
  });
}

/** Subtraktion im Zahlenraum bis 20 */
export function genMinus20(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    let a: number, b: number;
    if (level === 1) { a = randInt(rng, 2, 8); b = randInt(rng, 1, a - 1); }
    else if (level === 2) { a = randInt(rng, 11, 19); b = randInt(rng, 1, a - 10); }
    else { a = randInt(rng, 11, 18); b = randInt(rng, a - 9, 9); }
    const diff = a - b;
    const explain = level === 3
      ? [`Rechne zuerst bis zur 10 zurück: ${a} − ${a - 10} = 10.`, `Dann noch ${b - (a - 10)} weg: 10 − ${b - (a - 10)} = ${diff}.`]
      : [`Starte bei ${a} und gehe ${b} Schritte zurück.`, `${a} − ${b} = ${diff}`];
    if (level === 1) {
      return {
        id: tid('minus', i), type: 'choice', prompt: `${a} Ballons. ${b} fliegen weg. Wie viele bleiben?`,
        visual: { kind: 'emojis', items: [...Array(a - b).fill('🎈'), ...Array(b).fill('💨')] },
        options: numberOptions(rng, diff, 3, 0, 10, 2).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(diff), optionStyle: 'big',
        hint: 'Zähle nur die Ballons, die noch da sind.', explain
      } satisfies ChoiceTask;
    }
    return {
      id: tid('minus', i), type: 'input', prompt: `${a} − ${b} = ?`, speak: `Wie viel ist ${a} minus ${b}?`,
      answer: diff, hint: level === 3 ? 'Tipp: Gehe erst bis zur 10 zurück.' : 'Zähle rückwärts.', explain
    } satisfies InputTask;
  });
}

/** Zahlen vergleichen */
export function genVergleichen(level: Difficulty, rng: Rng, n = 6): Task[] {
  const max = level === 1 ? 10 : level === 2 ? 20 : 100;
  return times(n, (i): ChoiceTask => {
    const a = randInt(rng, 0, max);
    const b = rng() < 0.15 ? a : randInt(rng, 0, max);
    const sym = a < b ? '<' : a > b ? '>' : '=';
    return {
      id: tid('vgl', i), type: 'choice', prompt: `Welches Zeichen passt? ${a} ? ${b}`,
      speak: `Welches Zeichen passt zwischen ${a} und ${b}?`,
      visual: { kind: 'text', text: `${a}  ?  ${b}`, size: 'xl' },
      options: [{ id: '<', label: '<', speak: 'kleiner als' }, { id: '=', label: '=', speak: 'gleich' }, { id: '>', label: '>', speak: 'größer als' }],
      correctId: sym, optionStyle: 'big',
      hint: 'Das Krokodil-Maul ist immer offen zur größeren Zahl.',
      explain: [sym === '=' ? `${a} und ${b} sind gleich groß.` : `${Math.max(a, b)} ist größer als ${Math.min(a, b)}.`, `Also: ${a} ${sym} ${b}`]
    };
  });
}

/** Zahlenraum bis 20: Zehner und Einer, Nachbarzahlen */
export function genZahlenraum20(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    if (i % 3 === 2) {
      const start = randInt(rng, 1, level === 1 ? 6 : 15);
      const step = level === 3 ? 2 : 1;
      const nums = times(5, (k) => start + k * step);
      return {
        id: tid('zr', i), type: 'order', prompt: 'Ordne die Zahlen von klein nach groß!',
        items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })), correctOrder: nums.map(String),
        hint: 'Finde die kleinste Zahl zuerst.', explain: [`Richtig ist: ${nums.join(' – ')}`]
      };
    }
    const z = randInt(rng, 11, 20);
    const zehner = Math.floor(z / 10);
    const einer = z % 10;
    return {
      id: tid('zr', i), type: 'choice', prompt: `${zehner} Zehner und ${einer} Einer – welche Zahl ist das?`,
      visual: { kind: 'emojis', items: [...Array(zehner).fill('🔟'), ...Array(einer).fill('🟡')] },
      options: numberOptions(rng, z, 4, 10, 20, 3).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(z), optionStyle: 'big',
      hint: 'Ein Zehner sind 10. Zähle dann die Einer dazu.',
      explain: [`${zehner} Zehner = ${zehner * 10}`, `${zehner * 10} + ${einer} = ${z}`]
    };
  });
}

/* =================== Klasse 2 =================== */

export function genRechnen100(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): InputTask => {
    const plus = i % 2 === 0;
    let a: number, b: number;
    if (level === 1) { a = randInt(rng, 1, 9) * 10; b = randInt(rng, 1, plus ? 10 - a / 10 : a / 10) * 10; }
    else if (level === 2) { a = randInt(rng, 11, 80); b = randInt(rng, 1, 9); }
    else { a = randInt(rng, 25, 75); b = randInt(rng, 11, 24); }
    if (plus && a + b > 100) b = 100 - a;
    if (!plus && b > a) [a, b] = [b, a];
    const res = plus ? a + b : a - b;
    const z = Math.floor(b / 10) * 10, e = b % 10;
    const explain = z > 0 && e > 0
      ? [`Zerlege ${b} in ${z} und ${e}.`, `${a} ${plus ? '+' : '−'} ${z} = ${plus ? a + z : a - z}`, `${plus ? a + z : a - z} ${plus ? '+' : '−'} ${e} = ${res}`]
      : [`${a} ${plus ? '+' : '−'} ${b} = ${res}`];
    return {
      id: tid('r100', i), type: 'input', prompt: `${a} ${plus ? '+' : '−'} ${b} = ?`,
      speak: `Wie viel ist ${a} ${plus ? 'plus' : 'minus'} ${b}?`, answer: res,
      hint: z > 0 && e > 0 ? 'Rechne erst die Zehner, dann die Einer.' : 'Denke an die Zehnerzahlen: 10, 20, 30 …', explain
    };
  });
}

export function genEinmaleins(level: Difficulty, rng: Rng, n = 6): Task[] {
  const reihen = level === 1 ? [2, 5, 10] : level === 2 ? [2, 3, 4, 5, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10];
  return times(n, (i): Task => {
    const r = pick(rng, reihen);
    const k = randInt(rng, 1, 10);
    const res = r * k;
    if (level === 1 && i % 2 === 0) {
      return {
        id: tid('1x1', i), type: 'choice', prompt: `${k} Gruppen mit je ${r} Punkten. Wie viele sind es?`,
        visual: { kind: 'text', text: `${k} · ${r}`, size: 'xl' },
        options: numberOptions(rng, res, 4, 1, 100, r).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(res), optionStyle: 'big',
        hint: `Zähle in ${r}er-Schritten: ${r}, ${r * 2}, ${r * 3} …`,
        explain: [`${k} mal ${r} heißt: ${Array(k).fill(r).join(' + ')}`, `= ${res}`]
      } satisfies ChoiceTask;
    }
    return {
      id: tid('1x1', i), type: 'input', prompt: `${k} · ${r} = ?`, speak: `Wie viel ist ${k} mal ${r}?`, answer: res,
      hint: k > 5 ? `Tipp: 5 · ${r} = ${5 * r}. Rechne von dort weiter.` : `Zähle in ${r}er-Schritten.`,
      explain: k > 5 ? [`5 · ${r} = ${5 * r}`, `${k - 5} · ${r} = ${(k - 5) * r}`, `${5 * r} + ${(k - 5) * r} = ${res}`] : [`${Array(k).fill(r).join(' + ')} = ${res}`]
    } satisfies InputTask;
  });
}

export function uhrText(h: number, m: number): string {
  const h12 = ((h - 1) % 12) + 1;
  const next = (h12 % 12) + 1;
  if (m === 0) return `${h12} Uhr`;
  if (m === 30) return `halb ${next}`;
  if (m === 15) return `Viertel nach ${h12}`;
  if (m === 45) return `Viertel vor ${next}`;
  if (m < 30) return `${m} nach ${h12}`;
  return `${60 - m} vor ${next}`;
}
export function genUhrzeit(level: Difficulty, rng: Rng, n = 6): Task[] {
  const minuten = level === 1 ? [0] : level === 2 ? [0, 30, 15, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  return times(n, (i): ChoiceTask => {
    const h = randInt(rng, 1, 12);
    const m = pick(rng, minuten);
    const richtig = uhrText(h, m);
    const set = new Set([richtig]);
    let guard = 0;
    while (set.size < 3 && guard++ < 50) set.add(uhrText(randInt(rng, 1, 12), pick(rng, minuten.length > 1 ? minuten : [0, 30])));
    const digital = `${h}:${String(m).padStart(2, '0')}`;
    return {
      id: tid('uhr', i), type: 'choice', prompt: 'Wie spät ist es?',
      visual: { kind: 'clock', hours: h, minutes: m },
      options: shuffle(rng, [...set]).map((t) => ({ id: t, label: t })), correctId: richtig, optionStyle: 'text',
      hint: 'Der kurze Zeiger zeigt die Stunde, der lange Zeiger die Minuten.',
      explain: [m === 0 ? `Der kurze Zeiger steht genau auf der ${h}.` : `Der kurze Zeiger steht zwischen der ${h} und der ${(h % 12) + 1}.`, `Der lange Zeiger zeigt ${m} Minuten.`, `Es ist ${digital} Uhr – also ${richtig}.`]
    };
  });
}

const MUENZEN = [1, 2, 5, 10, 20, 50, 100, 200];
export function euro(cent: number): string {
  if (cent < 100) return `${cent} ct`;
  const e = Math.floor(cent / 100), c = cent % 100;
  return c === 0 ? `${e} €` : `${e},${String(c).padStart(2, '0')} €`;
}
export function genGeld(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? [1, 2, 5, 10] : level === 2 ? [5, 10, 20, 50, 100] : MUENZEN;
  return times(n, (i): ChoiceTask => {
    const coins = times(randInt(rng, 2, level === 1 ? 3 : 4), () => pick(rng, pool)).sort((a, b) => b - a);
    const sum = coins.reduce((a, b) => a + b, 0);
    const opts = new Set([sum]);
    let g = 0;
    while (opts.size < 3 && g++ < 100) { const d = pick(rng, pool); const v = sum + (rng() > 0.5 ? d : -d); if (v > 0) opts.add(v); }
    let extra = 1;
    while (opts.size < 3) opts.add(sum + extra++);
    return {
      id: tid('geld', i), type: 'choice', prompt: 'Wie viel Geld ist das zusammen?',
      visual: { kind: 'coins', cents: coins },
      options: shuffle(rng, [...opts]).map((v) => ({ id: String(v), label: euro(v) })),
      correctId: String(sum), optionStyle: 'text',
      hint: 'Fang mit der größten Münze an und zähle die anderen dazu.',
      explain: [`${coins.map(euro).join(' + ')}`, `= ${euro(sum)}`, '100 Cent sind 1 Euro.']
    };
  });
}

/* =================== Klasse 3 =================== */

export function genMalGeteilt(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): InputTask => {
    const a = randInt(rng, 2, level === 1 ? 5 : 10), b = randInt(rng, 2, level === 3 ? 10 : 6);
    const geteilt = i % 2 === 1;
    if (level === 3 && i % 3 === 0) {
      const x = randInt(rng, 2, 9) * 10;
      const y = randInt(rng, 2, 5);
      return {
        id: tid('mal', i), type: 'input', prompt: `${x} · ${y} = ?`, speak: `Wie viel ist ${x} mal ${y}?`, answer: x * y,
        hint: `Rechne erst ${x / 10} · ${y} und hänge dann eine Null an.`, explain: [`${x / 10} · ${y} = ${(x / 10) * y}`, `${x} · ${y} = ${x * y}`]
      };
    }
    if (geteilt) {
      return {
        id: tid('geteilt', i), type: 'input', prompt: `${a * b} : ${b} = ?`, speak: `Wie viel ist ${a * b} geteilt durch ${b}?`, answer: a,
        hint: `Welche Zahl mal ${b} ergibt ${a * b}?`, explain: [`Teilen ist die Umkehrung vom Malnehmen.`, `${a} · ${b} = ${a * b}`, `Also: ${a * b} : ${b} = ${a}`]
      };
    }
    return {
      id: tid('mal', i), type: 'input', prompt: `${a} · ${b} = ?`, speak: `Wie viel ist ${a} mal ${b}?`, answer: a * b,
      hint: `Das ist ${a}-mal die ${b}.`, explain: [`${Array(a).fill(b).join(' + ')} = ${a * b}`]
    };
  });
}

export function genSchriftlich(level: Difficulty, rng: Rng, n = 4): Task[] {
  return times(n, (i): InputTask => {
    const plus = level === 1 ? true : i % 2 === 0;
    let a = randInt(rng, level === 3 ? 300 : 100, level === 3 ? 999 : 499);
    let b = randInt(rng, level === 1 ? 10 : 100, level === 3 ? 899 : 399);
    if (plus && a + b > 999) b = 999 - a;
    if (!plus && b > a) [a, b] = [b, a];
    const res = plus ? a + b : a - b;
    const ea = a % 10, eb = b % 10;
    const steps = plus
      ? [`Einer: ${ea} + ${eb} = ${ea + eb}${ea + eb >= 10 ? `, schreibe ${(ea + eb) % 10}, merke 1` : ''}.`, 'Dann die Zehner, dann die Hunderter – Übertrag nicht vergessen!', `Ergebnis: ${res}`]
      : [`Einer: ${ea} − ${eb}${ea < eb ? ' geht nicht – borge dir einen Zehner' : ` = ${ea - eb}`}.`, 'Dann die Zehner und die Hunderter.', `Ergebnis: ${res}`];
    return {
      id: tid('schr', i), type: 'input', prompt: `Rechne schriftlich: ${a} ${plus ? '+' : '−'} ${b}`,
      visual: { kind: 'column', a, b, op: plus ? '+' : '-' },
      answer: res, hint: 'Fang ganz rechts bei den Einern an.', explain: steps
    };
  });
}

const GEO_FRAGEN: { q: string; a: string; f: string[]; hint: string; visual?: ChoiceTask['visual'] }[] = [
  { q: 'Wie viele Ecken hat ein Dreieck?', a: '3', f: ['4', '2', '5'], hint: 'Der Name verrät es schon.', visual: { kind: 'shape', shape: 'dreieck', color: '#FF6F59' } },
  { q: 'Wie viele Ecken hat ein Quadrat?', a: '4', f: ['3', '5', '6'], hint: 'Zähle die Ecken mit dem Finger.', visual: { kind: 'shape', shape: 'quadrat', color: '#3A9BDC' } },
  { q: 'Welche Form hat 4 gleich lange Seiten und 4 rechte Winkel?', a: 'Quadrat', f: ['Rechteck', 'Dreieck', 'Kreis'], hint: 'Alle Seiten sind gleich lang.' },
  { q: 'Welche Form hat keine Ecken?', a: 'Kreis', f: ['Quadrat', 'Dreieck', 'Rechteck'], hint: 'Diese Form ist ganz rund.' },
  { q: 'Welcher Körper ist rund wie ein Ball?', a: 'Kugel', f: ['Würfel', 'Zylinder', 'Kegel'], hint: 'Er rollt in jede Richtung.', visual: { kind: 'solid3d', solid: 'kugel', color: '#FF6F59' } },
  { q: 'Wie viele Flächen hat ein Würfel?', a: '6', f: ['4', '8', '12'], hint: 'Denk an einen Spielwürfel: 1 bis 6.', visual: { kind: 'solid3d', solid: 'wuerfel', color: '#3A9BDC' } },
  { q: 'Welcher Körper sieht aus wie eine Dose?', a: 'Zylinder', f: ['Kegel', 'Kugel', 'Quader'], hint: 'Oben und unten ist ein Kreis.', visual: { kind: 'solid3d', solid: 'zylinder', color: '#2EC4B6' } },
  { q: 'Welcher Körper sieht aus wie eine Eistüte?', a: 'Kegel', f: ['Zylinder', 'Würfel', 'Pyramide'], hint: 'Unten rund, oben spitz.', visual: { kind: 'solid3d', solid: 'kegel', color: '#FFB627' } },
  { q: 'Wie viele Ecken hat ein Würfel?', a: '8', f: ['6', '4', '12'], hint: 'Oben 4 und unten 4.', visual: { kind: 'solid3d', solid: 'wuerfel', color: '#8E6CEF' } },
  { q: 'Ein Rechteck ist 5 cm lang und 3 cm breit. Wie groß ist der Umfang?', a: '16 cm', f: ['15 cm', '8 cm', '13 cm'], hint: 'Umfang: alle vier Seiten zusammenzählen.' },
  { q: 'Was ist achsensymmetrisch?', a: 'ein Schmetterling 🦋', f: ['eine Schnecke 🐌', 'eine Hand mit Daumen links ✋', 'eine Welle 🌊'], hint: 'Man kann es in der Mitte falten und beide Seiten sind gleich.' }
];
export function genGeometrie(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? GEO_FRAGEN.slice(0, 5) : level === 2 ? GEO_FRAGEN.slice(0, 9) : GEO_FRAGEN;
  return sample(rng, pool, Math.min(n, pool.length)).map((g, i): ChoiceTask => ({
    id: tid('geo', i), type: 'choice', prompt: g.q, visual: g.visual,
    options: shuffle(rng, [g.a, ...g.f]).map((x) => ({ id: x, label: x })), correctId: g.a, optionStyle: 'text',
    hint: g.hint, explain: [`Richtig ist: ${g.a}.`, g.hint]
  }));
}

/* =================== Klasse 4 =================== */

export function genGrosseZahlen(level: Difficulty, rng: Rng, n = 6): Task[] {
  const max = level === 1 ? 9999 : level === 2 ? 99999 : 999999;
  return times(n, (i): ChoiceTask => {
    const z = randInt(rng, 1000, max);
    const stellen = ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender'];
    const len = String(z).length;
    if (i % 2 === 0) {
      const pos = randInt(rng, 0, len - 1);
      const digit = Math.floor(z / 10 ** pos) % 10;
      return {
        id: tid('gz', i), type: 'choice', prompt: `Welche Ziffer steht bei ${fmt(z)} an der ${stellen[pos]}-Stelle?`,
        visual: { kind: 'text', text: fmt(z), size: 'xl' },
        options: shuffle(rng, [...new Set([digit, ...shuffle(rng, String(z).split('').map(Number)), (digit + 1) % 10, (digit + 5) % 10])].slice(0, 4)).map((d) => ({ id: String(d), label: String(d) })),
        correctId: String(digit), optionStyle: 'big',
        hint: 'Zähle von rechts: Einer, Zehner, Hunderter, Tausender …',
        explain: [`Von rechts gezählt ist die ${stellen[pos]}-Stelle die ${pos + 1}. Stelle.`, `Dort steht die ${digit}.`]
      };
    }
    const runden = level === 1 ? 100 : 1000;
    const ger = Math.round(z / runden) * runden;
    return {
      id: tid('gz', i), type: 'choice', prompt: `Runde ${fmt(z)} auf ${runden === 100 ? 'Hunderter' : 'Tausender'}.`,
      options: shuffle(rng, [...new Set([ger, ger + runden, Math.max(0, ger - runden)])]).map((v) => ({ id: String(v), label: fmt(v) })),
      correctId: String(ger), optionStyle: 'text',
      hint: 'Schau auf die Ziffer rechts daneben: Bei 0–4 abrunden, bei 5–9 aufrunden.',
      explain: [`Die Ziffer rechts neben der ${runden === 100 ? 'Hunderter' : 'Tausender'}-Stelle entscheidet.`, `${fmt(z)} ≈ ${fmt(ger)}`]
    };
  });
}

export function genBrueche(level: Difficulty, rng: Rng, n = 6): Task[] {
  const teiler = level === 1 ? [2, 4] : level === 2 ? [2, 3, 4, 6] : [2, 3, 4, 5, 6, 8];
  return times(n, (i): ChoiceTask => {
    const parts = pick(rng, teiler);
    const filled = randInt(rng, 1, parts - 1 || 1);
    const label = `${filled}/${parts}`;
    const opts = new Set([label]);
    let g = 0;
    while (opts.size < 3 && g++ < 50) { const p = pick(rng, teiler); opts.add(`${randInt(rng, 1, Math.max(1, p - 1))}/${p}`); }
    opts.add(`${parts - filled}/${parts}`);
    return {
      id: tid('bruch', i), type: 'choice', prompt: 'Welcher Bruchteil der Pizza ist gefärbt?',
      visual: { kind: 'fraction', parts, filled },
      options: shuffle(rng, [...opts].slice(0, 4)).map((x) => ({ id: x, label: x })),
      correctId: label, optionStyle: 'big',
      hint: 'Unten steht, in wie viele Stücke geteilt wurde. Oben, wie viele gefärbt sind.',
      explain: [`Die Pizza hat ${parts} gleich große Stücke.`, `${filled} davon sind gefärbt: ${label}.`]
    };
  });
}

interface Sachaufgabe { text: (r: Rng) => { q: string; a: number; steps: string[] } }
const SACHAUFGABEN: Sachaufgabe[] = [
  { text: (r) => { const k = randInt(r, 3, 9), p = randInt(r, 2, 6); return { q: `Lea kauft ${k} Hefte. Jedes Heft kostet ${p} €. Wie viel Euro bezahlt sie?`, a: k * p, steps: [`${k} Hefte · ${p} € = ${k * p} €`] }; } },
  { text: (r) => { const b = randInt(r, 4, 9) * 3, g = 3; return { q: `${b} Bonbons werden gerecht an ${g} Kinder verteilt. Wie viele bekommt jedes Kind?`, a: b / g, steps: [`${b} : ${g} = ${b / g}`] }; } },
  { text: (r) => { const s = randInt(r, 120, 480), w = randInt(r, 50, 150); return { q: `Ein Bus hat schon ${s} km gefahren. Er fährt noch ${w} km weiter. Wie viele Kilometer sind es insgesamt?`, a: s + w, steps: [`${s} km + ${w} km = ${s + w} km`] }; } },
  { text: (r) => { const g = randInt(r, 20, 50), a = randInt(r, 5, 15); return { q: `Tom hat ${g} €. Er kauft ein Buch für ${a} €. Wie viel Geld hat er noch?`, a: g - a, steps: [`${g} € − ${a} € = ${g - a} €`] }; } },
  { text: (r) => { const t = randInt(r, 3, 8), k = randInt(r, 4, 9), e = randInt(r, 2, 5); return { q: `In einer Klasse sitzen ${t} Tische mit je ${k} Kindern. ${e} Kinder fehlen heute. Wie viele Kinder sind da?`, a: t * k - e, steps: [`${t} · ${k} = ${t * k}`, `${t * k} − ${e} = ${t * k - e}`] }; } },
  { text: (r) => { const m = randInt(r, 2, 6); return { q: `Ein Film dauert ${m} Stunden. Wie viele Minuten sind das?`, a: m * 60, steps: ['1 Stunde = 60 Minuten', `${m} · 60 = ${m * 60}`] }; } }
];
export function genSachaufgaben(level: Difficulty, rng: Rng, n = 4): Task[] {
  const pool = level === 1 ? SACHAUFGABEN.slice(0, 4) : SACHAUFGABEN;
  return sample(rng, pool, Math.min(n, pool.length)).map((s, i): InputTask => {
    const t = s.text(rng);
    return {
      id: tid('sach', i), type: 'input', prompt: t.q, visual: { kind: 'story', text: t.q }, answer: t.a,
      hint: 'Lies genau: Was ist gegeben? Was ist gefragt? Welche Rechenart passt?', explain: [...t.steps, `Antwort: ${t.a}`]
    };
  });
}

const EINHEITEN: { q: string; a: number; steps: string[] }[] = [
  { q: '1 m = ? cm', a: 100, steps: ['1 Meter hat 100 Zentimeter.'] },
  { q: '3 m = ? cm', a: 300, steps: ['1 m = 100 cm', '3 · 100 = 300'] },
  { q: '1 km = ? m', a: 1000, steps: ['1 Kilometer hat 1.000 Meter.'] },
  { q: '2 kg = ? g', a: 2000, steps: ['1 kg = 1.000 g', '2 · 1.000 = 2.000'] },
  { q: '1 cm = ? mm', a: 10, steps: ['1 Zentimeter hat 10 Millimeter.'] },
  { q: '5 cm = ? mm', a: 50, steps: ['1 cm = 10 mm', '5 · 10 = 50'] },
  { q: '1 Stunde = ? Minuten', a: 60, steps: ['Eine Stunde hat 60 Minuten.'] },
  { q: '2 Minuten = ? Sekunden', a: 120, steps: ['1 Minute = 60 Sekunden', '2 · 60 = 120'] },
  { q: '1 l = ? ml', a: 1000, steps: ['1 Liter hat 1.000 Milliliter.'] },
  { q: '4 km = ? m', a: 4000, steps: ['1 km = 1.000 m', '4 · 1.000 = 4.000'] },
  { q: '500 cm = ? m', a: 5, steps: ['100 cm = 1 m', '500 : 100 = 5'] },
  { q: '3.000 g = ? kg', a: 3, steps: ['1.000 g = 1 kg', '3.000 : 1.000 = 3'] }
];
export function genMasseinheiten(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? EINHEITEN.slice(0, 7) : EINHEITEN;
  return sample(rng, pool, n).map((e, i): InputTask => ({
    id: tid('mass', i), type: 'input', prompt: e.q, speak: e.q.replace('?', 'wie viel').replace('=', 'sind'),
    visual: { kind: 'text', text: e.q, size: 'lg' }, answer: e.a,
    hint: 'Merke: kilo = 1.000, zenti = Hundertstel, milli = Tausendstel.', explain: e.steps
  }));
}

export const MATH_MODULES: LearningModule[] = [
  { id: 'm1-plus', title: 'Plus bis 20', subtitle: 'Addieren', emoji: '➕', color: 'himmel', area: 'schule', grade: 1, subject: 'mathe', topic: 'Addition', roundSize: 6, generate: (l, r) => genPlus20(l, r) },
  { id: 'm1-minus', title: 'Minus bis 20', subtitle: 'Subtrahieren', emoji: '➖', color: 'koralle', area: 'schule', grade: 1, subject: 'mathe', topic: 'Subtraktion', roundSize: 6, generate: (l, r) => genMinus20(l, r) },
  { id: 'm1-vergleichen', title: 'Zahlen vergleichen', subtitle: '<, > und =', emoji: '🐊', color: 'minze', area: 'schule', grade: 1, subject: 'mathe', topic: 'Vergleichen', roundSize: 6, generate: (l, r) => genVergleichen(l, r) },
  { id: 'm1-zahlenraum', title: 'Zahlenraum bis 20', subtitle: 'Zehner und Einer', emoji: '🔟', color: 'sonne', area: 'schule', grade: 1, subject: 'mathe', topic: 'Zahlenraum', roundSize: 6, generate: (l, r) => genZahlenraum20(l, r) },
  { id: 'm2-rechnen100', title: 'Rechnen bis 100', subtitle: 'Plus und Minus', emoji: '💯', color: 'himmel', area: 'schule', grade: 2, subject: 'mathe', topic: 'Zahlenraum 100', roundSize: 6, generate: (l, r) => genRechnen100(l, r) },
  { id: 'm2-einmaleins', title: 'Einmaleins', subtitle: 'Malreihen üben', emoji: '✖️', color: 'lila', area: 'schule', grade: 2, subject: 'mathe', topic: 'Einmaleins', roundSize: 6, generate: (l, r) => genEinmaleins(l, r) },
  { id: 'm2-uhrzeit', title: 'Uhrzeit', subtitle: 'Die Uhr lesen', emoji: '🕒', color: 'sonne', area: 'schule', grade: 2, subject: 'mathe', topic: 'Uhrzeit', roundSize: 6, generate: (l, r) => genUhrzeit(l, r) },
  { id: 'm2-geld', title: 'Geld', subtitle: 'Euro und Cent', emoji: '💶', color: 'minze', area: 'schule', grade: 2, subject: 'mathe', topic: 'Geld', roundSize: 6, generate: (l, r) => genGeld(l, r) },
  { id: 'm3-malgeteilt', title: 'Mal und Geteilt', subtitle: 'Multiplikation und Division', emoji: '➗', color: 'lila', area: 'schule', grade: 3, subject: 'mathe', topic: 'Multiplikation und Division', roundSize: 6, generate: (l, r) => genMalGeteilt(l, r) },
  { id: 'm3-schriftlich', title: 'Schriftlich rechnen', subtitle: 'Untereinander', emoji: '📝', color: 'himmel', area: 'schule', grade: 3, subject: 'mathe', topic: 'Schriftliche Verfahren', roundSize: 4, generate: (l, r) => genSchriftlich(l, r) },
  { id: 'm3-geometrie', title: 'Geometrie', subtitle: 'Formen und Körper', emoji: '📐', color: 'koralle', area: 'schule', grade: 3, subject: 'mathe', topic: 'Geometrie', roundSize: 6, generate: (l, r) => genGeometrie(l, r) },
  { id: 'm4-grossezahlen', title: 'Große Zahlen', subtitle: 'Bis zur Million', emoji: '🔢', color: 'himmel', area: 'schule', grade: 4, subject: 'mathe', topic: 'Große Zahlen', roundSize: 6, generate: (l, r) => genGrosseZahlen(l, r) },
  { id: 'm4-brueche', title: 'Brüche', subtitle: 'Erste Bruchteile', emoji: '🍕', color: 'sonne', area: 'schule', grade: 4, subject: 'mathe', topic: 'Brüche', roundSize: 6, generate: (l, r) => genBrueche(l, r) },
  { id: 'm4-sachaufgaben', title: 'Sachaufgaben', subtitle: 'Rechnen im Alltag', emoji: '🚌', color: 'minze', area: 'schule', grade: 4, subject: 'mathe', topic: 'Sachaufgaben', roundSize: 4, generate: (l, r) => genSachaufgaben(l, r) },
  { id: 'm4-masseinheiten', title: 'Maßeinheiten', subtitle: 'm, cm, kg, l …', emoji: '📏', color: 'lila', area: 'schule', grade: 4, subject: 'mathe', topic: 'Größen', roundSize: 6, generate: (l, r) => genMasseinheiten(l, r) }
];
