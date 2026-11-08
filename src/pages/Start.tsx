import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Plus, ShieldCheck } from 'lucide-react';
import { useApp, type AgeGroup } from '../store/useApp';
import { Avatar, SpeakButton, TopBar } from '../components/ui';
import { Lino } from '../components/Lino';
import { InstallHint } from '../components/InstallHint';
import { AVATAR_FARBEN, AVATAR_TIERE } from '../learning/rewards';
import { sfx } from '../lib/sound';

export const AGE_LABEL: Record<string, string> = { kita: 'Kindergarten', '1': '1. Klasse', '2': '2. Klasse', '3': '3. Klasse', '4': '4. Klasse' };

export function StartPage() {
  const profiles = useApp((s) => s.profiles);
  const setActive = useApp((s) => s.setActiveProfile);
  const nav = useNavigate();
  const greet = 'Hallo! Schön, dass du da bist!';
  return (
    <div className="hintergrund-punkte min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }}>
      <main className="seite flex flex-col items-center gap-6 pt-6 sm:pt-10">
        <div className="flex w-full flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
          <Lino mood="winken" size={150} />
          <div className="flex-1">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <h1 className="font-display text-4xl font-bold sm:text-5xl" data-testid="greeting">{greet}</h1>
            </div>
            <p className="mt-2 flex items-center justify-center gap-2 text-xl text-tinte/80 sm:justify-start">
              Ich bin Lino. Wer lernt heute mit mir? <SpeakButton text={`${greet} Ich bin Lino. Wer lernt heute mit mir?`} />
            </p>
          </div>
        </div>

        <section className="w-full" aria-labelledby="profile-titel">
          <h2 id="profile-titel" className="mb-3 font-display text-2xl font-bold">Wer bist du?</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {profiles.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { sfx.tap(); setActive(p.id); nav('/home'); }}
                className="karte flex flex-col items-center gap-3 p-5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-himmel-500"
                data-testid={`profile-${p.name}`}
              >
                <Avatar config={p.avatar} size={96} />
                <span className="font-display text-2xl font-bold">{p.name}</span>
                <span className="rounded-full bg-sonne-100 px-3 py-1 text-sm font-bold">{AGE_LABEL[String(p.ageGroup)]}</span>
              </motion.button>
            ))}
            <Link to="/profil/neu" className="karte flex min-h-[12rem] flex-col items-center justify-center gap-3 border-4 border-dashed border-tinte/15 p-5 text-center" data-testid="neues-profil" onClick={() => sfx.tap()}>
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-minze-100"><Plus size={44} /></span>
              <span className="font-display text-xl font-bold">Neues Profil</span>
            </Link>
          </div>
        </section>

        <div className="w-full"><InstallHint /></div>

        <nav className="flex w-full flex-wrap items-center justify-center gap-3" aria-label="Für Erwachsene">
          <Link to="/eltern" className="knopf bg-white text-base" data-testid="elternbereich"><Lock size={20} /> Elternbereich</Link>
          <Link to="/datenschutz" className="knopf bg-white text-base"><ShieldCheck size={20} /> Datenschutz</Link>
        </nav>
        <p className="max-w-xl text-center text-sm text-tinte/60">Lernito Kids speichert alle Daten nur auf diesem Gerät. Keine Werbung, keine Tracker, keine öffentlichen Profile.</p>
      </main>
    </div>
  );
}

export function CreateProfilePage() {
  const add = useApp((s) => s.addProfile);
  const setActive = useApp((s) => s.setActiveProfile);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [animal, setAnimal] = useState(AVATAR_TIERE[0]!);
  const [color, setColor] = useState(AVATAR_FARBEN[0]!);
  const valid = name.trim().length > 0 && age !== null;

  const create = () => {
    if (!valid || age === null) return;
    const p = add({ name: name.trim().slice(0, 20), ageGroup: age, avatar: { animal, color, extra: 'keins' } });
    setActive(p.id);
    sfx.win();
    nav('/home');
  };

  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Neues Profil" back="/" />
      <main className="seite flex flex-col gap-6">
        <div className="flex items-center justify-center"><Avatar config={{ animal, color, extra: 'keins' }} size={120} /></div>
        <label className="flex flex-col gap-2">
          <span className="font-display text-2xl font-bold">Wie heißt du?</span>
          <input className="feld text-2xl" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="Vorname oder Spitzname" autoComplete="off" data-testid="profil-name" />
          <span className="text-sm text-tinte/60">Ein Spitzname reicht. Der Name bleibt nur auf diesem Gerät.</span>
        </label>

        <fieldset>
          <legend className="mb-3 font-display text-2xl font-bold">Wo lernst du?</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(['kita', 1, 2, 3, 4] as AgeGroup[]).map((a) => (
              <button
                key={String(a)}
                type="button"
                onClick={() => { sfx.tap(); setAge(a); }}
                aria-pressed={age === a}
                data-testid={`alter-${a}`}
                className={`knopf flex-col py-4 ${a === 'kita' ? 'col-span-2 sm:col-span-1' : ''} ${age === a ? 'bg-sonne-500 ring-4 ring-tinte' : 'bg-white'}`}
              >
                <span className="emoji text-4xl" aria-hidden>{a === 'kita' ? '🧸' : '🎒'}</span>
                {AGE_LABEL[String(a)]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-display text-2xl font-bold">Such dir ein Tier aus</legend>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {AVATAR_TIERE.map((t) => (
              <button key={t} type="button" onClick={() => { sfx.tap(); setAnimal(t); }} aria-pressed={animal === t} aria-label={`Tier ${t}`} className={`knopf aspect-square text-5xl ${animal === t ? 'bg-sonne-300 ring-4 ring-tinte' : 'bg-white'}`}>
                <span className="emoji">{t}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 font-display text-2xl font-bold">Deine Lieblingsfarbe</legend>
          <div className="flex flex-wrap gap-3">
            {AVATAR_FARBEN.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={`Farbe ${c}`} className={`h-16 w-16 rounded-full shadow-knopf ${color === c ? 'ring-4 ring-tinte ring-offset-2' : ''}`} style={{ background: c }} />
            ))}
          </div>
        </fieldset>

        <button className="knopf bg-minze-500 py-5 text-2xl text-white" disabled={!valid} onClick={create} data-testid="profil-erstellen">
          Los geht&apos;s!
        </button>
      </main>
    </div>
  );
}
