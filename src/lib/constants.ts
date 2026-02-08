import type { Genre, Country } from "./types";

export const GENRE_LABELS: Record<Genre, string> = {
  electronic: "Electro",
  rock: "Rock",
  pop: "Pop",
  "hip-hop": "Hip-Hop",
  metal: "Metal",
  jazz: "Jazz",
  classical: "Classique",
  reggae: "Reggae",
  folk: "Folk",
  world: "World",
  rnb: "R&B",
  indie: "Indie",
  punk: "Punk",
  blues: "Blues",
  latin: "Latin",
  other: "Autre",
};

export const GENRE_COLORS: Record<Genre, string> = {
  electronic: "#00f0ff",
  rock: "#ff2d6a",
  pop: "#f472b6",
  "hip-hop": "#a855f7",
  metal: "#ef4444",
  jazz: "#f59e0b",
  classical: "#fbbf24",
  reggae: "#22c55e",
  folk: "#d97706",
  world: "#14b8a6",
  rnb: "#c084fc",
  indie: "#67e8f9",
  punk: "#fb7185",
  blues: "#3b82f6",
  latin: "#f97316",
  other: "#94a3b8",
};

export const COUNTRY_LABELS: Record<Country, string> = {
  FR: "France",
  BE: "Belgique",
  CH: "Suisse",
  DE: "Allemagne",
  ES: "Espagne",
  IT: "Italie",
  LU: "Luxembourg",
  GB: "Royaume-Uni",
  PT: "Portugal",
  PL: "Pologne",
  DK: "Danemark",
  SE: "Suède",
  NO: "Norvège",
  HU: "Hongrie",
  RO: "Roumanie",
  CZ: "Tchéquie",
  SK: "Slovaquie",
  IE: "Irlande",
  GR: "Grèce",
  HR: "Croatie",
  NL: "Pays-Bas",
  AT: "Autriche",
  RS: "Serbie",
};

export const COUNTRY_FLAGS: Record<Country, string> = {
  FR: "\u{1F1EB}\u{1F1F7}",
  BE: "\u{1F1E7}\u{1F1EA}",
  CH: "\u{1F1E8}\u{1F1ED}",
  DE: "\u{1F1E9}\u{1F1EA}",
  ES: "\u{1F1EA}\u{1F1F8}",
  IT: "\u{1F1EE}\u{1F1F9}",
  LU: "\u{1F1F1}\u{1F1FA}",
  GB: "\u{1F1EC}\u{1F1E7}",
  PT: "\u{1F1F5}\u{1F1F9}",
  PL: "\u{1F1F5}\u{1F1F1}",
  DK: "\u{1F1E9}\u{1F1F0}",
  SE: "\u{1F1F8}\u{1F1EA}",
  NO: "\u{1F1F3}\u{1F1F4}",
  HU: "\u{1F1ED}\u{1F1FA}",
  RO: "\u{1F1F7}\u{1F1F4}",
  CZ: "\u{1F1E8}\u{1F1FF}",
  SK: "\u{1F1F8}\u{1F1F0}",
  IE: "\u{1F1EE}\u{1F1EA}",
  GR: "\u{1F1EC}\u{1F1F7}",
  HR: "\u{1F1ED}\u{1F1F7}",
  NL: "\u{1F1F3}\u{1F1F1}",
  AT: "\u{1F1E6}\u{1F1F9}",
  RS: "\u{1F1F7}\u{1F1F8}",
};

// Countries to fetch from Ticketmaster API
export const TARGET_COUNTRIES: Country[] = [
  "FR",
  "BE",
  "CH",
  "DE",
  "ES",
  "IT",
  "LU",
  "GB",
];

export const SUMMER_2026 = {
  start: "2026-06-01",
  end: "2026-08-31",
};

export const MAP_DEFAULTS = {
  center: { lat: 46.6, lng: 2.5 },
  zoom: 5,
};

export const ALL_GENRES: Genre[] = [
  "electronic",
  "rock",
  "pop",
  "hip-hop",
  "metal",
  "jazz",
  "classical",
  "reggae",
  "folk",
  "world",
  "rnb",
  "indie",
  "punk",
  "blues",
  "latin",
  "other",
];
