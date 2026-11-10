import { BookOpenCheck, Compass, Home, Trophy, UserRound, type LucideIcon } from 'lucide-react';
import { L } from '../i18n';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Pfade, bei denen der Eintrag als aktiv gilt */
  match: string[];
  testId: string;
  /** Farbe des aktiven Eintrags (Tailwind-Farbname) */
  color: 'himmel' | 'minze' | 'koralle' | 'sonne' | 'lila';
}

/** Hauptnavigation des Kinderbereichs – eine Quelle für Tab-Leiste und Seitenleiste. */
export function childNavItems(year: number): NavItem[] {
  const kita = year === 0;
  return [
    { to: '/home', label: L('Lernen', 'Impara'), icon: Home, match: ['/home'], testId: 'nav-home', color: 'himmel' },
    { to: kita ? '/kita' : `/schule?jahr=${year || 1}`, label: kita ? L('Spiele', 'Giochi') : L('Fächer', 'Materie'), icon: BookOpenCheck, match: ['/schule', '/kita'], testId: 'nav-faecher', color: 'minze' },
    { to: '/entdecken', label: L('Entdecken', 'Scopri'), icon: Compass, match: ['/entdecken', '/welt3d', '/videos', '/minispiele', '/abenteuer'], testId: 'nav-entdecken', color: 'koralle' },
    { to: '/erfolge', label: L('Erfolge', 'Traguardi'), icon: Trophy, match: ['/erfolge', '/sterne'], testId: 'nav-erfolge', color: 'sonne' },
    { to: '/profil', label: L('Profil', 'Profilo'), icon: UserRound, match: ['/profil', '/avatar'], testId: 'nav-profil', color: 'lila' }
  ];
}

export const isNavActive = (it: NavItem, pathname: string) => it.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
