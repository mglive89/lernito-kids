import type { ChoiceTask, Difficulty, LearningModule, Pick3DTask, Rng, SolidName, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';
import { zahlwort } from '../../content/words';

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;

export interface BankFrage { q: string; a: string; f: string[]; hint: string; emoji?: string; level?: Difficulty; aEmoji?: boolean }

/** Erzeugt Aufgaben aus einer Fragenbank, Schwierigkeit filtert nach level. */
export function bankGenerator(bank: BankFrage[], prefix: string) {
  return (level: Difficulty, rng: Rng, n = 6): Task[] => {
    const pool = bank.filter((b) => (b.level ?? 1) <= level);
    return sample(rng, pool.length >= n ? pool : bank, n).map((b, i): ChoiceTask => ({
      id: tid(prefix, i), type: 'choice', prompt: b.q,
      visual: b.emoji ? { kind: 'bigEmoji', emoji: b.emoji } : undefined,
      options: shuffle(rng, [b.a, ...b.f]).map((x) => (b.aEmoji ? { id: x, emoji: x } : { id: x, label: x })),
      correctId: b.a, optionStyle: b.aEmoji ? 'emoji' : 'text', hint: b.hint, explain: [`Richtig ist: ${b.a}.`, b.hint]
    }));
  };
}

export const SACH_K1: BankFrage[] = [
  { q: 'In welcher Jahreszeit fällt oft Schnee?', a: 'Winter', f: ['Sommer', 'Frühling'], hint: 'Dann ist es draußen sehr kalt.', emoji: '❄️' },
  { q: 'In welcher Jahreszeit fallen die bunten Blätter von den Bäumen?', a: 'Herbst', f: ['Frühling', 'Sommer'], hint: 'Diese Jahreszeit kommt nach dem Sommer.', emoji: '🍂' },
  { q: 'Womit hörst du?', a: 'mit den Ohren', f: ['mit der Nase', 'mit den Augen'], hint: 'Sie sind links und rechts am Kopf.', emoji: '👂' },
  { q: 'Womit riechst du?', a: 'mit der Nase', f: ['mit dem Mund', 'mit den Händen'], hint: 'Sie ist mitten im Gesicht.', emoji: '🌸' },
  { q: 'Wie viele Jahreszeiten gibt es?', a: '4', f: ['3', '12'], hint: 'Frühling, Sommer, Herbst, Winter.', emoji: '🗓️' },
  { q: 'Was ist gesund für deine Zähne?', a: 'Zähne putzen', f: ['viele Bonbons', 'nie zum Zahnarzt'], hint: 'Morgens und abends …', emoji: '🪥' },
  { q: 'Bei welcher Ampelfarbe darfst du gehen?', a: 'Grün', f: ['Rot', 'Gelb'], hint: 'Bei Rot musst du stehen.', emoji: '🚦' },
  { q: 'Wie viele Tage hat eine Woche?', a: '7', f: ['5', '10'], hint: 'Montag, Dienstag, Mittwoch …', emoji: '📅', level: 2 },
  { q: 'Welcher Tag kommt nach Freitag?', a: 'Samstag', f: ['Donnerstag', 'Montag'], hint: 'Dann beginnt das Wochenende.', emoji: '📆', level: 2 },
  { q: 'Was braucht eine Pflanze zum Wachsen?', a: 'Wasser und Licht', f: ['Dunkelheit', 'Süßigkeiten'], hint: 'Denk an Sonne und Gießkanne.', emoji: '🌱', level: 2 }
];
export const SACH_K2: BankFrage[] = [
  { q: 'Welches Tier legt Eier?', a: '🐔', f: ['🐄', '🐖'], hint: 'Es gackert.', aEmoji: true },
  { q: 'Welches Tier ist ein Säugetier?', a: 'Hund', f: ['Huhn', 'Fisch'], hint: 'Säugetiere trinken als Baby Milch bei der Mutter.', emoji: '🐶' },
  { q: 'Was wird aus einer Raupe?', a: 'ein Schmetterling', f: ['ein Vogel', 'eine Biene'], hint: 'Sie verpuppt sich erst.', emoji: '🐛' },
  { q: 'Wo wachsen Äpfel?', a: 'am Baum', f: ['in der Erde', 'im Wasser'], hint: 'Man pflückt sie oben.', emoji: '🍎' },
  { q: 'Woran erkennst du einen Zebrastreifen?', a: 'weiße Streifen auf der Straße', f: ['rote Punkte', 'eine Ampel mit Blau'], hint: 'Er sieht aus wie ein Zebra.', emoji: '🦓' },
  { q: 'Welche Seite ist beim Überqueren der Straße zuerst wichtig?', a: 'links schauen', f: ['nur nach oben schauen', 'gar nicht schauen'], hint: 'Links – rechts – links.', emoji: '🚸' },
  { q: 'Was gehört in die Papiertonne?', a: 'alte Zeitung', f: ['Bananenschale', 'Glasflasche'], hint: 'Sie ist meist blau.', emoji: '🗞️', level: 2 },
  { q: 'Welcher Körperteil pumpt Blut durch den Körper?', a: 'das Herz', f: ['der Magen', 'die Lunge'], hint: 'Du kannst es schlagen fühlen.', emoji: '❤️', level: 2 },
  { q: 'Was macht ein Eichhörnchen im Herbst?', a: 'Es sammelt Vorräte.', f: ['Es fliegt nach Süden.', 'Es legt Eier.'], hint: 'Es versteckt Nüsse für den Winter.', emoji: '🐿️', level: 2 }
];
export const SACH_K3: BankFrage[] = [
  { q: 'Wie nennt man es, wenn Wasser durch Wärme zu Dampf wird?', a: 'verdunsten', f: ['gefrieren', 'schmelzen'], hint: 'Pfützen verschwinden in der Sonne.', emoji: '☀️' },
  { q: 'Bei wie viel Grad Celsius gefriert Wasser?', a: '0 °C', f: ['10 °C', '100 °C'], hint: 'Dann wird Wasser zu Eis.', emoji: '🧊' },
  { q: 'Welche Teile hat eine Pflanze?', a: 'Wurzel, Stängel, Blätter, Blüte', f: ['Kopf, Arme, Beine', 'Rad, Lenker, Sattel'], hint: 'Ein Teil steckt in der Erde.', emoji: '🌷' },
  { q: 'Was gehört in den Biomüll?', a: 'Apfelreste', f: ['Joghurtbecher', 'Batterien'], hint: 'Es kann verrotten und zu Erde werden.', emoji: '🍏' },
  { q: 'Warum sind Bienen wichtig?', a: 'Sie bestäuben Blüten.', f: ['Sie fressen Blätter.', 'Sie bauen Straßen.'], hint: 'Ohne sie gäbe es weniger Obst.', emoji: '🐝' },
  { q: 'Was ist ein Laubbaum?', a: 'Eiche', f: ['Tanne', 'Fichte'], hint: 'Laubbäume haben Blätter, keine Nadeln.', emoji: '🌳' },
  { q: 'Wo leben Frösche als Kaulquappe?', a: 'im Wasser', f: ['auf Bäumen', 'in der Wüste'], hint: 'Kaulquappen haben einen Ruderschwanz.', emoji: '🐸', level: 2 },
  { q: 'Wie kann man Energie sparen?', a: 'Licht ausschalten, wenn man den Raum verlässt', f: ['Fenster im Winter offen lassen', 'den Fernseher immer anlassen'], hint: 'Was nicht läuft, verbraucht keinen Strom.', emoji: '💡', level: 2 }
];
export const SACH_K4: BankFrage[] = [
  { q: 'Wie heißt die Hauptstadt von Deutschland?', a: 'Berlin', f: ['München', 'Hamburg'], hint: 'Dort steht das Brandenburger Tor.', emoji: '🇩🇪' },
  { q: 'Wie viele Bundesländer hat Deutschland?', a: '16', f: ['12', '20'], hint: 'Es sind mehr als 15.', emoji: '🗺️' },
  { q: 'Welcher Stoff leitet Strom gut?', a: 'Kupfer', f: ['Holz', 'Gummi'], hint: 'Kabel enthalten dieses Metall.', emoji: '🔌' },
  { q: 'Was zieht ein Magnet an?', a: 'eine Büroklammer aus Eisen', f: ['ein Blatt Papier', 'einen Holzlöffel'], hint: 'Magnete ziehen Eisen an.', emoji: '🧲' },
  { q: 'Was zeigt ein Kompass an?', a: 'die Himmelsrichtung', f: ['die Uhrzeit', 'die Temperatur'], hint: 'Die Nadel zeigt nach Norden.', emoji: '🧭' },
  { q: 'Welcher Fluss fließt durch viele deutsche Städte wie Köln und Mainz?', a: 'der Rhein', f: ['die Themse', 'der Nil'], hint: 'Er ist einer der längsten Flüsse Deutschlands.', emoji: '🏞️', level: 2 },
  { q: 'Was bedeutet „nachhaltig“?', a: 'So handeln, dass auch später genug für alle da ist', f: ['Möglichst viel kaufen', 'Etwas sehr schnell erledigen'], hint: 'Es geht um die Zukunft.', emoji: '♻️', level: 2 },
  { q: 'Welches Organ brauchst du zum Atmen?', a: 'die Lunge', f: ['die Leber', 'den Magen'], hint: 'Sie füllt sich mit Luft.', emoji: '🫁', level: 2 }
];

const ENGLISCH: BankFrage[] = [
  { q: 'Was heißt „rot“ auf Englisch?', a: 'red', f: ['blue', 'green'], hint: 'Ein roter Apfel ist ein „… apple“.', emoji: '🔴' },
  { q: 'Was heißt „Hund“ auf Englisch?', a: 'dog', f: ['cat', 'bird'], hint: 'Er sagt „woof“.', emoji: '🐶' },
  { q: 'Was heißt „Katze“ auf Englisch?', a: 'cat', f: ['dog', 'cow'], hint: 'Es klingt ein bisschen wie „Katze“.', emoji: '🐱' },
  { q: 'Was heißt „drei“ auf Englisch?', a: 'three', f: ['two', 'five'], hint: 'one, two, …', emoji: '3️⃣' },
  { q: 'Was heißt „Hallo“ auf Englisch?', a: 'hello', f: ['goodbye', 'thanks'], hint: 'Man sagt es zur Begrüßung.', emoji: '👋' },
  { q: 'Was heißt „blau“ auf Englisch?', a: 'blue', f: ['yellow', 'black'], hint: 'Der Himmel ist …', emoji: '🔵' },
  { q: 'Was heißt „Apfel“ auf Englisch?', a: 'apple', f: ['banana', 'orange'], hint: 'Es beginnt fast wie im Deutschen.', emoji: '🍎' },
  { q: 'Was heißt „Danke“ auf Englisch?', a: 'thank you', f: ['please', 'sorry'], hint: 'Man sagt es, wenn man etwas bekommt.', emoji: '🙏' },
  { q: 'Was heißt „Sonne“ auf Englisch?', a: 'sun', f: ['moon', 'star'], hint: 'Ein sonniger Tag ist ein „sunny day“.', emoji: '☀️', level: 2 },
  { q: 'Was heißt „Mutter“ auf Englisch?', a: 'mother', f: ['father', 'sister'], hint: 'Kurz sagt man auch „mum“.', emoji: '👩', level: 2 },
  { q: 'Was heißt „grün“ auf Englisch?', a: 'green', f: ['grey', 'brown'], hint: 'Klingt ähnlich wie im Deutschen.', emoji: '🟢', level: 2 },
  { q: 'Was heißt „Schule“ auf Englisch?', a: 'school', f: ['house', 'shop'], hint: 'Klingt wie „Skuhl“.', emoji: '🏫', level: 3 }
];

/* =================== 3D-Lernwelt =================== */

const SOLIDS: { id: SolidName; name: string; hint: string }[] = [
  { id: 'wuerfel', name: 'Würfel', hint: 'Alle 6 Flächen sind gleich große Quadrate.' },
  { id: 'kugel', name: 'Kugel', hint: 'Sie ist überall rund und rollt in jede Richtung.' },
  { id: 'zylinder', name: 'Zylinder', hint: 'Oben und unten ist ein Kreis – wie eine Dose.' },
  { id: 'kegel', name: 'Kegel', hint: 'Unten ein Kreis, oben eine Spitze – wie eine Eistüte.' },
  { id: 'pyramide', name: 'Pyramide', hint: 'Sie hat eine eckige Grundfläche und Dreiecke bis zur Spitze.' },
  { id: 'quader', name: 'Quader', hint: 'Wie ein Schuhkarton: 6 Rechtecke.' }
];
const SOLID_COLORS = ['#FF6F59', '#3A9BDC', '#2EC4B6', '#8E6CEF', '#FFB627'];

export function genKoerper3d(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = level === 1 ? SOLIDS.slice(0, 4) : SOLIDS;
  return Array.from({ length: n }, (_, i): ChoiceTask => {
    const s = pick(rng, pool);
    return {
      id: tid('k3d', i), type: 'choice', prompt: 'Dreh den Körper mit dem Finger. Welcher Körper ist das?',
      visual: { kind: 'solid3d', solid: s.id, color: pick(rng, SOLID_COLORS) },
      options: shuffle(rng, [s, ...sample(rng, pool.filter((x) => x.id !== s.id), 2)]).map((x) => ({ id: x.id, label: x.name })),
      correctId: s.id, optionStyle: 'text', hint: 'Dreh ihn ganz herum. Hat er Ecken? Ist er rund?', explain: [`Das ist ein${s.id === 'kugel' || s.id === 'pyramide' ? 'e' : ''} ${s.name}.`, s.hint]
    };
  });
}

export function genZaehlen3d(level: Difficulty, rng: Rng, n = 4): Task[] {
  const max = level === 1 ? 5 : level === 2 ? 8 : 10;
  return Array.from({ length: n }, (_, i): ChoiceTask => {
    const count = randInt(rng, 2, max);
    const item = pick(rng, ['apfel', 'ball', 'stern'] as const);
    const name = item === 'apfel' ? 'Äpfel' : item === 'ball' ? 'Bälle' : 'Sterne';
    return {
      id: tid('z3d', i), type: 'choice', prompt: `Tippe jedes Ding an, um es in den Korb zu legen. Wie viele ${name} sind es?`,
      visual: { kind: 'count3d', count, item },
      options: numberOptions(rng, count, 3, 1, max + 1, 2).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(count), optionStyle: 'big', hint: 'Tippe sie nacheinander an und zähle laut mit.',
      explain: [`Gezählt: ${Array.from({ length: count }, (_, k) => zahlwort(k + 1)).join(', ')}.`, `Es sind ${count} ${name}.`]
    };
  });
}

export function genZahlenwelt3d(level: Difficulty, rng: Rng, n = 5): Task[] {
  const max = level === 1 ? 10 : level === 2 ? 20 : 100;
  return Array.from({ length: n }, (_, i): Pick3DTask => {
    const nums = numberOptions(rng, randInt(rng, 1, max), level === 1 ? 4 : 6, 1, max, level === 3 ? 15 : 5);
    const target = pick(rng, nums);
    const useRechnung = level >= 2 && i % 2 === 1 && target > 2;
    const a = useRechnung ? randInt(rng, 1, target - 1) : 0;
    return {
      id: tid('zw3d', i), type: 'pick3d', scene: 'zahlen',
      prompt: useRechnung ? `Tippe auf den Würfel mit dem Ergebnis von ${a} + ${target - a}!` : `Tippe auf den Zahlenwürfel ${target}!`,
      items: nums.map((v) => ({ id: String(v), label: String(v) })), correctId: String(target),
      hint: useRechnung ? `Rechne zuerst: ${a} + ${target - a}.` : 'Schau dir alle schwebenden Würfel an. Du kannst die Welt auch drehen.',
      explain: useRechnung ? [`${a} + ${target - a} = ${target}`] : [`Die gesuchte Zahl ist ${target}.`]
    };
  });
}

const WIESE = [
  { id: '🐰', name: 'Hase', q: 'Wer hat lange Ohren und hoppelt über die Wiese?' },
  { id: '🐝', name: 'Biene', q: 'Wer sammelt Nektar aus den Blüten?' },
  { id: '🐞', name: 'Marienkäfer', q: 'Wer ist rot mit schwarzen Punkten?' },
  { id: '🦔', name: 'Igel', q: 'Wer hat Stacheln auf dem Rücken?' },
  { id: '🐌', name: 'Schnecke', q: 'Wer trägt sein Haus auf dem Rücken und ist ganz langsam?' },
  { id: '🦋', name: 'Schmetterling', q: 'Wer war früher eine Raupe?' },
  { id: '🐦', name: 'Vogel', q: 'Wer baut ein Nest im Baum und kann fliegen?' },
  { id: '🐸', name: 'Frosch', q: 'Wer quakt am Teich?' }
];
export function genNatur3d(level: Difficulty, rng: Rng, n = 5): Task[] {
  return sample(rng, WIESE, n).map((t, i): Pick3DTask => ({
    id: tid('n3d', i), type: 'pick3d', scene: 'wiese', prompt: t.q,
    items: shuffle(rng, [t, ...sample(rng, WIESE.filter((w) => w.id !== t.id), level === 1 ? 2 : 4)]).map((w) => ({ id: w.id, label: w.id })),
    correctId: t.id, hint: 'Schau dir alle Tiere auf der Wiese an. Du kannst die Wiese drehen.', explain: [`Das ist ${t.name === 'Igel' || t.name === 'Hase' || t.name === 'Vogel' || t.name === 'Frosch' || t.name === 'Marienkäfer' || t.name === 'Schmetterling' ? 'der' : 'die'} ${t.name} ${t.id}.`]
  }));
}

export const SACH_MODULES: LearningModule[] = [
  { id: 's1-jahreszeiten', title: 'Ich und die Jahreszeiten', subtitle: 'Körper, Wetter, Verkehr', emoji: '🌦️', color: 'minze', area: 'schule', grade: 1, subject: 'sachunterricht', topic: 'Jahreszeiten und Körper', roundSize: 6, generate: bankGenerator(SACH_K1, 's1') },
  { id: 's2-tiere', title: 'Tiere, Pflanzen, Verkehr', subtitle: 'Die Welt um uns', emoji: '🐿️', color: 'sonne', area: 'schule', grade: 2, subject: 'sachunterricht', topic: 'Tiere und Pflanzen', roundSize: 6, generate: bankGenerator(SACH_K2, 's2') },
  { id: 's3-natur', title: 'Natur und Umwelt', subtitle: 'Wasser, Pflanzen, Müll', emoji: '🌍', color: 'minze', area: 'schule', grade: 3, subject: 'sachunterricht', topic: 'Natur und Umwelt', roundSize: 6, generate: bankGenerator(SACH_K3, 's3') },
  { id: 's4-welt', title: 'Deutschland und Technik', subtitle: 'Strom, Magnete, Karten', emoji: '🧭', color: 'himmel', area: 'schule', grade: 4, subject: 'sachunterricht', topic: 'Technik und Erdkunde', roundSize: 6, generate: bankGenerator(SACH_K4, 's4') },
  { id: 'e-basis', title: 'English for Kids', subtitle: 'Erste englische Wörter', emoji: '🇬🇧', color: 'koralle', area: 'schule', subject: 'englisch', topic: 'Englisch Wortschatz', roundSize: 6, generate: bankGenerator(ENGLISCH, 'en') }
];

export const WORLD3D_MODULES: LearningModule[] = [
  { id: '3d-koerper', title: 'Körper drehen', subtitle: 'Würfel, Kugel, Kegel …', emoji: '🧊', color: 'lila', area: 'welt3d', topic: 'Geometrische Körper', roundSize: 5, uses3d: true, generate: (l, r) => genKoerper3d(l, r) },
  { id: '3d-zaehlen', title: 'Sammeln und Zählen', subtitle: 'Dinge in den Korb legen', emoji: '🧺', color: 'koralle', area: 'welt3d', topic: 'Zählen', roundSize: 4, uses3d: true, generate: (l, r) => genZaehlen3d(l, r) },
  { id: '3d-zahlenwelt', title: '3D-Zahlenwelt', subtitle: 'Schwebende Zahlenwürfel', emoji: '🎲', color: 'himmel', area: 'welt3d', topic: 'Zahlen', roundSize: 5, uses3d: true, generate: (l, r) => genZahlenwelt3d(l, r) },
  { id: '3d-wiese', title: 'Tiere auf der Wiese', subtitle: 'Natur entdecken', emoji: '🌼', color: 'minze', area: 'welt3d', topic: 'Natur', roundSize: 5, uses3d: true, generate: (l, r) => genNatur3d(l, r) }
];
