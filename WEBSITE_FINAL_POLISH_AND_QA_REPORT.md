# Pull-Up Tracker website: final polish and QA report

Prepared: October 21, 2026
Baseline: `ed5d146` — Implement website follow-up improvements

## Implementation

- **R1 — Completed.** Added desktop-only internal spacing to the landing-page screenshot grid: `16px 18px 32px`. The mobile rule and its `8px 12px 24px` padding remain unchanged.
- **R2 — Completed where the named environments were available.** Print verification exposed split footer columns and a blank trailing page in generated output. Print-only spacing now keeps the footer grid and footer bottom intact and reduces reading-page bottom padding. Screen layout is unchanged by these rules.
- **R3 — Skipped — optional.** The continuous hero animation remains unchanged. Existing reduced-motion handling still disables it.

## Environments used

- macOS 27.0.1 (26A434)
- Safari 27.0.1
- Google Chrome 155.0.8059.85 in headless print and JavaScript-disabled modes
- Codex in-app Chromium browser for exact viewport, focus, keyboard, and DOM geometry checks (engine version not exposed)
- iPhone 17 Pro simulator, iOS 26.5, for a static portrait Safari render only

## Results

### Pass

- **Desktop screenshot focus clearance:** At 640, 768, 960, and 1440 CSS pixels all four figures fit, the page had zero horizontal overflow, and the focused region had at least about 5px side clearance, 9px top clearance, and 9px bottom clearance from content at the sampled widths. At 640px the measured minimum clearances were about 6px on the sides, 9px at the top, and 11px at the bottom.
- **Breakpoint preservation:** At 639px the strip retained native horizontal scrolling and the existing mobile padding. At 640px it became a non-scrolling desktop row with all four figures visible.
- **Narrow layout:** At 320, 390, 519, and 520 CSS pixels there was no page-wide horizontal overflow and the stacked/single-row header transition did not overlap controls.
- **Keyboard scrolling:** At 320 and 390px, ordinary settled Left/Right key presses reached the last screenshot, returned to the first, and left both end captions fully visible.
- **Keyboard order and escape:** In the in-app Chromium browser, the order was skip link, brand, Guide, Download, both store links, App preview, then “See everything in the guide”. The region remained one tab stop, Shift+Tab worked, and the native FAQ opened with Enter and closed with Space while retaining focus.
- **Safari keyboard behavior:** With Safari's default tab-to-webpage-links setting, Tab skipped ordinary links as expected, reached `App preview`, and then reached native FAQ summaries. Arrow-key input kept focus on the preview. Safari's accessibility tree exposed one named `App preview` region, the four images in Home → Statistics → Records → History order, and native FAQ states.
- **Sticky anchors:** After smooth scrolling settled, the Download destination cleared the sticky header at 320 and 520px. The local fragment audit also verified every referenced destination ID.
- **JavaScript disabled:** Landing, guide, a full article, and `/app/home/` retained useful static content; the app fallback retained both store links.
- **Print — Chrome:** Final light and forced-dark screen-theme PDFs rendered with a light print palette. Page counts were guide 9, benefits article 5, tracking article 4, and weighted article 6. Beginning, middle, and final pages were inspected. Text, headings, citations, store badges, closing content, and footer content were legible; footer sub-sections stayed intact; no blank page remained.
- **Print — Safari:** Fresh print previews were generated at A4 portrait, 100% scale, with backgrounds off: guide 10 pages, benefits 5, tracking 5, and weighted 6. The first and final thumbnail ranges were reachable for every document.
- **Static regression audit:** All 17 public pages returned HTTP 200 from the local server. A source audit checked 294 local references/fragments, 66 images for intrinsic dimensions, five JSON-LD blocks, exactly one color-scheme meta per page, the screenshot region's accessibility attributes, and screenshot loading priorities; all passed.
- **Console and diff:** The landing-page browser log had no warnings or errors. `git diff --check` passed.

### Not run

- **Interactive Google Chrome GUI:** The Chrome browser connector was unavailable. Exact viewport and keyboard checks used the in-app Chromium browser; installed Chrome 155 was used headlessly for print and JavaScript-disabled checks.
- **Exact 200% text-only enlargement at a 640px CSS viewport:** Safari's “Make Text Bigger” control was exercised and restored, but its resulting percentage and simultaneous CSS viewport could not be measured reliably. The 640px normal-text case and narrow reflow cases passed independently.
- **True 400% browser zoom:** A 320px CSS viewport reflow passed, but this was not labeled as a genuine 400% zoom test.
- **Dark-mode focused screenshots:** Light-theme focused evidence was captured at 640px, 960px, and wide Safari. A system-theme change was not performed.
- **VoiceOver:** Not run. No screen-reader session was started; accessibility-tree inspection is not treated as a substitute.
- **Interactive iPhone Safari:** A portrait render was captured on the iPhone 17 Pro simulator (iOS 26.5). Touch swiping, landscape rotation, enlarged page text, theme switching, and iPhone VoiceOver were not run.
- **Remaining Safari print combinations:** Dark screen theme and backgrounds-on combinations were not run in Safari. Chrome covered the forced-dark print regression and final light output.

## Evidence

Focused screenshots and the simulator render are stored outside deployable site assets in:

`/Users/lauri.oherd/.codex/visualizations/2026/10/21/01a15f42-fe64-7602-bd44-6f98aca3d607/qa/`

Key files:

- `before-focus-640-light.png`
- `after-focus-640-light-final.png`
- `after-focus-960-light-final.png`
- `after-focus-safari-wide-light.png`
- `iphone17pro-portrait.png`

Temporary print PDFs and rendered page images were kept under `/private/tmp/pulluptracker-print-qa/` for this QA pass.
