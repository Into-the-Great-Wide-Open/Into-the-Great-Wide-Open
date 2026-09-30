/**
 * Central lookup from the plain path strings stored in content frontmatter
 * (e.g. "NorthAmerica/USA/Amarillo/Images/medium-3.jpg", or
 * "countries/USA/flag.png") to the actual imported, Vite-processed image
 * modules under src/assets/images/. This is what makes astro:assets'
 * optimization/responsive pipeline (Sharp-based resize + format
 * conversion) apply to every photo on the site: images living in public/
 * are served verbatim and never touched by that pipeline, so all site
 * photos were moved from public/images/ into src/assets/images/ (same
 * relative structure) and are loaded here via import.meta.glob so they can
 * be looked up by the same path strings the frontmatter already uses.
 */
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true }
);

// Build a lookup keyed by the path relative to src/assets/images/, e.g.
// "NorthAmerica/USA/Amarillo/Images/medium-3.jpg" or "countries/USA/flag.png"
// — the same strings already stored in frontmatter/manifest data.
const lookup: Record<string, ImageMetadata> = {};
const PREFIX = '/src/assets/images/';
for (const [modulePath, mod] of Object.entries(images)) {
  const rel = modulePath.slice(PREFIX.length);
  lookup[rel] = mod.default;
}

/**
 * Resolve a stored relative image path (as used throughout frontmatter,
 * e.g. `photos[].source`) to its imported ImageMetadata, for use with
 * <Image>/getImage(). Throws if the path isn't found, since a missing
 * image is a content bug worth surfacing at build time rather than
 * silently rendering a broken image.
 */
export function resolveImage(relPath: string): ImageMetadata {
  const img = lookup[relPath];
  if (!img) {
    throw new Error(`resolveImage: no imported asset found for "${relPath}" (looked under src/assets/images/)`);
  }
  return img;
}

/**
 * Same as resolveImage but returns null instead of throwing when missing —
 * for optional/best-effort lookups (e.g. a country that has no flag yet).
 */
export function tryResolveImage(relPath: string | null | undefined): ImageMetadata | null {
  if (!relPath) return null;
  return lookup[relPath] ?? null;
}

export const imageCount = Object.keys(lookup).length;

/**
 * Safe responsive-width breakpoints for a given image: fractions of its own
 * intrinsic width, deduplicated and never exceeding it. Site photos are a
 * mix of landscape and portrait crops (e.g. medium photos are 800px wide
 * landscape or 600px wide portrait), so widths must be derived per-image
 * rather than hardcoded, or Astro/Sharp will refuse to enlarge a narrower
 * portrait crop past its real width.
 */
export function safeWidths(img: ImageMetadata, fractions: number[] = [0.5, 1]): number[] {
  const widths = fractions
    .map((f) => Math.round(img.width * f))
    .filter((w) => w >= 100 && w <= img.width);
  return [...new Set(widths)].sort((a, b) => a - b);
}

