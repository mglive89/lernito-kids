import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { L } from '../../i18n';
import { onVoicesChanged, speak, speechStatus, type SpeechStatus } from '../../lib/speech';

export function useSpeechStatus(): SpeechStatus {
  const [status, setStatus] = useState<SpeechStatus>(() => speechStatus());
  useEffect(() => onVoicesChanged(() => setStatus(speechStatus())), []);
  return status;
}

export function SpeakButton({ text, enabled = true, size = 'md', label }: { text: string; enabled?: boolean; size?: 'md' | 'lg'; label?: string }) {
  label = label ?? L('Vorlesen', 'Leggi ad alta voce');
  const status = useSpeechStatus();
  const available = status !== 'keine' && enabled;
  const dim = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  return (
    <button
      type="button"
      className={`knopf ${dim} shrink-0 px-0 ${available ? 'bg-himmel-100 text-himmel-700 ring-2 ring-himmel-300' : 'bg-white'}`}
      onClick={() => available && speak(text, { force: true })}
      aria-label={available ? `${label}: ${text}` : enabled ? L('Vorlesen ist auf diesem Gerät nicht verfügbar', 'La lettura ad alta voce non è disponibile su questo dispositivo') : L('Vorlesen ist ausgeschaltet', 'La lettura ad alta voce è disattivata')}
      title={available ? (status === 'offline' ? L('Vorlesen (funktioniert offline)', 'Leggi (funziona offline)') : L('Vorlesen (benötigt evtl. Internet)', 'Leggi (potrebbe servire Internet)')) : L('Vorlesen nicht verfügbar', 'Lettura non disponibile')}
      disabled={!available}
    >
      {available ? <Volume2 size={size === 'lg' ? 32 : 26} /> : <VolumeX size={26} />}
    </button>
  );
}
