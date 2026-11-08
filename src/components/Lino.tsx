import { motion, useReducedMotion } from 'framer-motion';

export type LinoMood = 'freude' | 'denken' | 'jubel' | 'winken' | 'ruhig';

interface Props {
  mood?: LinoMood;
  size?: number;
  className?: string;
  /** Kein Hüpfen, z. B. in Listen */
  still?: boolean;
}

/** Lino – das eigene Maskottchen von Lernito Kids: ein kleiner Löwe mit Wuschelmähne. */
export function Lino({ mood = 'freude', size = 140, className = '', still = false }: Props) {
  const reduce = useReducedMotion();
  const animate = still || reduce
    ? undefined
    : mood === 'jubel'
      ? { y: [0, -18, 0], rotate: [0, -6, 6, 0] }
      : mood === 'denken'
        ? { rotate: [0, -4, 0] }
        : { y: [0, -6, 0] };
  const eyes = mood === 'jubel' ? 'closed' : 'open';
  return (
    <motion.svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className={className}
      role="img"
      aria-label="Lino, der kleine Löwe"
      animate={animate}
      transition={{ duration: mood === 'jubel' ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Körper */}
      <ellipse cx="100" cy="190" rx="46" ry="26" fill="#FFB627" />
      <ellipse cx="100" cy="196" rx="26" ry="15" fill="#FFF1CC" />
      {/* Arme */}
      {mood === 'jubel' ? (
        <>
          <ellipse cx="44" cy="150" rx="12" ry="24" fill="#FFB627" transform="rotate(-35 44 150)" />
          <ellipse cx="156" cy="150" rx="12" ry="24" fill="#FFB627" transform="rotate(35 156 150)" />
        </>
      ) : (
        <ellipse cx="62" cy="194" rx="12" ry="18" fill="#FFB627" transform="rotate(20 62 194)" />
      )}
      {mood === 'winken' ? (
        <motion.g
          style={{ originX: '150px', originY: '185px' }}
          animate={reduce ? undefined : { rotate: [0, 18, 0] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          <ellipse cx="164" cy="160" rx="12" ry="24" fill="#FFB627" transform="rotate(30 164 160)" />
          <circle cx="174" cy="140" r="11" fill="#FFD166" />
        </motion.g>
      ) : mood !== 'jubel' ? (
        <ellipse cx="138" cy="194" rx="12" ry="18" fill="#FFB627" transform="rotate(-20 138 194)" />
      ) : null}
      <g transform="translate(100 92)">
        {/* Mähne */}
        <g fill="#FF8A3D">
          <circle r="72" />
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 66} cy={Math.sin(a) * 66} r="20" />;
          })}
        </g>
        <g fill="#E8742A" opacity="0.5">
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3;
            return <circle key={i} cx={Math.cos(a) * 58} cy={Math.sin(a) * 58} r="9" />;
          })}
        </g>
        {/* Ohren */}
        <circle cx="-36" cy="-40" r="15" fill="#FFD166" />
        <circle cx="36" cy="-40" r="15" fill="#FFD166" />
        <circle cx="-36" cy="-40" r="7" fill="#FF9F8E" />
        <circle cx="36" cy="-40" r="7" fill="#FF9F8E" />
        {/* Gesicht */}
        <ellipse rx="52" ry="48" fill="#FFD166" />
        {/* Stirn-Locke */}
        <path d="M-6 -46 q6 -12 14 -2" stroke="#FF8A3D" strokeWidth="6" fill="none" strokeLinecap="round" />
        {eyes === 'open' ? (
          <>
            <circle cx="-19" cy="-8" r="8" fill="#2B2D42" />
            <circle cx="19" cy="-8" r="8" fill="#2B2D42" />
            <circle cx="-16" cy="-11" r="2.8" fill="#fff" />
            <circle cx="22" cy="-11" r="2.8" fill="#fff" />
          </>
        ) : (
          <>
            <path d="M-27 -8 q8 -9 16 0" stroke="#2B2D42" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M11 -8 q8 -9 16 0" stroke="#2B2D42" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          </>
        )}
        {mood === 'denken' && <path d="M8 -26 l20 -5" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" />}
        <circle cx="-32" cy="12" r="8" fill="#FF9F8E" opacity="0.7" />
        <circle cx="32" cy="12" r="8" fill="#FF9F8E" opacity="0.7" />
        <ellipse cx="0" cy="14" rx="17" ry="13" fill="#FFF1CC" />
        <path d="M-7 7 h14 l-7 8z" fill="#8B4513" />
        {mood === 'denken' ? (
          <path d="M-8 24 h14" stroke="#2B2D42" strokeWidth="3.5" strokeLinecap="round" />
        ) : mood === 'jubel' ? (
          <path d="M-12 20 q12 16 24 0 z" fill="#B83A26" stroke="#2B2D42" strokeWidth="3" strokeLinejoin="round" />
        ) : (
          <path d="M-10 21 q10 10 20 0" stroke="#2B2D42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )}
      </g>
      {mood === 'denken' && (
        <g fill="#fff" stroke="#2B2D42" strokeWidth="2">
          <circle cx="168" cy="30" r="5" />
          <circle cx="182" cy="16" r="8" />
        </g>
      )}
    </motion.svg>
  );
}

/** Sprechblase von Lino */
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
