import type { ChapterId, DrivingCountry, I18n } from './schema';

export interface ChapterDef { id: ChapterId; name: I18n; icon: string }

/** Kapitel, die jede Länder-Matrix mindestens abdecken muss. */
export const CHAPTERS: ChapterDef[] = [
  { id: 'segnali', name: { de: 'Verkehrszeichen', it: 'Segnaletica' }, icon: 'schild' },
  { id: 'precedenza', name: { de: 'Vorfahrt und Vorrang', it: 'Precedenze' }, icon: 'vorfahrt' },
  { id: 'velocita', name: { de: 'Geschwindigkeit und Abstand', it: 'Velocità e distanze' }, icon: 'tempo' },
  { id: 'manovre', name: { de: 'Fahrmanöver und Überholen', it: 'Manovre e sorpasso' }, icon: 'auto' },
  { id: 'sosta', name: { de: 'Halten und Parken', it: 'Fermata e sosta' }, icon: 'parken' },
  { id: 'autostrada', name: { de: 'Autobahn', it: 'Autostrada' }, icon: 'autobahn' },
  { id: 'vulnerabili', name: { de: 'Fußgänger, Rad, Kinder', it: 'Utenti vulnerabili' }, icon: 'person-walk' },
  { id: 'meteo', name: { de: 'Wetter, Licht, Gefahren', it: 'Meteo, luci e rischi' }, icon: 'gefahr' },
  { id: 'veicolo', name: { de: 'Technik und Sicherheit', it: 'Tecnica e sicurezza del veicolo' }, icon: 'technik' },
  { id: 'incidente', name: { de: 'Unfall und Erste Hilfe', it: 'Incidente e soccorso' }, icon: 'hilfe' },
  { id: 'persona', name: { de: 'Alkohol, Probezeit, Recht', it: 'Alcol, patente e punti' }, icon: 'person' },
  { id: 'ambiente', name: { de: 'Umweltschutz', it: 'Ambiente' }, icon: 'umwelt' }
];
export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id);

/**
 * Abdeckungs-Matrix je Land: welches amtliche Sachgebiet zu welchem Kapitel gehört,
 * was mit der amtlichen Quelle abgeglichen ist und was noch fehlt.
 * Stand: Demo-Inhalt. Nichts ist bisher Frage für Frage mit dem amtlichen Katalog abgeglichen.
 */
export interface CoverageRow {
  chapter: ChapterId;
  /** Entsprechung im amtlichen Programm bzw. Katalog */
  official: I18n;
  verified: I18n;
  missing: I18n;
}

const NOT_VERIFIED: I18n = { de: 'Allgemeine Regeln geprüft, Fragen noch nicht mit dem amtlichen Katalog abgeglichen.', it: 'Regole generali controllate, domande non ancora confrontate con il database ufficiale.' };

export const COVERAGE: Record<DrivingCountry, CoverageRow[]> = {
  DE: [
    { chapter: 'segnali', official: { de: 'Sachgebiet Verkehrszeichen (Grundstoff)', it: 'Area “Segnali stradali” (parte di base)' }, verified: NOT_VERIFIED, missing: { de: 'Zusatzzeichen, Verkehrseinrichtungen, Markierungen, Wegweiser, Lichtzeichen mit Pfeilen.', it: 'Pannelli integrativi, dispositivi stradali, segnaletica orizzontale, indicazioni di direzione, semafori a frecce.' } },
    { chapter: 'precedenza', official: { de: 'Sachgebiet Vorfahrt/Vorrang (Grundstoff)', it: 'Area “Precedenza” (parte di base)' }, verified: NOT_VERIFIED, missing: { de: 'Abknickende Vorfahrt, Straßenbahn, Zeichen der Polizei im Detail, weitere Kreuzungsbilder.', it: 'Precedenza che cambia direzione, tram, segnali degli agenti nel dettaglio, altri incroci illustrati.' } },
    { chapter: 'velocita', official: { de: 'Verhalten im Straßenverkehr: Geschwindigkeit, Abstand', it: 'Comportamento: velocità e distanza' }, verified: NOT_VERIFIED, missing: { de: 'Geschwindigkeit mit Anhänger, Schnee/Eis (Schneeketten), Anhalteweg-Rechenaufgaben mit Zahleneingabe.', it: 'Velocità con rimorchio, neve e ghiaccio (catene), calcoli dello spazio d’arresto con risposta numerica.' } },
    { chapter: 'manovre', official: { de: 'Verhalten im Straßenverkehr: Überholen, Abbiegen, Fahrstreifen', it: 'Comportamento: sorpasso, svolta, corsie' }, verified: NOT_VERIFIED, missing: { de: 'Wenden, Rückwärtsfahren, Einfahren in den fließenden Verkehr, Überholen von Straßenbahnen.', it: 'Inversione, retromarcia, immissione nel traffico, sorpasso dei tram.' } },
    { chapter: 'sosta', official: { de: 'Halten und Parken (StVO § 12)', it: 'Fermata e sosta (StVO § 12)' }, verified: NOT_VERIFIED, missing: { de: 'Parkscheibe, Bewohnerparken, Halten in zweiter Reihe, Ladezonen.', it: 'Disco orario, parcheggio residenti, sosta in doppia fila, zone di carico.' } },
    { chapter: 'autostrada', official: { de: 'Autobahn und Kraftfahrstraße', it: 'Autostrada e superstrade' }, verified: NOT_VERIFIED, missing: { de: 'Einfädeln und Ausfädeln im Detail, Kraftfahrstraße, Verhalten bei Panne im Baustellenbereich.', it: 'Immissione e uscita nel dettaglio, superstrada (Kraftfahrstraße), guasto nei cantieri.' } },
    { chapter: 'vulnerabili', official: { de: 'Gefahrenlehre: Fußgänger, Radfahrer, Kinder, ältere Menschen', it: 'Pericoli: pedoni, ciclisti, bambini, anziani' }, verified: NOT_VERIFIED, missing: { de: 'E-Scooter, Linienbusse mit Warnblinklicht im Detail, Reiter und Tiere.', it: 'Monopattini elettrici, autobus di linea con luci di emergenza nel dettaglio, cavalieri e animali.' } },
    { chapter: 'meteo', official: { de: 'Gefahrenlehre: Witterung, Dunkelheit, Sicht', it: 'Pericoli: meteo, buio, visibilità' }, verified: NOT_VERIFIED, missing: { de: 'Seitenwind, Laub, Blendung durch Sonne, Videofragen.', it: 'Vento laterale, foglie, abbagliamento del sole, domande video.' } },
    { chapter: 'veicolo', official: { de: 'Technik (Zusatzstoff Klasse B)', it: 'Tecnica (parte aggiuntiva classe B)' }, verified: NOT_VERIFIED, missing: { de: 'Ladung sichern, Anhänger, Kontrollleuchten, Fahrerassistenzsysteme.', it: 'Fissaggio del carico, rimorchio, spie, sistemi di assistenza.' } },
    { chapter: 'incidente', official: { de: 'Verhalten bei Unfällen', it: 'Comportamento in caso di incidente' }, verified: NOT_VERIFIED, missing: { de: 'Unfallflucht, Pflichten gegenüber Polizei und Versicherung, Brand am Fahrzeug.', it: 'Fuga dopo incidente, obblighi verso polizia e assicurazione, incendio del veicolo.' } },
    { chapter: 'persona', official: { de: 'Eignung und Befähigung von Kraftfahrern', it: 'Idoneità e capacità del conducente' }, verified: NOT_VERIFIED, missing: { de: 'Drogen und Cannabis-Grenzwert, Fahreignungsregister (Punkte), Begleitetes Fahren.', it: 'Droghe e limite per la cannabis, registro punti (Flensburg), guida accompagnata.' } },
    { chapter: 'ambiente', official: { de: 'Umweltschutz', it: 'Tutela dell’ambiente' }, verified: NOT_VERIFIED, missing: { de: 'Umweltzonen, Lärm, Entsorgung von Betriebsstoffen.', it: 'Zone ambientali, rumore, smaltimento dei liquidi.' } }
  ],
  IT: [
    { chapter: 'segnali', official: { de: 'Programm: Gefahr-, Verbots-, Gebots-, Vorfahrts- und Hinweiszeichen, Markierungen, Ampeln', it: 'Programma: segnali di pericolo, divieto, obbligo, precedenza, indicazione, segnaletica orizzontale, semafori' }, verified: NOT_VERIFIED, missing: { de: 'Pannelli integrativi, gelbe/blaue Hinweistafeln, Markierungen, Zeichen der Verkehrspolizei.', it: 'Pannelli integrativi, segnali di indicazione e turistici, segnaletica orizzontale, segnali degli agenti.' } },
    { chapter: 'precedenza', official: { de: 'Programm: Vorfahrtsregeln an Kreuzungen', it: 'Programma: norme sulla precedenza' }, verified: NOT_VERIFIED, missing: { de: 'Straßenbahn, Zeichen der Polizei im Detail, weitere Kreuzungsbilder.', it: 'Tram, segnali degli agenti nel dettaglio, altri incroci illustrati.' } },
    { chapter: 'velocita', official: { de: 'Programm: Geschwindigkeitsgrenzen, Abstand, Bremsweg', it: 'Programma: limiti di velocità, distanza di sicurezza, spazio di frenatura' }, verified: NOT_VERIFIED, missing: { de: 'Kuppen, Kurven, Gefahrenhinweise zur Geschwindigkeit, Tempomat.', it: 'Dossi, curve, casi in cui moderare la velocità, regolatore di velocità.' } },
    { chapter: 'manovre', official: { de: 'Programm: Fahrstreifen, Überholen, Wenden', it: 'Programma: posizione sulla carreggiata, cambio di corsia, sorpasso, inversione' }, verified: NOT_VERIFIED, missing: { de: 'Wenden, Rückwärtsfahren, Einordnen, Abbiegen im Detail.', it: 'Inversione di marcia, retromarcia, svolta e preselezione nel dettaglio.' } },
    { chapter: 'sosta', official: { de: 'Programm: Halten, Parken, Verbote', it: 'Programma: fermata, sosta, arresto' }, verified: NOT_VERIFIED, missing: { de: 'Sosta in doppia fila, Behindertenparkplätze, Disco orario.', it: 'Doppia fila, stalli per disabili, disco orario.' } },
    { chapter: 'autostrada', official: { de: 'Programm: Autobahn und Schnellstraßen', it: 'Programma: autostrade e strade extraurbane principali' }, verified: NOT_VERIFIED, missing: { de: 'Mautstellen, Panne in Tunneln, Einfahren im Detail.', it: 'Caselli, guasto in galleria, immissione nel dettaglio.' } },
    { chapter: 'vulnerabili', official: { de: 'Programm: Fußgänger, Radfahrer, Kinder', it: 'Programma: comportamento verso pedoni, ciclisti e utenti deboli' }, verified: NOT_VERIFIED, missing: { de: 'Monopattini, Schulbusse, Tiere.', it: 'Monopattini, scuolabus, animali.' } },
    { chapter: 'meteo', official: { de: 'Programm: Beleuchtung, Sicht, Witterung', it: 'Programma: uso delle luci, visibilità, condizioni atmosferiche' }, verified: NOT_VERIFIED, missing: { de: 'Schneeketten und Winterreifen-Pflicht, Gallerien, Aquaplaning-Fragen.', it: 'Obbligo di catene e gomme invernali, gallerie, aquaplaning.' } },
    { chapter: 'veicolo', official: { de: 'Programm: Fahrzeugteile, Sicherheitsausrüstung, Wartung', it: 'Programma: elementi del veicolo, dispositivi di sicurezza, manutenzione' }, verified: NOT_VERIFIED, missing: { de: 'Lenkung, Federung, Kontrollleuchten, Fahrzeugpapiere.', it: 'Sterzo, sospensioni, spie, documenti del veicolo.' } },
    { chapter: 'incidente', official: { de: 'Programm: Verhalten bei Unfällen, Erste Hilfe', it: 'Programma: comportamento in caso di incidente, primo soccorso' }, verified: NOT_VERIFIED, missing: { de: 'Constatazione amichevole, Pflichten bei Sachschaden.', it: 'Constatazione amichevole (CAI), obblighi con soli danni alle cose.' } },
    { chapter: 'persona', official: { de: 'Programm: Führerschein, Punkte, Alkohol, Drogen, Haftung', it: 'Programma: patente, punti, alcol e droghe, responsabilità civile' }, verified: NOT_VERIFIED, missing: { de: 'Drogen, Versicherungspflicht, Strafen im Detail.', it: 'Droghe, assicurazione RCA, sanzioni nel dettaglio.' } },
    { chapter: 'ambiente', official: { de: 'Programm: Verbrauch und Umwelt', it: 'Programma: consumi e inquinamento' }, verified: NOT_VERIFIED, missing: { de: 'ZTL, Lärm, Abgasnormen.', it: 'ZTL, rumore, classi ambientali.' } }
  ]
};

/** Offizielle Bezugsquellen (zum Nachschlagen; Inhalte daraus werden nicht kopiert). */
export const OFFICIAL_SOURCES: Record<DrivingCountry, { name: I18n; what: I18n }[]> = {
  DE: [
    { name: { de: 'Fahrerlaubnis-Verordnung (FeV), Anlage 7', it: 'Fahrerlaubnis-Verordnung (FeV), allegato 7' }, what: { de: 'Format und Bewertung der Theorieprüfung', it: 'Formato e valutazione della prova di teoria' } },
    { name: { de: 'TÜV / DEKRA (Prüforganisationen)', it: 'TÜV / DEKRA (enti esaminatori)' }, what: { de: 'Amtlicher Fragenkatalog und Prüfungssprachen', it: 'Catalogo ufficiale delle domande e lingue d’esame' } }
  ],
  IT: [
    { name: { de: 'Mitteilung des Verkehrsministeriums vom 15.12.2021', it: 'Avviso del Ministero del 15 dicembre 2021' }, what: { de: 'Format der Prüfung (30 Fragen, 20 Minuten, max. 3 Fehler)', it: 'Formato della prova (30 quesiti, 20 minuti, max 3 errori)' } },
    { name: { de: 'Portale dell’Automobilista', it: 'Portale dell’Automobilista' }, what: { de: 'Amtliche Fragenkataloge A/B', it: 'Listati ufficiali dei quesiti A/B' } }
  ]
};

/** Sprachen: in der App verfügbar vs. bei der Prüfungsstelle buchbar (Stand der Recherche, vor Ort prüfen). */
export const EXAM_LANGUAGES: Record<DrivingCountry, { bookable: I18n; note: I18n }> = {
  DE: {
    bookable: { de: 'Deutsch und mehrere Fremdsprachen, darunter Italienisch, Englisch, Türkisch, Polnisch, Russisch, Arabisch und weitere.', it: 'Tedesco e diverse lingue straniere, tra cui italiano, inglese, turco, polacco, russo, arabo e altre.' },
    note: { de: 'Die aktuelle Liste bei TÜV/DEKRA oder der Fahrschule prüfen.', it: 'Verifica l’elenco aggiornato presso TÜV/DEKRA o l’autoscuola.' }
  },
  IT: {
    bookable: { de: 'Italienisch; in Südtirol auch Deutsch, im Aostatal auch Französisch.', it: 'Italiano; in Alto Adige anche tedesco, in Valle d’Aosta anche francese.' },
    note: { de: 'Bei der Motorizzazione bzw. Fahrschule prüfen.', it: 'Verifica presso la Motorizzazione o l’autoscuola.' }
  }
};
