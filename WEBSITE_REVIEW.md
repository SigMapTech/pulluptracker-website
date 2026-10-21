# Website review: pulluptracker.app

Reviewed 2026-10-20 against `main` at `b4d5293`; the live site matched that checkout at review time.
Status updated 2026-10-21 against branch `website-reliability-a11y-fixes` at `c056ea1`, which implements
packages A–D of `WEBSITE_IMPROVEMENTS_SPEC.md`. Fix status was checked by reading that commit's diff and
grepping the working tree, not by re-rendering the pages. The review itself changed and deployed nothing.

Line numbers in the evidence refer to the reviewed baseline (`b4d5293`).

## Summary

The site was in good shape at the baseline: every page passed the W3C validator, there were no console
errors, the landing page transferred about 138 KB with zero layout shift, HTTP→HTTPS and www→apex
redirects worked, Android App Links verified with Google, and dark mode rendered cleanly at every width
tested. The findings clustered in four areas:

1. One content bug: guide and article sections were invisible until scrolled into view.
2. Accessibility failures on every subpage (link contrast, focus ring, tap target).
3. One easy performance win: the largest-contentful-paint image was lazy-loaded.
4. Content drift and small inconsistencies.

## Status at a glance

| # | Finding | Severity | Status (2026-10-21) |
| --- | --- | --- | --- |
| 1 | Guide/article sections hidden until scrolled (no-JS, print) | High | Fixed in `c056ea1` |
| 2 | Subpage link, chip and focus-ring colour fails contrast | High | Fixed in `c056ea1` |
| 3 | Footer trademark line fails contrast | Medium | Fixed in `c056ea1` |
| 4 | Back link tap target 50×22 px | Medium | Fixed in `c056ea1` |
| 5 | Smooth scroll ignores reduced motion on subpages | Low | Fixed in `c056ea1` |
| 6 | LCP screenshot lazy-loaded; priority on the wrong image | Medium | Fixed in `c056ea1` |
| 7 | No `color-scheme` declaration | Low | Open (spec E2) |
| 8 | Safari prefixes and media-query range syntax | Low | Open (spec E3) |
| 9 | Dead CSS and unused variables | Low | Open (spec F) |
| 10 | Privacy policy omits yearly report; no website coverage | Medium / Low | Yearly report fixed in `c056ea1`; website coverage open (spec E4) |
| 11 | iPad and iOS 18 requirement never mentioned | Medium | Fixed in `c056ea1` (new FAQ entry) |
| 12 | App-link fallback pages read as Android-only; badge order | Medium | Copy and badge order fixed in `c056ea1`; Universal Links deferred (spec F) |
| 13 | No header navigation to Guide/Articles; Download button target | Low | Open (spec E1 / F) |
| 14 | Small inconsistencies (tagline, articles footer, review name, Apple credit line) | Low | Articles footer and credit line fixed; tagline and review name open |
| 15 | SEO extras (titles, bylines, breadcrumbs, FAQ schema, localization) | Low | Deferred (spec F) |

## 1. Fix first

### 1.1 Guide and article sections invisible until scrolled into view

- **Evidence:** `style.css` 790–799 started every `.fade-in` element at `opacity: 0` with a translate, and
  `site.js` added `.visible` from an IntersectionObserver. Measured after load, before any scrolling:
  guide 13 of 15 sections hidden; weighted-pull-ups article 10 of 13. With JavaScript disabled the content
  never appeared; printing or saving to PDF before reaching the bottom would print blank sections.
- **Fix applied:** scroll-reveal removed from guide, article index and articles; `.fade-in` rules and the
  observer deleted; `site.js` now only sets the footer year (null-safe); `CLAUDE.md` updated.

### 1.2 Subpage link colour and focus ring fail contrast

- **Evidence:** guide, articles, privacy, terms and 404 used the coral accent (`#FF7A5D`) for inline links,
  table-of-contents chips, the back link, `.read-more`, `.platform-badge` and the focus outline. The landing
  page had already solved this with a darker `--link` scoped to `.landing` in `landing.css` 2–4.
  axe-core flagged 15 nodes on the guide and 2 on each article.
- **Fix applied:** `--link`, `--link-hover` and `--focus-ring` now live in `style.css` `:root` with dark-mode
  values; global `a`, `.nav-back`, `.toc-item`, `.guide-section a`, `.platform-badge` and `.read-more` use
  them; prose links are underlined; a 3 px focus ring with 4 px offset applies to all focusable elements,
  with a light ring on the dark footer, CTA and skip link.

| Pair | Before | After | Needed |
| --- | --- | --- | --- |
| Subpage link on white | 2.56:1 | 6.48:1 | 4.5:1 |
| Subpage link on `#F5F5F7` | 2.35:1 | 5.95:1 | 4.5:1 |
| Dark-mode link on `#1C1C1E` | 7.49:1 | 8.56:1 | 4.5:1 |
| Focus outline on white | 2.56:1 | 6.48:1 | 3:1 |
| Focus outline in footer (light theme) | n/a | 8.47:1 | 3:1 |

### 1.3 Footer trademark line fails contrast

- **Evidence:** `.footer-trademarks` (`style.css` 783–787) was 0.7 rem text at `opacity: 0.7`:
  3.56:1 in light mode, 2.88:1 in dark mode (axe flagged it on every page).
- **Fix applied:** opacity removed; the line now measures 5.86:1 (light) and 4.77:1 (dark).

### 1.4 Back link tap target

- **Evidence:** `.nav-back` measured 50×22 px (`guide/guide.css` 9–18); the landing nav button already had a
  44 px minimum height.
- **Fix applied:** `.nav-back` is now inline-flex with 44 px minimum width and height and side padding.

### 1.5 Smooth scrolling ignores reduced motion on subpages

- **Evidence:** `html { scroll-behavior: smooth }` is global (`style.css` 59) but the reduced-motion
  override lived only in `landing.css` 74.
- **Fix applied:** override moved into the shared reduced-motion block in `style.css`.

## 2. Performance and robustness

### 2.1 LCP image was lazy-loaded

- **Evidence:** on desktop (1728×997 viewport) the LCP element was `screenshot-stats.webp`, whose top sat at
  about 698 px, inside the first viewport; all four screenshots carried `loading="lazy"`
  (`index.html` 105–117), which holds their requests until after layout, while the hero icon carried
  `fetchpriority="high"` without being the LCP element. On phones the first visible screenshot is the home
  screen.
- **Fix applied:** home and stats screenshots load eagerly with `fetchpriority="high"`, records loads
  eagerly, history stays lazy, and the hero icon lost its high priority.

Screenshot weights (WebP, 660×1434): home 21.3 KB, stats 26.2 KB, records 29.7 KB, history 20.1 KB.

### 2.2 No `color-scheme` declaration (open)

Add `<meta name="color-scheme" content="light dark">` early in every head (and optionally
`color-scheme: light dark` on `:root`) so dark-mode visitors get a dark canvas before CSS arrives and
native form controls and scrollbars match the theme. Spec E2.

### 2.3 Safari compatibility (open)

- `backdrop-filter` on `.nav` has no `-webkit-` prefix, so Safari before 18 shows a flat bar.
- `text-size-adjust` needs `-webkit-text-size-adjust` in Safari.
- Media-query range syntax (`(width < 640px)` and similar) is unsupported before Safari 16.4; those phones
  get desktop grids and a cropped screenshot row. Small audience, cheap fix. Spec E3.

### 2.4 Dead CSS (open)

Unreferenced in any page: `.social-proof`, `.social-proof-stars`, `.highlight-icon`, `.features`,
`.feature-groups`, `.feature-group`, `.feature-group-title`, `.feature-list`, `.feature-icon`,
`.review-title`, and the variables `--blue`, `--blue-light`, `--badge-fg` (light and dark). Roughly a
hundred lines of `style.css`. Spec F.

### 2.5 Things that were already fine

- Transfer: 138 KB for the landing page on a cold desktop load over HTTP/2; TTFB about 200 ms,
  DOMContentLoaded about 495 ms, load about 654 ms; CLS 0; gzip enabled (`style.css` 14.4 KB → 3.7 KB).
- No console errors on any page; no horizontal overflow at 320, 360 or 390 px; the hero badge row fits
  at 320 px.
- Dark mode renders cleanly on the landing page and guide.

## 3. Content and SEO

### 3.1 Privacy policy

- **Evidence:** section 7 listed weekly and monthly summaries only; the yearly report shipped with app
  1.7.0 (App Store release 2026-10-18).
- **Fix applied:** wording now reads "weekly, monthly, and yearly progress summaries"; Last Updated is
  2026-10-21.
- **Open:** the policy covers the apps only. If it should cover the site, add a short website section
  (GitHub Pages hosting, no cookies or analytics, GitHub's visitor IP logging). Spec E4.

### 3.2 iPad and system requirements

- **Evidence:** the App Store listing is universal (iPad screenshots present) and requires iOS 18.0, yet
  the landing page said iPhone throughout; only the privacy policy mentioned iPad.
- **Fix applied:** new landing FAQ entry "Which devices are supported?" naming iPhone (iOS 18.0+),
  iPad (iPadOS 18.0+) and Android, linking to both listings.

### 3.3 App-link fallback pages

- **Evidence:** no `apple-app-site-association` file exists at either location, so an iPhone user who
  receives a shared `/app/...` link lands on the fallback page, whose subtitle and description spoke only
  of the Android app. The Play badge also came first, while Apple's guidelines ask for the App Store badge
  first in any lineup.
- **Fix applied:** platform-neutral copy on all eight routes; App Store badge first.
- **Deferred:** iOS Universal Links need app entitlements and an AASA file; separate feature. Spec F.

### 3.4 Navigation (open)

- No header link reaches the guide or articles; they live only in the footer and inline text. Spec E1
  proposes a Guide link in the header.
- The nav Download button targets the bottom CTA, roughly 5,900 px down on a 390 px phone. Pointing it at
  the hero badges or a store link is a design decision; spec F defers it.

### 3.5 Small inconsistencies

- Footer tagline differs: landing says "Build your pull-up habit. Log sets, set goals, and see your
  progress over time."; every subpage says "A simple, powerful way to track your pull-up habit..." (open).
- Articles index footer lacked the trademark line (fixed).
- Apple credit line called App Store a trademark; Apple words it as a service mark (fixed on all pages).
- The US App Store review has no reviewer name while the UK one does (open; add only with real attribution).

### 3.6 SEO extras (deferred)

- Both long article titles exceed what search results display.
- Articles show a publish date but no visible author or updated date; no BreadcrumbList markup.
- The FAQPage structured data on the guide no longer earns rich results; harmless to keep.
- The app ships in 35 languages while the site is English only; localized landing pages are the largest
  untested growth lever.
- W3C info notices only: the article intro `<section>` and `<article>` lack headings, as does the 404
  links section.

## 4. What was checked

- Every page read locally and fetched live; live `index.html`, `guide/index.html`, `style.css`,
  `landing.css` and `sitemap.xml` were byte-identical to `b4d5293`.
- W3C Nu validator on all page templates: no errors.
- axe-core 4.10.2 on landing, guide and one article: landing 1 violation (footer trademarks), guide 15
  nodes (link colour), article 2 nodes.
- In-browser metrics via PerformanceObserver (LCP, CLS, resource timing) in Chrome; PageSpeed Insights
  was unavailable (keyless quota exhausted).
- HTTP checks: all internal URLs 200; `/app/home` → `/app/home/`, `/guide` → `/guide/`, `http://` and
  `www.` → apex all 301; `.well-known/assetlinks.json` served as `application/json` and accepted by
  Google's Digital Asset Links API; `CLAUDE.md` and `README.md` are publicly served (harmless).
- All outbound store, social and legal links resolve.
- Screenshots at desktop and at 390, 360 and 320 px (same-origin iframes), light and dark, for landing,
  guide, articles index, an article, an app-link route and the 404 page.

Store facts captured 2026-10-20: App Store version 1.7.0 released 2026-10-18, minimum iOS 18.0,
universal app, 34 language codes, US listing 3 ratings at 5.0; Google Play updated 2026-10-18, 100+
downloads, 7 reviews at 5.0, data-safety label "No data shared with third parties".

## 5. Not checked

- Real Safari or iOS devices (Chrome only); the Safari items in 2.3 come from reading the CSS.
- Lighthouse or PageSpeed scores.
- A screen-reader walkthrough and reduced-motion emulation.
- Print preview itself; the print conclusion in 1.1 follows from the measured hidden state.
- The `c056ea1` fixes were not re-rendered in a browser; statuses above come from the diff and grep.
