import { useId, type ReactNode } from 'react';
import { BLUE, BLUE_L, DARK, FAINT, FONT, GREEN, INK, LINE, MUTED, ORANGE, PAPER, PURPLE, RED, ser, SOFT, WHITE, YELLOW } from './palette';
import { num } from '../../i18n';

/* Mathe-Diagramme, alle mit Parametern, damit Zufallsaufgaben möglich sind. */

const T = ({ x, y, children, size = 14, anchor = 'middle', weight = 700, fill = INK }: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; weight?: number; fill?: string }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} fontFamily={FONT} dominantBaseline="middle">{children}</text>
);

const fmt = (v: number) => num(Math.round(v * 1000) / 1000);

function Arrow({ id, color = INK }: { id: string; color?: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10Z" fill={color} />
    </marker>
  );
}

/** Zahlenstrahl von `from` bis `to`; `ask` markiert eine Stelle mit „?“, `points` zeigt Punkte mit Beschriftung. */
export function NumberLine({ from, to, step = 1, labelEvery = 1, ask, points = [], hops }: { from: number; to: number; step?: number; labelEvery?: number; ask?: number; points?: { v: number; label?: string; color?: string }[]; hops?: { from: number; to: number }[] }) {
  const id = useId();
  const W = 340, x0 = 22, x1 = 318;
  const X = (v: number) => x0 + ((v - from) / (to - from)) * (x1 - x0);
  const ticks: number[] = [];
  for (let v = from, i = 0; v <= to + 1e-9; v = from + ++i * step) ticks.push(Math.round(v * 1000) / 1000);
  return (
    <svg viewBox={`0 0 ${W} 110`} className="h-auto w-full">
      <defs><Arrow id={id} /><Arrow id={id + 'h'} color={ORANGE} /></defs>
      <line x1={x0 - 10} y1="60" x2={x1 + 14} y2="60" stroke={INK} strokeWidth="2.5" markerEnd={`url(#${id})`} />
      {ticks.map((v, i) => (
        <g key={v}>
          <line x1={X(v)} y1={i % labelEvery === 0 ? 50 : 54} x2={X(v)} y2={i % labelEvery === 0 ? 70 : 66} stroke={INK} strokeWidth={i % labelEvery === 0 ? 2.5 : 1.5} />
          {i % labelEvery === 0 && v !== ask && <T x={X(v)} y={86} size={13}>{fmt(v)}</T>}
        </g>
      ))}
      {hops?.map((h, i) => {
        const a = X(h.from), b = X(h.to), mid = (a + b) / 2, hgt = Math.min(34, Math.abs(b - a) * 0.6 + 10);
        return <path key={i} d={`M${a} 52 Q${mid} ${52 - hgt} ${b} 52`} fill="none" stroke={ORANGE} strokeWidth="2.5" markerEnd={`url(#${id}h)`} />;
      })}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={X(p.v)} cy="60" r="7" fill={p.color ?? BLUE} stroke={PAPER} strokeWidth="2" />
          {p.label && <T x={X(p.v)} y={34} size={15} fill={p.color ?? BLUE}>{p.label}</T>}
        </g>
      ))}
      {ask !== undefined && (
        <g>
          <rect x={X(ask) - 15} y={74} width="30" height="26" rx="7" fill={YELLOW} />
          <T x={X(ask)} y={88} size={16} fill={DARK}>?</T>
          <path d={`M${X(ask)} 74 V66`} stroke={YELLOW} strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

/** Säulendiagramm */
export function Bars({ labels, values, unit = '', max, highlight, line, showValues = true }: { labels: string[]; values: number[]; unit?: string; max?: number; highlight?: number; line?: number[]; showValues?: boolean }) {
  const W = 340, H = 220, left = 40, bottom = 186, top = 22;
  const mx = max ?? niceMax(Math.max(...values, ...(line ?? [])));
  const bw = (W - left - 12) / labels.length;
  const Y = (v: number) => bottom - (v / mx) * (bottom - top);
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => f * mx);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      {grid.map((g) => (
        <g key={g}>
          <line x1={left} x2={W - 8} y1={Y(g)} y2={Y(g)} stroke={LINE} strokeWidth="1" />
          <T x={left - 6} y={Y(g)} size={10} anchor="end" weight={600} fill={MUTED}>{fmt(g)}</T>
        </g>
      ))}
      {values.map((v, i) => {
        const x = left + i * bw + bw * 0.18, w = bw * 0.64;
        return (
          <g key={i}>
            <rect x={x} y={Y(v)} width={w} height={bottom - Y(v)} rx="3" fill={highlight === undefined || highlight === i ? ser(i) : BLUE_L} />
            {showValues && <T x={x + w / 2} y={Y(v) - 9} size={11}>{fmt(v)}{unit}</T>}
            <T x={x + w / 2} y={bottom + 14} size={11} weight={600}>{labels[i]}</T>
          </g>
        );
      })}
      {line && <polyline points={line.map((v, i) => `${left + i * bw + bw / 2},${Y(v)}`).join(' ')} fill="none" stroke={RED} strokeWidth="2.5" />}
      <line x1={left} x2={W - 8} y1={bottom} y2={bottom} stroke={INK} strokeWidth="2" />
    </svg>
  );
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const f of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (f * p >= v) return f * p;
  return 10 * p;
}

/** Winkel mit Gradbogen; `showDeg` blendet die Zahl ein. */
export function Angle({ deg, showDeg = false, label }: { deg: number; showDeg?: boolean; label?: string }) {
  const cx = 120, cy = 150, r = 110;
  const a = (deg * Math.PI) / 180;
  const ex = cx + Math.cos(a) * r, ey = cy - Math.sin(a) * r;
  const ar = deg === 90 ? 0 : 34;
  const large = deg > 180 ? 1 : 0;
  const arc = `M${cx + ar} ${cy} A${ar} ${ar} 0 ${large} 0 ${cx + Math.cos(a) * ar} ${cy - Math.sin(a) * ar}`;
  const lx = cx + Math.cos(a / 2) * 56, ly = cy - Math.sin(a / 2) * 56;
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full">
      <path d={`M${cx} ${cy} L${cx + r + 30} ${cy} M${cx} ${cy} L${ex} ${ey}`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {deg === 90 ? <path d={`M${cx + 22} ${cy} V${cy - 22} H${cx}`} fill="none" stroke={BLUE} strokeWidth="3" /> : <path d={`${arc} L${cx} ${cy}Z`} fill={BLUE} fillOpacity="0.18" stroke={BLUE} strokeWidth="3" />}
      <circle cx={cx} cy={cy} r="5" fill={INK} />
      {(showDeg || label) && <T x={lx} y={ly} size={16} fill={BLUE}>{label ?? `${deg}°`}</T>}
    </svg>
  );
}

/** Rechteck mit Seitenlängen */
export function RectFig({ w, h, unit = 'cm', grid = false, ask, lw, lh }: { w: number; h: number; unit?: string; grid?: boolean; ask?: 'w' | 'h'; lw?: string; lh?: string }) {
  const s = Math.min(220 / w, 120 / h), x = (300 - w * s) / 2, y = 24;
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full">
      <rect x={x} y={y} width={w * s} height={h * s} fill={SOFT} stroke={BLUE} strokeWidth="3" />
      {grid && Array.from({ length: w - 1 }, (_, i) => <line key={'v' + i} x1={x + (i + 1) * s} x2={x + (i + 1) * s} y1={y} y2={y + h * s} stroke={BLUE} strokeOpacity="0.35" />)}
      {grid && Array.from({ length: h - 1 }, (_, i) => <line key={'h' + i} y1={y + (i + 1) * s} y2={y + (i + 1) * s} x1={x} x2={x + w * s} stroke={BLUE} strokeOpacity="0.35" />)}
      {!grid && <T x={x + (w * s) / 2} y={y + h * s + 18} size={15}>{ask === 'w' ? '?' : lw ?? `${fmt(w)} ${unit}`}</T>}
      {!grid && <T x={x + w * s + 10} y={y + (h * s) / 2} size={15} anchor="start">{ask === 'h' ? '?' : lh ?? `${fmt(h)} ${unit}`}</T>}
    </svg>
  );
}

/** Rechtwinkliges Dreieck: Katheten a (unten), b (rechts), Hypotenuse c. Beschriftung frei, „?“ für die gesuchte Seite. */
export function RightTriangle({ a, b, la, lb, lc, angle }: { a: number; b: number; la?: string; lb?: string; lc?: string; angle?: string }) {
  const s = Math.min(200 / a, 130 / b);
  const x0 = 40, y0 = 165, x1 = x0 + a * s, y1 = y0 - b * s;
  return (
    <svg viewBox="0 0 300 190" className="h-auto w-full">
      <path d={`M${x0} ${y0} L${x1} ${y0} L${x1} ${y1}Z`} fill={SOFT} stroke={BLUE} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M${x1 - 16} ${y0} V${y0 - 16} H${x1}`} fill="none" stroke={INK} strokeWidth="2" />
      {la && <T x={(x0 + x1) / 2} y={y0 + 15} size={15}>{la}</T>}
      {lb && <T x={x1 + 10} y={(y0 + y1) / 2} size={15} anchor="start">{lb}</T>}
      {lc && <T x={(x0 + x1) / 2 - 14} y={(y0 + y1) / 2 - 12} size={15} anchor="end">{lc}</T>}
      {angle && (
        <g>
          <path d={`M${x0 + 34} ${y0} A34 34 0 0 0 ${x0 + 34 * Math.cos(Math.atan2(b, a))} ${y0 - 34 * Math.sin(Math.atan2(b, a))}`} fill="none" stroke={ORANGE} strokeWidth="3" />
          <T x={x0 + 50} y={y0 - 12} size={14} fill={ORANGE}>{angle}</T>
        </g>
      )}
    </svg>
  );
}

/** Kreis mit Radius oder Durchmesser */
export function CircleFig({ r, show = 'r', unit = 'cm' }: { r: number; show?: 'r' | 'd'; unit?: string }) {
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full">
      <circle cx="150" cy="100" r="80" fill={SOFT} stroke={BLUE} strokeWidth="3" />
      <circle cx="150" cy="100" r="4" fill={INK} />
      {show === 'r' ? <line x1="150" y1="100" x2="230" y2="100" stroke={RED} strokeWidth="3" /> : <line x1="70" y1="100" x2="230" y2="100" stroke={RED} strokeWidth="3" />}
      <T x={show === 'r' ? 190 : 150} y={86} size={15} fill={RED}>{`${show} = ${fmt(show === 'r' ? r : 2 * r)} ${unit}`}</T>
    </svg>
  );
}

/** Koordinatensystem mit Punkten, Gerade, Parabel, Vektor oder Fläche unter einer Geraden */
export function Coord({ range = 5, points = [], line, parabola, vector, area, fn }: {
  range?: number; points?: { x: number; y: number; label?: string }[];
  line?: { m: number; b: number }; parabola?: { a: number; b: number; c: number }; vector?: { x: number; y: number; fx?: number; fy?: number };
  area?: { m: number; b: number; from: number; to: number }; fn?: 'sin' | 'exp' | 'sqrt';
}) {
  const id = useId();
  const S = 220, pad = 20, u = (S - 2 * pad) / (2 * range);
  const X = (x: number) => pad + (x + range) * u, Y = (y: number) => pad + (range - y) * u;
  const ticks = Array.from({ length: 2 * range + 1 }, (_, i) => i - range);
  const curve = (f: (x: number) => number) => {
    const pts: string[] = [];
    for (let x = -range; x <= range + 1e-9; x += range / 60) {
      const y = f(x);
      if (Number.isFinite(y) && Math.abs(y) <= range * 1.6) pts.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto h-auto w-full max-w-[19rem]">
      <defs>
        <clipPath id={id + 'c'}><rect x={pad} y={pad} width={S - 2 * pad} height={S - 2 * pad} /></clipPath>
        <Arrow id={id + 'a'} /><Arrow id={id + 'v'} color={RED} />
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={X(t)} x2={X(t)} y1={pad} y2={S - pad} stroke={FAINT} />
          <line y1={Y(t)} y2={Y(t)} x1={pad} x2={S - pad} stroke={FAINT} />
        </g>
      ))}
      <line x1={pad - 4} x2={S - pad + 8} y1={Y(0)} y2={Y(0)} stroke={INK} strokeWidth="1.8" markerEnd={`url(#${id}a)`} />
      <line y1={S - pad + 4} y2={pad - 8} x1={X(0)} x2={X(0)} stroke={INK} strokeWidth="1.8" markerEnd={`url(#${id}a)`} />
      <T x={S - 8} y={Y(0) - 10} size={11}>x</T>
      <T x={X(0) + 10} y={10} size={11}>y</T>
      {ticks.filter((t) => t !== 0 && (range <= 6 || t % 2 === 0)).map((t) => (
        <g key={'l' + t}>
          <T x={X(t)} y={Y(0) + 10} size={8} weight={600} fill={MUTED}>{t}</T>
          <T x={X(0) - 8} y={Y(t)} size={8} weight={600} fill={MUTED}>{t}</T>
        </g>
      ))}
      <g clipPath={`url(#${id}c)`}>
        {area && <path d={`M${X(area.from)} ${Y(0)} L${X(area.from)} ${Y(area.m * area.from + area.b)} L${X(area.to)} ${Y(area.m * area.to + area.b)} L${X(area.to)} ${Y(0)}Z`} fill={GREEN} fillOpacity="0.3" stroke={GREEN} strokeWidth="1.5" />}
        {area && <polyline points={curve((x) => area.m * x + area.b)} fill="none" stroke={BLUE} strokeWidth="2.5" />}
        {line && <polyline points={curve((x) => line.m * x + line.b)} fill="none" stroke={BLUE} strokeWidth="2.8" />}
        {parabola && <polyline points={curve((x) => parabola.a * x * x + parabola.b * x + parabola.c)} fill="none" stroke={PURPLE} strokeWidth="2.8" />}
        {fn && <polyline points={curve(fn === 'sin' ? (x) => 2 * Math.sin(x) : fn === 'exp' ? (x) => Math.pow(2, x) : (x) => (x < 0 ? NaN : 2 * Math.sqrt(x)))} fill="none" stroke={PURPLE} strokeWidth="2.8" />}
      </g>
      {vector && <line x1={X(vector.fx ?? 0)} y1={Y(vector.fy ?? 0)} x2={X((vector.fx ?? 0) + vector.x)} y2={Y((vector.fy ?? 0) + vector.y)} stroke={RED} strokeWidth="3" markerEnd={`url(#${id}v)`} />}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={X(p.x)} cy={Y(p.y)} r="5" fill={ORANGE} stroke={PAPER} strokeWidth="1.5" />
          {p.label && <T x={X(p.x) + 10} y={Y(p.y) - 10} size={12} fill={ORANGE}>{p.label}</T>}
        </g>
      ))}
    </svg>
  );
}

/** Bruch als Streifen */
export function FractionBar({ parts, filled, color = BLUE, rows = 1 }: { parts: number; filled: number; color?: string; rows?: number }) {
  const per = parts / rows, w = 300 / per, h = rows > 1 ? 40 : 56;
  return (
    <svg viewBox={`0 0 320 ${rows * (h + 8) + 12}`} className="h-auto w-full">
      {Array.from({ length: parts }, (_, i) => {
        const r = Math.floor(i / per), c = i % per;
        return <rect key={i} x={10 + c * w} y={10 + r * (h + 8)} width={w} height={h} fill={i < filled ? color : PAPER} stroke={INK} strokeWidth="2" />;
      })}
    </svg>
  );
}

/** Punktefeld (Reihen × Spalten) für Mal-Aufgaben */
export function DotArray({ rows, cols, color = RED, split }: { rows: number; cols: number; color?: string; split?: number }) {
  const g = 28, W = cols * g + 24, H = rows * g + 24;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full" style={{ maxWidth: `${Math.min(22, cols * 2.2 + 3)}rem` }}>
      <rect x="2" y="2" width={W - 4} height={H - 4} rx="10" fill={SOFT} />
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return <circle key={i} cx={12 + g / 2 + c * g} cy={12 + g / 2 + r * g} r={g * 0.34} fill={split !== undefined && r >= split ? BLUE : color} />;
      })}
    </svg>
  );
}

/** Zehnerblöcke: Hunderterplatten, Zehnerstangen, Einerwürfel */
export function TenBlocks({ h = 0, t = 0, o = 0 }: { h?: number; t?: number; o?: number }) {
  const parts: ReactNode[] = [];
  let x = 8;
  for (let i = 0; i < h; i++) {
    parts.push(<g key={'h' + i}>{Array.from({ length: 100 }, (_, k) => <rect key={k} x={x + (k % 10) * 7} y={20 + Math.floor(k / 10) * 7} width="7" height="7" fill={BLUE} stroke={PAPER} strokeWidth="0.8" />)}</g>);
    x += 78;
  }
  for (let i = 0; i < t; i++) {
    parts.push(<g key={'t' + i}>{Array.from({ length: 10 }, (_, k) => <rect key={k} x={x} y={20 + k * 7} width="7" height="7" fill={GREEN} stroke={PAPER} strokeWidth="0.8" />)}</g>);
    x += 11;
  }
  if (t) x += 6;
  for (let i = 0; i < o; i++) {
    parts.push(<rect key={'o' + i} x={x + (i % 2) * 10} y={76 - Math.floor(i / 2) * 10} width="8" height="8" fill={ORANGE} stroke={PAPER} strokeWidth="0.8" />);
  }
  if (o) x += 22;
  return <svg viewBox={`0 0 ${Math.max(120, x + 8)} 104`} className="mx-auto h-auto w-full max-w-xl">{parts}</svg>;
}

/** Balkenwaage: links Kästchen x und Gewichte, rechts Gewichte */
export function Balance({ left, right }: { left: { x: number; c: number }; right: { x: number; c: number } }) {
  const side = (cx: number, s: { x: number; c: number }) => {
    const items: ReactNode[] = [];
    const n = s.x + s.c;
    const gap = 4, w = Math.min(26, (150 - (n - 1) * gap) / Math.max(n, 1)), total = n * w + (n - 1) * gap;
    let x = cx - total / 2;
    for (let i = 0; i < s.x; i++, x += w + gap) items.push(<g key={'x' + i}><rect x={x} y={97 - w} width={w} height={w} rx="4" fill={PURPLE} /><T x={x + w / 2} y={97 - w / 2} size={Math.min(14, w * 0.55)} fill={WHITE}>x</T></g>);
    for (let i = 0; i < s.c; i++, x += w + gap) items.push(<g key={'c' + i}><circle cx={x + w / 2} cy={97 - w / 2} r={w * 0.46} fill={YELLOW} /><T x={x + w / 2} y={97 - w / 2} size={Math.min(12, w * 0.5)} fill={DARK}>1</T></g>);
    return items;
  };
  return (
    <svg viewBox="0 0 340 170" className="h-auto w-full">
      <path d="M170 104 L150 160 H190Z" fill={MUTED} />
      <rect x="20" y="98" width="300" height="7" rx="3" fill={INK} />
      <circle cx="170" cy="101" r="6" fill={YELLOW} />
      {side(90, left)}
      {side(250, right)}
    </svg>
  );
}

/** Lineal (cm) mit einem Stift darüber; Länge in cm (Dezimal möglich) */
export function Ruler({ len, max = 12 }: { len: number; max?: number }) {
  const s = 300 / max, x0 = 16;
  return (
    <svg viewBox="0 0 332 120" className="h-auto w-full">
      <rect x={x0} y="22" width={len * s} height="16" rx="4" fill={BLUE} />
      <path d={`M${x0 + len * s} 22 L${x0 + len * s + 14} 30 L${x0 + len * s} 38Z`} fill={YELLOW} />
      <rect x={x0 - 6} y="54" width={max * s + 12} height="50" rx="5" fill="#F7E3A1" stroke="#C9A646" strokeWidth="1.5" />
      {Array.from({ length: max * 10 + 1 }, (_, i) => (
        <line key={i} x1={x0 + (i * s) / 10} x2={x0 + (i * s) / 10} y1="54" y2={i % 10 === 0 ? 72 : i % 5 === 0 ? 66 : 61} stroke={DARK} strokeWidth={i % 10 === 0 ? 1.6 : 0.8} />
      ))}
      {Array.from({ length: max + 1 }, (_, i) => <T key={i} x={x0 + i * s} y={86} size={11} fill={DARK}>{i}</T>)}
      <T x={x0 + max * s - 8} y={98} size={9} fill={DARK}>cm</T>
      <line x1={x0} x2={x0} y1="38" y2="54" stroke={RED} strokeDasharray="3 3" />
    </svg>
  );
}

/** Thermometer in °C */
export function Thermometer({ t, min = -20, max = 40 }: { t: number; min?: number; max?: number }) {
  const y = (v: number) => 170 - ((v - min) / (max - min)) * 150;
  const marks = [];
  for (let v = min; v <= max; v += 5) marks.push(v);
  return (
    <svg viewBox="0 0 160 220" className="mx-auto h-auto w-full max-w-[12rem]">
      <rect x="62" y="14" width="22" height="170" rx="11" fill={PAPER} stroke={INK} strokeWidth="2" />
      <rect x="67" y={y(t)} width="12" height={188 - y(t)} fill={RED} />
      <circle cx="73" cy="196" r="17" fill={RED} stroke={INK} strokeWidth="2" />
      {marks.map((v) => (
        <g key={v}>
          <line x1="84" x2={v % 10 === 0 ? 98 : 92} y1={y(v)} y2={y(v)} stroke={INK} strokeWidth={v === 0 ? 2.5 : 1.3} />
          {v % 10 === 0 && <T x={104} y={y(v)} size={11} anchor="start">{v}</T>}
        </g>
      ))}
      <T x={36} y={20} size={12}>°C</T>
    </svg>
  );
}

/** Glücksrad mit farbigen Feldern */
export function Spinner({ sectors }: { sectors: string[] }) {
  const n = sectors.length, r = 80, c = 100;
  return (
    <svg viewBox="0 0 200 210" className="mx-auto h-auto w-full max-w-[15rem]">
      {sectors.map((col, i) => {
        const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
        return <path key={i} d={`M${c} ${c} L${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}Z`} fill={col} stroke={PAPER} strokeWidth="3" />;
      })}
      <circle cx={c} cy={c} r="8" fill={DARK} />
      <path d={`M${c} ${c} L${c + 8} ${c - 50} L${c} ${c - 58} L${c - 8} ${c - 50}Z`} fill={DARK} transform={`rotate(25 ${c} ${c})`} />
    </svg>
  );
}

/** Urne/Säckchen mit Kugeln */
export function Urn({ balls }: { balls: { color: string; n: number }[] }) {
  const all = balls.flatMap((b) => Array(b.n).fill(b.color) as string[]);
  const cols = Math.min(6, Math.ceil(Math.sqrt(all.length * 1.6)));
  return (
    <svg viewBox="0 0 220 190" className="mx-auto h-auto w-full max-w-xs">
      <path d="M40 40 H180 L170 170 C168 178 162 182 154 182 H66 C58 182 52 178 50 170Z" fill={SOFT} stroke={INK} strokeWidth="2.5" />
      <rect x="32" y="30" width="156" height="14" rx="6" fill={INK} opacity="0.85" />
      {all.map((col, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return <circle key={i} cx={110 - ((cols - 1) * 24) / 2 + c * 24} cy={160 - r * 24} r="10" fill={col} stroke={PAPER} strokeWidth="1.5" />;
      })}
    </svg>
  );
}

/** Würfel mit Augenzahl */
export function Die({ face }: { face: number }) {
  const P: Record<number, [number, number][]> = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]] };
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect x="8" y="8" width="84" height="84" rx="16" fill={WHITE} stroke={DARK} strokeWidth="3" />
      {(P[face] ?? []).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill={DARK} />)}
    </svg>
  );
}

/** Hunderterfeld für Prozente */
export function PercentGrid({ filled, color = GREEN }: { filled: number; color?: string }) {
  return (
    <svg viewBox="0 0 212 212" className="mx-auto h-auto w-full max-w-[14rem]">
      {Array.from({ length: 100 }, (_, i) => <rect key={i} x={6 + (i % 10) * 20} y={6 + Math.floor(i / 10) * 20} width="20" height="20" fill={i < filled ? color : PAPER} stroke={INK} strokeOpacity="0.5" strokeWidth="1" />)}
    </svg>
  );
}

/** Figurenfolge (Quadrat- oder Dreieckszahlen bzw. Streichholz-Reihe), Stufe 1–3 sichtbar, die 4. fragt. */
export function FigureSeq({ kind, show = 3 }: { kind: 'quadrat' | 'dreieck' | 'reihe'; show?: number }) {
  const g = 11;
  const fig = (n: number) => {
    const pts: [number, number][] = [];
    if (kind === 'quadrat') for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) pts.push([c, r]);
    else if (kind === 'dreieck') for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) pts.push([c + (n - 1 - r) / 2, r]);
    else for (let c = 0; c < 2 * n + 1; c++) pts.push([c, 0]);
    return pts;
  };
  let x = 8;
  const out: ReactNode[] = [];
  for (let n = 1; n <= show; n++) {
    const pts = fig(n);
    const w = Math.max(...pts.map((p) => p[0])) + 1;
    out.push(
      <g key={n}>
        {pts.map(([c, r], i) => <circle key={i} cx={x + c * g + g / 2} cy={84 - (kind === 'reihe' ? 0 : (n - 1 - r) * g) - g / 2} r={g * 0.4} fill={ser((n - 1))} />)}
        <T x={x + (w * g) / 2} y={100} size={11}>{n}</T>
      </g>
    );
    x += w * g + 18;
  }
  out.push(<g key="q"><rect x={x} y={44} width="40" height="40" rx="8" fill={YELLOW} /><T x={x + 20} y={64} size={20} fill={DARK}>?</T><T x={x + 20} y={100} size={11}>{show + 1}</T></g>);
  return <svg viewBox={`0 0 ${x + 50} 110`} className="mx-auto h-auto w-full max-w-lg">{out}</svg>;
}

/** Ebene Figuren: regelmäßiges Vieleck mit n Ecken, optional mit Symmetrieachsen */
export function Polygon({ n, color = BLUE, axes = false }: { n: number; color?: string; axes?: boolean }) {
  const c = 70, r = 58;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n + (n % 2 === 0 ? Math.PI / n : 0);
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  });
  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-auto w-full max-w-[11rem]">
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={color} fillOpacity="0.85" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {axes && Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / n + (n % 2 === 0 ? Math.PI / n : 0);
        return <line key={i} x1={c - 66 * Math.cos(a)} y1={c - 66 * Math.sin(a)} x2={c + 66 * Math.cos(a)} y2={c + 66 * Math.sin(a)} stroke={RED} strokeWidth="1.5" strokeDasharray="4 3" />;
      })}
    </svg>
  );
}

/** Preisschilder / Einkaufszettel: Gegenstände mit Preis */
export function PriceTags({ items }: { items: { name: string; price: string; obj?: ReactNode }[] }) {
  const w = 300 / items.length;
  return (
    <svg viewBox="0 0 320 120" className="h-auto w-full">
      {items.map((it, i) => (
        <g key={i} transform={`translate(${10 + i * w} 10)`}>
          <rect x="4" y="0" width={w - 8} height="100" rx="12" fill={SOFT} stroke={LINE} />
          <T x={w / 2} y={36} size={14}>{it.name}</T>
          <rect x={w / 2 - 34} y="58" width="68" height="28" rx="8" fill={YELLOW} />
          <T x={w / 2} y={72} size={14} fill={DARK}>{it.price}</T>
        </g>
      ))}
    </svg>
  );
}

/** Kreisdiagramm mit Anteilen (Summe = 1) */
export function PieChart({ parts, labels }: { parts: number[]; labels?: string[] }) {
  let a = -Math.PI / 2;
  const c = 90, r = 76;
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full">
      {parts.map((p, i) => {
        const a0 = a, a1 = a + p * 2 * Math.PI;
        a = a1;
        const large = p > 0.5 ? 1 : 0;
        return <path key={i} d={`M${c} ${c} L${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A${r} ${r} 0 ${large} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}Z`} fill={ser(i)} stroke={PAPER} strokeWidth="2" />;
      })}
      {labels?.map((l, i) => (
        <g key={l}>
          <rect x="186" y={28 + i * 28} width="16" height="16" rx="4" fill={ser(i)} />
          <T x={210} y={36 + i * 28} size={13} anchor="start">{l}</T>
        </g>
      ))}
    </svg>
  );
}

export const MATH_ART = {
  zahlenstrahl: NumberLine, saeulen: Bars, winkel: Angle, rechteck: RectFig, dreieck90: RightTriangle, kreisfig: CircleFig,
  koordinaten: Coord, bruchstreifen: FractionBar, punktfeld: DotArray, zehner: TenBlocks, waage: Balance, lineal: Ruler,
  thermometer: Thermometer, gluecksrad: Spinner, urne: Urn, wuerfel: Die, hunderterfeld: PercentGrid, figurenfolge: FigureSeq,
  vieleck: Polygon, preise: PriceTags, kreisdiagramm: PieChart
};
export { T as SvgText, Arrow as SvgArrow };
