import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Lino } from '../../components/Lino';
import { L } from '../../i18n';

/** „Sprachen“ öffnet die eigene Sprach-App LinguaFlow (sprachen/index.html); mit Kurs-ID den Übungsbereich mit Puppy. */
export function sprachenUrl(course?: string) {
  return `${import.meta.env.BASE_URL}sprachen/#/${course ? `lingue/${course}` : ''}`;
}

export function OpenLanguageApp() {
  const { course } = useParams();
  // replace: Zurück führt nicht in eine Weiterleitungsschleife
  useEffect(() => { window.location.replace(sprachenUrl(course)); }, [course]);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status" data-testid="sprachen-oeffnen">
      <Lino mood="winken" size={100} />
      <p className="font-display text-xl">{L('Lernito Sprachen wird geöffnet …', 'Apro Lernito Lingue …')}</p>
    </div>
  );
}
