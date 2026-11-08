# Lernito Kids 🐶

Installierbare Lern-PWA für **Deutschland und Italien** – vom Kindergarten/Scuola dell’infanzia bis zur Oberstufe/Scuola superiore (Klasse 1–13), Oberfläche auf **Deutsch und Italienisch**, mobil zuerst, offline-fähig, ohne Werbung und Tracker. Begleitet wird das Kind von **Puppy**, einem gelben Hund mit Schlappohren, blauem Hoodie und Sneakern.

Alle Inhalte, Texte, Figuren und Grafiken sind selbst erstellt.

## Schnellstart

```bash
npm install
npm run dev        # Entwicklungsserver: http://localhost:5173
```

Weitere Befehle:

| Befehl | Zweck |
|---|---|
| `npm run build` | TypeScript-Prüfung (strict) + Produktions-Build inkl. Service Worker |
| `npm run preview` | Produktions-Build lokal ausliefern (PWA/Offline testen) |
| `npm test` | Unit-Tests der Lernlogik (Vitest) |
| `npm run e2e` | End-to-End-Tests (Playwright; Desktop, Smartphone, Tablet) – vorher einmalig `npx playwright install chromium` |
| `npm run icons` | App-Icons aus `public/favicon.svg` neu erzeugen |
| `npm run puppy` | 3D-Puppy-Bilder (`public/puppy/*.png`) aus `src/components/Puppy3D.tsx` neu rendern (Playwright + `puppy-studio.html`, nur Entwicklung) |

> Die PWA-Installation und der Offline-Modus funktionieren im Produktions-Build (`npm run build && npm run preview`) bzw. nach dem Deployment über HTTPS. Zum Testen auf dem Handy im WLAN: `npx vite preview --host`.

## Hosting auf GitHub Pages

Bei jedem Push auf `main` baut `.github/workflows/pages.yml` die App (inkl. Unit-Tests) und veröffentlicht sie unter `https://<benutzer>.github.io/<repo>/`. Einmalig nötig: im Repository unter **Settings → Pages → Source** „GitHub Actions“ auswählen. Der Unterpfad wird über die Umgebungsvariable `BASE_PATH` gesetzt; lokal bleibt alles unter `/`.

## Was der MVP kann

**Länder & Schulsysteme** – Beim Anlegen eines Profils wählt man das Land (🇩🇪 Deutschland / 🇮🇹 Italien); die Sprache stellt sich passend ein (im Elternbereich änderbar). Danach Schulstufe und Klasse:

| | Deutschland | Italien |
|---|---|---|
| Vorschule | Kindergarten (3–6) | Scuola dell’infanzia (3–6) |
| Primar | Grundschule, Klasse 1–4 | Scuola primaria, 1ª–5ª |
| Sek. I | Sekundarstufe I, Klasse 5–10 | Scuola secondaria di I grado (medie), 1ª–3ª |
| Sek. II | Oberstufe, Klasse 11–13 | Scuola secondaria di II grado (superiori), 1ª–5ª |

Intern ist jede Klasse ein Schuljahr 1–13 (`src/school/systems.ts`); Module tragen `years`, optional `countries` und `langs`.

**Fächer je Stufe:** Mathematik (bis Analysis/Integral), Deutsch bzw. Italiano (Grammatik, Rechtschreibung, Stilmittel, Literaturepochen / analisi logica, retorica, letteratura), Englisch, Sachunterricht/Scienze, Biologie, Physik, Chemie, Geschichte, Geografie.

**Zusatzfächer für alle Stufen:** Religion & Ethik (Feste, Weltreligionen, Ethik), Informatik (Computer-Grundlagen, Hardware & Netz, Binär/Hex, Logikgatter, Caesar-Verschlüsselung, SQL), Programmieren (Roboter-Parcours, Abläufe, Blöcke, Schleifen, Python-Ausgaben vorhersagen, Fehler finden).

**Design:** Schrift Plus Jakarta Sans, ruhige Farbpalette; ab Sekundarstufe automatisch sachlicherer „Teen“-Look. Maskottchen **Puppy in 3D** (React Three Fiber, live auf der Startseite, sonst vorgerenderte Bilder).

**Lernpfad (ab Klasse 1):** Jedes Fach ist ein Pfad aus Einheiten (= Themen) mit je drei Lektionen: Grundlagen (Stufe 1), Üben (Stufe 2), Meistern (Stufe 3). Lektionen einer Einheit werden nacheinander freigeschaltet, alle Einheiten sind direkt erreichbar (Hausaufgaben-Hilfe). In der Lektion: Antwort wählen → „Prüfen“ → grüne/rote Rückmeldeleiste → „Weiter“; Fortschrittsbalken, Serien-Anzeige, Abschluss mit XP, Genauigkeit und Zeit. Keine Leben/Herzen und keine verlierbaren Serien. Kindergarten bleibt bei sofortiger Rückmeldung.

**Theorie zu jedem Thema** (`/thema/:id`, Buch-Symbol im Pfad und in der Lektion): „Das Wichtigste“ (handgeschrieben, de/it, `src/learning/guides.ts`), automatisch erzeugte gelöste Beispiele (`src/learning/examples.ts`) und Lernkarten aus allen Fragen der Fragenbank.

**Kindergarten – 12 spielbare Lernspiele:** Gegenstände zählen · Zahlen 1–20 · Farben · Formen (Drag-and-Drop) · Tiere mit (gesprochenen) Tiergeräuschen · Buchstaben und erste Wörter · Groß und Klein · Memory · Logische Reihenfolgen · Schattenbilder · Puzzle · Vorschule.

Aufgabentypen: Auswahl, Zahlenfeld, Wörter/Silben bauen, Reihenfolge, Memory, Drag-and-Drop, Puzzle, 3D-Auswahl.

**3D-Lernwelt (React Three Fiber):** Körper drehen · Sammeln und Zählen (Dinge in den Korb legen) · 3D-Zahlenwelt · Tiere auf der Wiese. Niedrige Pixeldichte und einfache Geometrien für mittlere Tablets; automatischer **2D-Fallback** ohne WebGL (testbar mit `?no3d` in der URL).

**Video-Lernmodul:** Videoübersicht nach Fach, Beispiel-Lektion „Was bedeutet Plus?“ als selbst erstellte, zeitgesteuerte Animation mit Untertiteln, Vorlesen, Fortschrittsanzeige und anschließendem Quiz. Eigene Videodateien (+ WebVTT-Untertitel) können im Admin-Bereich hochgeladen und mit einem Quiz verknüpft werden.

**Belohnungen ohne Druck:** Sterne pro gelöster Aufgabe, Levelsystem, 16 Abzeichen, gestaltbarer Avatar (Extras werden über Level freigeschaltet), 3 freischaltbare Mini-Spiele (Seifenblasen, Ballon-Reihe, Puppy ausmalen), freiwilliges Tagesziel. Keine Käufe, kein Glücksspiel, keine Werbung, keine verlierbaren Serien.

**Adaptives Lernen:** Schwierigkeit (Leicht/Mittel/Knifflig) pro Thema passt sich der Quote beim ersten Versuch an. Nach dem ersten Fehler kommt ein verständlicher Hinweis, nach dem zweiten eine Schritt-für-Schritt-Erklärung. Schwache Themen erscheinen unter „Nochmal üben“. Fortschritt wird pro Thema gespeichert. Rückmeldungen sind immer ermutigend.

**Elternbereich (PIN-geschützt):** Kinderprofile verwalten, Fortschritts- und Themenstatistik, Lernzeit pro Tag, Tagesziel, Zeitlimit mit freundlicher Pause, Aufgaben zuweisen, Wochenbericht (Drucken/PDF/Text), Einwilligungen (Online-Sync, KI-Lernhilfe – beide standardmäßig aus), Export/Import/Löschen aller Daten, Barrierefreiheit (Kontrast, Schriftgröße, weniger Bewegung).

**Admin-/Redaktionsbereich (eigene PIN):** Fächer verwalten, eigene Lernmodule erstellen/bearbeiten/löschen, Fragen und Antworten mit Hinweis und Erklärung, Schwierigkeitsgrad, Klassenstufe, Veröffentlichen, Inhaltsvorschau, Bilder und Videos verwalten, Video-Lektionen anlegen.

**PWA & Offline:** Web-App-Manifest, eigenes App-Icon, Splash-Screen, Service Worker (Workbox) mit Precaching aller Lernmodule, Installationshinweis für Android und iOS, Update-Hinweis. Fortschritt liegt dauerhaft in IndexedDB.

## Architektur

```
src/
  learning/          Lernlogik (framework-unabhängig, getestet)
    types.ts         Aufgaben- und Modultypen
    bank.ts          Kompakte Fragen-Bank-Syntax (de/it)
    modules/         Generatoren & Banken: kita, math, mathSek, german, germanSek, italiano,
                     english, science, humanities, extras (Religion/Informatik), coding, sach
    adaptive.ts      Schwierigkeitsanpassung, Wiederholungsempfehlung, Rückmeldungen
    rewards.ts       Sterne, Level, Abzeichen, Mini-Spiele, Avatar-Extras
    custom.ts        Eigene Inhalte aus dem Admin-Bereich
    registry.ts      Alle Module an einem Ort
  school/            Schulsysteme DE/IT, Fächer
  i18n/              Übersetzung L(de, it), Sprache
  content/words.ts   Eingebettete Wort-, Tier- und Farblisten
  games/             Spiel-Engine: GameRunner + ein View pro Aufgabentyp
  three/             3D-Szenen (lazy geladen)
  video/             Lektionen, Untertitel, WebVTT-Parser
  store/useApp.ts    Zustand-Store, persistiert in IndexedDB
  lib/               Vorlesen, Sounds (WebAudio), IndexedDB, Hash, Zufall, Datum
  pages/             Seiten inkl. parents/ und admin/
supabase/schema.sql  Vorbereitetes Schema mit RLS und Rollen
docs/DATENSCHUTZ.md  Umsetzung und offene rechtliche Prüfungen
tests/e2e/           Playwright-Tests
```

**Neues Lernmodul hinzufügen:** Generator-Funktion `(level, rng) => Task[]` schreiben und in der passenden `*_MODULES`-Liste eintragen. Die Unit-Tests prüfen automatisch alle Module auf allen Stufen mit vielen Zufallsseeds (Lösung vorhanden, eindeutige Antworten, keine negativen Ergebnisse …).

## Qualität

- TypeScript `strict` inkl. `noUncheckedIndexedAccess`
- 185 Unit-Tests (jedes Modul in allen Sprach-/Länderkombinationen) (Vitest) für Lernlogik, Aufgaben-Generatoren, Adaptivität, Belohnungen, Hash, Untertitel
- End-to-End-Tests (Playwright) für Desktop, Smartphone (Pixel 7) und Tablet (iPad Pro 11): Profil anlegen, Kita-Spiel inkl. Fehlversuch, Drag-and-Drop per Maus und per Antippen, Einmaleins mit Zahlenfeld, Deutsch, Lösungs-Erklärung, 3D-Fallback, Video + Quiz, Elternbereich (PIN, Zuweisung, Zeitlimit, Export), Admin-Modul anlegen und spielen, Zeitlimit-Pause, Manifest + Offline-Start, kein horizontales Scrollen
- Fehlergrenzen (Error Boundaries) und Ladezustände, In-Memory-Fallback wenn IndexedDB blockiert ist

## Ausstehende Erweiterungen

| Bereich | Status / nächster Schritt |
|---|---|
| Elternkonten & Synchronisierung | Schema in `supabase/schema.sql` vorbereitet, Einwilligung im Elternbereich vorhanden. Offen: Supabase-Client, Login (Magic Link), Sync-Logik (Last-Write-Wins pro Kind), EU-Region. |
| Serverseitige Admin-Anmeldung | Admin-Bereich ist lokal per PIN geschützt. Für den Produktivbetrieb: Supabase Auth + Rollen (`editor`/`admin`) + RLS, Medien im Storage-Bucket. |
| KI-Lernhilfe | Schalter und Einwilligung vorhanden (standardmäßig aus). Offen: moderierte Edge Function, die nur vorformulierte Erklärungen zu einer Aufgabe liefert – kein freier Chat, keine Schlüssel im Frontend. |
| Bundesland-Lehrpläne | Feld `federal_state` im Schema vorbereitet. Offen: Zuordnung der Module zu Lehrplänen und Filter im Elternbereich. |
| Audio | Tiergeräusche und Vorlesen laufen über die Sprachausgabe des Geräts. Optional: eingesprochene Audiodateien als Offline-Fallback. |
| Weitere 3D-Aufgaben | z. B. 3D-Puzzle (Formen in Löcher stecken), Bauklötze-Zählen. |
| Weitere Video-Lektionen | Nur eine animierte Beispiel-Lektion eingebaut; weitere über Admin-Upload möglich. |
| Inhalte | Inhaltsumfang je Thema ausbauen, fachdidaktische Prüfung. |
| Rechtliches | Siehe `docs/DATENSCHUTZ.md` – Prüfungen sind dokumentiert, nicht erledigt. Für Italien zusätzlich: DSGVO Art. 8 i. V. m. Codice privacy Art. 2-quinquies (Einwilligungsalter 14), Vorgaben des Garante zu Minderjährigen, italienische Informativa. |
| Admin-Bereich | Oberfläche nur auf Deutsch. |
| Lehrpläne | Inhalte orientieren sich grob an KMK-Bildungsstandards bzw. Indicazioni nazionali; fachdidaktische Prüfung je Land offen. |
| Tests | WebKit/iOS-Safari-Testlauf auf echten Geräten (Playwright-Tests laufen hier mit Chromium in Geräte-Emulation). |
