import { useEffect } from 'react';
import { Lino } from '../../components/Lino';
import { L } from '../../i18n';

/** „Hilf mir bei den Hausaufgaben“ öffnet die eigene App MathLens (mathlens/index.html). */
export const mathLensUrl = () => `${import.meta.env.BASE_URL}mathlens/`;

export function OpenMathLens() {
  // replace: Zurück führt nicht in eine Weiterleitungsschleife
  useEffect(() => { window.location.replace(mathLensUrl()); }, []);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status" data-testid="mathlens-oeffnen">
      <Lino mood="winken" size={100} />
      <p className="font-display text-xl">{L('MathLens wird geöffnet …', 'Apro MathLens …')}</p>
    </div>
  );
}
