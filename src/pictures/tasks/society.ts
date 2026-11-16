import type { Difficulty, Rng } from '../../learning/types';
import { pick, randInt, sample, shuffle } from '../../lib/random';
import { L, num } from '../../i18n';
import type { Pic } from '../types';
import { choice, gen, inputTask, pickPicture, type PicBank, type PicGen } from './helpers';

/* Geschichte, Geographie, Religion und Ethik */

type Pair = [string, string];
const tr = (p: Pair) => L(p[0], p[1]);
const hist = (kind: string): Pic => ({ id: 'geschichte', kind });

/* ---------- Geschichte ---------- */

/** Bild → Zeit/Kultur */
const ERA: Record<string, Pair> = {
  hoehle: ['Steinzeit', 'Preistoria (età della pietra)'],
  faustkeil: ['Steinzeit', 'Preistoria (età della pietra)'],
  pyramide: ['Altes Ägypten', 'Antico Egitto'],
  tempel: ['Antikes Griechenland', 'Antica Grecia'],
  aquaedukt: ['Römisches Reich', 'Impero romano'],
  burg: ['Mittelalter', 'Medioevo'],
  ritterhelm: ['Mittelalter', 'Medioevo'],
  karavelle: ['Zeitalter der Entdeckungen', 'Età delle scoperte geografiche'],
  dampflok: ['Industrialisierung', 'Rivoluzione industriale'],
  zeitung: ['Neuzeit (Buchdruck und Zeitungen)', 'Età moderna (stampa e giornali)'],
  rakete: ['20. Jahrhundert', 'Novecento']
};
const NAME: Record<string, Pair> = {
  hoehle: ['Höhlenmalerei', 'pittura rupestre'], faustkeil: ['Faustkeil', 'amigdala (selce scheggiata)'], pyramide: ['Pyramide', 'piramide'],
  tempel: ['Tempel', 'tempio'], aquaedukt: ['Aquädukt', 'acquedotto'], burg: ['Burg', 'castello'],
  ritterhelm: ['Ritterhelm', 'elmo da cavaliere'], karavelle: ['Karavelle', 'caravella'], dampflok: ['Dampflokomotive', 'locomotiva a vapore'],
  zeitung: ['Zeitung', 'giornale'], rakete: ['Rakete', 'razzo']
};
const eraOf = (kinds: string[]) => (rng: Rng) => {
  const k = pick(rng, kinds);
  const right = tr(ERA[k]!);
  return choice({
    prompt: L(`Zu welcher Zeit passt das Bild (${NAME[k]![0]})?`, `A quale epoca appartiene l’immagine (${NAME[k]![1]})?`),
    pic: hist(k), right, wrong: shuffle(rng, Object.values(ERA).map(tr)), rng,
    hint: L('Überlege, welche Werkzeuge und Bauten es damals gab.', 'Pensa a quali strumenti e costruzioni esistevano allora.'),
    explain: [`${tr(NAME[k]!)}: ${right}`]
  });
};
const whichPicture = (kinds: string[], ask: (k: string) => string) => (rng: Rng) => {
  const ks = sample(rng, kinds.filter((k, i, a) => a.findIndex((x) => ERA[x]![0] === ERA[k]![0]) === i), 4);
  const r = ks[0]!;
  return pickPicture({ prompt: ask(r), right: { pic: hist(r), name: tr(NAME[r]!) }, wrong: ks.slice(1).map((k) => ({ pic: hist(k), name: tr(NAME[k]!) })), rng, explain: [`${tr(NAME[r]!)}: ${tr(ERA[r]!)}`] });
};
const ANTIQUE = ['hoehle', 'faustkeil', 'pyramide', 'tempel', 'aquaedukt'];
const ALL_HIST = Object.keys(ERA);

const COLS: Record<string, Pair> = { dorisch: ['dorisch', 'dorico'], ionisch: ['ionisch', 'ionico'], korinthisch: ['korinthisch', 'corinzio'] };
const column = (rng: Rng) => {
  const o = pick(rng, Object.keys(COLS));
  return choice({
    prompt: L('Welche Säulenordnung zeigt das Bild?', 'Quale ordine architettonico mostra l’immagine?'), pic: { id: 'saeule', order: o },
    right: tr(COLS[o]!), wrong: Object.values(COLS).map(tr), rng,
    hint: L('Schau auf das Kapitell oben: schlicht, Schnecken oder Blätter?', 'Guarda il capitello: semplice, a volute o a foglie?'),
    explain: [L('dorisch: schlicht · ionisch: Schnecken (Voluten) · korinthisch: Akanthusblätter', 'dorico: semplice · ionico: volute · corinzio: foglie d’acanto')]
  });
};

const archStyle = (rng: Rng) => {
  const k = pick(rng, ['rundbogen', 'spitzbogen']);
  const R: Record<string, Pair> = { rundbogen: ['Romanik', 'romanico'], spitzbogen: ['Gotik', 'gotico'] };
  return choice({
    prompt: L('Zu welchem Baustil gehört dieser Bogen?', 'A quale stile appartiene questo arco?'), pic: hist(k),
    right: tr(R[k]!), wrong: [tr(R.rundbogen!), tr(R.spitzbogen!), L('Barock', 'barocco'), L('Klassizismus', 'neoclassico')], rng,
    hint: L('Rund oder spitz?', 'Arco tondo o a punta?'),
    explain: [L('Rundbogen: Romanik. Spitzbogen: Gotik.', 'Arco a tutto sesto: romanico. Arco a sesto acuto: gotico.')]
  });
};

const FEUDAL: Pair[] = [['König', 're'], ['Fürsten, Bischöfe', 'grandi vassalli'], ['Ritter, Äbte', 'valvassori'], ['Bauern', 'contadini e servi']];
const feudal = (rng: Rng) => {
  const ask = randInt(rng, 0, 3);
  return choice({
    prompt: L('Lehnspyramide: Wer gehört an die Stelle mit dem Fragezeichen?', 'Piramide feudale: chi va al posto del punto interrogativo?'),
    pic: { id: 'staende', ask, labels: FEUDAL.map(tr) }, right: tr(FEUDAL[ask]!), wrong: FEUDAL.map(tr), rng,
    hint: L('Oben stehen wenige Mächtige, unten sehr viele Menschen.', 'In alto pochi potenti, in basso moltissime persone.'),
    explain: [FEUDAL.map(tr).join(' → ')]
  });
};

interface Ev { y: number; de: string; it: string; c?: 'DE' | 'IT' }
/** Zeitleiste mit Fragezeichen: Welches Ereignis fehlt? */
const timeline = (from: number, to: number, evs: Ev[], n = 4) => (rng: Rng) => {
  const pool = evs.filter((e) => !e.c || e.c === (L('DE', 'IT') as 'DE' | 'IT'));
  const chosen = sample(rng, pool, Math.min(n, pool.length)).sort((a, b) => a.y - b.y);
  const ask = randInt(rng, 0, chosen.length - 1);
  const lab = (e: Ev) => L(e.de, e.it);
  return choice({
    prompt: L('Welches Ereignis gehört an die gelbe Stelle der Zeitleiste?', 'Quale evento va nel punto giallo della linea del tempo?'),
    pic: { id: 'zeitleiste', from, to, events: chosen.map((e) => ({ y: e.y, label: lab(e) })), ask },
    right: lab(chosen[ask]!), wrong: shuffle(rng, pool.filter((e) => e !== chosen[ask]).map(lab)), rng,
    hint: L('Achte auf die Jahreszahl unter dem Punkt.', 'Guarda l’anno sotto il punto.'),
    explain: [`${chosen[ask]!.y < 0 ? `${-chosen[ask]!.y} ${L('v. Chr.', 'a.C.')}` : chosen[ask]!.y}: ${lab(chosen[ask]!)}`]
  });
};
const EV_ANTIKE: Ev[] = [
  { y: -2600, de: 'Pyramiden', it: 'piramidi' }, { y: -776, de: 'erste Olympische Spiele', it: 'prime Olimpiadi' },
  { y: -753, de: 'Gründung Roms (Sage)', it: 'fondazione di Roma' }, { y: -44, de: 'Tod Caesars', it: 'morte di Cesare' },
  { y: 476, de: 'Ende Westroms', it: 'fine dell’Impero d’Occidente' }, { y: -3200, de: 'Schrift entsteht', it: 'nasce la scrittura' }
];
const EV_MA: Ev[] = [
  { y: 800, de: 'Karl der Große wird Kaiser', it: 'Carlo Magno imperatore' }, { y: 1096, de: 'Erster Kreuzzug', it: 'prima crociata' },
  { y: 1348, de: 'Pest in Europa', it: 'peste nera' }, { y: 1492, de: 'Kolumbus erreicht Amerika', it: 'Colombo arriva in America' },
  { y: 1077, de: 'Gang nach Canossa', it: 'umiliazione di Canossa' }, { y: 1215, de: 'Magna Carta', it: 'Magna Charta' }
];
const EV_NZ: Ev[] = [
  { y: 1450, de: 'Buchdruck (Gutenberg)', it: 'stampa a caratteri mobili' }, { y: 1492, de: 'Kolumbus erreicht Amerika', it: 'Colombo arriva in America' },
  { y: 1517, de: 'Reformation (Luther)', it: 'Riforma protestante' }, { y: 1789, de: 'Französische Revolution', it: 'Rivoluzione francese' },
  { y: 1815, de: 'Wiener Kongress', it: 'Congresso di Vienna' }, { y: 1871, de: 'Gründung des Deutschen Reichs', it: 'Unificazione tedesca', c: 'DE' },
  { y: 1861, de: 'Einigung Italiens', it: 'Unità d’Italia', c: 'IT' }, { y: 1848, de: 'Revolution von 1848', it: 'moti del 1848' }
];
const EV_20: Ev[] = [
  { y: 1914, de: 'Erster Weltkrieg beginnt', it: 'inizia la Prima guerra mondiale' }, { y: 1939, de: 'Zweiter Weltkrieg beginnt', it: 'inizia la Seconda guerra mondiale' },
  { y: 1945, de: 'Ende des Zweiten Weltkriegs', it: 'fine della Seconda guerra mondiale' }, { y: 1969, de: 'Mondlandung', it: 'sbarco sulla Luna' },
  { y: 1989, de: 'Fall der Berliner Mauer', it: 'caduta del Muro di Berlino' }, { y: 1949, de: 'Grundgesetz', it: 'Germania divisa in due Stati', c: 'DE' },
  { y: 1990, de: 'Deutsche Einheit', it: 'riunificazione tedesca', c: 'DE' }, { y: 1946, de: 'Italien wird Republik', it: 'nasce la Repubblica italiana', c: 'IT' },
  { y: 1957, de: 'Römische Verträge', it: 'Trattati di Roma' }
];
const EPOCHS: { from: number; to: number; de: string; it: string }[] = [
  { from: -800, to: 476, de: 'Antike', it: 'Età antica' }, { from: 476, to: 1492, de: 'Mittelalter', it: 'Medioevo' },
  { from: 1492, to: 1789, de: 'Frühe Neuzeit', it: 'Età moderna' }, { from: 1789, to: 2000, de: 'Moderne', it: 'Età contemporanea' }
];
const epochBand = (rng: Rng) => {
  const m = randInt(rng, 0, EPOCHS.length - 1);
  return choice({
    prompt: L('Welche Epoche gehört in das gelbe Feld?', 'Quale epoca va nel riquadro giallo?'),
    pic: { id: 'zeitleiste', from: -800, to: 2000, bands: EPOCHS.map((e) => ({ from: e.from, to: e.to, label: L(e.de, e.it) })), markBand: m },
    right: L(EPOCHS[m]!.de, EPOCHS[m]!.it), wrong: EPOCHS.map((e) => L(e.de, e.it)), rng,
    hint: L('476: Ende Westroms · 1492: Kolumbus · 1789: Französische Revolution', '476: fine dell’Impero romano d’Occidente · 1492: Colombo · 1789: Rivoluzione francese'),
    explain: [`${L(EPOCHS[m]!.de, EPOCHS[m]!.it)}: ${EPOCHS[m]!.from < 0 ? `${-EPOCHS[m]!.from} ${L('v. Chr.', 'a.C.')}` : EPOCHS[m]!.from}–${EPOCHS[m]!.to}`]
  });
};

/** Sitzverteilung: Welche Koalition hat die Mehrheit? */
const coalition = (rng: Rng) => {
  let seats: number[] = [];
  let ok: string[] = [], bad: string[] = [];
  for (let t = 0; t < 30; t++) {
    const a = randInt(rng, 22, 40), b = randInt(rng, 15, 30), c = randInt(rng, 8, 20);
    seats = [a, b, c, 100 - a - b - c];
    if (seats[3]! < 5) continue;
    ok = []; bad = [];
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) (seats[i]! + seats[j]! > 50 ? ok : bad).push(`${'ABCD'[i]} + ${'ABCD'[j]}`);
    if (ok.length && bad.length >= 2) break;
  }
  if (!ok.length || bad.length < 2) { seats = [38, 27, 21, 14]; ok = ['A + B', 'A + C', 'A + D']; bad = ['B + C', 'B + D', 'C + D']; }
  const right = pick(rng, ok);
  return choice({
    prompt: L('Das Parlament hat 100 Sitze. Welche Koalition hat die Mehrheit?', 'Il parlamento ha 100 seggi. Quale coalizione ha la maggioranza?'),
    pic: { id: 'parlament', seats }, right, wrong: shuffle(rng, bad), rng,
    hint: L('Für die Mehrheit braucht man mehr als die Hälfte: mindestens 51 Sitze.', 'Per la maggioranza serve più della metà: almeno 51 seggi.'),
    explain: [`${right}: ${right.split(' + ').map((p) => seats['ABCD'.indexOf(p)]).join(' + ')} > 50`]
  });
};
const majority = (rng: Rng) => {
  const total = pick(rng, [60, 80, 100, 120]);
  const a = Math.round(total * 0.36), b = Math.round(total * 0.28), c = Math.round(total * 0.2);
  const seats = [a, b, c, total - a - b - c];
  return inputTask({
    prompt: L(`Insgesamt gibt es ${total} Sitze. Wie viele Sitze braucht eine absolute Mehrheit mindestens?`, `In tutto ci sono ${total} seggi. Quanti seggi servono almeno per la maggioranza assoluta?`),
    pic: { id: 'parlament', seats }, answer: total / 2 + 1,
    hint: L('Mehr als die Hälfte.', 'Più della metà.'),
    explain: [`${total} : 2 = ${total / 2}`, `${total / 2} + 1 = ${total / 2 + 1}`]
  });
};

const GE_ANTIKE: PicGen[] = [
  gen(eraOf(ANTIQUE), 1), gen(whichPicture(ANTIQUE, (k) => L(`Was gehört zu: ${ERA[k]![0]}?`, `Che cosa appartiene a: ${ERA[k]![1]}?`)), 1),
  gen(eraOf(ANTIQUE), 2), gen(timeline(-3300, 500, EV_ANTIKE, 4), 2),
  gen(column, 3), gen(timeline(-3300, 500, EV_ANTIKE, 5), 3)
];
const GE_MA: PicGen[] = [
  gen(eraOf(['burg', 'ritterhelm', 'pyramide', 'dampflok', 'tempel']), 1), gen(feudal, 1),
  gen(archStyle, 2), gen(timeline(700, 1500, EV_MA, 4), 2),
  gen(feudal, 3), gen(timeline(700, 1500, EV_MA, 5), 3)
];
const GE_NZ: PicGen[] = [
  gen(eraOf(['karavelle', 'dampflok', 'zeitung', 'burg', 'aquaedukt']), 1), gen(whichPicture(['karavelle', 'dampflok', 'burg', 'pyramide', 'rakete'], (k) => L(`Was passt zu: ${ERA[k]![0]}?`, `Che cosa si collega a: ${ERA[k]![1]}?`)), 1),
  gen(timeline(1400, 1900, EV_NZ, 4), 2), gen(eraOf(ALL_HIST), 2),
  gen(timeline(1400, 1900, EV_NZ, 5), 3), gen(epochBand, 3)
];
const GE_20: PicGen[] = [
  gen(timeline(1900, 2000, EV_20, 4), 1), gen(eraOf(['rakete', 'dampflok', 'karavelle', 'burg']), 1),
  gen(majority, 2), gen(timeline(1900, 2000, EV_20, 5), 2),
  gen(coalition, 3), gen(timeline(1900, 2000, EV_20, 5), 3)
];
const GE_OBER: PicGen[] = [gen(epochBand, 1), gen(majority, 1), gen(coalition, 2), gen(timeline(1400, 1900, EV_NZ, 5), 2), gen(coalition, 3), gen(timeline(1900, 2000, EV_20, 5), 3)];

/* ---------- Geographie ---------- */
const DIRS: Pair[] = [['Norden', 'nord'], ['Nordosten', 'nord-est'], ['Osten', 'est'], ['Südosten', 'sud-est'], ['Süden', 'sud'], ['Südwesten', 'sud-ovest'], ['Westen', 'ovest'], ['Nordwesten', 'nord-ovest']];
const compass = (rng: Rng, level: Difficulty) => {
  const four = [0, 2, 4, 6];
  const d = level === 1 ? pick(rng, four) : randInt(rng, 0, 7);
  return choice({
    prompt: L('In welche Himmelsrichtung zeigt der rote Pfeil?', 'Verso quale punto cardinale indica la freccia rossa?'), pic: { id: 'kompass', dir: d },
    right: tr(DIRS[d]!), wrong: shuffle(rng, (level === 1 ? four : [0, 1, 2, 3, 4, 5, 6, 7]).map((i) => tr(DIRS[i]!))), rng,
    hint: L('Norden ist oben. Im Uhrzeigersinn: Norden, Osten, Süden, Westen.', 'Il nord è in alto. In senso orario: nord, est, sud, ovest.'), explain: [tr(DIRS[d]!)]
  });
};
const PLACES: [string, string, string, string][] = [['stadt', 'B2', 'die Stadt', 'la città'], ['see', 'C3', 'der See', 'il lago'], ['wald', 'A4', 'der Wald', 'il bosco'], ['berge', 'D1', 'die Berge', 'le montagne'], ['burg', 'A1', 'die Burg', 'il castello'], ['hafen', 'D4', 'der Hafen', 'il porto'], ['bruecke', 'B3', 'die Brücke', 'il ponte']];
const gridCell = (rng: Rng) => {
  const [k, cell, de, it] = pick(rng, PLACES);
  return choice({
    prompt: L(`In welchem Planquadrat liegt ${de}?`, `In quale riquadro si trova ${it}?`), pic: { id: 'karte', mark: k },
    right: cell, wrong: shuffle(rng, PLACES.map((p) => p[1]).concat(['C2', 'A3'])), rng, big: true,
    hint: L('Erst den Buchstaben oben, dann die Zahl links.', 'Prima la lettera in alto, poi il numero a sinistra.'), explain: [`${L(de, it)}: ${cell}`]
  });
};
const whatInCell = (rng: Rng) => {
  const [, cell, de, it] = pick(rng, PLACES);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return choice({
    prompt: L(`Was liegt im Planquadrat ${cell}?`, `Che cosa si trova nel riquadro ${cell}?`), pic: { id: 'karte' },
    right: cap(L(de, it)), wrong: shuffle(rng, PLACES.map((p) => cap(L(p[2], p[3])))), rng,
    hint: L('Finde zuerst die Spalte (Buchstabe), dann die Zeile (Zahl).', 'Trova prima la colonna (lettera), poi la riga (numero).'), explain: [`${cell}: ${L(de, it)}`]
  });
};
const SCALES: [string, number][] = [['1 : 100 000', 1], ['1 : 50 000', 0.5], ['1 : 200 000', 2], ['1 : 25 000', 0.25], ['1 : 1 000 000', 10]];
const scaleTask = (rng: Rng, level: Difficulty) => {
  const pool = level === 1 ? SCALES.slice(0, 1) : level === 2 ? SCALES.slice(0, 3) : SCALES;
  let s = pick(rng, pool), cm = randInt(rng, 2, 6);
  if (s[1] === 0.25) cm = pick(rng, [4, 8]);
  if (s[1] === 0.5) cm = pick(rng, [2, 4, 6]);
  if (!Number.isInteger(cm * s[1])) s = SCALES[0]!;
  const km = cm * s[1];
  return inputTask({
    prompt: L(`Auf der Karte sind die Orte ${cm} cm entfernt. Wie viele Kilometer sind das in Wirklichkeit?`, `Sulla carta i due luoghi distano ${cm} cm. Quanti chilometri sono nella realtà?`),
    pic: { id: 'massstab', cm, scale: s[0] }, answer: km,
    hint: L('Bei 1 : 100 000 ist 1 cm = 1 km.', 'Con scala 1 : 100 000, 1 cm = 1 km.'),
    explain: [L(`1 cm = ${num(s[1])} km`, `1 cm = ${num(s[1])} km`), `${cm} · ${num(s[1])} = ${num(km)} km`]
  });
};
const LAND: Record<string, Pair> = {
  berg: ['Gebirge', 'montagna'], huegel: ['Hügelland', 'collina'], ebene: ['Ebene', 'pianura'], tal: ['Tal', 'valle'],
  insel: ['Insel', 'isola'], halbinsel: ['Halbinsel', 'penisola'], vulkan: ['Vulkan', 'vulcano'], golf: ['Golf (Meeresbucht)', 'golfo']
};
const landform = (keys: string[]) => (rng: Rng) => {
  const k = pick(rng, keys);
  return choice({
    prompt: L('Welche Landschaftsform zeigt das Bild?', 'Quale forma del paesaggio mostra l’immagine?'), pic: { id: 'landschaft', kind: k },
    right: tr(LAND[k]!), wrong: shuffle(rng, keys.map((x) => tr(LAND[x]!))), rng, explain: [tr(LAND[k]!)]
  });
};
const peninsulaPick = (rng: Rng) => {
  const keys = ['halbinsel', 'insel', 'golf', 'ebene'];
  return pickPicture({
    prompt: L('Italien ist eine Halbinsel. Welches Bild zeigt eine Halbinsel?', 'L’Italia è una penisola. Quale immagine mostra una penisola?'),
    right: { pic: { id: 'landschaft', kind: 'halbinsel' }, name: tr(LAND.halbinsel!) }, wrong: keys.slice(1).map((k) => ({ pic: { id: 'landschaft', kind: k }, name: tr(LAND[k]!) })), rng,
    hint: L('Eine Halbinsel ist auf drei Seiten von Wasser umgeben.', 'Una penisola è circondata dall’acqua su tre lati.'), explain: [L('Halbinsel: an drei Seiten Wasser, an einer Seite Land.', 'Penisola: acqua su tre lati, terra su uno.')]
  });
};
const GLOBE: Record<string, Pair> = { A: ['Nordpol', 'Polo Nord'], B: ['Äquator', 'Equatore'], C: ['Südpol', 'Polo Sud'] };
const globe = (rng: Rng) => {
  const m = pick(rng, ['A', 'B', 'C']);
  return choice({
    prompt: L(`Was zeigt ${m} auf dem Globus?`, `Che cosa indica ${m} sul globo?`), pic: { id: 'globus', mark: m },
    right: tr(GLOBE[m]!), wrong: [...Object.values(GLOBE).map(tr), L('Nullmeridian', 'meridiano di Greenwich')], rng,
    hint: L('Der Äquator teilt die Erde in Nord- und Südhalbkugel.', 'L’equatore divide la Terra in emisfero nord e sud.'), explain: [tr(GLOBE[m]!)]
  });
};
const LAYERS: Record<string, Pair> = { A: ['Erdkruste', 'crosta'], B: ['Erdmantel', 'mantello'], C: ['äußerer Kern', 'nucleo esterno'], D: ['innerer Kern', 'nucleo interno'] };
const layers = (rng: Rng) => {
  const m = pick(rng, ['A', 'B', 'C', 'D']);
  return choice({
    prompt: L(`Welche Schicht der Erde ist ${m}?`, `Quale strato della Terra è ${m}?`), pic: { id: 'erdschichten', mark: m },
    right: tr(LAYERS[m]!), wrong: Object.values(LAYERS).map(tr), rng,
    hint: L('Von außen nach innen: Kruste, Mantel, äußerer Kern, innerer Kern.', 'Dall’esterno: crosta, mantello, nucleo esterno, nucleo interno.'), explain: [tr(LAYERS[m]!)]
  });
};
const tl = (p: Pair) => L(p[0], p[1]);
const MONTHS: Pair = ['J F M A M J J A S O N D', 'G F M A M G L A S O N D'];
const climate = (rng: Rng, level: Difficulty) => {
  const south = level === 3 && rng() < 0.5;
  const base = [1, 2, 6, 10, 15, 19, 22, 21, 17, 11, 6, 2].map((t) => t + randInt(rng, 0, 4));
  const temps = south ? [...base.slice(6), ...base.slice(0, 6)] : base;
  const labels = tl(MONTHS).split(' ');
  const hot = temps.indexOf(Math.max(...temps));
  const months: Pair[] = [['Januar', 'gennaio'], ['April', 'aprile'], ['Juli', 'luglio'], ['Oktober', 'ottobre']];
  const idx = [0, 3, 6, 9];
  const right = idx.includes(hot) ? tr(months[idx.indexOf(hot)]!) : null;
  if (!right) {
    return inputTask({
      prompt: L('Klimadiagramm: Wie viel Grad hat der wärmste Monat?', 'Climogramma: quanti gradi ha il mese più caldo?'),
      pic: { id: 'saeulen', labels, values: temps, unit: '°C', max: 30 }, answer: Math.max(...temps), explain: [`${Math.max(...temps)} °C`]
    });
  }
  return choice({
    prompt: L('Klimadiagramm: In welchem Monat ist es am wärmsten?', 'Climogramma: in quale mese fa più caldo?'),
    pic: { id: 'saeulen', labels, values: temps, unit: '°C', max: 30 }, right, wrong: months.map(tr), rng,
    hint: south ? L('Achtung: Auf der Südhalbkugel ist im Januar Sommer.', 'Attenzione: nell’emisfero sud a gennaio è estate.') : L('Suche die höchste Säule.', 'Cerca la colonna più alta.'),
    explain: [south ? L('Südhalbkugel: Sommer im Januar.', 'Emisfero sud: estate a gennaio.') : right]
  });
};
const POP: Record<string, [Pair, Pair]> = {
  pyramide: [['Pyramide', 'piramide'], ['viele Kinder, wachsende Bevölkerung', 'molti bambini, popolazione in crescita']],
  glocke: [['Glocke', 'campana'], ['stabile Bevölkerung', 'popolazione stabile']],
  urne: [['Urne', 'urna'], ['wenige Kinder, alternde Bevölkerung', 'pochi bambini, popolazione che invecchia']]
};
const population = (rng: Rng, level: Difficulty) => {
  const s = pick(rng, Object.keys(POP));
  const askMeaning = level >= 3 || rng() < 0.5;
  return choice({
    prompt: askMeaning ? L('Was zeigt diese Bevölkerungspyramide?', 'Che cosa mostra questa piramide dell’età?') : L('Welche Form hat dieser Altersaufbau?', 'Che forma ha questa piramide dell’età?'),
    pic: { id: 'bevoelkerung', shape: s }, right: tr(POP[s]![askMeaning ? 1 : 0]), wrong: Object.values(POP).map((p) => tr(p[askMeaning ? 1 : 0])), rng,
    hint: L('Unten sind die Jungen, oben die Alten.', 'In basso i giovani, in alto gli anziani.'),
    explain: [`${tr(POP[s]![0])}: ${tr(POP[s]![1])}`, L('Deutschland und Italien haben heute eher eine Urnenform.', 'Oggi Italia e Germania hanno piuttosto una forma a urna.')]
  });
};
const GEO_LAND: PicGen[] = [gen(compass, 1), gen(gridCell, 1), gen(landform(['berg', 'huegel', 'ebene', 'insel']), 1), gen(whatInCell, 2), gen(scaleTask, 2), gen(landform(['berg', 'huegel', 'ebene', 'tal', 'insel', 'halbinsel', 'vulkan', 'golf']), 2), gen(compass, 3), gen(scaleTask, 3)];
const GEO_EU: PicGen[] = [gen(peninsulaPick, 1), gen(compass, 1), gen(landform(['halbinsel', 'insel', 'golf', 'vulkan']), 2), gen(scaleTask, 2), gen(climate, 2), gen(scaleTask, 3), gen(climate, 3)];
const GEO_WELT: PicGen[] = [gen(globe, 1), gen(compass, 1), gen(layers, 2), gen(climate, 2), gen(globe, 2), gen(population, 3), gen(layers, 3), gen(climate, 3)];
const GEO_OBER: PicGen[] = [gen(population, 1), gen(climate, 1), gen(population, 2), gen(scaleTask, 2), gen(population, 3), gen(climate, 3)];

/* ---------- Religion und Ethik ---------- */
const FEST: Record<string, [Pair, Pair]> = {
  advent: [['Advent', 'Avvento'], ['Christentum', 'cristianesimo']],
  tannenbaum: [['Weihnachten', 'Natale'], ['Christentum', 'cristianesimo']],
  osterei: [['Ostern', 'Pasqua'], ['Christentum', 'cristianesimo']],
  chanukka: [['Chanukka', 'Hanukkah'], ['Judentum', 'ebraismo']],
  ramadan: [['Ramadan und Zuckerfest', 'Ramadan e festa di fine digiuno'], ['Islam', 'islam']],
  diya: [['Diwali (Lichterfest)', 'Diwali (festa delle luci)'], ['Hinduismus', 'induismo']]
};
const festName = (rng: Rng) => {
  const k = pick(rng, Object.keys(FEST));
  return choice({
    prompt: L('Zu welchem Fest gehört das Bild?', 'A quale festa appartiene l’immagine?'), pic: { id: 'fest', kind: k, lit: k === 'advent' ? 4 : 0 },
    right: tr(FEST[k]![0]), wrong: shuffle(rng, Object.values(FEST).map((f) => tr(f[0]))), rng,
    explain: [`${tr(FEST[k]![0])} · ${tr(FEST[k]![1])}`]
  });
};
const festReligion = (rng: Rng) => {
  const k = pick(rng, ['chanukka', 'ramadan', 'diya', 'advent', 'osterei']);
  return choice({
    prompt: L('In welcher Religion feiert man dieses Fest?', 'In quale religione si celebra questa festa?'), pic: { id: 'fest', kind: k, lit: k === 'advent' ? 2 : 0 },
    right: tr(FEST[k]![1]), wrong: [['Christentum', 'cristianesimo'], ['Judentum', 'ebraismo'], ['Islam', 'islam'], ['Hinduismus', 'induismo']].map((p) => tr(p as Pair)), rng,
    explain: [`${tr(FEST[k]![0])}: ${tr(FEST[k]![1])}`]
  });
};
const advent = (rng: Rng) => {
  const lit = randInt(rng, 1, 4);
  return choice({
    prompt: L('Wie viele Kerzen brennen? Welcher Adventssonntag ist es?', 'Quante candele sono accese? Quale domenica d’Avvento è?'), pic: { id: 'fest', kind: 'advent', lit },
    right: L(`${lit}. Advent`, `${['prima', 'seconda', 'terza', 'quarta'][lit - 1]} domenica`), wrong: [1, 2, 3, 4].map((n) => L(`${n}. Advent`, `${['prima', 'seconda', 'terza', 'quarta'][n - 1]} domenica`)), rng,
    hint: L('Jeden Sonntag wird eine Kerze mehr angezündet.', 'Ogni domenica si accende una candela in più.'), explain: [L(`${lit} Kerzen: ${lit}. Advent`, `${lit} candele accese: ${['prima', 'seconda', 'terza', 'quarta'][lit - 1]} domenica d’Avvento`)]
  });
};
const MOODS: Record<string, Pair> = { froh: ['fröhlich', 'felice'], traurig: ['traurig', 'triste'], wuetend: ['wütend', 'arrabbiato'], ueberrascht: ['überrascht', 'sorpreso'], aengstlich: ['ängstlich', 'impaurito'], muede: ['müde', 'stanco'] };
const feeling = (rng: Rng, level: Difficulty) => {
  const keys = level === 1 ? ['froh', 'traurig', 'wuetend', 'ueberrascht'] : Object.keys(MOODS);
  const k = pick(rng, keys);
  return choice({
    prompt: L('Wie fühlt sich das Kind?', 'Come si sente il bambino?'), pic: { id: 'gesicht', mood: k },
    right: tr(MOODS[k]!), wrong: shuffle(rng, keys.map((x) => tr(MOODS[x]!))), rng,
    hint: L('Schau auf Augen, Augenbrauen und Mund.', 'Guarda occhi, sopracciglia e bocca.'), explain: [tr(MOODS[k]!)]
  });
};
const comfort = (rng: Rng) => choice({
  prompt: L('Dein Freund sieht so aus. Was ist eine gute Idee?', 'Il tuo amico ha questa faccia. Che cosa è meglio fare?'), pic: { id: 'gesicht', mood: 'traurig' },
  right: L('Ich frage, was los ist, und tröste ihn.', 'Gli chiedo che cosa ha e lo consolo.'),
  wrong: [L('Ich lache ihn aus.', 'Lo prendo in giro.'), L('Ich gehe einfach weg.', 'Me ne vado e basta.'), L('Ich sage, dass er sich nicht so anstellen soll.', 'Gli dico di smetterla di fare così.')], rng,
  explain: [L('Wer traurig ist, freut sich über Zuhören und Trost.', 'Chi è triste è contento se qualcuno lo ascolta e lo consola.')]
});
const lantern = (rng: Rng) => choice({
  prompt: L('Zu welchem Fest im November laufen Kinder mit Laternen?', 'Per quale festa di novembre i bambini in Germania girano con le lanterne?'), pic: { id: 'fest', kind: 'laterne' },
  right: L('Sankt Martin', 'San Martino'), wrong: [L('Ostern', 'Pasqua'), L('Pfingsten', 'Pentecoste'), L('Erntedank', 'festa del raccolto')], rng,
  explain: [L('Martin teilte seinen Mantel mit einem armen Mann.', 'Martino divise il suo mantello con un povero.')]
});
const SYM: Record<string, [Pair, Pair]> = {
  kreuz: [['Kreuz', 'croce'], ['Christentum', 'cristianesimo']], davidstern: [['Davidstern', 'stella di Davide'], ['Judentum', 'ebraismo']],
  halbmond: [['Halbmond und Stern', 'mezzaluna e stella'], ['Islam', 'islam']], rad: [['Rad der Lehre', 'ruota del Dharma'], ['Buddhismus', 'buddhismo']]
};
const symbol = (rng: Rng) => {
  const k = pick(rng, Object.keys(SYM));
  return choice({
    prompt: L('Für welche Religion steht dieses Symbol?', 'Quale religione rappresenta questo simbolo?'), pic: { id: 'symbol', kind: k },
    right: tr(SYM[k]![1]), wrong: Object.values(SYM).map((s) => tr(s[1])), rng, explain: [`${tr(SYM[k]![0])}: ${tr(SYM[k]![1])}`]
  });
};
const HOUSE: Record<string, [Pair, Pair]> = {
  kirche: [['Kirche', 'chiesa'], ['Christentum', 'cristianesimo']], moschee: [['Moschee', 'moschea'], ['Islam', 'islam']],
  synagoge: [['Synagoge', 'sinagoga'], ['Judentum', 'ebraismo']], pagode: [['Pagode (Tempel)', 'pagoda (tempio)'], ['Buddhismus', 'buddhismo']]
};
const worship = (rng: Rng, level: Difficulty) => {
  const k = pick(rng, Object.keys(HOUSE));
  const which = level === 1 ? 0 : 1;
  return choice({
    prompt: which === 0 ? L('Wie heißt dieses Gotteshaus?', 'Come si chiama questo luogo di culto?') : L('Welche Religion betet in diesem Gebäude?', 'Quale religione prega in questo edificio?'),
    pic: { id: 'gotteshaus', kind: k }, right: tr(HOUSE[k]![which]), wrong: Object.values(HOUSE).map((h) => tr(h[which])), rng,
    hint: L('Achte auf Turm, Kuppel und Zeichen auf dem Dach.', 'Guarda torre, cupola e simbolo sul tetto.'), explain: [`${tr(HOUSE[k]![0])}: ${tr(HOUSE[k]![1])}`]
  });
};
const symbolPick = (rng: Rng) => {
  const k = pick(rng, Object.keys(SYM));
  return pickPicture({
    prompt: L(`Welches Symbol gehört zum ${SYM[k]![1][0]}?`, `Quale simbolo appartiene al ${SYM[k]![1][1]}?`.replace('al islam', 'all’islam').replace('al ebraismo', 'all’ebraismo')),
    right: { pic: { id: 'symbol', kind: k }, name: tr(SYM[k]![0]) }, wrong: Object.keys(SYM).filter((x) => x !== k).map((x) => ({ pic: { id: 'symbol', kind: x }, name: tr(SYM[x]![0]) })), rng,
    explain: [`${tr(SYM[k]![1])}: ${tr(SYM[k]![0])}`]
  });
};
const ETHIK: Record<string, [Pair, Pair]> = {
  hoehle: [['Höhlengleichnis', 'mito della caverna'], ['Platon', 'Platone']],
  weiche: [['Weichenstellerfall (Trolley-Problem)', 'dilemma del carrello'], ['Philippa Foot', 'Philippa Foot']],
  waage: [['Gerechtigkeit', 'giustizia'], ['Aristoteles', 'Aristotele']],
  schleier: [['Schleier des Nichtwissens', 'velo d’ignoranza'], ['John Rawls', 'John Rawls']]
};
const ethics = (rng: Rng, level: Difficulty) => {
  const k = pick(rng, Object.keys(ETHIK));
  const who = level === 3 && k !== 'waage';
  return choice({
    prompt: who ? L('Welcher Denker oder welche Denkerin gehört zu diesem Gedankenexperiment?', 'A quale pensatore o pensatrice è legato questo esperimento mentale?') : L('Welches Gedankenexperiment oder Thema zeigt das Bild?', 'Quale esperimento mentale o tema mostra l’immagine?'),
    pic: { id: 'ethik', kind: k }, right: tr(ETHIK[k]![who ? 1 : 0]),
    wrong: (who ? [['Platon', 'Platone'], ['Philippa Foot', 'Philippa Foot'], ['John Rawls', 'John Rawls'], ['Immanuel Kant', 'Immanuel Kant']] : Object.values(ETHIK).map((e) => e[0])).map((p) => tr(p as Pair)), rng,
    explain: [`${tr(ETHIK[k]![0])} · ${tr(ETHIK[k]![1])}`]
  });
};
const trolley = (rng: Rng) => choice({
  prompt: L('Weichenstellerfall: Wer die Weiche umstellt, weil fünf Leben mehr zählen als eines, denkt …', 'Dilemma del carrello: chi devia il carrello perché cinque vite contano più di una ragiona in modo …'),
  pic: { id: 'ethik', kind: 'weiche' }, right: L('utilitaristisch', 'utilitarista'), wrong: [L('nach Kants Pflichtethik', 'secondo l’etica del dovere di Kant'), L('egoistisch', 'egoista'), L('relativistisch', 'relativista')], rng,
  explain: [L('Utilitarismus: Die Folgen zählen, möglichst viel Wohl für möglichst viele.', 'Utilitarismo: contano le conseguenze, il massimo bene per il maggior numero.')]
});

const REL_FESTE: PicGen[] = [gen(festName, 1), gen(feeling, 1), gen(advent, 1), gen(lantern, 1, 'DE'), gen(comfort, 2), gen(festReligion, 2), gen(feeling, 2), gen(symbol, 3), gen(festReligion, 3)];
const REL_WELT: PicGen[] = [gen(symbol, 1), gen(worship, 1), gen(festReligion, 2), gen(worship, 2), gen(symbolPick, 2), gen(festName, 3), gen(worship, 3)];
const REL_ETHIK: PicGen[] = [gen(ethics, 1), gen(symbol, 1), gen(trolley, 2), gen(ethics, 2), gen(ethics, 3), gen(trolley, 3)];

export const SOCIETY_PICS: PicBank = {
  'ge-antike': GE_ANTIKE, 'ge-mittelalter': GE_MA, 'ge-neuzeit': GE_NZ, 'ge-20jh': GE_20, 'ge-oberstufe': GE_OBER,
  'geo-meinland': GEO_LAND, 'geo-europa': GEO_EU, 'geo-welt': GEO_WELT, 'geo-oberstufe': GEO_OBER,
  'rel-feste': REL_FESTE, 'rel-weltreligionen': REL_WELT, 'rel-ethik': REL_ETHIK
};
