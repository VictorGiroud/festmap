"use client";

import { useFilters } from "@/hooks/useFilters";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { ALL_GENRES } from "@/lib/constants";
import type { Genre } from "@/lib/types";

export function GenreFilter() {
  const { filters, toggleGenre } = useFilters();
  const activeGenres = filters.genres ?? [];

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_GENRES.map((genre: Genre) => (
        <NeonBadge
          key={genre}
          genre={genre}
          size="md"
          active={activeGenres.includes(genre)}
          onClick={() => toggleGenre(genre)}
        />
      ))}
    </div>
  );
}
