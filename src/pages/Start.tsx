import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Lock, Plus, ShieldCheck } from 'lucide-react';
import { useApp, type Profile } from '../store/useApp';
import { Avatar, SpeakButton, TopBar } from '../components/ui';
import { Lino } from '../components/Lino';
import { InstallHint } from '../components/InstallHint';
import { AVATAR_FARBEN, AVATAR_TIERE } from '../learning/rewards';
import { sfx } from '../lib/sound';
import { L, getLang, LANGS, setLang, tr, type Lang } from '../i18n';
import { COUNTRIES, stageFor, stagesOf, typicalAge, yearLabel, type Country, type StageId } from '../school/systems';
import { MASCOT_NAME } from '../content/mascot';
import { hasWebGL } from '../lib/webgl';

const Puppy3D = lazy(() => import('../components/Puppy3D'));

/** Kurzbeschreibung eines Profils, z. B. „🇮🇹 2ª media“ */
export function profileLabel(p: Pick<Profile, 'country' | 'year'>): string {
  const flag = COUNTRIES.find((c) => c.id === p.country)?.flag ?? '';
  return `${flag} ${yearLabel(p.country, p.year)}`;
}

export function LanguageSwitch({ value, onChange, testPrefix = 'sprache' }: { value: Lang; onChange: (l: Lang) => void; testPrefix?: string }) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-weich ring-1 ring-tinte/5" role="radiogroup" aria-label={L('Sprache', 'Lingua')}>
      {LANGS.map((l) => (
        <button key={l.id} type="button" role="radio" aria-checked={value === l.id} onClick={() => { sfx.tap(); onChange(l.id); }} data-testid={`${testPrefix}-${l.id}`}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition ${value === l.id ? 'bg-tinte text-white' : 'text-tinte/70 hover:bg-tinte/5'}`}>
          <span className="emoji" aria-hidden>{l.flag}</span>{l.name}
        </button>
      ))}
    </div>
  );
}

function Mascot({ size }: { size: number }) {
  const reduce = useApp((s) => s.parent.reduceMotion);
  if (!hasWebGL() || reduce) return <Lino mood="winken" size={size} />;
  return (
    <Suspense fallback={<Lino mood="winken" size={size} />}>
      <div style={{ width: size * 1.25, height: size * 1.35 }}><Puppy3D mood="winken" interactive /></div>
    </Suspense>
  );
}

export function StartPage() {
  const profiles = useApp((s) => s.profiles);
  const setActive = useApp((s) => s.setActiveProfile);
  const uiLang = useApp((s) => s.uiLang);
  const setUiLang = useApp((s) => s.setUiLang);
  const nav = useNavigate();
  const lang = uiLang ?? getLang();
  const greet = L('Hallo! Schön, dass du da bist!', 'Ciao! Che bello vederti!');
  const intro = L(`Ich bin ${MASCOT_NAME}. Wer lernt heute mit mir?`, `Sono ${MASCOT_NAME}. Chi impara con me oggi?`);
  return (
    <div className="hintergrund-punkte min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6">
        <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"><img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8" /> Lernito Kids</span>
        <LanguageSwitch value={lang} onChange={(l) => { setLang(l); setUiLang(l); }} />
      </div>
      <main className="seite flex flex-col items-center gap-8 pt-4 sm:pt-6">
        <section className="karte relative flex w-full flex-col items-center gap-4 overflow-hidden p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sonne-100" aria-hidden />
          <div className="pointer-events-none absolute -bottom-28 right-40 h-60 w-60 rounded-full bg-himmel-50" aria-hidden />
          <div className="relative shrink-0"><Mascot size={170} /></div>
          <div className="relative flex-1">
            <p className="eyebrow">{L('Lernen vom Kindergarten bis zum Abitur', 'Dalla scuola dell’infanzia alla maturità')}</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl" data-testid="greeting">{greet}</h1>
            <p className="mt-3 flex items-center justify-center gap-2 text-lg text-tinte/70 sm:justify-start">
              {intro} <SpeakButton text={`${greet} ${intro}`} />
            </p>
          </div>
        </section>

        <section className="w-full" aria-labelledby="profile-titel">
          <h2 id="profile-titel" className="mb-4 font-display text-2xl font-bold tracking-tight">{L('Wer bist du?', 'Chi sei?')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {profiles.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }}
                onClick={() => { sfx.tap(); setLang(p.lang); setActive(p.id); nav('/home'); }}
                className="karte flex flex-col items-center gap-3 p-5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-himmel-500"
                data-testid={`profile-${p.name}`}
              >
                <Avatar config={p.avatar} size={88} />
                <span className="font-display text-xl font-bold">{p.name}</span>
                <span className="chip bg-tinte/[0.05] text-tinte/70">{profileLabel(p)}</span>
              </motion.button>
            ))}
            <Link to="/profil/neu" className="karte flex min-h-[12rem] flex-col items-center justify-center gap-3 border-2 border-dashed border-tinte/15 p-5 text-center shadow-none" data-testid="neues-profil" onClick={() => sfx.tap()}>
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-minze-100 text-minze-700"><Plus size={36} /></span>
              <span className="font-display text-lg font-bold">{L('Neues Profil', 'Nuovo profilo')}</span>
            </Link>
          </div>
        </section>

        <div className="w-full"><InstallHint /></div>

        <nav className="flex w-full flex-wrap items-center justify-center gap-3" aria-label={L('Für Erwachsene', 'Per gli adulti')}>
          <Link to="/eltern" className="knopf bg-white text-base" data-testid="elternbereich"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</Link>
          <Link to="/datenschutz" className="knopf bg-white text-base"><ShieldCheck size={18} /> {L('Datenschutz', 'Privacy')}</Link>
        </nav>
        <p className="max-w-xl text-center text-sm text-tinte/55">{L('Lernito Kids speichert alle Daten nur auf diesem Gerät. Keine Werbung, keine Tracker, keine öffentlichen Profile.', 'Lernito Kids salva tutti i dati solo su questo dispositivo. Niente pubblicità, niente tracker, nessun profilo pubblico.')}</p>
      </main>
    </div>
  );
}

function Step({ n, title, done, children }: { n: number; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <fieldset className="karte p-5 sm:p-6" aria-labelledby={`step-${n}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${done ? 'bg-minze-500 text-white' : 'bg-tinte/[0.07] text-tinte/70'}`} aria-hidden>{done ? <Check size={18} /> : n}</span>
        <h2 id={`step-${n}`} className="font-display text-xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </fieldset>
  );
}

const choice = (active: boolean) => `knopf flex-col gap-1 py-4 text-base ${active ? 'bg-tinte text-white ring-2 ring-tinte' : 'bg-white'}`;

export function CreateProfilePage() {
  const add = useApp((s) => s.addProfile);
  const setActive = useApp((s) => s.setActiveProfile);
  const setUiLang = useApp((s) => s.setUiLang);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [country, setCountryState] = useState<Country | null>(null);
  const [lang, setLangState] = useState<Lang>(getLang());
  const [stage, setStage] = useState<StageId | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [animal, setAnimal] = useState(AVATAR_TIERE[0]!);
  const [color, setColor] = useState(AVATAR_FARBEN[0]!);
  const valid = name.trim().length > 0 && country !== null && year !== null;

  const chooseLang = (l: Lang) => { setLangState(l); setLang(l); setUiLang(l); };
  const chooseCountry = (c: Country) => {
    setCountryState(c); setStage(null); setYear(null);
    chooseLang(COUNTRIES.find((x) => x.id === c)!.defaultLang);
  };
  const chooseStage = (id: StageId) => {
    setStage(id);
    const st = stagesOf(country!).find((s) => s.id === id)!;
    setYear(st.years.length === 1 ? st.years[0]! : null);
  };

  const create = () => {
    if (!valid || country === null || year === null) return;
    const p = add({ name: name.trim().slice(0, 20), country, lang, year, avatar: { animal, color, extra: 'keins' } });
    setActive(p.id);
    sfx.win();
    nav('/home');
  };
  const stageDef = country && stage ? stagesOf(country).find((s) => s.id === stage) : undefined;

  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Neues Profil', 'Nuovo profilo')} back="/" />
      <main className="seite flex max-w-3xl flex-col gap-5">
        <div className="flex flex-col items-center gap-2 pt-2">
          <Avatar config={{ animal, color, extra: 'keins' }} size={104} />
          {country !== null && year !== null && <span className="chip bg-white text-tinte/70 shadow-weich">{profileLabel({ country, year })}</span>}
        </div>

        <Step n={1} title={L('Wie heißt du?', 'Come ti chiami?')} done={name.trim().length > 0}>
          <input className="feld text-xl" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder={L('Vorname oder Spitzname', 'Nome o soprannome')} autoComplete="off" data-testid="profil-name" aria-label={L('Name', 'Nome')} />
          <p className="mt-2 text-sm text-tinte/55">{L('Ein Spitzname reicht. Der Name bleibt nur auf diesem Gerät.', 'Basta un soprannome. Il nome resta solo su questo dispositivo.')}</p>
        </Step>

        <Step n={2} title={L('In welchem Land gehst du zur Schule?', 'In quale Paese vai a scuola?')} done={country !== null}>
          <div className="grid grid-cols-2 gap-3">
            {COUNTRIES.map((c) => (
              <button key={c.id} type="button" onClick={() => { sfx.tap(); chooseCountry(c.id); }} aria-pressed={country === c.id} data-testid={`land-${c.id}`} className={choice(country === c.id)}>
                <span className="emoji text-4xl" aria-hidden>{c.flag}</span>{tr(c.name)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-tinte/60">{L('Sprache der App:', 'Lingua dell’app:')}</span>
            <LanguageSwitch value={lang} onChange={chooseLang} />
          </div>
          <p className="mt-2 text-sm text-tinte/55">{L('Weitere Länder folgen. Die Aufgaben richten sich nach dem Schulsystem des gewählten Landes.', 'Altri Paesi arriveranno presto. Gli esercizi seguono il sistema scolastico del Paese scelto.')}</p>
        </Step>

        {country && (
          <Step n={3} title={L('Welche Schule besuchst du?', 'Quale scuola frequenti?')} done={year !== null}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stagesOf(country).map((s) => (
                <button key={s.id} type="button" onClick={() => { sfx.tap(); chooseStage(s.id); }} aria-pressed={stage === s.id} data-testid={`stufe-${s.id}`} className={choice(stage === s.id)}>
                  <span className="emoji text-3xl" aria-hidden>{s.emoji}</span>
                  <span className="leading-tight">{tr(s.name)}</span>
                </button>
              ))}
            </div>
            {stageDef && stageDef.years.length > 1 && (
              <>
                <p className="mb-2 mt-5 font-bold">{L('Welche Klasse?', 'Quale classe?')}</p>
                <div className="flex flex-wrap gap-2">
                  {stageDef.years.map((y) => (
                    <button key={y} type="button" onClick={() => { sfx.tap(); setYear(y); }} aria-pressed={year === y} data-testid={`jahr-${y}`}
                      className={`knopf min-w-[5.5rem] flex-col gap-0 px-4 py-2 text-base ${year === y ? 'bg-himmel-500 text-white' : 'bg-white'}`}>
                      <span>{yearLabel(country, y).replace(/ · .*/, '')}</span>
                      <span className={`text-xs font-semibold ${year === y ? 'text-white/80' : 'text-tinte/50'}`}>{L(`${typicalAge(country, y)} Jahre`, `${typicalAge(country, y)} anni`)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </Step>
        )}

        <Step n={country ? 4 : 3} title={L('Such dir ein Tier und eine Farbe aus', 'Scegli un animale e un colore')} done>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {AVATAR_TIERE.map((t) => (
              <button key={t} type="button" onClick={() => { sfx.tap(); setAnimal(t); }} aria-pressed={animal === t} aria-label={L(`Tier ${t}`, `Animale ${t}`)} className={`knopf aspect-square px-0 text-3xl ${animal === t ? 'bg-sonne-100 ring-2 ring-tinte' : 'bg-white'}`}>
                <span className="emoji">{t}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {AVATAR_FARBEN.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={L(`Farbe ${c}`, `Colore ${c}`)} className={`h-12 w-12 rounded-full shadow-weich ${color === c ? 'ring-4 ring-tinte ring-offset-2' : ''}`} style={{ background: c }} />
            ))}
          </div>
        </Step>

        <button className="knopf bg-minze-500 py-5 text-xl text-white" disabled={!valid} onClick={create} data-testid="profil-erstellen">
          {L('Los geht’s!', 'Si parte!')}
        </button>
        {!valid && <p className="-mt-2 text-center text-sm text-tinte/55">{L('Name, Land und Klasse auswählen, dann geht’s los.', 'Inserisci nome, Paese e classe per iniziare.')}</p>}
        {country && year !== null && <p className="-mt-2 text-center text-xs text-tinte/45">{tr(stageFor(country, year).name)}</p>}
      </main>
    </div>
  );
}
