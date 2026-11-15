import type { BankItem } from '../../bank';
import { MORE_SCIENCE } from './science';
import { MORE_HUMANITIES } from './humanities';
import { MORE_EXTRAS } from './extras';
import { MORE_LANGUAGES } from './languages';
import { MORE_PRIMARY } from './primary';

/**
 * Zusatzfragen für die Fragenbanken, nach Modul-ID. Jede Bank bekommt Fragen auf allen
 * drei Stufen (1 leicht, 2 mittel, 3 schwer), damit Lektionen, Profi-Lektion und Endrunde
 * genug Abwechslung haben. Hier nur Typen importieren (keine Laufzeit-Abhängigkeit zu bank.ts).
 */
export const MORE_ITEMS: Record<string, BankItem[]> = {
  ...MORE_SCIENCE, ...MORE_HUMANITIES, ...MORE_EXTRAS, ...MORE_LANGUAGES, ...MORE_PRIMARY
};
