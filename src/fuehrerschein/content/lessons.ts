import type { Lesson } from '../schema';
import { DEMO_SOURCE } from './source';
import { CROSSING_LESSONS } from './crossings';
import { SCENE_LESSONS } from './scenes';

const L = (l: Omit<Lesson, 'source' | 'version' | 'status'>): Lesson => ({ ...l, source: DEMO_SOURCE, version: 1, status: 'demo' });
const img = (id: string, de: string, it: string) => ({ type: 'diagram' as const, id, alt: { de, it } });

/** Demo-Lektionen: kurz, eigene Texte, je Land mit den dort geltenden Regeln. */
export const LESSONS: Lesson[] = [
  // ---------- Deutschland ----------
  L({
    id: 'de-l-vorfahrt', country: 'DE', chapter: 'precedenza',
    title: { de: 'Vorfahrt an Kreuzungen', it: 'Precedenza agli incroci' },
    intro: { de: 'Wer darf zuerst fahren? Es gibt eine feste Reihenfolge der Regeln.', it: 'Chi passa per primo? Le regole hanno un ordine preciso.' },
    sections: [
      { heading: { de: '1. Die Reihenfolge', it: '1. L’ordine delle regole' },
        body: { de: 'Polizeibeamte gehen vor Ampeln, Ampeln vor Verkehrszeichen und Zeichen vor der Grundregel „rechts vor links“. Prüfe immer zuerst, was ganz oben steht.', it: 'Gli agenti prevalgono sui semafori, i semafori sui segnali e i segnali sulla regola generale della precedenza a destra. Controlla sempre prima ciò che sta più in alto.' } },
      { heading: { de: '2. Rechts vor links', it: '2. Precedenza a destra' },
        body: { de: 'Ohne Ampel und ohne Zeichen hat Vorfahrt, wer von rechts kommt. Ob du geradeaus fährst oder zuerst da bist, spielt keine Rolle.', it: 'Senza semaforo né segnali passa per primo chi arriva da destra. Non conta se vai diritto o se arrivi prima.' },
        image: img('rechts-vor-links', 'Kreuzung: rotes Auto kommt von rechts.', 'Incrocio: il veicolo rosso arriva da destra.') },
      { heading: { de: '3. Linksabbiegen', it: '3. Svolta a sinistra' },
        body: { de: 'Wer links abbiegt, lässt entgegenkommende Fahrzeuge durch – auch wenn er Vorfahrt vor dem Querverkehr hat. Zum Warten in die Kreuzung einfahren, ohne jemanden zu behindern.', it: 'Chi svolta a sinistra lascia passare chi arriva di fronte, anche se ha la precedenza sul traffico trasversale. Si aspetta nell’incrocio senza ostacolare nessuno.' },
        image: img('linksabbiegen', 'Kreuzung: blaues Auto biegt links ab, rotes kommt entgegen.', 'Incrocio: veicolo blu svolta a sinistra, rosso arriva di fronte.') },
      { heading: { de: '4. Merksatz', it: '4. Da ricordare' },
        body: { de: 'Polizei – Ampel – Zeichen – rechts vor links. Im Zweifel: Verzicht auf die Vorfahrt ist erlaubt, Erzwingen nie.', it: 'Agente – semaforo – segnali – precedenza a destra. Nel dubbio si può rinunciare alla precedenza, mai pretenderla.' } }
    ]
  }),
  L({
    id: 'de-l-tempo', country: 'DE', chapter: 'velocita',
    title: { de: 'Geschwindigkeit, Abstand, Anhalteweg', it: 'Velocità, distanza, spazio d’arresto' },
    intro: { de: 'Die wichtigsten Zahlen für Pkw in Deutschland und die Faustformeln der Prüfung.', it: 'I numeri principali per le auto in Germania e le formule pratiche dell’esame.' },
    sections: [
      { heading: { de: '1. Höchstgeschwindigkeiten', it: '1. Limiti di velocità' },
        body: { de: 'Innerorts 50 km/h, außerorts 100 km/h. Auf der Autobahn gibt es eine Richtgeschwindigkeit von 130 km/h. Bei Sicht unter 50 m höchstens 50 km/h.', it: 'In città 50 km/h, fuori città 100 km/h. In autostrada è consigliata una velocità di 130 km/h. Con visibilità sotto i 50 m al massimo 50 km/h.' } },
      { heading: { de: '2. Reaktionsweg und Bremsweg', it: '2. Spazio di reazione e di frenata' },
        body: { de: 'Reaktionsweg = (km/h ÷ 10) × 3. Bremsweg = (km/h ÷ 10)². Bei einer Gefahrbremsung etwa die Hälfte. Anhalteweg = Reaktionsweg + Bremsweg. Beispiel 50 km/h: 15 m + 25 m = 40 m.', it: 'Spazio di reazione = (km/h ÷ 10) × 3. Spazio di frenata = (km/h ÷ 10)². In una frenata d’emergenza circa la metà. Spazio d’arresto = reazione + frenata. Esempio a 50 km/h: 15 m + 25 m = 40 m.' } },
      { heading: { de: '3. Abstand', it: '3. Distanza di sicurezza' },
        body: { de: 'Außerorts mindestens „halber Tacho“ in Metern, besser zwei Sekunden. Bei Nässe doppelt so viel.', it: 'Fuori città almeno “metà del tachimetro” in metri, meglio due secondi. Con il bagnato il doppio.' } }
    ]
  }),
  L({
    id: 'de-l-schwache', country: 'DE', chapter: 'vulnerabili',
    title: { de: 'Fußgänger und Radfahrer schützen', it: 'Proteggere pedoni e ciclisti' },
    intro: { de: 'Wer ungeschützt unterwegs ist, braucht deine Rücksicht.', it: 'Chi è senza protezione ha bisogno della tua attenzione.' },
    sections: [
      { heading: { de: '1. Zebrastreifen', it: '1. Strisce pedonali' },
        body: { de: 'Am Fußgängerüberweg musst du Fußgängern das Überqueren ermöglichen: mäßig heranfahren, notfalls anhalten.', it: 'Sulle strisce devi permettere ai pedoni di attraversare: avvicinati piano e fermati se serve.' },
        image: img('zebra', 'Fußgänger am Zebrastreifen.', 'Pedone sulle strisce.') },
      { heading: { de: '2. Abbiegen und toter Winkel', it: '2. Svolta e angolo cieco' },
        body: { de: 'Beim Rechtsabbiegen haben geradeaus fahrende Radfahrer Vorrang. Spiegel, Schulterblick, langsam abbiegen.', it: 'Svoltando a destra, i ciclisti che vanno diritto hanno la precedenza. Specchietto, sguardo oltre la spalla, svolta lenta.' },
        image: img('rechtsabbieger-rad', 'Rechtsabbieger und Radfahrer.', 'Svolta a destra e ciclista.') },
      { heading: { de: '3. Seitenabstand', it: '3. Distanza laterale' },
        body: { de: 'Beim Überholen von Radfahrern innerorts mindestens 1,5 m, außerorts mindestens 2 m Abstand.', it: 'Sorpassando i ciclisti almeno 1,5 m in città e 2 m fuori città.' } }
    ]
  }),
  L({
    id: 'de-l-autobahn', country: 'DE', chapter: 'autostrada',
    title: { de: 'Autobahn und Rettungsgasse', it: 'Autostrada e corridoio di emergenza' },
    intro: { de: 'Schnell, aber mit klaren Regeln.', it: 'Veloce, ma con regole chiare.' },
    sections: [
      { heading: { de: '1. Wer darf auf die Autobahn?', it: '1. Chi può entrare?' },
        body: { de: 'Nur Kraftfahrzeuge, die bauartbedingt schneller als 60 km/h fahren können. Wenden und Rückwärtsfahren sind verboten.', it: 'Solo veicoli a motore che per costruzione superano i 60 km/h. Inversione e retromarcia sono vietate.' } },
      { heading: { de: '2. Rettungsgasse', it: '2. Corridoio di emergenza' },
        body: { de: 'Schon bei stockendem Verkehr: Die ganz linke Spur fährt nach links, alle anderen nach rechts. Die Gasse liegt zwischen der linken Spur und der Spur daneben.', it: 'Già quando il traffico rallenta: la corsia più a sinistra si sposta a sinistra, tutte le altre a destra. Il corridoio è tra la corsia di sinistra e quella accanto.' },
        image: img('rettungsgasse', 'Rettungsgasse bei drei Spuren.', 'Corridoio di emergenza con tre corsie.') }
    ]
  }),
  // ---------- Italia ----------
  L({
    id: 'it-l-precedenza', country: 'IT', chapter: 'precedenza',
    title: { de: 'Vorfahrt an Kreuzungen', it: 'Precedenza agli incroci' },
    intro: { de: 'Die Regeln der italienischen Prüfung zur Vorfahrt.', it: 'Le regole sulla precedenza per l’esame italiano.' },
    sections: [
      { heading: { de: '1. Rechts vor links', it: '1. Precedenza a destra' },
        body: { de: 'Ohne Zeichen und Ampel hat Vorfahrt, wer von rechts kommt.', it: 'In assenza di segnali e semafori ha la precedenza chi proviene da destra.' },
        image: img('rechts-vor-links', 'Rotes Fahrzeug von rechts.', 'Veicolo rosso da destra.') },
      { heading: { de: '2. STOP und „Vorfahrt gewähren“', it: '2. STOP e dare precedenza' },
        body: { de: 'Beim STOP immer an der Linie anhalten, dann Vorfahrt gewähren. Bei „Vorfahrt gewähren“ nur anhalten, wenn nötig.', it: 'Allo STOP fermarsi sempre alla linea e poi dare la precedenza. Con il dare precedenza ci si ferma solo se necessario.' } },
      { heading: { de: '3. Kreisverkehr', it: '3. Rotatoria' },
        body: { de: 'Meist steht an den Eingängen „Vorfahrt gewähren“: Dann haben die Fahrzeuge im Kreis Vorrang. Fehlt das Zeichen, gilt rechts vor links – dann hat der Einfahrende Vorfahrt.', it: 'Di solito agli ingressi c’è il dare precedenza: allora passa prima chi circola nell’anello. Se il segnale manca vale la precedenza a destra, quindi passa chi entra.' },
        image: img('rotatoria', 'Kreisverkehr ohne Zeichen am Eingang.', 'Rotatoria senza segnali all’ingresso.') },
      { heading: { de: '4. Linksabbiegen', it: '4. Svolta a sinistra' },
        body: { de: 'Wer links abbiegt, lässt den Gegenverkehr durch.', it: 'Chi svolta a sinistra dà la precedenza a chi arriva di fronte.' },
        image: img('linksabbiegen', 'Linksabbieger und Gegenverkehr.', 'Svolta a sinistra e traffico opposto.') }
    ]
  }),
  L({
    id: 'it-l-velocita', country: 'IT', chapter: 'velocita',
    title: { de: 'Geschwindigkeit und Sicherheitsabstand', it: 'Velocità e distanza di sicurezza' },
    intro: { de: 'Die Limits in Italien – auch für Fahranfänger.', it: 'I limiti in Italia, anche per i neopatentati.' },
    sections: [
      { heading: { de: '1. Allgemeine Grenzen', it: '1. Limiti generali' },
        body: { de: 'Innerorts 50 km/h, Landstraßen 90 km/h, Schnellstraßen 110 km/h, Autobahn 130 km/h. Bei Regen: Schnellstraßen 90, Autobahn 110.', it: 'Centri abitati 50 km/h, extraurbane secondarie 90, extraurbane principali 110, autostrade 130. Con la pioggia: extraurbane principali 90, autostrade 110.' } },
      { heading: { de: '2. Neulinge', it: '2. Neopatentati' },
        body: { de: 'In den ersten drei Jahren: höchstens 90 km/h auf Schnellstraßen und 100 km/h auf Autobahnen, 0,0 g/l Alkohol.', it: 'Nei primi tre anni: massimo 90 km/h sulle extraurbane principali e 100 km/h in autostrada, tasso alcolemico 0.' } },
      { heading: { de: '3. Sicherheitsabstand', it: '3. Distanza di sicurezza' },
        body: { de: 'Der Abstand wächst mit der Geschwindigkeit und muss bei Nässe, Nebel und Müdigkeit größer sein.', it: 'La distanza cresce con la velocità e deve aumentare con bagnato, nebbia e stanchezza.' } }
    ]
  }),
  L({
    id: 'it-l-vulnerabili', country: 'IT', chapter: 'vulnerabili',
    title: { de: 'Fußgänger und Radfahrer', it: 'Pedoni e ciclisti' },
    intro: { de: 'Die schwächsten Verkehrsteilnehmer brauchen besonderen Schutz.', it: 'Gli utenti più deboli hanno bisogno di particolare attenzione.' },
    sections: [
      { heading: { de: '1. Zebrastreifen', it: '1. Strisce pedonali' },
        body: { de: 'Vorrang für Fußgänger, die überqueren oder gerade losgehen wollen. Auf Zebrastreifen weder halten noch parken.', it: 'Precedenza ai pedoni che attraversano o stanno per farlo. Sulle strisce vietate fermata e sosta.' },
        image: img('zebra', 'Fußgänger am Zebrastreifen.', 'Pedone sulle strisce.') },
      { heading: { de: '2. Radfahrer', it: '2. Ciclisti' },
        body: { de: 'Beim Abbiegen auf Radfahrer achten, beim Überholen großen Seitenabstand halten (wo möglich mindestens 1,5 m).', it: 'In svolta attenzione ai ciclisti; nel sorpasso ampio margine laterale (dove possibile almeno 1,5 m).' },
        image: img('rechtsabbieger-rad', 'Rechtsabbieger und Radfahrer.', 'Svolta a destra e ciclista.') }
    ]
  }),
  L({
    id: 'it-l-autostrada', country: 'IT', chapter: 'autostrada',
    title: { de: 'Autobahn', it: 'Autostrada' },
    intro: { de: 'Einfahren, fahren, im Notfall richtig handeln.', it: 'Immettersi, viaggiare e comportarsi in emergenza.' },
    sections: [
      { heading: { de: '1. Einfahren', it: '1. Immissione' },
        body: { de: 'Auf dem Beschleunigungsstreifen Tempo aufnehmen, blinken und einfädeln, ohne andere zu behindern.', it: 'Sulla corsia di accelerazione si prende velocità, si mette la freccia e ci si immette senza ostacolare.' } },
      { heading: { de: '2. Verbote', it: '2. Divieti' },
        body: { de: 'Verboten: Wenden, Rückwärtsfahren, Fahren auf dem Standstreifen, Mopeds und Fahrräder.', it: 'Vietati: inversione, retromarcia, uso della corsia di emergenza per circolare, ciclomotori e biciclette.' } },
      { heading: { de: '3. Panne', it: '3. Guasto' },
        body: { de: 'Auf den Standstreifen, Warnblinker, Warnweste anziehen, Warndreieck mindestens 50 m dahinter, sichtbar aus 100 m.', it: 'Accostare sulla corsia di emergenza, luci di emergenza, giubbotto, triangolo ad almeno 50 m visibile da 100 m.' } }
    ]
  })
  ,
  ...CROSSING_LESSONS,
  ...SCENE_LESSONS
];
