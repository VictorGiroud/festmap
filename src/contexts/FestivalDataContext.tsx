"use client";

import { createContext, useContext, useMemo } from "react";
import type { Festival } from "@/lib/types";

interface FestivalDataContextValue {
  allArtists: string[];
}

const FestivalDataContext = createContext<FestivalDataContextValue>({
  allArtists: [],
});

export function FestivalDataProvider({
  festivals,
  children,
}: {
  festivals: Festival[];
  children: React.ReactNode;
}) {
  const allArtists = useMemo(() => {
    const set = new Set<string>();
    for (const f of festivals) {
      for (const a of f.lineup) {
        set.add(a.name);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  }, [festivals]);

  return (
    <FestivalDataContext value={{ allArtists }}>
      {children}
    </FestivalDataContext>
  );
}

export function useFestivalData() {
  return useContext(FestivalDataContext);
}
