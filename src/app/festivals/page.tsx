import { Suspense } from "react";
import { getCachedDataset } from "@/lib/data/cache";
import { FestivalGenreView } from "./FestivalGenreView";

export const revalidate = 3600;

export const metadata = {
  title: "Festivals par genre",
  description:
    "Parcourez tous les festivals de musique de l'été 2026 classés par genre musical.",
};

export default async function FestivalsPage() {
  const dataset = await getCachedDataset();

  if (!dataset) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">{"🔄"}</p>
        <p className="text-text-secondary font-mono">
          Les données sont en cours de chargement...
        </p>
        <p className="text-text-muted text-xs mt-2">
          Le premier chargement peut prendre quelques instants.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl md:text-4xl tracking-wider">
          <span className="text-neon-pink text-glow-pink">Festivals</span>{" "}
          <span className="text-text-primary">Été 2026</span>
        </h1>
        <p className="text-text-secondary mt-2 font-mono text-sm">
          {dataset.totalCount} festivals en France et en Europe
        </p>
      </div>

      <Suspense>
        <FestivalGenreView dataset={dataset} />
      </Suspense>
    </div>
  );
}
