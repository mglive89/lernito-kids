# Fahrschule / Scuola guida (Führerschein B)

Modul ab 18 (Klasse 13; früher per Elternbereich freischaltbar). Einstieg: Kachel „Fahrschule“ / „Scuola guida“ in *Entdecken* und auf der Startseite → `/fuehrerschein`.

## Ablauf
1. Prüfungsland wählen (Deutschland / Italien), 2. Lernsprache wählen (Deutsch / Italiano) – alle vier Kombinationen sind möglich.
3. Übersicht mit „Theorie lernen“, „Bild- und Fangfragen“, „Prüfung simulieren“. Land und Sprache werden immer angezeigt.
- Beim Lernen und Üben lässt sich die Sprache oben rechts wechseln; Frage und gewählte Antwort bleiben erhalten (Antworten haben feste IDs).
- In der Simulation sind Land und Sprache bis zur Abgabe fest.
- Fortschritt wird pro Profil **und Land** gespeichert (nicht pro Sprache), nur lokal im Gerät.

## Dateien
| Datei | Inhalt |
|---|---|
| `src/fuehrerschein/schema.ts` | Datenmodell (Frage, Lektion, Quelle, Version, Status), Validierung, Meldung fehlender Übersetzungen |
| `src/fuehrerschein/chapters.ts` | Kapitel, Abdeckungs-Matrix je Land, amtliche Quellen, Prüfungssprachen |
| `src/fuehrerschein/profiles.ts` | Versionierte Prüfungsprofile (IT 2021-12-15, DE FeV Anl. 7 Ersterwerb) |
| `src/fuehrerschein/bank.ts` | Fragenvorrat, Übungsmodi, Prüfungszusammenstellung, Bewertung, Fortschritt |
| `src/fuehrerschein/packs.ts` | Versionierte Inhaltspakete und Import-Prüfung |
| `src/fuehrerschein/content/` | Demo-Fragen und Demo-Lektionen (eigene Inhalte) |
| `src/fuehrerschein/diagrams.tsx`, `scenes.tsx`, `sketch.tsx`, `signs.tsx` | Eigene SVG-Skizzen (Kreuzungen, Überholen, Abstand, Bahnübergang, Bus, Autobahn …) und Verkehrszeichen |
| `src/fuehrerschein/content/crossings.ts`, `content/scenes.ts` | Bildaufgaben zu den Skizzen: DE Multiple Choice, IT Vero/Falso, je zweisprachig |
| `src/pages/fuehrerschein/` | Oberfläche |

## Bewertung
- **Italien, Patente B:** 30 Aussagen Vero/Falso, 20 Minuten, bestanden mit höchstens 3 Fehlern.
- **Deutschland, Klasse B Ersterwerb:** 30 Fragen, eine oder mehrere Antworten, Fehlerpunkte 2–5, bestanden mit höchstens 10 Fehlerpunkten; zwei falsche 5-Punkte-Fragen = nicht bestanden, auch bei 10 Punkten. Nicht für Erweiterungen verwenden. Zeitvorgabe (45 Min.) bei TÜV/DEKRA bestätigen.
- Reicht der geprüfte Vorrat nicht (z. B. Übersetzungen fehlen), gibt es einen gekennzeichneten **Mini-Test** ohne doppelte Fragen.

## Inhalte importieren
Neue Fragen kommen als Paket (JSON oder TS) und werden in `PACKS` (`packs.ts`) registriert. Der Unit-Test prüft alle Pakete.

```json
{
  "format": "lernito-fahrschule",
  "schemaVersion": 1,
  "id": "beispiel-de-2026-01",
  "packVersion": "2026-01-01",
  "country": "DE",
  "kind": "original",
  "questions": [{
    "id": "de-beispiel-1", "country": "DE", "chapter": "precedenza", "format": "multi", "weight": 4,
    "text": { "de": "…", "it": "…" },
    "options": [{ "id": "a", "text": { "de": "…", "it": "…" } }, { "id": "b", "text": { "de": "…", "it": "…" } }],
    "correct": ["a"],
    "explanation": { "de": "…", "it": "…" },
    "trap": { "de": "…", "it": "…" },
    "image": { "type": "diagram", "id": "rechts-vor-links", "alt": { "de": "…", "it": "…" } },
    "source": { "kind": "original", "ref": "…" },
    "version": 1, "status": "draft"
  }]
}
```

Regeln der Prüfung (`validatePack`): feste, eindeutige IDs; Land und Quellenart passen zum Paket (eigene und amtliche Inhalte nie im selben Paket); DE-Fragen mit Gewicht 2–5, IT-Fragen Vero/Falso; Bild mit Alternativtext; amtliche Pakete nur mit `license` (geklärte Nutzungsbedingung). Fehlende Übersetzungen sind Warnungen – sie erscheinen in der App als „Übersetzung fehlt“ und solche Fragen kommen in dieser Sprache nicht in die Simulation. `status: "draft"` wird nicht angezeigt.

**Keine amtlichen Fragen, Bilder oder Videos kopieren**, bevor die Nutzungsbedingungen geprüft sind (DE: TÜV/DEKRA-Katalog; IT: Listati auf dem Portale dell’Automobilista).

## Was noch fehlt
Alle Inhalte sind **Demo-Inhalt** (`status: demo`) und nicht Frage für Frage mit den amtlichen Katalogen abgeglichen. Die Abdeckungs-Matrix in der App (`/fuehrerschein/copertura`) zeigt pro Kapitel, was fehlt (z. B. Zusatzzeichen, Markierungen, Anhänger, Drogen, Videofragen, Rechenaufgaben).
