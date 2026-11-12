import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { effectsOff } from '../../lib/effects';

const COLORS = ['#F5A524', '#2F6FEB', '#12B886', '#F0614E', '#7A5AF8', '#FDD272'];
const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';

/** Konfetti-Regen aus Streifen, Punkten und Sternchen, die beim Fallen tanzen. */
export function Confetti({ show, count = 40 }: { show: boolean; count?: number }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: (i * 37 + (i % 3) * 11) % 100,
    delay: (i % 12) * 0.06,
    drift: ((i * 53) % 120) - 60,
    spin: 360 + ((i * 47) % 540),
    dur: 2 + (i % 6) * 0.25,
    color: COLORS[i % COLORS.length]!,
    kind: i % 5 === 0 ? 'stern' : i % 3 === 0 ? 'punkt' : 'streifen',
    size: 8 + (i % 4) * 3
  })), [count]);
  if (!show || effectsOff()) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-[-24px] block"
          style={{ left: `${p.left}%` }}
          initial={{ y: -24, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: '108vh', x: [0, p.drift, -p.drift / 2, p.drift / 3], rotate: p.spin, opacity: [1, 1, 1, 0.7] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        >
          {p.kind === 'stern' ? (
            <svg viewBox="0 0 24 24" width={p.size + 6} height={p.size + 6}><path d={STAR} fill={p.color} /></svg>
          ) : p.kind === 'punkt' ? (
            <span className="block rounded-full" style={{ width: p.size * 0.8, height: p.size * 0.8, background: p.color }} />
          ) : (
            <span className="block rounded-[2px]" style={{ width: p.size * 0.6, height: p.size * 1.3, background: p.color }} />
          )}
        </motion.span>
      ))}
    </div>
  );
}
