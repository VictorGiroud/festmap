import { FestivalCard } from "./FestivalCard";
import { GENRE_LABELS, GENRE_COLORS } from "@/lib/constants";
import type { Festival, Genre } from "@/lib/types";

interface GenreSectionProps {
  genre: Genre;
  festivals: Festival[];
}

export function GenreSection({ genre, festivals }: GenreSectionProps) {
  const color = GENRE_COLORS[genre];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2
          className="font-heading text-lg tracking-wider uppercase"
          style={{ color, textShadow: `0 0 10px ${color}60` }}
        >
          {GENRE_LABELS[genre]}
        </h2>
        <span className="text-text-muted text-xs font-mono">
          {festivals.length} festival{festivals.length > 1 ? "s" : ""}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory">
        {festivals.map((festival) => (
          <div
            key={festival.id}
            className="flex-none w-[280px] snap-start"
          >
            <FestivalCard festival={festival} />
          </div>
        ))}
      </div>
    </section>
  );
}
