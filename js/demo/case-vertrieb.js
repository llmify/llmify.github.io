/* Use case: Vertrieb, answering a Teams question with figures from three systems.
 *
 * Registered with the demo engine (js/demo/engine.js), which calls this factory
 * once with its API and plays whatever it returns. A case owns its copy, its
 * file listing, and BOTH choreographies (desktop cursor + phone taps) — the
 * engine owns the window and the primitives they drive.
 *
 * See README.md "Use-Case-Selektor" for the contract.
 */
(window.KXCases = window.KXCases || []).push(function (E) {
  var c = {
    /* The case where nothing lands in the workspace: the question arrives in
       a Teams channel and the answer goes back into the same thread. So this
       one has no source document to browse, nothing in "Geändert", and — the
       point — NO artifact view. ArtifactsPanel.tsx opens files (sheets, docs,
       pdf, image, text, html) and nothing else; there is no Teams viewer in
       the product, so there is none here. What the run shows is exactly what
       the real app would show: MCP tool rows wearing their connector's mark,
       and an answer that says where the work landed. */
    id: 'vertrieb',
    tab: (E.LC[2] && E.LC[2].tab) || 'Vertrieb',
    title: (E.LC[2] && E.LC[2].title) || 'Von der Frage im Kanal zur <span class="grad">Antwort im Kanal.</span>',
    convs: (E.LC[2] && E.LC[2].convs) || ['Angebot Bucher AG', 'Stand Meier AG', 'Wochenreport', 'Preisliste 2026'],
    ctxSkill: (E.LC[2] && E.LC[2].ctxSkill) || 'kundenstand',
    ctxWork: (E.LC[2] && E.LC[2].ctxWork) || '',
    fs: function () {
      var F = (E.LC[2] && E.LC[2].fsFolders) || ['Offerten', 'Kunden', 'Preislisten'];
      return [
        { name: F[0], meta: '31 ' + E.W_FILES },
        { name: F[1], meta: '18 ' + E.W_FILES },
        { name: F[2], meta: '4 ' + E.W_FILES }
      ];
    },
    /* no source document (the trigger is a message, not a file) and no
       artifact view (nothing is written) */
    srcFile: null,
    srcMode: null,
    viewMode: null,
    viewName: null,
    viewDir: null,
    msg1: (E.LC[2] && E.LC[2].msg1) || 'Im Kanal Vertrieb fragt Sandra nach dem Stand bei der Meier AG. Schau nach und antworte ihr dort.',
    todos: (E.LC[2] && E.LC[2].todos) || ['Anfrage lesen', 'Mailverlauf sichten', 'Offerte suchen', 'Offene Posten prüfen', 'In Teams antworten'],
    /* The answer is LINKED, not attached, and that is not a shortcut: the
       product's teams_send_file posts a new thread ROOT (it cannot reply), and
       it reads its bytes out of the workspace — so attaching the SharePoint
       offer would mean downloading it first, which would fill "Geändert" and
       make the closing line of answer1 a lie. A reply carrying web links is
       what teams_reply_to_channel_message can actually do; mail_list_messages
       and the SharePoint item summary both return the web_url it links to. */
    steps1: (E.LC[2] && E.LC[2].steps1) || [
      { t: 'Kanal <code>Vertrieb</code> gelesen — Anfrage von Sandra Keller', icon: 'teams' },
      { t: 'Postfach durchsucht — 14 Mails mit der Meier AG seit April', icon: 'outlook' },
      { t: '<code>Offerte_Meier_2026-04.pdf</code> in SharePoint gefunden', icon: 'sharepoint' },
      /* bexio_list_invoices returns status + is_valid_from, but no due date and
         no "overdue" state — so the agent can say since when, not how late */
      { t: 'Offene Posten aus bexio geholt — 2 Rechnungen, offen seit dem 29.05.', icon: 'bexio' },
      { t: 'Im Thread <code>Vertrieb</code> geantwortet — mit Link auf die Offerte', icon: 'teams' }
    ],
    answer1: (E.LC[2] && E.LC[2].answer1) || 'Sandra hat die Antwort im Kanal. Stand Meier AG: Offerte vom 14.04. über <b>CHF 42\'800</b> ist raus, seit dem 04.05. ohne Rückmeldung; zwei Rechnungen über <b>CHF 6\'240</b> stehen seit dem 29.05. offen. Die Offerte ist im Beitrag verlinkt, der letzte Mailkontakt ebenfalls. Im Arbeitsbereich liegt nichts — alles steht im Kanal.',
    msg2: (E.LC[2] && E.LC[2].msg2) || 'Setz einen Nachfasstermin auf und lad Sandra und Frau Meier ein.',
    steps2: (E.LC[2] && E.LC[2].steps2) || [
      /* Niklas is the signed-in user, so findMeetingTimes includes him anyway;
         an external attendee's free/busy is not readable, and saying so is the
         honest version of this step */
      { t: 'Freie Fenster bei dir und Sandra geprüft — Frau Meier extern, kein Kalenderzugriff', icon: 'calendar' },
      { t: 'Termin Do 13.08., 14:00 erstellt — Teams-Meeting', icon: 'calendar' },
      { t: 'Termin im Thread vermerkt', icon: 'teams' }
    ],
    /* calendar_create_event takes a plaintext body, location and attendees —
       no attachments. The figures go IN the agenda, they do not hang off it. */
    answer2: (E.LC[2] && E.LC[2].answer2) || 'Donnerstag 13.08., <b>14:00–14:30</b>, als Teams-Meeting. Sandra Keller und M. Meier sind eingeladen; Offertsumme und offene Posten stehen in der Agenda. Der Termin steht auch im Thread.'
  };

  /* nothing to put back, nothing to snapshot, nothing to freeze: this case
     owns no scenery beyond the chat itself */
  c.reset = function () {};
  c.capture = function () { E.snap().pdf = ''; };
  c.staticView = function () {};

c.play = function () {
    var agentCol1, tl1, agentCol2, tl2;

    E.seq([
      /* No file browsing: the trigger for this run arrived in Teams, so the
         run opens where a request from a colleague actually lands — at the
         composer. */
      { d: 700 },
      { fn: function () { E.moveCursor(E.demoTa, 700); }, d: 800 },
      { fn: function () { E.typeInto(c.msg1); }, d: c.msg1.length * E.TYPE_MS + 600 },
      { fn: function () { E.moveCursor(E.demoSend, 550); }, d: 700 },
      { fn: function () { E.finishTyping(); E.clickCursor(); }, d: 260 },
      {
        fn: function () {
          E.resetComposer();
          E.setConv(1);
          E.demoBody.classList.remove('is-nopanel');
          var u = E.userRow(c.msg1);
          E.demoChat.appendChild(u);
          requestAnimationFrame(function () { u.classList.add('is-in'); });
          E.parkCursor(false);
        }, d: 400
      },
      {
        fn: function () {
          var a = E.agentRow();
          E.demoChat.appendChild(a);
          requestAnimationFrame(function () { a.classList.add('is-in'); });
          agentCol1 = a.querySelector('.msg__col');
          tl1 = a.querySelector('.tl');
        }, d: 350
      },
      { fn: function () { E.runSteps(tl1, c.steps1, true); }, d: c.steps1.length * (E.STEP_SPIN + E.STEP_GAP) + 550 },
      /* No file opens here. The E.panel keeps showing the checklist and an
         empty "Geändert" — which is the honest picture: the work landed in
         Teams, not in the workspace. The answer is the payoff. */
      {
        fn: function () {
          var ans = E.el('div', 'msg__answer', c.answer1);
          agentCol1.appendChild(ans);
          requestAnimationFrame(function () { ans.classList.add('is-in'); });
        }, d: 1000
      },
      { fn: function () { E.collapseTl(tl1); }, d: 4200 },

      /* follow-up: the meeting */
      { fn: function () { E.moveCursor(E.demoTa, 700); }, d: 800 },
      { fn: function () { E.typeInto(c.msg2); }, d: c.msg2.length * E.TYPE_MS + 600 },
      { fn: function () { E.moveCursor(E.demoSend, 550); }, d: 700 },
      {
        fn: function () {
          E.finishTyping();
          E.clickCursor();
          E.resetComposer();
          var u = E.userRow(c.msg2);
          E.demoChat.appendChild(u);
          requestAnimationFrame(function () { u.classList.add('is-in'); });
          E.parkCursor(false);
        }, d: 500
      },
      {
        fn: function () {
          var a = E.agentRow();
          E.demoChat.appendChild(a);
          requestAnimationFrame(function () { a.classList.add('is-in'); });
          agentCol2 = a.querySelector('.msg__col');
          tl2 = a.querySelector('.tl');
        }, d: 350
      },
      { fn: function () { E.runSteps(tl2, c.steps2, false); }, d: c.steps2.length * (E.STEP_SPIN + E.STEP_GAP) + 550 },
      {
        fn: function () {
          var ans = E.el('div', 'msg__answer', c.answer2);
          agentCol2.appendChild(ans);
          requestAnimationFrame(function () { ans.classList.add('is-in'); });
        }, d: 1000
      },
      { fn: function () { E.collapseTl(tl2); }, d: 5600 },

      /* loop */
      { fn: E.play }
    ]);
  };

c.phPlay = function () {
    E.phSeq([
      { d: 1800 },
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg1); }, d: c.msg1.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg1); }, d: 900 },
      { fn: function () { E.phRunSteps(c.steps1); }, d: c.steps1.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer1); }, d: 3400 },
      { fn: function () { E.phCollapse(); }, d: 900 },
      /* the checklist, through the activity overlay — there is no artifact to
         open, so this is all the E.panel has to show, and that is the point */
      { fn: function () { E.phTapEl(E.phEl('.mchrome .mbtn:not(.mbtn--border)')); }, d: 340 },
      { fn: function () { E.phOpenActivity(); }, d: 3400 },
      { fn: function () { E.phTapEl(E.phEl('.phone__activityview .mbtn')); }, d: 700 },
      { fn: function () { E.phCloseActivity(); }, d: 900 },
      /* follow-up */
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg2); }, d: c.msg2.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg2); }, d: 900 },
      { fn: function () { E.phRunSteps(c.steps2); }, d: c.steps2.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer2); }, d: 5600 },
      { fn: function () { E.phCollapse(); }, d: 2200 },
      /* loop */
      { fn: E.phPlay }
    ]);
  };

  return c;
});
