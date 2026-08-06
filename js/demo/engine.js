/* The use-case demo engine.
 *
 * Owns the replica window in #usecases: the scripted cursor, the chat timeline,
 * the file views, the activity panel, the phone layer and the case selector.
 * It knows nothing about any particular story — the cases in js/demo/case-*.js
 * register themselves on window.KXCases and hand back their copy plus two
 * choreographies. Load order matters: the case files must be parsed before this
 * one, and this one after the localized pages' window.I18N assignment.
 *
 * See README.md "Use-Case-Selektor" for the case contract.
 */
(function () {
  var ASSET_BASE = (function () {
    var s = document.currentScript;
    var src = s && s.src;
    /* strip everything from the js/ segment on, so /en/ resolves to /assets/ */
    return src ? src.replace(/js\/.*$/, '') + 'assets/' : 'assets/';
  })();
  var brandIcon = function (slug) {
    return '<img src="' + ASSET_BASE + 'integrations/' + slug + '.svg" alt="" class="tl__brand">';
  };

  var demoChat = document.getElementById('demoChat');
  if (!demoChat) return;

    /* The morph stage below the window shows a live scaled CLONE of this panel
       (desktop layer) and the same run rendered as the real mobile app (phone
       layer), so every case is choreographed twice — once for a cursor, once
       for a thumb. */
    var I = {
      eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
      pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5"/><path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
      term: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
      folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
      doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      /* heroicons/24/solid check-circle, de-emphasized in the secondary text
         colour — the real timeline's finish marker (Message.tsx). */
      finish: '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"/></svg>',
      chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>',
      /* the Kontexus mark — four arms reaching to the corners around a centre
         dot. 1:1 with MarkIcon in core/client/src/components/icons.tsx, which
         is what the real chat renders as the assistant avatar. */
      mark: '<svg viewBox="0 0 24 24"><g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"><line x1="15.42" y1="8.58" x2="18.15" y2="5.85"/><line x1="15.42" y1="15.42" x2="18.15" y2="18.15"/><line x1="8.58" y1="15.42" x2="5.85" y2="18.15"/><line x1="8.58" y1="8.58" x2="5.85" y2="5.85"/></g><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
      /* MCP tool rows wear their connector's product mark, exactly like
         Message.tsx does via providerForMcpTool() → PROVIDER_ICON. */
      outlook: brandIcon('outlook'),
      teams: brandIcon('teams'),
      bexio: brandIcon('bexio'),
      /* Same connector marks the product ships (copied from
         kontexus/core/client/public/integrations), so a tool row here and a
         tool row in the real app show the same thing. */
      escha: brandIcon('entscheidsuche'),
      fedlex: brandIcon('fedlex'),
      sharepoint: brandIcon('onedrive'),
      calendar: brandIcon('outlook-calendar')
    };

    // Optional per-page translations: a <script> before this file can set
    // window.I18N with the keys below (see /fr, /it, /en pages).
    var L = window.I18N || {};
    /* runSteps() maps step i onto todo i, so a case's todos and steps1 must
       stay the same length — a short todo list silently leaves the last step
       ticking nothing off. */
    /* Per-case translations. Case 0 additionally reads the FLAT window.I18N
       keys (msg1/todos/s1/…) that the generated pages already set, so /en, /fr
       and /it keep working; later cases translate through L.cases[i]. */
    var LC = L.cases || [];
    /* The cases live one per file in js/demo/case-*.js and register themselves
       on window.KXCases before this script runs. They are instantiated further
       down, once every primitive they drive exists. */
    var W_STEPS = L.steps || 'Schritte';
    var W_DONE = L.done || 'Fertig';
    var W_FILES = L.files || 'Dateien';
    var W_DOCS = L.docs || 'Belege';
    /* Chat row identity — mirrors Message.tsx: the assistant is named after the
       product (same word in all four languages), the user by first name. */
    var W_AGENT = 'Kontexus';
    var W_USER = L.user || 'Niklas';
    var W_INITIAL = W_USER.charAt(0).toUpperCase();

    var TYPE_MS = 26, STEP_SPIN = 620, STEP_GAP = 280;
    var panel = document.querySelector('.demo__panel');
    var demoApp = panel.querySelector('.app');
    var cursor = document.getElementById('demoCursor');
    var demoMain = document.getElementById('demoMain');
    var demoFs = document.getElementById('demoFs');
    var demoConvs = document.getElementById('demoConvs');
    var demoTodos = document.getElementById('demoTodos');
    var demoTodoCount = document.getElementById('demoTodoCount');
    var demoFiles = document.getElementById('demoFiles');
    var demoModCount = document.getElementById('demoModCount');
    var demoTa = document.getElementById('demoTa');
    var demoSend = document.getElementById('demoSend');
    var demoWork = document.getElementById('demoWork');
    var demoBody = demoWork.parentElement;
    var demoFileview = document.getElementById('demoFileview');
    var viewName = document.getElementById('demoViewName');
    var viewDir = document.getElementById('demoViewDir');
    var cellTotal = document.getElementById('demoCellTotal');
    var cellCount = document.getElementById('demoCellCount');
    var cellMwst = document.getElementById('demoCellMwst');
    /* the rate the agent corrected — highlighted only once it has said so */
    var fixSatz = document.getElementById('demoFixSatz');
    var newRow = document.getElementById('demoNewRow');
    var newNr = document.getElementById('demoNewNr');
    var newLief = document.getElementById('demoNewLief');
    var newNetto = document.getElementById('demoNewNetto');
    var newSatz = document.getElementById('demoNewSatz');
    var newMwst = document.getElementById('demoNewMwst');
    var newKonto = document.getElementById('demoNewKonto');
    var navNew = document.getElementById('demoNavNew');
    var navFiles = document.getElementById('demoNavFiles');
    var pdfView = demoMain.querySelector('.app__pdfview');
    var sheetEl = demoFileview.querySelector('.sheet');
    /* Kanzlei case: the pleading in the main column, the report in the panel */
    var docView = demoMain.querySelector('.app__docview');
    var reportEl = document.getElementById('demoReport');
    var ctxSkill = document.getElementById('demoCtxSkill');
    var ctxWork = document.getElementById('demoCtxWork');
    var ctxWorkLabel = document.getElementById('demoCtxWorkLabel');
    var ctxWorkRow = document.getElementById('demoCtxWorkRow');
    /* the selector under the window, plus the bits of the section it retitles */
    var ucTabs = document.querySelectorAll('.uctabs__tab');
    var ucTitle = document.getElementById('ucTitle');
    var phSheetName = document.getElementById('phSheetName');
    var phSheetDir = document.getElementById('phSheetDir');

    /* morph stage elements */
    var xfStage = document.getElementById('xfStage');
    var xfClone = document.getElementById('xfClone');
    var xfCursor = document.getElementById('xfCursor');
    var phoneLayer = document.getElementById('phoneLayer');
    var phBody = phoneLayer && phoneLayer.querySelector('.phone__body');
    var phoneChat = document.getElementById('phoneChat');
    var phFs = document.getElementById('phFs');
    var phPdf = document.getElementById('phPdf');
    var phSheetBody = document.getElementById('phSheetBody');
    var phSend = document.getElementById('phSend');
    var phSide = document.getElementById('phSide');
    var phActivityBody = document.getElementById('phActivityBody');

    var demoMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    /* which device the viewport calls for — read in two places, so it lives here */
    var phoneMQ = window.matchMedia('(max-width: 720px)');
    var timers = [];
    var started = false;
    var lastFileEl = null;

    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var clearTimers = function () { timers.forEach(clearTimeout); timers = []; };
    var el = function (tag, cls, html) {
      var d = document.createElement(tag);
      d.className = cls;
      if (html !== undefined) d.innerHTML = html;
      return d;
    };
    var stripIds = function (root) {
      root.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    };

    /* ---- live clone of the whole demo panel into the morph stage ---- */
    var engineEl = document.querySelector('.demo--engine');
    var clonePending = false;
    var cloneDirty = false;
    var cloneLast = 0;
    var xfP = 0;        /* morph progress, written by the scroll handler */
    var xfNear = true;  /* morph stage near the viewport */
    /* the desktop clone is fully faded out from p ≈ .53 — skip syncing it */
    var cloneWanted = function () {
      return xfNear && xfP < 0.6 && !document.hidden;
    };
    var syncClone = function () {
      clonePending = false;
      if (!xfClone) return;
      if (!cloneWanted()) { cloneDirty = true; return; }
      var now = performance.now();
      if (now - cloneLast < 45) { scheduleClone(); return; }
      cloneLast = now;
      xfClone.innerHTML = demoApp.innerHTML;
      stripIds(xfClone);
      xfClone.querySelectorAll('.demo__cursor, .demo__ripple').forEach(function (n) { n.remove(); });
      cloneDirty = false;
    };
    var scheduleClone = function () {
      if (!xfClone || clonePending) return;
      clonePending = true;
      requestAnimationFrame(syncClone);
    };
    if (xfClone && 'MutationObserver' in window) {
      new MutationObserver(scheduleClone).observe(demoApp, {
        subtree: true, childList: true, attributes: true, characterData: true
      });
    }
    if (xfClone && xfStage && 'IntersectionObserver' in window) {
      xfNear = false;
      new IntersectionObserver(function (entries) {
        xfNear = entries[0].isIntersecting;
        if (xfNear && cloneDirty) scheduleClone();
      }, { rootMargin: '25% 0px' }).observe(xfStage);
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && cloneDirty) scheduleClone();
    });

    /* ---- cursor (mirrored into the clone stage) ---- */
    /* Tweened per frame on transform (compositor-only) rather than handed to a
       fixed-duration CSS transition. Two things made the old cursor read as a
       sprite on a rail: every hop took the same 800 ms no matter how far it
       went, and it travelled dead straight. Here the duration follows the
       distance and the path bows slightly to one side, which is what a hand
       actually does. Coordinates address the arrow's TIP, not its bounding
       box, so a click lands where the point is. */
    var CUR_TIP_X = 4.4, CUR_TIP_Y = 2.2;   /* tip inside the 21px glyph */
    var curX = 0, curY = 0, curRaf = 0;
    var paintCursor = function (x, y) {
      var tf = 'translate(' + (x - CUR_TIP_X).toFixed(1) + 'px, ' + (y - CUR_TIP_Y).toFixed(1) + 'px)';
      cursor.style.transform = tf;
      if (xfCursor) xfCursor.style.transform = tf;
    };
    var setCursor = function (x, y, ms) {
      if (curRaf) { cancelAnimationFrame(curRaf); curRaf = 0; }
      var x0 = curX, y0 = curY, dx = x - curX, dy = y - curY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      curX = x; curY = y;
      if (!demoMotion || ms === 0 || dist < 1) { paintCursor(x, y); return; }
      /* Fitts-ish: short hops stay snappy, long ones never crawl */
      var dur = Math.max(190, Math.min(700, 120 + dist * 0.8));
      var bow = Math.min(24, dist * 0.07);       /* perpendicular bow */
      var nx = -dy / dist, ny = dx / dist;
      var t0 = performance.now();
      var step = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);          /* easeOutCubic: decisive, soft landing */
        var arc = Math.sin(p * Math.PI) * bow;   /* nil at both ends, widest mid-flight */
        paintCursor(x0 + dx * e + nx * arc, y0 + dy * e + ny * arc);
        if (p < 1) { curRaf = requestAnimationFrame(step); }
        else { curRaf = 0; paintCursor(x, y); }
      };
      curRaf = requestAnimationFrame(step);
    };
    /* A target that isn't rendered (display:none ancestor, not yet inserted)
       reports a 0×0 box at the document origin, which would fling the cursor
       to roughly (-174, 0) — off the panel entirely — and leave it there until
       the next step. Several steps legitimately aim at things that a preceding
       click has just hidden (opening the file view collapses the cards the
       clicked chip lives in), so treat an unrendered target as "no move" and
       stay put rather than pointing at nothing. */
    var moveCursor = function (target, ms) {
      if (!target) return;
      var r = target.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var p = panel.getBoundingClientRect();
      setCursor(r.left - p.left + r.width / 2, r.top - p.top + r.height / 2, ms);
    };
    var clickCursor = function () {
      cursor.classList.add('is-click');
      var rip = el('span', 'demo__ripple');
      rip.style.left = curX + 'px';
      rip.style.top = curY + 'px';
      panel.appendChild(rip);
      if (xfStage) {
        var rip2 = el('span', 'demo__ripple');
        rip2.style.left = curX + 'px';
        rip2.style.top = curY + 'px';
        xfStage.appendChild(rip2);
        later(function () { rip2.remove(); }, 600);
      }
      if (xfCursor) {
        xfCursor.classList.add('is-click');
        later(function () { xfCursor.classList.remove('is-click'); }, 140);
      }
      later(function () { cursor.classList.remove('is-click'); }, 140);
      later(function () { rip.remove(); }, 600);
    };
    var parkCursor = function (instant) {
      setCursor(panel.offsetWidth * 0.46, panel.offsetHeight * 0.74, instant ? 0 : 600);
    };

    /* ---- right panel (Excel viewer) ---- */
    /* Univer's name box + formula bar track the selected cell, so the replica
       has to as well — a static "A7" that never changes gives the whole
       spreadsheet away as a mock-up. */
    var fxVal = document.getElementById('demoFxVal');
    var fxName = document.querySelector('.fbar__name');
    /* ``formula`` for cells that hold one: Univer shows the formula in the bar
       and the computed value in the grid — a total that reads 49'470.00 in the
       cell and =SUMME(C2:C7) up here is the giveaway that it was really
       calculated, not typed. (The evals demand exactly that: see
       evals/cases/jahresrechnung_verify — sums as formulas, never as
       hard-coded numbers.) */
    var selectCell = function (cell, ref, formula) {
      if (fxName && ref) fxName.textContent = ref;
      if (!fxVal) return;
      fxVal.textContent = formula || (cell ? cell.textContent : '');
      fxVal.classList.toggle('is-formula', !!formula);
    };
    var typeCell = function (cell, value) {
      var ci = 0;
      var t = function () {
        cell.textContent = value.slice(0, ++ci);
        if (fxVal) fxVal.textContent = cell.textContent;
        if (ci < value.length) later(t, 60);
      };
      t();
    };
    /* opens whatever artifact the active case produced — the spreadsheet for
       Treuhand, the Prüfbericht for Kanzlei. Same slot, same chrome. */
    var openSheet = function () {
      if (!C.viewMode) return;   /* a case that writes nothing opens nothing */
      viewName.textContent = C.viewName;
      viewDir.textContent = C.viewDir;
      demoFileview.className = 'app__fileview ' + C.viewMode;
      demoWork.classList.add('is-file');
      demoBody.classList.add('is-expanded');
      demoBody.classList.add('is-rail');
    };
    var closeSheet = function () {
      demoWork.classList.remove('is-file');
      demoBody.classList.remove('is-expanded');
      demoBody.classList.remove('is-rail');
    };

    /* ---- filesystem views ---- */
    var fsRow = function (icon, name, meta) {
      return '<div class="app__fs-row" data-name="' + name + '">' + icon +
        '<span>' + name + '</span>' + (meta ? '<span class="meta">' + meta + '</span>' : '') + '</div>';
    };
    /* The listing belongs to the case — it ends with the source document the
       run opens, which is what makes the later turns legible ("ergänze den Rest
       aus dem Beleg" / "prüf die Zitate in der Klageschrift"). */
    var fsRoot = function () {
      demoFs.innerHTML = '<div class="app__fs-crumb"><b>' + (L.workspace || 'Arbeitsbereich') + '</b></div>' +
        C.fs().map(function (r) {
          return fsRow(I[r.icon || 'folder'], r.name, r.meta);
        }).join('');
    };
    var fsTarget = function (name) {
      return demoFs.querySelector('[data-name="' + name + '"]');
    };

    /* ---- chat / panel pieces ---- */
    var setConv = function (i) {
      Array.prototype.forEach.call(demoConvs.children, function (c, j) {
        c.classList.toggle('is-active', j === i);
      });
    };
    /* The chat list is scenery, but scenery that contradicts the case is worse
       than none — a Kanzlei run under "Rechnungen Q3" reads as the wrong
       screenshot. The mobile sidebar carries its own copy of the list. */
    var renderConvs = function () {
      var write = function (nodes) {
        Array.prototype.forEach.call(nodes, function (c, j) {
          if (C.convs[j]) c.textContent = C.convs[j];
        });
      };
      write(demoConvs.children);
      if (phSide) write(phSide.querySelectorAll('.app__convs span'));
    };
    var todoEls = [];
    var renderTodos = function () {
      demoTodos.innerHTML = '';
      todoEls = C.todos.map(function (t) {
        var li = el('li', 'is-open', '<span class="todo__glyph"></span><span class="t">' + t + '</span>');
        demoTodos.appendChild(li);
        return li;
      });
      demoTodoCount.textContent = '0/' + C.todos.length;
    };
    var setTodo = function (k, state) {
      if (!todoEls[k]) return;
      todoEls[k].className = 'is-' + state;
      var done = todoEls.filter(function (li) { return li.className === 'is-done'; }).length;
      demoTodoCount.textContent = done + '/' + C.todos.length;
    };
    var modCount = 0;
    var resetFiles = function () {
      modCount = 0;
      lastFileEl = null;
      demoFiles.innerHTML = '<div class="app__empty">Alles, das der Agent schreibt oder bearbeitet, wird hier angezeigt.</div>';
      demoModCount.textContent = '';
    };
    var addFile = function (name, flash) {
      if (modCount === 0) demoFiles.innerHTML = '';
      modCount++;
      lastFileEl = el('div', 'app__file' + (flash ? ' app__file--new' : ''), I.pencil + '<span>' + name + '</span>');
      demoFiles.appendChild(lastFileEl);
      demoModCount.textContent = String(modCount);
    };
    var resetComposer = function () {
      typeToken++;
      typingText = null;
      demoTa.className = 'app__ta is-empty';
      demoTa.querySelector('.txt').textContent = '';
      demoSend.classList.remove('is-ready');
    };
    var phResetComposer = function () {
      phTypeToken++;
      phTypingText = null;
      var pta = phEl('.mcomposer__ta');
      if (pta) {
        pta.classList.remove('is-typing', 'is-writing');
        pta.querySelector('.txt').textContent = '';
      }
      if (phSend) phSend.classList.remove('is-ready');
    };
    /* Message.tsx labels the signed-in user's own turns with their FIRST NAME
       (single initial in the avatar) and the assistant's with t("message.agent")
       — which is the product name in every language, not a role word. */
    var userRow = function (text) {
      return el('div', 'msg', '<span class="msg__avatar msg__avatar--user">' + W_INITIAL + '</span>' +
        '<div class="msg__col"><div class="msg__name">' + W_USER + '</div><div class="msg__body">' + text + '</div></div>');
    };
    var agentRow = function () {
      return el('div', 'msg', '<span class="msg__avatar msg__avatar--agent">' + I.mark + '</span>' +
        '<div class="msg__col"><div class="msg__name">' + W_AGENT + '</div><div class="tl"></div></div>');
    };
    var tlRow = function (iconHtml, text) {
      return el('div', 'tl__row', '<span class="tl__icon">' + iconHtml + '</span><span class="tl__text">' + text + '</span>');
    };
    var collapseTl = function (tlEl) {
      var d = el('div', 'tl__disclosure', I.chev + '<b>' + W_STEPS + '</b>');
      tlEl.parentElement.insertBefore(d, tlEl);
      tlEl.style.display = 'none';
    };
    var typeToken = 0;
    var typingText = null;
    /* drift-corrected: total duration is exactly text.length * TYPE_MS, even
       when setTimeout lags — the cursor never leaves before typing is done */
    var typeInto = function (text) {
      var token = ++typeToken;
      typingText = text;
      var txt = demoTa.querySelector('.txt');
      demoTa.className = 'app__ta is-typing is-writing';
      demoSend.classList.add('is-ready');
      var t0 = performance.now();
      var tick = function () {
        if (token !== typeToken) return;   // cancelled (sent/reset)
        var n = Math.min(text.length, Math.max(1, Math.round((performance.now() - t0) / TYPE_MS)));
        txt.textContent = text.slice(0, n);
        if (n < text.length) later(tick, TYPE_MS);
        else { typingText = null; demoTa.classList.remove('is-writing'); }
      };
      tick();
    };
    /* make sure the full message is visible before it is sent */
    var finishTyping = function () {
      if (typingText !== null) {
        demoTa.querySelector('.txt').textContent = typingText;
        typingText = null;
      }
      demoTa.classList.remove('is-writing');
      typeToken++;   // stop any pending ticks
    };
    /* phone composer typing — own token, own pace, own timer pool */
    /* the phone runs slower than the desktop on purpose — a thumb reads a
       full-screen view, it does not scan a window */
    var PH_TYPE = 42;   /* ms per typed character */
    var PH_STEP = 1000; /* ms per agent step row */
    var PH_CELL = 85;   /* ms per character typed into a sheet cell */
    var phTypeToken = 0;
    var phTypingText = null;
    var phTypeInto = function (text) {
      var token = ++phTypeToken;
      phTypingText = text;
      var pta = phEl('.mcomposer__ta');
      if (!pta) return;
      var ptxt = pta.querySelector('.txt');
      pta.classList.add('is-typing', 'is-writing');
      if (phSend) phSend.classList.add('is-ready');
      var t0 = performance.now();
      var tick = function () {
        if (token !== phTypeToken) return;
        var n = Math.min(text.length, Math.max(1, Math.round((performance.now() - t0) / PH_TYPE)));
        ptxt.textContent = text.slice(0, n);
        if (n < text.length) phLater(tick, PH_TYPE);
        else { phTypingText = null; pta.classList.remove('is-writing'); }
      };
      tick();
    };
    var phFinishTyping = function () {
      if (phTypingText !== null) {
        var pta = phEl('.mcomposer__ta');
        if (pta) pta.querySelector('.txt').textContent = phTypingText;
        phTypingText = null;
      }
      phTypeToken++;
    };
    var runSteps = function (tl, steps, withTodos) {
      var si = 0;
      var tick = function () {
        if (si >= steps.length) {
          var f = tlRow(I.finish, W_DONE);
          tl.appendChild(f);
          requestAnimationFrame(function () { f.classList.add('is-in'); });
          return;
        }
        var st = steps[si];
        if (withTodos) setTodo(si, 'active');
        var r = tlRow('<span class="tl__spinner"></span>', st.t);
        tl.appendChild(r);
        if (tl.children.length > 1) tl.classList.add('has-line');
        requestAnimationFrame(function () { r.classList.add('is-in'); });
        later(function () {
          r.querySelector('.tl__icon').innerHTML = I[st.icon];
          if (withTodos) setTodo(si, 'done');
          if (st.file) addFile(st.file, true);
          si++;
          later(tick, STEP_GAP);
        }, STEP_SPIN);
      };
      tick();
    };

    /* ---- phone layer: its own independent loop in the real mobile layout ---- */
    var phTimers = [];
    var phLater = function (fn, ms) { phTimers.push(setTimeout(fn, ms)); };
    var phClearTimers = function () { phTimers.forEach(clearTimeout); phTimers = []; };
    var SNAP = {};   /* deterministic content snapshots, captured once at init */
    var phTl = null, phCol = null;
    var phMode = function (mode) {
      if (phBody) phBody.className = 'phone__body' + (mode ? ' is-' + mode : '');
    };
    var phTap = function (x, y) {
      if (!phoneLayer) return;
      var t = el('span', 'mtap');
      t.style.left = x;
      t.style.top = y;
      phoneLayer.appendChild(t);
      phLater(function () { t.remove(); }, 800);
    };
    var phTapEl = function (target) {
      if (!target || !phoneLayer) return;
      var r = target.getBoundingClientRect();
      var p = phoneLayer.getBoundingClientRect();
      phTap((r.left - p.left + r.width / 2) + 'px', (r.top - p.top + r.height / 2) + 'px');
    };
    var phEl = function (sel) { return phoneLayer ? phoneLayer.querySelector(sel) : null; };
    var phOpenSidebar = function () { if (phoneLayer) phoneLayer.classList.add('is-side'); };
    var phCloseSidebar = function () { if (phoneLayer) phoneLayer.classList.remove('is-side'); };
    var phSyncActivity = function () {
      if (!phActivityBody) return;
      phActivityBody.innerHTML = SNAP.cards || '';
      stripIds(phActivityBody);
    };
    var phOpenActivity = function () {
      if (!phoneLayer) return;
      phSyncActivity();
      phoneLayer.classList.add('is-activity');
    };
    var phCloseActivity = function () { if (phoneLayer) phoneLayer.classList.remove('is-activity'); };
    var phSyncFs = function () {
      if (phFs) { phFs.innerHTML = SNAP.fs || ''; stripIds(phFs); }
    };
    /* the source document, full screen — the invoice PDF or the pleading,
       whichever the active case opened. Pass html to show a different state of
       it (the Kanzlei case closes on the same document carrying its verdicts). */
    var phShowPdf = function (html) {
      if (!phPdf) return;
      phPdf.innerHTML = html || SNAP.pdf || '';
      stripIds(phPdf);
      phMode('pdf');
    };
    /* The artifacts overlay carries whatever the case produced. Only the
       spreadsheet needs the .sheet wrapper the real Univer preview sits in; the
       report brings its own container. */
    var phSetSheet = function (html) {
      if (!phSheetBody) return;
      phSheetBody.innerHTML = C.viewMode === 'is-sheet'
        ? '<div class="sheet">' + (html || '') + '</div>'
        : (html || '');
      stripIds(phSheetBody);
    };
    var phOpenSheet = function (html) {
      if (!phoneLayer) return;
      if (phSheetName) phSheetName.textContent = C.viewName;
      if (phSheetDir) phSheetDir.textContent = C.viewDir;
      if (html) phSetSheet(html);
      phoneLayer.classList.add('is-sheet');
    };
    /* the phone edits ITS OWN copy of the sheet (row 8 = the new invoice row) */
    var phSheetCell = function (col) {
      var rows = phSheetBody ? phSheetBody.querySelectorAll('tr') : [];
      return rows[7] ? rows[7].children[col] : null;
    };
    var phShowNewRow = function () {
      var rows = phSheetBody ? phSheetBody.querySelectorAll('tr') : [];
      if (rows[7]) rows[7].className = '';
    };
    var phTypeCell = function (col, value) {
      var cell = phSheetCell(col);
      if (!cell) return;
      cell.classList.add('is-edit');
      var ci = 0;
      var t = function () {
        cell.textContent = value.slice(0, ++ci);
        if (ci < value.length) phLater(t, PH_CELL);
        else phLater(function () { cell.classList.remove('is-edit'); }, 260);
      };
      t();
    };
    var phCloseSheet = function () {
      if (phoneLayer) phoneLayer.classList.remove('is-sheet');
    };
    var phReset = function () {
      if (!phoneChat) return;
      phClearTimers();
      phResetComposer();
      phoneChat.innerHTML = '';
      phTl = null;
      phCol = null;
      phMode('');
      phCloseSheet();
      phCloseSidebar();
      phCloseActivity();
    };
    /* No tap ripple here: both callers in the sequence already tap the real
       send button with phTapEl(phSend) one call earlier, so the hardcoded
       88%/86% ripple that used to sit here landed on the same spot in the same
       beat and read as a double click. renderStatic() calls this too, where a
       ripple has no business firing at all. */
    var phUser = function (text) {
      if (!phoneChat) return;
      phMode('');
      phoneChat.innerHTML = '';
      phTl = null;
      phCol = null;
      var u = userRow(text);
      u.classList.add('is-in');
      phoneChat.appendChild(u);
    };
    var phStep = function (st) {
      if (!phoneChat) return;
      if (!phTl) {
        var a = agentRow();
        a.classList.add('is-in');
        phoneChat.appendChild(a);
        phTl = a.querySelector('.tl');
        phCol = a.querySelector('.msg__col');
      }
      var r = tlRow(I[st.icon], st.t);
      r.classList.add('is-in');
      phTl.appendChild(r);
      if (phTl.children.length > 1) phTl.classList.add('has-line');
    };
    var phAnswer = function (html) {
      if (phCol) phCol.appendChild(el('div', 'msg__answer is-in', html));
    };
    var phCollapse = function () {
      if (phTl) {
        collapseTl(phTl);
        phTl = null;
      }
    };

    /* Everything the window shows that is NOT the active case's own artifact.
       The case puts its own scenery back through reset() — the spreadsheet
       cells for Treuhand, the report rows and citation marks for Kanzlei. */
    var resetScene = function () {
      setConv(-1);
      renderConvs();
      renderTodos();
      resetFiles();
      resetComposer();
      closeSheet();
      demoBody.classList.add('is-nopanel');
      demoMain.classList.remove('is-files');
      demoMain.classList.remove('is-pdf');
      demoMain.classList.remove('is-doc');
      navFiles.classList.remove('is-active');
      demoChat.innerHTML = '';
      demoFs.innerHTML = '';
      if (ctxSkill) ctxSkill.textContent = C.ctxSkill;
      /* A case that never opens a workspace file has no "Arbeitsdateien" —
         the real panel renders the section from the files it read, so an empty
         one would not be there at all. */
      /* display, not the hidden attribute: .app__file sets display:flex, which
         beats the UA stylesheet's [hidden] rule and left an empty file glyph
         sitting under "Skills". */
      if (ctxWork) ctxWork.textContent = C.ctxWork || '';
      if (ctxWorkLabel) ctxWorkLabel.style.display = C.ctxWork ? '' : 'none';
      if (ctxWorkRow) ctxWorkRow.style.display = C.ctxWork ? '' : 'none';
      if (C.reset) C.reset();
    };

    /* ---- deterministic snapshots for the independent phone loop ----
       The phone layer injects HTML rather than driving the live DOM, so each
       case captures the frames it needs ONCE, by building them in the hidden
       engine and reading them back. Captured lazily, the first time a case is
       played, and cached on the case itself. */
    var captureSnaps = function () {
      if (C.snap) { SNAP = C.snap; return; }
      SNAP = C.snap = {};
      fsRoot();
      SNAP.fs = demoFs.innerHTML;
      renderTodos();
      C.todos.forEach(function (_, k) { setTodo(k, 'done'); });
      resetFiles();
      /* whatever the run actually writes — the Vertrieb case writes nothing,
         and its "Geändert" card is empty on purpose */
      var written = null;
      C.steps1.forEach(function (s) { if (s.file) written = s.file; });
      if (written) addFile(written, false);
      SNAP.cards = demoWork.querySelector('.app__cards').outerHTML;
      C.capture();
      resetScene();
    };

    /* ---- static fallback (reduced motion / small screens) ---- */
    var renderStatic = function () {
      resetScene();
      phReset();
      demoBody.classList.remove('is-nopanel');
      cursor.classList.add('is-hidden');
      if (xfCursor) xfCursor.classList.add('is-hidden');
      setConv(1);
      var u = userRow(C.msg1); u.classList.add('is-in');
      demoChat.appendChild(u);
      var a = agentRow(); a.classList.add('is-in');
      demoChat.appendChild(a);
      var tl = a.querySelector('.tl');
      phUser(C.msg1);
      C.steps1.forEach(function (st, k) {
        setTodo(k, 'done');
        if (st.file) addFile(st.file, false);
        phStep(st);
      });
      collapseTl(tl);
      phCollapse();
      a.querySelector('.msg__col').appendChild(el('div', 'msg__answer is-in', C.answer1));
      phAnswer(C.answer1);
      /* the finished artifact, without the animation that produced it */
      C.staticView();
      openSheet();
      later(syncClone, 50);
    };

    /* ---- the scripted sequences (one timer pool per device) ---- */
    var seq = function (steps) {
      var i = 0;
      var next = function () {
        if (i >= steps.length) return;
        var st = steps[i++];
        if (st.fn) st.fn();
        later(next, st.d || 0);
      };
      next();
    };
    var phSeq = function (steps) {
      var i = 0;
      var next = function () {
        if (i >= steps.length) return;
        var st = steps[i++];
        if (st.fn) st.fn();
        phLater(next, st.d || 0);
      };
      next();
    };

    /* Shared prologue for every case: wipe the stage, show the cursor, park it,
       then hand over to the active case's own choreography. The loop tail of
       each case calls back into here, so switching cases takes effect on the
       next lap even if a timer is still in flight. */
    var play = function () {
      clearTimers();
      resetScene();
      captureSnaps();
      cursor.classList.remove('is-hidden');
      if (xfCursor) xfCursor.classList.remove('is-hidden');
      parkCursor(true);
      C.play();
    };

    /* ================= choreography: Treuhand ================= */

    /* ---- the phone plays the SAME story independently, at its own pace ---- */
    var phRunSteps = function (steps) {
      var si = 0;
      var tick = function () {
        if (si >= steps.length) return;
        phStep(steps[si++]);
        phLater(tick, PH_STEP);
      };
      tick();
    };
    /* The phone tells the SAME story as the desktop, but a thumb is slower
       than a cursor and every view here is full-screen: you lose your place if
       a screen swaps before you have read it. So the beats are longer than the
       desktop's throughout, and the navigation is complete — the file viewer
       is left through its back arrow instead of the screen simply changing
       underneath. Nothing is skipped for the sake of a shorter loop. */
    var phPlay = function () {
      phReset();
      captureSnaps();
      C.phPlay();
    };


    /* scenery the Treuhand case owns: the spreadsheet it writes */

    /* ================= choreography: Kanzlei ================= */

    /* Each citation takes the verdict the agent reported for it. Staggered when
       the marked document is revealed, instant when a snapshot is built. */
    /* the report writes itself out row by row, the way the sheet fills in the
       other case — a block that is simply there reads as a screenshot */






    /* Everything a case's choreography is allowed to drive, and nothing
       more. A case script is the engine's caller, not its user: it gets the
       primitives, the scene elements it animates, and the timing constants.
       Add a key here when a case genuinely needs one. */
    var E = {
      L: L, LC: LC, I: I,
      /* live reads: both change while a run is playing, so they are calls */
      snap: function () { return SNAP; },
      demoChat: demoChat,
      lastFile: function () { return lastFileEl; },
      PH_CELL: PH_CELL,
      PH_STEP: PH_STEP,
      PH_TYPE: PH_TYPE,
      STEP_GAP: STEP_GAP,
      STEP_SPIN: STEP_SPIN,
      TYPE_MS: TYPE_MS,
      W_DOCS: W_DOCS,
      W_FILES: W_FILES,
      agentRow: agentRow,
      cellCount: cellCount,
      cellMwst: cellMwst,
      cellTotal: cellTotal,
      clickCursor: clickCursor,
      collapseTl: collapseTl,
      cursor: cursor,
      demoBody: demoBody,
      demoMain: demoMain,
      demoSend: demoSend,
      demoTa: demoTa,
      docView: docView,
      el: el,
      finishTyping: finishTyping,
      fixSatz: fixSatz,
      fsRoot: fsRoot,
      fsTarget: fsTarget,
      fxName: fxName,
      fxVal: fxVal,
      later: later,
      moveCursor: moveCursor,
      navFiles: navFiles,
      navNew: navNew,
      newKonto: newKonto,
      newLief: newLief,
      newMwst: newMwst,
      newNetto: newNetto,
      newNr: newNr,
      newRow: newRow,
      newSatz: newSatz,
      openSheet: openSheet,
      panel: panel,
      parkCursor: parkCursor,
      pdfView: pdfView,
      phActivityBody: phActivityBody,
      phAnswer: phAnswer,
      phCloseActivity: phCloseActivity,
      phCloseSheet: phCloseSheet,
      phCloseSidebar: phCloseSidebar,
      phCollapse: phCollapse,
      phEl: phEl,
      phFinishTyping: phFinishTyping,
      phFs: phFs,
      phMode: phMode,
      phOpenActivity: phOpenActivity,
      phOpenSheet: phOpenSheet,
      phOpenSidebar: phOpenSidebar,
      phPdf: phPdf,
      phPlay: phPlay,
      phResetComposer: phResetComposer,
      phRunSteps: phRunSteps,
      phSend: phSend,
      phSeq: phSeq,
      phSheetCell: phSheetCell,
      phShowNewRow: phShowNewRow,
      phShowPdf: phShowPdf,
      phSide: phSide,
      phSyncFs: phSyncFs,
      phTapEl: phTapEl,
      phTypeCell: phTypeCell,
      phTypeInto: phTypeInto,
      phUser: phUser,
      play: play,
      reportEl: reportEl,
      resetComposer: resetComposer,
      resetScene: resetScene,
      runSteps: runSteps,
      selectCell: selectCell,
      seq: seq,
      setConv: setConv,
      sheetEl: sheetEl,
      typeCell: typeCell,
      typeInto: typeInto,
      userRow: userRow,
    };
    var CASES = (window.KXCases || []).map(function (make) { return make(E); });
    if (!CASES.length) return;
    var C = CASES[0];

    /* Only the device that is actually on screen animates. The two loops ran
       in parallel back when the toggle could reveal either one at any moment;
       now the viewport picks exactly one, so the other's timers would be pure
       waste — and it would be mid-sequence, not at its opening beat, if the
       window were ever resized across the breakpoint. */
    var activeDevice = null;   /* 'desktop' | 'phone' */
    var runDevice = function (phone) {
      var want = phone ? 'phone' : 'desktop';
      if (!started || activeDevice === want) return;
      activeDevice = want;
      clearTimers();
      phClearTimers();
      if (!demoMotion) { renderStatic(); return; }
      if (phone) phPlay(); else play();
    };

    /* ---- the case selector under the window ----
       Switching restarts the active device's loop from its opening beat. It
       does NOT start a loop that has not started yet: before the section has
       been scrolled to, the tabs only retitle the section, and the usual
       IntersectionObserver still decides when the window comes alive. */
    var applyCase = function (i) {
      var next = CASES[i];
      if (!next || next === C) return;
      C = next;
      Array.prototype.forEach.call(ucTabs, function (b, j) {
        b.classList.toggle('is-active', j === i);
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
      });
      if (ucTitle) ucTitle.innerHTML = C.title;
      if (!started) return;
      clearTimers();
      phClearTimers();
      if (!demoMotion) { renderStatic(); return; }
      if (activeDevice === 'phone') phPlay(); else play();
    };
    /* The buttons carry German labels in the markup so the page reads correctly
       before any script runs; the case owns the real label, which is what makes
       them translatable on /en /fr /it. A button with no case behind it is
       markup that got ahead of the cases — drop it rather than leave a tab that
       does nothing. */
    Array.prototype.forEach.call(ucTabs, function (b) {
      var i = parseInt(b.getAttribute('data-case'), 10) || 0;
      if (!CASES[i]) { b.hidden = true; return; }
      b.textContent = CASES[i].tab;
      b.addEventListener('click', function () { applyCase(i); });
    });

    if ('IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            runDevice(phoneMQ.matches);
            dio.disconnect();
          }
        });
      }, { threshold: 0.15 });
      dio.observe(demoChat);
      var xformEl = document.getElementById('xform');
      if (xformEl) dio.observe(xformEl);
    } else {
      started = true;
      runDevice(phoneMQ.matches);
    }

    /* ---- device view: the VIEWPORT picks the device, not a control.
       A wide screen gets the desktop window, a narrow one the mobile layout —
       which is what the visitor is holding anyway. ---- */
    var xform = document.getElementById('xform');
    if (xform) {
      var xfSticky = xform.querySelector('.xform__sticky');
      var lastW0 = 0;   /* displayed frame width in desktop view */
      var lastDW = 0;   /* engine design width (>= 1024: always a real desktop layout) */
      var sizeStage = function () {
        if (!xfStage) return;
        /* A shade wider than the hero stage (1100) — this window is the
           section's whole subject, so it may take more room. No height cap:
           on a short screen the section simply scrolls, as the hero does. */
        var dispW = Math.min(1240, window.innerWidth - 40);
        var designW = Math.max(dispW, 1024);
        if (dispW !== lastW0 || designW !== lastDW) {
          lastW0 = dispW;
          lastDW = designW;
          /* the engine always lays out as a desktop (>=1024px) and is scaled into
             the frame; the frame height is fitted so nothing is clipped below the
             42px mac chrome */
          var innerH = Math.round(designW * 0.625) - 44;
          var s0 = (dispW - 2) / designW;
          var frameH0 = Math.round(innerH * s0) + 46;
          xfStage.style.width = designW + 'px';
          xfStage.style.height = innerH + 'px';
          if (engineEl) engineEl.style.width = designW + 'px';
          if (panel) panel.style.height = innerH + 'px';
          xfSticky.style.setProperty('--fw0', dispW + 'px');
          xfSticky.style.setProperty('--fh0', frameH0 + 'px');
        }
        return lastW0;
      };
      /* --p: 0 = desktop window, 1 = phone. No longer a tween between the
         two — the viewport decides, so it is simply set. */
      var curM = 0;
      var applyM = function (m) {
        curM = m;
        xfP = m;
        xfSticky.style.setProperty('--p', m.toFixed(4));
        var w0 = lastW0 || 1100;
        var wp = Math.min(640, window.innerHeight - 210) * 0.4833;
        var frameW = m ? wp : w0;
        xfStage.style.setProperty('--s', (frameW / (lastDW || 1024)).toFixed(4));
        if (cloneDirty && cloneWanted()) scheduleClone();
      };
      var syncDevice = function () {
        sizeStage();
        applyM(phoneMQ.matches ? 1 : 0);
        runDevice(phoneMQ.matches);   /* no-op unless the breakpoint flipped */
      };
      syncDevice();
      window.addEventListener('resize', syncDevice);
      /* crossing the breakpoint swaps the device even without a resize event
         (orientation change, zoom) */
      if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', syncDevice);
      else if (phoneMQ.addListener) phoneMQ.addListener(syncDevice);
    }
})();
