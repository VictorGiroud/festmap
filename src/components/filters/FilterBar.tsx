"use client";

import { Suspense } from "react";
import { GenreFilter } from "./GenreFilter";
import { DateRangeFilter } from "./DateRangeFilter";
import { LocationFilter } from "./LocationFilter";
import { ArtistSearchFilter } from "./ArtistSearchFilter";
import { GimsToggle } from "./GimsToggle";
import { ActiveFilters } from "./ActiveFilters";

function FilterBarContent() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <ArtistSearchFilter />
        <DateRangeFilter />
        <LocationFilter />
        <GimsToggle />
      </div>
      <GenreFilter />
      <ActiveFilters />
    </div>
  );
}

export function FilterBar() {
  return (
    <div className="mb-8 p-4 rounded-xl bg-bg-secondary/50 border border-border-subtle">
      <Suspense>
        <FilterBarContent />
      </Suspense>
    </div>
  );
}
