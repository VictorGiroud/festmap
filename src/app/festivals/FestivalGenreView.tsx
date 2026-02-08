"use client";

import { useState, useEffect, useRef } from "react";
import { useFestivals } from "@/hooks/useFestivals";
import { FilterBar } from "@/components/filters/FilterBar";
import { GenreSection } from "@/components/festivals/GenreSection";
import { FestivalGrid } from "@/components/festivals/FestivalGrid";
import { ShareButton } from "@/components/ui/ShareButton";
import { GimsOverlay } from "@/components/gims/GimsOverlay";
import type { FestivalDataset, Genre } from "@/lib/types";

type ViewMode = "genre" | "grid";

interface Props {
  dataset: FestivalDataset;
}

export function FestivalGenreView({ dataset }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("genre");
  const { festivals, byGenre, totalCount, allCount, filters, setFilters } =
    useFestivals(dataset);

  // Gims animation: trigger when filters.gims goes from false to true
  const [gimsAnimating, setGimsAnimating] = useState(false);
  const prevGims = useRef(filters.gims);

  useEffect(() => {
    if (filters.gims && !prevGims.current) {
      setGimsAnimating(true);
      const timer = setTimeout(() => setGimsAnimating(false), 7500);
      return () => clearTimeout(timer);
    }
    prevGims.current = filters.gims;
  }, [filters.gims]);

  return (
    <>
      <GimsOverlay isAnimating={gimsAnimating} />

      <FilterBar />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs text-text-muted">
          {totalCount === allCount
            ? `${totalCount} festivals`
            : `${totalCount} / ${allCount} festivals`}
        </p>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-border-subtle overflow-hidden">
            <button
              onClick={() => setViewMode("genre")}
              className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                viewMode === "genre"
                  ? "bg-neon-pink/15 text-neon-pink"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Par genre
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-xs font-mono border-l border-border-subtle transition-colors ${
                viewMode === "grid"
                  ? "bg-neon-pink/15 text-neon-pink"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Grille
            </button>
          </div>

          <ShareButton />
        </div>
      </div>

      {/* Content */}
      {viewMode === "genre" ? (
        <div>
          {[...byGenre.entries()].map(([genre, genreFestivals]) => (
            <GenreSection
              key={genre}
              genre={genre as Genre}
              festivals={genreFestivals}
            />
          ))}
          {byGenre.size === 0 && <FestivalGrid festivals={[]} />}
        </div>
      ) : (
        <FestivalGrid festivals={festivals} />
      )}
    </>
  );
}
