import { sec, term, theory, type Theory } from './types';

/** Sachunterricht, Biologie, Physik, Chemie */
export const SCIENCE: Record<string, Theory> = {
  's1-jahreszeiten': theory([
    sec(['Die vier Jahreszeiten', 'Le quattro stagioni'],
      ['Frühling, Sommer, Herbst und Winter wechseln sich jedes Jahr ab. Im Frühling blühen die Blumen, im Sommer ist es heiß, im Herbst fallen die Blätter, im Winter ist es kalt und manchmal schneit es.',
        'Primavera, estate, autunno e inverno si alternano ogni anno. In primavera sbocciano i fiori, d’estate fa caldo, in autunno cadono le foglie, d’inverno fa freddo e a volte nevica.'],
      ['Frühling 🌷 – Sommer ☀️ – Herbst 🍂 – Winter ❄️', 'Primavera 🌷 – Estate ☀️ – Autunno 🍂 – Inverno ❄️'],
      ['Ein Jahr hat 12 Monate, jede Jahreszeit etwa 3.', 'Un anno ha 12 mesi, ogni stagione circa 3.']),
    sec(['Mein Körper', 'Il mio corpo'],
      ['Mit fünf Sinnen nehmen wir die Welt wahr: sehen (Augen), hören (Ohren), riechen (Nase), schmecken (Zunge), fühlen (Haut). Damit der Körper gesund bleibt, braucht er Bewegung, Schlaf, Wasser und gesundes Essen.',
        'Con i cinque sensi conosciamo il mondo: vista (occhi), udito (orecchie), olfatto (naso), gusto (lingua), tatto (pelle). Per stare in salute il corpo ha bisogno di movimento, sonno, acqua e cibo sano.']),
    sec(['Sicher im Straßenverkehr', 'Sicuri per strada'],
      ['Bei Rot stehen, bei Grün gehen. Vor dem Überqueren: links, rechts, links schauen. Am Zebrastreifen Blickkontakt mit den Autofahrern suchen. Im Dunkeln helle Kleidung und Reflektoren tragen.',
        'Con il rosso ci si ferma, con il verde si passa. Prima di attraversare guarda a sinistra, a destra e ancora a sinistra. Sulle strisce cerca lo sguardo dell’automobilista. Al buio indossa abiti chiari e catarifrangenti.'])
  ], [
    ['Bei Grün loslaufen, ohne zu schauen. Auch bei Grün kann ein Auto abbiegen!', 'Partire col verde senza guardare: un’auto può comunque svoltare!']
  ], [
    term(['Jahreszeit', 'Stagione'], ['Ein Viertel des Jahres mit typischem Wetter.', 'Un quarto dell’anno con un clima tipico.']),
    term(['Sinne', 'Sensi'], ['Sehen, Hören, Riechen, Schmecken, Fühlen.', 'Vista, udito, olfatto, gusto, tatto.'])
  ]),

  's2-tiere': theory([
    sec(['Tiere ordnen', 'Classificare gli animali'],
      ['Tiere kann man nach vielen Merkmalen ordnen: Was fressen sie (Pflanzenfresser, Fleischfresser, Allesfresser)? Wo leben sie (Wald, Wasser, Bauernhof)? Wie bewegen sie sich?',
        'Gli animali si possono classificare in tanti modi: che cosa mangiano (erbivori, carnivori, onnivori)? Dove vivono (bosco, acqua, fattoria)? Come si muovono?'],
      ['Kuh 🐄: Pflanzenfresser, Bauernhof\nFuchs 🦊: Fleischfresser, Wald\nIgel 🦔: hält Winterschlaf', 'Mucca 🐄: erbivoro, fattoria\nVolpe 🦊: carnivoro, bosco\nRiccio 🦔: va in letargo']),
    sec(['Pflanzen', 'Le piante'],
      ['Eine Pflanze hat Wurzel, Stängel, Blätter und Blüte. Die Wurzeln nehmen Wasser auf, die Blätter brauchen Licht. Aus der Blüte entstehen Früchte mit Samen, aus denen neue Pflanzen wachsen.',
        'Una pianta ha radice, fusto, foglie e fiore. Le radici assorbono l’acqua, le foglie hanno bisogno di luce. Dal fiore nascono i frutti con i semi, da cui crescono nuove piante.'],
      ['Samen → Keimling → Pflanze → Blüte → Frucht → Samen', 'Seme → germoglio → pianta → fiore → frutto → seme']),
    sec(['Der Weg zur Schule', 'La strada per la scuola'],
      ['Verkehrszeichen haben Formen und Farben: Rote Kreise verbieten etwas, blaue Kreise gebieten etwas, Dreiecke warnen. Mit dem Fahrrad immer Helm tragen.',
        'I cartelli stradali hanno forme e colori: i cerchi rossi vietano, i cerchi blu obbligano, i triangoli avvertono di un pericolo. In bici indossa sempre il casco.'])
  ], [
    ['Denken, alle Tiere im Winter würden schlafen. Viele bleiben aktiv oder ziehen in den Süden (Zugvögel).', 'Pensare che tutti gli animali dormano d’inverno: molti restano attivi o migrano (uccelli migratori).']
  ], [
    term(['Winterschlaf', 'Letargo'], ['Langer Schlaf mancher Tiere im Winter.', 'Lungo sonno invernale di alcuni animali.']),
    term(['Samen', 'Seme'], ['Daraus wächst eine neue Pflanze.', 'Da cui nasce una nuova pianta.'])
  ]),

  's3-natur': theory([
    sec(['Der Wasserkreislauf', 'Il ciclo dell’acqua'],
      ['Die Sonne erwärmt Wasser in Meeren und Seen, es verdunstet. Der Wasserdampf steigt auf, kühlt ab und bildet Wolken (Kondensation). Es regnet oder schneit (Niederschlag), das Wasser fließt in Flüssen zurück ins Meer.',
        'Il sole scalda l’acqua di mari e laghi, che evapora. Il vapore sale, si raffredda e forma le nuvole (condensazione). Poi piove o nevica (precipitazioni) e l’acqua torna al mare attraverso i fiumi.'],
      ['Verdunsten → Kondensieren → Niederschlag → Abfließen', 'Evaporazione → condensazione → precipitazione → scorrimento']),
    sec(['Aggregatzustände', 'Gli stati della materia'],
      ['Wasser gibt es fest (Eis), flüssig (Wasser) und gasförmig (Wasserdampf). Bei 0 °C gefriert es, bei 100 °C siedet es.',
        'L’acqua esiste allo stato solido (ghiaccio), liquido (acqua) e gassoso (vapore). A 0 °C ghiaccia, a 100 °C bolle.']),
    sec(['Müll trennen und Umwelt schützen', 'Raccolta differenziata e ambiente'],
      ['Müll wird getrennt, damit Rohstoffe wiederverwertet werden können (Recycling): Papier, Plastik und Verpackungen, Glas, Bioabfall, Restmüll. Noch besser ist es, Müll zu vermeiden.',
        'I rifiuti si separano per riciclare i materiali: carta, plastica, vetro, umido (organico), indifferenziato. Ancora meglio è produrre meno rifiuti.'],
      undefined,
      ['Die 3 R: Reduce (weniger), Reuse (wiederverwenden), Recycle (wiederverwerten).', 'Le 3 R: Ridurre, Riutilizzare, Riciclare.'])
  ], [
    ['Wolken für Rauch halten: Sie bestehen aus winzigen Wassertröpfchen.', 'Pensare che le nuvole siano fumo: sono goccioline d’acqua.']
  ], [
    term(['Verdunstung', 'Evaporazione'], ['Wasser wird zu Dampf.', 'L’acqua diventa vapore.']),
    term(['Recycling', 'Riciclo'], ['Aus altem Material wird Neues.', 'Da materiale vecchio si fa qualcosa di nuovo.'])
  ]),

  's4-welt': theory([
    sec(['Strom', 'L’elettricità'],
      ['Strom fließt nur in einem geschlossenen Stromkreis: Batterie, Kabel, Lampe, Schalter. Ist der Kreis unterbrochen, leuchtet die Lampe nicht. Metalle leiten Strom (Leiter), Holz, Plastik und Gummi nicht (Isolatoren).',
        'La corrente passa solo in un circuito chiuso: pila, fili, lampadina, interruttore. Se il circuito è aperto la lampadina non si accende. I metalli conducono (conduttori), legno, plastica e gomma no (isolanti).'],
      undefined,
      ['Niemals mit Steckdosen experimentieren – nur mit Batterien!', 'Non fare mai esperimenti con le prese di corrente: solo con le pile!']),
    sec(['Magnete', 'Le calamite'],
      ['Magnete ziehen Eisen, Nickel und Kobalt an. Jeder Magnet hat einen Nord- und einen Südpol. Gleiche Pole stoßen sich ab, verschiedene ziehen sich an. Der Kompass nutzt das Magnetfeld der Erde.',
        'Le calamite attirano ferro, nichel e cobalto. Ogni calamita ha un polo nord e un polo sud. Poli uguali si respingono, poli diversi si attraggono. La bussola sfrutta il campo magnetico terrestre.']),
    sec(['Karten lesen', 'Leggere le carte'],
      ['Eine Karte ist eine verkleinerte Darstellung von oben. Der Maßstab sagt, wie stark verkleinert wurde: 1 : 100 000 heißt 1 cm auf der Karte = 1 km in Wirklichkeit. Die Legende erklärt die Zeichen. Norden ist meist oben.',
        'Una carta è una rappresentazione ridotta vista dall’alto. La scala dice quanto è ridotta: 1 : 100 000 vuol dire 1 cm sulla carta = 1 km nella realtà. La legenda spiega i simboli. Il nord di solito è in alto.'],
      ['Himmelsrichtungen: Nie Ohne Seife Waschen (N, O, S, W im Uhrzeigersinn)', 'Punti cardinali: Nord, Est, Sud, Ovest (in senso orario)'])
  ], [
    ['Denken, Magnete ziehen alle Metalle an: Aluminium oder Kupfer nicht.', 'Pensare che le calamite attirino tutti i metalli: alluminio e rame no.']
  ], [
    term(['Stromkreis', 'Circuito elettrico'], ['Geschlossener Weg für den Strom.', 'Percorso chiuso per la corrente.']),
    term(['Maßstab', 'Scala'], ['Verhältnis Karte zu Wirklichkeit.', 'Rapporto tra carta e realtà.'])
  ]),

  'bio-tiere-pflanzen': theory([
    sec(['Wirbeltiere', 'I vertebrati'],
      ['Wirbeltiere haben eine Wirbelsäule. Es gibt fünf Klassen: Fische (Kiemen, Schuppen), Amphibien (Haut feucht, Larven im Wasser), Reptilien (Hornschuppen, Eier an Land), Vögel (Federn), Säugetiere (Fell, säugen ihre Jungen).',
        'I vertebrati hanno la colonna vertebrale. Ci sono cinque classi: pesci (branchie, squame), anfibi (pelle umida, larve in acqua), rettili (squame cornee, uova sulla terraferma), uccelli (piume), mammiferi (pelo, allattano i piccoli).'],
      ['Frosch: Amphibie (Kaulquappe → Frosch)\nWal: Säugetier, kein Fisch!\nFledermaus: Säugetier, kein Vogel!', 'Rana: anfibio (girino → rana)\nBalena: mammifero, non pesce!\nPipistrello: mammifero, non uccello!']),
    sec(['Die Zelle', 'La cellula'],
      ['Alle Lebewesen bestehen aus Zellen. Tier- und Pflanzenzellen haben Zellkern, Zellplasma und Zellmembran. Nur Pflanzenzellen haben zusätzlich Zellwand, Vakuole und Chloroplasten.',
        'Tutti gli esseri viventi sono fatti di cellule. Le cellule animali e vegetali hanno nucleo, citoplasma e membrana. Solo quelle vegetali hanno anche parete cellulare, vacuolo e cloroplasti.']),
    sec(['Fotosynthese', 'La fotosintesi'],
      ['Pflanzen stellen ihre Nahrung selbst her: In den Chloroplasten wandeln sie mit Lichtenergie Kohlenstoffdioxid und Wasser in Traubenzucker und Sauerstoff um.',
        'Le piante producono da sole il loro nutrimento: nei cloroplasti, con l’energia della luce, trasformano anidride carbonica e acqua in glucosio e ossigeno.'],
      ['Kohlenstoffdioxid + Wasser → (Licht) → Traubenzucker + Sauerstoff\n6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', 'anidride carbonica + acqua → (luce) → glucosio + ossigeno\n6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂'],
      ['Ohne Pflanzen gäbe es keinen Sauerstoff zum Atmen.', 'Senza piante non ci sarebbe ossigeno da respirare.'])
  ], [
    ['Wale und Delfine für Fische halten: Sie atmen mit Lungen und säugen.', 'Considerare balene e delfini pesci: respirano con i polmoni e allattano.']
  ], [
    term(['Chloroplast', 'Cloroplasto'], ['Grünes Zellorganell für die Fotosynthese.', 'Organulo verde dove avviene la fotosintesi.']),
    term(['Wirbelsäule', 'Colonna vertebrale'], ['Rückgrat aus Wirbeln.', 'Struttura di vertebre lungo la schiena.'])
  ]),

  'bio-mensch': theory([
    sec(['Atmung und Kreislauf', 'Respirazione e circolazione'],
      ['In der Lunge gelangt Sauerstoff aus der Luft über die Lungenbläschen ins Blut. Das Herz pumpt das Blut durch den Körper: Arterien führen vom Herzen weg, Venen zum Herzen hin. Rote Blutkörperchen transportieren Sauerstoff, weiße wehren Krankheitserreger ab, Blutplättchen schließen Wunden.',
        'Nei polmoni l’ossigeno passa dall’aria al sangue attraverso gli alveoli. Il cuore pompa il sangue in tutto il corpo: le arterie partono dal cuore, le vene ritornano al cuore. I globuli rossi trasportano ossigeno, i globuli bianchi combattono i microbi, le piastrine chiudono le ferite.']),
    sec(['Verdauung', 'La digestione'],
      ['Mund (Zähne zerkleinern, Speichel) → Speiseröhre → Magen (Magensäure) → Dünndarm (Nährstoffe gelangen ins Blut) → Dickdarm (Wasser wird entzogen). Enzyme zerlegen Nährstoffe: Kohlenhydrate, Fette, Eiweiße.',
        'Bocca (denti e saliva) → esofago → stomaco (succhi gastrici) → intestino tenue (i nutrienti passano nel sangue) → intestino crasso (si assorbe l’acqua). Gli enzimi scompongono carboidrati, grassi e proteine.'],
      undefined,
      ['Der Dünndarm ist etwa 5 m lang, durch Zotten so groß wie ein Tennisplatz.', 'L’intestino tenue è lungo circa 5 m e grazie ai villi ha una superficie grande come un campo da tennis.']),
    sec(['Nerven und Sinne', 'Sistema nervoso e sensi'],
      ['Sinnesorgane nehmen Reize auf, Nerven leiten sie als elektrische Signale zum Gehirn, das sie verarbeitet und Befehle an Muskeln schickt. Reflexe laufen über das Rückenmark und sind besonders schnell.',
        'Gli organi di senso ricevono stimoli, i nervi li trasmettono come segnali elettrici al cervello, che li elabora e invia comandi ai muscoli. I riflessi passano dal midollo spinale e sono velocissimi.'],
      ['Reiz → Sinnesorgan → Nerv → Gehirn → Nerv → Muskel', 'Stimolo → organo di senso → nervo → cervello → nervo → muscolo'])
  ], [
    ['„Arterien führen sauerstoffreiches Blut“ – nicht immer: Die Lungenarterie führt sauerstoffarmes Blut. Entscheidend ist die Richtung.', '“Le arterie portano sangue ossigenato” non è sempre vero: l’arteria polmonare no. Conta la direzione.']
  ], [
    term(['Lungenbläschen', 'Alveoli'], ['Ort des Gasaustauschs.', 'Dove avviene lo scambio dei gas.']),
    term(['Enzym', 'Enzima'], ['Eiweiß, das Stoffe zerlegt oder umbaut.', 'Proteina che accelera le reazioni.'])
  ]),

  'bio-genetik': theory([
    sec(['DNA und Gene', 'DNA e geni'],
      ['Die Erbinformation liegt in der DNA im Zellkern. Die DNA ist eine Doppelhelix aus vier Basen (A, T, G, C). Ein Gen ist ein Abschnitt, der die Information für ein Merkmal (ein Protein) trägt. Der Mensch hat 46 Chromosomen (23 Paare).',
        'L’informazione ereditaria si trova nel DNA, nel nucleo. Il DNA è una doppia elica con quattro basi (A, T, G, C). Un gene è un tratto che contiene l’informazione per un carattere (una proteina). L’uomo ha 46 cromosomi (23 coppie).']),
    sec(['Mendelsche Regeln', 'Le leggi di Mendel'],
      ['Jeder Mensch hat zwei Allele pro Gen (eins von jedem Elternteil). Dominante Allele (A) setzen sich gegen rezessive (a) durch. Kreuzt man zwei Mischerbige (Aa × Aa), entstehen im Mittel 3 : 1 im Erscheinungsbild.',
        'Ognuno ha due alleli per gene (uno da ciascun genitore). Gli alleli dominanti (A) prevalgono sui recessivi (a). Incrociando due eterozigoti (Aa × Aa) si ottiene in media un rapporto fenotipico 3 : 1.'],
      ['Aa × Aa → AA, Aa, aA, aa → 3 dominant : 1 rezessiv', 'Aa × Aa → AA, Aa, aA, aa → 3 dominanti : 1 recessivo']),
    sec(['Ökosysteme', 'Gli ecosistemi'],
      ['Ein Ökosystem besteht aus Lebensraum (Biotop) und Lebensgemeinschaft (Biozönose). Nahrungsketten: Produzenten (Pflanzen) → Konsumenten → Destruenten (zersetzen). Energie geht von Stufe zu Stufe zum großen Teil verloren (ca. 90 %).',
        'Un ecosistema comprende ambiente (biotopo) e comunità di viventi (biocenosi). Catene alimentari: produttori (piante) → consumatori → decompositori. A ogni livello si perde gran parte dell’energia (circa il 90 %).'],
      ['Gras → Hase → Fuchs; Pilze und Bakterien zersetzen tote Tiere', 'Erba → lepre → volpe; funghi e batteri decompongono gli organismi morti'])
  ], [
    ['Genotyp und Phänotyp verwechseln: Genotyp = Erbanlagen, Phänotyp = Erscheinungsbild.', 'Confondere genotipo (geni) e fenotipo (aspetto).']
  ], [
    term(['Allel', 'Allele'], ['Variante eines Gens.', 'Variante di un gene.']),
    term(['Produzent', 'Produttore'], ['Lebewesen, das Biomasse aus Licht aufbaut.', 'Organismo che produce sostanza organica con la luce.'])
  ]),

  'bio-zelle-evolution': theory([
    sec(['Proteinbiosynthese', 'Sintesi proteica'],
      ['Transkription: Im Zellkern wird ein Gen der DNA in mRNA umgeschrieben. Translation: An den Ribosomen wird die mRNA in Dreiergruppen (Codons) gelesen; tRNA bringt passende Aminosäuren, es entsteht ein Protein.',
        'Trascrizione: nel nucleo un gene del DNA viene copiato in mRNA. Traduzione: nei ribosomi l’mRNA viene letto a triplette (codoni); i tRNA portano gli amminoacidi e si forma la proteina.'],
      ['DNA → (Transkription) → mRNA → (Translation) → Protein', 'DNA → (trascrizione) → mRNA → (traduzione) → proteina']),
    sec(['Zellteilung', 'Divisione cellulare'],
      ['Mitose: Aus einer Zelle entstehen zwei genetisch gleiche Tochterzellen (Wachstum, Heilung). Meiose: Bildung von Keimzellen mit halbem Chromosomensatz; durch Neukombination entsteht Vielfalt.',
        'Mitosi: da una cellula nascono due cellule figlie geneticamente identiche (crescita, riparazione). Meiosi: formazione dei gameti con metà dei cromosomi; la ricombinazione crea varietà.']),
    sec(['Evolution', 'Evoluzione'],
      ['Nach Darwin: Individuen unterscheiden sich (Variation durch Mutation und Rekombination). Es entstehen mehr Nachkommen, als überleben können. Die am besten angepassten überleben und vermehren sich häufiger (natürliche Selektion). Über viele Generationen verändern sich Arten.',
        'Secondo Darwin: gli individui sono diversi (variabilità per mutazioni e ricombinazione). Nascono più figli di quanti possano sopravvivere. I più adatti sopravvivono e si riproducono di più (selezione naturale). In molte generazioni le specie cambiano.'],
      ['Birkenspanner: In rußigen Industriegebieten überlebten dunkle Falter häufiger.', 'Biston betularia: nelle zone industriali annerite dalla fuliggine sopravvivevano di più le falene scure.'],
      ['Nicht das Individuum passt sich an, sondern die Population verändert sich über Generationen.', 'Non è il singolo che si adatta: è la popolazione che cambia nelle generazioni.'])
  ], [
    ['Lamarck statt Darwin: „Die Giraffe streckte sich, darum wurde der Hals länger“ ist falsch.', 'Ragionare come Lamarck: “la giraffa si allungava e il collo cresceva” è sbagliato.']
  ], [
    term(['Codon', 'Codone'], ['Drei Basen, die eine Aminosäure codieren.', 'Tre basi che codificano un amminoacido.']),
    term(['Selektion', 'Selezione'], ['Auslese der am besten Angepassten.', 'Sopravvivenza dei più adatti.'])
  ]),

  'phy-grundlagen': theory([
    sec(['Wärme und Temperatur', 'Calore e temperatura'],
      ['Temperatur sagt, wie warm etwas ist (gemessen in °C). Wärme ist Energie, die von warm nach kalt fließt: durch Leitung (Metalllöffel), Strömung (warme Luft steigt) und Strahlung (Sonne). Die meisten Stoffe dehnen sich bei Erwärmung aus.',
        'La temperatura dice quanto è caldo un corpo (in °C). Il calore è energia che passa dal caldo al freddo: per conduzione (cucchiaio di metallo), convezione (l’aria calda sale) e irraggiamento (sole). Quasi tutti i corpi si dilatano se riscaldati.']),
    sec(['Licht und Schall', 'Luce e suono'],
      ['Licht breitet sich geradlinig und sehr schnell aus (300 000 km/s). Hinter Hindernissen entsteht Schatten. Spiegel reflektieren: Einfallswinkel = Ausfallswinkel. Schall entsteht durch Schwingungen und braucht ein Medium (Luft, Wasser); in Luft ist er ca. 340 m/s schnell.',
        'La luce si propaga in linea retta e velocissima (300 000 km/s). Dietro un ostacolo si forma l’ombra. Lo specchio riflette: angolo di incidenza = angolo di riflessione. Il suono nasce da vibrazioni e ha bisogno di un mezzo (aria, acqua); nell’aria viaggia a circa 340 m/s.'],
      ['Gewitter: Blitz sehen, Sekunden zählen bis zum Donner, durch 3 teilen → Entfernung in km.', 'Temporale: vedi il lampo, conta i secondi fino al tuono, dividi per 3 → distanza in km.']),
    sec(['Kräfte und Magnetismus', 'Forze e magnetismo'],
      ['Kräfte verändern Bewegung oder Form eines Körpers. Man misst sie in Newton (N). Die Gewichtskraft zieht alles zur Erde. Magnete haben Nord- und Südpol; gleichnamige Pole stoßen sich ab.',
        'Le forze cambiano il moto o la forma di un corpo. Si misurano in newton (N). La forza peso attira tutto verso la Terra. I magneti hanno polo nord e sud; poli uguali si respingono.'],
      undefined,
      ['Masse (kg) ist überall gleich, die Gewichtskraft auf dem Mond ist nur ein Sechstel.', 'La massa (kg) è uguale ovunque, il peso sulla Luna è solo un sesto.'])
  ], [
    ['Wärme und Temperatur gleichsetzen.', 'Confondere calore e temperatura.'],
    ['Denken, Schall gäbe es im Weltall: Dort ist kein Medium.', 'Pensare che il suono si propaghi nello spazio: lì non c’è un mezzo.']
  ], [
    term(['Newton (N)', 'Newton (N)'], ['Einheit der Kraft.', 'Unità di misura della forza.']),
    term(['Reflexion', 'Riflessione'], ['Zurückwerfen von Licht.', 'Rimbalzo della luce su una superficie.'])
  ]),

  'phy-rechnen': theory([
    sec(['Geschwindigkeit', 'Velocità'],
      ['v = s / t (Weg durch Zeit). Einheiten: m/s oder km/h. Umrechnen: 1 m/s = 3,6 km/h. Formel umstellen: s = v · t, t = s / v.',
        'v = s / t (spazio diviso tempo). Unità: m/s o km/h. Conversione: 1 m/s = 3,6 km/h. Formule inverse: s = v · t, t = s / v.'],
      ['Ein Zug fährt 240 km in 2 h → v = 120 km/h ≈ 33,3 m/s', 'Un treno percorre 240 km in 2 h → v = 120 km/h ≈ 33,3 m/s']),
    sec(['Dichte', 'Densità'],
      ['ρ = m / V (Masse durch Volumen). Wasser hat 1 g/cm³. Was eine kleinere Dichte als Wasser hat, schwimmt.',
        'd = m / V (massa diviso volume). L’acqua ha 1 g/cm³. Ciò che ha densità minore dell’acqua galleggia.'],
      ['Holzklotz: 600 g, 1000 cm³ → ρ = 0,6 g/cm³ → schwimmt', 'Blocco di legno: 600 g, 1000 cm³ → d = 0,6 g/cm³ → galleggia']),
    sec(['Ohmsches Gesetz und Leistung', 'Legge di Ohm e potenza'],
      ['U = R · I: Spannung (Volt) = Widerstand (Ohm) mal Stromstärke (Ampere). Elektrische Leistung P = U · I (Watt). Energie E = P · t.',
        'V = R · I: tensione (volt) = resistenza (ohm) per intensità di corrente (ampere). Potenza elettrica P = V · I (watt). Energia E = P · t.'],
      ['U = 230 V, R = 46 Ω → I = 5 A\nP = 230 V · 5 A = 1150 W', 'V = 230 V, R = 46 Ω → I = 5 A\nP = 230 V × 5 A = 1150 W']),
    sec(['Energie', 'Energia'],
      ['Lageenergie E = m · g · h, Bewegungsenergie E = ½ · m · v² (g ≈ 9,81 N/kg). Energie wird nicht erzeugt oder vernichtet, nur umgewandelt (Energieerhaltung).',
        'Energia potenziale U = m · g · h, energia cinetica K = ½ · m · v² (g ≈ 9,81 N/kg). L’energia non si crea né si distrugge, si trasforma (conservazione dell’energia).'],
      ['2 kg in 5 m Höhe: E = 2 · 9,81 · 5 ≈ 98 J', '2 kg a 5 m di altezza: U = 2 × 9,81 × 5 ≈ 98 J'],
      ['Immer zuerst alle Größen in SI-Einheiten umrechnen (m, s, kg).', 'Converti sempre prima tutto in unità SI (m, s, kg).'])
  ], [
    ['km/h und m/s mischen.', 'Mescolare km/h e m/s.'],
    ['Formel falsch umstellen: Prüfe mit den Einheiten!', 'Invertire male la formula: controlla con le unità di misura!']
  ], [
    term(['Spannung U', 'Tensione V'], ['Antrieb des Stroms, in Volt.', 'Differenza di potenziale, in volt.']),
    term(['Joule (J)', 'Joule (J)'], ['Einheit der Energie.', 'Unità di misura dell’energia.'])
  ]),

  'phy-oberstufe': theory([
    sec(['Mechanik', 'Meccanica'],
      ['Newtons Gesetze: 1. Trägheit: Ohne Kraft bleibt ein Körper in Ruhe oder gleichförmiger Bewegung. 2. F = m · a. 3. Actio = Reactio. Impuls p = m · v bleibt in abgeschlossenen Systemen erhalten.',
        'Principi di Newton: 1. Inerzia: senza forze un corpo resta fermo o in moto rettilineo uniforme. 2. F = m · a. 3. Azione e reazione. La quantità di moto p = m · v si conserva nei sistemi isolati.']),
    sec(['Schwingungen und Wellen', 'Oscillazioni e onde'],
      ['Wellen transportieren Energie, keine Materie. c = λ · f (Ausbreitungsgeschwindigkeit = Wellenlänge mal Frequenz). Licht ist eine elektromagnetische Welle; Interferenz und Beugung zeigen den Wellencharakter.',
        'Le onde trasportano energia, non materia. v = λ · f (velocità = lunghezza d’onda per frequenza). La luce è un’onda elettromagnetica; interferenza e diffrazione ne mostrano la natura ondulatoria.'],
      ['Ton mit 440 Hz in Luft: λ = 340 / 440 ≈ 0,77 m', 'Nota a 440 Hz nell’aria: λ = 340 / 440 ≈ 0,77 m']),
    sec(['Moderne Physik', 'Fisica moderna'],
      ['Licht besteht auch aus Photonen mit E = h · f (Fotoeffekt, Einstein). Atome haben diskrete Energieniveaus. Radioaktiver Zerfall: Alpha-, Beta-, Gammastrahlung; nach einer Halbwertszeit ist die Hälfte zerfallen. E = m · c².',
        'La luce è fatta anche di fotoni con E = h · f (effetto fotoelettrico, Einstein). Gli atomi hanno livelli di energia discreti. Decadimento radioattivo: radiazioni alfa, beta, gamma; dopo un tempo di dimezzamento ne resta la metà. E = m · c².'],
      undefined,
      ['Halbwertszeit: nach 2 HWZ bleibt ¼, nach 3 HWZ ⅛.', 'Tempo di dimezzamento: dopo 2 tempi resta ¼, dopo 3 ⅛.'])
  ], [
    ['Denken, für Bewegung brauche es immer eine Kraft. Nur für Änderung der Bewegung!', 'Pensare che per muoversi serva sempre una forza: serve solo per cambiare il moto!']
  ], [
    term(['Frequenz', 'Frequenza'], ['Schwingungen pro Sekunde, in Hertz.', 'Oscillazioni al secondo, in hertz.']),
    term(['Photon', 'Fotone'], ['Lichtteilchen.', 'Particella di luce.'])
  ]),

  'che-stoffe': theory([
    sec(['Reinstoffe und Gemische', 'Sostanze pure e miscugli'],
      ['Reinstoffe haben feste Eigenschaften (Siedetemperatur, Dichte). Gemische bestehen aus mehreren Stoffen: homogen (Salzwasser, Luft) oder heterogen (Sand-Wasser, Müsli). Trennverfahren: Filtrieren, Sieben, Eindampfen, Destillieren, Magnettrennung.',
        'Le sostanze pure hanno proprietà fisse (temperatura di ebollizione, densità). I miscugli contengono più sostanze: omogenei (acqua salata, aria) o eterogenei (sabbia e acqua). Metodi di separazione: filtrazione, setacciatura, evaporazione, distillazione, separazione magnetica.']),
    sec(['Chemische Reaktion', 'Reazione chimica'],
      ['Bei einer chemischen Reaktion entstehen neue Stoffe mit neuen Eigenschaften. Dabei wird Energie frei (exotherm) oder benötigt (endotherm). Die Masse bleibt erhalten.',
        'In una reazione chimica si formano sostanze nuove con proprietà nuove. Si libera energia (esotermica) o se ne assorbe (endotermica). La massa si conserva (Lavoisier).'],
      ['Eisen + Schwefel → Eisensulfid (+ Energie)', 'Ferro + zolfo → solfuro di ferro (+ energia)']),
    sec(['Verbrennung', 'La combustione'],
      ['Eine Verbrennung ist eine Reaktion mit Sauerstoff (Oxidation). Feuer braucht drei Dinge: brennbaren Stoff, Sauerstoff, Zündtemperatur (Verbrennungsdreieck). Fehlt eins, erlischt das Feuer.',
        'La combustione è una reazione con l’ossigeno (ossidazione). Il fuoco ha bisogno di tre cose: combustibile, ossigeno (comburente), temperatura di accensione (triangolo del fuoco). Se ne manca una, si spegne.'],
      ['Kohlenstoff + Sauerstoff → Kohlenstoffdioxid\nC + O₂ → CO₂', 'Carbonio + ossigeno → anidride carbonica\nC + O₂ → CO₂'],
      ['Fettbrand nie mit Wasser löschen, sondern Deckel drauf (Sauerstoff entziehen).', 'Non spegnere mai olio in fiamme con l’acqua: copri con un coperchio (togli l’ossigeno).'])
  ], [
    ['Lösen (Zucker in Wasser) für eine chemische Reaktion halten. Es ist ein physikalischer Vorgang.', 'Considerare lo scioglimento dello zucchero una reazione chimica: è un fenomeno fisico.']
  ], [
    term(['Oxidation', 'Ossidazione'], ['Reaktion mit Sauerstoff (im einfachen Modell).', 'Reazione con l’ossigeno (modello semplice).']),
    term(['exotherm', 'esotermica'], ['Gibt Energie ab.', 'Libera energia.'])
  ]),

  'che-periodensystem': theory([
    sec(['Atombau', 'La struttura dell’atomo'],
      ['Ein Atom hat einen Kern aus Protonen (+) und Neutronen (0) und eine Hülle aus Elektronen (−). Die Ordnungszahl ist die Zahl der Protonen. Die Elektronen der äußersten Schale (Valenzelektronen) bestimmen das chemische Verhalten.',
        'L’atomo ha un nucleo di protoni (+) e neutroni (0) e attorno gli elettroni (−). Il numero atomico è il numero di protoni. Gli elettroni del livello più esterno (elettroni di valenza) determinano il comportamento chimico.']),
    sec(['Das Periodensystem', 'La tavola periodica'],
      ['Die Elemente sind nach Ordnungszahl geordnet. Perioden (Zeilen) = Zahl der Schalen. Hauptgruppen (Spalten) = Zahl der Valenzelektronen. Gruppe I: Alkalimetalle (reaktiv), VII: Halogene, VIII: Edelgase (reaktionsträge).',
        'Gli elementi sono ordinati per numero atomico. Periodi (righe) = numero di livelli. Gruppi (colonne) = elettroni di valenza. Gruppo I: metalli alcalini (reattivi), VII: alogeni, VIII: gas nobili (inerti).'],
      ['Natrium: Ordnungszahl 11, 3. Periode, I. Hauptgruppe → 1 Valenzelektron', 'Sodio: numero atomico 11, 3° periodo, gruppo I → 1 elettrone di valenza']),
    sec(['Bindungen, Säuren und Basen', 'Legami, acidi e basi'],
      ['Ionenbindung: Metall gibt Elektronen an Nichtmetall ab (NaCl). Elektronenpaarbindung: Nichtmetalle teilen Elektronen (H₂O). Säuren geben H⁺-Ionen ab, Basen nehmen sie auf. pH < 7 sauer, 7 neutral, > 7 basisch. Säure + Base → Salz + Wasser (Neutralisation).',
        'Legame ionico: il metallo cede elettroni al non metallo (NaCl). Legame covalente: i non metalli condividono elettroni (H₂O). Gli acidi cedono ioni H⁺, le basi li accettano. pH < 7 acido, 7 neutro, > 7 basico. Acido + base → sale + acqua (neutralizzazione).'],
      ['HCl + NaOH → NaCl + H₂O', 'HCl + NaOH → NaCl + H₂O'],
      ['Edelgaskonfiguration: Atome streben acht Außenelektronen an (Oktettregel).', 'Regola dell’ottetto: gli atomi tendono ad avere otto elettroni esterni.'])
  ], [
    ['Ordnungszahl und Massenzahl verwechseln.', 'Confondere numero atomico e numero di massa.']
  ], [
    term(['Ion', 'Ione'], ['Geladenes Teilchen.', 'Particella carica.']),
    term(['pH-Wert', 'pH'], ['Maß für sauer oder basisch.', 'Misura di acidità o basicità.'])
  ]),

  'che-organik': theory([
    sec(['Kohlenwasserstoffe', 'Idrocarburi'],
      ['Organische Chemie ist die Chemie der Kohlenstoffverbindungen. Kohlenstoff bildet vier Bindungen. Alkane haben nur Einfachbindungen (CₙH₂ₙ₊₂: Methan, Ethan, Propan, Butan …), Alkene eine Doppelbindung, Alkine eine Dreifachbindung.',
        'La chimica organica studia i composti del carbonio. Il carbonio forma quattro legami. Gli alcani hanno solo legami semplici (CₙH₂ₙ₊₂: metano, etano, propano, butano …), gli alcheni un doppio legame, gli alchini un triplo.'],
      ['Ethan C₂H₆, Ethen C₂H₄, Ethin C₂H₂', 'Etano C₂H₆, etene C₂H₄, etino C₂H₂']),
    sec(['Funktionelle Gruppen', 'Gruppi funzionali'],
      ['Funktionelle Gruppen bestimmen die Eigenschaften: Hydroxygruppe −OH (Alkohole, z. B. Ethanol), Carboxygruppe −COOH (Carbonsäuren, z. B. Essigsäure), Ester entstehen aus Alkohol und Säure (Duftstoffe).',
        'I gruppi funzionali determinano le proprietà: ossidrile −OH (alcoli, es. etanolo), carbossile −COOH (acidi carbossilici, es. acido acetico); gli esteri si formano da alcol e acido (profumi).']),
    sec(['Chemisches Gleichgewicht', 'Equilibrio chimico'],
      ['Viele Reaktionen laufen in beide Richtungen ab. Im Gleichgewicht sind Hin- und Rückreaktion gleich schnell. Prinzip von Le Chatelier: Ein System weicht einem äußeren Zwang aus (Konzentration, Druck, Temperatur).',
        'Molte reazioni avvengono in entrambi i sensi. All’equilibrio le velocità diretta e inversa sono uguali. Principio di Le Chatelier: il sistema reagisce opponendosi a una perturbazione (concentrazione, pressione, temperatura).'],
      ['N₂ + 3 H₂ ⇌ 2 NH₃ (Haber-Bosch): hoher Druck verschiebt nach rechts', 'N₂ + 3 H₂ ⇌ 2 NH₃ (Haber-Bosch): l’alta pressione sposta a destra'],
      ['Gleichgewicht heißt nicht, dass gleich viel von allem da ist!', 'Equilibrio non vuol dire che ci sia la stessa quantità di tutto!'])
  ], [
    ['Bei Alkenen die Zahl der H-Atome wie bei Alkanen rechnen.', 'Contare gli idrogeni degli alcheni come negli alcani.']
  ], [
    term(['Alkan', 'Alcano'], ['Kohlenwasserstoff mit Einfachbindungen.', 'Idrocarburo con soli legami semplici.']),
    term(['Katalysator', 'Catalizzatore'], ['Beschleunigt eine Reaktion, ohne verbraucht zu werden.', 'Accelera la reazione senza consumarsi.'])
  ])
};
