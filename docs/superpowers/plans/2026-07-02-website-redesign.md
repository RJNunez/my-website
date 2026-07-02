# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `toha` theme with a custom in-repo Hugo theme featuring an El Morro scroll-pan hero, unstructured.io-style visuals, a native blog (importing 3 Medium posts), and a Contact section — keeping the Hugo + Netlify stack and `data/en/**/*.yaml` content workflow.

**Architecture:** A custom Hugo theme lives at `themes/custom/`. `config.yaml` switches `theme` from `toha` to `custom`. The theme reads the existing `data/en/**` YAML unchanged so no content migration is needed for About/Projects/Experience/Teaching. A single-page `layouts/index.html` composes section partials; `/blog` uses Hugo's list/single templates over `content/blog/*.md`. The El Morro photo is a fixed full-viewport background panned by a small vanilla-JS scroll listener.

**Tech Stack:** Hugo (extended, pinned to Netlify's 0.77.0), Go HTML templates, vanilla CSS + JS, Google Fonts (Archivo, Archivo Expanded, JetBrains Mono), Font Awesome (already vendored by toha — we re-add via CDN).

**Verification model:** This is a static site with no unit-test harness. "Tests" = (a) `hugo` builds with zero errors, and (b) browser screenshot verification via the Playwright MCP against `hugo server`. Each task that changes rendering ends by building and visually confirming.

---

## File Structure

**New theme (created):**
- `themes/custom/theme.toml` — theme metadata
- `themes/custom/layouts/_default/baseof.html` — HTML skeleton, `<head>`, background layer, nav, footer
- `themes/custom/layouts/index.html` — single-page composition of sections
- `themes/custom/layouts/_default/list.html` — `/blog` index
- `themes/custom/layouts/_default/single.html` — individual blog post
- `themes/custom/layouts/partials/head.html` — meta, fonts, CSS links
- `themes/custom/layouts/partials/nav.html` — sticky top nav
- `themes/custom/layouts/partials/background.html` — fixed scroll-pan photo layer + scrim
- `themes/custom/layouts/partials/footer.html` — contact + auto-year copyright
- `themes/custom/layouts/partials/sections/hero.html`
- `themes/custom/layouts/partials/sections/about.html`
- `themes/custom/layouts/partials/sections/projects.html`
- `themes/custom/layouts/partials/sections/experience.html`
- `themes/custom/layouts/partials/sections/teaching.html`
- `themes/custom/layouts/partials/sections/blog.html` — "latest posts" teaser on the home page
- `themes/custom/layouts/partials/sections/contact.html`
- `themes/custom/static/css/main.css` — all styles (design tokens, sections, cards)
- `themes/custom/static/js/scroll-pan.js` — background pan + project filter
- `themes/custom/static/js/projects-filter.js` — All/Professional/Academic/Hobby filter

**Content (created):**
- `content/blog/_index.md` — blog section front matter
- `content/blog/estimating-sd-from-iqr.md`
- `content/blog/goat-conversation.md`
- `content/blog/goat-conversation-spanish.md`

**Modified:**
- `config.yaml` — `theme: custom`, remove Medium `customMenus` usage (moved to site.yaml), keep params
- `data/en/site.yaml` — repoint/remove Blog `customMenus` entry
- `content/post/` — leftover demo R Markdown post removed (or left; nav no longer links it)

**Untouched:** `data/<non-en>/**`, `netlify.toml`, `static/images/**`, `static/files/resume.pdf`.

---

## Task 1: Install Hugo pinned to Netlify's version

**Files:** none (environment setup)

- [ ] **Step 1: Check for Hugo**

Run: `hugo version 2>/dev/null || echo "NOT INSTALLED"`
Expected: `NOT INSTALLED` (or a version string — if `0.77.0`, skip to Task 2).

- [ ] **Step 2: Install Hugo extended 0.77.0 (matches netlify.toml HUGO_VERSION)**

Run (macOS, Homebrew tap for pinned version is unreliable; use the official release binary):
```bash
cd /tmp && curl -L -o hugo.tar.gz https://github.com/gohugoio/hugo/releases/download/v0.77.0/hugo_extended_0.77.0_macOS-64bit.tar.gz && tar xzf hugo.tar.gz hugo && mkdir -p ~/.local/bin && mv hugo ~/.local/bin/hugo && chmod +x ~/.local/bin/hugo
```

- [ ] **Step 3: Verify Hugo runs**

Run: `~/.local/bin/hugo version`
Expected: output contains `v0.77.0` and `extended`.

- [ ] **Step 4: Confirm the current (toha) site still builds as a baseline**

Run: `cd /Users/rolando.acosta/Desktop/my-website && ~/.local/bin/hugo --gc --minify --quiet && echo BUILD_OK`
Expected: `BUILD_OK` with no error output. This proves the toolchain works before we change anything.

- [ ] **Step 5: Commit (no code change; note baseline in message only if needed — skip if nothing to commit)**

No commit needed for environment-only setup.

---

## Task 2: Scaffold the custom theme and switch to it (blank page builds)

**Files:**
- Create: `themes/custom/theme.toml`
- Create: `themes/custom/layouts/_default/baseof.html`
- Create: `themes/custom/layouts/index.html`
- Modify: `config.yaml`

- [ ] **Step 1: Create theme metadata**

`themes/custom/theme.toml`:
```toml
name = "custom"
license = "MIT"
min_version = "0.55.0"
description = "Custom personal site theme for Rolando J. Acosta Nuñez"
```

- [ ] **Step 2: Create minimal baseof skeleton**

`themes/custom/layouts/_default/baseof.html`:
```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode | default "en" }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ .Site.Title }}</title>
</head>
<body>
  {{ block "main" . }}{{ end }}
</body>
</html>
```

- [ ] **Step 3: Create minimal index**

`themes/custom/layouts/index.html`:
```html
{{ define "main" }}
<h1>{{ .Site.Title }}</h1>
<p>Custom theme scaffold OK.</p>
{{ end }}
```

- [ ] **Step 4: Point config at the new theme**

In `config.yaml`, change:
```yaml
theme: "toha"
```
to:
```yaml
theme: "custom"
```

- [ ] **Step 5: Build and verify**

Run: `~/.local/bin/hugo --quiet && echo BUILD_OK`
Expected: `BUILD_OK`, no template errors.

- [ ] **Step 6: Serve and screenshot-verify the scaffold renders**

Run (background): `~/.local/bin/hugo server --port 1313 --disableFastRender`
Then navigate the Playwright MCP browser to `http://localhost:1313/` and confirm the page shows the site title and "Custom theme scaffold OK." Stop the server after.

- [ ] **Step 7: Commit**

```bash
git add themes/custom/theme.toml themes/custom/layouts config.yaml
git commit -m "Scaffold custom Hugo theme and switch config.theme to custom"
```

---

## Task 3: Design tokens + base CSS, fonts, head partial

**Files:**
- Create: `themes/custom/layouts/partials/head.html`
- Create: `themes/custom/static/css/main.css`
- Modify: `themes/custom/layouts/_default/baseof.html`

- [ ] **Step 1: Create the head partial (fonts + CSS + Font Awesome)**

`themes/custom/layouts/partials/head.html`:
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} · {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ .Site.Params.description | default .Site.Title }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700&family=Archivo+Expanded:wght@700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="{{ "css/main.css" | relURL }}">
```

- [ ] **Step 2: Create main.css with design tokens and base rules**

`themes/custom/static/css/main.css`:
```css
:root{
  --pink:#f4a6c0; --coral:#f6b48a; --sky:#a9cbe8; --sand:#e8d9b8; --lilac:#c5b8dd; --green:#bcd9c4;
  --ink:#0b0f14; --glass:rgba(15,20,28,.5); --line:rgba(255,255,255,.16);
  --wrap:1120px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'Archivo',sans-serif;-webkit-font-smoothing:antialiased;color:#fff;position:relative;background:var(--ink);}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 32px;}
.mono{font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.12em;font-size:11px;}
h1,h2,h3{font-family:'Archivo Expanded','Archivo',sans-serif;letter-spacing:-.02em;line-height:1;}
a{color:inherit;}
section{position:relative;z-index:1;padding:90px 0;}
.section-label{margin-bottom:14px;opacity:.75;}
```

- [ ] **Step 3: Wire head partial into baseof**

Replace the `<head>...</head>` block in `themes/custom/layouts/_default/baseof.html` with:
```html
<head>
  {{ partial "head.html" . }}
</head>
```

- [ ] **Step 4: Build and verify**

Run: `~/.local/bin/hugo --quiet && echo BUILD_OK`
Expected: `BUILD_OK`.

- [ ] **Step 5: Serve and screenshot-verify fonts/CSS load**

Serve as in Task 2 Step 6; confirm via Playwright that the page background is dark (`--ink`) and the heading uses the condensed font. Stop server.

- [ ] **Step 6: Commit**

```bash
git add themes/custom/layouts/partials/head.html themes/custom/static/css/main.css themes/custom/layouts/_default/baseof.html
git commit -m "Add design tokens, base CSS, fonts, and head partial"
```

---

## Task 4: Fixed El Morro scroll-pan background + scrim + JS

**Files:**
- Create: `themes/custom/layouts/partials/background.html`
- Create: `themes/custom/static/js/scroll-pan.js`
- Modify: `themes/custom/static/css/main.css`
- Modify: `themes/custom/layouts/_default/baseof.html`

- [ ] **Step 1: Create the background partial**

`themes/custom/layouts/partials/background.html`:
```html
<div class="bg" id="bg" style="background-image:url('{{ .Site.Params.background | default "/images/site/background.png" | relURL }}');"></div>
<div class="scrim"></div>
```

- [ ] **Step 2: Add background + scrim CSS to main.css**

Append to `themes/custom/static/css/main.css`:
```css
.bg{position:fixed;inset:0;z-index:-2;background-size:165% auto;background-position:center 0%;background-repeat:no-repeat;background-color:var(--ink);}
.scrim{position:fixed;inset:0;z-index:-1;background:linear-gradient(180deg,rgba(0,0,0,.10) 0%,rgba(0,0,0,.20) 50%,rgba(0,0,0,.45) 100%);}
```

- [ ] **Step 3: Create the pan script**

`themes/custom/static/js/scroll-pan.js`:
```javascript
(function () {
  var bg = document.getElementById('bg');
  if (!bg) return;
  function pan() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? (window.scrollY / max) : 0;
    bg.style.backgroundPosition = 'center ' + (p * 100).toFixed(2) + '%';
  }
  window.addEventListener('scroll', pan, { passive: true });
  window.addEventListener('resize', pan);
  pan();
})();
```

- [ ] **Step 4: Wire background + script into baseof**

In `themes/custom/layouts/_default/baseof.html`, update `<body>` to:
```html
<body>
  {{ partial "background.html" . }}
  {{ block "main" . }}{{ end }}
  <script src="{{ "js/scroll-pan.js" | relURL }}" defer></script>
</body>
```

- [ ] **Step 5: Add temporary tall content to test the pan**

Temporarily set `themes/custom/layouts/index.html` to:
```html
{{ define "main" }}
<div style="height:300vh;padding:40px;">
  <h1 style="font-size:60px;">{{ .Site.Title }}</h1>
  <p>Scroll to test the pan.</p>
</div>
{{ end }}
```

- [ ] **Step 6: Build, serve, and screenshot-verify the pan at top/mid/bottom**

Build (`~/.local/bin/hugo --quiet && echo BUILD_OK`), serve, then in the Playwright MCP:
- Set viewport 1440×900.
- Scroll to top (instant), dispatch a `scroll` event, screenshot → expect clouds.
- Scroll to 50%, dispatch, screenshot → expect garita.
- Scroll to bottom, dispatch, screenshot → expect water.
Verify `getComputedStyle(document.getElementById('bg')).backgroundPosition` reads `50% 0%`, `~50% 50%`, `50% 100%` respectively. Stop server.

- [ ] **Step 7: Commit**

```bash
git add themes/custom/layouts/partials/background.html themes/custom/static/js/scroll-pan.js themes/custom/static/css/main.css themes/custom/layouts/_default/baseof.html themes/custom/layouts/index.html
git commit -m "Add fixed El Morro scroll-pan background with scrim and JS"
```

---

## Task 5: Nav + footer partials (sticky nav, auto-year copyright, contact)

**Files:**
- Create: `themes/custom/layouts/partials/nav.html`
- Create: `themes/custom/layouts/partials/footer.html`
- Modify: `themes/custom/layouts/_default/baseof.html`
- Modify: `themes/custom/static/css/main.css`

- [ ] **Step 1: Create nav partial**

`themes/custom/layouts/partials/nav.html`:
```html
<nav class="site-nav">
  <a class="brand" href="{{ "/" | relURL }}">{{ .Site.Title }}</a>
  <div class="links">
    <a href="{{ "/#about" | relURL }}">About</a>
    <a href="{{ "/#projects" | relURL }}">Projects</a>
    <a href="{{ "/#experience" | relURL }}">Experience</a>
    <a href="{{ "/#teaching" | relURL }}">Teaching</a>
    <a href="{{ "/blog/" | relURL }}">Blog</a>
    <a href="{{ "/#contact" | relURL }}">Contact</a>
  </div>
  <a class="cta" href="{{ "files/resume.pdf" | relURL }}">Curriculum Vitae</a>
</nav>
```

- [ ] **Step 2: Create footer partial with auto-year**

`themes/custom/layouts/partials/footer.html`:
```html
<footer class="site-footer">
  <div class="wrap">
    <span>© {{ now.Year }} Rolando J. Acosta Nuñez</span>
    <span class="mono">Built with Hugo · Deployed on Netlify</span>
  </div>
</footer>
```

- [ ] **Step 3: Add nav/footer CSS**

Append to `main.css`:
```css
.site-nav{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;position:sticky;top:0;z-index:10;background:rgba(20,25,35,.4);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);}
.site-nav .brand{font-weight:700;font-size:15px;}
.site-nav .links{display:flex;gap:24px;}
.site-nav .links a{color:rgba(255,255,255,.85);text-decoration:none;font-size:13px;}
.site-nav .links a:hover{color:#fff;}
.site-nav .cta{background:#fff;color:#111;padding:8px 16px;border-radius:6px;font-weight:600;font-size:13px;text-decoration:none;}
.site-footer{border-top:1px solid var(--line);padding:40px 0;background:rgba(10,14,20,.6);}
.site-footer .wrap{display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,.7);font-size:13px;}
```

- [ ] **Step 4: Wire nav + footer into baseof**

Update `<body>` in baseof to:
```html
<body>
  {{ partial "background.html" . }}
  {{ partial "nav.html" . }}
  {{ block "main" . }}{{ end }}
  {{ partial "footer.html" . }}
  <script src="{{ "js/scroll-pan.js" | relURL }}" defer></script>
</body>
```

- [ ] **Step 5: Build, serve, screenshot-verify**

Build + serve; via Playwright confirm the sticky nav shows all six links + CV button, and the footer shows the current year (2026). Stop server.

- [ ] **Step 6: Commit**

```bash
git add themes/custom/layouts/partials/nav.html themes/custom/layouts/partials/footer.html themes/custom/layouts/_default/baseof.html themes/custom/static/css/main.css
git commit -m "Add sticky nav and auto-year footer partials"
```

---

## Task 6: Hero section (headshot + tagline over clouds)

**Files:**
- Create: `themes/custom/layouts/partials/sections/hero.html`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/static/css/main.css`

The hero reads from `data/en/author.yaml` (`name`, `greeting`, `nickname`, `image`) and `data/en/sections/about.yaml` (`designation`, `company`).

- [ ] **Step 1: Create hero partial**

`themes/custom/layouts/partials/sections/hero.html`:
```html
{{ $author := index .Site.Data (.Site.Language.Lang) }}
{{ $author = $author.author }}
{{ $about := (index .Site.Data (.Site.Language.Lang)).sections.about }}
<section class="hero" id="home">
  <div class="hero-inner wrap">
    <img class="hero-photo" src="{{ (print "/" $author.image) | relURL }}" alt="{{ $author.name }}">
    <span class="tag mono">{{ $about.designation }} · Regeneron</span>
    <h1>{{ $author.greeting }} {{ $author.nickname }}.<br>I make data speak.</h1>
    <p class="sub">Manager Biostatistician at Regeneron — building novel digital endpoints for clinical trials, and estimating the human toll of natural disasters.</p>
    <div class="btns">
      <a class="btn-primary" href="{{ "/#projects" | relURL }}">View my work</a>
      <a class="btn-ghost" href="{{ "/#contact" | relURL }}">Get in touch</a>
    </div>
  </div>
</section>
```

Note: if the `index .Site.Data` accessor proves awkward in Hugo 0.77, fall back to `.Site.Data.en.author` and `.Site.Data.en.sections.about` (English-only is fine per spec). Verify which works in Step 4.

- [ ] **Step 2: Replace index.html body with the hero (drop the temp test content)**

`themes/custom/layouts/index.html`:
```html
{{ define "main" }}
{{ partial "sections/hero.html" . }}
{{ end }}
```

- [ ] **Step 3: Add hero CSS**

Append to `main.css`:
```css
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;}
.hero-inner{max-width:900px;display:flex;flex-direction:column;align-items:center;}
.hero-photo{width:132px;height:132px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.7);box-shadow:0 8px 40px rgba(0,0,0,.4);margin-bottom:28px;}
.hero .tag{display:inline-block;border:1px solid rgba(255,255,255,.55);border-radius:100px;padding:6px 14px;margin-bottom:22px;background:rgba(255,255,255,.14);backdrop-filter:blur(4px);}
.hero h1{font-size:76px;font-weight:900;text-shadow:0 2px 40px rgba(0,0,0,.5);}
.hero .sub{font-size:19px;margin:22px auto 0;max-width:560px;font-weight:600;text-shadow:0 1px 20px rgba(0,0,0,.6);}
.hero .btns{margin-top:34px;display:flex;gap:14px;}
.btn-primary{background:#fff;color:#111;padding:13px 24px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;}
.btn-ghost{border:1px solid rgba(255,255,255,.6);color:#fff;padding:13px 24px;border-radius:8px;font-weight:600;font-size:14px;text-decoration:none;background:rgba(255,255,255,.12);backdrop-filter:blur(4px);}
@media(max-width:700px){.hero h1{font-size:48px;}}
```

- [ ] **Step 4: Build and verify data accessor works**

Run: `~/.local/bin/hugo --quiet && echo BUILD_OK`
Expected: `BUILD_OK`. If it errors on the data accessor, switch to the `.Site.Data.en.*` fallback noted in Step 1 and rebuild.

- [ ] **Step 5: Serve and screenshot-verify**

Serve; via Playwright confirm the hero shows the round headshot, the tag, the big headline over clouds, and both buttons. Stop server.

- [ ] **Step 6: Commit**

```bash
git add themes/custom/layouts/partials/sections/hero.html themes/custom/layouts/index.html themes/custom/static/css/main.css
git commit -m "Add hero section with headshot over clouds"
```

---

## Task 7: About section (bio + fast-facts card + interest chips)

**Files:**
- Create: `themes/custom/layouts/partials/sections/about.html`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/static/css/main.css`

Reads `data/en/sections/about.yaml`: `summary` (Markdown), `softSkills` (used as interest chips), `designation`, `company`.

- [ ] **Step 1: Create about partial**

`themes/custom/layouts/partials/sections/about.html`:
```html
{{ $about := (index .Site.Data (.Site.Language.Lang)).sections.about }}
<section class="about" id="about">
  <div class="wrap about-grid">
    <div>
      <div class="section-label mono">/ About</div>
      <h2 class="about-title">Statistics for medicine, public health &amp; society.</h2>
      <div class="about-body">{{ $about.summary | markdownify }}</div>
      <div class="chips">
        {{ $palette := slice "c1" "c2" "c3" "c4" "c5" "c6" }}
        {{ range $i, $s := $about.softSkills }}
          <span class="chip {{ index $palette (mod $i 6) }}">{{ $s.name }}</span>
        {{ end }}
      </div>
    </div>
    <div class="glass facts">
      <div class="section-label mono">Fast facts</div>
      <div class="row"><span>Role</span><span>{{ $about.designation }}</span></div>
      <div class="row"><span>Company</span><span>{{ $about.company.name }}</span></div>
      <div class="row"><span>PhD</span><span>Harvard University</span></div>
      <div class="row"><span>Based in</span><span>Cambridge, MA</span></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add about to index**

`themes/custom/layouts/index.html`:
```html
{{ define "main" }}
{{ partial "sections/hero.html" . }}
{{ partial "sections/about.html" . }}
{{ end }}
```

- [ ] **Step 3: Add about + chip + glass CSS**

Append to `main.css`:
```css
.glass{background:var(--glass);backdrop-filter:blur(10px);border:1px solid var(--line);border-radius:16px;padding:28px;}
.about-grid{display:grid;grid-template-columns:1.4fr 1fr;gap:48px;align-items:start;}
.about-title{font-size:40px;font-weight:800;margin-bottom:20px;}
.about-body{font-size:16px;line-height:1.7;color:#e8ecf0;}
.about-body a{color:var(--sky);text-decoration:underline;}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;}
.chip{font-family:'JetBrains Mono',monospace;font-size:12px;padding:8px 13px;border-radius:7px;font-weight:500;color:#2a2a2a;}
.chip.c1{background:var(--pink);}.chip.c2{background:var(--coral);}.chip.c3{background:var(--sky);}
.chip.c4{background:var(--sand);}.chip.c5{background:var(--lilac);}.chip.c6{background:var(--green);}
.facts .row{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--line);font-size:14px;}
.facts .row:last-child{border-bottom:none;}
.facts .row span:first-child{opacity:.6;}.facts .row span:last-child{font-weight:700;}
@media(max-width:800px){.about-grid{grid-template-columns:1fr;}}
```

- [ ] **Step 4: Build, serve, screenshot-verify**

Build + serve; confirm the About section shows the bio (with working links), the six interest chips in pastel colors, and the fast-facts glass card. Stop server.

- [ ] **Step 5: Commit**

```bash
git add themes/custom/layouts/partials/sections/about.html themes/custom/layouts/index.html themes/custom/static/css/main.css
git commit -m "Add About section with bio, chips, and fast-facts card"
```

---

## Task 8: Projects section (accent-barred glass cards + filter)

**Files:**
- Create: `themes/custom/layouts/partials/sections/projects.html`
- Create: `themes/custom/static/js/projects-filter.js`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/layouts/_default/baseof.html`
- Modify: `themes/custom/static/css/main.css`

Reads `data/en/sections/projects.yaml`: `buttons` (filters), `projects` (each has `name`, `role`, `timeline`, `url`/`repo`, `summary`, `tags`).

- [ ] **Step 1: Create projects partial**

`themes/custom/layouts/partials/sections/projects.html`:
```html
{{ $p := (index .Site.Data (.Site.Language.Lang)).sections.projects }}
<section class="projects" id="projects">
  <div class="wrap">
    <div class="section-label mono">/ Selected projects</div>
    <h2 class="sec-title">{{ $p.section.name }}</h2>
    <div class="filters">
      {{ range $p.buttons }}
        <button class="filter-btn{{ if eq .filter "all" }} active{{ end }}" data-filter="{{ .filter }}">{{ .name }}</button>
      {{ end }}
    </div>
    <div class="grid3" id="project-grid">
      {{ $bars := slice "var(--pink)" "var(--sky)" "var(--coral)" "var(--sand)" "var(--lilac)" "var(--green)" }}
      {{ range $i, $proj := $p.projects }}
        {{ $link := $proj.url }}{{ if $proj.repo }}{{ $link = $proj.repo }}{{ end }}
        <a class="pcard glass" href="{{ $link }}" target="_blank" rel="noopener" data-tags="{{ delimit $proj.tags " " }}">
          <div class="bar" style="background:{{ index $bars (mod $i 6) }};"></div>
          <div class="k mono">{{ $proj.role }} · {{ $proj.timeline }}</div>
          <h3>{{ $proj.name }}</h3>
          <p>{{ $proj.summary | truncate 180 }}</p>
        </a>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create the filter script**

`themes/custom/static/js/projects-filter.js`:
```javascript
(function () {
  var btns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('#project-grid .pcard');
  if (!btns.length) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) {
        var tags = (c.getAttribute('data-tags') || '').split(' ');
        c.style.display = (f === 'all' || tags.indexOf(f) !== -1) ? '' : 'none';
      });
    });
  });
})();
```

- [ ] **Step 3: Load the filter script in baseof**

In `themes/custom/layouts/_default/baseof.html`, add before `</body>` (after the scroll-pan script line):
```html
  <script src="{{ "js/projects-filter.js" | relURL }}" defer></script>
```

- [ ] **Step 4: Add projects to index**

Update `index.html` to add `{{ partial "sections/projects.html" . }}` after the about partial line.

- [ ] **Step 5: Add projects CSS**

Append to `main.css`:
```css
.sec-title{font-size:40px;font-weight:800;margin-bottom:26px;text-shadow:0 2px 30px rgba(0,0,0,.5);}
.filters{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
.filter-btn{font-family:'JetBrains Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:.08em;padding:8px 14px;border-radius:7px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:#fff;cursor:pointer;}
.filter-btn.active{background:#fff;color:#111;}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.pcard{display:block;padding:22px;text-decoration:none;color:#fff;transition:transform .15s ease;}
.pcard:hover{transform:translateY(-3px);}
.pcard .bar{height:4px;border-radius:3px;margin-bottom:16px;width:46px;}
.pcard .k{font-size:11px;color:#bcd0e4;margin-bottom:8px;}
.pcard h3{font-size:18px;font-weight:700;margin-bottom:8px;font-family:'Archivo',sans-serif;letter-spacing:normal;}
.pcard p{font-size:13.5px;color:#cdd8e4;line-height:1.5;}
@media(max-width:900px){.grid3{grid-template-columns:1fr;}}
```

- [ ] **Step 6: Build, serve, screenshot-verify (including filter click)**

Build + serve; via Playwright confirm all project cards render with accent bars, then click the "Hobby" filter and confirm only hobby-tagged cards remain visible. Stop server.

- [ ] **Step 7: Commit**

```bash
git add themes/custom/layouts/partials/sections/projects.html themes/custom/static/js/projects-filter.js themes/custom/layouts/index.html themes/custom/layouts/_default/baseof.html themes/custom/static/css/main.css
git commit -m "Add Projects section with accent cards and category filter"
```

---

## Task 9: Experience section (numbered timeline)

**Files:**
- Create: `themes/custom/layouts/partials/sections/experience.html`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/static/css/main.css`

Reads `data/en/sections/experiences.yaml`: `experiences[]` each with `company{name,url,location,overview}` and `positions[]{designation,start,end,responsibilities[]}`.

- [ ] **Step 1: Create experience partial**

`themes/custom/layouts/partials/sections/experience.html`:
```html
{{ $e := (index .Site.Data (.Site.Language.Lang)).sections.experiences }}
<section class="experience" id="experience">
  <div class="wrap">
    <div class="section-label mono">/ Experience</div>
    <h2 class="sec-title">Where I've worked.</h2>
    <div class="timeline">
      {{ range $i, $x := $e.experiences }}
        <div class="xitem glass">
          <div class="xnum">{{ add $i 1 }}</div>
          <div class="xbody">
            {{ range $x.positions }}
              <h3>{{ .designation }}</h3>
              <div class="xco"><a href="{{ $x.company.url }}" target="_blank" rel="noopener">{{ $x.company.name }}</a></div>
              <div class="xmeta mono">{{ .start }} – {{ .end | default "Present" }}{{ if $x.company.location }} · {{ $x.company.location }}{{ end }}</div>
              <ul>{{ range .responsibilities }}<li>{{ . }}</li>{{ end }}</ul>
            {{ end }}
          </div>
        </div>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add experience to index** (add partial line after projects).

- [ ] **Step 3: Add experience CSS**

Append to `main.css`:
```css
.timeline{display:flex;flex-direction:column;gap:16px;}
.xitem{display:flex;gap:20px;padding:26px;}
.xnum{font-family:'Archivo Expanded',sans-serif;font-weight:900;font-size:28px;color:var(--pink);min-width:44px;}
.xbody h3{font-size:20px;font-weight:800;font-family:'Archivo',sans-serif;letter-spacing:normal;}
.xco{margin:4px 0;}.xco a{color:var(--sky);text-decoration:none;font-weight:600;}
.xmeta{color:#bcd0e4;margin-bottom:12px;}
.xbody ul{margin-left:18px;color:#dbe3ec;font-size:14px;line-height:1.6;}
```

- [ ] **Step 4: Build, serve, screenshot-verify** the numbered timeline (1–8) renders with all companies. Stop server.

- [ ] **Step 5: Commit**

```bash
git add themes/custom/layouts/partials/sections/experience.html themes/custom/layouts/index.html themes/custom/static/css/main.css
git commit -m "Add Experience timeline section"
```

---

## Task 10: Teaching section

**Files:**
- Create: `themes/custom/layouts/partials/sections/teaching.html`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/static/css/main.css`

Reads `data/en/sections/skills.yaml`: `skills[]{name,summary(Markdown),url}`.

- [ ] **Step 1: Create teaching partial**

`themes/custom/layouts/partials/sections/teaching.html`:
```html
{{ $t := (index .Site.Data (.Site.Language.Lang)).sections.skills }}
<section class="teaching" id="teaching">
  <div class="wrap">
    <div class="section-label mono">/ Teaching</div>
    <h2 class="sec-title">{{ $t.section.name }}</h2>
    <div class="grid2">
      {{ range $t.skills }}
        <a class="tcard glass" href="{{ .url }}" target="_blank" rel="noopener">
          <h3>{{ .name }}</h3>
          <div class="tsum">{{ .summary | markdownify }}</div>
        </a>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add teaching to index** (partial line after experience).

- [ ] **Step 3: Add teaching CSS**

Append to `main.css`:
```css
.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;}
.tcard{display:block;padding:24px;text-decoration:none;color:#fff;transition:transform .15s ease;}
.tcard:hover{transform:translateY(-3px);}
.tcard h3{font-size:17px;font-weight:800;font-family:'Archivo',sans-serif;letter-spacing:normal;margin-bottom:10px;}
.tsum{font-size:14px;color:#dbe3ec;line-height:1.55;}
.tsum em{color:var(--sand);}
@media(max-width:800px){.grid2{grid-template-columns:1fr;}}
```

- [ ] **Step 4: Build, serve, screenshot-verify** five teaching cards render with formatted summaries. Stop server.

- [ ] **Step 5: Commit**

```bash
git add themes/custom/layouts/partials/sections/teaching.html themes/custom/layouts/index.html themes/custom/static/css/main.css
git commit -m "Add Teaching section"
```

---

## Task 11: Contact section + home blog teaser

**Files:**
- Create: `themes/custom/layouts/partials/sections/contact.html`
- Create: `themes/custom/layouts/partials/sections/blog.html`
- Modify: `themes/custom/layouts/index.html`
- Modify: `themes/custom/static/css/main.css`

Contact reads `data/en/sections/about.yaml` `socialLinks[]{name,icon,url}`. Blog teaser reads the three newest pages under `content/blog/` (created in Task 12 — this task renders zero cards until then, which is fine; verify after Task 12).

- [ ] **Step 1: Create contact partial**

`themes/custom/layouts/partials/sections/contact.html`:
```html
{{ $about := (index .Site.Data (.Site.Language.Lang)).sections.about }}
<section class="contact" id="contact">
  <div class="wrap contact-inner">
    <div class="section-label mono">/ Contact</div>
    <h2 class="sec-title">Let's talk.</h2>
    <p class="contact-sub">Reach me by email or find me online.</p>
    <div class="social">
      {{ range $about.socialLinks }}
        {{ $href := .url }}{{ if eq .name "Email" }}{{ $href = print "mailto:" .url }}{{ end }}
        <a href="{{ $href }}" target="_blank" rel="noopener" aria-label="{{ .name }}"><i class="{{ .icon }}"></i> {{ .name }}</a>
      {{ end }}
    </div>
    <a class="btn-primary" href="{{ "files/resume.pdf" | relURL }}" style="margin-top:24px;">Download CV</a>
  </div>
</section>
```

- [ ] **Step 2: Create home blog teaser partial**

`themes/custom/layouts/partials/sections/blog.html`:
```html
{{ $posts := where .Site.RegularPages "Section" "blog" }}
<section class="blogteaser" id="blog-teaser">
  <div class="wrap">
    <div class="section-label mono">/ Blog</div>
    <h2 class="sec-title">Latest writing.</h2>
    <div class="grid3">
      {{ range first 3 $posts.ByDate.Reverse }}
        <a class="pcard glass" href="{{ .RelPermalink }}">
          <div class="bar" style="background:var(--lilac);"></div>
          <div class="k mono">{{ .Date.Format "Jan 2, 2006" }}</div>
          <h3>{{ .Title }}</h3>
          <p>{{ .Summary | truncate 160 }}</p>
        </a>
      {{ end }}
    </div>
    <a class="btn-ghost" href="{{ "/blog/" | relURL }}" style="margin-top:24px;display:inline-block;">All posts →</a>
  </div>
</section>
```

- [ ] **Step 3: Add contact + blog teaser to index**

Final `index.html`:
```html
{{ define "main" }}
{{ partial "sections/hero.html" . }}
{{ partial "sections/about.html" . }}
{{ partial "sections/projects.html" . }}
{{ partial "sections/experience.html" . }}
{{ partial "sections/teaching.html" . }}
{{ partial "sections/blog.html" . }}
{{ partial "sections/contact.html" . }}
{{ end }}
```

- [ ] **Step 4: Add contact CSS**

Append to `main.css`:
```css
.contact-inner{text-align:center;}
.contact-sub{color:#dbe3ec;margin-bottom:22px;}
.social{display:flex;gap:22px;justify-content:center;flex-wrap:wrap;}
.social a{color:#fff;text-decoration:none;font-size:15px;font-weight:600;}
.social a:hover{color:var(--sky);}
.social i{margin-right:6px;}
```

- [ ] **Step 5: Build, serve, screenshot-verify** the Contact section shows all four social links + Download CV. (Blog teaser will be empty until Task 12.) Stop server.

- [ ] **Step 6: Commit**

```bash
git add themes/custom/layouts/partials/sections/contact.html themes/custom/layouts/partials/sections/blog.html themes/custom/layouts/index.html themes/custom/static/css/main.css
git commit -m "Add Contact section and home blog teaser"
```

---

## Task 12: Native blog — content + list/single templates + import Medium posts

**Files:**
- Create: `content/blog/_index.md`
- Create: `content/blog/estimating-sd-from-iqr.md`
- Create: `content/blog/goat-conversation.md`
- Create: `content/blog/goat-conversation-spanish.md`
- Create: `themes/custom/layouts/_default/list.html`
- Create: `themes/custom/layouts/_default/single.html`
- Modify: `themes/custom/static/css/main.css`
- Modify: `data/en/site.yaml` (remove Medium `customMenus` Blog entry)

- [ ] **Step 1: Create blog section index**

`content/blog/_index.md`:
```markdown
---
title: "Blog"
---
```

- [ ] **Step 2: Fetch full text of the 3 Medium posts**

Use WebFetch on each Medium post URL (reachable from `https://medium.com/@rolando.j123`) to retrieve the article body, then convert to Markdown. If a post body cannot be fetched (Medium paywall/JS), create the post with the title, date, canonical link to Medium, and a 1–2 sentence summary, and note inline that the body needs manual paste. Do NOT invent article content.

- [ ] **Step 3: Create the 2025 post**

`content/blog/estimating-sd-from-iqr.md`:
```markdown
---
title: "Estimating the SD from the IQR"
date: 2025-05-25
summary: "A short note on deriving a standard deviation estimate from the interquartile range."
canonical: "https://medium.com/@rolando.j123"
tags: ["statistics"]
---

<!-- Imported from Medium. Body text goes here (from Step 2 fetch). -->
```

- [ ] **Step 4: Create the English GOAT post**

`content/blog/goat-conversation.md`:
```markdown
---
title: "A Data Approach to the G.O.A.T Conversation"
date: 2019-06-14
summary: "Examining the greatest-player debate through statistical analysis."
canonical: "https://medium.com/@rolando.j123"
tags: ["data science", "sports"]
---

<!-- Imported from Medium. Body text goes here (from Step 2 fetch). -->
```

- [ ] **Step 5: Create the Spanish GOAT post**

`content/blog/goat-conversation-spanish.md`:
```markdown
---
title: "A Data Approach to the G.O.A.T Conversation (Spanish Version)"
date: 2019-06-25
summary: "Versión en español: el debate del mejor jugador a través del análisis de datos."
canonical: "https://medium.com/@rolando.j123"
tags: ["data science", "sports", "español"]
---

<!-- Imported from Medium. Body text goes here (from Step 2 fetch). -->
```

- [ ] **Step 6: Create the blog list template**

`themes/custom/layouts/_default/list.html`:
```html
{{ define "main" }}
<section class="blog-list">
  <div class="wrap">
    <div class="section-label mono">/ Blog</div>
    <h1 class="sec-title">{{ .Title }}</h1>
    <div class="grid3">
      {{ range .Pages.ByDate.Reverse }}
        <a class="pcard glass" href="{{ .RelPermalink }}">
          <div class="bar" style="background:var(--lilac);"></div>
          <div class="k mono">{{ .Date.Format "Jan 2, 2006" }}</div>
          <h3>{{ .Title }}</h3>
          <p>{{ .Summary | truncate 160 }}</p>
        </a>
      {{ end }}
    </div>
  </div>
</section>
{{ end }}
```

- [ ] **Step 7: Create the single post template**

`themes/custom/layouts/_default/single.html`:
```html
{{ define "main" }}
<article class="post">
  <div class="wrap wrap-narrow">
    <a class="back mono" href="{{ "/blog/" | relURL }}">← All posts</a>
    <h1 class="post-title">{{ .Title }}</h1>
    <div class="post-meta mono">{{ .Date.Format "January 2, 2006" }}</div>
    <div class="post-body">{{ .Content }}</div>
    {{ with .Params.canonical }}<p class="post-canonical">Originally published on <a href="{{ . }}" target="_blank" rel="noopener">Medium</a>.</p>{{ end }}
  </div>
</article>
{{ end }}
```

- [ ] **Step 8: Add blog CSS**

Append to `main.css`:
```css
.blog-list,.post{padding-top:120px;}
.wrap-narrow{max-width:720px;}
.back{color:var(--sky);text-decoration:none;display:inline-block;margin-bottom:20px;}
.post-title{font-size:44px;font-weight:900;margin-bottom:10px;}
.post-meta{color:#bcd0e4;margin-bottom:30px;}
.post-body{font-size:17px;line-height:1.75;color:#e8ecf0;}
.post-body h2{font-size:28px;margin:30px 0 14px;}
.post-body p{margin-bottom:18px;}
.post-body a{color:var(--sky);text-decoration:underline;}
.post-canonical{margin-top:40px;color:#aebccb;font-size:14px;}
```

- [ ] **Step 9: Remove the Medium Blog entry from site.yaml**

In `data/en/site.yaml`, delete the `customMenus` Blog block:
```yaml
customMenus:
- name: Blog
  url: https://medium.com/@rolando.j123
```
(The nav now links to `/blog/` directly via the nav partial.)

- [ ] **Step 10: Remove the leftover demo post**

Run: `git rm -r content/post`
(Its `/posts` route is no longer linked; the native `/blog` replaces it.)

- [ ] **Step 11: Build, serve, screenshot-verify**

Build + serve; via Playwright:
- Navigate to `/blog/` → confirm 3 post cards (newest first: SD-from-IQR 2025, then Spanish GOAT, then EN GOAT).
- Click one → confirm the single-post page renders with title, date, body, and the "Originally published on Medium" line.
- Return home → confirm the home blog teaser now shows 3 cards.
Stop server.

- [ ] **Step 12: Commit**

```bash
git add content/blog themes/custom/layouts/_default/list.html themes/custom/layouts/_default/single.html themes/custom/static/css/main.css data/en/site.yaml
git rm -r --cached content/post 2>/dev/null; git add -A content/post 2>/dev/null
git commit -m "Add native blog with list/single templates and imported Medium posts"
```

---

## Task 13: Full-page verification, responsive check, and cleanup

**Files:**
- Modify: `config.yaml` (clean up toha-specific params if any cause warnings)
- Possibly modify: `themes/custom/static/css/main.css` (fixes found during review)

- [ ] **Step 1: Full production build with minify (matches Netlify)**

Run: `~/.local/bin/hugo --gc --minify 2>&1 | tee /tmp/build.log; echo "EXIT=${PIPESTATUS[0]}"`
Expected: `EXIT=0`, and no `ERROR`/`WARN` lines about missing layouts. Inspect `/tmp/build.log`.

- [ ] **Step 2: Serve the built site and do a full top-to-bottom screenshot pass**

Serve; via Playwright at 1440×900, screenshot the full page (`fullPage:true`) and confirm in order: hero (headshot/clouds) → about → projects → experience → teaching → blog teaser → contact → footer (year 2026). Confirm the El Morro pan still travels clouds→garita→water across the now-longer page.

- [ ] **Step 3: Mobile responsive check**

Resize Playwright viewport to 390×844; screenshot the full page. Confirm the nav, hero headline, and all grids collapse to single-column without overflow. Fix any overflow in `main.css` if found, then rebuild.

- [ ] **Step 4: Verify internal anchor nav works**

Via Playwright, click each nav link (About, Projects, Experience, Teaching, Contact) and confirm the page scrolls to the matching section; click Blog and confirm navigation to `/blog/`.

- [ ] **Step 5: Confirm the CV link resolves**

Via Playwright, confirm the nav CV button points to a URL ending `/files/resume.pdf` and that requesting it returns HTTP 200 (the existing PDF).

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "Final verification pass: responsive fixes and cleanup"
```

- [ ] **Step 7: Report deploy readiness**

Confirm to the user: production build is clean, all sections verified in-browser, blog live at `/blog/`, and the site is ready to push for Netlify deploy. Do NOT push without explicit user approval.

---

## Self-Review Notes

- **Spec coverage:** Approach/stack (T2), scroll-pan (T4), typography/palette (T3,T7), all 6+ sections (T6–T11), native blog + Medium import (T12), Contact (T11), headshot in hero (T6), CV as-is (T5,T13), auto-year footer (T5). ✓
- **Hugo data accessor risk:** `index .Site.Data (.Site.Language.Lang)` is used consistently; T6 Step 4 provides the `.Site.Data.en.*` fallback and instructs verifying which works before proceeding — apply the same choice to all section partials.
- **Type/name consistency:** `#project-grid`, `.pcard`, `data-tags`, `.filter-btn[data-filter]` match between the projects partial (T8 S1) and filter JS (T8 S2). `.glass`, `.grid3`, `.bar`, `.k`, `.sec-title`, `.section-label` are defined once and reused. ✓
- **Content integrity:** T12 S2 forbids inventing post bodies; if fetch fails, posts carry title/date/canonical/summary and a marker for manual paste.

