# Kachelsprache

Kurze Spezifikation der Kacheln aus dem Hero (`variant-c.html`), damit weitere
Seiten (NPO-Seite, eine Firmenseite für LLMify) gleich aussehen.
Umgesetzt in `page.css` / `page.js` (Klassen `.tile`, `.card`, `.ptile`).

Werte mit **(vorläufig)** werden im Hero noch abgestimmt. Wer sie übernimmt,
übernimmt sie aus `variant-c.html` in dem Stand, der dann gilt.

## Tokens

Aus dem `:root` von `variant-c.html`:

| Token | Wert | Wofür |
|---|---|---|
| `--bg` | `#fbfbfa` | Seitenhintergrund |
| `--panel` | `#ffffff` | Kachelfläche |
| `--text` / `--muted` / `--faint` | `#1c1e24` / `#5b6270` / `#9096a1` | Text |
| `--line` / `--line-soft` | `rgba(20,24,34,.13)` / `.08` | Haarlinien |
| `--accent` | `#3674d9` | Aktiv-Ring, Links, Hauptknopf |
| `--accent-2` | `#7454e0` | nur im Verlauf `.grad` |
| `--font` | Inter | Fliesstext |
| `--display` | Space Grotesk | Überschriften |

Schriften kommen aus `../assets/fonts/`, nie von einem fremden Host (die
Datenschutzerklärung sagt das zu).

## Grössen, Abstand, Radius

- Im Hero rechnet das Skript die Kachelgrösse aus dem Fenster aus
  (`layCells` in `variant-c.html`): Raster `pitch` = Kachel plus Abstand,
  Abstand = **20 % des Rasters** (`Math.round(pitch * 0.2)`), auf dem
  Telefon fest **12 px**. Welches Raster gewählt wird, hängt von Fenster
  und Reglerwerten ab; die Werte `--t: 66px; --gap: 10px` im CSS sind nur
  Startwerte und werden überschrieben. **(vorläufig)**
- Ausserhalb des Hero feste Grössen: **56 px** als Bildkachel in Karten,
  **44 px** für Reihen im Fuss, **30 px** als Symbol in einer
  Freigabe-Karte. Abstand 10 px bei 56 px, 8 px bei 44 px.
- Radius einer quadratischen Kachel: **22 %** der Kantenlänge
  (`border-radius: 22%`), bei jeder Grösse.
- Grosse, rechteckige Kacheln (Karten, Preise) bekommen **28 px** Radius
  statt 22 %: 22 % einer 300 px breiten Karte wären 66 px und sähen aus wie
  eine Pille. 28 px entspricht dem Radius einer Kachel von rund 128 px.
- Fläche: weiss, Haarlinie `1px solid rgba(20,24,34,.09)`, Schatten
  `0 1px 2px rgba(20,24,34,.05), 0 8px 18px -12px rgba(20,24,34,.3)`.
  Grosse Kacheln: dieselbe Linie, Schatten weicher und weiter
  (`0 1px 2px …/.04, 0 18px 40px -28px …/.28`).

## Zustände

| Zustand | Aussehen |
|---|---|
| Ruhe | weisse Fläche, Haarlinie, weicher Schatten |
| Hover / Fokus | Kachel hebt sich (`translateY(-3px)`, `translateZ(14px)`), Schatten tiefer, Ring mit 45 % Deckkraft. Kippt zum Mauszeiger, je Achse höchstens ±11° (Faktor 22 auf den Abstand zur Mitte, −0.5 … 0.5). Perspektive **auf der einzelnen Kachel** (`perspective(520px)` in ihrem `transform`), nie auf dem Feld. Grosse Kacheln kippen höchstens ±2°, mit `perspective(1400px)`, damit die Kante bei der Breite nicht verzerrt. Nur bei `pointerType === 'mouse'`. Tastaturfokus zeigt den Ring voll. |
| Aktiv | Ring aussen an der Kachelkante, ohne Lücke: `box-shadow: 0 0 0 2px #3674d9, 0 0 0 6px rgba(54,116,217,.13), 0 16px 30px -12px rgba(54,116,217,.5)` auf einer Ebene von Kachelgrösse (`::before`). Im Hero zusätzlich `scale(1.06)` und `-3px`. Nur aktive Kacheln bekommen den Lichtstreifen. |
| Abgeblendet | **(vorläufig)** Deckkraft und Graustufe kommen aus dem Hero-Regler «Abblenden» (`TUNE.fade`, Wert f zwischen 0 und 1): Deckkraft `1 − 0.85 × f`, Graustufe `f`. Bei f = 0.82 sind das rund 30 % Deckkraft, bei f = 1 sind es 15 % und volles Grau. Den gültigen Wert aus `variant-c.html` übernehmen. Hover hebt das Abblenden für diese eine Kachel auf. Die Schweizer Kachel wird nie abgeblendet. |

Ausserhalb des Hero gibt es kein Abblenden: es gibt dort keinen laufenden
Fall, gegen den andere Kacheln zurücktreten müssten. Aktiv heisst dort
«hervorgehoben», zum Beispiel die Preisstufe «Beliebt».

## Logos: quadratisch oder Zeichen

- **Quadratische Logos** bringen ihre eigene Fläche mit (bexio, Word, Excel,
  PDF, PowerPoint, Zefix, Fedlex, …). Sie füllen die Kachel bis zum Rand,
  ohne weisse Fläche und ohne Haarlinie; der Radius schneidet sie zu.
  Die Liste steht als `SQUARE` im Skript von `variant-c.html`.
- **Zeichen-Logos** (Outlook, Teams, Kalender, Salesforce, Notion, …) stehen
  mittig auf der weissen Fläche und nehmen **58 %** der Kante ein.
- Dateien aus `icons-hd/`: SVG, wo es eine Vektordatei gibt, sonst das
  grösste PNG. Welche als SVG vorliegen, sagt die Liste `SVG` im Skript.
- HubSpot, Zapier und Mailchimp stehen in `SQUARE`: sie füllen die Kachel.
- Ein Logo wird nie umgefärbt, beschnitten (ausser durch den Radius) oder
  mit einem anderen Zeichen kombiniert.

## Die Schweizer Kachel

- Sie zeigt die **Schweizer Fahne**, nie das Wappen: quadratisches rotes
  Feld `#FF0000`, freistehendes weisses Kreuz. Ein Schild, ein Kreuz, das
  den Rand berührt, oder ein anderes Rot sind nicht erlaubt.
- Proportionen nach Wappenschutzgesetz: Kreuzarme sind um ein Sechstel
  länger als breit. Auf dem Feld 32 × 32 ist das Kreuz 20 × 20, jeder Arm
  6 breit und 7 lang ab dem Mittelquadrat. Genau dieses SVG verwenden:

  ```html
  <svg class="flag" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#FF0000"/><path fill="#fff" d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z"/></svg>
  ```

- Das Kreuz steht nur für eine wahre Herkunftsaussage über die Firma und den
  Betrieb (Sitz in der Schweiz, Betrieb in Schweizer Rechenzentren). Nicht
  neben Aussagen über angebundene Dienste anderer Anbieter, die nicht in der
  Schweiz laufen.
- Die Kachel hat keinen weissen Rand und keine Haarlinie, sie ist rot bis
  zur Kante. Der Radius von 22 % gilt wie bei jeder Kachel.
- Sie wird nie abgeblendet. Im Hero steht sie rechts vom Chatfenster, wo
  Platz ist; sonst setzt das Skript sie oben rechts oder über das Fenster.

## Leere Kacheln

- Sie halten im Feld das Raster, damit es nicht wie eine Liste wirkt.
  Fläche `rgba(255,255,255,.4)`, Haarlinie `rgba(20,24,34,.06)`, kein
  Schatten, nicht bedienbar, für Screenreader unsichtbar.
- Ihre Deckkraft nimmt zum Rand des Feldes hin ab (`--o`).
- **(vorläufig)** Wie unregelmässig die Logos im Feld verteilt sind und wie
  viele Zellen leer bleiben, steuert der Hero-Regler «Unregelmässigkeit»
  (`TUNE.skip` in `variant-c.html`). Den gültigen Wert dort übernehmen.
- Ausserhalb des Hero nur als stilles Füllelement, nie als Platzhalter für
  ein Logo, das es nicht gibt.

## Freiraum um Text

- Im Feld bleibt um den Text eine Zone ohne Kacheln.
  **(vorläufig)** Ihre Breite ist der Hero-Regler «Abstand zum Text»:
  ein Faktor auf das Raster (`copyPad`, derzeit 0.5 Kacheln), mindestens
  22 px.
- Text steht nie auf einer Kachel des Feldes.

## Bewegung

- Kippen: `transition: transform .55s cubic-bezier(.2,.7,.2,1)`; während der
  Mauszeiger verfolgt wird `.16s ease-out`. Ein Schreibvorgang pro Frame.
- Ring ein/aus: `opacity .5s ease`. Abblenden: `opacity .6s`, `filter .6s`.
- Lichtstreifen: schräger weisser Verlauf, 4.5 s Zyklus, der Durchlauf
  dauert 30 % davon; im Hero nach Position gestaffelt. Ausserhalb des
  Hero läuft er **einmal**, wenn die Kachel ins Bild kommt.
- **`prefers-reduced-motion: reduce`**: kein Kippen, kein Heben, kein
  Lichtstreifen, keine Skalierung. Zustände wechseln nur über Deckkraft.

## Wo Kacheln stehen dürfen

- **Höchstens ein Kachelfeld pro Bildschirmhöhe.** Das Feld der Seite ist
  der Hero. Darunter folgen Abschnitte mit Text, in denen Kacheln nur einzeln
  oder als kurze Reihe (bis sechs) eine Aussage zeigen.
- Zwischen zwei Abschnitten mit Kacheln steht mindestens eine ruhige Zone
  aus Text und Weissraum.
- Kacheln zeigen nur, was es gibt: angebundene Anwendungen, Dateitypen, die
  Kontexus liest und schreibt, die Schweizer Herkunft. Keine Dekor-Logos von
  Diensten, die nicht angebunden sind.
- Abstand zwischen Abschnitten: 120 px auf dem Desktop, 80 px auf dem
  Telefon. Textbreite höchstens 62 Zeichen.

## Barrierefreiheit

- Ein Kachelfeld ist eine Gruppe mit **einem** Tab-Halt; Pfeiltasten wählen
  die nächste Kachel (siehe `variant-c.html`).
- Kacheln, die nur zeigen und nichts tun, sind `aria-hidden` und nicht
  fokussierbar; die Aussage steht im Text daneben.
- Fokus ist immer sichtbar (Ring voll oder `outline: 2px solid --accent`).
- Bis 360 px Breite ohne waagrechtes Scrollen.
