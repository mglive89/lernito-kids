import type { ReactNode } from 'react';
import type { I18n } from './schema';
import { SignGlyph } from './signs';
import { BLUE, Bike, Car, Crossroads, GRASS, HI, Hi, LINE, Path, RED, ROAD, Walker } from './sketch';
import { MORE_SCENES } from './scenes';

/**
 * Eigene Verkehrs-Skizzen von oben (SVG). Blau = dein Fahrzeug, Rot = anderes Fahrzeug.
 * Mit `reveal` wird das entscheidende Detail hervorgehoben.
 */
export interface DiagramDef { id: string; decisive: I18n; draw: (reveal: boolean) => ReactNode }

export const DIAGRAMS: DiagramDef[] = [
  {
    id: 'rechts-vor-links',
    decisive: { de: 'Keine Zeichen, keine Ampel: Das rote Auto kommt von rechts und darf zuerst fahren.', it: 'Nessun segnale né semaforo: il veicolo rosso arriva da destra e passa per primo.' },
    draw: (r) => (
      <>
        <Crossroads />
        <Path d="M168 205 V110" />
        <Path d="M215 132 H120" color={RED} />
        <Car x={168} y={240} />
        <Car x={245} y={132} rot={-90} color={RED} />
        <Hi on={r} cx={245} cy={132} r={36} />
      </>
    )
  },
  {
    id: 'linksabbiegen',
    decisive: { de: 'Das rote Auto kommt entgegen und fährt geradeaus: Wer links abbiegt, lässt es zuerst fahren.', it: 'Il veicolo rosso arriva di fronte e va diritto: chi svolta a sinistra lo lascia passare.' },
    draw: (r) => (
      <>
        <Crossroads />
        <Path d="M168 205 V172 Q168 132 120 132 H70" />
        <Path d="M132 92 V200" color={RED} />
        <Car x={168} y={240} />
        <Car x={132} y={60} rot={180} color={RED} />
        <Hi on={r} cx={132} cy={60} r={36} />
      </>
    )
  },
  {
    id: 'rechtsabbieger-rad',
    decisive: { de: 'Der Radfahrer rechts neben dir fährt geradeaus: Er hat Vorrang. Schulterblick in den toten Winkel!', it: 'Il ciclista alla tua destra prosegue diritto: ha la precedenza. Controlla l’angolo cieco!' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="100" y="0" width="80" height="300" fill={ROAD} />
        <rect x="180" y="0" width="26" height="300" fill="#C9705B" />
        <rect x="180" y="95" width="120" height="70" fill={ROAD} />
        <rect x="180" y="95" width="26" height="70" fill="#C9705B" opacity="0.55" />
        <line x1="140" y1="0" x2="140" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="12 10" />
        <line x1="180" y1="0" x2="180" y2="300" stroke={LINE} strokeWidth="2" />
        <Path d="M160 200 V160 Q160 130 200 130 H275" />
        <Path d="M193 232 V60" color="#12B886" dashed />
        <Car x={160} y={235} />
        <Bike x={193} y={258} />
        <Hi on={r} cx={193} cy={250} r={30} />
      </>
    )
  },
  {
    id: 'zebra',
    decisive: { de: 'Der Fußgänger will am Zebrastreifen über die Straße: anhalten und gehen lassen.', it: 'Il pedone vuole attraversare sulle strisce: fermati e lascialo passare.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="90" y="0" width="120" height="300" fill={ROAD} />
        <rect x="60" y="0" width="30" height="300" fill="#D9D4CB" />
        <rect x="210" y="0" width="30" height="300" fill="#D9D4CB" />
        <line x1="150" y1="0" x2="150" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="12 10" />
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x={94 + i * 16.5} y="110" width="10" height="44" fill={LINE} />)}
        <Path d="M180 205 V165" />
        <Car x={180} y={240} />
        <Walker x={225} y={132} />
        <Path d="M212 132 H170" color="#7A5AF8" dashed />
        <Hi on={r} cx={225} cy={132} r={26} />
      </>
    )
  },
  {
    id: 'rettungsgasse',
    decisive: { de: 'Die Gasse liegt zwischen der linken und der mittleren Spur – nicht rechts.', it: 'Il corridoio si apre tra la corsia di sinistra e quella centrale, non a destra.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="45" y="0" width="210" height="300" fill={ROAD} />
        <line x1="115" y1="0" x2="115" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="14 12" />
        <line x1="185" y1="0" x2="185" y2="300" stroke={LINE} strokeWidth="2.5" strokeDasharray="14 12" />
        <line x1="255" y1="0" x2="255" y2="300" stroke={LINE} strokeWidth="2" />
        {[70, 160, 250].map((y) => <Car key={`l${y}`} x={66} y={y} />)}
        {[110, 200].map((y) => <Car key={`m${y}`} x={162} y={y} />)}
        {[60, 150, 240].map((y) => <Car key={`r${y}`} x={226} y={y} />)}
        <g transform="translate(115 275)">
          <rect x="-13" y="-24" width="26" height="48" rx="5" fill="#fff" stroke="#1C1C1C" strokeWidth="1.5" />
          <rect x="-13" y="-4" width="26" height="8" fill={RED} />
          <rect x="-8" y="-24" width="16" height="4" fill="#2F6FEB" />
        </g>
        {r && <rect x="92" y="0" width="46" height="300" fill={HI} opacity="0.2" data-testid="diagramm-hervorhebung" />}
        <Hi on={r} cx={115} cy={150} r={26} />
      </>
    )
  },
  {
    id: 'rotatoria',
    decisive: { de: 'Am Eingang steht kein „Vorfahrt gewähren“: Ohne Zeichen gilt in Italien rechts vor links, auch im Kreisverkehr.', it: 'All’ingresso non c’è il segnale “dare precedenza”: senza segnali vale la precedenza a destra, anche in rotatoria.' },
    draw: (r) => (
      <>
        <rect width="300" height="300" fill={GRASS} />
        <rect x="120" y="0" width="60" height="300" fill={ROAD} />
        <rect x="0" y="120" width="300" height="60" fill={ROAD} />
        <circle cx="150" cy="150" r="98" fill={ROAD} />
        <circle cx="150" cy="150" r="46" fill="#9BCB8A" stroke={LINE} strokeWidth="3" />
        <circle cx="150" cy="150" r="72" fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="10 9" />
        <Path d="M108 212 Q130 232 160 230" color={RED} />
        <Path d="M166 262 V236" />
        <Car x={86} y={196} rot={-140} color={RED} />
        <Car x={166} y={278} />
        <Hi on={r} cx={166} cy={248} r={30} />
      </>
    )
  }
];

// ---------- Kreuzungsaufgaben: Reihenfolge der Fahrzeuge ----------
export type Arm = 'S' | 'W' | 'N' | 'E';
export type Turn = 'geradeaus' | 'links' | 'rechts';
export type CarColor = 'blau' | 'rot' | 'gruen';
export interface CrossCar { arm: Arm; turn: Turn; color: CarColor; order: number }
export interface CrossScene { id: string; signs: Partial<Record<Arm, string>>; cars: CrossCar[]; decisive: I18n }

const ARM_ANGLE: Record<Arm, number> = { S: 0, W: 90, N: 180, E: 270 };
const CAR_COLOR: Record<CarColor, string> = { blau: BLUE, rot: RED, gruen: '#12B886' };
const TURN_PATH: Record<Turn, string> = {
  geradeaus: 'M168 205 V95',
  rechts: 'M168 205 V192 Q168 168 192 168 H248',
  links: 'M168 205 V174 Q168 132 122 132 H58'
};
/** Punkt um die Kreuzungsmitte drehen (Skizzen sind für den Arm „Süden“ gezeichnet). */
function turnPoint(x: number, y: number, deg: number): [number, number] {
  const r = (deg * Math.PI) / 180, dx = x - 150, dy = y - 150;
  return [150 + dx * Math.cos(r) - dy * Math.sin(r), 150 + dx * Math.sin(r) + dy * Math.cos(r)];
}

export const CROSS_SCENES: CrossScene[] = [
  { id: 'k-rechts-drei', signs: {}, cars: [{ arm: 'S', turn: 'geradeaus', color: 'blau', order: 2 }, { arm: 'E', turn: 'geradeaus', color: 'rot', order: 1 }, { arm: 'W', turn: 'geradeaus', color: 'gruen', order: 3 }],
    decisive: { de: 'Ohne Zeichen: Rot hat niemanden rechts und fährt zuerst. Blau hat Rot rechts, Grün hat Blau rechts.', it: 'Senza segnali: il rosso non ha nessuno a destra e passa per primo. Il blu ha il rosso a destra, il verde ha il blu a destra.' } },
  { id: 'k-links-gegen', signs: {}, cars: [{ arm: 'S', turn: 'links', color: 'blau', order: 2 }, { arm: 'N', turn: 'geradeaus', color: 'rot', order: 1 }],
    decisive: { de: 'Blau biegt links ab und muss den entgegenkommenden roten Wagen durchlassen.', it: 'Il blu svolta a sinistra e deve lasciar passare il rosso che arriva di fronte.' } },
  { id: 'k-hauptstrasse-links', signs: { S: 'vorfahrtstrasse', N: 'vorfahrtstrasse', E: 'vorfahrt-gewaehren', W: 'vorfahrt-gewaehren' },
    cars: [{ arm: 'S', turn: 'links', color: 'blau', order: 2 }, { arm: 'N', turn: 'geradeaus', color: 'rot', order: 1 }, { arm: 'E', turn: 'geradeaus', color: 'gruen', order: 3 }],
    decisive: { de: 'Blau und Rot sind auf der Vorfahrtstraße. Blau biegt links ab und lässt Rot zuerst. Grün muss Vorfahrt gewähren und fährt zuletzt.', it: 'Blu e rosso sono sulla strada con diritto di precedenza. Il blu svolta a sinistra e lascia passare il rosso. Il verde deve dare precedenza e passa per ultimo.' } },
  { id: 'k-stop', signs: { S: 'stop', N: 'stop', E: 'vorfahrtstrasse', W: 'vorfahrtstrasse' },
    cars: [{ arm: 'S', turn: 'geradeaus', color: 'blau', order: 2 }, { arm: 'W', turn: 'geradeaus', color: 'rot', order: 1 }, { arm: 'E', turn: 'rechts', color: 'gruen', order: 1 }],
    decisive: { de: 'Blau steht am STOP: anhalten und beide Fahrzeuge auf der Vorfahrtstraße zuerst fahren lassen. Rot und Grün behindern sich nicht.', it: 'Il blu è allo STOP: si ferma e lascia passare entrambi i veicoli sulla strada principale. Rosso e verde non si ostacolano.' } },
  { id: 'k-rechtsabbieger', signs: {}, cars: [{ arm: 'S', turn: 'rechts', color: 'blau', order: 1 }, { arm: 'W', turn: 'geradeaus', color: 'rot', order: 2 }],
    decisive: { de: 'Rot hat Blau rechts von sich. Dass Blau abbiegt, ändert nichts: Blau fährt zuerst.', it: 'Il rosso ha il blu alla sua destra. Che il blu svolti non cambia nulla: il blu passa per primo.' } },
  { id: 'k-nebenstrasse-zwei', signs: { S: 'vorfahrt-gewaehren', N: 'vorfahrt-gewaehren', E: 'vorfahrtstrasse', W: 'vorfahrtstrasse' },
    cars: [{ arm: 'S', turn: 'geradeaus', color: 'blau', order: 2 }, { arm: 'E', turn: 'geradeaus', color: 'rot', order: 1 }, { arm: 'N', turn: 'rechts', color: 'gruen', order: 2 }],
    decisive: { de: 'Rot ist auf der Vorfahrtstraße und fährt zuerst. Danach Blau und Grün gleichzeitig: Grün biegt rechts ab, ihre Wege kreuzen sich nicht.', it: 'Il rosso è sulla strada principale e passa per primo. Poi blu e verde insieme: il verde svolta a destra e le traiettorie non si incrociano.' } },
  { id: 'k-gleiches-ziel', signs: {}, cars: [{ arm: 'S', turn: 'links', color: 'blau', order: 2 }, { arm: 'N', turn: 'rechts', color: 'rot', order: 1 }],
    decisive: { de: 'Beide wollen in dieselbe Straße. Blau biegt links ab und lässt den entgegenkommenden Rechtsabbieger Rot zuerst fahren.', it: 'Entrambi vogliono entrare nella stessa strada. Il blu svolta a sinistra e lascia passare prima il rosso, che arriva di fronte e svolta a destra.' } },
  { id: 'k-hauptstrasse-gegen', signs: { S: 'vorfahrt-gewaehren', N: 'vorfahrt-gewaehren', E: 'vorfahrtstrasse', W: 'vorfahrtstrasse' },
    cars: [{ arm: 'S', turn: 'geradeaus', color: 'blau', order: 3 }, { arm: 'W', turn: 'links', color: 'rot', order: 2 }, { arm: 'E', turn: 'geradeaus', color: 'gruen', order: 1 }],
    decisive: { de: 'Grün und Rot sind auf der Vorfahrtstraße. Rot biegt links ab und lässt Grün zuerst. Blau muss Vorfahrt gewähren und fährt zuletzt.', it: 'Verde e rosso sono sulla strada principale. Il rosso svolta a sinistra e lascia passare il verde. Il blu deve dare precedenza e passa per ultimo.' } }
];

function drawCrossScene(sc: CrossScene, reveal: boolean): ReactNode {
  return (
    <>
      <Crossroads />
      {(Object.entries(sc.signs) as [Arm, string][]).map(([arm, sign]) => {
        const [x, y] = turnPoint(203, 214, ARM_ANGLE[arm]);
        return <SignGlyph key={arm} id={sign} x={x} y={y} size={30} />;
      })}
      {sc.cars.map((c) => (
        <g key={c.color} transform={`rotate(${ARM_ANGLE[c.arm]} 150 150)`}>
          <Path d={TURN_PATH[c.turn]} color={CAR_COLOR[c.color]} />
          <Car x={168} y={240} color={CAR_COLOR[c.color]} />
        </g>
      ))}
      {reveal && sc.cars.map((c) => {
        const [x, y] = turnPoint(168, 240, ARM_ANGLE[c.arm]);
        return (
          <g key={`n-${c.color}`} data-testid="diagramm-hervorhebung">
            <circle cx={x} cy={y} r="15" fill={HI} stroke="#1C1C1C" strokeWidth="2" />
            <text x={x} y={y + 6} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="17" fill="#1C1C1C">{c.order}</text>
          </g>
        );
      })}
    </>
  );
}

DIAGRAMS.push(...MORE_SCENES);
DIAGRAMS.push(...CROSS_SCENES.map((sc): DiagramDef => ({ id: sc.id, decisive: sc.decisive, draw: (r) => drawCrossScene(sc, r) })));
export const isCrossing = (id: string) => CROSS_SCENES.some((s) => s.id === id);

export const diagramById = (id: string) => DIAGRAMS.find((d) => d.id === id);

export function TrafficDiagram({ id, reveal = false, title, size = 300 }: { id: string; reveal?: boolean; title: string; size?: number }) {
  const d = diagramById(id);
  if (!d) return null;
  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: size }} role="img" aria-label={title} data-testid={`diagramm-${id}`} className="h-auto rounded-xl ring-1 ring-black/10">
      {d.draw(reveal)}
    </svg>
  );
}
