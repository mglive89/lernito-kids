# Datenschutz und Kindersicherheit – technische Umsetzung und offene Prüfungen

> Dieses Dokument beschreibt, was technisch umgesetzt ist. Es behauptet **keine** Rechtskonformität.
> Vor einer Veröffentlichung müssen die unten aufgeführten Prüfungen durch fachkundige Personen erfolgen.

## Umgesetzt im MVP (Privacy by Design)

| Thema | Umsetzung |
|---|---|
| Datenspeicherung | Ausschließlich lokal im Browser (IndexedDB, Datenbank `lernito-kids`). Kein Server, keine Cookies, keine Drittanbieter. |
| Datensparsamkeit | Pro Kind: Spitzname (max. 20 Zeichen), Altersgruppe, Avatar (Emoji + Farbe), Lernstände, Lernzeit pro Tag. Kein Geburtsdatum, kein Foto, keine E-Mail. |
| Keine Werbung/Tracker | Keine Analyse-SDKs, keine externen Skripte. Schriften sind lokal eingebunden (`@fontsource`). |
| Keine Kommunikation | Keine Chats, keine öffentlichen Profile, keine Ranglisten mit anderen Kindern. |
| Sensoren | Kein Zugriff auf Standort, Kamera oder Mikrofon. |
| Elternbereich | Erwachsenen-Prüfung (Zahl in Worten) + PIN (4–6 Ziffern), gesalzen und iteriert gehasht (SHA-256). Sperre nach 5 Fehlversuchen für 60 s. Automatische Sperre nach 20 Minuten. |
| Einwilligungen | Online-Synchronisierung und KI-Lernhilfe sind standardmäßig **aus**. Änderungen werden mit Zeitstempel gespeichert. Ohne Server-Konfiguration bleiben beide Funktionen ohne Wirkung. |
| Betroffenenrechte | Export aller Daten als JSON (Art. 15/20 DSGVO), Import, vollständige Löschung inkl. Medien (Art. 17 DSGVO), Löschen einzelner Profile. |
| KI-Lernhilfe | Vorbereitet, standardmäßig deaktiviert, nur durch Erwachsene aktivierbar. Kein offener Chat. Keine API-Schlüssel im Frontend – nur ein eigener Server-Endpunkt (`VITE_AI_PROXY_URL`) ist vorgesehen. |
| Vorlesefunktion | Web Speech API des Geräts. Die App zeigt, ob eine lokale Stimme verfügbar ist. Hinweis: Manche Browser nutzen Online-Stimmen des Herstellers – das ist in der Datenschutzinformation zu nennen. Abschaltbar im Elternbereich. |
| Mikrofon (Sprachkurse, Sprachantworten) | Spracherkennung über die Web Speech API des Browsers. Standardmäßig **aus**; erst nach Freigabe mit Eltern-PIN nutzbar, im Elternbereich (Datenschutz) wieder abschaltbar. Lernito speichert keine Aufnahmen, nur das Ergebnis richtig/falsch. Hinweis: Chrome/Edge senden das Audio zur Erkennung an Server des Herstellers (Google/Microsoft), Safari je nach Einstellung an Apple – das ist in der Datenschutzinformation zu nennen (Drittanbieter, Drittlandübermittlung). Ohne Unterstützung (z. B. Firefox) gibt es einen Ersatzweg ohne Mikrofon. |
| Belohnungen | Keine Zufallsbelohnungen, keine Käufe, keine Verlustmechaniken (Serien gehen nicht verloren), keine Countdown-Druckelemente. |
| Barrierefreiheit | Semantische Elemente, ARIA-Labels, Fokus-Rahmen, Vorlesen, hoher Kontrast, größere Schrift, reduzierte Bewegung, Tipp-Alternative zu Drag-and-Drop. |

## Offene Prüfungen vor Veröffentlichung

1. **Rechtliche Prüfung** der Datenschutzerklärung und des Impressums (DSGVO, TDDDG, DDG).
2. **Art. 8 DSGVO**: Verfahren zur Einholung und Überprüfung der elterlichen Einwilligung, sobald Online-Dienste aktiviert werden (Altersgrenze in Deutschland: 16 Jahre).
3. **Datenschutz-Folgenabschätzung (Art. 35 DSGVO)** – bei Verarbeitung von Kinderdaten mit Synchronisierung bzw. KI empfehlenswert/ggf. verpflichtend.
4. **Auftragsverarbeitung (Art. 28 DSGVO)** mit Supabase bzw. Hosting-Anbieter; Serverstandort EU; Prüfung von Drittlandtransfers.
5. **Verzeichnis von Verarbeitungstätigkeiten (Art. 30 DSGVO)**.
6. **Jugendschutz** (JuSchG/JMStV) und ggf. Prüfung durch eine Selbstkontrolleinrichtung.
7. **KI-Lernhilfe**: Moderation, Protokollierung ohne Personenbezug, Prüfung nach EU AI Act (Transparenzpflichten), Ausschluss freier Texteingaben durch Kinder.
8. **Barrierefreiheit**: Prüfung nach WCAG 2.1 AA / BFSG (Barrierefreiheitsstärkungsgesetz) mit Screenreadern (VoiceOver, TalkBack).
9. **Sprachausgabe**: Klärung, welche Browser Text an Online-Dienste senden, und Hinweis in der Datenschutzinformation.
10. **Sicherheitsprüfung** der Server-Komponenten (Penetrationstest, RLS-Policies, Rollenmodell).
11. **Lehrplanbezug**: fachdidaktische Prüfung der Inhalte und Zuordnung zu Bundesland-Lehrplänen.
12. **Urheberrecht**: Alle eingebauten Inhalte, Figuren und Grafiken sind selbst erstellt. Bei hochgeladenen Medien liegt die Verantwortung bei der Redaktion; ein Freigabeprozess ist vorzusehen.
13. **Italien** (seit Version mit DE/IT-Profilen): italienische *Informativa privacy* (Art. 13 DSGVO) auf Italienisch; Einwilligungsalter nach Art. 2-quinquies Codice privacy (D.Lgs. 196/2003 i. d. F. D.Lgs. 101/2018): 14 Jahre; Leitlinien und Entscheidungen des *Garante per la protezione dei dati personali* zu Minderjährigen und Altersverifikation; ggf. AGCOM-Vorgaben zur Altersverifikation; Verbraucherrecht (Codice del consumo) bei späteren kostenpflichtigen Angeboten.
14. **Inhalte Italien**: fachdidaktische Prüfung gegenüber den *Indicazioni nazionali* (infanzia, primo ciclo) und den Leitlinien der Licei/Istituti tecnici/professionali; Religionsunterricht (IRC) ist in Italien freiwillig – Ausblenden des Fachs durch Eltern vorsehen.
