import type { ChoiceTask, Difficulty, InputTask, LearningModule, Rng, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';
import { L, getLang, num, tx } from '../../i18n';

const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));
const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const fmt = (n: number) => num(n);

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
      ? [L(`Rechne zuerst bis zur 10: ${a} + ${10 - a} = 10.`, `Prima arriva a 10: ${a} + ${10 - a} = 10.`), L(`Dann den Rest: 10 + ${b - (10 - a)} = ${sum}.`, `Poi il resto: 10 + ${b - (10 - a)} = ${sum}.`)]
      : [L(`Starte bei ${a} und zähle ${b} weiter.`, `Parti da ${a} e conta avanti di ${b}.`), `${a} + ${b} = ${sum}`];
    if (level === 1) {
      return {
        id: tid('plus', i), type: 'choice', prompt: L(`Wie viel ist ${a} + ${b}?`, `Quanto fa ${a} + ${b}?`),
        speak: L(`Wie viel ist ${a} plus ${b}?`, `Quanto fa ${a} più ${b}?`),
        visual: { kind: 'emojis', items: [...Array(a).fill('🍎'), '➕', ...Array(b).fill('🍐')] },
        options: numberOptions(rng, sum, 3, 1, 12, 2).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(sum), optionStyle: 'big',
        hint: L('Zähle alle Früchte zusammen.', 'Conta tutta la frutta insieme.'), explain
      } satisfies ChoiceTask;
    }
    return {
      id: tid('plus', i), type: 'input', prompt: `${a} + ${b} = ?`, speak: L(`Wie viel ist ${a} plus ${b}?`, `Quanto fa ${a} più ${b}?`),
      answer: sum, hint: level === 3 ? L('Tipp: Ergänze erst bis zur 10, dann rechne weiter.', 'Suggerimento: arriva prima a 10, poi continua.') : L(`Halte ${a} im Kopf und zähle ${b} Schritte weiter.`, `Tieni ${a} a mente e conta avanti di ${b}.`), explain
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
      ? [L(`Rechne zuerst bis zur 10 zurück: ${a} − ${a - 10} = 10.`, `Prima torna a 10: ${a} − ${a - 10} = 10.`), L(`Dann noch ${b - (a - 10)} weg: 10 − ${b - (a - 10)} = ${diff}.`, `Poi togli ancora ${b - (a - 10)}: 10 − ${b - (a - 10)} = ${diff}.`)]
      : [L(`Starte bei ${a} und gehe ${b} Schritte zurück.`, `Parti da ${a} e torna indietro di ${b}.`), `${a} − ${b} = ${diff}`];
    if (level === 1) {
      return {
        id: tid('minus', i), type: 'choice', prompt: L(`${a} Ballons. ${b} fliegen weg. Wie viele bleiben?`, `${a} palloncini. ${b} volano via. Quanti ne restano?`),
        visual: { kind: 'emojis', items: [...Array(a - b).fill('🎈'), ...Array(b).fill('💨')] },
        options: numberOptions(rng, diff, 3, 0, 10, 2).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(diff), optionStyle: 'big',
        hint: L('Zähle nur die Ballons, die noch da sind.', 'Conta solo i palloncini rimasti.'), explain
      } satisfies ChoiceTask;
    }
    return {
      id: tid('minus', i), type: 'input', prompt: `${a} − ${b} = ?`, speak: L(`Wie viel ist ${a} minus ${b}?`, `Quanto fa ${a} meno ${b}?`),
      answer: diff, hint: level === 3 ? L('Tipp: Gehe erst bis zur 10 zurück.', 'Suggerimento: torna prima a 10.') : L('Zähle rückwärts.', 'Conta all’indietro.'), explain
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
      id: tid('vgl', i), type: 'choice', prompt: L(`Welches Zeichen passt? ${a} ? ${b}`, `Quale segno va bene? ${a} ? ${b}`),
      speak: L(`Welches Zeichen passt zwischen ${a} und ${b}?`, `Quale segno va tra ${a} e ${b}?`),
      visual: { kind: 'text', text: `${a}  ?  ${b}`, size: 'xl' },
      options: [{ id: '<', label: '<', speak: L('kleiner als', 'minore di') }, { id: '=', label: '=', speak: L('gleich', 'uguale') }, { id: '>', label: '>', speak: L('größer als', 'maggiore di') }],
      correctId: sym, optionStyle: 'big',
      hint: L('Das Krokodil-Maul ist immer offen zur größeren Zahl.', 'La bocca del coccodrillo è sempre aperta verso il numero più grande.'),
      explain: [sym === '=' ? L(`${a} und ${b} sind gleich groß.`, `${a} e ${b} sono uguali.`) : L(`${Math.max(a, b)} ist größer als ${Math.min(a, b)}.`, `${Math.max(a, b)} è maggiore di ${Math.min(a, b)}.`), L('Also: ', 'Quindi: ') + `${a} ${sym} ${b}`]
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
        id: tid('zr', i), type: 'order', prompt: L('Ordne die Zahlen von klein nach groß!', 'Ordina i numeri dal più piccolo al più grande!'),
        items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })), correctOrder: nums.map(String),
        hint: L('Finde die kleinste Zahl zuerst.', 'Trova prima il numero più piccolo.'), explain: [L('Richtig ist: ', 'La risposta giusta è: ') + nums.join(' – ')]
      };
    }
    const z = randInt(rng, 11, 20);
    const zehner = Math.floor(z / 10);
    const einer = z % 10;
    return {
      id: tid('zr', i), type: 'choice', prompt: L(`${zehner} Zehner und ${einer} Einer – welche Zahl ist das?`, `${zehner} decina e ${einer} unità: che numero è?`.replace('2 decina', '2 decine')),
      visual: { kind: 'emojis', items: [...Array(zehner).fill('🔟'), ...Array(einer).fill('🟡')] },
      options: numberOptions(rng, z, 4, 10, 20, 3).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(z), optionStyle: 'big',
      hint: L('Ein Zehner sind 10. Zähle dann die Einer dazu.', 'Una decina vale 10. Poi aggiungi le unità.'),
      explain: [L(`${zehner} Zehner = ${zehner * 10}`, `${zehner} ${zehner === 1 ? 'decina' : 'decine'} = ${zehner * 10}`), `${zehner * 10} + ${einer} = ${z}`]
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
      ? [L(`Zerlege ${b} in ${z} und ${e}.`, `Scomponi ${b} in ${z} e ${e}.`), `${a} ${plus ? '+' : '−'} ${z} = ${plus ? a + z : a - z}`, `${plus ? a + z : a - z} ${plus ? '+' : '−'} ${e} = ${res}`]
      : [`${a} ${plus ? '+' : '−'} ${b} = ${res}`];
    return {
      id: tid('r100', i), type: 'input', prompt: `${a} ${plus ? '+' : '−'} ${b} = ?`,
      speak: L(`Wie viel ist ${a} ${plus ? 'plus' : 'minus'} ${b}?`, `Quanto fa ${a} ${plus ? 'più' : 'meno'} ${b}?`), answer: res,
      hint: z > 0 && e > 0 ? L('Rechne erst die Zehner, dann die Einer.', 'Calcola prima le decine, poi le unità.') : L('Denke an die Zehnerzahlen: 10, 20, 30 …', 'Pensa alle decine: 10, 20, 30 …'), explain
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
        id: tid('1x1', i), type: 'choice', prompt: L(`${k} Gruppen mit je ${r} Punkten. Wie viele sind es?`, `${k} gruppi da ${r} punti. Quanti sono in tutto?`),
        visual: { kind: 'text', text: `${k} · ${r}`, size: 'xl' },
        options: numberOptions(rng, res, 4, 1, 100, r).map((v) => ({ id: String(v), label: String(v) })),
        correctId: String(res), optionStyle: 'big',
        hint: L(`Zähle in ${r}er-Schritten: ${r}, ${r * 2}, ${r * 3} …`, `Conta di ${r} in ${r}: ${r}, ${r * 2}, ${r * 3} …`),
        explain: [L(`${k} mal ${r} heißt: `, `${k} per ${r} vuol dire: `) + Array(k).fill(r).join(' + '), `= ${res}`]
      } satisfies ChoiceTask;
    }
    return {
      id: tid('1x1', i), type: 'input', prompt: `${k} · ${r} = ?`, speak: L(`Wie viel ist ${k} mal ${r}?`, `Quanto fa ${k} per ${r}?`), answer: res,
      hint: k > 5 ? L(`Tipp: 5 · ${r} = ${5 * r}. Rechne von dort weiter.`, `Suggerimento: 5 · ${r} = ${5 * r}. Continua da lì.`) : L(`Zähle in ${r}er-Schritten.`, `Conta di ${r} in ${r}.`),
      explain: k > 5 ? [`5 · ${r} = ${5 * r}`, `${k - 5} · ${r} = ${(k - 5) * r}`, `${5 * r} + ${(k - 5) * r} = ${res}`] : [`${Array(k).fill(r).join(' + ')} = ${res}`]
    } satisfies InputTask;
  });
}

export function uhrText(h: number, m: number): string {
  const h12 = ((h - 1) % 12) + 1;
  const next = (h12 % 12) + 1;
  if (getLang() === 'it') {
    const ore = (x: number) => (x === 1 ? 'l’una' : `le ${x}`);
    if (m === 0) return ore(h12);
    if (m === 30) return `${ore(h12)} e mezza`;
    if (m === 15) return `${ore(h12)} e un quarto`;
    if (m === 45) return `${ore(next)} meno un quarto`;
    if (m < 30) return `${ore(h12)} e ${m}`;
    return `${ore(next)} meno ${60 - m}`;
  }
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
      id: tid('uhr', i), type: 'choice', prompt: L('Wie spät ist es?', 'Che ore sono?'),
      visual: { kind: 'clock', hours: h, minutes: m },
      options: shuffle(rng, [...set]).map((t) => ({ id: t, label: t })), correctId: richtig, optionStyle: 'text',
      hint: L('Der kurze Zeiger zeigt die Stunde, der lange Zeiger die Minuten.', 'La lancetta corta indica l’ora, quella lunga i minuti.'),
      explain: [m === 0 ? L(`Der kurze Zeiger steht genau auf der ${h}.`, `La lancetta corta è proprio sul ${h}.`) : L(`Der kurze Zeiger steht zwischen der ${h} und der ${(h % 12) + 1}.`, `La lancetta corta è tra il ${h} e il ${(h % 12) + 1}.`), L(`Der lange Zeiger zeigt ${m} Minuten.`, `La lancetta lunga indica ${m} minuti.`), L(`Es ist ${digital} Uhr – also ${richtig}.`, `Sono le ${digital}, cioè ${richtig}.`)]
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
      id: tid('geld', i), type: 'choice', prompt: L('Wie viel Geld ist das zusammen?', 'Quanti soldi sono in tutto?'),
      visual: { kind: 'coins', cents: coins },
      options: shuffle(rng, [...opts]).map((v) => ({ id: String(v), label: euro(v) })),
      correctId: String(sum), optionStyle: 'text',
      hint: L('Fang mit der größten Münze an und zähle die anderen dazu.', 'Comincia dalla moneta più grande e aggiungi le altre.'),
      explain: [`${coins.map(euro).join(' + ')}`, `= ${euro(sum)}`, L('100 Cent sind 1 Euro.', '100 centesimi fanno 1 euro.')]
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
        id: tid('mal', i), type: 'input', prompt: `${x} · ${y} = ?`, speak: L(`Wie viel ist ${x} mal ${y}?`, `Quanto fa ${x} per ${y}?`), answer: x * y,
        hint: L(`Rechne erst ${x / 10} · ${y} und hänge dann eine Null an.`, `Calcola prima ${x / 10} · ${y} e poi aggiungi uno zero.`), explain: [`${x / 10} · ${y} = ${(x / 10) * y}`, `${x} · ${y} = ${x * y}`]
      };
    }
    if (geteilt) {
      return {
        id: tid('geteilt', i), type: 'input', prompt: `${a * b} : ${b} = ?`, speak: L(`Wie viel ist ${a * b} geteilt durch ${b}?`, `Quanto fa ${a * b} diviso ${b}?`), answer: a,
        hint: L(`Welche Zahl mal ${b} ergibt ${a * b}?`, `Quale numero per ${b} fa ${a * b}?`), explain: [L('Teilen ist die Umkehrung vom Malnehmen.', 'La divisione è il contrario della moltiplicazione.'), `${a} · ${b} = ${a * b}`, L('Also: ', 'Quindi: ') + `${a * b} : ${b} = ${a}`]
      };
    }
    return {
      id: tid('mal', i), type: 'input', prompt: `${a} · ${b} = ?`, speak: L(`Wie viel ist ${a} mal ${b}?`, `Quanto fa ${a} per ${b}?`), answer: a * b,
      hint: L(`Das ist ${a}-mal die ${b}.`, `È ${b} ripetuto ${a} volte.`), explain: [`${Array(a).fill(b).join(' + ')} = ${a * b}`]
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
      ? [L(`Einer: ${ea} + ${eb} = ${ea + eb}${ea + eb >= 10 ? `, schreibe ${(ea + eb) % 10}, merke 1` : ''}.`, `Unità: ${ea} + ${eb} = ${ea + eb}${ea + eb >= 10 ? `, scrivi ${(ea + eb) % 10} e riporta 1` : ''}.`), L('Dann die Zehner, dann die Hunderter – Übertrag nicht vergessen!', 'Poi le decine e le centinaia: non dimenticare il riporto!'), L('Ergebnis: ', 'Risultato: ') + res]
      : [L(`Einer: ${ea} − ${eb}${ea < eb ? ' geht nicht – borge dir einen Zehner' : ` = ${ea - eb}`}.`, `Unità: ${ea} − ${eb}${ea < eb ? ' non si può: prendi in prestito una decina' : ` = ${ea - eb}`}.`), L('Dann die Zehner und die Hunderter.', 'Poi le decine e le centinaia.'), L('Ergebnis: ', 'Risultato: ') + res];
    return {
      id: tid('schr', i), type: 'input', prompt: L('Rechne schriftlich: ', 'Calcola in colonna: ') + `${a} ${plus ? '+' : '−'} ${b}`,
      visual: { kind: 'column', a, b, op: plus ? '+' : '-' },
      answer: res, hint: L('Fang ganz rechts bei den Einern an.', 'Comincia da destra, dalle unità.'), explain: steps
    };
  });
}

type T2 = [string, string];
const GEO_FRAGEN: { q: T2; a: T2; f: T2[]; hint: T2; visual?: ChoiceTask['visual'] }[] = [
  { q: ['Wie viele Ecken hat ein Dreieck?', 'Quanti angoli ha un triangolo?'], a: ['3', '3'], f: [['4', '4'], ['2', '2'], ['5', '5']], hint: ['Der Name verrät es schon.', 'Lo dice già il nome: tri = tre.'], visual: { kind: 'shape', shape: 'dreieck', color: '#FF6F59' } },
  { q: ['Wie viele Ecken hat ein Quadrat?', 'Quanti angoli ha un quadrato?'], a: ['4', '4'], f: [['3', '3'], ['5', '5'], ['6', '6']], hint: ['Zähle die Ecken mit dem Finger.', 'Conta gli angoli con il dito.'], visual: { kind: 'shape', shape: 'quadrat', color: '#3A9BDC' } },
  { q: ['Welche Form hat 4 gleich lange Seiten und 4 rechte Winkel?', 'Quale figura ha 4 lati uguali e 4 angoli retti?'], a: ['Quadrat', 'Quadrato'], f: [['Rechteck', 'Rettangolo'], ['Dreieck', 'Triangolo'], ['Kreis', 'Cerchio']], hint: ['Alle Seiten sind gleich lang.', 'Tutti i lati sono uguali.'] },
  { q: ['Welche Form hat keine Ecken?', 'Quale figura non ha angoli?'], a: ['Kreis', 'Cerchio'], f: [['Quadrat', 'Quadrato'], ['Dreieck', 'Triangolo'], ['Rechteck', 'Rettangolo']], hint: ['Diese Form ist ganz rund.', 'Questa figura è tutta rotonda.'] },
  { q: ['Welcher Körper ist rund wie ein Ball?', 'Quale solido è rotondo come una palla?'], a: ['Kugel', 'Sfera'], f: [['Würfel', 'Cubo'], ['Zylinder', 'Cilindro'], ['Kegel', 'Cono']], hint: ['Er rollt in jede Richtung.', 'Rotola in ogni direzione.'], visual: { kind: 'solid3d', solid: 'kugel', color: '#FF6F59' } },
  { q: ['Wie viele Flächen hat ein Würfel?', 'Quante facce ha un cubo?'], a: ['6', '6'], f: [['4', '4'], ['8', '8'], ['12', '12']], hint: ['Denk an einen Spielwürfel: 1 bis 6.', 'Pensa a un dado: da 1 a 6.'], visual: { kind: 'solid3d', solid: 'wuerfel', color: '#3A9BDC' } },
  { q: ['Welcher Körper sieht aus wie eine Dose?', 'Quale solido sembra una lattina?'], a: ['Zylinder', 'Cilindro'], f: [['Kegel', 'Cono'], ['Kugel', 'Sfera'], ['Quader', 'Parallelepipedo']], hint: ['Oben und unten ist ein Kreis.', 'Sopra e sotto c’è un cerchio.'], visual: { kind: 'solid3d', solid: 'zylinder', color: '#2EC4B6' } },
  { q: ['Welcher Körper sieht aus wie eine Eistüte?', 'Quale solido sembra un cono gelato?'], a: ['Kegel', 'Cono'], f: [['Zylinder', 'Cilindro'], ['Würfel', 'Cubo'], ['Pyramide', 'Piramide']], hint: ['Unten rund, oben spitz.', 'Rotondo sotto, appuntito sopra.'], visual: { kind: 'solid3d', solid: 'kegel', color: '#FFB627' } },
  { q: ['Wie viele Ecken hat ein Würfel?', 'Quanti vertici ha un cubo?'], a: ['8', '8'], f: [['6', '6'], ['4', '4'], ['12', '12']], hint: ['Oben 4 und unten 4.', '4 sopra e 4 sotto.'], visual: { kind: 'solid3d', solid: 'wuerfel', color: '#8E6CEF' } },
  { q: ['Ein Rechteck ist 5 cm lang und 3 cm breit. Wie groß ist der Umfang?', 'Un rettangolo è lungo 5 cm e largo 3 cm. Quanto misura il perimetro?'], a: ['16 cm', '16 cm'], f: [['15 cm', '15 cm'], ['8 cm', '8 cm'], ['13 cm', '13 cm']], hint: ['Umfang: alle vier Seiten zusammenzählen.', 'Perimetro: somma tutti e quattro i lati.'] },
  { q: ['Was ist achsensymmetrisch?', 'Che cosa è simmetrico?'], a: ['ein Schmetterling 🦋', 'una farfalla 🦋'], f: [['eine Schnecke 🐌', 'una lumaca 🐌'], ['eine Hand mit Daumen links ✋', 'una mano con il pollice a sinistra ✋'], ['eine Welle 🌊', 'un’onda 🌊']], hint: ['Man kann es in der Mitte falten und beide Seiten sind gleich.', 'Si può piegare a metà e le due parti sono uguali.'] }
];
const pickL = (t: T2) => L(t[0], t[1]);
export function genGeometrie(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? GEO_FRAGEN.slice(0, 5) : level === 2 ? GEO_FRAGEN.slice(0, 9) : GEO_FRAGEN;
  return sample(rng, pool, Math.min(n, pool.length)).map((g, i): ChoiceTask => {
    const a = pickL(g.a);
    return {
      id: tid('geo', i), type: 'choice', prompt: pickL(g.q), visual: g.visual,
      options: shuffle(rng, [a, ...g.f.map(pickL)]).map((x) => ({ id: x, label: x })), correctId: a, optionStyle: 'text',
      hint: pickL(g.hint), explain: [L('Richtig ist: ', 'La risposta giusta è: ') + a + '.', pickL(g.hint)]
    };
  });
}

/* =================== Klasse 4 =================== */

export function genGrosseZahlen(level: Difficulty, rng: Rng, n = 6): Task[] {
  const max = level === 1 ? 9999 : level === 2 ? 99999 : 999999;
  return times(n, (i): ChoiceTask => {
    const z = randInt(rng, 1000, max);
    const stellen = getLang() === 'it'
      ? ['unità', 'decine', 'centinaia', 'migliaia', 'decine di migliaia', 'centinaia di migliaia']
      : ['Einer', 'Zehner', 'Hunderter', 'Tausender', 'Zehntausender', 'Hunderttausender'];
    const len = String(z).length;
    if (i % 2 === 0) {
      const pos = randInt(rng, 0, len - 1);
      const digit = Math.floor(z / 10 ** pos) % 10;
      return {
        id: tid('gz', i), type: 'choice', prompt: L(`Welche Ziffer steht bei ${fmt(z)} an der ${stellen[pos]}-Stelle?`, `In ${fmt(z)}, quale cifra c’è al posto delle ${stellen[pos]}?`),
        visual: { kind: 'text', text: fmt(z), size: 'xl' },
        options: shuffle(rng, [...new Set([digit, ...shuffle(rng, String(z).split('').map(Number)), (digit + 1) % 10, (digit + 5) % 10])].slice(0, 4)).map((d) => ({ id: String(d), label: String(d) })),
        correctId: String(digit), optionStyle: 'big',
        hint: L('Zähle von rechts: Einer, Zehner, Hunderter, Tausender …', 'Conta da destra: unità, decine, centinaia, migliaia …'),
        explain: [L(`Von rechts gezählt ist die ${stellen[pos]}-Stelle die ${pos + 1}. Stelle.`, `Contando da destra, le ${stellen[pos]} sono al ${pos + 1}° posto.`), L(`Dort steht die ${digit}.`, `Lì c’è la cifra ${digit}.`)]
      };
    }
    const runden = level === 1 ? 100 : 1000;
    const ger = Math.round(z / runden) * runden;
    const stelle = runden === 100 ? L('Hunderter', 'centinaia') : L('Tausender', 'migliaia');
    return {
      id: tid('gz', i), type: 'choice', prompt: L(`Runde ${fmt(z)} auf ${stelle}.`, `Arrotonda ${fmt(z)} alle ${stelle}.`),
      options: shuffle(rng, [...new Set([ger, ger + runden, Math.max(0, ger - runden)])]).map((v) => ({ id: String(v), label: fmt(v) })),
      correctId: String(ger), optionStyle: 'text',
      hint: L('Schau auf die Ziffer rechts daneben: Bei 0–4 abrunden, bei 5–9 aufrunden.', 'Guarda la cifra a destra: da 0 a 4 arrotondi per difetto, da 5 a 9 per eccesso.'),
      explain: [L(`Die Ziffer rechts neben der ${stelle}-Stelle entscheidet.`, `Decide la cifra a destra delle ${stelle}.`), `${fmt(z)} ≈ ${fmt(ger)}`]
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
      id: tid('bruch', i), type: 'choice', prompt: L('Welcher Bruchteil der Pizza ist gefärbt?', 'Quale frazione della pizza è colorata?'),
      visual: { kind: 'fraction', parts, filled },
      options: shuffle(rng, [...opts].slice(0, 4)).map((x) => ({ id: x, label: x })),
      correctId: label, optionStyle: 'big',
      hint: L('Unten steht, in wie viele Stücke geteilt wurde. Oben, wie viele gefärbt sind.', 'Sotto (denominatore) quante parti in tutto, sopra (numeratore) quante sono colorate.'),
      explain: [L(`Die Pizza hat ${parts} gleich große Stücke.`, `La pizza ha ${parts} parti uguali.`), L(`${filled} davon sind gefärbt: ${label}.`, `${filled} sono colorate: ${label}.`)]
    };
  });
}

interface Sachaufgabe { text: (r: Rng) => { q: string; a: number; steps: string[] } }
const SACHAUFGABEN: Sachaufgabe[] = [
  { text: (r) => { const k = randInt(r, 3, 9), p = randInt(r, 2, 6); return { q: L(`Lea kauft ${k} Hefte. Jedes Heft kostet ${p} €. Wie viel Euro bezahlt sie?`, `Giulia compra ${k} quaderni. Ogni quaderno costa ${p} €. Quanti euro paga?`), a: k * p, steps: [L(`${k} Hefte · ${p} € = ${k * p} €`, `${k} quaderni · ${p} € = ${k * p} €`)] }; } },
  { text: (r) => { const b = randInt(r, 4, 9) * 3, g = 3; return { q: L(`${b} Bonbons werden gerecht an ${g} Kinder verteilt. Wie viele bekommt jedes Kind?`, `${b} caramelle vengono divise in parti uguali tra ${g} bambini. Quante ne riceve ognuno?`), a: b / g, steps: [`${b} : ${g} = ${b / g}`] }; } },
  { text: (r) => { const s = randInt(r, 120, 480), w = randInt(r, 50, 150); return { q: L(`Ein Bus hat schon ${s} km gefahren. Er fährt noch ${w} km weiter. Wie viele Kilometer sind es insgesamt?`, `Un autobus ha già percorso ${s} km. Ne fa ancora ${w}. Quanti chilometri in tutto?`), a: s + w, steps: [`${s} km + ${w} km = ${s + w} km`] }; } },
  { text: (r) => { const g = randInt(r, 20, 50), a = randInt(r, 5, 15); return { q: L(`Tom hat ${g} €. Er kauft ein Buch für ${a} €. Wie viel Geld hat er noch?`, `Luca ha ${g} €. Compra un libro da ${a} €. Quanti soldi gli restano?`), a: g - a, steps: [`${g} € − ${a} € = ${g - a} €`] }; } },
  { text: (r) => { const t = randInt(r, 3, 8), k = randInt(r, 4, 9), e = randInt(r, 2, 5); return { q: L(`In einer Klasse sitzen ${t} Tische mit je ${k} Kindern. ${e} Kinder fehlen heute. Wie viele Kinder sind da?`, `In una classe ci sono ${t} tavoli con ${k} bambini ciascuno. Oggi ${e} bambini sono assenti. Quanti sono presenti?`), a: t * k - e, steps: [`${t} · ${k} = ${t * k}`, `${t * k} − ${e} = ${t * k - e}`] }; } },
  { text: (r) => { const m = randInt(r, 2, 6); return { q: L(`Ein Film dauert ${m} Stunden. Wie viele Minuten sind das?`, `Un film dura ${m} ore. Quanti minuti sono?`), a: m * 60, steps: [L('1 Stunde = 60 Minuten', '1 ora = 60 minuti'), `${m} · 60 = ${m * 60}`] }; } }
];
export function genSachaufgaben(level: Difficulty, rng: Rng, n = 4): Task[] {
  const pool = level === 1 ? SACHAUFGABEN.slice(0, 4) : SACHAUFGABEN;
  return sample(rng, pool, Math.min(n, pool.length)).map((s, i): InputTask => {
    const t = s.text(rng);
    return {
      id: tid('sach', i), type: 'input', prompt: t.q, visual: { kind: 'story', text: t.q }, answer: t.a,
      hint: L('Lies genau: Was ist gegeben? Was ist gefragt? Welche Rechenart passt?', 'Leggi bene: quali sono i dati? Che cosa si chiede? Quale operazione serve?'), explain: [...t.steps, L('Antwort: ', 'Risposta: ') + t.a]
    };
  });
}

const EINHEITEN: { q: T2; a: number; steps: T2[] }[] = [
  { q: ['1 m = ? cm', '1 m = ? cm'], a: 100, steps: [['1 Meter hat 100 Zentimeter.', '1 metro ha 100 centimetri.']] },
  { q: ['3 m = ? cm', '3 m = ? cm'], a: 300, steps: [['1 m = 100 cm', '1 m = 100 cm'], ['3 · 100 = 300', '3 · 100 = 300']] },
  { q: ['1 km = ? m', '1 km = ? m'], a: 1000, steps: [['1 Kilometer hat 1.000 Meter.', '1 chilometro ha 1.000 metri.']] },
  { q: ['2 kg = ? g', '2 kg = ? g'], a: 2000, steps: [['1 kg = 1.000 g', '1 kg = 1.000 g'], ['2 · 1.000 = 2.000', '2 · 1.000 = 2.000']] },
  { q: ['1 cm = ? mm', '1 cm = ? mm'], a: 10, steps: [['1 Zentimeter hat 10 Millimeter.', '1 centimetro ha 10 millimetri.']] },
  { q: ['5 cm = ? mm', '5 cm = ? mm'], a: 50, steps: [['1 cm = 10 mm', '1 cm = 10 mm'], ['5 · 10 = 50', '5 · 10 = 50']] },
  { q: ['1 Stunde = ? Minuten', '1 ora = ? minuti'], a: 60, steps: [['Eine Stunde hat 60 Minuten.', 'Un’ora ha 60 minuti.']] },
  { q: ['2 Minuten = ? Sekunden', '2 minuti = ? secondi'], a: 120, steps: [['1 Minute = 60 Sekunden', '1 minuto = 60 secondi'], ['2 · 60 = 120', '2 · 60 = 120']] },
  { q: ['1 l = ? ml', '1 l = ? ml'], a: 1000, steps: [['1 Liter hat 1.000 Milliliter.', '1 litro ha 1.000 millilitri.']] },
  { q: ['4 km = ? m', '4 km = ? m'], a: 4000, steps: [['1 km = 1.000 m', '1 km = 1.000 m'], ['4 · 1.000 = 4.000', '4 · 1.000 = 4.000']] },
  { q: ['500 cm = ? m', '500 cm = ? m'], a: 5, steps: [['100 cm = 1 m', '100 cm = 1 m'], ['500 : 100 = 5', '500 : 100 = 5']] },
  { q: ['3.000 g = ? kg', '3.000 g = ? kg'], a: 3, steps: [['1.000 g = 1 kg', '1.000 g = 1 kg'], ['3.000 : 1.000 = 3', '3.000 : 1.000 = 3']] }
];
export function genMasseinheiten(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? EINHEITEN.slice(0, 7) : EINHEITEN;
  return sample(rng, pool, n).map((e, i): InputTask => {
    const q = pickL(e.q);
    return {
      id: tid('mass', i), type: 'input', prompt: q, speak: q.replace('?', L('wie viel', 'quanti')).replace('=', L('sind', 'fanno')),
      visual: { kind: 'text', text: q, size: 'lg' }, answer: e.a,
      hint: L('Merke: kilo = 1.000, zenti = Hundertstel, milli = Tausendstel.', 'Ricorda: chilo = 1.000, centi = centesimo, milli = millesimo.'), explain: e.steps.map(pickL)
    };
  });
}

const M = (id: string, de: string, it: string, sde: string, sit: string, emoji: string, color: LearningModule['color'], years: [number, number], tde: string, tit: string, roundSize: number, generate: LearningModule['generate']): LearningModule =>
  ({ id, title: tx(de, it), subtitle: tx(sde, sit), emoji, color, area: 'schule', years, subject: 'mathe', topic: tx(tde, tit), roundSize, generate });

export const MATH_MODULES: LearningModule[] = [
  M('m1-plus', 'Plus bis 20', 'Addizioni fino a 20', 'Addieren', 'Addizione', '➕', 'himmel', [1, 1], 'Addition', 'Addizione', 6, (l, r) => genPlus20(l, r)),
  M('m1-minus', 'Minus bis 20', 'Sottrazioni fino a 20', 'Subtrahieren', 'Sottrazione', '➖', 'koralle', [1, 1], 'Subtraktion', 'Sottrazione', 6, (l, r) => genMinus20(l, r)),
  M('m1-vergleichen', 'Zahlen vergleichen', 'Confrontare i numeri', '<, > und =', '<, > e =', '🐊', 'minze', [1, 1], 'Vergleichen', 'Confronto', 6, (l, r) => genVergleichen(l, r)),
  M('m1-zahlenraum', 'Zahlenraum bis 20', 'Numeri fino a 20', 'Zehner und Einer', 'Decine e unità', '🔟', 'sonne', [1, 1], 'Zahlenraum', 'Numeri', 6, (l, r) => genZahlenraum20(l, r)),
  M('m2-rechnen100', 'Rechnen bis 100', 'Calcoli fino a 100', 'Plus und Minus', 'Addizioni e sottrazioni', '💯', 'himmel', [2, 2], 'Zahlenraum 100', 'Numeri fino a 100', 6, (l, r) => genRechnen100(l, r)),
  M('m2-einmaleins', 'Einmaleins', 'Tabelline', 'Malreihen üben', 'Esercitare le tabelline', '✖️', 'lila', [2, 3], 'Einmaleins', 'Tabelline', 6, (l, r) => genEinmaleins(l, r)),
  M('m2-uhrzeit', 'Uhrzeit', 'L’orologio', 'Die Uhr lesen', 'Leggere l’ora', '🕒', 'sonne', [2, 3], 'Uhrzeit', 'Orologio', 6, (l, r) => genUhrzeit(l, r)),
  M('m2-geld', 'Geld', 'Il denaro', 'Euro und Cent', 'Euro e centesimi', '💶', 'minze', [2, 3], 'Geld', 'Denaro', 6, (l, r) => genGeld(l, r)),
  M('m3-malgeteilt', 'Mal und Geteilt', 'Moltiplicazioni e divisioni', 'Multiplikation und Division', 'Per e diviso', '➗', 'lila', [3, 4], 'Multiplikation und Division', 'Moltiplicazione e divisione', 6, (l, r) => genMalGeteilt(l, r)),
  M('m3-schriftlich', 'Schriftlich rechnen', 'Operazioni in colonna', 'Untereinander', 'In colonna', '📝', 'himmel', [3, 4], 'Schriftliche Verfahren', 'Calcolo in colonna', 4, (l, r) => genSchriftlich(l, r)),
  M('m3-geometrie', 'Geometrie', 'Geometria', 'Formen und Körper', 'Figure e solidi', '📐', 'koralle', [3, 4], 'Geometrie', 'Geometria', 6, (l, r) => genGeometrie(l, r)),
  M('m4-grossezahlen', 'Große Zahlen', 'Grandi numeri', 'Bis zur Million', 'Fino al milione', '🔢', 'himmel', [4, 5], 'Große Zahlen', 'Grandi numeri', 6, (l, r) => genGrosseZahlen(l, r)),
  M('m4-brueche', 'Brüche', 'Frazioni', 'Erste Bruchteile', 'Prime frazioni', '🍕', 'sonne', [4, 5], 'Brüche', 'Frazioni', 6, (l, r) => genBrueche(l, r)),
  M('m4-sachaufgaben', 'Sachaufgaben', 'Problemi', 'Rechnen im Alltag', 'Matematica di tutti i giorni', '🚌', 'minze', [4, 5], 'Sachaufgaben', 'Problemi', 4, (l, r) => genSachaufgaben(l, r)),
  M('m4-masseinheiten', 'Maßeinheiten', 'Unità di misura', 'm, cm, kg, l …', 'm, cm, kg, l …', '📏', 'lila', [4, 5], 'Größen', 'Misure', 6, (l, r) => genMasseinheiten(l, r))
];
