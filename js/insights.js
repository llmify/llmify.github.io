// ========== INSIGHTS RENDERING ==========

var categoryLabels = {
  'ai-sovereignty': { de: 'KI-Souveränität', fr: 'Souveraineté IA', it: 'Sovranità IA', en: 'AI Sovereignty' },
  'open-source': { de: 'Open Source', fr: 'Open Source', it: 'Open Source', en: 'Open Source' }
};

var insightsI18n = {
  read_more: { de: 'Weiterlesen', fr: 'Lire la suite', it: 'Leggi di più', en: 'Read more' },
  all_insights: { de: 'Alle Insights', fr: 'Tous les insights', it: 'Tutti gli insights', en: 'All insights' },
  back: { de: 'Alle Insights', fr: 'Tous les insights', it: 'Tutti gli insights', en: 'All insights' },
  prev: { de: 'Vorheriger Artikel', fr: 'Article précédent', it: 'Articolo precedente', en: 'Previous article' },
  next: { de: 'Nächster Artikel', fr: 'Article suivant', it: 'Prossimo articolo', en: 'Next article' }
};

function formatDate(dateStr, lang) {
  var d = new Date(dateStr + 'T00:00:00');
  var localeMap = { de: 'de-CH', fr: 'fr-CH', it: 'it-CH', en: 'en-GB' };
  return d.toLocaleDateString(localeMap[lang] || 'de-CH', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryLabel(category, lang) {
  var cat = categoryLabels[category];
  return cat ? (cat[lang] || cat.de) : category;
}

function getCategoryColor(category) {
  return category === 'open-source' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-brand-dark';
}

function renderArticleCard(article, lang, basePath) {
  basePath = basePath || '/insights/';
  var title = article.title[lang] || article.title.de;
  var summary = article.summary[lang] || article.summary.de;
  var catLabel = getCategoryLabel(article.category, lang);
  var catColor = getCategoryColor(article.category);
  var readMore = insightsI18n.read_more[lang] || insightsI18n.read_more.de;

  return '<a href="' + basePath + article.slug + '/" class="article-card block bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200">' +
    '<div class="flex items-center gap-3 mb-3">' +
      '<time class="text-xs text-gray-400" datetime="' + article.date + '">' + formatDate(article.date, lang) + '</time>' +
      '<span class="text-xs font-medium px-2 py-0.5 rounded-full ' + catColor + '">' + catLabel + '</span>' +
    '</div>' +
    '<h3 class="font-semibold text-[#1A1A1A] mb-2 leading-snug">' + title + '</h3>' +
    '<p class="text-sm text-gray-500 leading-relaxed mb-3">' + summary + '</p>' +
    '<span class="text-sm font-medium text-brand">' + readMore + ' &rarr;</span>' +
  '</a>';
}

// Teaser on landing page (3 latest)
function renderInsightsTeaser(lang) {
  var container = document.getElementById('insights-teaser-cards');
  if (!container) return;
  var latest = articles.slice(0, 3);
  container.innerHTML = latest.map(function(a) { return renderArticleCard(a, lang); }).join('');
}

// Full index page with filtering
var currentFilter = 'all';

function renderInsightsIndex(lang) {
  var container = document.getElementById('insights-index-cards');
  if (!container) return;
  var filtered = currentFilter === 'all' ? articles : articles.filter(function(a) { return a.category === currentFilter; });
  container.innerHTML = filtered.map(function(a) { return renderArticleCard(a, lang); }).join('');
}

// Filter click handlers
document.addEventListener('DOMContentLoaded', function() {
  var filters = document.querySelectorAll('.insights-filter');
  filters.forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = this.getAttribute('data-filter');
      filters.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      renderInsightsIndex(currentLang);
    });
  });
});

// Prev/Next navigation on article pages
function renderArticleNav(lang) {
  var navEl = document.getElementById('article-nav');
  if (!navEl) return;
  var slug = navEl.getAttribute('data-slug');
  var idx = -1;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].slug === slug) { idx = i; break; }
  }
  if (idx === -1) return;

  var prev = idx < articles.length - 1 ? articles[idx + 1] : null;
  var next = idx > 0 ? articles[idx - 1] : null;
  var prevLabel = insightsI18n.prev[lang] || insightsI18n.prev.de;
  var nextLabel = insightsI18n.next[lang] || insightsI18n.next.de;

  var html = '<div class="flex flex-col sm:flex-row gap-4">';
  if (prev) {
    html += '<a href="/insights/' + prev.slug + '/" class="flex-1 group block p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">' +
      '<span class="text-xs text-gray-400">&larr; ' + prevLabel + '</span>' +
      '<p class="font-medium text-sm mt-1 group-hover:text-brand transition-colors">' + (prev.title[lang] || prev.title.de) + '</p>' +
    '</a>';
  } else {
    html += '<div class="flex-1"></div>';
  }
  if (next) {
    html += '<a href="/insights/' + next.slug + '/" class="flex-1 group block p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-right">' +
      '<span class="text-xs text-gray-400">' + nextLabel + ' &rarr;</span>' +
      '<p class="font-medium text-sm mt-1 group-hover:text-brand transition-colors">' + (next.title[lang] || next.title.de) + '</p>' +
    '</a>';
  }
  html += '</div>';
  navEl.innerHTML = html;
}

function renderInsights(lang) {
  renderInsightsTeaser(lang);
  renderInsightsIndex(lang);
  renderArticleNav(lang);
}

// React to language changes
document.addEventListener('langchange', function() {
  renderInsights(currentLang);
});

// Initial render
document.addEventListener('DOMContentLoaded', function() {
  renderInsights(currentLang);
});
