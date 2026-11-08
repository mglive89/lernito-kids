import { TopBar } from '../components/ui';

export function PrivacyPage() {
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Datenschutz" back={-1} />
      <main className="seite prose-lg flex max-w-3xl flex-col gap-4 text-lg leading-relaxed">
        <p className="rounded-2xl bg-sonne-100 p-4"><strong>Hinweis:</strong> Diese Seite beschreibt die technische Umsetzung des MVP. Sie ist keine rechtsverbindliche Datenschutzerklärung. Vor einer Veröffentlichung müssen die in der Projektdokumentation (docs/DATENSCHUTZ.md) aufgeführten rechtlichen Prüfungen erfolgen.</p>
        <h2 className="font-display text-2xl font-bold">Was wird gespeichert?</h2>
        <ul className="list-disc pl-6">
          <li>Ein Profilname (Spitzname genügt), die Altersgruppe und der gewählte Avatar.</li>
          <li>Lernfortschritt: gelöste Aufgaben, Sterne, Abzeichen, Lernzeit pro Tag.</li>
          <li>Einstellungen der Eltern (Tagesziel, Zeitlimit, zugewiesene Aufgaben) und ein gehashter PIN.</li>
        </ul>
        <h2 className="font-display text-2xl font-bold">Wo wird gespeichert?</h2>
        <p>Ausschließlich lokal auf diesem Gerät (IndexedDB des Browsers). Es findet in dieser Version keine Übertragung an Server statt.</p>
        <h2 className="font-display text-2xl font-bold">Was wird nicht erhoben?</h2>
        <ul className="list-disc pl-6">
          <li>Kein Standort, keine Fotos, keine Mikrofon- oder Kameraaufnahmen.</li>
          <li>Keine Werbung, keine Tracker, keine Analyse-Dienste, keine Cookies von Dritten.</li>
          <li>Keine Chatfunktion, keine öffentlichen Profile.</li>
        </ul>
        <h2 className="font-display text-2xl font-bold">Vorlesefunktion</h2>
        <p>Die Vorlesefunktion nutzt die Sprachausgabe des Betriebssystems bzw. Browsers. Je nach Gerät kann der Browser dafür einen Online-Dienst des Herstellers verwenden. Lernito zeigt an, ob eine lokale (offline) Stimme verfügbar ist. Die Vorlesefunktion kann im Elternbereich abgeschaltet werden.</p>
        <h2 className="font-display text-2xl font-bold">Ihre Rechte</h2>
        <p>Im Elternbereich können Sie alle Daten als Datei exportieren und vollständig löschen.</p>
      </main>
    </div>
  );
}
