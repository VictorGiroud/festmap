import Link from "next/link";
import Image from "next/image";
import { GlowCard } from "@/components/ui/GlowCard";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { formatDateRange } from "@/lib/utils";
import { COUNTRY_FLAGS } from "@/lib/constants";
import type { Festival } from "@/lib/types";

interface FestivalCardProps {
  festival: Festival;
}

export function FestivalCard({ festival }: FestivalCardProps) {
  return (
    <Link href={`/festivals/${festival.slug}`}>
      <GlowCard className="group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
          {festival.imageUrl ? (
            <Image
              src={festival.imageUrl}
              alt={festival.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
              {"🎵"}
            </div>
          )}

          {/* Status badge */}
          {festival.onSaleStatus === "onsale" && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neon-green/20 border border-neon-green/40 text-neon-green text-[10px] font-mono uppercase">
              En vente
            </span>
          )}
          {festival.onSaleStatus === "soldout" && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-mono uppercase">
              Complet
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          <h3 className="font-heading text-sm tracking-wide text-text-primary group-hover:text-neon-pink transition-colors line-clamp-2">
            {festival.name}
          </h3>

          <p className="text-xs font-mono text-neon-cyan">
            {formatDateRange(festival.startDate, festival.endDate)}
          </p>

          <p className="text-xs text-text-secondary">
            {COUNTRY_FLAGS[festival.venue.country]}{" "}
            {festival.venue.city}
            {festival.venue.region ? `, ${festival.venue.region}` : ""}
          </p>

          {/* Headliners */}
          {festival.headliners.length > 0 && (
            <p className="text-xs font-semibold text-text-primary line-clamp-2 mt-1">
              {festival.headliners.map((a) => a.name).join(" · ")}
            </p>
          )}

          {/* Genre badges */}
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {festival.genres.slice(0, 3).map((g) => (
              <NeonBadge key={g} genre={g} />
            ))}
          </div>
        </div>
      </GlowCard>
    </Link>
  );
}
