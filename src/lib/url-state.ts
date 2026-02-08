import type { FestivalFilters, Genre, Country } from "./types";

export function filtersToSearchParams(
  filters: FestivalFilters
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.genres?.length) params.set("genres", filters.genres.join(","));
  if (filters.artists?.length) params.set("artists", filters.artists.join(","));
  if (filters.artistQuery) params.set("artist", filters.artistQuery);
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  if (filters.countries?.length)
    params.set("countries", filters.countries.join(","));
  if (filters.inFrance === true) params.set("france", "1");
  else if (filters.inFrance === false) params.set("france", "0");
  if (filters.gims) params.set("gims", "1");

  return params;
}

export function searchParamsToFilters(
  params: URLSearchParams
): FestivalFilters {
  return {
    genres: (params.get("genres")?.split(",") ?? undefined) as
      | Genre[]
      | undefined,
    artists: params.get("artists")?.split(",") ?? undefined,
    artistQuery: params.get("artist") ?? undefined,
    dateFrom: params.get("from") ?? undefined,
    dateTo: params.get("to") ?? undefined,
    countries: (params.get("countries")?.split(",") ?? undefined) as
      | Country[]
      | undefined,
    inFrance: params.has("france")
      ? params.get("france") === "1"
      : undefined,
    gims: params.get("gims") === "1",
  };
}
