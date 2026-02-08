import type { Festival, Country } from "../../types";
import { slugify } from "../../utils";
import { inferGenreFromText } from "../genre-mapper";
import { COUNTRY_LABELS } from "../../constants";

// MFW country page URLs
const MFW_PAGES: { url: string; country: Country }[] = [
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/france-festivals/",
    country: "FR",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/belgium-festivals/",
    country: "BE",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/switzerland-festivals/",
    country: "CH",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/germany-festivals/",
    country: "DE",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/spain-festivals/",
    country: "ES",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/italy-festivals/",
    country: "IT",
  },
  {
    url: "https://www.musicfestivalwizard.com/festival-guide/uk-festivals/",
    country: "GB",
  },
];

interface ParsedFestival {
  name: string;
  dateText: string;
  location: string;
  genres: string[];
  url?: string;
  imageUrl?: string;
}

function parseFestivalListing(html: string): ParsedFestival[] {
  const festivals: ParsedFestival[] = [];

  // MFW uses a structured listing with festival cards
  // Parse using regex patterns for the festival entries
  const entryPattern =
    /<article[^>]*class="[^"]*festivalListing[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let match;

  while ((match = entryPattern.exec(html)) !== null) {
    const block = match[1];

    // Extract name
    const nameMatch = block.match(/<h2[^>]*>\s*<a[^>]*>(.*?)<\/a>/i);
    const name = nameMatch?.[1]?.replace(/<[^>]+>/g, "").trim();
    if (!name) continue;

    // Extract URL
    const urlMatch = block.match(/<h2[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>/i);
    const url = urlMatch?.[1];

    // Extract date text
    const dateMatch = block.match(
      /<span[^>]*class="[^"]*festivalDate[^"]*"[^>]*>(.*?)<\/span>/i
    );
    const dateText = dateMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";

    // Extract location
    const locationMatch = block.match(
      /<span[^>]*class="[^"]*festivalLocation[^"]*"[^>]*>(.*?)<\/span>/i
    );
    const location = locationMatch?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";

    // Extract genre tags
    const genreMatches = block.matchAll(
      /<span[^>]*class="[^"]*festivalGenre[^"]*"[^>]*>(.*?)<\/span>/gi
    );
    const genres = [...genreMatches].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim()
    );

    // Extract image
    const imgMatch = block.match(/<img[^>]*src="([^"]*)"[^>]*>/i);
    const imageUrl = imgMatch?.[1];

    festivals.push({ name, dateText, location, genres, url, imageUrl });
  }

  return festivals;
}

function parseDateText(dateText: string): { startDate: string; endDate: string } | null {
  // MFW dates come in formats like:
  // "June 12 - 15, 2026"
  // "July 3-5, 2026"
  // "August 21, 2026"

  // Check if it mentions 2026
  if (!dateText.includes("2026")) return null;

  const monthNames: Record<string, string> = {
    january: "01", february: "02", march: "03", april: "04",
    may: "05", june: "06", july: "07", august: "08",
    september: "09", october: "10", november: "11", december: "12",
  };

  const lower = dateText.toLowerCase();
  let month = "";
  for (const [name, num] of Object.entries(monthNames)) {
    if (lower.includes(name)) {
      month = num;
      break;
    }
  }
  if (!month) return null;

  // Extract day numbers
  const dayNumbers = dateText.match(/\d+/g)?.map(Number) ?? [];
  if (dayNumbers.length === 0) return null;

  // Last number is likely 2026
  const filteredDays = dayNumbers.filter((d) => d < 32);
  if (filteredDays.length === 0) return null;

  const startDay = String(filteredDays[0]).padStart(2, "0");
  const endDay =
    filteredDays.length > 1
      ? String(filteredDays[filteredDays.length - 1]).padStart(2, "0")
      : startDay;

  return {
    startDate: `2026-${month}-${startDay}`,
    endDate: `2026-${month}-${endDay}`,
  };
}

function normalizedParsed(
  parsed: ParsedFestival,
  country: Country
): Festival | null {
  const dates = parseDateText(parsed.dateText);
  if (!dates) return null;

  // Only keep summer (May-Sept)
  const month = parseInt(dates.startDate.split("-")[1], 10);
  if (month < 5 || month > 9) return null;

  const genres =
    parsed.genres.length > 0
      ? inferGenreFromText(parsed.genres.join(" "))
      : inferGenreFromText(parsed.name);

  const city = parsed.location || "Unknown";
  const slug = slugify(`${parsed.name}-${city}-2026`);

  return {
    id: `mfw-${slug}`,
    name: parsed.name,
    slug,
    startDate: dates.startDate,
    endDate: dates.endDate,
    venue: {
      name: city,
      city,
      country,
      countryName: COUNTRY_LABELS[country],
      coordinates: { lat: 0, lng: 0 }, // MFW doesn't provide coordinates
    },
    genres,
    lineup: [],
    headliners: [],
    imageUrl: parsed.imageUrl,
    images: parsed.imageUrl ? [parsed.imageUrl] : [],
    websiteUrl: parsed.url,
    source: "music-festival-wizard",
    sourceId: slug,
    lastUpdated: new Date().toISOString(),
    searchableText: [parsed.name, city, ...genres].join(" ").toLowerCase(),
  };
}

async function fetchCountryMFW(page: { url: string; country: Country }): Promise<Festival[]> {
  try {
    const res = await fetch(page.url, {
      headers: {
        "User-Agent": "FestMap2026/1.0 (festival-aggregator)",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.warn(`MFW returned ${res.status} for ${page.country}`);
      return [];
    }

    const html = await res.text();
    const parsed = parseFestivalListing(html);

    return parsed
      .map((p) => normalizedParsed(p, page.country))
      .filter((f): f is Festival => f !== null);
  } catch (error) {
    console.error(`Failed to fetch MFW for ${page.country}:`, error);
    return [];
  }
}

export async function fetchMusicFestivalWizardFestivals(): Promise<Festival[]> {
  const festivals: Festival[] = [];

  for (const page of MFW_PAGES) {
    const pageFestivals = await fetchCountryMFW(page);
    festivals.push(...pageFestivals);
    // Rate limit
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`[Music Festival Wizard] Fetched ${festivals.length} festivals`);
  return festivals;
}
