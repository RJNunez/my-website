# Website Redesign — Design Spec

**Date:** 2026-07-02
**Owner:** Rolando J. Acosta Nuñez
**Status:** Approved (pending spec review)

## Goal

Redesign the personal website (`rjacosta.netlify.app`) with a modern, distinctive
look inspired by [unstructured.io](https://www.unstructured.io/), while keeping the
existing Hugo + Netlify stack and YAML-driven content workflow. Add a proper native
blog and a Contact section. Refresh content section-by-section after the new structure
is in place.

## Approach & Stack

- **Keep Hugo + Netlify.** Remove the `toha` theme; build a custom single-page theme
  in-repo. Netlify build command (`hugo --gc --minify`) is unchanged.
- **Content stays in `data/en/**/*.yaml`** (existing workflow). English only is active.
- **Why not a new stack:** the target look needs no framework change; staying on Hugo
  preserves the deploy + editing workflow.

## Visual System

- **Signature element — El Morro scroll-pan:** the existing Puerto Rico background photo
  (`static/images/site/background.png` — El Morro garita at sunset) becomes a fixed,
  full-viewport layer behind all content. As the page scrolls, the background's vertical
  focal point pans from top (afternoon clouds) → middle (garita) → bottom (crashing water).
  - Mechanic (validated in browser): fixed `.bg` layer, `background-size` zoomed (~165%)
    so the image is taller than the viewport, `background-position-y` driven from 0%→100%
    by a small scroll listener (`scrollY / (scrollHeight - innerHeight)`).
  - A gradient scrim darkens toward the bottom to keep text readable over busy water.
  - Robust to any page length because the background is viewport-fixed, not a fixed-height band.
- **Typography:** Archivo Expanded (bold condensed display headlines), Archivo (body),
  JetBrains Mono (uppercase micro-labels). Google Fonts.
- **Palette:** soft sunset pastels sampled from the photo — dusty pink `#f4a6c0`,
  coral `#f6b48a`, sky `#a9cbe8`, sand `#e8d9b8`, lilac `#c5b8dd` — as accents on chips,
  card bars, and dividers. Not the punchy neon of the reference site.
- **Content surfaces:** frosted-glass cards (translucent dark, backdrop blur) so the
  photo reads through the entire page.

## Page Structure

Single scrolling page; top nav anchors to each section.

1. **Hero** — name, tagline, primary CTA, **headshot** (`static/images/author/rolando3.JPG`),
   over the clouds portion of the background.
2. **About** — bio paragraph + "fast facts" card + interest chips.
3. **Projects** — papers/apps as accent-barred glass cards; retains the
   All / Professional / Academic / Hobby filter from the current site.
4. **Experience** — numbered timeline (Regeneron, DiMe, Google, C-CHANGE, etc.).
5. **Teaching** — courses/workshops taught.
6. **Blog** — new native section (see below).
7. **Contact** — email + social links (Twitter, GitHub, LinkedIn) + CV button.

## Native Blog

- Real Hugo blog at **`/blog`**: an index listing posts + individual styled post pages,
  both matching the new design.
- **Import the 3 existing Medium posts** as Markdown into `content/blog/`:
  1. "Estimating the SD from the IQR" (May 25, 2025)
  2. "A Data Approach to the G.O.A.T Conversation" (Jun 14, 2019)
  3. "A Data Approach to the G.O.A.T Conversation (Spanish Version)" (Jun 25, 2019)
- Nav "Blog" link points to `/blog` (not Medium). The leftover demo R Markdown post and
  the Medium `customMenus` entry are removed.
- Low-cadence friendly: complete-looking with 3 posts, zero upkeep between posts. Future
  posts are Markdown files added to `content/blog/`.

## Content Updates

Build the redesigned structure first with existing content ported in. Then the user
provides specific text/value edits section-by-section (About / Projects / Experience /
Teaching), editing against the new layout as rendered.

## Specific Decisions & Flags

- **Headshot in Hero** (user request): use `static/images/author/rolando3.JPG`.
- **CV button** → `/files/resume.pdf`. Current PDF is outdated but used as-is for now;
  user will supply an updated `resume.pdf` later (drop-in replacement, no code change).
- **Footer copyright** currently "© 2020"; make it auto-update to the current year.
- **Headshot & resume files confirmed present** in the repo.

## Out of Scope (for now)

- Multi-language support (only English is active; other `data/<lang>/` dirs untouched).
- New sections beyond Contact and the native Blog.
- Analytics / Disqus / newsletter (currently placeholder/disabled).

## Success Criteria

- Site builds with `hugo --gc --minify` and deploys on Netlify unchanged.
- Scroll-pan behaves as validated (clouds → garita → water) across desktop widths.
- All current sections present and restyled; Contact + native Blog added.
- 3 Medium posts live as native Markdown blog posts; nav Blog → `/blog`.
- Content editable via `data/en/**/*.yaml` and `content/blog/*.md`.
