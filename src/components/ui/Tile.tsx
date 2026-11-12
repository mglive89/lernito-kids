import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sfx } from '../../lib/sound';
import { colorSet } from './colors';

/**
 * Kachel für Fächer, Spiele und Themen: Symbol (Icon oder Emoji) in Fachfarbe, Titel, Untertitel.
 */
export function Tile({ to, onClick, emoji, icon, title, subtitle, color, badge, big, testId, children }: {
  to?: string; onClick?: () => void; emoji?: string; icon?: ReactNode; title: string; subtitle?: string; color: string; badge?: ReactNode; big?: boolean; testId?: string; children?: ReactNode;
}) {
  const c = colorSet(color);
  const inner = (
    <motion.div whileTap={{ scale: 0.98 }} className="karte-3d relative flex h-full flex-col gap-3 p-4 transition-transform duration-200 group-hover:-translate-y-1 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {icon ?? (
            <span className={`emoji flex shrink-0 items-center justify-center rounded-2xl ${c.soft} ${big ? 'h-16 w-16 text-4xl' : 'h-14 w-14 text-3xl'}`} aria-hidden>{emoji}</span>
          )}
        </span>
        {badge}
      </div>
      <div className="min-w-0 flex-1">
        <span className={`block font-display font-bold leading-snug tracking-tight ${big ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}>{title}</span>
        {subtitle && <span className="mt-0.5 block text-sm leading-snug text-tinte/55">{subtitle}</span>}
      </div>
      {children}
      <span className={`absolute bottom-4 right-4 hidden ${c.text} opacity-0 transition group-hover:opacity-100 sm:block`} aria-hidden><ArrowRight size={18} /></span>
    </motion.div>
  );
  const cls = 'group block h-full rounded-blob focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-himmel-500';
  if (to) return <Link to={to} onClick={() => sfx.tap()} className={cls} data-testid={testId}>{inner}</Link>;
  return <button type="button" onClick={() => { sfx.tap(); onClick?.(); }} className={`${cls} w-full text-left`} data-testid={testId}>{inner}</button>;
}
