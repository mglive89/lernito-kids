import type { Difficulty, Rng } from '../../learning/types';
import { pick, randInt, sample, shuffle } from '../../lib/random';
import { L, getLang } from '../../i18n';
import type { Block } from '../art/tech';
import type { Pic } from '../types';
import { choice, gen, inputTask, pickPicture, type PicBank, type PicGen } from './helpers';

/* Informatik und Programmieren */

type Pair = [string, string];
const tr = (p: Pair) => L(p[0], p[1]);
const dev = (kind: string): Pic => ({ id: 'geraet', kind });

/* ---------- Geräte ---------- */
const DEV: Record<string, [Pair, 'in' | 'out' | 'mem' | 'net']> = {
  monitor: [['Bildschirm', 'monitor'], 'out'], tastatur: [['Tastatur', 'tastiera'], 'in'], maus: [['Maus', 'mouse'], 'in'],
  drucker: [['Drucker', 'stampante'], 'out'], lautsprecher: [['Lautsprecher', 'altoparlante'], 'out'], kopfhoerer: [['Kopfhörer', 'cuffie'], 'out'],
  mikrofon: [['Mikrofon', 'microfono'], 'in'], webcam: [['Webcam', 'webcam'], 'in'], usbstick: [['USB-Stick', 'chiavetta USB'], 'mem'],
  router: [['Router', 'router'], 'net'], festplatte: [['Festplatte', 'disco rigido'], 'mem'], smartphone: [['Smartphone', 'smartphone'], 'in']
};
const KIND: Record<string, Pair> = { in: ['Eingabegerät', 'dispositivo di input'], out: ['Ausgabegerät', 'dispositivo di output'], mem: ['Speicher', 'memoria'], net: ['Netzwerkgerät', 'dispositivo di rete'] };
const deviceName = (rng: Rng) => {
  const k = pick(rng, Object.keys(DEV));
  return choice({ prompt: L('Wie heißt dieses Gerät?', 'Come si chiama questo dispositivo?'), pic: dev(k), right: tr(DEV[k]![0]), wrong: shuffle(rng, Object.values(DEV).map((d) => tr(d[0]))), rng, explain: [tr(DEV[k]![0])] });
};
const inOut = (rng: Rng) => {
  const k = pick(rng, Object.keys(DEV).filter((x) => DEV[x]![1] === 'in' || DEV[x]![1] === 'out').filter((x) => x !== 'smartphone'));
  const t = DEV[k]![1];
  return choice({
    prompt: L(`Ist das ein Eingabe- oder ein Ausgabegerät (${DEV[k]![0][0]})?`, `È un dispositivo di input o di output (${DEV[k]![0][1]})?`), pic: dev(k),
    right: tr(KIND[t]!), wrong: [tr(KIND.in!), tr(KIND.out!), tr(KIND.mem!)], rng,
    hint: L('Eingabe: Du gibst dem Computer etwas. Ausgabe: Der Computer zeigt oder spielt dir etwas.', 'Input: tu dai qualcosa al computer. Output: il computer ti mostra o ti fa sentire qualcosa.'),
    explain: [`${tr(DEV[k]![0])}: ${tr(KIND[t]!)}`]
  });
};
const pickDevice = (rng: Rng) => {
  const T: [string, Pair][] = [['drucker', ['Womit druckst du ein Bild auf Papier?', 'Con che cosa stampi un disegno su carta?']], ['mikrofon', ['Womit nimmst du deine Stimme auf?', 'Con che cosa registri la tua voce?']], ['maus', ['Womit bewegst du den Zeiger?', 'Con che cosa muovi il puntatore?']], ['lautsprecher', ['Womit hörst du Musik für alle im Raum?', 'Con che cosa ascolti la musica per tutti nella stanza?']], ['usbstick', ['Worauf speicherst du Dateien zum Mitnehmen?', 'Su che cosa salvi i file da portare con te?']]];
  const [k, qq] = pick(rng, T);
  const others = sample(rng, Object.keys(DEV).filter((x) => x !== k && x !== 'smartphone'), 3);
  return pickPicture({ prompt: tr(qq), right: { pic: dev(k), name: tr(DEV[k]![0]) }, wrong: others.map((x) => ({ pic: dev(x), name: tr(DEV[x]![0]) })), rng, explain: [tr(DEV[k]![0])] });
};
const PARTS: Record<string, [Pair, Pair]> = {
  cpu: [['Prozessor (CPU)', 'processore (CPU)'], ['rechnet und führt Befehle aus', 'esegue calcoli e istruzioni']],
  ram: [['Arbeitsspeicher (RAM)', 'memoria RAM'], ['merkt sich Daten nur, solange Strom da ist', 'conserva i dati solo finché c’è corrente']],
  festplatte: [['Festplatte', 'disco rigido'], ['speichert Dateien dauerhaft', 'salva i file in modo permanente']],
  router: [['Router', 'router'], ['verbindet das Heimnetz mit dem Internet', 'collega la rete di casa a Internet']]
};
const partTask = (rng: Rng, level: Difficulty) => {
  const k = pick(rng, Object.keys(PARTS));
  const fn = level >= 2;
  return choice({
    prompt: fn ? L('Was macht dieses Bauteil?', 'Che cosa fa questo componente?') : L('Wie heißt dieses Bauteil?', 'Come si chiama questo componente?'), pic: dev(k),
    right: tr(PARTS[k]![fn ? 1 : 0]), wrong: Object.values(PARTS).map((p) => tr(p[fn ? 1 : 0])), rng, explain: [`${tr(PARTS[k]![0])}: ${tr(PARTS[k]![1])}`]
  });
};
const NET: Record<string, Pair> = { A: ['Computer', 'computer'], B: ['Router', 'router'], C: ['Internet', 'Internet'], D: ['Server', 'server'], E: ['Smartphone im WLAN', 'smartphone in Wi-Fi'] };
const network = (rng: Rng) => {
  const m = pick(rng, Object.keys(NET));
  return choice({
    prompt: L(`Was ist ${m} im Netzwerk?`, `Che cosa è ${m} nella rete?`), pic: { id: 'netz', mark: m }, right: tr(NET[m]!), wrong: shuffle(rng, Object.values(NET).map(tr)), rng,
    hint: L('Die gestrichelte Linie ist eine Funkverbindung (WLAN).', 'La linea tratteggiata è un collegamento senza fili (Wi-Fi).'), explain: [tr(NET[m]!)]
  });
};
const wifi = (rng: Rng) => choice({
  prompt: L('Wie ist das Gerät E mit dem Router verbunden?', 'Come è collegato il dispositivo E al router?'), pic: { id: 'netz', mark: 'E' },
  right: L('kabellos über WLAN', 'senza fili, in Wi-Fi'), wrong: [L('mit einem Netzwerkkabel', 'con un cavo di rete'), L('über einen USB-Stick', 'con una chiavetta USB'), L('gar nicht', 'non è collegato')], rng,
  explain: [L('Gestrichelt = Funk (WLAN).', 'Linea tratteggiata = Wi-Fi.')]
});
const phishing = (rng: Rng) => choice({
  prompt: L('Du bekommst diese Nachricht. Was machst du?', 'Ricevi questo messaggio. Che cosa fai?'), pic: { id: 'phishing', variant: randInt(rng, 0, 1), lang: getLang() === 'it' ? 'it' : 'de' },
  right: L('Nicht klicken und einem Erwachsenen zeigen', 'Non clicco e lo mostro a un adulto'),
  wrong: [L('Schnell auf den Knopf klicken', 'Clicco subito sul pulsante'), L('Mein Passwort eingeben', 'Inserisco la mia password'), L('An alle Freunde weiterleiten', 'Lo inoltro a tutti gli amici')], rng,
  hint: L('Schau auf den Absender und die Eile.', 'Guarda il mittente e la fretta.'),
  explain: [L('Komischer Absender, Zeitdruck, Passwort gefragt: Das ist Phishing.', 'Mittente strano, fretta, richiesta di password: è phishing.')]
});
const phishSign = (rng: Rng) => choice({
  prompt: L('Woran erkennst du hier am besten, dass die Nachricht gefälscht ist?', 'Da che cosa capisci meglio che il messaggio è falso?'), pic: { id: 'phishing', variant: randInt(rng, 0, 1), lang: getLang() === 'it' ? 'it' : 'de' },
  right: L('an der seltsamen Absenderadresse', 'dall’indirizzo del mittente strano'),
  wrong: [L('an der Schriftgröße', 'dalla grandezza del testo'), L('an der Farbe des Fensters', 'dal colore della finestra'), L('Man kann es nicht erkennen.', 'Non si può capire.')], rng,
  explain: [L('Echte Firmen schreiben nicht von Adressen wie „paypa1-sicher.xyz“.', 'Le aziende vere non scrivono da indirizzi come «paypa1-sicher.xyz».')]
});
const PWS: [string, number][] = [['1234', 1], ['hallo', 1], ['Sonne2015', 2], ['Katze!Baum7', 3], ['Ro7!mi#Lu-92x', 4]];
const password = (rng: Rng) => {
  const [pw, lv] = pick(rng, PWS);
  const R: Pair[] = [['sehr schwach', 'molto debole'], ['schwach', 'debole'], ['mittel', 'media'], ['stark', 'forte']];
  return choice({
    prompt: L('Wie sicher ist dieses Passwort?', 'Quanto è sicura questa password?'), pic: { id: 'passwort', pw, level: lv },
    right: tr(R[lv - 1]!), wrong: R.map(tr), rng,
    hint: L('Lang, mit Groß- und Kleinbuchstaben, Zahlen und Zeichen = sicher.', 'Lunga, con maiuscole, minuscole, numeri e simboli = sicura.'), explain: [tr(R[lv - 1]!)]
  });
};

/* ---------- Binärzahlen ---------- */
const binary = (rng: Rng, level: Difficulty) => {
  const n = level === 1 ? 4 : level === 2 ? 6 : 8;
  const v = randInt(rng, level === 1 ? 1 : 5, 2 ** n - 1);
  const bits = v.toString(2).padStart(n, '0');
  const parts = bits.split('').map((b, i) => (b === '1' ? 2 ** (n - 1 - i) : 0)).filter(Boolean);
  return inputTask({
    prompt: L('Welche Dezimalzahl zeigen die Lampen? (an = 1, aus = 0)', 'Quale numero decimale mostrano le lampadine? (accesa = 1, spenta = 0)'),
    pic: { id: 'bits', bits, showValues: level < 3 }, answer: v,
    hint: level < 3 ? L('Addiere die Werte unter den leuchtenden Lampen.', 'Somma i valori sotto le lampadine accese.') : L('Die Stellenwerte von rechts: 1, 2, 4, 8, 16, 32, 64, 128.', 'I valori da destra: 1, 2, 4, 8, 16, 32, 64, 128.'),
    explain: [`${parts.join(' + ')} = ${v}`]
  });
};
const toBinary = (rng: Rng, level: Difficulty) => {
  const n = level === 1 ? 3 : 4;
  const v = randInt(rng, 1, 2 ** n - 1);
  const bits = v.toString(2).padStart(n, '0');
  const others = shuffle(rng, Array.from({ length: 2 ** n - 1 }, (_, i) => i + 1).filter((x) => x !== v)).slice(0, 3);
  return pickPicture({
    prompt: L(`Welche Lampen zeigen die Zahl ${v}?`, `Quali lampadine mostrano il numero ${v}?`),
    right: { pic: { id: 'bits', bits, showValues: true }, name: bits }, wrong: others.map((o) => ({ pic: { id: 'bits', bits: o.toString(2).padStart(n, '0'), showValues: true }, name: o.toString(2).padStart(n, '0') })), rng,
    explain: [`${v} = ${bits}`]
  });
};
const byteTask = (rng: Rng) => choice({
  prompt: L('Wie viele Bits hat ein Byte?', 'Quanti bit ha un byte?'), pic: { id: 'byte', bits: 8 }, right: '8', wrong: ['2', '4', '10', '16'], rng, big: true,
  hint: L('Zähle die Kästchen.', 'Conta le caselle.'), explain: [L('1 Byte = 8 Bit', '1 byte = 8 bit')]
});

/* ---------- Caesar ---------- */
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const caesar = (rng: Rng, level: Difficulty) => {
  const shift = level === 1 ? 1 : level === 2 ? randInt(rng, 2, 5) : randInt(rng, 3, 13);
  const words = getLang() === 'it' ? ['CANE', 'SOLE', 'MARE', 'LUNA', 'PANE', 'FIORE'] : ['HUND', 'SONNE', 'MOND', 'BAUM', 'HAUS', 'BALL'];
  const enc = (s: string) => s.split('').map((c) => A[(A.indexOf(c) + shift) % 26]).join('');
  const dec = level === 3 && rng() < 0.5;
  if (level === 1) {
    const ch = A[randInt(rng, 0, 24)]!;
    const r = enc(ch);
    return choice({
      prompt: L(`Verschlüssele den Buchstaben ${ch} mit der Scheibe (außen → innen).`, `Cifra la lettera ${ch} con il disco (esterno → interno).`), pic: { id: 'caesar', shift },
      right: r, wrong: [A[(A.indexOf(ch) + 2) % 26]!, A[(A.indexOf(ch) + 25) % 26]!, ch], rng, big: true, explain: [`${ch} → ${r}`]
    });
  }
  const w = pick(rng, words);
  const right = dec ? w : enc(w);
  const shown = dec ? enc(w) : w;
  const wrong = [w.split('').map((c) => A[(A.indexOf(c) + shift + 1) % 26]).join(''), w.split('').map((c) => A[(A.indexOf(c) + 26 - shift) % 26]).join(''), ...words.filter((x) => x !== w && x.length === w.length).slice(0, 1)];
  return choice({
    prompt: dec ? L(`Entschlüssele „${shown}“ (innen → außen).`, `Decifra «${shown}» (interno → esterno).`) : L(`Verschlüssele „${shown}“ (außen → innen).`, `Cifra «${shown}» (esterno → interno).`),
    pic: { id: 'caesar', shift }, right, wrong, rng,
    hint: L(`Jeder Buchstabe rückt um ${shift} weiter.`, `Ogni lettera avanza di ${shift}.`), explain: [`${shown} → ${right}`]
  });
};

/* ---------- Logikgatter ---------- */
const GATES = { AND: (a: number, b: number) => a & b, OR: (a: number, b: number) => a | b, XOR: (a: number, b: number) => a ^ b, NAND: (a: number, b: number) => 1 - (a & b), NOT: (a: number) => 1 - a } as const;
const gate = (rng: Rng, level: Difficulty) => {
  const pool = level === 1 ? (['AND', 'OR', 'NOT'] as const) : level === 2 ? (['AND', 'OR', 'NOT', 'XOR'] as const) : (['XOR', 'NAND', 'AND', 'OR'] as const);
  const type = pick(rng, [...pool]);
  const a = randInt(rng, 0, 1), b = randInt(rng, 0, 1);
  const out = type === 'NOT' ? GATES.NOT(a) : GATES[type](a, b);
  const RULE: Record<string, Pair> = {
    AND: ['AND: 1 nur, wenn beide Eingänge 1 sind.', 'AND: 1 solo se entrambi gli ingressi sono 1.'], OR: ['OR: 1, wenn mindestens ein Eingang 1 ist.', 'OR: 1 se almeno un ingresso è 1.'],
    XOR: ['XOR: 1, wenn genau ein Eingang 1 ist.', 'XOR: 1 se esattamente un ingresso è 1.'], NAND: ['NAND: das Gegenteil von AND.', 'NAND: il contrario di AND.'], NOT: ['NOT dreht um: 0 → 1, 1 → 0.', 'NOT inverte: 0 → 1, 1 → 0.']
  };
  return choice({
    prompt: L(`Was kommt am Ausgang des ${type === 'NAND' ? 'NAND-' : ''}Gatters heraus?`, `Che cosa esce dalla porta ${type === 'NAND' ? 'NAND ' : ''}logica?`), pic: { id: 'gatter', type, a, b },
    right: String(out), wrong: ['0', '1'], rng, big: true, hint: tr(RULE[type]!), explain: [tr(RULE[type]!)]
  });
};

/* ---------- Oberstufe: Sortieren, Graphen ---------- */
const bubble = (rng: Rng) => {
  const values = sample(rng, [3, 5, 7, 8, 11, 12, 14, 16, 19], 6);
  const i = randInt(rng, 0, 4);
  const swap = values[i]! > values[i + 1]!;
  return choice({
    prompt: L('Bubblesort (aufsteigend): Werden die beiden orangen Balken getauscht?', 'Bubble sort (crescente): le due barre arancioni vengono scambiate?'), pic: { id: 'sortieren', values, mark: [i, i + 1] },
    right: swap ? L('Ja, die linke Zahl ist größer.', 'Sì, il numero a sinistra è maggiore.') : L('Nein, sie stehen schon richtig.', 'No, sono già in ordine.'),
    wrong: [swap ? L('Nein, sie stehen schon richtig.', 'No, sono già in ordine.') : L('Ja, die linke Zahl ist größer.', 'Sì, il numero a sinistra è maggiore.'), L('Man tauscht immer.', 'Si scambiano sempre.')], rng,
    explain: [`${values[i]} ${swap ? '>' : '<'} ${values[i + 1]}`]
  });
};
const GRAPH_EDGES: [string, string][] = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['D', 'E']];
const shortest = (rng: Rng) => {
  const edges: [string, string, number][] = GRAPH_EDGES.map(([a, b]) => [a, b, randInt(rng, 1, 9)]);
  const dist: Record<string, number> = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity };
  const done = new Set<string>();
  while (done.size < 5) {
    const u = Object.keys(dist).filter((k) => !done.has(k)).sort((x, y) => dist[x]! - dist[y]!)[0]!;
    done.add(u);
    for (const [a, b, w] of edges) {
      const v = a === u ? b : b === u ? a : null;
      if (v && dist[u]! + w < dist[v]!) dist[v] = dist[u]! + w;
    }
  }
  return inputTask({
    prompt: L('Wie lang ist der kürzeste Weg von A (grün) nach E (rot)?', 'Quanto è lungo il percorso più breve da A (verde) a E (rosso)?'), pic: { id: 'graph', edges, from: 'A', to: 'E' }, answer: dist.E!,
    hint: L('Probiere die Wege über B, C und D aus und addiere die Zahlen.', 'Prova i percorsi passando per B, C e D e somma i numeri.'),
    explain: [L(`Kürzester Weg: ${dist.E}`, `Percorso più breve: ${dist.E}`), L('So arbeitet auch der Dijkstra-Algorithmus.', 'Così funziona anche l’algoritmo di Dijkstra.')]
  });
};

/* ---------- Programmieren ---------- */
const B = {
  rep: (n: number, body: Block[]): Block => ({ t: L(`wiederhole ${n}-mal`, `ripeti ${n} volte`), c: 'loop', body }),
  go: (n: number): Block => ({ t: n === 1 ? L('gehe 1 Schritt', 'avanza di 1 passo') : L(`gehe ${n} Schritte`, `avanza di ${n} passi`), c: 'move' }),
  turn: (deg: number, right = true): Block => ({ t: right ? L(`drehe dich ${deg}° nach rechts`, `gira a destra di ${deg}°`) : L(`drehe dich ${deg}° nach links`, `gira a sinistra di ${deg}°`), c: 'turn' })
};
const turtle = (n: number, angle: number): [number, number][] => {
  const pts: [number, number][] = [[0, 0]];
  let x = 0, y = 0, a = 90;
  for (let i = 0; i < n; i++) {
    x += Math.cos((a * Math.PI) / 180) * 10; y += Math.sin((a * Math.PI) / 180) * 10;
    pts.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
    a -= angle;
  }
  return pts.slice(0, -1);
};
const SHAPES: [number, number, Pair][] = [[3, 120, ['Dreieck', 'triangolo']], [4, 90, ['Quadrat', 'quadrato']], [5, 72, ['Fünfeck', 'pentagono']], [6, 60, ['Sechseck', 'esagono']], [8, 45, ['Achteck', 'ottagono']]];
const shapeProgram = (rng: Rng, level: Difficulty) => {
  const pool = level === 1 ? SHAPES.slice(0, 3) : SHAPES;
  const [n, ang, name] = pick(rng, pool);
  const others = shuffle(rng, SHAPES.filter((s) => s[0] !== n)).slice(0, 3);
  return pickPicture({
    prompt: L('Welche Figur zeichnet der Roboter mit diesem Programm?', 'Quale figura disegna il robot con questo programma?'),
    visual: { id: 'bloecke', prog: [B.rep(n, [B.go(50), B.turn(ang)])] },
    right: { pic: { id: 'turtle', pts: turtle(n, ang) }, name: tr(name) }, wrong: others.map((s) => ({ pic: { id: 'turtle', pts: turtle(s[0], s[1]) }, name: tr(s[2]) })), rng,
    hint: L('Zähle die Wiederholungen: So viele Seiten hat die Figur.', 'Conta le ripetizioni: sono i lati della figura.'),
    explain: [L(`${n} Seiten, ${n} · ${ang}° = 360°: ${name[0]}`, `${n} lati, ${n} · ${ang}° = 360°: ${name[1]}`)]
  });
};
const turnAngle = (rng: Rng) => {
  const [n, ang, name] = pick(rng, SHAPES);
  return choice({
    prompt: L(`Der Roboter soll ein ${name[0]} zeichnen. Um wie viel Grad muss er sich jedes Mal drehen?`, `Il robot deve disegnare un ${name[1]}. Di quanti gradi deve girare ogni volta?`),
    pic: { id: 'bloecke', prog: [B.rep(n, [B.go(50), { t: L('drehe dich ?° nach rechts', 'gira a destra di ?°'), c: 'turn' }])] },
    right: `${ang}°`, wrong: SHAPES.map((s) => `${s[1]}°`).concat(['180°']), rng, big: false,
    hint: L('Alle Drehungen zusammen ergeben 360°.', 'Tutte le rotazioni insieme fanno 360°.'), explain: [`360° : ${n} = ${ang}°`]
  });
};
const loopSteps = (rng: Rng, level: Difficulty) => {
  if (level === 3) {
    const a = randInt(rng, 2, 4), b = randInt(rng, 2, 4), k = randInt(rng, 2, 5);
    return inputTask({
      prompt: L('Wie viele Schritte geht die Figur insgesamt?', 'Quanti passi fa in tutto il personaggio?'), pic: { id: 'bloecke', prog: [B.rep(a, [B.rep(b, [B.go(k)])])] }, answer: a * b * k,
      hint: L('Innere Schleife zuerst: Wie viele Schritte pro äußerer Runde?', 'Prima il ciclo interno: quanti passi per ogni giro esterno?'), explain: [`${a} · ${b} · ${k} = ${a * b * k}`]
    });
  }
  const n = randInt(rng, 2, level === 1 ? 4 : 6), k = randInt(rng, level === 1 ? 1 : 3, level === 1 ? 3 : 10);
  const extra = level === 2 ? randInt(rng, 1, 5) : 0;
  const prog = [B.rep(n, [B.go(k)]), ...(extra ? [B.go(extra)] : [])];
  return inputTask({
    prompt: L('Wie viele Schritte geht die Figur insgesamt?', 'Quanti passi fa in tutto il personaggio?'), pic: { id: 'bloecke', prog }, answer: n * k + extra,
    hint: L('Wiederholungen mal Schritte.', 'Ripetizioni per passi.'), explain: [extra ? `${n} · ${k} + ${extra} = ${n * k + extra}` : `${n} · ${k} = ${n * k}`]
  });
};
const variable = (rng: Rng, level: Difficulty) => {
  const s = randInt(rng, 0, 10), n = randInt(rng, 2, level === 1 ? 3 : 6), d = randInt(rng, 1, level === 1 ? 3 : 9);
  const minus = level === 3 && rng() < 0.5 && s + 10 >= n * d;
  const start = minus ? s + n * d : s;
  const res = minus ? start - n * d : start + n * d;
  const v = L('Punkte', 'punti');
  return inputTask({
    prompt: L(`Welchen Wert hat „${v}“ am Ende?`, `Quanto vale «${v}» alla fine?`),
    pic: { id: 'bloecke', prog: [{ t: L(`setze ${v} auf ${start}`, `imposta ${v} a ${start}`), c: 'var' }, B.rep(n, [{ t: L(`ändere ${v} um ${minus ? -d : d}`, `cambia ${v} di ${minus ? -d : d}`), c: 'var' }])] },
    answer: res, hint: L('Start plus Wiederholungen mal Änderung.', 'Valore iniziale più ripetizioni per variazione.'),
    explain: [`${start} ${minus ? '−' : '+'} ${n} · ${d} = ${res}`]
  });
};
const ifBlock = (rng: Rng) => {
  const x = randInt(rng, 1, 20), lim = randInt(rng, 5, 15);
  const yes = L('„Super!“', '«Bravo!»'), no = L('„Weiter üben“', '«Continua così»');
  return choice({
    prompt: L(`Punkte ist ${x}. Was sagt die Figur?`, `punti vale ${x}. Che cosa dice il personaggio?`),
    pic: { id: 'bloecke', prog: [{ t: L(`falls Punkte > ${lim}`, `se punti > ${lim}`), c: 'if', body: [{ t: L('sage „Super!“', 'di’ «Bravo!»'), c: 'say' }] }, { t: L('sonst', 'altrimenti'), c: 'if', body: [{ t: L('sage „Weiter üben“', 'di’ «Continua così»'), c: 'say' }] }] },
    right: x > lim ? yes : no, wrong: [yes, no, L('nichts', 'niente')], rng,
    explain: [`${x} ${x > lim ? '>' : '≤'} ${lim}`]
  });
};
const pyPrint = (rng: Rng, level: Difficulty) => {
  if (level === 1) {
    const n = randInt(rng, 2, 6);
    return inputTask({
      prompt: L('Wie oft wird „Hallo“ ausgegeben?', 'Quante volte viene stampato «Ciao»?'),
      pic: { id: 'bloecke', prog: [{ t: `for i in range(${n}):`, c: 'loop', body: [{ t: getLang() === 'it' ? 'print("Ciao")' : 'print("Hallo")', c: 'say' }] }] }, answer: n,
      hint: L(`range(${n}) zählt 0 bis ${n - 1}.`, `range(${n}) conta da 0 a ${n - 1}.`), explain: [L(`${n}-mal`, `${n} volte`)]
    });
  }
  const x = randInt(rng, 1, 5), n = randInt(rng, 2, 4), d = randInt(rng, 2, 5);
  const mult = level === 3;
  const res = mult ? x * d ** n : x + n * d;
  return inputTask({
    prompt: L('Welche Zahl gibt das Programm aus?', 'Quale numero stampa il programma?'),
    pic: { id: 'bloecke', prog: [{ t: `x = ${x}`, c: 'var' }, { t: `for i in range(${n}):`, c: 'loop', body: [{ t: mult ? `x = x * ${d}` : `x = x + ${d}`, c: 'var' }] }, { t: 'print(x)', c: 'say' }] },
    answer: res, hint: L('Gehe die Schleife Runde für Runde durch.', 'Esegui il ciclo giro per giro.'),
    explain: [mult ? `${x} · ${d}^${n} = ${res}` : `${x} + ${n} · ${d} = ${res}`]
  });
};
const bugFind = (rng: Rng) => {
  const v = randInt(rng, 0, 2);
  const [n, ang, name] = v === 0 ? [4, 60, SHAPES[1]![2]] as const : v === 1 ? [3, 90, SHAPES[0]![2]] as const : [3, 90, SHAPES[1]![2]] as const;
  const loopB = B.rep(n, [B.go(50), B.turn(ang)]);
  const wrongLine = v === 2 ? loopB.t : B.turn(ang).t;
  const fix = v === 0 ? L('Es muss 90° heißen.', 'Deve essere 90°.') : v === 1 ? L('Es muss 120° heißen.', 'Deve essere 120°.') : L('Es muss 4-mal heißen.', 'Devono essere 4 volte.');
  return choice({
    prompt: L(`Der Roboter soll ein ${name[0]} zeichnen. Welcher Block ist falsch?`, `Il robot deve disegnare un ${name[1]}. Quale blocco è sbagliato?`), pic: { id: 'bloecke', prog: [loopB] },
    right: wrongLine, wrong: [loopB.t, B.go(50).t, B.turn(ang).t], rng,
    hint: L('Seitenzahl mal Drehwinkel muss 360° ergeben.', 'Numero di lati per angolo deve fare 360°.'), explain: [fix]
  });
};
const FLOWS: { steps: Pair[]; ask: number; wrong: Pair[] }[] = [
  { steps: [['Zahnpasta auf Bürste', 'dentifricio sullo spazzolino'], ['Zähne putzen', 'lavare i denti'], ['Mund ausspülen', 'sciacquare la bocca']], ask: 1, wrong: [['ins Bett gehen', 'andare a letto'], ['Schuhe anziehen', 'mettere le scarpe']] },
  { steps: [['Topf mit Wasser füllen', 'riempire la pentola'], ['Wasser kochen', 'far bollire l’acqua'], ['Nudeln hineingeben', 'buttare la pasta']], ask: 1, wrong: [['Nudeln essen', 'mangiare la pasta'], ['Tisch abräumen', 'sparecchiare']] },
  { steps: [['Schulranzen packen', 'preparare lo zaino'], ['Jacke anziehen', 'mettere la giacca'], ['zur Schule gehen', 'andare a scuola']], ask: 2, wrong: [['aufstehen', 'alzarsi'], ['Abendessen', 'cenare']] },
  { steps: [['Erde in den Topf', 'terra nel vaso'], ['Samen hineinlegen', 'mettere il seme'], ['gießen', 'innaffiare']], ask: 2, wrong: [['Blume pflücken', 'cogliere il fiore'], ['Topf kaufen', 'comprare il vaso']] }
];
const flowMissing = (rng: Rng) => {
  const f = pick(rng, FLOWS);
  return choice({
    prompt: L('Welcher Schritt fehlt im Ablauf?', 'Quale passo manca nel diagramma?'), pic: { id: 'ablauf', steps: f.steps.map((s, i) => (i === f.ask ? '?' : tr(s))) },
    right: tr(f.steps[f.ask]!), wrong: f.wrong.map(tr).concat(f.steps.filter((_, i) => i !== f.ask).map(tr)), rng,
    hint: L('Lies von oben nach unten.', 'Leggi dall’alto verso il basso.'), explain: [f.steps.map(tr).join(' → ')]
  });
};
const COND: { cond: Pair; yes: Pair; no: Pair; ask: Pair; ans: 'yes' | 'no' }[] = [
  { cond: ['Regnet es?', 'Piove?'], yes: ['Schirm', 'ombrello'], no: ['Kappe', 'cappello'], ask: ['Es regnet. Was nimmst du mit?', 'Piove. Che cosa prendi?'], ans: 'yes' },
  { cond: ['Ampel grün?', 'Verde?'], yes: ['gehen', 'vai'], no: ['warten', 'aspetta'], ask: ['Die Ampel ist rot. Was passiert?', 'Il semaforo è rosso. Che cosa succede?'], ans: 'no' },
  { cond: ['Zahl gerade?', 'Numero pari?'], yes: ['links', 'sinistra'], no: ['rechts', 'destra'], ask: ['Die Zahl ist 7. Wohin geht es?', 'Il numero è 7. Dove si va?'], ans: 'no' },
  { cond: ['Punkte > 10?', 'Punti > 10?'], yes: ['Sieg', 'vinto'], no: ['nochmal', 'riprova'], ask: ['Du hast 14 Punkte. Was kommt heraus?', 'Hai 14 punti. Che cosa succede?'], ans: 'yes' }
];
const flowCond = (rng: Rng) => {
  const c = pick(rng, COND);
  const right = tr(c.ans === 'yes' ? c.yes : c.no);
  return choice({
    prompt: tr(c.ask), pic: { id: 'ablauf', steps: [], cond: tr(c.cond), yes: tr(c.yes), no: tr(c.no) },
    right, wrong: [tr(c.yes), tr(c.no), L('Das Programm stoppt.', 'Il programma si ferma.')], rng,
    hint: L('✓ heißt ja, ✗ heißt nein.', '✓ significa sì, ✗ significa no.'), explain: [`${tr(c.cond)} → ${c.ans === 'yes' ? '✓' : '✗'} → ${right}`]
  });
};

export const TECH_PICS: PicBank = {
  'info-computer': [gen(deviceName, 1), gen(pickDevice, 1), gen(inOut, 2), gen(phishing, 2), gen(password, 3), gen(phishSign, 3)],
  'info-hardware-netz': [gen(partTask, 1), gen(network, 1), gen(byteTask, 1), gen(wifi, 2), gen(partTask, 2), gen(phishSign, 2), gen(network, 3), gen(partTask, 3)],
  'info-binaer': [gen(binary, 1), gen(toBinary, 1), gen(binary, 2), gen(toBinary, 2), gen(binary, 3), gen(byteTask, 3)],
  'info-caesar': [gen(caesar, 1), gen(caesar, 2), gen(caesar, 3)],
  'info-logik': [gen(gate, 1), gen(gate, 2), gen(gate, 3)],
  'info-oberstufe': [gen(bubble, 1), gen(binary, 1), gen(shortest, 2), gen(gate, 2), gen(shortest, 3), gen(bubble, 3)],
  'code-ablauf': [gen(flowMissing, 1), gen(flowCond, 1), gen(flowCond, 2), gen(flowMissing, 2), gen(flowCond, 3)],
  'code-roboter': [gen(shapeProgram, 1), gen(loopSteps, 1), gen(shapeProgram, 2), gen(turnAngle, 3), gen(shapeProgram, 3)],
  'code-schleifen': [gen(loopSteps, 1), gen(shapeProgram, 1), gen(loopSteps, 2), gen(turnAngle, 2), gen(loopSteps, 3)],
  'code-bloecke': [gen(variable, 1), gen(shapeProgram, 1), gen(ifBlock, 2), gen(variable, 2), gen(variable, 3), gen(bugFind, 3)],
  'code-python': [gen(pyPrint, 1), gen(pyPrint, 2), gen(pyPrint, 3)],
  'code-bugs': [gen(bugFind, 1), gen(pyPrint, 2), gen(bugFind, 2), gen(turnAngle, 3), gen(pyPrint, 3)]
} satisfies Record<string, PicGen[]>;
