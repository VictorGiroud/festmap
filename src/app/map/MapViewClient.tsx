"use client";

import dynamic from "next/dynamic";
import { useFestivals } from "@/hooks/useFestivals";
import { FilterBar } from "@/components/filters/FilterBar";
import { FestivalDataProvider } from "@/contexts/FestivalDataContext";
import type { FestivalDataset } from "@/lib/types";

const FestivalMap = dynamic(
  () =>
    import("@/components/map/FestivalMap").then((mod) => mod.FestivalMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
        <p className="font-mono text-text-muted text-sm animate-glow-pulse">
          Chargement de la carte...
        </p>
      </div>
    ),
  }
);

interface Props {
  dataset: FestivalDataset;
}

export function MapViewClient({ dataset }: Props) {
  const { festivals, totalCount } = useFestivals(dataset);

  return (
    <FestivalDataProvider festivals={dataset.festivals}>
      <div className="relative h-[calc(100vh-64px)]">
        {/* Map */}
        <FestivalMap festivals={festivals} />

        {/* Filter overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 max-w-2xl">
          <div className="glass rounded-xl p-3">
            <FilterBar />
          </div>
          <p className="font-mono text-[10px] text-text-muted mt-2 ml-1">
            {totalCount} festival{totalCount > 1 ? "s" : ""} sur la carte
          </p>
        </div>
      </div>
    </FestivalDataProvider>
  );
}
