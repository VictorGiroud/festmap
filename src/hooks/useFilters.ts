"use client";

import { useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  searchParamsToFilters,
  filtersToSearchParams,
} from "@/lib/url-state";
import type { FestivalFilters } from "@/lib/types";

export function useFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams]
  );

  const setFilters = useCallback(
    (update: Partial<FestivalFilters>) => {
      const merged = { ...filters, ...update };
      // Remove undefined/empty values
      const cleaned: FestivalFilters = {};
      if (merged.genres?.length) cleaned.genres = merged.genres;
      if (merged.artists?.length) cleaned.artists = merged.artists;
      if (merged.artistQuery) cleaned.artistQuery = merged.artistQuery;
      if (merged.dateFrom) cleaned.dateFrom = merged.dateFrom;
      if (merged.dateTo) cleaned.dateTo = merged.dateTo;
      if (merged.countries?.length) cleaned.countries = merged.countries;
      cleaned.inFrance = merged.inFrance;
      if (merged.gims) cleaned.gims = merged.gims;

      const params = filtersToSearchParams(cleaned);
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      window.history.pushState(null, "", url);
    },
    [filters, pathname]
  );

  const clearFilters = useCallback(() => {
    window.history.pushState(null, "", pathname);
  }, [pathname]);

  const toggleGenre = useCallback(
    (genre: string) => {
      const current = filters.genres ?? [];
      const next = current.includes(genre as never)
        ? current.filter((g) => g !== genre)
        : [...current, genre];
      setFilters({ genres: next.length > 0 ? (next as FestivalFilters["genres"]) : undefined });
    },
    [filters.genres, setFilters]
  );

  return { filters, setFilters, clearFilters, toggleGenre };
}
