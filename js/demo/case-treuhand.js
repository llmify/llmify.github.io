/* Use case: Treuhand, the Q3 creditor round across Outlook, the workspace and bexio.
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
    id: 'treuhand',
    tab: (E.LC[0] && E.LC[0].tab) || 'Treuhand',
    /* the section headline changes with the case — the window is the
       subject of this section, so the heading has to follow it */
    title: (E.LC[0] && E.LC[0].title) || 'Vom Beleg zur <span class="grad">fertigen Buchung.</span>',
    convs: (E.LC[0] && E.LC[0].convs) || ['NDA Muster AG', 'Rechnungen Q3', 'GL-Protokoll', 'Jahresbericht'],
    ctxSkill: (E.LC[0] && E.LC[0].ctxSkill) || 'kreditoren-kontierung',
    ctxWork: (E.LC[0] && E.LC[0].ctxWork) || 'R-2026-106.pdf',
    /* lazy: E.W_FILES is defined further down, after this literal */
    fs: function () {
      var F = E.L.fsFolders || ['Berichte', 'HR-Dossiers', 'Verträge'];
      return [
        { name: F[0], meta: '12 ' + E.W_FILES },
        { name: F[1], meta: '8 ' + E.W_FILES },
        { name: 'Q3', meta: '23 ' + E.W_FILES },
        { name: F[2], meta: '17 ' + E.W_FILES },
        { icon: 'doc', name: 'R-2026-106.pdf', meta: '96 KB' }
      ];
    },
    srcFile: 'R-2026-106.pdf',
    srcMode: 'is-pdf',
    viewMode: 'is-sheet',
    viewName: 'rechnungen_q3.xlsx',
    viewDir: 'Q3',
    msg1: E.L.msg1 || 'Hol die Q3-Kreditorenrechnungen aus Outlook, leg sie im Arbeitsbereich ab, kontiere sie und verbuche sie in bexio.',
    todos: E.L.todos || ['Postfach durchsuchen', 'Belege ablegen', 'Belege lesen', 'MwSt & Konten zuordnen', 'In bexio verbuchen', 'Übersicht erstellen'],
    steps1: [
      { t: (E.L.s1 && E.L.s1[0]) || 'Postfach durchsucht — 23 Rechnungen in <code>Kreditoren/Q3</code>', icon: 'outlook' },
      { t: (E.L.s1 && E.L.s1[1]) || '23 PDF-Anhänge nach <code>Arbeitsbereich/Q3</code> geladen', icon: 'outlook' },
      { t: (E.L.s1 && E.L.s1[2]) || '23 Belege gelesen (auch gescannte)', icon: 'eye' },
      { t: (E.L.s1 && E.L.s1[3]) || 'Drei MwSt-Sätze zugeordnet, Konten nach KMU-Kontenrahmen', icon: 'term' },
      { t: (E.L.s1 && E.L.s1[4]) || '23 Kreditorenrechnungen in bexio verbucht', icon: 'bexio' },
      { t: (E.L.s1 && E.L.s1[5]) || '<code>rechnungen_q3.xlsx</code> erstellt', icon: 'pencil', file: 'rechnungen_q3.xlsx' }
    ],
    answer1: E.L.answer1 || 'Erledigt. 23 Rechnungen aus Outlook geholt, kontiert und in bexio verbucht. Total <b>CHF 48\'620</b> netto, <b>CHF 3\'916.57</b> MwSt über drei Sätze: 8.1&#8202;% normal, 3.8&#8202;% Beherbergung, 2.6&#8202;% Lebensmittel. <b>Achtung:</b> Auf R-2026-104 stand 8.1&#8202;%, bei Take-away gilt 2.6&#8202;%. Korrigiert und im Blatt vermerkt.',
    msg2: E.L.msg2 || 'Ich habe R-2026-106 von Kanzlei Berger nachgetragen. Ergänze bitte den Rest aus dem Beleg.',
    steps2: [
      { t: (E.L.s2 && E.L.s2[0]) || 'Beleg <code>R-2026-106.pdf</code> gelesen', icon: 'eye' },
      { t: (E.L.s2 && E.L.s2[1]) || 'Zeile 7 vervollständigt, Total aktualisiert', icon: 'pencil' },
      { t: (E.L.s2 && E.L.s2[2]) || 'Nachgebucht in bexio — Konto <code>6530</code>', icon: 'bexio' }
    ],
    answer2: E.L.answer2 || 'Ergänzt: <b>CHF 850.00</b> netto, 8.1&#8202;%, Konto <b>6530</b> (Beratungsaufwand). Neues Total: <b>CHF 49\'470</b> netto aus 24 Belegen; die Summenzeile rechnet per Formel mit. In bexio nachgebucht.'
  };

c.play = function () {
    var agentCol1, tl1, agentCol2, tl2;

    E.seq([
      /* 1 — browse the filesystem (E.panel stays closed) */
      { d: 600 },
      { fn: function () { E.moveCursor(E.navFiles, 800); }, d: 850 },
      { fn: function () { E.clickCursor(); E.navFiles.classList.add('is-active'); E.demoMain.classList.add('is-files'); E.fsRoot(); }, d: 1100 },

      /* 2 — open the invoice PDF */
      { fn: function () { E.moveCursor(E.fsTarget('R-2026-106.pdf'), 700); }, d: 750 },
      { fn: function () { E.fsTarget('R-2026-106.pdf').classList.add('is-hover'); E.clickCursor(); }, d: 250 },
      { fn: function () { E.demoMain.classList.remove('is-files'); E.demoMain.classList.add('is-pdf'); }, d: 3000 },

      /* 3 — new chat */
      { fn: function () { E.moveCursor(E.navNew, 800); }, d: 850 },
      { fn: function () { E.clickCursor(); E.demoMain.classList.remove('is-pdf'); E.navFiles.classList.remove('is-active'); }, d: 550 },

      /* 4 — type, wait until the FULL message is typed, then send */
      { fn: function () { E.moveCursor(E.demoTa, 600); }, d: 700 },
      { fn: function () { E.typeInto(c.msg1); }, d: c.msg1.length * E.TYPE_MS + 600 },
      { fn: function () { E.moveCursor(E.demoSend, 550); }, d: 700 },
      /* The click must be SEEN to land before the layout moves: opening the
         activity E.panel re-flows the chat column, so doing both in one tick
         left the ripple sitting on whatever slid into that spot. */
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

      /* 5 — agent works */
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
        }, d: 750
      },
      { fn: function () { E.collapseTl(tl1); }, d: 500 },

      /* 6 — open the Excel (sidebar collapses) */
      { fn: function () { E.moveCursor(E.lastFile(), 800); }, d: 850 },
      /* Same again: the chip is clicked, the click is allowed to register,
         and only then does the file view replace the cards it sits in. The
         E.cursor stays put — the next step moves it to the cell it edits, so
         there is no drift to a header nobody is going to touch. */
      { fn: function () { E.clickCursor(); }, d: 300 },
      { fn: function () { E.openSheet(); }, d: 1000 },

      /* 7 — the user adds a new invoice row (Nr. + Lieferant, rest empty).
         The row must be revealed a step BEFORE the E.cursor aims at it: a cell
         in a display:none row has no box, and E.moveCursor now refuses to
         point at one — so revealing and aiming in the same beat would leave
         the E.cursor parked where it was. */
      { fn: function () { E.newRow.className = ''; }, d: 260 },
      { fn: function () { E.moveCursor(E.newNr, 620); E.selectCell(E.newNr, 'A7'); }, d: 700 },
      { fn: function () { E.clickCursor(); E.newNr.classList.add('is-edit'); }, d: 300 },
      {
        fn: function () {
          E.typeCell(E.newNr, 'R-2026-106');
        }, d: 850
      },
      { fn: function () { E.newNr.classList.remove('is-edit'); E.moveCursor(E.newLief, 500); E.selectCell(E.newLief, 'B7'); }, d: 550 },
      { fn: function () { E.clickCursor(); E.newLief.classList.add('is-edit'); }, d: 300 },
      {
        fn: function () {
          E.typeCell(E.newLief, 'Kanzlei Berger');
        }, d: 1050
      },
      { fn: function () { E.newLief.classList.remove('is-edit'); }, d: 500 },

      /* 8 — follow-up: type, finish, then send */
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

      /* 9 — answer: the agent fills in the missing cells and updates the total */
      {
        fn: function () {
          var ans = E.el('div', 'msg__answer', c.answer2);
          agentCol2.appendChild(ans);
          requestAnimationFrame(function () { ans.classList.add('is-in'); });
          E.newNetto.textContent = '850.00';
          E.newSatz.innerHTML = '8.1&#8202;%';
          E.newMwst.textContent = '68.85';
          E.newKonto.textContent = '6530';
          /* No persistent marker on what the agent filled in — it just fills
             the cells, the way a colleague would. Only the brief is-hl flash
             stays, so the eye catches that the sheet on the right moved while
             the answer appears on the left. The one cell that keeps a marker
             is the corrected VAT rate above, because the answer calls it out. */
          [E.newNetto, E.newSatz, E.newMwst, E.newKonto].forEach(function (c) { c.classList.add('is-hl'); });
          E.cellTotal.textContent = "49'470.00";
          E.cellTotal.classList.add('is-hl');
          E.cellMwst.textContent = "3'985.42";
          E.cellMwst.classList.add('is-hl');
          E.cellCount.textContent = '24 ' + E.W_DOCS;
        }, d: 700
      },
      { fn: function () { E.collapseTl(tl2); }, d: 200 },
      /* close on the total: the cell shows the number, the formula bar shows
         that it is a real =SUMME over the rows above */
      { fn: function () { E.moveCursor(E.cellTotal, 800); }, d: 900 },
      {
        fn: function () {
          E.clickCursor();
          E.selectCell(E.cellTotal, 'C8', '=SUMME(C2:C7)');
          /* E.selectCell only fills the formula bar — the marker is what ties
             the bar back to the cell the user just clicked. E.resetScene puts
             the class back to 'r' before the loop replays. */
          E.cellTotal.classList.add('is-mark');
        }, d: 3000
      },

      /* 10 — loop */
      { fn: E.play }
    ]);
  };

c.phPlay = function () {
    E.phSeq([
      /* open the sidebar and go to Dateien */
      { d: 1800 },
      /* tap first, let it be seen, then slide the sidebar in — together in
         one tick the ripple ends up under whatever just moved over it */
      { fn: function () { E.phTapEl(E.phEl('.mbtn--border')); }, d: 320 },
      { fn: function () { E.phOpenSidebar(); }, d: 700 },
      { fn: function () { E.phTapEl(E.phSide.querySelector('[data-ph="files"]')); }, d: 800 },
      { fn: function () { E.phCloseSidebar(); E.phSyncFs(); E.phMode('fs'); }, d: 1600 },
      /* open the invoice PDF and give it time to be read */
      { fn: function () { E.phTapEl(E.phFs.querySelector('[data-name="R-2026-106.pdf"]')); }, d: 750 },
      { fn: function () { E.phShowPdf(); }, d: 3800 },
      /* back out of the viewer the way the app does it — via its arrow */
      { fn: function () { E.phTapEl(E.phPdf.querySelector('.app__railbtn')); }, d: 700 },
      { fn: function () { E.phMode('fs'); }, d: 900 },
      /* sidebar → new chat */
      { fn: function () { E.phTapEl(E.phEl('.mbtn--border')); }, d: 320 },
      { fn: function () { E.phOpenSidebar(); }, d: 700 },
      { fn: function () { E.phTapEl(E.phSide.querySelector('[data-ph="new"]')); }, d: 800 },
      { fn: function () { E.phCloseSidebar(); E.phMode(''); }, d: 950 },
      /* type the request — send only after it is fully typed */
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg1); }, d: c.msg1.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg1); }, d: 900 },
      /* agent works */
      { fn: function () { E.phRunSteps(c.steps1); }, d: c.steps1.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer1); }, d: 2400 },
      { fn: function () { E.phCollapse(); }, d: 900 },
      /* activity → open the generated Excel */
      { fn: function () { E.phTapEl(E.phEl('.mchrome .mbtn:not(.mbtn--border)')); }, d: 320 },
      { fn: function () { E.phOpenActivity(); }, d: 780 },
      { fn: function () { E.phTapEl(E.phActivityBody.querySelector('.app__file')); }, d: 850 },
      { fn: function () { E.phCloseActivity(); E.phOpenSheet(E.snap().sheet0); }, d: 1900 },
      /* the user adds the new invoice row on the phone */
      { fn: function () { E.phShowNewRow(); var c = E.phSheetCell(1); if (c) E.phTapEl(c); }, d: 800 },
      { fn: function () { E.phTypeCell(1, 'R-2026-106'); }, d: 10 * E.PH_CELL + 800 },
      { fn: function () { var c = E.phSheetCell(2); if (c) E.phTapEl(c); }, d: 750 },
      { fn: function () { E.phTypeCell(2, 'Kanzlei Berger'); }, d: 14 * E.PH_CELL + 900 },
      /* close the sheet, ask the follow-up */
      /* .phone__sheetview, not just .phone__sheethead: the activity overlay
         carries a sheethead too and sits FIRST in the markup, so the bare
         selector kept returning that button — display:none at this point,
         zero rect, ripple off the layer. The sheet closed with no visible tap. */
      { fn: function () { E.phTapEl(E.phEl('.phone__sheetview .mbtn')); }, d: 750 },
      { fn: function () { E.phCloseSheet(); }, d: 900 },
      { fn: function () { E.phTapEl(E.phEl('.mcomposer__ta')); }, d: 800 },
      { fn: function () { E.phTypeInto(c.msg2); }, d: c.msg2.length * E.PH_TYPE + 800 },
      { fn: function () { E.phFinishTyping(); E.phTapEl(E.phSend); E.phResetComposer(); E.phUser(c.msg2); }, d: 900 },
      { fn: function () { E.phRunSteps(c.steps2); }, d: c.steps2.length * E.PH_STEP + 700 },
      { fn: function () { E.phAnswer(c.answer2); }, d: 2200 },
      { fn: function () { E.phCollapse(); }, d: 900 },
      /* reopen the completed sheet and rest on it */
      { fn: function () { E.phTapEl(E.phEl('.mchrome .mbtn:not(.mbtn--border)')); }, d: 320 },
      { fn: function () { E.phOpenActivity(); }, d: 780 },
      { fn: function () { E.phTapEl(E.phActivityBody.querySelector('.app__file')); }, d: 850 },
      { fn: function () { E.phCloseActivity(); E.phOpenSheet(E.snap().sheetFinal); }, d: 4600 },
      /* loop */
      { fn: E.phPlay }
    ]);
  };

c.reset = function () {
    E.newRow.className = 'is-hidden';
    E.newNr.textContent = ''; E.newNr.className = '';
    E.newLief.textContent = ''; E.newLief.className = '';
    [E.newNetto, E.newSatz, E.newMwst, E.newKonto].forEach(function (c) { c.textContent = ''; c.className = 'r'; });
    E.cellTotal.textContent = "48'620.00";
    E.cellTotal.className = 'r';
    E.cellMwst.textContent = "3'916.57";
    E.cellMwst.className = 'r';
    E.cellCount.textContent = '23 ' + E.W_DOCS;
    E.cellCount.className = '';
    /* the corrected VAT rate is never marked: the run ends on the total, and
       a second blue cell read as a second selection rather than as a result. */
    if (E.fixSatz) E.fixSatz.className = 'r';
    if (E.fxName) E.fxName.textContent = '';
    if (E.fxVal) { E.fxVal.textContent = ''; E.fxVal.classList.remove('is-formula'); }
  };

c.fillFinal = function () {
    E.newRow.className = '';
    E.newNr.textContent = 'R-2026-106';
    E.newLief.textContent = 'Kanzlei Berger';
    E.newNetto.textContent = '850.00';
    E.newSatz.innerHTML = '8.1&#8202;%';
    E.newMwst.textContent = '68.85';
    E.newKonto.textContent = '6530';
    E.cellTotal.textContent = "49'470.00";
    E.cellMwst.textContent = "3'985.42";
    E.cellCount.textContent = '24 ' + E.W_DOCS;
  };

c.capture = function () {
    E.snap().pdf = E.pdfView.innerHTML;
    c.reset();
    E.snap().sheet0 = E.sheetEl.innerHTML;
    c.fillFinal();
    [E.newNetto, E.newSatz, E.newMwst, E.newKonto].forEach(function (c) { c.className = 'r'; });
    E.snap().sheetFinal = E.sheetEl.innerHTML;
  };

c.staticView = function () {
    c.fillFinal();
  };

  return c;
});
