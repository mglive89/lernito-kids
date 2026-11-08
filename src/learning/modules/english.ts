import type { Difficulty, LearningModule } from '../types';
import { bankModule, type BankItem } from '../bank';

/* Englisch / Inglese für Sekundarstufe: Aufgaben auf Englisch, Erklärung in der Sprache des Kindes. */

const e = (q: string, a: string, w: string, de: string, it: string, lv?: Difficulty): BankItem => ({
  de: `${q} | ${a} | ${w} | ${de}`, it: `${q} | ${a} | ${w} | ${it}`, lv
});

const VOCAB: BankItem[] = [
  e('What is the opposite of “expensive”?', 'cheap', 'rich ; heavy ; early', 'expensive = teuer, cheap = billig', 'expensive = caro, cheap = economico'),
  e('Which word means “Bibliothek / biblioteca”?', 'library', 'bookshop ; liberty ; librarian', 'Achtung: „library“ ist kein Buchladen.', 'Attenzione: «library» non è la libreria (bookshop).'),
  e('Choose the correct word: “I ___ my homework every day.”', 'do', 'make ; take ; say', 'do homework (nicht make)', 'si dice «do homework», non «make»'),
  e('Which word is a false friend for Italian “attualmente”?', 'actually', 'currently ; now ; today', '„actually“ heißt „eigentlich“.', '«actually» significa «in realtà»; attualmente = currently.', 2),
  e('Which word is a false friend for German “bekommen”?', 'become', 'get ; receive ; obtain', '„become“ heißt „werden“; bekommen = get.', '«become» significa «diventare».', 2),
  e('What do you call your mother’s sister?', 'aunt', 'niece ; cousin ; uncle', 'aunt = Tante', 'aunt = zia'),
  e('Which word is a synonym of “begin”?', 'start', 'finish ; stop ; break', 'begin = start', 'begin = start = iniziare'),
  e('What is the plural of “child”?', 'children', 'childs ; childes ; child', 'unregelmäßiger Plural', 'plurale irregolare'),
  e('What is the plural of “mouse” (animal)?', 'mice', 'mouses ; mices ; mouse', 'unregelmäßig: mouse → mice', 'irregolare: mouse → mice'),
  e('Which phrase means “Ich freue mich darauf / Non vedo l’ora”?', 'I’m looking forward to it.', 'I look after it. ; I’m looking for it. ; I look it up.', 'look forward to + -ing/Nomen', 'look forward to + -ing/nome', 2),
  e('What does “to give up” mean?', 'to stop trying', 'to give a present ; to stand up ; to wake up', 'Phrasal verb: aufgeben', 'Phrasal verb: arrendersi, smettere', 2),
  e('“Sustainable” means…', 'able to continue without harming the environment', 'very expensive ; very fast ; easy to break', 'nachhaltig', 'sostenibile', 3)
];

const TENSES: BankItem[] = [
  e('“She ___ to school every day.”', 'goes', 'go ; is going ; went', 'Simple present, 3. Person: -s/-es', 'Present simple, terza persona: -s/-es'),
  e('“Look! It ___.”', 'is raining', 'rains ; rained ; has rained', 'Present progressive für jetzt gerade', 'Present continuous per ciò che succede ora'),
  e('“Yesterday we ___ a film.”', 'watched', 'watch ; have watched ; are watching', 'Simple past mit „yesterday“', 'Past simple con «yesterday»'),
  e('“I ___ never ___ to London.”', 'have … been', 'did … go ; was … been ; am … going', 'Present perfect mit „never“', 'Present perfect con «never»'),
  e('“He ___ here since 2020.”', 'has lived', 'lives ; lived ; is living', 'since + Present perfect', 'since + present perfect', 2),
  e('“When I arrived, the train ___ already ___.”', 'had … left', 'has … left ; did … leave ; was … leaving', 'Past perfect: Vorvergangenheit', 'Past perfect: prima di un’altra azione passata', 2),
  e('“Tomorrow I ___ my grandma.” (plan)', 'am going to visit', 'visit ; visited ; have visited', 'going to-future für Pläne', 'futuro con «going to» per i programmi'),
  e('What is the past of “to buy”?', 'bought', 'buyed ; brought ; buy', 'buy – bought – bought', 'buy – bought – bought'),
  e('What is the past participle of “to write”?', 'written', 'wrote ; writed ; write', 'write – wrote – written', 'write – wrote – written'),
  e('“While I ___ TV, the phone rang.”', 'was watching', 'watched ; am watching ; have watched', 'Past progressive + simple past', 'Past continuous + past simple', 2),
  e('“By next year, she ___ her degree.”', 'will have finished', 'will finish ; finishes ; has finished', 'Future perfect', 'Future perfect', 3)
];

const GRAMMAR: BankItem[] = [
  e('“If it rains, we ___ at home.”', 'will stay', 'would stay ; stayed ; stay will', 'if-Satz Typ 1', 'periodo ipotetico di primo tipo'),
  e('“If I were rich, I ___ a house.”', 'would buy', 'will buy ; buy ; bought', 'if-Satz Typ 2 (irreal)', 'periodo ipotetico di secondo tipo', 2),
  e('“If you had studied, you ___ the test.”', 'would have passed', 'would pass ; will pass ; passed', 'if-Satz Typ 3 (Vergangenheit)', 'periodo ipotetico di terzo tipo', 3),
  e('Passive: “They built the bridge in 1990.” →', 'The bridge was built in 1990.', 'The bridge is built in 1990. ; The bridge built in 1990. ; The bridge has build in 1990.', 'Passiv: be + Partizip', 'passivo: be + participio', 2),
  e('“There isn’t ___ milk left.”', 'any', 'some ; many ; a', 'any in verneinten Sätzen', 'any nelle frasi negative'),
  e('“How ___ apples do you want?”', 'many', 'much ; any ; lot', 'many bei zählbaren Nomen', 'many con i nomi numerabili'),
  e('“This is the girl ___ won the race.”', 'who', 'which ; whose ; what', 'who für Personen', 'who per le persone'),
  e('“She is ___ than her brother.”', 'taller', 'more tall ; tallest ; most tall', 'kurze Adjektive: -er', 'aggettivi brevi: -er'),
  e('“It is the ___ book I have ever read.”', 'most interesting', 'interestingest ; more interesting ; much interesting', 'lange Adjektive: most …', 'aggettivi lunghi: most …'),
  e('Reported speech: She said, “I am tired.” →', 'She said (that) she was tired.', 'She said she is tired yesterday. ; She said I am tired. ; She says she were tired.', 'Backshift: am → was', 'backshift: am → was', 3),
  e('“You ___ wear a helmet. It’s the law.”', 'must', 'mustn’t ; needn’t ; can’t', 'must = Pflicht', 'must = obbligo'),
  e('“He drives ___.” (careful)', 'carefully', 'careful ; carefuly ; more careful', 'Adverb: -ly', 'avverbio: -ly'),
  e('“I’m not used to ___ up early.”', 'getting', 'get ; got ; have got', 'be used to + -ing', 'be used to + -ing', 3)
];

const READING: BankItem[] = [
  e('In a formal email, which greeting is best for an unknown person?', 'Dear Sir or Madam,', 'Hi mate, ; Hey you, ; Yo!', 'formeller Brief', 'lettera formale'),
  e('Which phrase is good to give your opinion in an essay?', 'In my opinion, …', 'Shut up, … ; Who cares … ; LOL …', 'Meinung höflich ausdrücken', 'esprimere un’opinione'),
  e('Which linking word shows contrast?', 'however', 'moreover ; therefore ; firstly', 'however = jedoch', 'however = tuttavia', 2),
  e('Which linking word shows a result?', 'therefore', 'although ; whereas ; despite', 'therefore = deshalb', 'therefore = quindi', 2),
  e('Who wrote “Romeo and Juliet”?', 'William Shakespeare', 'Charles Dickens ; Jane Austen ; Oscar Wilde', 'um 1595', 'circa 1595', 2),
  e('Who wrote “Nineteen Eighty-Four” (1984)?', 'George Orwell', 'Aldous Huxley ; Ray Bradbury ; J. R. R. Tolkien', 'Dystopie, 1949', 'distopia, 1949', 3),
  e('What is the capital of Australia?', 'Canberra', 'Sydney ; Melbourne ; Perth', 'nicht Sydney!', 'non Sydney!'),
  e('Which countries form the United Kingdom?', 'England, Scotland, Wales and Northern Ireland', 'England, Ireland and Wales ; England and Scotland only ; Britain, Ireland and Canada', 'vier Landesteile', 'quattro nazioni costitutive', 2),
  e('What is a “topic sentence”?', 'the sentence that states the main idea of a paragraph', 'the last sentence of a book ; a question ; a title', 'Kernsatz eines Absatzes', 'frase che esprime l’idea principale', 3),
  e('What does “skimming” a text mean?', 'reading quickly to get the main idea', 'reading every word slowly ; translating it ; learning it by heart', 'Überfliegen', 'lettura veloce per l’idea generale', 3)
];

const EN = 'englisch' as const;
export const ENGLISH_MODULES: LearningModule[] = [
  bankModule({ id: 'en-vocab', subject: EN, years: [5, 10], title: ['Vocabulary', 'Vocabulary'], subtitle: ['Wortschatz und falsche Freunde', 'Lessico e falsi amici'], emoji: '📗', color: 'minze', items: VOCAB }),
  bankModule({ id: 'en-tenses', subject: EN, years: [5, 10], title: ['Tenses', 'Tenses'], subtitle: ['Zeitformen', 'I tempi verbali'], emoji: '⏱️', color: 'himmel', items: TENSES }),
  bankModule({ id: 'en-grammar', subject: EN, years: [7, 13], title: ['Grammar', 'Grammar'], subtitle: ['if-Sätze, Passiv, indirekte Rede', 'Periodo ipotetico, passivo, discorso indiretto'], emoji: '🧠', color: 'lila', items: GRAMMAR }),
  bankModule({ id: 'en-reading', subject: EN, years: [8, 13], title: ['Reading and Writing', 'Reading and Writing'], subtitle: ['Texte, Kultur, Literatur', 'Testi, cultura, letteratura'], emoji: '📖', color: 'sonne', items: READING })
];
