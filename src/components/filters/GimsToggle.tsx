"use client";

import { useFilters } from "@/hooks/useFilters";
import { cn } from "@/lib/utils";

export function GimsToggle() {
  const { filters, setFilters } = useFilters();
  const isActive = !!filters.gims;

  return (
    <button
      onClick={() => setFilters({ gims: !isActive })}
      className={cn(
        "relative px-3 py-2 rounded-lg border text-sm font-mono",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95",
        isActive
          ? "border-neon-pink bg-neon-pink/20 text-neon-pink glow-pink"
          : "border-border-subtle text-text-muted hover:border-neon-pink/50 hover:text-neon-pink"
      )}
      title="Mode Gims"
    >
      {isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-neon-pink animate-glow-pulse" />
      )}
      <span className="flex items-center gap-1.5">
        <span role="img" aria-label="Gims mode" className="text-base">
          {"🕶️"}
        </span>
        <span className="text-xs font-bold tracking-wider">LE MAITRE</span>
      </span>
    </button>
  );
}
