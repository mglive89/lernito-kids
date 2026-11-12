import { sec, term, theory, type Theory } from './types';

/** Mathematik Grundschule (Klasse 1–4 / primaria) */
export const MATH_PRIMARY: Record<string, Theory> = {
  'm1-plus': theory([
    sec(['Was bedeutet Plus?', 'Che cosa vuol dire più?'],
      ['Plus (+) heißt: Wir legen zwei Mengen zusammen. Du hast 3 Äpfel und bekommst 2 dazu. Jetzt hast du 5 Äpfel. Die Zahlen, die du zusammenzählst, heißen Summanden. Das Ergebnis heißt Summe.',
        'Più (+) vuol dire: mettiamo insieme due quantità. Hai 3 mele e ne ricevi altre 2. Adesso hai 5 mele. I numeri che sommi si chiamano addendi. Il risultato si chiama somma.'],
      ['3 + 2 = 5\n🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎', '3 + 2 = 5\n🍎🍎🍎 + 🍎🍎 = 🍎🍎🍎🍎🍎']),
    sec(['Weiterzählen', 'Contare in avanti'],
      ['Du musst nicht immer alles neu zählen. Merk dir die größere Zahl im Kopf und zähle von dort weiter. Bei 2 + 6 startest du bei 6 und zählst 2 Schritte: 7, 8.',
        'Non serve contare sempre tutto da capo. Tieni a mente il numero più grande e conta in avanti da lì. Con 2 + 6 parti da 6 e fai 2 passi: 7, 8.'],
      ['2 + 6 → 6 … 7, 8 → 8', '2 + 6 → 6 … 7, 8 → 8'],
      ['Tauschen ist erlaubt: 2 + 6 = 6 + 2. Starte immer bei der größeren Zahl!', 'Puoi scambiare i numeri: 2 + 6 = 6 + 2. Parti sempre dal numero più grande!']),
    sec(['Über die 10 rechnen', 'Superare il 10'],
      ['Wenn das Ergebnis größer als 10 ist, hilft ein Zwischenschritt: Zuerst füllst du bis zur 10 auf, dann rechnest du den Rest dazu. Dafür musst du die Zahlenpaare kennen, die zusammen 10 ergeben: 1+9, 2+8, 3+7, 4+6, 5+5.',
        'Quando il risultato è più di 10, aiuta un passaggio in mezzo: prima arrivi a 10, poi aggiungi il resto. Per questo devi conoscere le coppie che fanno 10: 1+9, 2+8, 3+7, 4+6, 5+5.'],
      ['8 + 5 = ?\n8 + 2 = 10 (die 5 teile ich in 2 und 3)\n10 + 3 = 13', '8 + 5 = ?\n8 + 2 = 10 (divido il 5 in 2 e 3)\n10 + 3 = 13']),
    sec(['Verdoppeln', 'I doppi'],
      ['Aufgaben mit zwei gleichen Zahlen heißen Verdopplungsaufgaben: 4 + 4, 6 + 6. Wenn du sie auswendig kannst, helfen sie bei Nachbaraufgaben: 6 + 7 ist 6 + 6 und noch 1 mehr.',
        'Le operazioni con due numeri uguali si chiamano doppi: 4 + 4, 6 + 6. Se li sai a memoria ti aiutano con le operazioni vicine: 6 + 7 è 6 + 6 più 1.'],
      ['6 + 7 = 6 + 6 + 1 = 12 + 1 = 13', '6 + 7 = 6 + 6 + 1 = 12 + 1 = 13'])
  ], [
    ['Beim Weiterzählen die Startzahl mitzählen: 6 + 2 ist nicht „6, 7“ = 7, sondern 6 … 7, 8 = 8.', 'Contare anche il numero di partenza: 6 + 2 non è “6, 7” = 7, ma 6 … 7, 8 = 8.'],
    ['Beim Zehnerübergang die zweite Zahl falsch zerlegen. Prüfe: Die beiden Teile müssen zusammen wieder die Zahl ergeben.', 'Dividere male il secondo numero quando superi il 10. Controlla: le due parti insieme devono ridare il numero.']
  ], [
    term(['Summand', 'Addendo'], ['Eine Zahl, die addiert wird.', 'Un numero che viene sommato.']),
    term(['Summe', 'Somma'], ['Das Ergebnis einer Plusaufgabe.', 'Il risultato di un’addizione.']),
    term(['Zehnerfreund', 'Amici del 10'], ['Zwei Zahlen, die zusammen 10 ergeben, z. B. 3 und 7.', 'Due numeri che insieme fanno 10, per esempio 3 e 7.'])
  ]),

  'm1-minus': theory([
    sec(['Was bedeutet Minus?', 'Che cosa vuol dire meno?'],
      ['Minus (−) heißt: Wir nehmen etwas weg. Du hast 7 Bonbons und isst 3. Dann bleiben 4 übrig. Das Ergebnis heißt Differenz.',
        'Meno (−) vuol dire: togliamo qualcosa. Hai 7 caramelle e ne mangi 3. Te ne restano 4. Il risultato si chiama differenza.'],
      ['7 − 3 = 4\n🍬🍬🍬🍬🍬🍬🍬 → 🍬🍬🍬🍬', '7 − 3 = 4\n🍬🍬🍬🍬🍬🍬🍬 → 🍬🍬🍬🍬']),
    sec(['Rückwärtszählen und Ergänzen', 'Contare all’indietro e completare'],
      ['Bei kleinen Zahlen kannst du rückwärts zählen: 9 − 2 → 8, 7. Liegen die Zahlen nah beieinander, ist Ergänzen schneller: Bei 12 − 9 fragst du „Wie viel fehlt von 9 bis 12?“. Das sind 3.',
        'Con numeri piccoli puoi contare all’indietro: 9 − 2 → 8, 7. Se i numeri sono vicini, è più veloce completare: con 12 − 9 chiediti “quanto manca da 9 a 12?”. Mancano 3.'],
      ['12 − 9: 9 → 10, 11, 12 = 3 Schritte → 3', '12 − 9: 9 → 10, 11, 12 = 3 passi → 3']),
    sec(['Unter die 10 rechnen', 'Scendere sotto il 10'],
      ['Wenn du über die 10 zurückgehst, rechnest du in zwei Schritten: erst zurück bis 10, dann den Rest abziehen.',
        'Quando scendi sotto il 10 fai due passi: prima torni a 10, poi togli quello che manca.'],
      ['15 − 7 = ?\n15 − 5 = 10 (die 7 teile ich in 5 und 2)\n10 − 2 = 8', '15 − 7 = ?\n15 − 5 = 10 (divido il 7 in 5 e 2)\n10 − 2 = 8'],
      ['Minus und Plus sind Geschwister: Mit 8 + 7 = 15 kannst du prüfen, ob 15 − 7 = 8 stimmt.', 'Più e meno sono fratelli: con 8 + 7 = 15 puoi controllare che 15 − 7 = 8 sia giusto.'])
  ], [
    ['Die Zahlen tauschen: 3 − 7 ist nicht dasselbe wie 7 − 3. Die große Zahl steht vorne.', 'Scambiare i numeri: 3 − 7 non è uguale a 7 − 3. Il numero grande va davanti.'],
    ['Beim Rückwärtszählen die Startzahl mitzählen. Bei 9 − 2 sagst du „8, 7“, nicht „9, 8“.', 'Contare anche il numero di partenza. Con 9 − 2 dici “8, 7”, non “9, 8”.']
  ], [
    term(['Differenz', 'Differenza'], ['Das Ergebnis einer Minusaufgabe.', 'Il risultato di una sottrazione.']),
    term(['Umkehraufgabe', 'Operazione inversa'], ['Die Plusaufgabe, mit der man eine Minusaufgabe prüft.', 'L’addizione che serve a controllare una sottrazione.'])
  ]),

  'm1-vergleichen': theory([
    sec(['Mehr, weniger, gleich viel', 'Di più, di meno, tanti quanti'],
      ['Wenn du zwei Mengen vergleichst, kannst du immer ein Ding von links mit einem von rechts verbinden. Wo etwas übrig bleibt, ist mehr.',
        'Quando confronti due gruppi puoi unire ogni oggetto di sinistra con uno di destra. Dove avanza qualcosa, ci sono più oggetti.'],
      ['⚽⚽⚽⚽ und ⚽⚽ → links bleiben 2 übrig → links ist mehr.', '⚽⚽⚽⚽ e ⚽⚽ → a sinistra ne avanzano 2 → a sinistra sono di più.']),
    sec(['Die Zeichen <, > und =', 'I segni <, > e ='],
      ['Mathematiker schreiben das mit Zeichen. > heißt „ist größer als“, < heißt „ist kleiner als“, = heißt „ist gleich“. Die Spitze zeigt immer auf die kleinere Zahl, die offene Seite auf die größere.',
        'I matematici lo scrivono con i segni. > vuol dire “è maggiore di”, < vuol dire “è minore di”, = vuol dire “è uguale a”. La punta guarda sempre il numero più piccolo, la parte aperta quello più grande.'],
      ['9 > 4 (9 ist größer als 4)\n2 < 6 (2 ist kleiner als 6)\n5 = 5', '9 > 4 (9 è maggiore di 4)\n2 < 6 (2 è minore di 6)\n5 = 5'],
      ['Stell dir ein hungriges Krokodil vor: Es frisst immer die größere Zahl.', 'Immagina un coccodrillo affamato: mangia sempre il numero più grande.']),
    sec(['Zahlen bis 20 vergleichen', 'Confrontare i numeri fino a 20'],
      ['Schau zuerst auf die Zehner. Hat eine Zahl einen Zehner und die andere nicht, ist sie größer. Sind die Zehner gleich, entscheiden die Einer.',
        'Guarda prima le decine. Se un numero ha una decina e l’altro no, è più grande. Se le decine sono uguali, decidono le unità.'],
      ['13 > 9, weil 13 einen Zehner hat.\n17 > 14, weil 7 Einer mehr sind als 4.', '13 > 9 perché 13 ha una decina.\n17 > 14 perché 7 unità sono più di 4.'])
  ], [
    ['Das Zeichen verkehrt herum schreiben. Prüfe: Die offene Seite zeigt zur größeren Zahl.', 'Scrivere il segno al contrario. Controlla: la parte aperta guarda il numero più grande.'],
    ['Nur auf die Ziffer schauen: 9 ist nicht größer als 12, auch wenn 9 > 2 ist.', 'Guardare solo una cifra: 9 non è più grande di 12, anche se 9 > 2.']
  ], [
    term(['größer als (>)', 'maggiore di (>)'], ['Die linke Zahl ist mehr.', 'Il numero a sinistra è più grande.']),
    term(['kleiner als (<)', 'minore di (<)'], ['Die linke Zahl ist weniger.', 'Il numero a sinistra è più piccolo.'])
  ]),

  'm1-zahlenraum': theory([
    sec(['Zehner und Einer', 'Decine e unità'],
      ['Zehn einzelne Dinge kann man zu einem Bündel zusammenlegen: einem Zehner. Was nicht in ein Zehnerbündel passt, sind die Einer. 16 sind also 1 Zehner und 6 Einer.',
        'Dieci oggetti si possono legare in un mazzetto: una decina. Quello che non entra nella decina sono le unità. 16 è quindi 1 decina e 6 unità.'],
      ['16 = 10 + 6\nZ | E\n1 | 6', '16 = 10 + 6\nda | u\n1 | 6']),
    sec(['Zahlen lesen und schreiben', 'Leggere e scrivere i numeri'],
      ['Im Deutschen sprechen wir die Zahlen von 13 bis 19 „verdreht“: Wir sagen zuerst die Einer, dann die Zehn. Sechzehn = sechs und zehn. Geschrieben wird aber zuerst der Zehner: 16.',
        'In italiano da 11 a 16 diciamo prima le unità (sedici = sei e dieci), da 17 in poi prima la decina (diciassette = dieci e sette). Si scrive però sempre prima la decina: 16, 17.'],
      ['sechzehn → 1 Zehner, 6 Einer → 16', 'diciassette → 1 decina, 7 unità → 17']),
    sec(['Nachbarzahlen und Zahlenstrahl', 'Precedente, successivo e linea dei numeri'],
      ['Auf dem Zahlenstrahl stehen die Zahlen der Reihe nach. Der Vorgänger ist 1 kleiner, der Nachfolger ist 1 größer.',
        'Sulla linea dei numeri i numeri sono in fila. Il precedente è 1 in meno, il successivo è 1 in più.'],
      ['Vorgänger von 14 → 13, Nachfolger → 15', 'Precedente di 14 → 13, successivo → 15'],
      ['Gerade Zahlen (2, 4, 6 …) kann man in zwei gleiche Gruppen teilen.', 'I numeri pari (2, 4, 6 …) si possono dividere in due gruppi uguali.'])
  ], [
    ['16 und 61 verwechseln. Der Zehner steht immer links.', 'Confondere 16 e 61. La decina sta sempre a sinistra.'],
    ['Vorgänger und Nachfolger vertauschen: „vor“ heißt kleiner.', 'Scambiare precedente e successivo: “prima” vuol dire più piccolo.']
  ], [
    term(['Zehner (Z)', 'Decina (da)'], ['Ein Bündel aus 10 Einern.', 'Un gruppo di 10 unità.']),
    term(['Einer (E)', 'Unità (u)'], ['Ein einzelnes Ding.', 'Un singolo oggetto.']),
    term(['Nachfolger', 'Successivo'], ['Die Zahl, die direkt danach kommt.', 'Il numero che viene subito dopo.'])
  ]),

  'm2-rechnen100': theory([
    sec(['Die Hundertertafel', 'La tabella del 100'],
      ['Bis 100 gibt es 10 Zehner. Auf der Hundertertafel steht jede Zeile für einen Zehner. Wenn du eine Zeile nach unten gehst, kommen 10 dazu. Ein Feld nach rechts ist 1 mehr.',
        'Fino a 100 ci sono 10 decine. Nella tabella del 100 ogni riga è una decina. Se scendi di una riga aggiungi 10, se vai di una casella a destra aggiungi 1.'],
      ['34 → eine Zeile tiefer → 44 → ein Feld rechts → 45', '34 → una riga sotto → 44 → una casella a destra → 45']),
    sec(['Schrittweise rechnen', 'Calcolare a passi'],
      ['Zerlege die zweite Zahl in Zehner und Einer und rechne nacheinander. Das ist sicherer, als alles auf einmal zu rechnen.',
        'Dividi il secondo numero in decine e unità e calcola un pezzo alla volta. È più sicuro che fare tutto insieme.'],
      ['46 + 27\n46 + 20 = 66\n66 + 7 = 73\n\n83 − 35\n83 − 30 = 53\n53 − 5 = 48', '46 + 27\n46 + 20 = 66\n66 + 7 = 73\n\n83 − 35\n83 − 30 = 53\n53 − 5 = 48']),
    sec(['Geschickt rechnen', 'Calcolare in modo furbo'],
      ['Manchmal geht es mit einem Trick schneller. Liegt eine Zahl nah an einem Zehner, rechne mit dem Zehner und gleiche danach aus.',
        'A volte un trucco aiuta. Se un numero è vicino a una decina, calcola con la decina e poi correggi.'],
      ['57 + 19 = 57 + 20 − 1 = 76\n64 − 29 = 64 − 30 + 1 = 35', '57 + 19 = 57 + 20 − 1 = 76\n64 − 29 = 64 − 30 + 1 = 35'],
      ['Erst schätzen, dann rechnen: 57 + 19 ist etwa 60 + 20 = 80. Das Ergebnis muss in der Nähe liegen.', 'Prima stima, poi calcola: 57 + 19 è circa 60 + 20 = 80. Il risultato deve essere vicino.'])
  ], [
    ['Zehner und Einer durcheinanderbringen: Bei 46 + 27 nicht 46 + 2 rechnen.', 'Confondere decine e unità: con 46 + 27 non fare 46 + 2.'],
    ['Beim Trick „+20 − 1“ das Ausgleichen vergessen.', 'Con il trucco “+20 − 1” dimenticare di correggere.']
  ], [
    term(['Zehnerübergang', 'Cambio di decina'], ['Wenn beim Rechnen ein neuer Zehner erreicht wird.', 'Quando nel calcolo si passa alla decina successiva.']),
    term(['Überschlag', 'Stima'], ['Ungefähres Ergebnis mit runden Zahlen.', 'Risultato approssimato con numeri tondi.'])
  ]),

  'm2-einmaleins': theory([
    sec(['Mal als schnelles Plus', 'La moltiplicazione come addizione veloce'],
      ['Wenn du gleich große Gruppen zusammenzählst, kannst du mal rechnen. 4 Teller mit je 3 Keksen: 3 + 3 + 3 + 3 = 4 · 3 = 12. Die Zahlen heißen Faktoren, das Ergebnis Produkt.',
        'Quando sommi gruppi uguali puoi moltiplicare. 4 piatti con 3 biscotti ciascuno: 3 + 3 + 3 + 3 = 4 × 3 = 12. I numeri si chiamano fattori, il risultato prodotto.'],
      ['4 · 3 = 12\n🍪🍪🍪 | 🍪🍪🍪 | 🍪🍪🍪 | 🍪🍪🍪', '4 × 3 = 12\n🍪🍪🍪 | 🍪🍪🍪 | 🍪🍪🍪 | 🍪🍪🍪']),
    sec(['Kernaufgaben', 'Le tabelline chiave'],
      ['Einige Aufgaben sind besonders leicht: mal 1 (die Zahl bleibt gleich), mal 2 (verdoppeln), mal 10 (eine Null anhängen) und mal 5 (die Hälfte von mal 10). Daraus kannst du fast alles andere ableiten.',
        'Alcune moltiplicazioni sono facilissime: per 1 (il numero resta uguale), per 2 (il doppio), per 10 (aggiungi uno zero) e per 5 (la metà di per 10). Da queste ricavi quasi tutto il resto.'],
      ['7 · 10 = 70 → 7 · 5 = 35 (die Hälfte)\n7 · 6 = 7 · 5 + 7 = 42\n7 · 9 = 7 · 10 − 7 = 63', '7 × 10 = 70 → 7 × 5 = 35 (la metà)\n7 × 6 = 7 × 5 + 7 = 42\n7 × 9 = 7 × 10 − 7 = 63']),
    sec(['Tauschaufgaben', 'Proprietà commutativa'],
      ['Beim Malnehmen darfst du die Zahlen tauschen. 3 Reihen mit 8 Punkten sind genauso viele wie 8 Reihen mit 3 Punkten. So musst du nur die Hälfte auswendig lernen!',
        'Nella moltiplicazione puoi scambiare i fattori. 3 righe da 8 puntini sono tanti quanti 8 righe da 3. Così devi imparare a memoria solo metà delle tabelline!'],
      ['3 · 8 = 8 · 3 = 24', '3 × 8 = 8 × 3 = 24'],
      ['Die Neunerreihe: Die Ziffern des Ergebnisses ergeben zusammen immer 9 (18, 27, 36 …).', 'Tabellina del 9: le cifre del risultato sommate fanno sempre 9 (18, 27, 36 …).'])
  ], [
    ['Mal und Plus verwechseln: 4 · 3 ist 12, nicht 7.', 'Confondere per e più: 4 × 3 fa 12, non 7.'],
    ['Mal 0 ist immer 0, nicht die Zahl selbst. Mal 1 lässt die Zahl gleich.', 'Per 0 fa sempre 0, non il numero stesso. Per 1 lascia il numero uguale.']
  ], [
    term(['Faktor', 'Fattore'], ['Eine Zahl, die malgenommen wird.', 'Un numero che si moltiplica.']),
    term(['Produkt', 'Prodotto'], ['Das Ergebnis einer Malaufgabe.', 'Il risultato di una moltiplicazione.']),
    term(['Malreihe', 'Tabellina'], ['Alle Vielfachen einer Zahl: 3, 6, 9, 12 …', 'Tutti i multipli di un numero: 3, 6, 9, 12 …'])
  ]),

  'm2-uhrzeit': theory([
    sec(['Die Uhr und ihre Zeiger', 'L’orologio e le lancette'],
      ['Eine Uhr mit Zeigern hat 12 Zahlen. Der kurze Zeiger zeigt die Stunden, der lange Zeiger die Minuten. Der lange Zeiger braucht für eine Runde eine Stunde, der kurze Zeiger einen halben Tag.',
        'Un orologio con le lancette ha 12 numeri. La lancetta corta indica le ore, quella lunga i minuti. La lancetta lunga fa un giro in un’ora, quella corta in mezza giornata.'],
      ['Kurzer Zeiger auf 3, langer auf 12 → 3 Uhr', 'Lancetta corta sul 3, lunga sul 12 → le 3']),
    sec(['Minuten ablesen', 'Leggere i minuti'],
      ['Zwischen zwei Zahlen liegen 5 Minuten. Zeigt der lange Zeiger auf die 3, sind 15 Minuten vergangen (Viertel nach). Auf der 6 sind es 30 Minuten (halb), auf der 9 sind es 45 Minuten (Viertel vor).',
        'Tra due numeri passano 5 minuti. Se la lancetta lunga è sul 3 sono passati 15 minuti (e un quarto). Sul 6 sono 30 minuti (e mezza), sul 9 sono 45 minuti (meno un quarto).'],
      ['7:30 → „halb acht“\n7:15 → „Viertel nach sieben“\n7:45 → „Viertel vor acht“', '7:30 → “le sette e mezza”\n7:15 → “le sette e un quarto”\n7:45 → “le otto meno un quarto”'],
      ['Achtung im Deutschen: „halb acht“ heißt 7:30, also eine halbe Stunde VOR acht.', 'In tedesco “halb acht” vuol dire 7:30: mezz’ora prima delle otto.']),
    sec(['Morgens und abends, Zeitspannen', 'Mattina, sera e durate'],
      ['Ein Tag hat 24 Stunden, die Uhr zeigt aber nur 12. Darum ist 3 Uhr nachmittags 15 Uhr. Eine Zeitspanne berechnest du, indem du vom Anfang bis zum Ende weiterzählst.',
        'Un giorno ha 24 ore, ma l’orologio ne mostra solo 12. Per questo le 3 del pomeriggio sono le 15. Una durata si calcola contando dall’inizio alla fine.'],
      ['Film von 16:30 bis 18:00\n16:30 → 17:00 = 30 min\n17:00 → 18:00 = 60 min\nzusammen 90 min = 1 h 30 min', 'Film dalle 16:30 alle 18:00\n16:30 → 17:00 = 30 min\n17:00 → 18:00 = 60 min\nin tutto 90 min = 1 h 30 min'])
  ], [
    ['Kurzen und langen Zeiger verwechseln.', 'Confondere la lancetta corta con quella lunga.'],
    ['Bei „halb“ die falsche Stunde nehmen: „halb drei“ ist 2:30.', 'Sbagliare l’ora con la mezza: in tedesco “halb drei” sono le 2:30.']
  ], [
    term(['Stunde (h)', 'Ora (h)'], ['60 Minuten.', '60 minuti.']),
    term(['Minute (min)', 'Minuto (min)'], ['60 Sekunden.', '60 secondi.']),
    term(['Zeitspanne', 'Durata'], ['Wie lange etwas dauert.', 'Quanto tempo dura qualcosa.'])
  ]),

  'm2-geld': theory([
    sec(['Münzen und Scheine', 'Monete e banconote'],
      ['In Europa bezahlen wir mit Euro (€) und Cent (ct). Münzen gibt es zu 1, 2, 5, 10, 20, 50 Cent und 1 und 2 Euro. Scheine gibt es zu 5, 10, 20, 50, 100 Euro und mehr. 100 Cent sind 1 Euro.',
        'In Europa paghiamo con euro (€) e centesimi (cent). Ci sono monete da 1, 2, 5, 10, 20, 50 centesimi e da 1 e 2 euro. Le banconote sono da 5, 10, 20, 50, 100 euro e più. 100 centesimi fanno 1 euro.'],
      ['2 € + 50 ct + 20 ct = 2,70 €', '2 € + 50 cent + 20 cent = 2,70 €']),
    sec(['Geldbeträge schreiben', 'Scrivere le cifre'],
      ['Vor dem Komma stehen die Euro, nach dem Komma immer zwei Stellen für die Cent. 3,05 € heißt 3 Euro und 5 Cent, 3,50 € heißt 3 Euro und 50 Cent.',
        'Prima della virgola ci sono gli euro, dopo la virgola sempre due cifre per i centesimi. 3,05 € vuol dire 3 euro e 5 centesimi, 3,50 € vuol dire 3 euro e 50 centesimi.'],
      ['145 ct = 1,45 €', '145 cent = 1,45 €']),
    sec(['Bezahlen und Rückgeld', 'Pagare e il resto'],
      ['Wie viel Rückgeld du bekommst, findest du am leichtesten durch Ergänzen heraus: Zähle vom Preis aus bis zum Betrag, den du gegeben hast.',
        'Il resto si trova facilmente completando: conta dal prezzo fino alla cifra che hai dato.'],
      ['Preis 3,60 €, du zahlst mit 5 €\n3,60 → 4,00 = 40 ct\n4,00 → 5,00 = 1 €\nRückgeld: 1,40 €', 'Prezzo 3,60 €, paghi con 5 €\n3,60 → 4,00 = 40 cent\n4,00 → 5,00 = 1 €\nResto: 1,40 €'])
  ], [
    ['3,5 € und 3,05 € verwechseln. Nach dem Komma immer zwei Stellen lesen: 3,50 und 3,05.', 'Confondere 3,5 € e 3,05 €. Dopo la virgola leggi sempre due cifre: 3,50 e 3,05.'],
    ['Euro und Cent einfach zusammenzählen: 1 € + 20 ct sind nicht 21 €.', 'Sommare euro e centesimi come se fossero uguali: 1 € + 20 cent non fa 21 €.']
  ], [
    term(['Cent', 'Centesimo'], ['Ein Hundertstel Euro.', 'Un centesimo di euro.']),
    term(['Rückgeld', 'Resto'], ['Das Geld, das man zurückbekommt.', 'I soldi che ti vengono restituiti.'])
  ]),

  'm3-malgeteilt': theory([
    sec(['Teilen heißt gerecht verteilen', 'Dividere vuol dire distribuire in parti uguali'],
      ['Beim Geteiltrechnen (:) verteilst du eine Menge gleichmäßig. 12 Murmeln für 3 Kinder: Jedes Kind bekommt 4. Man kann auch fragen: Wie oft passt 3 in 12?',
        'Nella divisione (:) distribuisci una quantità in parti uguali. 12 biglie a 3 bambini: ognuno ne riceve 4. Puoi anche chiederti: quante volte ci sta 3 in 12?'],
      ['12 : 3 = 4, weil 4 · 3 = 12', '12 : 3 = 4 perché 4 × 3 = 12']),
    sec(['Mit dem Einmaleins teilen', 'Dividere con le tabelline'],
      ['Jede Geteiltaufgabe gehört zu einer Malaufgabe. Wer das Einmaleins kann, kann auch teilen. Suche in der passenden Malreihe die Zahl.',
        'Ogni divisione corrisponde a una moltiplicazione. Chi sa le tabelline sa anche dividere. Cerca il numero nella tabellina giusta.'],
      ['56 : 8 = ?\n8er-Reihe: 8, 16, 24, 32, 40, 48, 56 → 7 Schritte\n56 : 8 = 7', '56 : 8 = ?\nTabellina dell’8: 8, 16, 24, 32, 40, 48, 56 → 7 passi\n56 : 8 = 7']),
    sec(['Teilen mit Rest', 'Divisione con resto'],
      ['Nicht jede Menge lässt sich ganz aufteilen. Was übrig bleibt, heißt Rest. Der Rest muss immer kleiner sein als die Zahl, durch die du teilst.',
        'Non sempre si riesce a dividere tutto. Quello che avanza si chiama resto. Il resto deve essere sempre più piccolo del divisore.'],
      ['23 : 4 = 5 Rest 3\nProbe: 5 · 4 + 3 = 23', '23 : 4 = 5 resto 3\nProva: 5 × 4 + 3 = 23']),
    sec(['Punkt vor Strich', 'Prima moltiplicazioni e divisioni'],
      ['Stehen Mal oder Geteilt zusammen mit Plus oder Minus in einer Aufgabe, rechnest du zuerst Mal und Geteilt. Klammern werden immer zuerst gerechnet.',
        'Se in un’espressione ci sono per o diviso insieme a più o meno, calcoli prima per e diviso. Le parentesi si calcolano sempre per prime.'],
      ['3 + 4 · 2 = 3 + 8 = 11\n(3 + 4) · 2 = 7 · 2 = 14', '3 + 4 × 2 = 3 + 8 = 11\n(3 + 4) × 2 = 7 × 2 = 14'])
  ], [
    ['Durch 0 teilen wollen: Das geht nicht.', 'Voler dividere per 0: non si può.'],
    ['Ein Rest, der größer als der Teiler ist: Dann passt die Zahl noch einmal hinein.', 'Un resto più grande del divisore: vuol dire che il numero ci sta ancora una volta.'],
    ['Von links nach rechts rechnen statt Punkt vor Strich.', 'Calcolare da sinistra a destra senza dare la precedenza a per e diviso.']
  ], [
    term(['Dividend', 'Dividendo'], ['Die Zahl, die geteilt wird.', 'Il numero che si divide.']),
    term(['Divisor', 'Divisore'], ['Die Zahl, durch die geteilt wird.', 'Il numero per cui si divide.']),
    term(['Quotient', 'Quoziente'], ['Das Ergebnis einer Geteiltaufgabe.', 'Il risultato della divisione.'])
  ]),

  'm3-schriftlich': theory([
    sec(['Stellenwerte untereinander', 'Incolonnare bene'],
      ['Beim schriftlichen Rechnen schreibst du die Zahlen so untereinander, dass Einer unter Einern, Zehner unter Zehnern und Hunderter unter Hundertern stehen. Du rechnest von rechts nach links.',
        'Nelle operazioni in colonna scrivi i numeri in modo che unità, decine e centinaia stiano una sotto l’altra. Si calcola da destra verso sinistra.'],
      ['  H Z E\n  3 4 6\n+ 2 7 8', '  h da u\n  3 4 6\n+ 2 7 8']),
    sec(['Schriftliche Addition mit Übertrag', 'Addizione in colonna con riporto'],
      ['Ergibt eine Spalte 10 oder mehr, schreibst du nur die Einer hin und trägst den Zehner als kleine 1 in die nächste Spalte.',
        'Se una colonna fa 10 o più, scrivi solo le unità e porti la decina come piccolo 1 nella colonna a sinistra.'],
      ['346 + 278\nE: 6 + 8 = 14 → 4, Übertrag 1\nZ: 4 + 7 + 1 = 12 → 2, Übertrag 1\nH: 3 + 2 + 1 = 6\nErgebnis: 624', '346 + 278\nu: 6 + 8 = 14 → 4, riporto 1\nda: 4 + 7 + 1 = 12 → 2, riporto 1\nh: 3 + 2 + 1 = 6\nRisultato: 624']),
    sec(['Schriftliche Subtraktion', 'Sottrazione in colonna'],
      ['Ist die obere Ziffer zu klein, leihst du dir einen Zehner aus der nächsten Spalte (in Italien: „prestito“). In Deutschland lernen viele Kinder stattdessen das Ergänzen mit Übertrag. Beide Wege führen zum selben Ergebnis.',
        'Se la cifra di sopra è troppo piccola, prendi in prestito una decina dalla colonna a sinistra. In Germania molti bambini imparano invece il metodo del completamento con riporto: il risultato è lo stesso.'],
      ['523 − 187\nE: 3 < 7 → 13 − 7 = 6\nZ: (2−1) = 1 < 8 → 11 − 8 = 3\nH: (5−1) − 1 = 3\nErgebnis: 336', '523 − 187\nu: 3 < 7 → 13 − 7 = 6\nda: (2−1) = 1 < 8 → 11 − 8 = 3\nh: (5−1) − 1 = 3\nRisultato: 336'],
      ['Probe: 336 + 187 = 523 ✓', 'Prova: 336 + 187 = 523 ✓'])
  ], [
    ['Zahlen linksbündig statt rechtsbündig schreiben. Die Einer müssen genau untereinander stehen.', 'Allineare i numeri a sinistra invece che a destra. Le unità devono stare una sotto l’altra.'],
    ['Den Übertrag vergessen.', 'Dimenticare il riporto.'],
    ['Bei der Subtraktion einfach die kleinere von der größeren Ziffer abziehen, egal ob sie oben oder unten steht.', 'Nella sottrazione togliere la cifra più piccola dalla più grande anche se sta sotto.']
  ], [
    term(['Übertrag', 'Riporto'], ['Der Zehner, der in die nächste Spalte wandert.', 'La decina che passa alla colonna successiva.']),
    term(['Stellenwert', 'Valore posizionale'], ['Wie viel eine Ziffer durch ihren Platz wert ist.', 'Quanto vale una cifra in base al posto in cui si trova.'])
  ]),

  'm3-geometrie': theory([
    sec(['Ebene Figuren', 'Figure piane'],
      ['Ebene Figuren sind flach, wie auf Papier gemalt. Sie haben Seiten und Ecken. Ein Dreieck hat 3 Ecken, ein Viereck 4. Der Kreis hat keine Ecken.',
        'Le figure piane sono piatte, come disegnate su un foglio. Hanno lati e vertici. Il triangolo ha 3 vertici, il quadrilatero 4. Il cerchio non ha vertici.'],
      ['Quadrat: 4 gleich lange Seiten, 4 rechte Winkel\nRechteck: gegenüberliegende Seiten gleich lang, 4 rechte Winkel', 'Quadrato: 4 lati uguali, 4 angoli retti\nRettangolo: lati opposti uguali, 4 angoli retti']),
    sec(['Körper', 'Solidi'],
      ['Körper kann man anfassen: Sie haben Länge, Breite und Höhe. Ihre Begrenzungen heißen Flächen, wo zwei Flächen sich treffen ist eine Kante, und wo Kanten zusammenkommen eine Ecke.',
        'I solidi si possono toccare: hanno lunghezza, larghezza e altezza. Sono delimitati da facce; dove due facce si incontrano c’è uno spigolo, dove si incontrano gli spigoli c’è un vertice.'],
      ['Würfel: 6 Flächen, 12 Kanten, 8 Ecken\nQuader: wie ein Schuhkarton\nKugel: keine Ecken, keine Kanten\nZylinder: 2 Kreise und eine gebogene Fläche', 'Cubo: 6 facce, 12 spigoli, 8 vertici\nParallelepipedo: come una scatola di scarpe\nSfera: niente vertici né spigoli\nCilindro: 2 cerchi e una superficie curva']),
    sec(['Symmetrie', 'Simmetria'],
      ['Eine Figur ist achsensymmetrisch, wenn du sie so falten kannst, dass beide Hälften genau aufeinanderpassen. Die Faltlinie heißt Symmetrieachse.',
        'Una figura è simmetrica se puoi piegarla in modo che le due metà combacino perfettamente. La linea di piegatura si chiama asse di simmetria.'],
      ['Ein Schmetterling 🦋 und ein Herz ❤️ sind symmetrisch. Ein Quadrat hat sogar 4 Symmetrieachsen.', 'Una farfalla 🦋 e un cuore ❤️ sono simmetrici. Il quadrato ha addirittura 4 assi di simmetria.'],
      ['Mit einem Spiegel kannst du prüfen, ob eine Figur symmetrisch ist.', 'Con uno specchio puoi controllare se una figura è simmetrica.'])
  ], [
    ['Fläche und Körper verwechseln: Ein Kreis ist flach, eine Kugel ist rund wie ein Ball.', 'Confondere figura e solido: il cerchio è piatto, la sfera è tonda come una palla.'],
    ['Beim Zählen der Kanten eines Würfels die hinteren vergessen.', 'Contando gli spigoli del cubo dimenticare quelli dietro.']
  ], [
    term(['Ecke', 'Vertice'], ['Punkt, an dem Seiten oder Kanten zusammentreffen.', 'Punto in cui si incontrano lati o spigoli.']),
    term(['Kante', 'Spigolo'], ['Linie, an der zwei Flächen eines Körpers zusammentreffen.', 'Linea in cui si incontrano due facce di un solido.']),
    term(['rechter Winkel', 'Angolo retto'], ['Ein Winkel wie die Ecke eines Blattes Papier (90°).', 'Un angolo come l’angolo di un foglio (90°).'])
  ]),

  'm4-grossezahlen': theory([
    sec(['Die Stellenwerttafel', 'La tabella delle posizioni'],
      ['Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben: Einer, Zehner, Hunderter, Tausender, Zehntausender, Hunderttausender, Million.',
        'Ogni posizione vale dieci volte quella alla sua destra: unità, decine, centinaia, migliaia, decine di migliaia, centinaia di migliaia, milione.'],
      ['  HT ZT T  H  Z  E\n  4  0  7  2  5  3\n= 407 253', '  hk dak k  h da u\n  4  0  7  2  5  3\n= 407 253']),
    sec(['Große Zahlen lesen', 'Leggere i numeri grandi'],
      ['Teile die Zahl von rechts in Dreiergruppen. Die erste Gruppe von rechts sind die Einer, die zweite die Tausender, die dritte die Millionen. Eine Null steht für eine leere Stelle und ist wichtig!',
        'Dividi il numero da destra in gruppi di tre cifre. Il primo gruppo da destra sono le unità, il secondo le migliaia, il terzo i milioni. Lo zero indica una posizione vuota ed è importante!'],
      ['2 305 040 → zwei Millionen dreihundertfünftausendvierzig', '2 305 040 → due milioni trecentocinquemilaquaranta']),
    sec(['Runden', 'Arrotondare'],
      ['Beim Runden suchst du die nächste „glatte“ Zahl. Schau dir die Ziffer rechts von der Rundungsstelle an: Bei 0 bis 4 rundest du ab, bei 5 bis 9 rundest du auf.',
        'Arrotondando cerchi il numero “tondo” più vicino. Guarda la cifra a destra della posizione a cui arrotondi: da 0 a 4 arrotondi per difetto, da 5 a 9 per eccesso.'],
      ['47 382 auf Tausender: Hunderterziffer 3 → abrunden → 47 000\n47 582 → 5 → aufrunden → 48 000', '47 382 alle migliaia: cifra delle centinaia 3 → per difetto → 47 000\n47 582 → 5 → per eccesso → 48 000'],
      ['Runden ist nützlich für den Überschlag und für Zeitungszahlen wie „etwa 80 Millionen Einwohner“.', 'Arrotondare serve per stimare e per i numeri dei giornali come “circa 59 milioni di abitanti”.'])
  ], [
    ['Nullen vergessen: Dreitausendfünf ist 3 005, nicht 35 oder 305.', 'Dimenticare gli zeri: tremilacinque è 3 005, non 35 o 305.'],
    ['Beim Runden auf die falsche Ziffer schauen. Entscheidend ist nur die Ziffer direkt rechts.', 'Guardare la cifra sbagliata. Conta solo la cifra subito a destra.']
  ], [
    term(['Million', 'Milione'], ['1 000 000 = tausend Tausender.', '1 000 000 = mille migliaia.']),
    term(['Runden', 'Arrotondare'], ['Eine Zahl durch eine nahe, einfachere Zahl ersetzen.', 'Sostituire un numero con uno vicino più semplice.'])
  ]),

  'm4-brueche': theory([
    sec(['Ein Ganzes in gleiche Teile', 'Un intero in parti uguali'],
      ['Teilst du eine Pizza in gleich große Stücke, entsteht ein Bruch. Der Nenner (unten) sagt, in wie viele Teile geteilt wurde. Der Zähler (oben) sagt, wie viele Teile du nimmst.',
        'Se dividi una pizza in fette uguali ottieni una frazione. Il denominatore (sotto) dice in quante parti hai diviso. Il numeratore (sopra) dice quante parti prendi.'],
      ['3/8: Pizza in 8 Stücke, 3 davon gegessen 🍕', '3/8: pizza divisa in 8 fette, ne mangi 3 🍕'],
      ['Die Teile müssen gleich groß sein, sonst ist es kein richtiger Bruch.', 'Le parti devono essere uguali, altrimenti non è una vera frazione.']),
    sec(['Brüche vergleichen', 'Confrontare le frazioni'],
      ['Haben zwei Brüche den gleichen Nenner, ist der mit dem größeren Zähler größer. Haben sie den gleichen Zähler, ist der mit dem kleineren Nenner größer, denn die Stücke sind größer.',
        'Se due frazioni hanno lo stesso denominatore, è più grande quella con il numeratore maggiore. Se hanno lo stesso numeratore, è più grande quella con il denominatore minore, perché le fette sono più grandi.'],
      ['3/5 > 2/5\n1/3 > 1/6', '3/5 > 2/5\n1/3 > 1/6']),
    sec(['Bruchteile von Mengen', 'Frazione di una quantità'],
      ['Um einen Bruchteil einer Menge zu finden, teilst du durch den Nenner und nimmst mal den Zähler.',
        'Per calcolare la frazione di un numero dividi per il denominatore e moltiplica per il numeratore.'],
      ['3/4 von 20 €\n20 : 4 = 5\n5 · 3 = 15 €', '3/4 di 20 €\n20 : 4 = 5\n5 × 3 = 15 €'])
  ], [
    ['Denken, 1/8 sei größer als 1/4, weil 8 größer ist. Mehr Teile heißt kleinere Stücke!', 'Pensare che 1/8 sia più grande di 1/4 perché 8 è più grande. Più parti vuol dire fette più piccole!'],
    ['Zähler und Nenner vertauschen.', 'Scambiare numeratore e denominatore.']
  ], [
    term(['Zähler', 'Numeratore'], ['Die obere Zahl: wie viele Teile genommen werden.', 'Il numero sopra: quante parti si prendono.']),
    term(['Nenner', 'Denominatore'], ['Die untere Zahl: in wie viele Teile geteilt wird.', 'Il numero sotto: in quante parti si divide.']),
    term(['Stammbruch', 'Frazione unitaria'], ['Ein Bruch mit Zähler 1, z. B. 1/5.', 'Una frazione con numeratore 1, per esempio 1/5.'])
  ]),

  'm4-sachaufgaben': theory([
    sec(['Genau lesen', 'Leggere con attenzione'],
      ['Lies die Aufgabe zweimal. Unterstreiche die wichtigen Zahlen und markiere die Frage. Manche Zahlen braucht man gar nicht!',
        'Leggi il problema due volte. Sottolinea i numeri importanti e segna la domanda. Alcuni numeri non servono!'],
      ['„Lena kauft 3 Hefte zu je 2 €. Sie ist 9 Jahre alt. Wie viel bezahlt sie?“\nWichtig: 3 Hefte, 2 € pro Heft. Unwichtig: das Alter.', '“Lena compra 3 quaderni da 2 € l’uno. Ha 9 anni. Quanto spende?”\nImportante: 3 quaderni, 2 € l’uno. Non serve: l’età.']),
    sec(['Die richtige Rechenart finden', 'Scegliere l’operazione giusta'],
      ['Signalwörter helfen: „zusammen, insgesamt, dazu“ → Plus. „Übrig, weniger, Unterschied“ → Minus. „Je, jeder, pro“ → Mal. „Verteilen, gleichmäßig“ → Geteilt. Denke trotzdem immer mit, Signalwörter können täuschen.',
        'Le parole chiave aiutano: “in tutto, insieme, aggiunge” → più. “Restano, di meno, differenza” → meno. “Ciascuno, ogni, l’uno” → per. “Distribuisce, in parti uguali” → diviso. Ragiona comunque sempre: le parole chiave possono ingannare.'],
      ['3 Hefte zu je 2 € → 3 · 2 € = 6 €', '3 quaderni da 2 € l’uno → 3 × 2 € = 6 €']),
    sec(['Frage, Rechnung, Antwort', 'Dati, operazione, risposta'],
      ['Eine vollständige Lösung hat drei Teile: die Rechnung, das Ergebnis mit Einheit und einen Antwortsatz, der die Frage beantwortet. Bei mehreren Schritten schreibst du Zwischenergebnisse auf.',
        'Una soluzione completa ha tre parti: l’operazione, il risultato con l’unità di misura e la frase di risposta. Se ci sono più passaggi scrivi i risultati intermedi.'],
      ['Ein Bus hat 48 Plätze. 29 Kinder und 3 Lehrer steigen ein. Wie viele Plätze sind frei?\n29 + 3 = 32\n48 − 32 = 16\nAntwort: 16 Plätze sind noch frei.', 'Un pullman ha 48 posti. Salgono 29 bambini e 3 maestre. Quanti posti restano liberi?\n29 + 3 = 32\n48 − 32 = 16\nRisposta: restano liberi 16 posti.'],
      ['Mach am Ende den Realitätscheck: Kann ein Kind 300 kg wiegen? Sicher nicht!', 'Alla fine controlla se ha senso: un bambino può pesare 300 kg? Certo che no!'])
  ], [
    ['Alle Zahlen im Text verrechnen, auch die unwichtigen.', 'Usare tutti i numeri del testo, anche quelli che non servono.'],
    ['Die Einheit (€, m, kg) im Ergebnis vergessen.', 'Dimenticare l’unità di misura (€, m, kg) nel risultato.']
  ], [
    term(['Signalwort', 'Parola chiave'], ['Ein Wort, das auf eine Rechenart hinweist.', 'Una parola che suggerisce l’operazione.']),
    term(['Antwortsatz', 'Risposta'], ['Ein ganzer Satz, der die Frage beantwortet.', 'Una frase completa che risponde alla domanda.'])
  ]),

  'm4-masseinheiten': theory([
    sec(['Längen', 'Lunghezze'],
      ['Längen misst man in Millimeter (mm), Zentimeter (cm), Meter (m) und Kilometer (km). Ein Fingernagel ist etwa 1 cm breit, eine Tür ist etwa 2 m hoch.',
        'Le lunghezze si misurano in millimetri (mm), centimetri (cm), metri (m) e chilometri (km). Un’unghia è larga circa 1 cm, una porta è alta circa 2 m.'],
      ['1 cm = 10 mm\n1 m = 100 cm\n1 km = 1000 m', '1 cm = 10 mm\n1 m = 100 cm\n1 km = 1000 m']),
    sec(['Gewichte und Hohlmaße', 'Pesi e capacità'],
      ['Gewichte (eigentlich Massen) misst man in Gramm (g), Kilogramm (kg) und Tonnen (t). Flüssigkeiten misst man in Milliliter (ml) und Liter (l). Eine Tafel Schokolade wiegt 100 g, eine Milchpackung enthält 1 l.',
        'Il peso (in realtà la massa) si misura in grammi (g), chilogrammi (kg) e tonnellate (t). I liquidi in millilitri (ml) e litri (l). Una tavoletta di cioccolato pesa 100 g, un cartone di latte contiene 1 l.'],
      ['1 kg = 1000 g\n1 t = 1000 kg\n1 l = 1000 ml', '1 kg = 1000 g\n1 t = 1000 kg\n1 l = 1000 ml']),
    sec(['Umrechnen', 'Equivalenze'],
      ['Von einer großen in eine kleine Einheit nimmst du mal (aus 1 m werden 100 cm). Von klein nach groß teilst du. Vor dem Rechnen bringst du immer alles in dieselbe Einheit.',
        'Da un’unità grande a una piccola moltiplichi (1 m diventa 100 cm). Da piccola a grande dividi. Prima di calcolare porta tutto alla stessa unità.'],
      ['2 m 35 cm = 200 cm + 35 cm = 235 cm\n3500 g = 3 kg 500 g = 3,5 kg', '2 m 35 cm = 200 cm + 35 cm = 235 cm\n3500 g = 3 kg 500 g = 3,5 kg'],
      ['In Italien lernt man dazu die „Treppe“ der Einheiten: km, hm, dam, m, dm, cm, mm. Jede Stufe ist mal oder durch 10.', 'In Italia si usa la “scala” delle unità: km, hm, dam, m, dm, cm, mm. Ogni gradino è per o diviso 10.'])
  ], [
    ['Zahlen mit verschiedenen Einheiten direkt addieren: 1 m + 20 cm ist nicht 21.', 'Sommare numeri con unità diverse: 1 m + 20 cm non fa 21.'],
    ['Beim Umrechnen mal und geteilt verwechseln.', 'Confondere per e diviso nelle equivalenze.']
  ], [
    term(['Einheit', 'Unità di misura'], ['Das, womit gemessen wird (m, kg, l …).', 'Ciò con cui si misura (m, kg, l …).']),
    term(['Kilo-', 'Chilo-'], ['Bedeutet „tausend“: 1 km = 1000 m.', 'Vuol dire “mille”: 1 km = 1000 m.']),
    term(['Milli-', 'Milli-'], ['Bedeutet „ein Tausendstel“: 1 ml = 1/1000 l.', 'Vuol dire “un millesimo”: 1 ml = 1/1000 l.'])
  ])
};
