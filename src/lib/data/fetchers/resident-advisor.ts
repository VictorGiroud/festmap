import type { Festival, Artist, Country } from "../../types";
import { slugify } from "../../utils";
import { COUNTRY_LABELS } from "../../constants";

// RA country URL slugs
const RA_COUNTRIES: { code: Country; slug: string }[] = [
  { code: "FR", slug: "france" },
  { code: "BE", slug: "belgium" },
  { code: "CH", slug: "switzerland" },
  { code: "DE", slug: "germany" },
  { code: "ES", slug: "spain" },
  { code: "IT", slug: "italy" },
  { code: "GB", slug: "uk" },
];

interface SchemaEvent {
  "@type"?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    "@type"?: string;
    name?: string;
    address?: {
      addressLocality?: string;
      addressCountry?: string;
    };
    geo?: {
      latitude?: number | string;
      longitude?: number | string;
    };
  };
  performer?: Array<{ name?: string }> | { name?: string };
  image?: string | string[];
  url?: string;
  description?: string;
  offers?: {
    url?: string;
  };
}

function extractLdJson(html: string): SchemaEvent[] {
  const events: SchemaEvent[] = [];
  const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      // Can be a single object or an array
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (
          item["@type"] === "MusicEvent" ||
          item["@type"] === "Festival" ||
          item["@type"] === "Event"
        ) {
          events.push(item);
        }
      }
    } catch {
      // Skip malformed JSON-LD
    }
  }

  return events;
}

function normalizeSchemaEvent(event: SchemaEvent, countryCode: Country): Festival | null {
  if (!event.name || !event.startDate) return null;

  const city =
    event.location?.address?.addressLocality ?? "Unknown";

  const lat = event.location?.geo?.latitude;
  const lng = event.location?.geo?.longitude;
  if (!lat || !lng) return null;

  const performers = Array.isArray(event.performer)
    ? event.performer
    : event.performer
      ? [event.performer]
      : [];

  const artists: Artist[] = performers
    .filter((p) => p.name)
    .map((p) => ({
      id: slugify(p.name!),
      name: p.name!,
      genres: ["electronic"],
    }));

  const startDate = event.startDate.substring(0, 10);
  const endDate = event.endDate ? event.endDate.substring(0, 10) : startDate;

  // Only keep summer 2026
  if (!startDate.startsWith("2026-")) return null;
  const month = parseInt(startDate.split("-")[1], 10);
  if (month < 5 || month > 9) return null;

  const slug = slugify(`${event.name}-${city}-2026`);
  const imageUrl = Array.isArray(event.image) ? event.image[0] : event.image;

  return {
    id: `ra-${slug}`,
    name: event.name,
    slug,
    description: event.description,
    startDate,
    endDate,
    venue: {
      name: event.location?.name ?? city,
      city,
      country: countryCode,
      countryName: COUNTRY_LABELS[countryCode],
      coordinates: {
        lat: typeof lat === "string" ? parseFloat(lat) : lat,
        lng: typeof lng === "string" ? parseFloat(lng) : lng,
      },
    },
    genres: ["electronic"],
    lineup: artists,
    headliners: artists.slice(0, 5),
    imageUrl,
    images: imageUrl ? [imageUrl] : [],
    ticketUrl: event.offers?.url ?? event.url,
    websiteUrl: event.url,
    source: "resident-advisor",
    sourceId: slug,
    lastUpdated: new Date().toISOString(),
    searchableText: [event.name, city, ...artists.map((a) => a.name), "electronic"]
      .join(" ")
      .toLowerCase(),
  };
}

async function fetchCountryRA(country: { code: Country; slug: string }): Promise<Festival[]> {
  const festivals: Festival[] = [];

  try {
    // Fetch the events listing page
    const url = `https://ra.co/events/${country.slug}?week=2026-06-01`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FestMap2026/1.0 (festival-aggregator)",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`RA returned ${res.status} for ${country.slug}`);
      return [];
    }

    const html = await res.text();
    const events = extractLdJson(html);

    for (const event of events) {
      const festival = normalizeSchemaEvent(event, country.code);
      if (festival) festivals.push(festival);
    }
  } catch (error) {
    console.error(`Failed to fetch RA for ${country.slug}:`, error);
  }

  return festivals;
}

export async function fetchResidentAdvisorFestivals(): Promise<Festival[]> {
  // Fetch countries sequentially to be respectful of RA servers
  const festivals: Festival[] = [];

  for (const country of RA_COUNTRIES) {
    const countryFestivals = await fetchCountryRA(country);
    festivals.push(...countryFestivals);
    // Rate limit: 1 request per 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`[Resident Advisor] Fetched ${festivals.length} festivals`);
  return festivals;
}
