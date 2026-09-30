import type { CollectionEntry } from 'astro:content';

/**
 * Countries touched per trip, computed from the entries themselves rather than
 * stored in the trip frontmatter — so it can't drift out of sync as entries
 * get re-tagged (e.g. the China/Panama/Brazil/Colombia per-city splits).
 */
export function countCountriesPerTrip(
  entries: CollectionEntry<'entries'>[]
): Map<string, number> {
  const countriesByTrip = new Map<string, Set<string>>();

  for (const entry of entries) {
    const tripSlug = entry.data.trip;
    const set = countriesByTrip.get(tripSlug) ?? new Set<string>();
    set.add(entry.data.country);
    countriesByTrip.set(tripSlug, set);
  }

  const counts = new Map<string, number>();
  for (const [tripSlug, countries] of countriesByTrip) {
    counts.set(tripSlug, countries.size);
  }
  return counts;
}

/**
 * Shared hero-photo picker: the first photo of the earliest-dated stop in a
 * given set, falling back to any stop with a photo if the earliest ones
 * happen to have none. Used for both trip and country hero images.
 */
function pickHeroPhoto(stops: CollectionEntry<'entries'>[]): string | null {
  if (stops.length === 0) return null;

  const dated = stops.filter((e) => e.data.date);
  const pool = dated.length > 0 ? dated : stops;
  const sorted = [...pool].sort(
    (a, b) => (a.data.date?.getTime() ?? 0) - (b.data.date?.getTime() ?? 0)
  );

  for (const entry of sorted) {
    if (entry.data.photos.length > 0) {
      return entry.data.photos[0].sourceLarge;
    }
  }
  for (const entry of stops) {
    if (entry.data.photos.length > 0) {
      return entry.data.photos[0].sourceLarge;
    }
  }
  return null;
}

/** A representative "hero" photo per trip, for image-forward trip cards. */
export function getTripHeroPhoto(
  tripSlug: string,
  entries: CollectionEntry<'entries'>[]
): string | null {
  return pickHeroPhoto(entries.filter((e) => e.data.trip === tripSlug));
}

/** A representative "hero" photo per country, for image-forward country cards. */
export function getCountryHeroPhoto(
  country: string,
  entries: CollectionEntry<'entries'>[]
): string | null {
  return pickHeroPhoto(entries.filter((e) => e.data.country === country));
}
