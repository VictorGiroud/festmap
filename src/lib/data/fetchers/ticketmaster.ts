import type { Festival, Artist, Country } from "../../types";
import { mapTicketmasterGenre } from "../genre-mapper";
import { slugify } from "../../utils";
import { SUMMER_2026, TARGET_COUNTRIES, COUNTRY_LABELS } from "../../constants";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

interface TMImage {
  url: string;
  ratio?: string;
  width?: number;
  height?: number;
}

interface TMAttraction {
  name: string;
  id: string;
  images?: TMImage[];
  classifications?: TMClassification[];
}

interface TMClassification {
  genre?: { name: string };
  subGenre?: { name: string };
  segment?: { name: string };
}

interface TMVenue {
  name: string;
  city?: { name: string };
  state?: { stateCode: string; name: string };
  country?: { countryCode: string; name: string };
  postalCode?: string;
  address?: { line1: string };
  location?: { latitude: string; longitude: string };
}

interface TMPriceRange {
  min?: number;
  max?: number;
  currency?: string;
}

interface TMEvent {
  id: string;
  name: string;
  type: string;
  url?: string;
  images?: TMImage[];
  dates?: {
    start?: { localDate?: string };
    end?: { localDate?: string };
    status?: { code?: string };
  };
  classifications?: TMClassification[];
  _embedded?: {
    venues?: TMVenue[];
    attractions?: TMAttraction[];
  };
  priceRanges?: TMPriceRange[];
  info?: string;
  pleaseNote?: string;
}

interface TMResponse {
  _embedded?: { events?: TMEvent[] };
  page?: { totalPages?: number; number?: number; totalElements?: number };
}

function getApiKey(): string {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key) throw new Error("TICKETMASTER_API_KEY is not set");
  return key;
}

function pickBestImage(images?: TMImage[]): { imageUrl?: string; thumbnailUrl?: string } {
  if (!images?.length) return {};

  const wide = images.find((i) => i.ratio === "16_9" && (i.width ?? 0) >= 1024);
  const thumb = images.find((i) => i.ratio === "4_3" && (i.width ?? 0) <= 400);

  return {
    imageUrl: wide?.url ?? images[0]?.url,
    thumbnailUrl: thumb?.url ?? images[0]?.url,
  };
}

function mapSaleStatus(code?: string): Festival["onSaleStatus"] {
  switch (code) {
    case "onsale":
      return "onsale";
    case "offsale":
      return "offsale";
    case "cancelled":
    case "postponed":
      return "offsale";
    default:
      return "upcoming";
  }
}

function isFestival(event: TMEvent): boolean {
  const name = event.name.toLowerCase();
  const festivalKeywords = ["festival", "fest ", "fest.", "fête", "fete"];
  if (festivalKeywords.some((kw) => name.includes(kw))) return true;

  // Check classification type
  if (event.classifications?.some((c) => c.segment?.name === "Music")) {
    // Multi-day events are likely festivals
    if (event.dates?.start?.localDate && event.dates?.end?.localDate) {
      return event.dates.start.localDate !== event.dates.end.localDate;
    }
  }

  return false;
}

function normalizeEvent(event: TMEvent, countryCode: Country): Festival | null {
  const venue = event._embedded?.venues?.[0];
  if (!venue?.location?.latitude || !venue?.location?.longitude) return null;

  const city = venue.city?.name;
  if (!city) return null;

  // Extract genres
  const genres = (event.classifications ?? [])
    .map((c) => c.genre?.name)
    .filter((n): n is string => !!n && n !== "Undefined")
    .map(mapTicketmasterGenre);

  const uniqueGenres = [...new Set(genres)];
  if (uniqueGenres.length === 0) uniqueGenres.push("other");

  // Extract artists
  const attractions = event._embedded?.attractions ?? [];
  const artists: Artist[] = attractions.map((a) => {
    const artistGenres = (a.classifications ?? [])
      .map((c) => c.genre?.name)
      .filter((n): n is string => !!n && n !== "Undefined")
      .map(mapTicketmasterGenre);

    return {
      id: slugify(a.name),
      name: a.name,
      imageUrl: a.images?.[0]?.url,
      genres: [...new Set(artistGenres)],
    };
  });

  const { imageUrl, thumbnailUrl } = pickBestImage(event.images);

  const startDate = event.dates?.start?.localDate ?? "";
  const endDate = event.dates?.end?.localDate ?? startDate;

  if (!startDate) return null;

  const slug = slugify(`${event.name}-${city}-2026`);
  const searchableText = [
    event.name,
    city,
    ...artists.map((a) => a.name),
    ...uniqueGenres,
  ]
    .join(" ")
    .toLowerCase();

  const priceRange = event.priceRanges?.[0];

  return {
    id: `tm-${event.id}`,
    name: event.name,
    slug,
    description: event.info || event.pleaseNote,
    startDate,
    endDate,
    venue: {
      name: venue.name,
      address: venue.address?.line1,
      city,
      region: venue.state?.name,
      country: countryCode,
      countryName: COUNTRY_LABELS[countryCode],
      postalCode: venue.postalCode,
      coordinates: {
        lat: parseFloat(venue.location.latitude),
        lng: parseFloat(venue.location.longitude),
      },
    },
    genres: uniqueGenres,
    lineup: artists,
    headliners: artists.slice(0, 5),
    imageUrl,
    thumbnailUrl,
    images: (event.images ?? []).map((i) => i.url),
    ticketUrl: event.url,
    priceRange: priceRange
      ? {
          min: priceRange.min,
          max: priceRange.max,
          currency: priceRange.currency ?? "EUR",
        }
      : undefined,
    onSaleStatus: mapSaleStatus(event.dates?.status?.code),
    websiteUrl: event.url,
    source: "ticketmaster",
    sourceId: event.id,
    lastUpdated: new Date().toISOString(),
    searchableText,
  };
}

async function fetchCountry(countryCode: Country): Promise<Festival[]> {
  const apiKey = getApiKey();
  const festivals: Festival[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages && page < 10) {
    const params = new URLSearchParams({
      apikey: apiKey,
      keyword: "festival",
      classificationName: "music",
      countryCode,
      startDateTime: `${SUMMER_2026.start}T00:00:00Z`,
      endDateTime: `${SUMMER_2026.end}T23:59:59Z`,
      size: "200",
      page: String(page),
      sort: "date,asc",
    });

    const url = `${BASE_URL}?${params}`;

    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.status === 429) {
        // Rate limited — wait and retry
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      if (!res.ok) {
        console.error(`Ticketmaster API error for ${countryCode}: ${res.status}`);
        break;
      }

      const data: TMResponse = await res.json();
      totalPages = data.page?.totalPages ?? 1;

      const events = data._embedded?.events ?? [];
      for (const event of events) {
        if (isFestival(event)) {
          const festival = normalizeEvent(event, countryCode);
          if (festival) festivals.push(festival);
        }
      }
    } catch (error) {
      console.error(`Failed to fetch Ticketmaster for ${countryCode}:`, error);
      break;
    }

    page++;

    // Rate limit: 5 req/s — wait 250ms between requests
    await new Promise((r) => setTimeout(r, 250));
  }

  return festivals;
}

export async function fetchTicketmasterFestivals(): Promise<Festival[]> {
  const results = await Promise.allSettled(
    TARGET_COUNTRIES.map((country) => fetchCountry(country))
  );

  const festivals: Festival[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      festivals.push(...result.value);
    } else {
      console.error("Ticketmaster fetch failed for a country:", result.reason);
    }
  }

  console.log(`[Ticketmaster] Fetched ${festivals.length} festivals`);
  return festivals;
}
