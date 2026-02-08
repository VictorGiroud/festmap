import type { Festival, Artist } from "../../types";
import { mapDataCultureGenre } from "../genre-mapper";
import { slugify } from "../../utils";

const BASE_URL =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/festivals-global-festivals-_-pl/records";

interface DataCultureRecord {
  nom_du_festival?: string;
  commune_principale_de_deroulement?: string;
  region_principale_de_deroulement?: string;
  departement_principal_de_deroulement?: string;
  geocodage_xy?: { lat: number; lon: number };
  sous_categorie_musique?: string;
  sous_categorie_musique_cnm?: string;
  site_internet_du_festival?: string;
  periode_principale_de_deroulement_du_festival?: string;
}

// Map period strings to approximate 2026 dates
function periodToDateRange(period?: string): { startDate: string; endDate: string } | null {
  if (!period) return null;

  const lower = period.toLowerCase();

  // Default summer dates if we can't parse
  const periodMap: Record<string, { start: string; end: string }> = {
    janvier: { start: "2026-01-15", end: "2026-01-17" },
    fevrier: { start: "2026-02-15", end: "2026-02-17" },
    mars: { start: "2026-03-15", end: "2026-03-17" },
    avril: { start: "2026-04-15", end: "2026-04-17" },
    mai: { start: "2026-05-15", end: "2026-05-17" },
    juin: { start: "2026-06-15", end: "2026-06-17" },
    juillet: { start: "2026-07-15", end: "2026-07-17" },
    aout: { start: "2026-08-15", end: "2026-08-17" },
    septembre: { start: "2026-09-15", end: "2026-09-17" },
  };

  for (const [month, dates] of Object.entries(periodMap)) {
    if (lower.includes(month)) {
      return { startDate: dates.start, endDate: dates.end };
    }
  }

  // "Ete" / summer
  if (lower.includes("ete") || lower.includes("été")) {
    return { startDate: "2026-07-01", endDate: "2026-07-03" };
  }

  return null;
}

function normalizeRecord(record: DataCultureRecord): Festival | null {
  const name = record.nom_du_festival;
  if (!name) return null;

  const city = record.commune_principale_de_deroulement;
  if (!city) return null;

  const geo = record.geocodage_xy;
  if (!geo?.lat || !geo?.lon) return null;

  const dates = periodToDateRange(record.periode_principale_de_deroulement_du_festival);
  if (!dates) return null;

  // Only keep festivals in summer range (May-September)
  const month = parseInt(dates.startDate.split("-")[1], 10);
  if (month < 5 || month > 9) return null;

  const genreStr = record.sous_categorie_musique ?? record.sous_categorie_musique_cnm ?? "";
  const genres = genreStr
    .split(",")
    .map((g) => mapDataCultureGenre(g.trim()))
    .filter((g, i, arr) => arr.indexOf(g) === i);

  if (genres.length === 0) genres.push("other");

  const slug = slugify(`${name}-${city}-2026`);

  const lineup: Artist[] = [];

  return {
    id: `dc-${slug}`,
    name,
    slug,
    startDate: dates.startDate,
    endDate: dates.endDate,
    venue: {
      name: city,
      city,
      region: record.region_principale_de_deroulement,
      country: "FR",
      countryName: "France",
      coordinates: { lat: geo.lat, lng: geo.lon },
    },
    genres,
    lineup,
    headliners: [],
    images: [],
    websiteUrl: record.site_internet_du_festival,
    source: "data-culture-gouv",
    sourceId: slug,
    lastUpdated: new Date().toISOString(),
    searchableText: [name, city, ...genres].join(" ").toLowerCase(),
  };
}

export async function fetchDataCultureFestivals(): Promise<Festival[]> {
  const festivals: Festival[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      where: "sous_categorie_musique is not null",
    });

    try {
      const res = await fetch(`${BASE_URL}?${params}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      });

      if (!res.ok) {
        console.error(`data.culture.gouv.fr API error: ${res.status}`);
        break;
      }

      const data = await res.json();
      const records: DataCultureRecord[] = data.results ?? [];

      if (records.length === 0) break;

      for (const record of records) {
        const festival = normalizeRecord(record);
        if (festival) festivals.push(festival);
      }

      offset += limit;

      if (records.length < limit) break;
    } catch (error) {
      console.error("Failed to fetch data.culture.gouv.fr:", error);
      break;
    }
  }

  console.log(`[data.culture.gouv.fr] Fetched ${festivals.length} festivals`);
  return festivals;
}
