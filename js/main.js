// Reveal on scroll, nav hairline, card spotlight, footer year.
(function () {
  // Page chrome only. The use-case demo lives in js/demo/ — engine.js plus one
  // file per case. This file is shared verbatim by the German root and the
  // generated /en, /fr and /it pages, so it must never hard-code an asset path.

  // Reveal elements as they enter the viewport
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Hairline under the nav once the page scrolls
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Spotlight hover on cards (radial gradient follows the cursor)
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Count-up numbers when they scroll into view
  var counters = document.querySelectorAll('.count');
  var motionPref = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var runCounter = function (el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    if (!motionPref) { el.textContent = String(to); return; }
    var t0 = null;
    var dur = 1400;
    var tick = function (t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-to'); });
  }

  /* --- Hero window on narrow screens: scale, do not reflow ------------------
     Below the desktop breakpoint the replica used to collapse into a phone
     layout (44px rail, smaller type, its own composer width). That gave the
     window a squat shape of its own invention. Instead the app is laid out at a
     fixed DESKTOP design width and scaled into the frame, so the proportions
     stay the ones the real application has — the same trick the demo clone
     uses. The frame's height is pinned to chrome + scaled app, which keeps the
     16:10 screen ratio intact. */
  var heroFrame = document.querySelector('.hero .stage__frame');
  if (heroFrame) {
    var heroApp = heroFrame.querySelector('.app--welcome');
    var heroChrome = heroFrame.querySelector('.stage__chrome');
    /* 1024px, not 768: the collapsed 60px rail is `lg:!w-[60px]` in
       Sidebar.tsx, and below lg the sidebar is off-canvas — the app shows its
       single-column mobile shell instead. A 768px-wide rail layout is a window
       the real product never has. 1024 is therefore the narrowest HONEST
       desktop window, and narrower means bigger type once scaled, since every
       size is a design pixel: painted = design x (paintedWidth / HERO_DESIGN). */
    var HERO_DESIGN = 1024;
    /* Only 720–999px scales the window. Below 720 the window is hidden and the
       phone hero (.phonehero) takes over, so there is nothing to fit. */
    var narrowMQ = window.matchMedia('(min-width: 720px) and (max-width: 999px)');
    var sizeHero = function () {
      if (!heroApp) return;
      if (!narrowMQ.matches) {
        heroApp.classList.remove('app--scaled');
        heroApp.style.top = heroApp.style.width = heroApp.style.height =
          heroApp.style.transform = '';
        heroFrame.style.height = '';
        return;
      }
      var outerW = heroFrame.getBoundingClientRect().width;
      if (!outerW) return;
      /* The window the eye sees — border included — is what must be 16:10, so
         set the height and correct once by the measured delta instead of
         assuming a box-sizing. */
      var want = Math.round(outerW * 0.625);
      heroFrame.style.height = want + 'px';
      var off = want - heroFrame.getBoundingClientRect().height;
      if (off) heroFrame.style.height = (want + off) + 'px';

      var chromeH = heroChrome ? heroChrome.offsetHeight : 0;
      var appW = heroFrame.clientWidth;
      var appH = heroFrame.clientHeight - chromeH;
      var s = appW / HERO_DESIGN;
      heroApp.classList.add('app--scaled');
      heroApp.style.top = chromeH + 'px';
      heroApp.style.width = HERO_DESIGN + 'px';
      heroApp.style.height = Math.round(appH / s) + 'px';
      heroApp.style.transform = 'scale(' + s.toFixed(4) + ')';
    };
    sizeHero();
    window.addEventListener('resize', sizeHero);
    if (narrowMQ.addEventListener) narrowMQ.addEventListener('change', sizeHero);
    /* the wordmark webfont changes the greeting's metrics — re-measure once */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeHero);
  }

  /* Savings calculator. Every assumption is a slider now — head count, hours
     saved per person per week, and the hourly full cost. The page used to
     assert the last two in fine print, which meant the headline figure rested
     on numbers nobody had agreed to. */
  var range = document.getElementById('calcRange');
  if (range) {
    var rHours = document.getElementById('calcHours');
    var rRate = document.getElementById('calcRate');
    var outN = document.getElementById('calcN');
    var outHrs = document.getElementById('calcHrs');
    var outRt = document.getElementById('calcRt');
    var outH = document.getElementById('calcH');
    var outF = document.getElementById('calcF');
    var WEEKS = 46;
    var chf = function (n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    };
    var fill = function (el) {
      var p = ((el.value - el.min) / (el.max - el.min)) * 100;
      el.style.setProperty('--p', p + '%');
    };
    var updateCalc = function () {
      var n = parseInt(range.value, 10);
      var h = parseInt(rHours.value, 10);
      var rate = parseInt(rRate.value, 10);
      var hours = n * h * WEEKS;
      outN.textContent = String(n);
      outHrs.textContent = String(h);
      outRt.textContent = 'CHF ' + rate;
      outH.textContent = chf(hours);
      outF.textContent = 'CHF ' + chf(hours * rate);
      [range, rHours, rRate].forEach(fill);
    };
    [range, rHours, rRate].forEach(function (el) {
      el.addEventListener('input', updateCalc);
    });
    updateCalc();
  }

  // Gentle 3D tilt on the hero frame and the demo panel
  var motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  var addTilt = function (wrapper, target, deg) {
    if (!wrapper || !target || !motionOK) return;
    wrapper.addEventListener('pointermove', function (e) {
      var r = wrapper.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      target.style.transform =
        'perspective(1400px) rotateY(' + (x * deg).toFixed(2) + 'deg) rotateX(' + (-y * deg).toFixed(2) + 'deg)';
    });
    wrapper.addEventListener('pointerleave', function () {
      target.style.transform = '';
    });
  };
  var stage = document.querySelector('.stage');
  addTilt(stage, stage && stage.querySelector('.stage__frame'), 4);

  // Alpine skyline: a lazy, eased vertical parallax only — the ridges sink
  // a few dozen pixels at most while scrolling and glide there with a soft
  // lag. No horizontal movement. Reduced motion keeps them still.
  var mtnFar = document.querySelector('.bg__mtn--far');
  var mtnNear = document.querySelector('.bg__mtn--near');
  if (mtnFar && mtnNear && motionOK) {
    var mtnYF = 0, mtnYN = 0;
    var mtnTick = function () {
      var y = window.scrollY;
      mtnYF += (Math.min(y * 0.02, 34) - mtnYF) * 0.06;
      mtnYN += (Math.min(y * 0.045, 72) - mtnYN) * 0.06;
      mtnFar.style.transform = 'translateY(' + mtnYF.toFixed(2) + 'px)';
      mtnNear.style.transform = 'translateY(' + mtnYN.toFixed(2) + 'px)';
      requestAnimationFrame(mtnTick);
    };
    requestAnimationFrame(mtnTick);
  }

  // 01's composer types its prompt out, holds it, then repeats. Character by
  // character, the way the use-case demo does it — the CSS mask this replaces
  // cut letters in half (see .chatwin .app__ta.is-typing .txt in styles.css).
  // The string is read from the DOM, so the translated pages type their own.
  var chatTa = document.querySelector('.chatwin .app__ta.is-typing');
  if (chatTa && motionOK) {
    var chatTxt = chatTa.querySelector('.txt');
    var FULL = chatTxt.textContent;
    var TYPE_MS = 55, HOLD_MS = 2600, REST_MS = 800;
    var ci = 0, chatTimer = null, chatOn = false;

    var chatStep = function () {
      if (ci <= FULL.length) {
        chatTa.classList.add('is-writing');
        chatTxt.textContent = FULL.slice(0, ci++);
        chatTimer = setTimeout(chatStep, TYPE_MS);
        return;
      }
      chatTa.classList.remove('is-writing');   // done -> the caret blinks again
      chatTimer = setTimeout(function () {
        ci = 0;
        chatTxt.textContent = '';
        chatTimer = setTimeout(chatStep, REST_MS);
      }, HOLD_MS);
    };

    chatTxt.textContent = '';
    if ('IntersectionObserver' in window) {
      /* no timers while it is off screen — it loops forever otherwise */
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (!chatOn) { chatOn = true; chatStep(); }
          } else {
            chatOn = false;
            clearTimeout(chatTimer);
          }
        });
      }, { threshold: 0.15 }).observe(chatTa);
    } else {
      chatStep();
    }
  }

  // Current year in the footer
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Impressum / Datenschutz. The dialogs carry the whole behaviour — focus
  // trap, Escape, backdrop — so this only opens them. The links keep their
  // href="#impressum" so they still lead somewhere with JS off; preventDefault
  // is therefore conditional on showModal actually existing.
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

// Kontexus animated lockup — the "Flow" reveal (port of AnimatedLogo.tsx).
// Arms draw from the outside in, a spark glides along each into the core, the
// dot blooms, then the wordmark settles in. Plays once when it scrolls in.
(function () {
  var svg = document.querySelector('.kx-anim');
  if (!svg || typeof svg.animate !== 'function') return; // no WAAPI -> CSS shows final frame
  var arms = [].slice.call(svg.querySelectorAll('.kx-arm'));
  var sparks = [].slice.call(svg.querySelectorAll('.kx-spark'));
  var dot = svg.querySelector('.kx-dot');
  var glow = svg.querySelector('.kx-glow');
  var words = [].slice.call(svg.querySelectorAll('.kx-word'));
  var ARM_DELAYS = [120, 260, 200, 330];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running = [];

  function A(el, frames, opts) {
    opts.fill = 'both';
    if (!opts.easing) opts.easing = 'cubic-bezier(.4,0,.2,1)';
    var a = el.animate(frames, opts);
    running.push(a);
    return a;
  }

  function play() {
    running.splice(0).forEach(function (a) { a.cancel(); });
    if (reduced) return; // CSS default already is the final frame

    arms.forEach(function (el, i) {
      A(el, [
        { strokeDashoffset: '-18px', opacity: 0 },
        { strokeDashoffset: '-18px', opacity: 1, offset: 0.06 },
        { strokeDashoffset: '0px', opacity: 1 }
      ], { duration: 640, delay: ARM_DELAYS[i], easing: 'cubic-bezier(.3,.6,.15,1)' });
    });

    sparks.forEach(function (el, i) {
      var sx = el.getAttribute('data-sx'), sy = el.getAttribute('data-sy');
      A(el, [
        { transform: 'translate(' + sx + 'px,' + sy + 'px)', opacity: 0 },
        { opacity: 1, offset: 0.14 },
        { opacity: 0.95, offset: 0.8 },
        { transform: 'translate(0px,0px)', opacity: 0 }
      ], { duration: 740, delay: ARM_DELAYS[i], easing: 'cubic-bezier(.5,.05,.3,1)' });
    });

    if (glow) A(glow, [
      { opacity: 0, transform: 'scale(.5)' },
      { opacity: 0.85, offset: 0.35 },
      { opacity: 0, transform: 'scale(1.5)' }
    ], { duration: 700, delay: 1030, easing: 'cubic-bezier(.25,.6,.3,1)' });

    if (dot) A(dot, [
      { opacity: 0, transform: 'scale(.25)' },
      { opacity: 1, offset: 0.45 },
      { transform: 'scale(1.12)', offset: 0.62 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 540, delay: 1030, easing: 'cubic-bezier(.2,.7,.25,1)' });

    if (words[0]) A(words[0], [
      { opacity: 0, transform: 'translateX(9px)' },
      { opacity: 1, transform: 'translateX(0px)' }
    ], { duration: 620, delay: 1160, easing: 'cubic-bezier(.2,.7,.2,1)' });

    if (words[1]) A(words[1], [
      { opacity: 0, transform: 'translateX(-9px)' },
      { opacity: 1, transform: 'translateX(0px)' }
    ], { duration: 620, delay: 1160, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }

  var played = false;
  function start() {
    if (played) return;
    played = true;
    Promise.race([
      (document.fonts && document.fonts.ready) || Promise.resolve(),
      new Promise(function (r) { setTimeout(r, 700); })
    ]).then(function () { requestAnimationFrame(play); });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { start(); io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(svg);
  } else {
    start();
  }
})();
