import type { Festival, FestivalFilters } from "./types";

export function applyFilters(
  festivals: Festival[],
  filters: FestivalFilters
): Festival[] {
  return festivals.filter((f) => {
    // Genre filter
    if (filters.genres?.length) {
      if (!filters.genres.some((g) => f.genres.includes(g))) return false;
    }

    // Artist select filter
    if (filters.artists?.length) {
      const selected = new Set(filters.artists.map((a) => a.toLowerCase()));
      if (!f.lineup.some((a) => selected.has(a.name.toLowerCase()))) return false;
    }

    // Artist search
    if (filters.artistQuery) {
      const query = filters.artistQuery.toLowerCase();
      const hasArtist = f.lineup.some((a) =>
        a.name.toLowerCase().includes(query)
      );
      const nameMatch = f.name.toLowerCase().includes(query);
      if (!hasArtist && !nameMatch) return false;
    }

    // Date range
    if (filters.dateFrom && f.endDate < filters.dateFrom) return false;
    if (filters.dateTo && f.startDate > filters.dateTo) return false;

    // Country
    if (filters.countries?.length) {
      if (!filters.countries.includes(f.venue.country)) return false;
    }

    // France toggle
    if (filters.inFrance === true && f.venue.country !== "FR") return false;
    if (filters.inFrance === false && f.venue.country === "FR") return false;

    // Gims mode
    if (filters.gims) {
      const hasGims = f.lineup.some((a) => {
        const name = a.name.toLowerCase();
        return (
          name.includes("gims") ||
          name === "maitre gims" ||
          name === "ma\u00eetre gims"
        );
      });
      if (!hasGims) return false;
    }

    return true;
  });
}
