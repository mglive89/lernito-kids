import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useActiveProfile } from '../store/useApp';
import { Avatar, colorSet } from './ui';
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 border-tinte/[0.06] bg-white/90 px-4 py-6 backdrop-blur lg:flex" aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <span className="mb-8 flex items-center gap-2.5 px-2 font-display text-2xl font-extrabold tracking-tight">
          <img src={`${base}puppy/kopf.png`} alt="" className="h-11 w-11 rounded-2xl bg-sonne-100 ring-2 ring-sonne-300" />
          <span><span className="text-himmel-500">Lern</span><span className="text-sonne-500">ito</span></span>
        </span>
        <nav className="flex flex-col gap-2">
          {items.map((it) => {
            const on = isNavActive(it, pathname);
            const c = colorSet(it.color);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={`${it.testId}-seite`} aria-current={on ? 'page' : undefined}
                className={`flex items-center gap-4 rounded-2xl px-3 py-2.5 font-display text-base font-bold uppercase tracking-wide transition ${on ? `${c.soft} ${c.text} ring-2 ${c.ring}` : 'text-tinte/60 hover:bg-tinte/[0.04]'}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${on ? `${c.bg} text-white` : 'bg-tinte/[0.04]'}`}>
                  <it.icon size={22} strokeWidth={on ? 2.6 : 2.2} />
                </span>
                {it.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          {profile && (
            <NavLink to="/profil" className="flex items-center gap-3 rounded-2xl bg-creme px-3 py-2.5 hover:bg-tinte/[0.05]">
              <Avatar config={profile.avatar} size={40} />
              <span className="truncate font-bold">{profile.name}</span>
            </NavLink>
          )}
          <NavLink to="/eltern" className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-tinte/55 hover:bg-tinte/[0.04]"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</NavLink>
        </div>
      </aside>

      <div className="pb-24 lg:pb-0"><Outlet /></div>

      {/* Tab-Leiste */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-tinte/[0.06] bg-white/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'var(--safe-bottom)' }} aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <div className="mx-auto grid max-w-xl grid-cols-5 px-1 pb-1 pt-1.5">
          {items.map((it) => {
            const on = isNavActive(it, pathname);
            const c = colorSet(it.color);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={it.testId} aria-current={on ? 'page' : undefined}
                className="flex min-w-0 flex-col items-center gap-0.5 rounded-xl py-1 text-[10.5px] font-extrabold uppercase tracking-wide sm:text-[11px]">
                <span className={`flex h-9 w-12 items-center justify-center rounded-2xl transition ${on ? `${c.bg} text-white ${c.edge} -translate-y-0.5` : 'text-tinte/40'}`}>
                  <it.icon size={22} strokeWidth={on ? 2.6 : 2.2} />
                </span>
                <span className={`max-w-full truncate ${on ? c.text : 'text-tinte/45'}`}>{it.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
