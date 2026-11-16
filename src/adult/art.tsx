import type { ReactNode } from 'react';

/**
 * Eigene, schlichte Illustrationen für Lernito Adult (SVG, 200 × 140).
 * Die Fläche ist immer hell, damit die Zeichnungen auch im dunklen Thema lesbar bleiben.
 */

const C = {
  ink: '#334155', soft: '#94A3B8', line: '#CBD5E1', bg: '#F1F5F9',
  nap: '#FDA4AF', napL: '#FFE4E6', napD: '#E11D48',
  pap: '#BFDBFE', papL: '#DBEAFE', papD: '#2563EB',
  acc: '#0284C7', warm: '#F59E0B', green: '#16A34A', greenL: '#BBF7D0',
  metal: '#CBD5E1', metalD: '#64748B', white: '#FFFFFF', wood: '#E7B985', woodD: '#B7793F',
  red: '#DC2626', redL: '#FCA5A5', yellow: '#FDE68A', egg: '#FACC15', dark: '#1E293B'
};

const sw = { stroke: C.ink, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

function Svg({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <marker id="ad-pfeil" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={C.acc} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

const Arrow = ({ d, color = C.acc }: { d: string; color?: string }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" markerEnd="url(#ad-pfeil)" />
);
const Fold = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.acc} strokeWidth={2} strokeDasharray="5 4" />
);
const Txt = ({ x, y, children, size = 12, color = C.ink, anchor = 'middle', weight = 700 }: { x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor} fontFamily="system-ui, sans-serif">{children}</text>
);
const Check = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}><circle r="11" fill={C.green} /><path d="M-5 0 L-1 4 L6 -4" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></g>
);
const Cross = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}><circle r="11" fill={C.red} /><path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="#fff" strokeWidth={3} strokeLinecap="round" /></g>
);
const Table = () => <rect x="0" y="122" width="200" height="18" fill={C.wood} />;

/** Plissee-Streifen (Ziehharmonika) */
function Pleats({ x, y, w, h, n }: { x: number; y: number; w: number; h: number; n: number }) {
  const s = w / n;
  return <g>{Array.from({ length: n }, (_, i) => <rect key={i} x={x + i * s} y={y} width={s} height={h} fill={i % 2 ? C.nap : C.napL} stroke={C.napD} strokeWidth={1.2} />)}</g>;
}

function Plate({ cx = 100, cy = 112, rx = 70 }: { cx?: number; cy?: number; rx?: number }) {
  return <g><ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.22} fill="#fff" stroke={C.line} strokeWidth={2} /><ellipse cx={cx} cy={cy} rx={rx * 0.7} ry={rx * 0.14} fill="none" stroke={C.line} strokeWidth={1.5} /></g>;
}

function Pan({ x = 100, y = 95, fill }: { x?: number; y?: number; fill?: ReactNode }) {
  return (
    <g>
      <rect x={x + 52} y={y - 4} width="46" height="8" rx="4" fill={C.dark} />
      <ellipse cx={x} cy={y + 6} rx="56" ry="14" fill={C.metalD} />
      <ellipse cx={x} cy={y} rx="56" ry="14" fill={C.dark} />
      <ellipse cx={x} cy={y} rx="48" ry="10" fill="#475569" />
      {fill}
    </g>
  );
}

function Pot({ x = 100, water = true, lid = false }: { x?: number; water?: boolean; lid?: boolean }) {
  return (
    <g>
      <rect x={x - 48} y="58" width="96" height="58" rx="6" fill={C.metal} stroke={C.metalD} strokeWidth={2} />
      <rect x={x - 60} y="64" width="14" height="6" rx="3" fill={C.metalD} /><rect x={x + 46} y="64" width="14" height="6" rx="3" fill={C.metalD} />
      {water && <ellipse cx={x} cy="60" rx="46" ry="7" fill="#7DD3FC" />}
      {lid && <g><ellipse cx={x} cy="56" rx="50" ry="8" fill={C.metalD} /><rect x={x - 8} y="44" width="16" height="8" rx="3" fill={C.dark} /></g>}
      <rect x={x - 60} y="116" width="120" height="8" rx="2" fill={C.dark} />
    </g>
  );
}
const Steam = ({ x = 100 }: { x?: number }) => (
  <g fill="none" stroke={C.soft} strokeWidth={2.5} strokeLinecap="round">
    <path d={`M${x - 20} 40 q -6 -8 0 -16 q 6 -8 0 -16`} /><path d={`M${x} 38 q -6 -8 0 -16 q 6 -8 0 -16`} /><path d={`M${x + 20} 40 q -6 -8 0 -16 q 6 -8 0 -16`} />
  </g>
);
const Flame = ({ x = 100, y = 128 }: { x?: number; y?: number }) => (
  <g>{[-30, -10, 10, 30].map((d) => <path key={d} d={`M${x + d - 5} ${y} q 5 -12 5 -14 q 5 6 5 14 z`} fill={C.acc} opacity={0.75} />)}</g>
);

function Bowl({ children }: { children?: ReactNode }) {
  return (
    <g>
      {children}
      <path d="M40 70 Q100 150 160 70 Z" fill="#fff" stroke={C.ink} strokeWidth={2} />
      <ellipse cx="100" cy="70" rx="60" ry="10" fill="#FEF3C7" stroke={C.ink} strokeWidth={2} />
    </g>
  );
}

function Shirt({ x = 100, y = 70, s = 1, color = C.pap, children }: { x?: number; y?: number; s?: number; color?: string; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 -40 L-50 -28 L-62 -4 L-42 4 L-36 -6 L-36 44 L36 44 L36 -6 L42 4 L62 -4 L50 -28 L22 -40 Q0 -26 -22 -40 Z" fill={color} {...sw} />
      {children}
    </g>
  );
}

function Machine({ open = false, children }: { open?: boolean; children?: ReactNode }) {
  return (
    <g>
      <rect x="55" y="8" width="90" height="118" rx="8" fill="#fff" stroke={C.ink} strokeWidth={2} />
      <rect x="62" y="14" width="30" height="12" rx="2" fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
      <circle cx="128" cy="20" r="6" fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
      <circle cx="100" cy="76" r="34" fill={C.metal} stroke={C.ink} strokeWidth={2} />
      <circle cx="100" cy="76" r="26" fill="#E0F2FE" stroke={C.metalD} strokeWidth={2} />
      {children}
      {open && <ellipse cx="44" cy="76" rx="14" ry="34" fill="#E0F2FE" stroke={C.ink} strokeWidth={2} />}
    </g>
  );
}

function Rack({ y }: { y: number }) {
  return <g stroke={C.metalD} strokeWidth={2}><line x1="20" y1={y} x2="180" y2={y} />{Array.from({ length: 9 }, (_, i) => <line key={i} x1={28 + i * 18} y1={y} x2={28 + i * 18} y2={y - 8} />)}</g>;
}

function Browser({ children, url }: { children?: ReactNode; url?: string }) {
  return (
    <g>
      <rect x="20" y="12" width="160" height="114" rx="8" fill="#fff" stroke={C.ink} strokeWidth={2} />
      <path d="M20 20 a8 8 0 0 1 8 -8 h144 a8 8 0 0 1 8 8 v12 h-160 z" fill={C.bg} stroke={C.ink} strokeWidth={2} />
      <circle cx="32" cy="22" r="3" fill={C.red} /><circle cx="42" cy="22" r="3" fill={C.warm} /><circle cx="52" cy="22" r="3" fill={C.green} />
      {url && <><rect x="64" y="16" width="104" height="12" rx="6" fill="#fff" stroke={C.line} /><Txt x={116} y={25} size={8} weight={600} color={C.metalD}>{url}</Txt></>}
      {children}
    </g>
  );
}

function Wall({ children }: { children?: ReactNode }) {
  return <g><rect x="0" y="0" width="200" height="126" fill="#F8FAFC" /><rect x="0" y="126" width="200" height="14" fill={C.wood} />{children}</g>;
}

function Bulb({ x = 100, y = 60, on = false, led = false }: { x?: number; y?: number; on?: boolean; led?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {on && <circle r="38" fill={C.yellow} opacity={0.5} />}
      <path d="M-22 -4 a22 22 0 1 1 44 0 c0 12 -10 16 -10 26 h-24 c0 -10 -10 -14 -10 -26 z" fill={led ? '#F8FAFC' : on ? C.yellow : '#FEFCE8'} stroke={C.ink} strokeWidth={2} />
      {led && <path d="M-12 22 h24" stroke={C.line} strokeWidth={6} />}
      <rect x="-12" y="22" width="24" height="16" rx="2" fill={C.metal} stroke={C.ink} strokeWidth={2} />
      <path d="M-12 27 h24 M-12 32 h24" stroke={C.metalD} strokeWidth={1.5} />
      <path d="M-6 38 h12 l-3 5 h-6 z" fill={C.ink} />
    </g>
  );
}

function Sink({ children }: { children?: ReactNode }) {
  return (
    <g>
      <rect x="20" y="22" width="160" height="12" rx="3" fill={C.white} stroke={C.ink} strokeWidth={2} />
      <path d="M40 34 h120 v8 q0 18 -18 18 h-84 q-18 0 -18 -18 z" fill={C.white} stroke={C.ink} strokeWidth={2} />
      <path d="M150 22 v-14 h-20" fill="none" stroke={C.metalD} strokeWidth={5} strokeLinecap="round" />
      {children}
    </g>
  );
}
function Siphon({ x = 100, y = 60, apart = false }: { x?: number; y?: number; apart?: boolean }) {
  const d = apart ? 14 : 0;
  return (
    <g fill="none" stroke={C.metalD} strokeWidth={9} strokeLinecap="round">
      <path d={`M${x} ${y} v${18}`} />
      <path d={`M${x} ${y + 18 + d} v18 q0 14 14 14 q14 0 14 -14 v-6`} stroke={C.soft} />
      <path d={`M${x + 28} ${y + 30 + d} h40`} />
    </g>
  );
}

function Board() {
  return <g><rect x="18" y="96" width="164" height="22" rx="6" fill={C.wood} stroke={C.woodD} strokeWidth={2} /><circle cx="168" cy="107" r="4" fill={C.woodD} /></g>;
}
function Onion({ cuts = 0, dice = false }: { cuts?: number; dice?: boolean }) {
  return (
    <g>
      <path d="M50 96 a50 44 0 0 1 100 0 z" fill="#F3E8FF" stroke="#7E22CE" strokeWidth={2} />
      <path d="M62 96 a38 32 0 0 1 76 0 M74 96 a26 22 0 0 1 52 0 M86 96 a14 12 0 0 1 28 0" fill="none" stroke="#C084FC" strokeWidth={1.5} />
      <rect x="42" y="88" width="10" height="8" rx="2" fill="#A16207" />
      {Array.from({ length: cuts }, (_, i) => <line key={i} x1={62 + i * 13} y1={96} x2={62 + i * 13} y2={56 + Math.abs(i - (cuts - 1) / 2) * 6} stroke={C.ink} strokeWidth={1.5} />)}
      {dice && [70, 80, 90].map((y) => <line key={y} x1="56" y1={y} x2="144" y2={y} stroke={C.ink} strokeWidth={1.5} />)}
    </g>
  );
}
function Knife({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${r})`}><path d="M0 0 h60 q8 0 4 8 h-64 z" fill={C.metal} stroke={C.ink} strokeWidth={2} /><rect x="-36" y="0" width="36" height="9" rx="4" fill={C.dark} /></g>;
}

// --------------------------------------------------------------------------------------------
const ART: Record<string, () => ReactNode> = {
  // ----- Fächer-Serviette
  'fan-1': () => <><Table /><rect x="50" y="18" width="100" height="100" rx="3" fill={C.nap} stroke={C.napD} strokeWidth={2} /><rect x="58" y="26" width="84" height="84" fill="none" stroke={C.napL} strokeWidth={2} strokeDasharray="3 3" /></>,
  'fan-2': () => <><Table /><rect x="40" y="18" width="120" height="50" fill="none" stroke={C.napD} strokeWidth={1.5} strokeDasharray="4 4" /><rect x="40" y="68" width="120" height="50" fill={C.nap} stroke={C.napD} strokeWidth={2} /><Fold x1={40} y1={68} x2={160} y2={68} /><Arrow d="M170 110 Q190 70 166 30" /></>,
  'fan-3': () => <><Table /><Pleats x={22} y={50} w={114} h={50} n={10} /><rect x="136" y="50" width="42" height="50" fill={C.nap} stroke={C.napD} strokeWidth={2} /><Arrow d="M60 38 h-34" /><Txt x={157} y={44} size={10} color={C.napD}>1/4</Txt></>,
  'fan-4': () => <><Table /><Pleats x={22} y={62} w={114} h={26} n={10} /><rect x="136" y="62" width="42" height="26" fill={C.nap} stroke={C.napD} strokeWidth={2} /><rect x="22" y="88" width="156" height="24" fill="none" stroke={C.napD} strokeWidth={1.5} strokeDasharray="4 4" /><Arrow d="M186 108 Q196 92 184 74" /></>,
  'fan-5': () => <><Table /><Pleats x={22} y={62} w={114} h={26} n={10} /><path d="M136 62 L178 62 L136 112 Z" fill={C.nap} stroke={C.napD} strokeWidth={2} /><path d="M178 62 L178 88 L136 88" fill="none" stroke={C.napD} strokeWidth={1.5} strokeDasharray="4 4" /><Arrow d="M186 70 Q190 104 160 112" /></>,
  'fan-6': () => (
    <><Table /><Plate />
      <g>{Array.from({ length: 9 }, (_, i) => { const a1 = Math.PI * (1 - i / 9); const a2 = Math.PI * (1 - (i + 1) / 9); const r = 74; return <path key={i} d={`M100 104 L${100 + r * Math.cos(a1)} ${104 - r * Math.sin(a1)} L${100 + r * Math.cos(a2)} ${104 - r * Math.sin(a2)} Z`} fill={i % 2 ? C.nap : C.napL} stroke={C.napD} strokeWidth={1.2} />; })}</g>
      <path d="M100 104 L84 118 L116 118 Z" fill={C.nap} stroke={C.napD} strokeWidth={1.5} /></>
  ),
  // ----- Besteck-Tasche
  'pocket-1': () => <><Table /><rect x="56" y="22" width="88" height="88" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M144 22 l-6 6 M144 30 l-14 0 M136 22 l0 14 M144 40 l-24 0" stroke={C.papD} strokeWidth={1.5} /><Txt x={160} y={28} size={10} color={C.papD}>4×</Txt></>,
  'pocket-2': () => <><Table /><rect x="56" y="22" width="88" height="88" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M56 70 L104 22 L120 22 L56 86 Z" fill={C.papL} stroke={C.papD} strokeWidth={2} /><Arrow d="M150 18 Q120 30 108 50" /></>,
  'pocket-3': () => <><Table /><rect x="56" y="22" width="88" height="88" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M56 70 L104 22 L120 22 L56 86 Z" fill={C.papL} stroke={C.papD} strokeWidth={2} /><path d="M56 98 L132 22 L144 22 L144 30 L64 110 L56 110 Z" fill={C.papL} stroke={C.papD} strokeWidth={2} /></>,
  'pocket-4': () => <><Table /><rect x="56" y="22" width="88" height="88" fill={C.pap} stroke={C.papD} strokeWidth={2} /><Fold x1={84} y1={18} x2={84} y2={114} /><Fold x1={116} y1={18} x2={116} y2={114} /><Arrow d="M64 66 Q60 40 82 40" /><Arrow d="M136 66 Q140 40 118 40" /></>,
  'pocket-5': () => (
    <><Table />
      <g><rect x="132" y="14" width="8" height="54" rx="3" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /><path d="M128 14 v-8 M132 14 v-8 M136 14 v-8 M140 14 v-8 M144 14 v-8" stroke={C.ink} strokeWidth={1.5} /><rect x="114" y="10" width="8" height="60" rx="4" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /></g>
      <rect x="80" y="30" width="44" height="90" fill={C.pap} stroke={C.papD} strokeWidth={2} />
      <path d="M80 60 L110 30 L122 30 L80 72 Z M80 84 L124 40 L124 52 L80 96 Z" fill={C.papL} stroke={C.papD} strokeWidth={1.5} />
      <Plate cx={40} cy={112} rx={30} /></>
  ),
  // ----- Band und Zweig
  'ribbon-1': () => <><Table /><rect x="40" y="56" width="120" height="40" fill={C.greenL} stroke={C.green} strokeWidth={2} /><Fold x1={40} y1={76} x2={160} y2={76} /></>,
  'ribbon-2': () => <><Table /><rect x="50" y="64" width="100" height="40" fill={C.greenL} stroke={C.green} strokeWidth={2} /><ellipse cx="150" cy="84" rx="8" ry="20" fill="#DCFCE7" stroke={C.green} strokeWidth={2} /><path d="M150 76 a4 8 0 1 1 0 16" fill="none" stroke={C.green} strokeWidth={1.5} /></>,
  'ribbon-3': () => <><Table /><rect x="50" y="64" width="100" height="40" fill={C.greenL} stroke={C.green} strokeWidth={2} /><ellipse cx="150" cy="84" rx="8" ry="20" fill="#DCFCE7" stroke={C.green} strokeWidth={2} /><rect x="94" y="62" width="5" height="44" fill={C.woodD} /><rect x="101" y="62" width="5" height="44" fill={C.woodD} /><path d="M100 64 q-18 -16 -22 -2 q4 10 22 2 q18 -16 22 -2 q-4 10 -22 2 l-8 -20 M100 64 l8 -20" fill="none" stroke={C.woodD} strokeWidth={3} strokeLinecap="round" /></>,
  'ribbon-4': () => (
    <><Table /><rect x="50" y="64" width="100" height="40" fill={C.greenL} stroke={C.green} strokeWidth={2} /><ellipse cx="150" cy="84" rx="8" ry="20" fill="#DCFCE7" stroke={C.green} strokeWidth={2} /><rect x="94" y="62" width="5" height="44" fill={C.woodD} /><rect x="101" y="62" width="5" height="44" fill={C.woodD} />
      <path d="M70 40 L140 70" stroke="#166534" strokeWidth={2.5} />
      {Array.from({ length: 9 }, (_, i) => <g key={i}><ellipse cx={76 + i * 7.5} cy={40 + i * 3.2 - 5} rx="5" ry="1.8" fill={C.green} transform={`rotate(-40 ${76 + i * 7.5} ${40 + i * 3.2 - 5})`} /><ellipse cx={78 + i * 7.5} cy={42 + i * 3.2 + 4} rx="5" ry="1.8" fill={C.green} transform={`rotate(40 ${78 + i * 7.5} ${42 + i * 3.2 + 4})`} /></g>)}
      <path d="M100 64 q-18 -16 -22 -2 q4 10 22 2 q18 -16 22 -2 q-4 10 -22 2" fill="none" stroke={C.woodD} strokeWidth={3} /></>
  ),
  // ----- Papiertablett
  'tray-0': () => <><Table /><rect x="50" y="10" width="100" height="112" fill={C.papL} stroke={C.papD} strokeWidth={2} /><path d="M50 10 L150 110 L50 110 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><line x1="50" y1="110" x2="150" y2="110" stroke={C.red} strokeWidth={2} strokeDasharray="5 3" /><g transform="translate(160 112) rotate(180)"><circle cx="0" cy="-5" r="4" fill="none" stroke={C.ink} strokeWidth={2} /><circle cx="0" cy="5" r="4" fill="none" stroke={C.ink} strokeWidth={2} /><path d="M3 -3 L18 4 M3 3 L18 -4" stroke={C.ink} strokeWidth={2} /></g></>,
  'tray-1': () => <><Table /><rect x="50" y="16" width="100" height="100" fill={C.pap} stroke={C.papD} strokeWidth={2} /><Fold x1={50} y1={16} x2={150} y2={116} /><Fold x1={150} y1={16} x2={50} y2={116} /></>,
  'tray-2': () => <><Table /><rect x="50" y="16" width="100" height="100" fill="none" stroke={C.papD} strokeWidth={1.2} strokeDasharray="4 4" /><path d="M100 16 L150 66 L100 116 L50 66 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M100 16 L100 116 M50 66 L150 66" stroke={C.papD} strokeWidth={1.5} /><Arrow d="M54 20 L84 50" /><Arrow d="M146 20 L116 50" /><Arrow d="M54 112 L84 82" /><Arrow d="M146 112 L116 82" /></>,
  'tray-3': () => <><Table /><path d="M100 16 L150 66 L100 116 L50 66 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M100 16 L100 116 M50 66 L150 66" stroke={C.papD} strokeWidth={1.2} /><Fold x1={75} y1={41} x2={125} y2={41} /><Fold x1={75} y1={91} x2={125} y2={91} /><Fold x1={75} y1={41} x2={75} y2={91} /><Fold x1={125} y1={41} x2={125} y2={91} /></>,
  'tray-4': () => <><Table /><path d="M60 50 L140 50 L140 104 L60 104 Z" fill={C.papL} stroke={C.papD} strokeWidth={2} /><path d="M60 50 L48 40 L48 96 L60 104 Z M140 50 L152 40 L152 96 L140 104 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M60 50 L100 18 L140 50 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M60 104 L100 120 L140 104 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><Arrow d="M36 70 L50 64" /><Arrow d="M164 70 L150 64" /></>,
  'tray-5': () => <><Table /><path d="M50 60 L150 60 L170 80 L70 80 Z" fill={C.papL} stroke={C.papD} strokeWidth={2} /><path d="M50 60 L50 90 L70 110 L70 80 Z M70 80 L170 80 L170 110 L70 110 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M150 60 L150 36 L170 56 L170 80" fill={C.papL} stroke={C.papD} strokeWidth={2} /><Arrow d="M160 30 Q176 40 166 64" /></>,
  'tray-6': () => (
    <><Table /><path d="M40 60 L140 60 L170 82 L70 82 Z" fill="#EFF6FF" stroke={C.papD} strokeWidth={2} />
      {[[80, 70], [96, 74], [112, 68], [126, 75], [140, 70], [104, 64]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="4" fill={i % 2 ? C.woodD : C.wood} />)}
      <path d="M40 60 L40 88 L70 110 L70 82 Z M70 82 L170 82 L170 110 L70 110 Z" fill={C.pap} stroke={C.papD} strokeWidth={2} /><path d="M70 96 L170 96" stroke={C.papD} strokeWidth={1} /></>
  ),
  // ----- Waschmaschine
  'wash-1': () => (
    <><rect x="30" y="18" width="140" height="104" rx="6" fill="#fff" stroke={C.ink} strokeWidth={2} />
      <path d="M44 46 h32 l-4 22 h-24 z M44 46 q8 -6 16 0 q8 6 16 0" fill="none" stroke={C.ink} strokeWidth={2} /><Txt x={60} y={62} size={12}>40</Txt>
      <path d="M90 46 h32 l-4 22 h-24 z M90 46 q8 -6 16 0 q8 6 16 0" fill="none" stroke={C.ink} strokeWidth={2} /><path d="M100 64 v-12 m4 12 v-14 m4 14 v-12 m4 12 v-8" stroke={C.ink} strokeWidth={1.8} />
      <path d="M136 68 l14 -24 l14 24 z" fill="none" stroke={C.ink} strokeWidth={2} /><path d="M134 70 L166 42" stroke={C.ink} strokeWidth={2} />
      <Check x={60} y={96} /><Check x={106} y={96} /><Cross x={150} y={96} /></>
  ),
  'wash-2': () => (
    <>{[['#fff', 40], [C.pap, 100], ['#475569', 160]].map(([c, x]) => (
      <g key={x as number}><path d={`M${(x as number) - 26} 70 h52 l-6 50 h-40 z`} fill={C.wood} stroke={C.woodD} strokeWidth={2} /><path d={`M${(x as number) - 22} 70 q22 -26 44 0`} fill={c as string} stroke={C.ink} strokeWidth={2} />
        <path d={`M${(x as number) - 20} 82 h40 M${(x as number) - 18} 96 h36 M${(x as number) - 16} 110 h32`} stroke={C.woodD} strokeWidth={1.5} /></g>
    ))}<path d="M0 124 h200" stroke={C.line} strokeWidth={4} /></>
  ),
  'wash-3': () => (
    <><path d="M60 14 h80 l10 110 h-36 l-14 -70 l-14 70 h-36 z" fill="#3B82F6" stroke={C.ink} strokeWidth={2} /><path d="M60 26 h80" stroke={C.ink} strokeWidth={2} /><path d="M66 34 q14 16 30 0" fill="none" stroke={C.ink} strokeWidth={1.8} />
      <circle cx="160" cy="40" r="9" fill={C.warm} stroke={C.ink} strokeWidth={1.5} /><circle cx="176" cy="54" r="7" fill={C.warm} stroke={C.ink} strokeWidth={1.5} /><rect x="152" y="70" width="26" height="14" rx="2" fill="#fff" stroke={C.ink} strokeWidth={1.5} />
      <Arrow d="M100 38 Q130 30 146 40" /></>
  ),
  'wash-4': () => (
    <Machine><g><path d="M78 88 q22 16 44 0 q-4 -16 -22 -14 q-18 -2 -22 14 z" fill={C.nap} /><path d="M80 80 q20 -12 40 0" fill="none" stroke={C.papD} strokeWidth={6} strokeLinecap="round" /></g>
      <path d="M78 60 h44" stroke={C.green} strokeWidth={3} strokeDasharray="4 3" /></Machine>
  ),
  'wash-5': () => (
    <><rect x="20" y="40" width="160" height="70" rx="6" fill="#fff" stroke={C.ink} strokeWidth={2} />
      <rect x="28" y="48" width="44" height="54" rx="4" fill={C.bg} stroke={C.ink} strokeWidth={1.5} /><rect x="78" y="48" width="58" height="54" rx="4" fill={C.papL} stroke={C.papD} strokeWidth={2.5} /><rect x="142" y="48" width="30" height="54" rx="4" fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
      <Txt x={50} y={82} size={20}>I</Txt><Txt x={107} y={84} size={24} color={C.papD}>II</Txt>
      <g transform="translate(157 75)">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-6" rx="3.5" ry="6" fill={C.nap} transform={`rotate(${a})`} />)}<circle r="3" fill={C.warm} /></g>
      <path d="M100 8 v20" stroke={C.papD} strokeWidth={3} markerEnd="url(#ad-pfeil)" /></>
  ),
  'wash-6': () => (
    <><circle cx="100" cy="72" r="46" fill="#fff" stroke={C.ink} strokeWidth={2} /><circle cx="100" cy="72" r="20" fill={C.bg} stroke={C.ink} strokeWidth={2} /><path d="M100 72 L100 54" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      {[['30°', -150], ['40°', -90], ['60°', -30], ['Eco', 30], ['20°', 150]].map(([l, a]) => { const r = (Number(a) * Math.PI) / 180; return <Txt key={l as string} x={100 + 33 * Math.cos(r)} y={75 + 33 * Math.sin(r)} size={10} color={l === '40°' ? C.papD : C.ink}>{l}</Txt>; })}
      <rect x="160" y="40" width="30" height="16" rx="8" fill={C.green} /><path d="M171 44 l8 4 l-8 4 z" fill="#fff" /></>
  ),
  'wash-7': () => <><Machine open /><path d="M150 30 h46" stroke={C.ink} strokeWidth={1.5} /><Shirt x={174} y={52} s={0.3} color={C.nap} /><Check x={30} y={20} /></>,
  // ----- T-Shirt
  'shirt-1': () => <><Table /><Shirt /></>,
  'shirt-2': () => <><Table /><Shirt><path d="M-36 -6 L-62 -4 L-50 -28 L-22 -40 L-12 -36 L-12 44 L-36 44 Z" fill="#93C5FD" stroke={C.ink} strokeWidth={2} /><Fold x1={-12} y1={-44} x2={-12} y2={48} /></Shirt><Arrow d="M30 70 Q40 40 76 52" /></>,
  'shirt-3': () => <><Table /><rect x="82" y="30" width="36" height="84" fill={C.pap} stroke={C.ink} strokeWidth={2} /><path d="M82 30 q18 10 36 0" fill="none" stroke={C.ink} strokeWidth={2} /><Fold x1={78} y1={72} x2={122} y2={72} /></>,
  'shirt-4': () => <><Table /><rect x="72" y="80" width="56" height="40" rx="3" fill={C.pap} stroke={C.ink} strokeWidth={2} /><path d="M72 92 h56" stroke={C.papD} strokeWidth={1.5} /><rect x="76" y="44" width="56" height="34" rx="3" fill={C.nap} stroke={C.ink} strokeWidth={2} /><Check x={150} y={50} /></>,
  // ----- Spülmaschine
  'dish-1': () => <><Plate cx={70} cy={70} rx={50} /><circle cx="60" cy="68" r="6" fill={C.red} /><circle cx="78" cy="72" r="4" fill={C.green} /><Arrow d="M110 70 Q140 60 150 86" /><path d="M136 92 h40 l-5 32 h-30 z" fill={C.metalD} stroke={C.ink} strokeWidth={2} /><path d="M132 92 h48" stroke={C.ink} strokeWidth={3} /></>,
  'dish-2': () => <><Rack y={116} />{[40, 62, 84, 116, 138, 160].map((x, i) => <ellipse key={x} cx={x} cy="84" rx="7" ry="30" fill="#fff" stroke={C.ink} strokeWidth={2} transform={`rotate(${i < 3 ? 12 : -12} ${x} 84)`} />)}<Arrow d="M86 30 L98 44" /><Arrow d="M114 30 L102 44" /></>,
  'dish-3': () => <><Rack y={110} />{[40, 80, 120, 160].map((x) => <path key={x} d={`M${x - 14} 106 l4 -50 h20 l4 50 z`} fill="#E0F2FE" stroke={C.ink} strokeWidth={2} transform={`rotate(-8 ${x} 80)`} />)}<Arrow d="M100 14 v26" /></>,
  'dish-4': () => (
    <><rect x="40" y="60" width="120" height="64" rx="6" fill="none" stroke={C.metalD} strokeWidth={3} /><path d="M80 60 v64 M120 60 v64" stroke={C.metalD} strokeWidth={2} />
      <g><rect x="56" y="40" width="7" height="70" rx="3" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /><path d="M54 40 v-14 M58 40 v-14 M62 40 v-14 M66 40 v-14" stroke={C.ink} strokeWidth={1.5} /></g>
      <g><rect x="96" y="40" width="7" height="70" rx="3" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /><ellipse cx="99.5" cy="32" rx="8" ry="11" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /></g>
      <g><rect x="134" y="14" width="10" height="40" rx="4" fill={C.dark} /><path d="M134 54 h10 v60 q-10 -6 -10 -20 z" fill={C.metal} stroke={C.ink} strokeWidth={1.5} /></g>
      <Check x={60} y={130} /><Check x={100} y={130} /><Check x={140} y={130} /></>
  ),
  'dish-5': () => <><rect x="30" y="90" width="140" height="8" rx="4" fill={C.metalD} /><circle cx="100" cy="94" r="10" fill={C.ink} /><Arrow d="M150 74 A50 20 0 0 0 54 76" /><rect x="84" y="30" width="32" height="22" rx="4" fill="#fff" stroke={C.ink} strokeWidth={2} /><rect x="84" y="30" width="32" height="10" rx="4" fill={C.pap} /><Txt x={100} y={124} size={12} color={C.green}>Eco</Txt></>,
  // ----- Flecken
  'stain-1': () => <><Shirt x={80} y={78} color="#fff"><circle cx="8" cy="10" r="10" fill={C.warm} opacity={0.75} /></Shirt><g transform="translate(160 40)"><circle r="22" fill="#fff" stroke={C.ink} strokeWidth={2} /><path d="M0 -14 V0 L10 6" stroke={C.ink} strokeWidth={3} strokeLinecap="round" fill="none" /></g></>,
  'stain-2': () => <><ellipse cx="100" cy="86" rx="70" ry="30" fill="#fff" stroke={C.line} strokeWidth={2} /><circle cx="100" cy="86" r="18" fill={C.redL} /><Arrow d="M40 86 h30" /><Arrow d="M160 86 h-30" /><Arrow d="M100 40 v24" /><Check x={170} y={30} /></>,
  'stain-3': () => <><path d="M60 20 h60 v14 h-20 v18 h-20 v-18 h-20 z" fill={C.metal} stroke={C.ink} strokeWidth={2} /><circle cx="90" cy="16" r="8" fill="#3B82F6" /><path d="M90 60 q-8 14 0 18 q8 -4 0 -18 M84 88 q-8 14 0 18 q8 -4 0 -18 M98 92 q-8 14 0 18 q8 -4 0 -18" fill="#7DD3FC" /><g transform="translate(150 52)" stroke="#2563EB" strokeWidth={3} strokeLinecap="round">{[0, 60, 120].map((a) => <line key={a} x1="-12" y1="0" x2="12" y2="0" transform={`rotate(${a})`} />)}</g><Txt x={150} y={110} size={14} color={C.red}>60°</Txt><path d="M126 112 L174 96" stroke={C.red} strokeWidth={3} /></>,
  'stain-4': () => <><ellipse cx="100" cy="100" rx="70" ry="24" fill="#fff" stroke={C.line} strokeWidth={2} /><ellipse cx="100" cy="100" rx="22" ry="9" fill={C.warm} opacity={0.6} /><path d="M120 16 h22 v10 l8 12 v44 h-38 v-44 l8 -12 z" fill="#86EFAC" stroke={C.ink} strokeWidth={2} /><path d="M118 88 q-6 6 -2 10" fill="none" stroke="#22C55E" strokeWidth={3} /></>,
  'stain-5': () => <><path d="M30 60 h44 v34 q0 16 -22 16 q-22 0 -22 -16 z" fill="#fff" stroke={C.ink} strokeWidth={2} /><ellipse cx="52" cy="62" rx="20" ry="4" fill="#78350F" /><path d="M74 70 q14 0 14 12 q0 10 -14 10" fill="none" stroke={C.ink} strokeWidth={2} /><path d="M126 30 h44 q0 40 -22 44 q-22 -4 -22 -44 z" fill="#fff" stroke={C.ink} strokeWidth={2} /><path d="M129 46 h38 q-4 24 -19 26 q-15 -2 -19 -26 z" fill="#9F1239" /><path d="M148 74 v34 M134 110 h28" stroke={C.ink} strokeWidth={2} /></>,
  // ----- Kochen
  'cook-pasta': () => <><Plate cx={100} cy={100} rx={80} /><path d="M50 98 q50 -40 100 0" fill="#FDE68A" stroke="#CA8A04" strokeWidth={1.5} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${58 + i * 11} 98 q6 -24 14 -6`} fill="none" stroke="#CA8A04" strokeWidth={1.5} />)}<ellipse cx="100" cy="80" rx="26" ry="9" fill={C.red} /><ellipse cx="96" cy="72" rx="7" ry="3.5" fill={C.green} transform="rotate(-20 96 72)" /><ellipse cx="106" cy="72" rx="7" ry="3.5" fill={C.green} transform="rotate(20 106 72)" /></>,
  'cook-pot': () => <><Steam /><Pot lid /><Flame /></>,
  'cook-pan': () => <><Pan fill={<g><ellipse cx="100" cy="95" rx="30" ry="6" fill={C.yellow} opacity={0.8} /><ellipse cx="92" cy="94" rx="7" ry="5" fill="#FEFCE8" stroke={C.soft} /></g>} /><Flame y={130} /></>,
  'cook-sauce': () => <><Pan fill={<g><ellipse cx="100" cy="95" rx="46" ry="9" fill={C.red} /><circle cx="86" cy="94" r="3" fill={C.redL} /><circle cx="110" cy="97" r="2.5" fill={C.redL} /></g>} /><path d="M120 30 l-14 60" stroke={C.woodD} strokeWidth={5} strokeLinecap="round" /><Txt x={40} y={30} size={14}>15′</Txt><Flame y={130} /></>,
  'cook-salt': () => <><Pot /><g fill="#fff" stroke={C.soft}><circle cx="86" cy="58" r="3" /><circle cx="104" cy="60" r="3" /><circle cx="118" cy="57" r="2.5" /></g><path d="M70 10 L96 56 M76 8 L100 54 M82 6 L104 52" stroke="#CA8A04" strokeWidth={3} strokeLinecap="round" /><g transform="translate(150 22) rotate(30)"><rect x="-10" y="0" width="20" height="30" rx="4" fill="#fff" stroke={C.ink} strokeWidth={2} /><rect x="-10" y="-8" width="20" height="10" rx="3" fill={C.metal} stroke={C.ink} strokeWidth={2} /></g><Flame /></>,
  'cook-drain': () => <><path d="M50 60 h100 q0 46 -50 46 q-50 0 -50 -46 z" fill={C.metal} stroke={C.ink} strokeWidth={2} />{[70, 85, 100, 115, 130].map((x) => <circle key={x} cx={x} cy="80" r="2.5" fill={C.ink} />)}<path d="M50 60 q50 -20 100 0" fill="#FDE68A" stroke="#CA8A04" /><path d="M150 30 q10 0 10 10 v40" fill="none" stroke={C.metalD} strokeWidth={4} /><ellipse cx="160" cy="86" rx="12" ry="7" fill="#BAE6FD" stroke={C.metalD} strokeWidth={2} /><path d="M80 110 q-2 8 0 12 M100 110 q-2 8 0 12 M120 110 q-2 8 0 12" stroke="#7DD3FC" strokeWidth={3} /></>,
  'cook-mix': () => <><Pan fill={<g><ellipse cx="100" cy="95" rx="46" ry="9" fill={C.red} />{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${66 + i * 11} 98 q6 -12 12 0`} fill="none" stroke="#FDE68A" strokeWidth={3} />)}<ellipse cx="96" cy="88" rx="6" ry="3" fill={C.green} /><ellipse cx="108" cy="90" rx="6" ry="3" fill={C.green} /></g>} /><Arrow d="M40 60 Q100 20 160 60" /><Flame y={130} /></>,
  'cook-bowl': () => <><Bowl><ellipse cx="80" cy="34" rx="12" ry="15" fill="#FEF3C7" stroke={C.ink} strokeWidth={2} /><ellipse cx="118" cy="40" rx="12" ry="15" fill="#FEF3C7" stroke={C.ink} strokeWidth={2} /></Bowl><ellipse cx="100" cy="72" rx="20" ry="5" fill={C.egg} /></>,
  'cook-whisk': () => <><Bowl /><ellipse cx="100" cy="72" rx="44" ry="6" fill={C.egg} /><g transform="rotate(25 100 50)"><rect x="96" y="0" width="8" height="34" rx="4" fill={C.dark} /><path d="M100 34 q-16 20 0 40 q16 -20 0 -40 M100 34 q-8 20 0 40 q8 -20 0 -40" fill="none" stroke={C.metalD} strokeWidth={2} /></g><Arrow d="M150 40 A30 12 0 1 1 140 30" /></>,
  'cook-omelette': () => <><Pan fill={<g><ellipse cx="100" cy="95" rx="46" ry="9" fill={C.egg} />{[[80, 93], [96, 98], [112, 92], [124, 97], [90, 90]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="5" ry="2.5" fill={C.green} />)}</g>} /><ellipse cx="100" cy="60" rx="54" ry="10" fill="none" stroke={C.metalD} strokeWidth={2} strokeDasharray="5 4" /><Flame y={130} /></>,
  'cook-flip': () => <><Pan y={100} fill={<ellipse cx="100" cy="100" rx="46" ry="9" fill={C.egg} />} /><ellipse cx="100" cy="76" rx="54" ry="10" fill="#fff" stroke={C.line} strokeWidth={2} /><Arrow d="M30 90 Q20 40 70 40" /><Arrow d="M170 60 Q180 110 130 120" /></>,
  'cook-pancake': () => <><Plate cy={116} />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx="100" cy={104 - i * 12} rx="50" ry="11" fill={i === 3 ? '#FCD34D' : '#F59E0B'} stroke="#B45309" strokeWidth={1.5} />)}<g fill="#fff" stroke="#B45309"><circle cx="86" cy="66" r="2" /><circle cx="104" cy="70" r="2.5" /><circle cx="118" cy="64" r="2" /></g><path d="M86 62 q14 -8 30 0 q-4 8 -14 8 q-12 0 -16 -8 z" fill="#B91C1C" opacity={0.85} /></>,
  'knife-1': () => <><Board /><Onion /></>,
  'knife-2': () => <><Board /><Onion cuts={3} /><g><path d="M130 96 q-6 -22 6 -30 q10 -6 24 2 l14 10 v18 z" fill="#FED7AA" stroke={C.ink} strokeWidth={2} /><path d="M136 70 q-8 6 -4 18 M146 68 q-8 6 -4 20 M156 70 q-8 6 -4 20" fill="none" stroke={C.ink} strokeWidth={1.5} /></g><Knife x={60} y={40} r={90} /></>,
  'knife-3': () => <><Board /><Onion cuts={7} /><Knife x={150} y={30} r={90} /></>,
  'knife-4': () => <><Board /><Onion cuts={7} dice /><Check x={170} y={30} /></>,
  // ----- Programmieren
  'code-html': () => <Browser url="index.html"><Txt x={34} y={56} size={14} anchor="start" color={C.papD}>{'<h1>'}</Txt><Txt x={74} y={56} size={14} anchor="start">Ciao!</Txt><Txt x={116} y={56} size={14} anchor="start" color={C.papD}>{'</h1>'}</Txt><Txt x={34} y={82} size={12} anchor="start" color={C.green}>{'<p>'}</Txt><rect x="60" y="74" width="80" height="8" rx="4" fill={C.line} /><Txt x={144} y={82} size={12} anchor="start" color={C.green}>{'</p>'}</Txt><rect x="34" y="96" width="120" height="8" rx="4" fill={C.line} /></Browser>,
  'code-css': () => <Browser><rect x="21" y="33" width="158" height="92" fill="#FEF9C3" /><Txt x={100} y={66} size={20} color="#EF4444">Il mio sito</Txt>{['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7'].map((c, i) => <circle key={c} cx={52 + i * 24} cy="96" r="9" fill={c} />)}</Browser>,
  'code-js': () => <Browser><Txt x={100} y={62} size={14}>Hai cliccato!</Txt><rect x="66" y="78" width="68" height="24" rx="8" fill={C.papD} /><Txt x={100} y={95} size={11} color="#fff">Click</Txt><path d="M124 96 l0 22 l6 -6 l6 10 l4 -2 l-6 -10 l8 0 z" fill="#fff" stroke={C.ink} strokeWidth={1.5} /></Browser>,
  'code-app': () => (
    <><rect x="66" y="6" width="68" height="128" rx="12" fill={C.dark} /><rect x="71" y="16" width="58" height="108" rx="4" fill="#fff" /><Txt x={100} y={30} size={8}>Lista</Txt>
      {[0, 1, 2, 3].map((i) => <g key={i}><circle cx="80" cy={44 + i * 16} r="4" fill={i < 2 ? C.green : '#fff'} stroke={C.ink} strokeWidth={1} /><rect x="88" y={41 + i * 16} width={30 - i * 3} height="6" rx="3" fill={i < 2 ? C.line : C.soft} /></g>)}
      <rect x="76" y="106" width="48" height="12" rx="4" fill={C.papD} /><Txt x={30} y={50} size={12} color={C.papD}>HTML</Txt><Txt x={30} y={74} size={12} color="#EF4444">CSS</Txt><Txt x={30} y={98} size={12} color="#CA8A04">JS</Txt></>
  ),
  'code-online': () => <><circle cx="100" cy="70" r="46" fill={C.papL} stroke={C.papD} strokeWidth={2} /><ellipse cx="100" cy="70" rx="20" ry="46" fill="none" stroke={C.papD} strokeWidth={2} /><path d="M54 70 h92 M60 46 h80 M60 94 h80" stroke={C.papD} strokeWidth={2} /><rect x="40" y="114" width="120" height="18" rx="9" fill="#fff" stroke={C.ink} strokeWidth={2} /><Txt x={100} y={127} size={9} weight={600}>https://…</Txt></>,
  'code-folder': () => <><path d="M30 34 h50 l10 12 h80 v74 h-140 z" fill={C.yellow} stroke="#CA8A04" strokeWidth={2} /><rect x="70" y="58" width="60" height="52" rx="4" fill="#fff" stroke={C.ink} strokeWidth={2} /><Txt x={100} y={80} size={9}>index</Txt><Txt x={100} y={94} size={9} color={C.papD}>.html</Txt></>,
  'code-upload': () => <><path d="M54 96 a22 22 0 0 1 6 -43 a30 30 0 0 1 56 -8 a24 24 0 0 1 32 51 z" fill={C.papL} stroke={C.papD} strokeWidth={2} /><Arrow d="M100 126 V72" color={C.papD} /><rect x="80" y="112" width="40" height="22" rx="3" fill={C.yellow} stroke="#CA8A04" strokeWidth={2} /></>,
  // ----- Heimwerken
  'wall-1': () => <Wall><rect x="70" y="26" width="60" height="44" fill="#fff" stroke={C.ink} strokeWidth={3} /><path d="M78 62 l14 -16 l10 10 l8 -8 l12 14 z" fill={C.greenL} /><Fold x1={10} y1={48} x2={190} y2={48} /><path d="M24 48 V126" stroke={C.warm} strokeWidth={3} /><Txt x={36} y={92} size={11} anchor="start" color="#B45309">150 cm</Txt><circle cx="170" cy="40" r="9" fill="#FED7AA" stroke={C.ink} strokeWidth={1.5} /><path d="M170 50 v40 M170 90 l-8 30 M170 90 l8 30 M160 62 h20" stroke={C.ink} strokeWidth={3} strokeLinecap="round" /></Wall>,
  'wall-2': () => <Wall><rect x="30" y="40" width="70" height="56" fill="#E2E8F0" stroke={C.ink} strokeWidth={3} /><path d="M58 52 h14 l-7 -6 z" fill={C.ink} /><path d="M108 40 V52" stroke={C.warm} strokeWidth={2} /><path d="M104 40 h8 M104 52 h8" stroke={C.warm} strokeWidth={2} /><path d="M140 50 l8 8 M148 50 l-8 8" stroke={C.ink} strokeWidth={2.5} /><g transform="translate(160 76) rotate(-40)"><rect x="0" y="-4" width="40" height="8" fill={C.yellow} stroke={C.ink} strokeWidth={1.5} /><path d="M0 -4 l-8 4 l8 4" fill={C.wood} stroke={C.ink} strokeWidth={1.5} /></g></Wall>,
  'wall-3': () => <Wall><rect x="150" y="0" width="50" height="126" fill="#E2E8F0" /><g><rect x="18" y="52" width="70" height="26" rx="6" fill="#0EA5E9" stroke={C.ink} strokeWidth={2} /><path d="M40 78 l-6 34 h20 l4 -34" fill="#0284C7" stroke={C.ink} strokeWidth={2} /><rect x="88" y="60" width="14" height="10" fill={C.metalD} /><path d="M102 65 h40" stroke={C.metalD} strokeWidth={3} /></g><rect x="158" y="58" width="22" height="12" rx="2" fill="#F87171" stroke={C.ink} strokeWidth={1.5} /><Txt x={170} y={100} size={10}>5 mm</Txt></Wall>,
  'wall-4': () => <Wall><rect x="56" y="30" width="88" height="62" fill="#fff" stroke={C.ink} strokeWidth={3} /><path d="M66 82 l20 -24 l14 14 l12 -10 l22 20 z" fill={C.greenL} /><circle cx="126" cy="46" r="6" fill={C.yellow} /><rect x="56" y="100" width="88" height="14" rx="3" fill={C.yellow} stroke={C.ink} strokeWidth={2} /><rect x="90" y="103" width="20" height="8" rx="4" fill={C.greenL} stroke={C.green} strokeWidth={1.5} /><circle cx="100" cy="107" r="3" fill={C.green} /></Wall>,
  'bulb-1': () => <><Bulb x={70} /><rect x="130" y="40" width="40" height="60" rx="6" fill="#fff" stroke={C.ink} strokeWidth={2} /><rect x="140" y="62" width="20" height="30" rx="4" fill={C.line} stroke={C.ink} strokeWidth={1.5} /><Txt x={150} y={56} size={10}>0</Txt></>,
  'bulb-2': () => <><Bulb x={80} y={56} /><Arrow d="M40 110 A50 16 0 0 0 120 110" /><rect x="140" y="40" width="44" height="24" rx="4" fill="#fff" stroke={C.ink} strokeWidth={1.5} /><Txt x={162} y={57} size={12}>E27</Txt><rect x="140" y="74" width="44" height="24" rx="4" fill="#fff" stroke={C.ink} strokeWidth={1.5} /><Txt x={162} y={91} size={12}>E14</Txt></>,
  'bulb-3': () => <><Bulb x={70} on led /><rect x="120" y="30" width="70" height="80" rx="6" fill="#fff" stroke={C.ink} strokeWidth={2} /><Txt x={155} y={56} size={14}>LED</Txt><Txt x={155} y={78} size={12} color={C.papD}>800 lm</Txt><Txt x={155} y={98} size={12} color="#B45309">2700 K</Txt></>,
  'bulb-4': () => <><Bulb x={70} on /><Arrow d="M110 30 A44 16 0 0 1 30 30" /><path d="M140 70 h40 l-4 50 h-32 z" fill={C.green} stroke={C.ink} strokeWidth={2} /><path d="M136 70 h48" stroke={C.ink} strokeWidth={3} /><path d="M150 104 l10 -16 l10 16 z" fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round" /></>,
  'sink-1': () => <><Sink /><g><rect x="96" y="0" width="8" height="40" rx="3" fill={C.woodD} /><path d="M76 52 q24 -24 48 0 z" fill={C.red} stroke={C.ink} strokeWidth={2} /></g><Arrow d="M60 4 v24" /><Arrow d="M70 28 v-24" /></>,
  'sink-2': () => <><Sink /><Siphon /><path d="M80 112 h50 l-4 26 h-42 z" fill={C.pap} stroke={C.ink} strokeWidth={2} /><Arrow d="M150 90 A14 14 0 1 0 136 104" /></>,
  'sink-3': () => <><Sink /><Siphon apart /><path d="M40 120 q10 -10 20 0 q-10 10 -20 0" fill={C.soft} /><Check x={170} y={110} /></>,
  'sink-4': () => <><Sink /><rect x="40" y="70" width="40" height="54" rx="4" fill="#fff" stroke={C.ink} strokeWidth={2} /><Txt x={60} y={102} size={8}>NaHCO₃</Txt><path d="M130 70 h20 v12 l8 10 v34 h-36 v-34 l8 -10 z" fill="#FEF9C3" stroke={C.ink} strokeWidth={2} /><Txt x={140} y={114} size={9}>%</Txt><g transform="translate(100 96)"><circle r="12" fill="#fff" stroke={C.ink} strokeWidth={2} /><path d="M0 -7 V0 L5 3" stroke={C.ink} strokeWidth={2} fill="none" /></g><Txt x={100} y={126} size={10}>15′</Txt></>
};

export const hasArt = (key?: string) => !!key && key in ART;

/** Zeichnung auf heller Fläche (auch im dunklen Thema). */
export function AdultArt({ name, className = '', label }: { name?: string; className?: string; label?: string }) {
  const draw = name ? ART[name] : undefined;
  if (!draw) return null;
  return (
    <div className={`overflow-hidden rounded-2xl bg-[#F8FAFC] ring-1 ring-black/5 ${className}`}>
      <Svg label={label}>{draw()}</Svg>
    </div>
  );
}

export const ART_KEYS = Object.keys(ART);
