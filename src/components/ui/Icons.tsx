import type { ReactNode } from 'react';
import {
  Atom, BookOpen, BookOpenText, Calculator, Code2, Dna, FlaskConical, Globe2, HeartHandshake, Landmark, Languages, Leaf, Map, Monitor,
  type LucideIcon
} from 'lucide-react';
import { colorSet } from './colors';

/** Einheitliche Symbole für die Fächer (statt Emojis in der Oberfläche). */
const SUBJECT_ICONS: Record<string, LucideIcon> = {
  mathe: Calculator,
  deutsch: BookOpenText,
  italiano: BookOpenText,
  englisch: Languages,
  sachkunde: Leaf,
  scienze: FlaskConical,
  biologie: Dna,
  physik: Atom,
  chemie: FlaskConical,
  geschichte: Landmark,
  geographie: Map,
  religion: HeartHandshake,
  informatik: Monitor,
  programmieren: Code2
};

export const subjectIcon = (id: string): LucideIcon => SUBJECT_ICONS[id] ?? (id ? BookOpen : Globe2);

const SIZES = { sm: 'h-9 w-9 rounded-lg', md: 'h-11 w-11 rounded-xl', lg: 'h-14 w-14 rounded-2xl', xl: 'h-16 w-16 rounded-2xl' } as const;
const ICON_PX = { sm: 18, md: 22, lg: 28, xl: 32 } as const;

/** Symbol in einem farbigen, abgerundeten Quadrat. */
export function IconBadge({ icon: Icon, color, size = 'md', solid = false, children }: { icon?: LucideIcon; color?: string; size?: keyof typeof SIZES; solid?: boolean; children?: ReactNode }) {
  const c = colorSet(color);
  return (
    <span className={`flex shrink-0 items-center justify-center ${SIZES[size]} ${solid ? `${c.bg} text-white` : `${c.soft} ${c.text}`}`} aria-hidden>
      {Icon ? <Icon size={ICON_PX[size]} strokeWidth={2.2} /> : children}
    </span>
  );
}

/** Fachsymbol in Fachfarbe. */
export function SubjectIcon({ id, color, size = 'md', solid }: { id: string; color?: string; size?: keyof typeof SIZES; solid?: boolean }) {
  return <IconBadge icon={subjectIcon(id)} color={color} size={size} solid={solid} />;
}
