import type { ReactElement } from 'react';
import { BLUE, BLUE_D, BLUE_L, BROWN, BROWN_D, DARK, GREEN, GREEN_D, GREY, GREY_D, GREY_L, LEAF, LEAF_D, ORANGE, PINK, PURPLE, RED, RED_D, WATER, WATER_L, WHITE, YELLOW, YELLOW_L } from './palette';

/**
 * Gegenstände, Tiere und Pflanzen als flache Zeichnungen (eigene Gestaltung), je 100 × 100.
 * Sie werden für Wortschatz-, Anlaut-, Silben- und Artikel-Aufgaben genutzt.
 */
export const OBJECTS: Record<string, () => ReactElement> = {
  apfel: () => (
    <g>
      <path d="M50 30 C34 18 14 28 16 52 C18 76 34 92 50 84 C66 92 82 76 84 52 C86 28 66 18 50 30Z" fill={RED} />
      <path d="M30 40 C26 48 26 58 30 66" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M50 30 C50 20 54 12 60 8" stroke={BROWN_D} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M54 20 C62 10 76 12 78 18 C70 24 60 24 54 20Z" fill={LEAF} />
    </g>
  ),
  banane: () => (
    <g>
      <path d="M18 30 C22 70 58 88 86 70 C88 66 86 62 82 64 C58 74 36 60 30 30 Z" fill={YELLOW_L} stroke={YELLOW} strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 30 L16 22 L24 22 L30 30" fill={BROWN_D} />
      <path d="M36 50 C44 64 58 70 74 68" stroke={YELLOW} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  haus: () => (
    <g>
      <rect x="22" y="44" width="56" height="44" fill={YELLOW_L} />
      <path d="M12 48 L50 14 L88 48 Z" fill={RED} />
      <rect x="64" y="20" width="10" height="18" fill={RED_D} />
      <rect x="42" y="62" width="16" height="26" rx="2" fill={BROWN} />
      <rect x="28" y="54" width="12" height="12" fill={WATER_L} stroke={WHITE} strokeWidth="2" />
      <rect x="60" y="54" width="12" height="12" fill={WATER_L} stroke={WHITE} strokeWidth="2" />
      <rect x="10" y="88" width="80" height="4" rx="2" fill={GREEN} />
    </g>
  ),
  ball: () => (
    <g>
      <circle cx="50" cy="52" r="34" fill={BLUE} />
      <path d="M16 52 C30 42 70 42 84 52" stroke={WHITE} strokeWidth="6" fill="none" />
      <path d="M50 18 C40 32 40 72 50 86" stroke={YELLOW} strokeWidth="6" fill="none" />
      <circle cx="38" cy="36" r="6" fill="#fff" opacity="0.35" />
    </g>
  ),
  katze: () => (
    <g>
      <ellipse cx="50" cy="72" rx="26" ry="20" fill={ORANGE} />
      <circle cx="50" cy="42" r="22" fill={ORANGE} />
      <path d="M31 30 L30 10 L44 23Z M69 30 L70 10 L56 23Z" fill={ORANGE} />
      <path d="M33 26 L32 15 L40 22Z M67 26 L68 15 L60 22Z" fill={PINK} />
      <circle cx="42" cy="40" r="3.5" fill={DARK} />
      <circle cx="58" cy="40" r="3.5" fill={DARK} />
      <path d="M47 48 L53 48 L50 52Z" fill={PINK} />
      <path d="M30 48 H42 M30 53 H42 M58 48 H70 M58 53 H70" stroke={DARK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M76 76 C92 72 92 52 84 46" stroke={ORANGE} strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  ),
  hund: () => (
    <g>
      <ellipse cx="50" cy="74" rx="26" ry="18" fill={BROWN} />
      <circle cx="50" cy="42" r="22" fill={BROWN} />
      <ellipse cx="28" cy="44" rx="8" ry="16" fill={BROWN_D} />
      <ellipse cx="72" cy="44" rx="8" ry="16" fill={BROWN_D} />
      <ellipse cx="50" cy="52" rx="12" ry="9" fill="#E8C9A6" />
      <circle cx="42" cy="38" r="3.5" fill={DARK} />
      <circle cx="58" cy="38" r="3.5" fill={DARK} />
      <ellipse cx="50" cy="48" rx="5" ry="3.5" fill={DARK} />
      <path d="M46 56 Q50 60 54 56" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  fisch: () => (
    <g>
      <path d="M14 50 C28 26 62 24 76 50 C62 76 28 74 14 50Z" fill={ORANGE} />
      <path d="M74 50 L92 34 L90 66Z" fill={YELLOW} />
      <path d="M40 32 C46 40 46 60 40 68" stroke={YELLOW} strokeWidth="3" fill="none" />
      <circle cx="28" cy="46" r="4" fill={DARK} />
    </g>
  ),
  vogel: () => (
    <g>
      <ellipse cx="48" cy="56" rx="28" ry="22" fill={BLUE} />
      <circle cx="68" cy="38" r="15" fill={BLUE} />
      <path d="M82 36 L94 40 L82 44Z" fill={YELLOW} />
      <circle cx="71" cy="35" r="3" fill={DARK} />
      <path d="M30 50 C38 40 58 46 56 60 C46 64 34 60 30 50Z" fill={BLUE_D} />
      <path d="M22 56 L6 50 L12 64Z" fill={BLUE_D} />
      <path d="M44 78 V88 M54 78 V88" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  sonne: () => (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30} x2={50 + Math.cos(a) * 44} y2={50 + Math.sin(a) * 44} stroke={YELLOW} strokeWidth="6" strokeLinecap="round" />;
      })}
      <circle cx="50" cy="50" r="24" fill={YELLOW_L} stroke={YELLOW} strokeWidth="4" />
    </g>
  ),
  mond: () => (
    <g>
      <path d="M62 12 C34 14 18 40 26 64 C34 86 62 94 82 78 C58 80 40 62 42 42 C44 26 52 16 62 12Z" fill={YELLOW_L} stroke={YELLOW} strokeWidth="3" />
      <circle cx="40" cy="62" r="4" fill={YELLOW} opacity="0.6" />
    </g>
  ),
  stern: () => (
    <path d="M50 8 L61 37 L93 38 L68 58 L77 90 L50 72 L23 90 L32 58 L7 38 L39 37Z" fill={YELLOW} stroke="#DB8B0B" strokeWidth="3" strokeLinejoin="round" />
  ),
  baum: () => (
    <g>
      <rect x="44" y="56" width="12" height="34" rx="3" fill={BROWN} />
      <circle cx="50" cy="38" r="26" fill={LEAF} />
      <circle cx="30" cy="52" r="16" fill={LEAF} />
      <circle cx="70" cy="52" r="16" fill={LEAF} />
      <circle cx="40" cy="30" r="8" fill={GREEN} opacity="0.6" />
      <rect x="18" y="88" width="64" height="4" rx="2" fill={GREEN} />
    </g>
  ),
  blume: () => (
    <g>
      <path d="M50 52 V92" stroke={LEAF} strokeWidth="5" />
      <path d="M50 76 C40 66 28 68 24 72 C32 80 44 80 50 76Z" fill={LEAF} />
      {[0, 72, 144, 216, 288].map((d) => (
        <ellipse key={d} cx="50" cy="20" rx="11" ry="16" fill={PINK} transform={`rotate(${d} 50 36)`} />
      ))}
      <circle cx="50" cy="36" r="10" fill={YELLOW} />
    </g>
  ),
  auto: () => (
    <g>
      <path d="M10 64 V52 C10 48 12 46 16 46 L28 44 L38 30 H66 L78 44 L86 46 C90 47 92 50 92 54 V64 Z" fill={RED} />
      <path d="M41 34 H52 V44 H33Z M56 34 H64 L72 44 H56Z" fill={WATER_L} />
      <circle cx="28" cy="66" r="10" fill={DARK} />
      <circle cx="28" cy="66" r="4" fill={GREY_L} />
      <circle cx="74" cy="66" r="10" fill={DARK} />
      <circle cx="74" cy="66" r="4" fill={GREY_L} />
      <rect x="86" y="50" width="6" height="5" rx="1" fill={YELLOW_L} />
    </g>
  ),
  fahrrad: () => (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="64" r="17" stroke={DARK} strokeWidth="4" />
      <circle cx="76" cy="64" r="17" stroke={DARK} strokeWidth="4" />
      <path d="M24 64 L42 40 L66 40 L76 64 M42 40 L52 64 L66 40 M52 64 L24 64" stroke={BLUE} strokeWidth="4" />
      <path d="M38 32 H48 M66 40 L62 28 H70" stroke={DARK} strokeWidth="4" />
    </g>
  ),
  buch: () => (
    <g>
      <path d="M50 26 C40 18 22 18 12 22 V80 C22 76 40 76 50 84Z" fill={BLUE} />
      <path d="M50 26 C60 18 78 18 88 22 V80 C78 76 60 76 50 84Z" fill={BLUE_D} />
      <path d="M18 30 C28 27 38 28 44 32 M18 40 C28 37 38 38 44 42 M56 32 C62 28 72 27 82 30 M56 42 C62 38 72 37 82 40" stroke={WHITE} strokeWidth="2.5" fill="none" opacity="0.7" />
    </g>
  ),
  hut: () => (
    <g>
      <ellipse cx="50" cy="70" rx="42" ry="12" fill={PURPLE} />
      <path d="M26 70 C26 40 30 26 50 26 C70 26 74 40 74 70Z" fill={PURPLE} />
      <rect x="26" y="56" width="48" height="9" fill={YELLOW} />
    </g>
  ),
  schluessel: () => (
    <g>
      <circle cx="30" cy="50" r="18" fill={YELLOW} />
      <circle cx="30" cy="50" r="7" fill={WHITE} />
      <path d="M46 46 H90 V54 H84 V64 H76 V54 H70 V62 H62 V54 H46Z" fill={YELLOW} />
    </g>
  ),
  tasse: () => (
    <g>
      <path d="M20 34 H70 V66 C70 78 62 84 54 84 H36 C28 84 20 78 20 66Z" fill={GREEN} />
      <path d="M70 42 C86 40 88 66 70 66" stroke={GREEN} strokeWidth="7" fill="none" />
      <ellipse cx="45" cy="34" rx="25" ry="5" fill={GREEN_D} />
      <path d="M36 24 C32 18 40 14 36 8 M50 24 C46 18 54 14 50 8" stroke={GREY} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  stuhl: () => (
    <g fill={BROWN}>
      <rect x="28" y="12" width="8" height="78" rx="3" />
      <rect x="28" y="12" width="40" height="8" rx="3" />
      <rect x="28" y="28" width="40" height="6" rx="3" />
      <rect x="22" y="52" width="54" height="9" rx="3" fill={BROWN_D} />
      <rect x="66" y="56" width="8" height="34" rx="3" />
      <rect x="62" y="12" width="6" height="40" rx="3" />
    </g>
  ),
  schirm: () => (
    <g>
      <path d="M10 50 C12 24 32 12 50 12 C68 12 88 24 90 50 C84 44 76 44 70 50 C64 44 56 44 50 50 C44 44 36 44 30 50 C24 44 16 44 10 50Z" fill={PURPLE} />
      <path d="M30 50 C32 30 40 16 50 12 C60 16 68 30 70 50" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
      <path d="M50 50 V82 C50 90 40 90 40 82" stroke={DARK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  kuchen: () => (
    <g>
      <rect x="18" y="46" width="64" height="38" rx="4" fill="#E8C9A6" />
      <path d="M18 52 C26 60 34 52 42 60 C50 52 58 60 66 52 C74 60 78 52 82 56 V46 H18Z" fill={PINK} />
      <rect x="16" y="84" width="68" height="5" rx="2" fill={GREY_L} />
      {[34, 50, 66].map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y="28" width="5" height="18" fill={BLUE_L} />
          <path d={`M${x} 18 C${x + 5} 24 ${x + 3} 28 ${x} 28 C${x - 3} 28 ${x - 5} 24 ${x} 18Z`} fill={ORANGE} />
        </g>
      ))}
    </g>
  ),
  schuh: () => (
    <g>
      <path d="M14 70 V40 C14 34 20 32 26 34 L40 40 C48 50 60 54 74 56 C84 58 90 62 90 70Z" fill={BLUE} />
      <rect x="12" y="68" width="80" height="10" rx="5" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      <path d="M30 42 L40 48 M36 38 L46 46" stroke={WHITE} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  uhr: () => (
    <g>
      <circle cx="50" cy="50" r="38" fill={WHITE} stroke={BLUE} strokeWidth="7" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <line key={i} x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 33} y2={50 + Math.sin(a) * 33} stroke={DARK} strokeWidth="3" />;
      })}
      <path d="M50 50 V28 M50 50 L64 58" stroke={DARK} strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill={RED} />
    </g>
  ),
  brille: () => (
    <g fill="none" stroke={DARK} strokeWidth="5">
      <circle cx="30" cy="54" r="16" fill={WATER_L} />
      <circle cx="70" cy="54" r="16" fill={WATER_L} />
      <path d="M46 52 C48 48 52 48 54 52 M14 50 L6 40 M86 50 L94 40" strokeLinecap="round" />
    </g>
  ),
  lampe: () => (
    <g>
      <path d="M30 14 H70 L82 46 H18Z" fill={YELLOW} />
      <rect x="47" y="46" width="6" height="34" fill={GREY_D} />
      <ellipse cx="50" cy="84" rx="22" ry="6" fill={GREY_D} />
      <path d="M36 56 L28 70 M64 56 L72 70" stroke={YELLOW_L} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  tisch: () => (
    <g fill={BROWN}>
      <rect x="8" y="34" width="84" height="10" rx="3" fill={BROWN_D} />
      <rect x="14" y="44" width="8" height="44" rx="2" />
      <rect x="78" y="44" width="8" height="44" rx="2" />
      <rect x="22" y="48" width="56" height="5" rx="2" />
    </g>
  ),
  boot: () => (
    <g>
      <path d="M50 12 V62" stroke={BROWN_D} strokeWidth="4" />
      <path d="M53 14 L82 56 H53Z" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      <path d="M47 22 L24 56 H47Z" fill={RED} />
      <path d="M12 64 H88 L76 82 H24Z" fill={BROWN} />
      <path d="M4 88 C14 82 24 94 34 88 C44 82 54 94 64 88 C74 82 84 94 96 88" stroke={WATER} strokeWidth="4" fill="none" />
    </g>
  ),
  zug: () => (
    <g>
      <rect x="10" y="30" width="56" height="40" rx="6" fill={BLUE} />
      <rect x="62" y="20" width="28" height="50" rx="6" fill={BLUE_D} />
      <rect x="68" y="28" width="16" height="14" rx="2" fill={WATER_L} />
      <rect x="18" y="38" width="16" height="12" rx="2" fill={WATER_L} />
      <rect x="40" y="38" width="16" height="12" rx="2" fill={WATER_L} />
      {[24, 50, 76].map((x) => <circle key={x} cx={x} cy="74" r="8" fill={DARK} />)}
      <rect x="4" y="84" width="92" height="4" rx="2" fill={GREY} />
    </g>
  ),
  schmetterling: () => (
    <g>
      <path d="M48 46 C36 16 8 18 12 40 C14 52 30 54 48 50Z" fill={PURPLE} />
      <path d="M52 46 C64 16 92 18 88 40 C86 52 70 54 52 50Z" fill={PURPLE} />
      <path d="M48 52 C30 54 16 66 24 78 C32 86 44 72 48 58Z" fill={PINK} />
      <path d="M52 52 C70 54 84 66 76 78 C68 86 56 72 52 58Z" fill={PINK} />
      <circle cx="26" cy="36" r="5" fill={YELLOW} />
      <circle cx="74" cy="36" r="5" fill={YELLOW} />
      <rect x="47" y="34" width="6" height="40" rx="3" fill={DARK} />
      <path d="M49 34 C46 26 42 22 38 20 M51 34 C54 26 58 22 62 20" stroke={DARK} strokeWidth="2" fill="none" />
    </g>
  ),
  frosch: () => (
    <g>
      <ellipse cx="50" cy="62" rx="34" ry="24" fill={GREEN} />
      <circle cx="34" cy="36" r="12" fill={GREEN} />
      <circle cx="66" cy="36" r="12" fill={GREEN} />
      <circle cx="34" cy="34" r="6" fill={WHITE} />
      <circle cx="66" cy="34" r="6" fill={WHITE} />
      <circle cx="35" cy="35" r="3" fill={DARK} />
      <circle cx="67" cy="35" r="3" fill={DARK} />
      <path d="M34 60 Q50 70 66 60" stroke={GREEN_D} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="84" rx="12" ry="5" fill={GREEN_D} />
      <ellipse cx="76" cy="84" rx="12" ry="5" fill={GREEN_D} />
    </g>
  ),
  biene: () => (
    <g>
      <ellipse cx="40" cy="30" rx="14" ry="18" fill={WATER_L} opacity="0.9" transform="rotate(-25 40 30)" />
      <ellipse cx="60" cy="30" rx="14" ry="18" fill={WATER_L} opacity="0.9" transform="rotate(25 60 30)" />
      <ellipse cx="50" cy="58" rx="30" ry="22" fill={YELLOW} />
      <path d="M38 38 V78 M52 36 V80 M66 40 V76" stroke={DARK} strokeWidth="7" />
      <path d="M80 58 L92 58" stroke={DARK} strokeWidth="3" />
      <circle cx="24" cy="54" r="3" fill={DARK} />
    </g>
  ),
  schnecke: () => (
    <g>
      <path d="M10 80 C10 70 20 68 30 68 H80 C88 68 92 74 92 80Z" fill="#C9B79C" />
      <circle cx="56" cy="50" r="26" fill={ORANGE} />
      <path d="M56 50 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 0 a16 16 0 1 1 30 0" stroke={BROWN_D} strokeWidth="3" fill="none" />
      <path d="M20 68 L14 48 M26 68 L26 48" stroke="#C9B79C" strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="46" r="3" fill={DARK} />
      <circle cx="26" cy="46" r="3" fill={DARK} />
    </g>
  ),
  spinne: () => (
    <g stroke={DARK} strokeWidth="3.5" fill="none" strokeLinecap="round">
      {[-1, 1].map((s) => [20, 34, 48, 62].map((y, i) => (
        <path key={`${s}${y}`} d={`M${50 + s * 10} ${52 + (i - 1.5) * 5} Q${50 + s * 30} ${y - 10} ${50 + s * (38 + i * 2)} ${y + 18}`} />
      )))}
      <ellipse cx="50" cy="60" rx="15" ry="18" fill={DARK} stroke="none" />
      <circle cx="50" cy="38" r="10" fill={DARK} stroke="none" />
      <circle cx="46" cy="36" r="2.5" fill={WHITE} stroke="none" />
      <circle cx="54" cy="36" r="2.5" fill={WHITE} stroke="none" />
    </g>
  ),
  kuh: () => (
    <g>
      <rect x="16" y="38" width="58" height="32" rx="14" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      <path d="M30 40 C36 48 30 56 24 52Z M52 50 C60 46 66 56 58 62 C52 62 50 56 52 50Z" fill={DARK} />
      <rect x="22" y="66" width="8" height="22" rx="3" fill={GREY_L} />
      <rect x="60" y="66" width="8" height="22" rx="3" fill={GREY_L} />
      <rect x="68" y="24" width="24" height="28" rx="10" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      <ellipse cx="80" cy="48" rx="12" ry="8" fill={PINK} />
      <path d="M70 26 L64 16 M90 26 L96 16" stroke={STONE} strokeWidth="4" strokeLinecap="round" />
      <circle cx="75" cy="34" r="2.5" fill={DARK} />
      <circle cx="86" cy="34" r="2.5" fill={DARK} />
      <ellipse cx="44" cy="72" rx="8" ry="5" fill={PINK} />
    </g>
  ),
  eidechse: () => (
    <g>
      <path d="M16 50 C24 40 40 40 56 48 C66 52 80 50 92 62 C78 58 66 60 54 58 C40 56 26 62 16 50Z" fill={LEAF} />
      <ellipse cx="22" cy="48" rx="10" ry="7" fill={LEAF} />
      <circle cx="20" cy="45" r="2" fill={DARK} />
      <path d="M36 48 L28 34 M36 54 L28 66 M54 50 L62 36 M54 56 L60 70" stroke={LEAF_D} strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  wal: () => (
    <g>
      <path d="M10 56 C10 34 40 28 62 36 C72 40 78 48 78 56 C78 70 60 76 40 76 C22 76 10 70 10 56Z" fill={BLUE} />
      <path d="M76 52 L94 38 L90 56 L94 70Z" fill={BLUE} />
      <path d="M14 62 C26 70 50 72 70 64" stroke={BLUE_L} strokeWidth="4" fill="none" />
      <circle cx="26" cy="50" r="3" fill={DARK} />
      <path d="M40 30 C38 22 34 18 30 16 M40 30 C42 22 46 18 50 16" stroke={WATER} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  tomate: () => (
    <g>
      <circle cx="50" cy="56" r="32" fill={RED} />
      <path d="M50 26 L42 18 L48 28 L36 28 L48 32 L44 40 L52 32 L60 38 L56 30 L66 28 L54 26 L58 18Z" fill={LEAF} />
      <circle cx="36" cy="48" r="6" fill="#fff" opacity="0.3" />
    </g>
  ),
  kerze: () => (
    <g>
      <rect x="38" y="36" width="24" height="52" rx="3" fill={WHITE} stroke={GREY_L} strokeWidth="2" />
      <path d="M50 10 C58 20 56 30 50 30 C44 30 42 20 50 10Z" fill={ORANGE} />
      <path d="M50 18 C53 23 52 28 50 28 C48 28 47 23 50 18Z" fill={YELLOW_L} />
      <path d="M50 30 V36" stroke={DARK} strokeWidth="2" />
    </g>
  ),
  gras: () => (
    <g fill={LEAF}>
      <path d="M20 90 C22 70 18 52 10 40 C26 50 30 70 30 90Z" />
      <path d="M36 90 C38 64 36 40 30 20 C44 40 48 64 46 90Z" />
      <path d="M52 90 C54 66 58 46 66 30 C64 52 62 70 62 90Z" />
      <path d="M68 90 C70 72 76 58 88 48 C80 64 78 76 78 90Z" />
    </g>
  ),
  raupe: () => (
    <g>
      {[20, 34, 48, 62].map((x, i) => <circle key={x} cx={x} cy={62 - (i % 2) * 6} r="10" fill={GREEN} />)}
      <circle cx="78" cy="50" r="12" fill={LEAF} />
      <circle cx="82" cy="47" r="2.5" fill={DARK} />
      <path d="M74 38 L70 28 M82 38 L84 28" stroke={DARK} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  hase: () => (
    <g>
      <ellipse cx="44" cy="68" rx="26" ry="20" fill={GREY_L} />
      <circle cx="68" cy="50" r="15" fill={GREY_L} />
      <ellipse cx="64" cy="22" rx="5" ry="16" fill={GREY_L} />
      <ellipse cx="76" cy="22" rx="5" ry="16" fill={GREY_L} />
      <ellipse cx="64" cy="22" rx="2" ry="11" fill={PINK} />
      <ellipse cx="76" cy="22" rx="2" ry="11" fill={PINK} />
      <circle cx="72" cy="48" r="2.5" fill={DARK} />
      <circle cx="20" cy="64" r="7" fill={WHITE} />
    </g>
  ),
  fuchs: () => (
    <g>
      <path d="M6 70 C14 54 30 56 40 66 C30 76 16 80 6 70Z" fill={ORANGE} />
      <path d="M6 70 C10 66 14 66 16 70 C12 74 8 74 6 70Z" fill={WHITE} />
      <ellipse cx="50" cy="66" rx="22" ry="16" fill={ORANGE} />
      <path d="M62 34 L58 16 L70 28 L82 16 L80 34 C90 44 84 60 72 62 C62 62 56 48 62 34Z" fill={ORANGE} />
      <path d="M72 62 C66 58 70 52 74 54 C80 54 84 50 86 46 C84 56 80 62 72 62Z" fill={WHITE} />
      <circle cx="67" cy="42" r="2.5" fill={DARK} />
      <circle cx="78" cy="42" r="2.5" fill={DARK} />
      <circle cx="86" cy="47" r="2.5" fill={DARK} />
    </g>
  )
};

const STONE = '#C9B79C';

export function ObjectArt({ name }: { name: string }) {
  const draw = OBJECTS[name];
  return <svg viewBox="0 0 100 100" className="h-full w-full">{draw ? draw() : null}</svg>;
}
