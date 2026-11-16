import { tx as t, type Txt } from '../i18n';
import type { AdultCat, Guide } from './types';

/**
 * Lernito Adult – eigene Anleitungen zum Selbermachen (Deutsch / Italiano).
 * Alle Texte und Illustrationen sind selbst erstellt.
 */

export interface CatDef { id: AdultCat; title: Txt; sub: Txt; color: 'lila' | 'himmel' | 'koralle' | 'minze' | 'sonne' }

export const CATS: CatDef[] = [
  { id: 'lavoretti', title: t('Basteln & Tischdeko', 'Lavoretti e tavola'), sub: t('Servietten falten, Papiertabletts, Deko', 'Tovaglioli decorati, vassoi di carta, decorazioni'), color: 'lila' },
  { id: 'casa', title: t('Haushalt', 'Casa'), sub: t('Waschmaschine, Spülmaschine, Flecken', 'Lavatrice, lavastoviglie, macchie'), color: 'himmel' },
  { id: 'cucina', title: t('Kochen & Rezepte', 'Cucina e ricette'), sub: t('Einfache Rezepte Schritt für Schritt', 'Ricette facili passo dopo passo'), color: 'koralle' },
  { id: 'codice', title: t('Websites & Apps bauen', 'Creare siti e app'), sub: t('Programmieren mit Live-Vorschau', 'Programmare con anteprima dal vivo'), color: 'minze' },
  { id: 'faidate', title: t('Heimwerken', 'Fai da te'), sub: t('Bild aufhängen, Glühbirne, Abfluss', 'Quadri, lampadine, scarichi'), color: 'sonne' }
];

export const catById = (id: string) => CATS.find((c) => c.id === id);

// ---------------------------------------------------------------- Basteln
const lavoretti: Guide[] = [
  {
    id: 'tovagliolo-ventaglio', cat: 'lavoretti', cover: 'fan-6', minutes: 5, level: 1,
    title: t('Serviette als Fächer', 'Tovagliolo a ventaglio'),
    sub: t('Der elegante Klassiker, der von allein auf dem Teller steht', 'Il classico elegante che sta in piedi da solo sul piatto'),
    materials: [t('1 Stoffserviette, am besten leicht gestärkt (40 × 40 cm)', '1 tovagliolo di stoffa, meglio se leggermente inamidato (40 × 40 cm)'), t('optional: Bügeleisen für scharfe Kanten', 'facoltativo: ferro da stiro per pieghe nette')],
    steps: [
      { art: 'fan-1', text: t('Serviette glatt auf den Tisch legen, schöne Seite nach unten.', 'Stendi il tovagliolo ben liscio sul tavolo, con il lato bello verso il basso.') },
      { art: 'fan-2', text: t('Einmal in der Mitte falten: unten auf oben. Jetzt hast du ein Rechteck.', 'Piegalo a metà portando il lato in basso su quello in alto: ottieni un rettangolo.') },
      { art: 'fan-3', text: t('Von links beginnend wie eine Ziehharmonika falten: etwa 2–3 cm breite Falten, abwechselnd nach oben und unten. Das rechte Viertel bleibt glatt.', 'Partendo da sinistra piega a fisarmonica: pieghe larghe 2–3 cm, una sopra e una sotto. Lascia liscio l’ultimo quarto a destra.'), tip: t('Gleich breite Falten sehen am schönsten aus. Jede Falte kurz mit dem Fingernagel nachziehen.', 'Pieghe tutte uguali fanno il ventaglio più bello. Ripassa ogni piega con l’unghia.') },
      { art: 'fan-4', text: t('Das Ganze der Länge nach in der Mitte zusammenklappen, die Falten bleiben außen.', 'Chiudi tutto a metà nel senso della lunghezza, con le pieghe all’esterno.') },
      { art: 'fan-5', text: t('Den glatten Teil schräg nach unten falten, sodass ein Dreieck als Stütze entsteht. Die Spitze unter die letzte Falte stecken.', 'Piega in diagonale verso il basso la parte liscia: si forma un triangolo che fa da sostegno. Infila la punta sotto l’ultima piega.') },
      { art: 'fan-6', text: t('Loslassen: Der Fächer öffnet sich und steht auf der Stütze. Auf den Teller stellen – fertig!', 'Lascia andare: il ventaglio si apre e sta in piedi sul sostegno. Mettilo sul piatto e il gioco è fatto!') }
    ],
    tips: [t('Mit Papierservietten klappt es auch: zwei Lagen übereinander nehmen.', 'Funziona anche con i tovaglioli di carta: usane due sovrapposti.'), t('Für Feste eine Serviette in Kontrastfarbe zum Tischtuch wählen.', 'Per le feste scegli un colore a contrasto con la tovaglia.')],
    quiz: [
      { q: t('Welcher Teil der Serviette bleibt bei der Ziehharmonika glatt?', 'Quale parte resta liscia nella piega a fisarmonica?'), options: [t('Das letzte Viertel', 'L’ultimo quarto'), t('Die Hälfte', 'La metà'), t('Nichts', 'Nessuna')], answer: 0, why: t('Aus dem glatten Viertel wird die Stütze.', 'Dal quarto liscio nasce il sostegno.') }
    ]
  },
  {
    id: 'tovagliolo-portaposate', cat: 'lavoretti', cover: 'pocket-5', minutes: 6, level: 2,
    title: t('Serviette mit Besteck-Tasche', 'Tovagliolo portaposate'),
    sub: t('Gabel und Messer stecken in einer Tasche mit Streifen', 'Forchetta e coltello in una tasca a righe diagonali'),
    materials: [t('1 Stoffserviette (40 × 40 cm oder größer)', '1 tovagliolo di stoffa (40 × 40 cm o più)'), t('Besteck', 'Posate')],
    steps: [
      { art: 'pocket-1', text: t('Die Serviette zweimal falten (halbieren, dann noch einmal), sodass ein kleines Quadrat entsteht. Die offenen Ecken zeigen nach oben rechts.', 'Piega il tovagliolo due volte (a metà e ancora a metà) fino ad avere un quadrato piccolo. Gli angoli aperti devono stare in alto a destra.') },
      { art: 'pocket-2', text: t('Die oberste Lage an der Ecke fassen und diagonal bis zur Mitte herunterrollen oder falten. Es entsteht ein schräger Streifen.', 'Prendi lo strato superiore dall’angolo e piegalo (o arrotolalo) in diagonale fino al centro: si forma una striscia obliqua.') },
      { art: 'pocket-3', text: t('Die zweite Lage genauso falten und unter den ersten Streifen schieben, sodass zwei gleich breite Streifen nebeneinander liegen.', 'Piega allo stesso modo il secondo strato e infilalo sotto la prima striscia: avrai due strisce parallele della stessa larghezza.') },
      { art: 'pocket-4', text: t('Serviette vorsichtig umdrehen. Linke und rechte Seite nach hinten falten, sodass ein schmales Rechteck entsteht.', 'Gira il tovagliolo con cura. Piega dietro il lato sinistro e quello destro: ottieni un rettangolo stretto.') },
      { art: 'pocket-5', text: t('Wieder umdrehen und das Besteck in die Tasche stecken. Links neben den Teller legen.', 'Girali di nuovo e infila le posate nella tasca. Appoggia il tovagliolo a sinistra del piatto.') }
    ],
    tips: [t('Ein Zweig Rosmarin oder eine Namenskarte in der Tasche macht daraus eine Tischdeko.', 'Un rametto di rosmarino o un segnaposto nella tasca lo trasformano in una decorazione.')]
  },
  {
    id: 'tovagliolo-nastro', cat: 'lavoretti', cover: 'ribbon-4', minutes: 4, level: 1,
    title: t('Serviette mit Band und Kräuterzweig', 'Tovagliolo con nastro e rametto'),
    sub: t('Natürliche Tischdeko in wenigen Minuten', 'Decorazione naturale in pochi minuti'),
    materials: [t('1 Serviette', '1 tovagliolo'), t('Juteschnur oder Stoffband (ca. 50 cm)', 'Spago di juta o nastro (circa 50 cm)'), t('Rosmarin, Lavendel, Eukalyptus oder Olivenzweig', 'Rosmarino, lavanda, eucalipto o ramo d’ulivo'), t('optional: kleine Karte mit Namen', 'facoltativo: bigliettino con il nome')],
    steps: [
      { art: 'ribbon-1', text: t('Serviette zu einem Rechteck falten: erst halbieren, dann noch einmal der Länge nach.', 'Piega il tovagliolo a rettangolo: prima a metà, poi ancora a metà nel senso della lunghezza.') },
      { art: 'ribbon-2', text: t('Von der kurzen Seite her locker aufrollen oder in Drittel legen.', 'Arrotolalo morbidamente dal lato corto oppure piegalo in tre.') },
      { art: 'ribbon-3', text: t('Schnur zweimal herumwickeln und eine Schleife binden.', 'Avvolgi lo spago due volte e fai un fiocco.') },
      { art: 'ribbon-4', text: t('Kräuterzweig unter die Schnur stecken. Wer mag, steckt die Namenskarte dazu.', 'Infila il rametto sotto lo spago. Se vuoi, aggiungi il bigliettino con il nome.') }
    ],
    tips: [t('Rosmarin duftet und bleibt den ganzen Abend frisch.', 'Il rosmarino profuma e resta fresco per tutta la serata.')]
  },
  {
    id: 'vassoio-carta', cat: 'lavoretti', cover: 'tray-6', minutes: 10, level: 2,
    title: t('Papiertablett zum Wegwerfen', 'Vassoio di carta usa e getta'),
    sub: t('Schälchen für Snacks, Nüsse oder Kleinteile – ohne Kleber', 'Vaschetta per snack, frutta secca o minuterie, senza colla'),
    materials: [t('1 quadratisches Blatt Papier (aus A4: 21 × 21 cm), festeres Papier hält besser', '1 foglio quadrato (da un A4: 21 × 21 cm); la carta spessa regge meglio'), t('Für Lebensmittel: Backpapier oder lebensmittelechtes Papier', 'Per alimenti: carta forno o carta adatta al cibo')],
    safety: [t('Für Essen nur sauberes, lebensmittelechtes Papier verwenden (kein Zeitungspapier).', 'Per il cibo usa solo carta pulita e adatta agli alimenti (niente giornale).')],
    steps: [
      { art: 'tray-0', text: t('Aus einem A4-Blatt ein Quadrat machen: eine Ecke auf die gegenüberliegende Kante legen, den Streifen abschneiden.', 'Ricava un quadrato da un foglio A4: porta un angolo sul lato opposto e taglia la striscia in più.') },
      { art: 'tray-1', text: t('Beide Diagonalen falten und wieder öffnen. In der Mitte kreuzen sich die Linien.', 'Piega entrambe le diagonali e riapri: al centro le linee si incrociano.') },
      { art: 'tray-2', text: t('Alle vier Ecken genau zur Mitte falten.', 'Piega tutti e quattro gli angoli esattamente al centro.') },
      { art: 'tray-3', text: t('Obere und untere Kante zur Mittellinie falten und wieder öffnen. Dann dasselbe mit links und rechts.', 'Piega il lato superiore e quello inferiore fino alla linea centrale e riapri. Poi fai lo stesso con destra e sinistra.') },
      { art: 'tray-4', text: t('Die obere und untere Spitze wieder aufklappen. Die Seiten links und rechts stehen nun als Wände hoch.', 'Riapri le punte in alto e in basso. I lati destro e sinistro si alzano e diventano le pareti.') },
      { art: 'tray-5', text: t('Oben die Ecken nach innen drücken, sodass eine Wand entsteht, und die Spitze über die Wand nach innen bis zum Boden legen. Unten genauso.', 'In alto spingi gli angoli verso l’interno per formare la parete, poi ripiega la punta sopra la parete fino al fondo. Ripeti in basso.'), tip: t('Die Falze aus Schritt 4 zeigen dir genau, wo es knickt.', 'Le pieghe del passo 4 ti mostrano esattamente dove piegare.') },
      { art: 'tray-6', text: t('Kanten nachziehen – dein Tablett ist fertig und hält ohne Kleber.', 'Ripassa i bordi: il vassoio è pronto e sta su senza colla.') }
    ],
    tips: [t('Ein 2 mm kleineres zweites Tablett ergibt einen Deckel.', 'Un secondo vassoio di 2 mm più piccolo diventa il coperchio.'), t('Mit Backpapier eignet es sich für Kekse auf dem Buffet.', 'Con la carta forno è perfetto per i biscotti al buffet.')],
    quiz: [
      { q: t('Wohin werden in Schritt 3 die vier Ecken gefaltet?', 'Dove si piegano i quattro angoli nel passo 3?'), options: [t('Zur Mitte', 'Al centro'), t('Nach hinten', 'Dietro'), t('Gar nicht', 'Da nessuna parte')], answer: 0, why: t('Die Ecken treffen sich in der Mitte, wo sich die Diagonalen kreuzen.', 'Gli angoli si incontrano al centro, dove si incrociano le diagonali.') }
    ]
  }
];

// ---------------------------------------------------------------- Haushalt
const casa: Guide[] = [
  {
    id: 'lavatrice', cat: 'casa', cover: 'wash-4', minutes: 10, level: 1,
    title: t('Die Waschmaschine richtig benutzen', 'Come usare la lavatrice'),
    sub: t('Sortieren, beladen, Waschmittel, Programm', 'Separare, caricare, detersivo, programma'),
    materials: [t('Waschmittel (flüssig, Pulver oder Caps)', 'Detersivo (liquido, polvere o capsule)'), t('optional: Weichspüler', 'facoltativo: ammorbidente'), t('Wäschekorb', 'Cesto della biancheria')],
    safety: [t('Waschmittel-Caps außer Reichweite von Kindern aufbewahren.', 'Tieni le capsule di detersivo lontano dai bambini.')],
    steps: [
      { art: 'wash-1', text: t('Pflegeetikett lesen: Die Zahl im Bottich ist die höchste Temperatur. Eine Hand im Bottich heißt Handwäsche, ein durchgestrichener Bottich: nicht waschen.', 'Leggi l’etichetta: il numero nella vaschetta è la temperatura massima. Una mano nella vaschetta vuol dire lavaggio a mano, la vaschetta barrata: non lavare.') },
      { art: 'wash-2', text: t('Wäsche sortieren: Weißes, Buntes und Dunkles getrennt. Empfindliches (Wolle, Seide) extra.', 'Separa i capi: bianchi, colorati e scuri a parte. I delicati (lana, seta) da soli.'), tip: t('Neue rote oder dunkle Kleidung färbt oft ab – die ersten Male allein waschen.', 'I capi nuovi rossi o scuri spesso stingono: le prime volte lavali da soli.') },
      { art: 'wash-3', text: t('Taschen leeren, Reißverschlüsse schließen, Jeans und Dunkles auf links drehen.', 'Svuota le tasche, chiudi le cerniere, rovescia jeans e capi scuri.') },
      { art: 'wash-4', text: t('Trommel locker füllen: Oben muss noch eine Hand breit Platz bleiben. Zu voll = nicht sauber.', 'Riempi il cestello senza pressare: in alto deve restare lo spazio di una mano. Troppo pieno = non lava bene.') },
      { art: 'wash-5', text: t('Waschmittel einfüllen: Fach II = Hauptwäsche, Fach I = Vorwäsche, Blume = Weichspüler. Caps legst du direkt in die Trommel, vor der Wäsche.', 'Metti il detersivo: vaschetta II = lavaggio principale, I = prelavaggio, fiore = ammorbidente. Le capsule vanno direttamente nel cestello, prima dei panni.'), tip: t('Dosierung steht auf der Packung. Mehr Waschmittel wäscht nicht sauberer.', 'La dose è scritta sulla confezione. Più detersivo non lava meglio.') },
      { art: 'wash-6', text: t('Programm wählen: Baumwolle 40 °C für Alltagswäsche, 60 °C für Handtücher und Bettwäsche, Pflegeleicht 30–40 °C, Fein/Wolle 30 °C oder kalt.', 'Scegli il programma: cotone 40 °C per i capi di tutti i giorni, 60 °C per asciugamani e lenzuola, sintetici 30–40 °C, delicati/lana 30 °C o a freddo.') },
      { art: 'wash-7', text: t('Start drücken. Nach dem Ende die Wäsche gleich aufhängen. Tür und Waschmittelfach offen lassen, damit sie trocknen.', 'Premi avvio. A fine lavaggio stendi subito i panni. Lascia aperti oblò e vaschetta perché si asciughino.') }
    ],
    tips: [t('Einmal im Monat ein leeres Programm mit 60 °C laufen lassen: so bleibt die Maschine frisch.', 'Una volta al mese fai un lavaggio a vuoto a 60 °C: la lavatrice resta pulita.'), t('Eco-Programme dauern länger, sparen aber Strom.', 'I programmi Eco durano di più ma consumano meno.')],
    quiz: [
      { q: t('In welches Fach kommt das Waschmittel für die normale Wäsche?', 'In quale vaschetta va il detersivo per il lavaggio normale?'), options: [t('Fach II', 'Vaschetta II'), t('Fach I', 'Vaschetta I'), t('Blume', 'Fiore')], answer: 0, why: t('II ist die Hauptwäsche. I ist nur für die Vorwäsche.', 'II è il lavaggio principale. I serve solo per il prelavaggio.') },
      { q: t('Wie voll darf die Trommel sein?', 'Quanto può essere pieno il cestello?'), options: [t('Eine Hand breit Platz oben', 'Una mano di spazio in alto'), t('Ganz voll gedrückt', 'Pieno e pressato'), t('Nur halb', 'Solo a metà')], answer: 0, why: t('Die Wäsche muss sich bewegen können.', 'I panni devono potersi muovere.') }
    ]
  },
  {
    id: 'maglietta', cat: 'casa', cover: 'shirt-4', minutes: 3, level: 1,
    title: t('T-Shirt ordentlich falten', 'Piegare una maglietta'),
    sub: t('Gleich große Päckchen für Schrank und Koffer', 'Pacchetti tutti uguali per armadio e valigia'),
    steps: [
      { art: 'shirt-1', text: t('T-Shirt mit der Vorderseite nach unten glatt hinlegen.', 'Stendi la maglietta ben liscia con il davanti verso il basso.') },
      { art: 'shirt-2', text: t('Linke Seite samt Ärmel bis etwa ein Drittel zur Mitte falten. Ärmel nach unten legen.', 'Piega il lato sinistro con la manica verso il centro, per circa un terzo. Abbassa la manica.') },
      { art: 'shirt-3', text: t('Rechte Seite genauso. Jetzt hast du einen langen Streifen.', 'Fai lo stesso con il lato destro: ora hai una striscia lunga.') },
      { art: 'shirt-4', text: t('Von unten her einmal zur Hälfte und noch einmal falten. Umdrehen – fertig.', 'Piega dal basso a metà e poi ancora a metà. Gira: fatto.'), tip: t('Ein Stück Pappe in Buchgröße als Schablone macht alle Shirts gleich groß.', 'Un cartoncino grande come un libro come sagoma rende tutte le magliette uguali.') }
    ]
  },
  {
    id: 'lavastoviglie', cat: 'casa', cover: 'dish-2', minutes: 8, level: 1,
    title: t('Spülmaschine richtig einräumen', 'Caricare la lavastoviglie'),
    sub: t('Damit alles sauber wird und nichts kaputt geht', 'Perché tutto venga pulito e niente si rompa'),
    materials: [t('Spülmaschinentab', 'Pastiglia per lavastoviglie'), t('Regeneriersalz und Klarspüler (wenn die Anzeige leuchtet)', 'Sale e brillantante (quando la spia è accesa)')],
    safety: [t('Scharfe Messer mit der Klinge nach unten oder flach in die oberste Schublade.', 'Coltelli affilati con la lama verso il basso o stesi nel cassetto in alto.')],
    steps: [
      { art: 'dish-1', text: t('Essensreste in den Müll schaben. Vorspülen unter fließendem Wasser ist nicht nötig.', 'Togli gli avanzi nella spazzatura. Non serve sciacquare sotto l’acqua corrente.') },
      { art: 'dish-2', text: t('Unten: Teller, Töpfe und Pfannen. Teller schräg, Vorderseite zur Mitte.', 'Sotto: piatti, pentole e padelle. Piatti inclinati con il lato sporco verso il centro.') },
      { art: 'dish-3', text: t('Oben: Gläser, Tassen und Schüsseln mit der Öffnung nach unten, leicht schräg, damit das Wasser abläuft.', 'Sopra: bicchieri, tazze e ciotole a testa in giù, leggermente inclinati perché l’acqua scoli.') },
      { art: 'dish-4', text: t('Besteck in den Korb oder die Schublade: Gabeln und Löffel mit dem Griff nach unten, Messer mit dem Griff nach oben.', 'Posate nel cestello o nel cassetto: forchette e cucchiai con il manico in giù, coltelli con il manico in su.') },
      { art: 'dish-5', text: t('Prüfen, ob sich die Sprüharme frei drehen. Tab ins Fach, Klappe zu, Eco-Programm starten.', 'Controlla che i bracci girino liberi. Pastiglia nella vaschetta, chiudi, avvia il programma Eco.') }
    ],
    tips: [t('Holz, Gusseisen, Kristall und gute Messer lieber von Hand spülen.', 'Legno, ghisa, cristallo e coltelli buoni meglio a mano.')]
  },
  {
    id: 'macchie', cat: 'casa', cover: 'stain-1', minutes: 5, level: 2,
    title: t('Flecken entfernen', 'Togliere le macchie'),
    sub: t('Die wichtigsten Regeln und Hausmittel', 'Le regole principali e i rimedi di casa'),
    safety: [t('Nie verschiedene Reinigungsmittel mischen (besonders Chlor und Essig).', 'Non mescolare mai prodotti diversi (soprattutto candeggina e aceto).'), t('Neues Mittel zuerst an einer versteckten Stelle testen.', 'Prova ogni prodotto prima su un punto nascosto.')],
    steps: [
      { art: 'stain-1', text: t('Schnell sein: Frische Flecken gehen viel leichter raus.', 'Agisci in fretta: le macchie fresche vanno via molto più facilmente.') },
      { art: 'stain-2', text: t('Tupfen statt reiben: mit einem sauberen Tuch von außen nach innen tupfen, sonst wird der Fleck größer.', 'Tampona, non strofinare: con un panno pulito dall’esterno verso l’interno, altrimenti la macchia si allarga.') },
      { art: 'stain-3', text: t('Kaltes Wasser zuerst. Heißes Wasser macht Blut, Ei und Milch dauerhaft fest.', 'Prima acqua fredda. L’acqua calda fissa per sempre sangue, uovo e latte.') },
      { art: 'stain-4', text: t('Fett (Öl, Soße): etwas Spülmittel einreiben, 10 Minuten wirken lassen, dann waschen.', 'Unto (olio, sugo): strofina un po’ di detersivo per piatti, lascia agire 10 minuti, poi lava.') },
      { art: 'stain-5', text: t('Kaffee, Tee, Rotwein: sofort mit kaltem Wasser ausspülen, dann mit Gallseife oder Fleckenmittel behandeln.', 'Caffè, tè, vino rosso: sciacqua subito con acqua fredda, poi tratta con sapone di Marsiglia o smacchiatore.') }
    ],
    quiz: [
      { q: t('Womit behandelst du einen frischen Blutfleck?', 'Con cosa tratti una macchia di sangue fresca?'), options: [t('Kaltem Wasser', 'Acqua fredda'), t('Heißem Wasser', 'Acqua calda'), t('Bügeleisen', 'Ferro da stiro')], answer: 0, why: t('Hitze lässt Eiweiß gerinnen, der Fleck bleibt dann.', 'Il calore fa coagulare le proteine e la macchia resta.') }
    ]
  }
];

// ---------------------------------------------------------------- Kochen
const cucina: Guide[] = [
  {
    id: 'pasta-pomodoro', cat: 'cucina', cover: 'cook-pasta', minutes: 25, level: 1, servings: 2,
    title: t('Pasta mit Tomatensoße', 'Pasta al pomodoro'),
    sub: t('Das Grundrezept, das jeder können sollte', 'La ricetta base che tutti dovrebbero saper fare'),
    ingredients: [
      { qty: 180, unit: t('g', 'g'), name: t('Spaghetti oder andere Nudeln', 'spaghetti o altra pasta') },
      { qty: 400, unit: t('g', 'g'), name: t('passierte Tomaten (Passata)', 'passata di pomodoro') },
      { qty: 1, unit: t('Zehe', 'spicchio'), name: t('Knoblauch', 'aglio') },
      { qty: 2, unit: t('EL', 'cucchiai'), name: t('Olivenöl extra vergine', 'olio extravergine d’oliva') },
      { qty: null, unit: t('', ''), name: t('Salz und frisches Basilikum', 'sale e basilico fresco') }
    ],
    safety: [t('Topfgriffe nach innen drehen, damit niemand hängen bleibt.', 'Gira i manici delle pentole verso l’interno, così nessuno li urta.')],
    steps: [
      { art: 'cook-pot', text: t('Großen Topf mit Wasser aufsetzen: etwa 1 Liter pro 100 g Nudeln. Deckel drauf, dann kocht es schneller.', 'Metti sul fuoco una pentola grande: circa 1 litro d’acqua ogni 100 g di pasta. Con il coperchio bolle prima.') },
      { art: 'cook-pan', text: t('In der Pfanne Öl mit der angedrückten Knoblauchzehe bei kleiner Hitze 1–2 Minuten anschwitzen. Nicht braun werden lassen.', 'In padella scalda l’olio con lo spicchio d’aglio schiacciato a fuoco basso per 1–2 minuti, senza farlo scurire.') },
      { art: 'cook-sauce', text: t('Tomaten dazugeben, salzen und 15 Minuten leise köcheln lassen. Ab und zu umrühren.', 'Aggiungi il pomodoro, sala e lascia sobbollire 15 minuti. Mescola ogni tanto.') },
      { art: 'cook-salt', text: t('Wenn das Wasser sprudelt: salzen (ca. 10 g pro Liter) und die Nudeln hineingeben. Kochzeit laut Packung.', 'Quando l’acqua bolle: sala (circa 10 g per litro) e butta la pasta. Tempo di cottura come sulla confezione.') },
      { art: 'cook-drain', text: t('Eine Kelle Nudelwasser aufheben, dann abgießen.', 'Tieni da parte un mestolo di acqua di cottura, poi scola.') },
      { art: 'cook-mix', text: t('Nudeln in die Soße geben, mit etwas Nudelwasser 1 Minute schwenken. Basilikum darüber – servieren!', 'Versa la pasta nel sugo e saltala 1 minuto con un po’ di acqua di cottura. Basilico sopra e servi!') }
    ],
    tips: [t('Das stärkehaltige Nudelwasser macht die Soße cremig.', 'L’acqua di cottura ricca di amido rende il sugo cremoso.')],
    quiz: [
      { q: t('Wie viel Wasser für 200 g Nudeln?', 'Quanta acqua per 200 g di pasta?'), options: [t('2 Liter', '2 litri'), t('0,5 Liter', '0,5 litri'), t('5 Liter', '5 litri')], answer: 0, why: t('Faustregel: 1 Liter pro 100 g.', 'Regola: 1 litro ogni 100 g.') }
    ]
  },
  {
    id: 'frittata', cat: 'cucina', cover: 'cook-omelette', minutes: 15, level: 1, servings: 2,
    title: t('Frittata (italienisches Omelett)', 'Frittata'),
    sub: t('Schnell, günstig und mit Resten aus dem Kühlschrank', 'Veloce, economica e con gli avanzi del frigo'),
    ingredients: [
      { qty: 4, unit: t('', ''), name: t('Eier', 'uova') },
      { qty: 30, unit: t('g', 'g'), name: t('geriebener Parmesan', 'parmigiano grattugiato') },
      { qty: 1, unit: t('EL', 'cucchiaio'), name: t('Olivenöl', 'olio d’oliva') },
      { qty: 1, unit: t('', ''), name: t('Zucchini (optional)', 'zucchina (facoltativa)') },
      { qty: null, unit: t('', ''), name: t('Salz und Pfeffer', 'sale e pepe') }
    ],
    steps: [
      { art: 'cook-bowl', text: t('Eier in eine Schüssel schlagen, Parmesan, Salz und Pfeffer dazu und mit der Gabel gut verquirlen.', 'Rompi le uova in una ciotola, aggiungi parmigiano, sale e pepe e sbatti bene con la forchetta.') },
      { art: 'cook-pan', text: t('Zucchini in dünne Scheiben schneiden und im Öl 5 Minuten anbraten.', 'Taglia la zucchina a rondelle sottili e falla rosolare 5 minuti nell’olio.') },
      { art: 'cook-omelette', text: t('Eier darübergießen, Hitze klein stellen, Deckel drauf. 5–6 Minuten stocken lassen.', 'Versa le uova, abbassa la fiamma e copri. Lascia rapprendere 5–6 minuti.') },
      { art: 'cook-flip', text: t('Wenden: Einen Teller auf die Pfanne legen, umdrehen und die Frittata zurück in die Pfanne gleiten lassen. Noch 2 Minuten.', 'Girala: appoggia un piatto sulla padella, capovolgi e fai scivolare la frittata di nuovo in padella. Altri 2 minuti.'), tip: t('Mit Topflappen arbeiten – der Pfannengriff ist heiß.', 'Usa le presine: il manico è caldo.') }
    ]
  },
  {
    id: 'pancake', cat: 'cucina', cover: 'cook-pancake', minutes: 20, level: 1, servings: 4,
    title: t('Fluffige Pancakes', 'Pancake soffici'),
    sub: t('Für ein Frühstück am Wochenende (ca. 10 Stück)', 'Per la colazione del weekend (circa 10 pezzi)'),
    ingredients: [
      { qty: 200, unit: t('g', 'g'), name: t('Mehl', 'farina') },
      { qty: 2, unit: t('', ''), name: t('Eier', 'uova') },
      { qty: 250, unit: t('ml', 'ml'), name: t('Milch', 'latte') },
      { qty: 1, unit: t('EL', 'cucchiaio'), name: t('Zucker', 'zucchero') },
      { qty: 2, unit: t('TL', 'cucchiaini'), name: t('Backpulver', 'lievito per dolci') },
      { qty: null, unit: t('', ''), name: t('1 Prise Salz, etwas Butter für die Pfanne', '1 pizzico di sale, un po’ di burro per la padella') }
    ],
    steps: [
      { art: 'cook-bowl', text: t('Mehl, Zucker, Backpulver und Salz in einer Schüssel mischen.', 'Mescola in una ciotola farina, zucchero, lievito e sale.') },
      { art: 'cook-whisk', text: t('Eier und Milch dazugeben und nur kurz verrühren, bis keine großen Klumpen mehr da sind. Kleine Klümpchen sind okay.', 'Aggiungi uova e latte e mescola poco, giusto finché non ci sono grumi grossi. Qualche grumetto va bene.') },
      { art: 'cook-pan', text: t('Pfanne auf mittlere Hitze, mit wenig Butter auspinseln. Pro Pancake eine kleine Kelle Teig.', 'Scalda la padella a fuoco medio e ungila con poco burro. Un mestolino di pastella per ogni pancake.') },
      { art: 'cook-pancake', text: t('Wenn oben Bläschen platzen (nach ca. 2 Minuten), wenden und noch 1 Minute backen.', 'Quando in superficie scoppiano le bollicine (circa 2 minuti), gira e cuoci ancora 1 minuto.') }
    ],
    tips: [t('Mit Obst, Joghurt oder Ahornsirup servieren.', 'Servili con frutta, yogurt o sciroppo d’acero.')]
  },
  {
    id: 'cipolla', cat: 'cucina', cover: 'knife-2', minutes: 5, level: 2,
    title: t('Zwiebel sicher schneiden', 'Tagliare la cipolla in sicurezza'),
    sub: t('Die Krallen-Technik schützt deine Finger', 'La tecnica “a artiglio” protegge le dita'),
    safety: [t('Ein scharfes Messer ist sicherer als ein stumpfes: Es rutscht weniger ab.', 'Un coltello affilato è più sicuro di uno smussato: scivola meno.'), t('Brett mit einem feuchten Tuch darunter gegen Verrutschen sichern.', 'Metti un panno umido sotto il tagliere perché non scivoli.')],
    steps: [
      { art: 'knife-1', text: t('Zwiebel halbieren (durch die Wurzel), schälen. Die flache Seite liegt auf dem Brett.', 'Taglia la cipolla a metà passando per la radice e sbucciala. Appoggia il lato piatto sul tagliere.') },
      { art: 'knife-2', text: t('Krallengriff: Fingerspitzen nach innen gebogen, die Knöchel führen das Messer.', 'Presa ad artiglio: punte delle dita piegate verso l’interno, le nocche guidano la lama.') },
      { art: 'knife-3', text: t('Senkrecht in Streifen schneiden, die Wurzel nicht durchschneiden – so hält alles zusammen.', 'Taglia a strisce verticali senza tagliare la radice: così resta tutto unito.') },
      { art: 'knife-4', text: t('Quer schneiden: Es entstehen kleine Würfel.', 'Ora taglia di traverso: ottieni dei cubetti.') }
    ]
  }
];

// ---------------------------------------------------------------- Programmieren
const PAGE1 = `<!doctype html>
<html>
  <body>
    <h1>Ciao!</h1>
    <p>Questa è la mia prima pagina.</p>
  </body>
</html>`;

const PAGE2 = `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 20px; }
      h1 { color: tomato; }
    </style>
  </head>
  <body>
    <h1>Il mio sito</h1>
    <p>Cambia i colori qui sopra!</p>
  </body>
</html>`;

const PAGE3 = `<!doctype html>
<html>
  <body style="font-family: sans-serif; padding: 20px">
    <h1 id="titolo">Premi il bottone</h1>
    <button id="bottone">Cliccami</button>
    <script>
      const bottone = document.getElementById('bottone');
      // scrivi qui sotto il tuo codice

    </script>
  </body>
</html>`;

const APP = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: sans-serif; max-width: 420px; margin: 20px auto; padding: 0 12px; }
      input { font-size: 16px; padding: 8px; width: 65%; }
      button { font-size: 16px; padding: 8px 14px; }
      li { padding: 6px 0; cursor: pointer; }
      .fatto { text-decoration: line-through; color: gray; }
    </style>
  </head>
  <body>
    <h1>Lista della spesa</h1>
    <input id="voce" placeholder="Es. latte">
    <button id="aggiungi">Aggiungi</button>
    <ul id="lista"></ul>
    <script>
      const lista = document.getElementById('lista');
      const voce = document.getElementById('voce');
      document.getElementById('aggiungi').addEventListener('click', () => {
        if (!voce.value.trim()) return;
        const li = document.createElement('li');
        li.textContent = voce.value;
        li.addEventListener('click', () => li.classList.toggle('fatto'));
        lista.appendChild(li);
        voce.value = '';
      });
    </script>
  </body>
</html>`;

const codice: Guide[] = [
  {
    id: 'web-1-html', cat: 'codice', cover: 'code-html', minutes: 10, level: 1,
    title: t('1. Deine erste Webseite (HTML)', '1. La tua prima pagina web (HTML)'),
    sub: t('Überschriften und Absätze – live im Browser', 'Titoli e paragrafi, dal vivo nel browser'),
    steps: [
      { art: 'code-html', text: t('Jede Webseite besteht aus HTML. Inhalte stehen zwischen „Tags“: <h1> öffnet eine Überschrift, </h1> schließt sie. <p> ist ein Absatz.', 'Ogni pagina web è fatta di HTML. I contenuti stanno tra i “tag”: <h1> apre un titolo, </h1> lo chiude. <p> è un paragrafo.') },
      {
        text: t('Probiere es aus: Ändere den Text und füge einen zweiten Absatz hinzu. Rechts siehst du sofort das Ergebnis.', 'Prova: cambia il testo e aggiungi un secondo paragrafo. A destra vedi subito il risultato.'),
        code: { start: PAGE1, check: /<p>[\s\S]*<\/p>[\s\S]*<p>[\s\S]*<\/p>/i, goal: t('Füge einen zweiten Absatz <p>…</p> hinzu.', 'Aggiungi un secondo paragrafo <p>…</p>.'), hint: t('Schreibe unter die erste Zeile mit <p> eine neue: <p>Mein Text</p>', 'Scrivi sotto la prima riga con <p> una nuova riga: <p>Il mio testo</p>') }
      },
      {
        text: t('Bilder und Links: <a href="https://…">Text</a> ist ein Link, <ul><li>…</li></ul> eine Liste. Baue eine Liste mit drei Hobbys.', 'Immagini e link: <a href="https://…">testo</a> è un link, <ul><li>…</li></ul> un elenco. Crea un elenco con tre hobby.'),
        code: { start: PAGE1, check: /<ul>[\s\S]*(<li>[\s\S]*){3}[\s\S]*<\/ul>/i, goal: t('Eine Liste <ul> mit mindestens drei <li>.', 'Un elenco <ul> con almeno tre <li>.'), hint: t('Beispiel: <ul><li>Musik</li><li>Sport</li><li>Kochen</li></ul>', 'Esempio: <ul><li>Musica</li><li>Sport</li><li>Cucina</li></ul>') }
      }
    ],
    quiz: [
      { q: t('Welcher Tag schließt eine Überschrift?', 'Quale tag chiude un titolo?'), options: [t('</h1>', '</h1>'), t('<h1>', '<h1>'), t('<end>', '<end>')], answer: 0, why: t('Schließende Tags haben einen Schrägstrich.', 'I tag di chiusura hanno la barra.') }
    ]
  },
  {
    id: 'web-2-css', cat: 'codice', cover: 'code-css', minutes: 10, level: 1,
    title: t('2. Farben und Stil (CSS)', '2. Colori e stile (CSS)'),
    sub: t('So sieht deine Seite professionell aus', 'Così la tua pagina sembra professionale'),
    steps: [
      { art: 'code-css', text: t('CSS bestimmt das Aussehen. Eine Regel hat einen Selektor (z. B. h1) und Eigenschaften: color: Textfarbe, background: Hintergrund, font-size: Schriftgröße.', 'Il CSS decide l’aspetto. Una regola ha un selettore (es. h1) e delle proprietà: color = colore del testo, background = sfondo, font-size = grandezza.') },
      {
        text: t('Gib der ganzen Seite eine Hintergrundfarbe, z. B. background: lightyellow; im body.', 'Dai uno sfondo a tutta la pagina, ad esempio background: lightyellow; nel body.'),
        code: { start: PAGE2, check: /body\s*\{[^}]*background(-color)?\s*:/i, goal: t('Im body-Block eine background-Farbe setzen.', 'Nel blocco body imposta un colore di background.'), hint: t('Ergänze in der body-Zeile: background: lightyellow;', 'Aggiungi nella riga del body: background: lightyellow;') }
      },
      {
        text: t('Mach den Absatz größer: Neue Regel p { font-size: 20px; }', 'Ingrandisci il paragrafo: nuova regola p { font-size: 20px; }'),
        code: { start: PAGE2, check: /(^|[\s}])p\s*\{[^}]*font-size\s*:/i, goal: t('Eine Regel für p mit font-size.', 'Una regola per p con font-size.'), hint: t('Schreibe vor </style>: p { font-size: 20px; }', 'Scrivi prima di </style>: p { font-size: 20px; }') }
      }
    ]
  },
  {
    id: 'web-3-js', cat: 'codice', cover: 'code-js', minutes: 12, level: 2,
    title: t('3. Ein Knopf, der reagiert (JavaScript)', '3. Un bottone che risponde (JavaScript)'),
    sub: t('Deine Seite wird interaktiv', 'La tua pagina diventa interattiva'),
    steps: [
      { art: 'code-js', text: t('JavaScript macht Seiten lebendig. Mit addEventListener("click", …) sagst du: „Wenn jemand klickt, mach das hier.“', 'JavaScript rende le pagine vive. Con addEventListener("click", …) dici: “quando qualcuno clicca, fai questo”.') },
      {
        text: t('Schreibe unter den Kommentar: bottone.addEventListener("click", () => { document.getElementById("titolo").textContent = "Hai cliccato!"; }); Dann klicke in der Vorschau auf den Knopf.', 'Scrivi sotto il commento: bottone.addEventListener("click", () => { document.getElementById("titolo").textContent = "Hai cliccato!"; }); Poi clicca il bottone nell’anteprima.'),
        code: { start: PAGE3, check: /addEventListener\(\s*['"]click['"]/, goal: t('Einen Klick-Listener mit addEventListener("click", …) einbauen.', 'Aggiungi un ascoltatore con addEventListener("click", …).'), hint: t('Achte auf Klammern und Anführungszeichen. Jede ( braucht eine ).', 'Attenzione a parentesi e virgolette: ogni ( ha bisogno di una ).') }
      }
    ]
  },
  {
    id: 'web-4-app', cat: 'codice', cover: 'code-app', minutes: 15, level: 2,
    title: t('4. Mini-App: Einkaufsliste', '4. Mini app: lista della spesa'),
    sub: t('Eine echte kleine App, die auf dem Handy läuft', 'Una vera piccola app che funziona sul telefono'),
    steps: [
      { art: 'code-app', text: t('Eine App ist HTML (Aufbau) + CSS (Aussehen) + JavaScript (Verhalten). Diese Einkaufsliste nutzt alle drei.', 'Un’app è HTML (struttura) + CSS (aspetto) + JavaScript (comportamento). Questa lista della spesa usa tutti e tre.') },
      {
        text: t('Teste die App in der Vorschau: Eintrag hinzufügen, dann antippen zum Abhaken. Ändere danach den Titel in „Meine Liste“.', 'Prova l’app nell’anteprima: aggiungi una voce e toccala per spuntarla. Poi cambia il titolo in “La mia lista”.'),
        code: { start: APP, check: /<h1>\s*(La mia lista|Meine Liste)\s*<\/h1>/i, goal: t('Titel in <h1> auf „Meine Liste“ oder „La mia lista“ ändern.', 'Cambia il titolo in <h1> in “La mia lista”.'), hint: t('Suche die Zeile <h1>Lista della spesa</h1> und ersetze den Text.', 'Cerca la riga <h1>Lista della spesa</h1> e sostituisci il testo.') }
      },
      {
        text: t('Extra: Gib den erledigten Einträgen eine andere Farbe. Ändere in .fatto die Farbe gray zu green.', 'Extra: dai un altro colore alle voci fatte. In .fatto cambia gray in green.'),
        code: { start: APP, check: /\.fatto\s*\{[^}]*color\s*:\s*green/i, goal: t('In der Regel .fatto color: green setzen.', 'Nella regola .fatto imposta color: green.'), hint: t('Ersetze „color: gray“ durch „color: green“.', 'Sostituisci “color: gray” con “color: green”.') }
      }
    ],
    tips: [t('Mit „Herunterladen“ speicherst du die App als Datei index.html. Doppelklick öffnet sie im Browser.', 'Con “Scarica” salvi l’app come file index.html. Un doppio clic la apre nel browser.')]
  },
  {
    id: 'web-5-online', cat: 'codice', cover: 'code-online', minutes: 10, level: 2,
    title: t('5. Deine Seite ins Internet stellen', '5. Mettere online il tuo sito'),
    sub: t('Kostenlos veröffentlichen, ohne Server', 'Pubblicare gratis, senza server'),
    steps: [
      { art: 'code-online', text: t('Speichere deine Seite als Datei index.html (Knopf „Herunterladen“ in den Lektionen 1–4). Diese Datei ist deine Startseite.', 'Salva la pagina come file index.html (bottone “Scarica” nelle lezioni 1–4). Questo file è la tua home page.') },
      { art: 'code-folder', text: t('Lege einen Ordner an und lege index.html hinein. Bilder kommen in denselben Ordner.', 'Crea una cartella e mettici dentro index.html. Anche le immagini vanno nella stessa cartella.') },
      { art: 'code-upload', text: t('Einen kostenlosen Static-Hosting-Dienst nutzen (z. B. GitHub Pages oder ein Drag-and-drop-Hoster). Konto anlegen, Ordner hochladen.', 'Usa un servizio gratuito di hosting statico (ad es. GitHub Pages o un servizio drag-and-drop). Crea un account e carica la cartella.') },
      { art: 'code-online', text: t('Du bekommst eine Adresse (URL). Teile sie – deine Seite ist online! Änderungen: Datei bearbeiten und neu hochladen.', 'Ricevi un indirizzo (URL). Condividilo: il tuo sito è online! Per modificarlo: cambia il file e ricaricalo.') }
    ],
    safety: [t('Keine Passwörter, Adressen oder Telefonnummern auf öffentliche Seiten schreiben.', 'Non mettere password, indirizzi o numeri di telefono su pagine pubbliche.')]
  }
];

// ---------------------------------------------------------------- Heimwerken
const faidate: Guide[] = [
  {
    id: 'quadro', cat: 'faidate', cover: 'wall-4', minutes: 20, level: 2,
    title: t('Ein Bild aufhängen', 'Appendere un quadro'),
    sub: t('Gerade, auf der richtigen Höhe und sicher', 'Dritto, all’altezza giusta e sicuro'),
    materials: [t('Zollstock oder Maßband, Bleistift', 'Metro e matita'), t('Wasserwaage (auch als Handy-App)', 'Livella (anche come app sul telefono)'), t('Leichte Bilder: Bildernagel oder Klebehaken', 'Quadri leggeri: chiodino o gancio adesivo'), t('Schwere Bilder: Bohrmaschine, Dübel, Schraube', 'Quadri pesanti: trapano, tassello, vite')],
    safety: [t('Nie direkt über oder unter Steckdosen und Schaltern bohren: Dort laufen Leitungen senkrecht.', 'Non forare mai sopra o sotto prese e interruttori: lì i cavi corrono in verticale.'), t('Beim Bohren Schutzbrille tragen.', 'Quando fori indossa gli occhiali protettivi.')],
    steps: [
      { art: 'wall-1', text: t('Höhe wählen: Die Bildmitte liegt meist bei 145–155 cm, also etwa auf Augenhöhe.', 'Scegli l’altezza: il centro del quadro di solito sta a 145–155 cm, all’altezza degli occhi.') },
      { art: 'wall-2', text: t('Abstand vom Aufhänger zur Oberkante des Bildes messen und von der Bildmitte nach oben übertragen. Punkt mit Bleistift markieren.', 'Misura la distanza tra il gancio dietro e il bordo superiore del quadro e riportala sul muro. Segna il punto con la matita.') },
      { art: 'wall-3', text: t('Schwere Bilder: Loch bohren (Bohrer so dick wie der Dübel), Dübel bündig hineindrücken, Schraube eindrehen, sodass sie 5 mm herausschaut.', 'Quadri pesanti: fai il foro (punta grande come il tassello), inserisci il tassello a filo, avvita la vite lasciandola sporgere 5 mm.') },
      { art: 'wall-4', text: t('Bild aufhängen und mit der Wasserwaage gerade ausrichten. Die Blase muss in der Mitte stehen.', 'Appendi il quadro e raddrizzalo con la livella: la bolla deve stare al centro.') }
    ],
    quiz: [
      { q: t('Wo solltest du nicht bohren?', 'Dove non devi forare?'), options: [t('Senkrecht über einer Steckdose', 'In verticale sopra una presa'), t('In der Wandmitte', 'Al centro della parete'), t('Neben einem Fenster', 'Vicino a una finestra')], answer: 0, why: t('Stromleitungen laufen senkrecht von Steckdosen und Schaltern weg.', 'I cavi elettrici partono in verticale da prese e interruttori.') }
    ]
  },
  {
    id: 'lampadina', cat: 'faidate', cover: 'bulb-3', minutes: 5, level: 1,
    title: t('Glühbirne wechseln', 'Cambiare una lampadina'),
    sub: t('Sicher und mit der richtigen neuen Lampe', 'In sicurezza e con la lampadina giusta'),
    safety: [t('Licht ausschalten. Bei Deckenleuchten zusätzlich die Sicherung ausschalten.', 'Spegni la luce. Per le plafoniere stacca anche l’interruttore generale.'), t('Stabile Leiter, kein Stuhl.', 'Usa una scala stabile, non una sedia.')],
    steps: [
      { art: 'bulb-1', text: t('Schalter aus und die Lampe ein paar Minuten abkühlen lassen.', 'Spegni l’interruttore e lascia raffreddare la lampadina qualche minuto.') },
      { art: 'bulb-2', text: t('Alte Birne gegen den Uhrzeigersinn herausdrehen. Auf dem Sockel stehen Gewinde (E27 groß, E14 klein) und Leistung.', 'Svita la vecchia lampadina in senso antiorario. Sull’attacco trovi il tipo (E27 grande, E14 piccolo) e la potenza.') },
      { art: 'bulb-3', text: t('Neue LED mit gleichem Sockel kaufen. Achte auf Lumen (Helligkeit): ca. 800 lm ersetzen eine alte 60-Watt-Birne. 2700 K = warmes Licht.', 'Compra una LED con lo stesso attacco. Guarda i lumen (luminosità): circa 800 lm sostituiscono una vecchia da 60 W. 2700 K = luce calda.') },
      { art: 'bulb-4', text: t('Neue Birne im Uhrzeigersinn eindrehen, ohne Gewalt. Alte LED und Energiesparlampen zum Wertstoffhof bringen.', 'Avvita la nuova in senso orario senza forzare. Porta le vecchie LED e lampadine a risparmio all’isola ecologica.') }
    ]
  },
  {
    id: 'scarico', cat: 'faidate', cover: 'sink-2', minutes: 20, level: 2,
    title: t('Verstopften Abfluss frei machen', 'Sturare il lavandino'),
    sub: t('Ohne aggressive Chemie', 'Senza prodotti chimici aggressivi'),
    materials: [t('Eimer und Lappen', 'Secchio e straccio'), t('Saugglocke (Pümpel)', 'Sturalavandini (sopapa)'), t('Handschuhe', 'Guanti'), t('Natron und Essig', 'Bicarbonato e aceto')],
    safety: [t('Keine verschiedenen Abflussreiniger mischen – es können giftige Gase entstehen.', 'Non mescolare sturalavandini diversi: possono formarsi gas tossici.')],
    steps: [
      { art: 'sink-1', text: t('Erst die Saugglocke: Überlauf mit einem nassen Lappen zuhalten, Glocke aufsetzen, ein paar Mal kräftig pumpen.', 'Prima la sopapa: tappa il troppopieno con uno straccio bagnato, appoggia la ventosa e pompa con forza qualche volta.') },
      { art: 'sink-2', text: t('Hilft das nicht: Eimer unter den Siphon stellen und den Siphon von Hand aufschrauben.', 'Se non basta: metti un secchio sotto il sifone e svitalo a mano.') },
      { art: 'sink-3', text: t('Siphon ausspülen, Haare und Reste entfernen, Dichtungen prüfen und wieder fest zuschrauben.', 'Sciacqua il sifone, togli capelli e residui, controlla le guarnizioni e riavvita bene.') },
      { art: 'sink-4', text: t('Vorbeugen: Einmal im Monat 2 EL Natron in den Abfluss, ein Glas Essig hinterher, 15 Minuten warten, mit heißem Wasser spülen.', 'Prevenzione: una volta al mese 2 cucchiai di bicarbonato nello scarico, poi un bicchiere di aceto, aspetta 15 minuti e sciacqua con acqua calda.') }
    ]
  }
];

export const GUIDES: Guide[] = [...lavoretti, ...casa, ...cucina, ...codice, ...faidate];

export const guideById = (id: string) => GUIDES.find((g) => g.id === id);
export const guidesOf = (cat: AdultCat) => GUIDES.filter((g) => g.cat === cat);
