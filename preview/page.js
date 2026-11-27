/* Page chrome for the prototype page.html: tile tilt in the sections, the one-time
   light sweep, nav visibility, year, and the legal dialogs. The hero has its own
   script, hero.js. No dependencies. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var nav = document.getElementById('nav');

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

/* product cards: notes on .hint elements (data-hint-t = title, data-hint = text).
   Mouse: shown while the pointer is on the element. Touch: a tap opens it, a tap elsewhere
   closes it. Keyboard: shown while the element has focus. One note per card, placed above
   the element if there is room in the card's picture area, otherwise below, and kept
   inside it horizontally. */
(function () {
  var open = null;
  function tipFor(vis) {
    var t = vis.querySelector(':scope > .hint__tip');
    if (!t) {
      t = document.createElement('div'); t.className = 'hint__tip'; t.setAttribute('role', 'tooltip');
      t.id = 'hint-' + Math.random().toString(36).slice(2, 8); vis.appendChild(t);
    }
    return t;
  }
  function show(el) {
    var vis = el.closest('.card__vis'); if (!vis) return;
    if (open && open !== el) hide(open);
    var t = tipFor(vis);
    t.innerHTML = '<b></b><span></span>';
    t.firstChild.textContent = el.dataset.hintT || ''; t.lastChild.textContent = el.dataset.hint || '';
    el.setAttribute('aria-describedby', t.id);
    var v = vis.getBoundingClientRect(), r = el.getBoundingClientRect();
    t.style.left = '0px'; t.style.top = '0px';
    var w = t.offsetWidth, h = t.offsetHeight, gap = 8;
    var x = r.left - v.left + r.width / 2 - w / 2;
    x = Math.max(0, Math.min(x, v.width - w));
    var above = r.top - v.top - gap - h, below = r.bottom - v.top + gap;
    var y = above >= -12 ? above : below;
    t.style.left = Math.round(x) + 'px'; t.style.top = Math.round(y) + 'px';
    t.classList.add('is-on'); open = el;
  }
  function hide(el) {
    var vis = el.closest('.card__vis'); var t = vis && vis.querySelector(':scope > .hint__tip');
    if (t) t.classList.remove('is-on');
    el.removeAttribute('aria-describedby');
    if (open === el) open = null;
  }
  document.querySelectorAll('#produkt .hint').forEach(function (el) {
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(el); });
    el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(el); });
    /* keyboard focus only; a click or tap also focuses, but is handled below */
    el.addEventListener('focus', function () { if (el.matches(':focus-visible')) show(el); });
    el.addEventListener('blur', function () { hide(el); });
    var lastType = '';
    el.addEventListener('pointerdown', function (e) { lastType = e.pointerType; });
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      if (lastType === 'mouse') return;   /* the mouse shows it by pointing */
      if (open === el) hide(el); else show(el);
    });
  });
  document.addEventListener('click', function () { if (open) hide(open); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) hide(open); });
})();
