import { Suspense } from "react";
import { getCachedDataset } from "@/lib/data/cache";
import { CalendarView } from "./CalendarView";

export const revalidate = 3600;

export const metadata = {
  title: "Agenda des festivals",
  description:
    "Vue calendrier de tous les festivals de musique de l'été 2026.",
};

export default async function CalendarPage() {
  const dataset = await getCachedDataset();

  if (!dataset) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">
          Chargement des données...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl md:text-4xl tracking-wider">
          <span className="text-neon-cyan text-glow-cyan">Agenda</span>{" "}
          <span className="text-text-primary">Été 2026</span>
        </h1>
        <p className="text-text-secondary mt-2 font-mono text-sm">
          Timeline des festivals de mai à septembre 2026
        </p>
      </div>

      <Suspense>
        <CalendarView dataset={dataset} />
      </Suspense>
    </div>
  );
}
