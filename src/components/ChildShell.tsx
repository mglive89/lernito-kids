import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useActiveProfile } from '../store/useApp';
import { motion } from 'framer-motion';
import { Avatar, PageTransition } from './ui';
import { profileLabel } from '../school/systems';
import { L } from '../i18n';
import { sfx } from '../lib/sound';
import { childNavItems, isNavActive } from '../app/navigation';

/**
 * Rahmen des Kinderbereichs: Seitenleiste (Desktop) bzw. Tab-Leiste unten (Smartphone/Tablet).
 * Lektionen und Theorie laufen bewusst ohne diesen Rahmen (voller Fokus).
 */
export function ChildShell() {
  const { profile } = useActiveProfile();
  const { pathname } = useLocation();
  const items = childNavItems(profile?.year ?? 0);
  const base = import.meta.env.BASE_URL;

  return (
    <div className="kinder-hintergrund min-h-[100dvh] lg:pl-64">
      {/* Seitenleiste */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-tinte/[0.07] bg-flaeche px-4 py-6 lg:flex" aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <span className="mb-8 flex items-center gap-2.5 px-2 font-display text-xl font-extrabold tracking-tight">
          <img src={`${base}puppy/kopf.png`} alt="" className="h-10 w-10 rounded-xl bg-sonne-100" />
          <span>Lernito<span className="ml-1 rounded-md bg-sonne-100 px-1.5 py-0.5 align-middle text-xs font-bold text-sonne-700">Kids</span></span>
        </span>
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const on = isNavActive(it, pathname);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={`${it.testId}-seite`} aria-current={on ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition isolate ${on ? 'text-himmel-700' : 'text-tinte/65 hover:bg-tinte/[0.04] hover:text-tinte'}`}>
                {on && <motion.span layoutId="nav-seite" className="absolute inset-0 -z-10 rounded-xl bg-himmel-50" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                {on && <motion.span layoutId="nav-seite-strich" className="absolute -left-4 bottom-2 top-2 w-1 rounded-r-full bg-himmel-500" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                <it.icon size={20} strokeWidth={on ? 2.4 : 2} />
                {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-tinte/[0.07] pt-4">
          {profile && (
            <NavLink to="/profil" className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-tinte/[0.04]">
              <Avatar config={profile.avatar} size={36} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{profile.name}</span>
                <span className="block truncate text-xs text-tinte/55">{profileLabel(profile)}</span>
              </span>
            </NavLink>
          )}
          <NavLink to="/eltern" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-tinte/55 hover:bg-tinte/[0.04]"><Lock size={16} /> {L('Elternbereich', 'Area genitori')}</NavLink>
        </div>
      </aside>

      <div className="pb-24 lg:pb-0"><PageTransition id={pathname}><Outlet /></PageTransition></div>

      {/* Tab-Leiste */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'var(--safe-bottom)' }} aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <div className="mx-auto grid max-w-xl grid-cols-5 px-1">
          {items.map((it) => {
            const on = isNavActive(it, pathname);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={it.testId} aria-current={on ? 'page' : undefined}
                className={`relative flex min-w-0 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-semibold transition ${on ? 'text-himmel-600' : 'text-tinte/50'}`}>
                {on && <motion.span layoutId="nav-tab" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-himmel-500" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden />}
                <motion.span animate={on ? { y: -1, scale: 1.08 } : { y: 0, scale: 1 }} whileTap={{ scale: 0.88 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }} className="flex">
                  <it.icon size={22} strokeWidth={on ? 2.4 : 2} />
                </motion.span>
                <span className="max-w-full truncate">{it.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
