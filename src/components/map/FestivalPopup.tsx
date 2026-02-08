import Link from "next/link";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { formatDateRange } from "@/lib/utils";
import { COUNTRY_FLAGS } from "@/lib/constants";
import type { Festival } from "@/lib/types";

interface Props {
  festival: Festival;
}

export function FestivalPopup({ festival }: Props) {
  return (
    <Link
      href={`/festivals/${festival.slug}`}
      className="block p-4 min-w-[220px] max-w-[300px] group"
    >
      <h3 className="font-heading text-sm tracking-wide text-text-primary group-hover:text-neon-pink transition-colors mb-1">
        {festival.name}
      </h3>

      <p className="text-xs font-mono text-neon-cyan mb-1">
        {formatDateRange(festival.startDate, festival.endDate)}
      </p>

      <p className="text-xs text-text-secondary mb-2">
        {COUNTRY_FLAGS[festival.venue.country]} {festival.venue.city}
      </p>

      <div className="flex flex-wrap gap-1 mb-2">
        {festival.genres.slice(0, 3).map((g) => (
          <NeonBadge key={g} genre={g} />
        ))}
      </div>

      {festival.headliners.length > 0 && (
        <p className="text-[10px] text-text-muted line-clamp-2">
          {festival.headliners
            .slice(0, 4)
            .map((a) => a.name)
            .join(" · ")}
        </p>
      )}

      <span className="block mt-2 text-[10px] font-mono text-neon-pink opacity-0 group-hover:opacity-100 transition-opacity">
        Voir les détails →
      </span>
    </Link>
  );
}
