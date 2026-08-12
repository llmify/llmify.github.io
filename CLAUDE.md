# LLMify Website

Statische Website für llmify.ch, gehostet auf GitHub Pages. Verkauft wird das
Produkt **Kontexus** (kontexus.ch): der KI-Arbeitsplatz aus der Schweiz.

Die Botschaft ist nicht «selbst gehostet». Kontexus läuft primär als SaaS bei
einem Schweizer Provider, ist an Schweizer Anwendungen angebunden und arbeitet
produktiv auf den Dateien des Kunden. Eine private Instanz oder On-Premise gibt
es auf Wunsch (Enterprise), das ist die Ausnahme und nicht die Überschrift.

## Stack

HTML, handgeschriebenes CSS, Vanilla JavaScript. **Kein Build-Schritt, keine
Frameworks, keine Abhängigkeiten.** Es gibt kein `npm install` und kein
`package.json` — wer eine Datei ändert, hat die Website geändert.

```
index.html         Einseitige Landingpage, Deutsch. Quelle der Wahrheit.
en/ fr/ it/        Aus index.html erzeugt, NIE von Hand bearbeiten.
insights/          Artikel, nur auf Deutsch. Übersicht + ein Ordner pro Beitrag.
css/styles.css     Das gesamte Design-System.
js/main.js         Seiten-Chrome: Scroll-Reveal, Nav, Rechner, Rechtstext-Dialoge.
js/demo/           Das Use-Case-Fenster. engine.js plus eine Datei pro Fall.
assets/fonts/      Inter und Space Grotesk, selbst gehostet.
tools/i18n.py      Erzeugt en/ fr/ it/ aus index.html.
tools/check_i18n.py  Meldet deutschen Text auf den übersetzten Seiten.
```

## Lokal ansehen

```bash
python3 -m http.server 8000    # → http://localhost:8000
```

Was lokal liegt, wird auch ausgeliefert: die leere Datei `.nojekyll` im Wurzel-
verzeichnis schaltet die Jekyll-Verarbeitung von GitHub Pages ab. Die Seite
benutzt keine einzige Jekyll-Funktion, und ohne die Datei verwirft Jekyll
stillschweigend alles, was mit `_` oder `.` beginnt. Nicht löschen.

## Deployment

`.github/workflows/pages.yml` lädt das Wurzelverzeichnis bei jedem Push auf
`main` als Artefakt hoch und veröffentlicht es. Kein Build, die Seite liegt
fertig im Repo.

Der Workflow ersetzt den von GitHub automatisch erzeugten. Zwei Gründe, beide
am 06.08.2026 teuer gelernt:

- Dessen Zeitlimit von zehn Minuten war nicht änderbar. Als die Auslieferung
  bei GitHub langsam war, hat die Action laufende Deployments selbst
  abgebrochen. Hier steht `timeout: 1800000`, also dreissig Minuten.
- Es gab keine Möglichkeit, ein Deployment ohne neuen Commit zu wiederholen.
  Dieser Workflow hat `workflow_dispatch`: in der Actions-Ansicht auf
  «Run workflow», fertig. Oder `gh workflow run pages.yml`.

Die Pages-Quelle muss dafür in den Einstellungen auf **GitHub Actions** stehen,
nicht auf «Deploy from a branch».

## Sprachen

Deutsch ist die Quelle. Die drei anderen Fassungen werden erzeugt:

```bash
python3 tools/i18n.py        # schreibt en/index.html, fr/index.html, it/index.html
python3 tools/check_i18n.py  # zeigt, was noch deutsch geblieben ist
```

**Nach jeder Änderung an `index.html` muss `python3 tools/i18n.py` laufen**,
sonst driften die Sprachfassungen auseinander. Neuer sichtbarer Text braucht
einen Eintrag in der Tabelle `T` in `tools/i18n.py` (Tupel aus de, fr, it, en).

Zwei Dinge, die das Skript stillschweigend richtig macht und die man beim
Bearbeiten nicht kaputtmachen darf:

- Die Muster sind case-sensitiv. Deshalb übersetzt der Eintrag `"Impressum"`
  den sichtbaren Text, fasst aber `id="impressum"` und `href="#impressum"`
  nicht an. Wer eine ID gross schreibt, zerstört die Sprachfassungen.
- `canonical` und `og:url` werden pro Sprache auf die eigene Adresse gesetzt.
  Ohne das würden die drei Übersetzungen als Duplikate der deutschen Seite
  gelten und aus dem Index fallen.
- Die Tabelle läuft auch über den JSON-LD-Block im Kopf. Jeder deutsche Satz
  dort braucht einen Eintrag als **ganzer Satz**, sonst greifen nur die kurzen
  Einträge und es entsteht ein Mischsatz. Bis August 2026 stand in der
  französischen Fassung «in der Cloud suisse», weil dieser Eintrag fehlte.
  `insights/` wird in Links auf `../insights/` umgeschrieben, damit der
  Fusslink aus `fr/` nicht ins Leere zeigt.

`check_i18n.py` meldet weiterhin deutschen Text aus dem Kanzlei- und dem
Vertriebsfall im Demo-Fenster. Das ist bekannt: nur der Treuhand-Fall ist
inhaltlich übersetzt, die beiden anderen fallen im Fensterinneren auf Deutsch
zurück.

## Artikel hinzufügen

1. `insights/{slug}/index.html` anlegen, eine bestehende Artikelseite als
   Vorlage nehmen. Kopf, Fuss und Rechtstext-Links sind dort bewusst
   dupliziert — es gibt kein Include-System mehr.
2. Eintrag in `insights/index.html` ergänzen, neueste Beiträge zuoberst.
3. `sitemap.xml` und `llms.txt` ergänzen.
4. JSON-LD im Artikelkopf anpassen (Titel, Datum, Bild, Adresse).

Die Artikel gibt es nur auf Deutsch; sie laufen nicht durch `i18n.py`.

Tonalität: Stilrichtlinie unter
`/Users/flaessig/Documents/repos/post-scheduler/scripts/style-guide.md`.
«Sie», keine Gedankenstriche als Trenner, keine LinkedIn-Fragmente, konkret
und mit Quellen.

## Weiterleitungen

Zwölf Dateien im Wurzelverzeichnis und unter `insights/` sind keine Seiten,
sondern Weiterleitungen: `agents.html`, `private-ai.html`, `security.html`,
`contact.html`, `demo/index.html` und sieben alte Artikeladressen. Sie
bestehen aus `<link rel="canonical">` auf das heutige Ziel und einem
Meta-Refresh. Wer eine davon für eine echte Seite hält und sie ausbaut, hat
die Weiterleitung zerstört.

GitHub Pages kann keine 301 senden, deshalb diese Kombination. Bewusst ohne
`noindex`: das würde die Zusammenführung auf die neue Adresse verhindern,
und genau die ist der Zweck. Die `404.html` bleibt davon unberührt, dort
fehlt der Inhalt wirklich, und sie hat aus gutem Grund keinen Refresh.

Die Dateien gehören **nicht** in `sitemap.xml`.

Sieben davon zeigen auf Artikel, deren Inhalt beim Merge von sieben auf drei
Beiträge tatsächlich umgezogen ist; die bleiben dauerhaft. Die übrigen fünf
sind nur thematisch nächste Treffer und können weg, sobald die Search
Console für die alten Adressen keinen Verkehr mehr zeigt. `team.html` und
`workshop.html` gab es auch einmal, sie laufen absichtlich wieder in die
404: für eine Teamseite und den Workshop gibt es heute keine Entsprechung,
und eine Weiterleitung auf die Startseite wertet Google ohnehin als
soft 404.

## Strukturierte Daten

Der `@graph` im Kopf von `index.html` hat drei Knoten: `WebSite`,
`Organization` (`#organization`) und die `SoftwareApplication` Kontexus
(`#kontexus`). Die Unterseiten hängen sich per `@id` daran, statt eine eigene
Firma zu behaupten.

Das `url` der `SoftwareApplication` zeigt auf `https://llmify.ch/#produkt`
und nicht auf kontexus.ch. Unter kontexus.ch liegt die Anwendung, deren
Startseite die Anmeldemaske ist: Google hat dort ein Anmeldeformular als
Suchergebnis für das Produkt ausgeliefert. `installUrl` und `sameAs` zeigen
weiterhin dorthin, denn als Einstieg in die Anwendung stimmt die Adresse.
Sobald kontexus.ch eine eigene, servergerenderte Produktseite hat, gehört
das `url` zurück. `llms.txt` sagt dasselbe in Worten und muss mit.

Kommentare gehören **ausserhalb** des `<script>`-Blocks. JSON-LD ist
striktes JSON, ein `//` darin macht die gesamten strukturierten Daten
ungültig.

Die Firmenangaben sind belegt und sollen es bleiben:

- Handelsregistereintrag **19.03.2025**, Statuten vom 12.03.2025, publiziert im
  SHAB am 24.03.2025 (HR01-1006289592).
- UID **CHE-479.856.227**, aktiv im UID-Register. Sie steht als `identifier`
  und nicht mehr als `vatID`: das UID-Register weist keine MWST-Nummer aus, die
  UID ist keine Mehrwertsteuernummer.
- ETH: seit 20.05.2026 *A Start-up Company of ETH Zurich*. Die Erwähnung steht
  nur am `Organization`-Knoten, nie am Produkt. Die Nutzungsregeln verbieten
  den Namen ETH in Verbindung mit Produkten, Services und Werbung; die
  wahrheitsgemässe Aussage über die Firma ist erlaubt. Details in
  `company-context/branded-assets/eth-startup-logo/README.md`.

## Rechtstexte

Impressum und Datenschutzerklärung stehen als `<dialog class="legal">` am Ende
von `index.html` und werden mitübersetzt. Der Browser liefert Fokusfalle,
Escape und Backdrop; `js/main.js` öffnet sie nur. Ohne JavaScript zeigt die
Regel `.legal:target:not([open])` sie als normalen Block. Die Insights-Seiten
verlinken deshalb nach `../../index.html#impressum` statt die Texte zu
duplizieren.

Die Datenschutzerklärung behauptet, dass die Seite keine Cookies setzt, keine
Analyse einbindet und alle Schriften selbst ausliefert. **Alle drei Aussagen
sind derzeit wahr und müssen es bleiben.** Wer Analytics, eingebettete Videos
oder eine Web-Schriftart von einem fremden Host einbaut, muss den Text
gleichzeitig anpassen.

## Preise

Die Preise stehen an zwei Stellen in `index.html`: im Abschnitt `#preise` und
im JSON-LD im Kopf. Beide zusammen ändern, sonst widerspricht die Seite sich
selbst.
