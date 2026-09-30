import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { tryResolveImage } from './images';

export interface AdjacentEntry {
  id: string;
  cityName: string;
  country: string;
  photo: ImageMetadata | null;
}

/**
 * Previous/next navigation for a city entry page. Both narrative trips and
 * the flat "Other Travels" bucket are ordered the same way: chronologically
 * by date within the entry's own trip (confirmed with Andrew — Other Travels
 * has no single narrative order of its own, so it falls back to date order
 * too, same as any real trip's own stop list).
 */
export function getAdjacentEntries(
  entry: CollectionEntry<'entries'>,
  allEntries: CollectionEntry<'entries'>[]
): { prev: AdjacentEntry | null; next: AdjacentEntry | null } {
  const stops = allEntries
    .filter((e) => e.data.trip === entry.data.trip)
    .sort((a, b) => {
      const aTime = a.data.date?.getTime() ?? Number.POSITIVE_INFINITY;
      const bTime = b.data.date?.getTime() ?? Number.POSITIVE_INFINITY;
      if (aTime !== bTime) return aTime - bTime;
      return a.data.cityName.localeCompare(b.data.cityName);
    });

  const index = stops.findIndex((e) => e.id === entry.id);
  if (index === -1) return { prev: null, next: null };

  const toAdjacent = (e: CollectionEntry<'entries'> | undefined): AdjacentEntry | null =>
    e
      ? {
          id: e.id,
          cityName: e.data.cityName,
          country: e.data.country,
          photo: tryResolveImage(e.data.photos[0]?.sourceLarge),
        }
      : null;

  return {
    prev: toAdjacent(stops[index - 1]),
    next: toAdjacent(stops[index + 1]),
  };
}
