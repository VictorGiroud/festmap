"use client";

import { useMemo } from "react";
import { useFilters } from "./useFilters";
import { applyFilters } from "@/lib/filters";
import type { Festival, FestivalDataset, Genre } from "@/lib/types";

export function useFestivals(dataset: FestivalDataset) {
  const { filters, setFilters, clearFilters, toggleGenre } = useFilters();

  const filteredFestivals = useMemo(
    () => applyFilters(dataset.festivals, filters),
    [dataset.festivals, filters]
  );

  // Group by all genres (a festival appears in every matching section)
  const byGenre = useMemo(() => {
    const map = new Map<Genre, Festival[]>();
    for (const f of filteredFestivals) {
      const genres = f.genres.length > 0 ? f.genres : (["other"] as Genre[]);
      for (const g of genres) {
        if (!map.has(g)) map.set(g, []);
        map.get(g)!.push(f);
      }
    }
    // Sort by group size descending
    return new Map(
      [...map.entries()].sort((a, b) => b[1].length - a[1].length)
    );
  }, [filteredFestivals]);

  return {
    festivals: filteredFestivals,
    byGenre,
    totalCount: filteredFestivals.length,
    allCount: dataset.totalCount,
    filters,
    setFilters,
    clearFilters,
    toggleGenre,
  };
}
