"use client";

import { useState, useCallback } from "react";
import { useFilters } from "@/hooks/useFilters";
import { SearchInput } from "@/components/ui/SearchInput";

export function ArtistSearchFilter() {
  const { filters, setFilters } = useFilters();
  const [localValue, setLocalValue] = useState(filters.artistQuery ?? "");

  const handleChange = useCallback(
    (value: string) => {
      setLocalValue(value);
      // Debounce: apply filter after user stops typing
      const timer = setTimeout(() => {
        setFilters({ artistQuery: value || undefined });
      }, 300);
      return () => clearTimeout(timer);
    },
    [setFilters]
  );

  return (
    <SearchInput
      value={localValue}
      onChange={handleChange}
      placeholder="Rechercher un artiste ou festival..."
      className="w-full sm:w-64"
    />
  );
}
