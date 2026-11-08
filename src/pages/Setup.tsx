import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Check, Clock, ShieldCheck, Sparkles, UserPlus, Users } from 'lucide-react';
import { useApp, type Profile } from '../store/useApp';
import { Avatar, Toggle } from '../components/ui';
import { Lino } from '../components/Lino';
import { PinSetup } from '../components/ParentAuth';
import { LanguageSwitch, ProfileForm, profileLabel } from './Start';
import { SUBJECTS } from '../school/subjects';
import { sfx } from '../lib/sound';
import { L, getLang, setLang, tr } from '../i18n';

type Step = 'willkommen' | 'pin' | 'kind' | 'regeln' | 'fertig';
const ORDER: Step[] = ['willkommen', 'pin', 'kind', 'regeln', 'fertig'];

/**
 * Ersteinrichtung durch Eltern: PIN, Kinderprofil, Lernregeln.
 * Erst danach wird das Gerät an das Kind übergeben.
 */
export function SetupPage() {
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const unlock = useApp((s) => s.unlockParent);
  const lock = useApp((s) => s.lockParent);
  const setActive = useApp((s) => s.setActiveProfile);
  const setUiLang = useApp((s) => s.setUiLang);
  const uiLang = useApp((s) => s.uiLang);
  const nav = useNavigate();
  const [step, setStep] = useState<Step>(hasPin ? 'kind' : 'willkommen');
  const [children, setChildren] = useState<Profile[]>([]);
  const current = children[children.length - 1];
  const idx = ORDER.indexOf(step);
  const go = (s: Step) => { sfx.tap(); setStep(s); window.scrollTo(0, 0); };

  return (
    <div className="hintergrund-punkte min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }}>
      <header className="mx-auto flex max-w-3xl items-center gap-4 px-4 pt-5">
        <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"><img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8" /> Lernito</span>
        <div className="flex flex-1 items-center gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={ORDER.length} aria-valuenow={idx + 1} aria-label={L('Einrichtung', 'Configurazione')}>
          {ORDER.map((s, i) => <span key={s} className={`h-2 flex-1 rounded-full transition-colors ${i <= idx ? 'bg-minze-500' : 'bg-tinte/10'}`} />)}
        </div>
        <span className="text-sm font-bold text-tinte/50">{idx + 1}/{ORDER.length}</span>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-16 pt-8">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-6">
            {step === 'willkommen' && (
              <>
                <div className="flex flex-col items-center gap-4 text-center">
                  <Lino mood="winken" size={150} />
                  <p className="eyebrow">{L('Für Eltern', 'Per i genitori')}</p>
                  <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" data-testid="einrichtung-titel">{L('Willkommen bei Lernito', 'Benvenuti in Lernito')}</h1>
                  <p className="max-w-xl text-lg text-tinte/70">{L('Richten Sie die App in zwei Minuten ein, bevor Ihr Kind startet. Sie bestimmen Schule, Klasse, Tagesziel und Zeitlimit.', 'Configurate l’app in due minuti, prima che vostro figlio inizi. Scegliete voi scuola, classe, obiettivo giornaliero e limite di tempo.')}</p>
                  <LanguageSwitch value={uiLang ?? getLang()} onChange={(l) => { setLang(l); setUiLang(l); }} />
                </div>
                <ul className="grid gap-3 sm:grid-cols-3">
                  {[
                    [<ShieldCheck key="a" />, L('Eltern-PIN', 'PIN genitori'), L('Schützt Einstellungen und Daten vor Kinderhänden.', 'Protegge impostazioni e dati dai più piccoli.')],
                    [<BookOpen key="b" />, L('Passend zur Schule', 'Su misura per la scuola'), L('Lernpfade nach Land und Klasse, mit Theorie zu jedem Thema.', 'Percorsi per Paese e classe, con la teoria per ogni argomento.')],
                    [<Clock key="c" />, L('Gesunde Grenzen', 'Limiti sani'), L('Tagesziel und Zeitlimit, keine Werbung, keine Tracker.', 'Obiettivo e limite di tempo, niente pubblicità, niente tracker.')]
                  ].map(([icon, t, d], i) => (
                    <li key={i} className="karte flex flex-col gap-2 p-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-himmel-50 text-himmel-700">{icon}</span>
                      <span className="font-display text-lg font-bold">{t}</span>
                      <span className="text-base text-tinte/70">{d}</span>
                    </li>
                  ))}
                </ul>
                <button className="knopf knopf-3d bg-minze-500 py-4 text-xl text-white" onClick={() => go('pin')} data-testid="einrichtung-start">
                  {L('Einrichtung starten', 'Inizia la configurazione')} <ArrowRight />
                </button>
              </>
            )}

            {step === 'pin' && (
              <>
                <StepHead n={1} title={L('Eltern-PIN festlegen', 'Impostate il PIN dei genitori')} text={L('Mit der PIN öffnen nur Erwachsene den Elternbereich und legen neue Profile an.', 'Con il PIN solo gli adulti aprono l’area genitori e creano nuovi profili.')} />
                <PinSetup showIntro={false} onDone={() => { unlock(30); go('kind'); }} />
              </>
            )}

            {step === 'kind' && (
              <>
                <StepHead n={2} title={children.length ? L('Weiteres Kind anlegen', 'Aggiungete un altro bambino') : L('Profil für Ihr Kind', 'Profilo di vostro figlio')} text={L('Land und Klasse bestimmen, welche Lernpfade Ihr Kind sieht.', 'Paese e classe decidono quali percorsi vedrà vostro figlio.')} />
                <ProfileForm submitLabel={L('Weiter', 'Avanti')} onCreated={(p) => { setChildren((c) => [...c, p]); go('regeln'); }} />
              </>
            )}

            {step === 'regeln' && current && (
              <>
                <StepHead n={3} title={L(`Lernregeln für ${current.name}`, `Regole di studio per ${current.name}`)} text={L('Alles lässt sich später im Elternbereich ändern.', 'Potete cambiare tutto più tardi nell’area genitori.')} />
                <Rules profile={current} />
                <button className="knopf knopf-3d bg-minze-500 py-4 text-xl text-white" onClick={() => go('fertig')} data-testid="einrichtung-weiter">
                  {L('Weiter', 'Avanti')} <ArrowRight />
                </button>
              </>
            )}

            {step === 'fertig' && (
              <>
                <div className="flex flex-col items-center gap-3 text-center">
                  <Lino mood="jubel" size={150} />
                  <h1 className="font-display text-3xl font-bold tracking-tight">{L('Alles bereit!', 'Tutto pronto!')}</h1>
                  <p className="max-w-lg text-lg text-tinte/70">{L('Geben Sie das Gerät jetzt Ihrem Kind. Den Elternbereich öffnen Sie jederzeit über das Schloss-Symbol und Ihre PIN.', 'Ora potete dare il dispositivo a vostro figlio. L’area genitori si apre sempre dal lucchetto con il vostro PIN.')}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {children.map((c) => (
                    <li key={c.id} className="karte flex items-center gap-4 p-4">
                      <Avatar config={c.avatar} size={56} />
                      <div className="flex-1"><p className="font-display text-xl font-bold">{c.name}</p><p className="text-tinte/60">{profileLabel(c)}</p></div>
                      <Check className="text-minze-500" />
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="knopf flex-1 bg-white" onClick={() => go('kind')} data-testid="einrichtung-weiteres-kind"><UserPlus size={20} /> {L('Weiteres Kind', 'Un altro bambino')}</button>
                  <button className="knopf knopf-3d flex-1 bg-himmel-500 text-white" data-testid="einrichtung-fertig"
                    onClick={() => {
                      lock();
                      if (children.length === 1) { setLang(children[0]!.lang); setActive(children[0]!.id); nav('/home'); }
                      else nav('/');
                    }}>
                    {children.length === 1 ? <><Sparkles size={20} /> {L(`Los geht’s, ${children[0]!.name}!`, `Si parte, ${children[0]!.name}!`)}</> : <><Users size={20} /> {L('Zur Profilauswahl', 'Scegli il profilo')}</>}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function StepHead({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div>
      <p className="eyebrow text-himmel-700">{L('Schritt', 'Passo')} {n} {L('von', 'di')} 3</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-lg text-tinte/70">{text}</p>
    </div>
  );
}

const pill = (on: boolean) => `knopf min-w-[4.5rem] flex-1 px-3 py-2 text-base ${on ? 'bg-himmel-500 text-white ring-2 ring-himmel-700' : 'bg-white'}`;

/** Tagesziel, Zeitlimit, Vorlesen und Zusatzfächer für ein Kind */
function Rules({ profile }: { profile: Profile }) {
  const settings = useApp((s) => s.childSettings[profile.id]);
  const setSettings = useApp((s) => s.setChildSettings);
  const subjects = useApp((s) => s.subjects);
  const setSubjects = useApp((s) => s.setSubjects);
  const goal = settings?.dailyGoalRounds ?? 3;
  const limit = settings?.timeLimitMin ?? null;
  const extras = SUBJECTS.filter((s) => s.extra);
  return (
    <div className="flex flex-col gap-4">
      <section className="karte p-5">
        <h2 className="font-display text-xl font-bold">{L('Tagesziel', 'Obiettivo giornaliero')}</h2>
        <p className="mb-3 text-tinte/60">{L('Lektionen pro Tag. Freiwillig, ohne Strafe.', 'Lezioni al giorno. Facoltativo, senza penalità.')}</p>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 5].map((n) => <button key={n} type="button" className={pill(goal === n)} aria-pressed={goal === n} onClick={() => setSettings(profile.id, { dailyGoalRounds: n })} data-testid={`ziel-${n}`}>{n}</button>)}
        </div>
      </section>
      <section className="karte p-5">
        <h2 className="font-display text-xl font-bold">{L('Zeitlimit pro Tag', 'Limite di tempo al giorno')}</h2>
        <p className="mb-3 text-tinte/60">{L('Danach macht Puppy freundlich Pause. Mit Ihrer PIN geht es weiter.', 'Poi Puppy propone una pausa. Con il vostro PIN si continua.')}</p>
        <div className="flex flex-wrap gap-2">
          {[null, 15, 30, 45, 60].map((m) => (
            <button key={String(m)} type="button" className={pill(limit === m)} aria-pressed={limit === m} onClick={() => setSettings(profile.id, { timeLimitMin: m })} data-testid={`einrichtung-limit-${m ?? 'aus'}`}>
              {m === null ? L('Kein', 'Nessuno') : `${m} min`}
            </button>
          ))}
        </div>
      </section>
      <section className="karte flex flex-col gap-3 p-5">
        <h2 className="font-display text-xl font-bold">{L('Funktionen', 'Funzioni')}</h2>
        <Toggle checked={settings?.speech ?? true} onChange={(v) => setSettings(profile.id, { speech: v })} label={L('Vorlesen', 'Lettura ad alta voce')} description={L('Aufgaben werden vorgelesen. Wichtig für Kinder, die noch nicht lesen.', 'Gli esercizi vengono letti. Utile per chi non sa ancora leggere.')} />
        <Toggle checked={settings?.sounds ?? true} onChange={(v) => setSettings(profile.id, { sounds: v })} label={L('Töne', 'Suoni')} />
      </section>
      <section className="karte flex flex-col gap-3 p-5">
        <h2 className="font-display text-xl font-bold">{L('Zusatzfächer', 'Materie extra')}</h2>
        <p className="-mt-1 text-tinte/60">{L('Gilt für alle Kinder auf diesem Gerät.', 'Vale per tutti i bambini su questo dispositivo.')}</p>
        {extras.map((x) => {
          const on = subjects.find((s) => s.id === x.id)?.enabled ?? true;
          return (
            <Toggle key={x.id} checked={on} testId={`einrichtung-fach-${x.id}`}
              onChange={(v) => setSubjects(subjects.map((s) => (s.id === x.id ? { ...s, enabled: v } : s)))}
              label={`${x.emoji} ${tr(x.name)}`} />
          );
        })}
      </section>
    </div>
  );
}
