export type Genre =
  | "electronic"
  | "rock"
  | "pop"
  | "hip-hop"
  | "metal"
  | "jazz"
  | "classical"
  | "reggae"
  | "folk"
  | "world"
  | "rnb"
  | "indie"
  | "punk"
  | "blues"
  | "latin"
  | "other";

export type Country =
  | "FR" | "BE" | "CH" | "DE" | "ES" | "IT" | "LU" | "GB"
  | "PT" | "PL" | "DK" | "SE" | "NO" | "HU" | "RO" | "CZ" | "SK" | "IE" | "GR" | "HR" | "NL";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Venue {
  name: string;
  address?: string;
  city: string;
  region?: string;
  country: Country;
  countryName: string;
  postalCode?: string;
  coordinates: Coordinates;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  genres: Genre[];
}

export interface FestivalDay {
  date: string; // YYYY-MM-DD
  artists: Artist[];
}

export interface PriceRange {
  min?: number;
  max?: number;
  currency: string;
}

export interface Festival {
  id: string;
  name: string;
  slug: string;
  description?: string;

  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD

  venue: Venue;

  genres: Genre[];
  lineup: Artist[];
  lineupByDay?: FestivalDay[];
  headliners: Artist[];

  imageUrl?: string;
  thumbnailUrl?: string;
  images: string[];

  ticketUrl?: string;
  priceRange?: PriceRange;
  onSaleStatus?: "onsale" | "offsale" | "upcoming" | "soldout";

  websiteUrl?: string;
  source: DataSource;
  sourceId: string;
  lastUpdated: string; // ISO datetime
  searchableText: string;
}

export type DataSource =
  | "ticketmaster"
  | "resident-advisor"
  | "music-festival-wizard"
  | "data-culture-gouv"
  | "openagenda"
  | "bandsintown"
  | "manual";

export interface FestivalFilters {
  genres?: Genre[];
  artistQuery?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  countries?: Country[];
  inFrance?: boolean;
  gims?: boolean;
}

export interface FestivalDataset {
  festivals: Festival[];
  lastRefreshed: string; // ISO datetime
  totalCount: number;
  genreCounts: Record<Genre, number>;
  countryCounts: Record<Country, number>;
}
