import type { ChoiceTask, Difficulty, DragMatchTask, LearningModule, MemoryTask, PuzzlePicture, PuzzleTask, Rng, ShapeName, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';
import { BILDWOERTER, FARBEN, FARB_DINGE, REIME, TIERE, ZAEHLDINGE, zahlwort } from '../../content/words';

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
        prompt: 'Wie viele Punkte siehst du?',
        visual: { kind: 'dots', count: zahl },
        options: opts, correctId: String(zahl), optionStyle: 'big',
        hint: 'Tippe jeden Punkt mit dem Finger an und zähle laut mit.',
        explain: [`Wir zählen zusammen: ${times(zahl, (k) => k + 1).join(', ')}.`, `Es sind ${zahlwort(zahl)} Punkte. Das ist die ${zahl}.`]
      };
    }
    return {
      id: tid('zahl', i), type: 'choice',
      prompt: `Finde die Zahl ${zahlwort(zahl)}!`,
      speak: `Finde die Zahl ${zahlwort(zahl)}!`,
      options: opts, correctId: String(zahl), optionStyle: 'big',
      hint: `Hör genau hin: ${zahlwort(zahl)}. Tippe auf den Lautsprecher, dann hörst du es nochmal.`,
      explain: [`So sieht die Zahl ${zahlwort(zahl)} aus: ${zahl}.`]
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
      prompt: `Wie viele ${ding.mehrzahl} siehst du?`,
      visual: { kind: 'emojis', items: times(anzahl, () => ding.emoji) },
      options: opts.map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(anzahl), optionStyle: 'big',
      hint: 'Zeige auf jedes Bild und zähle laut: eins, zwei, drei …',
      explain: [`Wir zählen gemeinsam: ${times(anzahl, (k) => zahlwort(k + 1)).join(', ')}.`, `Es sind ${anzahl} ${anzahl === 1 ? ding.einzahl : ding.mehrzahl}.`]
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
        prompt: `Welche Farbe hat ${ding.artikel} ${ding.name}?`,
        visual: { kind: 'bigEmoji', emoji: ding.emoji, caption: ding.name },
        options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, color: f.hex, speak: f.name, label: f.name })),
        correctId: richtig.id, optionStyle: 'color',
        hint: `Schau dir ${ding.artikel === 'der' ? 'den' : ding.artikel} ${ding.name} genau an. Welche Farbe siehst du am meisten?`,
        explain: [`${ding.artikel[0]!.toUpperCase() + ding.artikel.slice(1)} ${ding.name} ist ${richtig.name.toLowerCase()}.`]
      };
    }
    const richtig = pick(rng, pool);
    const andere = sample(rng, pool.filter((f) => f.id !== richtig.id), optCount - 1);
    return {
      id: tid('farbe', i), type: 'choice',
      prompt: `Tippe auf die Farbe ${richtig.name}!`,
      options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, color: f.hex, speak: f.name, label: f.name })),
      correctId: richtig.id, optionStyle: 'color',
      hint: `${richtig.name} … Denk an etwas, das ${richtig.name.toLowerCase()} ist.`,
      explain: [`Das hier ist ${richtig.name}.`]
    };
  });
}

/* ---------- 4. Formen erkennen und zuordnen ---------- */
export const FORMEN: { id: ShapeName; name: string; artikel: string }[] = [
  { id: 'kreis', name: 'Kreis', artikel: 'den' },
  { id: 'quadrat', name: 'Quadrat', artikel: 'das' },
  { id: 'dreieck', name: 'Dreieck', artikel: 'das' },
  { id: 'rechteck', name: 'Rechteck', artikel: 'das' },
  { id: 'stern', name: 'Stern', artikel: 'den' },
  { id: 'herz', name: 'Herz', artikel: 'das' },
  { id: 'oval', name: 'Oval', artikel: 'das' },
  { id: 'raute', name: 'Raute', artikel: 'die' }
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
        prompt: `Tippe auf ${richtig.artikel} ${richtig.name}!`,
        options: shuffle(rng, [richtig, ...andere]).map((f) => ({ id: f.id, shape: f.id, color: pick(rng, FORM_FARBEN), speak: f.name })),
        correctId: richtig.id, optionStyle: 'shape',
        hint: hintForm(richtig.id),
        explain: [`So sieht ${richtig.artikel === 'den' ? 'ein' : richtig.artikel === 'die' ? 'eine' : 'ein'} ${richtig.name} aus.`, hintForm(richtig.id)]
      };
    }
    const formen = sample(rng, pool, count);
    const t: DragMatchTask = {
      id: tid('formdrag', i), type: 'dragmatch',
      prompt: 'Schiebe jede Form in ihren passenden Schatten!',
      pieces: shuffle(rng, formen).map((f) => ({ id: f.id, shape: f.id, color: pick(rng, FORM_FARBEN), label: f.name })),
      targets: formen.map((f) => ({ id: `ziel-${f.id}`, accepts: f.id, shape: f.id, label: f.name })),
      hint: 'Vergleiche die Ecken: Hat die Form Ecken oder ist sie rund?',
      explain: ['Jede Form passt nur in den Schatten mit der gleichen Form.', 'Zähle die Ecken: Ein Dreieck hat 3, ein Quadrat hat 4.']
    };
    return t;
  });
}
function hintForm(f: ShapeName): string {
  switch (f) {
    case 'kreis': return 'Ein Kreis ist ganz rund und hat keine Ecken.';
    case 'quadrat': return 'Ein Quadrat hat 4 gleich lange Seiten und 4 Ecken.';
    case 'dreieck': return 'Ein Dreieck hat 3 Ecken.';
    case 'rechteck': return 'Ein Rechteck hat 4 Ecken, zwei Seiten sind länger.';
    case 'stern': return 'Ein Stern hat viele Zacken.';
    case 'herz': return 'Ein Herz hat oben zwei Bögen und unten eine Spitze.';
    case 'oval': return 'Ein Oval ist rund, aber länglich wie ein Ei.';
    case 'raute': return 'Eine Raute sieht aus wie ein schräges Quadrat auf der Spitze.';
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
    const options = shuffle(rng, [tier, ...andere]).map((t) => ({ id: t.name, emoji: t.emoji, speak: t.name }));
    if (useSound) {
      return {
        id: tid('tier', i), type: 'choice',
        prompt: `Hör mal: „${tier.laut}“ Welches Tier macht so?`,
        sound: tier.laut,
        options, correctId: tier.name, optionStyle: 'emoji',
        hint: 'Tippe auf den Lautsprecher und hör nochmal genau hin.',
        explain: [`${cap(tier.artikel)} ${tier.name} ${tier.lautVerb}: ${tier.laut}`]
      };
    }
    const akk = tier.artikel === 'der' ? 'den' : tier.artikel;
    return {
      id: tid('tier', i), type: 'choice',
      prompt: `Wo ist ${tier.artikel} ${tier.name}?`,
      sound: tier.laut,
      options, correctId: tier.name, optionStyle: 'emoji',
      hint: hintTier(tier.name),
      explain: [`Das ist ${akk === 'den' ? 'der' : akk} ${tier.name}.`, tier.laut ? `${cap(tier.artikel)} ${tier.name} ${tier.lautVerb}: ${tier.laut}` : `Schau mal, so sieht ${tier.artikel} ${tier.name} aus.`]
    };
  });
}
function hintTier(name: string): string {
  const h: Record<string, string> = {
    Kuh: 'Die Kuh gibt Milch und hat Flecken.', Hund: 'Der Hund bellt und wedelt mit dem Schwanz.', Katze: 'Die Katze hat Schnurrhaare.',
    Schwein: 'Das Schwein ist rosa und hat eine runde Nase.', Schaf: 'Das Schaf hat weiche Wolle.', Huhn: 'Das Huhn legt Eier.',
    Ente: 'Die Ente schwimmt gern auf dem Teich.', Pferd: 'Auf dem Pferd kann man reiten.', Frosch: 'Der Frosch ist grün und springt.',
    Löwe: 'Der Löwe hat eine große Mähne – wie ein König!', Elefant: 'Der Elefant hat einen langen Rüssel.', Eule: 'Die Eule ist nachts wach.',
    Hase: 'Der Hase hat lange Ohren.', Schildkröte: 'Die Schildkröte trägt ihr Haus auf dem Rücken.', Giraffe: 'Die Giraffe hat einen sehr langen Hals.',
    Pinguin: 'Der Pinguin lebt im Eis und kann nicht fliegen.', Schmetterling: 'Der Schmetterling hat bunte Flügel.', Schnecke: 'Die Schnecke ist ganz langsam.'
  };
  return h[name] ?? 'Schau dir alle Tiere genau an.';
}
const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/* ---------- 6. Buchstaben und erste Wörter ---------- */
export function genBuchstaben(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): ChoiceTask => {
    const wort = pick(rng, BILDWOERTER.filter((w) => !['Ö', 'Ä', 'Ü'].includes(w.wort[0]!) && !w.wort.startsWith('Sch')));
    const anlaut = wort.wort[0]!;
    if (level === 3 && i % 2 === 1) {
      const andere = sample(rng, BILDWOERTER.filter((w) => w.wort[0] !== anlaut), 2);
      return {
        id: tid('bst', i), type: 'choice',
        prompt: `Welches Wort beginnt mit ${anlaut}?`,
        speak: `Welches Wort beginnt mit ${anlaut}?`,
        options: shuffle(rng, [wort, ...andere]).map((w) => ({ id: w.wort, emoji: w.emoji, speak: w.wort })),
        correctId: wort.wort, optionStyle: 'emoji',
        hint: 'Sprich jedes Wort langsam aus. Welcher Laut kommt ganz am Anfang?',
        explain: [`${wort.wort} beginnt mit ${anlaut}.`]
      };
    }
    const buchstaben = 'ABDEFGHIKLMNOPRSTUWZ'.split('').filter((b) => b !== anlaut);
    const andere = sample(rng, buchstaben, level === 1 ? 2 : 3);
    return {
      id: tid('bst', i), type: 'choice',
      prompt: `Mit welchem Buchstaben beginnt ${wort.wort}?`,
      visual: { kind: 'bigEmoji', emoji: wort.emoji, caption: wort.wort },
      options: shuffle(rng, [anlaut, ...andere]).map((b) => ({ id: b, label: level === 1 ? b : `${b} ${b.toLowerCase()}`, speak: b })),
      correctId: anlaut, optionStyle: 'big',
      hint: `Sprich langsam: ${wort.wort.split('').join('-')}. Was hörst du zuerst?`,
      explain: [`${wort.wort} fängt mit „${anlaut}“ an.`, `${anlaut} wie ${wort.wort}.`]
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
        prompt: `Welcher kleine Buchstabe gehört zum großen ${b}?`,
        visual: { kind: 'text', text: b, size: 'xl' },
        options: shuffle(rng, [b.toLowerCase(), ...andere]).map((x) => ({ id: x, label: x, speak: x })),
        correctId: b.toLowerCase(), optionStyle: 'big',
        hint: 'Der große und der kleine Buchstabe klingen gleich.',
        explain: [`Großes ${b} und kleines ${b.toLowerCase()} gehören zusammen.`]
      };
    }
    const emoji = pick(rng, GROSS_DINGE);
    const anzahl = level === 1 ? 2 : 3;
    const scales = shuffle(rng, anzahl === 2 ? [0.55, 1.4] : [0.5, 0.95, 1.45]);
    const wantBig = rng() > 0.5;
    const target = wantBig ? Math.max(...scales) : Math.min(...scales);
    const wort = anzahl === 2 ? (wantBig ? 'große' : 'kleine') : (wantBig ? 'größte' : 'kleinste');
    return {
      id: tid('gk', i), type: 'choice',
      prompt: `Tippe auf das ${wort} Bild!`,
      options: scales.map((s, k) => ({ id: `o${k}`, emoji, scale: s })),
      correctId: `o${scales.indexOf(target)}`, optionStyle: 'emoji',
      hint: wantBig ? 'Welches Bild braucht am meisten Platz?' : 'Welches Bild ist am winzigsten?',
      explain: [wantBig ? 'Das größte Bild ist das mit dem meisten Platz.' : 'Das kleinste Bild ist das winzigste.']
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
      prompt: 'Finde alle Paare! Tippe zwei Karten an.',
      pairs: items.map((e, k) => ({ id: `p${k}`, a: e, b: e })),
      hint: 'Merke dir, wo welche Karte liegt.',
      explain: ['Zwei gleiche Bilder sind ein Paar.']
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
        prompt: 'Bringe die Zahlen in die richtige Reihenfolge – von klein nach groß!',
        items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })),
        correctOrder: nums.map(String),
        hint: 'Welche Zahl ist die kleinste? Mit der fängst du an.',
        explain: [`Die richtige Reihenfolge ist: ${nums.join(', ')}.`]
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
      prompt: 'Was kommt als Nächstes?',
      visual: { kind: 'pattern', items: [...seq.slice(0, len), '❓'] },
      options: shuffle(rng, opts).map((e) => ({ id: e, emoji: e })),
      correctId: answer, optionStyle: 'emoji',
      hint: 'Sprich die Reihe laut: Was wiederholt sich immer wieder?',
      explain: [`Das Muster ist: ${unit.join(' ')} – und dann wieder von vorn.`, `Darum kommt jetzt ${answer}.`]
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
        prompt: 'Schiebe jedes Bild auf seinen Schatten!',
        pieces: shuffle(rng, items).map((e) => ({ id: e, emoji: e })),
        targets: items.map((e) => ({ id: `s-${e}`, accepts: e, emoji: e, silhouette: true })),
        hint: 'Schau auf den Umriss: lange Ohren? Ein langer Hals?',
        explain: ['Jeder Schatten hat genau die gleiche Form wie sein Bild.']
      };
    }
    const richtig = pick(rng, SCHATTEN);
    const andere = sample(rng, SCHATTEN.filter((s) => s !== richtig), level === 1 ? 2 : 3);
    return {
      id: tid('schatten', i), type: 'choice',
      prompt: 'Welcher Schatten passt zum Bild?',
      visual: { kind: 'bigEmoji', emoji: richtig },
      options: shuffle(rng, [richtig, ...andere]).map((e) => ({ id: e, emoji: e, silhouette: true })),
      correctId: richtig, optionStyle: 'emoji',
      hint: 'Achte auf die Form: Wo ist der Kopf, wo sind Beine oder Flügel?',
      explain: ['Der Schatten hat genau den gleichen Umriss wie das Bild.']
    };
  });
}

/* ---------- 11. Puzzle ---------- */
const BILDER: PuzzlePicture[] = ['lino', 'haus', 'meer', 'ballon'];
export function genPuzzle(level: Difficulty, rng: Rng, n = 2): Task[] {
  const pics = sample(rng, BILDER, n);
  return pics.map((picture, i): PuzzleTask => ({
    id: tid('puzzle', i), type: 'puzzle',
    prompt: 'Lege die Puzzleteile an die richtige Stelle!',
    picture, grid: level === 3 ? 3 : 2,
    hint: 'Schau auf das kleine Vorschaubild. Wo gehört das Teil hin?',
    explain: ['Fang mit den Ecken an – die sind am leichtesten.']
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
          prompt: vor ? `Welche Zahl kommt vor der ${z}?` : `Welche Zahl kommt nach der ${z}?`,
          visual: { kind: 'text', text: vor ? `? ${z}` : `${z} ?`, size: 'xl' },
          options: numberOptions(rng, ans, 3, 1, max, 2).map((v) => ({ id: String(v), label: String(v) })),
          correctId: String(ans), optionStyle: 'big',
          hint: vor ? 'Zähle rückwärts: Welche Zahl ist eins weniger?' : 'Zähle weiter: Welche Zahl ist eins mehr?',
          explain: [vor ? `${ans} ist eins weniger als ${z}.` : `${z} plus eins ist ${ans}.`]
        };
      }
      case 'reim': {
        const [wort, reim] = pick(rng, REIME);
        const andere = sample(rng, BILDWOERTER.filter((w) => w.wort !== reim.wort && w.wort !== wort.wort), 2);
        return {
          id: tid('vs', i), type: 'choice',
          prompt: `Was reimt sich auf ${wort.wort}?`,
          visual: { kind: 'bigEmoji', emoji: wort.emoji, caption: wort.wort },
          options: shuffle(rng, [reim, ...andere]).map((w) => ({ id: w.wort, emoji: w.emoji, speak: w.wort })),
          correctId: reim.wort, optionStyle: 'emoji',
          hint: 'Wörter reimen sich, wenn sie am Ende gleich klingen.',
          explain: [`${wort.wort} – ${reim.wort}: Das klingt am Ende gleich!`]
        };
      }
      case 'silben': {
        const w = pick(rng, BILDWOERTER);
        return {
          id: tid('vs', i), type: 'choice',
          prompt: `Klatsche mit: Wie viele Silben hat ${w.wort}?`,
          visual: { kind: 'bigEmoji', emoji: w.emoji, caption: w.wort },
          options: [1, 2, 3].map((v) => ({ id: String(v), label: '👏'.repeat(v), speak: zahlwort(v) })),
          correctId: String(w.silben.length), optionStyle: 'big',
          hint: 'Sprich das Wort langsam und klatsche bei jedem Teil einmal.',
          explain: [`${w.silben.join(' – ')}: Das sind ${zahlwort(w.silben.length)} ${w.silben.length === 1 ? 'Silbe' : 'Silben'}.`]
        };
      }
      case 'mehr': {
        const ding = pick(rng, ZAEHLDINGE);
        const a = randInt(rng, 1, level === 1 ? 5 : 9);
        let b = randInt(rng, 1, level === 1 ? 5 : 9);
        if (b === a) b = a + 1;
        return {
          id: tid('vs', i), type: 'choice',
          prompt: `Wo sind mehr ${ding.mehrzahl}?`,
          options: [
            { id: 'links', label: ding.emoji.repeat(a) },
            { id: 'rechts', label: ding.emoji.repeat(b) }
          ],
          correctId: a > b ? 'links' : 'rechts', optionStyle: 'text',
          hint: 'Zähle beide Gruppen und vergleiche.',
          explain: [`Links sind ${a}, rechts sind ${b}.`, `${Math.max(a, b)} ist mehr als ${Math.min(a, b)}.`]
        };
      }
      case 'reihe': {
        const start = randInt(rng, 1, max - 4);
        const nums = [start, start + 1, start + 2, start + 3];
        return {
          id: tid('vs', i), type: 'order',
          prompt: 'Tippe die Zahlen der Reihe nach an – von klein nach groß!',
          items: shuffle(rng, nums).map((x) => ({ id: String(x), label: String(x) })),
          correctOrder: nums.map(String),
          hint: 'Suche zuerst die kleinste Zahl.',
          explain: [`So geht die Reihe: ${nums.join(', ')}.`]
        };
      }
    }
  });
}

export const KITA_MODULES: LearningModule[] = [
  { id: 'kita-zaehlen', title: 'Gegenstände zählen', subtitle: 'Wie viele siehst du?', emoji: '🍎', color: 'koralle', area: 'kita', topic: 'Zählen', roundSize: 5, generate: (l, r) => genZaehlen(l, r) },
  { id: 'kita-zahlen', title: 'Zahlen 1 bis 20', subtitle: 'Zahlen kennenlernen', emoji: '🔢', color: 'himmel', area: 'kita', topic: 'Zahlen', roundSize: 5, generate: (l, r) => genZahlen(l, r) },
  { id: 'kita-farben', title: 'Farben', subtitle: 'Rot, Blau, Gelb …', emoji: '🎨', color: 'sonne', area: 'kita', topic: 'Farben', roundSize: 5, generate: (l, r) => genFarben(l, r) },
  { id: 'kita-formen', title: 'Formen', subtitle: 'Erkennen und zuordnen', emoji: '🔺', color: 'lila', area: 'kita', topic: 'Formen', roundSize: 4, generate: (l, r) => genFormen(l, r) },
  { id: 'kita-tiere', title: 'Tiere', subtitle: 'Mit Tiergeräuschen', emoji: '🐮', color: 'minze', area: 'kita', topic: 'Tiere', roundSize: 5, generate: (l, r) => genTiere(l, r) },
  { id: 'kita-buchstaben', title: 'Buchstaben', subtitle: 'Anlaute und erste Wörter', emoji: '🔤', color: 'himmel', area: 'kita', topic: 'Buchstaben', roundSize: 5, generate: (l, r) => genBuchstaben(l, r) },
  { id: 'kita-grossklein', title: 'Groß und Klein', subtitle: 'Vergleichen', emoji: '🐘', color: 'sonne', area: 'kita', topic: 'Vergleichen', roundSize: 5, generate: (l, r) => genGrossKlein(l, r) },
  { id: 'kita-memory', title: 'Memory', subtitle: 'Paare finden', emoji: '🃏', color: 'koralle', area: 'kita', topic: 'Gedächtnis', roundSize: 2, generate: (l, r) => genMemory(l, r) },
  { id: 'kita-reihen', title: 'Reihenfolgen', subtitle: 'Was kommt als Nächstes?', emoji: '🔴', color: 'minze', area: 'kita', topic: 'Logik', roundSize: 5, generate: (l, r) => genReihen(l, r) },
  { id: 'kita-schatten', title: 'Schattenbilder', subtitle: 'Welcher Schatten passt?', emoji: '🌓', color: 'lila', area: 'kita', topic: 'Wahrnehmung', roundSize: 4, generate: (l, r) => genSchatten(l, r) },
  { id: 'kita-puzzle', title: 'Puzzle', subtitle: 'Teile verschieben', emoji: '🧩', color: 'himmel', area: 'kita', topic: 'Puzzle', roundSize: 2, generate: (l, r) => genPuzzle(l, r) },
  { id: 'kita-vorschule', title: 'Vorschule', subtitle: 'Fit für die 1. Klasse', emoji: '🎒', color: 'sonne', area: 'kita', topic: 'Vorschule', roundSize: 5, generate: (l, r) => genVorschule(l, r) }
];
