"use client";

import { FestivalCard } from "./FestivalCard";
import type { Festival } from "@/lib/types";

interface FestivalGridProps {
  festivals: Festival[];
}

export function FestivalGrid({ festivals }: FestivalGridProps) {
  if (festivals.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">{"🎶"}</p>
        <p className="text-text-secondary font-mono text-sm">
          Aucun festival trouvé avec ces filtres
        </p>
        <p className="text-text-muted text-xs mt-2">
          Essaye d&apos;ajuster tes critères de recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {festivals.map((festival) => (
        <FestivalCard key={festival.id} festival={festival} />
      ))}
    </div>
  );
}
