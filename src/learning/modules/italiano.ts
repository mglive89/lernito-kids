import type { Difficulty, LearningModule, Rng, Task } from '../types';
import { pick, sample, shuffle } from '../../lib/random';
import { b, bankModule, type BankItem } from '../bank';
import { PAROLE, PAROLE_FACILI } from '../../content/words';
import { tx } from '../../i18n';

/* Italiano per la scuola italiana (primaria, medie, superiori). Le domande sono in italiano perché riguardano la lingua italiana. */

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;
const LETTERE = 'ABCDEFGILMNOPRSTUVZ'.split('');

function genSillabe(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = PAROLE.filter((p) => (level === 1 ? p.silben.length <= 2 : level === 2 ? p.silben.length <= 3 : true));
  return sample(rng, pool.length >= n ? pool : PAROLE, n).map((p, i): Task => {
    const extra = level === 3 ? [pick(rng, ['ta', 'mi', 'lo', 'ne'])] : [];
    return {
      id: tid('it-sill', i), type: 'wordbuild', prompt: `Componi la parola con le sillabe: ${p.wort}`, speak: `Componi la parola ${p.wort}`,
      visual: { kind: 'bigEmoji', emoji: p.emoji }, solution: p.silben, tiles: shuffle(rng, [...p.silben, ...extra]),
      hint: `Batti le mani: ${p.silben.join(' - ')}.`, explain: [`${p.wort} = ${p.silben.join(' + ')}`, `${p.silben.length} sillabe`]
    };
  });
}

function genLettere(level: Difficulty, rng: Rng, n = 5): Task[] {
  const pool = PAROLE_FACILI.filter((p) => (level === 1 ? p.wort.length <= 4 : true));
  return sample(rng, pool, n).map((p, i): Task => {
    const letters = p.wort.split('');
    const extra = level >= 2 ? sample(rng, LETTERE.filter((l) => !letters.includes(l)), level === 3 ? 2 : 1) : [];
    return {
      id: tid('it-lett', i), type: 'wordbuild', prompt: 'Scrivi la parola lettera per lettera', speak: `Scrivi ${p.wort.toLowerCase()}`,
      visual: { kind: 'bigEmoji', emoji: p.emoji }, solution: letters, tiles: shuffle(rng, [...letters, ...extra]),
      hint: `Ascolta i suoni: ${letters.join(' - ')}.`, explain: [`${p.wort}: ${letters.join(' ')}`]
    };
  });
}

const ORTOGRAFIA: BankItem[] = [
  b('Quale parola è scritta giusta? | palla | pala ; pallla ; palah | Per giocare: doppia L.', undefined, '⚽'),
  b('Quale parola è scritta giusta? | gatto | gato ; gattto ; catto', undefined, '🐱'),
  b('Quale parola è scritta giusta? | chiave | ciave ; kiave ; chave | Davanti a i ed e, il suono duro si scrive CH.', undefined, '🔑'),
  b('Quale parola è scritta giusta? | ghiro | gyro ; gpiro ; ghirro | GH davanti a i ed e per il suono duro.', undefined, '🐿️'),
  b('Quale parola è scritta giusta? | ciliegia | cilieggia ; chiliegia ; ciliegga', undefined, '🍒'),
  b('Quale parola è scritta giusta? | gnomo | nomo ; gniomo ; gnommo | Il suono GN.', undefined, '🧙'),
  b('Quale parola è scritta giusta? | foglia | folia ; fogla ; fogllia | Il suono GLI.', undefined, '🍃'),
  b('Quale parola è scritta giusta? | scuola | squola ; scola ; schuola | Scuola si scrive con CU.', undefined, '🏫', 2),
  b('Quale parola è scritta giusta? | acqua | aqua ; accua ; acua | Acqua si scrive con CQU.', undefined, '💧', 2),
  b('Quale parola è scritta giusta? | sciarpa | siarpa ; sciarppa ; ciarpa | Il suono SCI.', undefined, '🧣'),
  b('Quale parola è scritta giusta? | coniglio | conilio ; conigglio ; conillio', undefined, '🐰'),
  b('Quale parola è scritta giusta? | cuore | quore ; cqore ; cuorre | Eccezione: cuore con CU.', undefined, '❤️', 2),
  b('Quale parola è scritta giusta? | soqquadro | socquadro ; soquadro ; sokquadro | L’unica parola con QQ!', undefined, '🌀', 3),
  b('Quale parola è scritta giusta? | camicia | camica ; camiccia ; chamicia', undefined, '👔', 2)
];

const ACCA_ACCENTO: BankItem[] = [
  b('Completa: «Io ___ un cane.» | ho | o ; hò ; ò | Verbo avere → con H.'),
  b('Completa: «Vuoi il gelato ___ la torta?» | o | ho ; hò ; oh | Congiunzione → senza H.'),
  b('Completa: «Lui ___ fame.» | ha | a ; à ; ah | Verbo avere → con H.'),
  b('Completa: «Vado ___ scuola.» | a | ha ; à ; ah | Preposizione → senza H.'),
  b('Completa: «Loro ___ una bici.» | hanno | anno ; ànno ; hano | Verbo avere → con H.'),
  b('Completa: «Ho compiuto un ___.» | anno | hanno ; ano ; annno | Tempo (12 mesi) → senza H.'),
  b('Completa: «Il cielo ___ azzurro.» | è | e ; é ; eh | Verbo essere → con accento.'),
  b('Completa: «Mamma ___ papà.» | e | è ; é ; he | Congiunzione → senza accento.'),
  b('Quale parola ha l’accento giusto? | perché | perchè ; perche ; pèrche | Accento acuto sulla e di perché.', undefined, undefined, 2),
  b('Quale parola ha l’accento giusto? | città | cittá ; citta ; cittàa', undefined, undefined, 2),
  b('Completa: «Prendi ___ libro.» | un | un’ ; uno ; una | Un libro: maschile, senza apostrofo.', undefined, undefined, 2),
  b('Completa: «Ho visto ___ amica.» | un’ | un ; una ; uno | Femminile davanti a vocale → apostrofo.', undefined, undefined, 3),
  b('Completa: «Non ___ niente.» (verbo fare) | fa | fà ; f’a ; faa | Fa non vuole accento.', undefined, undefined, 3),
  b('Quale frase è corretta? | Qual è il tuo nome? | Qual’è il tuo nome? ; Quale’è il tuo nome? ; Qualè il tuo nome? | Qual è si scrive senza apostrofo.', undefined, undefined, 3)
];

const ARTICOLI_NOMI: BankItem[] = [
  b('Quale articolo va bene? «___ zaino» | lo | il ; la ; i | Davanti a Z si usa LO.', undefined, '🎒'),
  b('Quale articolo va bene? «___ albero» | l’ | il ; lo ; la | Davanti a vocale: L’.', undefined, '🌳'),
  b('Quale articolo va bene? «___ stelle» | le | gli ; i ; la | Femminile plurale.', undefined, '⭐'),
  b('Quale articolo va bene? «___ gnomi» | gli | i ; le ; lo | GN → gli.', undefined, '🧙'),
  b('Qual è il plurale di «uovo»? | uova | uovi ; uove ; uovos | Plurale irregolare.', undefined, '🥚', 2),
  b('Qual è il femminile di «attore»? | attrice | attora ; attoressa ; attrina'),
  b('Che nome è «gregge»? | collettivo | proprio ; astratto ; alterato | Indica un gruppo di pecore.', undefined, '🐑', 2),
  b('Che nome è «Roma»? | proprio | comune ; collettivo ; astratto | Si scrive con la maiuscola.'),
  b('Che nome è «felicità»? | astratto | concreto ; collettivo ; proprio | Non si tocca.', undefined, undefined, 2),
  b('«Gattino» è un nome… | alterato (diminutivo) | primitivo ; composto ; collettivo | gatto + -ino', undefined, '🐱', 2),
  b('Qual è l’aggettivo nella frase «Il cane nero corre»? | nero | cane ; corre ; il'),
  b('Quale parola è un verbo? | saltare | salto (nome) ; alto ; saltello (nome) | Indica un’azione all’infinito.'),
  b('Che tempo è «io mangiavo»? | imperfetto | presente ; passato remoto ; futuro', undefined, undefined, 2),
  b('Che tempo è «noi andremo»? | futuro semplice | presente ; imperfetto ; condizionale', undefined, undefined, 2)
];

const ANALISI_GRAMMATICALE: BankItem[] = [
  b('Analizza «bellissimo»: | aggettivo qualificativo, grado superlativo assoluto | aggettivo, grado positivo ; avverbio di modo ; nome alterato | -issimo → superlativo assoluto.'),
  b('Che pronome è «mio» in «Questo libro è mio»? | possessivo | personale ; dimostrativo ; relativo'),
  b('Che pronome è «che» in «Il ragazzo che corre»? | relativo | interrogativo ; dimostrativo ; congiunzione | Sostituisce «il quale».'),
  b('Che parte del discorso è «velocemente»? | avverbio di modo | aggettivo ; verbo ; preposizione | -mente → avverbio.'),
  b('Che modo verbale è «che io sia»? | congiuntivo | indicativo ; condizionale ; imperativo'),
  b('Che modo verbale è «io andrei»? | condizionale | congiuntivo ; indicativo ; infinito'),
  b('«Io ero stato» è… | trapassato prossimo indicativo | passato prossimo ; passato remoto ; imperfetto', undefined, undefined, 2),
  b('«Fui» è il passato remoto di… | essere | fare ; avere ; fuggire', undefined, undefined, 2),
  b('«La porta è aperta dal vento»: il verbo è in forma… | passiva | attiva ; riflessiva ; impersonale', undefined, undefined, 2),
  b('«Mi lavo» è un verbo in forma… | riflessiva | passiva ; impersonale ; transitiva attiva', undefined, undefined, 2),
  b('Quale verbo è intransitivo? | dormire | mangiare ; leggere ; scrivere | Non regge il complemento oggetto.', undefined, undefined, 2),
  b('«Di», «a», «da», «in», «con», «su», «per», «tra», «fra» sono… | preposizioni semplici | congiunzioni ; articoli ; avverbi'),
  b('«Nel» è… | preposizione articolata (in + il) | preposizione semplice ; articolo ; avverbio di luogo'),
  b('«Ma», «però», «tuttavia» sono congiunzioni… | avversative | causali ; finali ; temporali', undefined, undefined, 3)
];

const ANALISI_LOGICA: BankItem[] = [
  b('Qual è il soggetto in «Domani partirà mio zio»? | mio zio | domani ; partirà ; nessuno | Chi partirà?'),
  b('Qual è il predicato in «Luca è felice»? | è felice (predicato nominale) | Luca ; felice ; è (predicato verbale) | Essere + nome/aggettivo.'),
  b('Qual è il complemento oggetto in «Anna legge un romanzo»? | un romanzo | Anna ; legge ; nessuno | Chi? Che cosa?'),
  b('Che complemento è «a Marta» in «Scrivo a Marta»? | complemento di termine | di specificazione ; oggetto ; di luogo | A chi?'),
  b('Che complemento è «di Paolo» in «La bici di Paolo»? | complemento di specificazione | di termine ; di causa ; di mezzo | Di chi?'),
  b('Che complemento è «in treno» in «Viaggio in treno»? | complemento di mezzo | di luogo ; di modo ; di causa | Con quale mezzo?', undefined, undefined, 2),
  b('Che complemento è «per il freddo» in «Tremava per il freddo»? | complemento di causa | di fine ; di mezzo ; di termine | Per quale motivo?', undefined, undefined, 2),
  b('Che complemento è «dal medico» in «Il bambino fu visitato dal medico»? | complemento d’agente | di moto da luogo ; di origine ; di causa | Frase passiva, persona.', undefined, undefined, 2),
  b('Che complemento è «con gioia» in «Lavorava con gioia»? | complemento di modo | di compagnia ; di mezzo ; di causa | In che modo?', undefined, undefined, 2),
  b('Che cos’è l’apposizione in «Il dottor Rossi è arrivato»? | dottor | Rossi ; è arrivato ; il | Un nome che accompagna un altro nome.', undefined, undefined, 3),
  b('Che cos’è il complemento predicativo del soggetto in «Marco è stato eletto capitano»? | capitano | Marco ; è stato eletto ; nessuno | Completa il verbo copulativo.', undefined, undefined, 3),
  b('Nel periodo «Esco perché c’è il sole», «perché c’è il sole» è una proposizione… | subordinata causale | principale ; coordinata ; finale', undefined, undefined, 3),
  b('Nel periodo «Studio per superare l’esame», la subordinata è… | finale | causale ; temporale ; consecutiva', undefined, undefined, 3)
];

const LETTERATURA: BankItem[] = [
  b('Chi ha scritto «I promessi sposi»? | Alessandro Manzoni | Giacomo Leopardi ; Giovanni Verga ; Ugo Foscolo | Romanzo storico, edizione definitiva 1840–42.'),
  b('Chi ha scritto «L’infinito»? | Giacomo Leopardi | Giosuè Carducci ; Giovanni Pascoli ; Dante Alighieri | 1819, Recanati.'),
  b('Di quante cantiche è composta la «Divina Commedia»? | tre | due ; quattro ; nove | Inferno, Purgatorio, Paradiso.'),
  b('Chi guida Dante nell’Inferno e nel Purgatorio? | Virgilio | Beatrice ; San Bernardo ; Omero'),
  b('Chi ha scritto il «Decameron»? | Giovanni Boccaccio | Francesco Petrarca ; Ludovico Ariosto ; Torquato Tasso | Cento novelle.'),
  b('Chi ha scritto il «Canzoniere»? | Francesco Petrarca | Dante ; Boccaccio ; Poliziano | Dedicato a Laura.', undefined, undefined, 2),
  b('Quale movimento letterario rappresenta Giovanni Verga? | Verismo | Romanticismo ; Ermetismo ; Futurismo | «I Malavoglia».', undefined, undefined, 2),
  b('Chi ha scritto «Il fu Mattia Pascal»? | Luigi Pirandello | Italo Svevo ; Gabriele D’Annunzio ; Italo Calvino', undefined, undefined, 2),
  b('A quale corrente appartiene Giuseppe Ungaretti? | Ermetismo | Verismo ; Scapigliatura ; Illuminismo | «M’illumino d’immenso».', undefined, undefined, 3),
  b('Chi ha scritto «Il principe»? | Niccolò Machiavelli | Francesco Guicciardini ; Baldassarre Castiglione ; Galileo Galilei | 1513.', undefined, undefined, 2),
  b('Chi ha scritto «La coscienza di Zeno»? | Italo Svevo | Luigi Pirandello ; Primo Levi ; Cesare Pavese | 1923, Trieste.', undefined, undefined, 3),
  b('Chi ha scritto «Se questo è un uomo»? | Primo Levi | Elsa Morante ; Italo Calvino ; Natalia Ginzburg | Testimonianza di Auschwitz.', undefined, undefined, 2),
  b('Che cos’è il «dolce stil novo»? | una corrente poetica del Duecento sull’amore e la donna angelo | un romanzo dell’Ottocento ; un genere teatrale ; una scuola di pittura | Guinizelli, Cavalcanti, Dante.', undefined, undefined, 3)
];

const RETORICA: BankItem[] = [
  b('«Sei un leone» è… | una metafora | una similitudine ; un’anafora ; un ossimoro | Paragone senza «come».'),
  b('«Forte come un leone» è… | una similitudine | una metafora ; un’allitterazione ; una sinestesia | Paragone con «come».'),
  b('«Ghiaccio bollente» è… | un ossimoro | un’iperbole ; una metonimia ; una litote | Termini opposti accostati.'),
  b('«Te l’ho detto mille volte» è… | un’iperbole | una litote ; un’anafora ; un chiasmo | Esagerazione.'),
  b('«Urlo nero» (Quasimodo) è… | una sinestesia | una similitudine ; un’anafora ; un’allitterazione | Unisce sensi diversi.', undefined, undefined, 2),
  b('«Bere un bicchiere» (il contenuto) è… | una metonimia | una metafora ; una sineddoche ; un ossimoro | Il contenitore per il contenuto.', undefined, undefined, 3),
  b('La ripetizione di una parola all’inizio di più versi si chiama… | anafora | epifora ; enjambement ; climax | «Per me si va… per me si va…»', undefined, undefined, 2),
  b('Quando la frase continua nel verso successivo si ha… | un enjambement | una rima baciata ; una cesura ; una sinalefe', undefined, undefined, 2),
  b('Lo schema AABB è… | rima baciata | rima alternata ; rima incrociata ; rima incatenata'),
  b('Lo schema ABAB è… | rima alternata | rima baciata ; rima incrociata ; verso sciolto'),
  b('Un endecasillabo ha… | undici sillabe metriche | dieci sillabe ; dodici sillabe ; otto sillabe | Il verso più usato nella poesia italiana.', undefined, undefined, 2),
  b('Un sonetto è formato da… | due quartine e due terzine | tre quartine ; quattro terzine ; un’ottava | 14 versi.', undefined, undefined, 2),
  b('«Non è un cattivo ragazzo» è… | una litote | un’iperbole ; un’ironia ; un’anafora | Negare il contrario.', undefined, undefined, 3)
];

const IT = 'italiano' as const;
const only: ['IT'] = ['IT'];
export const ITALIAN_MODULES: LearningModule[] = [
  { id: 'it1-sillabe', title: tx('Silben (Italienisch)', 'Le sillabe'), subtitle: tx('Wörter aus Silben bauen', 'Componi le parole'), emoji: '👏', color: 'sonne', area: 'schule', years: [1, 1], countries: only, subject: IT, topic: tx('Silben', 'Sillabe'), roundSize: 5, generate: (l, r) => genSillabe(l, r) },
  { id: 'it1-lettere', title: tx('Buchstaben (Italienisch)', 'Le lettere'), subtitle: tx('Wörter schreiben', 'Scrivi le parole'), emoji: '🔤', color: 'himmel', area: 'schule', years: [1, 2], countries: only, subject: IT, topic: tx('Buchstaben', 'Lettere'), roundSize: 5, generate: (l, r) => genLettere(l, r) },
  bankModule({ id: 'it2-ortografia', subject: IT, years: [2, 4], countries: only, title: ['Rechtschreibung (Italienisch)', 'Ortografia'], subtitle: ['Doppelte, CH/GH, GN, GLI', 'Doppie, CH/GH, GN, GLI'], emoji: '✏️', color: 'koralle', items: ORTOGRAFIA }),
  bankModule({ id: 'it2-acca', subject: IT, years: [2, 5], countries: only, title: ['H und Akzent', 'H, accento e apostrofo'], subtitle: ['ho/o, ha/a, è/e', 'ho/o, ha/a, è/e'], emoji: '🅷', color: 'lila', items: ACCA_ACCENTO }),
  bankModule({ id: 'it3-grammatica', subject: IT, years: [3, 5], countries: only, title: ['Artikel, Nomen, Verben', 'Articoli, nomi e verbi'], subtitle: ['Grammatik der Grundschule', 'La grammatica della primaria'], emoji: '🧩', color: 'minze', items: ARTICOLI_NOMI }),
  bankModule({ id: 'it6-grammaticale', subject: IT, years: [6, 8], countries: only, title: ['Grammatikalische Analyse', 'Analisi grammaticale'], subtitle: ['Wortarten, Modi, Zeiten', 'Parti del discorso, modi e tempi'], emoji: '🔍', color: 'himmel', items: ANALISI_GRAMMATICALE }),
  bankModule({ id: 'it7-logica', subject: IT, years: [7, 10], countries: only, title: ['Satzanalyse', 'Analisi logica e del periodo'], subtitle: ['Subjekt, Ergänzungen, Nebensätze', 'Soggetto, complementi, subordinate'], emoji: '🧠', color: 'lila', items: ANALISI_LOGICA }),
  bankModule({ id: 'it9-retorica', subject: IT, years: [8, 13], countries: only, title: ['Stilmittel und Metrik', 'Figure retoriche e metrica'], subtitle: ['Metapher, Reim, Sonett', 'Metafora, rima, sonetto'], emoji: '🎭', color: 'koralle', items: RETORICA }),
  bankModule({ id: 'it10-letteratura', subject: IT, years: [9, 13], countries: only, title: ['Italienische Literatur', 'Letteratura italiana'], subtitle: ['Von Dante bis Primo Levi', 'Da Dante a Primo Levi'], emoji: '📚', color: 'sonne', items: LETTERATURA })
];
