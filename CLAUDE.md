# LLMify Website

Statische Website für llmify.ch, gehostet auf GitHub Pages. Verkauft wird das
Produkt **Kontexus** (selbst gehosteter KI-Arbeitsplatz, kontexus.ch).

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
