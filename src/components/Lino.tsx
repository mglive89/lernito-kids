import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MASCOT_DESC } from '../content/mascot';

export type LinoMood = 'freude' | 'denken' | 'jubel' | 'winken' | 'ruhig';

interface Props {
  mood?: LinoMood;
  size?: number;
  className?: string;
  /** Kein Hüpfen, z. B. in Listen */
  still?: boolean;
  /** Gezeichnete 2D-Version erzwingen (z. B. innerhalb einer SVG-Grafik) */
  flat?: boolean;
}

const C = {
  fell: '#F4BE2A',
  ohr: '#EDB01C',
  ohrSchatten: '#D99A12',
  schnauze: '#F7DFA6',
  tinte: '#1F2233',
  iris: '#2F74D6',
  blau: '#2455C3',
  blauDunkel: '#1B43A0',
  hose: '#D9C096',
  hoseDunkel: '#C4A876',
  schuh: '#F6F4EE',
  haar: '#7A4A1E'
};

function motionFor(mood: LinoMood, off: boolean) {
  if (off) return undefined;
  return mood === 'jubel' ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] } : mood === 'denken' ? { rotate: [0, -4, 0] } : mood === 'winken' ? { rotate: [0, 3, 0, 3, 0] } : { y: [0, -5, 0] };
}

/**
 * Puppy – das Maskottchen von Lernito Kids: ein gelber Hund mit Schlappohren, blauem Hoodie und Sneakern.
 * Standard: Marcos 3D-Figur (public/puppy/puppy.webp, freigestellt). Die Stimmung zeigt sich über die Bewegung.
 * Fallback: gezeichnete SVG-Version.
 */
export function Lino(props: Props) {
  const { mood = 'freude', size = 140, className = '', still = false, flat = false } = props;
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  if (flat || failed) return <LinoFlat {...props} />;
  return (
    <motion.img
      src={`${import.meta.env.BASE_URL}puppy/puppy.webp`}
      width={Math.round(size * 1.25 * 0.709)}
      height={Math.round(size * 1.25)}
      alt={MASCOT_DESC}
      draggable={false}
      onError={() => setFailed(true)}
      className={`pointer-events-none select-none ${className}`}
      style={{ margin: `${-size * 0.06}px 0`, transformOrigin: '50% 90%' }}
      animate={motionFor(mood, still || !!reduce)}
      transition={{ duration: mood === 'jubel' ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/** Gezeichnete Puppy-Version (SVG) */
export function LinoFlat({ mood = 'freude', size = 140, className = '', still = false }: Props) {
  const reduce = useReducedMotion();
  const animate = still || reduce
    ? undefined
    : mood === 'jubel'
      ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] }
      : mood === 'denken'
        ? { rotate: [0, -3, 0] }
        : { y: [0, -5, 0] };
  return (
    <motion.svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={className}
      role="img"
      aria-label={MASCOT_DESC}
      animate={animate}
      transition={{ duration: mood === 'jubel' ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Legs />
      <Body />
      <Head mood={mood} />
      <Arms mood={mood} reduce={!!reduce} />
      {mood === 'denken' && (
        <g fill="#fff" stroke={C.tinte} strokeWidth="2">
          <circle cx="150" cy="10" r="4" />
          <circle cx="164" cy="5" r="3" />
        </g>
      )}
    </motion.svg>
  );
}

function Legs() {
  return (
    <g>
      {/* Cargohose */}
      <path d="M68 168 L99 168 L97 202 L71 202 Z" fill={C.hose} />
      <path d="M101 168 L132 168 L129 202 L103 202 Z" fill={C.hose} />
      <rect x="64" y="176" width="9" height="13" rx="2" fill={C.hoseDunkel} />
      <rect x="127" y="176" width="9" height="13" rx="2" fill={C.hoseDunkel} />
      <rect x="70" y="196" width="28" height="7" rx="3" fill={C.hoseDunkel} />
      <rect x="102" y="196" width="28" height="7" rx="3" fill={C.hoseDunkel} />
      {/* Sneaker (ohne Markenlogo) */}
      <path d="M56 214 Q56 202 70 201 L94 201 Q100 205 100 214 Z" fill={C.schuh} stroke="#d8d4c8" strokeWidth="1" />
      <path d="M62 207 Q72 203 84 206" stroke={C.blau} strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="54" y="211" width="48" height="6" rx="3" fill={C.blau} />
      <path d="M144 214 Q144 202 130 201 L106 201 Q100 205 100 214 Z" fill={C.schuh} stroke="#d8d4c8" strokeWidth="1" />
      <path d="M138 207 Q128 203 116 206" stroke={C.blau} strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="98" y="211" width="48" height="6" rx="3" fill={C.blau} />
    </g>
  );
}

function Body() {
  return (
    <g>
      {/* Kapuze hinter dem Hals */}
      <ellipse cx="100" cy="121" rx="36" ry="13" fill={C.blauDunkel} />
      {/* Hoodie */}
      <path d="M64 124 Q58 148 63 172 L137 172 Q142 148 136 124 Q100 114 64 124 Z" fill={C.blau} />
      <rect x="62" y="164" width="76" height="9" rx="4" fill={C.blauDunkel} />
      <path d="M80 148 L120 148 L127 164 L73 164 Z" fill={C.blauDunkel} opacity="0.55" />
      {/* Kordeln */}
      <g stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <path d="M93 124 L91 142" />
        <path d="M107 124 L109 142" />
      </g>
      <circle cx="91" cy="143" r="2.2" fill="#fff" />
      <circle cx="109" cy="143" r="2.2" fill="#fff" />
    </g>
  );
}

function Sleeve({ d }: { d: string }) {
  return <path d={d} fill={C.blau} stroke={C.blauDunkel} strokeWidth="1.5" strokeLinejoin="round" />;
}

function Arms({ mood, reduce }: { mood: LinoMood; reduce: boolean }) {
  if (mood === 'jubel') {
    return (
      <g>
        <Sleeve d="M70 128 Q52 112 46 92 L58 86 Q64 106 82 120 Z" />
        <circle cx="50" cy="84" r="9" fill={C.fell} />
        <Sleeve d="M130 128 Q148 112 154 92 L142 86 Q136 106 118 120 Z" />
        <circle cx="150" cy="84" r="9" fill={C.fell} />
      </g>
    );
  }
  // linke Hand steckt in der Hoodie-Tasche
  const left = <Sleeve d="M68 126 Q54 142 66 160 L80 156 Q72 142 78 132 Z" />;
  if (mood === 'winken') {
    return (
      <g>
        {left}
        <motion.g
          style={{ originX: '132px', originY: '128px' }}
          animate={reduce ? undefined : { rotate: [0, 16, 0] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          <Sleeve d="M130 126 Q150 116 158 96 L168 102 Q160 124 136 140 Z" />
          <ellipse cx="164" cy="90" rx="9" ry="11" fill={C.fell} />
          <g stroke={C.fell} strokeWidth="5" strokeLinecap="round">
            <path d="M158 84 L156 76" />
            <path d="M163 82 L163 73" />
            <path d="M168 83 L171 75" />
          </g>
        </motion.g>
      </g>
    );
  }
  if (mood === 'denken') {
    return (
      <g>
        {left}
        <Sleeve d="M132 126 Q150 130 146 112 L134 108 Q136 118 128 120 Z" />
        <circle cx="138" cy="106" r="8" fill={C.fell} />
        <path d="M140 100 L144 90" stroke={C.fell} strokeWidth="5.5" strokeLinecap="round" />
      </g>
    );
  }
  // Zeigegeste wie auf dem Original
  return (
    <g>
      {left}
      <Sleeve d="M130 124 Q150 120 160 128 L156 141 Q144 136 132 142 Z" />
      <circle cx="163" cy="133" r="8.5" fill={C.fell} />
      <path d="M166 128 L180 122" stroke={C.fell} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M167 131 L178 127" stroke={C.fell} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Head({ mood }: { mood: LinoMood }) {
  const closed = mood === 'jubel';
  return (
    <g>
      {/* Schlappohren */}
      <g fill={C.ohr}>
        <path d="M60 32 C34 10 6 34 14 66 C18 84 4 98 14 116 C26 136 54 124 58 100 Z" />
        <path d="M140 32 C166 10 194 34 186 66 C182 84 196 98 186 116 C174 136 146 124 142 100 Z" />
      </g>
      <g fill={C.ohrSchatten} opacity="0.45">
        <path d="M54 46 C38 40 26 58 30 76 C32 90 26 100 32 110 C40 118 50 110 52 98 Z" />
        <path d="M146 46 C162 40 174 58 170 76 C168 90 174 100 168 110 C160 118 150 110 148 98 Z" />
      </g>
      {/* Kopf */}
      <ellipse cx="100" cy="60" rx="46" ry="44" fill={C.fell} />
      <path d="M57 68 Q60 102 100 121 Q140 102 143 68 Q122 58 100 64 Q78 58 57 68 Z" fill={C.schnauze} />
      {/* Haarbüschel */}
      <g stroke={C.haar} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M100 17 Q95 7 86 5" />
        <path d="M100 17 Q100 7 101 2" />
        <path d="M100 17 Q106 7 115 5" />
      </g>
      {/* Augen */}
      {closed ? (
        <g stroke={C.tinte} strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M72 54 Q82 42 92 54" />
          <path d="M108 54 Q118 42 128 54" />
        </g>
      ) : (
        <g>
          <ellipse cx="82" cy="50" rx="13" ry="16" fill="#fff" stroke={C.tinte} strokeOpacity="0.15" />
          <ellipse cx="118" cy="50" rx="13" ry="16" fill="#fff" stroke={C.tinte} strokeOpacity="0.15" />
          <circle cx={mood === 'denken' ? 86 : 85} cy={mood === 'denken' ? 48 : 54} r="8.5" fill={C.iris} />
          <circle cx={mood === 'denken' ? 122 : 115} cy={mood === 'denken' ? 48 : 54} r="8.5" fill={C.iris} />
          <circle cx={mood === 'denken' ? 86 : 85} cy={mood === 'denken' ? 48 : 54} r="4.5" fill={C.tinte} />
          <circle cx={mood === 'denken' ? 122 : 115} cy={mood === 'denken' ? 48 : 54} r="4.5" fill={C.tinte} />
          <circle cx={mood === 'denken' ? 88.5 : 87.5} cy={mood === 'denken' ? 45 : 51} r="2.2" fill="#fff" />
          <circle cx={mood === 'denken' ? 124.5 : 117.5} cy={mood === 'denken' ? 45 : 51} r="2.2" fill="#fff" />
        </g>
      )}
      {mood === 'denken' && <path d="M108 30 Q118 24 128 30" stroke={C.haar} strokeWidth="3" fill="none" strokeLinecap="round" />}
      {/* Nase */}
      <ellipse cx="100" cy="75" rx="7.5" ry="5.5" fill={C.tinte} />
      <ellipse cx="97.5" cy="73" rx="2.2" ry="1.4" fill="#fff" opacity="0.7" />
      {/* Mund */}
      {mood === 'denken' ? (
        <path d="M91 94 Q100 98 109 93" stroke={C.tinte} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === 'ruhig' ? (
        <path d="M86 89 Q100 101 114 89" stroke={C.tinte} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M80 86 Q100 114 120 86 Q100 92 80 86 Z" fill="#8A1F2B" stroke={C.tinte} strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="102" cy="99" rx="8" ry="3.8" fill="#FF7F8E" />
          <rect x="94" y="88.5" width="5.8" height="7" rx="1.5" fill="#fff" />
          <rect x="100.2" y="88.5" width="5.8" height="7" rx="1.5" fill="#fff" />
        </g>
      )}
    </g>
  );
}

/** Sprechblase des Maskottchens */
export function LinoSays({ text, mood = 'freude', size = 90 }: { text: string; mood?: LinoMood; size?: number }) {
  return (
    <div className="flex items-end gap-3">
      <Lino mood={mood} size={size} />
      <div className="karte relative mb-6 max-w-md px-5 py-3 font-display text-lg font-medium sm:text-xl" aria-live="polite">
        <span className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 bg-white" aria-hidden />
        {text}
      </div>
    </div>
  );
}
