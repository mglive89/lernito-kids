import type { ChoiceTask, Difficulty, InputTask, LearningModule, OrderTask, Rng, Task } from '../types';
import { pick, randInt, sample, shuffle } from '../../lib/random';
import { b, bankModule, type BankItem } from '../bank';
import { L, getLang, tx } from '../../i18n';

/* Programmieren / Programmazione: vom Pfeil-Roboter bis zu Python – alle Aufgaben werden erzeugt und geprüft. */

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));

/* ---------- Roboter-Parcours ---------- */
type P = [number, number];
const DIRS: Record<string, P> = { '→': [1, 0], '←': [-1, 0], '↑': [0, -1], '↓': [0, 1] };

function run(size: number, start: P, moves: string[], walls: P[]): P | null {
  let [x, y] = start;
  for (const m of moves) {
    const d = DIRS[m]!;
    x += d[0]; y += d[1];
    if (x < 0 || y < 0 || x >= size || y >= size || walls.some(([a, c]) => a === x && c === y)) return null;
  }
  return [x, y];
}

function shortest(size: number, start: P, goal: P, walls: P[]): string[] | null {
  const key = (p: P) => `${p[0]},${p[1]}`;
  const prev = new Map<string, [string, string]>();
  const q: P[] = [start];
  const seen = new Set([key(start)]);
  while (q.length) {
    const cur = q.shift()!;
    if (cur[0] === goal[0] && cur[1] === goal[1]) {
      const path: string[] = [];
      let k = key(cur);
      while (prev.has(k)) { const [pk, m] = prev.get(k)!; path.unshift(m); k = pk; }
      return path;
    }
    for (const [m, d] of Object.entries(DIRS)) {
      const nx: P = [cur[0] + d[0], cur[1] + d[1]];
      if (nx[0] < 0 || nx[1] < 0 || nx[0] >= size || nx[1] >= size || walls.some(([a, c]) => a === nx[0] && c === nx[1]) || seen.has(key(nx))) continue;
      seen.add(key(nx)); prev.set(key(nx), [key(cur), m]); q.push(nx);
    }
  }
  return null;
}

/** Komprimiert Pfeile für ältere Kinder: →→→ wird zu 3×→ */
function compress(moves: string[]): string {
  const out: string[] = [];
  for (let i = 0; i < moves.length;) {
    let j = i; while (j < moves.length && moves[j] === moves[i]) j++;
    out.push(j - i > 1 ? `${j - i}×${moves[i]}` : moves[i]!);
    i = j;
  }
  return out.join(' ');
}

export function genRoboter(level: Difficulty, rng: Rng, n = 5): Task[] {
  return times(n, (i): Task => {
    const size = level === 1 ? 3 : level === 2 ? 4 : 5;
    for (let tries = 0; tries < 50; tries++) {
      const start: P = [randInt(rng, 0, size - 1), randInt(rng, 0, size - 1)];
      const goal: P = [randInt(rng, 0, size - 1), randInt(rng, 0, size - 1)];
      const dist = Math.abs(start[0] - goal[0]) + Math.abs(start[1] - goal[1]);
      if (dist < 2 || dist > size + 1) continue;
      const walls: P[] = [];
      const nWalls = level === 1 ? 0 : level === 2 ? 2 : 4;
      while (walls.length < nWalls) {
        const w: P = [randInt(rng, 0, size - 1), randInt(rng, 0, size - 1)];
        if ((w[0] === start[0] && w[1] === start[1]) || (w[0] === goal[0] && w[1] === goal[1]) || walls.some((x) => x[0] === w[0] && x[1] === w[1])) continue;
        walls.push(w);
      }
      const path = shortest(size, start, goal, walls);
      if (!path || path.length < 2) continue;
      const fmt = (m: string[]) => (level === 3 ? compress(m) : m.join(' '));
      const correct = fmt(path);
      const wrongs = new Set<string>();
      for (let k = 0; k < 40 && wrongs.size < 3; k++) {
        const w = [...path];
        const t = randInt(rng, 0, 2);
        if (t === 0) { const a = randInt(rng, 0, w.length - 1); w[a] = pick(rng, Object.keys(DIRS).filter((d) => d !== w[a])); }
        else if (t === 1) w.splice(randInt(rng, 0, w.length - 1), 1);
        else w.push(pick(rng, Object.keys(DIRS)));
        const end = run(size, start, w, walls);
        if (end && end[0] === goal[0] && end[1] === goal[1]) continue;
        const f = fmt(w);
        if (f !== correct) wrongs.add(f);
      }
      if (wrongs.size < 2) continue;
      return {
        id: tid('robo', i), type: 'choice', optionStyle: 'text', correctId: correct,
        prompt: L('Welcher Weg bringt den Roboter zum Stern?', 'Quale percorso porta il robot alla stella?'),
        visual: { kind: 'robot', size, robot: start, goal, walls },
        options: shuffle(rng, [correct, ...wrongs]).map((x) => ({ id: x, label: x })),
        hint: walls.length ? L('Fahre mit dem Finger mit. Die grauen Felder sind Mauern.', 'Segui il percorso con il dito. Le caselle grigie sono muri.') : L('Fahre mit dem Finger Schritt für Schritt mit.', 'Segui il percorso con il dito, passo dopo passo.'),
        explain: [L('Richtiger Weg: ', 'Percorso giusto: ') + correct, L(`Das sind ${path.length} Schritte.`, `Sono ${path.length} passi.`)]
      } satisfies ChoiceTask;
    }
    return genRoboter(1, rng, 1)[0]!;
  });
}

/* ---------- Schleifen (Blöcke) ---------- */
export function genSchleifen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): Task => {
    const rep = randInt(rng, 2, level === 1 ? 4 : 6);
    const steps = randInt(rng, 1, level === 1 ? 3 : 5);
    if (level >= 2 && i % 3 === 2) {
      const inner = randInt(rng, 2, 3);
      const code = L(`wiederhole ${rep} mal:\n  wiederhole ${inner} mal:\n    klatsche`, `ripeti ${rep} volte:\n  ripeti ${inner} volte:\n    batti le mani`);
      return { id: tid('loop', i), type: 'input', answer: rep * inner, prompt: L('Wie oft wird geklatscht?', 'Quante volte si battono le mani?'), visual: { kind: 'code', code },
        hint: L('Die innere Schleife läuft bei jeder Runde der äußeren komplett durch.', 'Il ciclo interno si ripete completamente a ogni giro di quello esterno.'), explain: [`${rep} × ${inner} = ${rep * inner}`] } satisfies InputTask;
    }
    const extra = level === 3 ? randInt(rng, 1, 4) : 0;
    const code = L(`wiederhole ${rep} mal:\n  gehe ${steps} Schritte${extra ? `\ngehe ${extra} Schritte` : ''}`, `ripeti ${rep} volte:\n  fai ${steps} passi${extra ? `\nfai ${extra} passi` : ''}`);
    const ans = rep * steps + extra;
    return { id: tid('loop', i), type: 'input', answer: ans, prompt: L('Wie viele Schritte geht die Figur insgesamt?', 'Quanti passi fa in tutto il personaggio?'), visual: { kind: 'code', code },
      hint: L('Nur die eingerückte Zeile wird wiederholt.', 'Si ripete solo la riga rientrata.'), explain: [`${rep} × ${steps}${extra ? ` + ${extra}` : ''} = ${ans}`] } satisfies InputTask;
  });
}

/* ---------- Algorithmen ordnen ---------- */
const ABLAEUFE: { de: string[]; it: string[]; tde: string; tit: string }[] = [
  { tde: 'Zähne putzen', tit: 'Lavarsi i denti', de: ['Zahnpasta auf die Bürste', 'Zähne putzen', 'Mund ausspülen', 'Bürste abwaschen'], it: ['Dentifricio sullo spazzolino', 'Lavare i denti', 'Sciacquare la bocca', 'Lavare lo spazzolino'] },
  { tde: 'Pflanze einsetzen', tit: 'Piantare un fiore', de: ['Loch graben', 'Pflanze hineinsetzen', 'Erde andrücken', 'Gießen'], it: ['Scavare una buca', 'Mettere la pianta', 'Premere la terra', 'Annaffiare'] },
  { tde: 'Brief schicken', tit: 'Spedire una lettera', de: ['Brief schreiben', 'In den Umschlag stecken', 'Briefmarke aufkleben', 'In den Briefkasten werfen'], it: ['Scrivere la lettera', 'Metterla nella busta', 'Attaccare il francobollo', 'Imbucarla'] },
  { tde: 'Programm schreiben', tit: 'Scrivere un programma', de: ['Problem verstehen', 'Algorithmus planen', 'Code schreiben', 'Testen und Fehler beheben'], it: ['Capire il problema', 'Progettare l’algoritmo', 'Scrivere il codice', 'Testare e correggere'] },
  { tde: 'Größte Zahl finden', tit: 'Trovare il numero più grande', de: ['Merke die erste Zahl als größte', 'Nimm die nächste Zahl', 'Ist sie größer, merke sie dir', 'Wiederhole bis zum Ende'], it: ['Ricorda il primo numero come massimo', 'Prendi il numero successivo', 'Se è più grande, ricordalo', 'Ripeti fino alla fine'] }
];

function genAblauf(level: Difficulty, rng: Rng, n = 4): Task[] {
  const pool = level === 1 ? ABLAEUFE.slice(0, 3) : ABLAEUFE;
  return sample(rng, pool, Math.min(n, pool.length)).map((a, i): OrderTask => {
    const steps = getLang() === 'it' ? a.it : a.de;
    const items = steps.map((s, k) => ({ id: `s${k}`, label: s }));
    return {
      id: tid('ablauf', i), type: 'order', prompt: L(`Bringe die Schritte in die richtige Reihenfolge: ${a.tde}`, `Metti i passi nell’ordine giusto: ${a.tit}`),
      items: shuffle(rng, items), correctOrder: items.map((x) => x.id),
      hint: L('Was muss zuerst passieren, damit der nächste Schritt geht?', 'Che cosa deve succedere prima perché il passo dopo sia possibile?'),
      explain: steps.map((s, k) => `${k + 1}. ${s}`)
    };
  });
}

/* ---------- Python: Ausgabe vorhersagen ---------- */
export function genPython(level: Difficulty, rng: Rng, n = 6): Task[] {
  const kinds = level === 1 ? ['var', 'if', 'var'] : level === 2 ? ['var', 'if', 'for', 'while', 'list'] : ['for', 'while', 'list', 'func', 'mod', 'nested'];
  return times(n, (i): Task => {
    const k = kinds[i % kinds.length]!;
    let code = '';
    let ans = 0;
    let ex = '';
    if (k === 'var') {
      const a = randInt(rng, 2, 9), b2 = randInt(rng, 2, 9), c = randInt(rng, 1, 5);
      code = `a = ${a}\nb = ${b2}\na = a + b\nb = a * ${c}\nprint(b)`;
      ans = (a + b2) * c; ex = `a = ${a + b2}, b = ${a + b2} * ${c} = ${ans}`;
    } else if (k === 'if') {
      const x = randInt(rng, 1, 20), t = randInt(rng, 5, 15), p = randInt(rng, 1, 9), q = randInt(rng, 10, 30);
      code = `x = ${x}\nif x > ${t}:\n    y = x - ${p}\nelse:\n    y = x + ${q}\nprint(y)`;
      ans = x > t ? x - p : x + q; ex = x > t ? `${x} > ${t} → y = ${x} - ${p} = ${ans}` : `${x} ≤ ${t} → y = ${x} + ${q} = ${ans}`;
    } else if (k === 'for') {
      const end = randInt(rng, 3, 7), st = randInt(rng, 0, 2);
      code = `s = 0\nfor i in range(${st}, ${end}):\n    s = s + i\nprint(s)`;
      for (let j = st; j < end; j++) ans += j;
      ex = L(`range(${st}, ${end}) = ${Array.from({ length: end - st }, (_, j) => j + st).join(', ')} (ohne ${end})`, `range(${st}, ${end}) = ${Array.from({ length: end - st }, (_, j) => j + st).join(', ')} (senza ${end})`) + ` → ${ans}`;
    } else if (k === 'while') {
      const s = randInt(rng, 20, 60), d = randInt(rng, 3, 9);
      code = `n = ${s}\nc = 0\nwhile n > 0:\n    n = n - ${d}\n    c = c + 1\nprint(c)`;
      ans = Math.ceil(s / d); ex = L(`Die Schleife läuft, bis n ≤ 0 ist: ${ans}-mal.`, `Il ciclo gira finché n ≤ 0: ${ans} volte.`);
    } else if (k === 'list') {
      const arr = times(5, () => randInt(rng, 1, 30));
      const idx = randInt(rng, -2, 4);
      code = `z = [${arr.join(', ')}]\nprint(z[${idx}])`;
      ans = arr[(idx + arr.length) % arr.length]!;
      ex = idx < 0 ? L(`Negative Indizes zählen von hinten: z[${idx}] = ${ans}`, `Gli indici negativi contano dalla fine: z[${idx}] = ${ans}`) : L(`Indizes beginnen bei 0: z[${idx}] = ${ans}`, `Gli indici partono da 0: z[${idx}] = ${ans}`);
    } else if (k === 'func') {
      const m = randInt(rng, 2, 5), a = randInt(rng, 1, 9), x = randInt(rng, 2, 6);
      code = `def f(x):\n    return ${m} * x + ${a}\n\nprint(f(f(${x})))`;
      const f = (v: number) => m * v + a;
      ans = f(f(x)); ex = `f(${x}) = ${f(x)}, f(${f(x)}) = ${ans}`;
    } else if (k === 'mod') {
      const end = randInt(rng, 8, 15), m = pick(rng, [2, 3, 4]);
      code = `c = 0\nfor i in range(1, ${end}):\n    if i % ${m} == 0:\n        c += 1\nprint(c)`;
      ans = Math.floor((end - 1) / m); ex = L(`Zahlen von 1 bis ${end - 1}, die durch ${m} teilbar sind: ${ans}`, `Numeri da 1 a ${end - 1} divisibili per ${m}: ${ans}`);
    } else {
      const a = randInt(rng, 2, 4), b2 = randInt(rng, 2, 4);
      code = `t = 0\nfor i in range(${a}):\n    for j in range(${b2}):\n        t += i\nprint(t)`;
      for (let x = 0; x < a; x++) ans += x * b2;
      ex = L(`Jedes i wird ${b2}-mal addiert: (0+…+${a - 1})·${b2} = ${ans}`, `Ogni i viene sommato ${b2} volte: (0+…+${a - 1})·${b2} = ${ans}`);
    }
    return {
      id: tid('py', i), type: 'input', answer: ans, signed: true,
      prompt: L('Was gibt das Python-Programm aus?', 'Che cosa stampa il programma Python?'), visual: { kind: 'code', code, lang: 'python' },
      hint: L('Gehe Zeile für Zeile durch und notiere die Werte der Variablen.', 'Segui il codice riga per riga e annota i valori delle variabili.'),
      explain: [ex]
    } satisfies InputTask;
  });
}

const BLOECKE: BankItem[] = [
  b('Was ist eine Schleife? | ein Befehl, der andere Befehle wiederholt | ein Fehler im Programm ; ein Bild ; eine Variable', 'Che cos’è un ciclo? | un’istruzione che ripete altre istruzioni | un errore nel programma ; un’immagine ; una variabile', '🔁'),
  b('Was ist eine Variable? | ein benannter Speicherplatz für einen Wert | ein Bildschirm ; eine Schleife ; ein Fehler', 'Che cos’è una variabile? | uno spazio con un nome che contiene un valore | uno schermo ; un ciclo ; un errore', '📦'),
  b('Was macht eine „wenn … dann“-Anweisung? | sie führt Befehle nur aus, wenn eine Bedingung wahr ist | sie wiederholt immer ; sie löscht das Programm ; sie malt einen Kreis', 'Che cosa fa un’istruzione «se … allora»? | esegue le istruzioni solo se la condizione è vera | ripete sempre ; cancella il programma ; disegna un cerchio', '🔀'),
  b('Was ist ein Bug? | ein Fehler im Programm | ein Käfer im Computer ; ein Spiel ; ein Kabel', 'Che cos’è un bug? | un errore nel programma | un insetto nel computer ; un gioco ; un cavo', '🐞'),
  b('Was ist ein Ereignis (Event) in Scratch, z. B. „Wenn grüne Flagge angeklickt“? | ein Auslöser, der ein Skript startet | eine Schleife ; eine Variable ; ein Kostüm', 'Che cos’è un evento in Scratch, per esempio «quando si clicca sulla bandiera verde»? | qualcosa che avvia lo script | un ciclo ; una variabile ; un costume', '🏁', 2),
  b('Die Figur soll ein Quadrat laufen. Welche Schleife passt? | wiederhole 4 mal: gehe 50, drehe 90° | wiederhole 3 mal: gehe 50, drehe 120° ; wiederhole 4 mal: drehe 45° ; gehe 50 einmal', 'Il personaggio deve disegnare un quadrato. Quale ciclo va bene? | ripeti 4 volte: avanza 50, ruota 90° | ripeti 3 volte: avanza 50, ruota 120° ; ripeti 4 volte: ruota 45° ; avanza 50 una volta', '⬛', 2),
  b('Die Figur soll ein Dreieck laufen. Um wie viel Grad muss sie sich jeweils drehen? | 120° | 60° ; 90° ; 180°', 'Il personaggio deve disegnare un triangolo equilatero. Di quanti gradi deve ruotare ogni volta? | 120° | 60° ; 90° ; 180° | 360° : 3 = 120°', '🔺', 3),
  b('Was bedeutet „Debugging“? | Fehler finden und beheben | ein Programm löschen ; Musik machen ; ein Spiel kaufen', 'Che cosa significa «debugging»? | trovare e correggere gli errori | cancellare un programma ; fare musica ; comprare un gioco', '🔧', 2)
];

const BUGS: BankItem[] = [
  b('Welche Zeile enthält den Fehler? § zahlen = [3, 5, 7]\\nfor z in zahlen\\n    print(z) | Zeile 2: Doppelpunkt fehlt | Zeile 1: falsche Klammern ; Zeile 3: print ist falsch ; kein Fehler', 'Quale riga contiene l’errore? § numeri = [3, 5, 7]\\nfor n in numeri\\n    print(n) | Riga 2: mancano i due punti | Riga 1: parentesi sbagliate ; Riga 3: print è sbagliato ; nessun errore'),
  b('Was gibt das Programm aus? § print("3" + "4") | 34 | 7 ; 12 ; Fehler | Strings werden verkettet.', 'Che cosa stampa il programma? § print("3" + "4") | 34 | 7 ; 12 ; errore | Le stringhe vengono concatenate.'),
  b('Was ist das Problem? § i = 0\\nwhile i < 5:\\n    print(i) | Endlosschleife: i wird nie erhöht | falsche Einrückung ; print ist verboten ; i muss 1 sein', 'Qual è il problema? § i = 0\\nwhile i < 5:\\n    print(i) | ciclo infinito: i non viene mai incrementato | rientro sbagliato ; print è vietato ; i deve essere 1'),
  b('Was gibt das Programm aus? § x = 7 // 2\\nprint(x) | 3 | 3.5 ; 4 ; 1 | // ist ganzzahlige Division.', 'Che cosa stampa il programma? § x = 7 // 2\\nprint(x) | 3 | 3.5 ; 4 ; 1 | // è la divisione intera.', undefined, 2),
  b('Welcher Fehler tritt auf? § z = [1, 2, 3]\\nprint(z[3]) | IndexError: Index außerhalb der Liste | Ausgabe 3 ; Ausgabe 0 ; SyntaxError', 'Quale errore si verifica? § z = [1, 2, 3]\\nprint(z[3]) | IndexError: indice fuori dalla lista | stampa 3 ; stampa 0 ; SyntaxError', undefined, 2),
  b('Was gibt das Programm aus? § s = "Python"\\nprint(len(s)) | 6 | 5 ; 7 ; Python', 'Che cosa stampa il programma? § s = "Python"\\nprint(len(s)) | 6 | 5 ; 7 ; Python'),
  b('Was gibt das Programm aus? § s = "Lernito"\\nprint(s[1:4]) | ern | Ler ; erni ; rni | Slicing: von 1 bis vor 4.', 'Che cosa stampa il programma? § s = "Lernito"\\nprint(s[1:4]) | ern | Ler ; erni ; rni | Slicing: da 1 fino a prima di 4.', undefined, 3),
  b('Warum ist das falsch? § alter = input("Alter? ")\\nprint(alter + 1) | input liefert Text; man muss int(alter) verwenden | print kann keine Zahlen ; + ist verboten ; alter ist kein gültiger Name', 'Perché è sbagliato? § eta = input("Età? ")\\nprint(eta + 1) | input restituisce testo; serve int(eta) | print non stampa numeri ; + è vietato ; eta non è un nome valido', undefined, 3),
  b('Was gibt das Programm aus? § def quadrat(x):\\n    x * x\\nprint(quadrat(4)) | None | 16 ; 8 ; Fehler | Es fehlt „return“.', 'Che cosa stampa il programma? § def quadrato(x):\\n    x * x\\nprint(quadrato(4)) | None | 16 ; 8 ; errore | Manca «return».', undefined, 3),
  b('Was gibt das Programm aus? § a = [1, 2]\\nb = a\\nb.append(3)\\nprint(len(a)) | 3 | 2 ; 1 ; Fehler | a und b zeigen auf dieselbe Liste.', 'Che cosa stampa il programma? § a = [1, 2]\\nb = a\\nb.append(3)\\nprint(len(a)) | 3 | 2 ; 1 ; errore | a e b sono la stessa lista.', undefined, 3)
];

const PR = 'programmieren' as const;
export const CODING_MODULES: LearningModule[] = [
  { id: 'code-roboter', title: tx('Roboter-Parcours', 'Il percorso del robot'), subtitle: tx('Pfeile planen', 'Programma con le frecce'), emoji: '🤖', color: 'himmel', area: 'schule', subject: PR, years: [1, 5], topic: tx('Abfolgen', 'Sequenze'), roundSize: 5, generate: (l, r) => genRoboter(l, r) },
  { id: 'code-ablauf', title: tx('Schritt für Schritt', 'Passo dopo passo'), subtitle: tx('Algorithmen ordnen', 'Metti in ordine gli algoritmi'), emoji: '📋', color: 'minze', area: 'schule', subject: PR, years: [1, 6], topic: tx('Algorithmen', 'Algoritmi'), roundSize: 4, generate: (l, r) => genAblauf(l, r) },
  bankModule({ id: 'code-bloecke', subject: PR, years: [3, 8], title: ['Programmieren mit Blöcken', 'Programmare a blocchi'], subtitle: ['Schleife, Variable, Bedingung', 'Ciclo, variabile, condizione'], emoji: '🧱', color: 'sonne', items: BLOECKE }),
  { id: 'code-schleifen', title: tx('Schleifen', 'I cicli'), subtitle: tx('Wiederhole … mal', 'Ripeti … volte'), emoji: '🔁', color: 'lila', area: 'schule', subject: PR, years: [3, 8], topic: tx('Schleifen', 'Cicli'), roundSize: 6, generate: (l, r) => genSchleifen(l, r) },
  { id: 'code-python', title: tx('Python lesen', 'Leggere Python'), subtitle: tx('Was gibt das Programm aus?', 'Che cosa stampa il programma?'), emoji: '🐍', color: 'koralle', area: 'schule', subject: PR, years: [6, 13], topic: tx('Python', 'Python'), roundSize: 6, generate: (l, r) => genPython(l, r) },
  bankModule({ id: 'code-bugs', subject: PR, years: [8, 13], title: ['Fehler finden', 'Caccia al bug'], subtitle: ['Python-Fehler erkennen', 'Riconoscere gli errori in Python'], emoji: '🐞', color: 'himmel', items: BUGS, codeLang: 'python' })
];
