/* Page chrome for the prototype page.html: hero frame (variant switch, link
   handling, height), tile tilt, the one-time light sweep, nav hairline, year,
   and the legal dialogs. No dependencies. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hero frame (prototype only) ---------------- */
  var HEROES = { c: 'variant-c.html' };   /* D was dropped on 26.11.2026 */
  var frame = document.getElementById('hero');
  var nav = document.getElementById('top');
  var params = new URLSearchParams(location.search);
  var hero = HEROES[params.get('hero')] ? params.get('hero') : 'c';

  /* hidden inside the frame: C's tuning panel and any test hooks. The test hooks
     of D only switch on with #test in its URL, which this page never sets. */
  var INJECT = '.tune, [data-test], [id^="test"], [class*="test-"], [class*="__test"] { display: none !important; }';

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', '#' + id); } catch (e) { /* file:// */ }
    return true;
  }

  function fit() {
    var doc;
    try { doc = frame.contentDocument; } catch (e) { return; }
    if (!doc || !doc.documentElement) return;
    /* after a switch, never measure the old variant's document */
    var want = HEROES[hero], path = frame.contentWindow.location.pathname;
    if (path.slice(-want.length) !== want) return;
    var h = Math.ceil(doc.documentElement.scrollHeight);
    /* C fills the viewport between 680 and 980 px (the CSS of the frame). Where
       its layout needs more (phones, short desktop windows), the frame takes the
       whole document. D is at least as tall as the viewport (min-height:
       100vh) and always takes its whole document. Either way there is no second scrollbar. */
    var cssH = Math.min(Math.max(window.innerHeight, 680), 980);
    if (hero === 'c' && h <= cssH + 1) {
      frame.classList.remove('is-fitted'); frame.style.height = '';
      return;
    }
    if (h > frame.offsetHeight || frame.offsetHeight - h > 1) {  // never shorter than the document
      frame.classList.add('is-fitted');
      frame.style.height = h + 'px';
    }
  }

  /* Both heroes size themselves from the frame's height (100vh inside the frame
     is the frame). To let them shrink again after a resize, start from the
     default height and measure the document once more. */
  function refit() {
    frame.classList.remove('is-fitted');
    frame.style.height = hero === 'd' ? window.innerHeight + 'px' : '';
    requestAnimationFrame(function () { requestAnimationFrame(fit); });
  }

  var ro = null, fitTimer = 0;
  frame.addEventListener('load', function () {
    var doc;
    try { doc = frame.contentDocument; } catch (e) { return; } // not same origin: leave it
    if (!doc) return;
    var st = doc.createElement('style');
    st.textContent = INJECT;
    doc.head.appendChild(st);

    /* links inside the frame act on this page: anchors scroll it, the rest
       opens in the top window */
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var url = new URL(a.getAttribute('href'), doc.baseURI);
      var self = url.pathname === frame.contentWindow.location.pathname;
      if (url.hash && !self && url.origin === location.origin) {
        if (scrollToId(url.hash.slice(1))) { e.preventDefault(); return; }
      }
      if (self && url.hash) return;            // an anchor inside the hero itself
      /* the home link of D (href="../") leads to this page's top */
      if (url.origin === location.origin && !url.hash && url.pathname === new URL('../', location.href).pathname) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); return; }
      a.target = '_top';
    }, true);

    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(function () { fit(); });
      ro.observe(doc.body);
    }
    fit();
    fitTimer = setTimeout(fit, 600);  // after fonts and the hero's own layout pass
  });

  var rt = 0;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(refit, 120); });

  function setHero(id, push) {
    hero = id;
    document.documentElement.classList.toggle('hero-d', id === 'd');
    /* D brings its own nav (Kontexus logo, Produkt, Preise, Anmelden):
       never two navs on top of each other */
    nav.hidden = id === 'd';
    /* stop watching the old document, so nothing sizes the frame from it */
    if (ro) { ro.disconnect(); ro = null; }
    clearTimeout(fitTimer);
    frame.classList.remove('is-fitted'); frame.style.height = '';
    if (id === 'd') frame.style.height = window.innerHeight + 'px';
    var want = HEROES[id];
    if (frame.getAttribute('src') !== want) frame.setAttribute('src', want);
    document.querySelectorAll('[data-hero]').forEach(function (a) { a.setAttribute('aria-current', String(a.dataset.hero === id)); });
    if (push) {
      var u = new URL(location.href);
      u.searchParams.set('hero', id);
      try { history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) { /* file:// */ }
    }
  }
  document.querySelectorAll('[data-hero]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); setHero(a.dataset.hero, true); });
  });
  setHero(hero, false);

  /* ---------------- Tilt toward the cursor ---------------- */
  /* Small tiles tilt up to ±11°, large tiles up to ±2°; the perspective sits on
     the single tile. Mouse only, never with reduced motion. */
  if (!reduced) {
    var pend = null, raf = 0;
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var b = e.target.closest && e.target.closest('.tile:not(.tile--empty), .ptile[data-tilt]');
      if (!b) return;
      pend = { b: b, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(function () {
        raf = 0; if (!pend) return;
        var r = pend.b.getBoundingClientRect(), k = pend.b.classList.contains('ptile') ? 4 : 22;
        var px = Math.max(-0.5, Math.min(0.5, (pend.x - r.left) / r.width - 0.5));
        var py = Math.max(-0.5, Math.min(0.5, (pend.y - r.top) / r.height - 0.5));
        pend.b.classList.add('is-tracking');
        pend.b.style.setProperty('--ry', (px * k).toFixed(2) + 'deg');
        pend.b.style.setProperty('--rx', (-py * k).toFixed(2) + 'deg');
        pend = null;
      });
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var b = e.target.closest && e.target.closest('.tile, .ptile[data-tilt]');
      if (!b || b.contains(e.relatedTarget)) return;
      b.classList.remove('is-tracking');
      b.style.removeProperty('--rx'); b.style.removeProperty('--ry');
    });
  }

  /* ---------------- Light sweep: once, on active tiles, when they show ---------------- */
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-swept'); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('.is-active').forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Nav hairline once the page scrolls ---------------- */
  /* the nav shows only once the hero is (nearly) out of view */
  var heroBox = document.getElementById('usecases');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 4);
    var bottom = heroBox ? heroBox.getBoundingClientRect().bottom : 0;
    nav.classList.toggle('is-shown', bottom < 80);
  }
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------------- Current year in the footer ---------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------- Impressum / Datenschutz (as in js/main.js) ---------------- */
  // The dialogs carry the whole behaviour — focus trap, Escape, backdrop — so
  // this only opens them. The links keep their href="#impressum" so they still
  // lead somewhere with JS off; preventDefault is therefore conditional on
  // showModal actually existing.
  document.querySelectorAll('[data-legal]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var dlg = document.getElementById(link.getAttribute('data-legal'));
      if (!dlg || !dlg.showModal) return;
      e.preventDefault();
      dlg.showModal();
    });
  });
  // Clicking the backdrop closes: a click on <dialog> itself only lands
  // outside .legal__body, because the body covers the whole card.
  document.querySelectorAll('dialog.legal').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });
})();
