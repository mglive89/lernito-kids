import { sec, term, theory, type Theory } from './types';

/** Mathematik Sekundarstufe I und II (medie / superiori) */
export const MATH_SEK: Record<string, Theory> = {
  'ms-dezimal': theory([
    sec(['Stellen nach dem Komma', 'Le cifre dopo la virgola'],
      ['Dezimalzahlen setzen die Stellenwerttafel nach rechts fort: Nach den Einern kommen Zehntel (z), Hundertstel (h) und Tausendstel (t). 0,1 ist ein Zehntel von 1, also 1/10.',
        'I numeri decimali continuano la tabella delle posizioni verso destra: dopo le unità vengono i decimi (d), i centesimi (c) e i millesimi (m). 0,1 è un decimo di 1, cioè 1/10.'],
      ['3,275 = 3 E + 2 z + 7 h + 5 t = 3 + 2/10 + 7/100 + 5/1000', '3,275 = 3 u + 2 d + 7 c + 5 m = 3 + 2/10 + 7/100 + 5/1000']),
    sec(['Vergleichen und runden', 'Confrontare e arrotondare'],
      ['Vergleiche Stelle für Stelle von links. Hilfreich: Fülle mit Nullen auf, bis beide Zahlen gleich viele Nachkommastellen haben. Nullen am Ende ändern den Wert nicht.',
        'Confronta cifra per cifra da sinistra. Un aiuto: aggiungi zeri finché i due numeri hanno lo stesso numero di decimali. Gli zeri in fondo non cambiano il valore.'],
      ['0,7 und 0,65 → 0,70 und 0,65 → 0,70 > 0,65\n2,368 auf Hundertstel → 2,37', '0,7 e 0,65 → 0,70 e 0,65 → 0,70 > 0,65\n2,368 ai centesimi → 2,37']),
    sec(['Rechnen mit Dezimalzahlen', 'Calcolare con i decimali'],
      ['Addition und Subtraktion: Komma unter Komma. Multiplikation: zuerst ohne Komma rechnen, dann so viele Nachkommastellen setzen, wie beide Faktoren zusammen haben. Division durch eine Dezimalzahl: Komma bei beiden Zahlen gleich weit verschieben, bis der Divisor ganz ist.',
        'Addizione e sottrazione: virgola sotto virgola. Moltiplicazione: calcola senza virgola, poi metti tanti decimali quanti ne hanno i due fattori insieme. Divisione per un decimale: sposta la virgola nei due numeri dello stesso numero di posti finché il divisore è intero.'],
      ['1,2 · 0,3 → 12 · 3 = 36 → 2 Stellen → 0,36\n4,8 : 0,6 = 48 : 6 = 8', '1,2 × 0,3 → 12 × 3 = 36 → 2 decimali → 0,36\n4,8 : 0,6 = 48 : 6 = 8'],
      ['Mal 10, 100, 1000 verschiebt das Komma um 1, 2, 3 Stellen nach rechts; geteilt nach links.', 'Per 10, 100, 1000 sposti la virgola di 1, 2, 3 posti a destra; diviso, a sinistra.'])
  ], [
    ['0,65 für größer halten als 0,7, weil 65 > 7. Immer Stelle für Stelle vergleichen.', 'Pensare che 0,65 sia maggiore di 0,7 perché 65 > 7. Confronta sempre cifra per cifra.'],
    ['Beim Malnehmen das Komma einfach untereinander setzen wie beim Addieren.', 'Nella moltiplicazione mettere la virgola come nell’addizione.']
  ], [
    term(['Zehntel', 'Decimo'], ['1/10 = 0,1', '1/10 = 0,1']),
    term(['Nachkommastelle', 'Cifra decimale'], ['Ziffer rechts vom Komma.', 'Cifra a destra della virgola.'])
  ]),

  'ms-brueche': theory([
    sec(['Kürzen und Erweitern', 'Semplificare e ampliare'],
      ['Erweitern heißt: Zähler und Nenner mit derselben Zahl multiplizieren. Kürzen heißt: beide durch dieselbe Zahl teilen. Der Wert des Bruchs bleibt gleich, nur die Einteilung ändert sich. Vollständig gekürzt ist ein Bruch, wenn Zähler und Nenner keinen gemeinsamen Teiler mehr haben.',
        'Ampliare vuol dire moltiplicare numeratore e denominatore per lo stesso numero. Semplificare vuol dire dividerli entrambi per lo stesso numero. Il valore non cambia. Una frazione è ridotta ai minimi termini quando numeratore e denominatore non hanno più divisori comuni.'],
      ['2/3 = 8/12 (mit 4 erweitert)\n18/24 = 3/4 (mit 6 gekürzt)', '2/3 = 8/12 (ampliata per 4)\n18/24 = 3/4 (semplificata per 6)']),
    sec(['Addieren und Subtrahieren', 'Addizione e sottrazione'],
      ['Brüche kann man nur addieren, wenn sie gleichnamig sind (gleicher Nenner). Suche den Hauptnenner (das kgV der Nenner), erweitere beide Brüche und addiere dann nur die Zähler.',
        'Si possono sommare solo frazioni con lo stesso denominatore. Trova il minimo comune denominatore (il mcm dei denominatori), trasforma le frazioni e poi somma solo i numeratori.'],
      ['3/4 + 1/6\nHauptnenner 12\n9/12 + 2/12 = 11/12', '3/4 + 1/6\nm.c.d. 12\n9/12 + 2/12 = 11/12']),
    sec(['Multiplizieren und Dividieren', 'Moltiplicazione e divisione'],
      ['Multiplizieren: Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit. Dividieren: mit dem Kehrwert des zweiten Bruchs multiplizieren.',
        'Moltiplicazione: numeratore per numeratore, denominatore per denominatore. Semplificare prima fa risparmiare lavoro. Divisione: moltiplica per l’inverso (reciproco) della seconda frazione.'],
      ['2/3 · 9/10 = 18/30 = 3/5\n3/4 : 3/8 = 3/4 · 8/3 = 2', '2/3 × 9/10 = 18/30 = 3/5\n3/4 : 3/8 = 3/4 × 8/3 = 2']),
    sec(['Brüche, Dezimalzahlen, Prozent', 'Frazioni, decimali, percentuali'],
      ['Jeder Bruch ist eine Division: 3/4 = 3 : 4 = 0,75 = 75 %. Manche Brüche ergeben periodische Dezimalzahlen: 1/3 = 0,333…',
        'Ogni frazione è una divisione: 3/4 = 3 : 4 = 0,75 = 75 %. Alcune frazioni danno numeri periodici: 1/3 = 0,333… = 0,3̅'],
      ['1/2 = 0,5 = 50 %\n1/4 = 0,25 = 25 %\n1/5 = 0,2 = 20 %', '1/2 = 0,5 = 50 %\n1/4 = 0,25 = 25 %\n1/5 = 0,2 = 20 %'])
  ], [
    ['Zähler plus Zähler und Nenner plus Nenner rechnen: 1/2 + 1/3 ist nicht 2/5.', 'Sommare numeratori e denominatori: 1/2 + 1/3 non fa 2/5.'],
    ['Beim Dividieren den ersten statt den zweiten Bruch umdrehen.', 'Nella divisione capovolgere la prima frazione invece della seconda.']
  ], [
    term(['Hauptnenner', 'Minimo comune denominatore'], ['Kleinster gemeinsamer Nenner zweier Brüche.', 'Il più piccolo denominatore comune a due frazioni.']),
    term(['Kehrwert', 'Reciproco'], ['Zähler und Nenner vertauscht: 3/5 → 5/3.', 'Numeratore e denominatore scambiati: 3/5 → 5/3.']),
    term(['unechter Bruch', 'Frazione impropria'], ['Zähler größer als Nenner, z. B. 7/4 = 1 3/4.', 'Numeratore maggiore del denominatore, per esempio 7/4.'])
  ]),

  'ms-teilbarkeit': theory([
    sec(['Teiler und Vielfache', 'Divisori e multipli'],
      ['a ist ein Teiler von b, wenn b : a ohne Rest aufgeht. b ist dann ein Vielfaches von a. Jede Zahl hat 1 und sich selbst als Teiler.',
        'a è un divisore di b se b : a non dà resto. Allora b è un multiplo di a. Ogni numero ha come divisori 1 e se stesso.'],
      ['Teiler von 12: 1, 2, 3, 4, 6, 12\nVielfache von 4: 4, 8, 12, 16 …', 'Divisori di 12: 1, 2, 3, 4, 6, 12\nMultipli di 4: 4, 8, 12, 16 …']),
    sec(['Teilbarkeitsregeln', 'Criteri di divisibilità'],
      ['Durch 2: letzte Ziffer gerade. Durch 3: Quersumme durch 3 teilbar. Durch 4: die letzten zwei Ziffern durch 4 teilbar. Durch 5: letzte Ziffer 0 oder 5. Durch 9: Quersumme durch 9 teilbar. Durch 10: letzte Ziffer 0.',
        'Per 2: ultima cifra pari. Per 3: somma delle cifre divisibile per 3. Per 4: ultime due cifre divisibili per 4. Per 5: termina con 0 o 5. Per 9: somma delle cifre divisibile per 9. Per 10: termina con 0.'],
      ['4 716: Quersumme 4+7+1+6 = 18 → durch 3 und durch 9 teilbar', '4 716: somma delle cifre 4+7+1+6 = 18 → divisibile per 3 e per 9']),
    sec(['Primzahlen und Primfaktorzerlegung', 'Numeri primi e scomposizione'],
      ['Primzahlen haben genau zwei Teiler: 1 und sich selbst (2, 3, 5, 7, 11, 13 …). Die 1 ist keine Primzahl. Jede Zahl lässt sich eindeutig als Produkt von Primzahlen schreiben.',
        'I numeri primi hanno esattamente due divisori: 1 e se stessi (2, 3, 5, 7, 11, 13 …). L’1 non è primo. Ogni numero si scrive in un solo modo come prodotto di numeri primi.'],
      ['60 = 2 · 2 · 3 · 5 = 2² · 3 · 5', '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5']),
    sec(['ggT und kgV', 'MCD e mcm'],
      ['Der ggT (größter gemeinsamer Teiler) hilft beim Kürzen, das kgV (kleinstes gemeinsames Vielfaches) beim Finden des Hauptnenners. Mit Primfaktoren: ggT = gemeinsame Faktoren mit kleinstem Exponenten, kgV = alle Faktoren mit größtem Exponenten.',
        'Il MCD (massimo comune divisore) serve a semplificare, il mcm (minimo comune multiplo) a trovare il denominatore comune. Con i fattori primi: MCD = fattori comuni con esponente minore, mcm = fattori comuni e non comuni con esponente maggiore.'],
      ['12 = 2² · 3, 18 = 2 · 3²\nggT = 2 · 3 = 6\nkgV = 2² · 3² = 36', '12 = 2² × 3, 18 = 2 × 3²\nMCD = 2 × 3 = 6\nmcm = 2² × 3² = 36'])
  ], [
    ['Die 1 als Primzahl zählen.', 'Considerare 1 un numero primo.'],
    ['ggT und kgV verwechseln: Der ggT ist höchstens so groß wie die kleinere Zahl, das kgV mindestens so groß wie die größere.', 'Confondere MCD e mcm: il MCD non supera il numero più piccolo, il mcm non è minore del più grande.']
  ], [
    term(['Quersumme', 'Somma delle cifre'], ['Summe aller Ziffern einer Zahl.', 'Somma di tutte le cifre di un numero.']),
    term(['Primzahl', 'Numero primo'], ['Zahl mit genau zwei Teilern.', 'Numero con esattamente due divisori.'])
  ]),

  'ms-flaechen': theory([
    sec(['Umfang', 'Perimetro'],
      ['Der Umfang ist die Länge des Randes einer Figur. Du addierst alle Seitenlängen. Er hat eine normale Längeneinheit (cm, m).',
        'Il perimetro è la lunghezza del contorno. Si sommano tutti i lati. Si misura in unità di lunghezza (cm, m).'],
      ['Rechteck 5 cm × 3 cm: u = 2 · 5 + 2 · 3 = 16 cm', 'Rettangolo 5 cm × 3 cm: 2p = 2 × 5 + 2 × 3 = 16 cm']),
    sec(['Flächeninhalt', 'Area'],
      ['Der Flächeninhalt sagt, wie viele Einheitsquadrate (z. B. 1 cm × 1 cm = 1 cm²) in die Figur passen. Beim Rechteck: Länge mal Breite.',
        'L’area dice quanti quadratini unitari (per esempio 1 cm × 1 cm = 1 cm²) entrano nella figura. Nel rettangolo: base per altezza.'],
      ['Rechteck 5 cm × 3 cm: A = 15 cm²\nQuadrat a = 4 cm: A = 16 cm²', 'Rettangolo 5 cm × 3 cm: A = 15 cm²\nQuadrato l = 4 cm: A = 16 cm²']),
    sec(['Dreieck, Parallelogramm, Trapez', 'Triangolo, parallelogramma, trapezio'],
      ['Ein Parallelogramm kann man in ein Rechteck umlegen: A = g · h. Ein Dreieck ist ein halbes Parallelogramm: A = g · h / 2. Trapez: A = (a + c) / 2 · h. Die Höhe steht immer senkrecht auf der Grundseite!',
        'Un parallelogramma si può trasformare in un rettangolo: A = b · h. Un triangolo è mezzo parallelogramma: A = b · h / 2. Trapezio: A = (B + b) · h / 2. L’altezza è sempre perpendicolare alla base!'],
      ['Dreieck g = 8 cm, h = 5 cm: A = 8 · 5 / 2 = 20 cm²', 'Triangolo b = 8 cm, h = 5 cm: A = 8 × 5 / 2 = 20 cm²']),
    sec(['Flächeneinheiten umrechnen', 'Equivalenze di superficie'],
      ['Bei Flächen ist der Umrechnungsfaktor 100, nicht 10: 1 cm² = 100 mm², 1 m² = 100 dm² = 10 000 cm². 1 a (Ar) = 100 m², 1 ha (Hektar) = 100 a.',
        'Per le superfici il fattore è 100, non 10: 1 cm² = 100 mm², 1 m² = 100 dm² = 10 000 cm². 1 ara = 100 m², 1 ettaro = 100 are.'],
      undefined,
      ['Warum 100? Ein 1-cm-Quadrat ist 10 mm lang und 10 mm breit: 10 · 10 = 100.', 'Perché 100? Un quadrato di 1 cm è lungo 10 mm e largo 10 mm: 10 × 10 = 100.'])
  ], [
    ['Umfang und Fläche verwechseln oder die Einheit cm statt cm² schreiben.', 'Confondere perimetro e area o scrivere cm invece di cm².'],
    ['Beim Dreieck eine schräge Seite als Höhe nehmen.', 'Nel triangolo usare un lato obliquo come altezza.'],
    ['Flächeneinheiten mit Faktor 10 umrechnen.', 'Usare il fattore 10 nelle equivalenze di superficie.']
  ], [
    term(['Höhe', 'Altezza'], ['Senkrechter Abstand von der Grundseite zur gegenüberliegenden Ecke oder Seite.', 'Distanza perpendicolare dalla base al vertice o lato opposto.']),
    term(['Quadratzentimeter (cm²)', 'Centimetro quadrato (cm²)'], ['Fläche eines Quadrats mit 1 cm Seitenlänge.', 'Area di un quadrato di lato 1 cm.'])
  ]),

  'ms-negativ': theory([
    sec(['Zahlen unter null', 'Numeri sotto lo zero'],
      ['Negative Zahlen kennst du vom Thermometer (−5 °C) oder vom Kontostand. Auf dem Zahlenstrahl liegen sie links von der 0. Der Betrag ist der Abstand zur 0: |−5| = 5. Zahlen mit gleichem Betrag und anderem Vorzeichen heißen Gegenzahlen.',
        'I numeri negativi li conosci dal termometro (−5 °C) o dal conto in banca. Sulla retta stanno a sinistra dello 0. Il valore assoluto è la distanza da 0: |−5| = 5. Numeri con lo stesso valore assoluto e segno diverso si dicono opposti.'],
      ['−7 < −2 < 0 < 3', '−7 < −2 < 0 < 3']),
    sec(['Addieren und Subtrahieren', 'Addizione e sottrazione'],
      ['Gleiche Vorzeichen: Beträge addieren, Vorzeichen behalten. Verschiedene Vorzeichen: kleineren Betrag vom größeren abziehen, Vorzeichen der Zahl mit größerem Betrag. Eine Zahl subtrahieren heißt ihre Gegenzahl addieren.',
        'Segni uguali: sommi i valori assoluti e tieni il segno. Segni diversi: sottrai il valore assoluto minore dal maggiore e metti il segno del numero con valore assoluto maggiore. Sottrarre un numero vuol dire sommare il suo opposto.'],
      ['(−4) + (−3) = −7\n(−9) + 5 = −4\n6 − (−2) = 6 + 2 = 8', '(−4) + (−3) = −7\n(−9) + 5 = −4\n6 − (−2) = 6 + 2 = 8']),
    sec(['Multiplizieren und Dividieren', 'Moltiplicazione e divisione'],
      ['Rechne mit den Beträgen und bestimme danach das Vorzeichen: gleiche Vorzeichen → plus, verschiedene Vorzeichen → minus.',
        'Calcola con i valori assoluti e poi decidi il segno: segni uguali → più, segni diversi → meno (regola dei segni).'],
      ['(−3) · (−5) = 15\n(−24) : 6 = −4\n(−2)³ = −8', '(−3) × (−5) = 15\n(−24) : 6 = −4\n(−2)³ = −8'],
      ['Bei vielen Faktoren: Eine gerade Anzahl Minuszeichen ergibt plus, eine ungerade minus.', 'Con tanti fattori: un numero pari di segni meno dà più, dispari dà meno.'])
  ], [
    ['−7 für größer als −2 halten. Auf dem Zahlenstrahl liegt −7 weiter links, also ist sie kleiner.', 'Pensare che −7 sia maggiore di −2. Sulla retta −7 sta più a sinistra, quindi è minore.'],
    ['Die Regel „minus mal minus gibt plus“ auch beim Addieren anwenden: (−3) + (−5) ist −8, nicht 8.', 'Usare “meno per meno fa più” anche nell’addizione: (−3) + (−5) fa −8, non 8.']
  ], [
    term(['Betrag', 'Valore assoluto'], ['Abstand einer Zahl zur 0, immer positiv.', 'Distanza di un numero dallo 0, sempre positiva.']),
    term(['Gegenzahl', 'Opposto'], ['Gleicher Betrag, anderes Vorzeichen: 4 und −4.', 'Stesso valore assoluto, segno diverso: 4 e −4.'])
  ]),

  'ms-winkel': theory([
    sec(['Was ist ein Winkel?', 'Che cos’è un angolo?'],
      ['Ein Winkel entsteht, wenn zwei Strahlen (Schenkel) vom selben Punkt (Scheitel) ausgehen. Man misst ihn mit dem Geodreieck in Grad. Ein voller Kreis hat 360°.',
        'Un angolo è formato da due semirette (lati) che partono dallo stesso punto (vertice). Si misura con il goniometro in gradi. Un giro completo è 360°.'],
      ['Spitz: < 90°\nRecht: = 90°\nStumpf: 90°–180°\nGestreckt: 180°\nÜberstumpf: 180°–360°\nVoll: 360°', 'Acuto: < 90°\nRetto: = 90°\nOttuso: tra 90° e 180°\nPiatto: 180°\nConcavo: tra 180° e 360°\nGiro: 360°']),
    sec(['Winkel an Geraden', 'Angoli tra rette'],
      ['Nebenwinkel liegen nebeneinander an einer Geraden und ergeben zusammen 180°. Scheitelwinkel liegen sich gegenüber und sind gleich groß. Werden zwei Parallelen geschnitten, sind Stufenwinkel und Wechselwinkel gleich groß.',
        'Angoli adiacenti stanno uno accanto all’altro su una retta e sommano 180°. Angoli opposti al vertice sono uguali. Se una retta taglia due parallele, gli angoli corrispondenti e alterni sono uguali.'],
      ['Ein Winkel ist 65° → Nebenwinkel 115°, Scheitelwinkel 65°', 'Un angolo è 65° → adiacente 115°, opposto al vertice 65°']),
    sec(['Winkelsummen', 'Somme degli angoli'],
      ['Im Dreieck ergeben die drei Innenwinkel immer 180°, im Viereck 360°. Allgemein hat ein n-Eck die Winkelsumme (n − 2) · 180°.',
        'In un triangolo i tre angoli interni sommano sempre 180°, in un quadrilatero 360°. In generale un poligono con n lati ha somma (n − 2) · 180°.'],
      ['Dreieck mit 50° und 70° → dritter Winkel 180° − 120° = 60°\nFünfeck: 3 · 180° = 540°', 'Triangolo con 50° e 70° → terzo angolo 180° − 120° = 60°\nPentagono: 3 × 180° = 540°'],
      ['Reißt man die Ecken eines Papierdreiecks ab und legt sie aneinander, ergeben sie eine gerade Linie: 180°.', 'Se strappi gli angoli di un triangolo di carta e li accosti, formano una linea retta: 180°.'])
  ], [
    ['Am Geodreieck die falsche Skala ablesen (innen statt außen). Vorher schätzen: spitz oder stumpf?', 'Leggere la scala sbagliata del goniometro. Prima stima: acuto o ottuso?'],
    ['Nebenwinkel (180°) mit Scheitelwinkeln (gleich groß) verwechseln.', 'Confondere angoli adiacenti (180°) e opposti al vertice (uguali).']
  ], [
    term(['Scheitel', 'Vertice'], ['Punkt, an dem die Schenkel beginnen.', 'Punto da cui partono i lati.']),
    term(['Grad (°)', 'Grado (°)'], ['Ein 360stel eines vollen Kreises.', 'Un trecentosessantesimo di giro.'])
  ]),

  'ms-statistik': theory([
    sec(['Daten sammeln und darstellen', 'Raccogliere e rappresentare i dati'],
      ['Daten erhebst du z. B. mit einer Umfrage. Mit einer Strichliste zählst du, die absolute Häufigkeit sagt, wie oft ein Wert vorkommt. Die relative Häufigkeit ist der Anteil: absolute Häufigkeit durch Gesamtzahl. Darstellen kannst du mit Säulen-, Balken-, Kreis- oder Liniendiagrammen.',
        'I dati si raccolgono per esempio con un sondaggio. Con una tabella di frequenza conti quante volte compare ogni valore (frequenza assoluta). La frequenza relativa è la parte sul totale. Si rappresentano con istogrammi, ideogrammi, aerogrammi (torte) o grafici a linee.'],
      ['20 Kinder, 8 mögen Fußball → relative Häufigkeit 8/20 = 0,4 = 40 %', '20 ragazzi, 8 preferiscono il calcio → frequenza relativa 8/20 = 0,4 = 40 %']),
    sec(['Mittelwerte', 'Valori medi'],
      ['Arithmetisches Mittel: Summe aller Werte durch Anzahl. Median (Zentralwert): Werte ordnen, der mittlere ist der Median (bei gerader Anzahl: Mittel der beiden mittleren). Modus: der häufigste Wert.',
        'Media aritmetica: somma dei valori diviso il loro numero. Mediana: ordina i valori, quello centrale è la mediana (se sono pari, la media dei due centrali). Moda: il valore più frequente.'],
      ['Noten 2, 3, 3, 4, 8\nMittel = 20 / 5 = 4\nMedian = 3\nModus = 3', 'Voti 4, 6, 6, 7, 10\nMedia = 33 / 5 = 6,6\nMediana = 6\nModa = 6'],
      ['Ein Ausreißer (wie die 8 oben) verändert das Mittel stark, den Median kaum.', 'Un valore anomalo cambia molto la media ma quasi per niente la mediana.']),
    sec(['Streuung', 'Dispersione'],
      ['Wie weit liegen die Werte auseinander? Die Spannweite ist Maximum minus Minimum. Im Boxplot siehst du Minimum, unteres Quartil, Median, oberes Quartil und Maximum auf einen Blick.',
        'Quanto sono distanti i dati? Il campo di variazione è massimo meno minimo. Nel box-plot vedi minimo, primo quartile, mediana, terzo quartile e massimo.'],
      ['Werte 12, 15, 15, 19, 24 → Spannweite 24 − 12 = 12', 'Valori 12, 15, 15, 19, 24 → campo di variazione 24 − 12 = 12'])
  ], [
    ['Beim Median vergessen, die Werte vorher zu ordnen.', 'Calcolare la mediana senza ordinare i valori.'],
    ['Diagramme mit abgeschnittener Achse falsch deuten: Unterschiede wirken größer, als sie sind.', 'Leggere male grafici con l’asse tagliato: le differenze sembrano più grandi.']
  ], [
    term(['Median', 'Mediana'], ['Der mittlere Wert einer geordneten Liste.', 'Valore centrale di una lista ordinata.']),
    term(['relative Häufigkeit', 'Frequenza relativa'], ['Anteil eines Wertes an allen Werten.', 'Parte di un valore sul totale.'])
  ]),

  'ms-dreisatz': theory([
    sec(['Proportionale Zuordnungen', 'Proporzionalità diretta'],
      ['Zwei Größen sind proportional, wenn zum Doppelten der einen das Doppelte der anderen gehört. Der Quotient y : x ist immer gleich (Proportionalitätsfaktor). Im Koordinatensystem ergibt sich eine Gerade durch den Ursprung.',
        'Due grandezze sono direttamente proporzionali se al doppio dell’una corrisponde il doppio dell’altra. Il rapporto y : x è costante. Nel piano cartesiano si ottiene una retta che passa per l’origine.'],
      ['4 Brötchen kosten 2 €\n1 Brötchen: 2 € : 4 = 0,50 €\n7 Brötchen: 7 · 0,50 € = 3,50 €', '4 panini costano 2 €\n1 panino: 2 € : 4 = 0,50 €\n7 panini: 7 × 0,50 € = 3,50 €']),
    sec(['Antiproportionale Zuordnungen', 'Proporzionalità inversa'],
      ['Gehört zum Doppelten der einen Größe die Hälfte der anderen, ist die Zuordnung antiproportional. Das Produkt x · y bleibt gleich.',
        'Se al doppio di una grandezza corrisponde la metà dell’altra, la proporzionalità è inversa. Il prodotto x · y resta costante.'],
      ['3 Maler brauchen 8 Tage\n1 Maler: 3 · 8 = 24 Tage\n4 Maler: 24 : 4 = 6 Tage', '3 imbianchini impiegano 8 giorni\n1 imbianchino: 3 × 8 = 24 giorni\n4 imbianchini: 24 : 4 = 6 giorni']),
    sec(['Verhältnisgleichungen', 'Le proporzioni'],
      ['In Italien rechnet man oft mit Proportionen: a : b = c : d. Das Produkt der Außenglieder ist gleich dem Produkt der Innenglieder (a · d = b · c). So findet man eine unbekannte Größe.',
        'In Italia si usano spesso le proporzioni: a : b = c : d. Il prodotto degli estremi è uguale al prodotto dei medi (a · d = b · c). Così si trova un termine incognito.'],
      ['4 : 2 = 7 : x → 4x = 14 → x = 3,5', '4 : 2 = 7 : x → 4x = 14 → x = 3,5'],
      ['Nicht alles ist proportional! Das Alter und die Körpergröße eines Kindes z. B. nicht.', 'Non tutto è proporzionale! L’età e l’altezza di un bambino, per esempio, no.'])
  ], [
    ['Bei einer antiproportionalen Aufgabe proportional rechnen (mehr Arbeiter → mehr Tage).', 'Trattare come diretta una proporzionalità inversa (più operai → più giorni).'],
    ['Einheiten im Zwischenschritt vergessen.', 'Dimenticare le unità di misura nei passaggi.']
  ], [
    term(['Proportionalitätsfaktor', 'Costante di proporzionalità'], ['Der gleichbleibende Quotient y : x.', 'Il rapporto costante y : x.']),
    term(['Dreisatz', 'Regola del tre'], ['Rechnen in drei Schritten über die Einheit.', 'Calcolo in tre passi passando dall’unità.'])
  ]),

  'ms-prozent': theory([
    sec(['Die drei Größen', 'Le tre grandezze'],
      ['Grundwert G: das Ganze (100 %). Prozentsatz p %: der Anteil in Prozent. Prozentwert W: der Teil vom Ganzen. Es gilt: W = G · p / 100.',
        'Totale (intero): il 100 %. Percentuale p %: la parte in percento. Parte (valore percentuale): la quantità corrispondente. Vale: parte = totale · p / 100.'],
      ['20 % von 80 € → W = 80 · 20 / 100 = 16 €', '20 % di 80 € → parte = 80 × 20 / 100 = 16 €']),
    sec(['Grundwert und Prozentsatz berechnen', 'Calcolare totale e percentuale'],
      ['Gesucht p: p = W / G · 100. Gesucht G: G = W · 100 / p. Mit dem Dreisatz geht es auch: über 1 % rechnen.',
        'Cerchi p: p = parte / totale · 100. Cerchi il totale: totale = parte · 100 / p. Puoi anche usare la proporzione o passare dall’1 %.'],
      ['15 von 60 Schülern → p = 15/60 · 100 = 25 %\n30 % sind 12 kg → 1 % = 0,4 kg → 100 % = 40 kg', '15 alunni su 60 → p = 15/60 × 100 = 25 %\nIl 30 % è 12 kg → 1 % = 0,4 kg → 100 % = 40 kg']),
    sec(['Rabatt, Erhöhung, Zinsen', 'Sconti, aumenti, interessi'],
      ['Ein Preis um 20 % reduziert heißt: Man zahlt 80 % → mal 0,8. Eine Erhöhung um 20 % → mal 1,2. Zinsen pro Jahr: Z = K · p / 100.',
        'Un prezzo scontato del 20 %: paghi l’80 % → per 0,8. Un aumento del 20 % → per 1,2. Interesse annuo: I = C · r / 100.'],
      ['Jacke 60 €, 25 % Rabatt → 60 · 0,75 = 45 €', 'Giacca 60 €, sconto 25 % → 60 × 0,75 = 45 €'],
      ['+10 % und danach −10 % ergeben NICHT den alten Wert: 100 → 110 → 99.', '+10 % e poi −10 % NON riportano al valore iniziale: 100 → 110 → 99.'])
  ], [
    ['Prozentwert und Grundwert verwechseln. Frage: Was ist das Ganze?', 'Confondere parte e totale. Chiediti: qual è l’intero?'],
    ['Prozentpunkte und Prozent verwechseln: von 10 % auf 12 % sind 2 Prozentpunkte, aber 20 % mehr.', 'Confondere punti percentuali e percentuale: da 10 % a 12 % sono 2 punti, ma un aumento del 20 %.']
  ], [
    term(['Grundwert', 'Totale'], ['Das Ganze, entspricht 100 %.', 'L’intero, corrisponde al 100 %.']),
    term(['Wachstumsfaktor', 'Fattore di variazione'], ['Zahl, mit der man bei Zu- oder Abnahme multipliziert (z. B. 1,2).', 'Numero per cui moltiplichi in caso di aumento o diminuzione (es. 1,2).'])
  ]),

  'ms-terme': theory([
    sec(['Variablen und Terme', 'Lettere ed espressioni'],
      ['Eine Variable (meist x) ist ein Platzhalter für eine Zahl. Ein Term verbindet Zahlen und Variablen mit Rechenzeichen. Setzt man eine Zahl ein, kann man den Wert des Terms berechnen.',
        'Una lettera (di solito x) sta al posto di un numero. Un’espressione letterale unisce numeri e lettere con le operazioni. Sostituendo un numero si calcola il valore dell’espressione.'],
      ['T(x) = 3x + 2\nx = 4 → 3 · 4 + 2 = 14', 'E(x) = 3x + 2\nx = 4 → 3 × 4 + 2 = 14']),
    sec(['Zusammenfassen', 'Ridurre i termini simili'],
      ['Nur gleichartige Glieder (gleiche Variable mit gleicher Hochzahl) darf man addieren. Beim Multiplizieren multipliziert man die Zahlen und die Variablen getrennt.',
        'Si possono sommare solo i monomi simili (stessa parte letterale). Nella moltiplicazione moltiplichi i coefficienti e le lettere separatamente.'],
      ['4a + 3b − a + 2b = 3a + 5b\n2x · 5x = 10x²', '4a + 3b − a + 2b = 3a + 5b\n2x · 5x = 10x²']),
    sec(['Klammern auflösen', 'Togliere le parentesi'],
      ['Distributivgesetz: Jedes Glied in der Klammer wird mit dem Faktor davor multipliziert. Zwei Klammern: jedes mit jedem. Binomische Formeln sind Abkürzungen dafür.',
        'Proprietà distributiva: ogni termine nella parentesi si moltiplica per il fattore davanti. Due parentesi: ognuno per ognuno. I prodotti notevoli sono scorciatoie.'],
      ['3(x − 4) = 3x − 12\n(x + 2)(x + 5) = x² + 7x + 10\n(a + b)² = a² + 2ab + b²\n(a − b)² = a² − 2ab + b²\n(a + b)(a − b) = a² − b²', '3(x − 4) = 3x − 12\n(x + 2)(x + 5) = x² + 7x + 10\n(a + b)² = a² + 2ab + b²\n(a − b)² = a² − 2ab + b²\n(a + b)(a − b) = a² − b²'],
      ['Ausklammern ist der umgekehrte Weg: 6x + 9 = 3(2x + 3).', 'Raccogliere è il contrario: 6x + 9 = 3(2x + 3).'])
  ], [
    ['3x + 2 zu 5x zusammenfassen. Das geht nicht: 2 ist kein x-Glied.', 'Ridurre 3x + 2 a 5x. Non si può: 2 non ha la x.'],
    ['(a + b)² = a² + b² schreiben und das Mittelglied 2ab vergessen.', 'Scrivere (a + b)² = a² + b² dimenticando il doppio prodotto 2ab.']
  ], [
    term(['Variable', 'Variabile / lettera'], ['Platzhalter für eine Zahl.', 'Simbolo al posto di un numero.']),
    term(['Koeffizient', 'Coefficiente'], ['Die Zahl vor der Variablen.', 'Il numero davanti alla lettera.'])
  ]),

  'ms-gleichungen': theory([
    sec(['Die Waage im Gleichgewicht', 'La bilancia in equilibrio'],
      ['Eine Gleichung ist wie eine Waage: Links und rechts muss dasselbe stehen. Tust du auf beiden Seiten dasselbe (Äquivalenzumformung), bleibt sie im Gleichgewicht. Ziel: x allein auf einer Seite.',
        'Un’equazione è come una bilancia: i due membri devono pesare uguale. Se fai la stessa operazione su entrambi (principi di equivalenza), resta in equilibrio. Obiettivo: x da sola in un membro.'],
      ['5x − 3 = 2x + 9 | − 2x\n3x − 3 = 9 | + 3\n3x = 12 | : 3\nx = 4', '5x − 3 = 2x + 9 → porto 2x a sinistra\n3x − 3 = 9 → porto −3 a destra\n3x = 12 → divido per 3\nx = 4']),
    sec(['Gleichungen mit Klammern und Brüchen', 'Equazioni con parentesi e frazioni'],
      ['Zuerst Klammern auflösen, dann zusammenfassen. Bei Brüchen beide Seiten mit dem Hauptnenner multiplizieren, damit die Nenner verschwinden.',
        'Prima togli le parentesi e riduci. Con le frazioni moltiplica entrambi i membri per il minimo comune denominatore per eliminare i denominatori.'],
      ['x/2 + x/3 = 10 | · 6\n3x + 2x = 60\n5x = 60 → x = 12', 'x/2 + x/3 = 10 → moltiplico per 6\n3x + 2x = 60\n5x = 60 → x = 12']),
    sec(['Textaufgaben in Gleichungen übersetzen', 'Dai problemi alle equazioni'],
      ['Lege fest, wofür x steht. Übersetze jeden Satzteil in einen Term und setze gleich. Löse und mache die Probe im Text.',
        'Stabilisci che cosa rappresenta x. Traduci ogni parte del testo in un’espressione e uguaglia. Risolvi e verifica nel testo.'],
      ['„Das Dreifache einer Zahl, vermindert um 7, ergibt 20.“\n3x − 7 = 20 → x = 9', '“Il triplo di un numero diminuito di 7 è 20.”\n3x − 7 = 20 → x = 9'],
      ['Probe: Setze die Lösung in die Ausgangsgleichung ein.', 'Verifica: sostituisci la soluzione nell’equazione iniziale.'])
  ], [
    ['Nur eine Seite verändern.', 'Modificare solo un membro.'],
    ['Beim Herüberbringen das Vorzeichen nicht wechseln.', 'Spostando un termine non cambiare il segno.'],
    ['Durch 0 teilen oder durch eine Variable, die 0 sein könnte.', 'Dividere per 0 o per una lettera che potrebbe valere 0.']
  ], [
    term(['Äquivalenzumformung', 'Principio di equivalenza'], ['Umformung, die die Lösung nicht verändert.', 'Trasformazione che non cambia la soluzione.']),
    term(['Lösungsmenge', 'Insieme delle soluzioni'], ['Alle Zahlen, die die Gleichung erfüllen.', 'Tutti i numeri che soddisfano l’equazione.'])
  ]),

  'ms-wahrscheinlichkeit': theory([
    sec(['Zufallsexperimente', 'Esperimenti casuali'],
      ['Bei einem Zufallsexperiment kennt man die möglichen Ergebnisse, aber nicht, welches eintritt (Würfeln, Münzwurf, Ziehen aus einer Urne). Ein Ereignis ist eine Menge von Ergebnissen, z. B. „gerade Zahl würfeln“ = {2, 4, 6}.',
        'In un esperimento casuale conosci i risultati possibili ma non quale uscirà (dado, moneta, estrazione da un’urna). Un evento è un insieme di risultati, per esempio “esce un numero pari” = {2, 4, 6}.'],
      ['Würfel: Ergebnismenge {1, 2, 3, 4, 5, 6}', 'Dado: spazio dei risultati {1, 2, 3, 4, 5, 6}']),
    sec(['Laplace-Wahrscheinlichkeit', 'Probabilità classica'],
      ['Sind alle Ergebnisse gleich wahrscheinlich: P(E) = Anzahl günstiger Ergebnisse / Anzahl aller Ergebnisse. P liegt zwischen 0 (unmöglich) und 1 (sicher). P(Gegenereignis) = 1 − P(E).',
        'Se tutti i risultati sono ugualmente probabili: P(E) = casi favorevoli / casi possibili. P è tra 0 (impossibile) e 1 (certo). P(evento contrario) = 1 − P(E).'],
      ['Urne: 3 rote, 5 blaue Kugeln\nP(rot) = 3/8 = 37,5 %\nP(nicht rot) = 5/8', 'Urna: 3 palline rosse, 5 blu\nP(rossa) = 3/8 = 37,5 %\nP(non rossa) = 5/8']),
    sec(['Mehrstufige Experimente', 'Esperimenti in più fasi'],
      ['Mit einem Baumdiagramm stellst du mehrere Schritte dar. Pfadregel: Wahrscheinlichkeiten entlang eines Pfades multiplizieren. Summenregel: Wahrscheinlichkeiten mehrerer Pfade addieren.',
        'Con un diagramma ad albero rappresenti più fasi. Regola del prodotto: lungo un ramo si moltiplicano le probabilità. Regola della somma: tra rami diversi si sommano.'],
      ['Zweimal Münze: P(2× Kopf) = 1/2 · 1/2 = 1/4\nP(genau 1× Kopf) = 1/4 + 1/4 = 1/2', 'Due lanci di moneta: P(2 teste) = 1/2 × 1/2 = 1/4\nP(esattamente 1 testa) = 1/4 + 1/4 = 1/2'],
      ['Gesetz der großen Zahlen: Je öfter du würfelst, desto näher kommt die relative Häufigkeit an die Wahrscheinlichkeit.', 'Legge dei grandi numeri: più lanci fai, più la frequenza relativa si avvicina alla probabilità.'])
  ], [
    ['Denken, nach fünfmal „Zahl“ müsse jetzt „Kopf“ kommen. Die Münze hat kein Gedächtnis.', 'Pensare che dopo cinque “croce” debba uscire “testa”. La moneta non ha memoria.'],
    ['Beim Ziehen ohne Zurücklegen vergessen, dass sich die Anzahl der Kugeln ändert.', 'Nelle estrazioni senza reimmissione dimenticare che il numero di palline cambia.']
  ], [
    term(['Ereignis', 'Evento'], ['Teilmenge der möglichen Ergebnisse.', 'Sottoinsieme dei risultati possibili.']),
    term(['Gegenereignis', 'Evento contrario'], ['Alles, was nicht zum Ereignis gehört.', 'Tutto ciò che non fa parte dell’evento.'])
  ]),

  'ms-kreis': theory([
    sec(['Begriffe am Kreis', 'Elementi del cerchio'],
      ['Alle Punkte eines Kreises haben denselben Abstand vom Mittelpunkt M: den Radius r. Der Durchmesser d geht durch M und ist doppelt so lang: d = 2r.',
        'Tutti i punti della circonferenza hanno la stessa distanza dal centro O: il raggio r. Il diametro d passa per il centro ed è il doppio: d = 2r.'],
      undefined,
      ['Im Italienischen unterscheidet man „circonferenza“ (die Linie) und „cerchio“ (die Fläche).', 'In italiano si distingue la circonferenza (la linea) dal cerchio (la superficie).']),
    sec(['Die Zahl π', 'Il numero π'],
      ['Teilt man bei jedem Kreis den Umfang durch den Durchmesser, kommt immer dieselbe Zahl heraus: π ≈ 3,14159… π ist irrational, hat also unendlich viele Nachkommastellen ohne Muster.',
        'Se dividi la circonferenza di qualsiasi cerchio per il suo diametro ottieni sempre lo stesso numero: π ≈ 3,14159… π è irrazionale: ha infinite cifre decimali senza periodo.'],
      ['u = π · d = 2πr', 'C = π · d = 2πr']),
    sec(['Umfang und Fläche berechnen', 'Calcolare circonferenza e area'],
      ['Umfang: u = 2πr. Flächeninhalt: A = πr². Ein Kreissektor mit Winkel α ist der Anteil α/360° vom ganzen Kreis.',
        'Circonferenza: C = 2πr. Area: A = πr². Un settore circolare di ampiezza α è la parte α/360° del cerchio.'],
      ['r = 5 cm\nu = 2 · π · 5 ≈ 31,4 cm\nA = π · 25 ≈ 78,5 cm²\nViertelkreis: 78,5 / 4 ≈ 19,6 cm²', 'r = 5 cm\nC = 2 × π × 5 ≈ 31,4 cm\nA = π × 25 ≈ 78,5 cm²\nQuarto di cerchio: 78,5 / 4 ≈ 19,6 cm²'])
  ], [
    ['Radius und Durchmesser verwechseln. Ist d gegeben, zuerst r = d/2 berechnen.', 'Confondere raggio e diametro. Se hai d, calcola prima r = d/2.'],
    ['πr² als (πr)² rechnen. Nur r wird quadriert.', 'Calcolare πr² come (πr)². Solo r va al quadrato.']
  ], [
    term(['Radius', 'Raggio'], ['Abstand vom Mittelpunkt zum Rand.', 'Distanza dal centro al bordo.']),
    term(['π (Pi)', 'π (pi greco)'], ['Verhältnis von Umfang zu Durchmesser, etwa 3,14.', 'Rapporto tra circonferenza e diametro, circa 3,14.'])
  ]),

  'ms-potenzen': theory([
    sec(['Was ist eine Potenz?', 'Che cos’è una potenza?'],
      ['Eine Potenz ist eine Kurzschreibweise für wiederholtes Multiplizieren: aⁿ = a · a · … · a (n Faktoren). a heißt Basis, n Exponent. Es gilt a¹ = a und a⁰ = 1 (für a ≠ 0).',
        'Una potenza è un modo breve per scrivere una moltiplicazione ripetuta: aⁿ = a · a · … · a (n fattori). a è la base, n l’esponente. Vale a¹ = a e a⁰ = 1 (con a ≠ 0).'],
      ['2⁵ = 2 · 2 · 2 · 2 · 2 = 32\n10³ = 1000', '2⁵ = 2 × 2 × 2 × 2 × 2 = 32\n10³ = 1000']),
    sec(['Potenzgesetze', 'Proprietà delle potenze'],
      ['Gleiche Basis multiplizieren: Exponenten addieren. Dividieren: Exponenten subtrahieren. Potenz potenzieren: Exponenten multiplizieren. Negative Exponenten bedeuten Kehrwert.',
        'Stessa base, moltiplicazione: si sommano gli esponenti. Divisione: si sottraggono. Potenza di potenza: si moltiplicano. Esponente negativo: reciproco.'],
      ['a³ · a⁴ = a⁷\na⁶ : a² = a⁴\n(a²)³ = a⁶\n2⁻³ = 1/8', 'a³ · a⁴ = a⁷\na⁶ : a² = a⁴\n(a²)³ = a⁶\n2⁻³ = 1/8']),
    sec(['Wissenschaftliche Schreibweise', 'Notazione scientifica'],
      ['Sehr große und sehr kleine Zahlen schreibt man als Zahl zwischen 1 und 10 mal einer Zehnerpotenz.',
        'Numeri molto grandi o piccoli si scrivono come un numero tra 1 e 10 per una potenza di 10.'],
      ['Entfernung Erde–Sonne ≈ 150 000 000 km = 1,5 · 10⁸ km\nDurchmesser eines Haares ≈ 0,00007 m = 7 · 10⁻⁵ m', 'Distanza Terra–Sole ≈ 150 000 000 km = 1,5 · 10⁸ km\nDiametro di un capello ≈ 0,00007 m = 7 · 10⁻⁵ m']),
    sec(['Wurzeln', 'Radici'],
      ['Die Quadratwurzel √a ist die nicht negative Zahl, die mit sich selbst multipliziert a ergibt. Wurzeln sind Potenzen mit Bruch-Exponenten: √a = a^(1/2). Teilweises Wurzelziehen vereinfacht Terme.',
        'La radice quadrata √a è il numero non negativo che moltiplicato per se stesso dà a. Le radici sono potenze con esponente frazionario: √a = a^(1/2). Portando fuori i fattori si semplifica.'],
      ['√49 = 7\n√50 = √(25 · 2) = 5√2\n∛27 = 3', '√49 = 7\n√50 = √(25 · 2) = 5√2\n∛27 = 3'],
      ['√(a + b) ist NICHT √a + √b: √(9 + 16) = 5, aber 3 + 4 = 7.', '√(a + b) NON è √a + √b: √(9 + 16) = 5, ma 3 + 4 = 7.'])
  ], [
    ['2³ als 2 · 3 = 6 rechnen statt 8.', 'Calcolare 2³ come 2 × 3 = 6 invece di 8.'],
    ['(−3)² und −3² verwechseln: (−3)² = 9, aber −3² = −9.', 'Confondere (−3)² e −3²: (−3)² = 9, mentre −3² = −9.']
  ], [
    term(['Basis', 'Base'], ['Die Zahl, die multipliziert wird.', 'Il numero che si moltiplica.']),
    term(['Exponent', 'Esponente'], ['Wie oft die Basis Faktor ist.', 'Quante volte la base compare come fattore.'])
  ]),

  'ms-pythagoras': theory([
    sec(['Das rechtwinklige Dreieck', 'Il triangolo rettangolo'],
      ['Im rechtwinkligen Dreieck heißt die längste Seite, die dem rechten Winkel gegenüberliegt, Hypotenuse (c). Die beiden anderen Seiten heißen Katheten (a und b).',
        'Nel triangolo rettangolo il lato più lungo, opposto all’angolo retto, si chiama ipotenusa (i). Gli altri due lati si chiamano cateti (c₁ e c₂).']),
    sec(['Der Satz des Pythagoras', 'Il teorema di Pitagora'],
      ['Die Summe der Quadrate über den Katheten ist gleich dem Quadrat über der Hypotenuse: a² + b² = c². Das gilt NUR in rechtwinkligen Dreiecken.',
        'La somma dei quadrati costruiti sui cateti è uguale al quadrato costruito sull’ipotenusa: c₁² + c₂² = i². Vale SOLO nei triangoli rettangoli.'],
      ['a = 6, b = 8\nc² = 36 + 64 = 100\nc = 10\n\nc = 13, a = 5\nb² = 169 − 25 = 144 → b = 12', 'c₁ = 6, c₂ = 8\ni² = 36 + 64 = 100\ni = 10\n\ni = 13, c₁ = 5\nc₂² = 169 − 25 = 144 → c₂ = 12'],
      ['Bekannte Tripel: (3, 4, 5), (5, 12, 13), (8, 15, 17) und ihre Vielfachen.', 'Terne pitagoriche note: (3, 4, 5), (5, 12, 13), (8, 15, 17) e i loro multipli.']),
    sec(['Anwendungen', 'Applicazioni'],
      ['Diagonale im Rechteck, Höhe im gleichseitigen Dreieck, Abstand zweier Punkte im Koordinatensystem, Länge einer Leiter an der Wand: Überall steckt ein rechtwinkliges Dreieck.',
        'Diagonale del rettangolo, altezza del triangolo equilatero, distanza tra due punti nel piano cartesiano, scala appoggiata al muro: ovunque c’è un triangolo rettangolo.'],
      ['Bildschirm 48 cm × 27 cm → Diagonale √(48² + 27²) = √3033 ≈ 55 cm\nAbstand von (1|2) zu (4|6): √(3² + 4²) = 5', 'Schermo 48 cm × 27 cm → diagonale √(48² + 27²) = √3033 ≈ 55 cm\nDistanza tra (1;2) e (4;6): √(3² + 4²) = 5'])
  ], [
    ['Bei gesuchter Kathete trotzdem addieren. Kathete: c² − a² (subtrahieren).', 'Cercando un cateto, sommare invece di sottrarre: c₂² = i² − c₁².'],
    ['Am Ende die Wurzel vergessen.', 'Dimenticare la radice alla fine.']
  ], [
    term(['Hypotenuse', 'Ipotenusa'], ['Längste Seite, gegenüber dem rechten Winkel.', 'Lato più lungo, opposto all’angolo retto.']),
    term(['Kathete', 'Cateto'], ['Seite, die am rechten Winkel anliegt.', 'Lato che forma l’angolo retto.'])
  ]),

  'ms-funktionen': theory([
    sec(['Was ist eine Funktion?', 'Che cos’è una funzione?'],
      ['Eine Funktion ordnet jedem x-Wert genau einen y-Wert zu. Man schreibt f(x) = … und stellt sie als Wertetabelle oder Graph im Koordinatensystem dar.',
        'Una funzione associa a ogni valore di x uno e un solo valore di y. Si scrive f(x) = … e si rappresenta con una tabella o un grafico nel piano cartesiano.']),
    sec(['Lineare Funktionen', 'Funzioni lineari'],
      ['Eine lineare Funktion hat die Form f(x) = mx + b (in Italien oft y = mx + q). Ihr Graph ist eine Gerade. b ist der y-Achsenabschnitt: Dort schneidet die Gerade die y-Achse. m ist die Steigung.',
        'Una funzione lineare ha la forma y = mx + q. Il grafico è una retta. q è l’ordinata all’origine: il punto in cui la retta taglia l’asse y. m è il coefficiente angolare (pendenza).'],
      ['f(x) = 2x − 1\nx: 0 → y = −1\nx: 1 → y = 1\nx: 2 → y = 3', 'y = 2x − 1\nx = 0 → y = −1\nx = 1 → y = 1\nx = 2 → y = 3']),
    sec(['Die Steigung', 'La pendenza'],
      ['m sagt, um wie viel y steigt, wenn x um 1 größer wird. Aus zwei Punkten: m = (y₂ − y₁) / (x₂ − x₁). m > 0: steigend, m < 0: fallend, m = 0: waagerecht. Parallele Geraden haben dieselbe Steigung.',
        'm dice di quanto cresce y quando x aumenta di 1. Da due punti: m = (y₂ − y₁) / (x₂ − x₁). m > 0: crescente, m < 0: decrescente, m = 0: orizzontale. Rette parallele hanno la stessa pendenza.'],
      ['P(1|3), Q(4|9): m = (9 − 3)/(4 − 1) = 2\nb: 3 = 2 · 1 + b → b = 1\nf(x) = 2x + 1', 'P(1;3), Q(4;9): m = (9 − 3)/(4 − 1) = 2\nq: 3 = 2 · 1 + q → q = 1\ny = 2x + 1'],
      ['Steigungsdreieck: 1 nach rechts, m nach oben.', 'Triangolo della pendenza: 1 a destra, m in alto.']),
    sec(['Nullstelle und Schnittpunkt', 'Zero e intersezione'],
      ['Die Nullstelle ist der x-Wert, bei dem f(x) = 0 ist: Dort schneidet die Gerade die x-Achse. Den Schnittpunkt zweier Geraden findest du durch Gleichsetzen.',
        'Lo zero è il valore di x per cui y = 0: lì la retta taglia l’asse x. L’intersezione di due rette si trova mettendo a sistema (uguagliando).'],
      ['2x + 1 = 0 → x = −0,5\n2x + 1 = −x + 7 → 3x = 6 → x = 2, y = 5', '2x + 1 = 0 → x = −0,5\n2x + 1 = −x + 7 → 3x = 6 → x = 2, y = 5'])
  ], [
    ['Steigung und y-Achsenabschnitt vertauschen.', 'Scambiare pendenza e ordinata all’origine.'],
    ['Beim Steigungsdreieck x- und y-Differenz vertauschen.', 'Calcolare (x₂ − x₁)/(y₂ − y₁) invece del contrario.']
  ], [
    term(['Steigung m', 'Coefficiente angolare m'], ['Änderung von y pro Einheit in x.', 'Variazione di y per ogni unità di x.']),
    term(['Nullstelle', 'Zero della funzione'], ['x-Wert mit f(x) = 0.', 'Valore di x per cui f(x) = 0.'])
  ]),

  'ms-quadratisch': theory([
    sec(['Quadratische Gleichungen', 'Equazioni di secondo grado'],
      ['Eine quadratische Gleichung hat die Form ax² + bx + c = 0 (a ≠ 0). Sie kann 0, 1 oder 2 Lösungen haben. Der Graph von f(x) = ax² + bx + c ist eine Parabel, die Lösungen sind ihre Nullstellen.',
        'Un’equazione di secondo grado ha la forma ax² + bx + c = 0 (a ≠ 0). Può avere 0, 1 o 2 soluzioni. Il grafico di y = ax² + bx + c è una parabola; le soluzioni sono i punti in cui taglia l’asse x.']),
    sec(['Sonderfälle', 'Casi particolari'],
      ['Fehlt b (reinquadratisch): x² = −c/a, also Wurzel ziehen, ± nicht vergessen. Fehlt c: x ausklammern, Satz vom Nullprodukt anwenden.',
        'Se manca b (pura): x² = −c/a, poi radice, senza dimenticare ±. Se manca c (spuria): raccogli x e usa la legge di annullamento del prodotto.'],
      ['x² − 49 = 0 → x = ±7\n3x² − 12x = 0 → 3x(x − 4) = 0 → x = 0 oder x = 4', 'x² − 49 = 0 → x = ±7\n3x² − 12x = 0 → 3x(x − 4) = 0 → x = 0 o x = 4']),
    sec(['Die Lösungsformel', 'La formula risolutiva'],
      ['Allgemein: x = (−b ± √D) / (2a) mit der Diskriminante D = b² − 4ac. D > 0: zwei Lösungen, D = 0: eine Lösung, D < 0: keine reelle Lösung. In Deutschland nutzt man oft auch die p-q-Formel für x² + px + q = 0: x = −p/2 ± √((p/2)² − q).',
        'In generale: x = (−b ± √Δ) / (2a) con il discriminante Δ = b² − 4ac. Δ > 0: due soluzioni, Δ = 0: due soluzioni coincidenti, Δ < 0: nessuna soluzione reale.'],
      ['x² − 5x + 6 = 0\nD = 25 − 24 = 1\nx = (5 ± 1)/2 → x₁ = 3, x₂ = 2', 'x² − 5x + 6 = 0\nΔ = 25 − 24 = 1\nx = (5 ± 1)/2 → x₁ = 3, x₂ = 2'],
      ['Satz von Vieta: x₁ + x₂ = −b/a und x₁ · x₂ = c/a. Gute Probe!', 'Relazioni tra coefficienti e radici: x₁ + x₂ = −b/a, x₁ · x₂ = c/a. Ottima verifica!']),
    sec(['Scheitelpunkt der Parabel', 'Il vertice della parabola'],
      ['Der Scheitel liegt bei x = −b/(2a). Ist a > 0, ist die Parabel nach oben geöffnet (Tiefpunkt), bei a < 0 nach unten (Hochpunkt). Scheitelform: f(x) = a(x − d)² + e mit Scheitel S(d|e).',
        'Il vertice ha ascissa x = −b/(2a). Se a > 0 la parabola è rivolta verso l’alto (minimo), se a < 0 verso il basso (massimo).'],
      ['f(x) = (x − 2)² + 1 → S(2|1), keine Nullstellen', 'y = (x − 2)² + 1 → V(2; 1), nessuno zero'])
  ], [
    ['Bei x² = 49 nur x = 7 angeben, −7 vergessen.', 'Con x² = 49 scrivere solo x = 7 dimenticando −7.'],
    ['Bei x² − 4x = 0 durch x teilen und so die Lösung x = 0 verlieren.', 'Con x² − 4x = 0 dividere per x e perdere la soluzione x = 0.'],
    ['Vorzeichenfehler bei −b, wenn b negativ ist.', 'Sbagliare il segno di −b quando b è negativo.']
  ], [
    term(['Diskriminante', 'Discriminante'], ['b² − 4ac, entscheidet über die Anzahl der Lösungen.', 'b² − 4ac, dice quante soluzioni ci sono.']),
    term(['Parabel', 'Parabola'], ['Graph einer quadratischen Funktion.', 'Grafico di una funzione di secondo grado.'])
  ]),

  'ms-trigonometrie': theory([
    sec(['Sinus, Kosinus, Tangens', 'Seno, coseno, tangente'],
      ['Im rechtwinkligen Dreieck hängen Seitenverhältnisse nur vom Winkel ab. Zu einem Winkel α: Gegenkathete liegt gegenüber, Ankathete liegt an α an.\nsin α = Gegenkathete / Hypotenuse\ncos α = Ankathete / Hypotenuse\ntan α = Gegenkathete / Ankathete',
        'Nel triangolo rettangolo i rapporti tra i lati dipendono solo dall’angolo. Per un angolo α:\nsen α = cateto opposto / ipotenusa\ncos α = cateto adiacente / ipotenusa\ntg α = cateto opposto / cateto adiacente'],
      ['Hypotenuse 10 cm, α = 30°\nGegenkathete = 10 · sin 30° = 5 cm', 'Ipotenusa 10 cm, α = 30°\ncateto opposto = 10 · sen 30° = 5 cm'],
      ['Merkhilfe: GAGA-HHAG → sin = G/H, cos = A/H, tan = G/A.', 'Ricorda: il seno “guarda” il lato opposto, il coseno quello adiacente.']),
    sec(['Winkel berechnen', 'Trovare un angolo'],
      ['Kennst du zwei Seiten, findest du den Winkel mit der Umkehrfunktion (sin⁻¹, cos⁻¹, tan⁻¹ auf dem Taschenrechner, Modus DEG!).',
        'Se conosci due lati trovi l’angolo con la funzione inversa (arcsen, arccos, arctg, sulla calcolatrice sin⁻¹ ecc. in modalità DEG!).'],
      ['Leiter 5 m, Fuß 1,5 m von der Wand\ncos α = 1,5/5 = 0,3 → α ≈ 72,5°', 'Scala di 5 m, piede a 1,5 m dal muro\ncos α = 1,5/5 = 0,3 → α ≈ 72,5°']),
    sec(['Einheitskreis und allgemeine Dreiecke', 'Circonferenza goniometrica e triangoli qualsiasi'],
      ['Am Einheitskreis (r = 1) ist der Punkt zum Winkel α: (cos α | sin α). Daraus folgt sin²α + cos²α = 1. Für beliebige Dreiecke gelten der Sinussatz a/sin α = b/sin β = c/sin γ und der Kosinussatz c² = a² + b² − 2ab · cos γ.',
        'Sulla circonferenza goniometrica (r = 1) il punto dell’angolo α è (cos α; sen α). Da qui sen²α + cos²α = 1. Per triangoli qualsiasi valgono il teorema dei seni a/sen α = b/sen β = c/sen γ e il teorema del coseno (Carnot) c² = a² + b² − 2ab · cos γ.'],
      ['Wichtige Werte: sin 30° = 1/2, sin 45° = √2/2, sin 60° = √3/2', 'Valori notevoli: sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2'])
  ], [
    ['Gegenkathete und Ankathete verwechseln: Sie hängen davon ab, welcher Winkel gemeint ist.', 'Confondere cateto opposto e adiacente: dipendono dall’angolo considerato.'],
    ['Taschenrechner im Bogenmaß (RAD) statt Grad (DEG).', 'Calcolatrice in radianti (RAD) invece che in gradi (DEG).']
  ], [
    term(['Gegenkathete', 'Cateto opposto'], ['Kathete gegenüber dem Winkel.', 'Cateto di fronte all’angolo.']),
    term(['Bogenmaß', 'Radiante'], ['Winkelmaß über die Bogenlänge am Einheitskreis: 180° = π.', 'Misura dell’angolo come arco sulla circonferenza unitaria: 180° = π.'])
  ]),

  'ms-folgen': theory([
    sec(['Was ist eine Folge?', 'Che cos’è una successione?'],
      ['Eine Folge ist eine geordnete Liste von Zahlen a₁, a₂, a₃, … Man kann sie explizit (aₙ direkt aus n) oder rekursiv (aₙ aus dem Vorgänger) angeben.',
        'Una successione è un elenco ordinato di numeri a₁, a₂, a₃, … Si può dare in forma esplicita (aₙ direttamente da n) o ricorsiva (aₙ dal termine precedente).'],
      ['explizit: aₙ = 2n + 1 → 3, 5, 7, 9 …\nrekursiv: a₁ = 3, aₙ₊₁ = aₙ + 2', 'esplicita: aₙ = 2n + 1 → 3, 5, 7, 9 …\nricorsiva: a₁ = 3, aₙ₊₁ = aₙ + 2']),
    sec(['Arithmetische Folgen', 'Progressioni aritmetiche'],
      ['Die Differenz zweier aufeinanderfolgender Glieder ist konstant (d). aₙ = a₁ + (n − 1) · d. Summe der ersten n Glieder: sₙ = n · (a₁ + aₙ) / 2.',
        'La differenza tra due termini consecutivi è costante (ragione d). aₙ = a₁ + (n − 1) · d. Somma dei primi n termini: Sₙ = n · (a₁ + aₙ) / 2.'],
      ['1 + 2 + … + 100 = 100 · 101 / 2 = 5050 (der Trick des jungen Gauß)', '1 + 2 + … + 100 = 100 · 101 / 2 = 5050 (il trucco del giovane Gauss)']),
    sec(['Geometrische Folgen', 'Progressioni geometriche'],
      ['Der Quotient zweier aufeinanderfolgender Glieder ist konstant (q). aₙ = a₁ · qⁿ⁻¹. Geometrische Folgen beschreiben Wachstum mit festem Prozentsatz, z. B. Zinseszins oder Bakterien.',
        'Il rapporto tra due termini consecutivi è costante (ragione q). aₙ = a₁ · qⁿ⁻¹. Le progressioni geometriche descrivono crescite percentuali costanti, come l’interesse composto o i batteri.'],
      ['1000 € mit 3 % Zinsen: nach n Jahren 1000 · 1,03ⁿ\nnach 10 Jahren ≈ 1343,92 €', '1000 € al 3 %: dopo n anni 1000 · 1,03ⁿ\ndopo 10 anni ≈ 1343,92 €'],
      ['Ist |q| < 1, wird die Folge immer kleiner und strebt gegen 0 (Grenzwert).', 'Se |q| < 1 i termini diventano sempre più piccoli e tendono a 0 (limite).'])
  ], [
    ['In aₙ = a₁ + (n − 1)d das „− 1“ vergessen.', 'Dimenticare il “− 1” in aₙ = a₁ + (n − 1)d.'],
    ['Arithmetisch und geometrisch verwechseln: Wird addiert oder multipliziert?', 'Confondere aritmetica e geometrica: si somma o si moltiplica?']
  ], [
    term(['Glied', 'Termine'], ['Ein einzelnes Element der Folge.', 'Un singolo elemento della successione.']),
    term(['Grenzwert', 'Limite'], ['Wert, dem sich die Folge beliebig nähert.', 'Valore a cui la successione si avvicina sempre di più.'])
  ]),

  'ms-logarithmen': theory([
    sec(['Was ist ein Logarithmus?', 'Che cos’è un logaritmo?'],
      ['Der Logarithmus beantwortet die Frage: Mit welcher Hochzahl muss ich b potenzieren, um a zu erhalten? log_b(a) = x ⇔ bˣ = a. Er ist die Umkehrung der Exponentialfunktion.',
        'Il logaritmo risponde alla domanda: a quale esponente devo elevare b per ottenere a? log_b(a) = x ⇔ bˣ = a. È l’inverso della funzione esponenziale.'],
      ['log₂(8) = 3, weil 2³ = 8\nlog₁₀(1000) = 3\nlog₅(1) = 0', 'log₂(8) = 3 perché 2³ = 8\nlog₁₀(1000) = 3\nlog₅(1) = 0']),
    sec(['Logarithmengesetze', 'Proprietà dei logaritmi'],
      ['log(u · v) = log u + log v\nlog(u / v) = log u − log v\nlog(uʳ) = r · log u\nBasiswechsel: log_b(a) = ln a / ln b',
        'log(u · v) = log u + log v\nlog(u / v) = log u − log v\nlog(uʳ) = r · log u\nCambio di base: log_b(a) = ln a / ln b'],
      ['log₂(32) = log₂(2⁵) = 5\nlg 200 = lg 2 + lg 100 ≈ 0,301 + 2 = 2,301', 'log₂(32) = log₂(2⁵) = 5\nlog 200 = log 2 + log 100 ≈ 0,301 + 2 = 2,301']),
    sec(['Exponentialgleichungen lösen', 'Risolvere equazioni esponenziali'],
      ['Steht die Unbekannte im Exponenten, logarithmierst du beide Seiten und ziehst den Exponenten mit dem dritten Gesetz nach vorne.',
        'Se l’incognita è all’esponente, applica il logaritmo a entrambi i membri e porta l’esponente davanti con la terza proprietà.'],
      ['3ˣ = 50\nx · ln 3 = ln 50\nx = ln 50 / ln 3 ≈ 3,56\n\nVerdopplungszeit bei 5 % Wachstum: 1,05ᵗ = 2 → t = ln 2 / ln 1,05 ≈ 14,2', '3ˣ = 50\nx · ln 3 = ln 50\nx = ln 50 / ln 3 ≈ 3,56\n\nTempo di raddoppio al 5 %: 1,05ᵗ = 2 → t = ln 2 / ln 1,05 ≈ 14,2'],
      ['ln ist der Logarithmus zur Basis e ≈ 2,718, lg (oder log) zur Basis 10.', 'ln è il logaritmo in base e ≈ 2,718, log (o Log) in base 10.'])
  ], [
    ['log(u + v) = log u + log v rechnen. Dieses „Gesetz“ gibt es nicht!', 'Scrivere log(u + v) = log u + log v. Questa “regola” non esiste!'],
    ['Den Logarithmus einer negativen Zahl oder von 0 bilden wollen.', 'Calcolare il logaritmo di un numero negativo o di 0.']
  ], [
    term(['Basis', 'Base'], ['Die Zahl, die potenziert wird.', 'Il numero che viene elevato a potenza.']),
    term(['Eulersche Zahl e', 'Numero di Nepero e'], ['Wichtige Konstante ≈ 2,718.', 'Costante importante ≈ 2,718.'])
  ]),

  'ms-kombinatorik': theory([
    sec(['Zählprinzip', 'Principio fondamentale del calcolo combinatorio'],
      ['Hast du für die erste Entscheidung n₁ Möglichkeiten, für die zweite n₂ usw., gibt es insgesamt n₁ · n₂ · … Möglichkeiten.',
        'Se per la prima scelta hai n₁ possibilità, per la seconda n₂ e così via, le possibilità totali sono n₁ · n₂ · …'],
      ['3 T-Shirts, 2 Hosen, 2 Paar Schuhe → 3 · 2 · 2 = 12 Outfits', '3 magliette, 2 pantaloni, 2 paia di scarpe → 3 × 2 × 2 = 12 abbinamenti']),
    sec(['Permutationen', 'Permutazioni'],
      ['Wie viele Reihenfolgen gibt es für n verschiedene Dinge? n! = n · (n − 1) · … · 1 (n Fakultät). 0! = 1.',
        'In quanti modi si possono ordinare n oggetti diversi? n! = n · (n − 1) · … · 1 (n fattoriale). 0! = 1.'],
      ['5 Kinder in einer Reihe: 5! = 120 Möglichkeiten', '5 bambini in fila: 5! = 120 modi']),
    sec(['Variationen und Kombinationen', 'Disposizioni e combinazioni'],
      ['Wählst du k aus n aus und die Reihenfolge zählt (z. B. Siegertreppchen): n! / (n − k)!. Zählt die Reihenfolge nicht (z. B. Lotto): Binomialkoeffizient (n über k) = n! / (k! · (n − k)!).',
        'Scegli k oggetti da n e l’ordine conta (podio): disposizioni D = n! / (n − k)!. L’ordine non conta (lotteria): combinazioni C = n! / (k! · (n − k)!), il coefficiente binomiale.'],
      ['Podest aus 8 Läufern: 8 · 7 · 6 = 336\n6 aus 49: (49 über 6) = 13 983 816', 'Podio tra 8 corridori: 8 × 7 × 6 = 336\n6 numeri su 90 (Superenalotto): C(90,6) = 622 614 630'],
      ['Frage dich immer: Zählt die Reihenfolge? Darf ein Element mehrmals vorkommen?', 'Chiediti sempre: l’ordine conta? Si possono ripetere gli elementi?'])
  ], [
    ['Kombination statt Variation verwenden, obwohl die Reihenfolge wichtig ist.', 'Usare le combinazioni quando l’ordine conta.'],
    ['Zählprinzip addieren statt multiplizieren.', 'Sommare invece di moltiplicare le possibilità.']
  ], [
    term(['Fakultät n!', 'Fattoriale n!'], ['Produkt aller Zahlen von 1 bis n.', 'Prodotto di tutti i numeri da 1 a n.']),
    term(['Binomialkoeffizient', 'Coefficiente binomiale'], ['Anzahl der Möglichkeiten, k aus n ohne Reihenfolge zu wählen.', 'Numero di modi di scegliere k elementi da n senza ordine.'])
  ]),

  'ms-ableitung': theory([
    sec(['Die Idee der Ableitung', 'L’idea di derivata'],
      ['Die Ableitung f′(x₀) ist die Steigung des Graphen an einer Stelle, also die Steigung der Tangente. Man erhält sie als Grenzwert des Differenzenquotienten: f′(x₀) = lim (f(x₀ + h) − f(x₀)) / h für h → 0. Physikalisch ist es die momentane Änderungsrate, z. B. die Geschwindigkeit.',
        'La derivata f′(x₀) è la pendenza del grafico in un punto, cioè il coefficiente angolare della retta tangente. È il limite del rapporto incrementale: f′(x₀) = lim (f(x₀ + h) − f(x₀)) / h per h → 0. In fisica è il tasso di variazione istantaneo, per esempio la velocità.']),
    sec(['Ableitungsregeln', 'Regole di derivazione'],
      ['Potenzregel: (xⁿ)′ = n · xⁿ⁻¹. Konstanten fallen weg, Faktoren bleiben. Summen leitet man gliedweise ab. Produktregel: (uv)′ = u′v + uv′. Kettenregel: (f(g(x)))′ = f′(g(x)) · g′(x).',
        'Derivata della potenza: (xⁿ)′ = n · xⁿ⁻¹. Le costanti hanno derivata 0, i fattori restano. La somma si deriva termine per termine. Prodotto: (uv)′ = u′v + uv′. Funzione composta: (f(g(x)))′ = f′(g(x)) · g′(x).'],
      ['f(x) = 3x⁴ − 2x + 7 → f′(x) = 12x³ − 2\n(sin x)′ = cos x, (eˣ)′ = eˣ, (ln x)′ = 1/x\n(e^(2x))′ = 2e^(2x)', 'f(x) = 3x⁴ − 2x + 7 → f′(x) = 12x³ − 2\n(sen x)′ = cos x, (eˣ)′ = eˣ, (ln x)′ = 1/x\n(e^(2x))′ = 2e^(2x)']),
    sec(['Kurvendiskussion', 'Studio di funzione'],
      ['Extrempunkte: f′(x) = 0 und Vorzeichenwechsel von f′ (bzw. f″(x) ≠ 0). f″ > 0: Tiefpunkt, f″ < 0: Hochpunkt. Wendepunkte: f″(x) = 0 mit Vorzeichenwechsel. f′ > 0 heißt: Der Graph steigt.',
        'Massimi e minimi: f′(x) = 0 e cambio di segno di f′ (oppure f″(x) ≠ 0). f″ > 0: minimo, f″ < 0: massimo. Flessi: f″(x) = 0 con cambio di segno. f′ > 0 vuol dire che la funzione cresce.'],
      ['f(x) = x³ − 3x\nf′(x) = 3x² − 3 = 0 → x = ±1\nf″(x) = 6x\nf″(1) = 6 > 0 → Tiefpunkt (1|−2)\nf″(−1) = −6 < 0 → Hochpunkt (−1|2)', 'f(x) = x³ − 3x\nf′(x) = 3x² − 3 = 0 → x = ±1\nf″(x) = 6x\nf″(1) = 6 > 0 → minimo (1; −2)\nf″(−1) = −6 < 0 → massimo (−1; 2)'],
      ['Tangente in x₀: y = f′(x₀) · (x − x₀) + f(x₀).', 'Retta tangente in x₀: y = f′(x₀) · (x − x₀) + f(x₀).'])
  ], [
    ['Bei der Potenzregel den Exponenten nicht um 1 verringern.', 'Nella derivata della potenza non diminuire l’esponente di 1.'],
    ['f′(x) = 0 reicht allein nicht für ein Extremum (z. B. x³ bei 0: Sattelpunkt).', 'f′(x) = 0 da solo non basta per un massimo o minimo (es. x³ in 0: flesso).'],
    ['Bei verketteten Funktionen die innere Ableitung vergessen.', 'Nelle funzioni composte dimenticare la derivata interna.']
  ], [
    term(['Differenzenquotient', 'Rapporto incrementale'], ['Mittlere Steigung zwischen zwei Punkten.', 'Pendenza media tra due punti.']),
    term(['Tangente', 'Retta tangente'], ['Gerade, die den Graphen in einem Punkt berührt.', 'Retta che tocca il grafico in un punto.'])
  ]),

  'ms-integral': theory([
    sec(['Stammfunktionen', 'Primitive'],
      ['F ist eine Stammfunktion von f, wenn F′ = f. Integrieren ist also Ableiten rückwärts. Zu jeder Stammfunktion darf man eine Konstante C addieren.',
        'F è una primitiva di f se F′ = f. Integrare è derivare al contrario. A ogni primitiva si può aggiungere una costante C.'],
      ['∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1)\n∫ 6x² dx = 2x³ + C\n∫ 1/x dx = ln|x| + C\n∫ eˣ dx = eˣ + C', '∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1)\n∫ 6x² dx = 2x³ + C\n∫ 1/x dx = ln|x| + C\n∫ eˣ dx = eˣ + C']),
    sec(['Das bestimmte Integral', 'L’integrale definito'],
      ['Das bestimmte Integral von a bis b misst die orientierte Fläche zwischen Graph und x-Achse. Flächen unterhalb der Achse zählen negativ. Hauptsatz: ∫ₐᵇ f(x) dx = F(b) − F(a).',
        'L’integrale definito da a a b misura l’area con segno tra il grafico e l’asse x. Le aree sotto l’asse contano negativamente. Teorema fondamentale: ∫ₐᵇ f(x) dx = F(b) − F(a).'],
      ['∫₀² x² dx = [x³/3]₀² = 8/3 − 0 ≈ 2,67', '∫₀² x² dx = [x³/3]₀² = 8/3 − 0 ≈ 2,67']),
    sec(['Flächen berechnen', 'Calcolare aree'],
      ['Für die echte Fläche zuerst die Nullstellen bestimmen und in Teilintervallen getrennt integrieren, Beträge addieren. Fläche zwischen zwei Graphen: ∫ (f(x) − g(x)) dx zwischen den Schnittstellen.',
        'Per l’area vera trova prima gli zeri, integra separatamente sugli intervalli e somma i valori assoluti. Area tra due curve: ∫ (f(x) − g(x)) dx tra i punti di intersezione.'],
      ['f(x) = x, g(x) = x² schneiden sich bei 0 und 1\nA = ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6', 'f(x) = x, g(x) = x² si intersecano in 0 e 1\nA = ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6'],
      ['Anwendung: Aus der Geschwindigkeit v(t) erhält man durch Integrieren den zurückgelegten Weg.', 'Applicazione: integrando la velocità v(t) si ottiene lo spazio percorso.'])
  ], [
    ['Beim Integrieren den Exponenten erhöhen, aber nicht durch den neuen Exponenten teilen.', 'Aumentare l’esponente senza dividere per il nuovo esponente.'],
    ['Flächen unter der x-Achse einfach mitverrechnen, sodass sie sich wegheben.', 'Non separare le aree sotto l’asse x, che così si annullano con le altre.']
  ], [
    term(['Stammfunktion', 'Primitiva'], ['Funktion F mit F′ = f.', 'Funzione F tale che F′ = f.']),
    term(['Integrationsgrenzen', 'Estremi di integrazione'], ['Anfang a und Ende b des Intervalls.', 'Inizio a e fine b dell’intervallo.'])
  ]),

  'ms-vektoren': theory([
    sec(['Was ist ein Vektor?', 'Che cos’è un vettore?'],
      ['Ein Vektor beschreibt eine Verschiebung: Er hat eine Richtung und eine Länge, aber keinen festen Ort. Man schreibt ihn als Spalte von Koordinaten. Von A nach B: AB = B − A.',
        'Un vettore descrive uno spostamento: ha direzione, verso e modulo, ma non una posizione fissa. Si scrive con le sue componenti. Da A a B: AB = B − A.'],
      ['A(1|2|0), B(4|6|0) → AB = (3, 4, 0)', 'A(1; 2; 0), B(4; 6; 0) → AB = (3; 4; 0)']),
    sec(['Rechnen mit Vektoren', 'Operazioni con i vettori'],
      ['Addition: komponentenweise (Vektoren aneinanderhängen). Vervielfachen mit einer Zahl r: jede Komponente mal r. Länge (Betrag): |v| = √(v₁² + v₂² + v₃²).',
        'Somma: componente per componente (regola del parallelogramma). Prodotto per uno scalare r: ogni componente per r. Modulo: |v| = √(v₁² + v₂² + v₃²).'],
      ['(1, 2, 3) + (4, 0, −1) = (5, 2, 2)\n|(3, 4, 0)| = 5', '(1; 2; 3) + (4; 0; −1) = (5; 2; 2)\n|(3; 4; 0)| = 5']),
    sec(['Skalarprodukt', 'Prodotto scalare'],
      ['a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a| · |b| · cos φ. Ist das Skalarprodukt 0, stehen die Vektoren senkrecht (orthogonal) aufeinander. So berechnet man auch Winkel zwischen Vektoren.',
        'a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a| · |b| · cos φ. Se il prodotto scalare è 0 i vettori sono perpendicolari. Serve anche a calcolare l’angolo tra due vettori.'],
      ['(1, 2, 2) · (2, −1, 0) = 2 − 2 + 0 = 0 → orthogonal', '(1; 2; 2) · (2; −1; 0) = 2 − 2 + 0 = 0 → perpendicolari'],
      ['Geraden im Raum: x = Stützvektor + t · Richtungsvektor.', 'Retta nello spazio: P = punto + t · vettore direzione.'])
  ], [
    ['AB als A − B statt B − A berechnen (Spitze minus Fuß!).', 'Calcolare AB come A − B invece di B − A (punta meno coda!).'],
    ['Beim Betrag die Wurzel vergessen.', 'Dimenticare la radice nel modulo.']
  ], [
    term(['Betrag', 'Modulo'], ['Länge eines Vektors.', 'Lunghezza di un vettore.']),
    term(['orthogonal', 'ortogonale'], ['Senkrecht zueinander, Skalarprodukt 0.', 'Perpendicolari, prodotto scalare 0.'])
  ])
};
