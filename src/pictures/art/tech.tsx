import { useId, type ReactNode } from 'react';
import { getLang } from '../../i18n';
import { BLUE, BLUE_D, BLUE_L, DARK, FONT, GREEN, GREEN_D, GREY, GREY_D, GREY_L, INK, LINE, MUTED, ORANGE, PAPER, PURPLE, RED, SOFT, WATER_L, WHITE, YELLOW, YELLOW_L } from './palette';

/* Informatik und Programmieren */

const T = ({ x, y, children, size = 13, anchor = 'middle', fill = INK, weight = 700, mono = false }: { x: number; y: number; children: ReactNode; size?: number; anchor?: 'start' | 'middle' | 'end'; fill?: string; weight?: number; mono?: boolean }) => (
  <text x={x} y={y} fontSize={size} fontWeight={weight} textAnchor={anchor} fill={fill} fontFamily={mono ? 'ui-monospace, Menlo, monospace' : FONT} dominantBaseline="middle">{children}</text>
);

/** Geräte (Eingabe/Ausgabe/Speicher/Netz) */
export const DEVICES: Record<string, () => ReactNode> = {
  monitor: () => <g><rect x="10" y="14" width="80" height="54" rx="5" fill={DARK} /><rect x="15" y="19" width="70" height="44" rx="2" fill={BLUE_L} /><rect x="44" y="68" width="12" height="12" fill={GREY} /><rect x="30" y="80" width="40" height="6" rx="3" fill={GREY_D} /></g>,
  tastatur: () => <g><rect x="6" y="30" width="88" height="40" rx="6" fill={GREY_D} />{Array.from({ length: 24 }, (_, i) => <rect key={i} x={11 + (i % 8) * 10.4} y={35 + Math.floor(i / 8) * 9.5} width="8" height="7" rx="1.5" fill={GREY_L} />)}<rect x="30" y="62" width="40" height="5" rx="1.5" fill={GREY_L} /></g>,
  maus: () => <g><path d="M50 18 C70 18 76 36 76 56 C76 76 64 88 50 88 C36 88 24 76 24 56 C24 36 30 18 50 18Z" fill={GREY_L} stroke={GREY_D} strokeWidth="3" /><path d="M50 18 V44 M24 44 H76" stroke={GREY_D} strokeWidth="3" /><rect x="47" y="26" width="6" height="12" rx="3" fill={GREY_D} /><path d="M50 18 C50 10 56 6 62 4" stroke={GREY_D} strokeWidth="3" fill="none" /></g>,
  drucker: () => <g><rect x="28" y="10" width="44" height="26" fill={WHITE} stroke={GREY_L} strokeWidth="2" /><rect x="10" y="34" width="80" height="36" rx="6" fill={GREY_D} /><rect x="26" y="62" width="48" height="28" fill={WHITE} stroke={GREY_L} strokeWidth="2" />{[70, 76, 82].map((y) => <line key={y} x1="32" x2="68" y1={y} y2={y} stroke={GREY} strokeWidth="2" />)}<circle cx="78" cy="44" r="3" fill={GREEN} /></g>,
  lautsprecher: () => <g><rect x="28" y="10" width="44" height="80" rx="8" fill={DARK} /><circle cx="50" cy="62" r="16" fill={GREY_D} /><circle cx="50" cy="62" r="6" fill={GREY} /><circle cx="50" cy="28" r="8" fill={GREY_D} /></g>,
  kopfhoerer: () => <g><path d="M20 60 V48 C20 24 80 24 80 48 V60" stroke={DARK} strokeWidth="7" fill="none" /><rect x="12" y="54" width="20" height="30" rx="8" fill={BLUE} /><rect x="68" y="54" width="20" height="30" rx="8" fill={BLUE} /></g>,
  mikrofon: () => <g><rect x="38" y="10" width="24" height="44" rx="12" fill={GREY_D} />{[22, 30, 38].map((y) => <line key={y} x1="40" x2="60" y1={y} y2={y} stroke={GREY} strokeWidth="2" />)}<path d="M30 44 C30 66 70 66 70 44" stroke={DARK} strokeWidth="4" fill="none" /><path d="M50 62 V82 M36 84 H64" stroke={DARK} strokeWidth="4" strokeLinecap="round" /></g>,
  webcam: () => <g><circle cx="50" cy="42" r="28" fill={DARK} /><circle cx="50" cy="42" r="14" fill={BLUE_D} /><circle cx="50" cy="42" r="6" fill={BLUE_L} /><circle cx="70" cy="22" r="3" fill={GREEN} /><path d="M40 70 L34 86 H66 L60 70Z" fill={GREY_D} /></g>,
  usbstick: () => <g><rect x="30" y="30" width="40" height="58" rx="6" fill={BLUE} /><rect x="38" y="10" width="24" height="22" fill={GREY_L} stroke={GREY} strokeWidth="2" /><rect x="43" y="16" width="5" height="5" fill={GREY_D} /><rect x="52" y="16" width="5" height="5" fill={GREY_D} /></g>,
  router: () => <g><rect x="10" y="50" width="80" height="26" rx="6" fill={DARK} />{[22, 32, 42].map((x) => <circle key={x} cx={x} cy="63" r="3" fill={GREEN} />)}<path d="M26 50 L18 20 M74 50 L82 20" stroke={DARK} strokeWidth="4" strokeLinecap="round" /><path d="M42 30 C46 24 54 24 58 30 M36 24 C44 14 56 14 64 24" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" /></g>,
  cpu: () => <g>{Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={24 + i * 10} y="8" width="4" height="14" fill={GREY} /><rect x={24 + i * 10} y="78" width="4" height="14" fill={GREY} /><rect x="8" y={24 + i * 10} width="14" height="4" fill={GREY} /><rect x="78" y={24 + i * 10} width="14" height="4" fill={GREY} /></g>)}<rect x="20" y="20" width="60" height="60" rx="5" fill={GREEN_D} /><rect x="32" y="32" width="36" height="36" rx="3" fill={GREY_L} /><T x={50} y={51} size={12} fill={DARK}>CPU</T></g>,
  ram: () => <g><rect x="6" y="30" width="88" height="34" rx="3" fill={GREEN} />{[12, 30, 48, 66].map((x) => <rect key={x} x={x} y="36" width="14" height="16" rx="1" fill={DARK} />)}{Array.from({ length: 20 }, (_, i) => <rect key={i} x={8 + i * 4.3} y="64" width="2.6" height="7" fill={YELLOW} />)}</g>,
  festplatte: () => <g><rect x="16" y="12" width="68" height="78" rx="6" fill={GREY_L} stroke={GREY_D} strokeWidth="2" /><circle cx="50" cy="44" r="24" fill={GREY} /><circle cx="50" cy="44" r="5" fill={GREY_D} /><path d="M70 76 L56 48" stroke={DARK} strokeWidth="4" strokeLinecap="round" /></g>,
  smartphone: () => <g><rect x="28" y="6" width="44" height="88" rx="8" fill={DARK} /><rect x="32" y="14" width="36" height="66" rx="2" fill={BLUE_L} /><circle cx="50" cy="87" r="3" fill={GREY} /></g>
};
export function Device({ kind }: { kind: string }) {
  return <svg viewBox="0 0 100 100" className="h-full w-full">{DEVICES[kind]?.()}</svg>;
}

/** Glühlampen als Bits (an = 1) mit Stellenwerten */
export function BitLamps({ bits, showValues = true }: { bits: string; showValues?: boolean }) {
  const n = bits.length, w = Math.min(60, 320 / n);
  return (
    <svg viewBox={`0 0 ${n * w + 20} 130`} className="mx-auto h-auto w-full max-w-lg">
      {bits.split('').map((b, i) => {
        const x = 10 + i * w + w / 2, on = b === '1';
        return (
          <g key={i}>
            {on && <circle cx={x} cy="44" r={w * 0.42} fill={YELLOW_L} opacity="0.6" />}
            <circle cx={x} cy="44" r={w * 0.28} fill={on ? YELLOW : GREY_L} stroke={INK} strokeWidth="2" />
            <rect x={x - w * 0.14} y={44 + w * 0.26} width={w * 0.28} height="10" fill={GREY} />
            <T x={x} y={92} size={18}>{b}</T>
            {showValues && <T x={x} y={116} size={11} fill={MUTED}>{2 ** (n - 1 - i)}</T>}
          </g>
        );
      })}
    </svg>
  );
}

/** Logikgatter mit Eingängen (0/1) */
export function Gate({ type, a, b }: { type: 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND'; a: number; b?: number }) {
  const one = type === 'NOT';
  const body: Record<string, ReactNode> = {
    AND: <path d="M110 40 H160 C200 40 200 120 160 120 H110Z" />,
    NAND: <g><path d="M110 40 H160 C200 40 200 120 160 120 H110Z" /><circle cx="196" cy="80" r="7" /></g>,
    OR: <path d="M104 40 C150 40 180 50 200 80 C180 110 150 120 104 120 C124 100 124 60 104 40Z" />,
    XOR: <g><path d="M112 40 C158 40 188 50 208 80 C188 110 158 120 112 120 C132 100 132 60 112 40Z" /><path d="M100 40 C120 60 120 100 100 120" fill="none" /></g>,
    NOT: <g><path d="M112 44 L186 80 L112 116Z" /><circle cx="193" cy="80" r="7" /></g>
  };
  const pin = (y: number, v: number, k: string) => (
    <g key={k}>
      <line x1="40" x2="116" y1={y} y2={y} stroke={v ? ORANGE : INK} strokeWidth="4" />
      <rect x="10" y={y - 14} width="30" height="28" rx="6" fill={v ? ORANGE : PAPER} stroke={INK} strokeWidth="2" />
      <T x={25} y={y + 1} size={15} fill={v ? WHITE : INK}>{v}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 320 160" className="h-auto w-full">
      {one ? pin(80, a, 'a') : [pin(58, a, 'a'), pin(102, b ?? 0, 'b')]}
      <g fill={SOFT} stroke={INK} strokeWidth="3">{body[type]}</g>
      <T x={152} y={81} size={14}>{type === 'NAND' ? '' : type}</T>
      <line x1={type === 'NOT' || type === 'NAND' ? 200 : 208} x2="276" y1="80" y2="80" stroke={INK} strokeWidth="4" />
      <rect x="276" y="64" width="34" height="32" rx="6" fill={YELLOW} />
      <T x={293} y={81} size={18} fill={DARK}>?</T>
    </svg>
  );
}

/** Caesar-Scheibe: äußerer Ring Klartext, innerer Ring um `shift` verschoben */
export function CaesarWheel({ shift }: { shift: number }) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return (
    <svg viewBox="0 0 240 240" className="mx-auto h-auto w-full max-w-[16rem]">
      <circle cx="120" cy="120" r="114" fill={SOFT} stroke={INK} strokeWidth="2" />
      <circle cx="120" cy="120" r="84" fill={YELLOW_L} stroke={INK} strokeWidth="2" />
      <circle cx="120" cy="120" r="56" fill={PAPER} stroke={INK} strokeWidth="2" />
      {A.split('').map((ch, i) => {
        const a = (i / 26) * 2 * Math.PI - Math.PI / 2;
        return (
          <g key={ch}>
            <T x={120 + 99 * Math.cos(a)} y={120 + 99 * Math.sin(a)} size={12}>{ch}</T>
            <T x={120 + 70 * Math.cos(a)} y={120 + 70 * Math.sin(a)} size={11} fill={RED}>{A[(i + shift) % 26]}</T>
          </g>
        );
      })}
      <T x={120} y={114} size={11} fill={MUTED}>{`+${shift}`}</T>
      <T x={120} y={130} size={9} fill={MUTED}>Caesar</T>
    </svg>
  );
}

/** Heimnetz: A Laptop, B Router, C Internet (Wolke), D Server, E Smartphone */
export function Network({ mark }: { mark?: string }) {
  const node = (x: number, y: number, kind: string, letter: string) => (
    <g key={letter} transform={`translate(${x - 28} ${y - 28})`}>
      <rect x="-4" y="-4" width="64" height="64" rx="14" fill={mark === letter ? YELLOW : SOFT} stroke={LINE} />
      <g transform="scale(0.56)">{DEVICES[kind]?.()}</g>
      <circle cx="56" cy="0" r="10" fill={PAPER} stroke={INK} strokeWidth="1.5" />
      <T x={56} y={1} size={11}>{letter}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 340 200" className="h-auto w-full">
      <g stroke={MUTED} strokeWidth="3" strokeDasharray="1 0">
        <line x1="60" y1="52" x2="150" y2="100" />
        <line x1="60" y1="150" x2="150" y2="100" strokeDasharray="5 5" />
        <line x1="150" y1="100" x2="236" y2="100" />
        <line x1="236" y1="100" x2="300" y2="44" />
      </g>
      {node(60, 52, 'monitor', 'A')}
      {node(150, 100, 'router', 'B')}
      {node(60, 152, 'smartphone', 'E')}
      <g>
        <path d="M206 112 C192 112 192 92 206 90 C206 74 228 70 236 82 C244 70 268 76 266 92 C280 92 280 112 266 112Z" fill={mark === 'C' ? YELLOW : WATER_L} stroke={BLUE} strokeWidth="2" />
        <circle cx="270" cy="76" r="10" fill={PAPER} stroke={INK} strokeWidth="1.5" /><T x={270} y={77} size={11}>C</T>
      </g>
      <g transform="translate(286 24)">
        <rect x="0" y="0" width="34" height="44" rx="4" fill={mark === 'D' ? YELLOW : DARK} />
        {[8, 20, 32].map((y) => <g key={y}><rect x="5" y={y - 4} width="24" height="7" rx="2" fill={GREY_D} /><circle cx="24" cy={y} r="1.6" fill={GREEN} /></g>)}
        <circle cx="34" cy="0" r="10" fill={PAPER} stroke={INK} strokeWidth="1.5" /><T x={34} y={1} size={11}>D</T>
      </g>
    </svg>
  );
}

/** Ablaufdiagramm: Start → Anweisungen → Entscheidung → Ausgaben */
export function Flowchart({ steps, cond, yes, no, loop }: { steps: string[]; cond?: string; yes?: string; no?: string; loop?: boolean }) {
  const id = useId();
  const W = 300, cx = 150;
  let y = 14;
  const els: ReactNode[] = [];
  const arrow = (y1: number, y2: number, k: string) => <line key={k} x1={cx} x2={cx} y1={y1} y2={y2 - 2} stroke={INK} strokeWidth="2" markerEnd={`url(#${id})`} />;
  els.push(<g key="s"><rect x={cx - 40} y={y} width="80" height="26" rx="13" fill={GREEN} /><T x={cx} y={y + 13} size={12} fill={WHITE}>Start</T></g>);
  y += 26;
  steps.forEach((s, i) => {
    els.push(arrow(y, y + 14, 'a' + i));
    y += 14;
    els.push(<g key={'st' + i}><rect x={cx - 92} y={y} width="184" height="28" rx="4" fill={s === '?' ? YELLOW : SOFT} stroke={BLUE} strokeWidth="2" /><T x={cx} y={y + 14} size={12} mono fill={s === '?' ? DARK : INK}>{s}</T></g>);
    y += 28;
  });
  let bodyTop = 0;
  if (cond) {
    els.push(arrow(y, y + 14, 'ac'));
    y += 14;
    bodyTop = y;
    els.push(<g key="c"><path d={`M${cx} ${y} L${cx + 96} ${y + 24} L${cx} ${y + 48} L${cx - 96} ${y + 24}Z`} fill={YELLOW_L} stroke={ORANGE} strokeWidth="2" /><T x={cx} y={y + 24} size={12} mono fill={DARK}>{cond}</T></g>);
    const yy = y + 24;
    if (loop) {
      els.push(<g key="loop"><path d={`M${cx - 96} ${yy} H${cx - 128} V${bodyTop - 70} H${cx - 92}`} fill="none" stroke={INK} strokeWidth="2" /><T x={cx - 112} y={yy - 10} size={10}>{yes}</T></g>);
      els.push(<g key="no"><path d={`M${cx + 96} ${yy} H${cx + 120} V${yy + 40}`} fill="none" stroke={INK} strokeWidth="2" markerEnd={`url(#${id})`} /><T x={cx + 110} y={yy - 10} size={10}>{no}</T></g>);
      els.push(<g key="end"><rect x={cx + 82} y={yy + 40} width="76" height="26" rx="13" fill={RED} /><T x={cx + 120} y={yy + 53} size={12} fill={WHITE}>{getLang() === 'it' ? 'Fine' : 'Ende'}</T></g>);
      y = yy + 66;
    } else {
      els.push(<g key="y"><path d={`M${cx - 96} ${yy} H${cx - 120} V${yy + 36}`} fill="none" stroke={INK} strokeWidth="2" markerEnd={`url(#${id})`} /><T x={cx - 108} y={yy - 10} size={11}>✓</T><rect x={cx - 146} y={yy + 36} width="72" height="28" rx="4" fill={yes === '?' ? YELLOW : SOFT} stroke={BLUE} strokeWidth="2" /><T x={cx - 110} y={yy + 50} size={11} mono fill={yes === '?' ? DARK : INK}>{yes}</T></g>);
      els.push(<g key="n"><path d={`M${cx + 96} ${yy} H${cx + 120} V${yy + 36}`} fill="none" stroke={INK} strokeWidth="2" markerEnd={`url(#${id})`} /><T x={cx + 108} y={yy - 10} size={11}>✗</T><rect x={cx + 74} y={yy + 36} width="72" height="28" rx="4" fill={no === '?' ? YELLOW : SOFT} stroke={BLUE} strokeWidth="2" /><T x={cx + 110} y={yy + 50} size={11} mono fill={no === '?' ? DARK : INK}>{no}</T></g>);
      y = yy + 66;
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${y + 8}`} className="mx-auto h-auto w-full max-w-sm">
      <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={INK} /></marker></defs>
      {els}
    </svg>
  );
}

/** Blockprogramm (eigener Stil): verschachtelte Blöcke */
export interface Block { t: string; c?: 'move' | 'turn' | 'loop' | 'if' | 'var' | 'say'; body?: Block[] }
export function Blocks({ prog }: { prog: Block[] }) {
  const COL = { move: BLUE, turn: PURPLE, loop: ORANGE, if: YELLOW, var: GREEN, say: RED } as const;
  const rows: ReactNode[] = [];
  let y = 8;
  const draw = (list: Block[], x: number) => {
    for (const b of list) {
      const col = COL[b.c ?? 'move'];
      if (b.body) {
        const top = y;
        rows.push(<g key={'h' + y}><rect x={x} y={y} width={250 - x} height="30" rx="6" fill={col} /><T x={x + 12} y={y + 15} size={13} anchor="start" fill={b.c === 'if' ? DARK : WHITE}>{b.t}</T></g>);
        y += 34;
        draw(b.body, x + 18);
        rows.push(<rect key={'s' + top} x={x} y={top + 26} width="14" height={y - top - 22} fill={col} />);
        rows.push(<rect key={'f' + top} x={x} y={y} width={120} height="14" rx="5" fill={col} />);
        y += 18;
      } else {
        rows.push(<g key={'b' + y}><rect x={x} y={y} width={250 - x} height="30" rx="6" fill={col} /><T x={x + 12} y={y + 15} size={13} anchor="start" fill={WHITE}>{b.t}</T></g>);
        y += 34;
      }
    }
  };
  draw(prog, 8);
  return <svg viewBox={`0 0 260 ${y + 6}`} className="mx-auto h-auto w-full max-w-xs">{rows}</svg>;
}

/** Linienbild einer Turtle-Zeichnung (für Antwortbilder): Polygonzug aus Punkten */
export function TurtlePath({ pts, closed = true }: { pts: [number, number][]; closed?: boolean }) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const s = 70 / Math.max(maxX - minX, maxY - minY, 1);
  const P = pts.map(([x, y]) => `${15 + (x - minX) * s + (70 - (maxX - minX) * s) / 2},${85 - (y - minY) * s - (70 - (maxY - minY) * s) / 2}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {closed ? <polygon points={P} fill="none" stroke={BLUE} strokeWidth="4" strokeLinejoin="round" /> : <polyline points={P} fill="none" stroke={BLUE} strokeWidth="4" strokeLinejoin="round" />}
      <circle cx={P.split(' ')[0]?.split(',')[0]} cy={P.split(' ')[0]?.split(',')[1]} r="4" fill={GREEN} />
    </svg>
  );
}

/** Verdächtige E-Mail (ausgedacht) */
export function Phishing({ variant = 0, lang }: { variant?: number; lang: 'de' | 'it' }) {
  const de = lang === 'de';
  const V = [
    { from: 'service@paypa1-sicher.xyz', subj: de ? 'DRINGEND: Konto gesperrt!!!' : 'URGENTE: conto bloccato!!!', body: de ? ['Bestätige sofort dein Passwort,', 'sonst wird dein Konto gelöscht.'] : ['Conferma subito la password,', 'altrimenti il conto sarà cancellato.'], btn: de ? 'Jetzt einloggen' : 'Accedi ora' },
    { from: 'gewinn@super-preis.win', subj: de ? 'Du hast ein Handy gewonnen!' : 'Hai vinto uno smartphone!', body: de ? ['Gib nur deine Adresse und', 'deine Kartennummer ein.'] : ['Inserisci solo il tuo indirizzo', 'e il numero della carta.'], btn: de ? 'Preis abholen' : 'Ritira il premio' }
  ][variant % 2]!;
  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full">
      <rect x="4" y="4" width="312" height="182" rx="12" fill={PAPER} stroke={LINE} strokeWidth="2" />
      <rect x="4" y="4" width="312" height="30" rx="12" fill={SOFT} />
      <T x={16} y={19} size={11} anchor="start" fill={MUTED}>{de ? 'Von:' : 'Da:'}</T>
      <T x={50} y={19} size={11} anchor="start" fill={RED}>{V.from}</T>
      <T x={16} y={52} size={14} anchor="start">{V.subj}</T>
      <T x={16} y={82} size={12} anchor="start" weight={500}>{V.body[0]}</T>
      <T x={16} y={100} size={12} anchor="start" weight={500}>{V.body[1]}</T>
      <rect x="16" y="122" width="140" height="34" rx="8" fill={RED} />
      <T x={86} y={139} size={13} fill={WHITE}>{V.btn}</T>
      <T x={16} y={172} size={9} anchor="start" fill={MUTED}>http://login-check.biz/konto?id=88412</T>
    </svg>
  );
}

/** Balken zum Sortieren (Werte) */
export function SortBars({ values, mark }: { values: number[]; mark?: [number, number] }) {
  const n = values.length, w = 300 / n, mx = Math.max(...values);
  return (
    <svg viewBox="0 0 320 170" className="h-auto w-full">
      {values.map((v, i) => {
        const h = (v / mx) * 120, on = mark && (mark[0] === i || mark[1] === i);
        return (
          <g key={i}>
            <rect x={10 + i * w + w * 0.12} y={140 - h} width={w * 0.76} height={h} rx="4" fill={on ? ORANGE : BLUE} />
            <T x={10 + i * w + w / 2} y={156} size={14}>{v}</T>
          </g>
        );
      })}
    </svg>
  );
}

/** Gewichteter Graph mit Knoten A–E (fest angeordnet) */
export function Graph({ edges, from, to }: { edges: [string, string, number][]; from?: string; to?: string }) {
  const P: Record<string, [number, number]> = { A: [40, 100], B: [130, 36], C: [130, 164], D: [230, 70], E: [290, 140] };
  return (
    <svg viewBox="0 0 330 200" className="h-auto w-full">
      {edges.map(([a, b, w], i) => {
        const [x1, y1] = P[a]!, [x2, y2] = P[b]!;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth="3" />
            <rect x={(x1 + x2) / 2 - 12} y={(y1 + y2) / 2 - 11} width="24" height="22" rx="6" fill={PAPER} stroke={LINE} />
            <T x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 1} size={12}>{w}</T>
          </g>
        );
      })}
      {Object.entries(P).map(([k, [x, y]]) => (
        <g key={k}>
          <circle cx={x} cy={y} r="18" fill={k === from ? GREEN : k === to ? RED : BLUE} />
          <T x={x} y={y + 1} size={15} fill={WHITE}>{k}</T>
        </g>
      ))}
    </svg>
  );
}

/** Passwortstärke: Balken mit 1–4 Stufen und dem Passwort */
export function PasswordMeter({ pw, level }: { pw: string; level: number }) {
  return (
    <svg viewBox="0 0 320 110" className="h-auto w-full">
      <rect x="10" y="10" width="300" height="42" rx="10" fill={PAPER} stroke={LINE} strokeWidth="2" />
      <T x={24} y={32} size={16} anchor="start" mono>{pw}</T>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={10 + i * 76} y="66" width="70" height="12" rx="6" fill={i < level ? [RED, ORANGE, YELLOW, GREEN][level - 1] : GREY_L} />)}
    </svg>
  );
}

/** Speichergrößen als gestapelte Kästen (z. B. Byte = 8 Bit) */
export function ByteBox({ bits }: { bits: number }) {
  return (
    <svg viewBox={`0 0 ${bits * 32 + 20} 70`} className="mx-auto h-auto w-full max-w-md">
      {Array.from({ length: bits }, (_, i) => <g key={i}><rect x={10 + i * 32} y="14" width="28" height="36" rx="4" fill={i % 2 ? BLUE : PURPLE} /><T x={24 + i * 32} y={33} size={14} fill={WHITE}>{i % 3 === 0 ? 1 : 0}</T></g>)}
    </svg>
  );
}

export const TECH_ART = {
  geraet: Device, bits: BitLamps, gatter: Gate, caesar: CaesarWheel, netz: Network, ablauf: Flowchart, bloecke: Blocks,
  turtle: TurtlePath, phishing: Phishing, sortieren: SortBars, graph: Graph, passwort: PasswordMeter, byte: ByteBox
};
