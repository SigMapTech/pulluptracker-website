# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static marketing website for the Pull-Up Tracker iOS app, hosted on GitHub Pages at [pulluptracker.app](https://pulluptracker.app). No build tools, frameworks, or package managers — just plain HTML and CSS served directly.

## Development

No build step. Open `index.html` in a browser or use any local server (e.g., `python3 -m http.server`). Changes pushed to `main` deploy automatically via GitHub Pages.

## Architecture

- `index.html` — Landing page (hero, screenshots, features, CTA)
- `guide/index.html` — Help & guide page with TOC and FAQ
- `privacy/index.html` — Privacy policy
- `terms/index.html` — Terms of service
- `404.html` — Custom not-found page (uses absolute paths since GitHub Pages serves it at any URL)
- `style.css` — Global styles used by all pages (custom properties, nav, footer, layout)
- `guide/guide.css` — Additional styles for subpages (guide, privacy, terms, 404 all use this)
- `site.js` — Shared script for all pages (footer year, scroll fade-in)
- `images/` — App icon, favicon, screenshots, App Store badge. Pages use the resized WebP variants (`app-icon-64.webp`, `app-icon-320.webp`, `screenshot-*.webp`); the full-size PNGs are kept as source assets and for `og:image`. Regenerate variants with `sips` + `cwebp` if a source image changes.

## Conventions

- All subpages (`guide/`, `privacy/`, `terms/`) share the same layout pattern: sticky nav with back link, hero section, content area, footer. They link `../style.css` + `../guide/guide.css`.
- Dark mode is handled entirely via CSS custom properties in `:root` and `@media (prefers-color-scheme: dark)` — no JS theme switching.
- Scroll-triggered fade-in animations use `IntersectionObserver` with a `.fade-in` / `.visible` class pattern; respects `prefers-reduced-motion`. This and the dynamic footer year live in the shared `site.js`.
- The app is live on the App Store. The `apple-itunes-app` Smart Banner meta tag is on every page, and the hero and CTA sections link to the App Store listing with the official download badge (self-hosted at `images/app-store-badge.svg`).
- Custom domain configured via `CNAME` file. `sitemap.xml` and `robots.txt` are present for SEO.
