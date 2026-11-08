import type { LearningModule } from '../types';
import { b, bankModule, type BankItem } from '../bank';

/* Deutsch für Sekundarstufe I und II (nur Deutschland). Die Fragen sind auf Deutsch, weil es um die deutsche Sprache geht. */

const WORTARTEN: BankItem[] = [
  b('Welche Wortart ist „schnell“ in „Der Hund läuft schnell“? | Adjektiv (adverbial gebraucht) | Nomen ; Verb ; Artikel | Es beschreibt, wie der Hund läuft.'),
  b('Welche Wortart ist „unter“? | Präposition | Konjunktion ; Pronomen ; Adverb | Präpositionen zeigen Verhältnisse an: unter, auf, neben …'),
  b('Welche Wortart ist „weil“? | Konjunktion | Präposition ; Adverb ; Artikel | Sie leitet einen Nebensatz ein.'),
  b('Welches Wort ist ein Personalpronomen? | sie | dieser ; mein ; welcher | ich, du, er, sie, es, wir, ihr, sie'),
  b('Welches Wort ist ein Possessivpronomen? | unser | uns ; wir ; diese | Es zeigt Besitz an.'),
  b('Was ist der Infinitiv von „ging“? | gehen | gang ; gegangen ; geht | Die Grundform des Verbs.'),
  b('Welche Zeitform ist „ich hatte gegessen“? | Plusquamperfekt | Perfekt ; Präteritum ; Futur I | hatte/war + Partizip II'),
  b('Welche Zeitform ist „wir werden reisen“? | Futur I | Präsens ; Futur II ; Perfekt | werden + Infinitiv', undefined, undefined, 1),
  b('Welche Zeitform ist „sie wird angekommen sein“? | Futur II | Futur I ; Plusquamperfekt ; Perfekt | werden + Partizip II + sein/haben', undefined, undefined, 2),
  b('Wie lautet das Partizip II von „bringen“? | gebracht | gebringt ; gebrungen ; brachte | Unregelmäßiges Verb.', undefined, undefined, 2),
  b('Welches Verb ist stark (unregelmäßig)? | schwimmen | spielen ; malen ; kochen | schwimmen – schwamm – geschwommen', undefined, undefined, 2),
  b('Was ist „das Laufen“ in „Das Laufen macht Spaß“? | ein nominalisiertes Verb | ein Adjektiv ; ein Adverb ; ein Pronomen | Mit Artikel wird es großgeschrieben.', undefined, undefined, 2)
];

const SATZGLIEDER: BankItem[] = [
  b('Was ist das Subjekt in „Am Morgen trinkt meine Schwester Tee“? | meine Schwester | Tee ; am Morgen ; trinkt | Frage: Wer oder was trinkt?'),
  b('Was ist das Akkusativobjekt in „Paul schenkt seiner Mutter einen Strauß“? | einen Strauß | Paul ; seiner Mutter ; schenkt | Frage: Wen oder was schenkt Paul?'),
  b('Was ist das Dativobjekt in „Paul schenkt seiner Mutter einen Strauß“? | seiner Mutter | einen Strauß ; Paul ; schenkt | Frage: Wem schenkt Paul etwas?'),
  b('Welcher Fall steht nach „wegen“ (Standardsprache)? | Genitiv | Dativ ; Akkusativ ; Nominativ | wegen des Regens'),
  b('Welcher Fall steht nach „mit“? | Dativ | Akkusativ ; Genitiv ; Nominativ | mit dem Rad'),
  b('Welcher Fall steht nach „für“? | Akkusativ | Dativ ; Genitiv ; Nominativ | für den Freund'),
  b('Welche Art Adverbiale ist „wegen des Sturms“? | Kausaladverbiale (Grund) | Temporaladverbiale ; Lokaladverbiale ; Modaladverbiale | Frage: Warum?', undefined, undefined, 2),
  b('Welche Art Adverbiale ist „seit drei Jahren“? | Temporaladverbiale (Zeit) | Lokaladverbiale ; Kausaladverbiale ; Modaladverbiale | Frage: Seit wann?', undefined, undefined, 2),
  b('Was ist ein Attribut? | eine Beifügung, die ein Nomen näher beschreibt | ein eigenes Satzglied ; immer ein Verb ; der Hauptsatz | z. B. „das rote Auto“', undefined, undefined, 2),
  b('Welcher Satz steht im Passiv? | Das Haus wird gebaut. | Die Firma baut das Haus. ; Er baute ein Haus. ; Wir bauen morgen. | werden + Partizip II', undefined, undefined, 2),
  b('Welcher Satz ist ein Relativsatz? | …, das ich gestern gekauft habe. | …, weil es regnet. ; …, als er kam. ; …, dass du kommst. | Er bezieht sich auf ein Nomen.', undefined, undefined, 3),
  b('Welche Art Nebensatz ist „Obwohl es regnete, gingen wir spazieren“? | Konzessivsatz (Einräumung) | Kausalsatz ; Finalsatz ; Temporalsatz | obwohl = Gegengrund', undefined, undefined, 3)
];

const RECHTSCHREIBUNG: BankItem[] = [
  b('Welches Wort fehlt? „Ich hoffe, ___ du kommst.“ | dass | das ; daß ; was | Konjunktion → „dass“. Ersatzprobe: „dieses/welches“ passt nicht.'),
  b('Welches Wort fehlt? „Das Buch, ___ auf dem Tisch liegt, gehört mir.“ | das | dass ; was ; welche | Relativpronomen → ersetzbar durch „welches“.'),
  b('Welches Wort ist richtig geschrieben? | Rhythmus | Rytmus ; Rhytmus ; Rythmus | Zwei h: Rh… und …th…'),
  b('Welches Wort ist richtig geschrieben? | Standpunkt | Stantpunkt ; Standtpunkt ; Stanpunkt | von „stehen“ → Stand'),
  b('Wo gehört ein Komma? „Ich weiß nicht ob er kommt.“ | vor „ob“ | vor „nicht“ ; nach „kommt“ ; nirgends | Der Nebensatz beginnt mit „ob“.'),
  b('Wird „etwas Schönes“ groß- oder kleingeschrieben? | „Schönes“ groß | „schönes“ klein ; beides klein ; beides groß | Nach „etwas, nichts, viel“ wird das Adjektiv nominalisiert.'),
  b('Welche Schreibung ist richtig? | im Allgemeinen | im allgemeinen ; Im allgemeinen ; im allgemeinem | Nominalisierung nach „im“.', undefined, undefined, 2),
  b('Welche Schreibung ist richtig? | Rad fahren | radfahren ; Rad faren ; rad Fahren | Nomen + Verb meist getrennt: Rad fahren, Auto fahren.', undefined, undefined, 3),
  b('Welcher Satz ist richtig? | Er rief: „Komm her!“ | Er rief „Komm her!“. ; Er rief: „komm her“! ; Er rief, „Komm her!“ | Doppelpunkt vor wörtlicher Rede.', undefined, undefined, 2),
  b('Wann schreibt man „seid“? | als Form von „sein“: ihr seid | als Zeitangabe: seid gestern ; immer ; nie | „seit“ steht für die Zeit.'),
  b('Welche Wortform ist richtig? | die Ergebnisse | die Ergebnise ; die Ergebnißen ; die Ergebnisen | -nis → Plural -nisse'),
  b('Wo fehlt ein Komma? „Als es dunkel wurde gingen wir nach Hause.“ | nach „wurde“ | nach „Als“ ; nach „wir“ ; nirgends | Der Nebensatz „Als es dunkel wurde“ wird abgetrennt.', undefined, undefined, 2)
];

const KONJUNKTIV: BankItem[] = [
  b('Welche Form ist Konjunktiv I? | er sei | er wäre ; er war ; er ist | Konjunktiv I für indirekte Rede.'),
  b('Welche Form ist Konjunktiv II? | ich hätte | ich habe ; ich habe gehabt ; ich hatte | Konjunktiv II für Wünsche und Irreales.'),
  b('Wie lautet die indirekte Rede? Sie sagt: „Ich bin müde.“ | Sie sagt, sie sei müde. | Sie sagt, sie ist müde gewesen. ; Sie sagt, ich bin müde. ; Sie sagt, sie wäre gewesen. | Konjunktiv I von „sein“: sei'),
  b('Welcher Satz drückt einen irrealen Wunsch aus? | Wenn ich doch Zeit hätte! | Ich habe Zeit. ; Ich hatte Zeit. ; Ich werde Zeit haben. | Konjunktiv II'),
  b('Was ist die würde-Form von „ich käme“? | ich würde kommen | ich werde kommen ; ich wurde kommen ; ich bin gekommen | Ersatzform des Konjunktiv II.', undefined, undefined, 2),
  b('Konjunktiv I von „sie haben“ ist gleich dem Indikativ. Was verwendet man dann? | Konjunktiv II: sie hätten | Konjunktiv I trotzdem ; Präteritum ; Futur | Ersatzregel bei gleichen Formen.', undefined, undefined, 3),
  b('Konjunktiv I von „er kommt“? | er komme | er käme ; er kam ; er kommt | Stamm + e'),
  b('Was gibt der Konjunktiv I in Zeitungen meist an? | dass eine Aussage nur wiedergegeben wird | dass sie sicher wahr ist ; dass sie erfunden ist ; einen Befehl | Distanz zur Aussage.', undefined, undefined, 2)
];

const STILMITTEL: BankItem[] = [
  b('Welches Stilmittel ist „Er ist ein Löwe im Kampf“? | Metapher | Vergleich ; Alliteration ; Anapher | Ohne „wie“ → Metapher.'),
  b('Welches Stilmittel ist „stark wie ein Bär“? | Vergleich | Metapher ; Personifikation ; Ironie | Mit „wie“.'),
  b('Welches Stilmittel ist „Milch macht müde Männer munter“? | Alliteration | Anapher ; Chiasmus ; Hyperbel | Gleicher Anfangslaut.'),
  b('Welches Stilmittel ist „Die Sonne lacht“? | Personifikation | Vergleich ; Alliteration ; Klimax | Etwas Unbelebtes handelt wie ein Mensch.'),
  b('Welches Stilmittel ist „Ich habe dir das schon tausendmal gesagt“? | Hyperbel (Übertreibung) | Litotes ; Euphemismus ; Anapher | Bewusste Übertreibung.'),
  b('Wie nennt man die Wiederholung desselben Wortes am Versanfang? | Anapher | Epipher ; Ellipse ; Oxymoron | z. B. „Wer …, wer …, wer …“', undefined, undefined, 2),
  b('Welches Stilmittel ist „bittersüß“? | Oxymoron | Pleonasmus ; Metapher ; Klimax | Widersprüchliche Begriffe vereint.', undefined, undefined, 2),
  b('Welches Stilmittel ist „Er ist nicht gerade klug“? | Litotes | Hyperbel ; Ironie ; Neologismus | Verneinung des Gegenteils.', undefined, undefined, 3),
  b('Welches Stilmittel ist „Die Kunst ist lang, kurz ist das Leben“? | Chiasmus | Anapher ; Klimax ; Parallelismus | Überkreuzstellung.', undefined, undefined, 3),
  b('Was ist ein Jambus? | eine Silbenfolge unbetont – betont | betont – unbetont ; betont – betont ; unbetont – unbetont – betont | Versmaß: x X', undefined, undefined, 2),
  b('Welche Reimform ist abab? | Kreuzreim | Paarreim ; umarmender Reim ; Schweifreim | aabb = Paarreim, abba = umarmend.'),
  b('Was ist das lyrische Ich? | die Sprechinstanz im Gedicht | der Autor selbst ; der Leser ; die Hauptfigur eines Romans | Nicht gleichzusetzen mit dem Dichter.', undefined, undefined, 2)
];

const TEXTE: BankItem[] = [
  b('Was gehört in die Einleitung einer Inhaltsangabe? | Titel, Autor, Textsorte, Erscheinungsjahr, Thema | wörtliche Zitate ; die eigene Meinung ; ein spannender Schluss | TATTE-Satz.'),
  b('In welcher Zeitform schreibt man eine Inhaltsangabe? | im Präsens | im Präteritum ; im Futur ; im Plusquamperfekt | Vorzeitiges im Perfekt.'),
  b('Was ist eine Erörterung? | eine Abwägung von Argumenten zu einer Frage | eine Bildbeschreibung ; ein Gedicht ; ein Tagebucheintrag | linear oder dialektisch'),
  b('Woraus besteht ein Argument (These – Begründung – …)? | Beispiel/Beleg | Überschrift ; Reim ; Zitat des Lehrers | Dreischritt: These, Begründung, Beleg.'),
  b('Was ist eine Kurzgeschichte typischerweise? | kurz, offener Anfang und offenes Ende, Alltagssituation | lang mit vielen Kapiteln ; immer in Reimen ; mit Moral am Ende wie die Fabel | z. B. Wolfgang Borchert.', undefined, undefined, 2),
  b('Was kennzeichnet eine Fabel? | Tiere handeln wie Menschen, am Ende steht eine Lehre | sie spielt immer in der Zukunft ; sie hat keine Handlung ; sie reimt sich immer | z. B. Äsop, Lessing.'),
  b('Was ist ein Drama? | ein Text für die Bühne mit Dialogen | ein Roman ; ein Sachtext ; eine Zeitungsnachricht | Akte und Szenen.'),
  b('Was ist ein innerer Monolog? | die Gedanken einer Figur in der Ich-Form im Präsens | ein Gespräch zwischen zwei Figuren ; eine Regieanweisung ; ein Brief | Erzähltechnik.', undefined, undefined, 2),
  b('Welche Erzählperspektive weiß alles über alle Figuren? | auktorialer Erzähler | personaler Erzähler ; Ich-Erzähler ; neutraler Erzähler | allwissend', undefined, undefined, 2),
  b('Was sind die W-Fragen einer Nachricht? | Wer? Was? Wann? Wo? Wie? Warum? | Wem? Wessen? Wohin? ; Wie viel? Welcher? ; nur Wer und Was | Das Wichtigste zuerst.')
];

const EPOCHEN: BankItem[] = [
  b('Wer schrieb „Faust“? | Johann Wolfgang von Goethe | Friedrich Schiller ; Heinrich Heine ; Thomas Mann | Teil I erschien 1808.'),
  b('Welche Epoche betonte Gefühl und Genie (ca. 1767–1785)? | Sturm und Drang | Aufklärung ; Realismus ; Expressionismus | junger Goethe, junger Schiller'),
  b('Zu welcher Epoche gehört Lessings „Nathan der Weise“? | Aufklärung | Romantik ; Barock ; Naturalismus | Ringparabel, Toleranz.'),
  b('Wer schrieb „Die Räuber“? | Friedrich Schiller | Lessing ; Kleist ; Büchner | 1781'),
  b('Welche Epoche liebte Nacht, Natur, Sehnsucht und die „blaue Blume“? | Romantik | Klassik ; Realismus ; Moderne | Novalis, Eichendorff'),
  b('Wer schrieb „Die Verwandlung“ (Gregor Samsa)? | Franz Kafka | Thomas Mann ; Hermann Hesse ; Bertolt Brecht | 1915', undefined, undefined, 2),
  b('Was ist typisch für Brechts episches Theater? | Verfremdung, damit das Publikum nachdenkt | völlige Illusion ; nur Musik ; nur Monologe | V-Effekt', undefined, undefined, 3),
  b('Wer schrieb „Woyzeck“? | Georg Büchner | Gerhart Hauptmann ; Theodor Fontane ; Heinrich von Kleist | Vormärz, Fragment', undefined, undefined, 3),
  b('Zu welcher Epoche gehört Fontanes „Effi Briest“? | Realismus | Romantik ; Sturm und Drang ; Expressionismus | 1895', undefined, undefined, 2),
  b('Was bezeichnet „Trümmerliteratur“? | Literatur nach 1945 über Krieg und Zerstörung | Barocklyrik ; Märchen der Romantik ; Science-Fiction | z. B. Borchert, Böll', undefined, undefined, 2),
  b('Welches Motiv ist typisch für den Barock? | Vanitas – Vergänglichkeit | Fortschrittsglaube ; Großstadtleben ; Technikbegeisterung | Gryphius: „Es ist alles eitel“', undefined, undefined, 3)
];

const D = 'deutsch' as const;
export const GERMAN_SEK_MODULES: LearningModule[] = [
  bankModule({ id: 'd-wortarten-sek', subject: D, years: [5, 7], countries: ['DE'], title: ['Wortarten und Zeiten', 'Parti del discorso e tempi'], subtitle: ['Pronomen, Präpositionen, Tempora', 'Pronomi, preposizioni, tempi'], emoji: '🔤', color: 'himmel', items: WORTARTEN }),
  bankModule({ id: 'd-satzglieder', subject: D, years: [5, 8], countries: ['DE'], title: ['Satzglieder und Fälle', 'Complementi e casi'], subtitle: ['Subjekt, Objekte, Adverbiale', 'Soggetto, oggetti, avverbiali'], emoji: '🧩', color: 'minze', items: SATZGLIEDER }),
  bankModule({ id: 'd-rechtschreibung-sek', subject: D, years: [5, 10], countries: ['DE'], title: ['Rechtschreibung und Komma', 'Ortografia e virgole'], subtitle: ['das/dass, Großschreibung, Kommas', 'das/dass, maiuscole, virgole'], emoji: '✍️', color: 'koralle', items: RECHTSCHREIBUNG }),
  bankModule({ id: 'd-konjunktiv', subject: D, years: [8, 11], countries: ['DE'], title: ['Konjunktiv und indirekte Rede', 'Congiuntivo e discorso indiretto'], subtitle: ['Konjunktiv I und II', 'Congiuntivo I e II'], emoji: '💬', color: 'lila', items: KONJUNKTIV }),
  bankModule({ id: 'd-texte', subject: D, years: [6, 10], countries: ['DE'], title: ['Texte schreiben und verstehen', 'Scrivere e capire testi'], subtitle: ['Inhaltsangabe, Erörterung, Erzähler', 'Riassunto, argomentazione, narratore'], emoji: '📝', color: 'sonne', items: TEXTE }),
  bankModule({ id: 'd-stilmittel', subject: D, years: [8, 13], countries: ['DE'], title: ['Stilmittel und Lyrik', 'Figure retoriche e poesia'], subtitle: ['Metapher, Anapher, Versmaß', 'Metafora, anafora, metrica'], emoji: '🎭', color: 'himmel', items: STILMITTEL }),
  bankModule({ id: 'd-epochen', subject: D, years: [10, 13], countries: ['DE'], title: ['Literaturepochen', 'Epoche letterarie'], subtitle: ['Barock bis Nachkriegszeit', 'Dal Barocco al dopoguerra'], emoji: '📚', color: 'minze', items: EPOCHEN })
];
