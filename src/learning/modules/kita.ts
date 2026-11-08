import type { ChoiceTask, Difficulty, DragMatchTask, LearningModule, MemoryTask, PuzzlePicture, PuzzleTask, Rng, ShapeName, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';
import { FARBEN, FARB_DINGE, TIERE, ZAEHLDINGE, bildwoerter, countName, farbName, reime, zahlwort } from '../../content/words';
import { L, getLang, tx } from '../../i18n';

const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));
const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;

/* ---------- 1. Zahlen 1–20 kennenlernen ---------- */
export function genZahlen(level: Difficulty, rng: Rng, n = 5): Task[] {
  const max = level === 1 ? 5 : level === 2 ? 10 : 20;
  const optCount = level === 1 ? 3 : 4;
  return times(n, (i): ChoiceTask => {
    const zahl = randInt(rng, 1, max);
    const opts = numberOptions(rng, zahl, optCount, 1, max, 3).map((v) => ({ id: String(v), label: String(v) }));
    if (i % 2 === 0 && zahl <= 10) {
      return {
        id: tid('zahl', i), type: 'choice',
        prompt: L('Wie viele Punkte siehst du?', 'Quanti punti vedi?'),
        visual: { kind: 'dots', count: zahl },
        options: opts, correctId: String(zahl), optionStyle: 'big',
        hint: L('Tippe jeden Punkt mit dem Finger an und zähle laut mit.', 'Tocca ogni punto con il dito e conta ad alta voce.'),
        explain: [L(`Wir zählen zusammen: ${times(zahl, (k) => k + 1).join(', ')}.`, `Contiamo insieme: ${times(zahl, (k) => k + 1).join(', ')}.`), L(`Es sind ${zahlwort(zahl)} Punkte. Das ist die ${zahl}.`, `Sono ${zahlwort(zahl)} punti. È il numero ${zahl}.`)]
      };
    }
    return {
      id: tid('zahl', i), type: 'choice',
      prompt: L(`Finde die Zahl ${zahlwort(zahl)}!`, `Trova il numero ${zahlwort(zahl)}!`),
      options: opts, correctId: String(zahl), optionStyle: 'big',
      hint: L(`Hör genau hin: ${zahlwort(zahl)}. Tippe auf den Lautsprecher, dann hörst du es nochmal.`, `Ascolta bene: ${zahlwort(zahl)}. Tocca l’altoparlante per sentirlo di nuovo.`),
      explain: [L(`So sieht die Zahl ${zahlwort(zahl)} aus: ${zahl}.`, `Il numero ${zahlwort(zahl)} si scrive così: ${zahl}.`)]
    };
  });
}

/* ---------- 2. Gegenstände zählen ---------- */
export function genZaehlen(level: Difficulty, rng: Rng, n = 5): Task[] {
  const max = level === 1 ? 5 : level === 2 ? 8 : 12;
  return times(n, (i): ChoiceTask => {
    const ding = pick(rng, ZAEHLDINGE);
    const anzahl = randInt(rng, level === 3 ? 4 : 1, max);
    const opts = numberOptions(rng, anzahl, level === 1 ? 3 : 4, 1, max + 2, 2);
    return {
      id: tid('zaehl', i), type: 'choice',
      prompt: L(`Wie viele ${ding.mehrzahl} siehst du?`, `Quante ${ding.it[1]} vedi?`.replace('Quante pesci', 'Quanti pesci').replace('Quante fiori', 'Quanti fiori').replace('Quante palloncini', 'Quanti palloncini')),
      visual: { kind: 'emojis', items: times(anzahl, () => ding.emoji) },
      options: opts.map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(anzahl), optionStyle: 'big',
      hint: L('Zeige auf jedes Bild und zähle laut: eins, zwei, drei …', 'Indica ogni immagine e conta ad alta voce: uno, due, tre …'),
      explain: [L('Wir zählen gemeinsam: ', 'Contiamo insieme: ') + `${times(anzahl, (k) => zahlwort(k + 1)).join(', ')}.`, L(`Es sind ${anzahl} ${countName(ding, anzahl)}.`, `${anzahl === 1 ? 'È' : 'Sono'} ${anzahl} ${countName(ding, anzahl)}.`)]
    };
  });
}

/* ---------- 3. Farben unterscheiden ---------- */
export function genFarben(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = level === 1 ? FARBEN.slice(0, 4) : level === 2 ? FARBEN.slice(0, 7) : FARBEN;
  const optCount = level === 1 ? 3 : level === 2 ? 4 : 6;
  return times(n, (i): ChoiceTask => {
    if (level >= 2 && i % 2 === 1) {
      const ding = pick(rng, FARB_DINGE);
      const richtig = FARBEN.find((f) => f.id === ding.farbe)!;
      const andere = sample(rng, FARBEN.filter((f) => f.id !== richtig.id), optCount - 1);
      return {
        id: tid('farbe', i), type: 'choice',
        prompt: L(`Welche Farbe hat ${ding.artikel} ${ding.name}?`, `Di che colore è ${ding.it}?`),
        visual: { kind: 'bigEmoji', emoji: ding.emoji, caption: L(ding.name, cap(ding.it.replace(/^(il |la |l’|lo )/, ''))) },
        options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, color: f.hex, speak: farbName(f), label: farbName(f) })),
        correctId: richtig.id, optionStyle: 'color',
        hint: L(`Schau dir ${ding.artikel === 'der' ? 'den' : ding.artikel} ${ding.name} genau an. Welche Farbe siehst du am meisten?`, `Guarda bene ${ding.it}. Quale colore vedi di più?`),
        explain: [L(`${ding.artikel[0]!.toUpperCase() + ding.artikel.slice(1)} ${ding.name} ist ${richtig.name.toLowerCase()}.`, `${cap(ding.it)} è ${richtig.it.toLowerCase()}.`)]
      };
    }
    const richtig = pick(rng, pool);
    const andere = sample(rng, pool.filter((f) => f.id !== richtig.id), optCount - 1);
    return {
      id: tid('farbe', i), type: 'choice',
      prompt: L(`Tippe auf die Farbe ${richtig.name}!`, `Tocca il colore ${richtig.it.toLowerCase()}!`),
      options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, color: f.hex, speak: farbName(f), label: farbName(f) })),
      correctId: richtig.id, optionStyle: 'color',
      hint: L(`${richtig.name} … Denk an etwas, das ${richtig.name.toLowerCase()} ist.`, `${richtig.it} … Pensa a qualcosa di colore ${richtig.it.toLowerCase()}.`),
      explain: [L(`Das hier ist ${richtig.name}.`, `Questo è il ${richtig.it.toLowerCase()}.`)]
    };
  });
}

/* ---------- 4. Formen erkennen und zuordnen ---------- */
export const FORMEN: { id: ShapeName; name: string; artikel: string; it: string }[] = [
  { id: 'kreis', name: 'Kreis', artikel: 'den', it: 'il cerchio' },
  { id: 'quadrat', name: 'Quadrat', artikel: 'das', it: 'il quadrato' },
  { id: 'dreieck', name: 'Dreieck', artikel: 'das', it: 'il triangolo' },
  { id: 'rechteck', name: 'Rechteck', artikel: 'das', it: 'il rettangolo' },
  { id: 'stern', name: 'Stern', artikel: 'den', it: 'la stella' },
  { id: 'herz', name: 'Herz', artikel: 'das', it: 'il cuore' },
  { id: 'oval', name: 'Oval', artikel: 'das', it: 'l’ovale' },
  { id: 'raute', name: 'Raute', artikel: 'die', it: 'il rombo' }
];
const FORM_FARBEN = ['#FF6F59', '#3A9BDC', '#2EC4B6', '#8E6CEF', '#FFB627', '#FF8FC7'];

export function genFormen(level: Difficulty, rng: Rng, n = 4): Task[] {
  const pool = level === 1 ? FORMEN.slice(0, 4) : level === 2 ? FORMEN.slice(0, 6) : FORMEN;
  const count = level === 1 ? 3 : level === 2 ? 4 : 5;
  return times(n, (i): Task => {
    if (i % 2 === 1) {
      const richtig = pick(rng, pool);
      const andere = sample(rng, pool.filter((f) => f.id !== richtig.id), level === 1 ? 2 : 3);
      return {
        id: tid('form', i), type: 'choice',
        prompt: L(`Tippe auf ${richtig.artikel} ${richtig.name}!`, `Tocca ${richtig.it}!`),
        options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, shape: f.id, color: pick(rng, FORM_FARBEN), speak: L(f.name, f.it) })),
        correctId: richtig.id, optionStyle: 'shape',
        hint: hintForm(richtig.id),
        explain: [L(`So sieht ${richtig.artikel === 'die' ? 'eine' : 'ein'} ${richtig.name} aus.`, `Ecco com’è fatto ${richtig.it}.`), hintForm(richtig.id)]
      };
    }
    const formen = sample(rng, pool, count);
    const t: DragMatchTask = {
      id: tid('formdrag', i), type: 'dragmatch',
      prompt: L('Schiebe jede Form in ihren passenden Schatten!', 'Trascina ogni forma nella sua ombra!'),
      pieces: shuffle(rng, formen).map((f) => ({ id: f.id, shape: f.id, color: pick(rng, FORM_FARBEN), label: L(f.name, f.it) })),
      targets: formen.map((f) => ({ id: `ziel-${f.id}`, accepts: f.id, shape: f.id, label: L(f.name, f.it) })),
      hint: L('Vergleiche die Ecken: Hat die Form Ecken oder ist sie rund?', 'Confronta gli angoli: la forma ha angoli o è rotonda?'),
      explain: [L('Jede Form passt nur in den Schatten mit der gleichen Form.', 'Ogni forma entra solo nell’ombra uguale.'), L('Zähle die Ecken: Ein Dreieck hat 3, ein Quadrat hat 4.', 'Conta gli angoli: il triangolo ne ha 3, il quadrato 4.')]
    };
    return t;
  });
}
function hintForm(f: ShapeName): string {
  switch (f) {
    case 'kreis': return L('Ein Kreis ist ganz rund und hat keine Ecken.', 'Il cerchio è tutto rotondo e non ha angoli.');
    case 'quadrat': return L('Ein Quadrat hat 4 gleich lange Seiten und 4 Ecken.', 'Il quadrato ha 4 lati uguali e 4 angoli.');
    case 'dreieck': return L('Ein Dreieck hat 3 Ecken.', 'Il triangolo ha 3 angoli.');
    case 'rechteck': return L('Ein Rechteck hat 4 Ecken, zwei Seiten sind länger.', 'Il rettangolo ha 4 angoli e due lati più lunghi.');
    case 'stern': return L('Ein Stern hat viele Zacken.', 'La stella ha tante punte.');
    case 'herz': return L('Ein Herz hat oben zwei Bögen und unten eine Spitze.', 'Il cuore ha due curve in alto e una punta in basso.');
    case 'oval': return L('Ein Oval ist rund, aber länglich wie ein Ei.', 'L’ovale è rotondo ma allungato, come un uovo.');
    case 'raute': return L('Eine Raute sieht aus wie ein schräges Quadrat auf der Spitze.', 'Il rombo sembra un quadrato in piedi su una punta.');
  }
}

/* ---------- 5. Tiere erkennen (mit Tierlauten) ---------- */
export function genTiere(level: Difficulty, rng: Rng, n = 5): Task[] {
  const optCount = level === 1 ? 3 : 4;
  return times(n, (i): ChoiceTask => {
    const mitLaut = TIERE.filter((t) => t.laut);
    const useSound = level >= 2 && i % 2 === 1;
    const tier = pick(rng, useSound ? mitLaut : TIERE);
    const andere = sample(rng, TIERE.filter((t) => t.name !== tier.name), optCount - 1);
    const it = getLang() === 'it';
    const options = shuffle(rng, [tier, ...andere]).map((t) => ({ id: t.name, emoji: t.emoji, speak: it ? t.it : t.name }));
    const laut = it ? tier.itLaut : tier.laut;
    const sagt = it ? `${cap(tier.it)} ${tier.itVerb}: ${tier.itLaut}` : `${cap(tier.artikel)} ${tier.name} ${tier.lautVerb}: ${tier.laut}`;
    if (useSound) {
      return {
        id: tid('tier', i), type: 'choice',
        prompt: L(`Hör mal: „${tier.laut}“ Welches Tier macht so?`, `Ascolta: «${tier.itLaut}» Quale animale fa così?`),
        sound: laut,
        options, correctId: tier.name, optionStyle: 'emoji',
        hint: L('Tippe auf den Lautsprecher und hör nochmal genau hin.', 'Tocca l’altoparlante e ascolta di nuovo.'),
        explain: [sagt]
      };
    }
    return {
      id: tid('tier', i), type: 'choice',
      prompt: L(`Wo ist ${tier.artikel} ${tier.name}?`, `Dov’è ${tier.it}?`),
      sound: laut,
      options, correctId: tier.name, optionStyle: 'emoji',
      hint: L(tier.deHint, tier.itHint),
      explain: [L(`Das ist ${tier.artikel} ${tier.name}.`, `Questo è ${tier.it}.`), laut ? sagt : L(`Schau mal, so sieht ${tier.artikel} ${tier.name} aus.`, `Guarda, ecco ${tier.it}.`)]
    };
  });
}
const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/* ---------- 6. Buchstaben und erste Wörter ---------- */
export function genBuchstaben(level: Difficulty, rng: Rng, n = 5): Task[] {
  const it = getLang() === 'it';
  const woerter = bildwoerter().filter((w) => !['Ö', 'Ä', 'Ü'].includes(w.wort[0]!) && !w.wort.startsWith('Sch'));
  const alphabet = it ? 'ABCDEFGILMNOPRSTUVZ' : 'ABDEFGHIKLMNOPRSTUWZ';
  return times(n, (i): ChoiceTask => {
    const wort = pick(rng, woerter);
    const anlaut = wort.wort[0]!;
    if (level === 3 && i % 2 === 1) {
      const andere = sample(rng, woerter.filter((w) => w.wort[0] !== anlaut), 2);
      return {
        id: tid('bst', i), type: 'choice',
        prompt: L(`Welches Wort beginnt mit ${anlaut}?`, `Quale parola comincia con ${anlaut}?`),
        options: shuffle(rng, [wort, ...andere]).map((w) => ({ id: w.wort, emoji: w.emoji, speak: w.wort })),
        correctId: wort.wort, optionStyle: 'emoji',
        hint: L('Sprich jedes Wort langsam aus. Welcher Laut kommt ganz am Anfang?', 'Pronuncia ogni parola piano. Quale suono senti all’inizio?'),
        explain: [L(`${wort.wort} beginnt mit ${anlaut}.`, `${wort.wort} comincia con ${anlaut}.`)]
      };
    }
    const buchstaben = alphabet.split('').filter((b) => b !== anlaut);
    const andere = sample(rng, buchstaben, level === 1 ? 2 : 3);
    return {
      id: tid('bst', i), type: 'choice',
      prompt: L(`Mit welchem Buchstaben beginnt ${wort.wort}?`, `Con quale lettera comincia ${wort.wort}?`),
      visual: { kind: 'bigEmoji', emoji: wort.emoji, caption: wort.wort },
      options: shuffle(rng, [anlaut, ...andere]).map((b) => ({ id: b, label: level === 1 ? b : `${b} ${b.toLowerCase()}`, speak: b })),
      correctId: anlaut, optionStyle: 'big',
      hint: L(`Sprich langsam: ${wort.wort.split('').join('-')}. Was hörst du zuerst?`, `Pronuncia piano: ${wort.silben.join('-')}. Cosa senti per primo?`),
      explain: [L(`${wort.wort} fängt mit „${anlaut}“ an.`, `${wort.wort} comincia con «${anlaut}».`), L(`${anlaut} wie ${wort.wort}.`, `${anlaut} come ${wort.wort}.`)]
    };
  });
}

/* ---------- 7. Groß und Klein ---------- */
const GROSS_DINGE = ['🏠', '🐘', '🌳', '🎈', '🐻', '🚗', '🍎', '⭐'];
export function genGrossKlein(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): ChoiceTask => {
    if (level === 3 && i % 2 === 0) {
      const b = pick(rng, 'ABDEFGHLMNQRT'.split(''));
      const andere = sample(rng, 'abdefghlmnqrt'.split('').filter((x) => x !== b.toLowerCase()), 2);
      return {
        id: tid('gk', i), type: 'choice',
        prompt: L(`Welcher kleine Buchstabe gehört zum großen ${b}?`, `Quale lettera minuscola va con la ${b} maiuscola?`),
        visual: { kind: 'text', text: b, size: 'xl' },
        options: shuffle(rng, [b.toLowerCase(), ...andere]).map((x) => ({ id: x, label: x, speak: x })),
        correctId: b.toLowerCase(), optionStyle: 'big',
        hint: L('Der große und der kleine Buchstabe klingen gleich.', 'La maiuscola e la minuscola si leggono allo stesso modo.'),
        explain: [L(`Großes ${b} und kleines ${b.toLowerCase()} gehören zusammen.`, `${b} maiuscola e ${b.toLowerCase()} minuscola vanno insieme.`)]
      };
    }
    const emoji = pick(rng, GROSS_DINGE);
    const anzahl = level === 1 ? 2 : 3;
    const scales = shuffle(rng, anzahl === 2 ? [0.55, 1.4] : [0.5, 0.95, 1.45]);
    const wantBig = rng() > 0.5;
    const target = wantBig ? Math.max(...scales) : Math.min(...scales);
    const wort = anzahl === 2 ? (wantBig ? L('große', 'grande') : L('kleine', 'piccola')) : (wantBig ? L('größte', 'più grande') : L('kleinste', 'più piccola'));
    return {
      id: tid('gk', i), type: 'choice',
      prompt: L(`Tippe auf das ${wort} Bild!`, `Tocca l’immagine ${wort}!`),
      options: scales.map((s, k) => ({ id: `o${k}`, emoji, scale: s })),
      correctId: `o${scales.indexOf(target)}`, optionStyle: 'emoji',
      hint: wantBig ? L('Welches Bild braucht am meisten Platz?', 'Quale immagine occupa più spazio?') : L('Welches Bild ist am winzigsten?', 'Quale immagine è la più piccina?'),
      explain: [wantBig ? L('Das größte Bild ist das mit dem meisten Platz.', 'L’immagine più grande è quella che occupa più spazio.') : L('Das kleinste Bild ist das winzigste.', 'L’immagine più piccola è la più minuscola.')]
    };
  });
}

/* ---------- 8. Memory ---------- */
const MEMORY_SETS = [
  ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐵'],
  ['🍎', '🍌', '🍓', '🍇', '🍐', '🍒', '🥕', '🍉'],
  ['🚗', '🚂', '✈️', '🚲', '🚀', '⛵', '🚌', '🚁']
];
export function genMemory(level: Difficulty, rng: Rng, n = 2): Task[] {
  const pairs = level === 1 ? 3 : level === 2 ? 4 : 6;
  return times(n, (i): MemoryTask => {
    const set = pick(rng, MEMORY_SETS);
    const items = sample(rng, set, pairs);
    return {
      id: tid('mem', i), type: 'memory',
      prompt: L('Finde alle Paare! Tippe zwei Karten an.', 'Trova tutte le coppie! Tocca due carte.'),
      pairs: items.map((e, k) => ({ id: `p${k}`, a: e, b: e })),
      hint: L('Merke dir, wo welche Karte liegt.', 'Ricorda dove si trova ogni carta.'),
      explain: [L('Zwei gleiche Bilder sind ein Paar.', 'Due immagini uguali formano una coppia.')]
    };
  });
}

/* ---------- 9. Logische Reihenfolgen ---------- */
const MUSTER_POOL = ['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '❤️', '🌙'];
export function genReihen(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (level === 3 && i % 3 === 2) {
      const start = randInt(rng, 1, 5);
      const nums = [start, start + 1, start + 2, start + 3, start + 4];
      return {
        id: tid('reihe', i), type: 'order',
        prompt: L('Bringe die Zahlen in die richtige Reihenfolge – von klein nach groß!', 'Metti i numeri in ordine, dal più piccolo al più grande!'),
        items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })),
        correctOrder: nums.map(String),
        hint: L('Welche Zahl ist die kleinste? Mit der fängst du an.', 'Qual è il numero più piccolo? Comincia da quello.'),
        explain: [L('Die richtige Reihenfolge ist: ', 'L’ordine giusto è: ') + `${nums.join(', ')}.`]
      };
    }
    const [a, b, c] = sample(rng, MUSTER_POOL, 3) as [string, string, string];
    const patterns: string[][] = level === 1 ? [[a, b]] : level === 2 ? [[a, b, c], [a, a, b]] : [[a, b, b], [a, b, c], [a, a, b, c]];
    const unit = pick(rng, patterns);
    const len = unit.length * 2 + randInt(rng, 0, unit.length - 1);
    const seq = times(len + 1, (k) => unit[k % unit.length]!);
    const answer = seq[len]!;
    const opts = shuffle(rng, [...new Set([answer, a, b, c])]).slice(0, level === 1 ? 2 : 3);
    if (!opts.includes(answer)) opts[0] = answer;
    return {
      id: tid('reihe', i), type: 'choice',
      prompt: L('Was kommt als Nächstes?', 'Cosa viene dopo?'),
      visual: { kind: 'pattern', items: [...seq.slice(0, len), '❓'] },
      options: shuffle(rng, opts).map((e) => ({ id: e, emoji: e })),
      correctId: answer, optionStyle: 'emoji',
      hint: L('Sprich die Reihe laut: Was wiederholt sich immer wieder?', 'Leggi la fila ad alta voce: cosa si ripete?'),
      explain: [L(`Das Muster ist: ${unit.join(' ')} – und dann wieder von vorn.`, `La sequenza è: ${unit.join(' ')} e poi si ricomincia.`), L(`Darum kommt jetzt ${answer}.`, `Quindi ora viene ${answer}.`)]
    };
  });
}

/* ---------- 10. Schattenbilder zuordnen ---------- */
const SCHATTEN = ['🐘', '🦒', '🐰', '🐢', '🦋', '🐌', '🦁', '🐧', '🐴', '🐈', '🦆', '🦀', '🐙', '🌵', '✈️', '🚲'];
export function genSchatten(level: Difficulty, rng: Rng, n = 4): Task[] {
  return times(n, (i): Task => {
    if (level >= 2 && i % 2 === 1) {
      const items = sample(rng, SCHATTEN, level === 2 ? 3 : 4);
      return {
        id: tid('schatten', i), type: 'dragmatch',
        prompt: L('Schiebe jedes Bild auf seinen Schatten!', 'Trascina ogni immagine sulla sua ombra!'),
        pieces: shuffle(rng, items).map((e) => ({ id: e, emoji: e })),
        targets: items.map((e) => ({ id: `s-${e}`, accepts: e, emoji: e, silhouette: true })),
        hint: L('Schau auf den Umriss: lange Ohren? Ein langer Hals?', 'Guarda il contorno: orecchie lunghe? Collo lungo?'),
        explain: [L('Jeder Schatten hat genau die gleiche Form wie sein Bild.', 'Ogni ombra ha la stessa forma della sua immagine.')]
      };
    }
    const richtig = pick(rng, SCHATTEN);
    const andere = sample(rng, SCHATTEN.filter((s) => s !== richtig), level === 1 ? 2 : 3);
    return {
      id: tid('schatten', i), type: 'choice',
      prompt: L('Welcher Schatten passt zum Bild?', 'Quale ombra corrisponde all’immagine?'),
      visual: { kind: 'bigEmoji', emoji: richtig },
      options: shuffle(rng, [richtig, ...andere]).map((e) => ({ id: e, emoji: e, silhouette: true })),
      correctId: richtig, optionStyle: 'emoji',
      hint: L('Achte auf die Form: Wo ist der Kopf, wo sind Beine oder Flügel?', 'Osserva la forma: dov’è la testa, dove sono zampe o ali?'),
      explain: [L('Der Schatten hat genau den gleichen Umriss wie das Bild.', 'L’ombra ha lo stesso contorno dell’immagine.')]
    };
  });
}

/* ---------- 11. Puzzle ---------- */
const BILDER: PuzzlePicture[] = ['lino', 'haus', 'meer', 'ballon'];
export function genPuzzle(level: Difficulty, rng: Rng, n = 2): Task[] {
  const pics = sample(rng, BILDER, n);
  return pics.map((picture, i): PuzzleTask => ({
    id: tid('puzzle', i), type: 'puzzle',
    prompt: L('Lege die Puzzleteile an die richtige Stelle!', 'Metti i pezzi del puzzle al posto giusto!'),
    picture, grid: level === 3 ? 3 : 2,
    hint: L('Schau auf das kleine Vorschaubild. Wo gehört das Teil hin?', 'Guarda l’immagine piccola. Dove va questo pezzo?'),
    explain: [L('Fang mit den Ecken an – die sind am leichtesten.', 'Comincia dagli angoli: sono i più facili.')]
  }));
}

/* ---------- 12. Vorschule ---------- */
export function genVorschule(level: Difficulty, rng: Rng, n = 5): Task[] {
  const kinds = ['nachbar', 'reim', 'silben', 'mehr', 'reihe'] as const;
  return times(n, (i): Task => {
    const kind = kinds[(i + randInt(rng, 0, 4)) % kinds.length]!;
    const max = level === 1 ? 10 : 20;
    switch (kind) {
      case 'nachbar': {
        const z = randInt(rng, 2, max - 1);
        const vor = level >= 2 && rng() > 0.5;
        const ans = vor ? z - 1 : z + 1;
        return {
          id: tid('vs', i), type: 'choice',
          prompt: vor ? L(`Welche Zahl kommt vor der ${z}?`, `Quale numero viene prima del ${z}?`) : L(`Welche Zahl kommt nach der ${z}?`, `Quale numero viene dopo il ${z}?`),
          visual: { kind: 'text', text: vor ? `? ${z}` : `${z} ?`, size: 'xl' },
          options: numberOptions(rng, ans, 3, 1, max, 2).map((v) => ({ id: String(v), label: String(v) })),
          correctId: String(ans), optionStyle: 'big',
          hint: vor ? L('Zähle rückwärts: Welche Zahl ist eins weniger?', 'Conta all’indietro: quale numero è uno in meno?') : L('Zähle weiter: Welche Zahl ist eins mehr?', 'Continua a contare: quale numero è uno in più?'),
          explain: [vor ? L(`${ans} ist eins weniger als ${z}.`, `${ans} è uno in meno di ${z}.`) : L(`${z} plus eins ist ${ans}.`, `${z} più uno fa ${ans}.`)]
        };
      }
      case 'reim': {
        const [wort, reim] = pick(rng, reime());
        const andere = sample(rng, bildwoerter().filter((w) => w.wort !== reim.wort && w.wort !== wort.wort && w.wort.slice(-3) !== reim.wort.slice(-3)), 2);
        return {
          id: tid('vs', i), type: 'choice',
          prompt: L(`Was reimt sich auf ${wort.wort}?`, `Cosa fa rima con ${wort.wort}?`),
          visual: { kind: 'bigEmoji', emoji: wort.emoji, caption: wort.wort },
          options: shuffle(rng, [reim, ...andere]).map((w) => ({ id: w.wort, emoji: w.emoji, speak: w.wort })),
          correctId: reim.wort, optionStyle: 'emoji',
          hint: L('Wörter reimen sich, wenn sie am Ende gleich klingen.', 'Due parole fanno rima se finiscono con lo stesso suono.'),
          explain: [L(`${wort.wort} – ${reim.wort}: Das klingt am Ende gleich!`, `${wort.wort} – ${reim.wort}: finiscono con lo stesso suono!`)]
        };
      }
      case 'silben': {
        const w = pick(rng, bildwoerter().filter((x) => x.silben.length <= 4));
        return {
          id: tid('vs', i), type: 'choice',
          prompt: L(`Klatsche mit: Wie viele Silben hat ${w.wort}?`, `Batti le mani: quante sillabe ha ${w.wort}?`),
          visual: { kind: 'bigEmoji', emoji: w.emoji, caption: w.wort },
          options: (w.silben.length === 4 ? [2, 3, 4] : [1, 2, 3]).map((v) => ({ id: String(v), label: '👏'.repeat(v), speak: zahlwort(v) })),
          correctId: String(w.silben.length), optionStyle: 'big',
          hint: L('Sprich das Wort langsam und klatsche bei jedem Teil einmal.', 'Pronuncia la parola piano e batti le mani a ogni pezzetto.'),
          explain: [`${w.silben.join(' – ')}: ` + L(`Das sind ${zahlwort(w.silben.length)} ${w.silben.length === 1 ? 'Silbe' : 'Silben'}.`, `${w.silben.length === 1 ? 'una sillaba' : `${zahlwort(w.silben.length)} sillabe`}.`)]
        };
      }
      case 'mehr': {
        const ding = pick(rng, ZAEHLDINGE);
        const a = randInt(rng, 1, level === 1 ? 5 : 9);
        let b = randInt(rng, 1, level === 1 ? 5 : 9);
        if (b === a) b = a + 1;
        return {
          id: tid('vs', i), type: 'choice',
          prompt: L(`Wo sind mehr ${ding.mehrzahl}?`, `Dove ci sono più ${ding.it[1]}?`),
          options: [
            { id: 'links', label: ding.emoji.repeat(a) },
            { id: 'rechts', label: ding.emoji.repeat(b) }
          ],
          correctId: a > b ? 'links' : 'rechts', optionStyle: 'text',
          hint: L('Zähle beide Gruppen und vergleiche.', 'Conta i due gruppi e confrontali.'),
          explain: [L(`Links sind ${a}, rechts sind ${b}.`, `A sinistra ce ne sono ${a}, a destra ${b}.`), L(`${Math.max(a, b)} ist mehr als ${Math.min(a, b)}.`, `${Math.max(a, b)} è più di ${Math.min(a, b)}.`)]
        };
      }
      case 'reihe': {
        const start = randInt(rng, 1, max - 4);
        const nums = [start, start + 1, start + 2, start + 3];
        return {
          id: tid('vs', i), type: 'order',
          prompt: L('Tippe die Zahlen der Reihe nach an – von klein nach groß!', 'Tocca i numeri in ordine, dal più piccolo al più grande!'),
          items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })),
          correctOrder: nums.map(String),
          hint: L('Suche zuerst die kleinste Zahl.', 'Cerca prima il numero più piccolo.'),
          explain: [L('So geht die Reihe: ', 'La fila è: ') + `${nums.join(', ')}.`]
        };
      }
    }
  });
}

export const KITA_MODULES: LearningModule[] = [
  { id: 'kita-zaehlen', title: tx('Gegenstände zählen', 'Contare gli oggetti'), subtitle: tx('Wie viele siehst du?', 'Quanti ne vedi?'), emoji: '🍎', color: 'koralle', area: 'kita', topic: tx('Zählen', 'Contare'), roundSize: 5, generate: (l, r) => genZaehlen(l, r) },
  { id: 'kita-zahlen', title: tx('Zahlen 1 bis 20', 'Numeri da 1 a 20'), subtitle: tx('Zahlen kennenlernen', 'Conoscere i numeri'), emoji: '🔢', color: 'himmel', area: 'kita', topic: tx('Zahlen', 'Numeri'), roundSize: 5, generate: (l, r) => genZahlen(l, r) },
  { id: 'kita-farben', title: tx('Farben', 'Colori'), subtitle: tx('Rot, Blau, Gelb …', 'Rosso, blu, giallo …'), emoji: '🎨', color: 'sonne', area: 'kita', topic: tx('Farben', 'Colori'), roundSize: 5, generate: (l, r) => genFarben(l, r) },
  { id: 'kita-formen', title: tx('Formen', 'Forme'), subtitle: tx('Erkennen und zuordnen', 'Riconoscere e abbinare'), emoji: '🔺', color: 'lila', area: 'kita', topic: tx('Formen', 'Forme'), roundSize: 4, generate: (l, r) => genFormen(l, r) },
  { id: 'kita-tiere', title: tx('Tiere', 'Animali'), subtitle: tx('Mit Tiergeräuschen', 'Con i versi degli animali'), emoji: '🐮', color: 'minze', area: 'kita', topic: tx('Tiere', 'Animali'), roundSize: 5, generate: (l, r) => genTiere(l, r) },
  { id: 'kita-buchstaben', title: tx('Buchstaben', 'Lettere'), subtitle: tx('Anlaute und erste Wörter', 'Suoni iniziali e prime parole'), emoji: '🔤', color: 'himmel', area: 'kita', topic: tx('Buchstaben', 'Lettere'), roundSize: 5, generate: (l, r) => genBuchstaben(l, r) },
  { id: 'kita-grossklein', title: tx('Groß und Klein', 'Grande e piccolo'), subtitle: tx('Vergleichen', 'Confrontare'), emoji: '🐘', color: 'sonne', area: 'kita', topic: tx('Vergleichen', 'Confrontare'), roundSize: 5, generate: (l, r) => genGrossKlein(l, r) },
  { id: 'kita-memory', title: tx('Memory', 'Memory'), subtitle: tx('Paare finden', 'Trova le coppie'), emoji: '🃏', color: 'koralle', area: 'kita', topic: tx('Gedächtnis', 'Memoria'), roundSize: 2, generate: (l, r) => genMemory(l, r) },
  { id: 'kita-reihen', title: tx('Reihenfolgen', 'Sequenze'), subtitle: tx('Was kommt als Nächstes?', 'Cosa viene dopo?'), emoji: '🔴', color: 'minze', area: 'kita', topic: tx('Logik', 'Logica'), roundSize: 5, generate: (l, r) => genReihen(l, r) },
  { id: 'kita-schatten', title: tx('Schattenbilder', 'Ombre'), subtitle: tx('Welcher Schatten passt?', 'Quale ombra è giusta?'), emoji: '🌓', color: 'lila', area: 'kita', topic: tx('Wahrnehmung', 'Percezione'), roundSize: 4, generate: (l, r) => genSchatten(l, r) },
  { id: 'kita-puzzle', title: tx('Puzzle', 'Puzzle'), subtitle: tx('Teile verschieben', 'Sposta i pezzi'), emoji: '🧩', color: 'himmel', area: 'kita', topic: tx('Puzzle', 'Puzzle'), roundSize: 2, generate: (l, r) => genPuzzle(l, r) },
  { id: 'kita-vorschule', title: tx('Vorschule', 'Pronti per la scuola'), subtitle: tx('Fit für die 1. Klasse', 'Pronti per la prima'), emoji: '🎒', color: 'sonne', area: 'kita', topic: tx('Vorschule', 'Prescuola'), roundSize: 5, generate: (l, r) => genVorschule(l, r) }
];
