import { Suspense } from "react";
import { getCachedDataset } from "@/lib/data/cache";
import { MapViewClient } from "./MapViewClient";

export const revalidate = 3600;

export const metadata = {
  title: "Carte des festivals",
  description:
    "Carte interactive de tous les festivals de musique de l'été 2026 en France et en Europe.",
};

export default async function MapPage() {
  const dataset = await getCachedDataset();

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <p className="text-text-secondary font-mono">
          Chargement de la carte...
        </p>
      </div>
    );
  }

  return (
    <Suspense>
      <MapViewClient dataset={dataset} />
    </Suspense>
  );
}
