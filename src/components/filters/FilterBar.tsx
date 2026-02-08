"use client";

import { Suspense, useState } from "react";
import { GenreFilter } from "./GenreFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { LocationFilter } from "./LocationFilter";
import { ArtistSearchFilter } from "./ArtistSearchFilter";
import { ArtistSelectFilter } from "./ArtistSelectFilter";
import { GimsToggle } from "./GimsToggle";
import { ActiveFilters } from "./ActiveFilters";
import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";

function FilterBarContent() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <ArtistSearchFilter />
        <ArtistSelectFilter />
        <DateRangeFilter />
        <LocationFilter />
        <GimsToggle />
      </div>
      <GenreFilter />
      <ActiveFilters />
    </div>
  );
}

function MobileFilterBadge() {
  const { filters } = useFilters();
  let count = 0;
  if (filters.genres?.length) count += filters.genres.length;
  if (filters.artists?.length) count += filters.artists.length;
  if (filters.artistQuery) count++;
  if (filters.dateFrom) count++;
  if (filters.dateTo) count++;
  if (filters.countries?.length) count += filters.countries.length;
  if (filters.inFrance !== undefined) count++;
  if (filters.gims) count++;

  if (count === 0) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold">
      {count}
    </span>
  );
}

export function FilterBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-bg-secondary/50 border border-border-subtle">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center gap-2 w-full text-sm font-mono text-text-secondary"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        Filtres
        <Suspense>
          <MobileFilterBadge />
        </Suspense>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            "ml-auto transition-transform",
            open && "rotate-180"
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Desktop: always visible / Mobile: collapsible */}
      <div className={cn("md:block", open ? "block mt-3" : "hidden")}>
        <Suspense>
          <FilterBarContent />
        </Suspense>
      </div>
    </div>
  );
}
