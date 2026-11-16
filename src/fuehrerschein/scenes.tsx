import type { DiagramDef } from './diagrams';
import { SignGlyph } from './signs';
import { BLUE, Bike, Car, Crossroads, GRASS, HI, Hi, LINE, Path, RED, ROAD, Walker } from './sketch';

/**
 * Weitere eigene Verkehrs-Skizzen (SVG, von oben): Überholen, Abstand, Bahnübergang, Bus,
 * Grünpfeil, Einfädeln, Autobahn, Parken, Tür öffnen, Hindernis, Kreisverkehr, Einsatzfahrzeug.
 * Blau = dein Fahrzeug. Mit `reveal` wird das entscheidende Detail hervorgehoben.
 */
const GREEN = '#12B886';
const DARK = '#1C1C1C';
const WALK = '#D9D4CB';

/** Gerade Straße von unten nach oben, zwei Fahrstreifen (x 90–210). */
function Road({ solid = false, sidewalk = false }: { solid?: boolean; sidewalk?: boolean }) {
  return (
    <>
      <rect width="300" height="300" fill={GRASS} />
      {sidewalk && <><rect x="62" y="0" width="28" height="300" fill={WALK} /><rect x="210" y="0" width="28" height="300" fill={WALK} /></>}
      <rect x="90" y="0" width="120" height="300" fill={ROAD} />
      <line x1="150" y1="0" x2="150" y2="300" stroke={LINE} strokeWidth={solid ? 4 : 2.5} strokeDasharray={solid ? undefined : '12 10'} />
    </>
  );
}

function Label({ x, y, text, size = 13, color = DARK, bg = '#FFFFFF' }: { x: number; y: number; text: string; size?: number; color?: string; bg?: string }) {
  const w = text.length * size * 0.62 + 10;
  return (
    <g>
      <rect x={x - w / 2} y={y - size * 0.85} width={w} height={size * 1.45} rx="5" fill={bg} stroke={DARK} strokeWidth="1" opacity="0.95" />
      <text x={x} y={y + size * 0.3} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize={size} fill={color}>{text}</text>
    </g>
  );
}

function Truck({ x, y, rot = 0, color = '#E8590C' }: { x: number; y: number; rot?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-16" y="-24" width="32" height="64" rx="3" fill="#ADB5BD" stroke={DARK} strokeWidth="1.5" />
      <rect x="-15" y="-40" width="30" height="20" rx="5" fill={color} stroke={DARK} strokeWidth="1.5" />
      <rect x="-12" y="-36" width="24" height="7" rx="2" fill="#DDE8F7" />
    </g>
  );
}

function Tractor({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-17" y="4" width="8" height="20" rx="3" fill={DARK} />
      <rect x="9" y="4" width="8" height="20" rx="3" fill={DARK} />
      <rect x="-15" y="-10" width="5" height="12" rx="2" fill={DARK} />
      <rect x="10" y="-10" width="5" height="12" rx="2" fill={DARK} />
      <rect x="-10" y="-22" width="20" height="44" rx="4" fill="#2B8A3E" stroke={DARK} strokeWidth="1.5" />
      <rect x="-8" y="2" width="16" height="14" rx="2" fill="#DDE8F7" />
    </g>
  );
}

/** Warnblinker / Blaulicht: pulsierende Lichtpunkte. */
function Blink({ x, y, color, r = 4.5 }: { x: number; y: number; color: string; r?: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill={color} stroke={DARK} strokeWidth="0.8">
      <animate attributeName="opacity" values="1;0.25;1" dur="0.9s" repeatCount="indefinite" />
    </circle>
  );
}

function Ambulance({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-15" y="-27" width="30" height="54" rx="5" fill="#FFFFFF" stroke={DARK} strokeWidth="1.5" />
      <rect x="-15" y="2" width="30" height="7" fill={RED} />
      <rect x="-11" y="-20" width="22" height="8" rx="2" fill="#DDE8F7" />
      <rect x="-4" y="12" width="8" height="12" fill={RED} />
      <rect x="-12" y="16" width="24" height="4" fill={RED} />
      <Blink x={-8} y={-6} color="#3B82F6" r={5} />
      <Blink x={8} y={-6} color="#3B82F6" r={5} />
    </g>
  );
}

/** Ampel am Mast, Lichter von oben nach unten. */
function Light({ x, y, on }: { x: number; y: number; on: 'rot' | 'gruen' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-8" y="-20" width="16" height="40" rx="4" fill={DARK} />
      <circle cx="0" cy="-11" r="5" fill={on === 'rot' ? '#FF3B30' : '#5A1A1A'} />
      <circle cx="0" cy="0" r="5" fill="#5A4A1A" />
      <circle cx="0" cy="11" r="5" fill={on === 'gruen' ? '#34D399' : '#1A4A2A'} />
    </g>
  );
}

function Stripes({ x, y, w, h, n = 6 }: { x: number; y: number; w: number; h: number; n?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#FFFFFF" stroke={DARK} strokeWidth="1.2" />
      {Array.from({ length: n }, (_, i) => i % 2 === 0 && <rect key={i} x={x + (i * w) / n} y={y} width={w / n} height={h} fill={RED} />)}
    </g>
  );
}

const Tree = ({ x, y, r = 18 }: { x: number; y: number; r?: number }) => (
  <g><circle cx={x} cy={y} r={r} fill="#3F8F3A" stroke="#2C6B28" strokeWidth="2" /><circle cx={x - r / 3} cy={y - r / 3} r={r / 3} fill="#5DB357" opacity="0.7" /></g>
);

export const MORE_SCENES: DiagramDef[] = [
  {
    id: 'ueberholen-linie',
    decisive: { de: 'Die Mittellinie ist durchgezogen: Sie darf nicht überfahren werden – hier also nicht überholen.', it: 'La striscia centrale è continua: non si può oltrepassare, quindi qui non si sorpassa.' },
    draw: (r) => (
      <>
        <Road solid />
        <Path d="M120 85 V200" color={RED} />
        <Car x={120} y={50} rot={180} color={RED} />
        <Truck x={180} y={145} />
        <Path d="M180 228 Q180 200 128 182 V115" dashed />
        <Car x={180} y={255} />
        {r && <rect x="144" y="0" width="12" height="300" fill={HI} opacity="0.55" data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={150} cy={190} r={30} />
      </>
    )
  },
  {
    id: 'ueberholen-kurve',
    decisive: { de: 'Hinter der Kurve sieht man nichts: Dort kommt ein Auto entgegen. Bei unübersichtlicher Strecke nicht überholen – auch bei unterbrochener Linie.', it: 'Dopo la curva non si vede nulla: arriva un veicolo di fronte. Con scarsa visibilità non si sorpassa, anche con la striscia discontinua.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <path d="M150 320 V185 Q150 70 265 70 H330" fill="none" stroke={ROAD} strokeWidth="112" />
        <path d="M150 320 V185 Q150 70 265 70 H330" fill="none" stroke={LINE} strokeWidth="2.5" strokeDasharray="12 10" />
        <Path d="M250 43 H205" color={RED} />
        <Car x={268} y={43} rot={-90} color={RED} />
        <Tree x={238} y={168} r={22} />
        <Tree x={270} y={205} r={20} />
        <Tree x={222} y={214} r={17} />
        <Tree x={268} y={150} r={15} />
        <Tractor x={177} y={198} />
        <Path d="M177 250 Q177 230 124 210 V140" dashed />
        <Car x={177} y={272} />
        {r && <line x1="177" y1="250" x2="262" y2="50" stroke={HI} strokeWidth="3" strokeDasharray="6 5" data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={268} cy={43} r={30} />
      </>
    )
  },
  {
    id: 'abstand',
    decisive: { de: 'Bei 100 km/h sind 20 m viel zu wenig. Faustregel außerorts: Abstand in Metern = halber Tacho, also mindestens 50 m.', it: 'A 100 km/h 20 metri sono troppo pochi. La distanza deve permettere di fermarsi in tempo: a questa velocità servono almeno 50 metri circa.' },
    draw: (r) => (
      <>
        <Road />
        <Car x={180} y={110} color={RED} />
        <Car x={180} y={252} />
        <line x1="226" y1="134" x2="226" y2="228" stroke={r ? HI : DARK} strokeWidth="3" />
        <line x1="218" y1="134" x2="234" y2="134" stroke={r ? HI : DARK} strokeWidth="3" />
        <line x1="218" y1="228" x2="234" y2="228" stroke={r ? HI : DARK} strokeWidth="3" />
        <Label x={258} y={184} text="20 m" />
        <g transform="translate(50 250)">
          <circle r="28" fill="#FFFFFF" stroke={DARK} strokeWidth="2" />
          <text y="2" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill={DARK}>100</text>
          <text y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill={DARK}>km/h</text>
        </g>
        {r && <g data-testid="diagramm-hervorhebung"><rect x="162" y="134" width="36" height="94" rx="4" fill="none" stroke={HI} strokeWidth="4" strokeDasharray="8 5" /><Label x={60} y={60} text="≥ 50 m" size={16} bg="#FFF3BF" /></g>}
      </>
    )
  },
  {
    id: 'bahnuebergang',
    decisive: { de: 'Die Schranke senkt sich und das rote Licht blinkt: vor dem Andreaskreuz anhalten. Niemals noch schnell durchfahren.', it: 'Le barriere si abbassano e la luce rossa lampeggia: fermati prima della croce di Sant’Andrea. Mai passare in fretta.' },
    draw: (r) => (
      <>
        <Road />
        <rect x="0" y="100" width="300" height="50" fill="#B9A58C" />
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 14 + 2} y="104" width="7" height="42" fill="#7A5C3E" />)}
        <line x1="0" y1="113" x2="300" y2="113" stroke="#868E96" strokeWidth="4" />
        <line x1="0" y1="137" x2="300" y2="137" stroke="#868E96" strokeWidth="4" />
        <g transform="rotate(-28 226 172)"><Stripes x={150} y={168} w={76} h={8} n={8} /></g>
        <circle cx="226" cy="172" r="6" fill={DARK} />
        <rect x="244" y="168" width="5" height="50" fill={DARK} />
        <rect x="234" y="160" width="26" height="14" rx="7" fill={DARK} />
        <Blink x={241} y={167} color="#FF3B30" />
        <circle cx="253" cy="167" r="4.5" fill="#5A1A1A" />
        <SignGlyph id="andreaskreuz" x={246} y={238} size={40} />
        <Path d="M180 226 V198" />
        <Car x={180} y={252} />
        {r && <rect x="152" y="188" width="56" height="7" fill={HI} data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={246} cy={170} r={24} />
      </>
    )
  },
  {
    id: 'bus-haltestelle',
    decisive: { de: 'Der Bus hält mit Warnblinklicht: Vor ihm kann ein Kind über die Straße laufen. Nur mit Schrittgeschwindigkeit und viel Abstand vorbei.', it: 'L’autobus è fermo con le quattro frecce: davanti può attraversare un bambino. Passa molto piano e a distanza.' },
    draw: (r) => (
      <>
        <Road sidewalk />
        <rect x="216" y="70" width="18" height="40" rx="3" fill="#ADB5BD" stroke={DARK} strokeWidth="1" />
        <Label x={225} y={56} text="BUS" size={11} bg="#FFE066" />
        <g>
          <rect x="168" y="80" width="36" height="120" rx="6" fill="#F59F00" stroke={DARK} strokeWidth="1.5" />
          <rect x="172" y="86" width="28" height="12" rx="2" fill="#DDE8F7" />
          {[108, 128, 148, 168].map((y) => <rect key={y} x="172" y={y} width="28" height="12" rx="2" fill="#DDE8F7" opacity="0.7" />)}
          <Blink x={171} y={83} color="#FF922B" /><Blink x={201} y={83} color="#FF922B" />
          <Blink x={171} y={197} color="#FF922B" /><Blink x={201} y={197} color="#FF922B" />
        </g>
        <Walker x={160} y={70} />
        <Path d="M152 70 H118" color="#7A5AF8" dashed />
        <Path d="M180 238 Q180 222 132 205 V110" dashed />
        <Car x={180} y={262} />
        <Hi on={r} cx={158} cy={70} r={24} />
      </>
    )
  },
  {
    id: 'gruenpfeil',
    decisive: { de: 'Rot mit Grünpfeil-Schild: zuerst an der Haltlinie anhalten, dann nur abbiegen, wenn Fußgänger und Radfahrer nicht behindert werden.', it: 'Rosso con la freccia verde (in Germania): prima fermarsi alla linea, poi svoltare solo senza ostacolare pedoni e ciclisti.' },
    draw: (r) => (
      <>
        <Crossroads />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x="196" y={119 + i * 11} width="20" height="6" fill={LINE} />)}
        <line x1="150" y1="192" x2="185" y2="192" stroke={LINE} strokeWidth="4" />
        <Walker x={206} y={160} />
        <Path d="M206 150 V122" color="#7A5AF8" dashed />
        <Light x={204} y={222} on="rot" />
        <g transform="translate(204 252)">
          <rect x="-13" y="-8" width="26" height="16" rx="2" fill={DARK} />
          <path d="M-8 0 H5 M1 -4 L6 0 L1 4" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <Path d="M168 210 V192 Q168 168 192 168 H260" />
        <Car x={168} y={240} />
        {r && <rect x="150" y="188" width="35" height="8" fill={HI} data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={206} cy={158} r={22} />
      </>
    )
  },
  {
    id: 'einfaedeln',
    decisive: { de: 'Erst am Ende des Fahrstreifens wechseln, abwechselnd im Reißverschluss: einer von links, einer von rechts.', it: 'Si cambia corsia solo alla fine della corsia che termina, alternandosi a cerniera: uno da sinistra, uno da destra.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="90" y="0" width="120" height="300" fill={ROAD} />
        <line x1="150" y1="130" x2="150" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="12 10" />
        <polygon points="90,150 150,95 150,0 90,0" fill="#C8C2B8" />
        {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${98 + i * 15} ${142 - i * 14}) rotate(-42)`}><Stripes x={-9} y={-4} w={18} h={8} n={3} /></g>)}
        <SignGlyph id="engstelle" x={60} y={230} size={40} />
        <Car x={120} y={190} color={RED} />
        <Car x={120} y={262} color={GREEN} />
        <Car x={180} y={150} />
        <Car x={180} y={240} color="#7A5AF8" />
        <Path d="M120 166 Q120 130 170 100" color={RED} dashed />
        <Hi on={r} cx={150} cy={118} r={28} />
        {r && ([[180, 150, 1], [120, 190, 2], [180, 240, 3], [120, 262, 4]] as const).map(([x, y, n]) => (
          <g key={n} data-testid="diagramm-hervorhebung">
            <circle cx={x} cy={y} r="13" fill={HI} stroke={DARK} strokeWidth="2" />
            <text x={x} y={y + 5} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="15" fill={DARK}>{n}</text>
          </g>
        ))}
      </>
    )
  },
  {
    id: 'autobahn-auffahrt',
    decisive: { de: 'Der Verkehr auf der Autobahn hat Vorfahrt. Den Beschleunigungsstreifen ganz nutzen und in eine Lücke einfädeln – nicht am Anfang anhalten.', it: 'Chi è in autostrada ha la precedenza. Usa tutta la corsia di accelerazione e inserisciti in un varco, senza fermarti all’inizio.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <polygon points="190,300 232,300 232,130 190,60" fill={ROAD} />
        <rect x="70" y="0" width="120" height="300" fill={ROAD} />
        <line x1="130" y1="0" x2="130" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="14 12" />
        <line x1="190" y1="0" x2="190" y2="60" stroke={LINE} strokeWidth="2.5" />
        <line x1="190" y1="60" x2="190" y2="300" stroke={LINE} strokeWidth="3" strokeDasharray="5 5" />
        <line x1="232" y1="130" x2="232" y2="300" stroke={LINE} strokeWidth="2.5" />
        <line x1="232" y1="130" x2="192" y2="62" stroke={LINE} strokeWidth="2.5" />
        <line x1="70" y1="0" x2="70" y2="300" stroke={LINE} strokeWidth="2.5" />
        <SignGlyph id="autobahn" x={265} y={250} size={38} />
        <Car x={160} y={250} color={RED} />
        <Car x={100} y={120} color={GREEN} />
        <Path d="M211 205 V150 Q211 120 168 96 V40" dashed />
        <Car x={211} y={230} />
        <Hi on={r} cx={160} cy={250} r={32} />
      </>
    )
  },
  {
    id: 'parken-kreuzung',
    decisive: { de: 'Das blaue Auto steht direkt an der Kreuzung: Es verdeckt die Sicht. In Deutschland gilt bis 5 m vor und hinter Kreuzungen Parkverbot.', it: 'Il veicolo blu è parcheggiato sull’incrocio e toglie la visibilità: in corrispondenza e in prossimità delle intersezioni la sosta è vietata.' },
    draw: (r) => (
      <>
        <Crossroads />
        <Car x={170} y={212} />
        <line x1="204" y1="186" x2="204" y2="240" stroke={r ? HI : DARK} strokeWidth="3" />
        <line x1="197" y1="186" x2="211" y2="186" stroke={r ? HI : DARK} strokeWidth="3" />
        <line x1="197" y1="240" x2="211" y2="240" stroke={r ? HI : DARK} strokeWidth="3" />
        <Label x={236} y={216} text="5 m" />
        <Path d="M55 168 H105" color={RED} />
        <Car x={30} y={168} rot={90} color={RED} />
        <Car x={132} y={52} rot={180} color={GREEN} />
        {r && <rect x="152" y="186" width="33" height="54" fill={HI} opacity="0.35" data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={170} cy={212} r={32} />
      </>
    )
  },
  {
    id: 'tuer-rad',
    decisive: { de: 'Von hinten kommt ein Radfahrer: Tür erst öffnen, wenn niemand kommt. Spiegel und Schulterblick – am besten mit der rechten Hand öffnen.', it: 'Da dietro arriva un ciclista: apri la portiera solo quando non arriva nessuno. Guarda nello specchietto e voltati.' },
    draw: (r) => (
      <>
        <Road sidewalk />
        <Car x={190} y={60} color="#868E96" />
        <Car x={190} y={150} />
        <line x1="177" y1="138" x2="158" y2="124" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
        <line x1="177" y1="138" x2="158" y2="124" stroke={DARK} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <Bike x={163} y={258} />
        <Path d="M163 240 V100" color={GREEN} dashed />
        <line x1="180" y1="132" x2="163" y2="250" stroke="#495057" strokeWidth="1.5" strokeDasharray="3 4" />
        <Hi on={r} cx={163} cy={252} r={28} />
        {r && <circle cx="166" cy="131" r="17" fill="none" stroke={HI} strokeWidth="4" data-testid="diagramm-hervorhebung" />}
      </>
    )
  },
  {
    id: 'hindernis',
    decisive: { de: 'Das Hindernis steht auf deiner Seite. Wer vorbeifahren will, muss den Gegenverkehr durchlassen: Rot fährt zuerst.', it: 'L’ostacolo è sulla tua corsia. Chi deve aggirarlo lascia passare chi arriva di fronte: passa prima il rosso.' },
    draw: (r) => (
      <>
        <Road />
        <Stripes x={160} y={130} w={44} h={10} n={5} />
        <rect x="162" y="140" width="40" height="34" fill="#E9ECEF" stroke={DARK} strokeWidth="1" />
        {[166, 182, 198].map((x) => <polygon key={x} points={`${x},186 ${x - 5},198 ${x + 5},198`} fill="#FF922B" stroke={DARK} strokeWidth="1" />)}
        <SignGlyph id="baustelle" x={240} y={120} size={38} />
        <Path d="M120 80 V230" color={RED} />
        <Car x={120} y={52} rot={180} color={RED} />
        <Path d="M180 232 Q180 214 128 196 V120" dashed />
        <Car x={180} y={258} />
        <Hi on={r} cx={182} cy={160} r={36} />
        {r && <g data-testid="diagramm-hervorhebung"><circle cx={120} cy={52} r="15" fill={HI} stroke={DARK} strokeWidth="2" /><text x={120} y={58} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="17" fill={DARK}>1</text></g>}
      </>
    )
  },
  {
    id: 'kreisverkehr-zeichen',
    decisive: { de: 'Am Eingang stehen „Kreisverkehr“ und „Vorfahrt gewähren“: Wer im Kreis fährt, hat Vorfahrt. Das rote Auto fährt zuerst.', it: 'All’ingresso ci sono “rotatoria” e “dare precedenza”: chi circola nell’anello ha la precedenza. Passa prima il rosso.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="120" y="0" width="60" height="300" fill={ROAD} />
        <rect x="0" y="120" width="300" height="60" fill={ROAD} />
        <circle cx="150" cy="150" r="98" fill={ROAD} />
        <circle cx="150" cy="150" r="46" fill="#9BCB8A" stroke={LINE} strokeWidth="3" />
        <circle cx="150" cy="150" r="72" fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="10 9" />
        <path d="M150 250 H182" stroke={LINE} strokeWidth="3" strokeDasharray="6 4" />
        <SignGlyph id="vorfahrt-gewaehren" x={205} y={272} size={32} />
        <SignGlyph id="kreisverkehr" x={240} y={272} size={32} />
        <Path d="M108 212 Q130 232 160 230" color={RED} />
        <Path d="M166 262 V236" />
        <Car x={86} y={196} rot={-140} color={RED} />
        <Car x={166} y={278} />
        <Hi on={r} cx={86} cy={196} r={32} />
        {r && <rect x="188" y="254" width="70" height="36" rx="8" fill="none" stroke={HI} strokeWidth="4" data-testid="diagramm-hervorhebung" />}
      </>
    )
  },
  {
    id: 'einsatzfahrzeug',
    decisive: { de: 'Blaulicht und Martinshorn: sofort freie Bahn schaffen – auch wenn deine Ampel Grün zeigt.', it: 'Lampeggiante blu e sirena: lascia subito libero il passaggio, anche se il tuo semaforo è verde.' },
    draw: (r) => (
      <>
        <Crossroads />
        <Light x={206} y={222} on="gruen" />
        <Path d="M168 210 V110" />
        <Car x={168} y={240} />
        <Path d="M218 132 H90" color="#3B82F6" />
        <Ambulance x={250} y={132} rot={-90} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${278 + i * 7} ${118 - i * 4} q6 14 0 28`} fill="none" stroke="#3B82F6" strokeWidth="2" opacity={0.8 - i * 0.2} />)}
        <Hi on={r} cx={250} cy={132} r={36} />
      </>
    )
  }
];
