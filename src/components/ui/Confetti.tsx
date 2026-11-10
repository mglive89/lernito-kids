import { motion } from 'framer-motion';

const CONFETTI_COLORS = ['#FFB020', '#2F7DEB', '#14B8A6', '#F25F4C', '#7C5CFA'];
export function Confetti({ show, count = 40 }: { show: boolean; count?: number }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const left = (i * 37) % 100;
        const delay = (i % 10) * 0.05;
        return (
          <motion.span
            key={i}
            className="absolute top-[-20px] block h-3 w-2 rounded-sm"
            style={{ left: `${left}%`, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{ y: '105vh', rotate: 360 + i * 20, opacity: [1, 1, 0.6] }}
            transition={{ duration: 1.8 + (i % 5) * 0.2, delay, ease: 'easeIn' }}
          />
        );
      })}
    </div>
  );
}
