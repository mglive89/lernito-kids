/** Gemeinsame Bausteine der Verkehrs-Skizzen (SVG, 300×300, von oben). */
export const ROAD = '#5B6170';
export const GRASS = '#CFE6C4';
export const LINE = '#FFFFFF';
export const BLUE = '#2F6FEB';
export const RED = '#D7262F';
export const HI = '#F5A524';

export function Car({ x, y, rot = 0, color = BLUE }: { x: number; y: number; rot?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-13" y="-22" width="26" height="44" rx="7" fill={color} stroke="#1C1C1C" strokeWidth="1.5" />
      <rect x="-10" y="-14" width="20" height="9" rx="2.5" fill="#DDE8F7" />
      <rect x="-10" y="9" width="20" height="6" rx="2" fill="#DDE8F7" opacity="0.8" />
      <rect x="-12" y="-23" width="6" height="3" rx="1" fill="#FFF3B0" />
      <rect x="6" y="-23" width="6" height="3" rx="1" fill="#FFF3B0" />
    </g>
  );
}

export function Bike({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-2.5" y="-14" width="5" height="28" rx="2.5" fill="#1C1C1C" />
      <rect x="-9" y="-10" width="18" height="3" rx="1.5" fill="#1C1C1C" />
      <circle cx="0" cy="0" r="6.5" fill="#12B886" stroke="#1C1C1C" strokeWidth="1.5" />
    </g>
  );
}

export function Walker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="9" ry="6" fill="#7A5AF8" stroke="#1C1C1C" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="4.5" fill="#F2C9A0" stroke="#1C1C1C" strokeWidth="1.2" />
    </g>
  );
}

/** Fahrtrichtungs-Pfeil (Pfad), Spitze am Ende. */
export function Path({ d, color = BLUE, dashed }: { d: string; color?: string; dashed?: boolean }) {
  const id = `pfeil-${color.slice(1)}`;
  return (
    <>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 Z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={dashed ? '2 7' : undefined} markerEnd={`url(#${id})`} opacity="0.9" />
    </>
  );
}

/** Hervorhebung: Ring um das entscheidende Detail. */
export function Hi({ on, cx, cy, r }: { on: boolean; cx: number; cy: number; r: number }) {
  if (!on) return null;
  return (
    <g data-testid="diagramm-hervorhebung">
      <circle cx={cx} cy={cy} r={r} fill={HI} opacity="0.18" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HI} strokeWidth="5" strokeDasharray="10 6">
        <animate attributeName="stroke-dashoffset" from="0" to="32" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export const Crossroads = () => (
  <>
    <rect width="300" height="300" fill={GRASS} />
    <rect x="115" y="0" width="70" height="300" fill={ROAD} />
    <rect x="0" y="115" width="300" height="70" fill={ROAD} />
    {[[150, 0, 150, 110], [150, 190, 150, 300], [0, 150, 110, 150], [190, 150, 300, 150]].map(([a, b, c, d], i) => (
      <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={LINE} strokeWidth="2.5" strokeDasharray="12 10" />
    ))}
  </>
);

