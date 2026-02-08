import { NeonBadge } from "@/components/ui/NeonBadge";
import { GENRE_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Festival } from "@/lib/types";

interface Props {
  festival: Festival;
}

export function LineupSection({ festival }: Props) {
  // If we have day-by-day lineup, show that
  if (festival.lineupByDay && festival.lineupByDay.length > 0) {
    return (
      <div>
        <h2 className="font-heading text-sm tracking-wider text-neon-pink uppercase mb-6">
          Lineup
        </h2>
        <div className="space-y-6">
          {festival.lineupByDay.map((day) => (
            <div key={day.date}>
              <h3 className="font-mono text-sm text-neon-cyan mb-3">
                {formatDate(day.date)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {day.artists.map((artist) => (
                  <ArtistPill key={artist.id} name={artist.name} genre={artist.genres[0]} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Flat lineup
  return (
    <div>
      <h2 className="font-heading text-sm tracking-wider text-neon-pink uppercase mb-4">
        Lineup ({festival.lineup.length} artiste{festival.lineup.length > 1 ? "s" : ""})
      </h2>

      {/* Headliners */}
      {festival.headliners.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
            Têtes d&apos;affiche
          </p>
          <div className="flex flex-wrap gap-2">
            {festival.headliners.map((artist) => (
              <ArtistPill
                key={artist.id}
                name={artist.name}
                genre={artist.genres[0]}
                isHeadliner
              />
            ))}
          </div>
        </div>
      )}

      {/* Rest of lineup */}
      {festival.lineup.length > festival.headliners.length && (
        <div>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
            Artistes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {festival.lineup
              .filter(
                (a) =>
                  !festival.headliners.some((h) => h.id === a.id)
              )
              .map((artist) => (
                <ArtistPill
                  key={artist.id}
                  name={artist.name}
                  genre={artist.genres[0]}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArtistPill({
  name,
  genre,
  isHeadliner = false,
}: {
  name: string;
  genre?: string;
  isHeadliner?: boolean;
}) {
  const color = genre ? GENRE_COLORS[genre as keyof typeof GENRE_COLORS] ?? "#94a3b8" : "#94a3b8";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono transition-colors ${
        isHeadliner
          ? "px-4 py-1.5 text-sm"
          : "px-2.5 py-1 text-xs"
      }`}
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}08`,
      }}
    >
      {name}
      {genre && (
        <span className="opacity-0 group-hover:opacity-100">
          <NeonBadge genre={genre as Parameters<typeof NeonBadge>[0]["genre"]} />
        </span>
      )}
    </span>
  );
}
