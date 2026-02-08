import type { Festival, FestivalDataset, Genre, Country } from "../types";
import { ALL_GENRES, TARGET_COUNTRIES } from "../constants";
import { fetchManualFestivals } from "./fetchers/manual";

function festivalFingerprint(f: {
  name: string;
  city: string;
  startDate: string;
}): string {
  const normalizedName = f.name
    .toLowerCase()
    .replace(/festival|fest |fest\.|fête|fete|edition|\d{4}/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
  const normalizedCity = f.city.toLowerCase().replace(/[^a-z]/g, "");
  const month = f.startDate.substring(0, 7); // YYYY-MM
  return `${normalizedName}-${normalizedCity}-${month}`;
}

function mergeFestivals(primary: Festival, secondary: Festival): Festival {
  return {
    ...primary,
    // Keep primary data but enrich from secondary
    description: primary.description || secondary.description,
    lineup:
      primary.lineup.length > 0 ? primary.lineup : secondary.lineup,
    headliners:
      primary.headliners.length > 0 ? primary.headliners : secondary.headliners,
    lineupByDay: primary.lineupByDay || secondary.lineupByDay,
    imageUrl: primary.imageUrl || secondary.imageUrl,
    thumbnailUrl: primary.thumbnailUrl || secondary.thumbnailUrl,
    images: [...new Set([...primary.images, ...secondary.images])],
    ticketUrl: primary.ticketUrl || secondary.ticketUrl,
    websiteUrl: primary.websiteUrl || secondary.websiteUrl,
    genres: [...new Set([...primary.genres, ...secondary.genres])],
    searchableText: [primary.searchableText, secondary.searchableText]
      .join(" ")
      .toLowerCase(),
  };
}

function deduplicateAndMerge(allFestivals: Festival[]): Festival[] {
  const fingerprints = new Map<string, Festival>();

  // Source priority: manual > ticketmaster > resident-advisor > music-festival-wizard > data-culture-gouv
  const sourcePriority: Record<string, number> = {
    manual: 5,
    ticketmaster: 4,
    "resident-advisor": 3,
    "music-festival-wizard": 2,
    "data-culture-gouv": 1,
  };

  // Sort by source priority descending so higher priority sources get inserted first
  const sorted = [...allFestivals].sort(
    (a, b) =>
      (sourcePriority[b.source] ?? 0) - (sourcePriority[a.source] ?? 0)
  );

  for (const festival of sorted) {
    const fp = festivalFingerprint({
      name: festival.name,
      city: festival.venue.city,
      startDate: festival.startDate,
    });

    const existing = fingerprints.get(fp);
    if (existing) {
      // Merge: existing is higher priority, festival enriches it
      fingerprints.set(fp, mergeFestivals(existing, festival));
    } else {
      fingerprints.set(fp, festival);
    }
  }

  return [...fingerprints.values()];
}

function computeStats(
  festivals: Festival[]
): Pick<FestivalDataset, "genreCounts" | "countryCounts"> {
  const genreCounts = {} as Record<Genre, number>;
  for (const g of ALL_GENRES) genreCounts[g] = 0;

  const countryCounts = {} as Record<Country, number>;
  for (const c of TARGET_COUNTRIES) countryCounts[c] = 0;

  for (const f of festivals) {
    for (const g of f.genres) {
      genreCounts[g] = (genreCounts[g] ?? 0) + 1;
    }
    countryCounts[f.venue.country] = (countryCounts[f.venue.country] ?? 0) + 1;
  }

  return { genreCounts, countryCounts };
}

export async function runNormalizationPipeline(): Promise<FestivalDataset> {
  console.log("[Pipeline] Starting festival data refresh...");

  // Curated dataset only — API sources disabled (low quality for our needs).
  const allFestivals: Festival[] = fetchManualFestivals();

  console.log(`[Pipeline] Raw total: ${allFestivals.length} festivals`);

  // Deduplicate and merge
  const deduplicated = deduplicateAndMerge(allFestivals);

  // Filter out festivals with no valid coordinates (except from MFW which we geocode later)
  const withLocation = deduplicated.filter(
    (f) =>
      (f.venue.coordinates.lat !== 0 && f.venue.coordinates.lng !== 0) ||
      f.source === "music-festival-wizard"
  );

  // Quality filter: keep only festivals with a real lineup (at least 1 artist).
  // This eliminates data.culture.gouv entries (no lineup) while keeping
  // festivals that have at least one performer listed on Ticketmaster.
  const majorFestivals = withLocation.filter(
    (f) => f.lineup.length >= 1
  );

  console.log(
    `[Pipeline] Quality filter: ${majorFestivals.length} / ${withLocation.length} festivals with lineup >= 1 artist`
  );

  // Sort by start date
  majorFestivals.sort((a, b) => a.startDate.localeCompare(b.startDate));

  // Ensure unique slugs
  const slugCounts = new Map<string, number>();
  for (const f of majorFestivals) {
    const count = slugCounts.get(f.slug) ?? 0;
    if (count > 0) {
      f.slug = `${f.slug}-${count + 1}`;
    }
    slugCounts.set(f.slug, count + 1);
  }

  const stats = computeStats(majorFestivals);

  const dataset: FestivalDataset = {
    festivals: majorFestivals,
    lastRefreshed: new Date().toISOString(),
    totalCount: majorFestivals.length,
    ...stats,
  };

  console.log(
    `[Pipeline] Final: ${dataset.totalCount} major festivals`
  );

  return dataset;
}
