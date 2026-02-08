"use client";

import { useFilters } from "@/hooks/useFilters";

export function DateRangeFilter() {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={filters.dateFrom ?? ""}
        min="2026-05-01"
        max="2026-09-30"
        onChange={(e) =>
          setFilters({ dateFrom: e.target.value || undefined })
        }
        className="px-3 py-2 rounded-lg bg-bg-secondary border border-border-subtle text-text-primary text-sm font-mono focus:outline-none focus:border-neon-cyan/50 transition-colors [color-scheme:dark]"
        aria-label="Date de début"
      />
      <span className="text-text-muted text-xs">→</span>
      <input
        type="date"
        value={filters.dateTo ?? ""}
        min="2026-05-01"
        max="2026-09-30"
        onChange={(e) =>
          setFilters({ dateTo: e.target.value || undefined })
        }
        className="px-3 py-2 rounded-lg bg-bg-secondary border border-border-subtle text-text-primary text-sm font-mono focus:outline-none focus:border-neon-cyan/50 transition-colors [color-scheme:dark]"
        aria-label="Date de fin"
      />
    </div>
  );
}
