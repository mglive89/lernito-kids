import type { ChoiceTask, Difficulty, LearningModule, Rng, Task, WordBuildTask } from '../types';
import { pick, sample, shuffle } from '../../lib/random';
import { BILDWOERTER, LESEWOERTER } from '../../content/words';

const times = <T>(n: number, fn: (i: number) => T): T[] => Array.from({ length: n }, (_, i) => fn(i));
const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;

/* =================== Klasse 1 =================== */

export function genAnlaute(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = BILDWOERTER.filter((w) => !w.wort.startsWith('Sch'));
  return times(n, (i): ChoiceTask => {
    const w = pick(rng, pool);
    const pos = level === 3 && i % 2 === 1 ? 'ende' : 'anfang';
    const laut = pos === 'anfang' ? w.wort[0]!.toUpperCase() : w.wort[w.wort.length - 1]!.toUpperCase();
    const andere = sample(rng, 'ABDEFGHIKLMNOPRSTUZ'.split('').filter((b) => b !== laut), level === 1 ? 2 : 3);
    return {
      id: tid('anl', i), type: 'choice',
      prompt: pos === 'anfang' ? `Welchen Buchstaben hörst du am Anfang von „${w.wort}“?` : `Welchen Buchstaben hörst du am Ende von „${w.wort}“?`,
      visual: { kind: 'bigEmoji', emoji: w.emoji, caption: level === 1 ? w.wort : undefined },
      options: shuffle(rng, [laut, ...andere]).map((b) => ({ id: b, label: `${b} ${b.toLowerCase()}`, speak: b })),
      correctId: laut, optionStyle: 'big',
      hint: `Sprich das Wort ganz langsam: ${w.silben.join(' – ')}.`,
      explain: [`${w.wort} ${pos === 'anfang' ? 'beginnt' : 'endet'} mit ${laut}.`]
    };
  });
}

export function genSilben(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = BILDWOERTER.filter((w) => (level === 1 ? w.silben.length <= 2 : true) && w.silben.length >= 2);
  return times(n, (i): Task => {
    const w = pick(rng, pool);
    if (i % 2 === 0) {
      const ablenker = level >= 2 ? sample(rng, BILDWOERTER.flatMap((b) => b.silben).filter((s) => !w.silben.includes(s)), level === 3 ? 2 : 1) : [];
      return {
        id: tid('silb', i), type: 'wordbuild',
        prompt: `Setze die Silben zusammen: ${w.wort}`,
        speak: `Setze die Silben zum Wort ${w.wort} zusammen.`,
        visual: { kind: 'bigEmoji', emoji: w.emoji },
        solution: w.silben, tiles: shuffle(rng, [...w.silben, ...ablenker]),
        hint: `Sprich und klatsche: ${w.silben.map(() => '👏').join(' ')}. Welche Silbe kommt zuerst?`,
        explain: [`${w.silben.join(' – ')} ergibt ${w.wort}.`]
      } satisfies WordBuildTask;
    }
    return {
      id: tid('silb', i), type: 'choice',
      prompt: `Wie viele Silben hat „${w.wort}“?`,
      visual: { kind: 'bigEmoji', emoji: w.emoji, caption: w.wort },
      options: [1, 2, 3, 4].slice(0, level === 1 ? 3 : 4).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(w.silben.length), optionStyle: 'big',
      hint: 'Klatsche bei jedem Wortteil einmal in die Hände.',
      explain: [`${w.silben.join(' – ')}: ${w.silben.length} Silben.`]
    } satisfies ChoiceTask;
  });
}

export function genWoerterBauen(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = LESEWOERTER.filter((w) => (level === 1 ? w.wort.length <= 3 + 1 : level === 2 ? w.wort.length <= 5 : true));
  return sample(rng, pool, Math.min(n, pool.length)).map((w, i): WordBuildTask => {
    const letters = w.wort.split('');
    const extra = level === 3 ? sample(rng, 'BDEFKLRTU'.split('').filter((b) => !letters.includes(b)), 2) : [];
    return {
      id: tid('bau', i), type: 'wordbuild',
      prompt: 'Baue das Wort zum Bild!', speak: `Baue das Wort ${w.wort.toLowerCase()}.`,
      visual: { kind: 'bigEmoji', emoji: w.emoji },
      solution: letters, tiles: shuffle(rng, [...letters, ...extra]),
      hint: `Sprich das Wort langsam: ${letters.join(' - ')}. Der erste Laut ist ${letters[0]}.`,
      explain: [`Das Wort heißt ${w.wort}: ${letters.join(' – ')}.`]
    };
  });
}

export function genLesen1(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? BILDWOERTER.filter((w) => w.wort.length <= 4) : BILDWOERTER;
  return times(n, (i): ChoiceTask => {
    const w = pick(rng, pool);
    const andere = sample(rng, BILDWOERTER.filter((b) => b.wort !== w.wort), level === 1 ? 2 : 3);
    return {
      id: tid('lesen', i), type: 'choice',
      prompt: 'Lies das Wort. Welches Bild passt?',
      speak: 'Lies das Wort und tippe auf das passende Bild.',
      visual: { kind: 'text', text: level === 3 ? w.wort.toUpperCase() : w.wort, size: 'xl' },
      options: shuffle(rng, [w, ...andere]).map((b) => ({ id: b.wort, emoji: b.emoji })),
      correctId: w.wort, optionStyle: 'emoji',
      hint: `Lies Buchstabe für Buchstabe: ${w.wort.split('').join('-')}.`,
      explain: [`Das Wort heißt „${w.wort}“.`]
    };
  });
}

/* =================== Klasse 2 =================== */

const RECHTSCHREIBUNG: { richtig: string; falsch: string[]; regel: string }[] = [
  { richtig: 'Biene', falsch: ['Bine', 'Beine'], regel: 'Ein langes i schreibt man meistens ie.' },
  { richtig: 'Spiel', falsch: ['Spil', 'Speil'], regel: 'Ein langes i schreibt man meistens ie.' },
  { richtig: 'Brief', falsch: ['Brif', 'Breif'], regel: 'Ein langes i schreibt man meistens ie.' },
  { richtig: 'Eis', falsch: ['Ais', 'Ies'], regel: 'Den Laut „ai“ schreibt man meistens ei.' },
  { richtig: 'Mama', falsch: ['Mamma', 'Mahma'], regel: 'Hör genau: Ma – ma.' },
  { richtig: 'Sonne', falsch: ['Sone', 'Sohne'], regel: 'Nach einem kurzen Selbstlaut wird der Mitlaut oft verdoppelt: Son-ne.' },
  { richtig: 'Teller', falsch: ['Teler', 'Theller'], regel: 'Kurzer Selbstlaut: Tel-ler mit ll.' },
  { richtig: 'Mutter', falsch: ['Muter', 'Muhter'], regel: 'Kurzer Selbstlaut: Mut-ter mit tt.' },
  { richtig: 'Zimmer', falsch: ['Zimer', 'Zihmer'], regel: 'Kurzer Selbstlaut: Zim-mer mit mm.' },
  { richtig: 'Hund', falsch: ['Hunt', 'Hundt'], regel: 'Verlängere das Wort: die Hunde – also mit d.' },
  { richtig: 'Wald', falsch: ['Walt', 'Waldt'], regel: 'Verlängere das Wort: die Wälder – also mit d.' },
  { richtig: 'Korb', falsch: ['Korp', 'Korbp'], regel: 'Verlängere das Wort: die Körbe – also mit b.' },
  { richtig: 'Fahrrad', falsch: ['Farrad', 'Fahrrat'], regel: 'fahren mit h, Räder mit d.' },
  { richtig: 'Katze', falsch: ['Kaze', 'Kazte'], regel: 'Nach kurzem Selbstlaut steht tz.' },
  { richtig: 'Brücke', falsch: ['Brüke', 'Brükke'], regel: 'Nach kurzem Selbstlaut steht ck.' },
  { richtig: 'Straße', falsch: ['Strase', 'Strasse'], regel: 'Nach einem langen a steht ß.' }
];
export function genRechtschreibung(level: Difficulty, rng: Rng, n = 6): Task[] {
  const pool = level === 1 ? RECHTSCHREIBUNG.slice(0, 9) : RECHTSCHREIBUNG;
  return sample(rng, pool, n).map((r, i): ChoiceTask => ({
    id: tid('rs', i), type: 'choice', prompt: 'Welches Wort ist richtig geschrieben?',
    options: shuffle(rng, [r.richtig, ...r.falsch.slice(0, level === 1 ? 1 : 2)]).map((w) => ({ id: w, label: w })),
    correctId: r.richtig, optionStyle: 'text', hint: r.regel, explain: [`Richtig ist: ${r.richtig}.`, r.regel]
  }));
}

const ABC_WOERTER = ['Apfel', 'Ball', 'Dach', 'Esel', 'Fisch', 'Garten', 'Hose', 'Igel', 'Junge', 'Kerze', 'Lampe', 'Maus', 'Nest', 'Ofen', 'Pferd', 'Rabe', 'Sofa', 'Tisch', 'Uhr', 'Vogel', 'Wolke', 'Zebra'];
const ABC_GLEICH = [['Baum', 'Ball', 'Bett', 'Birne'], ['Maus', 'Mond', 'Mama', 'Mütze'], ['Sonne', 'Salat', 'Seil', 'Sofa']];
export function genAbc(level: Difficulty, rng: Rng, n = 4): Task[] {
  return times(n, (i): Task => {
    const words = level === 3 && i % 2 === 1 ? sample(rng, pick(rng, ABC_GLEICH), 4) : sample(rng, ABC_WOERTER, level === 1 ? 3 : 4);
    const sorted = [...words].sort((a, b) => a.localeCompare(b, 'de'));
    return {
      id: tid('abc', i), type: 'order', prompt: 'Ordne die Wörter nach dem ABC!',
      items: shuffle(rng, words).map((w) => ({ id: w, label: w })), correctOrder: sorted,
      hint: sorted[0]![0] === sorted[1]![0] ? 'Alle beginnen gleich? Dann schau auf den zweiten Buchstaben.' : 'Sage das ABC auf. Welcher Anfangsbuchstabe kommt zuerst?',
      explain: [`Die richtige Reihenfolge ist: ${sorted.join(', ')}.`]
    };
  });
}

const NOMEN = ['Hund', 'Tisch', 'Blume', 'Schule', 'Auto', 'Freund', 'Haus', 'Apfel', 'Baum', 'Lehrerin', 'Ball', 'Buch'];
const NICHT_NOMEN = ['laufen', 'schön', 'groß', 'spielen', 'schnell', 'lesen', 'rot', 'singen', 'leise', 'malen', 'klein', 'springen'];
export function genNomen(level: Difficulty, rng: Rng, n = 6): Task[] {
  return times(n, (i): ChoiceTask => {
    const nomen = pick(rng, NOMEN);
    const andere = sample(rng, NICHT_NOMEN, level === 1 ? 2 : 3);
    const klein = level >= 2;
    return {
      id: tid('nomen', i), type: 'choice',
      prompt: klein ? 'Welches Wort ist ein Nomen und wird großgeschrieben?' : 'Welches Wort ist ein Nomen (Namenwort)?',
      options: shuffle(rng, [nomen, ...andere]).map((w) => ({ id: w, label: klein ? w.toLowerCase() : w })),
      correctId: nomen, optionStyle: 'text',
      hint: 'Kannst du „der“, „die“ oder „das“ davor setzen? Dann ist es ein Nomen.',
      explain: [`„${nomen}“ ist ein Nomen. Man kann sagen: ${artikelVon(nomen)} ${nomen}.`, 'Nomen schreibt man immer groß.']
    };
  });
}
function artikelVon(n: string): string {
  const m: Record<string, string> = { Hund: 'der', Tisch: 'der', Blume: 'die', Schule: 'die', Auto: 'das', Freund: 'der', Haus: 'das', Apfel: 'der', Baum: 'der', Lehrerin: 'die', Ball: 'der', Buch: 'das' };
  return m[n] ?? 'der';
}

/* =================== Texte (eigene Kurzgeschichten) =================== */

interface Lesetext { titel: string; text: string; fragen: { q: string; a: string; f: string[] }[]; klasse: 2 | 3 | 4 }
export const LESETEXTE: Lesetext[] = [
  {
    klasse: 2, titel: 'Mia und der Drachen',
    text: 'Am Samstag geht Mia mit Opa auf die Wiese. Sie hat einen roten Drachen dabei. Der Wind ist stark. Der Drachen fliegt hoch bis über die Bäume. Am Abend sind Mia und Opa müde, aber glücklich.',
    fragen: [
      { q: 'Mit wem geht Mia auf die Wiese?', a: 'mit Opa', f: ['mit Mama', 'mit ihrer Freundin'] },
      { q: 'Welche Farbe hat der Drachen?', a: 'rot', f: ['blau', 'gelb'] },
      { q: 'Wann gehen sie los?', a: 'am Samstag', f: ['am Montag', 'am Sonntag'] }
    ]
  },
  {
    klasse: 2, titel: 'Der kleine Igel',
    text: 'Im Herbst sucht der kleine Igel Blätter. Er baut sich ein warmes Nest unter einer Hecke. Dort schläft er den ganzen Winter lang. Im Frühling wacht er hungrig auf und sucht Käfer und Würmer.',
    fragen: [
      { q: 'Wo baut der Igel sein Nest?', a: 'unter einer Hecke', f: ['auf einem Baum', 'im Teich'] },
      { q: 'Was macht der Igel im Winter?', a: 'Er schläft.', f: ['Er spielt im Schnee.', 'Er sucht Käfer.'] },
      { q: 'Was frisst der Igel im Frühling?', a: 'Käfer und Würmer', f: ['Äpfel und Nüsse', 'Gras'] }
    ]
  },
  {
    klasse: 3, titel: 'Das Klassenbeet',
    text: 'Die Klasse 3b legt im Schulgarten ein Beet an. Jonas lockert die Erde, Aylin sät Radieschen und Ben gießt jeden Morgen. Nach vier Wochen sind die Radieschen rot und rund. Die Kinder ernten sie und machen zusammen ein Frühstück mit Brot und Radieschen.',
    fragen: [
      { q: 'Wer gießt das Beet?', a: 'Ben', f: ['Aylin', 'Jonas'] },
      { q: 'Wie lange dauert es, bis die Radieschen fertig sind?', a: 'vier Wochen', f: ['zwei Tage', 'ein Jahr'] },
      { q: 'Was machen die Kinder mit den Radieschen?', a: 'ein gemeinsames Frühstück', f: ['Sie verkaufen sie.', 'Sie werfen sie weg.'] },
      { q: 'Was ist das Thema des Textes?', a: 'Kinder legen ein Beet an.', f: ['Kinder spielen Fußball.', 'Ein Ausflug in den Zoo.'] }
    ]
  },
  {
    klasse: 3, titel: 'Der verschwundene Schlüssel',
    text: 'Papa sucht seinen Schlüssel. Er schaut in der Jackentasche, im Flur und sogar im Kühlschrank. Lina überlegt: „Wo warst du zuletzt?“ Papa war im Garten und hat die Blumen gegossen. Lina rennt hinaus und findet den Schlüssel neben der Gießkanne.',
    fragen: [
      { q: 'Wo findet Lina den Schlüssel?', a: 'neben der Gießkanne', f: ['im Kühlschrank', 'in der Jackentasche'] },
      { q: 'Warum hilft Linas Frage?', a: 'Papa erinnert sich, wo er zuletzt war.', f: ['Papa wird wütend.', 'Lina hat den Schlüssel versteckt.'] },
      { q: 'Was hat Papa im Garten gemacht?', a: 'Blumen gegossen', f: ['Rasen gemäht', 'Äpfel gepflückt'] }
    ]
  },
  {
    klasse: 4, titel: 'Die Reise des Wassertropfens',
    text: 'Ein Wassertropfen liegt im Meer. Die Sonne scheint, das Wasser erwärmt sich und der Tropfen verdunstet. Als Wasserdampf steigt er nach oben. In der kalten Luft kondensiert er und wird Teil einer Wolke. Die Wolke wird schwerer, bis es regnet. Der Tropfen fällt auf einen Berg, fließt in einen Bach und schließlich über einen Fluss zurück ins Meer. So beginnt der Kreislauf von vorn.',
    fragen: [
      { q: 'Was passiert, wenn die Sonne das Wasser erwärmt?', a: 'Das Wasser verdunstet.', f: ['Das Wasser gefriert.', 'Das Wasser wird salziger.'] },
      { q: 'Wo wird der Wasserdampf zu einer Wolke?', a: 'in der kalten Luft', f: ['im warmen Meer', 'im Bach'] },
      { q: 'Wie kommt der Tropfen zurück ins Meer?', a: 'über Bach und Fluss', f: ['mit dem Wind', 'durch ein Rohr'] },
      { q: 'Warum heißt es „Kreislauf“?', a: 'Weil alles immer wieder von vorn beginnt.', f: ['Weil die Wolke rund ist.', 'Weil der Tropfen im Kreis schwimmt.'] }
    ]
  },
  {
    klasse: 4, titel: 'Projekt: Weniger Müll',
    text: 'Die Klasse 4a möchte weniger Müll produzieren. Zuerst zählen die Kinder eine Woche lang, was im Klassenmüll landet: Am meisten sind es Verpackungen vom Pausenbrot. Deshalb beschließen sie, Brotdosen und Trinkflaschen mitzubringen. Nach einem Monat wiegen sie den Müll erneut. Er ist nur noch halb so schwer. Die Kinder präsentieren ihre Ergebnisse vor der ganzen Schule.',
    fragen: [
      { q: 'Was fanden die Kinder am häufigsten im Müll?', a: 'Verpackungen vom Pausenbrot', f: ['Papier aus Heften', 'Essensreste'] },
      { q: 'Welche Lösung hat die Klasse gefunden?', a: 'Brotdosen und Trinkflaschen', f: ['mehr Mülleimer', 'kein Frühstück mehr'] },
      { q: 'Wie hat sich der Müll nach einem Monat verändert?', a: 'Er war nur noch halb so schwer.', f: ['Er war doppelt so schwer.', 'Er war gleich geblieben.'] },
      { q: 'Warum haben die Kinder zuerst gezählt?', a: 'Um herauszufinden, woher der meiste Müll kommt.', f: ['Weil die Lehrerin Mathe üben wollte.', 'Um den Müll zu verkaufen.'] }
    ]
  }
];
export function genLesetexte(klasse: 2 | 3 | 4) {
  return (_level: Difficulty, rng: Rng): Task[] => {
    const text = pick(rng, LESETEXTE.filter((t) => t.klasse === klasse));
    return text.fragen.map((f, i): ChoiceTask => ({
      id: tid('text', i), type: 'choice', prompt: f.q,
      visual: { kind: 'story', title: text.titel, text: text.text },
      options: shuffle(rng, [f.a, ...f.f]).map((x) => ({ id: x, label: x })), correctId: f.a, optionStyle: 'text',
      hint: 'Lies den Text noch einmal. Die Antwort steht darin.', explain: [`Im Text steht: ${f.a}`]
    }));
  };
}

/* =================== Klasse 3 =================== */

const WORTARTEN: { w: string; art: 'Nomen' | 'Verb' | 'Adjektiv' }[] = [
  { w: 'Fenster', art: 'Nomen' }, { w: 'Sonne', art: 'Nomen' }, { w: 'Lehrer', art: 'Nomen' }, { w: 'Freude', art: 'Nomen' },
  { w: 'rennen', art: 'Verb' }, { w: 'schreiben', art: 'Verb' }, { w: 'lachen', art: 'Verb' }, { w: 'bauen', art: 'Verb' },
  { w: 'fröhlich', art: 'Adjektiv' }, { w: 'laut', art: 'Adjektiv' }, { w: 'weich', art: 'Adjektiv' }, { w: 'mutig', art: 'Adjektiv' }
];
export function genWortarten(_level: Difficulty, rng: Rng, n = 6): Task[] {
  return sample(rng, WORTARTEN, n).map((w, i): ChoiceTask => ({
    id: tid('wa', i), type: 'choice', prompt: `Welche Wortart ist „${w.w}“?`,
    visual: { kind: 'text', text: w.w, size: 'xl' },
    options: [{ id: 'Nomen', label: 'Nomen' }, { id: 'Verb', label: 'Verb' }, { id: 'Adjektiv', label: 'Adjektiv' }],
    correctId: w.art, optionStyle: 'text',
    hint: 'Nomen: der/die/das passt davor. Verb: ich … kann man sagen. Adjektiv: Wie ist etwas?',
    explain: [w.art === 'Nomen' ? `Man kann sagen: der/die/das ${w.w}. Also ein Nomen.` : w.art === 'Verb' ? `Man kann sagen: ich ${w.w.replace(/en$/, 'e')}. Also ein Verb.` : `Man kann sagen: Etwas ist ${w.w}. Also ein Adjektiv.`]
  }));
}

const MEHRZAHL: [string, string][] = [['der Baum', 'die Bäume'], ['das Kind', 'die Kinder'], ['die Maus', 'die Mäuse'], ['der Apfel', 'die Äpfel'], ['das Buch', 'die Bücher'], ['die Katze', 'die Katzen'], ['der Vogel', 'die Vögel'], ['das Haus', 'die Häuser'], ['die Hand', 'die Hände'], ['der Stuhl', 'die Stühle']];
const FALSCH_ENDUNGEN = ['s', 'en', 'e', 'er'];
export function genMehrzahl(_level: Difficulty, rng: Rng, n = 6): Task[] {
  return sample(rng, MEHRZAHL, n).map(([ez, mz], i): ChoiceTask => {
    const stamm = ez.split(' ')[1]!;
    const falsch = [...new Set(FALSCH_ENDUNGEN.map((e) => `die ${stamm}${e}`).filter((x) => x !== mz))];
    return {
      id: tid('mz', i), type: 'choice', prompt: `Wie heißt die Mehrzahl von „${ez}“?`,
      options: shuffle(rng, [mz, ...sample(rng, falsch, 2)]).map((x) => ({ id: x, label: x })), correctId: mz, optionStyle: 'text',
      hint: 'Sage: eins, zwei, viele … Oft ändert sich auch ein Selbstlaut: a → ä.', explain: [`${ez} – ${mz}`]
    };
  });
}

/* =================== Klasse 4 =================== */

const SATZGLIEDER: { satz: string; frage: 'Subjekt' | 'Prädikat'; a: string; f: string[] }[] = [
  { satz: 'Der Hund bellt laut.', frage: 'Subjekt', a: 'Der Hund', f: ['bellt', 'laut'] },
  { satz: 'Die Kinder spielen im Park.', frage: 'Prädikat', a: 'spielen', f: ['Die Kinder', 'im Park'] },
  { satz: 'Am Morgen backt Oma einen Kuchen.', frage: 'Subjekt', a: 'Oma', f: ['einen Kuchen', 'Am Morgen'] },
  { satz: 'Meine Schwester liest ein spannendes Buch.', frage: 'Prädikat', a: 'liest', f: ['Meine Schwester', 'ein spannendes Buch'] },
  { satz: 'Im Winter schläft der Bär in seiner Höhle.', frage: 'Subjekt', a: 'der Bär', f: ['Im Winter', 'in seiner Höhle'] },
  { satz: 'Die Lehrerin erklärt die Aufgabe.', frage: 'Prädikat', a: 'erklärt', f: ['Die Lehrerin', 'die Aufgabe'] },
  { satz: 'Zwei Vögel bauen ein Nest.', frage: 'Subjekt', a: 'Zwei Vögel', f: ['bauen', 'ein Nest'] }
];
export function genSatzglieder(_level: Difficulty, rng: Rng, n = 6): Task[] {
  return sample(rng, SATZGLIEDER, n).map((s, i): ChoiceTask => ({
    id: tid('sg', i), type: 'choice', prompt: `Was ist das ${s.frage} in diesem Satz?`,
    visual: { kind: 'text', text: s.satz, size: 'md' },
    options: shuffle(rng, [s.a, ...s.f]).map((x) => ({ id: x, label: x })), correctId: s.a, optionStyle: 'text',
    hint: s.frage === 'Subjekt' ? 'Frage: Wer oder was tut etwas?' : 'Frage: Was tut jemand? Das Prädikat ist das Verb.',
    explain: [s.frage === 'Subjekt' ? `Wer oder was? → ${s.a}` : `Was tut jemand? → ${s.a}`, `Das ${s.frage} ist „${s.a}“.`]
  }));
}

const ZEITFORMEN: { satz: string; zeit: 'Präsens' | 'Präteritum' | 'Perfekt' | 'Futur' }[] = [
  { satz: 'Ich spiele Fußball.', zeit: 'Präsens' }, { satz: 'Ich spielte Fußball.', zeit: 'Präteritum' },
  { satz: 'Ich habe Fußball gespielt.', zeit: 'Perfekt' }, { satz: 'Ich werde Fußball spielen.', zeit: 'Futur' },
  { satz: 'Wir gingen in den Zoo.', zeit: 'Präteritum' }, { satz: 'Sie ist nach Hause gelaufen.', zeit: 'Perfekt' },
  { satz: 'Morgen werden wir backen.', zeit: 'Futur' }, { satz: 'Der Hund schläft.', zeit: 'Präsens' },
  { satz: 'Tim las ein Buch.', zeit: 'Präteritum' }, { satz: 'Ihr habt gut gesungen.', zeit: 'Perfekt' }
];
export function genZeitformen(_level: Difficulty, rng: Rng, n = 6): Task[] {
  return sample(rng, ZEITFORMEN, n).map((z, i): ChoiceTask => ({
    id: tid('zf', i), type: 'choice', prompt: 'In welcher Zeitform steht der Satz?',
    visual: { kind: 'text', text: z.satz, size: 'md' },
    options: ['Präsens', 'Präteritum', 'Perfekt', 'Futur'].map((x) => ({ id: x, label: x })), correctId: z.zeit, optionStyle: 'text',
    hint: 'Gegenwart: jetzt. Präteritum: einfache Vergangenheit. Perfekt: haben/sein + Partizip. Futur: werden + Verb.',
    explain: [`„${z.satz}“ steht im ${z.zeit}.`]
  }));
}

export const GERMAN_MODULES: LearningModule[] = [
  { id: 'd1-anlaute', title: 'Anlaute', subtitle: 'Buchstaben hören', emoji: '👂', color: 'koralle', area: 'schule', years: [1, 1], countries: ['DE'], subject: 'deutsch', topic: 'Buchstaben', roundSize: 6, generate: (l, r) => genAnlaute(l, r) },
  { id: 'd1-silben', title: 'Silben', subtitle: 'Klatschen und bauen', emoji: '👏', color: 'sonne', area: 'schule', years: [1, 1], countries: ['DE'], subject: 'deutsch', topic: 'Silben', roundSize: 6, generate: (l, r) => genSilben(l, r) },
  { id: 'd1-woerter', title: 'Wörter bauen', subtitle: 'Buchstabe für Buchstabe', emoji: '🧱', color: 'minze', area: 'schule', years: [1, 1], countries: ['DE'], subject: 'deutsch', topic: 'Einfache Wörter', roundSize: 5, generate: (l, r) => genWoerterBauen(l, r) },
  { id: 'd1-lesen', title: 'Erstes Lesen', subtitle: 'Wort und Bild', emoji: '📖', color: 'himmel', area: 'schule', years: [1, 1], countries: ['DE'], subject: 'deutsch', topic: 'Lesen', roundSize: 6, generate: (l, r) => genLesen1(l, r) },
  { id: 'd2-rechtschreibung', title: 'Rechtschreibung', subtitle: 'ie, ei, Doppelte …', emoji: '✏️', color: 'lila', area: 'schule', years: [2, 2], countries: ['DE'], subject: 'deutsch', topic: 'Rechtschreibung', roundSize: 6, generate: (l, r) => genRechtschreibung(l, r) },
  { id: 'd2-abc', title: 'ABC-Ordnung', subtitle: 'Wörter sortieren', emoji: '🔠', color: 'himmel', area: 'schule', years: [2, 2], countries: ['DE'], subject: 'deutsch', topic: 'Alphabet', roundSize: 4, generate: (l, r) => genAbc(l, r) },
  { id: 'd2-nomen', title: 'Nomen', subtitle: 'Groß oder klein?', emoji: '🏷️', color: 'sonne', area: 'schule', years: [2, 2], countries: ['DE'], subject: 'deutsch', topic: 'Nomen', roundSize: 6, generate: (l, r) => genNomen(l, r) },
  { id: 'd2-lesen', title: 'Lesen und Verstehen', subtitle: 'Kurze Geschichten', emoji: '📚', color: 'minze', area: 'schule', years: [2, 2], countries: ['DE'], subject: 'deutsch', topic: 'Leseverständnis', roundSize: 3, generate: genLesetexte(2) },
  { id: 'd3-wortarten', title: 'Wortarten', subtitle: 'Nomen, Verb, Adjektiv', emoji: '🧩', color: 'lila', area: 'schule', years: [3, 3], countries: ['DE'], subject: 'deutsch', topic: 'Grammatik', roundSize: 6, generate: (l, r) => genWortarten(l, r) },
  { id: 'd3-mehrzahl', title: 'Einzahl und Mehrzahl', subtitle: 'eins, zwei, viele', emoji: '👥', color: 'koralle', area: 'schule', years: [3, 3], countries: ['DE'], subject: 'deutsch', topic: 'Grammatik', roundSize: 6, generate: (l, r) => genMehrzahl(l, r) },
  { id: 'd3-texte', title: 'Textverständnis', subtitle: 'Genau lesen', emoji: '🔍', color: 'himmel', area: 'schule', years: [3, 3], countries: ['DE'], subject: 'deutsch', topic: 'Leseverständnis', roundSize: 4, generate: genLesetexte(3) },
  { id: 'd4-satzglieder', title: 'Satzglieder', subtitle: 'Subjekt und Prädikat', emoji: '🧠', color: 'minze', area: 'schule', years: [4, 4], countries: ['DE'], subject: 'deutsch', topic: 'Satzglieder', roundSize: 6, generate: (l, r) => genSatzglieder(l, r) },
  { id: 'd4-zeitformen', title: 'Zeitformen', subtitle: 'Gestern, heute, morgen', emoji: '⏳', color: 'sonne', area: 'schule', years: [4, 4], countries: ['DE'], subject: 'deutsch', topic: 'Grammatik', roundSize: 6, generate: (l, r) => genZeitformen(l, r) },
  { id: 'd4-texte', title: 'Sachtexte verstehen', subtitle: 'Längere Texte', emoji: '📰', color: 'lila', area: 'schule', years: [4, 4], countries: ['DE'], subject: 'deutsch', topic: 'Leseverständnis', roundSize: 4, generate: genLesetexte(4) }
];
