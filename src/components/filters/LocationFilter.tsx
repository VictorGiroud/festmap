"use client";

import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";

export function LocationFilter() {
  const { filters, setFilters } = useFilters();

  const options = [
    { label: "Tous", value: undefined },
    { label: "🇫🇷 France", value: true },
    { label: "🌍 Ailleurs en Europe", value: false },
  ] as const;

  return (
    <div className="flex rounded-lg border border-border-subtle overflow-hidden">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => setFilters({ inFrance: opt.value })}
          className={cn(
            "px-3 py-2 text-xs font-mono transition-all duration-200",
            filters.inFrance === opt.value
              ? "bg-neon-pink/15 text-neon-pink border-r border-neon-pink/20"
              : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-r border-border-subtle last:border-r-0"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
