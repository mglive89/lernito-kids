import { useId, type ReactNode } from 'react';
import { BLUE, BLUE_L, BROWN, BROWN_D, DARK, FONT, GREEN, GREY, GREY_D, GREY_L, INK, LEAF, LINE, MUTED, ORANGE, PAPER, PINK, PURPLE, RED, SOFT, SOFT_Y, WATER, WHITE, YELLOW, YELLOW_L } from './palette';
import { OBJECTS } from './objects';

/* Sprache: Satzstreifen, Gedichtkarte, Spannungskurve, Comic, Zeitstrahl der Zeiten, Präpositionen, Schilder, Wetter … */

const T = ({ x, y, children, size = 13, anchor = 'middle', fill = INK, weight = 700, italic = false }: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; weight?: number; italic?: boolean }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} fontFamily={FONT} fontStyle={italic ? 'italic' : undefined} dominantBaseline="middle">{children}</text>
);
const Obj = ({ name, x, y, s = 1 }: { name: string; x: number; y: number; s?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}>{OBJECTS[name]?.()}</g>;

/** Satz als Wortkärtchen; `mark` = [von, bis] (Wortindex) wird farbig hervorgehoben. Zeilenumbruch automatisch. */
export function SentenceStrip({ words, mark }: { words: string[]; mark?: [number, number] }) {
  const cw = 8.6, pad = 10, gap = 8, maxW = 320;
  const pos: { x: number; y: number; w: number }[] = [];
  let x = 0, y = 0;
  words.forEach((w) => {
    const ww = w.length * cw + 2 * pad;
    if (x + ww > maxW && x > 0) { x = 0; y += 46; }
    pos.push({ x, y, w: ww });
    x += ww + gap;
  });
  const H = y + 42;
  return (
    <svg viewBox={`-4 -4 ${maxW + 8} ${H + 8}`} className="mx-auto h-auto w-full max-w-xl">
      {words.map((w, i) => {
        const on = mark && i >= mark[0] && i <= mark[1];
        const p = pos[i]!;
        return (
          <g key={i}>
            <rect x={p.x} y={p.y} width={p.w} height="36" rx="8" fill={on ? YELLOW : PAPER} stroke={on ? ORANGE : LINE} strokeWidth="2" />
            <T x={p.x + p.w / 2} y={p.y + 18} size={15} fill={on ? DARK : INK} weight={on ? 800 : 600}>{w}</T>
          </g>
        );
      })}
    </svg>
  );
}

/** Gedichtkarte: Verse, Reimwörter am Zeilenende farbig nach Reimklang (Schema wird nicht verraten, nur Wörter unterstrichen) */
export function Verse({ lines }: { lines: string[] }) {
  return (
    <svg viewBox={`0 0 340 ${lines.length * 34 + 30}`} className="mx-auto h-auto w-full max-w-xl">
      <rect x="2" y="2" width="336" height={lines.length * 34 + 26} rx="14" fill={SOFT_Y} stroke={LINE} />
      <path d={`M22 16 V${lines.length * 34 + 12}`} stroke={ORANGE} strokeWidth="2" opacity="0.6" />
      {lines.map((l, i) => <T key={i} x={34} y={30 + i * 34} size={14} anchor="start" weight={600} italic>{l}</T>)}
    </svg>
  );
}

/** Spannungskurve einer Geschichte: Einleitung, Hauptteil (Steigerung), Höhepunkt, Schluss; `mark` 0–3 */
export function StoryArc({ mark, labels }: { mark?: number; labels: string[] }) {
  const pts: [number, number][] = [[30, 150], [110, 130], [200, 40], [290, 140]];
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full">
      <path d="M20 156 C70 152 90 140 120 120 C160 92 180 40 200 40 C222 40 240 110 300 146" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
      <line x1="16" x2="306" y1="160" y2="160" stroke={LINE} strokeWidth="2" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + (i === 0 ? 2 : i === 1 ? -6 : i === 3 ? 4 : 0)} r="9" fill={i === mark ? YELLOW : PAPER} stroke={INK} strokeWidth="2" />
          <T x={x} y={176} size={11} fill={i === mark ? ORANGE : MUTED}>{i === mark ? '?' : labels[i]}</T>
        </g>
      ))}
    </svg>
  );
}

/** Comic mit einer Figur und Sprechblase */
export function Comic({ text, name, think = false, color = BLUE }: { text: string; name?: string; think?: boolean; color?: string }) {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > 24) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
  if (cur.trim()) lines.push(cur.trim());
  const h = 26 + lines.length * 20;
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full">
      <rect x="2" y="2" width="316" height="196" rx="14" fill={SOFT} />
      <g transform="translate(46 112)">
        <circle cx="20" cy="0" r="22" fill={YELLOW_L} stroke={INK} strokeWidth="2" />
        <circle cx="13" cy="-3" r="2.5" fill={DARK} /><circle cx="27" cy="-3" r="2.5" fill={DARK} />
        <path d="M12 8 Q20 14 28 8" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M-6 76 C-6 40 46 40 46 76Z" fill={color} />
        {name && <T x={20} y={84} size={12}>{name}</T>}
      </g>
      <rect x="110" y={20} width="196" height={h} rx="16" fill={WHITE} stroke={INK} strokeWidth="2" strokeDasharray={think ? '5 4' : undefined} />
      {!think && <path d={`M124 ${20 + h - 2} L92 ${110} L146 ${20 + h - 2}`} fill={WHITE} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
      {!think && <rect x="125" y={20 + h - 4} width="20" height="6" fill={WHITE} />}
      {think && ([[96, 96, 6], [104, 80, 9]] as [number, number, number][]).map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={WHITE} stroke={INK} strokeWidth="2" />)}
      {lines.map((l, i) => <T key={i} x={208} y={42 + i * 20} size={14} fill={DARK}>{l}</T>)}
    </svg>
  );
}

/** Zeitstrahl der Zeitformen: Vergangenheit – jetzt – Zukunft; `when` markiert die Handlung, `span` = andauernd */
export function TenseLine({ when, span = false, labels }: { when: 'past' | 'now' | 'future' | 'before-past'; span?: boolean; labels: [string, string, string] }) {
  const id = useId();
  const x = when === 'before-past' ? 60 : when === 'past' ? 110 : when === 'now' ? 170 : 250;
  return (
    <svg viewBox="0 0 320 130" className="h-auto w-full">
      <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={INK} /></marker></defs>
      <line x1="20" x2="304" y1="70" y2="70" stroke={INK} strokeWidth="3" markerEnd={`url(#${id})`} />
      <line x1="170" x2="170" y1="50" y2="90" stroke={RED} strokeWidth="3" />
      <T x={170} y={108} size={12} fill={RED}>{labels[1]}</T>
      <T x={70} y={108} size={12} fill={MUTED}>{labels[0]}</T>
      <T x={270} y={108} size={12} fill={MUTED}>{labels[2]}</T>
      {span ? <rect x={x - 34} y="58" width="68" height="24" rx="12" fill={BLUE} opacity="0.85" /> : <path d={`M${x} 46 L${x + 14} 70 L${x} 94 L${x - 14} 70Z`} fill={BLUE} />}
      {when === 'before-past' && <path d="M110 46 L124 70 L110 94 L96 70Z" fill={BLUE_L} />}
    </svg>
  );
}

/** Präpositionen: Katze und Kiste */
export function Preposition({ pos }: { pos: 'auf' | 'unter' | 'in' | 'neben' | 'hinter' | 'vor' | 'zwischen' }) {
  const box = (x: number, k: string, front = false) => (
    <g key={k}>
      <rect x={x} y="78" width="70" height="56" rx="4" fill={front ? BROWN : '#C98B55'} />
      <path d={`M${x} 78 L${x + 10} 64 H${x + 80} L${x + 70} 78Z`} fill="#D9A06A" />
      <path d={`M${x + 70} 78 L${x + 80} 64 V120 L${x + 70} 134Z`} fill={BROWN_D} />
    </g>
  );
  const cat = (x: number, y: number, s = 0.62) => <Obj name="katze" x={x} y={y} s={s} />;
  const c: Record<string, ReactNode> = {
    auf: <>{box(110, 'b')}{cat(116, 20)}</>,
    unter: <><rect x="96" y="40" width="110" height="10" rx="3" fill={BROWN_D} /><rect x="102" y="50" width="8" height="84" fill={BROWN} /><rect x="192" y="50" width="8" height="84" fill={BROWN} />{cat(122, 86, 0.5)}</>,
    in: <>{cat(122, 40, 0.5)}{box(110, 'b', true)}<path d="M110 78 H180 V100 H110Z" fill={BROWN} /></>,
    neben: <>{box(70, 'b')}{cat(170, 74)}</>,
    hinter: <>{cat(130, 30, 0.7)}{box(110, 'b', true)}</>,
    vor: <>{box(110, 'b')}{cat(110, 74, 0.68)}</>,
    zwischen: <>{box(20, 'a')}{box(200, 'b')}{cat(116, 74)}</>
  };
  return (
    <svg viewBox={pos === 'zwischen' ? '10 6 280 140' : '55 6 190 140'} className="h-auto w-full">
      <rect x="0" y="134" width="300" height="8" rx="4" fill={GREY_L} />
      {c[pos]}
    </svg>
  );
}

/** Wetter */
export function Weather({ kind }: { kind: 'sonnig' | 'regen' | 'schnee' | 'wolkig' | 'gewitter' | 'wind' | 'nebel' }) {
  const cloud = (x: number, y: number, col = GREY_L) => <path d={`M${x} ${y + 24} C${x - 16} ${y + 24} ${x - 16} ${y} ${x} ${y} C${x + 2} ${y - 18} ${x + 30} ${y - 22} ${x + 36} ${y - 6} C${x + 50} ${y - 10} ${x + 60} ${y + 4} ${x + 56} ${y + 24}Z`} fill={col} />;
  const sun = (x: number, y: number, r = 16) => <g>{Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={x + Math.cos(a) * (r + 4)} y1={y + Math.sin(a) * (r + 4)} x2={x + Math.cos(a) * (r + 12)} y2={y + Math.sin(a) * (r + 12)} stroke={YELLOW} strokeWidth="4" strokeLinecap="round" />; })}<circle cx={x} cy={y} r={r} fill={YELLOW} /></g>;
  const K: Record<string, ReactNode> = {
    sonnig: sun(50, 50, 20),
    wolkig: <>{sun(62, 34, 13)}{cloud(30, 50)}</>,
    regen: <>{cloud(28, 34, GREY)}{[34, 48, 62, 76].map((x) => <line key={x} x1={x} y1="66" x2={x - 6} y2="84" stroke={WATER} strokeWidth="4" strokeLinecap="round" />)}</>,
    schnee: <>{cloud(28, 34, GREY_L)}{[36, 52, 68].map((x, i) => <g key={x} stroke={BLUE_L} strokeWidth="2.5" strokeLinecap="round">{[0, 60, 120].map((d) => <line key={d} x1={x} y1={74 + (i % 2) * 8 - 6} x2={x} y2={74 + (i % 2) * 8 + 6} transform={`rotate(${d} ${x} ${74 + (i % 2) * 8})`} />)}</g>)}</>,
    gewitter: <>{cloud(28, 30, GREY_D)}<path d="M54 56 L44 74 H54 L46 92 L66 68 H56 L62 56Z" fill={YELLOW} /></>,
    wind: <g stroke={BLUE} strokeWidth="5" fill="none" strokeLinecap="round"><path d="M12 38 H62 C74 38 74 22 64 22" /><path d="M12 54 H80 C92 54 92 72 80 72" /><path d="M12 70 H48" /></g>,
    nebel: <g stroke={GREY} strokeWidth="6" strokeLinecap="round">{[30, 46, 62, 78].map((y, i) => <line key={y} x1={14 + (i % 2) * 8} x2={86 - (i % 2) * 8} y1={y} y2={y} />)}</g>
  };
  return <svg viewBox="0 0 100 100" className="h-full w-full">{K[kind]}</svg>;
}

/** Baum in einer Jahreszeit */
export function SeasonTree({ season }: { season: 'fruehling' | 'sommer' | 'herbst' | 'winter' }) {
  const crown = season === 'fruehling' ? '#A8DC8C' : season === 'sommer' ? LEAF : season === 'herbst' ? ORANGE : 'none';
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect width="100" height="100" rx="12" fill={season === 'winter' ? '#E3ECF7' : SOFT} />
      <rect x="45" y="50" width="10" height="38" fill={BROWN} />
      <path d="M50 58 L34 40 M50 64 L68 44 M50 52 L50 30" stroke={BROWN} strokeWidth="4" strokeLinecap="round" />
      {season !== 'winter' && <g fill={crown}><circle cx="50" cy="36" r="22" /><circle cx="32" cy="46" r="14" /><circle cx="68" cy="46" r="14" /></g>}
      {season === 'fruehling' && ([[40, 30], [58, 26], [30, 46], [66, 44], [50, 44]] as [number, number][]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={PINK} />)}
      {season === 'sommer' && ([[40, 34], [60, 40], [50, 24]] as [number, number][]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={RED} />)}
      {season === 'herbst' && ([[20, 84], [76, 88], [64, 80], [30, 90]] as [number, number][]).map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="2.5" fill={i % 2 ? ORANGE : YELLOW} />)}
      {season === 'winter' && <><rect x="0" y="86" width="100" height="14" fill={WHITE} />{([[20, 20], [74, 30], [40, 14], [86, 60], [12, 56]] as [number, number][]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill={WHITE} />)}<path d="M34 40 L50 52 L68 44" stroke={WHITE} strokeWidth="3" fill="none" /></>}
      <rect x="0" y="88" width="100" height="12" fill={season === 'winter' ? WHITE : GREEN} opacity={season === 'winter' ? 1 : 0.6} />
    </svg>
  );
}

/** Mehrere gleiche Gegenstände (Mehrzahl, Zählen) */
export function Many({ name, n }: { name: string; n: number }) {
  const cols = Math.min(n, 5), rows = Math.ceil(n / cols);
  return (
    <svg viewBox={`0 0 ${cols * 64 + 8} ${rows * 64 + 8}`} className="mx-auto h-auto w-full" style={{ maxWidth: `${cols * 4.6}rem` }}>
      {Array.from({ length: n }, (_, i) => <Obj key={i} name={name} x={4 + (i % cols) * 64} y={4 + Math.floor(i / cols) * 64} s={0.6} />)}
    </svg>
  );
}

/** Reihe von Bildern, optional mit Beschriftung darunter */
export function ObjRow({ names, labels }: { names: string[]; labels?: string[] }) {
  const n = names.length;
  return (
    <svg viewBox={`0 0 ${n * 84 + 4} ${labels ? 104 : 86}`} className="mx-auto h-auto w-full" style={{ maxWidth: `${n * 6}rem` }}>
      {names.map((nm, i) => (
        <g key={i}>
          <rect x={4 + i * 84} y="2" width="76" height="76" rx="14" fill={SOFT} />
          <Obj name={nm} x={10 + i * 84} y={8} s={0.64} />
          {labels && <T x={42 + i * 84} y={94} size={13}>{labels[i]}</T>}
        </g>
      ))}
    </svg>
  );
}

/** Drei Gegenstände unterschiedlicher Größe mit Buchstaben A–C (Steigerung) */
export function Sizes({ name, sizes }: { name: string; sizes: number[] }) {
  return (
    <svg viewBox="0 0 330 150" className="h-auto w-full">
      <rect x="0" y="130" width="330" height="6" rx="3" fill={GREY_L} />
      {sizes.map((s, i) => {
        const w = 100 * s;
        return (
          <g key={i}>
            <Obj name={name} x={20 + i * 105 + (100 - w) / 2} y={130 - w} s={s} />
            <T x={70 + i * 105} y={146} size={13}>{String.fromCharCode(65 + i)}</T>
          </g>
        );
      })}
    </svg>
  );
}

/** Schild mit Text (Hinweisschilder) */
export function Sign({ text, kind = 'info' }: { text: string; kind?: 'info' | 'warn' | 'stop' }) {
  const col = kind === 'warn' ? YELLOW : kind === 'stop' ? RED : BLUE;
  const lines = text.split('\n');
  return (
    <svg viewBox="0 0 260 170" className="mx-auto h-auto w-full max-w-sm">
      <rect x="122" y="96" width="16" height="74" fill={GREY} />
      <rect x="20" y="10" width="220" height={36 + lines.length * 26} rx="12" fill={col} stroke={WHITE} strokeWidth="4" />
      {lines.map((l, i) => <T key={i} x={130} y={36 + i * 26} size={20} fill={kind === 'warn' ? DARK : WHITE} weight={800}>{l}</T>)}
    </svg>
  );
}

/** Fahrkarte / Info-Tafel (ausgedacht) */
export function Ticket({ rows, title }: { rows: [string, string][]; title: string }) {
  return (
    <svg viewBox={`0 0 320 ${rows.length * 28 + 56}`} className="h-auto w-full">
      <rect x="2" y="2" width="316" height={rows.length * 28 + 50} rx="12" fill={PAPER} stroke={LINE} strokeWidth="2" />
      <rect x="2" y="2" width="316" height="34" rx="12" fill={PURPLE} />
      <T x={160} y={20} size={15} fill={WHITE}>{title}</T>
      {rows.map(([k, v], i) => (
        <g key={i}>
          <T x={20} y={56 + i * 28} size={13} anchor="start" fill={MUTED} weight={600}>{k}</T>
          <T x={300} y={56 + i * 28} size={14} anchor="end">{v}</T>
        </g>
      ))}
    </svg>
  );
}

/** Körper-Umriss (einfach) mit markiertem Körperteil */
export function BodyParts({ mark }: { mark: 'kopf' | 'arm' | 'hand' | 'bein' | 'fuss' | 'bauch' }) {
  const hi = (k: string) => (k === mark ? YELLOW : '#F2C9A0');
  return (
    <svg viewBox="0 0 160 220" className="mx-auto h-auto w-full max-w-[11rem]">
      <circle cx="80" cy="34" r="24" fill={hi('kopf')} />
      <rect x="56" y="62" width="48" height="70" rx="14" fill={hi('bauch')} />
      <rect x="28" y="66" width="22" height="58" rx="10" fill={hi('arm')} transform="rotate(12 39 66)" />
      <rect x="110" y="66" width="22" height="58" rx="10" fill={hi('arm')} transform="rotate(-12 121 66)" />
      <circle cx="28" cy="130" r="11" fill={hi('hand')} />
      <circle cx="132" cy="130" r="11" fill={hi('hand')} />
      <rect x="58" y="128" width="20" height="66" rx="9" fill={hi('bein')} />
      <rect x="82" y="128" width="20" height="66" rx="9" fill={hi('bein')} />
      <ellipse cx="62" cy="200" rx="18" ry="9" fill={hi('fuss')} />
      <ellipse cx="98" cy="200" rx="18" ry="9" fill={hi('fuss')} />
      <circle cx="72" cy="32" r="2.5" fill={DARK} /><circle cx="88" cy="32" r="2.5" fill={DARK} />
      <path d="M72 42 Q80 48 88 42" stroke={DARK} strokeWidth="2" fill="none" />
      <path d="M58 16 C64 2 96 2 102 16 C92 10 68 10 58 16Z" fill={BROWN_D} />
    </svg>
  );
}

/** Ampel (Fußgänger) */
export function TrafficLight({ light }: { light: 'rot' | 'gruen' }) {
  return (
    <svg viewBox="0 0 100 160" className="h-full w-full">
      <rect x="44" y="110" width="12" height="50" fill={GREY} />
      <rect x="22" y="6" width="56" height="108" rx="12" fill={DARK} />
      <circle cx="50" cy="34" r="20" fill={light === 'rot' ? RED : '#4A2A2A'} />
      <circle cx="50" cy="84" r="20" fill={light === 'gruen' ? GREEN : '#1E3A2E'} />
      <g fill={DARK} opacity="0.9">
        {light === 'rot' && <g><circle cx="50" cy="24" r="3.5" /><rect x="46" y="28" width="8" height="14" rx="3" /><rect x="46" y="40" width="3" height="8" /><rect x="51" y="40" width="3" height="8" /></g>}
        {light === 'gruen' && <g><circle cx="52" cy="72" r="3.5" /><path d="M50 77 L46 90 M50 77 L56 88 M48 80 L42 84 M52 80 L58 82" stroke={DARK} strokeWidth="3" strokeLinecap="round" /></g>}
      </g>
    </svg>
  );
}

/** Mülltrennung: Behälter mit Beschriftung (ohne landesspezifische Farben) */
export function Bin({ label, color = GREY_D }: { label: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 110" className="h-full w-full">
      <rect x="18" y="20" width="64" height="10" rx="4" fill={color} />
      <path d="M22 32 H78 L72 100 H28Z" fill={color} opacity="0.9" />
      <rect x="22" y="52" width="56" height="20" fill={WHITE} opacity="0.92" />
      <T x={50} y={62} size={label.length > 7 ? 9 : 11} fill={DARK}>{label}</T>
    </svg>
  );
}

export const LANGUAGE_ART = {
  satz: SentenceStrip, gedicht: Verse, spannung: StoryArc, comic: Comic, zeitformen: TenseLine, praeposition: Preposition,
  wetter: Weather, jahreszeit: SeasonTree, viele: Many, groessen: Sizes, objreihe: ObjRow, schild: Sign, fahrkarte: Ticket, koerperteile: BodyParts,
  ampel: TrafficLight, tonne: Bin
};
