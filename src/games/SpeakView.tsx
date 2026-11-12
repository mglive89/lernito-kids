import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { SpeakTask } from '../learning/types';
import type { TaskViewProps } from './types';
import { AudioPlayer } from '../components/voice/AudioPlayer';
import { MicButton, useListen, VoiceConsentModal } from '../components/voice/Voice';
import { recognitionSupported } from '../lib/listen';
import { phraseScore, SPEAK_PASS, wordsHeard } from '../lib/voiceMatch';
import { L } from '../i18n';

/** Aussprache üben: Satz anhören, ins Mikrofon sprechen, Rückmeldung Wort für Wort. */
export function SpeakView({ task, onCorrect, onWrong, onSkip, reveal, done }: TaskViewProps<SpeakTask>) {
  const v = useListen();
  const [heard, setHeard] = useState<string[] | null>(null);
  useEffect(() => { setHeard(null); v.setError(null); v.cancel(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [task.id]);
  const supported = recognitionSupported();
  const marks = heard ? wordsHeard(task.phrase, heard, task.lang) : null;
  const words = task.phrase.split(/\s+/);

  const talk = async () => {
    if (done || reveal) return;
    if (v.state === 'listening') { v.finish(); return; }
    const alts = await v.listen(task.lang);
    if (!alts) return;
    setHeard(alts);
    if (phraseScore(task.phrase, alts, task.lang) >= SPEAK_PASS) onCorrect();
    else onWrong();
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-5" data-testid="sprechen">
      <div className="karte-3d flex w-full flex-col items-center gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {task.emoji && <span className="emoji text-6xl sm:text-7xl" aria-hidden>{task.emoji}</span>}
          <AudioPlayer text={task.phrase} lang={task.lang} />
        </div>
        <p className="text-center font-display text-3xl font-bold leading-snug tracking-tight sm:text-4xl" lang={task.lang} data-testid="sprech-satz">
          {words.map((w, i) => (
            <span key={i} className={marks ? (marks[i] ? 'text-minze-700' : 'text-koralle-600 underline decoration-wavy decoration-2 underline-offset-4') : ''}>
              {w}{i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        {task.meaning && <p className="text-lg text-tinte/60">{task.meaning}</p>}
      </div>

      {supported ? (
        <div className="flex flex-col items-center gap-3">
          <MicButton size="lg" listening={v.state === 'listening'} onClick={talk} disabled={done || reveal} label={L('Mikrofon: jetzt sprechen', 'Microfono: parla adesso')} />
          <p className="min-h-[1.75rem] text-center text-lg font-semibold text-tinte/70" role="status" aria-live="polite" data-testid="sprech-status">
            {v.state === 'listening' ? (v.live ? L(`Ich höre: „${v.live}“`, `Ti sento: «${v.live}»`) : L('Ich höre zu … sprich jetzt!', 'Ti ascolto… parla adesso!'))
              : done ? <span className="inline-flex items-center gap-1 text-minze-700"><Check size={20} /> {L('Gut ausgesprochen!', 'Pronuncia ottima!')}</span>
                : heard ? L(`Ich habe gehört: „${heard[0]}“`, `Ho sentito: «${heard[0]}»`)
                  : v.error ?? L('Tippe auf das Mikrofon und sprich.', 'Tocca il microfono e parla.')}
          </p>
          {heard && v.error && <p className="text-center text-base text-tinte/70">{v.error}</p>}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full flex-col items-center gap-3 text-center" data-testid="sprechen-ohne-mikro">
          <p className="text-lg text-tinte/75">{L('Auf diesem Gerät kann ich nicht zuhören. Hör gut zu und sprich den Satz laut nach.', 'Su questo dispositivo non posso ascoltarti. Ascolta bene e ripeti la frase ad alta voce.')}</p>
          <button className="knopf kante-minze bg-minze-500 text-white" onClick={() => !done && !reveal && onCorrect()} disabled={done || reveal} data-testid="laut-gesagt">
            <Check /> {L('Ich habe es laut gesagt', 'L’ho detto ad alta voce')}
          </button>
        </motion.div>
      )}
      {supported && onSkip && !done && !reveal && (
        <button type="button" className="text-base font-semibold text-tinte/50 underline-offset-4 hover:underline" onClick={() => { v.cancel(); onSkip(); }} data-testid="nicht-sprechen">
          {L('Ich kann gerade nicht sprechen', 'Ora non posso parlare')}
        </button>
      )}
      <VoiceConsentModal open={v.consentOpen} onDone={v.consentDone} />
    </div>
  );
}
