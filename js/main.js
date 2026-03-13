// ========== i18n ENGINE ==========
var currentLang = 'de';

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('llmify-lang', lang);

  var langMap = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en' };
  document.documentElement.lang = langMap[lang] || lang;

  document.getElementById('lang-current').textContent = lang.toUpperCase();

  document.querySelectorAll('.lang-option').forEach(function(opt) {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
  });

  var t = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  document.getElementById('lang-dropdown').classList.remove('open');
}

// ========== COOKIE BANNER ==========
function showCookieBanner() {
  document.getElementById('cookie-banner').style.display = 'block';
}

function hideCookieBanner() {
  document.getElementById('cookie-banner').style.display = 'none';
}

function acceptCookies() {
  localStorage.setItem('llmify-cookies', 'accepted');
  hideCookieBanner();
}

function declineCookies() {
  localStorage.setItem('llmify-cookies', 'declined');
  hideCookieBanner();
}

// ========== MODALS ==========
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m) {
      m.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

// ========== LANGUAGE DROPDOWN ==========
document.getElementById('lang-toggle').addEventListener('click', function(e) {
  e.stopPropagation();
  document.getElementById('lang-dropdown').classList.toggle('open');
});

document.querySelectorAll('.lang-option').forEach(function(opt) {
  opt.addEventListener('click', function() {
    setLanguage(this.getAttribute('data-lang'));
  });
});

document.addEventListener('click', function() {
  document.getElementById('lang-dropdown').classList.remove('open');
});

// ========== INIT ==========
(function() {
  var savedLang = localStorage.getItem('llmify-lang');
  if (savedLang && translations[savedLang]) {
    setLanguage(savedLang);
  } else {
    setLanguage('de');
  }

  var cookieChoice = localStorage.getItem('llmify-cookies');
  if (!cookieChoice) {
    showCookieBanner();
  }
})();

// ========== STACK SCROLL ANIMATION ==========
(function() {
  var section = document.getElementById('leistungen');
  var container = document.getElementById('stack-container');
  var rows = document.querySelectorAll('.stack-row');
  var minWidth = 448;  // max-w-md (28rem)
  var maxWidth = 576;  // max-w-xl (36rem)

  function updateStack() {
    var rect = section.getBoundingClientRect();
    var scrollRange = section.offsetHeight - window.innerHeight;
    var progress = Math.max(0, Math.min(1, -rect.top / scrollRange));

    // Phase 1: horizontal scaling (0–30% of scroll)
    var widthProgress = Math.max(0, Math.min(1, progress / 0.3));
    var currentWidth = minWidth + (maxWidth - minWidth) * widthProgress;
    container.style.maxWidth = currentWidth + 'px';

    // Phase 2: vertical row expansion (30–100% of scroll)
    var vertProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.7));
    rows.forEach(function(row, i) {
      var rowStart = i * 0.3;
      var rowEnd = rowStart + 0.3;
      var rowProgress = Math.max(0, Math.min(1, (vertProgress - rowStart) / (rowEnd - rowStart)));

      var detail = row.querySelector('.stack-detail');

      // Smooth detail expansion
      detail.style.maxHeight = (rowProgress * 200) + 'px';
      detail.style.opacity = Math.min(1, rowProgress * 2);
    });
  }

  window.addEventListener('scroll', updateStack, { passive: true });
  window.addEventListener('resize', updateStack);
  updateStack();
})();

// ========== APPROACH ARROW ==========
function drawArrow() {
  var container = document.getElementById('approach-container');
  if (!container) return;
  var cards = container.querySelectorAll('.rounded-xl');
  if (cards.length < 5) return;
  var r = container.getBoundingClientRect();
  function mid(el) {
    var b = el.getBoundingClientRect();
    return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, right: b.right - r.left, left: b.left - r.left };
  }
  var c = Array.from(cards).map(mid);
  var g = 50;
  var midY = (c[2].y + c[3].y) / 2;
  var halfDy = (c[3].y - c[2].y) / 4;
  var d = [
    'M ' + (c[0].left - g) + ',' + c[0].y,
    'L ' + (c[2].right + 8) + ',' + c[2].y,
    'A ' + halfDy + ',' + halfDy + ' 0 0 1 ' + (c[2].right + 8) + ',' + midY,
    'L ' + (c[3].left - 8) + ',' + midY,
    'A ' + halfDy + ',' + halfDy + ' 0 0 0 ' + (c[3].left - 8) + ',' + c[3].y,
    'L ' + (c[4].right + g) + ',' + c[4].y,
  ].join(' ');
  document.getElementById('arrow-path').setAttribute('d', d);
}
window.addEventListener('load', drawArrow);
window.addEventListener('resize', drawArrow);

// ========== NAV SCROLL HIGHLIGHT ==========
var navLinks = document.querySelectorAll('.nav-link');
var navSections = document.querySelectorAll('#start, #leistungen, #ansatz, #kontakt');
window.addEventListener('scroll', function() {
  var current = '';
  var atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
  if (atBottom) {
    current = 'kontakt';
  } else {
    navSections.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
  }
  navLinks.forEach(function(l) {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

