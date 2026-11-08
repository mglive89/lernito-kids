import type { ChoiceTask, Difficulty, LearningModule, Pick3DTask, Rng, SolidName, Task } from '../types';
import { numberOptions, pick, randInt, sample, shuffle } from '../../lib/random';
import { zahlwort } from '../../content/words';
import { L, getLang, tx } from '../../i18n';
import { b, bankModule, type BankItem } from '../bank';

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;

export const SACH_K1: BankItem[] = [
  b('In welcher Jahreszeit fällt oft Schnee? | Winter | Sommer ; Frühling | Dann ist es draußen sehr kalt.', 'In quale stagione cade spesso la neve? | Inverno | Estate ; Primavera | Allora fuori fa molto freddo.', '❄️'),
  b('In welcher Jahreszeit fallen die bunten Blätter von den Bäumen? | Herbst | Frühling ; Sommer | Diese Jahreszeit kommt nach dem Sommer.', 'In quale stagione cadono le foglie colorate dagli alberi? | Autunno | Primavera ; Estate | Questa stagione viene dopo l’estate.', '🍂'),
  b('Womit hörst du? | mit den Ohren | mit der Nase ; mit den Augen | Sie sind links und rechts am Kopf.', 'Con che cosa senti i suoni? | con le orecchie | con il naso ; con gli occhi | Sono a destra e a sinistra della testa.', '👂'),
  b('Womit riechst du? | mit der Nase | mit dem Mund ; mit den Händen | Sie ist mitten im Gesicht.', 'Con che cosa senti gli odori? | con il naso | con la bocca ; con le mani | È in mezzo alla faccia.', '🌸'),
  b('Wie viele Jahreszeiten gibt es? | 4 | 3 ; 12 | Frühling, Sommer, Herbst, Winter.', 'Quante sono le stagioni? | 4 | 3 ; 12 | Primavera, estate, autunno, inverno.', '🗓️'),
  b('Was ist gesund für deine Zähne? | Zähne putzen | viele Bonbons ; nie zum Zahnarzt | Morgens und abends putzen hilft.', 'Che cosa fa bene ai denti? | lavarli | tante caramelle ; non andare mai dal dentista | Lavarli mattina e sera aiuta.', '🪥'),
  b('Bei welcher Ampelfarbe darfst du gehen? | Grün | Rot ; Gelb | Bei Rot musst du stehen bleiben.', 'Con quale colore del semaforo puoi attraversare? | Verde | Rosso ; Giallo | Con il rosso devi fermarti.', '🚦'),
  b('Wie viele Tage hat eine Woche? | 7 | 5 ; 10 | Montag, Dienstag, Mittwoch …', 'Quanti giorni ha una settimana? | 7 | 5 ; 10 | Lunedì, martedì, mercoledì …', '📅', 2),
  b('Welcher Tag kommt nach Freitag? | Samstag | Donnerstag ; Montag | Dann beginnt das Wochenende.', 'Quale giorno viene dopo venerdì? | Sabato | Giovedì ; Lunedì | Allora comincia il fine settimana.', '📆', 2),
  b('Was braucht eine Pflanze zum Wachsen? | Wasser und Licht | Dunkelheit ; Süßigkeiten | Denk an Sonne und Gießkanne.', 'Di che cosa ha bisogno una pianta per crescere? | acqua e luce | buio ; dolci | Pensa al sole e all’annaffiatoio.', '🌱', 2)
];

export const SACH_K2: BankItem[] = [
  b('Welches Tier legt Eier? | Huhn | Kuh ; Schwein | Es gackert.', 'Quale animale fa le uova? | Gallina | Mucca ; Maiale | Fa coccodè.', '🥚'),
  b('Welches Tier ist ein Säugetier? | Hund | Huhn ; Fisch | Säugetiere trinken als Baby Milch bei der Mutter.', 'Quale animale è un mammifero? | Cane | Gallina ; Pesce | I mammiferi da piccoli bevono il latte della mamma.', '🐶'),
  b('Was wird aus einer Raupe? | ein Schmetterling | ein Vogel ; eine Biene | Sie verpuppt sich erst.', 'Che cosa diventa un bruco? | una farfalla | un uccello ; un’ape | Prima diventa una crisalide.', '🐛'),
  b('Wo wachsen Äpfel? | am Baum | in der Erde ; im Wasser | Man pflückt sie oben.', 'Dove crescono le mele? | sull’albero | sotto terra ; nell’acqua | Si raccolgono in alto.', '🍎'),
  b('Woran erkennst du einen Zebrastreifen? | weiße Streifen auf der Straße | rote Punkte ; eine blaue Ampel | Er sieht aus wie ein Zebra.', 'Come riconosci le strisce pedonali? | strisce bianche sulla strada | puntini rossi ; un semaforo blu | Sembrano una zebra.', '🦓'),
  b('Was machst du, bevor du über die Straße gehst? | nach links und rechts schauen | nur nach oben schauen ; gar nicht schauen | Links – rechts – links.', 'Che cosa fai prima di attraversare la strada? | guardo a sinistra e a destra | guardo solo in alto ; non guardo | Sinistra, destra, sinistra.', '🚸'),
  b('Was gehört ins Altpapier? | alte Zeitung | Bananenschale ; Glasflasche | Diese Tonne ist meist blau.', 'Che cosa va nella carta? | un giornale vecchio | la buccia di banana ; una bottiglia di vetro | Il bidone è spesso blu o bianco.', '🗞️', 2),
  b('Welches Organ pumpt Blut durch den Körper? | das Herz | der Magen ; die Lunge | Du kannst es schlagen fühlen.', 'Quale organo pompa il sangue nel corpo? | il cuore | lo stomaco ; i polmoni | Lo senti battere.', '❤️', 2),
  b('Was macht ein Eichhörnchen im Herbst? | Es sammelt Vorräte. | Es fliegt nach Süden. ; Es legt Eier. | Es versteckt Nüsse für den Winter.', 'Che cosa fa lo scoiattolo in autunno? | Raccoglie provviste. | Vola verso sud. ; Depone le uova. | Nasconde noci per l’inverno.', '🐿️', 2)
];

export const SACH_K3: BankItem[] = [
  b('Wie nennt man es, wenn Wasser durch Wärme zu Dampf wird? | verdunsten | gefrieren ; schmelzen | Pfützen verschwinden in der Sonne.', 'Come si chiama quando l’acqua diventa vapore con il calore? | evaporazione | congelamento ; fusione | Le pozzanghere spariscono al sole.', '☀️'),
  b('Bei wie viel Grad Celsius gefriert Wasser? | 0 °C | 10 °C ; 100 °C | Dann wird Wasser zu Eis.', 'A quanti gradi Celsius gela l’acqua? | 0 °C | 10 °C ; 100 °C | Allora l’acqua diventa ghiaccio.', '🧊'),
  b('Welche Teile hat eine Pflanze? | Wurzel, Stängel, Blätter, Blüte | Kopf, Arme, Beine ; Rad, Lenker, Sattel | Ein Teil steckt in der Erde.', 'Quali sono le parti di una pianta? | radice, fusto, foglie, fiore | testa, braccia, gambe ; ruota, manubrio, sellino | Una parte sta sotto terra.', '🌷'),
  b('Was gehört in den Biomüll? | Apfelreste | Joghurtbecher ; Batterien | Es kann verrotten und zu Erde werden.', 'Che cosa va nell’umido? | il torsolo della mela | il vasetto dello yogurt ; le pile | Si decompone e diventa terra.', '🍏'),
  b('Warum sind Bienen wichtig? | Sie bestäuben Blüten. | Sie fressen Blätter. ; Sie bauen Straßen. | Ohne sie gäbe es weniger Obst.', 'Perché le api sono importanti? | Impollinano i fiori. | Mangiano le foglie. ; Costruiscono strade. | Senza di loro ci sarebbe meno frutta.', '🐝'),
  b('Was ist ein Laubbaum? | Eiche | Tanne ; Fichte | Laubbäume haben Blätter, keine Nadeln.', 'Quale di questi è una latifoglia? | Quercia | Abete ; Pino | Le latifoglie hanno foglie larghe, non aghi.', '🌳'),
  b('Wo leben Kaulquappen? | im Wasser | auf Bäumen ; in der Wüste | Kaulquappen haben einen Ruderschwanz.', 'Dove vivono i girini? | nell’acqua | sugli alberi ; nel deserto | I girini hanno la coda per nuotare.', '🐸', 2),
  b('Wie kann man Energie sparen? | Licht ausschalten, wenn man den Raum verlässt | Fenster im Winter offen lassen ; den Fernseher immer anlassen | Was nicht läuft, verbraucht keinen Strom.', 'Come si risparmia energia? | spegnendo la luce quando si esce dalla stanza | lasciando le finestre aperte d’inverno ; lasciando sempre accesa la TV | Ciò che è spento non consuma corrente.', '💡', 2),
  b('In welchem Zustand ist Wasser als Eis? | fest | flüssig ; gasförmig | Eis kann man in die Hand nehmen.', 'In che stato è l’acqua quando è ghiaccio? | solido | liquido ; gassoso | Il ghiaccio si può prendere in mano.', '🧊', 2)
];

export const SACH_K4: BankItem[] = [
  b('Wie heißt die Hauptstadt von Deutschland? | Berlin | München ; Hamburg | Dort steht das Brandenburger Tor.', 'Qual è la capitale della Germania? | Berlino | Monaco ; Amburgo | Lì si trova la Porta di Brandeburgo.', '🇩🇪', 1, 'DE'),
  b('Wie viele Bundesländer hat Deutschland? | 16 | 12 ; 20 | Es sind mehr als 15.', 'Quanti Länder (stati federali) ha la Germania? | 16 | 12 ; 20 | Sono più di 15.', '🗺️', 1, 'DE'),
  b('Welcher Fluss fließt durch Köln und Mainz? | der Rhein | die Themse ; der Nil | Er ist einer der längsten Flüsse Deutschlands.', 'Quale fiume attraversa Colonia e Magonza? | il Reno | il Tamigi ; il Nilo | È uno dei fiumi più lunghi della Germania.', '🏞️', 2, 'DE'),
  b('Wie heißt die Hauptstadt von Italien? | Rom | Mailand ; Neapel | Dort steht das Kolosseum.', 'Qual è la capitale d’Italia? | Roma | Milano ; Napoli | Lì si trova il Colosseo.', '🇮🇹', 1, 'IT'),
  b('Wie viele Regionen hat Italien? | 20 | 16 ; 12 | Es sind genau zwanzig.', 'Quante regioni ha l’Italia? | 20 | 16 ; 12 | Sono esattamente venti.', '🗺️', 1, 'IT'),
  b('Welcher ist der längste Fluss Italiens? | der Po | der Tiber ; der Arno | Er fließt durch die Poebene.', 'Qual è il fiume più lungo d’Italia? | il Po | il Tevere ; l’Arno | Attraversa la Pianura Padana.', '🏞️', 2, 'IT'),
  b('Welcher Stoff leitet Strom gut? | Kupfer | Holz ; Gummi | Kabel enthalten dieses Metall.', 'Quale materiale conduce bene la corrente? | rame | legno ; gomma | I cavi elettrici contengono questo metallo.', '🔌'),
  b('Was zieht ein Magnet an? | eine Büroklammer aus Eisen | ein Blatt Papier ; einen Holzlöffel | Magnete ziehen Eisen an.', 'Che cosa attira una calamita? | una graffetta di ferro | un foglio di carta ; un cucchiaio di legno | Le calamite attirano il ferro.', '🧲'),
  b('Was zeigt ein Kompass an? | die Himmelsrichtung | die Uhrzeit ; die Temperatur | Die Nadel zeigt nach Norden.', 'Che cosa indica la bussola? | i punti cardinali | l’ora ; la temperatura | L’ago indica il nord.', '🧭'),
  b('Was bedeutet „nachhaltig“? | So handeln, dass auch später genug für alle da ist | Möglichst viel kaufen ; Etwas sehr schnell erledigen | Es geht um die Zukunft.', 'Che cosa significa «sostenibile»? | agire in modo che ci sia abbastanza per tutti anche in futuro | comprare il più possibile ; fare tutto in fretta | Riguarda il futuro.', '♻️', 2),
  b('Welches Organ brauchst du zum Atmen? | die Lunge | die Leber ; den Magen | Sie füllt sich mit Luft.', 'Quale organo serve per respirare? | i polmoni | il fegato ; lo stomaco | Si riempiono d’aria.', '🫁', 2)
];

export const ENGLISCH: BankItem[] = [
  b('Was heißt „rot“ auf Englisch? | red | blue ; green | Ein roter Apfel ist ein „red apple“.', 'Come si dice «rosso» in inglese? | red | blue ; green | Una mela rossa è una «red apple».', '🔴'),
  b('Was heißt „Hund“ auf Englisch? | dog | cat ; bird | Er sagt „woof“.', 'Come si dice «cane» in inglese? | dog | cat ; bird | Fa «woof».', '🐶'),
  b('Was heißt „Katze“ auf Englisch? | cat | dog ; cow | Sie sagt „meow“.', 'Come si dice «gatto» in inglese? | cat | dog ; cow | Fa «meow».', '🐱'),
  b('Was heißt „drei“ auf Englisch? | three | two ; five | one, two, three …', 'Come si dice «tre» in inglese? | three | two ; five | one, two, three …', '3️⃣'),
  b('Was heißt „Hallo“ auf Englisch? | hello | goodbye ; thanks | Man sagt es zur Begrüßung.', 'Come si dice «ciao» (quando arrivi) in inglese? | hello | goodbye ; thanks | Si usa per salutare.', '👋'),
  b('Was heißt „blau“ auf Englisch? | blue | yellow ; black | Der Himmel ist blue.', 'Come si dice «blu» in inglese? | blue | yellow ; black | Il cielo è blue.', '🔵'),
  b('Was heißt „Apfel“ auf Englisch? | apple | banana ; orange | An apple a day …', 'Come si dice «mela» in inglese? | apple | banana ; orange | An apple a day …', '🍎'),
  b('Was heißt „Danke“ auf Englisch? | thank you | please ; sorry | Man sagt es, wenn man etwas bekommt.', 'Come si dice «grazie» in inglese? | thank you | please ; sorry | Si dice quando si riceve qualcosa.', '🙏'),
  b('Was heißt „Sonne“ auf Englisch? | sun | moon ; star | Ein sonniger Tag ist ein „sunny day“.', 'Come si dice «sole» in inglese? | sun | moon ; star | Una giornata di sole è un «sunny day».', '☀️', 2),
  b('Was heißt „Mutter“ auf Englisch? | mother | father ; sister | Kurz sagt man auch „mum“.', 'Come si dice «mamma» in inglese? | mother | father ; sister | Si dice anche «mum».', '👩', 2),
  b('Was heißt „grün“ auf Englisch? | green | grey ; brown | Gras ist green.', 'Come si dice «verde» in inglese? | green | grey ; brown | L’erba è green.', '🟢', 2),
  b('Was heißt „Schule“ auf Englisch? | school | house ; shop | Man spricht es „skuul“.', 'Come si dice «scuola» in inglese? | school | house ; shop | Si pronuncia «skuul».', '🏫', 3),
  b('Was heißt „Buch“ auf Englisch? | book | look ; cook | Es reimt sich auf „look“.', 'Come si dice «libro» in inglese? | book | look ; cook | Fa rima con «look».', '📖', 2),
  b('Was heißt „Wasser“ auf Englisch? | water | wind ; wood | Es klingt fast wie im Deutschen.', 'Come si dice «acqua» in inglese? | water | wind ; wood | Si pronuncia «uòter».', '💧', 2),
  b('Wie sagt man „Ich heiße Anna“ auf Englisch? | My name is Anna. | I am name Anna. ; Me Anna name. | name = Name', 'Come si dice «Mi chiamo Anna» in inglese? | My name is Anna. | I am name Anna. ; Me Anna name. | name = nome', '🙋', 3),
  b('Welcher Tag ist „Monday“? | Montag | Sonntag ; Freitag | Monday ist der erste Tag der Woche.', 'Quale giorno è «Monday»? | lunedì | domenica ; venerdì | Monday è il primo giorno della settimana.', '📅', 3)
];

/* =================== 3D-Lernwelt =================== */

const SOLIDS: { id: SolidName; de: string; it: string; hde: string; hit: string }[] = [
  { id: 'wuerfel', de: 'Würfel', it: 'Cubo', hde: 'Alle 6 Flächen sind gleich große Quadrate.', hit: 'Ha 6 facce, tutte quadrati uguali.' },
  { id: 'kugel', de: 'Kugel', it: 'Sfera', hde: 'Sie ist überall rund und rollt in jede Richtung.', hit: 'È tutta rotonda e rotola in ogni direzione.' },
  { id: 'zylinder', de: 'Zylinder', it: 'Cilindro', hde: 'Oben und unten ist ein Kreis – wie eine Dose.', hit: 'Sopra e sotto c’è un cerchio, come una lattina.' },
  { id: 'kegel', de: 'Kegel', it: 'Cono', hde: 'Unten ein Kreis, oben eine Spitze – wie eine Eistüte.', hit: 'Sotto un cerchio, sopra una punta, come un cono gelato.' },
  { id: 'pyramide', de: 'Pyramide', it: 'Piramide', hde: 'Sie hat eine eckige Grundfläche und Dreiecke bis zur Spitze.', hit: 'Ha una base con angoli e triangoli fino alla punta.' },
  { id: 'quader', de: 'Quader', it: 'Parallelepipedo', hde: 'Wie ein Schuhkarton: 6 Rechtecke.', hit: 'Come una scatola da scarpe: 6 rettangoli.' }
];
const SOLID_COLORS = ['#FF6F59', '#3A9BDC', '#2EC4B6', '#8E6CEF', '#FFB627'];

export function genKoerper3d(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = level === 1 ? SOLIDS.slice(0, 4) : SOLIDS;
  return Array.from({ length: n }, (_, i): ChoiceTask => {
    const s = pick(rng, pool);
    return {
      id: tid('k3d', i), type: 'choice', prompt: L('Dreh den Körper mit dem Finger. Welcher Körper ist das?', 'Ruota il solido con il dito. Che solido è?'),
      visual: { kind: 'solid3d', solid: s.id, color: pick(rng, SOLID_COLORS) },
      options: shuffle(rng, [s, ...sample(rng, pool.filter((x) => x.id !== s.id), 2)]).map((x) => ({ id: x.id, label: L(x.de, x.it) })),
      correctId: s.id, optionStyle: 'text', hint: L('Dreh ihn ganz herum. Hat er Ecken? Ist er rund?', 'Giralo tutto. Ha angoli? È rotondo?'),
      explain: [L(`Das ist ein${s.id === 'kugel' || s.id === 'pyramide' ? 'e' : ''} ${s.de}.`, `È un${s.id === 'kugel' || s.id === 'pyramide' ? 'a' : ''} ${s.it.toLowerCase()}.`), L(s.hde, s.hit)]
    };
  });
}

export function genZaehlen3d(level: Difficulty, rng: Rng, n = 4): Task[] {
  const max = level === 1 ? 5 : level === 2 ? 8 : 10;
  return Array.from({ length: n }, (_, i): ChoiceTask => {
    const count = randInt(rng, 2, max);
    const item = pick(rng, ['apfel', 'ball', 'stern'] as const);
    const name = item === 'apfel' ? L('Äpfel', 'mele') : item === 'ball' ? L('Bälle', 'palle') : L('Sterne', 'stelle');
    return {
      id: tid('z3d', i), type: 'choice', prompt: L(`Tippe jedes Ding an, um es in den Korb zu legen. Wie viele ${name} sind es?`, `Tocca ogni oggetto per metterlo nel cesto. Quante ${name} sono?`),
      visual: { kind: 'count3d', count, item },
      options: numberOptions(rng, count, 3, 1, max + 1, 2).map((v) => ({ id: String(v), label: String(v) })),
      correctId: String(count), optionStyle: 'big', hint: L('Tippe sie nacheinander an und zähle laut mit.', 'Toccali uno dopo l’altro e conta ad alta voce.'),
      explain: [L('Gezählt: ', 'Contati: ') + Array.from({ length: count }, (_, k) => zahlwort(k + 1)).join(', ') + '.', L(`Es sind ${count} ${name}.`, `Sono ${count} ${name}.`)]
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
      prompt: useRechnung ? L(`Tippe auf den Würfel mit dem Ergebnis von ${a} + ${target - a}!`, `Tocca il cubo con il risultato di ${a} + ${target - a}!`) : L(`Tippe auf den Zahlenwürfel ${target}!`, `Tocca il cubo con il numero ${target}!`),
      items: nums.map((v) => ({ id: String(v), label: String(v) })), correctId: String(target),
      hint: useRechnung ? L(`Rechne zuerst: ${a} + ${target - a}.`, `Prima calcola: ${a} + ${target - a}.`) : L('Schau dir alle schwebenden Würfel an. Du kannst die Welt auch drehen.', 'Guarda tutti i cubi che fluttuano. Puoi anche ruotare il mondo.'),
      explain: useRechnung ? [`${a} + ${target - a} = ${target}`] : [L(`Die gesuchte Zahl ist ${target}.`, `Il numero cercato è ${target}.`)]
    };
  });
}

const WIESE = [
  { id: '🐰', de: 'der Hase', it: 'il coniglio', qde: 'Wer hat lange Ohren und hoppelt über die Wiese?', qit: 'Chi ha le orecchie lunghe e saltella nel prato?' },
  { id: '🐝', de: 'die Biene', it: 'l’ape', qde: 'Wer sammelt Nektar aus den Blüten?', qit: 'Chi raccoglie il nettare dai fiori?' },
  { id: '🐞', de: 'der Marienkäfer', it: 'la coccinella', qde: 'Wer ist rot mit schwarzen Punkten?', qit: 'Chi è rossa a puntini neri?' },
  { id: '🦔', de: 'der Igel', it: 'il riccio', qde: 'Wer hat Stacheln auf dem Rücken?', qit: 'Chi ha gli aculei sulla schiena?' },
  { id: '🐌', de: 'die Schnecke', it: 'la lumaca', qde: 'Wer trägt sein Haus auf dem Rücken und ist ganz langsam?', qit: 'Chi porta la casa sulla schiena ed è lentissima?' },
  { id: '🦋', de: 'der Schmetterling', it: 'la farfalla', qde: 'Wer war früher eine Raupe?', qit: 'Chi prima era un bruco?' },
  { id: '🐦', de: 'der Vogel', it: 'l’uccellino', qde: 'Wer baut ein Nest im Baum und kann fliegen?', qit: 'Chi fa il nido sull’albero e sa volare?' },
  { id: '🐸', de: 'der Frosch', it: 'la rana', qde: 'Wer quakt am Teich?', qit: 'Chi gracida nello stagno?' }
];
export function genNatur3d(level: Difficulty, rng: Rng, n = 5): Task[] {
  return sample(rng, WIESE, n).map((t, i): Pick3DTask => ({
    id: tid('n3d', i), type: 'pick3d', scene: 'wiese', prompt: L(t.qde, t.qit),
    items: shuffle(rng, [t, ...sample(rng, WIESE.filter((w) => w.id !== t.id), level === 1 ? 2 : 4)]).map((w) => ({ id: w.id, label: w.id })),
    correctId: t.id, hint: L('Schau dir alle Tiere auf der Wiese an. Du kannst die Wiese drehen.', 'Guarda tutti gli animali nel prato. Puoi ruotare il prato.'),
    explain: [L(`Das ist ${t.de} ${t.id}.`, `È ${t.it} ${t.id}.`)]
  }));
}

export const SACH_MODULES: LearningModule[] = [
  bankModule({ id: 's1-jahreszeiten', subject: 'sachkunde', years: [1, 1], title: ['Ich und die Jahreszeiten', 'Io e le stagioni'], subtitle: ['Körper, Wetter, Verkehr', 'Corpo, tempo, strada'], emoji: '🌦️', color: 'minze', items: SACH_K1 }),
  bankModule({ id: 's2-tiere', subject: 'sachkunde', years: [2, 2], title: ['Tiere, Pflanzen, Verkehr', 'Animali, piante, strada'], subtitle: ['Die Welt um uns', 'Il mondo intorno a noi'], emoji: '🐿️', color: 'sonne', items: SACH_K2 }),
  bankModule({ id: 's3-natur', subject: 'sachkunde', years: [3, 3], title: ['Natur und Umwelt', 'Natura e ambiente'], subtitle: ['Wasser, Pflanzen, Müll', 'Acqua, piante, rifiuti'], emoji: '🌍', color: 'minze', items: SACH_K3 }),
  bankModule({ id: 's4-welt', subject: 'sachkunde', years: [4, 5], title: ['Mein Land und Technik', 'Il mio Paese e la tecnica'], subtitle: ['Strom, Magnete, Karten', 'Corrente, calamite, carte'], emoji: '🧭', color: 'himmel', items: SACH_K4 }),
  bankModule({ id: 'e-basis', subject: 'englisch', years: [1, 5], title: ['English for Kids', 'English for Kids'], subtitle: ['Erste englische Wörter', 'Prime parole in inglese'], emoji: '🇬🇧', color: 'koralle', items: ENGLISCH })
];

export const WORLD3D_MODULES: LearningModule[] = [
  { id: '3d-koerper', title: tx('Körper drehen', 'Ruota i solidi'), subtitle: tx('Würfel, Kugel, Kegel …', 'Cubo, sfera, cono …'), emoji: '🧊', color: 'lila', area: 'welt3d', topic: tx('Geometrische Körper', 'Solidi geometrici'), roundSize: 5, uses3d: true, generate: (l, r) => genKoerper3d(l, r) },
  { id: '3d-zaehlen', title: tx('Sammeln und Zählen', 'Raccogli e conta'), subtitle: tx('Dinge in den Korb legen', 'Metti gli oggetti nel cesto'), emoji: '🧺', color: 'koralle', area: 'welt3d', topic: tx('Zählen', 'Contare'), roundSize: 4, uses3d: true, generate: (l, r) => genZaehlen3d(l, r) },
  { id: '3d-zahlenwelt', title: tx('3D-Zahlenwelt', 'Mondo dei numeri 3D'), subtitle: tx('Schwebende Zahlenwürfel', 'Cubi con i numeri'), emoji: '🎲', color: 'himmel', area: 'welt3d', topic: tx('Zahlen', 'Numeri'), roundSize: 5, uses3d: true, generate: (l, r) => genZahlenwelt3d(l, r) },
  { id: '3d-wiese', title: tx('Tiere auf der Wiese', 'Animali nel prato'), subtitle: tx('Natur entdecken', 'Scopri la natura'), emoji: '🌼', color: 'minze', area: 'welt3d', topic: tx('Natur', 'Natura'), roundSize: 5, uses3d: true, generate: (l, r) => genNatur3d(l, r) }
];

export const isItalian = () => getLang() === 'it';
