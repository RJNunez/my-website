# CLAUDE.md

Personal academic/portfolio website for Rolando J. Acosta Nuñez (Manager Biostatistician at Regeneron). Single-page site built with Hugo, deployed on Netlify at https://rjacosta.netlify.app/.

## Stack

- **Hugo** (static site generator), extended, pinned to **v0.163.3** — must match `HUGO_VERSION` in `netlify.toml`.
- **Custom in-repo theme** at `themes/custom/` (set via `theme: "custom"` in `config.yaml`). The old `toha` theme still exists on disk but is unused — do not build against it (it references `_internal/*` templates removed in modern Hugo and won't build).
- Vanilla CSS + JS, Google Fonts (Archivo, Archivo Expanded, JetBrains Mono), Font Awesome + KaTeX via CDN.
- **Netlify** builds with `hugo --gc --minify` (see `netlify.toml`); deploys on push to `main`.

## Commands

```bash
hugo server --port 1313 --disableFastRender   # local preview at localhost:1313
hugo                                           # build (output to public/)
hugo --gc --minify                             # production build (matches Netlify)
```

There is no test suite. "Verification" = the build succeeds with zero errors/warnings, plus visual confirmation in a browser.

## Content vs. Presentation

Content and layout are strictly separated — **edit content in YAML, not templates**:

- **Section content** lives in `data/en/sections/*.yaml`:
  - `about.yaml` — bio `summary` (Markdown), `designation`, `company`, `socialLinks`, `softSkills` (rendered as interest chips)
  - `experiences.yaml` — job timeline (`company` + `positions[]` with `responsibilities[]`)
  - `projects.yaml` — publications/patents/software cards + filter `buttons`
  - `skills.yaml` — the Teaching section (course cards, `summary` is Markdown)
  - `achievements.yaml`, `recent-posts.yaml` — present but unused by the custom theme
- **Author/site info**: `data/en/author.yaml` (name, greeting, headshot `image`), `data/en/site.yaml`.
- Only the **English** (`data/en/`) content is active. Other `data/<lang>/` dirs exist from the theme scaffold but are unused.
- A few strings are hardcoded in partials rather than YAML: the **hero subtitle** and **About section header** (`themes/custom/layouts/partials/sections/hero.html` and `about.html`), and the fast-facts "PhD" / "Based in" rows.

## Theme Structure (`themes/custom/`)

- `layouts/_default/baseof.html` — page skeleton: `<head>` partial, fixed background layer, nav, `main` block, footer, scripts.
- `layouts/index.html` — composes the single page from section partials in order: hero → about → projects → experience → teaching → contact.
- `layouts/partials/` — `head.html`, `nav.html`, `background.html`, `footer.html`, and `sections/*.html`.
- `static/css/main.css` — all styles. Design tokens (sunset pastels: `--pink --coral --sky --sand --lilac --green`, dark `--ink`) live in `:root` at the top; append new rules at the end.
- `static/js/scroll-pan.js` — pans the fixed El Morro background image (`static/images/site/background.png`) vertically with scroll (clouds → garita → water). This is the site's signature effect.
- `static/js/projects-filter.js` — the Projects category filter (All / Publications / Patents / Software), matched via `data-tags` on each card.

## Conventions & Gotchas

- **Data accessor**: use `hugo.Data.en.*` in templates, NOT `.Site.Data.*` (deprecated in Hugo 0.156, emits a build warning). All section partials follow this.
- **CSS in inline `style=` from a template variable**: Go's `html/template` sanitizes CSS values to `ZgotmplZ`. Wrap with `safeCSS`, e.g. `style="{{ printf "background:%s;" $color | safeCSS }}"`. Used for the project/blog accent bars.
- **Config keys**: use `locale` (not `languageCode`) and `languages.en.label` (not `languageName`) — the old keys are deprecated.
- The **CV/resume** is served from `static/files/resume.pdf`; both the nav "Curriculum Vitae" and Contact "Download CV" link to it. Replace that file in place to update — no code change needed.
- **Footer year** auto-updates via `{{ now.Year }}`.
- The nav **"Blog"** link points to the external Medium profile (`https://medium.com/@rolando.j123`), opening in a new tab. There is no native blog on the site.
- `public/` is Hugo's build output and is gitignored; a few stale `public/*` files remain tracked from before — leave them, don't add more.

## Deploy

Push to `main` → Netlify auto-builds and deploys. The repo remote is HTTPS; pushing requires a GitHub Personal Access Token or SSH (password auth is disabled by GitHub).
