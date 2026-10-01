import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One entry = one city/place page, generated from the original .shtml crawl.
// See Web_Site_Original/_migration/generate_markdown.py for how these are produced,
// and design-brief.md (in the claude.ai project) for the editorial rules behind
// the merge/linked-pair/kept-separate fields below.
const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    title: z.string(),
    cityName: z.string(),
    subtitle: z.string(),
    continent: z.string(),
    country: z.string(),
    trip: z.string(), // slug referencing a trips collection entry
    // The generator writes explicit `null` (not a missing key) for several of these
    // fields when there's no value, so each needs .nullable() as well as .optional().
    date: z.coerce.date().nullable().optional(), // seasonal-label-only entries have no real date
    dateLabel: z.string(),
    dateRangeLabel: z.string().optional(), // set on the primary entry of a merged pair (rule 2)

    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .nullable()
      .optional(),
    coordinatesSource: z.string().nullable().optional(),

    lyric: z
      .object({
        lines: z.array(z.string()),
        // A handful of lyrics have no traceable attribution/YouTube link.
        attribution: z.string().nullable().optional(),
        attributionHref: z.string().url().nullable().optional(),
      })
      .nullable()
      .optional(), // ~8 short "transit day" entries have no lyric at all

    photos: z
      .array(
        z.object({
          source: z.string().optional(), // vestigial: medium/large split was retired; kept optional for old entries only
          sourceLarge: z.string(),
          caption: z.string().nullable().optional(),
        })
      )
      .default([]),

    videos: z
      .array(
        z.object({
          src: z.string(),
          caption: z.string().nullable().optional(),
        })
      )
      .default([]),

    // Repeat-visit editorial pass (design-brief.md "Repeat-visit and multi-part patterns")
    mergeGroup: z.string().optional(),
    mergeGroupReason: z.string().optional(),
    linkedPairGroup: z.string().optional(),
    linkedPairReason: z.string().optional(),
    keptSeparateReason: z.string().optional(),
    dateDiscrepancyNote: z.string().optional(),

    sourcePath: z.string(), // original .shtml path, for traceability back to the source site

    // Only set on the 80 USA-trip entries — which of the USA hub page's four
    // regions (Eastern/Central/Southwest and Hawaii/Northwest) this stop
    // belongs to. See design-brief.md's "USA hub page" section for how this
    // was derived from real coordinates.
    // preprocess: the Sveltia CMS select widget writes '' (not an omitted key) when left
    // blank, which a bare z.enum().optional() rejects — coerce '' to undefined first.
    region: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['Eastern', 'Central', 'Southwest and Hawaii', 'Northwest']).optional()
    ),
  }),
});

// One trip = one named journey (IGWO, Southward Bound, ...) or the flat "Other Travels" bucket.
const trips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/trips' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string().nullable().optional(),
    // Same '' -> undefined coercion as entries.region above (CMS select widget quirk).
    routeColor: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z.enum(['Pine', 'Slate', 'Clay']).nullable().optional()
    ),
    cityCount: z.number(),
    hasRealEssay: z.boolean(),
    isHub: z.boolean(), // true only for USA (spans multiple trips, its own regional layout)
    isFlatIndex: z.boolean(), // true only for Other Travels (no route line, no single narrative)
    // Only USA has this set — its own dedicated hub page (src/pages/trips/usa.astro)
    // sources its lyric epigraph from here, same shape as entries/countries lyric.
    lyric: z
      .object({
        lines: z.array(z.string()),
        attribution: z.string().nullable().optional(),
        attributionHref: z.string().url().nullable().optional(),
      })
      .nullable()
      .optional(),
  }),
});

// One country = the lyric epigraph from that country's own original index
// page (see Web_Site_Original/_migration/extracted-pages.json, kind_guess
// "country_or_hub"). Countries were never modeled as a full content
// collection like entries/trips (no essay copy exists at this level in the
// original site — every country page checked has an empty essay_paragraphs
// array), so this is deliberately minimal: just enough to source the
// lyric epigraph the confirmed country-page mockup calls for.
const countries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/countries' }),
  schema: z.object({
    country: z.string(), // matches the `country` field on entries, e.g. "CostaRica"
    lyric: z
      .object({
        lines: z.array(z.string()),
        attribution: z.string().nullable().optional(),
        attributionHref: z.string().url().nullable().optional(),
      })
      .nullable()
      .optional(),
    sourcePath: z.string(),
  }),
});

export const collections = { entries, trips, countries };
