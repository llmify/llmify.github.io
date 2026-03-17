# LLMify Website

Static website hosted on GitHub Pages at llmify.ch.

## Tech Stack

- HTML + Tailwind CSS + vanilla JavaScript
- No framework, no SSR — pure static files
- 4-language support (de/fr/it/en) via `js/translations.js`
- Hosted on GitHub Pages (deploys on push to `main`)

## Build

The build (`node build.js`) does two things:

1. **HTML includes** — expands `<!-- INCLUDE:name -->` markers with content from `_partials/{name}.html`. Idempotent (uses paired open/close markers, safe to re-run).
2. **Tailwind CSS** — compiles `css/src.css` → `css/styles.css` (minified).

```bash
npm run build    # Includes + Tailwind in one step
```

**You must run `npm run build` after changing any Tailwind classes** (in HTML, JS, or `_partials/` files), or after editing a partial. The build scans all HTML and JS files for used classes and outputs only those.

Shared HTML lives in `_partials/` (e.g. `footer.html`). To use a partial, add `<!-- INCLUDE:footer -->` in your HTML. If a new HTML file is added outside the current glob patterns, update `tailwind.config.js` content paths.

## Adding Articles

1. Create `insights/{slug}/index.html` (use an existing article as template)
2. Add entry to `js/articles.js`
3. Update `sitemap.xml` and `llms.txt`
4. Run `npm run build`

Article tone: follow the style guide at `/Users/flaessig/Documents/repos/post-scheduler/scripts/style-guide.md`. Use "Sie" (formal), no emdashes, no LinkedIn-style fragments, concrete with sources.
