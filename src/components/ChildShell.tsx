import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpenCheck, Home, Lock, Trophy, UserRound } from 'lucide-react';
import { useActiveProfile } from '../store/useApp';
import { Avatar } from './ui';
import { L } from '../i18n';
import { sfx } from '../lib/sound';

interface Item { to: string; label: string; icon: typeof Home; match: string[]; testId: string }

/**
 * Rahmen des Kinderbereichs: Seitenleiste (Desktop) bzw. Tab-Leiste unten (Smartphone/Tablet).
 * Lektionen und Theorie laufen bewusst ohne diesen Rahmen (voller Fokus).
 */
export function ChildShell() {
  const { profile } = useActiveProfile();
  const { pathname } = useLocation();
  const kita = (profile?.year ?? 0) === 0;
  const items: Item[] = [
    { to: '/home', label: L('Lernen', 'Impara'), icon: Home, match: ['/home'], testId: 'nav-home' },
    { to: kita ? '/kita' : `/schule?jahr=${profile?.year ?? 1}`, label: kita ? L('Spiele', 'Giochi') : L('Fächer', 'Materie'), icon: BookOpenCheck, match: ['/schule', '/kita', '/welt3d', '/videos'], testId: 'nav-faecher' },
    { to: '/erfolge', label: L('Erfolge', 'Traguardi'), icon: Trophy, match: ['/erfolge', '/sterne', '/abenteuer'], testId: 'nav-erfolge' },
    { to: '/profil', label: L('Profil', 'Profilo'), icon: UserRound, match: ['/profil', '/avatar', '/minispiele'], testId: 'nav-profil' }
  ];
  const active = (it: Item) => it.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));

  return (
    <div className="min-h-[100dvh] lg:pl-64">
      {/* Seitenleiste */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-tinte/[0.07] bg-white/90 px-4 py-6 backdrop-blur lg:flex" aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <span className="mb-8 flex items-center gap-2 px-3 font-display text-2xl font-extrabold tracking-tight text-himmel-700">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-9 w-9" /> Lernito
        </span>
        <nav className="flex flex-col gap-1.5">
          {items.map((it) => (
            <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={`${it.testId}-seite`} aria-current={active(it) ? 'page' : undefined}
              className={`flex items-center gap-4 rounded-2xl px-4 py-3 font-display text-base font-bold uppercase tracking-wide transition ${active(it) ? 'bg-himmel-50 text-himmel-700 ring-2 ring-himmel-300' : 'text-tinte/60 hover:bg-tinte/[0.04]'}`}>
              <it.icon size={26} strokeWidth={active(it) ? 2.6 : 2} /> {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          {profile && (
            <NavLink to="/profil" className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-tinte/[0.04]">
              <Avatar config={profile.avatar} size={40} />
              <span className="truncate font-bold">{profile.name}</span>
            </NavLink>
          )}
          <NavLink to="/eltern" className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-tinte/55 hover:bg-tinte/[0.04]"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</NavLink>
        </div>
      </aside>

      <div className="pb-24 lg:pb-0"><Outlet /></div>

      {/* Tab-Leiste */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-tinte/[0.08] bg-white/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'var(--safe-bottom)' }} aria-label={L('Hauptnavigation', 'Navigazione principale')}>
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-1.5">
          {items.map((it) => {
            const on = active(it);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={it.testId} aria-current={on ? 'page' : undefined}
                className="flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-bold uppercase tracking-wide">
                <span className={`flex h-9 w-14 items-center justify-center rounded-xl transition ${on ? 'bg-himmel-50 text-himmel-700 ring-2 ring-himmel-300' : 'text-tinte/45'}`}>
                  <it.icon size={24} strokeWidth={on ? 2.6 : 2} />
                </span>
                <span className={on ? 'text-himmel-700' : 'text-tinte/50'}>{it.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
