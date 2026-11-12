/**
 * Helles oder dunkles Thema. Die Wahl ist eine reine Geräte-Einstellung (localStorage),
 * sie verändert keine Lern- oder Profildaten.
 */
export type ThemeChoice = 'hell' | 'dunkel' | 'auto';

const KEY = 'lernito-theme';
const listeners = new Set<() => void>();
const media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

export function getTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'hell' || v === 'dunkel' || v === 'auto') return v;
  } catch { /* privater Modus */ }
  return 'hell';
}

export function isDark(choice: ThemeChoice = getTheme()) {
  return choice === 'dunkel' || (choice === 'auto' && !!media?.matches);
}

export function applyTheme(choice: ThemeChoice = getTheme()) {
  const dark = isDark(choice);
  document.documentElement.classList.toggle('dunkel', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0D1220' : '#F6F7FB');
}

export function setTheme(choice: ThemeChoice) {
  try { localStorage.setItem(KEY, choice); } catch { /* egal */ }
  applyTheme(choice);
  listeners.forEach((l) => l());
}

export function onThemeChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function installTheme() {
  applyTheme();
  media?.addEventListener?.('change', () => { if (getTheme() === 'auto') { applyTheme(); listeners.forEach((l) => l()); } });
}
