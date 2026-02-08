"use client";

import { useFilters } from "@/hooks/useFilters";
import { GENRE_LABELS, COUNTRY_LABELS } from "@/lib/constants";
import type { Genre, Country } from "@/lib/types";

export function ActiveFilters() {
  const { filters, setFilters, clearFilters } = useFilters();

  const chips: { label: string; onRemove: () => void }[] = [];

  // Genre chips
  for (const g of filters.genres ?? []) {
    chips.push({
      label: GENRE_LABELS[g as Genre] ?? g,
      onRemove: () =>
        setFilters({
          genres: (filters.genres ?? []).filter((x) => x !== g),
        }),
    });
  }

  // Artist select chips
  for (const a of filters.artists ?? []) {
    chips.push({
      label: a,
      onRemove: () =>
        setFilters({
          artists: (filters.artists ?? []).filter((x) => x !== a),
        }),
    });
  }

  // Artist chip
  if (filters.artistQuery) {
    chips.push({
      label: `Artiste: ${filters.artistQuery}`,
      onRemove: () => setFilters({ artistQuery: undefined }),
    });
  }

  // Date chips
  if (filters.dateFrom) {
    chips.push({
      label: `Depuis: ${filters.dateFrom}`,
      onRemove: () => setFilters({ dateFrom: undefined }),
    });
  }
  if (filters.dateTo) {
    chips.push({
      label: `Jusqu'à: ${filters.dateTo}`,
      onRemove: () => setFilters({ dateTo: undefined }),
    });
  }

  // Country chips
  for (const c of filters.countries ?? []) {
    chips.push({
      label: COUNTRY_LABELS[c as Country] ?? c,
      onRemove: () =>
        setFilters({
          countries: (filters.countries ?? []).filter((x) => x !== c),
        }),
    });
  }

  // France toggle
  if (filters.inFrance === true) {
    chips.push({
      label: "France uniquement",
      onRemove: () => setFilters({ inFrance: undefined }),
    });
  }
  if (filters.inFrance === false) {
    chips.push({
      label: "Hors France",
      onRemove: () => setFilters({ inFrance: undefined }),
    });
  }

  // Gims
  if (filters.gims) {
    chips.push({
      label: "🕶️ Mode Gims",
      onRemove: () => setFilters({ gims: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-elevated border border-border-subtle text-xs font-mono text-text-secondary"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="hover:text-neon-pink transition-colors"
            aria-label={`Retirer le filtre ${chip.label}`}
          >
            ×
          </button>
        </span>
      ))}
      {chips.length > 1 && (
        <button
          onClick={clearFilters}
          className="text-xs font-mono text-text-muted hover:text-neon-pink transition-colors"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
}
