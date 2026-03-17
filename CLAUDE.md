# LLMify Website

Static website hosted on GitHub Pages at llmify.ch.

## Tech Stack

- HTML + Tailwind CSS + vanilla JavaScript
- No framework, no SSR — pure static files
- 4-language support (de/fr/it/en) via `js/translations.js`
- Hosted on GitHub Pages (deploys on push to `main`)

## Build

Tailwind CSS is compiled locally. The built CSS is committed to git.

```bash
npm run build    # Compiles css/src.css → css/styles.css (minified)
```

**You must run `npm run build` after changing any Tailwind classes** (in HTML or JS files), before committing. The build scans all HTML and JS files for used classes and outputs only those.

If a new HTML file is added outside the current glob patterns, update `tailwind.config.js` content paths.

## Adding Articles

1. Create `insights/{slug}/index.html` (use an existing article as template)
2. Add entry to `js/articles.js`
3. Update `sitemap.xml` and `llms.txt`
4. Run `npm run build`

Article tone: follow the style guide at `/Users/flaessig/Documents/repos/post-scheduler/scripts/style-guide.md`. Use "Sie" (formal), no emdashes, no LinkedIn-style fragments, concrete with sources.
