import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { sfx } from '../../lib/sound';
import { colorSet } from './colors';

/**
 * Bunte Kachel mit großem Emoji – für Fächer, Spiele und Themen.
 * Oben eine farbige Bühne mit dem Emoji, unten Titel und Untertitel.
 */
export function Tile({ to, onClick, emoji, title, subtitle, color, badge, big, testId, children }: {
  to?: string; onClick?: () => void; emoji: string; title: string; subtitle?: string; color: string; badge?: ReactNode; big?: boolean; testId?: string; children?: ReactNode;
}) {
  const c = colorSet(color);
  const inner = (
    <motion.div whileTap={{ scale: 0.97 }} whileHover={{ y: -3 }} className="karte-3d group relative flex h-full flex-col overflow-hidden">
      <div className={`relative flex items-center justify-center overflow-hidden ${c.soft} ${big ? 'h-28 sm:h-32' : 'h-24'}`} aria-hidden>
        <span className="absolute -left-6 -top-8 h-20 w-20 rounded-full bg-white/40" />
        <span className="absolute -bottom-10 -right-4 h-24 w-24 rounded-full bg-white/30" />
        <span className={`emoji relative transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${big ? 'text-6xl sm:text-7xl' : 'text-5xl'}`}>{emoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <span className="flex w-full items-start justify-between gap-2">
          <span className="min-w-0">
            <span className={`block font-display font-bold leading-tight tracking-tight ${big ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>{title}</span>
            {subtitle && <span className="mt-0.5 block text-sm leading-snug text-tinte/60">{subtitle}</span>}
          </span>
          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${c.soft} ${c.text} transition group-hover:translate-x-0.5`} aria-hidden>
            <ChevronRight size={18} strokeWidth={3} />
          </span>
        </span>
        {children}
      </div>
      {badge && <span className="absolute right-2.5 top-2.5">{badge}</span>}
    </motion.div>
  );
  const focus = 'block h-full rounded-blob focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-himmel-500';
  if (to) return <Link to={to} onClick={() => sfx.tap()} className={focus} data-testid={testId}>{inner}</Link>;
  return <button type="button" onClick={() => { sfx.tap(); onClick?.(); }} className={`${focus} w-full text-left`} data-testid={testId}>{inner}</button>;
}
