import type { ComponentType } from 'react';
import type { Pic } from './types';
import { ObjectArt, OBJECTS } from './art/objects';
import { MATH_ART } from './art/math';
import { SCIENCE_ART } from './art/science';
import { WORLD_ART } from './art/world';
import { TECH_ART } from './art/tech';
import { LANGUAGE_ART } from './art/language';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<string, ComponentType<any>> = {
  obj: ObjectArt, ...MATH_ART, ...SCIENCE_ART, ...WORLD_ART, ...TECH_ART, ...LANGUAGE_ART
};

/** Gibt es diese Zeichnung? (für Tests) */
export function hasPicture(p: Pic): boolean {
  if (!(p.id in REGISTRY)) return false;
  if (p.id === 'obj') return typeof p.name === 'string' && p.name in OBJECTS;
  return true;
}

/** Zeichnet eine Illustration. `compact` = kleine Darstellung in Antwortkacheln. */
export default function Picture({ pic, alt, compact = false }: { pic: Pic; alt?: string; compact?: boolean }) {
  const C = REGISTRY[pic.id];
  if (!C) return null;
  const { id: _id, ...props } = pic;
  void _id;
  if (compact) {
    return <span className="pointer-events-none flex h-full w-full items-center justify-center p-1" aria-hidden><C {...props} /></span>;
  }
  return (
    <figure className="bild-aufgabe w-full max-w-xl rounded-blob bg-flaeche p-3 shadow-karte ring-1 ring-tinte/5 sm:p-4" role="img" aria-label={alt}>
      <div className="flex w-full items-center justify-center [&>svg]:max-h-[42vh]"><C {...props} /></div>
    </figure>
  );
}
