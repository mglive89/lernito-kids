import { sec, term, theory, type Theory } from './types';

/** Geschichte, Geographie, Religion/Ethik */
export const SOCIETY: Record<string, Theory> = {
  'ge-antike': theory([
    sec(['Urzeit', 'Preistoria'],
      ['Altsteinzeit: Menschen lebten als Jäger und Sammler, zogen umher, nutzten Feuer und Steinwerkzeuge, malten Höhlenbilder. Jungsteinzeit (ab ca. 10 000 v. Chr.): Ackerbau und Viehzucht, Sesshaftigkeit, Keramik (Neolithische Revolution). Danach Bronze- und Eisenzeit.',
        'Paleolitico: gli uomini erano cacciatori e raccoglitori nomadi, usavano il fuoco e strumenti di pietra, dipingevano le grotte. Neolitico (dal 10 000 a.C. circa): agricoltura e allevamento, villaggi stabili, ceramica (rivoluzione neolitica). Poi età del bronzo e del ferro.'],
      undefined,
      ['„v. Chr.“ zählt rückwärts: 3000 v. Chr. ist früher als 1000 v. Chr.', '“a.C.” si conta all’indietro: il 3000 a.C. viene prima del 1000 a.C.']),
    sec(['Hochkultur Ägypten', 'La civiltà egizia'],
      ['Am Nil entstand um 3000 v. Chr. eine Hochkultur: Pharao als Gottkönig, Beamte, Schrift (Hieroglyphen), Kalender durch die Nilüberschwemmung, Pyramiden als Grabmäler.',
        'Lungo il Nilo nacque intorno al 3000 a.C. una grande civiltà: il faraone re-dio, i funzionari (scribi), la scrittura (geroglifici), il calendario legato alle piene del Nilo, le piramidi come tombe.']),
    sec(['Griechen und Römer', 'Greci e Romani'],
      ['Griechenland: Stadtstaaten (Polis), in Athen entstand im 5. Jh. v. Chr. die Demokratie; Philosophie, Theater, Olympische Spiele. Rom: Gründung 753 v. Chr. (Sage), Königszeit, Republik (Senat, Konsuln), ab 27 v. Chr. Kaiserzeit (Augustus). 476 n. Chr. endet das Weströmische Reich.',
        'Grecia: città-stato (polis), ad Atene nel V secolo a.C. nasce la democrazia; filosofia, teatro, Olimpiadi. Roma: fondazione nel 753 a.C. (leggenda), monarchia, repubblica (senato, consoli), dal 27 a.C. impero (Augusto). Nel 476 d.C. cade l’Impero romano d’Occidente.'],
      ['Spuren der Römer heute: Straßen, Aquädukte, lateinische Wörter (Fenster ← fenestra).', 'Tracce dei Romani oggi: strade, acquedotti, la lingua latina da cui nasce l’italiano.'])
  ], [
    ['Athenische Demokratie mit heutiger gleichsetzen: Frauen, Sklaven und Fremde durften nicht wählen.', 'Confondere la democrazia ateniese con quella di oggi: donne, schiavi e stranieri non votavano.']
  ], [
    term(['Hochkultur', 'Civiltà'], ['Gesellschaft mit Staat, Schrift, Arbeitsteilung.', 'Società con stato, scrittura e divisione del lavoro.']),
    term(['Republik', 'Repubblica'], ['Staat ohne König, Ämter auf Zeit.', 'Stato senza re, con cariche temporanee.'])
  ]),

  'ge-mittelalter': theory([
    sec(['Reich und Herrschaft', 'Impero e potere'],
      ['Das Mittelalter dauerte etwa von 500 bis 1500. Karl der Große wurde 800 in Rom zum Kaiser gekrönt. Die Gesellschaft war im Lehnswesen organisiert: Der König vergab Land (Lehen) an Adlige, die dafür Treue und Kriegsdienst schuldeten.',
        'Il Medioevo va circa dal 500 al 1500. Carlo Magno fu incoronato imperatore a Roma nell’800. La società era organizzata nel sistema feudale: il re concedeva terre (feudi) ai nobili in cambio di fedeltà e servizio militare.'],
      ['Ständepyramide: König – Adel und Klerus – Bauern', 'Piramide sociale: re – nobili e clero – contadini']),
    sec(['Kirche und Klöster', 'Chiesa e monasteri'],
      ['Die Kirche prägte das Leben. Mönche bewahrten in Klöstern Wissen, schrieben Bücher ab und betrieben Landwirtschaft („ora et labora“, Benedikt von Nursia). Im Investiturstreit stritten Papst und Kaiser um die Macht (Gang nach Canossa 1077).',
        'La Chiesa segnava la vita quotidiana. Nei monasteri i monaci conservavano il sapere, copiavano libri e coltivavano la terra (“ora et labora”, san Benedetto). Nella lotta per le investiture papa e imperatore si contesero il potere (Canossa, 1077).']),
    sec(['Städte und Handel', 'Città e commerci'],
      ['Ab dem 11. Jahrhundert wuchsen Städte. Bürger waren frei („Stadtluft macht frei“), Handwerker schlossen sich in Zünften zusammen, Kaufleute in der Hanse. In Italien entstanden die Kommunen und Seerepubliken (Venedig, Genua).',
        'Dall’XI secolo crebbero le città. In Germania nacque la Hansa, in Italia i Comuni e le Repubbliche marinare (Venezia, Genova, Pisa, Amalfi). Artigiani e mercanti si unirono in corporazioni (arti).'],
      undefined,
      ['Die Pest (1347–1351) tötete etwa ein Drittel der Menschen in Europa.', 'La peste nera (1347–1351) uccise circa un terzo degli europei.'])
  ], [
    ['Das Mittelalter für eine Zeit ohne Fortschritt halten: Es gab Universitäten, Kathedralen, neue Techniken.', 'Pensare al Medioevo come a un’epoca senza progresso: nacquero università, cattedrali, nuove tecniche.']
  ], [
    term(['Lehen', 'Feudo'], ['Land, das gegen Treue verliehen wurde.', 'Terra concessa in cambio di fedeltà.']),
    term(['Zunft', 'Corporazione'], ['Vereinigung von Handwerkern.', 'Associazione di artigiani.'])
  ]),

  'ge-neuzeit': theory([
    sec(['Renaissance, Entdeckungen, Reformation', 'Rinascimento, scoperte, Riforma'],
      ['Renaissance (Italien, 15./16. Jh.): Wiederentdeckung der Antike, der Mensch im Mittelpunkt (Leonardo, Michelangelo). Buchdruck (Gutenberg, um 1450). Kolumbus erreicht 1492 Amerika. Luthers Thesen 1517 lösen die Reformation aus, die Kirche spaltet sich.',
        'Rinascimento (Italia, XV–XVI sec.): riscoperta dell’antichità, l’uomo al centro (Leonardo, Michelangelo). Stampa a caratteri mobili (Gutenberg, 1450 circa). Colombo arriva in America nel 1492. Le tesi di Lutero (1517) avviano la Riforma protestante.']),
    sec(['Absolutismus und Aufklärung', 'Assolutismo e Illuminismo'],
      ['Im Absolutismus hatte der König die ganze Macht (Ludwig XIV.: „Der Staat bin ich“). Die Aufklärung setzte auf Vernunft und Rechte des Einzelnen: Gewaltenteilung (Montesquieu), Volkssouveränität (Rousseau), Kant: „Habe Mut, dich deines eigenen Verstandes zu bedienen!“',
        'Nell’assolutismo il re aveva tutto il potere (Luigi XIV: “Lo Stato sono io”). L’Illuminismo puntò su ragione e diritti: divisione dei poteri (Montesquieu), sovranità popolare (Rousseau), Kant: “Abbi il coraggio di servirti della tua intelligenza!”']),
    sec(['Revolutionen und 19. Jahrhundert', 'Rivoluzioni e Ottocento'],
      ['Amerikanische Unabhängigkeit (1776), Französische Revolution (1789: Menschen- und Bürgerrechte). Industrialisierung: Dampfmaschine, Fabriken, soziale Frage. Nationalstaaten: Italien wird 1861 geeint (Risorgimento: Garibaldi, Cavour), das Deutsche Reich 1871 (Bismarck).',
        'Indipendenza americana (1776), Rivoluzione francese (1789: diritti dell’uomo e del cittadino). Rivoluzione industriale: macchina a vapore, fabbriche, questione sociale. Stati nazionali: l’Italia è unita nel 1861 (Risorgimento: Garibaldi, Cavour, Mazzini), la Germania nel 1871 (Bismarck).'],
      ['1492 – 1517 – 1789 – 1861 – 1871', '1492 – 1517 – 1789 – 1861 – 1871'],
      ['Ursache → Ereignis → Folgen: So erklärst du jede Revolution.', 'Cause → evento → conseguenze: così spieghi ogni rivoluzione.'])
  ], [
    ['Renaissance und Reformation verwechseln: Kunst/Wissen vs. Religion.', 'Confondere Rinascimento (arte e cultura) e Riforma (religione).']
  ], [
    term(['Absolutismus', 'Assolutismo'], ['Herrschaft eines Monarchen ohne Kontrolle.', 'Potere del sovrano senza limiti.']),
    term(['Gewaltenteilung', 'Divisione dei poteri'], ['Legislative, Exekutive, Judikative getrennt.', 'Legislativo, esecutivo e giudiziario separati.'])
  ]),

  'ge-20jh': theory([
    sec(['Erster Weltkrieg und Zwischenkriegszeit', 'Prima guerra mondiale e anni tra le guerre'],
      ['1914–1918: Erster Weltkrieg, Stellungskrieg, Millionen Tote. Danach in Deutschland die Weimarer Republik, in Russland die Sowjetunion. In Italien kommt 1922 Mussolini an die Macht (Faschismus), in Deutschland 1933 Hitler (Nationalsozialismus).',
        '1914–1918: prima guerra mondiale, guerra di trincea, milioni di morti (l’Italia entra nel 1915). Poi in Germania la Repubblica di Weimar, in Russia l’URSS. In Italia nel 1922 Mussolini prende il potere (fascismo), in Germania nel 1933 Hitler (nazismo).']),
    sec(['Zweiter Weltkrieg und Holocaust', 'Seconda guerra mondiale e Shoah'],
      ['1939–1945: Zweiter Weltkrieg, ausgelöst durch den deutschen Überfall auf Polen. Die Nationalsozialisten ermordeten sechs Millionen Jüdinnen und Juden sowie Sinti und Roma und viele andere (Holocaust/Shoah). In Italien Resistenza, Befreiung am 25. April 1945.',
        '1939–1945: seconda guerra mondiale, iniziata con l’invasione tedesca della Polonia. I nazisti uccisero sei milioni di ebrei, oltre a rom e sinti e molti altri (Shoah). In Italia la Resistenza e la Liberazione il 25 aprile 1945.'],
      undefined,
      ['Erinnern ist wichtig: 27. Januar ist Holocaust-Gedenktag (Befreiung von Auschwitz).', 'Ricordare è importante: il 27 gennaio è il Giorno della Memoria (liberazione di Auschwitz).']),
    sec(['Nachkriegszeit und Europa', 'Dopoguerra ed Europa'],
      ['1946 wird Italien Republik, 1948 tritt die Verfassung in Kraft. 1949 entstehen BRD und DDR. Kalter Krieg zwischen USA und UdSSR, Mauerbau 1961, Mauerfall 1989, Wiedervereinigung 1990. Europäische Einigung: Römische Verträge 1957, EU 1993, Euro 2002.',
        'Nel 1946 l’Italia diventa Repubblica, nel 1948 entra in vigore la Costituzione. Nel 1949 nascono RFT e RDT. Guerra fredda tra USA e URSS, muro di Berlino (1961–1989), riunificazione tedesca 1990. Integrazione europea: Trattati di Roma 1957, UE 1993, euro 2002.'],
      ['1914 – 1933 – 1939 – 1945 – 1949 – 1989', '1914 – 1922 – 1939 – 1945 – 1946 – 1989'])
  ], [
    ['Ursachen nur bei einer Person suchen: Kriege haben politische, wirtschaftliche und gesellschaftliche Gründe.', 'Cercare le cause in una sola persona: le guerre hanno cause politiche, economiche e sociali.']
  ], [
    term(['Totalitarismus', 'Totalitarismo'], ['Staat kontrolliert alle Lebensbereiche.', 'Lo Stato controlla ogni aspetto della vita.']),
    term(['Kalter Krieg', 'Guerra fredda'], ['Konflikt der Blöcke ohne direkten Krieg.', 'Contrapposizione tra blocchi senza guerra diretta.'])
  ]),

  'ge-oberstufe': theory([
    sec(['Quellen analysieren', 'Analizzare le fonti'],
      ['Primärquellen stammen aus der Zeit selbst (Briefe, Gesetze, Fotos), Sekundärliteratur deutet sie später. Analyse: Wer? Wann? Für wen? Mit welcher Absicht? Dann Inhalt wiedergeben, einordnen, beurteilen.',
        'Le fonti primarie risalgono all’epoca (lettere, leggi, foto), la storiografia le interpreta dopo. Analisi: chi? quando? per chi? con quale scopo? Poi riassumi, contestualizza, valuta.']),
    sec(['Ideologien', 'Ideologie'],
      ['Liberalismus (Freiheit, Marktwirtschaft), Konservatismus (Tradition), Sozialismus (Gleichheit, Gemeineigentum), Nationalismus, Faschismus (Führerstaat, Gewalt). Viele Konflikte des 19./20. Jh. lassen sich so erklären.',
        'Liberalismo (libertà, mercato), conservatorismo (tradizione), socialismo (uguaglianza, proprietà collettiva), nazionalismo, fascismo (capo assoluto, violenza). Molti conflitti dell’Otto-Novecento si spiegano così.']),
    sec(['Krisen und Demokratie', 'Crisi e democrazia'],
      ['Warum scheiterte die Weimarer Republik? Wirtschaftskrise 1929, Notverordnungen, Gegner von links und rechts. Daraus lernte das Grundgesetz (1949) bzw. die italienische Verfassung (1948): Schutz der Grundrechte, starke Gerichte, Gewaltenteilung.',
        'Perché fallì la Repubblica di Weimar? Crisi del 1929, decreti d’emergenza, nemici a destra e a sinistra. Da qui le lezioni della Costituzione italiana (1948) e della Legge fondamentale tedesca (1949): diritti fondamentali, corti costituzionali, divisione dei poteri.'],
      undefined,
      ['Multiperspektivität: Betrachte Ereignisse immer aus mehreren Sichtweisen.', 'Più prospettive: guarda sempre gli eventi da più punti di vista.'])
  ], [
    ['Quellen ungeprüft für die Wahrheit halten.', 'Considerare una fonte vera senza esaminarla.']
  ], [
    term(['Primärquelle', 'Fonte primaria'], ['Zeugnis aus der untersuchten Zeit.', 'Documento dell’epoca studiata.']),
    term(['Ideologie', 'Ideologia'], ['Geschlossenes Weltbild.', 'Sistema di idee sulla società.'])
  ]),

  'geo-meinland': theory([
    sec(['Deutschland', 'La Germania'],
      ['Deutschland hat 16 Bundesländer, Hauptstadt ist Berlin. Im Norden liegen Nord- und Ostsee, im Süden die Alpen mit der Zugspitze (2962 m). Wichtige Flüsse: Rhein, Elbe, Donau, Main.',
        'La Germania ha 16 Länder (stati federati), la capitale è Berlino. A nord ci sono il Mare del Nord e il Baltico, a sud le Alpi con la Zugspitze (2962 m). Fiumi: Reno, Elba, Danubio, Meno.']),
    sec(['Italien', 'L’Italia'],
      ['Italien hat 20 Regionen, Hauptstadt ist Rom. Die Halbinsel ist von Alpen (Monte Bianco, 4806 m) und Apennin geprägt. Längster Fluss ist der Po. Große Inseln: Sizilien und Sardinien. Vulkane: Ätna, Vesuv, Stromboli.',
        'L’Italia ha 20 regioni, la capitale è Roma. La penisola è segnata dalle Alpi (Monte Bianco, 4806 m) e dagli Appennini. Il fiume più lungo è il Po. Isole maggiori: Sicilia e Sardegna. Vulcani: Etna, Vesuvio, Stromboli.']),
    sec(['Landschaften', 'Paesaggi'],
      ['Man unterscheidet Tiefland (Ebenen, z. B. Norddeutsche Tiefebene, Pianura Padana), Mittelgebirge/Hügelland und Hochgebirge. Das Relief beeinflusst Klima, Landwirtschaft und Besiedlung.',
        'Si distinguono pianure (Pianura Padana, bassopiano tedesco), colline/montagne medie e alta montagna. Il rilievo influenza clima, agricoltura e insediamenti.'],
      undefined,
      ['Auf physischen Karten: grün = tief, braun = hoch.', 'Nelle carte fisiche: verde = basso, marrone = alto.'])
  ], [
    ['Bundesländer und Hauptstädte verwechseln.', 'Confondere regioni e capoluoghi.']
  ], [
    term(['Bundesland', 'Land / Regione'], ['Gliedstaat Deutschlands.', 'Stato federato della Germania.']),
    term(['Relief', 'Rilievo'], ['Höhenunterschiede der Landschaft.', 'Forme e altezze del territorio.'])
  ]),

  'geo-europa': theory([
    sec(['Lage und Grenzen', 'Posizione e confini'],
      ['Europa ist der zweitkleinste Kontinent. Die Grenze zu Asien bilden Ural, Uralfluss, Kaspisches Meer und Kaukasus. Im Westen der Atlantik, im Süden das Mittelmeer.',
        'L’Europa è il secondo continente più piccolo. Il confine con l’Asia è segnato da Urali, fiume Ural, Mar Caspio e Caucaso. A ovest l’Atlantico, a sud il Mediterraneo.']),
    sec(['Großlandschaften', 'Grandi regioni'],
      ['Nordeuropa (Skandinavien, Fjorde), Westeuropa (Frankreich, Benelux, Britische Inseln), Mitteleuropa, Südeuropa (Iberische, Apennin-, Balkanhalbinsel), Osteuropa (Tiefland). Gebirge: Alpen, Pyrenäen, Karpaten. Flüsse: Wolga (längster), Donau, Rhein.',
        'Europa del nord (Scandinavia, fiordi), occidentale (Francia, Benelux, isole britanniche), centrale, meridionale (penisole iberica, italiana, balcanica), orientale (pianure). Monti: Alpi, Pirenei, Carpazi. Fiumi: Volga (il più lungo), Danubio, Reno.'],
      ['Paris (FR), Madrid (ES), Wien (AT), Warschau (PL), Athen (GR)', 'Parigi (FR), Madrid (ES), Vienna (AT), Varsavia (PL), Atene (GR)']),
    sec(['Die Europäische Union', 'L’Unione Europea'],
      ['Die EU hat 27 Mitgliedstaaten. Sie sichert Frieden, Binnenmarkt (freier Verkehr von Waren, Personen, Dienstleistungen, Kapital) und gemeinsame Regeln. 20 Länder nutzen den Euro. Wichtige Organe: Parlament, Rat, Kommission.',
        'L’UE ha 27 Stati membri. Garantisce pace, mercato unico (libera circolazione di merci, persone, servizi, capitali) e regole comuni. 20 Paesi usano l’euro. Istituzioni: Parlamento, Consiglio, Commissione.'],
      undefined,
      ['Nicht jedes Land Europas ist in der EU: z. B. Schweiz, Norwegen, Großbritannien (seit 2020).', 'Non tutti i Paesi europei sono nell’UE: per esempio Svizzera, Norvegia, Regno Unito (dal 2020).'])
  ], [
    ['Europa und EU gleichsetzen.', 'Confondere Europa e Unione Europea.']
  ], [
    term(['Binnenmarkt', 'Mercato unico'], ['Gemeinsamer Markt ohne Grenzkontrollen für Waren.', 'Mercato comune senza barriere doganali.']),
    term(['Halbinsel', 'Penisola'], ['Land, das fast ganz von Wasser umgeben ist.', 'Terra circondata quasi del tutto dall’acqua.'])
  ]),

  'geo-welt': theory([
    sec(['Kontinente und Ozeane', 'Continenti e oceani'],
      ['Sieben Kontinente: Asien (größter), Afrika, Nordamerika, Südamerika, Antarktis, Europa, Australien/Ozeanien. Drei große Ozeane: Pazifik (größter), Atlantik, Indischer Ozean. Etwa 71 % der Erde sind mit Wasser bedeckt.',
        'Sette continenti: Asia (il più grande), Africa, America del Nord, America del Sud, Antartide, Europa, Oceania. Tre grandi oceani: Pacifico (il più grande), Atlantico, Indiano. Circa il 71 % della Terra è coperto d’acqua.']),
    sec(['Gradnetz', 'Reticolato geografico'],
      ['Breitenkreise verlaufen parallel zum Äquator (0° bis 90° N/S), Längenhalbkreise von Pol zu Pol (0° in Greenwich bis 180° O/W). Damit lässt sich jeder Ort genau angeben.',
        'I paralleli sono paralleli all’equatore (da 0° a 90° N/S), i meridiani vanno da polo a polo (0° a Greenwich, fino a 180° E/O). Così si indica la posizione di ogni luogo (latitudine e longitudine).'],
      ['Rom: ca. 42° N, 12° O\nBerlin: ca. 52° N, 13° O', 'Roma: circa 42° N, 12° E\nBerlino: circa 52° N, 13° E']),
    sec(['Klimazonen', 'Fasce climatiche'],
      ['Weil die Sonne am Äquator steiler einstrahlt, ist es dort wärmer. Klimazonen: tropisch (Regenwald, Savanne), subtropisch (Wüsten, Mittelmeerklima), gemäßigt (Laubwald, Deutschland, Norditalien), kalt (Tundra, Polargebiete). Klimadiagramme zeigen Temperatur und Niederschlag pro Monat.',
        'All’equatore il sole arriva più verticale, quindi fa più caldo. Fasce: tropicale (foresta pluviale, savana), subtropicale (deserti, clima mediterraneo), temperata (boschi di latifoglie, Europa centrale), fredda (tundra, zone polari). Il climogramma mostra temperature e precipitazioni mensili.'],
      undefined,
      ['Wetter = heute, Klima = Durchschnitt über mindestens 30 Jahre.', 'Tempo atmosferico = oggi, clima = media di almeno 30 anni.'])
  ], [
    ['Wetter und Klima verwechseln.', 'Confondere tempo atmosferico e clima.']
  ], [
    term(['Äquator', 'Equatore'], ['Breitenkreis 0°, teilt die Erde in Nord- und Südhalbkugel.', 'Parallelo 0°, divide la Terra in due emisferi.']),
    term(['Klimadiagramm', 'Climogramma'], ['Grafik von Temperatur und Niederschlag.', 'Grafico di temperature e piogge.'])
  ]),

  'geo-oberstufe': theory([
    sec(['Globalisierung', 'Globalizzazione'],
      ['Die weltweite Verflechtung von Wirtschaft, Kommunikation und Kultur. Ursachen: billiger Transport (Container), Internet, Abbau von Handelsschranken. Folgen: Wohlstand und Arbeitsteilung, aber auch Abhängigkeiten, Ungleichheit und Umweltbelastung.',
        'L’intreccio mondiale di economia, comunicazione e cultura. Cause: trasporti economici (container), Internet, meno barriere commerciali. Effetti: benessere e divisione del lavoro, ma anche dipendenze, disuguaglianze e impatto ambientale.']),
    sec(['Klimawandel', 'Cambiamento climatico'],
      ['Durch Verbrennung fossiler Energieträger steigt der CO₂-Gehalt der Luft, der Treibhauseffekt verstärkt sich. Folgen: Erwärmung, Meeresspiegelanstieg, Extremwetter. Maßnahmen: Klimaschutz (weniger Emissionen) und Anpassung (Deiche, Hitzeschutz).',
        'Bruciando combustibili fossili aumenta la CO₂ nell’aria e si rafforza l’effetto serra. Conseguenze: riscaldamento, innalzamento dei mari, eventi estremi. Risposte: mitigazione (meno emissioni) e adattamento (argini, protezione dal caldo).']),
    sec(['Bevölkerung und Stadt', 'Popolazione e città'],
      ['Das Modell des demographischen Übergangs beschreibt, wie Geburten- und Sterberate mit der Entwicklung sinken. Italien und Deutschland haben eine alternde Bevölkerung. Verstädterung: Über die Hälfte der Menschen lebt in Städten, es entstehen Megastädte.',
        'Il modello della transizione demografica descrive come natalità e mortalità calano con lo sviluppo. Italia e Germania hanno una popolazione che invecchia. Urbanizzazione: più di metà dell’umanità vive in città, nascono le megalopoli.'],
      undefined,
      ['Bei Analysen immer Ursachen, Folgen und mögliche Lösungen nennen.', 'Nelle analisi indica sempre cause, conseguenze e possibili soluzioni.'])
  ], [
    ['Treibhauseffekt und Ozonloch verwechseln.', 'Confondere effetto serra e buco dell’ozono.']
  ], [
    term(['Treibhauseffekt', 'Effetto serra'], ['Gase halten Wärme in der Atmosphäre.', 'Gas che trattengono il calore nell’atmosfera.']),
    term(['Megastadt', 'Megalopoli'], ['Stadt mit über 10 Millionen Einwohnern.', 'Città con più di 10 milioni di abitanti.'])
  ]),

  'rel-feste': theory([
    sec(['Feste im Jahr', 'Le feste dell’anno'],
      ['Christen feiern Weihnachten (Geburt Jesu), Ostern (Auferstehung) und Pfingsten. Juden feiern Pessach, Chanukka und jede Woche den Sabbat. Muslime feiern das Zuckerfest am Ende des Fastenmonats Ramadan und das Opferfest.',
        'I cristiani festeggiano il Natale (nascita di Gesù), la Pasqua (risurrezione) e la Pentecoste. Gli ebrei festeggiano Pesach, Hanukkah e ogni settimana lo Shabbat. I musulmani festeggiano la fine del Ramadan (Eid al-Fitr) e la Festa del sacrificio.']),
    sec(['Miteinander leben', 'Vivere insieme'],
      ['In vielen Religionen gibt es die „Goldene Regel“: Behandle andere so, wie du selbst behandelt werden möchtest. Freundlichkeit, Teilen, Verzeihen und Hilfe sind wichtig, egal woran man glaubt.',
        'In molte religioni c’è la “regola d’oro”: tratta gli altri come vorresti essere trattato tu. Gentilezza, condivisione, perdono e aiuto sono importanti qualunque cosa si creda.'],
      ['Ein Kind ist traurig → fragen, zuhören, trösten', 'Un compagno è triste → chiedere, ascoltare, consolare']),
    sec(['Gotteshäuser', 'Luoghi di culto'],
      ['Christen gehen in die Kirche, Juden in die Synagoge, Muslime in die Moschee. Jedes Gotteshaus hat eigene Regeln, die man respektvoll beachtet.',
        'I cristiani vanno in chiesa, gli ebrei in sinagoga, i musulmani in moschea. Ogni luogo di culto ha le sue regole, da rispettare.'],
      undefined,
      ['Jeder Mensch darf glauben, was er möchte, oder auch nicht glauben.', 'Ognuno è libero di credere in ciò che vuole, o di non credere.'])
  ], [
    ['Feste einer Religion einer anderen zuordnen.', 'Attribuire una festa alla religione sbagliata.']
  ], [
    term(['Goldene Regel', 'Regola d’oro'], ['Andere so behandeln, wie man selbst behandelt werden will.', 'Trattare gli altri come vorresti essere trattato.'])
  ]),

  'rel-weltreligionen': theory([
    sec(['Die abrahamitischen Religionen', 'Le religioni abramitiche'],
      ['Judentum (Tora, Synagoge, Moses), Christentum (Bibel mit Altem und Neuem Testament, Jesus Christus), Islam (Koran, Moschee, Prophet Mohammed, fünf Säulen). Alle drei sind monotheistisch und berufen sich auf Abraham.',
        'Ebraismo (Torah, sinagoga, Mosè), cristianesimo (Bibbia con Antico e Nuovo Testamento, Gesù Cristo), islam (Corano, moschea, profeta Maometto, cinque pilastri). Tutte e tre sono monoteiste e si richiamano ad Abramo.']),
    sec(['Hinduismus und Buddhismus', 'Induismo e buddhismo'],
      ['Hinduismus: viele Gottheiten, Wiedergeburt, Karma. Buddhismus: Siddhartha Gautama (Buddha), Vier Edle Wahrheiten, Achtfacher Pfad, Ziel ist das Nirwana.',
        'Induismo: molte divinità, reincarnazione, karma. Buddhismo: Siddharta Gautama (il Buddha), Quattro nobili verità, Ottuplice sentiero, meta è il nirvana.']),
    sec(['Toleranz und Menschenrechte', 'Tolleranza e diritti umani'],
      ['Die Allgemeine Erklärung der Menschenrechte (1948) schützt die Würde jedes Menschen und die Religionsfreiheit. Im Dialog der Religionen sucht man Gemeinsamkeiten und respektiert Unterschiede.',
        'La Dichiarazione universale dei diritti umani (1948) tutela la dignità di ogni persona e la libertà religiosa. Nel dialogo interreligioso si cercano punti comuni e si rispettano le differenze.'],
      undefined,
      ['Respekt heißt nicht, alles gut zu finden, sondern den anderen als Person zu achten.', 'Rispetto non vuol dire approvare tutto, ma riconoscere la dignità dell’altro.'])
  ], [
    ['Islam und Islamismus gleichsetzen.', 'Confondere islam e fondamentalismo islamista.']
  ], [
    term(['Monotheismus', 'Monoteismo'], ['Glaube an einen einzigen Gott.', 'Fede in un solo Dio.']),
    term(['Karma', 'Karma'], ['Folgen der Taten für das künftige Leben.', 'Conseguenze delle azioni nelle vite future.'])
  ]),

  'rel-ethik': theory([
    sec(['Was ist Ethik?', 'Che cos’è l’etica?'],
      ['Ethik fragt: Was soll ich tun? Was ist gut und gerecht? Sie begründet Normen mit Argumenten statt mit Gewohnheit oder Macht.',
        'L’etica si chiede: che cosa devo fare? Che cosa è bene e giusto? Fonda le norme su argomenti, non su abitudini o potere.']),
    sec(['Kant und der Utilitarismus', 'Kant e l’utilitarismo'],
      ['Kant (Pflichtethik): Handle nur nach der Maxime, von der du wollen kannst, dass sie allgemeines Gesetz wird (Kategorischer Imperativ). Menschen nie nur als Mittel benutzen. Utilitarismus (Bentham, Mill): Gut ist, was das größte Glück der größten Zahl bewirkt – es zählen die Folgen.',
        'Kant (etica del dovere): agisci solo secondo la massima che puoi volere diventi legge universale (imperativo categorico). Non trattare mai le persone solo come mezzi. Utilitarismo (Bentham, Mill): è buono ciò che produce la maggiore felicità per il maggior numero, contano le conseguenze.'],
      ['Darf man lügen, um jemanden zu retten?\nKant: nein, Lügen kann kein allgemeines Gesetz sein.\nUtilitarist: ja, wenn es mehr Leid verhindert.', 'Si può mentire per salvare qualcuno?\nKant: no, la menzogna non può diventare legge universale.\nUtilitarista: sì, se evita più sofferenza.']),
    sec(['Angewandte Ethik', 'Etica applicata'],
      ['Bioethik (Gentechnik, Sterbehilfe), Tierethik, Umweltethik, KI-Ethik. In Diskussionen: Position klar machen, Gründe nennen, Gegenargumente prüfen.',
        'Bioetica (ingegneria genetica, fine vita), etica animale, ambientale, dell’intelligenza artificiale. Nelle discussioni: chiarisci la tua posizione, dai ragioni, valuta le obiezioni.'],
      undefined,
      ['Sein-Sollen-Fehlschluss: Aus „es ist so“ folgt nicht „es soll so sein“.', 'Fallacia naturalistica: da “è così” non segue “deve essere così”.'])
  ], [
    ['Moral und Recht gleichsetzen: Nicht alles Legale ist moralisch gut.', 'Confondere morale e diritto: non tutto ciò che è legale è giusto.']
  ], [
    term(['Kategorischer Imperativ', 'Imperativo categorico'], ['Kants unbedingtes Moralgesetz.', 'La legge morale incondizionata di Kant.']),
    term(['Utilitarismus', 'Utilitarismo'], ['Ethik, die nach dem Nutzen urteilt.', 'Etica che giudica in base all’utilità.'])
  ])
};
