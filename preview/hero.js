/* The hero of page.html: the script of variant-c.html without its prototype tools
   (tuning panel, «Anordnen» drag mode with its layout in localStorage, #vh= test
   hook), then changed by hand for this page: the «+» tile and the phone layout
   (buildStackWall, buildLandBand). The two files have diverged; a change to the hero
   in variant-c.html has to be carried over here by hand. */
(function () {
  'use strict';

  /* ---------------- Content ---------------- */
  var CASES = [
    { id:'treuhand-kreditoren', title:'Treuhand', featured:true,
      prompt:'Erfassen Sie die Lieferantenrechnungen aus dem Posteingang in bexio.',
      connectors:['microsoft_mail','mwst','bexio'],
      steps:[
        ['microsoft_mail','Rechnungen in Outlook gefunden','Posteingang seit 1. November: 14 Mails mit Rechnung als PDF-Anhang'],
        ['mwst','MWST-Nummern und Kurse geprüft','14 Lieferanten im UID-Register gültig, 2 Rechnungen in EUR zum ESTV-Monatsmittelkurs umgerechnet'],
        ['bexio','Lieferantenrechnungen in bexio vorbereitet','14 Rechnungen bereit zum Erfassen, wartet auf Freigabe']],
      result:"14 Rechnungen über total CHF 18'420.35 sind vorbereitet, 2 davon aus EUR umgerechnet. Alle Lieferanten haben eine gültige MWST-Nummer. Soll ich sie in bexio erfassen?" },
    { id:'vertrieb-teams', title:'Vertrieb', featured:true,
      prompt:'Sandra fragt in Teams nach dem Stand bei der Meier AG. Antworten Sie ihr mit den Angaben aus Salesforce.',
      connectors:['microsoft_teams','salesforce'],
      steps:[
        ['microsoft_teams','Frage in Teams gelesen','Kanal «Vertrieb», Nachricht von Sandra'],
        ['salesforce','Opportunity in Salesforce gelesen',"«Meier AG – Ausbau»: Phase Verhandlung, CHF 48'000, Abschluss geplant 15. Dezember"],
        ['microsoft_teams','Antwort in Teams vorbereitet','Antwort an Sandra, wartet auf Freigabe']],
      result:"Die Opportunity steht in der Verhandlung, Volumen CHF 48'000, geplanter Abschluss am 15. Dezember. Die Antwort an Sandra ist geschrieben. Soll ich sie im Kanal posten?" },
    { id:'finanzen-vr', title:'Finanzen', featured:true,
      prompt:'Bereiten Sie die Zahlen Q3 für die Verwaltungsratssitzung vor.',
      connectors:['bexio','charts','pptx'],
      steps:[
        ['bexio','Saldenliste aus bexio berechnet','Q3 2026 mit Vorjahr Q3 2025, aus dem Journal'],
        ['charts','Diagramme erstellt','Wasserfall Betriebsergebnis, Umsatz nach Monat'],
        ['pptx','Präsentation erstellt','VR_Q3_2026.pptx, 6 Folien in der Firmenvorlage']],
      result:"Der Umsatz Q3 liegt bei CHF 2.41 Mio., 6 % über Vorjahr, das Betriebsergebnis bei CHF 312'000, beides aus dem Journal in bexio berechnet. Die Präsentation hat 6 Folien mit Wasserfall und Monatsverlauf." },
    { id:'termin-projektteam', title:'Büro', featured:true,
      prompt:'Finden Sie nächste Woche einen Termin mit dem Projektteam Meier AG.',
      connectors:['microsoft_directory','microsoft_calendar'],
      steps:[
        ['microsoft_directory','Gruppe im Verzeichnis nachgeschlagen','Gruppe «Projekt Meier AG»: 5 Mitglieder'],
        ['microsoft_calendar','Freie Zeiten in Outlook gesucht','Gemeinsam frei: Dienstag, 1. Dezember, 14:00–15:00'],
        ['microsoft_calendar','Termin in Outlook vorbereitet','Einladung an das Team, wartet auf Freigabe']],
      result:'Alle 5 Mitglieder sind am Dienstag, 1. Dezember, von 14:00 bis 15:00 frei. Der Termin ist vorbereitet. Soll ich die Einladung senden?' },
    { id:'npo-stiftungen', title:'NPO', featured:true,
      prompt:'Finden Sie Stiftungen für unser Jugendprojekt im Kanton Bern.',
      connectors:['fundraiso','notion'],
      steps:[
        ['fundraiso','Stiftungen in Fundraiso gesucht','Zweck Jugend, Region Bern: 18 Stiftungen'],
        ['fundraiso','Vergabungen verglichen','6 Stiftungen haben in den letzten 3 Jahren ähnliche Organisationen finanziert'],
        ['notion','Einträge in Notion vorbereitet','6 Stiftungen für die Datenbank «Gesuche», wartet auf Freigabe']],
      result:"18 Stiftungen passen zu Zweck und Region, 6 davon haben bereits ähnliche Organisationen unterstützt, mit Vergabungen zwischen CHF 5'000 und CHF 40'000. Soll ich die 6 in Ihrer Notion-Datenbank «Gesuche» anlegen?" },
    { id:'npo-newsletter', title:'Verein', featured:true,
      prompt:'Nehmen Sie die neuen Mitglieder in den Newsletter auf.',
      connectors:['webling','mailchimp'],
      steps:[
        ['webling','Neue Mitglieder in Webling gelesen','37 Eintritte seit 1. Oktober, 34 mit E-Mail-Adresse'],
        ['mailchimp','Liste in Mailchimp abgeglichen','Liste «Newsletter»: 5 der 34 sind bereits eingetragen'],
        ['mailchimp','Kontakte in Mailchimp vorbereitet','29 neue Kontakte als «pending» mit Bestätigungsmail, wartet auf Freigabe']],
      result:'29 neue Mitglieder fehlen noch im Newsletter, 3 haben keine E-Mail-Adresse in Webling. Die 29 erhalten eine Bestätigungsmail, bevor sie eingetragen sind. Soll ich sie hinzufügen?' },
    { id:'handelsregister-neukunde', title:'KMU', featured:false,
      prompt:'Prüfen Sie die Meier AG im Handelsregister, bevor wir den Vertrag senden.',
      connectors:['zefix','mwst','microsoft_mail'],
      steps:[
        ['zefix','Eintrag im Handelsregister gelesen',"Meier AG: aktiv, Aktienkapital CHF 100'000, 2 Personen mit Kollektivunterschrift zu zweien"],
        ['mwst','MWST-Nummer im UID-Register geprüft','CHE-Nummer mit MWST-Zusatz gültig'],
        ['microsoft_mail','Mail in Outlook vorbereitet','Vertrag an Ihren Kontakt bei der Meier AG, Entwurf wartet auf Freigabe']],
      result:'Die Meier AG ist aktiv, und ihre MWST-Nummer ist gültig. Unterschreiben müssen zwei Personen gemeinsam, darauf weist die Mail hin. Soll ich sie senden?' },
    { id:'kanzlei-zitate', title:'Kanzlei', featured:false,
      prompt:'Prüfen Sie die Gesetzeszitate in unserem Memo zur Überschuldung.',
      connectors:['microsoft_files','fedlex','docx'],
      steps:[
        ['microsoft_files','Memo in SharePoint gelesen','Memo_Ueberschuldung.docx, 9 Seiten, 6 Gesetzeszitate'],
        ['fedlex','Zitate in Fedlex geprüft','Art. 725 OR: die Überschuldung steht seit 1.1.2023 in Art. 725b OR'],
        ['docx','Korrektur im Memo eingetragen','Neue Fassung Memo_Ueberschuldung_v2.docx']],
      result:'5 von 6 Zitaten stimmen. Die Überschuldung regelt seit 1. Januar 2023 Art. 725b OR und nicht mehr Art. 725. Die Korrektur steht in der neuen Fassung des Memos.' },
    { id:'vertrieb-leads', title:'Marketing', featured:false,
      prompt:'Ergänzen Sie die neuen Leads in HubSpot mit Branche und Website.',
      connectors:['hubspot','websearch'],
      steps:[
        ['hubspot','Neue Firmen in HubSpot gelesen','12 Firmen seit Montag, bei allen fehlen Branche und Website'],
        ['websearch','Websites im Web gesucht','9 von 12 Websites gefunden und gelesen, jede Branche mit Quelle belegt'],
        ['hubspot','Änderungen in HubSpot vorbereitet','9 Firmen mit Branche und Website, wartet auf Freigabe']],
      result:'Für 9 der 12 neuen Firmen habe ich Branche und Website gefunden, jeweils mit Quelle. Für die übrigen 3 gibt es keine auffindbare Website. Soll ich die 9 Einträge in HubSpot ergänzen?' },
    { id:'architektur-grundriss', title:'Architektur', featured:false,
      prompt:'Erstellen Sie den Grundriss für das 2. OG nach dem Raumprogramm.',
      connectors:['xlsx','cad'],
      steps:[
        ['xlsx','Raumprogramm gelesen','Raumprogramm.xlsx: 14 Räume, total 612 m²'],
        ['cad','Grundriss und Modell erstellt','Grundriss als DXF, Gebäudemodell als IFC'],
        ['cad','Plan geprüft','Erschliessung in Ordnung, keine Kollisionen, 1 Büro 3 m² unter Vorgabe']],
      result:'Der Grundriss enthält alle 14 Räume. Ein Büro ist 3 m² kleiner als im Raumprogramm verlangt. Das IFC-Modell lässt sich in Archicad und Revit öffnen.' },
    { id:'kommunikation-audio', title:'Kommunikation', featured:false,
      prompt:'Vertonen Sie unsere Medienmitteilung und planen Sie einen LinkedIn-Beitrag dazu.',
      connectors:['elevenlabs','zapier'],
      steps:[
        ['elevenlabs','Stimme in ElevenLabs gewählt','Stimme «Deutsch, ruhig» aus Ihrer Bibliothek'],
        ['elevenlabs','Text vertont','Medienmitteilung, 2:40 Minuten'],
        ['zapier','Aktion in Zapier vorbereitet','«LinkedIn-Beitrag planen», wartet auf Freigabe']],
      result:'Die Audiofassung ist 2 Minuten 40 Sekunden lang. Den LinkedIn-Beitrag plane ich über die Aktion, die Sie in Zapier freigegeben haben. Soll ich sie ausführen?' },
    /* DRAFT, not from the approved content: needs the user's approval (gives the Airtable tile a case) */
    { id:'anlass-gaeste', title:'Anlass', featured:false,
      prompt:'Tragen Sie die Anmeldungen zum Kundenanlass in Airtable ein.',
      connectors:['microsoft_mail','airtable'],
      steps:[
        ['microsoft_mail','Anmeldungen in Outlook gelesen','22 Antworten auf die Einladung, 19 Zusagen'],
        ['airtable','Basis «Anlässe» in Airtable durchsucht','Tabelle «Gäste»: 4 der 19 sind bereits eingetragen'],
        ['airtable','Einträge in Airtable vorbereitet','15 neue Gäste, wartet auf Freigabe']],
      result:'19 Personen haben zugesagt, 4 davon stehen bereits in der Tabelle «Gäste». Soll ich die 15 neuen Einträge in Airtable anlegen?' },
    /* DRAFT, not from the approved content: needs the user's approval (gives the PDF tile a case) */
    { id:'formular-lieferant', title:'Administration', featured:false,
      prompt:'Füllen Sie das Formular zur Lieferantenregistrierung mit unseren Firmendaten aus.',
      connectors:['zefix','pdf'],
      steps:[
        ['zefix','Eigenen Eintrag im Handelsregister gelesen','UID, Sitz und zeichnungsberechtigte Personen'],
        ['pdf','Formular gelesen','Lieferantenregistrierung.pdf, 18 Felder'],
        ['pdf','Formular ausgefüllt','Lieferantenregistrierung_ausgefuellt.pdf, 14 von 18 Feldern']],
      result:'14 von 18 Feldern sind ausgefüllt, mit den Angaben aus dem Handelsregister. Offen sind Bankverbindung, Kontaktperson, Telefon und E-Mail. Unterschreiben müssen die zeichnungsberechtigten Personen.' }
  ];

  /* Tooltips say only what Kontexus does with the service. Third-party services
     (Airtable, ElevenLabs, HubSpot, Notion, Salesforce, Zapier) run at their provider:
     nothing here may suggest that they run in Switzerland. */
  var TIPS = {
    airtable:['Airtable','Kontexus durchsucht und liest mit Ihrem Airtable-Konto Basen und Tabellen und legt Einträge an oder ändert sie.'], /* DRAFT text, needs approval */
    bexio:['bexio','Kontexus erfasst Lieferantenrechnungen und Spesen, erstellt Offerten und Rechnungen und wertet die Buchhaltung aus.'],
    cad:['CAD','Kontexus erstellt Grundrisse als DXF und Gebäudemodelle als IFC und prüft sie.'],
    charts:['Diagramme','Kontexus erstellt Balken-, Wasserfall- und Gantt-Diagramme sowie Organigramme im Firmendesign.'],
    docx:['Word','Kontexus erstellt und bearbeitet Briefe, Berichte und Verträge im Firmendesign.'],
    elevenlabs:['ElevenLabs','Kontexus vertont mit Ihrem ElevenLabs-Konto Texte.'],
    fedlex:['Fedlex','Kontexus beantwortet Rechtsfragen mit belegten Normen aus dem Bundesrecht und prüft Gesetzeszitate.'],
    fundraiso:['Fundraiso','Kontexus sucht Stiftungen nach Zweck, Region und Grösse und zeigt, wen sie finanzieren.'],
    hubspot:['HubSpot','Kontexus liest und bearbeitet mit Ihrem HubSpot-Konto Kontakte, Firmen, Deals und Tickets.'],
    mailchimp:['Mailchimp','Kontexus pflegt Ihre Kontakte und legt Newsletter als Entwurf an.'],
    microsoft_calendar:['Outlook Kalender','Kontexus sucht freie Zeiten und legt Termine an.'],
    microsoft_directory:['Microsoft Verzeichnis','Kontexus schlägt Personen, Gruppen und Kontakte in Ihrem Microsoft 365 nach.'],
    microsoft_files:['OneDrive & SharePoint','Kontexus durchsucht und liest Dateien in OneDrive und auf SharePoint.'],
    microsoft_mail:['Outlook Mail','Kontexus liest Ihre Mails und Anhänge und legt Antworten als Entwurf an.'],
    microsoft_teams:['Microsoft Teams','Kontexus liest Kanal- und Chatnachrichten und beantwortet sie.'],
    mwst:['MWST','Kontexus prüft MWST-Nummern im UID-Register und rechnet Fremdwährungen zum ESTV-Kurs um.'],
    notion:['Notion','Kontexus liest mit Ihrem Notion-Konto Seiten und Datenbanken und legt neue an.'],
    pdf:['PDF','Kontexus erstellt gestaltete PDF-Dokumente und füllt PDF-Formulare aus.'],
    pptx:['PowerPoint','Kontexus erstellt Präsentationen aus Inhalten oder Daten in Ihrer Firmenvorlage.'],
    salesforce:['Salesforce','Kontexus liest mit Ihrem Salesforce-Konto Accounts, Kontakte und Opportunities, ohne sie zu ändern.'],
    webling:['Webling','Kontexus liest Mitglieder, Rechnungen und Buchungen Ihres Vereins und pflegt Mitglieder.'],
    websearch:['Websuche','Kontexus durchsucht das Web und belegt jede Aussage mit der Quelle.'],
    xlsx:['Excel','Kontexus erstellt Arbeitsmappen mit Formeln und rechnet mit den Zahlen Ihrer Tabellen.'],
    zapier:['Zapier','Kontexus führt die Aktionen aus, die Sie in Zapier für KI-Assistenten freigegeben haben.'],
    zefix:['Handelsregister','Kontexus liest Status, Kapital und eingetragene Personen von Schweizer Firmen.']
  };
  /* the «+» tile: for an application that is not on the wall (page version only). The
     claim follows the NPO page's FAQ: «besprechen wir die Anbindung gern». */
  var PLUS = ['Ihre Anwendung fehlt?', 'Wir besprechen die Anbindung gern.', 'Ein Klick auf die Kachel öffnet eine E-Mail.', 'Ihre Anwendung fehlt? Anbindung anfragen'];
  var PLUS_MAIL = 'mailto:info@llmify.ch?subject=Anbindung%20an%20Kontexus';
  var PLUS_SVG = '<svg class="plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M4 12h16" fill="none" stroke="#3674d9" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var SWISS = ['Betrieben in der Schweiz','Plattform und Sprachmodell laufen standardmässig in der Schweiz. Dort liegen auch die Dateien Ihres Arbeitsbereichs.'];

  /* The write step of a case that ends in a question is shown as an approval card
     in place of its row, as in the app. Title and line under it per case. */
  var ASK = {
    'treuhand-kreditoren':['14 Lieferantenrechnungen in bexio erfassen','14 Rechnungen, total CHF 18\'420.35'],
    'termin-projektteam':['Einladung in Outlook senden','Dienstag, 1. Dezember, 14:00–15:00, an das Team'],
    'handelsregister-neukunde':['Mail in Outlook senden','Vertrag an Ihren Kontakt bei der Meier AG'],
    'npo-stiftungen':['6 Einträge in Notion anlegen','Datenbank «Gesuche»'],
    'npo-newsletter':['29 Kontakte in Mailchimp hinzufügen','Liste «Newsletter», mit Bestätigungsmail'],
    'vertrieb-teams':['Antwort in Teams posten','Kanal «Vertrieb», Antwort an Sandra'],
    'vertrieb-leads':['9 Firmen in HubSpot ergänzen','Branche und Website, je mit Quelle'],
    'kommunikation-audio':['Aktion in Zapier ausführen','«LinkedIn-Beitrag planen»'],
    'anlass-gaeste':['15 Gäste in Airtable anlegen','Basis «Anlässe», Tabelle «Gäste»']
  };

  /* Swiss flag (Wappenschutzgesetz): square red field, free-standing white cross,
     arms 6 wide and 7 long from the centre square, the cross 20 x 20 on a 32 x 32 field */
  var FLAG = '<svg class="flag" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" fill="#FF0000"/><path fill="#fff" d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z"/></svg>';
  /* the Kontexus mark (markGeometry.ts) as the working indicator of a running step */
  var SPIN = '<svg viewBox="-36 -36 72 72" aria-hidden="true"><defs><linearGradient id="kxmg" gradientUnits="userSpaceOnUse" x1="-36" y1="-36" x2="36" y2="36"><stop offset="0" stop-color="#6B9FFF"/><stop offset="1" stop-color="#6BA5F2"/></linearGradient></defs><g class="kxm__spin" stroke="url(#kxmg)" stroke-width="9.67" stroke-linecap="round"><line class="kxm__arm" style="--ox:3px;--oy:-3px" x1="15.322" y1="-15.322" x2="27.542" y2="-27.542"/><line class="kxm__arm" style="--ox:3px;--oy:3px" x1="15.322" y1="15.322" x2="27.542" y2="27.542"/><line class="kxm__arm" style="--ox:-3px;--oy:3px" x1="-15.322" y1="15.322" x2="-27.542" y2="27.542"/><line class="kxm__arm" style="--ox:-3px;--oy:-3px" x1="-15.322" y1="-15.322" x2="-27.542" y2="-27.542"/><circle class="kxm__core" r="8.954" fill="url(#kxmg)" stroke="none"/></g></svg>';
  /* built-in web search: the app draws a grey globe glyph in the row, not the card artwork */
  var GLOBE = '<svg class="gi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/></svg>';

  var ICONS = Object.keys(TIPS);
  /* high-resolution files in icons-hd/: SVG where a vector exists, else the largest PNG */
  var SVG = ['airtable','bexio','cad','charts','docx','elevenlabs','fundraiso','hubspot','mailchimp','microsoft_calendar','microsoft_directory','microsoft_files','microsoft_mail','microsoft_teams','mwst','notion','pdf','pptx','salesforce','websearch','xlsx','zapier','zefix'];
  /* logos with their own square plate: they fill the tile */
  var SQUARE = ['bexio','cad','charts','docx','fedlex','hubspot','mailchimp','mwst','pdf','pptx','webling','websearch','xlsx','zapier','zefix'];
  var FEATURED = CASES.filter(function (c) { return c.featured; });
  /* fill order: featured connectors first, so the loop's tiles take the places nearest the content */
  var ORDER = [];
  FEATURED.concat(CASES).forEach(function (c) { c.connectors.forEach(function (k) { if (ORDER.indexOf(k) < 0) ORDER.push(k); }); });
  ICONS.forEach(function (k) { if (ORDER.indexOf(k) < 0) ORDER.push(k); });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var hero = $('hero'), wall = $('wall'), grid = $('grid'), copy = $('copy'), screen = $('screen');
  var mcard = $('mcard');
  var body = $('stagebody'), picker = $('picker'), tip = $('tip');
  function src(icon) { return 'icons-hd/' + icon + (SVG.indexOf(icon) >= 0 ? '.svg' : '.png'); }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function bold(s) { return esc(s).replace(/CHF [\d'.]+(?: Mio\.)?/g, function (m) { return '<b>' + m.replace(/\.$/, '') + '</b>' + (/\.$/.test(m) && !/Mio\.$/.test(m) ? '.' : ''); }); }
  function casesFor(icon) { return CASES.filter(function (c) { return c.connectors.indexOf(icon) >= 0; }); }

  /* ---------------- Wall ---------------- */
  var tilesByIcon = {};
  var NEED = ORDER.length + 2;            /* every connector once, the Swiss tile and the «+» tile */
  var STACKED = '(max-width: 760px), (max-height: 500px) and (orientation: landscape)';
  var inner = hero.querySelector('.hero__inner');

  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  function hit(r, o, pad) { return !(r.right < o.left - pad || r.left > o.right + pad || r.bottom < o.top - pad || r.top > o.bottom + pad); }
  function rectDist(x, y, o) { var dx = Math.max(o.left - x, 0, x - o.right), dy = Math.max(o.top - y, 0, y - o.bottom); return Math.sqrt(dx * dx + dy * dy); }

  /* the values chosen with the tuning panel of variant-c.html, fixed here: clear zone
     around the text in grid steps, share of cells left empty, how far the uninvolved
     tiles fade, and whether tiles keep to a checkerboard */
  var TUNE = { copyPad: 0.5, skip: 0.25, fade: 1, checker: false };
  function applyFade() {
    hero.style.setProperty('--fade-o', (1 - 0.85 * TUNE.fade).toFixed(2));
    hero.style.setProperty('--fade-g', TUNE.fade.toFixed(2));
  }

  function setHeroHeight(h) {
    if (h) { hero.style.height = h + 'px'; hero.style.minHeight = '0'; hero.style.maxHeight = 'none'; }
    else { hero.style.height = ''; hero.style.minHeight = ''; hero.style.maxHeight = ''; }
  }

  function buildWall() {
    var mobile = window.matchMedia(STACKED).matches;
    inner.style.paddingTop = inner.style.paddingBottom = '';
    setHeroHeight(0);
    if (mobile) { buildBands(); return; }
    /* back from phone width: the wall returns to its place behind the content */
    if (wall.parentNode !== hero) hero.insertBefore(wall, hero.querySelector('.veil'));
    grid.classList.remove('is-bands', 'is-stack');
    hero.classList.remove('is-stack');
    mcard.style.top = '';
    var W = hero.clientWidth, P, S;
    {
      /* desktop: tiles grow with the window (66 px at 1440, 87 px at 1920, 56 px at 1024);
         keep a clear zone around the text; if the window is too small, the tiles
         shrink a little, and if they still do not fit, the hero grows taller */
      /* clear zone and gaps come from TUNE (fixed values, see above);
         rather than crowd the text on small windows, the hero grows taller */
      for (var grow = 0; grow < 10; grow++) {
        var H = hero.clientHeight;
        var p0 = Math.round(Math.min(112, Math.max(70, Math.min(W / 17.5, H / 9))));
        var firstFit = 0;
        for (var p = p0; p >= Math.min(p0, 60); p -= 4) {
          P = layCells(W, H, false, p);
          S = place(P, false, { copyPad: Math.max(22, Math.round(p * TUNE.copyPad)), screenPad: Math.max(16, Math.round(p * 0.25)), skip: TUNE.skip, spread: 2 });
          if (S.fits && !firstFit) firstFit = p;
          if (S.ok) { grid.dataset.level = p + '/' + grow; break; }
        }
        /* never roomy enough down to 60 px: take the largest size at which all tiles fit */
        if (!S.ok && firstFit) {
          P = layCells(W, H, false, firstFit);
          S = place(P, false, { copyPad: Math.max(22, Math.round(firstFit * TUNE.copyPad)), screenPad: Math.max(16, Math.round(firstFit * 0.25)), skip: TUNE.skip });
          grid.dataset.level = firstFit + '/' + grow + '/tight';
        }
        if (S.ok) break;
        setHeroHeight(H + 72);
      }
    }
    afterLay(P, S);
  }

  /* ---------------- Phones: one band of tiles under the card ----------------
     Only the connectors of the featured cases (the loop plays only those) plus the Swiss
     tile. The wall moves into the content column, after the card, so text, card and
     tiles stay one group. Portrait: two rows, the connectors alternately into the
     first and second, the Swiss tile at the end of the first. Landscape: one row. */
  /* phones show the applications people recognise by their logo; generic tools (Word,
     charts, PDF, CAD, MWST, Fedlex, the register, web search) appear only as steps in the card */
  var MOBILE_ICONS = ['microsoft_mail', 'bexio', 'microsoft_teams', 'salesforce', 'microsoft_files', 'hubspot', 'microsoft_calendar',
    'mailchimp', 'notion', 'fundraiso', 'airtable', 'webling', 'zapier'].filter(function (k) { return ORDER.indexOf(k) >= 0; });
  function isStacked() { return window.matchMedia(STACKED).matches; }
  /* face, label and modifier of a tile button: the Swiss tile, the «+» tile or a connector */
  function dressTile(b, icon) {
    if (icon === 'swiss') {
      b.classList.add('h-tile--flag');
      b.setAttribute('aria-label', SWISS[0] + ': ' + SWISS[1]);
      b.innerHTML = '<span class="h-tile__face">' + FLAG + '<span class="h-gloss"></span></span>';
    } else if (icon === 'plus') {
      b.classList.add('h-tile--plus');
      b.setAttribute('aria-label', PLUS[3]);
      b.innerHTML = '<span class="h-tile__face">' + PLUS_SVG + '</span>';
    } else {
      if (SQUARE.indexOf(icon) >= 0) b.classList.add('h-tile--sq');
      b.setAttribute('aria-label', TIPS[icon][0] + (casesFor(icon).length ? ': Beispiel zeigen' : ''));
      b.innerHTML = '<span class="h-tile__face"><img src="' + src(icon) + '" alt="" draggable="false"><span class="h-gloss"></span></span>';
    }
  }

  /* a tile button of the phone layouts */
  function bandTile(icon, d) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'h-tile'; b.tabIndex = -1; b.dataset.icon = icon;
    b.style.setProperty('--d', d);
    dressTile(b, icon);
    (tilesByIcon[icon] = tilesByIcon[icon] || []).push(b);
    return b;
  }

  var LAND = '(max-height: 500px) and (orientation: landscape)';
  /* the other connectors: only as a quiet wall behind the card on phones */
  var OTHER_ICONS = ORDER.filter(function (k) { return MOBILE_ICONS.indexOf(k) < 0; });

  function buildBands() {
    /* phones: the sections keep their own default grid */
    ['--wall-p', '--wall-x'].forEach(function (v) { document.documentElement.style.removeProperty(v); });
    var land = window.matchMedia(LAND).matches;
    grid.style.left = grid.style.top = grid.style.gridTemplateColumns = '';
    grid.textContent = '';
    tilesByIcon = {};
    hero.classList.toggle('is-stack', !land);
    sizeCard();   /* measure the card with the phone styles in place */
    if (land) buildLandBand(); else buildStackWall();
    var first = grid.querySelector('button.h-tile'); if (first) first.tabIndex = 0;
    applyLit();
  }

  /* phones in landscape: one row of tiles under text and card */
  function buildLandBand() {
    var icons = MOBILE_ICONS.concat('swiss', 'plus'), n = icons.length;
    var avail = Math.min(hero.clientWidth, 900) - 32;
    /* down to 24 px tiles and 6 px gaps, so 15 tiles fit a 568 px wide phone */
    var t = Math.max(24, Math.min(36, Math.floor((avail - (n - 1) * 10) / n)));
    var g = Math.max(6, Math.min(16, Math.floor((avail - n * t) / (n - 1))));
    hero.style.setProperty('--t', t + 'px');
    hero.style.setProperty('--gap', g + 'px');
    grid.classList.remove('is-stack');
    grid.classList.add('is-bands');
    mcard.style.top = '';
    if (wall.parentNode !== inner) inner.appendChild(wall);
    var band = document.createElement('div');
    band.className = 'band';
    icons.forEach(function (icon, c) {
      var cell = document.createElement('div'); cell.className = 'cell';
      cell.appendChild(bandTile(icon, c * 90)); band.appendChild(cell);
    });
    grid.appendChild(band);
  }

  /* phones upright: a wall across the full text width, its outer tiles flush with the
     text. The example card lies over its upper rows, as the window lies over the wall
     on desktop; the top row shows a little above the card. Under the card, two rows
     stay free: they hold the connectors of the featured cases and the Swiss tile, so
     the lit tiles of the running case are always in view. The rows the card covers
     carry the other connectors, quiet, and are not buttons. */
  function buildStackWall() {
    /* six columns, so the tiles can be larger; the 15 tiles under the card go into three
       rows of six, with the three free cells spread evenly */
    var n = 6, L = 3, slots = n * L;
    /* no «+» tile on phones; the Swiss tile sits at the right end of the first row; the
       free cells are spread so they form neither a row nor a column */
    var list = MOBILE_ICONS.slice(), skip = {}, fixed = {};
    fixed[n - 1] = 'swiss';
    /* the free cells take the remaining tools of the loop's examples, so every step of
       those examples lights a tile */
    FEATURED.forEach(function (c) { c.connectors.forEach(function (k) { if (list.indexOf(k) < 0 && k !== 'swiss') list.push(k); }); });
    var lower = [], li = 0;
    for (var rr = 0; rr < L; rr++) { lower.push([]); for (var cc = 0; cc < n; cc++) { var si = rr * n + cc; lower[rr].push(fixed[si] || (skip[si] || li >= list.length ? null : list[li++])); } }
    var cs = getComputedStyle(inner);
    var avail = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    /* the gap about a quarter of a tile; columns spread to the full width (space-between) */
    var t = Math.max(30, Math.min(56, Math.floor(avail / (n + (n - 1) * 0.28))));
    var g = Math.max(10, Math.min(14, Math.round(t * 0.28)));
    hero.style.setProperty('--t', t + 'px');
    hero.style.setProperty('--gap', g + 'px');
    grid.classList.remove('is-bands');
    grid.classList.add('is-stack');
    grid.style.gridTemplateColumns = 'repeat(' + n + ',' + t + 'px)';
    if (wall.parentNode !== screen) screen.insertBefore(wall, mcard);
    /* the card is embedded in the wall: it covers whole rows, from the second row on,
       and its height is snapped to the grid, so its edges sit on the grid lines */
    /* the card: as few whole rows as its content needs (two on most phones) */
    var extra = Math.round(g * 1.5);   /* more room between the card and the first tile row */
    var p = t + g, kc = Math.max(2, Math.ceil((mcard.offsetHeight + g + extra) / p));
    /* all tiles under the card: no row above it */
    var top = 0, v = kc;
    mcard.style.top = top + 'px';
    /* the card stops a little short of its last row, so the gap to the tiles is about twice a tile gap */
    mcard.style.height = (kc * p - g - extra) + 'px';
    var k = 0;
    for (var r = 0; r < v + L; r++) for (var c = 0; c < n; c++) {
      var cell = document.createElement('div'), d = (r + c) * 90;
      if (r >= v) {
        var icon = lower[r - v][c];
        cell.className = icon ? 'cell' : 'cell cell--empty';
        if (icon) cell.appendChild(bandTile(icon, d));
      } else if (r * p < top && (r + c) % 2 === 0 && k < OTHER_ICONS.length) {
        /* rows that show above the card: every other cell a quiet tile */
        var o = OTHER_ICONS[k++], sp = document.createElement('span');
        sp.className = 'h-tile h-tile--deco' + (SQUARE.indexOf(o) >= 0 ? ' h-tile--sq' : '');
        sp.setAttribute('aria-hidden', 'true');
        sp.innerHTML = '<span class="h-tile__face"><img src="' + src(o) + '" alt="" draggable="false"></span>';
        cell.className = 'cell'; cell.appendChild(sp);
      } else { cell.className = 'cell cell--empty'; if (r < v) cell.style.visibility = 'hidden'; }   /* under the card: not drawn */
      if (cell.classList.contains('cell--empty')) cell.setAttribute('aria-hidden', 'true');
      grid.appendChild(cell);
    }
  }

  /* the area the text actually covers: logo, headline lines, subtitle lines and buttons,
     not the full width of its column (which reaches well past the last word) */
  function inkRect(el) {
    var L = Infinity, T = Infinity, Rr = -Infinity, B = -Infinity;
    el.querySelectorAll('.logo, .tagline, .sub, .ctas > *').forEach(function (n) {
      var rs;
      if (n.matches('.sub, .tagline')) {
        /* text: the rectangles of the lines of words, not of the whole paragraph box */
        var rg = document.createRange(); rg.selectNodeContents(n); rs = rg.getClientRects();
      } else rs = n.getClientRects();
      for (var k = 0; k < rs.length; k++) { var r = rs[k]; if (!r.width) continue; L = Math.min(L, r.left); T = Math.min(T, r.top); Rr = Math.max(Rr, r.right); B = Math.max(B, r.bottom); }
    });
    if (L === Infinity) return el.getBoundingClientRect();
    return { left: L, top: T, right: Rr, bottom: B, width: Rr - L, height: B - T };
  }

  function layCells(W, H, mobile, pitch, band) {
    var g = mobile ? 12 : Math.round(pitch * 0.2), t = pitch - g;
    hero.style.setProperty('--t', t + 'px');
    hero.style.setProperty('--gap', g + 'px');
    var cols, rows, top;
    if (mobile) {
      /* n full columns inside the hero, plus one cut-off column each side */
      cols = band.n + 2;
      top = 18;
      inner.style.paddingTop = Math.round(top + band.top * pitch - g + 26) + 'px';
      var hr1 = hero.getBoundingClientRect(), sr1 = screen.getBoundingClientRect();
      var below = sr1.bottom - hr1.top + 16;                      /* first free y under the screen */
      var start = Math.ceil((below - top) / pitch);               /* first full row there */
      var need = top + (start + band.bottom) * pitch - g + 24;    /* hero height for the bottom band */
      inner.style.paddingBottom = Math.max(16, Math.round(need - (sr1.bottom - hr1.top))) + 'px';
      rows = start + band.bottom + 1;
    } else {
      cols = Math.ceil(W / pitch) + 3; rows = Math.ceil(H / pitch) + 2;
      top = 14 - pitch;
    }
    var gw = cols * pitch - g;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ',' + t + 'px)';
    var hr0 = hero.getBoundingClientRect(), sr0 = screen.getBoundingClientRect();
    if (mobile) grid.style.left = Math.round((W - gw) / 2) + 'px';
    else {
      /* desktop: one column starts 16px right of the screen, so the flag tile has a clean place there */
      var x0 = sr0.right - hr0.left + 22;
      grid.style.left = Math.round(x0 - Math.ceil(x0 / pitch + 1) * pitch) + 'px';
    }
    grid.style.top = top + 'px';

    var frag = document.createDocumentFragment(), cells = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var d = document.createElement('div');
      d.className = 'cell cell--empty';
      d.setAttribute('aria-hidden', 'true');
      d.style.setProperty('--d', (r + c) * 90);
      d.innerHTML = '<span class="h-gloss"></span>';
      d._r = r; d._c = c;
      frag.appendChild(d); cells.push(d);
    }
    grid.textContent = '';
    grid.appendChild(frag);

    var hr = hero.getBoundingClientRect(), cr = inkRect(copy), sr = screen.getBoundingClientRect();
    var rects = cells.map(function (el) { return el.getBoundingClientRect(); });
    /* cells wholly inside the hero: only these may ever hold a tile */
    var inside = [];
    rects.forEach(function (rc, i) {
      if (rc.left >= hr.left + 6 && rc.right <= hr.right - 6 && rc.top >= hr.top + 6 && rc.bottom <= hr.bottom - (mobile ? 10 : 14)) inside.push(i);
    });
    return { cells: cells, rects: rects, inside: inside, cols: cols, pitch: pitch, hr: hr, cr: cr, sr: sr, mobile: mobile };
  }

  /* Choose the cells: the Swiss tile right of the screen (desktop) or top right (mobile);
     the connector tiles around text and screen, nearest first, with a little randomness
     and an occasional empty cell, and a clear zone around the text. Nothing right of the
     screen but the flag. */
  function place(P, mobile, o) {
    var rects = P.rects, cr = P.cr, sr = P.sr, hr = P.hr, pitch = P.pitch;
    function cx(i) { return (rects[i].left + rects[i].right) / 2; }
    function cy(i) { return (rects[i].top + rects[i].bottom) / 2; }
    var open = P.inside.filter(function (i) {
      /* phones: only the bands above the text and below the screen, nothing beside them */
      if (mobile) return rects[i].bottom <= cr.top - o.copyPad || rects[i].top >= sr.bottom + o.screenPad;
      if (hit(rects[i], sr, o.screenPad) || hit(rects[i], cr, o.copyPad)) return false;
      /* the gap between text and screen may hold tiles too (the user's own layout had them there) */
      return true;
    });
    var right = [], main = [];
    open.forEach(function (i) { if (mobile || rects[i].right <= sr.right + 2) main.push(i); });
    /* the flag's cells right of the screen keep only a small margin, so it can sit
       beside the window even when the connector tiles keep a wider one */
    if (!mobile) P.inside.forEach(function (i) { if (rects[i].left >= sr.right + 12 && rects[i].top >= sr.top - pitch) right.push(i); });

    var swissIdx = -1, best = 1e9;
    function closest(list, tx, ty) {
      list.forEach(function (i) { var dx = cx(i) - tx, dy = cy(i) - ty, dd = dx * dx + dy * dy; if (dd < best) { best = dd; swissIdx = i; } });
    }
    if (mobile) closest(main, hr.right - 40, hr.top);
    else {
      /* one empty column between screen and flag where the window is wide enough;
         otherwise the nearest column (closest() falls back to it by itself) */
      closest(right, sr.right + pitch * 1.5, sr.top + sr.height * 0.3);
      /* no room right of the screen: above the screen, near its right end */
      if (swissIdx < 0) closest(main, sr.right - pitch, sr.top - pitch);
    }
    var rand = rng(11);
    var mx = (cr.right + sr.left) / 2, my = (Math.min(cr.top, sr.top) + Math.max(cr.bottom, sr.bottom)) / 2;
    var pool = main.filter(function (i) { return i !== swissIdx; }).map(function (i) {
      /* the tiles frame the text evenly: nearness to the text counts most, nearness to
         the screen a little, so neither the top nor the gap in the middle collects them */
      var d = rectDist(cx(i), cy(i), cr), e = rectDist(cx(i), cy(i), sr);
      return { i: i, s: mobile ? rand() : d + 0.35 * e + rand() * pitch * 0.35 };
    }).sort(function (a, b) { return a.s - b.s; });
    /* gaps on an even pattern rather than by chance: every k-th cell of a row stays empty,
       the next row offset by two, and each row nudged by 0 or 1 so it is not a strict grid */
    var k = o.skip > 0 ? Math.max(2, Math.round(1 / o.skip)) : 0, shift = [], cells = P.cells;
    function isGap(i) {
      if (!k) return false;
      var r = cells[i]._r, c = cells[i]._c;
      if (shift[r] === undefined) shift[r] = (r * 7 + 3) % 5 < 2 ? 1 : 0;
      return (c + r * 2 + shift[r]) % k === 0;
    }
    var want = NEED - 1, chosen = [], left = pool.length;
    if (mobile) {
      /* phones: the band has a few cells more than tiles; spread the empty ones evenly */
      var cand = main.filter(function (i) { return i !== swissIdx; }).sort(function (a, b) { return a - b; });
      var gaps = Math.max(0, cand.length - want), drop = {};
      for (var k = 0; k < gaps; k++) drop[Math.floor((k + 0.6) * cand.length / gaps)] = 1;
      cand.forEach(function (i, j) { if (!drop[j] && chosen.length < want) chosen.push(i); });
    } else {
      /* Spread like the hand-made layout the user liked: single tiles scattered over the
         whole free area (corners, the gap between text and screen, below the screen), each
         as far from the others as possible. Farthest-point sampling on the grid, with a
         fixed per-cell jitter (TUNE.skip) so it never
         turns into a strict pattern. Big windows get wider spacing, small ones tighter. */
      var cand = main.filter(function (i) { return i !== swissIdx; });
      /* TUNE.checker: only every other cell, so tiles touch at most at a corner */
      if (TUNE.checker) {
        var even = cand.filter(function (i) { return (P.cells[i]._r + P.cells[i]._c) % 2 === 0; });
        var odd = cand.filter(function (i) { return (P.cells[i]._r + P.cells[i]._c) % 2 === 1; });
        cand = even.length >= odd.length ? even : odd;
      }
      var R = cand.map(function (i) { return P.cells[i]._r; }), C = cand.map(function (i) { return P.cells[i]._c; });
      var jit = cand.map(function (i, j) { var h = Math.imul(R[j] + 11, 73856093) ^ Math.imul(C[j] + 7, 19349663); return ((h >>> 0) % 1000) / 1000 - 0.5; });
      var minD = cand.map(function () { return Infinity; }), used = cand.map(function () { return false; });
      /* start in the top left corner */
      var first = 0, fb = 1e12;
      cand.forEach(function (i, j) { var dd = Math.pow(cx(i) - hr.left, 2) + Math.pow(cy(i) - hr.top, 2); if (dd < fb) { fb = dd; first = j; } });
      var pick = first, picked = [];
      while (picked.length < want && pick >= 0) {
        used[pick] = true; picked.push(pick);
        for (var j = 0; j < cand.length; j++) {
          if (used[j]) continue;
          var d = Math.sqrt(Math.pow(R[j] - R[pick], 2) + Math.pow(C[j] - C[pick], 2));
          if (d < minD[j]) minD[j] = d;
        }
        pick = -1; var bs = -1e9;
        for (var j2 = 0; j2 < cand.length; j2++) {
          if (used[j2]) continue;
          /* step 1, as even as possible: the farthest free cell, no randomness (the tiny
             jitter only breaks ties the same way every time) */
          var sc = minD[j2] + jit[j2] * 0.02;
          if (sc > bs) { bs = sc; pick = j2; }
        }
      }
      /* index of the candidates by grid position, and which of them hold a tile */
      var at = {}, holds = {};
      cand.forEach(function (i, j) { at[R[j] + ',' + C[j]] = j; });
      picked.forEach(function (j) { holds[j] = true; });
      function edgeNbrs(j, skip) {
        var n = 0;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var k = at[(R[j] + d[0]) + ',' + (C[j] + d[1])]; if (k !== undefined && k !== skip && holds[k]) n++; });
        return n;
      }
      function nearest(j) {
        var m = Infinity;
        Object.keys(holds).forEach(function (k) { k = +k; if (k !== j) m = Math.min(m, Math.sqrt(Math.pow(R[k] - R[j], 2) + Math.pow(C[k] - C[j], 2))); });
        return m;
      }
      /* step 2, tidy up: a tile that touches another at a side moves to the free cell that
         touches none and lies farthest from all tiles, if there is one */
      for (var pass = 0; pass < 3; pass++) {
        picked.forEach(function (j, n) {
          if (!edgeNbrs(j, -1)) return;
          var best2 = -1, bd2 = 0;
          cand.forEach(function (i, k) {
            if (holds[k] || edgeNbrs(k, j)) return;
            delete holds[j]; var d2 = nearest(k); holds[j] = true;
            if (d2 > bd2) { bd2 = d2; best2 = k; }
          });
          if (best2 >= 0) { delete holds[j]; holds[best2] = true; picked[n] = best2; }
        });
      }
      /* step 3, the slight disturbance (TUNE.skip): that share of the tiles moves
         one cell in a random direction, only where it does not end up beside another tile */
      var rnd = rng(23), dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      picked.forEach(function (j, n) {
        if (rnd() >= o.skip) return;
        var off = Math.floor(rnd() * 8);
        for (var t = 0; t < 8; t++) {
          var d = dirs[(off + t) % 8], k = at[(R[j] + d[0]) + ',' + (C[j] + d[1])];
          if (k === undefined || holds[k]) continue;
          delete holds[j];
          if (edgeNbrs(k, -1)) { holds[j] = true; continue; }
          holds[k] = true; picked[n] = k; break;
        }
      });
      /* the connectors of the loop take the cells nearest the content, so the lit tiles
         sit close to text and screen; the others fill the outer cells */
      chosen = picked.map(function (j) { return cand[j]; }).sort(function (x, y) {
        var dx = Math.min(rectDist(cx(x), cy(x), cr), rectDist(cx(x), cy(x), sr)), dy = Math.min(rectDist(cx(y), cy(y), cr), rectDist(cx(y), cy(y), sr));
        return dx - dy;
      });
    }
    /* desktop: only call it a fit when there are about twice as many free cells as tiles,
       so the tiles can spread out instead of filling every cell */
    var roomy = mobile || o.spread === undefined || (cand && cand.length >= want * (TUNE.checker ? 1.05 : o.spread));
    return { swissIdx: swissIdx, chosen: chosen, ok: swissIdx >= 0 && chosen.length === want && roomy, fits: swissIdx >= 0 && chosen.length === want, P: P };
  }

  function afterLay(P, S) {
    var cells = P.cells, rects = P.rects, cr = P.cr;
    tilesByIcon = {};
    var placed = [];
    function fill(i, icon) {
      var cell = cells[i];
      cell.className = 'cell';
      cell.removeAttribute('aria-hidden');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-tile';
      b.tabIndex = -1;
      b.style.setProperty('--d', (cell._r + cell._c) * 90);
      dressTile(b, icon);
      b.dataset.icon = icon;
      cell.textContent = '';
      cell.appendChild(b);
      placed.push(cell);
      (tilesByIcon[icon] = tilesByIcon[icon] || []).push(b);
    }
    var n, chosen = S.chosen.slice(), plusDone = false;
    if (S.swissIdx >= 0) fill(S.swissIdx, 'swiss');
    /* the «+» tile: among the chosen cells, the one nearest the lower left corner of the
       screen, so it sits by the content and is seen, not in a far corner */
    if (chosen.length > ORDER.length) {
      var pj = 0, pd = 1e12, tx = P.sr.left, ty = P.sr.bottom;
      chosen.forEach(function (i, j) {
        var dx = (rects[i].left + rects[i].right) / 2 - tx, dy = (rects[i].top + rects[i].bottom) / 2 - ty, dd = dx * dx + dy * dy;
        if (dd < pd) { pd = dd; pj = j; }
      });
      fill(chosen.splice(pj, 1)[0], 'plus'); plusDone = true;
    }
    n = Math.min(ORDER.length, chosen.length);
    for (var k = 0; k < n; k++) fill(chosen[k], ORDER[k]);
    /* last resort (never reached at the tested sizes): free cells inside the hero that do
       not touch text or screen; never a cell outside the hero, where a tile could not be seen */
    if (n < ORDER.length) {
      var free = P.inside.filter(function (i) { return cells[i].classList.contains('cell--empty') && !hit(rects[i], P.sr, 2) && !hit(rects[i], cr, 2); });
      for (; n < ORDER.length && free.length; n++) fill(free.shift(), ORDER[n]);
      if (!plusDone && free.length) fill(free.shift(), 'plus');
    }

    /* empty cells: hidden near the text, fading with distance from the tiles */
    cells.forEach(function (cell, i) {
      if (!cell.classList.contains('cell--empty')) return;
      if (hit(rects[i], cr, 8)) { cell.style.setProperty('--o', 0); return; }
      /* below the hero: hidden; the row that runs over the bottom edge stays whole, the
         section grid below starts with the next row */
      if (!P.mobile && rects[i].top >= P.hr.bottom - 1) { cell.style.setProperty('--o', 0); return; }
      /* phones: no empty cells beside text and screen, only in the bands */
      if (P.mobile && rects[i].bottom > cr.top && rects[i].top < P.sr.bottom) { cell.style.setProperty('--o', 0); return; }
      var d = 99;
      placed.forEach(function (p) { d = Math.min(d, Math.max(Math.abs(p._r - cell._r), Math.abs(p._c - cell._c))); });
      cell.style.setProperty('--o', d <= 1 ? 1 : d === 2 ? .7 : d === 3 ? .4 : .2);
    });
    /* one tab stop for the whole wall: the tile nearest the top left */
    var first = null, fs = 1e9;
    grid.querySelectorAll('.h-tile').forEach(function (b) { var r = b.getBoundingClientRect(), s = r.top * 3 + r.left; if (s < fs) { fs = s; first = b; } });
    if (first) first.tabIndex = 0;
    applyLit();
    shareGrid(P);
  }

  /* hand the wall's grid to the page, so the faint grid behind the sections continues it:
     same pitch, same columns, rows counted on from the hero (page.css reads --wall-*) */
  function shareGrid(P) {
    var root = document.documentElement, pitch = P.pitch;
    var gr = grid.getBoundingClientRect(), x = ((gr.left % pitch) + pitch) % pitch;
    var gridTop = gr.top + window.scrollY;
    root.style.setProperty('--wall-p', pitch + 'px');
    root.style.setProperty('--wall-x', x.toFixed(1) + 'px');
    function rows() {
      document.querySelectorAll('[data-wall]').forEach(function (sec) {
        var top = sec.getBoundingClientRect().top + window.scrollY;
        sec.style.setProperty('--wall-y', ((((gridTop - top) % pitch) + pitch) % pitch).toFixed(1) + 'px');
      });
    }
    rows();
    /* sections below can still move once fonts and images settle */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rows);
    window.addEventListener('load', rows, { once: true });
  }

  /* ---------------- Lit state: all tiles of the running example, for the whole example ---------------- */
  var litCase = null;
  function applyLit() {
    wall.classList.toggle('is-running', !!litCase);
    Object.keys(tilesByIcon).forEach(function (icon) {
      var inCase = !!litCase && litCase.connectors.indexOf(icon) >= 0;
      tilesByIcon[icon].forEach(function (b) { b.classList.toggle('is-case', inCase); });
    });
  }
  function light(c) { litCase = c; applyLit(); }

  /* ---------------- Clock (pausable) ---------------- */
  var clock = { ev: [], i: 0, el: 0, t0: 0, timer: 0, hidden: false };
  function clockRun(ev) {
    clearTimeout(clock.timer);
    clock.ev = ev.sort(function (a, b) { return a.at - b.at; });
    clock.i = 0; clock.el = 0; clock.t0 = performance.now();
    clockNext();
  }
  function now() { return clock.el + (clock.hidden ? 0 : performance.now() - clock.t0); }
  function clockNext() {
    clearTimeout(clock.timer);
    if (clock.hidden || clock.i >= clock.ev.length) return;
    clock.timer = setTimeout(clockTick, Math.max(0, clock.ev[clock.i].at - now()));
  }
  function clockTick() {
    var e = now(), list = clock.ev;
    while (clock.i < list.length && list[clock.i].at <= e + 4) {
      list[clock.i++].fn();
      if (clock.ev !== list) return;
    }
    clockNext();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && !clock.hidden) { clock.el = now(); clock.hidden = true; clearTimeout(clock.timer); }
    else if (!document.hidden && clock.hidden) { clock.hidden = false; clock.t0 = performance.now(); clockNext(); }
  });

  /* ---------------- Screen ---------------- */
  function rowIcon(icon) { return icon === 'websearch' ? GLOBE : '<img src="' + src(icon) + '" alt="">'; }
  function layerHTML(c) {
    var ask = ASK[c.id] || null;
    var rows = ask ? c.steps.slice(0, -1) : c.steps;
    var steps = rows.map(function (s) {
      return '<li class="step"><span class="step__mk">' + rowIcon(s[0]) + '<span class="spin">' + SPIN + '</span></span>' +
        '<div class="step__txt"><span class="step__t">' + esc(s[1]) + '</span><span class="step__d">' + esc(s[2]) + '</span></div></li>';
    }).join('');
    var card = '';
    if (ask) {
      var ic = c.steps[c.steps.length - 1][0];
      card = '<div class="h-ask"><div class="h-ask__head"><img class="h-ask__ic' + (SQUARE.indexOf(ic) < 0 ? ' gl' : '') + '" src="' + src(ic) + '" alt="">' +
        '<div><div class="h-ask__q">' + esc(ask[0]) + '</div><div class="h-ask__h">' + esc(ask[1]) + '</div></div></div>' +
        '<div class="h-ask__foot"><span class="h-pb h-pb--ghost">Ablehnen</span><span class="sp"></span><span class="h-pb h-pb--dark">Zulassen</span></div></div>';
    }
    return '<div class="layer__top">Beispiel</div>' +
      '<div class="prompt">' + esc(c.prompt) + '</div>' +
      '<ol class="steps">' + steps + '</ol><p class="result">' + bold(c.result) + '</p>' + card;
  }

  function sizeBody() {
    body.style.height = '';
    var probes = CASES.map(function (c) {
      var p = document.createElement('div'); p.className = 'layer is-probe show-result'; p.setAttribute('aria-hidden', 'true');
      p.innerHTML = layerHTML(c); p.querySelectorAll('.step').forEach(function (s) { s.classList.add('on'); });
      body.appendChild(p); return p;
    });
    var h = 0; probes.forEach(function (p) { h = Math.max(h, p.offsetHeight); });
    probes.forEach(function (p) { p.remove(); });
    body.style.height = Math.ceil(h + 2) + 'px';
  }

  /* ---------------- Phones: the symbolic example card ---------------- */
  var CHECK = '<svg viewBox="0 0 10 10" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.2 5.3l1.9 1.9 3.8-4.2"/></svg>';
  /* the first sentence of the answer; a period after a day number («1. Dezember») or in
     an amount («18'420.35») does not end it */
  function firstSentence(s) {
    var re = /[.?!](?=\s|$)/g, m;
    while ((m = re.exec(s))) { if (!/(^|\s)(\d{1,2}|Art|Nr)$/.test(s.slice(0, m.index))) return s.slice(0, m.index + 1); }
    return s;
  }
  /* phones: a short version of each request, as the user would type it */
  var TASK = {
    'treuhand-kreditoren': 'Erfassen Sie die Rechnungen aus dem Posteingang in bexio.',
    'finanzen-vr': 'Machen Sie aus den Q3-Zahlen in bexio eine Präsentation.',
    'handelsregister-neukunde': 'Prüfen Sie die Meier AG, bevor wir den Vertrag mailen.',
    'kanzlei-zitate': 'Prüfen Sie die Zitate in unserem Memo auf SharePoint.',
    'npo-stiftungen': 'Suchen Sie Stiftungen und legen Sie sie in Notion an.',
    'npo-newsletter': 'Nehmen Sie die neuen Webling-Mitglieder in den Newsletter auf.',
    'termin-projektteam': 'Finden Sie einen Termin mit dem Projektteam Meier AG.',
    'vertrieb-teams': 'Beantworten Sie Sandras Frage in Teams mit dem Stand aus Salesforce.',
    'vertrieb-leads': 'Ergänzen Sie die neuen Leads in HubSpot aus dem Web.',
    'architektur-grundriss': 'Erstellen Sie den Grundriss nach dem Raumprogramm in Excel.',
    'kommunikation-audio': 'Vertonen Sie die Mitteilung und planen Sie einen LinkedIn-Beitrag.',
    'anlass-gaeste': 'Tragen Sie die Anmeldungen aus der Mail in Airtable ein.',
    'formular-lieferant': 'Füllen Sie das Formular mit unseren Registerdaten aus.'
  };
  /* phones: a short answer per case, from the figures of the full answer */
  var ANSWER = {
    'treuhand-kreditoren': "14 Rechnungen, total CHF 18'420.35.",
    'finanzen-vr': '6 Folien, Umsatz Q3 CHF 2.41 Mio.',
    'handelsregister-neukunde': 'Die Meier AG ist aktiv, die Mail ist bereit.',
    'kanzlei-zitate': '5 von 6 Zitaten stimmen, eines korrigiert.',
    'npo-stiftungen': '6 passende Stiftungen sind vorbereitet.',
    'npo-newsletter': '29 Kontakte sind vorbereitet.',
    'termin-projektteam': 'Dienstag, 14:00–15:00, passt allen 5.',
    'vertrieb-teams': "Deal in Verhandlung, CHF 48'000. Antwort ist bereit.",
    'vertrieb-leads': '9 von 12 Firmen sind vorbereitet.',
    'architektur-grundriss': 'Grundriss mit allen 14 Räumen erstellt.',
    'kommunikation-audio': 'Audio 2:40 Minuten, Beitrag ist vorbereitet.',
    'anlass-gaeste': '15 neue Gäste sind vorbereitet.',
    'formular-lieferant': '14 von 18 Feldern sind ausgefüllt.'
  };
  function cardHTML(c) {
    /* each tool once per run: on the phone there are no details that would tell two
       steps of the same tool apart */
    /* keep each tool at its LAST step, so the order reads «look up, then act»
       (Vertrieb: Salesforce, then the answer in Teams) */
    var uniq = c.steps.filter(function (st, i) { return !c.steps.slice(i + 1).some(function (o) { return o[0] === st[0]; }); });
    var steps = uniq.map(function (st, i) {
      var gl = st[0] !== 'websearch' && SQUARE.indexOf(st[0]) < 0 ? ' gl' : '';
      return (i ? '<span class="mc__link"></span>' : '') + '<span class="mc__step' + gl + '" title="' + esc(st[1]) + '">' + rowIcon(st[0]) + '<span class="mc__ok">' + CHECK + '</span></span>';
    }).join('');
    /* symbolic: which example, the request, and the steps checking off; no answer text,
       the lit tiles around the card tell the rest */
    /* as in the chat: the request as a bubble on the right; under it the Kontexus mark,
       which works while the steps run and turns into a check, and the steps; a thin line
       at the bottom fills with the steps */
    return '<div class="mc__prompt">' + esc(TASK[c.id] || c.prompt) + '</div>' +
      '<div class="mc__steps">' + steps + '</div>' +
      '<p class="mc__result">' + bold(ANSWER[c.id] || firstSentence(c.result)) + '</p>';
  }
  /* fixed height: the largest featured case, so nothing jumps between cases */
  function sizeCard() {
    if (!isStacked()) return;
    mcard.style.height = '';
    var h = 0;
    FEATURED.forEach(function (c) {
      var p = document.createElement('div'); p.className = 'mc is-probe show-result'; p.setAttribute('aria-hidden', 'true');
      p.innerHTML = cardHTML(c); mcard.appendChild(p); h = Math.max(h, p.offsetHeight); p.remove();
    });
    mcard.style.height = Math.ceil(h) + 'px';
  }
  var CARD_FIRST = 450, CARD_GAP = 520, CARD_CHECK = 320, CARD_HOLD = 2600;
  function playCard(c) {
    mcard.querySelectorAll('.mc:not(.is-probe)').forEach(function (o) { o.classList.remove('is-in'); setTimeout(function () { o.remove(); }, 420); });
    var L = document.createElement('div'); L.className = 'mc'; L.innerHTML = cardHTML(c);
    mcard.appendChild(L);
    requestAnimationFrame(function () { requestAnimationFrame(function () { L.classList.add('is-in'); }); });
    light(c);
    var steps = L.querySelectorAll('.mc__step'), links = L.querySelectorAll('.mc__link'), ev = [];
    if (reduced) {
      steps.forEach(function (st) { st.classList.add('on', 'done'); });
      links.forEach(function (l) { l.classList.add('on'); });
      L.classList.add('p-on', 's-on', 'show-result');
      ev.push({ at: 5000, fn: advance });
    } else {
      /* first the request, then the steps, then the answer streams in */
      ev.push({ at: 150, fn: function () { L.classList.add('p-on'); } });
      ev.push({ at: 750, fn: function () { L.classList.add('s-on'); } });
      var at = 1000;
      steps.forEach(function (st, i) {
        var a = at;
        ev.push({ at: a, fn: function () { if (i) links[i - 1].classList.add('on'); st.classList.add('on'); } });
        ev.push({ at: a + CARD_CHECK, fn: function () { st.classList.add('done'); } });
        at += CARD_GAP;
      });
      var tr = at - CARD_GAP + CARD_CHECK + 250;
      var words = streamify(L.querySelector('.mc__result')), t = tr, k = 0, n = 0;
      ev.push({ at: tr, fn: function () { L.classList.add('show-result'); } });
      while (k < words.length) {
        var size = 2 + (n % 3 === 1 ? 1 : 0), group = words.slice(k, k + size);
        ev.push({ at: t, fn: (function (g) { return function () { g.forEach(function (w) { w.classList.add('on'); }); }; })(group) });
        k += size; n++; t += 55 + (n * 37 % 23);
      }
      ev.push({ at: t + CARD_HOLD, fn: advance });
    }
    clockRun(ev);
  }

  var current = null, featIdx = -1, hoverScreen = false, waitingNext = false;
  var FIRST = 700, STEP_GAP = 1100, STEP_RUN = 850, HOLD = 4600;

  function play(c) {
    current = c;
    var fi = FEATURED.indexOf(c); if (fi >= 0) featIdx = fi;
    picker.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-current', String(b.dataset.id === c.id)); });
    if (isStacked()) { playCard(c); return; }

    var old = body.querySelectorAll('.layer:not(.is-probe)');
    old.forEach(function (o) { o.classList.remove('is-in'); setTimeout(function () { o.remove(); }, 520); });
    var L = document.createElement('div'); L.className = 'layer'; L.innerHTML = layerHTML(c);
    body.appendChild(L);
    var steps = L.querySelectorAll('.step');
    requestAnimationFrame(function () { requestAnimationFrame(function () { L.classList.add('is-in'); }); });

    /* all tiles of the example light up now and stay lit until the next example */
    light(c);
    var ev = [];
    if (reduced) {
      steps.forEach(function (s) { s.classList.add('on'); });
      L.classList.add('show-result', 'show-ask');
      ev.push({ at: 8000, fn: advance });
    } else {
      var at = FIRST;
      steps.forEach(function (s) {
        var a = at;
        ev.push({ at: a, fn: function () { s.classList.add('on', 'running'); } });
        ev.push({ at: a + STEP_RUN, fn: function () { s.classList.remove('running'); } });
        at += STEP_GAP;
      });
      var tr = at - STEP_GAP + STEP_RUN + 350;
      /* the answer streams in groups of two or three words, done in about a second */
      var words = streamify(L.querySelector('.result')), t = tr, k = 0, n = 0;
      ev.push({ at: tr, fn: function () { L.classList.add('show-result'); } });
      while (k < words.length) {
        var size = 2 + (n % 3 === 1 ? 1 : 0), group = words.slice(k, k + size);
        ev.push({ at: t, fn: (function (g) { return function () { g.forEach(function (w) { w.classList.add('on'); }); }; })(group) });
        k += size; n++;
        t += 46 + (n * 37 % 23);
      }
      ev.push({ at: t + 150, fn: function () { L.classList.add('show-ask'); } });
      ev.push({ at: t + HOLD, fn: advance });
    }
    clockRun(ev);
  }

  /* wraps each word of the answer in a span, keeping the bold figures intact */
  function streamify(el) {
    var out = [];
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 1) { walk(ch); return; }
        if (ch.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement('span'); w.className = 'w'; w.textContent = part;
          frag.appendChild(w); out.push(w);
        });
        ch.parentNode.replaceChild(frag, ch);
      });
    })(el);
    return out;
  }

  function advance() {
    if (hoverScreen) { waitingNext = true; return; }
    waitingNext = false;
    play(FEATURED[(featIdx + 1) % FEATURED.length]);
  }

  screen.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hoverScreen = true; });
  screen.addEventListener('pointerleave', function () {
    hoverScreen = false;
    if (waitingNext) { waitingNext = false; clockRun([{ at: 900, fn: advance }]); }
  });

  FEATURED.forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.textContent = c.title; b.dataset.id = c.id;
    b.addEventListener('click', function () { waitingNext = false; play(c); });
    picker.appendChild(b);
  });

  /* ---------------- Tile interaction ---------------- */
  function pickCase(icon) {
    var list = casesFor(icon);
    /* phones: every case of the tapped application can play, not only the loop's */
    if (!list.length) return null;
    var at = current ? list.indexOf(current) : -1;
    return at >= 0 ? list[(at + 1) % list.length] : list[0];
  }
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.h-tile'); if (!b) return;
    var icon = b.dataset.icon;
    if (icon === 'plus') { window.location.href = PLUS_MAIL; return; }
    if (icon === 'swiss') {
      /* phones: a tap shows the info for a few seconds (no hover there) */
      if (isStacked()) { showTip(b); clearTimeout(tipT); tipT = setTimeout(function () { hideTip(b); }, 4000); }
      return;
    }
    var c = pickCase(icon); if (!c) return;
    if (isStacked()) { clearTimeout(tipT); hideTip(); }
    waitingNext = false;
    play(c);
  });

  var tipFor = null, tipT = 0;
  function showTip(b) {
    tipFor = b;
    var icon = b.dataset.icon, t = icon === 'swiss' ? SWISS : icon === 'plus' ? PLUS : TIPS[icon];
    $('tipTitle').innerHTML = (icon === 'swiss' ? FLAG : icon === 'plus' ? PLUS_SVG : '<img src="' + src(icon) + '" alt="">') + '<span>' + esc(t[0]) + '</span>';
    $('tipText').textContent = t[1];
    $('tipHint').textContent = icon === 'plus' ? PLUS[2] : icon !== 'swiss' && casesFor(icon).length ? 'Ein Klick auf die Kachel zeigt ein Beispiel.' : '';
    var r = b.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var x = Math.min(Math.max(12, r.left + r.width / 2 - tw / 2), vw - tw - 12);
    var y = r.top - th - 12;
    if (y < 12) y = r.bottom + 12;
    if (y + th > vh - 12) y = Math.max(12, vh - th - 12);
    tip.style.setProperty('--tx', Math.round(x) + 'px');
    tip.style.setProperty('--ty', Math.round(y) + 'px');
    tip.classList.add('is-on');
  }
  function hideTip(b) { if (b && b !== tipFor) return; tipFor = null; tip.classList.remove('is-on'); }

  function untilt(b) { b.classList.remove('is-tracking'); b.style.removeProperty('--rx'); b.style.removeProperty('--ry'); }
  grid.addEventListener('pointerover', function (e) {
    /* phones: no tip under the finger; a tap plays the example (the Swiss tile shows its tip on click) */
    if (e.pointerType !== 'mouse' && isStacked()) return;
    var b = e.target.closest('.h-tile'); if (b && b !== tipFor) showTip(b);
  });
  grid.addEventListener('pointerout', function (e) { var b = e.target.closest('.h-tile'); if (!b || b.contains(e.relatedTarget)) return; hideTip(b); untilt(b); });
  grid.addEventListener('focusin', function (e) {
    var b = e.target.closest('.h-tile'); if (!b) return;
    /* phones: a tap focuses the button too; show the tip only for keyboard focus */
    if (isStacked() && !b.matches(':focus-visible')) return;
    showTip(b);
  });
  grid.addEventListener('focusout', function (e) { var b = e.target.closest('.h-tile'); if (b) hideTip(b); });
  window.addEventListener('scroll', function () { hideTip(); }, { passive: true });

  /* the hovered tile tilts toward the cursor, like a physical tile; one write per frame.
     Only the single tile moves, the wall stays flat. */
  if (!reduced) {
    var pend = null, raf = 0;
    grid.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var b = e.target.closest('.h-tile'); if (!b) return;
      pend = { b: b, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; if (!pend) return;
        var r = pend.b.getBoundingClientRect();
        var px = Math.max(-0.5, Math.min(0.5, (pend.x - r.left) / r.width - 0.5));
        var py = Math.max(-0.5, Math.min(0.5, (pend.y - r.top) / r.height - 0.5));
        pend.b.classList.add('is-tracking');
        pend.b.style.setProperty('--ry', (px * 22).toFixed(2) + 'deg');
        pend.b.style.setProperty('--rx', (-py * 22).toFixed(2) + 'deg');
        pend = null;
      });
    });
  }

  /* keyboard: the wall is one tab stop, the arrow keys move to the nearest tile in that direction */
  grid.addEventListener('keydown', function (e) {
    var dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key];
    var b = e.target.closest('.h-tile'); if (!dir || !b) return;
    var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, next = null, bs = 1e9;
    grid.querySelectorAll('button.h-tile').forEach(function (o) {
      if (o === b) return;
      var q = o.getBoundingClientRect(), dx = q.left + q.width / 2 - x, dy = q.top + q.height / 2 - y;
      var along = dx * dir[0] + dy * dir[1], across = Math.abs(dx * dir[1] + dy * dir[0]);
      if (along < 4) return;
      var sc = along + across * 2.5; if (sc < bs) { bs = sc; next = o; }
    });
    e.preventDefault();
    if (!next) return;
    b.tabIndex = -1; next.tabIndex = 0; next.focus();
  });

  /* ---------------- Init ---------------- */
  var lastMode = null;
  function layout() {
    var m = isStacked();
    sizeBody(); sizeCard(); buildWall();
    /* crossing between phone and desktop: show the running case in the other form */
    if (lastMode !== null && m !== lastMode && current) play(current);
    lastMode = m;
  }
  /* the layout depends on the viewport (the hero's own height is set by the layout on
     phones and when it has to grow), so watch the window, not the hero */
  var rt = 0, lastW = 0, lastH = 0;
  function remember() { lastW = window.innerWidth; lastH = window.innerHeight; }
  function sizeChanged() {
    if (window.innerWidth !== lastW) return true;
    /* on phones the height only changes with the address bar: no new layout for that */
    /* except when the height alone crosses into or out of the phone layout (landscape) */
    if (isStacked() !== lastMode) return true;
    return !window.matchMedia(STACKED).matches && Math.abs(window.innerHeight - lastH) > 2;
  }
  function onResize() {
    clearTimeout(rt); rt = setTimeout(function () {
      if (!sizeChanged()) return;
      remember(); hideTip(); layout();
    }, 120);
  }
  window.addEventListener('resize', onResize);

  applyFade();
  remember();
  sizeBody();
  lastMode = isStacked(); sizeCard();
  play(FEATURED[0]);
  buildWall();
  var fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
  fontsReady.then(function () { remember(); layout(); });
})();
