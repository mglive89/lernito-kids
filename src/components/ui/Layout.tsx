import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/** Abschnittsüberschrift, optional mit Aktion rechts (z. B. „Alle“). */
export function SectionTitle({ children, id, action }: { children: ReactNode; id?: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between gap-3">
      <h2 id={id} className="font-display text-xl font-bold tracking-tight sm:text-2xl">{children}</h2>
      {action}
    </div>
  );
}

/** Fortschrittsbalken mit Federanimation. */
export function ProgressBar({ value, color = 'bg-minze-500', label, track = 'bg-tinte/[0.08]' }: { value: number; color?: string; label?: string; track?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full ${track}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <motion.div className={`relative h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }}>
        {pct > 6 && <span className="absolute inset-x-1.5 top-[3px] h-[3px] rounded-full bg-white/35" aria-hidden />}
      </motion.div>
    </div>
  );
}

/** Kreisförmige Fortschrittsanzeige, z. B. für das Tagesziel. */
export function ProgressRing({ value, size = 64, stroke = 8, color = '#14B8A6', children, label }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode; label?: string }) {
  const pct = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const u = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="progressbar" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(31,35,64,0.08)" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={u} initial={{ strokeDashoffset: u }} animate={{ strokeDashoffset: u * (1 - pct) }} transition={{ type: 'spring', stiffness: 60, damping: 18 }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">{children}</span>
    </div>
  );
}

/** Seitenkopf der Übersichtsseiten: großer Titel, Untertitel und Bild rechts. */
export function PageHero({ eyebrow, title, subtitle, art, color = 'himmel', children }: { eyebrow?: string; title: string; subtitle?: string; art?: ReactNode; color?: 'himmel' | 'minze' | 'koralle' | 'sonne' | 'lila'; children?: ReactNode }) {
  const tone = {
    himmel: 'from-himmel-500 to-lila-500 text-white',
    minze: 'from-minze-500 to-himmel-500 text-white',
    koralle: 'from-koralle-500 to-sonne-500 text-white',
    sonne: 'from-sonne-300 to-sonne-500 text-tinte',
    lila: 'from-lila-500 to-koralle-500 text-white'
  }[color];
  return (
    <section className={`relative mt-4 overflow-hidden rounded-blob bg-gradient-to-br p-5 shadow-karte sm:p-7 ${tone}`}>
      <span className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/15" aria-hidden />
      <span className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10" aria-hidden />
      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="text-xs font-extrabold uppercase tracking-[0.14em] opacity-80">{eyebrow}</p>}
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-base opacity-90 sm:text-lg">{subtitle}</p>}
          {children}
        </div>
        {art && <div className="shrink-0">{art}</div>}
      </div>
    </section>
  );
}
