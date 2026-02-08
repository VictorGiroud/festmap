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

  // Group by primary genre
  const byGenre = useMemo(() => {
    const map = new Map<Genre, Festival[]>();
    for (const f of filteredFestivals) {
      const primary = f.genres[0] ?? "other";
      if (!map.has(primary)) map.set(primary, []);
      map.get(primary)!.push(f);
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
