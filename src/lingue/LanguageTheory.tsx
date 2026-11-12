import { Lightbulb, ListChecks, MessageSquareText, Snail, Volume2, BookA, Mic, GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';
import type { LearningModule } from '../learning/types';
import { speak } from '../lib/speech';
import { sfx } from '../lib/sound';
import { getLang, L } from '../i18n';
import { UNITS, type CourseLang } from './data';
import { courseOfModule, tokens } from './course';
import { NOTES, PRONUNCIATION, genderOf, type P } from './theory';

const pick = (p: P) => (getLang() === 'it' ? p[1] : p[0]);

function say(text: string, lang: string, slow = false) {
  sfx.tap();
  speak(text, { force: true, lang, rate: slow ? 0.55 : 0.9, pitch: 1 });
}

function Listen({ text, lang, slow = true }: { text: string; lang: string; slow?: boolean }) {
  return (
    <span className="flex shrink-0 gap-1.5">
      <button type="button" onClick={() => say(text, lang)} aria-label={`${L('Anhören', 'Ascolta')}: ${text}`}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-himmel-500 text-white transition hover:bg-himmel-600 active:scale-95">
        <Volume2 size={20} />
      </button>
      {slow && (
        <button type="button" onClick={() => say(text, lang, true)} aria-label={`${L('Langsam anhören', 'Ascolta piano')}: ${text}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-himmel-50 text-himmel-700 ring-1 ring-himmel-300 transition hover:bg-himmel-100 active:scale-95">
          <Snail size={18} />
        </button>
      )}
    </span>
  );
}

function Section({ id, icon, title, intro, children }: { id: string; icon: ReactNode; title: string; intro?: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} data-testid={id}>
      <h2 id={id} className="mb-1 flex items-center gap-2 font-display text-xl font-bold">{icon} {title}</h2>
      {intro && <p className="mb-3 text-base text-tinte/65">{intro}</p>}
      {!intro && <div className="mb-3" />}
      {children}
    </section>
  );
}

const GENDER: Record<'m' | 'f' | 'n', { label: () => string; cls: string }> = {
  m: { label: () => L('männlich', 'maschile'), cls: 'bg-himmel-50 text-himmel-700' },
  f: { label: () => L('weiblich', 'femminile'), cls: 'bg-koralle-50 text-koralle-700' },
  n: { label: () => L('sächlich', 'neutro'), cls: 'bg-minze-50 text-minze-700' }
};

/** Steps how each exercise type works – everything the lessons ask for */
const EXERCISES = (): { icon: string; title: string; steps: string[] }[] => [
  { icon: '🖼️', title: L('Bild wählen', 'Scegli l’immagine'), steps: [L('Hör dir das Wort an (Lautsprecher).', 'Ascolta la parola (altoparlante).'), L('Überlege, was es bedeutet.', 'Pensa a che cosa significa.'), L('Tippe auf das passende Bild.', 'Tocca l’immagine giusta.')] },
  { icon: '👂', title: L('Hören und verstehen', 'Ascolta e capisci'), steps: [L('Hör genau zu. Mit der Schnecke wird es langsam vorgelesen.', 'Ascolta bene. Con la lumaca la frase viene letta piano.'), L('Wähle die richtige Übersetzung.', 'Scegli la traduzione giusta.')] },
  { icon: '🔤', title: L('Übersetzen', 'Traduci'), steps: [L('Lies das Wort in deiner Sprache.', 'Leggi la parola nella tua lingua.'), L('Tippe die Antworten an, um sie zu hören.', 'Tocca le risposte per ascoltarle.'), L('Wähle das richtige Wort und drücke „Prüfen“.', 'Scegli la parola giusta e premi «Controlla».')] },
  { icon: '🧩', title: L('Satz bauen', 'Componi la frase'), steps: [L('Lies oder hör dir den Satz an.', 'Leggi o ascolta la frase.'), L('Tippe die Wörter in der richtigen Reihenfolge an. Achtung: Einige Wörter passen nicht!', 'Tocca le parole nell’ordine giusto. Attenzione: alcune parole non servono!'), L('Ein Wort oben antippen legt es zurück.', 'Se tocchi una parola in alto, torna giù.'), L('Schau in den Grammatik-Tipps nach, wo die Wörter stehen.', 'Guarda i consigli di grammatica per sapere dove vanno le parole.')] },
  { icon: '🎤', title: L('Nachsprechen', 'Ripeti ad alta voce'), steps: [L('Hör dir den Satz an, gern auch langsam.', 'Ascolta la frase, anche piano.'), L('Tippe auf das Mikrofon und sprich laut und deutlich.', 'Tocca il microfono e parla forte e chiaro.'), L('Grüne Wörter waren gut, rote Wörter übst du noch einmal.', 'Le parole verdi erano giuste, quelle rosse le ripeti ancora.')] },
  { icon: '🃏', title: L('Memory', 'Memory'), steps: [L('Decke zwei Karten auf.', 'Gira due carte.'), L('Finde das Wort und seine Übersetzung.', 'Trova la parola e la sua traduzione.')] }
];

/** Theorie einer Sprachkurs-Einheit: Wörter, Sätze Schritt für Schritt, Grammatik, Aussprache, Übungen. */
export function LanguageTheory({ module, compact = false }: { module: LearningModule; compact?: boolean }) {
  const course = courseOfModule(module);
  const unit = UNITS.find((u) => module.id.endsWith(`-${u.id}`));
  if (!course || !unit) return null;
  const t: CourseLang = course.id;
  const n = getLang();
  const notes = NOTES[unit.id]?.[t] ?? [];
  const pron = PRONUNCIATION[t];
  return (
    <div className="flex flex-col gap-7" data-testid="sprach-theorie">
      <Section id="lt-ziel" icon={<GraduationCap size={20} className="text-himmel-700" />} title={L('Das lernst du hier', 'Cosa impari qui')}>
        <div className="rounded-2xl bg-flaeche p-4 text-base leading-relaxed shadow-weich ring-1 ring-tinte/5 sm:text-lg">
          <p>{L(`${unit.words.length} Wörter und ${unit.sentences.length} Sätze auf ${course.name()}: ${unit.subtitle.de}.`, `${unit.words.length} parole e ${unit.sentences.length} frasi in ${course.name().toLowerCase()}: ${unit.subtitle.it.toLowerCase()}.`)}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-6 text-tinte/80">
            <li>{L('Hör dir jedes Wort an und sprich es nach.', 'Ascolta ogni parola e ripetila.')}</li>
            <li>{L('Lies, wie die Sätze Schritt für Schritt gebaut sind.', 'Leggi come sono costruite le frasi, passo per passo.')}</li>
            <li>{L('Merk dir die Grammatik-Tipps und die Aussprache.', 'Ricorda i consigli di grammatica e di pronuncia.')}</li>
            <li>{L('Dann starte die Lektion!', 'Poi inizia la lezione!')}</li>
          </ol>
        </div>
      </Section>

      <Section id="lt-woerter" icon={<BookA size={20} className="text-sonne-700" />} title={L('Die Wörter', 'Le parole')}
        intro={t !== 'en' ? L('Lerne jedes Nomen mit seinem Artikel – die Farbe zeigt das Geschlecht.', 'Impara ogni nome con il suo articolo: il colore indica il genere.') : L('Tippe auf den Lautsprecher und sprich nach.', 'Tocca l’altoparlante e ripeti.')}>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {unit.words.map((w) => {
            const g = genderOf(w[t], t);
            return (
              <li key={w.emoji} className="flex items-center gap-3 rounded-2xl bg-flaeche p-3 shadow-weich ring-1 ring-tinte/5" data-testid="theorie-wort">
                <span className="emoji text-3xl" aria-hidden>{w.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold leading-tight" lang={course.locale}>{w[t]}</span>
                  <span className="flex flex-wrap items-center gap-1.5 text-sm text-tinte/60">
                    {w[n]}
                    {g && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${GENDER[g].cls}`}>{GENDER[g].label()}</span>}
                  </span>
                </span>
                <Listen text={w[t]} lang={course.locale} slow={false} />
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="lt-saetze" icon={<MessageSquareText size={20} className="text-lila-700" />} title={L('Die Sätze Schritt für Schritt', 'Le frasi passo per passo')}
        intro={L('Tippe auf ein Wort, um es einzeln zu hören.', 'Tocca una parola per ascoltarla da sola.')}>
        <ol className="flex flex-col gap-3">
          {unit.sentences.map((s, i) => {
            const words = tokens(s[t]);
            return (
              <li key={i} className="rounded-2xl bg-flaeche p-4 shadow-weich ring-1 ring-tinte/5" data-testid="theorie-satz">
                <div className="flex items-start gap-3">
                  <span className="emoji text-3xl" aria-hidden>{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl font-bold leading-snug" lang={course.locale}>{s[t]}</p>
                    <p className="text-tinte/65">{s[n]}</p>
                  </div>
                  <Listen text={s[t]} lang={course.locale} />
                </div>
                {!compact && (
                  <div className="mt-3 border-t border-tinte/[0.06] pt-3">
                    <p className="eyebrow mb-2 text-tinte/45">{L(`${words.length} Wörter in dieser Reihenfolge`, `${words.length} parole in quest’ordine`)}</p>
                    <div className="flex flex-wrap items-center gap-1.5" lang={course.locale}>
                      {words.map((w, k) => (
                        <button key={k} type="button" onClick={() => say(w, course.locale)}
                          className="flex items-center gap-1 rounded-xl bg-tinte/[0.04] px-2.5 py-1.5 text-base font-semibold ring-1 ring-tinte/[0.06] transition hover:bg-himmel-50">
                          <span className="text-xs font-bold text-tinte/35">{k + 1}</span> {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </Section>

      {notes.length > 0 && (
        <Section id="lt-grammatik" icon={<Lightbulb size={20} className="text-sonne-700" />} title={L('So funktioniert es', 'Come funziona')}>
          <div className="flex flex-col gap-3">
            {notes.map((note, i) => (
              <article key={i} className="rounded-2xl bg-flaeche p-4 shadow-weich ring-1 ring-tinte/5" data-testid="theorie-regel">
                <h3 className="mb-2 font-display text-lg font-bold">{pick(note.title)}</h3>
                <ol className="flex flex-col gap-2">
                  {note.steps.map((st, k) => (
                    <li key={k} className="flex gap-3 text-base leading-relaxed sm:text-lg">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-himmel-500 text-xs font-bold text-white">{k + 1}</span>
                      <span>{pick(st)}</span>
                    </li>
                  ))}
                </ol>
                {note.example && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-sonne-50 p-3 ring-1 ring-sonne-300">
                    <div className="min-w-0 flex-1">
                      <p className="eyebrow text-sonne-700">{L('Beispiel', 'Esempio')}</p>
                      <p className="font-display text-lg font-bold" lang={course.locale}>{note.example.text}</p>
                      <p className="text-tinte/65">{pick(note.example.meaning)}</p>
                    </div>
                    <Listen text={note.example.text} lang={course.locale} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </Section>
      )}

      {!compact && (
        <>
          <Section id="lt-aussprache" icon={<Mic size={20} className="text-koralle-700" />} title={L('Aussprache', 'Pronuncia')}
            intro={L(`So klingen die schwierigen Laute auf ${course.name()}.`, `Ecco come suonano i suoni difficili in ${course.name().toLowerCase()}.`)}>
            <ul className="flex flex-col gap-2">
              {pron.map((p, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-flaeche p-3 shadow-weich ring-1 ring-tinte/5">
                  <span className="min-w-[3.5rem] rounded-xl bg-koralle-50 px-2 py-1 text-center font-display font-bold text-koralle-700">{p.sound}</span>
                  <span className="text-base leading-relaxed sm:text-lg">{pick(p.tip)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="lt-uebungen" icon={<ListChecks size={20} className="text-minze-700" />} title={L('So löst du die Übungen', 'Come si fanno gli esercizi')}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EXERCISES().map((ex) => (
                <div key={ex.title} className="rounded-2xl bg-flaeche p-4 shadow-weich ring-1 ring-tinte/5">
                  <p className="mb-2 flex items-center gap-2 font-display text-lg font-bold"><span className="emoji text-2xl" aria-hidden>{ex.icon}</span>{ex.title}</p>
                  <ol className="list-decimal space-y-1 pl-5 text-base text-tinte/80">
                    {ex.steps.map((s, k) => <li key={k}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
