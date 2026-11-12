import { sec, term, theory, type Theory } from './types';

/** Deutsch, Italiano, Englisch */
export const LANGUAGES: Record<string, Theory> = {
  // ───────── Deutsch Grundschule ─────────
  'd1-anlaute': theory([
    sec(['Laute und Buchstaben', 'Suoni e lettere'],
      ['Jedes Wort besteht aus Lauten, die wir hören, und Buchstaben, die wir sehen. Der Anlaut ist der erste Laut eines Wortes. Sprich das Wort langsam und übertrieben deutlich: Mmmaus, Sssonne.',
        'Ogni parola è fatta di suoni che sentiamo e di lettere che vediamo. Il suono iniziale è il primo suono della parola. Pronuncia la parola lentamente: Mmmaus (topo), Sssonne (sole).'],
      ['Maus → M\nSonne → S\nAffe → A', 'Maus (topo) → M\nSonne (sole) → S\nAffe (scimmia) → A']),
    sec(['Die Anlauttabelle', 'La tabella dei suoni iniziali'],
      ['Zu jedem Buchstaben gibt es ein Bild mit diesem Anlaut. Wenn du nicht weißt, wie ein Laut geschrieben wird, suchst du ein Bild, das genauso anfängt.',
        'Per ogni lettera c’è un disegno che inizia con quel suono. Se non sai come si scrive un suono, cerca un disegno che comincia allo stesso modo.'],
      undefined,
      ['Achtung bei ähnlichen Lauten: B und P, D und T, G und K klingen fast gleich. Leg die Hand an den Hals: Bei B, D, G brummt es.', 'Attenzione ai suoni simili: B e P, D e T, G e K. Metti la mano sulla gola: con B, D, G senti vibrare.']),
    sec(['Selbstlaute und Mitlaute', 'Vocali e consonanti'],
      ['A, E, I, O, U sind Selbstlaute (Vokale). Man kann sie lange singen. Dazu kommen die Umlaute Ä, Ö, Ü. Alle anderen Buchstaben sind Mitlaute (Konsonanten).',
        'A, E, I, O, U sono vocali: si possono cantare a lungo. In tedesco ci sono anche le vocali con dieresi Ä, Ö, Ü. Le altre lettere sono consonanti.'])
  ], [
    ['Den Buchstabennamen statt des Lautes hören: „Em“ statt „mmm“.', 'Pensare al nome della lettera invece che al suono: “emme” invece di “mmm”.'],
    ['B/P und D/T verwechseln.', 'Confondere B/P e D/T.']
  ], [
    term(['Anlaut', 'Suono iniziale'], ['Der erste Laut eines Wortes.', 'Il primo suono di una parola.']),
    term(['Vokal', 'Vocale'], ['Selbstlaut: a, e, i, o, u.', 'a, e, i, o, u.'])
  ]),

  'd1-silben': theory([
    sec(['Was ist eine Silbe?', 'Che cos’è una sillaba?'],
      ['Wörter kann man in Sprechteile zerlegen: die Silben. Klatsche beim Sprechen: Ba-na-ne hat drei Klatscher, also drei Silben.',
        'Le parole si dividono in pezzetti che si pronunciano insieme: le sillabe. Batti le mani mentre parli: Ba-na-ne (banana) ha tre battute, quindi tre sillabe.'],
      ['Haus (1) – Ho-se (2) – Ba-na-ne (3) – Schmet-ter-ling (3)', 'Haus (1) – Ho-se (2) – Ba-na-ne (3) – Schmet-ter-ling (3)']),
    sec(['In jeder Silbe ein Vokal', 'In ogni sillaba una vocale'],
      ['Jede Silbe hat mindestens einen Selbstlaut (a, e, i, o, u, ä, ö, ü) oder Zwielaut (au, ei, eu). Er ist der Silbenkönig.',
        'Ogni sillaba ha almeno una vocale (a, e, i, o, u, ä, ö, ü) o un dittongo (au, ei, eu). È il “re” della sillaba.'],
      ['Ro-se: o und e\nAu-to: au und o', 'Ro-se: o ed e\nAu-to: au e o']),
    sec(['Silben helfen beim Lesen und Schreiben', 'Le sillabe aiutano a leggere e scrivere'],
      ['Lange Wörter liest du leichter Silbe für Silbe. Beim Schreiben sprichst du jede Silbe deutlich, dann vergisst du keine Buchstaben.',
        'Le parole lunghe si leggono meglio sillaba per sillaba. Quando scrivi, pronuncia ogni sillaba chiaramente: così non dimentichi lettere.'],
      undefined,
      ['Silbenbögen unter das Wort malen hilft beim Lesen.', 'Disegnare archetti sotto le sillabe aiuta a leggere.'])
  ], [
    ['Buchstaben statt Silben zählen.', 'Contare le lettere invece delle sillabe.']
  ], [
    term(['Silbe', 'Sillaba'], ['Sprechteil eines Wortes, z. B. Ho-se.', 'Parte di una parola che si pronuncia in un colpo.'])
  ]),

  'd1-woerter': theory([
    sec(['Wörter hören und aufschreiben', 'Ascoltare e scrivere le parole'],
      ['Sprich das Wort ganz langsam. Welche Laute hörst du nacheinander? Für jeden Laut schreibst du einen Buchstaben (manchmal auch zwei, wie bei „sch“).',
        'Pronuncia la parola molto lentamente. Quali suoni senti uno dopo l’altro? Per ogni suono scrivi una lettera (a volte due o tre, come “sch”).'],
      ['M – a – m – a → Mama\nS – o – f – a → Sofa', 'M – a – m – a → Mama\nS – o – f – a → Sofa']),
    sec(['Besondere Buchstabengruppen', 'Gruppi di lettere speciali'],
      ['Manche Laute schreibt man mit mehreren Buchstaben: sch (Schule), ch (Buch), ei (Eis), au (Haus), eu (Euro), ie (Biene).',
        'Alcuni suoni si scrivono con più lettere: sch (Schule), ch (Buch), ei (Eis, si legge “ai”), au (Haus), eu (Euro, si legge “oi”), ie (Biene, i lunga).']),
    sec(['Nomen schreibt man groß', 'I nomi si scrivono con la maiuscola'],
      ['Im Deutschen schreibt man Namen von Dingen, Tieren und Menschen am Anfang groß: der Hund, die Mama, das Haus.',
        'In tedesco i nomi di cose, animali e persone si scrivono con la lettera maiuscola: der Hund (il cane), die Mama, das Haus (la casa).'])
  ], [
    ['Buchstaben auslassen, weil man zu schnell spricht.', 'Saltare lettere perché si parla troppo in fretta.'],
    ['„ei“ und „ie“ vertauschen.', 'Scambiare “ei” e “ie”.']
  ], [
    term(['Laut', 'Suono'], ['Was man hört.', 'Ciò che si sente.']),
    term(['Buchstabe', 'Lettera'], ['Was man schreibt.', 'Ciò che si scrive.'])
  ]),

  'd1-lesen': theory([
    sec(['Buchstaben verbinden', 'Unire le lettere'],
      ['Beim Lesen ziehst du die Laute zusammen, ohne Pause dazwischen: Mmm-aaa → Ma. So entsteht aus Lauten eine Silbe und aus Silben ein Wort.',
        'Leggendo unisci i suoni senza pause: Mmm-aaa → Ma. Così dai suoni nasce una sillaba e dalle sillabe una parola.'],
      ['L-e-o → Leo\nO-m-a → Oma', 'L-e-o → Leo\nO-m-a → Oma']),
    sec(['Wort und Bild', 'Parola e immagine'],
      ['Nach dem Lesen fragst du dich: Was bedeutet das Wort? Passt es zum Bild? Wenn nicht, lies es noch einmal langsam.',
        'Dopo aver letto chiediti: che cosa vuol dire la parola? Corrisponde all’immagine? Se no, rileggila piano.']),
    sec(['Kurze Sätze lesen', 'Leggere frasi brevi'],
      ['Ein Satz beginnt mit einem großen Buchstaben und endet mit einem Punkt. Lies Wort für Wort und denk am Ende an den ganzen Satz.',
        'Una frase inizia con la lettera maiuscola e finisce con il punto. Leggi parola per parola e alla fine pensa a tutta la frase.'],
      ['Der Hund ist rot. → Ein roter Hund? Lustig!', 'Der Hund ist rot. (Il cane è rosso.) → Un cane rosso? Che buffo!'],
      ['Mit dem Finger unter der Zeile mitfahren hilft.', 'Seguire la riga con il dito aiuta.'])
  ], [
    ['Raten statt lesen: Nur den Anfang lesen und den Rest erfinden.', 'Indovinare invece di leggere: leggere solo l’inizio e inventare il resto.']
  ], [
    term(['Satz', 'Frase'], ['Wörter, die zusammen etwas sagen. Am Ende steht ein Punkt.', 'Parole che insieme dicono qualcosa. Alla fine c’è il punto.'])
  ]),

  'd2-rechtschreibung': theory([
    sec(['Lang oder kurz?', 'Vocale lunga o breve?'],
      ['Hörst du nach einem kurzen Vokal nur einen Mitlaut, wird er oft verdoppelt: Ball, Sonne, Mutter. Bei einem langen i schreibt man meistens ie: Biene, Spiel.',
        'Dopo una vocale breve la consonante spesso si raddoppia: Ball (palla), Sonne (sole). La i lunga si scrive quasi sempre ie: Biene (ape), Spiel (gioco).'],
      ['kurz: Ball, Hütte, Kamm\nlang: Biene, Wiese, Tier', 'breve: Ball, Hütte, Kamm\nlunga: Biene, Wiese, Tier']),
    sec(['ei oder ie?', 'ei o ie?'],
      ['„ei“ spricht man wie „ai“ (Eis, Bein). „ie“ ist ein langes i (Brief, lieb). Merktrick: Der zweite Buchstabe sagt, wie es klingt.',
        '“ei” si pronuncia “ai” (Eis, Bein). “ie” è una i lunga (Brief, lieb). Trucco: la seconda lettera dice come suona.']),
    sec(['Verlängern und ableiten', 'Allungare la parola e cercare parenti'],
      ['Am Wortende klingen b/p, d/t, g/k gleich. Verlängere das Wort, dann hörst du es: Hund → Hunde (d), Zwerg → Zwerge (g). Ä oder e? Suche ein verwandtes Wort mit a: Bäume ← Baum.',
        'In fondo alla parola b/p, d/t, g/k suonano uguali. Allunga la parola e lo senti: Hund → Hunde (d). Ä o e? Cerca una parola parente con la a: Bäume ← Baum.'],
      ['Wald → Wälder (d)\nKälte ← kalt (ä)', 'Wald → Wälder (d)\nKälte ← kalt (ä)'])
  ], [
    ['„Hunt“ statt „Hund“ schreiben, weil man t hört.', 'Scrivere “Hunt” invece di “Hund” perché si sente la t.'],
    ['Doppelkonsonant nach langem Vokal: „Biene“, nicht „Binne“.', 'Raddoppiare dopo una vocale lunga.']
  ], [
    term(['Doppelkonsonant', 'Consonante doppia'], ['Zwei gleiche Mitlaute nach kurzem Vokal: ll, mm, tt.', 'Due consonanti uguali dopo vocale breve.']),
    term(['Wortfamilie', 'Famiglia di parole'], ['Wörter mit gleichem Stamm: fahren, Fahrer, Fahrrad.', 'Parole con la stessa radice.'])
  ]),

  'd2-abc': theory([
    sec(['Das Alphabet', 'L’alfabeto'],
      ['Das deutsche Alphabet hat 26 Buchstaben von A bis Z. Dazu kommen ä, ö, ü und ß.',
        'L’alfabeto tedesco ha 26 lettere dalla A alla Z, più ä, ö, ü e ß. (Quello italiano ne usa 21, più j, k, w, x, y nelle parole straniere.)'],
      ['A B C D E F G H I J K L M N O P Q R S T U V W X Y Z', 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z']),
    sec(['Nach dem ABC ordnen', 'Ordinare in ordine alfabetico'],
      ['Schau auf den ersten Buchstaben. Sind die gleich, entscheidet der zweite, dann der dritte usw.',
        'Guarda la prima lettera. Se è uguale, decide la seconda, poi la terza e così via.'],
      ['Apfel, Ast, Auto\nBaum, Birne, Blume', 'Apfel, Ast, Auto\nBaum, Birne, Blume']),
    sec(['Im Wörterbuch nachschlagen', 'Cercare nel dizionario'],
      ['Wörterbücher sind nach dem ABC geordnet. Oben auf jeder Seite stehen das erste und das letzte Wort der Seite, so findest du schnell die richtige Seite.',
        'I dizionari sono in ordine alfabetico. In alto su ogni pagina ci sono la prima e l’ultima parola: così trovi subito la pagina giusta.'],
      undefined,
      ['Ä wird wie a einsortiert, ö wie o, ü wie u.', 'Ä si ordina come a, ö come o, ü come u.'])
  ], [
    ['Nur den ersten Buchstaben beachten, auch wenn er gleich ist.', 'Guardare solo la prima lettera anche quando è uguale.']
  ], [
    term(['Alphabet', 'Alfabeto'], ['Alle Buchstaben in fester Reihenfolge.', 'Tutte le lettere in un ordine fisso.'])
  ]),

  'd2-nomen': theory([
    sec(['Was sind Nomen?', 'Che cosa sono i nomi?'],
      ['Nomen (Namenwörter) sind Wörter für Menschen, Tiere, Pflanzen, Dinge und auch Gefühle oder Gedanken: Kind, Katze, Baum, Ball, Freude. Im Deutschen schreibt man sie immer groß.',
        'I nomi indicano persone, animali, piante, cose e anche sentimenti o idee: Kind (bambino), Katze (gatto), Baum (albero), Freude (gioia). In tedesco si scrivono sempre con la maiuscola.']),
    sec(['Begleiter: der, die, das', 'Gli articoli: der, die, das'],
      ['Vor einem Nomen kann ein Artikel stehen: der (männlich), die (weiblich), das (sächlich), oder ein, eine. Kannst du „der, die, das“ davorsetzen, ist es ein Nomen.',
        'Davanti al nome può esserci un articolo: der (maschile), die (femminile), das (neutro), oppure ein, eine. Se puoi metterci davanti der, die o das, è un nome.'],
      ['der Tisch, die Lampe, das Fenster', 'der Tisch (il tavolo), die Lampe (la lampada), das Fenster (la finestra)']),
    sec(['Groß oder klein?', 'Maiuscola o minuscola?'],
      ['Groß schreibt man: Nomen, Namen und das erste Wort im Satz. Klein schreibt man Verben (laufen) und Adjektive (schnell).',
        'Con la maiuscola: i nomi, i nomi propri e la prima parola della frase. Con la minuscola: i verbi (laufen, correre) e gli aggettivi (schnell, veloce).'],
      undefined,
      ['Artikelprobe: „der Laufen“? Klingt falsch → laufen wird klein geschrieben.', 'Prova dell’articolo: “der laufen”? Suona male → laufen va minuscolo.'])
  ], [
    ['Gefühle wie Angst oder Mut klein schreiben. Auch sie sind Nomen!', 'Scrivere minuscoli i sentimenti come Angst (paura): anche loro sono nomi!']
  ], [
    term(['Nomen', 'Nome'], ['Namenwort, wird großgeschrieben.', 'Parola che dà il nome a qualcosa.']),
    term(['Artikel', 'Articolo'], ['Begleiter: der, die, das, ein, eine.', 'der, die, das, ein, eine.'])
  ]),

  'd2-lesen': theory([
    sec(['Vor dem Lesen', 'Prima di leggere'],
      ['Schau dir Überschrift und Bilder an. Worum könnte es gehen? Wer etwas erwartet, versteht besser.',
        'Guarda il titolo e le immagini. Di che cosa potrebbe parlare? Chi ha un’idea prima di leggere capisce meglio.']),
    sec(['Beim Lesen: W-Fragen', 'Durante la lettura: le domande'],
      ['Die W-Fragen helfen dir, eine Geschichte zu verstehen: Wer? Wo? Wann? Was passiert? Warum?',
        'Le domande chiave aiutano a capire una storia: Chi? Dove? Quando? Che cosa succede? Perché?'],
      ['„Am Morgen findet Tim im Garten einen kleinen Igel.“\nWer? Tim. Wo? Im Garten. Wann? Am Morgen. Was? Er findet einen Igel.', '“Al mattino Tim trova un piccolo riccio in giardino.”\nChi? Tim. Dove? In giardino. Quando? Al mattino. Che cosa? Trova un riccio.']),
    sec(['Nach dem Lesen', 'Dopo la lettura'],
      ['Erzähle die Geschichte mit eigenen Worten nach. Bei einer Frage suchst du die Stelle im Text, wo die Antwort steht.',
        'Racconta la storia con parole tue. Per rispondere a una domanda cerca nel testo il punto dove c’è la risposta.'],
      undefined,
      ['Die Antwort steht fast immer im Text: zurückblättern ist erlaubt!', 'La risposta è quasi sempre nel testo: tornare indietro a rileggere si può!'])
  ], [
    ['Aus dem Gedächtnis antworten, ohne im Text nachzusehen.', 'Rispondere a memoria senza controllare nel testo.']
  ], [
    term(['Überschrift', 'Titolo'], ['Name des Textes, steht oben.', 'Il nome del testo, sta in alto.'])
  ]),

  'd3-wortarten': theory([
    sec(['Nomen', 'Nomi'],
      ['Nomen benennen Menschen, Tiere, Dinge und Ideen. Sie werden großgeschrieben und haben einen Artikel.',
        'I nomi indicano persone, animali, cose e idee. In tedesco si scrivono con la maiuscola e hanno un articolo.'],
      ['der Lehrer, die Katze, das Glück', 'der Lehrer (l’insegnante), die Katze (il gatto), das Glück (la fortuna)']),
    sec(['Verben', 'Verbi'],
      ['Verben (Tunwörter) sagen, was jemand tut oder was passiert. Sie verändern sich je nach Person: ich spiele, du spielst, er spielt. Die Grundform (Infinitiv) endet meist auf -en.',
        'I verbi dicono che cosa fa qualcuno o che cosa succede. Cambiano secondo la persona: ich spiele, du spielst, er spielt. L’infinito tedesco finisce di solito in -en.'],
      ['laufen, essen, schlafen, regnen', 'laufen (correre), essen (mangiare), schlafen (dormire), regnen (piovere)']),
    sec(['Adjektive', 'Aggettivi'],
      ['Adjektive (Wiewörter) beschreiben, wie etwas ist. Man kann sie steigern: groß – größer – am größten.',
        'Gli aggettivi descrivono com’è qualcosa. Si possono graduare: groß (grande) – größer (più grande) – am größten (il più grande).'],
      ['Der schnelle Hund ist schneller als die Katze.', 'Der schnelle Hund ist schneller als die Katze. (Il cane veloce è più veloce del gatto.)'],
      ['Frage-Trick: Wer oder was? → Nomen. Was tut jemand? → Verb. Wie ist etwas? → Adjektiv.', 'Trucco: Chi o che cosa? → nome. Che cosa fa? → verbo. Com’è? → aggettivo.'])
  ], [
    ['Ein Adjektiv großschreiben, weil es vor einem Nomen steht: „der Schnelle Hund“ ist falsch.', 'Scrivere maiuscolo l’aggettivo davanti al nome: “der Schnelle Hund” è sbagliato.']
  ], [
    term(['Verb', 'Verbo'], ['Tunwort.', 'Parola che indica un’azione.']),
    term(['Adjektiv', 'Aggettivo'], ['Wiewort.', 'Parola che descrive una qualità.']),
    term(['Infinitiv', 'Infinito'], ['Grundform des Verbs: spielen.', 'Forma base del verbo: spielen.'])
  ]),

  'd3-mehrzahl': theory([
    sec(['Einzahl und Mehrzahl', 'Singolare e plurale'],
      ['Ein Ding: Einzahl (Singular). Mehrere Dinge: Mehrzahl (Plural). In der Mehrzahl heißt der Artikel immer „die“.',
        'Una cosa: singolare. Più cose: plurale. Al plurale l’articolo tedesco è sempre “die”.'],
      ['der Hund → die Hunde\ndas Kind → die Kinder', 'der Hund → die Hunde (i cani)\ndas Kind → die Kinder (i bambini)']),
    sec(['Viele Endungen', 'Tante desinenze'],
      ['Im Deutschen gibt es verschiedene Pluralendungen: -e (Tisch → Tische), -er (Bild → Bilder), -n/-en (Blume → Blumen), -s (Auto → Autos) oder gar keine (Lehrer → Lehrer). Oft kommt ein Umlaut dazu: Baum → Bäume.',
        'In tedesco ci sono vari plurali: -e (Tisch → Tische), -er (Bild → Bilder), -n/-en (Blume → Blumen), -s (Auto → Autos) o nessuna desinenza (Lehrer → Lehrer). Spesso si aggiunge la dieresi: Baum → Bäume.']),
    sec(['Mehrzahl hilft beim Schreiben', 'Il plurale aiuta a scrivere'],
      ['Mit der Mehrzahl hörst du den Endlaut deutlicher: Rad → Räder (d!), Berg → Berge (g!). Und ein ä in der Mehrzahl zeigt, dass es von a kommt.',
        'Con il plurale senti meglio l’ultima consonante: Rad → Räder (d!), Berg → Berge (g!). E la ä al plurale mostra che deriva da una a.'],
      undefined,
      ['Lerne Nomen immer mit Artikel und Mehrzahl: der Apfel, die Äpfel.', 'Impara i nomi sempre con articolo e plurale: der Apfel, die Äpfel.'])
  ], [
    ['Überall -s anhängen wie im Englischen: „die Hunds“.', 'Aggiungere sempre -s come in inglese: “die Hunds”.']
  ], [
    term(['Singular', 'Singolare'], ['Einzahl.', 'Una sola cosa.']),
    term(['Plural', 'Plurale'], ['Mehrzahl.', 'Più cose.']),
    term(['Umlaut', 'Dieresi'], ['ä, ö, ü.', 'ä, ö, ü.'])
  ]),

  'd3-texte': theory([
    sec(['Genau lesen', 'Leggere con precisione'],
      ['Bei Aufgaben zu Texten kommt es auf Details an. Lies die Frage genau: Wird nach einer Person, einem Ort, einer Zeit oder einem Grund gefragt?',
        'Nelle domande sul testo contano i dettagli. Leggi bene la domanda: chiede una persona, un luogo, un tempo o un motivo?']),
    sec(['Schlüsselwörter markieren', 'Sottolineare le parole chiave'],
      ['Unterstreiche wichtige Wörter: Namen, Zahlen, Orte. Bei der Frage suchst du dann im Text nach diesen Wörtern.',
        'Sottolinea le parole importanti: nomi, numeri, luoghi. Poi cerca nel testo le parole della domanda.']),
    sec(['Zwischen den Zeilen lesen', 'Leggere tra le righe'],
      ['Nicht alles steht wörtlich im Text. Manchmal musst du schließen: „Mia zitterte und zog die Mütze tiefer.“ → Ihr ist kalt.',
        'Non tutto è scritto in modo diretto. A volte devi dedurre: “Mia tremava e si tirò giù il berretto.” → Ha freddo.'],
      undefined,
      ['Prüfe jede Antwortmöglichkeit am Text: Steht das wirklich so da?', 'Controlla ogni risposta sul testo: c’è scritto davvero così?'])
  ], [
    ['Eine Antwort wählen, die zwar stimmt, aber nicht zur Frage passt.', 'Scegliere una risposta vera ma che non risponde alla domanda.']
  ], [
    term(['Schlüsselwort', 'Parola chiave'], ['Ein besonders wichtiges Wort.', 'Una parola particolarmente importante.'])
  ]),

  'd4-satzglieder': theory([
    sec(['Die Umstellprobe', 'La prova dello spostamento'],
      ['Satzglieder sind Wörter oder Wortgruppen, die beim Umstellen zusammenbleiben.',
        'I componenti della frase sono parole o gruppi di parole che restano uniti quando cambi l’ordine.'],
      ['Der kleine Hund | bellt | im Garten.\nIm Garten | bellt | der kleine Hund.', 'Der kleine Hund | bellt | im Garten.\nIm Garten | bellt | der kleine Hund.\n(Il cagnolino abbaia in giardino.)']),
    sec(['Subjekt und Prädikat', 'Soggetto e predicato'],
      ['Das Prädikat ist das Verb: Was tut jemand? Das Subjekt findest du mit der Frage „Wer oder was?“. Im Aussagesatz steht das Prädikat immer an zweiter Stelle.',
        'Il predicato è il verbo: che cosa fa? Il soggetto si trova con la domanda “chi o che cosa?”. Nella frase tedesca il verbo sta sempre al secondo posto.'],
      ['Lena liest ein Buch.\nWer liest? → Lena (Subjekt)\nWas tut Lena? → liest (Prädikat)', 'Lena liest ein Buch. (Lena legge un libro.)\nChi legge? → Lena (soggetto)\nChe cosa fa? → liest (predicato)']),
    sec(['Objekte', 'I complementi oggetto'],
      ['Das Akkusativobjekt findest du mit „Wen oder was?“, das Dativobjekt mit „Wem?“.',
        'L’oggetto in accusativo si trova con “chi o che cosa?” (complemento oggetto), quello in dativo con “a chi?” (complemento di termine).'],
      ['Tom schenkt seiner Oma Blumen.\nWem? → seiner Oma (Dativ)\nWen oder was? → Blumen (Akkusativ)', 'Tom schenkt seiner Oma Blumen. (Tom regala fiori alla nonna.)\nA chi? → seiner Oma (dativo)\nChe cosa? → Blumen (accusativo)'])
  ], [
    ['Das Subjekt immer am Satzanfang suchen. Es kann auch hinter dem Verb stehen.', 'Cercare il soggetto sempre all’inizio: può stare anche dopo il verbo.']
  ], [
    term(['Subjekt', 'Soggetto'], ['Wer oder was?', 'Chi o che cosa compie l’azione?']),
    term(['Prädikat', 'Predicato'], ['Das Verb im Satz.', 'Il verbo della frase.'])
  ]),

  'd4-zeitformen': theory([
    sec(['Gegenwart (Präsens)', 'Presente'],
      ['Das Präsens beschreibt, was jetzt passiert oder immer gilt.',
        'Il presente descrive ciò che succede adesso o che vale sempre.'],
      ['Ich spiele. Die Sonne scheint.', 'Ich spiele. (Gioco.) Die Sonne scheint. (Il sole splende.)']),
    sec(['Vergangenheit: Präteritum und Perfekt', 'Passato: Präteritum e Perfekt'],
      ['Das Präteritum benutzt man vor allem beim Schreiben (Geschichten). Das Perfekt benutzt man beim Erzählen. Es besteht aus „haben“ oder „sein“ und dem Partizip.',
        'Il Präteritum si usa soprattutto nello scritto (racconti), simile al passato remoto. Il Perfekt si usa parlando, come il passato prossimo: si forma con haben o sein e il participio.'],
      ['Präteritum: ich spielte, ich lief\nPerfekt: ich habe gespielt, ich bin gelaufen', 'Präteritum: ich spielte (giocai), ich lief (corsi)\nPerfekt: ich habe gespielt (ho giocato), ich bin gelaufen (sono corso)'],
      ['Verben der Bewegung bilden das Perfekt meist mit „sein“: ich bin gegangen.', 'I verbi di movimento usano di solito sein: ich bin gegangen (sono andato).']),
    sec(['Zukunft (Futur)', 'Futuro'],
      ['Das Futur bildet man mit „werden“ und dem Infinitiv. Oft genügt aber das Präsens mit einer Zeitangabe.',
        'Il futuro si forma con werden e l’infinito. Spesso però basta il presente con un’indicazione di tempo.'],
      ['Ich werde morgen spielen. / Morgen spiele ich.', 'Ich werde morgen spielen. / Morgen spiele ich. (Domani giocherò.)'])
  ], [
    ['Starke Verben regelmäßig bilden: „ich gehte“ statt „ich ging“.', 'Coniugare i verbi forti come regolari: “ich gehte” invece di “ich ging”.']
  ], [
    term(['Präsens', 'Presente'], ['Gegenwart.', 'Tempo presente.']),
    term(['Partizip', 'Participio'], ['Form wie „gespielt“, „gelaufen“.', 'Forma come gespielt, gelaufen.'])
  ]),

  'd4-texte': theory([
    sec(['Was ist ein Sachtext?', 'Che cos’è un testo informativo?'],
      ['Sachtexte informieren über echte Dinge: Tiere, Länder, Technik. Sie haben oft Überschriften, Absätze, Bilder, Tabellen.',
        'I testi informativi spiegano cose reali: animali, Paesi, tecnica. Hanno spesso titoli, paragrafi, immagini, tabelle.']),
    sec(['Die Fünf-Schritt-Lesemethode', 'Il metodo dei cinque passi'],
      ['1. Überfliegen: Worum geht es? 2. Fragen stellen. 3. Genau lesen. 4. Wichtiges markieren. 5. Zusammenfassen in eigenen Worten.',
        '1. Leggi velocemente: di che cosa parla? 2. Fatti delle domande. 3. Leggi con attenzione. 4. Sottolinea l’importante. 5. Riassumi con parole tue.']),
    sec(['Absätze und Hauptgedanken', 'Paragrafi e idee principali'],
      ['Jeder Absatz hat meist einen Hauptgedanken. Schreibe zu jedem Absatz eine kurze Zwischenüberschrift: So entsteht ein Stichwortzettel.',
        'Ogni paragrafo ha di solito un’idea principale. Scrivi per ogni paragrafo un titoletto: così ottieni una scaletta.'],
      undefined,
      ['Unbekannte Wörter aus dem Zusammenhang erschließen oder nachschlagen.', 'Le parole sconosciute capiscile dal contesto o cercale nel dizionario.'])
  ], [
    ['Alles unterstreichen: Dann ist nichts mehr wichtig.', 'Sottolineare tutto: così niente è più importante.']
  ], [
    term(['Absatz', 'Paragrafo'], ['Abschnitt eines Textes.', 'Parte di un testo.']),
    term(['Sachtext', 'Testo informativo'], ['Text mit Informationen über die Wirklichkeit.', 'Testo che informa sulla realtà.'])
  ]),

  // ───────── Deutsch Sekundarstufe ─────────
  'd-wortarten-sek': theory([
    sec(['Veränderbare Wortarten', 'Parti variabili del discorso'],
      ['Nomen, Artikel, Pronomen und Adjektive werden dekliniert (nach Kasus, Numerus, Genus). Verben werden konjugiert (nach Person, Numerus, Tempus, Modus).',
        'Nomi, articoli, pronomi e aggettivi si declinano (caso, numero, genere). I verbi si coniugano (persona, numero, tempo, modo).'],
      ['der Hund – des Hundes – dem Hund – den Hund', 'der Hund – des Hundes – dem Hund – den Hund (nominativo, genitivo, dativo, accusativo)']),
    sec(['Pronomen und Präpositionen', 'Pronomi e preposizioni'],
      ['Pronomen ersetzen oder begleiten Nomen: Personalpronomen (er), Possessivpronomen (sein), Demonstrativpronomen (dieser), Relativpronomen (der, welcher). Präpositionen bestimmen den Fall: mit + Dativ, für + Akkusativ, in + Dativ (wo?) oder Akkusativ (wohin?).',
        'I pronomi sostituiscono o accompagnano i nomi: personali (er), possessivi (sein), dimostrativi (dieser), relativi (der, welcher). Le preposizioni reggono un caso: mit + dativo, für + accusativo, in + dativo (stato) o accusativo (moto).'],
      ['Ich bin in der Schule (wo? Dativ). Ich gehe in die Schule (wohin? Akkusativ).', 'Ich bin in der Schule (stato: dativo). Ich gehe in die Schule (moto: accusativo).']),
    sec(['Die sechs Zeitformen', 'I sei tempi'],
      ['Präsens (ich lese), Präteritum (ich las), Perfekt (ich habe gelesen), Plusquamperfekt (ich hatte gelesen), Futur I (ich werde lesen), Futur II (ich werde gelesen haben). Das Plusquamperfekt drückt Vorzeitigkeit in der Vergangenheit aus.',
        'Präsens (leggo), Präteritum (lessi), Perfekt (ho letto), Plusquamperfekt (avevo letto), Futur I (leggerò), Futur II (avrò letto). Il Plusquamperfekt indica un’azione anteriore nel passato.'],
      ['Nachdem er gegessen hatte, ging er los.', 'Nachdem er gegessen hatte, ging er los. (Dopo che ebbe mangiato, partì.)'])
  ], [
    ['Wechselpräpositionen falsch: „Ich lege das Buch auf dem Tisch“ → richtig: auf den Tisch (wohin?).', 'Sbagliare il caso con le preposizioni: “auf dem Tisch” per il moto → corretto auf den Tisch.']
  ], [
    term(['deklinieren', 'declinare'], ['Nomen/Adjektive nach Fällen verändern.', 'Cambiare nomi e aggettivi secondo i casi.']),
    term(['konjugieren', 'coniugare'], ['Verben nach Person und Zeit verändern.', 'Cambiare i verbi secondo persona e tempo.'])
  ]),

  'd-satzglieder': theory([
    sec(['Die vier Fälle', 'I quattro casi'],
      ['Nominativ (Wer/Was?), Genitiv (Wessen?), Dativ (Wem?), Akkusativ (Wen/Was?). Der Fall eines Satzglieds hängt vom Verb oder von einer Präposition ab.',
        'Nominativo (chi/che cosa? soggetto), genitivo (di chi?), dativo (a chi?), accusativo (chi/che cosa? oggetto). Il caso dipende dal verbo o dalla preposizione.'],
      ['Der Vater (N) gibt dem Kind (D) das Buch (A) des Lehrers (G).', 'Der Vater (N) gibt dem Kind (D) das Buch (A) des Lehrers (G).\n(Il padre dà al bambino il libro dell’insegnante.)']),
    sec(['Adverbiale Bestimmungen', 'Complementi avverbiali'],
      ['Sie geben Umstände an: Zeit (Wann?), Ort (Wo? Wohin?), Art und Weise (Wie?), Grund (Warum?).',
        'Indicano le circostanze: tempo (quando?), luogo (dove?), modo (come?), causa (perché?).'],
      ['Gestern (Zeit) spielte Ali wegen des Regens (Grund) fröhlich (Art) in der Halle (Ort).', 'Gestern (tempo) spielte Ali wegen des Regens (causa) fröhlich (modo) in der Halle (luogo).']),
    sec(['Attribute', 'Attributi'],
      ['Ein Attribut ist kein eigenes Satzglied, sondern ein Teil davon: Es beschreibt ein Nomen genauer und bleibt beim Umstellen dabei.',
        'L’attributo non è un componente autonomo ma fa parte di un altro: specifica un nome e si sposta insieme a lui.'],
      ['das rote Auto meines Bruders → rot (Adjektivattribut), meines Bruders (Genitivattribut)', 'das rote Auto meines Bruders → rot (attributo), meines Bruders (complemento di specificazione)'])
  ], [
    ['Dativ und Akkusativ verwechseln: „Ich helfe dich“ → richtig „Ich helfe dir“.', 'Confondere dativo e accusativo: “Ich helfe dich” → corretto “Ich helfe dir”.']
  ], [
    term(['Kasus', 'Caso'], ['Fall eines Nomens.', 'La forma del nome secondo la funzione.']),
    term(['Adverbial', 'Complemento avverbiale'], ['Satzglied für Zeit, Ort, Art, Grund.', 'Indica tempo, luogo, modo, causa.'])
  ]),

  'd-rechtschreibung-sek': theory([
    sec(['das oder dass?', 'das o dass?'],
      ['„das“ ist Artikel oder Pronomen und lässt sich durch „dieses“, „jenes“ oder „welches“ ersetzen. „dass“ ist eine Konjunktion, die einen Nebensatz einleitet.',
        '“das” è articolo o pronome e si può sostituire con “dieses” o “welches”. “dass” è una congiunzione (“che”) che introduce una subordinata.'],
      ['Das Buch, das (welches) ich lese, ist spannend.\nIch hoffe, dass du kommst.', 'Das Buch, das (welches) ich lese, ist spannend.\nIch hoffe, dass du kommst. (Spero che tu venga.)']),
    sec(['Großschreibung bei Nominalisierungen', 'Maiuscole nelle nominalizzazioni'],
      ['Verben und Adjektive werden zu Nomen, wenn ein Artikel, eine Präposition mit Artikel oder Wörter wie „etwas, nichts, viel“ davorstehen.',
        'Verbi e aggettivi diventano nomi (e si scrivono maiuscoli) se hanno davanti un articolo, una preposizione articolata o parole come etwas, nichts, viel.'],
      ['das Lesen, beim Laufen, etwas Schönes, nichts Neues', 'das Lesen, beim Laufen, etwas Schönes, nichts Neues']),
    sec(['Kommaregeln', 'Le virgole'],
      ['Komma bei Aufzählungen (ohne und/oder), zwischen Haupt- und Nebensatz, vor „aber, sondern, doch“, bei Einschüben und Appositionen.',
        'Virgola negli elenchi (non prima di und/oder), tra principale e subordinata (sempre, anche prima di dass e weil!), prima di aber, sondern, doch, negli incisi e nelle apposizioni.'],
      ['Ich bleibe zu Hause, weil ich krank bin.\nMein Hund, ein Dackel, schläft.', 'Ich bleibe zu Hause, weil ich krank bin.\nMein Hund, ein Dackel, schläft.'],
      ['Jeder Nebensatz wird durch Komma abgetrennt: Suche das konjugierte Verb am Ende!', 'Ogni subordinata si separa con la virgola: cerca il verbo coniugato in fondo!'])
  ], [
    ['„dass“ nach Komma automatisch schreiben, auch bei Relativsätzen.', 'Scrivere sempre “dass” dopo la virgola, anche nelle relative.']
  ], [
    term(['Konjunktion', 'Congiunzione'], ['Bindewort wie dass, weil, obwohl.', 'Parola che collega frasi.']),
    term(['Nominalisierung', 'Nominalizzazione'], ['Ein Verb oder Adjektiv wird als Nomen gebraucht.', 'Un verbo o aggettivo usato come nome.'])
  ]),

  'd-konjunktiv': theory([
    sec(['Konjunktiv I: indirekte Rede', 'Congiuntivo I: discorso indiretto'],
      ['Mit dem Konjunktiv I gibst du wieder, was jemand gesagt hat, ohne dich festzulegen. Er wird vom Präsensstamm gebildet: er sage, sie habe, es sei.',
        'Con il Konjunktiv I riporti ciò che qualcuno ha detto, senza dire se è vero. Si forma dalla radice del presente: er sage, sie habe, es sei.'],
      ['Direkt: Tim sagt: „Ich bin müde.“\nIndirekt: Tim sagt, er sei müde.', 'Diretto: Tim sagt: „Ich bin müde.“ (Sono stanco.)\nIndiretto: Tim sagt, er sei müde. (Tim dice di essere stanco.)']),
    sec(['Ersatzform', 'Forma sostitutiva'],
      ['Ist der Konjunktiv I gleich dem Indikativ (oft in der Mehrzahl), nimmt man den Konjunktiv II oder „würde + Infinitiv“.',
        'Se il Konjunktiv I coincide con l’indicativo (spesso al plurale), si usa il Konjunktiv II o “würde + infinito”.'],
      ['Sie sagen, sie haben (= Indikativ) → sie hätten Zeit.', 'Sie sagen, sie haben (= indicativo) → sie hätten Zeit.']),
    sec(['Konjunktiv II: Wünsche und Irreales', 'Congiuntivo II: desideri e irrealtà'],
      ['Der Konjunktiv II drückt Unwirkliches, Wünsche und höfliche Bitten aus. Er wird vom Präteritumstamm gebildet, oft mit Umlaut: hätte, wäre, käme. Bei vielen Verben nutzt man „würde“.',
        'Il Konjunktiv II esprime irrealtà, desideri e richieste gentili (come il condizionale e il congiuntivo italiano). Si forma dal Präteritum, spesso con la dieresi: hätte, wäre, käme. Spesso si usa “würde”.'],
      ['Wenn ich Zeit hätte, würde ich kommen.\nKönnten Sie mir helfen?', 'Wenn ich Zeit hätte, würde ich kommen. (Se avessi tempo, verrei.)\nKönnten Sie mir helfen? (Potrebbe aiutarmi?)'])
  ], [
    ['In der indirekten Rede die Pronomen nicht anpassen („ich“ → „er“).', 'Nel discorso indiretto non cambiare i pronomi (“ich” → “er”).'],
    ['„würde“ in beiden Satzteilen: „Wenn ich Zeit haben würde, würde …“ ist schlechter Stil.', '“würde” in entrambe le frasi è stile poco elegante.']
  ], [
    term(['indirekte Rede', 'Discorso indiretto'], ['Wiedergabe fremder Aussagen.', 'Riportare le parole di altri.']),
    term(['Irrealis', 'Periodo ipotetico dell’irrealtà'], ['Nicht wirkliche Bedingung.', 'Condizione non reale.'])
  ]),

  'd-texte': theory([
    sec(['Inhaltsangabe', 'Il riassunto'],
      ['Eine Inhaltsangabe informiert sachlich und knapp: Einleitung (Titel, Autor, Textsorte, Thema), Hauptteil (Handlung in logischer Reihenfolge), evtl. Schluss. Zeitform: Präsens. Keine wörtliche Rede, keine Spannung, keine eigene Meinung.',
        'Il riassunto (Inhaltsangabe) informa in modo oggettivo e breve: introduzione (titolo, autore, genere, tema), parte centrale (fatti in ordine logico), eventuale conclusione. Tempo: presente. Niente discorso diretto né opinioni personali.']),
    sec(['Erörterung', 'Il testo argomentativo'],
      ['In einer Erörterung wägst du Argumente ab. Ein Argument hat drei Teile: Behauptung, Begründung, Beispiel. Linear: eine Seite; dialektisch: Pro und Contra, am Ende ein eigenes Urteil.',
        'Nel testo argomentativo (Erörterung) valuti delle argomentazioni. Un argomento ha tre parti: tesi, motivazione, esempio. Lineare: una sola posizione; dialettico: pro e contro, con giudizio finale.'],
      ['Behauptung: Handys sollten in Pausen erlaubt sein.\nBegründung: Schüler können sich so mit Eltern absprechen.\nBeispiel: Bei Busausfall können sie schnell Bescheid geben.', 'Tesi: i cellulari dovrebbero essere permessi durante l’intervallo.\nMotivazione: gli studenti possono organizzarsi con i genitori.\nEsempio: se salta l’autobus avvisano subito.']),
    sec(['Erzähler und Perspektive', 'Narratore e punto di vista'],
      ['Ich-Erzähler: erzählt als Figur. Er-/Sie-Erzähler: außerhalb. Auktorial: weiß alles, kommentiert. Personal: sieht die Welt durch eine Figur. Neutral: berichtet nur von außen.',
        'Narratore interno (in prima persona) o esterno (in terza). Onnisciente: sa tutto e commenta. Focalizzazione interna: vede attraverso un personaggio. Esterna: racconta solo ciò che si vede.'])
  ], [
    ['In der Inhaltsangabe im Präteritum erzählen oder Spannung aufbauen.', 'Nel riassunto usare il passato o creare suspense.'],
    ['Argumente ohne Begründung und Beispiel aufzählen.', 'Elencare argomenti senza motivazione ed esempio.']
  ], [
    term(['These', 'Tesi'], ['Behauptung, die man begründet.', 'Affermazione da dimostrare.']),
    term(['auktorialer Erzähler', 'Narratore onnisciente'], ['Allwissender Erzähler.', 'Narratore che sa tutto.'])
  ]),

  'd-stilmittel': theory([
    sec(['Bildliche Sprache', 'Linguaggio figurato'],
      ['Metapher: Wort in übertragener Bedeutung („Das Leben ist eine Reise“). Vergleich: mit „wie“ („stark wie ein Bär“). Personifikation: Dinge handeln wie Menschen („Die Sonne lacht“).',
        'Metafora: parola in senso figurato (“la vita è un viaggio”). Similitudine: con “come” (“forte come un orso”). Personificazione: le cose agiscono come persone (“il sole ride”).']),
    sec(['Klang und Wiederholung', 'Suono e ripetizione'],
      ['Anapher: Wiederholung am Versanfang. Alliteration: gleicher Anlaut („Milch macht müde Männer munter“). Klimax: Steigerung („Ich kam, sah, siegte“). Rhetorische Frage: Frage ohne erwartete Antwort.',
        'Anafora: ripetizione a inizio verso. Allitterazione: ripetizione di suoni iniziali. Climax: progressione (“venni, vidi, vinsi”). Domanda retorica: domanda che non aspetta risposta.']),
    sec(['Lyrik: Vers, Reim, Metrum', 'Poesia: verso, rima, metro'],
      ['Ein Gedicht besteht aus Versen und Strophen. Reimschemata: Paarreim (aabb), Kreuzreim (abab), umarmender Reim (abba). Metrum: Jambus (x X), Trochäus (X x), Daktylus (X x x), Anapäst (x x X).',
        'Una poesia è fatta di versi e strofe. Schemi di rima: baciata (AABB), alternata (ABAB), incrociata (ABBA). Il metro tedesco si basa sugli accenti: giambo (x X), trocheo (X x), dattilo (X x x), anapesto (x x X).'],
      undefined,
      ['Bei der Analyse nicht nur benennen, sondern die Wirkung erklären!', 'Nell’analisi non basta nominare la figura: spiega l’effetto!'])
  ], [
    ['Metapher und Vergleich verwechseln: Steht „wie“ dabei, ist es ein Vergleich.', 'Confondere metafora e similitudine: se c’è “come” è una similitudine.']
  ], [
    term(['Metapher', 'Metafora'], ['Bildhafter Ausdruck ohne „wie“.', 'Espressione figurata senza “come”.']),
    term(['Strophe', 'Strofa'], ['Gruppe von Versen.', 'Gruppo di versi.'])
  ]),

  'd-epochen': theory([
    sec(['Barock bis Klassik', 'Dal Barocco al Classicismo'],
      ['Barock (ca. 1600–1720): Dreißigjähriger Krieg, Vergänglichkeit (vanitas), carpe diem (Gryphius). Aufklärung (ca. 1720–1800): Vernunft, Toleranz (Lessing: „Nathan der Weise“). Sturm und Drang (ca. 1767–1785): Gefühl, Genie, Rebellion (junger Goethe, Schiller). Weimarer Klassik (ca. 1786–1805): Harmonie, Humanität (Goethe: „Faust“, Schiller).',
        'Barocco (1600–1720 ca.): guerra dei Trent’anni, caducità (vanitas), carpe diem (Gryphius). Illuminismo (1720–1800): ragione, tolleranza (Lessing). Sturm und Drang (1767–1785): sentimento, genio, ribellione (giovane Goethe, Schiller). Classicismo di Weimar (1786–1805): armonia, umanità (Goethe, “Faust”).']),
    sec(['Romantik bis Realismus', 'Dal Romanticismo al Realismo'],
      ['Romantik (ca. 1795–1840): Sehnsucht, Natur, Nacht, Märchen (Eichendorff, Novalis, Brüder Grimm). Vormärz (1830–1848): politische Literatur (Heine, Büchner). Realismus (1848–1890): Alltag, Bürgertum (Fontane: „Effi Briest“). Naturalismus (1880–1900): soziale Not (Hauptmann).',
        'Romanticismo (1795–1840): nostalgia, natura, notte, fiabe (Eichendorff, Novalis, fratelli Grimm). Vormärz (1830–1848): letteratura politica (Heine, Büchner). Realismo (1848–1890): vita borghese (Fontane). Naturalismo (1880–1900): miseria sociale (Hauptmann).']),
    sec(['Moderne und Nachkriegszeit', 'Modernità e dopoguerra'],
      ['Expressionismus (1910–1925): Großstadt, Krieg, Ich-Zerfall (Trakl, Heym). Weimarer Republik/Neue Sachlichkeit (Kästner). Exilliteratur (Brecht, Thomas Mann). Nachkriegszeit/Trümmerliteratur (Borchert, Böll), Gruppe 47.',
        'Espressionismo (1910–1925): metropoli, guerra, crisi dell’io (Trakl, Heym). Nuova Oggettività (Kästner). Letteratura dell’esilio (Brecht, Thomas Mann). Dopoguerra e “letteratura delle macerie” (Borchert, Böll), Gruppo 47.'],
      undefined,
      ['Epochen helfen beim Einordnen, aber Grenzen sind fließend. Zu einem Text immer: Zeit, Thema, typische Merkmale.', 'Le epoche aiutano a collocare un testo, ma i confini sono sfumati. Considera sempre: periodo, tema, caratteristiche tipiche.'])
  ], [
    ['Goethe nur einer Epoche zuordnen: Er schrieb im Sturm und Drang und in der Klassik.', 'Collocare Goethe in una sola epoca: scrisse nello Sturm und Drang e nel Classicismo.']
  ], [
    term(['Epoche', 'Epoca'], ['Zeitabschnitt mit typischen Merkmalen.', 'Periodo con caratteristiche comuni.']),
    term(['Vanitas', 'Vanitas'], ['Barockes Motiv der Vergänglichkeit.', 'Tema barocco della caducità.'])
  ]),

  // ───────── Italiano ─────────
  'it1-sillabe': theory([
    sec(['Silben', 'Che cos’è una sillaba'],
      ['Eine Silbe ist ein Teil eines Wortes, den man in einem Atemzug ausspricht. Im Italienischen enden viele Silben auf einen Vokal: ca-sa, ma-re.',
        'La sillaba è un pezzetto di parola che si pronuncia con una sola emissione di voce. In italiano molte sillabe finiscono con una vocale: ca-sa, ma-re.'],
      ['gat-to (2), pa-ta-ta (3), far-fal-la (3)', 'gat-to (2), pa-ta-ta (3), far-fal-la (3)']),
    sec(['Silbentrennung', 'Come si dividono le parole'],
      ['Doppelte Konsonanten werden getrennt (gat-to). Ein Konsonant zwischen Vokalen geht zur nächsten Silbe (ca-ne). Gruppen wie „gn, gl, ch, sc“ bleiben zusammen.',
        'Le doppie si dividono (gat-to, pal-la). Una consonante tra due vocali va con la vocale che segue (ca-ne). I gruppi gn, gli, ch, gh, sc restano insieme (ba-gno, fi-glio).'],
      ['bot-ti-glia, ca-sco, ba-gno', 'bot-ti-glia, ca-sco, ba-gno'],
      ['Klatsche bei jeder Silbe in die Hände.', 'Batti le mani a ogni sillaba.']),
    sec(['Wörter aus Silben bauen', 'Comporre parole con le sillabe'],
      ['Wenn du Silben in der richtigen Reihenfolge zusammensetzt, entsteht ein Wort. Lies langsam und höre, ob es Sinn ergibt.',
        'Se unisci le sillabe nell’ordine giusto ottieni una parola. Leggi piano e ascolta se ha senso.'],
      ['LU + NA → LUNA\nTA + VO + LO → TAVOLO', 'LU + NA → LUNA\nTA + VO + LO → TAVOLO'])
  ], [
    ['Doppelte Konsonanten nicht trennen: „ga-tto“ ist falsch.', 'Non dividere le doppie: “ga-tto” è sbagliato, si scrive gat-to.']
  ], [
    term(['Silbe', 'Sillaba'], ['Teil eines Wortes.', 'Parte di parola pronunciata insieme.'])
  ]),

  'it1-lettere': theory([
    sec(['Vokale und Konsonanten', 'Vocali e consonanti'],
      ['Das italienische Alphabet hat 21 Buchstaben: 5 Vokale (a, e, i, o, u) und 16 Konsonanten. J, K, W, X, Y kommen nur in Fremdwörtern vor.',
        'L’alfabeto italiano ha 21 lettere: 5 vocali (a, e, i, o, u) e 16 consonanti. J, K, W, X, Y si usano solo nelle parole straniere.']),
    sec(['Harte und weiche Laute', 'Suoni duri e dolci'],
      ['C und G klingen vor a, o, u hart (casa, gatto), vor e, i weich (cena, gelato). Für einen harten Laut vor e, i braucht man ein H: che, chi, ghe, ghi.',
        'C e G hanno suono duro davanti ad a, o, u (casa, gatto) e dolce davanti a e, i (cena, gelato). Per il suono duro davanti a e, i serve la H: che, chi, ghe, ghi.'],
      ['ca – che – chi – co – cu\nga – ghe – ghi – go – gu', 'ca – che – chi – co – cu\nga – ghe – ghi – go – gu']),
    sec(['Wörter schreiben', 'Scrivere le parole'],
      ['Im Italienischen schreibt man fast genau so, wie man spricht. Sprich langsam und schreibe jeden Laut.',
        'In italiano si scrive quasi come si parla. Pronuncia lentamente e scrivi ogni suono.'],
      undefined,
      ['Hör genau auf doppelte Konsonanten: pala ≠ palla.', 'Ascolta bene le doppie: pala ≠ palla.'])
  ], [
    ['„cane“ mit k schreiben.', 'Scrivere “kane” con la k.'],
    ['„chiesa“ ohne h schreiben: „ciesa“ klingt weich.', 'Scrivere “ciesa” senza h: suonerebbe dolce.']
  ], [
    term(['Vokal', 'Vocale'], ['a, e, i, o, u', 'a, e, i, o, u'])
  ]),

  'it2-ortografia': theory([
    sec(['Doppelte Konsonanten', 'Le doppie'],
      ['Doppelte Konsonanten spricht man länger und kräftiger aus. Sie können die Bedeutung ändern: caro (lieb/teuer) – carro (Wagen).',
        'Le consonanti doppie si pronunciano più lunghe e forti. Possono cambiare il significato: caro – carro, pena – penna, nono – nonno.'],
      undefined,
      ['Nach -zione steht nur ein z: stazione, lezione.', 'Davanti a -zione la z è sempre singola: stazione, lezione.']),
    sec(['CHI/CHE, GHI/GHE, GN, GLI, SC', 'CHI/CHE, GHI/GHE, GN, GLI, SC'],
      ['GN ohne i: bagno, sogno (Ausnahme: compagnia, wo i betont ist). GLI vor Vokal: figlio, aglio. SCE/SCI für den weichen Laut: scena, sciarpa; SCHE/SCHI für den harten: scherzo, schiena.',
        'GN senza i: bagno, sogno (ma compagnia, dove la i si sente). GLI davanti a vocale: figlio, aglio. SCE/SCI per il suono dolce: scena, sciarpa; SCHE/SCHI per quello duro: scherzo, schiena.'],
      ['ragno, maglia, pesce, maschera', 'ragno, maglia, pesce, maschera']),
    sec(['CU, QU, CQU', 'CU, QU, CQU'],
      ['Meistens schreibt man QU (quadro, questo). CU in einigen Wörtern (cuore, scuola, cuoco). CQU in acqua und verwandten Wörtern. Ausnahme: soqquadro.',
        'Di solito si scrive QU (quadro, questo). CU in alcune parole (cuore, scuola, cuoco, cuoio). CQU in acqua e derivati (acquario) e nelle forme di nascere e piacere (nacque, piacque). Eccezione: soqquadro.'])
  ], [
    ['„scuola“ mit q schreiben.', 'Scrivere “squola” con la q.'],
    ['„sciena“ statt „scena“.', 'Scrivere “sciena” invece di “scena”.']
  ], [
    term(['Digramm', 'Digramma'], ['Zwei Buchstaben für einen Laut: gn, ch.', 'Due lettere per un solo suono: gn, ch, gh, sc.']),
    term(['Trigramm', 'Trigramma'], ['Drei Buchstaben für einen Laut: gli, sci.', 'Tre lettere per un suono: gli, sci.'])
  ]),

  'it2-acca': theory([
    sec(['HO, HAI, HA, HANNO', 'HO, HAI, HA, HANNO'],
      ['Die Formen von „avere“ (haben) schreibt man mit H: ho, hai, ha, hanno. Ohne H sind es andere Wörter: o (oder), ai (Präposition), a (Präposition), anno (Jahr).',
        'Le voci del verbo avere si scrivono con l’H: ho, hai, ha, hanno. Senza H sono altre parole: o (congiunzione), ai (preposizione), a (preposizione), anno (sostantivo).'],
      ['Ho un gatto o un cane? Vado a casa. Ha fame. Il nuovo anno. Hanno vinto.', 'Ho un gatto o un cane? Vado a casa. Ha fame. Il nuovo anno. Hanno vinto.'],
      ['Trick: Ersetze das Wort durch „avevo / aveva“. Passt es, schreibst du H.', 'Trucco: sostituisci con “avevo / aveva”. Se funziona, ci vuole l’H.']),
    sec(['È oder E', 'È o E'],
      ['È mit Akzent ist das Verb „essere“ (ist). E ohne Akzent ist die Konjunktion „und“.',
        'È con l’accento è il verbo essere. E senza accento è la congiunzione.'],
      ['Il cielo è blu e il mare è calmo.', 'Il cielo è blu e il mare è calmo.']),
    sec(['Akzent und Apostroph', 'Accento e apostrofo'],
      ['Ein Akzent steht auf dem letzten Vokal bei betonten Endsilben: città, perché, così. Einsilbige Wörter tragen ihn nur zur Unterscheidung: là/la, sì/si, dà/da, tè/te. Der Apostroph ersetzt einen weggefallenen Vokal: l’albero, un’amica (weiblich!), aber un amico.',
        'L’accento si mette sulle parole tronche: città, perché, così. Sui monosillabi solo per distinguerli: là/la, lì/li, sì/si, dà/da, tè/te, né/ne. L’apostrofo indica una vocale caduta: l’albero, un’amica (femminile!), ma un amico.'],
      ['qual è (ohne Apostroph!), un po’ (mit Apostroph)', 'qual è (senza apostrofo!), un po’ (con apostrofo)'])
  ], [
    ['„qual’è“ mit Apostroph schreiben.', 'Scrivere “qual’è” con l’apostrofo: è sbagliato.'],
    ['„un’amico“ mit Apostroph beim männlichen Wort.', 'Scrivere “un’amico” al maschile.']
  ], [
    term(['Apostroph', 'Apostrofo'], ['Zeichen ’ für einen weggefallenen Vokal.', 'Segno ’ che indica l’elisione.']),
    term(['Akzent', 'Accento'], ['Zeichen auf einem betonten Vokal: à, è, é.', 'Segno sulla vocale accentata: à, è, é.'])
  ]),

  'it3-grammatica': theory([
    sec(['Artikel', 'Gli articoli'],
      ['Bestimmte Artikel: il, lo, la, i, gli, le. Unbestimmte: un, uno, una, un’. „lo/uno/gli“ stehen vor s + Konsonant, z, gn, ps, x, y: lo zaino, uno studente, gli gnomi.',
        'Articoli determinativi: il, lo, la, i, gli, le. Indeterminativi: un, uno, una, un’. Lo, uno, gli si usano davanti a s + consonante, z, gn, ps, x, y: lo zaino, uno studente, gli gnomi.'],
      ['il cane – i cani\nlo specchio – gli specchi\nla casa – le case', 'il cane – i cani\nlo specchio – gli specchi\nla casa – le case']),
    sec(['Nomen', 'I nomi'],
      ['Nomen haben ein Geschlecht (maschile/femminile) und eine Zahl (singolare/plurale). Man unterscheidet Eigennamen (Roma, Luca) und Gattungsnamen (città, bambino), konkrete und abstrakte Nomen (tavolo / felicità).',
        'I nomi hanno un genere (maschile/femminile) e un numero (singolare/plurale). Si distinguono nomi propri (Roma, Luca) e comuni (città, bambino), concreti e astratti (tavolo / felicità), collettivi (gregge, folla).']),
    sec(['Verben', 'I verbi'],
      ['Verben haben drei Konjugationen nach der Endung: -are (cantare), -ere (leggere), -ire (dormire). Hilfsverben sind essere und avere. Zeiten des Indikativs: presente, passato prossimo, imperfetto, futuro, passato remoto …',
        'I verbi si dividono in tre coniugazioni: -are (cantare), -ere (leggere), -ire (dormire). Gli ausiliari sono essere e avere. Tempi dell’indicativo: presente, passato prossimo, imperfetto, passato remoto, futuro …'],
      ['io canto – ho cantato – cantavo – canterò', 'io canto – ho cantato – cantavo – canterò'],
      ['Frag dich: Ist es eine Handlung? Dann ist es ein Verb.', 'Chiediti: indica un’azione o uno stato? Allora è un verbo.'])
  ], [
    ['„il zaino“ statt „lo zaino“.', 'Scrivere “il zaino” invece di “lo zaino”.'],
    ['Den Plural der Wörter auf -ca/-ga ohne h: amica → amiche, lago → laghi.', 'Dimenticare l’h nei plurali in -che/-ghi: amica → amiche, lago → laghi.']
  ], [
    term(['Hilfsverb', 'Ausiliare'], ['essere oder avere.', 'essere o avere.']),
    term(['Konjugation', 'Coniugazione'], ['Gruppe von Verben mit gleicher Endung.', 'Gruppo di verbi con la stessa desinenza.'])
  ]),

  'it6-grammaticale': theory([
    sec(['Die neun Wortarten', 'Le nove parti del discorso'],
      ['Veränderlich: Artikel, Nomen, Adjektiv, Pronomen, Verb. Unveränderlich: Adverb, Präposition, Konjunktion, Interjektion. Bei der grammatikalischen Analyse bestimmst du jedes Wort.',
        'Variabili: articolo, nome, aggettivo, pronome, verbo. Invariabili: avverbio, preposizione, congiunzione, interiezione. Nell’analisi grammaticale classifichi ogni parola.'],
      ['„Il gatto dorme tranquillo.“\nil = Art. det. m. sing.\ngatto = nome comune, m. sing.\ndorme = verbo dormire, 3ª pers. sing., indicativo presente\ntranquillo = aggettivo qualificativo', '“Il gatto dorme tranquillo.”\nil = art. det. masch. sing.\ngatto = nome comune di animale, masch. sing.\ndorme = verbo dormire, 3ª coniug., indicativo presente, 3ª pers. sing.\ntranquillo = aggettivo qualificativo, masch. sing.']),
    sec(['Modi und Zeiten', 'Modi e tempi del verbo'],
      ['Finite Modi: Indikativ (Wirklichkeit), Konjunktiv (Möglichkeit, Wunsch), Konditional (Bedingung), Imperativ (Befehl). Infinite Modi: Infinitiv, Partizip, Gerundium.',
        'Modi finiti: indicativo (realtà), congiuntivo (possibilità, desiderio), condizionale (condizione), imperativo (ordine). Modi indefiniti: infinito, participio, gerundio.'],
      ['Spero che tu venga (congiuntivo). Verrei volentieri (condizionale).', 'Spero che tu venga (congiuntivo). Verrei volentieri (condizionale).']),
    sec(['Pronomen', 'I pronomi'],
      ['Pronomen ersetzen ein Nomen: persönliche (io, lo, gli), possessive (il mio), demonstrative (questo), relative (che, il quale), interrogative (chi?), indefinite (qualcuno).',
        'I pronomi sostituiscono un nome: personali (io, lo, gli), possessivi (il mio), dimostrativi (questo), relativi (che, il quale, cui), interrogativi (chi?), indefiniti (qualcuno).'],
      undefined,
      ['„gli“ = ihm, „le“ = ihr. „Gli ho detto“ zu einer Frau ist falsch!', '“gli” = a lui, “le” = a lei. Dire “gli ho detto” a una donna è un errore!'])
  ], [
    ['Adjektiv und Adverb verwechseln: „veloce“ (Adjektiv) vs. „velocemente“ (Adverb).', 'Confondere aggettivo e avverbio: veloce vs. velocemente.'],
    ['„Se avrei“ statt „se avessi“: Nach „se“ im Irrealis steht der Konjunktiv.', '“Se avrei” invece di “se avessi”: dopo il se ipotetico va il congiuntivo.']
  ], [
    term(['Modus', 'Modo'], ['Art, wie eine Handlung dargestellt wird.', 'Il modo in cui si presenta l’azione.']),
    term(['Adverb', 'Avverbio'], ['Unveränderliches Wort, das ein Verb näher bestimmt.', 'Parola invariabile che modifica il verbo.'])
  ]),

  'it7-logica': theory([
    sec(['Subjekt und Prädikat', 'Soggetto e predicato'],
      ['Das Subjekt ist, wer oder was handelt. Das Prädikat sagt, was das Subjekt tut oder ist. Prädikat verbal (Marco corre) oder nominal mit „essere“ (Marco è alto).',
        'Il soggetto è chi compie o subisce l’azione. Il predicato dice che cosa fa o com’è il soggetto. Predicato verbale (Marco corre) o nominale con essere + nome del predicato (Marco è alto).']),
    sec(['Ergänzungen (complementi)', 'I complementi'],
      ['Ergänzungen vervollständigen den Satz. Die wichtigsten: Objekt (chi? che cosa?), specificazione (di chi?), termine (a chi?), luogo, tempo, mezzo, modo, causa, compagnia, agente.',
        'I complementi completano la frase. I principali: oggetto (chi? che cosa?), specificazione (di chi? di che cosa?), termine (a chi?), luogo, tempo, mezzo, modo, causa, compagnia, agente (nel passivo).'],
      ['„Luca regala un libro a Sara per il compleanno.“\nLuca = soggetto, regala = predicato verbale, un libro = c. oggetto, a Sara = c. di termine, per il compleanno = c. di fine', '“Luca regala un libro a Sara per il compleanno.”\nLuca = soggetto\nregala = predicato verbale\nun libro = compl. oggetto\na Sara = compl. di termine\nper il compleanno = compl. di fine']),
    sec(['Satzanalyse (analisi del periodo)', 'Analisi del periodo'],
      ['Ein Satzgefüge hat einen Hauptsatz (indipendente) und Nebensätze (subordinate): Kausalsatz (perché), Finalsatz (per), Temporalsatz (quando), Relativsatz (che), Objektsatz (che), Konzessivsatz (benché). Gleichrangige Sätze sind koordinate.',
        'Il periodo ha una proposizione principale e delle subordinate: causale (perché), finale (per), temporale (quando), relativa (che, il quale), oggettiva (che), concessiva (benché). Frasi dello stesso livello sono coordinate.'],
      ['„Resto a casa | perché piove.“ → principale + causale', '“Resto a casa | perché piove.” → principale + subordinata causale'],
      ['So viele Verben (konjugiert), so viele Sätze.', 'Tanti verbi (predicati), tante proposizioni.'])
  ], [
    ['Das Subjekt immer am Satzanfang suchen: „Arriva il treno“ – Subjekt ist „il treno“.', 'Cercare il soggetto sempre all’inizio: in “Arriva il treno” il soggetto è “il treno”.'],
    ['„che“ immer als Relativpronomen deuten, auch wenn es eine Konjunktion ist.', 'Considerare “che” sempre un pronome relativo, anche quando è congiunzione.']
  ], [
    term(['Complemento', 'Complemento'], ['Satzergänzung.', 'Elemento che completa la frase.']),
    term(['Subordinata', 'Subordinata'], ['Nebensatz.', 'Proposizione che dipende da un’altra.'])
  ]),

  'it9-retorica': theory([
    sec(['Figure di suono', 'Figure di suono'],
      ['Alliteration (Wiederholung von Lauten), Onomatopöie (Lautmalerei: „tic tac“), Assonanz und Konsonanz (Ähnlichkeit der Endungen).',
        'Allitterazione (ripetizione di suoni), onomatopea (parole che imitano suoni: “tic tac”), assonanza e consonanza (somiglianza di vocali o consonanti finali).'],
      ['„di me medesmo meco mi vergogno“ (Petrarca) → Alliteration', '“di me medesmo meco mi vergogno” (Petrarca) → allitterazione']),
    sec(['Figure di significato e d’ordine', 'Figure di significato e d’ordine'],
      ['Metapher, Vergleich, Metonymie (Teil fürs Ganze), Oxymoron (Widerspruch: „dolce amaro“), Hyperbel (Übertreibung). Anapher, Chiasmus (Kreuzstellung), Klimax, Enjambement (Satz läuft über das Versende).',
        'Metafora, similitudine, metonimia, sineddoche, ossimoro (“dolce amaro”), iperbole. Anafora, chiasmo, climax, enjambement (la frase continua nel verso successivo).'],
      ['„M’illumino / d’immenso“ (Ungaretti): Enjambement und Metapher', '“M’illumino / d’immenso” (Ungaretti): metafora, verso brevissimo']),
    sec(['Metrik und Sonett', 'Metrica e sonetto'],
      ['Italienische Verse zählen Silben: endecasillabo (11), settenario (7). Dabei verschmelzen Vokale (sinalefe). Das Sonett hat 14 Verse: zwei Quartette und zwei Terzette, Reim z. B. ABAB ABAB CDC DCD.',
        'I versi italiani si misurano in sillabe metriche: endecasillabo (11), settenario (7), novenario (9). Con la sinalefe due vocali si fondono. Il sonetto ha 14 versi: due quartine e due terzine, rime per esempio ABAB ABAB CDC DCD.'],
      undefined,
      ['Zähle bis zur letzten betonten Silbe + 1.', 'Conta fino all’ultima sillaba accentata e aggiungi 1.'])
  ], [
    ['Metapher und Vergleich verwechseln: „come“ = Vergleich.', 'Confondere metafora e similitudine: con “come” è similitudine.'],
    ['Silben grammatisch statt metrisch zählen (Sinalefe vergessen).', 'Contare le sillabe grammaticali dimenticando la sinalefe.']
  ], [
    term(['Endecasillabo', 'Endecasillabo'], ['Vers mit 11 Silben, wichtigster Vers der italienischen Dichtung.', 'Verso di 11 sillabe, il più importante della poesia italiana.']),
    term(['Enjambement', 'Enjambement'], ['Satz geht über das Versende hinaus.', 'La frase prosegue oltre la fine del verso.'])
  ]),

  'it10-letteratura': theory([
    sec(['Le origini e il Trecento', 'Le origini e il Trecento'],
      ['Franz von Assisi („Cantico delle creature“), Sizilianische Dichterschule, Dolce Stil Novo. Die drei Kronen: Dante („Divina Commedia“: Hölle, Fegefeuer, Paradies), Petrarca („Canzoniere“, Laura), Boccaccio („Decameron“, 100 Novellen).',
        'San Francesco (“Cantico delle creature”), Scuola siciliana, Dolce Stil Novo. Le tre corone: Dante (“Divina Commedia”: Inferno, Purgatorio, Paradiso), Petrarca (“Canzoniere”, Laura), Boccaccio (“Decameron”, cento novelle).']),
    sec(['Dal Rinascimento all’Ottocento', 'Dal Rinascimento all’Ottocento'],
      ['Renaissance: Machiavelli („Il Principe“), Ariost („Orlando furioso“), Tasso. Aufklärung: Goldoni (Komödien), Parini. Romantik und Risorgimento: Foscolo, Leopardi („L’infinito“, Pessimismus), Manzoni („I promessi sposi“). Verismo: Verga („I Malavoglia“).',
        'Rinascimento: Machiavelli (“Il Principe”), Ariosto (“Orlando furioso”), Tasso. Illuminismo: Goldoni (commedie), Parini. Romanticismo e Risorgimento: Foscolo, Leopardi (“L’infinito”, pessimismo), Manzoni (“I promessi sposi”). Verismo: Verga (“I Malavoglia”).']),
    sec(['Il Novecento', 'Il Novecento'],
      ['Decadentismus: Pascoli (Fanciullino), D’Annunzio. Pirandello (Identität, Masken: „Il fu Mattia Pascal“), Svevo („La coscienza di Zeno“). Hermetismus: Ungaretti, Montale, Quasimodo. Neorealismus und Zeugnisliteratur: Primo Levi („Se questo è un uomo“), Calvino, Pavese.',
        'Decadentismo: Pascoli (il fanciullino), D’Annunzio. Pirandello (identità, maschere: “Il fu Mattia Pascal”), Svevo (“La coscienza di Zeno”). Ermetismo: Ungaretti, Montale, Quasimodo. Neorealismo e testimonianza: Primo Levi (“Se questo è un uomo”), Calvino, Pavese.'],
      undefined,
      ['Verbinde Autor, Werk, Epoche und Hauptthema: So bleibt es im Kopf.', 'Collega autore, opera, epoca e tema principale: così lo ricordi.'])
  ], [
    ['Petrarca und Boccaccio vertauschen: Petrarca = Lyrik, Boccaccio = Prosa.', 'Scambiare Petrarca e Boccaccio: Petrarca = poesia lirica, Boccaccio = prosa.']
  ], [
    term(['Terzina dantesca', 'Terzina dantesca'], ['Dreizeilige Strophe mit Kettenreim (ABA BCB …).', 'Strofa di tre versi a rima incatenata (ABA BCB …).']),
    term(['Verismo', 'Verismo'], ['Italienische Strömung des Realismus.', 'Corrente realista italiana di fine Ottocento.'])
  ]),

  // ───────── Englisch ─────────
  'e-basis': theory([
    sec(['Hello! Erste Wörter', 'Hello! Prime parole'],
      ['Begrüßen: Hello, Hi, Good morning. Verabschieden: Goodbye, Bye. Sich vorstellen: My name is … / I am … Fragen: What’s your name? How are you? – I’m fine, thank you.',
        'Salutare: Hello, Hi, Good morning. Congedarsi: Goodbye, Bye. Presentarsi: My name is … / I am … Domande: What’s your name? How are you? – I’m fine, thank you.']),
    sec(['Farben, Zahlen, Tiere', 'Colori, numeri, animali'],
      ['Farben: red, blue, green, yellow. Zahlen: one, two, three … ten. Tiere: dog, cat, bird, fish. Im Englischen haben Nomen keinen „der/die/das“: Es heißt immer „the“.',
        'Colori: red, blue, green, yellow. Numeri: one, two, three … ten. Animali: dog, cat, bird, fish. In inglese c’è un solo articolo determinativo: “the”.'],
      ['the red apple, the blue sky, three cats', 'the red apple, the blue sky, three cats']),
    sec(['Mehrzahl und Aussprache', 'Plurale e pronuncia'],
      ['Die Mehrzahl bildet man meist mit -s: one dog, two dogs. Englisch spricht man oft anders, als man schreibt: „eye“ klingt wie „ai“.',
        'Il plurale si fa di solito con -s: one dog, two dogs. L’inglese spesso si pronuncia diversamente da come si scrive: “eye” si legge “ai”.'],
      undefined,
      ['Lies laut mit, wenn du Englisch hörst: So lernst du die Aussprache.', 'Ripeti ad alta voce quando ascolti l’inglese: così impari la pronuncia.'])
  ], [
    ['Wörter so aussprechen, wie sie geschrieben werden.', 'Pronunciare le parole come si scrivono.']
  ], [
    term(['the', 'the'], ['Bestimmter Artikel für alle Nomen.', 'Articolo determinativo per tutti i nomi.'])
  ]),

  'en-vocab': theory([
    sec(['Wortschatz lernen', 'Imparare il lessico'],
      ['Lerne Wörter in Zusammenhängen (Themenfelder: school, family, food) und mit Beispielsatz. Wiederhole in wachsenden Abständen (nach 1, 3, 7 Tagen).',
        'Impara le parole per argomenti (school, family, food) e con una frase d’esempio. Ripassa a intervalli crescenti (dopo 1, 3, 7 giorni).']),
    sec(['Falsche Freunde', 'Falsi amici'],
      ['Manche Wörter sehen aus wie deutsche oder italienische Wörter, bedeuten aber etwas anderes.',
        'Alcune parole sembrano italiane ma significano altro.'],
      ['become = werden (nicht: bekommen)\nhandy = praktisch (Handy = mobile phone)\nchef = Koch', 'library = biblioteca (non libreria = bookshop)\nsensible = assennato (sensibile = sensitive)\nactually = in realtà (attualmente = currently)']),
    sec(['Wortbildung', 'Formazione delle parole'],
      ['Mit Vor- und Nachsilben erweiterst du deinen Wortschatz: un- (unhappy), -ful (helpful), -less (useless), -ness (kindness), -er (teacher).',
        'Con prefissi e suffissi allarghi il lessico: un- (unhappy), -ful (helpful), -less (useless), -ness (kindness), -er (teacher).'],
      ['care → careful → careless → carefully', 'care → careful → careless → carefully'])
  ], [
    ['Falsche Freunde wörtlich übersetzen.', 'Tradurre alla lettera i falsi amici.']
  ], [
    term(['false friend', 'falso amico'], ['Ähnlich aussehendes Wort mit anderer Bedeutung.', 'Parola simile con significato diverso.'])
  ]),

  'en-tenses': theory([
    sec(['Simple Present und Present Progressive', 'Simple present e present continuous'],
      ['Simple Present für Gewohnheiten und Fakten (always, often, every day). In der 3. Person Singular kommt -s dazu: he plays. Present Progressive (am/is/are + -ing) für Dinge, die gerade passieren (now, at the moment).',
        'Simple present per abitudini e fatti (always, often, every day). Alla 3ª persona singolare si aggiunge -s: he plays. Present continuous (am/is/are + -ing) per azioni in corso (now, at the moment).'],
      ['She walks to school every day.\nLook! She is running.', 'She walks to school every day.\nLook! She is running.'],
      ['He, she, it – das s muss mit!', 'He, she, it: ci vuole la -s!']),
    sec(['Simple Past und Present Perfect', 'Simple past e present perfect'],
      ['Simple Past für abgeschlossene Handlungen zu einem bestimmten Zeitpunkt (yesterday, last year, in 2010): I played / I went. Present Perfect (have/has + 3. Form) für Vergangenes mit Bezug zur Gegenwart oder ohne Zeitangabe (ever, never, already, since, for).',
        'Simple past per azioni concluse in un momento preciso (yesterday, last year, in 2010): I played / I went. Present perfect (have/has + participio) per il passato collegato al presente o senza tempo preciso (ever, never, already, since, for).'],
      ['I saw that film yesterday.\nI have seen that film three times.\nI have lived here since 2020.', 'I saw that film yesterday.\nI have seen that film three times.\nI have lived here since 2020.']),
    sec(['Zukunft', 'Il futuro'],
      ['will für spontane Entscheidungen und Vorhersagen. going to für Pläne und sichere Anzeichen. Present Progressive für feste Verabredungen.',
        'will per decisioni spontanee e previsioni. going to per progetti e cose evidenti. Present continuous per appuntamenti fissati.'],
      ['I’ll help you!\nLook at the clouds – it’s going to rain.\nI’m meeting Tom tomorrow.', 'I’ll help you!\nLook at the clouds – it’s going to rain.\nI’m meeting Tom tomorrow.'])
  ], [
    ['„I have seen him yesterday“: Mit yesterday immer Simple Past.', '“I have seen him yesterday”: con yesterday si usa il simple past.'],
    ['„since“ und „for“ verwechseln: since 2020 (Zeitpunkt), for three years (Zeitraum).', 'Confondere since e for: since 2020 (momento), for three years (durata).']
  ], [
    term(['signal word', 'parola segnale'], ['Wort, das auf eine Zeitform hinweist.', 'Parola che indica il tempo verbale.']),
    term(['past participle', 'participio passato'], ['3. Verbform: gone, seen, played.', 'Terza forma: gone, seen, played.'])
  ]),

  'en-grammar': theory([
    sec(['If-clauses', 'Periodo ipotetico'],
      ['Type 1 (real): if + present, will. Type 2 (unwahrscheinlich): if + past, would. Type 3 (Vergangenheit, nicht mehr möglich): if + past perfect, would have + 3. Form.',
        'Tipo 1 (reale): if + present, will. Tipo 2 (improbabile): if + past, would. Tipo 3 (passato impossibile): if + past perfect, would have + participio.'],
      ['If it rains, I will stay home.\nIf I had money, I would travel.\nIf I had studied, I would have passed.', 'If it rains, I will stay home.\nIf I had money, I would travel.\nIf I had studied, I would have passed.'],
      ['Kein „would“ im if-Satz!', 'Mai “would” nella frase con if!']),
    sec(['Passive', 'Il passivo'],
      ['Passiv: Form von „be“ + 3. Form. Der Handelnde wird mit „by“ angeschlossen oder weggelassen. Die Zeit steckt in „be“.',
        'Passivo: forma di “be” + participio passato. Chi compie l’azione si introduce con “by” o si omette. Il tempo è dato da “be”.'],
      ['Active: Shakespeare wrote Hamlet.\nPassive: Hamlet was written by Shakespeare.\nThe house is being built.', 'Attivo: Shakespeare wrote Hamlet.\nPassivo: Hamlet was written by Shakespeare.\nThe house is being built.']),
    sec(['Reported Speech', 'Discorso indiretto'],
      ['Bei einem Einleitungsverb in der Vergangenheit (said) rückt die Zeit eine Stufe zurück (backshift): present → past, past → past perfect, will → would. Pronomen und Orts-/Zeitangaben anpassen.',
        'Se il verbo introduttivo è al passato (said), i tempi arretrano (backshift): present → past, past → past perfect, will → would. Si adattano pronomi ed espressioni di tempo e luogo.'],
      ['„I am tired.“ → She said (that) she was tired.\n„I will come tomorrow.“ → He said he would come the next day.', '“I am tired.” → She said (that) she was tired.\n“I will come tomorrow.” → He said he would come the next day.'])
  ], [
    ['„If I would have …“ – falsch, richtig: „If I had …“.', '“If I would have …” è sbagliato: si dice “If I had …”.']
  ], [
    term(['backshift', 'backshift'], ['Zeitverschiebung in der indirekten Rede.', 'Arretramento dei tempi nel discorso indiretto.']),
    term(['conditional', 'condizionale'], ['would + Infinitiv.', 'would + infinito.'])
  ]),

  'en-reading': theory([
    sec(['Reading strategies', 'Strategie di lettura'],
      ['Skimming: Text schnell überfliegen, um das Thema zu erfassen. Scanning: gezielt nach einer Information suchen. Detailed reading: genau lesen, um alles zu verstehen.',
        'Skimming: leggere velocemente per capire l’argomento. Scanning: cercare un’informazione precisa. Detailed reading: leggere con attenzione per capire tutto.']),
    sec(['Writing: summary and comment', 'Scrivere: summary e comment'],
      ['Summary: kurz, sachlich, im Simple Present, eigene Worte, keine Zitate. Einleitungssatz: „The article ‚…‘ by … deals with …“. Comment: eigene Meinung mit Argumenten und Linking Words (however, moreover, therefore, in conclusion).',
        'Summary: breve, oggettivo, al simple present, con parole tue, senza citazioni. Frase iniziale: “The article ‘…’ by … deals with …”. Comment: opinione personale con argomenti e connettivi (however, moreover, therefore, in conclusion).']),
    sec(['Literature and culture', 'Letteratura e cultura'],
      ['Wichtige Autoren: Shakespeare (Renaissance, Dramen), Dickens (viktorianisches England), Orwell („1984“, Dystopie). Landeskunde: UK, USA, Commonwealth, Englisch als Weltsprache.',
        'Autori importanti: Shakespeare (teatro rinascimentale), Dickens (Inghilterra vittoriana), Orwell (“1984”, distopia). Civiltà: Regno Unito, Stati Uniti, Commonwealth, l’inglese come lingua globale.'],
      undefined,
      ['Stimmen die Fakten mit dem Text überein? Belege deine Aussagen mit Zeilenangaben (l. 12).', 'Le tue affermazioni corrispondono al testo? Citale con il numero di riga (l. 12).'])
  ], [
    ['In der Summary die eigene Meinung einbauen.', 'Inserire la propria opinione nel summary.']
  ], [
    term(['skimming', 'skimming'], ['Schnelles Überfliegen.', 'Lettura rapida globale.']),
    term(['linking words', 'connettivi'], ['Wörter, die Sätze logisch verbinden.', 'Parole che collegano le frasi.'])
  ])
};
