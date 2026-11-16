import { useId, type ReactNode } from 'react';
import { BLUE, BLUE_L, BROWN, BROWN_D, DARK, FONT, GREEN, GREEN_D, GREY, GREY_D, GREY_L, INK, LEAF, LEAF_D, LINE, MUTED, ORANGE, PAPER, PINK, PURPLE, RED, RED_D, SOFT, WATER, WATER_L, WHITE, YELLOW, YELLOW_L, SKIN } from './palette';
import { OBJECTS } from './objects';

/* Naturwissenschaftliche Skizzen (Biologie, Physik, Chemie, Sachunterricht). */

const T = ({ x, y, children, size = 13, anchor = 'middle', fill = INK, weight = 700 }: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; weight?: number }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} fontFamily={FONT} dominantBaseline="middle">{children}</text>
);

/** Buchstaben-Marke mit Hinweislinie; die gefragte Marke ist gelb. */
export function Tag({ x, y, tx, ty, letter, on }: { x: number; y: number; tx: number; ty: number; letter: string; on?: boolean }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke={INK} strokeWidth="1.6" />
      <circle cx={x} cy={y} r="3" fill={INK} />
      <circle cx={tx} cy={ty} r="12" fill={on ? YELLOW : PAPER} stroke={INK} strokeWidth="1.8" />
      <T x={tx} y={ty + 0.5} size={12} fill={on ? DARK : INK}>{letter}</T>
    </g>
  );
}

const Obj = ({ name, x, y, s = 1 }: { name: string; x: number; y: number; s?: number }) => <g transform={`translate(${x} ${y}) scale(${s})`}>{OBJECTS[name]?.()}</g>;

/** Pflanze mit Blüte (A), Blatt (B), Stängel (C), Wurzel (D) */
export function Plant({ mark }: { mark?: string }) {
  return (
    <svg viewBox="0 0 300 260" className="mx-auto h-auto w-full max-w-sm">
      <rect x="0" y="170" width="300" height="90" fill={BROWN} opacity="0.35" />
      <path d="M150 170 C146 150 154 120 150 70" stroke={LEAF} strokeWidth="7" fill="none" />
      <path d="M150 126 C130 104 104 108 94 118 C110 132 132 134 150 126Z" fill={LEAF} />
      <path d="M150 140 C170 120 196 124 204 134 C190 148 168 148 150 140Z" fill={LEAF} />
      {[0, 60, 120, 180, 240, 300].map((d) => <ellipse key={d} cx="150" cy="38" rx="11" ry="18" fill={PINK} transform={`rotate(${d} 150 56)`} />)}
      <circle cx="150" cy="56" r="11" fill={YELLOW} />
      <path d="M150 170 C148 190 140 206 130 222 M150 170 C152 196 162 210 176 226 M150 172 V236 M140 200 L124 206 M158 204 L172 200" stroke={BROWN_D} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Tag x={164} y={44} tx={232} ty={30} letter="A" on={mark === 'A'} />
      <Tag x={104} y={118} tx={52} ty={100} letter="B" on={mark === 'B'} />
      <Tag x={151} y={156} tx={232} ty={160} letter="C" on={mark === 'C'} />
      <Tag x={136} y={214} tx={68} ty={226} letter="D" on={mark === 'D'} />
    </svg>
  );
}

/** Pflanzen- oder Tierzelle mit Beschriftungen */
export function Cell({ kind, mark }: { kind: 'pflanze' | 'tier'; mark?: string }) {
  const plant = kind === 'pflanze';
  return (
    <svg viewBox="0 0 320 220" className="mx-auto h-auto w-full max-w-md">
      {plant ? (
        <g>
          <rect x="70" y="30" width="180" height="160" rx="10" fill={GREEN} fillOpacity="0.25" stroke={GREEN_D} strokeWidth="7" />
          <rect x="78" y="38" width="164" height="144" rx="6" fill="#E9F7EF" stroke={GREEN} strokeWidth="2" />
          <rect x="150" y="60" width="80" height="90" rx="16" fill={WATER_L} stroke={WATER} strokeWidth="2" />
          {([[100, 60], [96, 150], [214, 168], [128, 168], [234, 48]] as [number, number][]).map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="11" ry="6" fill={LEAF} stroke={LEAF_D} strokeWidth="1.5" />)}
          <circle cx="112" cy="110" r="20" fill={PURPLE} fillOpacity="0.8" />
          <circle cx="116" cy="106" r="7" fill={PURPLE} />
        </g>
      ) : (
        <g>
          <path d="M80 70 C90 30 200 20 240 60 C276 96 260 170 210 186 C150 204 70 180 66 130 C64 108 72 90 80 70Z" fill="#FDE8E4" stroke={RED} strokeWidth="3" />
          <circle cx="160" cy="108" r="26" fill={PURPLE} fillOpacity="0.8" />
          <circle cx="164" cy="104" r="9" fill={PURPLE} />
          {([[110, 80], [214, 140], [118, 150]] as [number, number][]).map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx="16" ry="8" fill={ORANGE} /><path d={`M${x - 10} ${y} q5 -5 10 0 t10 0`} stroke={RED_D} fill="none" strokeWidth="1.5" /></g>)}
        </g>
      )}
      {plant ? (
        <>
          <Tag x={112} y={110} tx={30} ty={110} letter="A" on={mark === 'A'} />
          <Tag x={250} y={120} tx={292} ty={120} letter="B" on={mark === 'B'} />
          <Tag x={96} y={150} tx={30} ty={180} letter="C" on={mark === 'C'} />
          <Tag x={190} y={92} tx={292} ty={60} letter="D" on={mark === 'D'} />
        </>
      ) : (
        <>
          <Tag x={160} y={108} tx={160} ty={202} letter="A" on={mark === 'A'} />
          <Tag x={262} y={110} tx={300} ty={110} letter="B" on={mark === 'B'} />
          <Tag x={110} y={80} tx={34} ty={60} letter="C" on={mark === 'C'} />
        </>
      )}
    </svg>
  );
}

/** Körperumriss mit Organen: A Gehirn, B Lunge, C Herz, D Magen, E Leber, F Darm */
export function Body({ mark }: { mark?: string }) {
  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-sm">
      <circle cx="150" cy="44" r="30" fill={SKIN} />
      <path d="M150 48 C130 20 168 18 172 36 C178 50 160 60 150 48Z" fill={PINK} opacity="0.85" />
      <path d="M128 70 H172 L176 82 C206 86 214 100 216 130 L218 212 H200 L196 140 H192 L194 286 H158 L150 200 L142 286 H106 L108 140 H104 L100 212 H82 L84 130 C86 100 94 86 124 82Z" fill={SKIN} />
      <path d="M118 96 C104 104 104 150 120 152 C134 150 140 110 132 98Z M182 96 C196 104 196 150 180 152 C166 150 160 110 168 98Z" fill={PINK} opacity="0.9" />
      <path d="M150 116 C142 108 132 116 140 128 L152 140 L164 128 C172 116 160 106 150 116Z" fill={RED} />
      <path d="M152 160 C170 152 186 158 182 172 C178 184 158 182 152 174Z" fill={ORANGE} />
      <path d="M118 158 C130 150 150 152 150 164 C148 176 128 178 118 170Z" fill={BROWN} opacity="0.9" />
      <path d="M124 196 C124 186 176 186 176 196 C176 206 132 204 132 212 C132 220 170 218 170 226 C170 236 130 236 128 226" stroke={PINK} strokeWidth="7" fill="none" strokeLinecap="round" />
      <Tag x={164} y={36} tx={240} ty={30} letter="A" on={mark === 'A'} />
      <Tag x={110} y={120} tx={44} ty={100} letter="B" on={mark === 'B'} />
      <Tag x={156} y={122} tx={250} ty={96} letter="C" on={mark === 'C'} />
      <Tag x={176} y={168} tx={256} ty={160} letter="D" on={mark === 'D'} />
      <Tag x={124} y={164} tx={44} ty={172} letter="E" on={mark === 'E'} />
      <Tag x={168} y={222} tx={250} ty={228} letter="F" on={mark === 'F'} />
    </svg>
  );
}

/** Lebenszyklus (Frosch oder Schmetterling) im Kreis; `ask` = Stufe mit „?“ (0–3) */
export function LifeCycle({ kind, ask }: { kind: 'frosch' | 'schmetterling'; ask?: number }) {
  const id = useId();
  const stage = (i: number): ReactNode => {
    if (kind === 'frosch') {
      if (i === 0) return <g>{([[-10, -6], [6, -8], [-4, 8], [10, 6], [0, 0]] as [number, number][]).map(([x, y], k) => <g key={k}><circle cx={x} cy={y} r="7" fill={WATER_L} stroke={WATER} /><circle cx={x} cy={y} r="2.5" fill={DARK} /></g>)}</g>;
      if (i === 1) return <g><ellipse cx="-6" cy="0" rx="10" ry="8" fill={GREY_D} /><path d="M2 0 C12 -8 20 6 26 -4" stroke={GREY_D} strokeWidth="4" fill="none" /></g>;
      if (i === 2) return <g><ellipse cx="-4" cy="0" rx="14" ry="10" fill={GREEN} /><path d="M8 2 C16 0 20 8 24 4" stroke={GREEN} strokeWidth="3" fill="none" /><path d="M-12 8 L-18 16 M2 8 L6 16" stroke={GREEN_D} strokeWidth="3" /></g>;
      return <g transform="translate(-24 -24) scale(0.48)">{OBJECTS.frosch!()}</g>;
    }
    if (i === 0) return <g><path d="M-22 6 C-10 -14 14 -14 24 4Z" fill={LEAF} />{[-8, 0, 8].map((x) => <circle key={x} cx={x} cy="-2" r="3.5" fill={YELLOW_L} stroke={YELLOW} />)}</g>;
    if (i === 1) return <g transform="translate(-24 -30) scale(0.48)">{OBJECTS.raupe!()}</g>;
    if (i === 2) return <g><path d="M0 -24 V-16" stroke={BROWN_D} strokeWidth="2" /><path d="M0 -16 C12 -10 12 14 0 24 C-12 14 -12 -10 0 -16Z" fill={BROWN} /><path d="M-6 -4 H6 M-6 6 H6" stroke={BROWN_D} strokeWidth="1.5" /></g>;
    return <g transform="translate(-26 -24) scale(0.52)">{OBJECTS.schmetterling!()}</g>;
  };
  const pos = [[150, 46], [254, 130], [150, 214], [46, 130]];
  return (
    <svg viewBox="0 0 300 260" className="mx-auto h-auto w-full max-w-sm">
      <defs><marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={MUTED} /></marker></defs>
      {[0, 1, 2, 3].map((i) => {
        const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.42, a1 = -Math.PI / 2 + ((i + 1) * Math.PI) / 2 - 0.42;
        return <path key={i} d={`M${150 + 92 * Math.cos(a0)} ${130 + 84 * Math.sin(a0)} A92 84 0 0 1 ${150 + 92 * Math.cos(a1)} ${130 + 84 * Math.sin(a1)}`} fill="none" stroke={MUTED} strokeWidth="3" markerEnd={`url(#${id})`} />;
      })}
      {pos.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="36" fill={i === ask ? YELLOW : SOFT} stroke={LINE} strokeWidth="2" />
          {i === ask ? <T x={0} y={1} size={30} fill={DARK}>?</T> : stage(i)}
        </g>
      ))}
    </svg>
  );
}

/** Nahrungskette aus Bildern mit Pfeilen („frisst/wird gefressen“) – `ask` ersetzt ein Glied durch „?“ */
export function FoodChain({ chain, ask }: { chain: string[]; ask?: number }) {
  const id = useId();
  const n = chain.length, w = 320 / n;
  return (
    <svg viewBox="0 0 320 100" className="h-auto w-full">
      <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={INK} /></marker></defs>
      {chain.map((c, i) => (
        <g key={i}>
          <rect x={i * w + 6} y="14" width={w - 24} height={w - 24} rx="14" fill={i === ask ? YELLOW : SOFT} />
          {i === ask ? <T x={i * w + 6 + (w - 24) / 2} y={14 + (w - 24) / 2} size={28} fill={DARK}>?</T> : <Obj name={c} x={i * w + 10} y={18} s={(w - 32) / 100} />}
          {i < n - 1 && <line x1={i * w + w - 16} y1={14 + (w - 24) / 2} x2={i * w + w + 4} y2={14 + (w - 24) / 2} stroke={INK} strokeWidth="2.5" markerEnd={`url(#${id})`} />}
        </g>
      ))}
    </svg>
  );
}

/** Wasserkreislauf: A Verdunstung, B Kondensation (Wolke), C Niederschlag, D Abfluss/Versickerung */
export function WaterCycle({ mark }: { mark?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 340 230" className="mx-auto h-auto w-full max-w-md">
      <defs><marker id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={WATER} /></marker></defs>
      <rect x="0" y="0" width="340" height="230" rx="16" fill={SOFT} />
      <circle cx="300" cy="40" r="20" fill={YELLOW} />
      <path d="M0 180 L90 90 L150 150 L190 120 L240 180Z" fill={GREEN} />
      <path d="M78 102 L90 90 L102 102 L94 100 L90 104 L84 100Z" fill={WHITE} />
      <path d="M190 182 C230 172 260 176 340 170 V230 H0 V182Z" fill={WATER} />
      <path d="M60 42 C60 28 82 24 88 34 C96 22 120 26 120 40 C132 40 134 58 120 58 H64 C52 58 50 44 60 42Z" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      {[70, 86, 102].map((x) => <line key={x} x1={x} y1="66" x2={x - 6} y2="84" stroke={WATER} strokeWidth="3" strokeLinecap="round" />)}
      <path d="M270 168 C276 140 262 110 268 84" stroke={WATER} strokeWidth="3" strokeDasharray="5 5" fill="none" markerEnd={`url(#${id})`} />
      <path d="M240 70 C200 50 170 46 132 46" stroke={WATER} strokeWidth="3" fill="none" markerEnd={`url(#${id})`} />
      <path d="M150 156 C170 170 190 176 210 178" stroke={WATER} strokeWidth="3" fill="none" markerEnd={`url(#${id})`} />
      <Tag x={270} y={130} tx={312} ty={120} letter="A" on={mark === 'A'} />
      <Tag x={90} y={36} tx={30} ty={22} letter="B" on={mark === 'B'} />
      <Tag x={76} y={76} tx={26} ty={92} letter="C" on={mark === 'C'} />
      <Tag x={176} y={170} tx={170} ty={206} letter="D" on={mark === 'D'} />
    </svg>
  );
}

/** Teilchenmodell: fest, flüssig, gasförmig */
export function Particles({ state }: { state: 'fest' | 'fluessig' | 'gas' }) {
  const pts: [number, number][] = [];
  if (state === 'fest') for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) pts.push([42 + c * 22, 70 + r * 22]);
  else if (state === 'fluessig') {
    const seed = [3, 7, 1, 9, 4, 6, 2, 8, 5, 0];
    for (let i = 0; i < 26; i++) pts.push([34 + ((i * 23 + seed[i % 10]! * 3) % 132), 112 + Math.floor(i / 7) * 19 + (seed[(i + 3) % 10]! % 6)]);
  } else for (let i = 0; i < 9; i++) pts.push([[40, 120, 150, 70, 100, 160, 52, 130, 90][i]!, [60, 52, 120, 96, 150, 176, 168, 84, 186][i]!]);
  return (
    <svg viewBox="0 0 200 220" className="mx-auto h-auto w-full max-w-[13rem]">
      <path d="M20 30 V200 C20 206 24 210 30 210 H170 C176 210 180 206 180 200 V30" fill="none" stroke={INK} strokeWidth="3" />
      {state === 'fluessig' && <rect x="22" y="100" width="156" height="108" fill={WATER_L} opacity="0.5" />}
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="9" fill={BLUE} stroke={PAPER} strokeWidth="1.5" />)}
      {state === 'gas' && pts.map(([x, y], i) => <path key={'m' + i} d={`M${x + 12} ${y - 4} l10 -6`} stroke={MUTED} strokeWidth="2" strokeLinecap="round" />)}
    </svg>
  );
}

/** Stromkreis: Batterie, Schalter, eine oder zwei Lampen (Reihe/parallel) */
export function Circuit({ closed, lamps = 1, parallel = false, broken = false }: { closed: boolean; lamps?: 1 | 2; parallel?: boolean; broken?: boolean }) {
  const on = closed && !broken;
  const lamp = (x: number, y: number, isOn: boolean, k: string) => (
    <g key={k}>
      {isOn && <circle cx={x} cy={y} r="22" fill={YELLOW_L} opacity="0.7" />}
      <circle cx={x} cy={y} r="13" fill={isOn ? YELLOW : PAPER} stroke={INK} strokeWidth="2.5" />
      <path d={`M${x - 9} ${y - 9} L${x + 9} ${y + 9} M${x + 9} ${y - 9} L${x - 9} ${y + 9}`} stroke={INK} strokeWidth="2" />
    </g>
  );
  return (
    <svg viewBox="0 0 320 200" className="mx-auto h-auto w-full max-w-md">
      <g stroke={INK} strokeWidth="3" fill="none">
        <path d="M60 40 H130 M170 40 H260 V160 H170 M130 160 H60 V40" />
        {lamps === 2 && parallel && <path d="M200 40 V80 M200 120 V160" />}
      </g>
      <g>
        <line x1="138" y1="146" x2="138" y2="174" stroke={INK} strokeWidth="3" />
        <line x1="150" y1="152" x2="150" y2="168" stroke={INK} strokeWidth="6" />
        <line x1="130" y1="160" x2="138" y2="160" stroke={INK} strokeWidth="3" />
        <line x1="150" y1="160" x2="170" y2="160" stroke={INK} strokeWidth="3" />
        <T x={132} y={186} size={11}>+</T><T x={156} y={186} size={11}>−</T>
      </g>
      <circle cx="130" cy="40" r="4" fill={INK} />
      <circle cx="170" cy="40" r="4" fill={INK} />
      <line x1="130" y1="40" x2={closed ? 170 : 162} y2={closed ? 40 : 14} stroke={INK} strokeWidth="3" />
      {lamps === 1 && lamp(260, 100, on, 'l')}
      {lamps === 2 && !parallel && [lamp(260, 75, on, 'a'), lamp(260, 125, on, 'b')]}
      {lamps === 2 && parallel && [lamp(200, 100, on, 'a'), lamp(260, 100, on, 'b')]}
      {broken && <path d="M50 92 L70 108 M70 92 L50 108" stroke={RED} strokeWidth="4" />}
      {broken && <rect x="56" y="88" width="8" height="24" fill={PAPER} />}
    </svg>
  );
}

/** Zwei Stabmagnete mit Polen */
export function Magnets({ a, b }: { a: 'NS' | 'SN'; b: 'NS' | 'SN' }) {
  const mag = (x: number, o: 'NS' | 'SN') => (
    <g>
      <rect x={x} y="60" width="60" height="40" fill={o[0] === 'N' ? RED : BLUE} />
      <rect x={x + 60} y="60" width="60" height="40" fill={o[1] === 'N' ? RED : BLUE} />
      <T x={x + 30} y={80} size={20} fill={WHITE}>{o[0]}</T>
      <T x={x + 90} y={80} size={20} fill={WHITE}>{o[1]}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 320 160" className="h-auto w-full">
      {mag(14, a)}
      {mag(186, b)}
      <T x={160} y={80} size={22} fill={MUTED}>?</T>
    </svg>
  );
}

/** Wippe/Hebel: links Gewicht × Abstand, rechts Gewicht × Abstand (Abstand in Feldern 1–4) */
export function Lever({ l, ld, r, rd, ask }: { l: number; ld: number; r: number | '?'; rd: number; ask?: boolean }) {
  const X = (d: number) => 160 + d * 34;
  return (
    <svg viewBox="0 0 320 160" className="h-auto w-full">
      <path d="M160 112 L140 150 H180Z" fill={MUTED} />
      <rect x="16" y="104" width="288" height="8" rx="3" fill={INK} />
      {[-4, -3, -2, -1, 1, 2, 3, 4].map((d) => <line key={d} x1={X(d)} x2={X(d)} y1="112" y2="120" stroke={INK} strokeWidth="2" />)}
      <rect x={X(-ld) - 20} y={104 - 18 - l * 4} width="40" height={18 + l * 4} rx="4" fill={BLUE} />
      <T x={X(-ld)} y={104 - (18 + l * 4) / 2} size={13} fill={WHITE}>{l} kg</T>
      <rect x={X(rd) - 20} y={104 - 18 - (r === '?' ? 12 : r * 4)} width="40" height={18 + (r === '?' ? 12 : r * 4)} rx="4" fill={ask ? YELLOW : GREEN} />
      <T x={X(rd)} y={104 - (18 + (r === '?' ? 12 : r * 4)) / 2} size={13} fill={ask ? DARK : WHITE}>{r === '?' ? '?' : `${r} kg`}</T>
    </svg>
  );
}

/** Mondphasen: 0 Neumond, 1 zunehmend (Sichel rechts), 2 Halbmond zunehmend, 4 Vollmond, 6 abnehmender Halbmond */
export function MoonPhase({ phase }: { phase: 0 | 2 | 4 | 6 }) {
  const r = 60, c = 80;
  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-auto w-full max-w-[10rem]">
      <rect width="160" height="160" rx="20" fill={DARK} />
      <circle cx={c} cy={c} r={r} fill="#3D4560" />
      {phase === 4 && <circle cx={c} cy={c} r={r} fill={YELLOW_L} />}
      {phase === 2 && <path d={`M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r}Z`} fill={YELLOW_L} />}
      {phase === 6 && <path d={`M${c} ${c - r} A${r} ${r} 0 0 0 ${c} ${c + r}Z`} fill={YELLOW_L} />}
    </svg>
  );
}

/** Sonnensystem (Reihenfolge der Planeten); `ask` markiert einen Planeten mit „?“ */
export function SolarSystem({ ask }: { ask?: number }) {
  const P = [[4, GREY], [7, '#E8B66A'], [7.5, BLUE], [5.5, RED], [16, '#D9A066'], [14, '#E8D39A'], [10, '#8FD3E0'], [10, '#4A72D9']] as const;
  let x = 52;
  return (
    <svg viewBox="0 0 340 110" className="h-auto w-full">
      <rect width="340" height="110" rx="14" fill={DARK} />
      <circle cx="0" cy="55" r="44" fill={YELLOW} />
      {P.map(([r, col], i) => {
        const cx = x + r;
        x = cx + r + 12;
        return (
          <g key={i}>
            <circle cx={cx} cy={55} r={r} fill={col} />
            {i === 5 && <ellipse cx={cx} cy={55} rx={r + 8} ry="4" fill="none" stroke="#E8D39A" strokeWidth="2" />}
            {i === ask && <g><circle cx={cx} cy={55} r={r + 5} fill="none" stroke={YELLOW} strokeWidth="2.5" /><T x={cx} y={92} size={14} fill={YELLOW}>?</T></g>}
            {i !== ask && <T x={cx} y={92} size={10} fill="#C8CEDD">{i + 1}</T>}
          </g>
        );
      })}
    </svg>
  );
}

/** Atommodell nach Bohr: Kern mit Protonenzahl, Elektronen auf Schalen */
export function Atom({ z, showZ = false }: { z: number; showZ?: boolean }) {
  const shells: number[] = [];
  let rest = z;
  for (const cap of [2, 8, 8, 18]) { if (rest <= 0) break; shells.push(Math.min(cap, rest)); rest -= cap; }
  return (
    <svg viewBox="0 0 220 220" className="mx-auto h-auto w-full max-w-[14rem]">
      {shells.map((n, s) => {
        const r = 40 + s * 28;
        return (
          <g key={s}>
            <circle cx="110" cy="110" r={r} fill="none" stroke={LINE} strokeWidth="2" />
            {Array.from({ length: n }, (_, i) => {
              const a = (i / n) * 2 * Math.PI - Math.PI / 2 + s * 0.3;
              return <circle key={i} cx={110 + r * Math.cos(a)} cy={110 + r * Math.sin(a)} r="6" fill={BLUE} />;
            })}
          </g>
        );
      })}
      <circle cx="110" cy="110" r="22" fill={RED} />
      <T x={110} y={111} size={showZ ? 13 : 16} fill={WHITE}>{showZ ? `${z}+` : '+'}</T>
    </svg>
  );
}

const ATOM_COL: Record<string, string> = { H: '#E9ECF2', O: RED, C: '#3B4256', N: BLUE, Cl: GREEN, Na: PURPLE };
/** Kugel-Stab-Modell. Atome: [Symbol, x, y], Bindungen: [i, j, Ordnung] */
export function Molecule({ atoms, bonds }: { atoms: [string, number, number][]; bonds: [number, number, number?][] }) {
  return (
    <svg viewBox="0 0 240 160" className="mx-auto h-auto w-full max-w-sm">
      {bonds.map(([i, j, o = 1], k) => {
        const [, x1, y1] = atoms[i]!, [, x2, y2] = atoms[j]!;
        const dx = y2 - y1, dy = x1 - x2, len = Math.hypot(dx, dy) || 1, off = o > 1 ? 4 : 0;
        return (
          <g key={k} stroke={GREY_D} strokeWidth="4">
            {o === 1 ? <line x1={x1} y1={y1} x2={x2} y2={y2} /> : [-1, 1].map((sgn) => <line key={sgn} x1={x1 + (sgn * off * dx) / len} y1={y1 + (sgn * off * dy) / len} x2={x2 + (sgn * off * dx) / len} y2={y2 + (sgn * off * dy) / len} />)}
          </g>
        );
      })}
      {atoms.map(([s, x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={s === 'H' ? 13 : 20} fill={ATOM_COL[s] ?? GREY} stroke={GREY_D} strokeWidth="1.5" />
          <T x={x} y={y + 1} size={s === 'H' ? 11 : 14} fill={s === 'H' ? DARK : WHITE}>{s}</T>
        </g>
      ))}
    </svg>
  );
}

/** Laborgeräte */
export function LabTool({ tool }: { tool: 'becherglas' | 'erlenmeyer' | 'reagenzglas' | 'brenner' | 'messzylinder' | 'trichter' }) {
  const liquid = WATER_L;
  const body: Record<string, ReactNode> = {
    becherglas: <g><path d="M24 20 H76 V84 C76 88 74 90 70 90 H30 C26 90 24 88 24 84Z" fill={PAPER} stroke={INK} strokeWidth="3" /><path d="M26 54 H74 V84 C74 87 72 88 70 88 H30 C28 88 26 87 26 84Z" fill={liquid} /><path d="M20 20 H28" stroke={INK} strokeWidth="3" />{[40, 54, 68].map((y) => <line key={y} x1="60" x2="72" y1={y} y2={y} stroke={INK} strokeWidth="1.5" />)}</g>,
    erlenmeyer: <g><path d="M40 10 H60 V36 L84 86 C86 90 84 92 80 92 H20 C16 92 14 90 16 86 L40 36Z" fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" /><path d="M29 64 H71 L82 88 H18Z" fill={liquid} /></g>,
    reagenzglas: <g><path d="M40 8 V80 C40 92 60 92 60 80 V8" fill={PAPER} stroke={INK} strokeWidth="3" /><path d="M42 50 H58 V80 C58 88 42 88 42 80Z" fill={PINK} /><path d="M36 8 H64" stroke={INK} strokeWidth="3" /></g>,
    brenner: <g><path d="M50 8 C62 24 58 38 50 40 C42 38 38 24 50 8Z" fill={BLUE_L} /><path d="M50 18 C55 26 54 34 50 36 C46 34 45 26 50 18Z" fill={BLUE} /><rect x="44" y="40" width="12" height="40" fill={GREY} /><rect x="42" y="56" width="16" height="6" fill={GREY_D} /><path d="M26 92 H74 L66 80 H34Z" fill={GREY_D} /><path d="M58 84 H84" stroke={ORANGE} strokeWidth="4" /></g>,
    messzylinder: <g><path d="M38 10 H62 V84 H38Z" fill={PAPER} stroke={INK} strokeWidth="3" /><rect x="40" y="44" width="20" height="38" fill={liquid} /><path d="M26 88 H74 L70 94 H30Z" fill={INK} />{[20, 28, 36, 44, 52, 60, 68, 76].map((y, i) => <line key={y} x1="38" x2={i % 2 ? 46 : 52} y1={y} y2={y} stroke={INK} strokeWidth="1.3" />)}</g>,
    trichter: <g><path d="M14 16 H86 L56 56 V90 H44 V56Z" fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" /><path d="M26 28 H74 L56 50 H44Z" fill={liquid} /></g>
  };
  return <svg viewBox="0 0 100 100" className="h-full w-full">{body[tool]}</svg>;
}

/** pH-Skala 0–14 mit Zeiger */
export function PhScale({ value }: { value: number }) {
  const cols = ['#E2262A', '#EE4B2B', '#F4791F', '#F8A51B', '#F6D11A', '#C9DB2B', '#8CC63F', '#3BB54A', '#21A68D', '#1C9AD6', '#2E77BC', '#3A57A7', '#4D3A96', '#5E2C86', '#6A1F7A'];
  const x = (v: number) => 12 + v * 21;
  return (
    <svg viewBox="0 0 332 110" className="h-auto w-full">
      {cols.map((c, i) => <rect key={i} x={2 + i * 21.3} y="40" width="21.3" height="32" fill={c} />)}
      {cols.map((_, i) => <T key={'t' + i} x={12.6 + i * 21.3} y={86} size={10}>{i}</T>)}
      <path d={`M${x(value)} 38 L${x(value) - 9} 18 H${x(value) + 9}Z`} fill={INK} />
    </svg>
  );
}

/** DNA-Doppelhelix (Ausschnitt) mit Basenpaaren */
export function Dna({ ask }: { ask?: boolean }) {
  const pairs = ['A-T', 'G-C', 'T-A', 'C-G', 'A-T', 'G-C'];
  const col: Record<string, string> = { A: RED, T: YELLOW, G: GREEN, C: BLUE };
  return (
    <svg viewBox="0 0 320 150" className="h-auto w-full">
      <path d="M10 30 C60 30 60 120 110 120 S160 30 210 30 S260 120 310 120" fill="none" stroke={PURPLE} strokeWidth="5" />
      <path d="M10 120 C60 120 60 30 110 30 S160 120 210 120 S260 30 310 30" fill="none" stroke={PURPLE} strokeWidth="5" opacity="0.6" />
      {pairs.map((p, i) => {
        const x = 34 + i * 50;
        const [a, b] = p.split('-');
        const isAsk = ask && i === 3;
        return (
          <g key={i}>
            <rect x={x - 9} y="48" width="18" height="27" fill={col[a!]} />
            <rect x={x - 9} y="75" width="18" height="27" fill={isAsk ? PAPER : col[b!]} stroke={isAsk ? INK : 'none'} strokeDasharray="3 2" />
            <T x={x} y={61} size={11} fill={DARK}>{a}</T>
            <T x={x} y={89} size={11} fill={isAsk ? INK : DARK}>{isAsk ? '?' : b}</T>
          </g>
        );
      })}
    </svg>
  );
}

/** Kreuzungsschema (Punnett-Quadrat) */
export function Punnett({ p1, p2, ask }: { p1: string; p2: string; ask?: [number, number] }) {
  const cell = (r: number, c: number) => [p1[r] ?? '', p2[c] ?? ''].sort((x, y) => (x === x.toUpperCase() && y !== y.toUpperCase() ? -1 : x === y ? 0 : 1)).join('');
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-auto w-full max-w-[14rem]">
      {[0, 1].map((c) => <T key={'c' + c} x={90 + c * 60} y={32} size={18} fill={BLUE}>{p2[c]}</T>)}
      {[0, 1].map((r) => <T key={'r' + r} x={32} y={90 + r * 60} size={18} fill={RED}>{p1[r]}</T>)}
      {[0, 1].map((r) => [0, 1].map((c) => {
        const isAsk = ask && ask[0] === r && ask[1] === c;
        return (
          <g key={`${r}${c}`}>
            <rect x={60 + c * 60} y={60 + r * 60} width="60" height="60" fill={isAsk ? YELLOW : SOFT} stroke={INK} strokeWidth="2" />
            <T x={90 + c * 60} y={90 + r * 60} size={18} fill={isAsk ? DARK : INK}>{isAsk ? '?' : cell(r, c)}</T>
          </g>
        );
      }))}
    </svg>
  );
}

/** Welle mit Wellenlänge (A) und Amplitude (B) */
export function Wave({ mark, cycles = 2 }: { mark?: string; cycles?: number }) {
  const pts: string[] = [];
  for (let x = 0; x <= 280; x += 4) pts.push(`${20 + x},${90 - 50 * Math.sin((x / 280) * cycles * 2 * Math.PI)}`);
  const wl = 280 / cycles;
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full">
      <line x1="16" x2="304" y1="90" y2="90" stroke={LINE} strokeWidth="2" />
      <polyline points={pts.join(' ')} fill="none" stroke={BLUE} strokeWidth="3.5" />
      <path d={`M${20 + wl / 4} 26 H${20 + wl / 4 + wl}`} stroke={mark === 'A' ? ORANGE : INK} strokeWidth="2" />
      <path d={`M${20 + wl / 4} 20 V32 M${20 + wl / 4 + wl} 20 V32`} stroke={mark === 'A' ? ORANGE : INK} strokeWidth="2" />
      <T x={20 + wl / 4 + wl / 2} y={14} size={13} fill={mark === 'A' ? ORANGE : INK}>A</T>
      <path d={`M${20 + (3 * wl) / 4} 90 V140`} stroke={mark === 'B' ? ORANGE : INK} strokeWidth="2" strokeDasharray="4 3" />
      <T x={30 + (3 * wl) / 4} y={115} size={13} anchor="start" fill={mark === 'B' ? ORANGE : INK}>B</T>
    </svg>
  );
}

/** Weg-Zeit- bzw. Geschwindigkeit-Zeit-Diagramm mit Abschnitten */
export function MotionGraph({ kind, segs }: { kind: 's' | 'v'; segs: number[] }) {
  const n = segs.length;
  const pts: [number, number][] = [[0, kind === 's' ? 0 : 0]];
  let y = 0;
  segs.forEach((d, i) => { y = kind === 's' ? y + d : d; pts.push([i + 1, y]); });
  if (kind === 'v') { pts.length = 0; segs.forEach((d, i) => { pts.push([i, d]); pts.push([i + 1, d]); }); }
  const maxY = Math.max(4, ...pts.map((p) => p[1]));
  const X = (t: number) => 40 + (t / n) * 260, Y = (v: number) => 160 - (v / maxY) * 130;
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full">
      <line x1="40" y1="164" x2="40" y2="20" stroke={INK} strokeWidth="2" />
      <line x1="36" y1="160" x2="306" y2="160" stroke={INK} strokeWidth="2" />
      <T x={22} y={24} size={13}>{kind}</T>
      <T x={306} y={176} size={13}>t</T>
      <polyline points={pts.map(([t, v]) => `${X(t)},${Y(v)}`).join(' ')} fill="none" stroke={RED} strokeWidth="3.5" strokeLinejoin="round" />
      {segs.map((_, i) => <T key={i} x={X(i + 0.5)} y={176} size={12} fill={MUTED}>{String.fromCharCode(65 + i)}</T>)}
    </svg>
  );
}

/** Erdschichten: A Kruste, B Mantel, C äußerer Kern, D innerer Kern */
export function EarthLayers({ mark }: { mark?: string }) {
  return (
    <svg viewBox="0 0 300 220" className="mx-auto h-auto w-full max-w-sm">
      <path d="M150 110 L150 10 A100 100 0 1 1 50 110Z" fill={BROWN} />
      <path d="M150 110 L150 18 A92 92 0 1 1 58 110Z" fill={ORANGE} />
      <path d="M150 110 L150 58 A52 52 0 1 1 98 110Z" fill={YELLOW} />
      <path d="M150 110 L150 84 A26 26 0 1 1 124 110Z" fill={YELLOW_L} />
      <path d="M150 10 A100 100 0 0 0 50 110 L150 110Z" fill={GREEN} opacity="0.85" />
      <path d="M90 50 C110 40 120 60 140 48 L150 60 L150 110 L60 110 C60 90 70 64 90 50Z" fill={WATER} opacity="0.7" />
      <Tag x={234} y={58} tx={276} ty={36} letter="A" on={mark === 'A'} />
      <Tag x={222} y={140} tx={276} ty={150} letter="B" on={mark === 'B'} />
      <Tag x={180} y={150} tx={210} ty={204} letter="C" on={mark === 'C'} />
      <Tag x={156} y={118} tx={110} ty={196} letter="D" on={mark === 'D'} />
    </svg>
  );
}

/** Herz schematisch: A rechter Vorhof, B rechte Kammer, C linker Vorhof, D linke Kammer (Ansicht von vorn: rechts im Körper = links im Bild) */
export function Heart({ mark }: { mark?: string }) {
  return (
    <svg viewBox="0 0 300 230" className="mx-auto h-auto w-full max-w-sm">
      <path d="M150 210 C90 170 60 130 66 88 C70 56 100 44 124 56 L150 70 L176 56 C200 44 230 56 234 88 C240 130 210 170 150 210Z" fill="#F7C6C0" stroke={RED_D} strokeWidth="3" />
      <path d="M150 70 V200" stroke={RED_D} strokeWidth="3" />
      <path d="M72 108 H228" stroke={RED_D} strokeWidth="2.5" strokeDasharray="5 4" />
      <path d="M78 104 C80 76 100 64 120 70 L146 80 V104Z" fill={BLUE_L} />
      <path d="M78 112 H146 V196 C120 182 90 150 78 112Z" fill={BLUE} opacity="0.85" />
      <path d="M154 80 L180 70 C200 64 220 76 222 104 H154Z" fill="#F7A49A" />
      <path d="M154 112 H222 C210 150 180 182 154 196Z" fill={RED} />
      <path d="M120 56 V20 M180 56 C180 30 200 24 214 22" stroke={GREY} strokeWidth="10" fill="none" strokeLinecap="round" />
      <Tag x={110} y={88} tx={30} ty={70} letter="A" on={mark === 'A'} />
      <Tag x={112} y={150} tx={30} ty={170} letter="B" on={mark === 'B'} />
      <Tag x={190} y={88} tx={270} ty={70} letter="C" on={mark === 'C'} />
      <Tag x={188} y={150} tx={270} ty={170} letter="D" on={mark === 'D'} />
    </svg>
  );
}

/** Insekt vs. Spinne: Körperteile zählen */
export function BugBody({ kind }: { kind: 'insekt' | 'spinne' }) {
  const insect = kind === 'insekt';
  return (
    <svg viewBox="0 0 240 160" className="mx-auto h-auto w-full max-w-xs">
      <g stroke={DARK} strokeWidth="3" strokeLinecap="round" fill="none">
        {insect
          ? [-1, 1].map((s) => [96, 112, 128].map((x, i) => <path key={`${s}${x}`} d={`M${x} 80 L${x + (i - 1) * 14} ${80 + s * 40} L${x + (i - 1) * 22} ${80 + s * 56}`} />))
          : [-1, 1].map((s) => [124, 132, 140, 148].map((x, i) => <path key={`${s}${x}`} d={`M${x} 80 L${x + (i - 1.5) * 26} ${80 + s * 38} L${x + (i - 1.5) * 40} ${80 + s * 60}`} />))}
        {insect && <path d="M68 70 L50 40 M68 72 L44 56" />}
      </g>
      {insect ? (
        <g>
          <circle cx="70" cy="80" r="14" fill={DARK} />
          <ellipse cx="112" cy="80" rx="22" ry="16" fill={BROWN} />
          <ellipse cx="166" cy="80" rx="34" ry="20" fill={BROWN_D} />
        </g>
      ) : (
        <g>
          <ellipse cx="110" cy="80" rx="22" ry="18" fill={DARK} />
          <ellipse cx="168" cy="80" rx="34" ry="26" fill={GREY_D} />
        </g>
      )}
    </svg>
  );
}

export const SCIENCE_ART = {
  pflanze: Plant, zelle: Cell, koerper: Body, lebenszyklus: LifeCycle, nahrungskette: FoodChain, wasserkreislauf: WaterCycle,
  teilchen: Particles, stromkreis: Circuit, magnete: Magnets, hebel: Lever, mondphase: MoonPhase, sonnensystem: SolarSystem,
  atom: Atom, molekuel: Molecule, labor: LabTool, ph: PhScale, dna: Dna, punnett: Punnett, welle: Wave, bewegung: MotionGraph,
  erdschichten: EarthLayers, herz: Heart, gliederfuesser: BugBody
};
