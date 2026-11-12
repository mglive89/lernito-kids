import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { burstAt } from '../lib/effects';
import { sfx } from '../lib/sound';
import { L } from '../i18n';
import { MASCOT_NAME } from '../content/mascot';

/** Puppy zum Antippen: hüpft und verschickt Herzchen. */
export function PuppyTap({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.button type="button" data-keine-funken className={`cursor-pointer rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-white/70 ${className}`}
      aria-label={L(`${MASCOT_NAME} streicheln`, `Accarezza ${MASCOT_NAME}`)}
      whileTap={{ scale: 0.92, rotate: -4 }} whileHover={{ rotate: 2 }}
      onClick={(e) => { sfx.tap(); burstAt(e.currentTarget, 'herzen', 9); }}>
      {children}
    </motion.button>
  );
}
