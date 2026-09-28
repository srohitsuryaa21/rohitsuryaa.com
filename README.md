# Rohit Suryaa — portfolio

Astro + TypeScript + GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll. Static output, no blog or backend.

## Run

```powershell
cd 'D:\rohit new\portfolio-next'
$env:ASTRO_TELEMETRY_DISABLED='1'
npm.cmd install
npm.cmd run dev      # http://127.0.0.1:4321/
npm.cmd run build    # astro check + build + link checker
```

## Direction (September 28, 2026)

The user gave free rein to redesign as a scroll-driven portfolio in the style of award-winning GSAP sites. The palette is ink (#0d0d0c), bone paper (#ece8df) and one vermilion accent (#ff4d1f). Type is Manrope (display), Instrument Serif italic (accents) and JetBrains Mono (labels). Content comes from the Home.razor source of rohitsuryaa.com.

Homepage sequence (a thin accent progress bar runs across the top):

1. **Loader.** A top bar holds the name and role. One cycling word (Code / Data / Models / Systems) shows at a time, beside a 0 to 100 counter. It is shorter on repeat visits, and a CSS failsafe hides it after 5 s.
2. **Hero ("find the signal").** The headline "I turn raw data into ___ people trust." cycles through forecasts, AI agents, APIs, pipelines and decisions. No photo; the portrait appears only in About. A canvas dot field (`src/scripts/field.ts`) shows a noisy data series. During a short pin it settles into a fitted orange curve, and the legend changes to "Signal found". Dots light up near the pointer. A one-line role/location/availability note and two buttons sit under the headline, and your name runs across the bottom, sized by `fitName`.
3. **Manifesto.** Scroll-scrubbed word fill, followed by the about text with a sticky parallax portrait, facts and EN/DE résumés.
4. **Numbers.** Counters: 96%, 110,123, 63K, 02.
5. **Work showcase (pinned).** On desktop, a project index sits on the left with the active project highlighted and a progress rail. Each project wipes up over the previous one, which sinks back, and scrolling snaps to one project at a time. Clicking the index jumps to a project. Mobile and short screens get a stacked list with clip reveals.
6. **Principles.** Stacking sticky cards that recede in 3D as they are covered.
7. **Experience.** Scroll-drawn timeline whose entries light up as the line reaches them, plus IEEE papers and certifications.
8. **Toolkit network (pinned).** A six-layer network (`src/components/Network.astro`): raw data, clean and shape, model, build, ship, results. Each node is a tool. While the section is pinned, the camera moves down one layer at a time and the connections draw in as the signal passes. The text on the left follows the current layer. Reduced motion shows the whole network and all six layers as plain text.
9. **Contact.** Curtain reveal: the footer is uncovered from underneath. It has a magnetic button, copy-email and Fulda local time.

The page also has a custom cursor with contextual labels and magnetic elements (fine pointers only).

## Languages

The site is bilingual. English lives at `/` and `/work/<slug>/`, German at `/de/` and `/de/work/<slug>/`, with an EN/DE switch in the header and hreflang links in the head. All copy lives in `src/i18n/content.ts` (homepage, network, case labels). Each project in `src/data/projects.ts` has an English base and a `de` block. `Home.astro` and `CaseStudy.astro` render either language. When adding text, add both languages.

## Files

- `src/pages/index.astro`: homepage markup and content arrays.
- `src/pages/work/[slug].astro`: eight case-study pages.
- `src/components/Layout.astro`: head, fonts, cursor. `src/components/Exhibit.astro` holds the generative SVG art.
- `src/data/projects.ts`: project content and metrics.
- `src/styles/site.css`: all styles.
- `src/scripts/site.ts`: all motion.
- `archive/` (local only, git-ignored): superseded iterations, old notes and the previous résumé PDFs.

## Writing

The user asked that visible text contain no dashes (em, en or hyphen used as punctuation) and read plainly, not like generated copy. Keep it that way when editing content.

## Accessibility and fallbacks

- `prefers-reduced-motion` gives a full static layout: no Lenis, no pins, no loader.
- Without JavaScript, all content is visible.
- The name is exposed to screen readers once. Marquee contents are duplicated into sr-only text.
- Keyboard focus inside the horizontal gallery scrolls the page to the focused panel.

## Scope

- No blog, CMS or API (excluded by the user).
- Code lives at https://github.com/srohitsuryaa21/rohitsuryaa.com. Every push to `main` is built and published to rohitsuryaa.com by `.github/workflows/deploy.yml` (GitHub Pages, source "GitHub Actions"). The old `rohit_portfolio_website` repo no longer holds the domain.

## Brand files (`brand/`)

The logo is a lowercase **rs©** set in Manrope 800 with the site's tight tracking. The © is in the vermilion accent. Letters are outlined to SVG paths, so no font is needed wherever it is used.

- `rs-mark-light.svg/.png`: for dark backgrounds. `rs-mark-dark.svg/.png`: for light backgrounds. Mono black and white SVGs are included too.
- `rs-tile-ink / paper / accent (.svg/.png)`: 1024 px squares for avatars and social icons.
- `favicon.svg`: also copied to `public/favicon.svg`.
- `linkedin-cover-blue.png` / `@2x` ("Where software engineering meets data science."), rendered from the same template with `?theme=blue`. Also `linkedin-cover.png` / `@2x`, the orange original: the hero's signal curve with the headline on the right. The lower left is kept clear for the profile photo.

To regenerate, run `python scripts/brand/make-logo.py` (needs `fonttools` and `brotli`) for the SVGs. For the cover, open `scripts/brand/linkedin-cover.html` in Chrome and screenshot the 1584×396 `.cover` element.

## Résumés

`public/resumes/*.pdf` are generated from `scripts/resume/resume.html` (`?lang=de` for German), printed to A4 with Chrome. The template holds the content for both languages and follows the site: the same projects, numbers and wording, and no dashes. The previous PDFs are kept in `archive/resumes-2026-09/`. Update the template, not the PDFs.
