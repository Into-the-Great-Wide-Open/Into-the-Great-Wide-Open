import type { CollectionEntry } from 'astro:content';

export interface MapStop {
  id: string;
  cityName: string;
  lat: number;
  lng: number;
}

export interface MapRouteLayer {
  stops: MapStop[];
  routeColor?: 'Pine' | 'Slate' | 'Clay' | null;
}

// Previously these two trips got their own dashed route line (Pine for
// IGWO, Clay for Southward Bound); Andrew found the lines cluttered the
// map, so every stop is now a plain marker with no connecting line. Left
// as a named set (rather than just merging all entries into one layer)
// in case a route line comes back later for a subset of trips.
const NAMED_ROUTE_TRIPS = ['into-the-great-wide-open', 'southward-bound'];

function toStop(entry: CollectionEntry<'entries'>): MapStop {
  return {
    id: entry.id,
    cityName: entry.data.cityName,
    lat: entry.data.coordinates!.lat,
    lng: entry.data.coordinates!.lng,
  };
}

/**
 * The site-wide map data used for both the homepage hero and /map: every
 * entry across all 8 trips is plotted as a plain marker, with no connecting
 * route lines (Andrew found the dashed IGWO/Southward Bound lines cluttered
 * the map, so they were dropped — see design-brief.md's "Homepage/`/map`
 * route map" section). Kept as three layers rather than one flat list only
 * because that's the shape CountryMap.astro's multi-layer mode expects.
 */
export function getWorldMapLayers(
  entries: CollectionEntry<'entries'>[]
): MapRouteLayer[] {
  const withCoords = entries.filter((e) => e.data.coordinates);
  const byDate = (a: CollectionEntry<'entries'>, b: CollectionEntry<'entries'>) =>
    (a.data.date?.getTime() ?? 0) - (b.data.date?.getTime() ?? 0);

  const layers: MapRouteLayer[] = [];

  for (const tripSlug of NAMED_ROUTE_TRIPS) {
    const stops = withCoords
      .filter((e) => e.data.trip === tripSlug)
      .sort(byDate)
      .map(toStop);
    layers.push({ stops, routeColor: null });
  }

  const namedTripSlugs = new Set(NAMED_ROUTE_TRIPS);
  const otherStops = withCoords
    .filter((e) => !namedTripSlugs.has(e.data.trip))
    .map(toStop);
  layers.push({ stops: otherStops, routeColor: null });

  return layers;
}
