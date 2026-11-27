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

/* product card 3: tapping the leaf tile opens its note, tapping elsewhere closes it */
(function () {
  var t = document.querySelector('.tile--leaf');
  if (!t) return;
  t.querySelector('.leaf').addEventListener('click', function (e) { e.stopPropagation(); t.classList.toggle('is-open'); });
  document.addEventListener('click', function () { t.classList.remove('is-open'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') t.classList.remove('is-open'); });
})();
