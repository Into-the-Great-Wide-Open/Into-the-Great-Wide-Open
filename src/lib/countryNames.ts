/**
 * The `country` field in entry frontmatter is a folder-name-derived identifier
 * (e.g. "NewZealand", "CostaRica") carried over from the original .shtml site's
 * directory structure — it's used as a stable key (grouping, routing), not meant
 * for display. This maps the multi-word ones to their real display name.
 *
 * Single-word countries (e.g. "France", "Japan") aren't listed here — they're
 * already correct as-is.
 */
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  CostaRica: 'Costa Rica',
  DominicanRepublic: 'Dominican Republic',
  NewZealand: 'New Zealand',
  PuertoRico: 'Puerto Rico',
  SouthKorea: 'South Korea',
  SriLanka: 'Sri Lanka',
  WesternSahara: 'Western Sahara',
};

export function countryDisplayName(country: string): string {
  return DISPLAY_NAME_OVERRIDES[country] ?? country;
}
