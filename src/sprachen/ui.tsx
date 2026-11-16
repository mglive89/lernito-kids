/**
 * Bausteine der App „Lernito Sprachen“.
 *
 * Aufbau und Komponenten übernommen und angepasst aus „duolingo-clone“ von Sanidhya Kumar Verma
 * (MIT-Lizenz, © 2024, siehe THIRD_PARTY_LICENSES.md): Sidebar, SidebarItem, UserProgress,
 * StickyWrapper, FeedWrapper, Quests, Header, Unit, UnitBanner, LessonButton, Kurskarte, Laden.
 * Statt Server, Login und Bezahldienst laufen hier lokale Daten; Farben, Bilder und Maskottchen sind
 * die von Lernito (Puppy).
 */
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Crown, Flame, Heart, Lock, Mic, NotebookText, Star, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { L, tr } from '../i18n';
import { sfx } from '../lib/sound';
import { ProgressRing } from '../components/ui';
import type { Course } from '../lingue/course';
import { QUESTS, type LangPlay } from '../lingue/play-state';

const BASE = import.meta.env.BASE_URL;
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------- Button (Varianten wie im Original, Lernito-Farben) ---------- */
const VARIANTS = {
  default: 'bg-flaeche text-tinte/60 border-2 border-b-4 border-tinte/15 active:border-b-2 hover:bg-tinte/[0.03]',
  locked: 'bg-tinte/[0.08] text-tinte/35 border-b-4 border-tinte/20 active:border-b-0',
  primary: 'bg-himmel-500 text-white border-b-4 border-himmel-700 active:border-b-0 hover:bg-himmel-500/90',
  primaryOutline: 'bg-flaeche text-himmel-600 hover:bg-tinte/[0.03]',
  secondary: 'bg-minze-500 text-white border-b-4 border-minze-700 active:border-b-0 hover:bg-minze-500/90',
  danger: 'bg-koralle-500 text-white border-b-4 border-koralle-600 active:border-b-0',
  super: 'bg-lila-600 text-white border-b-4 border-lila-700 active:border-b-0',
  ghost: 'bg-transparent text-tinte/60 hover:bg-tinte/[0.05]',
  sidebar: 'bg-transparent text-tinte/60 border-2 border-transparent hover:bg-tinte/[0.04]',
  sidebarOutline: 'bg-minze-50 text-minze-700 border-2 border-minze-300'
} as const;
const SIZES = { default: 'h-11 px-4 py-2', sm: 'h-9 px-3', lg: 'h-12 px-8', icon: 'h-10 w-10', rounded: 'rounded-full' } as const;
export type ButtonVariant = keyof typeof VARIANTS;
export const buttonClass = (variant: ButtonVariant = 'default', size: keyof typeof SIZES = 'default', extra = '') =>
  cn('inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm', size !== 'rounded' && 'rounded-xl', 'font-bold uppercase tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-50', VARIANTS[variant], SIZES[size], extra);

export function Button({ variant = 'default', size = 'default', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: keyof typeof SIZES }) {
  return <button type="button" className={buttonClass(variant, size, className)} {...p} />;
}

/* ---------- Sidebar ---------- */
export interface NavItem { to: string; icon: LucideIcon; label: string; testId: string; match: (p: string) => boolean }

export function Brand() {
  return (
    <span className="flex items-center gap-x-3">
      <img src={`${BASE}puppy/kopf.png`} alt="" className="h-10 w-10 rounded-xl bg-minze-100" />
      <span className="font-display text-2xl font-extrabold tracking-wide text-minze-700">
        Lernito <span className="text-tinte/70">{L('Sprachen', 'Lingue')}</span>
      </span>
    </span>
  );
}

export function SidebarItem({ item }: { item: NavItem }) {
  const { pathname } = useLocation();
  const on = item.match(pathname);
  return (
    <NavLink to={item.to} onClick={() => sfx.tap()} data-testid={`${item.testId}-seite`} aria-current={on ? 'page' : undefined}
      className={buttonClass(on ? 'sidebarOutline' : 'sidebar', 'default', 'h-[52px] justify-start')}>
      <item.icon size={28} className="mr-3" strokeWidth={on ? 2.4 : 2} /> {item.label}
    </NavLink>
  );
}

export function Sidebar({ items, footer }: { items: NavItem[]; footer?: ReactNode }) {
  return (
    <aside className="left-0 top-0 z-30 hidden h-full flex-col border-r-2 border-tinte/[0.07] bg-flaeche px-4 lg:fixed lg:flex lg:w-[256px]" aria-label={L('Navigation', 'Navigazione')}>
      <Link to="/lernen" className="flex items-center pb-7 pl-2 pt-8"><Brand /></Link>
      <nav className="flex flex-1 flex-col gap-y-2">
        {items.map((it) => <SidebarItem key={it.testId} item={it} />)}
      </nav>
      <div className="p-2 pb-6">{footer}</div>
    </aside>
  );
}

/* ---------- Wrapper ---------- */
export function StickyWrapper({ children }: PropsWithChildren) {
  return (
    <div className="sticky bottom-6 hidden w-[368px] shrink-0 self-end lg:block">
      <div className="sticky top-6 flex min-h-[calc(100vh-48px)] flex-col gap-y-4">{children}</div>
    </div>
  );
}
export function FeedWrapper({ children }: PropsWithChildren) {
  return <div className="relative top-0 min-w-0 flex-1 pb-10">{children}</div>;
}
/** Seitenaufbau: rechte Spalte (Fortschritt) und Inhalt */
export function PageLayout({ side, children }: { side: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-row-reverse gap-[48px] px-4 sm:px-6">
      <StickyWrapper>{side}</StickyWrapper>
      <FeedWrapper>{children}</FeedWrapper>
    </div>
  );
}

/* ---------- UserProgress ---------- */
export function UserProgress({ course, hearts, stars }: { course?: Course; hearts: number; stars: number }) {
  return (
    <div className="flex w-full items-center justify-between gap-x-2" data-testid="user-progress">
      <Link to="/lingue" className={buttonClass('ghost')} aria-label={L('Kurs wechseln', 'Cambia corso')}>
        <span className="emoji text-3xl" aria-hidden>{course?.flag ?? '🌍'}</span>
      </Link>
      <Link to="/laden" className={buttonClass('ghost', 'default', 'text-sonne-700')} aria-label={L(`${stars} Sterne`, `${stars} stelle`)}>
        <Star size={24} className="fill-sonne-500 text-sonne-500" /> {stars}
      </Link>
      <Link to="/laden" className={buttonClass('ghost', 'default', 'text-koralle-600')} aria-label={L(`${hearts} Herzen`, `${hearts} cuori`)} data-testid="herzen" data-hearts={hearts}>
        <Heart size={22} className="fill-koralle-500 text-koralle-500" /> {hearts}
      </Link>
    </div>
  );
}

/* ---------- Quests (Seitenspalte) ---------- */
export function QuestsMini({ play }: { play: LangPlay }) {
  return (
    <div className="space-y-4 rounded-xl border-2 border-tinte/10 bg-flaeche p-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="font-display text-lg font-bold">{L('Missionen', 'Missioni')}</h3>
        <Link to="/missionen" className={buttonClass('primaryOutline', 'sm')}>{L('Alle', 'Vedi tutte')}</Link>
      </div>
      <ul className="w-full space-y-4">
        {QUESTS.map((q) => {
          const v = Math.min(q.goal, q.value(play));
          return (
            <li key={q.id} className="flex w-full items-center gap-x-3">
              <Flame size={30} className={v >= q.goal ? 'text-sonne-500' : 'text-tinte/25'} />
              <div className="flex w-full flex-col gap-y-2">
                <p className="text-sm font-bold text-tinte/80">{tr(q.title())}</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-tinte/[0.08]"><div className="h-full rounded-full bg-sonne-500" style={{ width: `${(v / q.goal) * 100}%` }} /></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Kopfzeile des Lernpfads ---------- */
export function Header({ title }: { title: string }) {
  return (
    <div className="sticky top-[58px] z-10 mb-5 flex items-center justify-between border-b-2 border-tinte/[0.07] bg-creme pb-3 text-tinte/45 lg:top-0 lg:-mt-6 lg:pt-6">
      <Link to="/lingue" className={buttonClass('ghost', 'sm')} aria-label={L('Kurse', 'Corsi')}><ArrowLeft size={20} /></Link>
      <h1 className="font-display text-lg font-bold text-tinte/70" data-testid="kurs-titel">{title}</h1>
      <div aria-hidden className="w-9" />
    </div>
  );
}

/* ---------- Einheit ---------- */
const BANNER: Record<string, string> = {
  sonne: 'bg-sonne-500 text-tinte', himmel: 'bg-himmel-600 text-white', minze: 'bg-minze-600 text-white', koralle: 'bg-koralle-500 text-white', lila: 'bg-lila-600 text-white'
};
export function UnitBanner({ title, description, color, theoryTo, continueTo, testId }: { title: string; description: string; color: string; theoryTo: string; continueTo?: string; testId?: string }) {
  return (
    <div className={`flex w-full items-center justify-between gap-3 rounded-xl p-5 ${BANNER[color] ?? BANNER.minze}`}>
      <div className="min-w-0 space-y-2.5">
        <h3 className="font-display text-2xl font-bold leading-tight">{title}</h3>
        <p className="text-lg opacity-90">{description}</p>
      </div>
      <div className="flex shrink-0 flex-col gap-2">
        <Link to={theoryTo} className={buttonClass('default', 'lg', 'px-4 text-tinte/70')} data-testid={testId}>
          <BookOpen size={20} /> <span className="hidden sm:inline">{L('Theorie', 'Teoria')}</span>
        </Link>
        {continueTo && (
          <Link to={continueTo} className={buttonClass('default', 'lg', 'hidden px-4 text-tinte/70 xl:flex')}>
            <NotebookText size={20} /> {L('Weiter', 'Continua')}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Knopf einer Lektion auf dem Pfad (Einrückung wie im Original: 8er-Zyklus). */
export function LessonButton({ index, totalCount, locked, current, completed, percentage, to, label, icon, testId, onLocked, onBlocked }: {
  index: number; totalCount: number; locked: boolean; current: boolean; completed: boolean; percentage: number; to: string; label: string;
  icon?: 'mic' | 'flame'; testId: string; onLocked: () => void; onBlocked?: () => void;
}) {
  const cycleIndex = index % 8;
  let indentationLevel: number;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;
  const rightPosition = indentationLevel * 40;
  const isFirst = index === 0;
  const isLast = index === totalCount;
  const Icon = completed ? Check : isLast ? Crown : icon === 'mic' ? Mic : icon === 'flame' ? Flame : locked ? Lock : Star;
  const iconCls = cn('h-10 w-10', locked ? 'text-tinte/35' : 'text-white', !completed && !locked && Icon === Star && 'fill-white', completed && 'stroke-[4]');
  const circle = (
    <span className={buttonClass(locked ? 'locked' : 'secondary', 'rounded', 'h-[70px] w-[70px] border-b-8')}>
      <Icon className={iconCls} />
    </span>
  );
  const body = (
    <div className="relative" style={{ right: `${rightPosition}px`, marginTop: isFirst && !completed ? 60 : 24 }}>
      {current ? (
        <div className="relative flex h-[102px] w-[102px] items-center justify-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -top-6 left-2.5 z-10 rounded-xl border-2 border-tinte/10 bg-flaeche px-3 py-2.5 font-bold uppercase tracking-wide text-minze-600">
            {L('Start', 'Inizia')}
            <span className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-flaeche" aria-hidden />
          </motion.div>
          <span className="absolute inset-0"><ProgressRing value={Number.isNaN(percentage) ? 0 : percentage} size={102} stroke={8} color="#14B8A6" /></span>
          <span className="relative">{circle}</span>
        </div>
      ) : circle}
    </div>
  );
  if (locked) {
    return <button type="button" onClick={onLocked} aria-label={`${label} (${L('gesperrt', 'bloccata')})`} data-testid={testId} className="block">{body}</button>;
  }
  return (
    <Link to={to} aria-label={completed ? `${label} (${L('erledigt', 'completata')})` : label} data-testid={testId}
      onClick={(e) => { sfx.tap(); if (onBlocked) { e.preventDefault(); onBlocked(); } }}>
      {body}
    </Link>
  );
}

/* ---------- Kurskarte ---------- */
export function CourseCard({ course, active, progress, onClick }: { course: Course; active: boolean; progress: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} data-testid={`kurs-${course.id}`}
      className="flex h-full min-h-[200px] w-full cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-b-[4px] border-tinte/10 bg-flaeche p-3 pb-6 hover:bg-tinte/[0.03] active:border-b-2">
      <span className="flex min-h-[24px] w-full items-center justify-end">
        {active && <span className="flex items-center justify-center rounded-md bg-minze-600 p-1.5"><Check className="h-4 w-4 stroke-[4] text-white" /></span>}
      </span>
      <span className="emoji text-6xl drop-shadow-md" aria-hidden>{course.flag}</span>
      <span className="mt-3 text-center">
        <span className="block font-bold text-tinte/80">{course.name()}</span>
        <span className="block text-sm text-tinte/50">{course.native} · {progress}</span>
      </span>
    </button>
  );
}
