/* Use case: Kanzlei, checking every Fundstelle of a Rechtsschrift against the source.
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
    /* Zitatprüfung. Every Fundstelle and every finding in this case is real
       and was verified against the published source — the strings are load
       bearing in the same way the invoice numbers are in the case above.
       See the comment on #demoReport in index.html before editing any of
       them. The one invented citation (4A_1122/2016 in Rz. 10) is invented
       ON PURPOSE: that is the finding. */
    id: 'kanzlei',
    tab: (E.LC[1] && E.LC[1].tab) || 'Kanzlei',
    title: (E.LC[1] && E.LC[1].title) || 'Vom Zitat zur <span class="grad">geprüften Fundstelle.</span>',
    convs: (E.LC[1] && E.LC[1].convs) || ['Arrest Ferrand', 'Klage Verantwortlichkeit', 'ABV Aeberhard', 'Due Diligence Regie'],
    ctxSkill: (E.LC[1] && E.LC[1].ctxSkill) || 'swiss-legal',
    ctxWork: (E.LC[1] && E.LC[1].ctxWork) || 'Klageschrift_Verantwortlichkeit.docx',
    fs: function () {
      var F = (E.LC[1] && E.LC[1].fsFolders) || ['Mandate', 'Vorlagen', 'Publikationen'];
      return [
        { name: F[0], meta: '24 ' + E.W_FILES },
        { name: F[1], meta: '11 ' + E.W_FILES },
        { name: F[2], meta: '6 ' + E.W_FILES },
        { icon: 'doc', name: 'Klageschrift_Verantwortlichkeit.docx', meta: '148 KB' }
      ];
    },
    srcFile: 'Klageschrift_Verantwortlichkeit.docx',
    srcMode: 'is-doc',
    viewMode: 'is-report',
    /* .docx, and the same name in the step, the "Geändert" row and the viewer
       header: the chip the cursor clicks and the file that opens have to be one
       file. It is a docx rather than markdown because ArtifactsPanel opens .md
       in the markdown editor, while 'docs' goes through PaperViewer — which is
       what makes the typeset report page above legitimate. */
    viewName: 'Zitatpruefung_Klageschrift.docx',
    viewDir: 'Mandate / 2026-118',
    /* What the user typed: no em dashes, no polish. The report is asked for
       explicitly, because the firm's swiss-legal skill answers in the chat and
       only produces a document when the user says so. */
    msg1: (E.LC[1] && E.LC[1].msg1) || 'Prüf die Zitate in der Klageschrift. Existieren die Entscheide, und stützen sie, was behauptet wird? Leg mir das Ergebnis als Prüfbericht ab.',
    /* one todo per step — runSteps maps step i onto todo i, and a short list
       silently leaves the last step ticking nothing */
    todos: (E.LC[1] && E.LC[1].todos) || ['Rechtsschrift lesen', 'Fundstellen abrufen', 'Regeste abgleichen', 'Geschäftsnummern auflösen', 'Erwägungen abgleichen', 'Normfassung prüfen', 'Bericht erstellen'],
    steps1: (E.LC[1] && E.LC[1].steps1) || [
      /* a .docx is read through the converter on the command line, not through
         the file viewer, so this row wears the terminal glyph in the real app */
      { t: '<code>Klageschrift_Verantwortlichkeit.docx</code> gelesen — 5 tragende Fundstellen', icon: 'term' },
      { t: 'BGE 128 III 29 abgerufen — Definition trägt Rz. 7 wörtlich', icon: 'escha' },
      { t: 'BGE 128 III 92 (4C.214/2001): Regest nennt den <b>Verwaltungsrat</b> der Mutter, nicht die Mutter', icon: 'escha' },
      { t: 'BGer 4A_1122/2016 — keine Fundstelle unter dieser Geschäftsnummer', icon: 'escha' },
      { t: 'BGE 141 III 159 E. 2 sagt das Gegenteil von Rz. 11', icon: 'escha' },
      { t: 'Art. 725 OR über Fedlex geprüft — Überschuldung seit 1.1.2023 in Art. 725b', icon: 'fedlex' },
      { t: '<code>Zitatpruefung_Klageschrift.docx</code> erstellt', icon: 'pencil', file: 'Zitatpruefung_Klageschrift.docx' }
    ],
    answer1: (E.LC[1] && E.LC[1].answer1) || 'Fünf tragende Fundstellen geprüft — eine trägt, vier nicht in der zitierten Form. <b>Rz. 10</b> zitiert BGer 4A_1122/2016; diese Geschäftsnummer gibt es nicht. <b>Rz. 11</b> kehrt BGE 141 III 159 um — das Regest schliesst die Vertretung durch faktische Organe im Schlichtungsverfahren gerade aus. <b>Rz. 9</b> stützt sich auf BGE 128 III 92; bejaht wurde dort die Organstellung des <i>Verwaltungsrats</i> der Muttergesellschaft, nicht der Muttergesellschaft selbst. <b>Rz. 13</b> zitiert Art. 725 Abs. 2 OR — seit dem 1.1.2023 steht die Überschuldung in <b>Art. 725b OR</b>, und geschuldet sind zwei Zwischenabschlüsse statt einer Zwischenbilanz.',
    /* The second turn deliberately does NOT ask whether any decision
       affirms the Organstellung of the parent company itself: a categorical
       answer to that is neither retrievable nor doctrinally settled, and
       the agent would be overclaiming. It asks instead for the real
       Konzern-Leitentscheid, which is answerable word for word — and it
       repairs the hole the agent just opened in Rz. 10.
       The opening names the STATE of Rz. 10 ("steht ohne Beleg da"), not its
       deletion: the assertion survives, its authority does not, which is the
       whole reason for asking. The consequence in answer2 then lands on Rz. 12,
       because that is the assertion 4A_268/2018 actually speaks to. Every
       sentence of answer2 is anchored in its E. 5; the quotation is verbatim. */
    msg2: (E.LC[1] && E.LC[1].msg2) || 'Rz. 10 steht ohne Beleg da. Gibt es einen echten Entscheid zum Konzernverhältnis, und was hält er zur faktischen Organstellung fest?',
    steps2: (E.LC[1] && E.LC[1].steps2) || [
      { t: 'Volltextsuche: faktische Organschaft im Konzern, Cash Pool', icon: 'escha' },
      { t: 'BGer <code>4A_268/2018</code> vom 18.11.2019 abgerufen — E. 5 im Volltext gelesen', icon: 'escha' },
      /* not a pencil: nothing is written in this turn, and a write row with no
         file behind it promises a change that never shows up in "Geändert" */
      { t: 'Regest und E. 5 gegen die Behauptung in Rz. 12 gespiegelt', icon: 'escha' }
    ],
    answer2: (E.LC[1] && E.LC[1].answer2) || 'BGer <b>4A_268/2018</b> vom 18. November 2019 (Swissair/SAirGroup). E. 5 wörtlich: «Während insbesondere eine blosse Einflussnahme von Organen einer Muttergesellschaft auf diejenigen der Tochter regelmässig keine Organverantwortung gegenüber der Tochtergesellschaft begründet, entsteht eine faktische Organschaft in der Tochtergesellschaft jedenfalls dann, wenn sich (übertragene oder usurpierte) Zuständigkeiten bilden.» Gegen neun Verwaltungsräte der Konzernmutter blieb die Klage mangels Passivlegitimation abgewiesen; die Mitglieder der Konzernleitung hatte die Vorinstanz dagegen als faktische Organe der Tochter anerkannt. Beurteilt wurden durchwegs natürliche Personen — zur Organstellung der Muttergesellschaft selbst äussert sich der Entscheid nicht. Für <b>Rz. 12</b> heisst das: die übertragene oder usurpierte Zuständigkeit ist konkret zu behaupten, blosse Konzernsteuerung genügt nach diesem Wortlaut nicht.'
  };

/* Nothing is annotated and nothing is staged: the product has no annotation
   layer over a document, and a .docx opens as a finished page render. So the
   report is simply there when the file is opened. */
c.reset = function () {};

c.capture = function () {
    E.snap().pdf = E.docView.innerHTML;       /* the pleading, as filed */
    E.snap().report = E.reportEl.outerHTML;   /* the report, whole */
  };

c.staticView = function () {};

c.play = function () {
    var agentCol1, tl1, agentCol2, tl2;

    E.seq([
      /* 1 — browse to the mandate */
      { d: 600 },
      { fn: function () { E.moveCursor(E.navFiles, 800); }, d: 850 },
      { fn: function () { E.clickCursor(); E.navFiles.classList.add('is-active'); E.demoMain.classList.add('is-files'); E.fsRoot(); }, d: 1100 },

      /* 2 — open the pleading and give it time to be read as a document */
      { fn: function () { E.moveCursor(E.fsTarget(c.srcFile), 700); }, d: 750 },
      { fn: function () { E.fsTarget(c.srcFile).classList.add('is-hover'); E.clickCursor(); }, d: 250 },
      { fn: function () { E.demoMain.classList.remove('is-files'); E.demoMain.classList.add('is-doc'); }, d: 3600 },

      /* 3 — new chat */
      { fn: function () { E.moveCursor(E.navNew, 800); }, d: 850 },
      { fn: function () { E.clickCursor(); E.demoMain.classList.remove('is-doc'); E.navFiles.classList.remove('is-active'); }, d: 550 },

      /* 4 — ask */
      { fn: function () { E.moveCursor(E.demoTa, 600); }, d: 700 },
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

      /* 5 — the agent pulls every Fundstelle and compares it */
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
      {
        fn: function () {
          var ans = E.el('div', 'msg__answer', c.answer1);
          agentCol1.appendChild(ans);
          requestAnimationFrame(function () { ans.classList.add('is-in'); });
        }, d: 950
      },
      { fn: function () { E.collapseTl(tl1); }, d: 500 },

      /* 6 — open the report. It is a rendered page: it is simply there. */
      { fn: function () { E.moveCursor(E.lastFile(), 800); }, d: 850 },
      { fn: function () { E.clickCursor(); }, d: 300 },
      { fn: function () { E.openSheet(); }, d: 5200 },

      /* 7 — the follow-up that repairs Rz. 10: which decision is the real one,
         and what does it actually hold? */
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
        }, d: 950
      },
      { fn: function () { E.collapseTl(tl2); }, d: 400 },

      /* 8 — rest on the report, which is where the work ended up */
      { fn: function () { E.parkCursor(false); }, d: 4200 },

      /* 9 — loop */
      { fn: E.play }
    ]);
  };

c.phPlay = function () {
    E.phSeq([
      { d: 1800 },
      { fn: function () { E.phTapEl(E.phEl('.mbtn--border')); }, d: 320 },
      { fn: function () { E.phOpenSidebar(); }, d: 700 },
      { fn: function () { E.phTapEl(E.phSide.querySelector('[data-ph="files"]')); }, d: 800 },
      { fn: function () { E.phCloseSidebar(); E.phSyncFs(); E.phMode('fs'); }, d: 1600 },
      /* the pleading, full screen, long enough to be read as one */
      { fn: function () { E.phTapEl(E.phFs.querySelector('[data-name="' + c.srcFile + '"]')); }, d: 750 },
      { fn: function () { E.phShowPdf(); }, d: 4200 },
      { fn: function () { E.phTapEl(E.phPdf.querySelector('.app__railbtn')); }, d: 700 },
      { fn: function () { E.phMode('fs'); }, d: 900 },
      { fn: function () { E.phTapEl(E.phEl('.mbtn--border')); }, d: 320 },
      { fn: function () { E.phOpenSidebar(); }, d: 700 },
      { fn: function () { E.phTapEl(E.phSide.querySelector('[data-ph="new"]')); }, d: 800 },
      { fn: function () { E.phCloseSidebar(); E.phMode(''); }, d: 950 },
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg1); }, d: c.msg1.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg1); }, d: 900 },
      { fn: function () { E.phRunSteps(c.steps1); }, d: c.steps1.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer1); }, d: 3200 },
      { fn: function () { E.phCollapse(); }, d: 900 },
      /* the report, through the activity overlay */
      { fn: function () { E.phTapEl(E.phEl('.mchrome .mbtn:not(.mbtn--border)')); }, d: 320 },
      { fn: function () { E.phOpenActivity(); }, d: 780 },
      { fn: function () { E.phTapEl(E.phActivityBody.querySelector('.app__file')); }, d: 850 },
      { fn: function () { E.phCloseActivity(); E.phOpenSheet(E.snap().report); }, d: 5400 },
      { fn: function () { E.phTapEl(E.phEl('.phone__sheetview .mbtn')); }, d: 750 },
      { fn: function () { E.phCloseSheet(); }, d: 900 },
      /* the follow-up */
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg2); }, d: c.msg2.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg2); }, d: 900 },
      { fn: function () { E.phRunSteps(c.steps2); }, d: c.steps2.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer2); }, d: 2800 },
      { fn: function () { E.phCollapse(); }, d: 900 },
      /* rest on the report */
      { fn: function () { E.phTapEl(E.phEl('.mchrome .mbtn:not(.mbtn--border)')); }, d: 340 },
      { fn: function () { E.phOpenActivity(); }, d: 780 },
      { fn: function () { E.phTapEl(E.phActivityBody.querySelector('.app__file')); }, d: 850 },
      { fn: function () { E.phCloseActivity(); E.phOpenSheet(E.snap().report); }, d: 5200 },
      /* loop */
      { fn: E.phPlay }
    ]);
  };

  return c;
});
