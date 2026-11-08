import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Star, Volume2, VolumeX, X } from 'lucide-react';
import { L } from '../i18n';
import { onVoicesChanged, speak, speechStatus, type SpeechStatus } from '../lib/speech';
import { sfx } from '../lib/sound';
import type { AvatarConfig } from '../store/useApp';
import { AVATAR_EXTRAS } from '../learning/rewards';

export const COLOR_CLASSES: Record<string, { bg: string; soft: string; text: string; ring: string }> = {
  sonne: { bg: 'bg-sonne-500', soft: 'bg-sonne-100', text: 'text-sonne-700', ring: 'ring-sonne-500' },
  himmel: { bg: 'bg-himmel-500', soft: 'bg-himmel-100', text: 'text-himmel-700', ring: 'ring-himmel-500' },
  minze: { bg: 'bg-minze-500', soft: 'bg-minze-100', text: 'text-minze-700', ring: 'ring-minze-500' },
  koralle: { bg: 'bg-koralle-500', soft: 'bg-koralle-100', text: 'text-koralle-700', ring: 'ring-koralle-500' },
  lila: { bg: 'bg-lila-500', soft: 'bg-lila-100', text: 'text-lila-700', ring: 'ring-lila-500' }
};

export function TopBar({ title, back, right, stars }: { title?: string; back?: string | number; right?: ReactNode; stars?: number }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-tinte/[0.06] bg-creme/85 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {back !== undefined && (
          <button
            className="knopf h-12 w-12 shrink-0 bg-white px-0"
            onClick={() => { sfx.tap(); typeof back === 'number' ? nav(back) : nav(back); }}
            aria-label={L('Zurück', 'Indietro')}
          >
            <ArrowLeft size={24} />
          </button>
        )}
        {title && <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>}
        {!title && <div className="flex-1" />}
        {stars !== undefined && <StarCount n={stars} />}
        {right}
      </div>
    </header>
  );
}

export function StarCount({ n }: { n: number }) {
  return (
    <Link to="/sterne" className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-display text-lg font-bold shadow-weich ring-1 ring-tinte/5" aria-label={L(`${n} Sterne`, `${n} stelle`)}>
      <Star className="fill-sonne-500 text-sonne-500" size={22} aria-hidden />
      <span>{n}</span>
    </Link>
  );
}

export function useSpeechStatus(): SpeechStatus {
  const [status, setStatus] = useState<SpeechStatus>(() => speechStatus());
  useEffect(() => onVoicesChanged(() => setStatus(speechStatus())), []);
  return status;
}

export function SpeakButton({ text, enabled = true, size = 'md', label }: { text: string; enabled?: boolean; size?: 'md' | 'lg'; label?: string }) {
  label = label ?? L('Vorlesen', 'Leggi ad alta voce');
  const status = useSpeechStatus();
  const available = status !== 'keine' && enabled;
  const dim = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  return (
    <button
      type="button"
      className={`knopf ${dim} shrink-0 px-0 ${available ? 'bg-himmel-100 text-himmel-700' : 'bg-white'}`}
      onClick={() => available && speak(text, { force: true })}
      aria-label={available ? `${label}: ${text}` : enabled ? L('Vorlesen ist auf diesem Gerät nicht verfügbar', 'La lettura ad alta voce non è disponibile su questo dispositivo') : L('Vorlesen ist ausgeschaltet', 'La lettura ad alta voce è disattivata')}
      title={available ? (status === 'offline' ? L('Vorlesen (funktioniert offline)', 'Leggi (funziona offline)') : L('Vorlesen (benötigt evtl. Internet)', 'Leggi (potrebbe servire Internet)')) : L('Vorlesen nicht verfügbar', 'Lettura non disponibile')}
      disabled={!available}
    >
      {available ? <Volume2 size={size === 'lg' ? 32 : 26} /> : <VolumeX size={26} />}
    </button>
  );
}

export function Tile({ to, onClick, emoji, title, subtitle, color, badge, big, testId, children }: {
  to?: string; onClick?: () => void; emoji: string; title: string; subtitle?: string; color: string; badge?: ReactNode; big?: boolean; testId?: string; children?: ReactNode;
}) {
  const c = COLOR_CLASSES[color] ?? COLOR_CLASSES.sonne!;
  const inner = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={`karte group relative flex h-full flex-col items-start gap-3 overflow-hidden p-5 transition-shadow hover:shadow-lg ${big ? 'min-h-[11rem] sm:min-h-[12rem]' : 'min-h-[8.5rem]'}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${c.bg}`} aria-hidden />
      <span className={`flex items-center justify-center rounded-2xl ${c.soft} ${big ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-14 w-14'}`} aria-hidden>
        <span className={`emoji ${big ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>{emoji}</span>
      </span>
      <span className="flex w-full items-end justify-between gap-2">
        <span className="min-w-0">
          <span className={`block font-display font-bold leading-tight tracking-tight ${big ? 'text-xl sm:text-2xl' : 'text-lg'}`}>{title}</span>
          {subtitle && <span className="mt-0.5 block text-sm leading-snug text-tinte/60">{subtitle}</span>}
        </span>
        <ChevronRight className={`shrink-0 ${c.text} opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100`} size={22} aria-hidden />
      </span>
      {children}
      {badge && <span className="absolute right-3 top-3">{badge}</span>}
    </motion.div>
  );
  if (to) return <Link to={to} onClick={() => sfx.tap()} className="block rounded-blob focus-visible:outline focus-visible:outline-4 focus-visible:outline-himmel-500" data-testid={testId}>{inner}</Link>;
  return <button type="button" onClick={() => { sfx.tap(); onClick?.(); }} className="block w-full rounded-blob text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-himmel-500" data-testid={testId}>{inner}</button>;
}

export function ProgressBar({ value, color = 'bg-minze-500', label }: { value: number; color?: string; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-tinte/[0.08]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 80, damping: 18 }} />
    </div>
  );
}

export function Avatar({ config, size = 64, className = '' }: { config: AvatarConfig; size?: number; className?: string }) {
  const extra = AVATAR_EXTRAS.find((e) => e.id === config.extra);
  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-full ${className}`} style={{ width: size, height: size, background: config.color }} aria-hidden>
      <span className="emoji" style={{ fontSize: size * 0.58 }}>{config.animal}</span>
      {extra?.emoji && (
        <span className="emoji absolute" style={{ fontSize: size * 0.36, top: extra.id === 'brille' ? size * 0.3 : -size * 0.12, right: extra.id === 'brille' ? undefined : -size * 0.04 }}>
          {extra.emoji}
        </span>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, children, labelledBy = 'modal-titel' }: { open: boolean; onClose?: () => void; title: string; children: ReactNode; labelledBy?: string }) {
  useEffect(() => {
    if (!open || !onClose) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-tinte/40 p-3 sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby={labelledBy}
            className="karte max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
            initial={{ y: 40, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, opacity: 0 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id={labelledBy} className="font-display text-2xl font-bold">{title}</h2>
              {onClose && <button className="rounded-full p-2 hover:bg-tinte/5" onClick={onClose} aria-label={L('Schließen', 'Chiudi')}><X /></button>}
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return <h2 id={id} className="mb-3 mt-8 font-display text-xl font-bold tracking-tight sm:text-2xl">{children}</h2>;
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' | 'ok' }) {
  const cls = tone === 'warn' ? 'bg-koralle-50 border-koralle-300' : tone === 'ok' ? 'bg-minze-50 border-minze-300' : 'bg-himmel-50 border-himmel-300';
  return <div className={`rounded-2xl border px-4 py-3 text-base ${cls}`}>{children}</div>;
}

export function Toggle({ checked, onChange, label, description, disabled, testId }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: ReactNode; disabled?: boolean; testId?: string }) {
  return (
    <label className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-tinte/[0.06] ${disabled ? 'opacity-60' : ''}`}>
      <span>
        <span className="block text-lg font-bold">{label}</span>
        {description && <span className="block text-sm text-tinte/70">{description}</span>}
      </span>
      <input type="checkbox" role="switch" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} data-testid={testId} />
      <span className={`relative mt-1 h-8 w-14 shrink-0 rounded-full transition ${checked ? 'bg-minze-500' : 'bg-tinte/20'} peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-himmel-500`} aria-hidden>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'left-7' : 'left-1'}`} />
      </span>
    </label>
  );
}
