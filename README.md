# Into the Great Wide Open — Astro scaffold

This is step 12 of the migration: a real Astro project seeded with the
349 entry + 8 trip markdown files generated in step 2
(`_migration/astro-content-preview/`).

## What's here

- `src/content/config.ts` — content collection schema for `entries` and
  `trips`, matching the frontmatter the step-2 generator scripts produce.
- `src/layouts/BaseLayout.astro` — shared nav + the Paper/Ink/Pine/Slate/Clay
  design system, Newsreader + IBM Plex Sans.
- `src/pages/` — homepage, a city/entry page, a trip landing page, a flat
  countries index, and stub `/map` and `/about` pages (both marked TODO).
- `src/content/entries/*.md`, `src/content/trips/*.md` — copied in from
  `_migration/astro-content-preview/` (see setup below).

## What's NOT here yet (still open items from the migration plan)

- Real photo/image files — pages currently reference `/images/<sourcePath>`,
  but images haven't been consolidated or copied in (step 4).
- The click-to-load video facade (currently a plain iframe — see the TODO
  comment in `src/pages/entries/[...id].astro`).
- The map-first homepage hero and `/map` page (stub only).
- The About page's real bio copy and photo grid (stub only).
- Country-level and continent-level pages (only a flat country list exists
  so far, at `/countries`).
- Sveltia CMS config and a Cloudflare Pages/Netlify deploy pipeline.
- `npm install` hasn't been run — this session's tools have no network
  access on your machine, so the dependency install has to happen from
  your own terminal (see below).

## Setup

This project's files were generated without running `npm install` — the
Claude session building this had no network access on your machine. From
a normal terminal on your computer:

```bash
cd Web_Site_Original/astro-site
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:4321`) to see
the homepage, trip pages, and city entry pages rendering from the real
content.

If `src/content/entries/` or `src/content/trips/` are empty, copy them
in from the step 2 output:

```bash
cp ../_migration/astro-content-preview/entries/*.md src/content/entries/
cp ../_migration/astro-content-preview/trips/*.md src/content/trips/
```
