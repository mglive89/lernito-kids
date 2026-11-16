import type { ReactNode } from 'react';
import { tx, type Txt } from '../i18n';

/**
 * Verkehrszeichen als eigene, vereinfachte SVG-Zeichnungen (Lernzwecke).
 * Form und Farbe folgen dem Wiener Übereinkommen, das in Deutschland und Italien gilt.
 */
export type SignGroup = 'gefahr' | 'vorfahrt' | 'verbot' | 'gebot' | 'hinweis';

export interface SignDef {
  id: string;
  group: SignGroup;
  name: Txt;
  /** Was das Zeichen bedeutet bzw. was man tun muss */
  meaning: Txt;
}

export const SIGN_GROUPS: { id: SignGroup; name: Txt; text: Txt }[] = [
  { id: 'gefahr', name: tx('Gefahrzeichen', 'Segnali di pericolo'), text: tx('Dreieck mit rotem Rand: Achtung, hier kommt eine Gefahr.', 'Triangolo con bordo rosso: attenzione, c’è un pericolo.') },
  { id: 'vorfahrt', name: tx('Vorfahrt', 'Precedenza'), text: tx('Wer zuerst fahren darf und wer warten muss.', 'Chi passa per primo e chi deve aspettare.') },
  { id: 'verbot', name: tx('Verbotszeichen', 'Segnali di divieto'), text: tx('Runde Zeichen mit rotem Rand: Das ist verboten.', 'Segnali rotondi con bordo rosso: è vietato.') },
  { id: 'gebot', name: tx('Gebotszeichen', 'Segnali di obbligo'), text: tx('Runde blaue Zeichen: Das musst du tun.', 'Segnali rotondi blu: è obbligatorio.') },
  { id: 'hinweis', name: tx('Richtzeichen', 'Segnali di indicazione'), text: tx('Eckige blaue Zeichen: Hinweise und Regeln für einen Bereich.', 'Segnali quadrati blu: informazioni e regole per una zona.') }
];

export const SIGNS: SignDef[] = [
  // Gefahrzeichen
  { id: 'gefahrstelle', group: 'gefahr', name: tx('Gefahrstelle', 'Altri pericoli'), meaning: tx('Achtung, Gefahr, für die es kein eigenes Zeichen gibt (oft mit Zusatzschild).', 'Pericolo generico senza un segnale specifico (spesso con pannello integrativo).') },
  { id: 'kurve-rechts', group: 'gefahr', name: tx('Kurve rechts', 'Curva a destra'), meaning: tx('Gefährliche Rechtskurve: früh bremsen, nicht in der Kurve überholen.', 'Curva pericolosa a destra: rallentare prima, non sorpassare in curva.') },
  { id: 'kurve-links', group: 'gefahr', name: tx('Kurve links', 'Curva a sinistra'), meaning: tx('Gefährliche Linkskurve: Geschwindigkeit vorher anpassen.', 'Curva pericolosa a sinistra: adeguare la velocità prima.') },
  { id: 'doppelkurve', group: 'gefahr', name: tx('Doppelkurve', 'Doppia curva'), meaning: tx('Mehrere Kurven hintereinander, die erste nach rechts.', 'Doppia curva, la prima verso destra.') },
  { id: 'kreuzung-rechts', group: 'gefahr', name: tx('Kreuzung mit Vorfahrt von rechts', 'Incrocio con precedenza a destra'), meaning: tx('An der nächsten Kreuzung gilt „rechts vor links“.', 'Al prossimo incrocio si dà la precedenza a chi viene da destra.') },
  { id: 'kinder', group: 'gefahr', name: tx('Kinder', 'Bambini'), meaning: tx('Kinder können plötzlich auf die Fahrbahn laufen: langsam und bremsbereit fahren.', 'Bambini possono attraversare all’improvviso: andare piano e pronti a frenare.') },
  { id: 'fussgaenger-gefahr', group: 'gefahr', name: tx('Fußgänger', 'Attraversamento pedonale (pericolo)'), meaning: tx('Achtung, Fußgänger überqueren hier oft die Straße.', 'Attenzione, qui i pedoni attraversano spesso.') },
  { id: 'baustelle', group: 'gefahr', name: tx('Arbeitsstelle', 'Lavori in corso'), meaning: tx('Baustelle: mit Arbeitern, Engstellen und Schmutz rechnen.', 'Cantiere: possibili operai, restringimenti e sporco sulla strada.') },
  { id: 'schleudergefahr', group: 'gefahr', name: tx('Schleudergefahr', 'Strada sdrucciolevole'), meaning: tx('Bei Nässe oder Schmutz besteht Rutschgefahr: sanft lenken und bremsen.', 'Fondo scivoloso con pioggia o sporco: sterzare e frenare dolcemente.') },
  { id: 'ampel', group: 'gefahr', name: tx('Lichtzeichenanlage', 'Semaforo'), meaning: tx('Achtung, nach der Kurve oder Kuppe kommt eine Ampel.', 'Attenzione, più avanti c’è un semaforo.') },
  { id: 'gegenverkehr', group: 'gefahr', name: tx('Gegenverkehr', 'Doppio senso di circolazione'), meaning: tx('Ab hier kommen Fahrzeuge auch von vorne entgegen.', 'Da qui in poi la strada è a doppio senso.') },
  { id: 'engstelle', group: 'gefahr', name: tx('Verengte Fahrbahn', 'Strettoia'), meaning: tx('Die Fahrbahn wird enger: langsam fahren, auf Gegenverkehr achten.', 'La carreggiata si restringe: rallentare e fare attenzione a chi arriva.') },
  { id: 'gefaelle', group: 'gefahr', name: tx('Gefälle', 'Discesa pericolosa'), meaning: tx('Steiles Gefälle: kleinen Gang wählen, Motorbremse nutzen.', 'Discesa ripida: usare una marcia bassa e il freno motore.') },
  { id: 'bahnuebergang', group: 'gefahr', name: tx('Bahnübergang mit Schranken', 'Passaggio a livello con barriere'), meaning: tx('Bahnübergang mit Schranken voraus: bremsbereit sein.', 'Più avanti c’è un passaggio a livello con barriere.') },
  // Vorfahrt
  { id: 'vorfahrt-gewaehren', group: 'vorfahrt', name: tx('Vorfahrt gewähren', 'Dare precedenza'), meaning: tx('Du musst den anderen Vorfahrt lassen, notfalls anhalten.', 'Devi dare la precedenza agli altri, fermandoti se serve.') },
  { id: 'stop', group: 'vorfahrt', name: tx('Halt. Vorfahrt gewähren', 'Fermarsi e dare precedenza (STOP)'), meaning: tx('Immer an der Haltlinie anhalten und dann Vorfahrt gewähren.', 'Fermarsi sempre alla linea d’arresto e poi dare la precedenza.') },
  { id: 'vorfahrtstrasse', group: 'vorfahrt', name: tx('Vorfahrtstraße', 'Diritto di precedenza'), meaning: tx('Du bist auf einer Vorfahrtstraße und hast an den nächsten Kreuzungen Vorfahrt.', 'Sei su una strada con diritto di precedenza agli incroci.') },
  { id: 'ende-vorfahrtstrasse', group: 'vorfahrt', name: tx('Ende der Vorfahrtstraße', 'Fine del diritto di precedenza'), meaning: tx('Die Vorfahrtstraße endet: an der nächsten Kreuzung gelten wieder andere Regeln.', 'Finisce la strada con diritto di precedenza.') },
  { id: 'vorfahrt-einmal', group: 'vorfahrt', name: tx('Vorfahrt an der nächsten Kreuzung', 'Intersezione con diritto di precedenza'), meaning: tx('Nur an der nächsten Kreuzung hast du Vorfahrt.', 'Solo al prossimo incrocio hai la precedenza.') },
  { id: 'andreaskreuz', group: 'vorfahrt', name: tx('Andreaskreuz', 'Croce di Sant’Andrea'), meaning: tx('Schienenfahrzeuge haben am Bahnübergang immer Vorrang.', 'Al passaggio a livello i treni hanno sempre la precedenza.') },
  // Verbote
  { id: 'verbot-alle', group: 'verbot', name: tx('Verbot für Fahrzeuge aller Art', 'Divieto di transito'), meaning: tx('Keine Fahrzeuge dürfen hier fahren (Fahrräder schieben ist erlaubt).', 'Nessun veicolo può transitare in entrambi i sensi.') },
  { id: 'einfahrt-verboten', group: 'verbot', name: tx('Verbot der Einfahrt', 'Senso vietato'), meaning: tx('Hier darfst du nicht hineinfahren (z. B. Einbahnstraße von der falschen Seite).', 'Vietato entrare (per esempio un senso unico dal lato sbagliato).') },
  { id: 'tempo-30', group: 'verbot', name: tx('Höchstgeschwindigkeit 30', 'Limite massimo 30 km/h'), meaning: tx('Du darfst höchstens 30 km/h fahren.', 'Non si possono superare i 30 km/h.') },
  { id: 'tempo-70', group: 'verbot', name: tx('Höchstgeschwindigkeit 70', 'Limite massimo 70 km/h'), meaning: tx('Du darfst höchstens 70 km/h fahren.', 'Non si possono superare i 70 km/h.') },
  { id: 'ende-tempo-70', group: 'verbot', name: tx('Ende der Höchstgeschwindigkeit', 'Fine limite di velocità'), meaning: tx('Die Begrenzung auf 70 km/h endet, es gilt wieder die allgemeine Höchstgeschwindigkeit.', 'Finisce il limite di 70 km/h, vale di nuovo il limite generale.') },
  { id: 'ueberholverbot', group: 'verbot', name: tx('Überholverbot', 'Divieto di sorpasso'), meaning: tx('Mehrspurige Kraftfahrzeuge dürfen hier nicht überholt werden.', 'Vietato sorpassare i veicoli a motore (tranne due ruote).') },
  { id: 'ende-verbote', group: 'verbot', name: tx('Ende aller Streckenverbote', 'Via libera'), meaning: tx('Alle vorher angezeigten Verbote (Tempo, Überholen) sind aufgehoben.', 'Finiscono tutti i divieti indicati prima (velocità, sorpasso).') },
  { id: 'halteverbot', group: 'verbot', name: tx('Absolutes Halteverbot', 'Divieto di fermata'), meaning: tx('Hier darfst du nicht einmal kurz anhalten.', 'Vietato fermarsi, anche solo per poco.') },
  { id: 'parkverbot', group: 'verbot', name: tx('Eingeschränktes Halteverbot', 'Divieto di sosta'), meaning: tx('Halten bis 3 Minuten oder zum Ein- und Aussteigen ist erlaubt, Parken nicht.', 'Vietato sostare: fermarsi brevemente per salire o scendere è consentito.') },
  // Gebote
  { id: 'rechts', group: 'gebot', name: tx('Vorgeschriebene Fahrtrichtung rechts', 'Direzione obbligatoria a destra'), meaning: tx('Du musst nach rechts abbiegen.', 'Si deve svoltare a destra.') },
  { id: 'geradeaus', group: 'gebot', name: tx('Vorgeschriebene Fahrtrichtung geradeaus', 'Direzione obbligatoria diritto'), meaning: tx('Du musst geradeaus weiterfahren.', 'Si deve proseguire diritto.') },
  { id: 'kreisverkehr', group: 'gebot', name: tx('Kreisverkehr', 'Rotatoria'), meaning: tx('Im Kreis gegen den Uhrzeigersinn fahren.', 'Circolare in senso antiorario nella rotatoria.') },
  { id: 'radweg', group: 'gebot', name: tx('Radweg', 'Pista ciclabile'), meaning: tx('Weg nur für Radfahrer: Autos dürfen ihn nicht benutzen.', 'Percorso riservato alle biciclette.') },
  { id: 'gehweg', group: 'gebot', name: tx('Gehweg', 'Percorso pedonale'), meaning: tx('Weg nur für Fußgänger.', 'Percorso riservato ai pedoni.') },
  // Hinweise
  { id: 'parken', group: 'hinweis', name: tx('Parken', 'Parcheggio'), meaning: tx('Hier darfst du parken.', 'Qui è consentito parcheggiare.') },
  { id: 'einbahnstrasse', group: 'hinweis', name: tx('Einbahnstraße', 'Senso unico'), meaning: tx('Alle fahren nur in Pfeilrichtung.', 'Si circola solo nella direzione della freccia.') },
  { id: 'fussgaengerueberweg', group: 'hinweis', name: tx('Fußgängerüberweg', 'Attraversamento pedonale'), meaning: tx('Zebrastreifen: Fußgängern das Überqueren ermöglichen.', 'Strisce pedonali: dare la precedenza ai pedoni.') },
  { id: 'autobahn', group: 'hinweis', name: tx('Autobahn', 'Autostrada'), meaning: tx('Beginn der Autobahn: nur für schnelle Kraftfahrzeuge.', 'Inizio dell’autostrada: solo veicoli a motore veloci.') },
  { id: 'sackgasse', group: 'hinweis', name: tx('Sackgasse', 'Strada senza uscita'), meaning: tx('Die Straße endet, es geht nicht weiter.', 'La strada non ha uscita.') }
];

export const signById = (id: string) => SIGNS.find((s) => s.id === id);

// ---------- Zeichnung ----------
const RED = '#D7262F';
const BLUE = '#1B5FC1';
const YELLOW = '#F7C600';
const INK = '#1C1C1C';

const Triangle = ({ children, down }: { children?: ReactNode; down?: boolean }) => (
  <>
    <path d={down ? 'M8 14 H92 L50 90 Z' : 'M50 8 L93 86 H7 Z'} fill="#fff" stroke={RED} strokeWidth="9" strokeLinejoin="round" />
    {children}
  </>
);
const Circle = ({ fill = '#fff', ring = RED, children }: { fill?: string; ring?: string; children?: ReactNode }) => (
  <>
    <circle cx="50" cy="50" r="44" fill={fill} stroke={ring} strokeWidth={ring === RED ? 9 : 0} />
    {children}
  </>
);
const Square = ({ fill = BLUE, children }: { fill?: string; children?: ReactNode }) => (
  <>
    <rect x="8" y="8" width="84" height="84" rx="9" fill={fill} stroke="#fff" strokeWidth="3" />
    {children}
  </>
);

/** Auto von hinten, Mitte bei (x, y), Breite ca. 28 * s. */
const Car = ({ x, y, s = 1, fill = INK }: { x: number; y: number; s?: number; fill?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <path d="M-10 -10 Q-9 -14 -5 -14 H5 Q9 -14 10 -10 L13 -2 Q15 -1 15 2 V8 H-15 V2 Q-15 -1 -13 -2 Z" />
    <rect x="-14" y="8" width="6" height="5" rx="1.5" />
    <rect x="8" y="8" width="6" height="5" rx="1.5" />
    <rect x="-8" y="-11" width="16" height="7" rx="1.5" fill="#fff" />
  </g>
);

const Person = ({ x, y, s = 1, walk = true }: { x: number; y: number; s?: number; walk?: boolean }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <circle cx="0" cy="-19" r="4.6" fill={INK} stroke="none" />
    <path d="M0 -12 L-1 3" />
    {walk ? <path d="M-1 3 L-7 15 M-1 3 L5 9 L6 16" /> : <path d="M-1 3 L-4 16 M-1 3 L2 16" />}
    {walk ? <path d="M0 -10 L-7 -3 M0 -10 L6 -4 L9 1" /> : <path d="M0 -10 L-5 -1 M0 -10 L5 -1" />}
  </g>
);

const Bike = ({ x, y, s = 1, color = INK }: { x: number; y: number; s?: number; color?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="-13" cy="6" r="8" />
    <circle cx="13" cy="6" r="8" />
    <path d="M-13 6 L-4 -8 L9 -8 L13 6 M-4 -8 L1 6 L9 -8 M-7 -13 H-1 M9 -8 L7 -14 H12" />
    <path d="M1 6 L-13 6" />
  </g>
);

const NUM = (n: string, color = INK) => <text x="50" y="62" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize={n.length > 2 ? 34 : 40} fill={color}>{n}</text>;

const DRAW: Record<string, () => ReactNode> = {
  gefahrstelle: () => <Triangle><rect x="45" y="36" width="10" height="28" rx="3" fill={INK} /><circle cx="50" cy="74" r="5.5" fill={INK} /></Triangle>,
  'kurve-rechts': () => <Triangle><path d="M43 78 V58 Q43 44 55 40 L55 32 L67 44 L55 56 V48 Q52 50 52 58 V78 Z" fill={INK} /></Triangle>,
  'kurve-links': () => <Triangle><path d="M57 78 V58 Q57 44 45 40 L45 32 L33 44 L45 56 V48 Q48 50 48 58 V78 Z" fill={INK} /></Triangle>,
  doppelkurve: () => <Triangle><path d="M45 80 V72 C45 62 58 64 58 54 C58 47 49 47 49 41" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="butt" /><path d="M40 43 L49 30 L58 43 Z" fill={INK} /></Triangle>,
  'kreuzung-rechts': () => <Triangle><path d="M38 44 L62 76 M62 44 L38 76" stroke={INK} strokeWidth="8" strokeLinecap="round" /></Triangle>,
  kinder: () => <Triangle><Person x={44} y={64} s={0.95} /><Person x={59} y={68} s={0.7} /></Triangle>,
  'fussgaenger-gefahr': () => <Triangle><Person x={50} y={64} s={1.05} /></Triangle>,
  baustelle: () => (
    <Triangle>
      <circle cx="44" cy="44" r="4.5" fill={INK} />
      <path d="M45 51 L52 64 L46 76 M52 64 L60 74 M47 54 L58 58 L64 66" stroke={INK} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M62 78 L70 66 L78 78 Z" fill={INK} />
    </Triangle>
  ),
  schleudergefahr: () => (
    <Triangle>
      <Car x={50} y={48} s={0.75} />
      <path d="M40 60 Q34 66 40 71 Q46 76 40 80 M60 60 Q66 66 60 71 Q54 76 60 80" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </Triangle>
  ),
  ampel: () => (
    <Triangle>
      <rect x="41" y="34" width="18" height="44" rx="5" fill={INK} />
      <circle cx="50" cy="42" r="5" fill="#E53935" /><circle cx="50" cy="56" r="5" fill="#FBC02D" /><circle cx="50" cy="70" r="5" fill="#43A047" />
    </Triangle>
  ),
  gegenverkehr: () => (
    <Triangle>
      <path d="M57 78 V48 H52 L60 36 L68 48 H63 V78 Z" fill={INK} />
      <path d="M43 36 V66 H48 L40 78 L32 66 H37 V36 Z" fill={INK} />
    </Triangle>
  ),
  engstelle: () => <Triangle><path d="M38 80 L38 62 L45 50 V36 M62 80 V62 L55 50 V36" stroke={INK} strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round" /></Triangle>,
  gefaelle: () => <Triangle><path d="M26 79 H74 L26 64 Z" fill={INK} /><text x="54" y="60" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill={INK}>10%</text></Triangle>,
  bahnuebergang: () => (
    <Triangle>
      <path d="M30 76 H70 M34 76 V60 M66 76 V60" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="28" y="54" width="44" height="7" fill={INK} />
      <path d="M34 54 V61 M42 54 V61 M50 54 V61 M58 54 V61 M66 54 V61" stroke="#fff" strokeWidth="3" />
      <path d="M50 36 V48" stroke={INK} strokeWidth="4" />
    </Triangle>
  ),
  'vorfahrt-gewaehren': () => <Triangle down />,
  stop: () => (
    <>
      <path d="M32 6 H68 L94 32 V68 L68 94 H32 L6 68 V32 Z" fill={RED} stroke="#fff" strokeWidth="3" />
      <text x="50" y="61" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="29" fill="#fff" letterSpacing="1">STOP</text>
    </>
  ),
  vorfahrtstrasse: () => (
    <>
      <path d="M50 4 L96 50 L50 96 L4 50 Z" fill="#fff" stroke="#888" strokeWidth="1.5" />
      <path d="M50 18 L82 50 L50 82 L18 50 Z" fill={YELLOW} />
    </>
  ),
  'ende-vorfahrtstrasse': () => (
    <>
      <path d="M50 4 L96 50 L50 96 L4 50 Z" fill="#fff" stroke="#888" strokeWidth="1.5" />
      <path d="M50 18 L82 50 L50 82 L18 50 Z" fill={YELLOW} />
      <path d="M30 30 L70 70 M24 36 L64 76 M36 24 L76 64" stroke={INK} strokeWidth="3.2" />
    </>
  ),
  'vorfahrt-einmal': () => <Triangle><path d="M50 34 V80" stroke={INK} strokeWidth="9" /><path d="M32 56 H68" stroke={INK} strokeWidth="4" /></Triangle>,
  andreaskreuz: () => (
    <g transform="rotate(0 50 50)">
      <g transform="rotate(35 50 50)"><rect x="4" y="42" width="92" height="16" fill="#fff" stroke={RED} strokeWidth="2.5" /><path d="M20 42 V58 M40 42 V58 M60 42 V58 M80 42 V58" stroke={RED} strokeWidth="8" /></g>
      <g transform="rotate(-35 50 50)"><rect x="4" y="42" width="92" height="16" fill="#fff" stroke={RED} strokeWidth="2.5" /><path d="M20 42 V58 M40 42 V58 M60 42 V58 M80 42 V58" stroke={RED} strokeWidth="8" /></g>
    </g>
  ),
  'verbot-alle': () => <Circle />,
  'einfahrt-verboten': () => <><circle cx="50" cy="50" r="45" fill={RED} stroke="#fff" strokeWidth="2" /><rect x="20" y="42" width="60" height="16" fill="#fff" /></>,
  'tempo-30': () => <Circle>{NUM('30')}</Circle>,
  'tempo-70': () => <Circle>{NUM('70')}</Circle>,
  'ende-tempo-70': () => (
    <>
      <circle cx="50" cy="50" r="44" fill="#fff" stroke="#333" strokeWidth="2" />
      {NUM('70', '#777')}
      <path d="M22 78 L78 22" stroke={INK} strokeWidth="5" />
    </>
  ),
  ueberholverbot: () => <Circle><Car x={36} y={52} s={0.78} fill={RED} /><Car x={64} y={52} s={0.78} /></Circle>,
  'ende-verbote': () => (
    <>
      <circle cx="50" cy="50" r="44" fill="#fff" stroke="#333" strokeWidth="2" />
      <path d="M26 66 L66 26 M30 74 L74 30 M34 82 L82 34" stroke={INK} strokeWidth="3" />
    </>
  ),
  halteverbot: () => <><circle cx="50" cy="50" r="44" fill={BLUE} stroke={RED} strokeWidth="9" /><path d="M22 22 L78 78 M78 22 L22 78" stroke={RED} strokeWidth="9" /></>,
  parkverbot: () => <><circle cx="50" cy="50" r="44" fill={BLUE} stroke={RED} strokeWidth="9" /><path d="M22 22 L78 78" stroke={RED} strokeWidth="9" /></>,
  rechts: () => <Circle fill={BLUE} ring={BLUE}><path d="M28 56 H58 V68 L78 50 L58 32 V44 H28 Z" fill="#fff" /></Circle>,
  geradeaus: () => <Circle fill={BLUE} ring={BLUE}><path d="M50 20 L70 42 H57 V80 H43 V42 H30 Z" fill="#fff" /></Circle>,
  kreisverkehr: () => (
    <Circle fill={BLUE} ring={BLUE}>
      {/* gespiegelt: Pfeile gegen den Uhrzeigersinn */}
      <g transform="translate(100 0) scale(-1 1)">
      {[0, 120, 240].map((r) => (
        <g key={r} transform={`rotate(${r} 50 50)`}>
          <path d="M50 24 A26 26 0 0 1 72 37" stroke="#fff" strokeWidth="7" fill="none" />
          <path d="M80 30 L76 46 L63 38 Z" fill="#fff" />
        </g>
      ))}
      </g>
    </Circle>
  ),
  radweg: () => <Circle fill={BLUE} ring={BLUE}><Bike x={50} y={52} s={1.2} color="#fff" /></Circle>,
  gehweg: () => (
    <Circle fill={BLUE} ring={BLUE}>
      <g transform="translate(50 56) scale(1.25)" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="0" cy="-19" r="4.6" fill="#fff" stroke="none" />
        <path d="M0 -12 L-1 3 M-1 3 L-7 15 M-1 3 L5 9 L6 16 M0 -10 L-7 -3 M0 -10 L6 -4 L9 1" />
      </g>
    </Circle>
  ),
  parken: () => <Square><text x="50" y="72" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontSize="62" fill="#fff">P</text></Square>,
  einbahnstrasse: () => (
    <>
      <rect x="4" y="30" width="92" height="40" rx="5" fill={BLUE} stroke="#fff" strokeWidth="3" />
      <path d="M14 45 H66 V37 L86 50 L66 63 V55 H14 Z" fill="#fff" />
    </>
  ),
  fussgaengerueberweg: () => (
    <Square>
      <path d="M50 16 L86 80 H14 Z" fill="#fff" />
      <path d="M30 76 H70" stroke={INK} strokeWidth="5" strokeDasharray="5 4" />
      <Person x={50} y={60} s={0.95} />
    </Square>
  ),
  autobahn: () => (
    <Square>
      <path d="M14 46 H86" stroke="#fff" strokeWidth="6" />
      <path d="M22 84 Q36 60 38 50 M78 84 Q64 60 62 50" stroke="#fff" strokeWidth="6" fill="none" />
      <path d="M50 58 V66 M50 72 V82" stroke="#fff" strokeWidth="4" />
      <path d="M14 46 V36 M86 46 V36" stroke="#fff" strokeWidth="5" />
    </Square>
  ),
  sackgasse: () => <Square><rect x="44" y="38" width="12" height="44" fill="#fff" /><rect x="26" y="20" width="48" height="16" fill={RED} /></Square>,
  'pericolo-default': () => <Triangle />
};

/** Zeichnet ein Verkehrszeichen. */
export function RoadSign({ id, size = 96, title }: { id: string; size?: number; title?: string }) {
  const draw = DRAW[id] ?? DRAW['pericolo-default']!;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? id} data-testid={`schild-${id}`} className="shrink-0 drop-shadow-sm">
      {draw()}
    </svg>
  );
}

export const hasDrawing = (id: string) => id in DRAW;

/** Zeichen als Teil einer größeren Zeichnung (z. B. Kreuzungsskizze), Mitte bei (x, y). */
export function SignGlyph({ id, x, y, size }: { id: string; x: number; y: number; size: number }) {
  const draw = DRAW[id];
  if (!draw) return null;
  return <svg x={x - size / 2} y={y - size / 2} width={size} height={size} viewBox="0 0 100 100" data-testid={`skizze-schild-${id}`}>{draw()}</svg>;
}
