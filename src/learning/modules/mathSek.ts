import type { ChoiceTask, Difficulty, InputTask, LearningModule, Rng, Task, Visual } from '../types';
import { pick, randInt, shuffle } from '../../lib/random';
import { L, num, tx } from '../../i18n';

/* Mathematik für Sekundarstufe I/II bzw. Medie und Superiori – Aufgaben werden erzeugt, nicht abgeschrieben. */

const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));
const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
const sgn = (n: number) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);
const paren = (n: number) => (n < 0 ? `(−${Math.abs(n)})` : String(n));
const minus = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

function inp(id: string, prompt: string, answer: number, hint: string, explain: string[], visual?: Visual): InputTask {
  return { id, type: 'input', prompt, answer, hint, explain, visual, signed: true };
}
function ch(rng: Rng, id: string, prompt: string, correct: string, wrongs: string[], hint: string, explain: string[], visual?: Visual): ChoiceTask {
  const opts = [...new Set([correct, ...wrongs.filter((w) => w !== correct)])].slice(0, 4);
  return { id, type: 'choice', prompt, visual, options: shuffle(rng, opts).map((o) => ({ id: o, label: o })), correctId: correct, optionStyle: 'text', hint, explain };
}

/* ---------- Dezimalzahlen (5–6) ---------- */
export function genDezimal(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const d = level === 1 ? 1 : 2;
    const f = 10 ** d;
    const a = randInt(rng, 11, level === 3 ? 999 : 99) / f;
    const b = randInt(rng, 11, level === 3 ? 999 : 99) / f;
    if (i % 3 === 0) {
      const big = Math.max(a, b), small = Math.min(a, b);
      if (big === small) return genDezimal(level, rng, 1)[0]!;
      return ch(rng, tid('dez', i), L(`Welche Zahl ist größer: ${num(a)} oder ${num(b)}?`, `Quale numero è più grande: ${num(a)} o ${num(b)}?`), num(big), [num(small)],
        L('Vergleiche Stelle für Stelle: erst die Ganzen, dann Zehntel, dann Hundertstel.', 'Confronta cifra per cifra: prima gli interi, poi i decimi, poi i centesimi.'),
        [L(`${num(big)} > ${num(small)}`, `${num(big)} > ${num(small)}`)]);
    }
    const plus = i % 3 === 1;
    const res = Math.round((plus ? a + b : Math.max(a, b) - Math.min(a, b)) * f) / f;
    const x = plus ? a : Math.max(a, b), y = plus ? b : Math.min(a, b);
    return ch(rng, tid('dez', i), `${num(x)} ${plus ? '+' : '−'} ${num(y)} = ?`, num(res, d),
      [num(res + 1 / f, d), num(res - 1 / f, d), num(Math.round((res + 1) * f) / f, d), num(Math.round(res * 10 * f) / f / 10, d)],
      L('Schreibe die Zahlen so untereinander, dass die Kommas genau untereinander stehen.', 'Scrivi i numeri in colonna con le virgole allineate.'),
      [L('Komma unter Komma, dann rechnen wie gewohnt.', 'Virgola sotto virgola, poi si calcola come sempre.'), `${num(x)} ${plus ? '+' : '−'} ${num(y)} = ${num(res, d)}`]);
  });
}

/* ---------- Brüche rechnen (5–7) ---------- */
export function genBruchrechnen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const kind = i % 3;
    if (kind === 0) {
      const z = randInt(rng, 1, 9), nn = randInt(rng, z + 1, 12), k = randInt(rng, 2, level === 1 ? 3 : 6);
      const g = gcd(z, nn), zr = z / g, nr = nn / g;
      return ch(rng, tid('br', i), L(`Kürze vollständig: ${z * k}/${nn * k}`, `Riduci ai minimi termini: ${z * k}/${nn * k}`), `${zr}/${nr}`,
        [`${z}/${nn * k}`, `${zr + 1}/${nr}`, `${zr}/${nr + 1}`, `${z * k}/${nn}`],
        L('Teile Zähler und Nenner durch die gleiche, möglichst große Zahl.', 'Dividi numeratore e denominatore per lo stesso numero, il più grande possibile.'),
        [L(`Größter gemeinsamer Teiler: ${gcd(z * k, nn * k)}`, `Massimo comune divisore: ${gcd(z * k, nn * k)}`), `${z * k}/${nn * k} = ${zr}/${nr}`]);
    }
    if (kind === 1) {
      const nn = pick(rng, level === 1 ? [4, 5, 6, 8] : [6, 8, 9, 10, 12]);
      const a = randInt(rng, 1, nn - 2), b2 = randInt(rng, 1, nn - a - 1);
      const s = a + b2, g = gcd(s, nn);
      const res = g > 1 ? `${s / g}/${nn / g}` : `${s}/${nn}`;
      return ch(rng, tid('br', i), `${a}/${nn} + ${b2}/${nn} = ?`, res, [`${s}/${nn * 2}`, `${a + b2 + 1}/${nn}`, `${s}/${nn}` === res ? `${s - 1}/${nn}` : `${s}/${nn}`],
        L('Bei gleichen Nennern addierst du nur die Zähler.', 'Con lo stesso denominatore si sommano solo i numeratori.'),
        [`${a}/${nn} + ${b2}/${nn} = ${s}/${nn}`, ...(g > 1 ? [L(`Gekürzt: ${res}`, `Ridotto: ${res}`)] : [])]);
    }
    const nn = pick(rng, [2, 3, 4, 5, 10]), z = randInt(rng, 1, nn - 1), base = nn * randInt(rng, 2, level === 3 ? 30 : 12);
    return inp(tid('br', i), L(`Wie viel sind ${z}/${nn} von ${base}?`, `Quanto sono i ${z}/${nn} di ${base}?`), (base / nn) * z,
      L(`Erst durch ${nn} teilen, dann mal ${z}.`, `Prima dividi per ${nn}, poi moltiplica per ${z}.`),
      [`${base} : ${nn} = ${base / nn}`, `${base / nn} · ${z} = ${(base / nn) * z}`]);
  });
}

/* ---------- Teilbarkeit, ggT, kgV (5–6) ---------- */
export function genTeilbarkeit(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    if (i % 3 === 0) {
      const t = pick(rng, [2, 3, 5, 9, 10]);
      const yes = rng() > 0.5;
      let x = randInt(rng, 20, level === 3 ? 999 : 200);
      if (yes) x = x - (x % t) + (x % t === 0 ? 0 : t);
      else if (x % t === 0) x += 1;
      const rule = t === 2 ? L('letzte Ziffer gerade', 'ultima cifra pari') : t === 5 ? L('letzte Ziffer 0 oder 5', 'ultima cifra 0 o 5') : t === 10 ? L('letzte Ziffer 0', 'ultima cifra 0') : L(`Quersumme durch ${t} teilbar`, `somma delle cifre divisibile per ${t}`);
      return ch(rng, tid('tb', i), L(`Ist ${x} durch ${t} teilbar?`, `${x} è divisibile per ${t}?`), x % t === 0 ? L('Ja', 'Sì') : L('Nein', 'No'), [x % t === 0 ? L('Nein', 'No') : L('Ja', 'Sì')],
        L(`Regel: ${rule}.`, `Regola: ${rule}.`), [L(`Regel für ${t}: ${rule}.`, `Criterio del ${t}: ${rule}.`), `${x} : ${t} = ${num(Math.round((x / t) * 100) / 100)}`]);
    }
    const g = pick(rng, [2, 3, 4, 5, 6, 7, 8, 9, 12]);
    let a = g * randInt(rng, 2, 9), b2 = g * randInt(rng, 2, 9);
    if (a === b2) b2 += g;
    if (i % 3 === 1) {
      const r = gcd(a, b2);
      return inp(tid('tb', i), L(`ggT(${a}, ${b2}) = ?`, `M.C.D.(${a}, ${b2}) = ?`), r,
        L('Suche die größte Zahl, die beide Zahlen ohne Rest teilt.', 'Cerca il numero più grande che divide entrambi senza resto.'),
        [L(`Teiler von ${a} und ${b2} vergleichen: der größte gemeinsame ist ${r}.`, `Confrontando i divisori di ${a} e ${b2}, il più grande in comune è ${r}.`)]);
    }
    a = randInt(rng, 2, 12); b2 = randInt(rng, 2, 12);
    if (a === b2) b2++;
    const r = lcm(a, b2);
    return inp(tid('tb', i), L(`kgV(${a}, ${b2}) = ?`, `m.c.m.(${a}, ${b2}) = ?`), r,
      L(`Schreibe die Vielfachen von ${Math.max(a, b2)} auf und suche das erste, das auch durch ${Math.min(a, b2)} teilbar ist.`, `Scrivi i multipli di ${Math.max(a, b2)} e cerca il primo divisibile anche per ${Math.min(a, b2)}.`),
      [L(`Das kleinste gemeinsame Vielfache ist ${r}.`, `Il minimo comune multiplo è ${r}.`)]);
  });
}

/* ---------- Ganze (negative) Zahlen (6–7) ---------- */
export function genNegativ(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const m = level === 1 ? 10 : level === 2 ? 20 : 50;
    const a = randInt(rng, -m, m), b2 = randInt(rng, -m, m);
    const op = level === 3 && i % 3 === 2 ? '·' : i % 2 === 0 ? '+' : '−';
    const res = op === '+' ? a + b2 : op === '−' ? a - b2 : a * b2;
    return inp(tid('neg', i), `${minus(a)} ${op} ${paren(b2)} = ?`, res,
      op === '·' ? L('Gleiche Vorzeichen ergeben plus, verschiedene ergeben minus.', 'Segni uguali danno più, segni diversi danno meno.') : L('Stell dir eine Zahlengerade oder ein Thermometer vor.', 'Immagina una retta dei numeri o un termometro.'),
      [op === '−' ? L(`Minus eine negative Zahl ist wie plus: ${minus(a)} − ${paren(b2)} = ${minus(a)} ${sgn(-b2)}`, `Sottrarre un numero negativo è come sommare: ${minus(a)} − ${paren(b2)} = ${minus(a)} ${sgn(-b2)}`) : `${minus(a)} ${op} ${paren(b2)}`, `= ${minus(res)}`]);
  });
}

/* ---------- Flächen und Umfang (5–7) ---------- */
export function genFlaechen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const a = randInt(rng, 2, level === 3 ? 25 : 12), h = randInt(rng, 2, level === 3 ? 20 : 10);
    const kind = (i + (level >= 2 ? 0 : 1)) % (level === 1 ? 2 : 4);
    if (kind === 0) return inp(tid('fl', i), L(`Ein Rechteck ist ${a} cm lang und ${h} cm breit. Wie groß ist die Fläche in cm²?`, `Un rettangolo è lungo ${a} cm e largo ${h} cm. Quanto misura l’area in cm²?`), a * h,
      L('Fläche = Länge · Breite', 'Area = base · altezza'), [`A = ${a} · ${h} = ${a * h} cm²`]);
    if (kind === 1) return inp(tid('fl', i), L(`Ein Rechteck ist ${a} cm lang und ${h} cm breit. Wie groß ist der Umfang in cm?`, `Un rettangolo è lungo ${a} cm e largo ${h} cm. Quanto misura il perimetro in cm?`), 2 * (a + h),
      L('Umfang = 2 · (Länge + Breite)', 'Perimetro = 2 · (base + altezza)'), [`U = 2 · (${a} + ${h}) = ${2 * (a + h)} cm`]);
    if (kind === 2) {
      const g = a % 2 === 0 ? a : a + 1;
      return inp(tid('fl', i), L(`Ein Dreieck hat die Grundseite ${g} cm und die Höhe ${h} cm. Fläche in cm²?`, `Un triangolo ha base ${g} cm e altezza ${h} cm. Area in cm²?`), (g * h) / 2,
        L('Dreieck: (Grundseite · Höhe) : 2', 'Triangolo: (base · altezza) : 2'), [`A = ${g} · ${h} : 2 = ${(g * h) / 2} cm²`]);
    }
    return inp(tid('fl', i), L(`Ein Parallelogramm hat die Grundseite ${a} cm und die Höhe ${h} cm. Fläche in cm²?`, `Un parallelogramma ha base ${a} cm e altezza ${h} cm. Area in cm²?`), a * h,
      L('Parallelogramm: Grundseite · Höhe', 'Parallelogramma: base · altezza'), [`A = ${a} · ${h} = ${a * h} cm²`]);
  });
}

/* ---------- Prozentrechnung (7–8) ---------- */
export function genProzent(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const p = pick(rng, level === 1 ? [10, 25, 50, 20] : [5, 10, 15, 20, 25, 30, 40, 75]);
    const G = pick(rng, [20, 40, 60, 80, 100, 120, 200, 240, 300, 400, 500, 800]);
    const W = (p * G) / 100;
    if (i % 3 === 0 || level === 1) return inp(tid('pz', i), L(`Wie viel sind ${p} % von ${G} €?`, `Quanto è il ${p}% di ${G} €?`), W,
      L(`1 % von ${G} ist ${num(G / 100)}. Dann mal ${p}.`, `L’1% di ${G} è ${num(G / 100)}. Poi moltiplica per ${p}.`), [`${G} · ${p} : 100 = ${num(W)} €`]);
    if (i % 3 === 1) return inp(tid('pz', i), L(`${num(W)} € sind ${p} % eines Preises. Wie hoch ist der ganze Preis in €?`, `${num(W)} € sono il ${p}% di un prezzo. Quanto è il prezzo intero in €?`), G,
      L('Grundwert = Prozentwert : Prozentsatz · 100', 'Totale = parte : percentuale · 100'), [`${num(W)} : ${p} · 100 = ${G} €`]);
    return inp(tid('pz', i), L(`Wie viel Prozent sind ${num(W)} von ${G}?`, `Che percentuale è ${num(W)} su ${G}?`), p,
      L('Prozentsatz = Teil : Ganzes · 100', 'Percentuale = parte : totale · 100'), [`${num(W)} : ${G} · 100 = ${p} %`]);
  });
}

/* ---------- Dreisatz / Proportionalität (6–8) ---------- */
export function genDreisatz(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const unit = randInt(rng, 2, 9), a = randInt(rng, 2, 6), b2 = randInt(rng, 3, level === 3 ? 15 : 9);
    if (level >= 2 && i % 2 === 1) {
      const workers = randInt(rng, 2, 6), days = randInt(rng, 3, 12) * 2, w2 = workers * 2;
      return inp(tid('ds', i), L(`${workers} Personen brauchen ${days} Tage für eine Arbeit. Wie viele Tage brauchen ${w2} Personen (gleiches Tempo)?`, `${workers} persone impiegano ${days} giorni per un lavoro. Quanti giorni impiegano ${w2} persone (stesso ritmo)?`), (workers * days) / w2,
        L('Antiproportional: doppelt so viele Personen, halb so viel Zeit.', 'Proporzionalità inversa: il doppio delle persone, metà del tempo.'),
        [L(`${workers} · ${days} = ${workers * days} Personentage`, `${workers} · ${days} = ${workers * days} giorni-persona`), `${workers * days} : ${w2} = ${(workers * days) / w2}`]);
    }
    return inp(tid('ds', i), L(`${a} Hefte kosten ${a * unit} €. Wie viel kosten ${b2} Hefte?`, `${a} quaderni costano ${a * unit} €. Quanto costano ${b2} quaderni?`), b2 * unit,
      L('Rechne zuerst den Preis für ein Heft aus.', 'Calcola prima il prezzo di un quaderno.'),
      [`${a * unit} : ${a} = ${unit} €`, `${unit} · ${b2} = ${b2 * unit} €`]);
  });
}

/* ---------- Lineare Gleichungen (7–9) ---------- */
export function genGleichungen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const x = randInt(rng, level === 3 ? -9 : 1, 12);
    const a = randInt(rng, 2, 9), b2 = randInt(rng, -20, 20);
    if (level >= 2 && i % 2 === 1) {
      const c = randInt(rng, 1, a - 1 || 1), d = a * x + b2 - c * x;
      return inp(tid('gl', i), `${a}x ${sgn(b2)} = ${c}x ${sgn(d)}   →   x = ?`, x,
        L('Bringe alle x auf eine Seite und alle Zahlen auf die andere.', 'Porta tutte le x da una parte e i numeri dall’altra.'),
        [`${a}x − ${c}x = ${minus(d)} ${sgn(-b2)}`, `${a - c}x = ${minus(d - b2)}`, `x = ${minus(x)}`]);
    }
    const c = a * x + b2;
    return inp(tid('gl', i), `${a}x ${sgn(b2)} = ${minus(c)}   →   x = ?`, x,
      L(`Ziehe zuerst ${minus(b2)} ab, dann teile durch ${a}.`, `Prima togli ${minus(b2)}, poi dividi per ${a}.`),
      [`${a}x = ${minus(c)} ${sgn(-b2)} = ${minus(c - b2)}`, `x = ${minus(c - b2)} : ${a} = ${minus(x)}`]);
  });
}

/* ---------- Terme vereinfachen (7–8) ---------- */
export function genTerme(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const a = randInt(rng, 1, 9), b2 = randInt(rng, 1, 9), c = randInt(rng, 1, 9);
    if (level >= 2 && i % 2 === 1) {
      const k = randInt(rng, 2, 6);
      return ch(rng, tid('tm', i), L(`Multipliziere aus: ${k}(${a}x + ${b2})`, `Applica la proprietà distributiva: ${k}(${a}x + ${b2})`), `${k * a}x + ${k * b2}`,
        [`${k * a}x + ${b2}`, `${a}x + ${k * b2}`, `${k + a}x + ${k + b2}`],
        L('Die Zahl vor der Klammer wird mit jedem Summanden multipliziert.', 'Il numero davanti alla parentesi moltiplica ogni termine.'),
        [`${k} · ${a}x = ${k * a}x`, `${k} · ${b2} = ${k * b2}`]);
    }
    return ch(rng, tid('tm', i), L(`Fasse zusammen: ${a}x + ${b2}y + ${c}x`, `Riduci i termini simili: ${a}x + ${b2}y + ${c}x`), `${a + c}x + ${b2}y`,
      [`${a + b2 + c}xy`, `${a + b2}x + ${c}y`, `${a + c}x + ${b2}x`],
      L('Nur gleichartige Terme (gleiche Variable) darfst du addieren.', 'Si possono sommare solo i termini simili (stessa lettera).'),
      [`${a}x + ${c}x = ${a + c}x`, L(`${b2}y bleibt stehen.`, `${b2}y resta così.`)]);
  });
}

/* ---------- Winkel (6–8) ---------- */
export function genWinkel(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    if (i % 3 === 2) {
      const a = randInt(rng, 10, 170);
      const kind = a < 90 ? L('spitz', 'acuto') : a > 90 ? L('stumpf', 'ottuso') : L('recht', 'retto');
      const all = [L('spitz', 'acuto'), L('recht', 'retto'), L('stumpf', 'ottuso'), L('gestreckt', 'piatto')];
      return ch(rng, tid('wk', i), L(`Ein Winkel misst ${a}°. Welche Art von Winkel ist das?`, `Un angolo misura ${a}°. Che tipo di angolo è?`), kind, all,
        L('Spitz < 90°, recht = 90°, stumpf zwischen 90° und 180°.', 'Acuto < 90°, retto = 90°, ottuso tra 90° e 180°.'), [L(`${a}° ist ${kind}.`, `${a}° è ${kind}.`)]);
    }
    const a = randInt(rng, 20, 100), b2 = randInt(rng, 20, 160 - a);
    if (i % 3 === 1 && level >= 2) return inp(tid('wk', i), L(`Zwei Nebenwinkel: Einer ist ${a}°. Wie groß ist der andere?`, `Due angoli adiacenti supplementari: uno misura ${a}°. Quanto misura l’altro?`), 180 - a,
      L('Nebenwinkel ergeben zusammen 180°.', 'Due angoli supplementari sommano 180°.'), [`180° − ${a}° = ${180 - a}°`]);
    return inp(tid('wk', i), L(`In einem Dreieck sind zwei Winkel ${a}° und ${b2}°. Wie groß ist der dritte Winkel?`, `In un triangolo due angoli misurano ${a}° e ${b2}°. Quanto misura il terzo?`), 180 - a - b2,
      L('Die Winkelsumme im Dreieck ist 180°.', 'La somma degli angoli interni di un triangolo è 180°.'), [`180° − ${a}° − ${b2}° = ${180 - a - b2}°`]);
  });
}

/* ---------- Kreis (8–9) ---------- */
export function genKreis(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const r = randInt(rng, 1, level === 3 ? 20 : 10);
    if (i % 2 === 0) {
      const u = Math.round(2 * Math.PI * r * 10) / 10;
      return ch(rng, tid('kr', i), L(`Ein Kreis hat den Radius r = ${r} cm. Wie groß ist der Umfang (gerundet)?`, `Un cerchio ha raggio r = ${r} cm. Quanto misura la circonferenza (arrotondata)?`), `${num(u)} cm`,
        [`${num(Math.round(Math.PI * r * 10) / 10)} cm`, `${num(Math.round(Math.PI * r * r * 10) / 10)} cm`, `${num(Math.round(4 * Math.PI * r * 10) / 10)} cm`],
        L('Umfang: U = 2 · π · r', 'Circonferenza: C = 2 · π · r'), [`U = 2 · π · ${r} ≈ ${num(u)} cm`]);
    }
    const A = Math.round(Math.PI * r * r * 10) / 10;
    return ch(rng, tid('kr', i), L(`Ein Kreis hat den Radius r = ${r} cm. Wie groß ist die Fläche (gerundet)?`, `Un cerchio ha raggio r = ${r} cm. Quanto misura l’area (arrotondata)?`), `${num(A)} cm²`,
      [`${num(Math.round(2 * Math.PI * r * 10) / 10)} cm²`, `${num(Math.round(Math.PI * 2 * r * 2 * r * 10) / 10)} cm²`, `${num(r * r)} cm²`],
      L('Fläche: A = π · r²', 'Area: A = π · r²'), [`A = π · ${r}² = π · ${r * r} ≈ ${num(A)} cm²`]);
  });
}

/* ---------- Potenzen und Wurzeln (8–10) ---------- */
export function genPotenzen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const kind = i % (level === 1 ? 2 : 4);
    if (kind === 0) { const b2 = randInt(rng, 2, level === 1 ? 5 : 10), e = randInt(rng, 2, level === 1 ? 3 : 4); return inp(tid('pw', i), `${b2}^${e} = ?`, b2 ** e, L(`${b2} wird ${e}-mal mit sich selbst multipliziert.`, `${b2} moltiplicato per sé stesso ${e} volte.`), [`${Array(e).fill(b2).join(' · ')} = ${b2 ** e}`]); }
    if (kind === 1) { const r = randInt(rng, 2, level === 1 ? 12 : 25); return inp(tid('pw', i), `√${r * r} = ?`, r, L('Welche Zahl mal sich selbst ergibt die Zahl unter der Wurzel?', 'Quale numero moltiplicato per sé stesso dà il numero sotto radice?'), [`${r} · ${r} = ${r * r}`, `√${r * r} = ${r}`]); }
    if (kind === 2) { const b2 = randInt(rng, 2, 5), m = randInt(rng, 2, 6), k = randInt(rng, 2, 6); return ch(rng, tid('pw', i), `${b2}^${m} · ${b2}^${k} = ?`, `${b2}^${m + k}`, [`${b2}^${m * k}`, `${b2 * 2}^${m + k}`, `${b2}^${Math.abs(m - k) || 1}`], L('Gleiche Basis: Exponenten addieren.', 'Stessa base: si sommano gli esponenti.'), [`${b2}^${m} · ${b2}^${k} = ${b2}^(${m}+${k}) = ${b2}^${m + k}`]); }
    const mant = randInt(rng, 11, 99) / 10, e = randInt(rng, 3, 8);
    const value = Math.round(mant * 10 ** e);
    return ch(rng, tid('pw', i), L(`Wie schreibt man ${num(value)} in wissenschaftlicher Schreibweise?`, `Come si scrive ${num(value)} in notazione scientifica?`), `${num(mant)} · 10^${e}`,
      [`${num(mant)} · 10^${e + 1}`, `${num(mant)} · 10^${e - 1}`, `${num(mant * 10)} · 10^${e}`],
      L('Das Komma wird so verschoben, dass genau eine Ziffer davor steht.', 'Si sposta la virgola in modo che resti una sola cifra prima.'), [L(`Komma um ${e} Stellen verschieben → 10^${e}`, `Virgola spostata di ${e} posti → 10^${e}`)]);
  });
}

/* ---------- Satz des Pythagoras (8–10) ---------- */
const TRIPEL: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29], [9, 40, 41], [15, 20, 25]];
export function genPythagoras(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const [a, b2, c] = pick(rng, level === 1 ? TRIPEL.slice(0, 4) : TRIPEL);
    if (i % 2 === 0 || level === 1) return inp(tid('py', i), L(`Rechtwinkliges Dreieck: Katheten a = ${a} cm, b = ${b2} cm. Wie lang ist die Hypotenuse c?`, `Triangolo rettangolo: cateti a = ${a} cm, b = ${b2} cm. Quanto misura l’ipotenusa c?`), c,
      L('a² + b² = c²', 'a² + b² = c²'), [`${a}² + ${b2}² = ${a * a} + ${b2 * b2} = ${c * c}`, `c = √${c * c} = ${c} cm`]);
    return inp(tid('py', i), L(`Rechtwinkliges Dreieck: Hypotenuse c = ${c} cm, Kathete a = ${a} cm. Wie lang ist b?`, `Triangolo rettangolo: ipotenusa c = ${c} cm, cateto a = ${a} cm. Quanto misura b?`), b2,
      'b² = c² − a²', [`${c}² − ${a}² = ${c * c} − ${a * a} = ${b2 * b2}`, `b = √${b2 * b2} = ${b2} cm`]);
  });
}

/* ---------- Lineare Funktionen (8–10) ---------- */
export function genFunktionen(_level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const m = randInt(rng, -5, 5) || 2, b2 = randInt(rng, -8, 8), x = randInt(rng, -5, 6);
    const f = `f(x) = ${m}x ${sgn(b2)}`;
    if (i % 3 === 0) return inp(tid('fn', i), L(`${f}. Berechne f(${x}).`, `${f}. Calcola f(${x}).`), m * x + b2,
      L('Setze den x-Wert in die Funktion ein.', 'Sostituisci il valore di x nella funzione.'), [`f(${x}) = ${m} · ${paren(x)} ${sgn(b2)} = ${m * x + b2}`]);
    if (i % 3 === 1) {
      const x1 = randInt(rng, -4, 2), x2 = x1 + randInt(rng, 1, 4);
      return inp(tid('fn', i), L(`Eine Gerade geht durch P(${x1} | ${m * x1 + b2}) und Q(${x2} | ${m * x2 + b2}). Wie groß ist die Steigung m?`, `Una retta passa per P(${x1}; ${m * x1 + b2}) e Q(${x2}; ${m * x2 + b2}). Qual è la pendenza m?`), m,
        L('m = (y₂ − y₁) : (x₂ − x₁)', 'm = (y₂ − y₁) : (x₂ − x₁)'), [`m = (${m * x2 + b2} − ${paren(m * x1 + b2)}) : (${x2} − ${paren(x1)}) = ${m * (x2 - x1)} : ${x2 - x1} = ${m}`]);
    }
    return inp(tid('fn', i), L(`${f}. Wo schneidet der Graph die y-Achse? (y-Wert)`, `${f}. In quale punto il grafico interseca l’asse y? (valore di y)`), b2,
      L('Der y-Achsenabschnitt ist f(0).', 'L’intercetta sull’asse y è f(0).'), [`f(0) = ${m} · 0 ${sgn(b2)} = ${b2}`]);
  });
}

/* ---------- Quadratische Gleichungen (9–11) ---------- */
export function genQuadratisch(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    let r1 = randInt(rng, -8, 8), r2 = randInt(rng, -8, 8);
    if (level === 1) { r1 = Math.abs(r1) || 3; r2 = -r1; }
    const p = -(r1 + r2), q = r1 * r2;
    const sol = `x₁ = ${minus(Math.min(r1, r2))}, x₂ = ${minus(Math.max(r1, r2))}`;
    const eq = p === 0 ? `x² ${sgn(q)} = 0` : `x² ${sgn(p)}x ${sgn(q)} = 0`;
    const sol1 = r1 === r2 ? `x = ${minus(r1)}` : sol;
    return ch(rng, tid('qg', i), L(`Löse: ${eq}`, `Risolvi: ${eq}`), sol1,
      [`x₁ = ${minus(-Math.max(r1, r2))}, x₂ = ${minus(-Math.min(r1, r2))}`, `x₁ = ${minus(r1 + 1)}, x₂ = ${minus(r2 - 1)}`, L('keine Lösung', 'nessuna soluzione'), `x₁ = ${minus(q)}, x₂ = ${minus(p)}`],
      L('pq-Formel oder: Suche zwei Zahlen, deren Produkt q und deren Summe −p ist.', 'Formula risolutiva oppure: cerca due numeri con prodotto q e somma −p.'),
      [L(`Produkt der Lösungen = ${q}, Summe = ${-p}`, `Prodotto delle soluzioni = ${q}, somma = ${-p}`), sol1, i === 0 ? L(`Probe: (x ${sgn(-r1)})(x ${sgn(-r2)}) = 0`, `Verifica: (x ${sgn(-r1)})(x ${sgn(-r2)}) = 0`) : '']
        .filter(Boolean));
  });
}

/* ---------- Wahrscheinlichkeit (7–10) ---------- */
export function genWahrscheinlichkeit(_level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (i % 2 === 0) {
      const ev = pick(rng, [
        { de: 'eine 6', it: 'un 6', k: 1 }, { de: 'eine gerade Zahl', it: 'un numero pari', k: 3 }, { de: 'eine Zahl größer als 4', it: 'un numero maggiore di 4', k: 2 }, { de: 'eine Primzahl', it: 'un numero primo', k: 3 }, { de: 'höchstens eine 2', it: 'al massimo un 2', k: 2 }
      ]);
      const g = gcd(ev.k, 6);
      return ch(rng, tid('ws', i), L(`Ein fairer Würfel wird einmal geworfen. Wie wahrscheinlich ist ${ev.de}?`, `Si lancia un dado equo una volta. Qual è la probabilità di ottenere ${ev.it}?`), `${ev.k / g}/${6 / g}`,
        ['1/6', '1/2', '1/3', '2/3', '5/6'].filter((x) => x !== `${ev.k / g}/${6 / g}`).slice(0, 3),
        L('Günstige Ergebnisse : mögliche Ergebnisse', 'Casi favorevoli : casi possibili'), [L(`${ev.k} günstige von 6 möglichen Ergebnissen`, `${ev.k} casi favorevoli su 6 possibili`), `${ev.k}/6 = ${ev.k / g}/${6 / g}`]);
    }
    const r = randInt(rng, 1, 6), bl = randInt(rng, 1, 6), total = r + bl;
    const g = gcd(r, total);
    return ch(rng, tid('ws', i), L(`In einer Urne sind ${r} rote und ${bl} blaue Kugeln. Wie wahrscheinlich ist es, eine rote zu ziehen?`, `In un’urna ci sono ${r} palline rosse e ${bl} blu. Qual è la probabilità di estrarne una rossa?`), `${r / g}/${total / g}`,
      [`${bl}/${total}`, `${r}/${bl}`, `1/${total}`], L('Rote Kugeln : alle Kugeln', 'Palline rosse : tutte le palline'), [`${r}/${total}${g > 1 ? ` = ${r / g}/${total / g}` : ''}`]);
  });
}

/* ---------- Statistik (6–9) ---------- */
export function genStatistik(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const k = level === 1 ? 4 : 5;
    let data = times(k, () => randInt(rng, 1, 20));
    const sum = data.reduce((a, b2) => a + b2, 0);
    const fix = (k - (sum % k)) % k;
    data[0] = data[0]! + fix;
    data = shuffle(rng, data);
    const mean = data.reduce((a, b2) => a + b2, 0) / k;
    const sorted = [...data].sort((a, b2) => a - b2);
    const visual: Visual = { kind: 'text', text: data.join('   '), size: 'md' };
    if (i % 2 === 0 || k % 2 === 0) return inp(tid('st', i), L('Berechne den Mittelwert (Durchschnitt) dieser Werte.', 'Calcola la media di questi valori.'), mean,
      L('Alle Werte addieren und durch ihre Anzahl teilen.', 'Somma tutti i valori e dividi per quanti sono.'), [`${data.join(' + ')} = ${mean * k}`, `${mean * k} : ${k} = ${mean}`], visual);
    return inp(tid('st', i), L('Wie groß ist der Median dieser Werte?', 'Qual è la mediana di questi valori?'), sorted[Math.floor(k / 2)]!,
      L('Sortiere die Werte. Der Median steht genau in der Mitte.', 'Ordina i valori. La mediana è quello al centro.'), [L('Sortiert: ', 'Ordinati: ') + sorted.join(', '), L(`Mitte: ${sorted[Math.floor(k / 2)]}`, `Al centro: ${sorted[Math.floor(k / 2)]}`)], visual);
  });
}

/* ---------- Trigonometrie (9–11) ---------- */
export function genTrigonometrie(level: Difficulty, rng: Rng, n = 5): Task[] {
  const vals: [string, string][] = [['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 90°', '1'], ['cos 0°', '1'], ['tan 45°', '1'], ['sin 0°', '0'], ['cos 90°', '0'], ['sin 45°', '√2/2'], ['cos 30°', '√3/2'], ['sin 60°', '√3/2'], ['tan 0°', '0']];
  return times(n, (i): Task => {
    if (i % 2 === 0 || level === 1) {
      const [q, a] = pick(rng, vals);
      return ch(rng, tid('tr', i), `${q} = ?`, a, ['0', '1/2', '1', '√2/2', '√3/2', '2'].filter((x) => x !== a).slice(0, 3),
        L('Denk an den Einheitskreis oder an die besonderen Dreiecke (30°-60°-90° und 45°-45°-90°).', 'Pensa alla circonferenza goniometrica o ai triangoli notevoli (30°-60°-90° e 45°-45°-90°).'), [`${q} = ${a}`]);
    }
    const c = pick(rng, [2, 4, 6, 8, 10, 12, 20]);
    return inp(tid('tr', i), L(`Rechtwinkliges Dreieck: Hypotenuse ${c} cm, Winkel α = 30°. Wie lang ist die Gegenkathete von α?`, `Triangolo rettangolo: ipotenusa ${c} cm, angolo α = 30°. Quanto misura il cateto opposto ad α?`), c / 2,
      L('sin α = Gegenkathete : Hypotenuse', 'sen α = cateto opposto : ipotenusa'), [L(`Gegenkathete = ${c} · sin 30° = ${c} · 1/2 = ${c / 2} cm`, `Cateto opposto = ${c} · sen 30° = ${c} · 1/2 = ${c / 2} cm`)]);
  });
}

/* ---------- Folgen (9–12) ---------- */
export function genFolgen(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (i % 2 === 0 || level === 1) {
      const a0 = randInt(rng, -5, 10), d = randInt(rng, 2, 9) * (rng() > 0.7 ? -1 : 1);
      const seq = times(4, (k) => a0 + k * d);
      return inp(tid('fo', i), L('Welche Zahl kommt als Nächstes?', 'Quale numero viene dopo?'), a0 + 4 * d,
        L('Schau, um wie viel sich die Zahlen jeweils ändern.', 'Osserva di quanto cambiano ogni volta.'), [L(`Differenz d = ${d}`, `Differenza d = ${d}`), `${seq[3]} ${sgn(d)} = ${a0 + 4 * d}`], { kind: 'text', text: `${seq.join(', ')}, …`, size: 'lg' });
    }
    const a0 = randInt(rng, 1, 5), q = randInt(rng, 2, 3);
    const seq = times(4, (k) => a0 * q ** k);
    const k = randInt(rng, 6, level === 3 ? 9 : 7);
    return inp(tid('fo', i), L(`Geometrische Folge ${seq.join(', ')}, … Wie lautet das ${k}. Glied?`, `Successione geometrica ${seq.join(', ')}, … Quanto vale il ${k}° termine?`), a0 * q ** (k - 1),
      L('aₙ = a₁ · q^(n−1)', 'aₙ = a₁ · q^(n−1)'), [`q = ${q}`, `a${k} = ${a0} · ${q}^${k - 1} = ${a0 * q ** (k - 1)}`]);
  });
}

/* ---------- Logarithmen und Exponentialgleichungen (10–13) ---------- */
export function genLogarithmen(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const base = pick(rng, level === 1 ? [2, 10] : [2, 3, 5, 10]);
    const e = randInt(rng, level === 3 ? -2 : 1, base === 10 ? 5 : base === 2 ? 8 : 4);
    if (i % 2 === 0) {
      const v = base ** e;
      const shown = v < 1 ? `1/${base ** -e}` : num(v);
      return inp(tid('lg', i), `log${base === 10 ? '' : `_${base}`}(${shown}) = ?`, e,
        L(`Frage dich: ${base} hoch wie viel ergibt ${shown}?`, `Chiediti: ${base} elevato a quanto dà ${shown}?`), [`${base}^${e} = ${shown}`, L(`also log = ${e}`, `quindi log = ${e}`)]);
    }
    const x = randInt(rng, 1, base === 10 ? 4 : 6);
    return inp(tid('lg', i), L(`Löse: ${base}^x = ${num(base ** x)}`, `Risolvi: ${base}^x = ${num(base ** x)}`), x,
      L('Schreibe die rechte Seite als Potenz mit derselben Basis.', 'Scrivi il secondo membro come potenza con la stessa base.'), [`${num(base ** x)} = ${base}^${x}`, `x = ${x}`]);
  });
}

/* ---------- Ableitungen (11–13) ---------- */
export function genAbleitung(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const a = randInt(rng, 1, 5), b2 = randInt(rng, -6, 6), c = randInt(rng, -9, 9), x0 = randInt(rng, -3, 3);
    const deg3 = level >= 2 && i % 2 === 1;
    if (i % 3 === 2) {
      return ch(rng, tid('ab', i), L(`Bilde die Ableitung von f(x) = ${a}x³ ${sgn(b2)}x² ${sgn(c)}x`, `Calcola la derivata di f(x) = ${a}x³ ${sgn(b2)}x² ${sgn(c)}x`), `f′(x) = ${3 * a}x² ${sgn(2 * b2)}x ${sgn(c)}`,
        [`f′(x) = ${a}x² ${sgn(b2)}x ${sgn(c)}`, `f′(x) = ${3 * a}x² ${sgn(b2)}x`, `f′(x) = ${3 * a}x³ ${sgn(2 * b2)}x² ${sgn(c)}`],
        L('Potenzregel: (xⁿ)′ = n · xⁿ⁻¹; Konstanten fallen weg.', 'Regola della potenza: (xⁿ)′ = n · xⁿ⁻¹; le costanti si annullano.'), [`(${a}x³)′ = ${3 * a}x²`, `(${b2}x²)′ = ${2 * b2}x`, `(${c}x)′ = ${c}`]);
    }
    const f = deg3 ? `${a}x³ ${sgn(b2)}x ${sgn(c)}` : `${a}x² ${sgn(b2)}x ${sgn(c)}`;
    const d = deg3 ? 3 * a * x0 * x0 + b2 : 2 * a * x0 + b2;
    return inp(tid('ab', i), L(`f(x) = ${f}. Berechne f′(${x0}).`, `f(x) = ${f}. Calcola f′(${x0}).`), d,
      L('Erst ableiten, dann den x-Wert einsetzen.', 'Prima deriva, poi sostituisci il valore di x.'),
      [deg3 ? `f′(x) = ${3 * a}x² ${sgn(b2)}` : `f′(x) = ${2 * a}x ${sgn(b2)}`, `f′(${x0}) = ${d}`]);
  });
}

/* ---------- Integrale (11–13) ---------- */
export function genIntegral(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (i % 2 === 1) {
      const a = randInt(rng, 1, 4) * 3, b2 = randInt(rng, 1, 5) * 2;
      return ch(rng, tid('in', i), L(`Eine Stammfunktion von f(x) = ${a}x² ${sgn(b2)}x ist …`, `Una primitiva di f(x) = ${a}x² ${sgn(b2)}x è …`), `F(x) = ${a / 3}x³ ${sgn(b2 / 2)}x²`,
        [`F(x) = ${2 * a}x ${sgn(b2)}`, `F(x) = ${a}x³ ${sgn(b2)}x²`, `F(x) = ${a / 3}x² ${sgn(b2 / 2)}x`],
        L('Umkehrung der Potenzregel: xⁿ → xⁿ⁺¹ / (n+1)', 'Inverso della regola della potenza: xⁿ → xⁿ⁺¹ / (n+1)'), [`∫${a}x² dx = ${a / 3}x³`, `∫${b2}x dx = ${b2 / 2}x²`]);
    }
    const a = randInt(rng, 1, 3) * 2, c = randInt(rng, 0, 5), up = randInt(rng, 1, level === 3 ? 5 : 3);
    const val = (a / 2) * up * up + c * up;
    return inp(tid('in', i), L(`Berechne ∫ von 0 bis ${up} (${a}x ${sgn(c)}) dx`, `Calcola ∫ da 0 a ${up} di (${a}x ${sgn(c)}) dx`), val,
      L('Stammfunktion bilden, obere Grenze einsetzen, untere abziehen.', 'Trova la primitiva, sostituisci l’estremo superiore e sottrai quello inferiore.'),
      [`F(x) = ${a / 2}x² ${sgn(c)}x`, `F(${up}) − F(0) = ${val} − 0 = ${val}`]);
  });
}

/* ---------- Vektoren (11–13) ---------- */
export function genVektoren(_level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (i % 2 === 0) {
      const u = times(3, () => randInt(rng, -5, 5)), v = times(3, () => randInt(rng, -5, 5));
      const dot = u[0]! * v[0]! + u[1]! * v[1]! + u[2]! * v[2]!;
      return inp(tid('vk', i), L(`Skalarprodukt: (${u.join(' | ')}) · (${v.join(' | ')}) = ?`, `Prodotto scalare: (${u.join('; ')}) · (${v.join('; ')}) = ?`), dot,
        L('Komponenten paarweise multiplizieren und addieren.', 'Moltiplica le componenti a coppie e somma.'), [`${u.map((x, k) => `${paren(x)}·${paren(v[k]!)}`).join(' + ')} = ${dot}`, ...(dot === 0 ? [L('Die Vektoren sind orthogonal.', 'I vettori sono ortogonali.')] : [])]);
    }
    const t = pick(rng, [[3, 4, 0, 5], [2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [6, 2, 3, 7], [4, 4, 2, 6]] as const);
    return inp(tid('vk', i), L(`Wie lang ist der Vektor (${t[0]} | ${t[1]} | ${t[2]})?`, `Qual è il modulo del vettore (${t[0]}; ${t[1]}; ${t[2]})?`), t[3],
      L('|v| = √(x² + y² + z²)', '|v| = √(x² + y² + z²)'), [`√(${t[0] ** 2} + ${t[1] ** 2} + ${t[2] ** 2}) = √${t[3] ** 2} = ${t[3]}`]);
  });
}

/* ---------- Kombinatorik (10–13) ---------- */
const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1));
const binom = (n2: number, k: number) => fact(n2) / (fact(k) * fact(n2 - k));
export function genKombinatorik(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    if (i % 3 === 0) { const k = randInt(rng, 3, level === 1 ? 5 : 6); return inp(tid('kb', i), L(`Auf wie viele Arten können sich ${k} Personen in eine Reihe stellen?`, `In quanti modi ${k} persone possono mettersi in fila?`), fact(k), L(`${k}! = ${k} · ${k - 1} · … · 1`, `${k}! = ${k} · ${k - 1} · … · 1`), [`${k}! = ${fact(k)}`]); }
    if (i % 3 === 1) { const n2 = randInt(rng, 5, 10), k = randInt(rng, 2, 3); return inp(tid('kb', i), L(`Aus ${n2} Schülerinnen und Schülern werden ${k} für eine Gruppe ausgewählt (Reihenfolge egal). Wie viele Möglichkeiten gibt es?`, `Tra ${n2} studenti se ne scelgono ${k} per un gruppo (l’ordine non conta). Quante possibilità ci sono?`), binom(n2, k), L(`Binomialkoeffizient (${n2} über ${k})`, `Coefficiente binomiale C(${n2}, ${k})`), [`(${n2} ${L('über', 'su')} ${k}) = ${n2}! / (${k}! · ${n2 - k}!) = ${binom(n2, k)}`]); }
    const s = randInt(rng, 2, 4), h = randInt(rng, 2, 5);
    return inp(tid('kb', i), L(`Du hast ${s} T-Shirts und ${h} Hosen. Wie viele verschiedene Outfits kannst du anziehen?`, `Hai ${s} magliette e ${h} pantaloni. Quanti abbinamenti diversi puoi fare?`), s * h,
      L('Zählprinzip: Möglichkeiten multiplizieren.', 'Principio di moltiplicazione: si moltiplicano le possibilità.'), [`${s} · ${h} = ${s * h}`]);
  });
}

const M = (id: string, y: [number, number], de: string, it: string, sde: string, sit: string, emoji: string, color: LearningModule['color'], gen: LearningModule['generate'], roundSize = 6): LearningModule =>
  ({ id, title: tx(de, it), subtitle: tx(sde, sit), topic: tx(de, it), emoji, color, area: 'schule', subject: 'mathe', years: y, roundSize, generate: gen });

export const MATH_SEK_MODULES: LearningModule[] = [
  M('ms-dezimal', [5, 6], 'Dezimalzahlen', 'Numeri decimali', 'Vergleichen und rechnen', 'Confrontare e calcolare', '🔟', 'himmel', (l, r) => genDezimal(l, r)),
  M('ms-brueche', [5, 7], 'Bruchrechnung', 'Calcolo con le frazioni', 'Kürzen, addieren, Anteile', 'Ridurre, sommare, parti', '🍰', 'sonne', (l, r) => genBruchrechnen(l, r)),
  M('ms-teilbarkeit', [5, 6], 'Teilbarkeit', 'Divisibilità', 'Teilbarkeitsregeln, ggT, kgV', 'Criteri, M.C.D., m.c.m.', '🧮', 'lila', (l, r) => genTeilbarkeit(l, r)),
  M('ms-flaechen', [5, 7], 'Flächen und Umfang', 'Aree e perimetri', 'Rechteck, Dreieck, Parallelogramm', 'Rettangolo, triangolo, parallelogramma', '📐', 'minze', (l, r) => genFlaechen(l, r)),
  M('ms-negativ', [6, 7], 'Ganze Zahlen', 'Numeri relativi', 'Rechnen mit negativen Zahlen', 'Calcoli con i numeri negativi', '🌡️', 'koralle', (l, r) => genNegativ(l, r)),
  M('ms-winkel', [6, 8], 'Winkel', 'Angoli', 'Winkelarten und Winkelsummen', 'Tipi di angolo e somme', '📏', 'himmel', (l, r) => genWinkel(l, r)),
  M('ms-statistik', [6, 9], 'Statistik', 'Statistica', 'Mittelwert und Median', 'Media e mediana', '📊', 'sonne', (l, r) => genStatistik(l, r), 5),
  M('ms-dreisatz', [6, 8], 'Dreisatz', 'Proporzionalità', 'Proportional und antiproportional', 'Diretta e inversa', '⚖️', 'minze', (l, r) => genDreisatz(l, r), 5),
  M('ms-prozent', [7, 8], 'Prozentrechnung', 'Percentuali', 'Prozentwert, Grundwert, Prozentsatz', 'Parte, totale, percentuale', '％', 'koralle', (l, r) => genProzent(l, r)),
  M('ms-terme', [7, 8], 'Terme', 'Espressioni letterali', 'Zusammenfassen und ausmultiplizieren', 'Ridurre e moltiplicare', '🔤', 'lila', (l, r) => genTerme(l, r)),
  M('ms-gleichungen', [7, 9], 'Lineare Gleichungen', 'Equazioni di primo grado', 'Nach x auflösen', 'Trovare x', '🟰', 'himmel', (l, r) => genGleichungen(l, r)),
  M('ms-wahrscheinlichkeit', [7, 10], 'Wahrscheinlichkeit', 'Probabilità', 'Würfel und Urnen', 'Dadi e urne', '🎲', 'sonne', (l, r) => genWahrscheinlichkeit(l, r), 5),
  M('ms-kreis', [8, 9], 'Kreis', 'Il cerchio', 'Umfang und Fläche', 'Circonferenza e area', '⭕', 'minze', (l, r) => genKreis(l, r), 5),
  M('ms-potenzen', [8, 10], 'Potenzen und Wurzeln', 'Potenze e radici', 'Rechenregeln, Zehnerpotenzen', 'Regole, notazione scientifica', '²', 'lila', (l, r) => genPotenzen(l, r)),
  M('ms-pythagoras', [8, 10], 'Satz des Pythagoras', 'Teorema di Pitagora', 'Rechtwinklige Dreiecke', 'Triangoli rettangoli', '📐', 'koralle', (l, r) => genPythagoras(l, r), 5),
  M('ms-funktionen', [8, 10], 'Lineare Funktionen', 'Funzioni lineari', 'Steigung und y-Achsenabschnitt', 'Pendenza e intercetta', '📈', 'himmel', (l, r) => genFunktionen(l, r)),
  M('ms-quadratisch', [9, 11], 'Quadratische Gleichungen', 'Equazioni di secondo grado', 'Lösungen finden', 'Trovare le soluzioni', '🧩', 'sonne', (l, r) => genQuadratisch(l, r), 5),
  M('ms-trigonometrie', [9, 11], 'Trigonometrie', 'Trigonometria', 'Sinus, Kosinus, Tangens', 'Seno, coseno, tangente', '📐', 'minze', (l, r) => genTrigonometrie(l, r), 5),
  M('ms-folgen', [9, 12], 'Folgen', 'Successioni', 'Arithmetisch und geometrisch', 'Aritmetiche e geometriche', '🔢', 'lila', (l, r) => genFolgen(l, r), 5),
  M('ms-logarithmen', [10, 13], 'Logarithmen', 'Logaritmi', 'Exponentialgleichungen', 'Equazioni esponenziali', '📉', 'koralle', (l, r) => genLogarithmen(l, r), 5),
  M('ms-kombinatorik', [10, 13], 'Kombinatorik', 'Calcolo combinatorio', 'Permutationen und Auswahlen', 'Permutazioni e combinazioni', '🔀', 'himmel', (l, r) => genKombinatorik(l, r), 5),
  M('ms-ableitung', [11, 13], 'Ableitungen', 'Derivate', 'Differentialrechnung', 'Calcolo differenziale', '∂', 'sonne', (l, r) => genAbleitung(l, r), 5),
  M('ms-integral', [11, 13], 'Integrale', 'Integrali', 'Stammfunktionen und Flächen', 'Primitive e aree', '∫', 'minze', (l, r) => genIntegral(l, r), 5),
  M('ms-vektoren', [11, 13], 'Vektoren', 'Vettori', 'Skalarprodukt und Länge', 'Prodotto scalare e modulo', '➡️', 'lila', (l, r) => genVektoren(l, r), 5)
];
