import { sec, term, theory, type Theory } from './types';

/** Informatik und Programmieren */
export const COMPUTING: Record<string, Theory> = {
  'info-computer': theory([
    sec(['Was ist ein Computer?', 'Che cos’è un computer?'],
      ['Ein Computer verarbeitet Informationen nach dem EVA-Prinzip: Eingabe (Tastatur, Maus, Mikrofon), Verarbeitung (Prozessor), Ausgabe (Bildschirm, Lautsprecher, Drucker). Auch Tablets und Handys sind Computer.',
        'Un computer elabora informazioni: input (tastiera, mouse, microfono), elaborazione (processore), output (schermo, altoparlanti, stampante). Anche tablet e smartphone sono computer.']),
    sec(['Sichere Passwörter', 'Password sicure'],
      ['Ein gutes Passwort ist lang, hat Groß- und Kleinbuchstaben, Zahlen und Zeichen und ist kein echtes Wort. Verrate es niemandem außer deinen Eltern.',
        'Una buona password è lunga, ha maiuscole, minuscole, numeri e simboli e non è una parola vera. Non dirla a nessuno tranne ai tuoi genitori.'],
      ['schlecht: 1234, hallo\nbesser: Mein-Hund-frisst-3-Kekse!', 'debole: 1234, ciao\nmeglio: Il-mio-cane-mangia-3-biscotti!']),
    sec(['Hilfe holen', 'Chiedere aiuto'],
      ['Wenn dich im Internet etwas erschreckt, traurig macht oder jemand Fremdes dich anschreibt: nicht antworten, keine Fotos oder Adressen schicken, sofort einem Erwachsenen Bescheid sagen.',
        'Se online qualcosa ti spaventa, ti rende triste o uno sconosciuto ti scrive: non rispondere, non mandare foto o indirizzi, dillo subito a un adulto.'],
      undefined,
      ['Du bist nie schuld, wenn dir jemand online Angst macht.', 'Non è mai colpa tua se qualcuno online ti fa paura.'])
  ], [
    ['Dasselbe Passwort überall benutzen.', 'Usare la stessa password ovunque.']
  ], [
    term(['Eingabegerät', 'Dispositivo di input'], ['Gerät, mit dem man dem Computer etwas mitteilt.', 'Strumento per dare informazioni al computer.']),
    term(['Passwort', 'Password'], ['Geheimes Wort zum Schutz eines Kontos.', 'Parola segreta che protegge un account.'])
  ]),

  'info-hardware-netz': theory([
    sec(['Hardware', 'Hardware'],
      ['CPU (Prozessor): rechnet. RAM (Arbeitsspeicher): schnell, aber flüchtig, hält laufende Programme. SSD/Festplatte: dauerhafter Speicher. GPU: Grafik. Software sind die Programme, Hardware die Geräte.',
        'CPU (processore): esegue i calcoli. RAM (memoria di lavoro): veloce ma volatile, contiene i programmi in uso. SSD/disco: memoria permanente. GPU: grafica. Il software sono i programmi, l’hardware i componenti fisici.']),
    sec(['Wie funktioniert das Internet?', 'Come funziona Internet?'],
      ['Das Internet ist ein Netz aus Netzen. Jedes Gerät hat eine IP-Adresse. Daten werden in Pakete zerlegt und über Router zum Ziel geschickt. DNS übersetzt Namen (example.com) in IP-Adressen. HTTPS verschlüsselt die Verbindung.',
        'Internet è una rete di reti. Ogni dispositivo ha un indirizzo IP. I dati sono divisi in pacchetti e inviati tramite router. Il DNS traduce i nomi (example.com) in indirizzi IP. HTTPS cifra la connessione.']),
    sec(['Sicherheit', 'Sicurezza'],
      ['Phishing: gefälschte Nachrichten, die Passwörter stehlen wollen (Absender prüfen, nicht auf Links klicken). Zwei-Faktor-Authentifizierung schützt zusätzlich. Updates schließen Sicherheitslücken. Datenschutz: Persönliche Daten sparsam teilen.',
        'Phishing: messaggi falsi che vogliono rubare password (controlla il mittente, non cliccare sui link). L’autenticazione a due fattori protegge di più. Gli aggiornamenti chiudono le falle. Privacy: condividi pochi dati personali.'],
      ['Verdächtig: „Ihr Konto wird gesperrt! Klicken Sie sofort hier …“', 'Sospetto: “Il tuo account verrà bloccato! Clicca subito qui …”'],
      ['Druck und Eile sind typische Phishing-Zeichen.', 'Fretta e minacce sono tipici segnali di phishing.'])
  ], [
    ['RAM und Festplatte verwechseln.', 'Confondere RAM e disco.']
  ], [
    term(['IP-Adresse', 'Indirizzo IP'], ['Adresse eines Geräts im Netz.', 'Indirizzo di un dispositivo in rete.']),
    term(['Phishing', 'Phishing'], ['Betrug mit gefälschten Nachrichten.', 'Truffa con messaggi falsi.'])
  ]),

  'info-binaer': theory([
    sec(['Warum binär?', 'Perché il binario?'],
      ['Computer kennen nur zwei Zustände: Strom an (1) oder aus (0). Ein Bit ist eine 0 oder 1, 8 Bit sind ein Byte. Mit 8 Bit kann man 256 verschiedene Werte (0–255) darstellen.',
        'I computer conoscono due stati: corrente sì (1) o no (0). Un bit è uno 0 o un 1, 8 bit sono un byte. Con 8 bit si rappresentano 256 valori (0–255).']),
    sec(['Binär in dezimal', 'Da binario a decimale'],
      ['Jede Stelle ist eine Zweierpotenz: von rechts 1, 2, 4, 8, 16, 32, 64, 128. Addiere die Werte der Stellen, an denen eine 1 steht.',
        'Ogni posizione è una potenza di 2: da destra 1, 2, 4, 8, 16, 32, 64, 128. Somma i valori delle posizioni dove c’è un 1.'],
      ['1011₂ = 8 + 0 + 2 + 1 = 11\n13 = 8 + 4 + 1 → 1101₂', '1011₂ = 8 + 0 + 2 + 1 = 11\n13 = 8 + 4 + 1 → 1101₂']),
    sec(['Hexadezimal', 'Esadecimale'],
      ['Das Hexadezimalsystem hat 16 Ziffern: 0–9 und A–F (A = 10 … F = 15). Eine Hex-Ziffer entspricht genau 4 Bit, deshalb ist es praktisch für Farben (#FF8800) und Speicheradressen.',
        'Il sistema esadecimale ha 16 cifre: 0–9 e A–F (A = 10 … F = 15). Una cifra esadecimale corrisponde a 4 bit: comodo per i colori (#FF8800) e gli indirizzi di memoria.'],
      ['2F₁₆ = 2 · 16 + 15 = 47\n1111 0000₂ = F0₁₆', '2F₁₆ = 2 × 16 + 15 = 47\n1111 0000₂ = F0₁₆'],
      ['Dezimal → binär: immer durch 2 teilen, Reste von unten nach oben lesen.', 'Da decimale a binario: dividi per 2 e leggi i resti dal basso verso l’alto.'])
  ], [
    ['Die Stellenwerte von links statt von rechts zählen.', 'Contare le posizioni da sinistra invece che da destra.']
  ], [
    term(['Bit', 'Bit'], ['Kleinste Informationseinheit: 0 oder 1.', 'Unità minima di informazione: 0 o 1.']),
    term(['Byte', 'Byte'], ['8 Bit.', '8 bit.'])
  ]),

  'info-logik': theory([
    sec(['Wahr und falsch', 'Vero e falso'],
      ['In der Logik gibt es zwei Werte: wahr (1) und falsch (0). Logikgatter verknüpfen Eingänge zu einem Ausgang. Aus ihnen sind alle Prozessoren aufgebaut.',
        'In logica ci sono due valori: vero (1) e falso (0). Le porte logiche combinano gli ingressi in un’uscita. Tutti i processori sono costruiti con esse.']),
    sec(['AND, OR, NOT, XOR', 'AND, OR, NOT, XOR'],
      ['AND: 1 nur, wenn beide Eingänge 1 sind. OR: 1, wenn mindestens einer 1 ist. NOT: dreht um. XOR: 1, wenn genau einer 1 ist.',
        'AND: 1 solo se entrambi gli ingressi sono 1. OR: 1 se almeno uno è 1. NOT: inverte. XOR: 1 se esattamente uno è 1.'],
      ['A B | AND OR XOR\n0 0 |  0   0   0\n0 1 |  0   1   1\n1 0 |  0   1   1\n1 1 |  1   1   0', 'A B | AND OR XOR\n0 0 |  0   0   0\n0 1 |  0   1   1\n1 0 |  0   1   1\n1 1 |  1   1   0']),
    sec(['Schaltungen kombinieren', 'Combinare le porte'],
      ['Gatter lassen sich verbinden. Ein Halbaddierer addiert zwei Bits: Summe = A XOR B, Übertrag = A AND B. NAND und NOR allein reichen sogar, um jede Schaltung zu bauen.',
        'Le porte si possono collegare. Un semisommatore somma due bit: somma = A XOR B, riporto = A AND B. Con sole porte NAND (o NOR) si può costruire qualsiasi circuito.'],
      undefined,
      ['Alltag: Licht geht an, wenn es dunkel ist AND jemand sich bewegt.', 'Nella vita: la luce si accende se è buio AND qualcuno si muove.'])
  ], [
    ['OR und XOR verwechseln: Bei 1 und 1 ist OR = 1, XOR = 0.', 'Confondere OR e XOR: con 1 e 1, OR = 1 e XOR = 0.']
  ], [
    term(['Wahrheitstabelle', 'Tabella di verità'], ['Alle Eingaben mit ihrem Ergebnis.', 'Tutti gli ingressi con il risultato.'])
  ]),

  'info-caesar': theory([
    sec(['Verschlüsselung', 'Crittografia'],
      ['Verschlüsseln heißt, einen Text so zu verändern, dass nur Eingeweihte ihn lesen können. Klartext + Schlüssel → Geheimtext. Schon Julius Caesar nutzte eine einfache Methode.',
        'Cifrare vuol dire trasformare un testo perché lo capisca solo chi conosce il segreto. Testo in chiaro + chiave → testo cifrato. Già Giulio Cesare usava un metodo semplice.']),
    sec(['Die Caesar-Verschiebung', 'Lo spostamento di Cesare'],
      ['Jeder Buchstabe wird um eine feste Zahl im Alphabet verschoben. Am Ende geht es von vorne weiter (nach Z kommt A). Zum Entschlüsseln verschiebt man zurück.',
        'Ogni lettera si sposta di un numero fisso di posizioni nell’alfabeto. Arrivati alla fine si ricomincia (dopo Z viene A). Per decifrare si sposta all’indietro.'],
      ['Schlüssel 3: HALLO → KDOOR\nKDOOR → (−3) → HALLO', 'Chiave 3: CIAO → FLDR\nFLDR → (−3) → CIAO']),
    sec(['Wie sicher ist das?', 'Quanto è sicuro?'],
      ['Gar nicht: Es gibt nur 25 Schlüssel, die man schnell ausprobieren kann (Brute Force). Außerdem verrät die Häufigkeit der Buchstaben (E ist im Deutschen am häufigsten) den Schlüssel. Heute nutzt man mathematische Verfahren wie AES und RSA.',
        'Per niente: ci sono solo 25 chiavi, che si provano in fretta (forza bruta). In più la frequenza delle lettere (in italiano E e A sono le più comuni) rivela la chiave. Oggi si usano metodi matematici come AES e RSA.'],
      undefined,
      ['Die Caesar-Verschiebung ist super für Geheimbotschaften unter Freunden!', 'Il cifrario di Cesare è perfetto per messaggi segreti tra amici!'])
  ], [
    ['Beim Entschlüsseln in die falsche Richtung verschieben.', 'Decifrare spostando nella direzione sbagliata.']
  ], [
    term(['Schlüssel', 'Chiave'], ['Geheime Information zum Ver- und Entschlüsseln.', 'Informazione segreta per cifrare e decifrare.']),
    term(['Brute Force', 'Forza bruta'], ['Alle Schlüssel ausprobieren.', 'Provare tutte le chiavi.'])
  ]),

  'info-oberstufe': theory([
    sec(['Datenbanken und SQL', 'Database e SQL'],
      ['Relationale Datenbanken speichern Daten in Tabellen mit Zeilen (Datensätze) und Spalten (Attribute). Ein Primärschlüssel identifiziert eine Zeile eindeutig, Fremdschlüssel verknüpfen Tabellen. SQL fragt Daten ab.',
        'I database relazionali memorizzano i dati in tabelle con righe (record) e colonne (attributi). La chiave primaria identifica una riga, le chiavi esterne collegano le tabelle. Con SQL si interrogano i dati.'],
      ['SELECT name, klasse\nFROM schueler\nWHERE klasse = \'9b\'\nORDER BY name;', 'SELECT nome, classe\nFROM studenti\nWHERE classe = \'3B\'\nORDER BY nome;']),
    sec(['Algorithmen und Laufzeit', 'Algoritmi e complessità'],
      ['Die O-Notation beschreibt, wie die Laufzeit mit der Eingabegröße n wächst. Lineare Suche O(n), binäre Suche in sortierten Daten O(log n), einfache Sortierverfahren (Bubble Sort) O(n²), Mergesort O(n log n).',
        'La notazione O descrive come cresce il tempo di esecuzione con la dimensione n. Ricerca lineare O(n), ricerca binaria su dati ordinati O(log n), ordinamenti semplici (bubble sort) O(n²), merge sort O(n log n).'],
      ['1 000 000 Elemente: linear bis zu 1 000 000 Schritte, binär ca. 20', '1 000 000 elementi: lineare fino a 1 000 000 passi, binaria circa 20']),
    sec(['Netze und Kryptografie', 'Reti e crittografia'],
      ['Das Schichtenmodell (TCP/IP) trennt Aufgaben: Anwendung (HTTP), Transport (TCP/UDP), Internet (IP), Netzzugang. Symmetrische Verschlüsselung (AES) nutzt einen gemeinsamen Schlüssel, asymmetrische (RSA) ein Paar aus öffentlichem und privatem Schlüssel.',
        'Il modello a livelli (TCP/IP) separa i compiti: applicazione (HTTP), trasporto (TCP/UDP), rete (IP), accesso. La crittografia simmetrica (AES) usa una chiave comune, quella asimmetrica (RSA) una coppia di chiave pubblica e privata.'],
      undefined,
      ['HTTPS kombiniert beides: asymmetrisch zum Schlüsseltausch, symmetrisch für die Daten.', 'HTTPS usa entrambe: asimmetrica per scambiare la chiave, simmetrica per i dati.'])
  ], [
    ['Binäre Suche auf unsortierten Daten anwenden.', 'Usare la ricerca binaria su dati non ordinati.']
  ], [
    term(['Primärschlüssel', 'Chiave primaria'], ['Eindeutige Kennung eines Datensatzes.', 'Identificatore unico di un record.']),
    term(['O-Notation', 'Notazione O grande'], ['Maß für das Wachstum der Laufzeit.', 'Misura della crescita del tempo di calcolo.'])
  ]),

  'code-roboter': theory([
    sec(['Befehle in einer Reihe', 'Comandi in sequenza'],
      ['Ein Roboter macht genau das, was man ihm sagt – nicht mehr und nicht weniger. Ein Programm ist eine Liste von Befehlen, die der Reihe nach ausgeführt werden.',
        'Un robot fa esattamente quello che gli dici, né più né meno. Un programma è una lista di comandi eseguiti uno dopo l’altro.'],
      ['→ → ↑ ↑ → : zwei rechts, zwei hoch, eins rechts', '→ → ↑ ↑ → : due a destra, due in su, uno a destra']),
    sec(['Den Weg planen', 'Pianificare il percorso'],
      ['Schau zuerst, wo der Roboter steht und wo das Ziel ist. Zähle die Felder nach rechts/links und nach oben/unten. Achte auf Mauern: Dann musst du einen Umweg planen.',
        'Guarda prima dove si trova il robot e dov’è l’arrivo. Conta le caselle a destra/sinistra e su/giù. Attenzione ai muri: allora serve una deviazione.']),
    sec(['Testen und Fehler suchen', 'Provare e trovare errori'],
      ['Spiele dein Programm im Kopf oder mit dem Finger Schritt für Schritt durch. Läuft der Roboter gegen eine Wand, suchst du den Befehl, bei dem es schiefgeht.',
        'Prova il programma nella testa o con il dito, passo dopo passo. Se il robot sbatte contro un muro, cerca il comando in cui sbaglia.'],
      undefined,
      ['Fehler sind normal – auch Profis testen ständig!', 'Sbagliare è normale: anche i programmatori esperti provano continuamente!'])
  ], [
    ['Links und rechts aus Sicht des Roboters statt von oben verwechseln.', 'Confondere destra e sinistra dal punto di vista del robot.']
  ], [
    term(['Befehl', 'Comando'], ['Eine Anweisung für den Computer.', 'Un’istruzione per il computer.']),
    term(['Programm', 'Programma'], ['Folge von Befehlen.', 'Sequenza di comandi.'])
  ]),

  'code-ablauf': theory([
    sec(['Was ist ein Algorithmus?', 'Che cos’è un algoritmo?'],
      ['Ein Algorithmus ist eine genaue Schritt-für-Schritt-Anleitung, die immer zum Ziel führt. Kochrezepte, Bastelanleitungen und Wegbeschreibungen sind Algorithmen.',
        'Un algoritmo è una sequenza precisa di passi che porta sempre al risultato. Ricette, istruzioni di montaggio e indicazioni stradali sono algoritmi.'],
      ['Zähne putzen: 1. Zahnpasta auf die Bürste 2. Putzen 3. Ausspülen 4. Bürste waschen', 'Lavarsi i denti: 1. dentifricio sullo spazzolino 2. spazzolare 3. sciacquare 4. lavare lo spazzolino']),
    sec(['Die Reihenfolge zählt', 'L’ordine conta'],
      ['Werden Schritte vertauscht, klappt es nicht: Erst die Socken, dann die Schuhe. Frage dich bei jedem Schritt: Was muss vorher schon passiert sein?',
        'Se scambi i passi non funziona: prima i calzini, poi le scarpe. Per ogni passo chiediti: che cosa deve essere già successo prima?']),
    sec(['Genau und eindeutig', 'Preciso e chiaro'],
      ['Ein Computer kann nicht raten. „Mach ein bisschen Salz rein“ ist unklar, „gib 1 Teelöffel Salz dazu“ ist eindeutig.',
        'Un computer non sa indovinare. “Metti un po’ di sale” è vago, “aggiungi 1 cucchiaino di sale” è preciso.'],
      undefined,
      ['Teste deinen Algorithmus: Kann ihn jemand anderes ohne Fragen ausführen?', 'Prova il tuo algoritmo: un’altra persona riesce a seguirlo senza fare domande?'])
  ], [
    ['Selbstverständliche Schritte weglassen (z. B. „Wasserhahn aufdrehen“).', 'Saltare passi che sembrano ovvi (per esempio “apri il rubinetto”).']
  ], [
    term(['Algorithmus', 'Algoritmo'], ['Eindeutige Handlungsanweisung in Schritten.', 'Istruzioni precise passo dopo passo.'])
  ]),

  'code-bloecke': theory([
    sec(['Blöcke statt Text', 'Blocchi invece di testo'],
      ['In Block-Sprachen wie Scratch setzt du Befehle wie Puzzleteile zusammen. So kannst du keine Tippfehler machen und dich auf die Logik konzentrieren.',
        'Nei linguaggi a blocchi come Scratch unisci i comandi come pezzi di un puzzle. Così non fai errori di battitura e pensi solo alla logica.']),
    sec(['Variablen', 'Variabili'],
      ['Eine Variable ist eine beschriftete Box, in der sich das Programm etwas merkt, z. B. Punkte. Man kann den Wert setzen, ändern und lesen.',
        'Una variabile è una scatola con un nome in cui il programma ricorda qualcosa, per esempio i punti. Il valore si può impostare, cambiare e leggere.'],
      ['setze Punkte auf 0\nändere Punkte um 1\nsage Punkte', 'porta punti a 0\ncambia punti di 1\ndi’ punti']),
    sec(['Schleifen und Bedingungen', 'Cicli e condizioni'],
      ['Mit „wiederhole“ läuft ein Teil mehrmals. Mit „falls … dann … sonst“ entscheidet das Programm: Ist die Bedingung wahr, passiert das eine, sonst das andere.',
        'Con “ripeti” una parte si esegue più volte. Con “se … allora … altrimenti” il programma decide: se la condizione è vera fa una cosa, altrimenti l’altra.'],
      ['falls Punkte > 10 dann\n  sage „Gewonnen!“\nsonst\n  sage „Weiter so!“', 'se punti > 10 allora\n  di’ “Hai vinto!”\naltrimenti\n  di’ “Continua così!”'],
      ['Ereignisse starten Programme: „Wenn grüne Flagge angeklickt“.', 'Gli eventi avviano i programmi: “quando si clicca sulla bandiera verde”.'])
  ], [
    ['Die Variable am Anfang nicht zurücksetzen – dann zählt sie beim zweiten Spiel weiter.', 'Non azzerare la variabile all’inizio: al secondo gioco continua a contare.']
  ], [
    term(['Variable', 'Variabile'], ['Speicherplatz mit Namen.', 'Spazio di memoria con un nome.']),
    term(['Bedingung', 'Condizione'], ['Frage, die wahr oder falsch ist.', 'Domanda che può essere vera o falsa.'])
  ]),

  'code-schleifen': theory([
    sec(['Warum Schleifen?', 'Perché i cicli?'],
      ['Statt einen Befehl zehnmal hinzuschreiben, sagst du: „Wiederhole 10-mal“. Das Programm wird kürzer und Fehler lassen sich leichter beheben.',
        'Invece di scrivere un comando dieci volte dici: “ripeti 10 volte”. Il programma è più corto e gli errori si correggono più facilmente.'],
      ['wiederhole 4-mal:\n  gehe 10 Schritte\n  drehe 90°\n→ zeichnet ein Quadrat', 'ripeti 4 volte:\n  fai 10 passi\n  ruota di 90°\n→ disegna un quadrato']),
    sec(['Zählschleife und Bedingungsschleife', 'Ciclo con contatore e ciclo con condizione'],
      ['Zählschleife: Die Anzahl steht fest (wiederhole 5-mal, in Python: for i in range(5)). Bedingungsschleife: wiederhole, bis etwas eintritt (while).',
        'Ciclo con contatore: il numero è fisso (ripeti 5 volte, in Python: for i in range(5)). Ciclo con condizione: ripeti finché succede qualcosa (while).'],
      ['for i in range(3):\n    print(i)\n→ 0, 1, 2', 'for i in range(3):\n    print(i)\n→ 0, 1, 2']),
    sec(['Verschachtelte Schleifen', 'Cicli annidati'],
      ['Eine Schleife in einer Schleife: Die innere läuft bei jedem Durchgang der äußeren komplett durch. 3 äußere · 4 innere = 12 Durchläufe.',
        'Un ciclo dentro un ciclo: quello interno si ripete tutto a ogni giro di quello esterno. 3 esterni × 4 interni = 12 giri.'],
      undefined,
      ['Achtung Endlosschleife: Wird die Bedingung nie falsch, läuft das Programm für immer.', 'Attenzione al ciclo infinito: se la condizione non diventa mai falsa, il programma non finisce.'])
  ], [
    ['range(5) liefert 0 bis 4, nicht 1 bis 5.', 'range(5) dà 0–4, non 1–5.']
  ], [
    term(['Schleife', 'Ciclo'], ['Wiederholung eines Programmteils.', 'Ripetizione di una parte del programma.']),
    term(['Durchlauf', 'Iterazione'], ['Ein einzelnes Ausführen der Schleife.', 'Una singola esecuzione del ciclo.'])
  ]),

  'code-python': theory([
    sec(['Ausgabe und Variablen', 'Output e variabili'],
      ['print() gibt etwas aus. Variablen bekommen mit = einen Wert. Datentypen: int (ganze Zahl), float (Kommazahl), str (Text), bool (True/False).',
        'print() stampa qualcosa. Alle variabili si assegna un valore con =. Tipi: int (intero), float (decimale), str (testo), bool (True/False).'],
      ['x = 5\nname = "Puppy"\nprint(name, x * 2)\n→ Puppy 10', 'x = 5\nnome = "Puppy"\nprint(nome, x * 2)\n→ Puppy 10']),
    sec(['Rechnen und Vergleichen', 'Calcoli e confronti'],
      ['+, −, *, / (Division, Ergebnis float), // (ganzzahlige Division), % (Rest), ** (Potenz). Vergleiche: ==, !=, <, >, <=, >=. Text + Text klebt zusammen.',
        '+, −, *, / (divisione, risultato float), // (divisione intera), % (resto), ** (potenza). Confronti: ==, !=, <, >, <=, >=. Testo + testo li unisce.'],
      ['7 // 2 → 3\n7 % 2 → 1\n2 ** 3 → 8\n"ab" + "c" → "abc"', '7 // 2 → 3\n7 % 2 → 1\n2 ** 3 → 8\n"ab" + "c" → "abc"']),
    sec(['if, for, Listen und Funktionen', 'if, for, liste e funzioni'],
      ['if/elif/else entscheiden. Einrückung (4 Leerzeichen) zeigt, was dazugehört. Listen speichern mehrere Werte, der erste Index ist 0. Funktionen (def) bündeln Code und geben mit return etwas zurück.',
        'if/elif/else decidono. Il rientro (4 spazi) indica che cosa appartiene al blocco. Le liste contengono più valori, il primo indice è 0. Le funzioni (def) raggruppano codice e restituiscono con return.'],
      ['zahlen = [3, 8, 1]\nfor z in zahlen:\n    if z > 2:\n        print(z)\n→ 3, 8\n\ndef doppelt(n):\n    return n * 2', 'numeri = [3, 8, 1]\nfor n in numeri:\n    if n > 2:\n        print(n)\n→ 3, 8\n\ndef doppio(n):\n    return n * 2'],
      ['Lies Code wie der Computer: Zeile für Zeile, und schreibe dir die Werte der Variablen auf.', 'Leggi il codice come il computer: riga per riga, segnando i valori delle variabili.'])
  ], [
    ['= (Zuweisung) und == (Vergleich) verwechseln.', 'Confondere = (assegnazione) e == (confronto).'],
    ['Listenindex bei 1 statt 0 beginnen.', 'Far partire l’indice delle liste da 1 invece che da 0.']
  ], [
    term(['Datentyp', 'Tipo di dato'], ['Art eines Werts: int, str …', 'Natura di un valore: int, str …']),
    term(['Funktion', 'Funzione'], ['Benannter, wiederverwendbarer Codeblock.', 'Blocco di codice con un nome, riutilizzabile.'])
  ]),

  'code-bugs': theory([
    sec(['Arten von Fehlern', 'Tipi di errore'],
      ['Syntaxfehler: Der Code ist kein gültiges Python (fehlender Doppelpunkt, Klammer). Laufzeitfehler: Das Programm stürzt beim Ausführen ab (Division durch 0, falscher Index). Logikfehler: Es läuft, rechnet aber falsch.',
        'Errore di sintassi: il codice non è Python valido (manca i due punti, una parentesi). Errore di esecuzione: il programma si blocca (divisione per 0, indice sbagliato). Errore logico: funziona ma dà un risultato sbagliato.'],
      ['if x > 3     ← SyntaxError: „:“ fehlt\nliste[5]     ← IndexError\nsumme = a - b  ← Logikfehler, sollte + sein', 'if x > 3     ← SyntaxError: manca “:”\nlista[5]     ← IndexError\nsomma = a - b  ← errore logico, doveva essere +']),
    sec(['Fehlermeldungen lesen', 'Leggere i messaggi di errore'],
      ['Python zeigt Typ, Zeile und Beschreibung des Fehlers. Lies die letzte Zeile zuerst: NameError (Name unbekannt, oft Tippfehler), TypeError (falscher Datentyp, z. B. "3" + 4), IndentationError (Einrückung).',
        'Python indica tipo, riga e descrizione dell’errore. Leggi prima l’ultima riga: NameError (nome sconosciuto, spesso un refuso), TypeError (tipo sbagliato, es. "3" + 4), IndentationError (rientro).']),
    sec(['Debugging-Strategien', 'Strategie di debug'],
      ['Mit print() Zwischenwerte ausgeben, Code in kleinen Teilen testen, Randfälle prüfen (leere Liste, 0, negative Zahlen), den Code jemandem erklären (Quietscheentchen-Methode).',
        'Stampare valori intermedi con print(), provare il codice a pezzi, controllare i casi limite (lista vuota, 0, numeri negativi), spiegare il codice a qualcuno (metodo della paperella di gomma).'],
      undefined,
      ['Off-by-one: Der häufigste Fehler ist eine Schleife, die einmal zu oft oder zu wenig läuft.', 'Off-by-one: l’errore più comune è un ciclo che gira una volta di troppo o di meno.'])
  ], [
    ['Nur auf die erste statt die letzte Zeile der Fehlermeldung schauen.', 'Guardare solo la prima riga del messaggio di errore e non l’ultima.']
  ], [
    term(['Bug', 'Bug'], ['Fehler im Programm.', 'Errore nel programma.']),
    term(['Debugging', 'Debug'], ['Fehler finden und beheben.', 'Trovare e correggere gli errori.'])
  ])
};
