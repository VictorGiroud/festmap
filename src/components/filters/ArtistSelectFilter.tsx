"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useFestivalData } from "@/contexts/FestivalDataContext";
import { cn } from "@/lib/utils";

export function ArtistSelectFilter() {
  const { filters, setFilters } = useFilters();
  const { allArtists } = useFestivalData();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = filters.artists ?? [];

  const filtered = useMemo(() => {
    if (!search) return allArtists.slice(0, 50);
    const q = search.toLowerCase();
    return allArtists.filter((a) => a.toLowerCase().includes(q)).slice(0, 50);
  }, [allArtists, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function toggle(artist: string) {
    const next = selected.includes(artist)
      ? selected.filter((a) => a !== artist)
      : [...selected, artist];
    setFilters({ artists: next.length > 0 ? next : undefined });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-mono transition-all duration-200",
          "bg-bg-secondary border border-border-subtle",
          selected.length > 0
            ? "text-neon-cyan border-neon-cyan/30"
            : "text-text-secondary hover:text-text-primary hover:border-border-glow/20"
        )}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Artistes
        {selected.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold">
            {selected.length}
          </span>
        )}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-80 rounded-xl bg-bg-card border border-border-subtle shadow-[0_0_30px_rgba(0,240,255,0.05)] z-50 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border-subtle">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher un artiste..."
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm font-mono",
                "bg-bg-secondary border border-border-subtle",
                "text-text-primary placeholder:text-text-muted",
                "focus:outline-none focus:border-neon-cyan/50"
              )}
            />
          </div>

          {/* Selected artists */}
          {selected.length > 0 && (
            <div className="px-2 pt-2 pb-1 flex flex-wrap gap-1 border-b border-border-subtle">
              {selected.map((artist) => (
                <button
                  key={artist}
                  onClick={() => toggle(artist)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[11px] font-mono hover:bg-neon-cyan/20 transition-colors"
                >
                  {artist}
                  <span className="text-xs">×</span>
                </button>
              ))}
            </div>
          )}

          {/* Artist list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="p-3 text-xs font-mono text-text-muted text-center">
                Aucun artiste trouvé
              </p>
            ) : (
              filtered.map((artist) => {
                const isSelected = selected.includes(artist);
                return (
                  <button
                    key={artist}
                    onClick={() => toggle(artist)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm font-mono transition-colors",
                      isSelected
                        ? "bg-neon-cyan/10 text-neon-cyan"
                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0",
                          isSelected
                            ? "border-neon-cyan bg-neon-cyan/20 text-neon-cyan"
                            : "border-border-subtle"
                        )}
                      >
                        {isSelected && "✓"}
                      </span>
                      {artist}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
