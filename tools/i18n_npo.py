# -*- coding: utf-8 -*-
"""Erzeugt fr/npo/, it/npo/ und en/npo/ aus der deutschen NPO-Seite.

Aufruf:  python3 tools/i18n_npo.py     (im Wurzelverzeichnis)

npo/index.html ist die Quelle. Die drei Fassungen nie von Hand bearbeiten.

Anders als tools/i18n.py ersetzt dieses Skript ganze, wörtliche Textstücke.
Jeder deutsche Schlüssel aus T muss in der Quelle vorkommen, sonst bricht das
Skript ab: Wer den deutschen Text ändert, merkt so sofort, dass die
Übersetzung fehlt. Am Schluss meldet es deutschen Text, der stehen blieb.

Bilder und das PDF bleiben unter /npo/ und werden mit absolutem Pfad
eingebunden. Das PDF gibt es nur auf Deutsch; die Schaltfläche sagt das.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'npo', 'index.html')
SITE = 'https://llmify.ch/'
LANGS = {
    'fr': {'html_lang': 'fr-CH', 'og_locale': 'fr_CH'},
    'it': {'html_lang': 'it-CH', 'og_locale': 'it_CH'},
    'en': {'html_lang': 'en',    'og_locale': 'en'},
}

# (de, fr, it, en). Apostrophe in den Übersetzungen immer als ’ schreiben:
# ein Teil der Texte steht in JavaScript-Strings mit einfachen Anführungszeichen.
# Im Französischen setzt das Skript vor : ? ! und in « » geschützte Leerzeichen.
T = [
    # --- Kopf ---
    ("<title>KI für Schweizer NPOs: Kontexus | LLMify</title>",
     "<title>IA pour les organisations à but non lucratif en Suisse : Kontexus | LLMify</title>",
     "<title>IA per le organizzazioni non profit svizzere: Kontexus | LLMify</title>",
     "<title>AI for Swiss non-profits: Kontexus | LLMify</title>"),
    ("Kontexus ist eine Schweizer KI für die Büroarbeit von NPOs, Vereinen und Stiftungen: in Fundraiso, Bexio und Microsoft 365. Daten und KI-Modell bleiben in der Schweiz.",
     "Kontexus est une IA suisse pour le travail administratif des organisations à but non lucratif, associations et fondations : dans Fundraiso, Bexio et Microsoft 365. Les données et le modèle d’IA restent en Suisse.",
     "Kontexus è un’IA svizzera per il lavoro d’ufficio di organizzazioni non profit, associazioni e fondazioni: in Fundraiso, Bexio e Microsoft 365. I dati e il modello di IA restano in Svizzera.",
     "Kontexus is Swiss AI for the office work of non-profits, associations and foundations: in Fundraiso, Bexio and Microsoft 365. Data and AI model stay in Switzerland."),
    ('content="KI für Schweizer NPOs: Kontexus"',
     'content="IA pour les organisations à but non lucratif en Suisse : Kontexus"',
     'content="IA per le organizzazioni non profit svizzere: Kontexus"',
     'content="AI for Swiss non-profits: Kontexus"'),
    ("Mehr Zeit für Menschen. Weniger für Administration.",
     "Plus de temps pour l’humain. Moins pour l’administration.",
     "Più tempo per le persone. Meno per l’amministrazione.",
     "More time for people. Less for administration."),
    ("Kontexus von LLMify: der KI-Arbeitsplatz aus der Schweiz.",
     "Kontexus de LLMify : l’espace de travail IA suisse.",
     "Kontexus di LLMify: lo spazio di lavoro IA dalla Svizzera.",
     "Kontexus by LLMify: the AI workspace from Switzerland."),
    # --- Strukturierte Daten ---
    ('"name": "Kontexus für Schweizer NPOs"',
     '"name": "Kontexus pour les organisations à but non lucratif suisses"',
     '"name": "Kontexus per le organizzazioni non profit svizzere"',
     '"name": "Kontexus for Swiss non-profits"'),
    ("Kontexus erledigt wiederkehrende Büroarbeit in Schweizer Software wie Fundraiso und Bexio. Eure Daten und das KI-Modell bleiben in der Schweiz, und bevor etwas rausgeht, fragt Kontexus nach.",
     "Kontexus prend en charge le travail administratif récurrent dans des logiciels suisses comme Fundraiso et Bexio. Vos données et le modèle d’IA restent en Suisse, et avant tout envoi, Kontexus vous demande.",
     "Kontexus sbriga il lavoro d’ufficio ricorrente in software svizzeri come Fundraiso e Bexio. I vostri dati e il modello di IA restano in Svizzera, e prima che qualcosa esca, Kontexus chiede conferma.",
     "Kontexus handles recurring office work in Swiss software such as Fundraiso and Bexio. Your data and the AI model stay in Switzerland, and before anything goes out, Kontexus asks first."),
    ("Non-Profit-Organisationen (NPOs), Vereine, Stiftungen und Hilfswerke in der Schweiz",
     "Organisations à but non lucratif (OBNL), associations, fondations et œuvres d’entraide en Suisse",
     "Organizzazioni non profit, associazioni, fondazioni e opere di aiuto in Svizzera",
     "Non-profit organisations (NPOs), associations, foundations and charities in Switzerland"),
    ("Kontexus für NPOs (One-Pager)",
     "Kontexus pour les organisations à but non lucratif (one-pager, en allemand)",
     "Kontexus per le organizzazioni non profit (one-pager, in tedesco)",
     "Kontexus for non-profits (one-pager, in German)"),
    ("Kontexus, Abo Start", "Kontexus, abonnement Start", "Kontexus, abbonamento Start", "Kontexus, Start plan"),
    ("Alle verfügbaren Anbindungen inklusive, Einführung ohne Aufpreis.",
     "Toutes les connexions disponibles incluses, mise en route sans supplément.",
     "Tutti i collegamenti disponibili inclusi, introduzione senza supplemento.",
     "All available integrations included, onboarding at no extra cost."),
    ('"unitText": "pro Person und Monat"', '"unitText": "par personne et par mois"',
     '"unitText": "per persona al mese"', '"unitText": "per person per month"'),
    # --- Navigation ---
    ('aria-label="LLMify, zur Startseite"', 'aria-label="LLMify, vers la page d’accueil"',
     'aria-label="LLMify, alla pagina iniziale"', 'aria-label="LLMify, to the home page"'),
    ('aria-label="Sprache"', 'aria-label="Langue"', 'aria-label="Lingua"', 'aria-label="Language"'),
    (">Zur Hauptseite<", ">Page principale<", ">Pagina principale<", ">Main site<"),
    # --- Einstieg ---
    (">KI für Schweizer NPOs<", ">IA pour les OBNL suisses<", ">IA per il non profit svizzero<", ">AI for Swiss non-profits<"),
    ('Mehr Zeit für Menschen. <span class="grad">Weniger für Administration.</span>',
     'Plus de temps pour l’humain. <span class="grad">Moins pour l’administration.</span>',
     'Più tempo per le persone. <span class="grad">Meno per l’amministrazione.</span>',
     'More time for people. <span class="grad">Less for administration.</span>'),
    ("Kontexus erledigt wiederkehrende Büroarbeit in <mark>Schweizer Software</mark> wie Fundraiso und Bexio. Eure Daten und das KI-Modell <mark>bleiben in der Schweiz</mark>, und bevor etwas rausgeht, <mark>fragt Kontexus nach</mark>.",
     "Kontexus prend en charge le travail administratif récurrent dans des <mark>logiciels suisses</mark> comme Fundraiso et Bexio. Vos données et le modèle d’IA <mark>restent en Suisse</mark>, et avant tout envoi, <mark>Kontexus vous demande</mark>.",
     "Kontexus sbriga il lavoro d’ufficio ricorrente in <mark>software svizzeri</mark> come Fundraiso e Bexio. I vostri dati e il modello di IA <mark>restano in Svizzera</mark>, e prima che qualcosa esca, <mark>Kontexus chiede conferma</mark>.",
     "Kontexus handles recurring office work in <mark>Swiss software</mark> such as Fundraiso and Bexio. Your data and the AI model <mark>stay in Switzerland</mark>, and before anything goes out, <mark>Kontexus asks first</mark>."),
    ("Kontexus bei der Arbeit: Auf den Auftrag «Finde Stiftungen für unseren Mittagstisch im Quartier und entwirf ein Gesuch» sucht Kontexus in Fundraiso passende Stiftungen, liest den Projektbeschrieb und die früheren Gesuche in OneDrive und legt den Entwurf des Gesuchs zur Freigabe vor.",
     "Kontexus au travail : à la demande « Trouve des fondations pour notre table de midi de quartier et rédige une demande de soutien », Kontexus cherche des fondations adaptées dans Fundraiso, lit le descriptif du projet et les demandes précédentes dans OneDrive et soumet le projet de demande pour validation.",
     "Kontexus al lavoro: alla richiesta «Trova fondazioni per il nostro pranzo di quartiere e prepara una richiesta di contributo», Kontexus cerca in Fundraiso le fondazioni adatte, legge la descrizione del progetto e le richieste precedenti in OneDrive e sottopone la bozza della richiesta per approvazione.",
     "Kontexus at work: asked to “Find foundations for our neighbourhood lunch club and draft a grant application”, Kontexus searches Fundraiso for matching foundations, reads the project description and earlier applications in OneDrive, and presents the draft application for approval."),
    # --- Fenster: drei Abläufe (stehendes Bild und Skript) ---
    ("Finde Stiftungen für unseren Mittagstisch im Quartier und entwirf ein Gesuch.",
     "Trouve des fondations pour notre table de midi de quartier et rédige une demande de soutien.",
     "Trova fondazioni per il nostro pranzo di quartiere e prepara una richiesta di contributo.",
     "Find foundations for our neighbourhood lunch club and draft a grant application."),
    ("Stiftungen für Quartierarbeit gesucht", "Fondations pour le travail de quartier recherchées",
     "Fondazioni per il lavoro di quartiere cercate", "Searched foundations for community work"),
    ("Projektbeschrieb und frühere Gesuche gelesen", "Descriptif du projet et demandes précédentes lus",
     "Descrizione del progetto e richieste precedenti lette", "Read project description and earlier applications"),
    ("Mehrere Stiftungen passen. Das Gesuch an die erste ist entworfen:",
     "Plusieurs fondations conviennent. La demande à la première est rédigée :",
     "Diverse fondazioni sono adatte. La richiesta alla prima è pronta in bozza:",
     "Several foundations match. The application to the first one is drafted:"),
    ("wartet auf Freigabe", "en attente de validation", "in attesa di approvazione", "awaiting approval"),
    ("Gesuch Mittagstisch im Quartier.docx", "Demande table de midi de quartier.docx",
     "Richiesta pranzo di quartiere.docx", "Application neighbourhood lunch club.docx"),
    ("In OneDrive ablegen?", "Enregistrer dans OneDrive ?", "Salvare in OneDrive?", "Save to OneDrive?"),
    (">Ablehnen<", ">Refuser<", ">Rifiuta<", ">Decline<"),
    (">Zulassen<", ">Autoriser<", ">Consenti<", ">Allow<"),
    ("Mach aus den Neuigkeiten im Kanal «Projekte» den Newsletter für Dezember.",
     "Fais la newsletter de décembre à partir des nouvelles du canal « Projets ».",
     "Prepara la newsletter di dicembre con le novità del canale «Progetti».",
     "Turn the news in the “Projects” channel into the December newsletter."),
    ("Beiträge im Kanal «Projekte» gelesen", "Messages du canal « Projets » lus",
     "Messaggi del canale «Progetti» letti", "Read posts in the “Projects” channel"),
    ("Letzten Newsletter gelesen", "Dernière newsletter lue", "Ultima newsletter letta", "Read the last newsletter"),
    ("Der Newsletter ist entworfen, im gleichen Aussehen wie der letzte:",
     "La newsletter est rédigée, avec la même présentation que la dernière :",
     "La newsletter è pronta in bozza, con lo stesso aspetto dell’ultima:",
     "The newsletter is drafted, with the same look as the last one:"),
    ("Newsletter Dezember, Entwurf", "Newsletter de décembre, brouillon",
     "Newsletter di dicembre, bozza", "December newsletter, draft"),
    ("In Mailchimp als Entwurf anlegen?", "Créer le brouillon dans Mailchimp ?",
     "Creare la bozza in Mailchimp?", "Create as a draft in Mailchimp?"),
    ("Welche Rechnungen sind überfällig? Entwirf freundliche Erinnerungen.",
     "Quelles factures sont en retard ? Rédige des rappels aimables.",
     "Quali fatture sono scadute? Prepara dei solleciti cortesi.",
     "Which invoices are overdue? Draft friendly reminders."),
    ("Überfällige Rechnungen gelesen", "Factures en retard lues", "Fatture scadute lette", "Read overdue invoices"),
    ("Bisherige Korrespondenz gelesen", "Correspondance précédente lue",
     "Corrispondenza precedente letta", "Read earlier correspondence"),
    ("Die überfälligen Rechnungen sind gefunden. Die erste Erinnerung:",
     "Les factures en retard sont trouvées. Le premier rappel :",
     "Le fatture scadute sono state trovate. Il primo sollecito:",
     "The overdue invoices are found. The first reminder:"),
    ("'E-Mail', 'Freundliche Zahlungserinnerung'", "'E-mail', 'Rappel de paiement aimable'",
     "'E-mail', 'Sollecito di pagamento cortese'", "'Email', 'Friendly payment reminder'"),
    ("E-Mail senden?", "Envoyer l’e-mail ?", "Inviare l’e-mail?", "Send email?"),
    # --- Beispiele ---
    ("Beispiele aus dem Alltag", "Exemples du quotidien", "Esempi dal quotidiano", "Everyday examples"),
    ("<h2>Gesuche entwerfen</h2>", "<h2>Rédiger des demandes de soutien</h2>",
     "<h2>Preparare richieste di contributo</h2>", "<h2>Draft grant applications</h2>"),
    ("Förderstiftungen suchen, die zum Projekt passen, und das Gesuch aus euren früheren Gesuchen entwerfen.",
     "Chercher les fondations donatrices qui correspondent au projet et rédiger la demande à partir de vos demandes précédentes.",
     "Cercare le fondazioni donatrici adatte al progetto e preparare la richiesta a partire dalle vostre richieste precedenti.",
     "Find grant-making foundations that fit the project and draft the application from your earlier ones."),
    ("<h2>Newsletter vorbereiten</h2>", "<h2>Préparer la newsletter</h2>",
     "<h2>Preparare la newsletter</h2>", "<h2>Prepare the newsletter</h2>"),
    ("Neuigkeiten aus eurem Teams-Kanal sammeln und in Mailchimp den nächsten Newsletter entwerfen.",
     "Rassembler les nouvelles de votre canal Teams et rédiger la prochaine newsletter dans Mailchimp.",
     "Raccogliere le novità dal vostro canale Teams e preparare la prossima newsletter in Mailchimp.",
     "Collect the news from your Teams channel and draft the next newsletter in Mailchimp."),
    ("<h2>An Zahlungen erinnern</h2>", "<h2>Rappeler les paiements</h2>",
     "<h2>Sollecitare i pagamenti</h2>", "<h2>Send payment reminders</h2>"),
    ("Offene Rechnungen in Bexio finden und freundliche Zahlungserinnerungen entwerfen.",
     "Trouver les factures ouvertes dans Bexio et rédiger des rappels de paiement aimables.",
     "Trovare le fatture aperte in Bexio e preparare solleciti di pagamento cortesi.",
     "Find open invoices in Bexio and draft friendly payment reminders."),
    (">Auch dabei<", ">Aussi inclus<", ">Inclusi anche<", ">Also included<"),
    ('aria-label="und weitere"', 'aria-label="et d’autres"', 'aria-label="e altri"', 'aria-label="and more"'),
    (">In Entwicklung<", ">En développement<", ">In sviluppo<", ">In development<"),
    ("Weitere Systeme</span>", "Autres systèmes</span>", "Altri sistemi</span>", "Other systems</span>"),
    ("Bewährt sich ein Ablauf, kann er als <b>Skill</b> festgehalten werden. Beim nächsten Mal reicht ein kurzer Auftrag.",
     "Quand une façon de faire a fait ses preuves, elle peut être enregistrée comme <b>skill</b>. La fois suivante, une courte consigne suffit.",
     "Quando una procedura funziona, può essere salvata come <b>skill</b>. La volta successiva basta una breve richiesta.",
     "When a routine works well, it can be saved as a <b>skill</b>. Next time, a short request is enough."),
    # --- So startet ihr ---
    (">So startet ihr<", ">Pour commencer<", ">Come iniziare<", ">Getting started<"),
    ("<small>Anbindungen</small><b>Alle</b><span>verfügbaren inklusive</span>",
     "<small>Connexions</small><b>Toutes</b><span>celles disponibles, incluses</span>",
     "<small>Collegamenti</small><b>Tutti</b><span>quelli disponibili, inclusi</span>",
     "<small>Integrations</small><b>All</b><span>available ones included</span>"),
    ("<small>Einführung</small><b>Dabei</b><span>ohne Aufpreis,<br>Termin per E-Mail</span>",
     "<small>Mise en route</small><b>Incluse</b><span>sans supplément,<br>rendez-vous par e-mail</span>",
     "<small>Introduzione</small><b>Inclusa</b><span>senza supplemento,<br>appuntamento via e-mail</span>",
     "<small>Onboarding</small><b>Included</b><span>at no extra cost,<br>appointment by email</span>"),
    ("<small>Euer System</small>", "<small>Votre système</small>", "<small>Il vostro sistema</small>", "<small>Your system</small>"),
    ("<span>Die Anbindung<br>besprechen wir gern.</span>", "<span>Parlons volontiers<br>de la connexion.</span>",
     "<span>Parliamo volentieri<br>del collegamento.</span>", "<span>Happy to discuss<br>the integration.</span>"),
    ("<small>Abo Start</small>", "<small>Abonnement Start</small>", "<small>Abbonamento Start</small>", "<small>Start plan</small>"),
    ("<span>pro Person und Monat<br>exkl. MWST</span>", "<span>par personne et par mois<br>hors TVA</span>",
     "<span>per persona al mese<br>IVA esclusa</span>", "<span>per person per month<br>excl. VAT</span>"),
    ("Nach Absprache: Demo-Zugang zum Ausprobieren, Konditionen für grössere Teams und Pilotprojekte.",
     "Sur demande : accès de démonstration pour essayer, conditions pour les grandes équipes et les projets pilotes.",
     "Su richiesta: accesso demo per provare, condizioni per team più grandi e progetti pilota.",
     "On request: demo access to try it out, terms for larger teams and pilot projects."),
    ("Jetzt registrieren<i>", "S’inscrire<i>", "Registrarsi ora<i>", "Sign up now<i>"),
    # --- Häufige Fragen ---
    (">Häufige Fragen<", ">Questions fréquentes<", ">Domande frequenti<", ">Frequently asked questions<"),
    ("Was ist Kontexus?", "Qu’est-ce que Kontexus ?", "Che cos’è Kontexus?", "What is Kontexus?"),
    ("Kontexus ist ein Schweizer KI-Arbeitsplatz der LLMify AG aus Cham. Er erledigt wiederkehrende Büroarbeit in Software wie Bexio, Microsoft 365 und Salesforce. NPOs, Vereine und Stiftungen sind ein Schwerpunkt.",
     "Kontexus est un espace de travail IA suisse de LLMify AG, à Cham. Il prend en charge le travail administratif récurrent dans des logiciels comme Bexio, Microsoft 365 et Salesforce. Les organisations à but non lucratif, les associations et les fondations sont l’un de ses axes principaux.",
     "Kontexus è uno spazio di lavoro IA svizzero di LLMify AG, con sede a Cham. Sbriga il lavoro d’ufficio ricorrente in software come Bexio, Microsoft 365 e Salesforce. Le organizzazioni non profit, le associazioni e le fondazioni sono uno dei suoi punti focali.",
     "Kontexus is a Swiss AI workspace by LLMify AG in Cham. It handles recurring office work in software such as Bexio, Microsoft 365 and Salesforce. Non-profits, associations and foundations are one of its main focuses."),
    ("Ist Kontexus eine Schweizer KI?", "Kontexus est-il une IA suisse ?", "Kontexus è un’IA svizzera?", "Is Kontexus a Swiss AI?"),
    ("Kontexus wird von der LLMify AG in Cham entwickelt und in der Schweiz betrieben. Das Schweizer KI-Modell ist ein frei verfügbares Modell (Open Weight): Wir haben es nicht selbst trainiert, betreiben es aber selbst in der Schweiz. Für den Datenschutz ist das der entscheidende Punkt, denn eure Daten verlassen die Schweiz damit nicht.",
     "Kontexus est développé par LLMify AG à Cham et exploité en Suisse. Le modèle d’IA suisse est un modèle librement disponible (open weight) : nous ne l’avons pas entraîné nous-mêmes, mais nous l’exploitons nous-mêmes en Suisse. Pour la protection des données, c’est le point décisif, car vos données ne quittent ainsi pas la Suisse.",
     "Kontexus è sviluppato da LLMify AG a Cham e gestito in Svizzera. Il modello di IA svizzero è un modello liberamente disponibile (open weight): non l’abbiamo addestrato noi, ma lo gestiamo noi stessi in Svizzera. Per la protezione dei dati è questo il punto decisivo, perché così i vostri dati non lasciano la Svizzera.",
     "Kontexus is developed by LLMify AG in Cham and operated in Switzerland. The Swiss AI model is a freely available (open-weight) model: we did not train it ourselves, but we run it ourselves in Switzerland. For data protection that is the decisive point, because your data does not leave Switzerland this way."),
    ("Was ist der Unterschied zu ChatGPT oder Microsoft Copilot?", "Quelle est la différence avec ChatGPT ou Microsoft Copilot ?",
     "Qual è la differenza rispetto a ChatGPT o Microsoft Copilot?", "How is it different from ChatGPT or Microsoft Copilot?"),
    ("Kontexus läuft in der Schweiz und arbeitet mit euren Daten und in euren Programmen. Der Wert einer KI entsteht meist bei der Arbeit mit echten, manchmal heiklen Unterlagen: Gesuchen, Rechnungen, Adresslisten. Solche Daten lassen sich oft nicht einfach in ChatGPT eingeben. Kontexus liest sie dort, wo sie bei euch liegen, über die Programme verschiedener Anbieter hinweg, zum Beispiel in Bexio, Fundraiso und Microsoft 365. Mit dem Schweizer KI-Modell bleiben sie in der Schweiz, und bevor etwas rausgeht, fragt Kontexus nach.",
     "Kontexus tourne en Suisse et travaille avec vos données et dans vos logiciels. La valeur d’une IA naît le plus souvent du travail sur des documents réels, parfois sensibles : demandes de soutien, factures, listes d’adresses. Ces données ne peuvent souvent pas être simplement saisies dans ChatGPT. Kontexus les lit là où elles se trouvent chez vous, à travers les logiciels de différents fournisseurs, par exemple dans Bexio, Fundraiso et Microsoft 365. Avec le modèle d’IA suisse, elles restent en Suisse, et avant tout envoi, Kontexus vous demande.",
     "Kontexus gira in Svizzera e lavora con i vostri dati e nei vostri programmi. Il valore di un’IA nasce per lo più dal lavoro su documenti reali, a volte delicati: richieste di contributo, fatture, elenchi di indirizzi. Spesso questi dati non si possono semplicemente inserire in ChatGPT. Kontexus li legge là dove si trovano da voi, attraverso i programmi di diversi fornitori, per esempio in Bexio, Fundraiso e Microsoft 365. Con il modello di IA svizzero restano in Svizzera, e prima che qualcosa esca, Kontexus chiede conferma.",
     "Kontexus runs in Switzerland and works with your data and in your software. The value of AI usually comes from working with real, sometimes sensitive documents: grant applications, invoices, address lists. Such data often cannot simply be put into ChatGPT. Kontexus reads it where it lives in your organisation, across software from different vendors, for example in Bexio, Fundraiso and Microsoft 365. With the Swiss AI model it stays in Switzerland, and before anything goes out, Kontexus asks first."),
    ("Wofür können NPOs Kontexus einsetzen?", "À quoi Kontexus peut-il servir dans une organisation à but non lucratif ?",
     "Per che cosa può servire Kontexus a un’organizzazione non profit?", "What can non-profits use Kontexus for?"),
    ("Für Büroarbeit, die immer wieder anfällt. Kontexus sucht in Fundraiso Förderstiftungen, die zu eurem Projekt passen, und entwirft das Gesuch aus euren früheren Gesuchen. Es sammelt die Neuigkeiten aus eurem Teams-Kanal und entwirft in Mailchimp den nächsten Newsletter. Und es findet offene Rechnungen in Bexio und entwirft freundliche Zahlungserinnerungen.",
     "Pour le travail administratif qui revient sans cesse. Kontexus cherche dans Fundraiso les fondations donatrices qui correspondent à votre projet et rédige la demande à partir de vos demandes précédentes. Il rassemble les nouvelles de votre canal Teams et rédige la prochaine newsletter dans Mailchimp. Et il trouve les factures ouvertes dans Bexio et rédige des rappels de paiement aimables.",
     "Per il lavoro d’ufficio che si ripete continuamente. Kontexus cerca in Fundraiso le fondazioni donatrici adatte al vostro progetto e prepara la richiesta a partire dalle vostre richieste precedenti. Raccoglie le novità dal vostro canale Teams e prepara la prossima newsletter in Mailchimp. E trova le fatture aperte in Bexio e prepara solleciti di pagamento cortesi.",
     "For office work that keeps coming back. Kontexus searches Fundraiso for grant-making foundations that fit your project and drafts the application from your earlier ones. It collects the news from your Teams channel and drafts the next newsletter in Mailchimp. And it finds open invoices in Bexio and drafts friendly payment reminders."),
    ("Müssen wir Kontexus jedes Mal alles neu erklären?", "Faut-il tout réexpliquer à Kontexus à chaque fois ?",
     "Dobbiamo rispiegare tutto a Kontexus ogni volta?", "Do we have to explain everything to Kontexus every time?"),
    ("Nein. Ein Ablauf, der sich bewährt, kann als Skill festgehalten werden: zum Beispiel, wie eure Gesuche aufgebaut sind oder in welchem Ton ihr an Zahlungen erinnert. Kontexus greift dann von selbst darauf zurück, und beim nächsten Mal reicht ein kurzer Auftrag.",
     "Non. Une façon de faire qui a fait ses preuves peut être enregistrée comme skill : par exemple, la structure de vos demandes de soutien ou le ton de vos rappels de paiement. Kontexus s’y réfère alors de lui-même, et la fois suivante, une courte consigne suffit.",
     "No. Una procedura che funziona può essere salvata come skill: per esempio, come sono strutturate le vostre richieste di contributo o con quale tono sollecitate i pagamenti. Kontexus vi fa poi riferimento da solo, e la volta successiva basta una breve richiesta.",
     "No. A routine that works well can be saved as a skill: for example, how your grant applications are structured or the tone of your payment reminders. Kontexus then draws on it by itself, and next time a short request is enough."),
    ("Was kostet Kontexus?", "Combien coûte Kontexus ?", "Quanto costa Kontexus?", "What does Kontexus cost?"),
    ("Das Abo Start kostet CHF 60 pro Person und Monat, exkl. MWST. Alle verfügbaren Anbindungen sind inklusive, die Einführung ist ohne Aufpreis dabei. Konditionen für grössere Teams und Pilotprojekte gibt es nach Absprache.",
     "L’abonnement Start coûte CHF 60 par personne et par mois, hors TVA. Toutes les connexions disponibles sont incluses, la mise en route est comprise sans supplément. Les conditions pour les grandes équipes et les projets pilotes sont fixées sur demande.",
     "L’abbonamento Start costa CHF 60 per persona al mese, IVA esclusa. Tutti i collegamenti disponibili sono inclusi, l’introduzione è compresa senza supplemento. Le condizioni per team più grandi e progetti pilota si concordano su richiesta.",
     "The Start plan costs CHF 60 per person per month, excl. VAT. All available integrations are included, and onboarding comes at no extra cost. Terms for larger teams and pilot projects are available on request."),
    ("Wo liegen unsere Daten?", "Où se trouvent nos données ?", "Dove si trovano i nostri dati?", "Where is our data stored?"),
    ("Kontexus läuft in der Schweiz, und mit dem Schweizer KI-Modell bleiben auch eure Daten hier. Wählt ihr ein Modell eines internationalen Anbieters oder bindet ihr einen Dienst mit Servern im Ausland an, zum Beispiel Mailchimp, Salesforce oder HubSpot, dann gehen die Daten, die ihr damit bearbeitet, an diesen Anbieter. Beides entscheidet ihr.",
     "Kontexus tourne en Suisse, et avec le modèle d’IA suisse, vos données y restent aussi. Si vous choisissez le modèle d’un fournisseur international ou si vous connectez un service dont les serveurs sont à l’étranger, par exemple Mailchimp, Salesforce ou HubSpot, les données que vous traitez ainsi vont chez ce fournisseur. C’est vous qui décidez dans les deux cas.",
     "Kontexus gira in Svizzera, e con il modello di IA svizzero anche i vostri dati restano qui. Se scegliete il modello di un fornitore internazionale o collegate un servizio con server all’estero, per esempio Mailchimp, Salesforce o HubSpot, i dati che elaborate in questo modo vanno a quel fornitore. In entrambi i casi decidete voi.",
     "Kontexus runs in Switzerland, and with the Swiss AI model your data stays here too. If you choose a model from an international provider or connect a service with servers abroad, for example Mailchimp, Salesforce or HubSpot, the data you process with it goes to that provider. Both are your decision."),
    ("Verschickt Kontexus etwas, ohne zu fragen?", "Kontexus envoie-t-il quelque chose sans demander ?",
     "Kontexus invia qualcosa senza chiedere?", "Does Kontexus send anything without asking?"),
    ("Nein. Bevor etwas rausgeht, fragt Kontexus nach. Eine E-Mail zum Beispiel wartet auf eure Freigabe, und ihr lasst sie zu oder lehnt sie ab.",
     "Non. Avant tout envoi, Kontexus vous demande. Un e-mail, par exemple, attend votre validation, et vous l’autorisez ou le refusez.",
     "No. Prima che qualcosa esca, Kontexus chiede conferma. Un’e-mail, per esempio, attende la vostra approvazione, e voi la consentite o la rifiutate.",
     "No. Before anything goes out, Kontexus asks first. An email, for example, waits for your approval, and you allow or decline it."),
    ("Mit welcher Software arbeitet Kontexus?", "Avec quels logiciels Kontexus travaille-t-il ?",
     "Con quali software lavora Kontexus?", "Which software does Kontexus work with?"),
    ("Der Schwerpunkt liegt auf Schweizer Software wie Fundraiso, Bexio und Zefix. Dazu kommen Microsoft 365 (Outlook, Kalender, Teams, OneDrive), Mailchimp, Salesforce, HubSpot und weitere, und Kontexus arbeitet mit Word-, Excel- und PDF-Dateien. Die Anbindung an RaiseNow ist in Entwicklung. Nutzt ihr ein anderes System, besprechen wir die Anbindung gern.",
     "L’accent est mis sur des logiciels suisses comme Fundraiso, Bexio et Zefix. S’y ajoutent Microsoft 365 (Outlook, Calendrier, Teams, OneDrive), Mailchimp, Salesforce, HubSpot et d’autres, et Kontexus travaille avec des fichiers Word, Excel et PDF. La connexion à RaiseNow est en développement. Si vous utilisez un autre système, parlons volontiers de la connexion.",
     "L’accento è posto su software svizzeri come Fundraiso, Bexio e Zefix. Si aggiungono Microsoft 365 (Outlook, Calendario, Teams, OneDrive), Mailchimp, Salesforce, HubSpot e altri, e Kontexus lavora con file Word, Excel e PDF. Il collegamento a RaiseNow è in sviluppo. Se usate un altro sistema, parliamo volentieri del collegamento.",
     "The focus is on Swiss software such as Fundraiso, Bexio and Zefix. Added to that are Microsoft 365 (Outlook, Calendar, Teams, OneDrive), Mailchimp, Salesforce, HubSpot and more, and Kontexus works with Word, Excel and PDF files. The RaiseNow integration is in development. If you use another system, we are happy to discuss the integration."),
    ("Wie fangen wir an?", "Comment commencer ?", "Come iniziamo?", "How do we get started?"),
    ("Ihr registriert euch auf kontexus.ch oder fragt einen Büro-Check von 30 Minuten an: Ihr erzählt von eurem Büroalltag, wir zeigen, was Kontexus übernehmen könnte. Einen Demo-Zugang zum Ausprobieren gibt es nach Absprache.",
     "Vous vous inscrivez sur kontexus.ch ou vous demandez un bilan administratif de 30 minutes : vous nous racontez votre quotidien administratif, nous montrons ce que Kontexus pourrait prendre en charge. Un accès de démonstration pour essayer est possible sur demande.",
     "Vi registrate su kontexus.ch oppure richiedete un check dell’ufficio di 30 minuti: ci raccontate il vostro quotidiano d’ufficio, noi mostriamo che cosa Kontexus potrebbe sbrigare. Un accesso demo per provare è possibile su richiesta.",
     "You sign up at kontexus.ch or request a 30-minute office check: you tell us about your day-to-day office work, we show what Kontexus could take on. Demo access to try it out is available on request."),
    # --- Büro-Check ---
    ('<h2>30 Minuten <span class="grad">Büro-Check</span></h2>',
     '<h2>30 minutes de <span class="grad">bilan administratif</span></h2>',
     '<h2>30 minuti di <span class="grad">check dell’ufficio</span></h2>',
     '<h2>30-minute <span class="grad">office check</span></h2>'),
    ("Ihr erzählt von eurem Büroalltag, wir zeigen, was Kontexus übernehmen könnte.",
     "Vous nous racontez votre quotidien administratif, nous montrons ce que Kontexus pourrait prendre en charge.",
     "Ci raccontate il vostro quotidiano d’ufficio, noi mostriamo che cosa Kontexus potrebbe sbrigare.",
     "You tell us about your day-to-day office work, we show what Kontexus could take on."),
    ("subject=B%C3%BCro-Check%20Kontexus", "subject=Bilan%20administratif%20Kontexus",
     "subject=Check%20ufficio%20Kontexus", "subject=Office%20check%20Kontexus"),
    ("Büro-Check anfragen<i>", "Demander un bilan<i>", "Richiedere il check<i>", "Request an office check<i>"),
    ("One-Pager als PDF", "One-pager en PDF (allemand)", "One-pager in PDF (tedesco)", "One-pager as PDF (German)"),
    # --- Über LLMify ---
    (">Über LLMify<", ">À propos de LLMify<", ">Chi è LLMify<", ">About LLMify<"),
    ('alt="Start-up der ETH Zürich"', 'alt="Start-up de l’ETH Zurich"',
     'alt="Start-up dell’ETH di Zurigo"', 'alt="ETH Zurich start-up"'),
    ("Die LLMify AG aus Cham ist ein Start-up der ETH Zürich.", "LLMify AG, à Cham, est une start-up de l’ETH Zurich.",
     "LLMify AG, con sede a Cham, è una start-up dell’ETH di Zurigo.", "LLMify AG, based in Cham, is an ETH Zurich start-up."),
    ("<p>LLMify wurde mit dem <a", "<p>LLMify a reçu l’<a", "<p>LLMify ha ricevuto l’<a", "<p>LLMify received the <a"),
    ("</a> ausgezeichnet, in der Kategorie «Technologische Innovation».</p>",
     "</a>, dans la catégorie « Innovation technologique ».</p>",
     "</a>, nella categoria «Innovazione tecnologica».</p>",
     "</a>, in the category “Technological innovation”.</p>"),
    # --- Fuss ---
    ("Kontexus ist ein Produkt der LLMify AG, Cham.", "Kontexus est un produit de LLMify AG, Cham.",
     "Kontexus è un prodotto di LLMify AG, Cham.", "Kontexus is a product of LLMify AG, Cham."),
    ('aria-label="Rechtliches"', 'aria-label="Informations légales"', 'aria-label="Note legali"', 'aria-label="Legal"'),
    (">Impressum<", ">Mentions légales<", ">Impressum<", ">Legal notice<"),
    (">Datenschutz<", ">Protection des données<", ">Privacy<", ">Privacy<"),
]

# Wörter, die nur im Deutschen vorkommen. Bleibt eines im sichtbaren Text, in
# den strukturierten Daten oder im Skript stehen, fehlt eine Übersetzung.
GERMAN = re.compile(r'\b(und|oder|nicht|für|der|die|das|den|dem|ein|eine|einen|ist|sind|wird|wir|ihr|eure|euren|eurem|mit|aus|bei|auf|nach|zum|zur|wie|auch|Schweiz|Schweizer|Stiftungen|Gesuch|Gesuche|Rechnungen)\b')


def french_spaces(s):
    """Geschützte Leerzeichen vor : ? ! und innerhalb « »."""
    s = re.sub(r' ([:?!])', ' \\1', s)
    return s.replace('« ', '« ').replace(' »', ' »')


def switcher(lang):
    urls = {'de': '/npo/', 'fr': '/fr/npo/', 'it': '/it/npo/', 'en': '/en/npo/'}
    out = []
    for l in ('de', 'fr', 'it', 'en'):
        attr = ' class="is-active" aria-current="true"' if l == lang else ' lang="' + l + '"'
        out.append('<a href="' + urls[l] + '"' + attr + '>' + l.upper() + '</a>')
    return ''.join(out)


def leftovers(html):
    text = re.sub(r'<!--.*?-->|<style.*?</style>|/\*.*?\*/', ' ', html, flags=re.S)
    text = re.sub(r'<link rel="alternate"[^>]*>|<a href="/npo/"[^>]*>DE</a>', ' ', text)
    found = []
    for chunk in re.split(r'[<>]|"\s*[,:]\s*"|\', \'', text):
        if GERMAN.search(chunk) and not re.search(r'[={};]|^\s*[a-z-]+="', chunk):
            found.append(chunk.strip()[:90])
    return found


def main():
    src = open(SRC, encoding='utf-8').read()
    missing = [e[0][:70] for e in T if e[0] not in src]
    if missing:
        sys.exit('Diese deutschen Texte stehen nicht mehr in npo/index.html:\n  ' + '\n  '.join(missing))
    m = re.search(r'<span class="langsw"[^>]*>(.*?)</span>', src, re.S)
    if not m or m.group(1) != switcher('de'):
        sys.exit('Sprachumschalter in npo/index.html fehlt oder weicht ab.')
    alt = re.findall(r'  <link rel="alternate"[^>]*>\n', src)
    if len(alt) != 5:
        sys.exit('hreflang-Block in npo/index.html fehlt oder ist unvollständig.')
    alt_block = ''.join(alt)

    ok = True
    for lang, cfg in LANGS.items():
        idx = {'fr': 1, 'it': 2, 'en': 3}[lang]
        html = src.replace(alt_block, '@@ALT@@', 1)
        # Texte, längste zuerst, damit ein Satz vor seinen Teilen ersetzt wird.
        for e in sorted(T, key=lambda e: -len(e[0])):
            new = french_spaces(e[idx]) if lang == 'fr' and not e[0].startswith('subject=') else e[idx]
            html = html.replace(e[0], new)
        # Sprache, Adressen, Pfade.
        html = html.replace('<html lang="de-CH">', '<html lang="' + cfg['html_lang'] + '">', 1)
        html = html.replace('content="de_CH"', 'content="' + cfg['og_locale'] + '"', 1)
        html = html.replace('"inLanguage": "de-CH"', '"inLanguage": "' + cfg['html_lang'] + '"')
        # Das PDF gibt es nur auf Deutsch.
        html = html.replace('"encodingFormat": "application/pdf",\n          "inLanguage": "' + cfg['html_lang'] + '"',
                            '"encodingFormat": "application/pdf",\n          "inLanguage": "de-CH"')
        home = '/' + lang + '/index.html'
        html = re.sub(r'https://llmify\.ch/npo/(?!Kontexus)', SITE + lang + '/npo/', html)
        html = html.replace('"item": "https://llmify.ch/"', '"item": "' + SITE + lang + '/index.html"')
        html = html.replace('src="img/', 'src="/npo/img/')
        html = html.replace('href="Kontexus-fuer-NPOs.pdf"', 'href="/npo/Kontexus-fuer-NPOs.pdf" hreflang="de"')
        html = html.replace('href="/"', 'href="' + home + '"')
        html = html.replace('href="/#', 'href="' + home + '#')
        html = html.replace(switcher('de'), switcher(lang), 1)
        html = html.replace('@@ALT@@', alt_block, 1)
        # Prüfen: gültige strukturierte Daten, kein deutscher Rest.
        for blk in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S):
            json.loads(blk)
        rest = leftovers(html)
        if rest:
            ok = False
            print(lang + ': deutscher Text geblieben:')
            for r in rest:
                print('   ', r)
        out = os.path.join(ROOT, lang, 'npo')
        os.makedirs(out, exist_ok=True)
        open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(html)
        print(lang + '/npo/index.html geschrieben')
    if not ok:
        sys.exit(1)


if __name__ == '__main__':
    main()
