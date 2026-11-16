import { TopBar } from '../../components/ui';
import { L } from '../../i18n';

export function PrivacyPage() {
  const h2 = 'font-display text-2xl font-bold tracking-tight';
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Datenschutz', 'Privacy')} back={-1} />
      <main className="seite prose-lg flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
        <p className="rounded-2xl bg-sonne-100 p-4">
          <strong>{L('Hinweis:', 'Nota:')}</strong>{' '}
          {L('Diese Seite beschreibt die technische Umsetzung des MVP. Sie ist keine rechtsverbindliche Datenschutzerklärung. Vor einer Veröffentlichung müssen die in der Projektdokumentation (docs/DATENSCHUTZ.md) aufgeführten rechtlichen Prüfungen erfolgen – für Deutschland und für Italien (DSGVO, BDSG, Codice privacy, Garante-Vorgaben zu Minderjährigen).',
            'Questa pagina descrive l’implementazione tecnica dell’MVP. Non è un’informativa privacy legalmente vincolante. Prima della pubblicazione vanno svolte le verifiche legali indicate nella documentazione del progetto (docs/DATENSCHUTZ.md), sia per la Germania sia per l’Italia (GDPR, Codice privacy, indicazioni del Garante sui minori).')}
        </p>
        <h2 className={h2}>{L('Was wird gespeichert?', 'Che cosa viene salvato?')}</h2>
        <ul className="list-disc pl-6">
          <li>{L('Ein Profilname (Spitzname genügt), das Land des Schulsystems, die Sprache, die Klasse und der gewählte Avatar.', 'Un nome del profilo (basta un soprannome), il Paese del sistema scolastico, la lingua, la classe e l’avatar scelto.')}</li>
          <li>{L('Lernfortschritt: gelöste Aufgaben, Sterne, Abzeichen, Lernzeit pro Tag.', 'Progressi: esercizi risolti, stelle, distintivi, tempo di studio al giorno.')}</li>
          <li>{L('Einstellungen der Eltern (Tagesziel, Zeitlimit, zugewiesene Aufgaben) und ein gehashter PIN.', 'Impostazioni dei genitori (obiettivo giornaliero, limite di tempo, compiti assegnati) e un PIN cifrato (hash).')}</li>
        </ul>
        <h2 className={h2}>{L('Wo wird gespeichert?', 'Dove viene salvato?')}</h2>
        <p>{L('Ausschließlich lokal auf diesem Gerät (IndexedDB des Browsers). Es findet in dieser Version keine Übertragung an Server statt.', 'Solo in locale su questo dispositivo (IndexedDB del browser). In questa versione non viene trasmesso nulla a server esterni.')}</p>
        <h2 className={h2}>{L('Was wird nicht erhoben?', 'Che cosa non viene raccolto?')}</h2>
        <ul className="list-disc pl-6">
          <li>{L('Kein Standort. Es werden keine Fotos, Mikrofon- oder Kameraaufnahmen gespeichert.', 'Nessuna posizione. Non vengono salvate foto né registrazioni da microfono o fotocamera.')}</li>
          <li>{L('Keine Werbung, keine Tracker, keine Analyse-Dienste, keine Cookies von Dritten.', 'Niente pubblicità, niente tracker, nessun servizio di analisi, nessun cookie di terze parti.')}</li>
          <li>{L('Keine Chatfunktion, keine öffentlichen Profile.', 'Nessuna chat, nessun profilo pubblico.')}</li>
        </ul>
        <h2 className={h2}>{L('Vorlesefunktion', 'Lettura ad alta voce')}</h2>
        <p>{L('Die Vorlesefunktion nutzt die Sprachausgabe des Betriebssystems bzw. Browsers. Je nach Gerät kann der Browser dafür einen Online-Dienst des Herstellers verwenden. Lernito zeigt an, ob eine lokale (offline) Stimme verfügbar ist. Die Vorlesefunktion kann im Elternbereich abgeschaltet werden.', 'La lettura ad alta voce usa la sintesi vocale del sistema operativo o del browser. A seconda del dispositivo, il browser può usare un servizio online del produttore. Lernito indica se è disponibile una voce locale (offline). La funzione si può disattivare nell’area genitori.')}</p>
        <h2 className={h2}>{L('Hausaufgaben-Hilfe (Kamera)', 'Aiuto compiti (fotocamera)')}</h2>
        <p>{L('Kinder können eine Mathe-Aufgabe fotografieren oder abtippen. Die Kamera ist standardmäßig aus und wird erst mit der Eltern-PIN freigegeben. Die Texterkennung läuft vollständig auf diesem Gerät (die nötigen Dateien kommen von der Lernito-Seite selbst). Das Foto wird nicht hochgeladen, nicht gespeichert und nach dem Lesen verworfen.', 'I bambini possono fotografare o scrivere un esercizio di matematica. La fotocamera è spenta di default e si attiva solo con il PIN dei genitori. Il riconoscimento del testo avviene interamente su questo dispositivo (i file necessari arrivano dal sito di Lernito stesso). La foto non viene caricata né salvata e viene scartata dopo la lettura.')}</p>
        <h2 className={h2}>{L('Ihre Rechte', 'I vostri diritti')}</h2>
        <p>{L('Im Elternbereich können Sie alle Daten als Datei exportieren und vollständig löschen.', 'Nell’area genitori potete esportare tutti i dati in un file e cancellarli completamente.')}</p>
      </main>
    </div>
  );
}
