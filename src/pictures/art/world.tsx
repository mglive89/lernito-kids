import { useId, type ReactNode } from 'react';
import { getLang } from '../../i18n';
import { BLUE, BLUE_L, BROWN, BROWN_D, DARK, FONT, GRASS, GREEN, GREEN_D, GREY, GREY_D, GREY_L, INK, LEAF, LEAF_D, LINE, MUTED, ORANGE, PAPER, PINK, PURPLE, RED, ser, SOFT, STONE, WATER, WATER_L, WHITE, YELLOW, YELLOW_L } from './palette';

/* Erdkunde, Geschichte und Religion/Ethik – eigene, vereinfachte Zeichnungen. */

const T = ({ x, y, children, size = 13, anchor = 'middle', fill = INK, weight = 700 }: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; weight?: number }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} fontFamily={FONT} dominantBaseline="middle">{children}</text>
);

/* ---------- Erdkunde ---------- */

/** Kompassrose mit Pfeil in eine von 8 Richtungen (0 = Norden, im Uhrzeigersinn). Beschriftet ist nur „N“. */
export function Compass({ dir }: { dir: number }) {
  const a = (dir * 45 * Math.PI) / 180;
  return (
    <svg viewBox="0 0 220 220" className="mx-auto h-auto w-full max-w-[14rem]">
      <circle cx="110" cy="110" r="96" fill={SOFT} stroke={INK} strokeWidth="3" />
      {Array.from({ length: 8 }, (_, i) => {
        const b = (i * 45 * Math.PI) / 180;
        return <line key={i} x1={110 + Math.sin(b) * 80} y1={110 - Math.cos(b) * 80} x2={110 + Math.sin(b) * 94} y2={110 - Math.cos(b) * 94} stroke={INK} strokeWidth={i % 2 ? 2 : 4} />;
      })}
      <T x={110} y={36} size={18}>N</T>
      <path d={`M${110 + Math.sin(a) * 70} ${110 - Math.cos(a) * 70} L${110 + Math.sin(a + 2.7) * 16} ${110 - Math.cos(a + 2.7) * 16} L${110 + Math.sin(a - 2.7) * 16} ${110 - Math.cos(a - 2.7) * 16}Z`} fill={RED} />
      <circle cx="110" cy="110" r="7" fill={INK} />
    </svg>
  );
}

/** Ausgedachte Landkarte mit Planquadraten A–D / 1–4. Orte: Stadt B2, See C3, Wald A4, Berge D1, Burg A1, Hafen D4, Brücke B3. */
export const MAP_PLACES = { stadt: 'B2', see: 'C3', wald: 'A4', berge: 'D1', burg: 'A1', hafen: 'D4', bruecke: 'B3' } as const;
export function FantasyMap({ mark }: { mark?: keyof typeof MAP_PLACES }) {
  const c = 70, x0 = 30, y0 = 30;
  const at = (cell: string): [number, number] => [x0 + ('ABCD'.indexOf(cell[0] ?? 'A') + 0.5) * c, y0 + (Number(cell[1]) - 0.5) * c];
  const P = (k: keyof typeof MAP_PLACES) => at(MAP_PLACES[k]);
  const [sx, sy] = P('stadt'), [lx, ly] = P('see'), [wx, wy] = P('wald'), [bx, by] = P('berge'), [cx, cy] = P('burg'), [hx, hy] = P('hafen'), [rx, ry] = P('bruecke');
  const ring = (k: keyof typeof MAP_PLACES) => { if (mark !== k) return null; const [x, y] = P(k); return <circle cx={x} cy={y} r="30" fill="none" stroke={RED} strokeWidth="3" strokeDasharray="6 4" />; };
  return (
    <svg viewBox="0 0 320 320" className="mx-auto h-auto w-full max-w-sm">
      <rect x={x0} y={y0} width={4 * c} height={4 * c} fill="#E6F2D9" />
      <path d={`M${x0 + 3.2 * c} ${y0 + 4 * c} C${x0 + 3.4 * c} ${y0 + 3.4 * c} ${x0 + 4 * c} ${y0 + 3.3 * c} ${x0 + 4 * c} ${y0 + 3.3 * c} V${y0 + 4 * c}Z`} fill={WATER} />
      <path d={`M${bx} ${by} C${bx - 40} ${by + 60} ${lx + 30} ${ly - 60} ${lx} ${ly} M${lx} ${ly} C${lx - 60} ${ly - 10} ${rx + 10} ${ry - 10} ${x0} ${y0 + 2.6 * c}`} stroke={WATER} strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx={lx} cy={ly} rx="26" ry="18" fill={WATER} />
      <path d={`M${sx} ${sy} L${rx} ${ry} L${hx} ${hy}`} stroke={GREY_D} strokeWidth="4" fill="none" strokeDasharray="1 0" />
      <rect x={rx - 9} y={ry - 7} width="18" height="14" fill={BROWN} />
      {([[-12, -8], [4, -12], [-4, 6], [10, 4]] as [number, number][]).map(([dx, dy], i) => <g key={i}><rect x={sx + dx - 6} y={sy + dy - 4} width="12" height="10" fill={RED} /><path d={`M${sx + dx - 8} ${sy + dy - 4} L${sx + dx} ${sy + dy - 11} L${sx + dx + 8} ${sy + dy - 4}Z`} fill={BROWN_D} /></g>)}
      {([[-14, -10], [8, -12], [-4, 8], [14, 6], [-16, 10]] as [number, number][]).map(([dx, dy], i) => <g key={i}><circle cx={wx + dx} cy={wy + dy - 4} r="9" fill={LEAF} /><rect x={wx + dx - 1.5} y={wy + dy + 3} width="3" height="6" fill={BROWN_D} /></g>)}
      {([[-14, 8], [6, 4], [16, 12]] as [number, number][]).map(([dx, dy], i) => <path key={i} d={`M${bx + dx - 16} ${by + dy + 8} L${bx + dx} ${by + dy - 18} L${bx + dx + 16} ${by + dy + 8}Z`} fill={GREY} stroke={GREY_D} strokeWidth="1.5" />)}
      <g><rect x={cx - 14} y={cy - 6} width="28" height="18" fill={STONE} /><rect x={cx - 18} y={cy - 16} width="10" height="28" fill={STONE} /><rect x={cx + 8} y={cy - 16} width="10" height="28" fill={STONE} /><path d={`M${cx - 18} ${cy - 16} h4 v-4 h2 v4 h4 M${cx + 8} ${cy - 16} h4 v-4 h2 v4 h4`} stroke={GREY_D} fill="none" /><rect x={cx - 4} y={cy + 2} width="8" height="10" fill={BROWN_D} /></g>
      <g><path d={`M${hx - 18} ${hy + 4} H${hx + 4} V${hy + 12} H${hx - 18}Z`} fill={BROWN} /><path d={`M${hx + 8} ${hy - 4} L${hx + 22} ${hy - 4} L${hx + 18} ${hy + 4} H${hx + 10}Z`} fill={RED} /><path d={`M${hx + 15} ${hy - 4} V${hy - 18} L${hx + 24} ${hy - 8}`} stroke={INK} strokeWidth="1.5" fill={WHITE} /></g>
      {(Object.keys(MAP_PLACES) as (keyof typeof MAP_PLACES)[]).map((k) => <g key={k}>{ring(k)}</g>)}
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><line x1={x0 + i * c} x2={x0 + i * c} y1={y0} y2={y0 + 4 * c} stroke={INK} strokeOpacity="0.35" /><line y1={y0 + i * c} y2={y0 + i * c} x1={x0} x2={x0 + 4 * c} stroke={INK} strokeOpacity="0.35" /></g>)}
      {'ABCD'.split('').map((l, i) => <T key={l} x={x0 + (i + 0.5) * c} y={16} size={14}>{l}</T>)}
      {[1, 2, 3, 4].map((n) => <T key={n} x={14} y={y0 + (n - 0.5) * c} size={14}>{n}</T>)}
      <g transform="translate(300 18)"><path d="M0 -12 L6 6 L0 2 L-6 6Z" fill={RED} /><T x={0} y={16} size={10}>N</T></g>
    </svg>
  );
}

/** Landschaftsformen */
export function Landform({ kind }: { kind: 'berg' | 'huegel' | 'ebene' | 'tal' | 'insel' | 'halbinsel' | 'vulkan' | 'golf' }) {
  const sky = <rect width="200" height="140" rx="14" fill={SOFT} />;
  const sea = (d: string) => <path d={d} fill={WATER} />;
  const body: Record<string, ReactNode> = {
    berg: <g><path d="M10 130 L80 26 L118 80 L136 56 L190 130Z" fill={GREY} /><path d="M80 26 L66 48 L76 44 L84 52 L94 42Z" fill={WHITE} /><path d="M136 56 L128 68 L140 66Z" fill={WHITE} /></g>,
    huegel: <g><path d="M0 130 C30 80 70 80 100 110 C130 80 170 84 200 120 V130Z" fill={GRASS} /><path d="M0 130 C40 110 90 110 200 130Z" fill={LEAF} /></g>,
    ebene: <g><rect x="0" y="92" width="200" height="38" fill={GRASS} />{[20, 60, 100, 140, 180].map((x) => <path key={x} d={`M${x - 14} 104 H${x + 14}`} stroke={LEAF} strokeWidth="3" />)}<circle cx="164" cy="34" r="14" fill={YELLOW} /></g>,
    tal: <g><path d="M0 130 V30 L60 50 L96 120 L104 120 L140 50 L200 30 V130Z" fill={GREEN} /><path d="M0 30 L60 50 L40 60Z M200 30 L140 50 L160 60Z" fill={GREEN_D} /><path d="M96 120 C98 110 102 110 104 120" stroke={WATER} strokeWidth="6" /></g>,
    insel: <g>{sea('M0 70 H200 V140 H0Z')}<path d="M60 84 C70 60 130 60 140 84Z" fill={STONE} /><path d="M72 80 C82 66 118 66 128 80Z" fill={LEAF} /><path d="M100 70 V40" stroke={BROWN} strokeWidth="4" /><path d="M100 40 C90 34 82 38 78 44 M100 40 C110 34 118 38 122 44 M100 40 C96 30 90 28 84 28" stroke={LEAF_D} strokeWidth="4" fill="none" /></g>,
    halbinsel: <g>{sea('M0 0 H200 V140 H0Z')}<path d="M0 0 H200 V40 C150 40 120 46 112 66 C104 100 96 124 84 124 C70 124 70 96 70 70 C70 50 40 40 0 40Z" fill={GRASS} /></g>,
    vulkan: <g><path d="M20 130 L84 46 H116 L180 130Z" fill={BROWN} /><path d="M84 46 C92 52 108 52 116 46" stroke={RED} strokeWidth="6" /><path d="M96 46 C90 30 100 22 94 8 M104 46 C112 30 102 20 110 10" stroke={GREY} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" /><path d="M100 50 L92 80 L100 76 L96 104" stroke={ORANGE} strokeWidth="5" fill="none" /></g>,
    golf: <g><rect width="200" height="140" fill={GRASS} />{sea('M0 140 H200 V140 C200 140 170 90 140 70 C120 56 80 56 60 70 C30 90 0 140 0 140Z')}</g>
  };
  return <svg viewBox="0 0 200 140" className="h-full w-full">{kind === 'halbinsel' || kind === 'golf' ? null : sky}{body[kind]}</svg>;
}

/** Erdkugel mit Gradnetz: A Nordpol, B Äquator, C Südpol, D Nullmeridian */
export function Globe({ mark }: { mark?: string }) {
  return (
    <svg viewBox="0 0 300 240" className="mx-auto h-auto w-full max-w-sm">
      <circle cx="150" cy="120" r="100" fill={WATER_L} stroke={WATER} strokeWidth="3" />
      <path d="M90 70 C110 50 140 60 150 80 C160 100 130 120 120 140 C108 160 86 130 80 110 C74 94 80 80 90 70Z M170 60 C200 54 230 80 220 110 C214 130 190 140 180 170 C170 190 160 160 166 130 C170 104 156 72 170 60Z" fill={GRASS} />
      <ellipse cx="150" cy="120" rx="100" ry="20" fill="none" stroke={RED} strokeWidth="2.5" />
      <ellipse cx="150" cy="120" rx="34" ry="100" fill="none" stroke={PURPLE} strokeWidth="2.5" />
      <ellipse cx="150" cy="80" rx="88" ry="16" fill="none" stroke={LINE} strokeWidth="1.5" />
      <ellipse cx="150" cy="160" rx="88" ry="16" fill="none" stroke={LINE} strokeWidth="1.5" />
      <circle cx="150" cy="20" r="4" fill={INK} />
      <circle cx="150" cy="220" r="4" fill={INK} />
      <Tag x={150} y={20} tx={224} ty={16} letter="A" on={mark === 'A'} />
      <Tag x={250} y={122} tx={282} ty={124} letter="B" on={mark === 'B'} />
      <Tag x={150} y={220} tx={224} ty={226} letter="C" on={mark === 'C'} />
      <Tag x={120} y={60} tx={40} ty={40} letter="D" on={mark === 'D'} />
    </svg>
  );
}

function Tag({ x, y, tx, ty, letter, on }: { x: number; y: number; tx: number; ty: number; letter: string; on?: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={INK} strokeWidth="1.6" />
      <circle cx={tx} cy={ty} r="12" fill={on ? YELLOW : PAPER} stroke={INK} strokeWidth="1.8" />
      <T x={tx} y={ty + 0.5} size={12} fill={on ? DARK : INK}>{letter}</T>
    </g>
  );
}

/** Bevölkerungsdiagramm: pyramide (viele Junge), glocke (stabil), urne (wenig Junge, viele Alte) */
export function PopPyramid({ shape }: { shape: 'pyramide' | 'glocke' | 'urne' }) {
  const W: Record<string, number[]> = { pyramide: [96, 86, 76, 66, 56, 46, 36, 26, 16, 8], glocke: [62, 62, 61, 60, 59, 57, 52, 42, 28, 12], urne: [36, 40, 46, 54, 62, 66, 64, 56, 42, 22] };
  return (
    <svg viewBox="0 0 260 190" className="mx-auto h-auto w-full max-w-sm">
      {W[shape]!.map((w, i) => {
        const y = 164 - i * 15;
        return <g key={i}><rect x={130 - w} y={y} width={w - 2} height="13" fill={BLUE} /><rect x={132} y={y} width={w - 2} height="13" fill={RED} /></g>;
      })}
      <line x1="130" x2="130" y1="10" y2="180" stroke={INK} strokeWidth="1.5" />
      <T x={20} y={170} size={10} anchor="start" fill={MUTED}>0</T>
      <T x={20} y={30} size={10} anchor="start" fill={MUTED}>90+</T>
      <T x={60} y={186} size={11} fill={BLUE}>♂</T>
      <T x={200} y={186} size={11} fill={RED}>♀</T>
    </svg>
  );
}

/** Kartenausschnitt mit Maßstab: zwei Orte, Abstand in cm auf der Karte */
export function ScaleMap({ cm, scale }: { cm: number; scale: string }) {
  const px = cm * 40;
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full">
      <rect width="320" height="150" rx="14" fill="#E6F2D9" />
      <circle cx="40" cy="60" r="9" fill={RED} />
      <circle cx={40 + px} cy="60" r="9" fill={BLUE} />
      <line x1="40" x2={40 + px} y1="60" y2="60" stroke={INK} strokeWidth="2" strokeDasharray="6 4" />
      <T x={40 + px / 2} y={44} size={14}>{`${String(cm).replace('.', ',')} cm`}</T>
      <rect x="12" y="104" width="296" height="34" rx="8" fill={PAPER} />
      <T x={160} y={121} size={15}>{scale}</T>
    </svg>
  );
}

/* ---------- Geschichte ---------- */

/** Zeitleiste mit Ereignissen; `ask` = Index, dessen Beschriftung durch „?“ ersetzt wird; `bands` = Epochenbänder */
export function Timeline({ from, to, events = [], ask, bands, markBand }: { from: number; to: number; events?: { y: number; label: string }[]; ask?: number; bands?: { from: number; to: number; label: string }[]; markBand?: number }) {
  const x0 = 20, x1 = 320;
  const X = (y: number) => x0 + ((y - from) / (to - from)) * (x1 - x0);
  const step = niceStep(to - from);
  const ticks: number[] = [];
  for (let y = Math.ceil(from / step) * step; y <= to; y += step) ticks.push(y);
  const yr = (y: number) => (y < 0 ? `${-y} ${getLang() === 'it' ? 'a.C.' : 'v. Chr.'}` : String(y));
  return (
    <svg viewBox="0 0 340 200" className="h-auto w-full">
      {bands?.map((b, i) => (
        <g key={i}>
          <rect x={X(b.from)} y={i % 2 ? 52 : 26} width={Math.max(4, X(b.to) - X(b.from))} height="24" rx="5" fill={i === markBand ? YELLOW : ser(i)} opacity={i === markBand ? 1 : 0.85} />
          <T x={X(b.from) + 4} y={(i % 2 ? 52 : 26) + 12} size={9} anchor="start" fill={i === markBand ? DARK : WHITE}>{i === markBand ? '?' : b.label}</T>
        </g>
      ))}
      <line x1={x0} x2={x1} y1="110" y2="110" stroke={INK} strokeWidth="3" />
      {ticks.map((t) => <g key={t}><line x1={X(t)} x2={X(t)} y1="104" y2="116" stroke={INK} strokeWidth="2" /><T x={X(t)} y={128} size={10} fill={MUTED}>{yr(t)}</T></g>)}
      {events.map((e, i) => {
        const up = i % 2 === 0;
        return (
          <g key={i}>
            <circle cx={X(e.y)} cy="110" r="6" fill={i === ask ? YELLOW : BLUE} stroke={PAPER} strokeWidth="2" />
            <line x1={X(e.y)} x2={X(e.y)} y1={up ? 104 : 116} y2={up ? 84 : 146} stroke={MUTED} strokeWidth="1.5" />
            <T x={Math.min(300, Math.max(40, X(e.y)))} y={up ? 76 : 156} size={11} fill={i === ask ? ORANGE : INK}>{i === ask ? '?' : e.label}</T>
            <T x={Math.min(300, Math.max(40, X(e.y)))} y={up ? 62 : 170} size={9} fill={MUTED}>{yr(e.y)}</T>
          </g>
        );
      })}
    </svg>
  );
}
function niceStep(span: number) {
  for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (span / s <= 8) return s;
  return 2000;
}

/** Bauwerke und Gegenstände aus der Geschichte */
export function History({ kind }: { kind: string }) {
  const B: Record<string, ReactNode> = {
    pyramide: <g><rect width="200" height="140" fill={YELLOW_L} opacity="0.5" /><path d="M30 120 L100 30 L170 120Z" fill="#E2C17B" /><path d="M100 30 L170 120 H120Z" fill="#C9A35A" />{[50, 70, 90, 110].map((y) => <line key={y} x1={100 - (y - 30) * 0.78} x2={100 + (y - 30) * 0.78} y1={y} y2={y} stroke="#B88F45" strokeWidth="1" />)}<rect y="120" width="200" height="20" fill="#E9D3A0" /></g>,
    tempel: <g><path d="M20 52 L100 18 L180 52Z" fill={STONE} /><rect x="24" y="52" width="152" height="10" fill={STONE} />{[34, 62, 90, 118, 146].map((x) => <rect key={x} x={x} y="62" width="18" height="56" fill="#E7DCC8" stroke={STONE} />)}<rect x="16" y="118" width="168" height="8" fill={STONE} /><rect x="10" y="126" width="180" height="8" fill="#B8A584" /></g>,
    aquaedukt: <g><rect width="200" height="140" fill={SOFT} /><rect x="6" y="30" width="188" height="16" fill={STONE} />{[0, 1, 2, 3].map((i) => <path key={i} d={`M${6 + i * 47} 46 H${53 + i * 47} V130 H${45 + i * 47} V78 C${45 + i * 47} 58 ${14 + i * 47} 58 ${14 + i * 47} 78 V130 H${6 + i * 47}Z`} fill="#D9C7A6" />)}<rect x="6" y="24" width="188" height="6" fill={WATER} /></g>,
    burg: <g><rect width="200" height="140" fill={SOFT} /><rect x="40" y="56" width="120" height="70" fill={STONE} /><rect x="24" y="30" width="34" height="96" fill="#B8A584" /><rect x="142" y="30" width="34" height="96" fill="#B8A584" />{[24, 36, 48, 142, 154, 166].map((x) => <rect key={x} x={x} y="22" width="8" height="10" fill="#B8A584" />)}{[44, 60, 76, 92, 108, 124, 140].map((x) => <rect key={x} x={x} y="48" width="10" height="10" fill={STONE} />)}<path d="M86 126 V96 C86 84 114 84 114 96 V126Z" fill={BROWN_D} /><path d="M41 30 V10 L56 16 L41 22" fill={RED} stroke={GREY_D} /><rect y="126" width="200" height="14" fill={GRASS} /></g>,
    hoehle: <g><rect width="200" height="140" rx="10" fill="#8C6A4E" /><path d="M14 130 C10 60 50 18 100 16 C150 18 190 60 186 130Z" fill="#D9B98F" /><g stroke="#8E3B22" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M60 70 C70 60 96 60 106 70 C110 80 98 86 80 84 C66 84 58 80 60 70Z" fill="#B5532F" /><path d="M66 82 L62 100 M76 84 L76 102 M94 84 L96 102 M102 80 L108 98 M106 68 L116 58 M110 62 L118 66" /><path d="M130 100 L150 74 M140 104 L156 84" /></g><path d="M150 74 L160 70 L154 80Z" fill="#8E3B22" /><circle cx="140" cy="54" r="7" fill="#8E3B22" opacity="0.6" /></g>,
    rundbogen: <g><rect width="200" height="140" fill={SOFT} /><path d="M40 136 V70 C40 20 160 20 160 70 V136 H134 V72 C134 40 66 40 66 72 V136Z" fill={STONE} /><rect x="66" y="72" width="68" height="64" fill={WATER_L} opacity="0.4" /></g>,
    spitzbogen: <g><rect width="200" height="140" fill={SOFT} /><path d="M40 136 V70 C40 40 70 14 100 6 C130 14 160 40 160 70 V136 H134 V72 C134 52 118 34 100 26 C82 34 66 52 66 72 V136Z" fill={STONE} /><path d="M66 72 C66 52 82 34 100 26 C118 34 134 52 134 72 V136 H66Z" fill={BLUE_L} opacity="0.5" /><circle cx="100" cy="64" r="14" fill="none" stroke={STONE} strokeWidth="4" /></g>,
    karavelle: <g><rect width="200" height="140" fill={SOFT} /><path d="M0 116 C30 106 60 126 100 116 C140 106 170 126 200 116 V140 H0Z" fill={WATER} /><path d="M30 92 H172 L158 118 H44Z" fill={BROWN} /><path d="M30 92 L22 80 H52 V92Z M150 92 V82 H176 L172 92Z" fill={BROWN_D} />{[70, 104, 140].map((x, i) => <g key={x}><line x1={x} x2={x} y1={i === 1 ? 16 : 30} y2="92" stroke={BROWN_D} strokeWidth="3" /><path d={`M${x} ${i === 1 ? 20 : 34} C${x + 22} ${i === 1 ? 34 : 44} ${x + 22} ${i === 1 ? 64 : 66} ${x} 80Z`} fill={WHITE} stroke={GREY_L} /><path d={`M${x + 4} ${i === 1 ? 44 : 52} h6 v6 h-6z`} fill={RED} /></g>)}</g>,
    dampflok: <g><rect width="200" height="140" fill={SOFT} /><rect x="40" y="60" width="90" height="40" rx="8" fill={DARK} /><rect x="120" y="40" width="50" height="60" rx="4" fill={RED} /><rect x="130" y="50" width="30" height="18" fill={WATER_L} /><rect x="56" y="34" width="16" height="26" fill={DARK} /><path d="M50 34 H78 L74 26 H54Z" fill={DARK} /><circle cx="60" cy="14" r="10" fill={GREY_L} /><circle cx="76" cy="8" r="7" fill={GREY_L} /><path d="M30 100 L40 80 V100Z" fill={DARK} />{[64, 100, 146].map((x) => <circle key={x} cx={x} cy="108" r="14" fill={GREY_D} stroke={DARK} strokeWidth="3" />)}<rect y="122" width="200" height="6" fill={BROWN} /></g>,
    rakete: <g><rect width="200" height="140" rx="10" fill={DARK} />{([[20, 20], [170, 30], [40, 100], [160, 110], [120, 16]] as [number, number][]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2" fill={WHITE} />)}<path d="M100 10 C120 30 120 70 116 100 H84 C80 70 80 30 100 10Z" fill={WHITE} /><circle cx="100" cy="52" r="9" fill={WATER} /><path d="M84 80 L68 108 H84Z M116 80 L132 108 H116Z" fill={RED} /><path d="M88 100 C92 126 108 126 112 100Z" fill={ORANGE} /></g>,
    amphore: <g><path d="M80 14 H120 V24 C150 34 150 90 112 128 H88 C50 90 50 34 80 24Z" fill="#C9673B" /><path d="M80 24 C64 24 60 44 72 52 M120 24 C136 24 140 44 128 52" stroke="#C9673B" strokeWidth="6" fill="none" /><path d="M64 60 H136 M68 86 H132" stroke={DARK} strokeWidth="5" /><path d="M84 64 L92 82 L100 64 L108 82 L116 64" stroke={DARK} strokeWidth="3" fill="none" /></g>,
    faustkeil: <g><path d="M100 10 C130 30 150 80 136 118 C126 132 74 132 64 118 C50 80 70 30 100 10Z" fill={GREY} /><path d="M100 10 L92 50 L110 78 L96 118 M80 40 L96 60 M120 50 L108 66 M78 94 L104 92" stroke={GREY_D} strokeWidth="2" fill="none" /></g>,
    ritterhelm: <g><path d="M60 120 V60 C60 26 140 26 140 60 V120Z" fill={GREY_L} stroke={GREY_D} strokeWidth="3" /><rect x="66" y="64" width="68" height="8" rx="3" fill={DARK} />{[84, 96, 108, 120].map((x) => <rect key={x} x={x - 6} y="82" width="4" height="22" rx="2" fill={DARK} />)}<path d="M100 26 C110 8 130 4 140 12 C124 14 112 22 104 30Z" fill={RED} /></g>,
    zeitung: <g><rect x="30" y="16" width="140" height="110" rx="4" fill={WHITE} stroke={GREY_L} strokeWidth="2" /><rect x="42" y="28" width="116" height="14" fill={DARK} />{[54, 62, 70, 78, 86, 94, 102, 110].map((y) => <line key={y} x1="42" x2={y % 16 ? 96 : 156} y1={y} y2={y} stroke={GREY} strokeWidth="3" />)}<rect x="104" y="52" width="52" height="40" fill={BLUE_L} /></g>
  };
  return <svg viewBox="0 0 200 140" className="h-full w-full">{B[kind] ?? null}</svg>;
}

/** Säulenordnungen: dorisch, ionisch, korinthisch (Kapitell) */
export function Column({ order }: { order: 'dorisch' | 'ionisch' | 'korinthisch' }) {
  return (
    <svg viewBox="0 0 120 200" className="h-full w-full">
      {order === 'dorisch' && <g><rect x="22" y="20" width="76" height="12" fill={STONE} /><path d="M30 32 H90 L82 44 H38Z" fill={STONE} /></g>}
      {order === 'ionisch' && <g><rect x="24" y="22" width="72" height="10" fill={STONE} /><path d="M20 32 H100 V40 H20Z" fill={STONE} /><circle cx="22" cy="42" r="12" fill="none" stroke={STONE} strokeWidth="6" /><circle cx="98" cy="42" r="12" fill="none" stroke={STONE} strokeWidth="6" /></g>}
      {order === 'korinthisch' && <g><rect x="20" y="14" width="80" height="10" fill={STONE} />{[0, 1, 2].map((r) => [32, 48, 64, 80].map((x) => <path key={`${r}${x}`} d={`M${x + r * 3 - 6} ${54 - r * 10} C${x - 10} ${40 - r * 10} ${x - 4} ${30 - r * 10} ${x} ${24 + 0 * r} C${x + 4} ${30 - r * 10} ${x + 10} ${40 - r * 10} ${x + 6 - r * 3} ${54 - r * 10}Z`} fill={LEAF} opacity={0.6 + r * 0.13} />))}</g>}
      <rect x="34" y={order === 'korinthisch' ? 54 : 44} width="52" height={order === 'korinthisch' ? 122 : 132} fill="#E7DCC8" stroke={STONE} />
      {[42, 52, 62, 72].map((x) => <line key={x} x1={x + 2} x2={x + 2} y1={order === 'korinthisch' ? 56 : 46} y2="174" stroke={STONE} strokeWidth="2" />)}
      {order !== 'dorisch' && <rect x="26" y="176" width="68" height="8" fill={STONE} />}
      <rect x="16" y="184" width="88" height="10" fill="#B8A584" />
    </svg>
  );
}

/** Ständepyramide des Mittelalters, `ask` = Stufe (0 oben … 3 unten) mit „?“ */
export function Estates({ ask, labels }: { ask?: number; labels: string[] }) {
  const rows: [number, number][] = [[130, 20], [100, 66], [70, 112], [40, 158]];
  return (
    <svg viewBox="0 0 260 210" className="mx-auto h-auto w-full max-w-sm">
      {rows.map(([x, y], i) => {
        return (
          <g key={i}>
            <path d={i === 0 ? `M130 ${y - 10} L${130 + 30} ${y + 36} H${130 - 30}Z` : `M${x} ${y + 36} L${x + 30} ${y} H${260 - x - 30} L${260 - x} ${y + 36}Z`} fill={i === ask ? YELLOW : [PURPLE, BLUE, GREEN, ORANGE][i] ?? BLUE} />
            <T x={130} y={y + (i === 0 ? 20 : 18)} size={i === 0 ? 10 : 12} fill={i === ask ? DARK : WHITE}>{i === ask ? '?' : labels[i]}</T>
          </g>
        );
      })}
    </svg>
  );
}

/** Sitzverteilung im Parlament (Halbkreis) für ausgedachte Parteien A–D */
export function Parliament({ seats }: { seats: number[] }) {
  const total = seats.reduce((a, b) => a + b, 0);
  const dots: string[] = [];
  seats.forEach((n, i) => { for (let k = 0; k < n; k++) dots.push(ser(i)); });
  const rowsN = 5, pos: [number, number][] = [];
  const radii = Array.from({ length: rowsN }, (_, r) => 60 + r * 16);
  const sum = radii.reduce((a, b) => a + b, 0);
  radii.forEach((r) => {
    const n = Math.round((total * r) / sum);
    for (let k = 0; k < n; k++) { const a = Math.PI - (k / Math.max(1, n - 1)) * Math.PI; pos.push([150 + r * Math.cos(a), 150 - r * Math.sin(a)]); }
  });
  pos.sort((p, q) => Math.atan2(150 - q[1], q[0] - 150) - Math.atan2(150 - p[1], p[0] - 150));
  return (
    <svg viewBox="0 0 300 200" className="h-auto w-full">
      {pos.slice(0, dots.length).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.5" fill={dots[i]} />)}
      {seats.map((n, i) => <g key={i}><rect x={20 + i * 70} y="168" width="14" height="14" rx="3" fill={ser(i)} /><T x={40 + i * 70} y={176} size={12} anchor="start">{`${String.fromCharCode(65 + i)}: ${n}`}</T></g>)}
    </svg>
  );
}

/* ---------- Religion und Ethik ---------- */

/** Religiöse Symbole (vereinfacht, respektvoll) */
export function Symbol({ kind }: { kind: 'kreuz' | 'davidstern' | 'halbmond' | 'rad' }) {
  const S: Record<string, ReactNode> = {
    kreuz: <path d="M42 10 H58 V36 H80 V52 H58 V92 H42 V52 H20 V36 H42Z" fill={BROWN} />,
    davidstern: <g fill="none" stroke={BLUE} strokeWidth="7" strokeLinejoin="round"><path d="M50 10 L86 72 H14Z" /><path d="M50 90 L14 28 H86Z" /></g>,
    halbmond: <g><path d="M60 14 C34 16 18 36 18 52 C18 72 36 90 60 88 C40 82 30 66 30 52 C30 36 42 20 60 14Z" fill={GREEN} /><path d="M70 36 L73 46 L84 46 L75 52 L78 62 L70 56 L62 62 L65 52 L56 46 L67 46Z" fill={GREEN} /></g>,
    rad: <g stroke={YELLOW} strokeWidth="5" fill="none"><circle cx="50" cy="50" r="36" /><circle cx="50" cy="50" r="8" fill={YELLOW} />{Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <line key={i} x1={50 + 8 * Math.cos(a)} y1={50 + 8 * Math.sin(a)} x2={50 + 44 * Math.cos(a)} y2={50 + 44 * Math.sin(a)} />; })}</g>
  };
  return <svg viewBox="0 0 100 100" className="h-full w-full">{S[kind]}</svg>;
}

/** Gotteshäuser (vereinfacht) */
export function Worship({ kind }: { kind: 'kirche' | 'moschee' | 'synagoge' | 'pagode' }) {
  const S: Record<string, ReactNode> = {
    kirche: <g><rect x="30" y="56" width="70" height="40" fill={STONE} /><path d="M24 58 L65 30 L106 58Z" fill={RED} /><rect x="100" y="30" width="30" height="66" fill={STONE} /><path d="M96 32 L115 4 L134 32Z" fill={RED} /><path d="M115 -8 V6 M110 -2 H120" stroke={DARK} strokeWidth="2.5" transform="translate(0 6)" /><path d="M56 96 V78 C56 70 74 70 74 78 V96Z" fill={BROWN_D} /><circle cx="115" cy="50" r="7" fill={WHITE} /></g>,
    moschee: <g><rect x="34" y="56" width="92" height="40" fill={WHITE} stroke={GREY_L} /><path d="M46 58 C46 30 114 30 114 58Z" fill={GREEN} /><path d="M80 34 V24" stroke={YELLOW} strokeWidth="2.5" /><circle cx="80" cy="22" r="3" fill={YELLOW} /><rect x="136" y="20" width="12" height="76" fill={WHITE} stroke={GREY_L} /><path d="M134 22 L142 4 L150 22Z" fill={GREEN} /><rect x="132" y="44" width="20" height="5" fill={GREY_L} /><path d="M70 96 V80 C70 70 90 70 90 80 V96Z" fill={GREEN} /></g>,
    synagoge: <g><rect x="30" y="40" width="100" height="56" fill={STONE} /><path d="M24 42 H136 L130 32 H30Z" fill={BROWN} /><g transform="translate(80 18)" fill="none" stroke={BLUE} strokeWidth="2.5"><path d="M0 -10 L9 6 H-9Z" /><path d="M0 10 L-9 -6 H9Z" /></g><path d="M66 96 V70 C66 60 94 60 94 70 V96Z" fill={BROWN_D} />{[42, 112].map((x) => <path key={x} d={`M${x} 80 V62 C${x} 56 ${x + 8} 56 ${x + 8} 62 V80Z`} fill={BLUE_L} />)}</g>,
    pagode: <g>{[0, 1, 2, 3].map((i) => <g key={i}><rect x={58 + i * 6} y={80 - i * 20} width={44 - i * 12} height="16" fill={RED} /><path d={`M${40 + i * 8} ${82 - i * 20} Q${80} ${70 - i * 20} ${120 - i * 8} ${82 - i * 20} L${110 - i * 8} ${78 - i * 20} H${50 + i * 8}Z`} fill={DARK} /></g>)}<path d="M80 10 V20" stroke={YELLOW} strokeWidth="3" /><rect x="40" y="96" width="80" height="6" fill={STONE} /></g>
  };
  return <svg viewBox="0 0 160 104" className="h-full w-full">{S[kind]}</svg>;
}

/** Feste: Adventskranz (lit = brennende Kerzen), Chanukka-Leuchter, Osterei, Laterne, Öllampe (Diwali), Tannenbaum, Fastenbrechen-Laterne */
export function Festival({ kind, lit = 0 }: { kind: 'advent' | 'chanukka' | 'osterei' | 'laterne' | 'diya' | 'tannenbaum' | 'ramadan'; lit?: number }) {
  const flame = (x: number, y: number, k: string) => <path key={k} d={`M${x} ${y - 12} C${x + 5} ${y - 6} ${x + 4} ${y} ${x} ${y} C${x - 4} ${y} ${x - 5} ${y - 6} ${x} ${y - 12}Z`} fill={ORANGE} />;
  const S: Record<string, ReactNode> = {
    advent: <g><ellipse cx="80" cy="78" rx="66" ry="18" fill={LEAF_D} /><ellipse cx="80" cy="74" rx="60" ry="14" fill={LEAF} />{([[34, 64], [66, 56], [100, 58], [128, 66]] as [number, number][]).map(([x, y], i) => <g key={i}><rect x={x - 6} y={y - 30} width="12" height="32" rx="2" fill={RED} />{i < lit && flame(x, y - 32, 'f' + i)}</g>)}{[44, 84, 116].map((x) => <circle key={x} cx={x} cy="84" r="4" fill={RED} />)}</g>,
    chanukka: <g><rect x="76" y="70" width="8" height="24" fill={YELLOW} /><rect x="56" y="92" width="48" height="6" rx="3" fill={YELLOW} /><rect x="12" y="64" width="136" height="6" rx="3" fill={YELLOW} />{Array.from({ length: 9 }, (_, i) => { const x = 16 + i * 16, mid = i === 4; return <g key={i}><rect x={x - 3} y={mid ? 38 : 48} width="6" height={mid ? 26 : 16} fill={BLUE_L} />{(mid || (i < 4 ? i < lit : i - 1 < lit)) && flame(x, mid ? 38 : 48, 'f' + i)}</g>; })}</g>,
    osterei: <g><ellipse cx="80" cy="56" rx="34" ry="44" fill={YELLOW_L} /><path d="M48 44 C60 36 70 52 80 44 C90 36 100 52 112 44" stroke={PURPLE} strokeWidth="5" fill="none" /><path d="M46 64 H114" stroke={GREEN} strokeWidth="6" />{[60, 80, 100].map((x) => <circle key={x} cx={x} cy="80" r="4" fill={RED} />)}</g>,
    laterne: <g><path d="M80 4 V16" stroke={BROWN_D} strokeWidth="3" /><path d="M40 4 C60 -2 100 -2 120 4" stroke={BROWN_D} strokeWidth="3" fill="none" /><rect x="50" y="16" width="60" height="8" rx="3" fill={DARK} /><path d="M50 24 H110 C120 50 120 70 110 90 H50 C40 70 40 50 50 24Z" fill={ORANGE} /><circle cx="80" cy="56" r="14" fill={YELLOW_L} /><path d="M80 44 L84 54 L94 56 L84 60 L80 70 L76 60 L66 56 L76 54Z" fill={YELLOW} /><rect x="50" y="90" width="60" height="8" rx="3" fill={DARK} /></g>,
    diya: <g><path d="M30 70 C40 96 120 96 130 70 C110 60 50 60 30 70Z" fill="#C9673B" /><path d="M30 70 C50 78 110 78 130 70" stroke={YELLOW} strokeWidth="4" fill="none" /><path d="M120 66 L134 56" stroke={DARK} strokeWidth="2" /><path d="M136 30 C148 44 146 56 136 58 C126 56 124 44 136 30Z" fill={ORANGE} /><path d="M136 42 C140 48 140 54 136 55 C132 54 132 48 136 42Z" fill={YELLOW_L} /></g>,
    tannenbaum: <g><path d="M80 6 L120 50 H100 L130 84 H30 L60 50 H40Z" fill={LEAF} /><rect x="72" y="84" width="16" height="14" fill={BROWN} />{([[66, 40], [96, 46], [58, 70], [100, 72], [80, 60]] as [number, number][]).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={[RED, YELLOW, BLUE][i % 3]} />)}<path d="M80 0 L83 8 L91 8 L85 13 L87 21 L80 16 L73 21 L75 13 L69 8 L77 8Z" fill={YELLOW} /></g>,
    ramadan: <g><path d="M60 8 C40 10 30 26 32 40 C34 54 48 64 62 62 C48 56 42 46 42 36 C42 24 50 14 60 8Z" fill={YELLOW} /><path d="M100 12 V22" stroke={DARK} strokeWidth="2" /><path d="M88 22 H112 L118 34 H82Z" fill={GREEN} /><path d="M84 34 H116 V74 H84Z" fill={YELLOW_L} stroke={GREEN} strokeWidth="3" /><path d="M100 40 C104 50 104 60 100 66 C96 60 96 50 100 40Z" fill={ORANGE} /><path d="M82 74 H118 L112 84 H88Z" fill={GREEN} /></g>
  };
  return <svg viewBox="0 0 160 104" className="h-full w-full">{S[kind]}</svg>;
}

/** Gesicht mit Gefühl */
export function Face({ mood }: { mood: 'froh' | 'traurig' | 'wuetend' | 'ueberrascht' | 'aengstlich' | 'muede' }) {
  const mouth: Record<string, ReactNode> = {
    froh: <path d="M34 62 Q50 78 66 62" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    traurig: <path d="M34 70 Q50 56 66 70" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />,
    wuetend: <path d="M36 68 H64" stroke={DARK} strokeWidth="4" strokeLinecap="round" />,
    ueberrascht: <ellipse cx="50" cy="66" rx="8" ry="10" fill={DARK} />,
    aengstlich: <path d="M34 68 Q40 62 46 68 T58 68 T66 66" stroke={DARK} strokeWidth="3.5" fill="none" strokeLinecap="round" />,
    muede: <path d="M40 66 Q50 70 60 66" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
  };
  const brows: Record<string, ReactNode> = {
    wuetend: <path d="M30 32 L44 38 M70 32 L56 38" stroke={DARK} strokeWidth="4" strokeLinecap="round" />,
    traurig: <path d="M30 38 L44 32 M70 38 L56 32" stroke={DARK} strokeWidth="3" strokeLinecap="round" />,
    ueberrascht: <path d="M30 28 Q37 22 44 28 M56 28 Q63 22 70 28" stroke={DARK} strokeWidth="3" fill="none" strokeLinecap="round" />,
    aengstlich: <path d="M30 34 Q37 28 44 32 M56 32 Q63 28 70 34" stroke={DARK} strokeWidth="3" fill="none" strokeLinecap="round" />
  };
  const eyes = mood === 'muede'
    ? <path d="M32 44 Q38 48 44 44 M56 44 Q62 48 68 44" stroke={DARK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    : <g><circle cx="38" cy="44" r={mood === 'ueberrascht' ? 6 : 5} fill={DARK} /><circle cx="62" cy="44" r={mood === 'ueberrascht' ? 6 : 5} fill={DARK} /></g>;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <circle cx="50" cy="52" r="42" fill={mood === 'wuetend' ? '#F6A48F' : YELLOW_L} />
      {brows[mood]}
      {eyes}
      {mood === 'traurig' && <path d="M66 52 C70 60 64 62 64 56Z" fill={WATER} />}
      {mood === 'froh' && <g><circle cx="28" cy="60" r="5" fill={PINK} opacity="0.6" /><circle cx="72" cy="60" r="5" fill={PINK} opacity="0.6" /></g>}
      {mouth[mood]}
    </svg>
  );
}

/** Gedankenexperimente und Gleichnisse der Ethik */
export function Ethics({ kind }: { kind: 'hoehle' | 'weiche' | 'waage' | 'schleier' }) {
  const id = useId();
  const person = (x: number, y: number, c: string, k: string) => <g key={k}><circle cx={x} cy={y - 18} r="7" fill={c} /><rect x={x - 6} y={y - 11} width="12" height="18" rx="5" fill={c} /></g>;
  const S: Record<string, ReactNode> = {
    hoehle: <g><rect width="320" height="170" rx="14" fill="#5A4636" /><path d="M0 150 H320 V170 H0Z" fill="#3E3026" /><rect x="236" y="30" width="70" height="120" fill="#F7E3A1" opacity="0.8" /><path d="M150 140 C156 120 166 120 172 140Z" fill={ORANGE} /><path d="M158 132 C160 118 164 118 166 132Z" fill={YELLOW} /><rect x="110" y="110" width="110" height="8" fill="#3E3026" />{[40, 64, 88].map((x, i) => person(x, 150, GREY, 'p' + i))}<path d="M22 40 h40 v50 h-40z M76 50 h30 v40 h-30z" fill="#2A2019" opacity="0.8" /><circle cx="42" cy="34" r="8" fill="#2A2019" opacity="0.8" /></g>,
    weiche: <g><rect width="320" height="170" rx="14" fill="#E6F2D9" /><defs><marker id={id} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={RED} /></marker></defs><path d="M10 120 H150 L300 120 M150 120 L300 50" stroke={GREY_D} strokeWidth="6" fill="none" /><rect x="20" y="104" width="44" height="22" rx="4" fill={RED} /><path d="M70 115 H110" stroke={RED} strokeWidth="3" markerEnd={`url(#${id})`} />{[230, 248, 266, 284, 300].map((x, i) => person(x, 116, BLUE, 'a' + i))}{person(250, 70, PURPLE, 'b')}<rect x="140" y="128" width="8" height="24" fill={GREY_D} /><circle cx="144" cy="128" r="6" fill={YELLOW} /></g>,
    waage: <g><rect width="320" height="170" rx="14" fill={SOFT} /><rect x="156" y="30" width="8" height="120" fill={YELLOW} /><rect x="120" y="148" width="80" height="10" rx="4" fill={YELLOW} /><path d="M70 40 H250" stroke={YELLOW} strokeWidth="6" /><path d="M80 40 L50 100 H110Z M240 40 L210 100 H270Z" stroke={GREY_D} strokeWidth="1.5" fill="none" /><path d="M46 100 H114 C110 114 50 114 46 100Z M206 100 H274 C270 114 210 114 206 100Z" fill={YELLOW} /></g>,
    schleier: <g><rect width="320" height="170" rx="14" fill={SOFT} />{[60, 120, 180, 240].map((x, i) => <g key={x}>{person(x, 140, ser(i), 'p' + i)}<rect x={x - 14} y="96" width="28" height="20" rx="4" fill={GREY_L} opacity="0.95" /></g>)}<path d="M20 70 C80 40 240 40 300 70 L300 90 C240 64 80 64 20 90Z" fill={GREY} opacity="0.5" /></g>
  };
  return <svg viewBox="0 0 320 170" className="h-auto w-full">{S[kind]}</svg>;
}

export const WORLD_ART = {
  kompass: Compass, karte: FantasyMap, landschaft: Landform, globus: Globe, bevoelkerung: PopPyramid, massstab: ScaleMap,
  zeitleiste: Timeline, geschichte: History, saeule: Column, staende: Estates, parlament: Parliament,
  symbol: Symbol, gotteshaus: Worship, fest: Festival, gesicht: Face, ethik: Ethics
};
