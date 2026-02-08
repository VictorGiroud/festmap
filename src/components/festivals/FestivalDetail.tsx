"use client";

import Image from "next/image";
import Link from "next/link";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonBadge } from "@/components/ui/NeonBadge";
import { ShareButton } from "@/components/ui/ShareButton";
import { LineupSection } from "./LineupSection";
import { formatDateRange } from "@/lib/utils";
import { COUNTRY_FLAGS, COUNTRY_LABELS } from "@/lib/constants";
import type { Festival } from "@/lib/types";

interface Props {
  festival: Festival;
}

export function FestivalDetail({ festival }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/festivals"
          className="inline-flex items-center gap-2 text-text-secondary text-sm font-mono hover:text-neon-pink transition-colors"
        >
          <span>←</span> Retour
        </Link>
        <ShareButton />
      </div>

      {/* Hero section */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {/* Image */}
        <div className="md:w-[400px] flex-none">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-card border border-border-subtle">
            {festival.imageUrl ? (
              <Image
                src={festival.imageUrl}
                alt={festival.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">
                {"🎵"}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="font-heading text-3xl md:text-4xl tracking-wider text-text-primary mb-3">
            {festival.name}
          </h1>

          <p className="text-lg font-mono text-neon-cyan text-glow-cyan mb-2">
            {formatDateRange(festival.startDate, festival.endDate)}
          </p>

          <p className="text-text-secondary mb-4">
            {COUNTRY_FLAGS[festival.venue.country]}{" "}
            {festival.venue.city}
            {festival.venue.region ? `, ${festival.venue.region}` : ""},{" "}
            {COUNTRY_LABELS[festival.venue.country]}
          </p>

          {/* Venue name */}
          {festival.venue.name && festival.venue.name !== festival.venue.city && (
            <p className="text-sm text-text-muted mb-4">
              {"📍"} {festival.venue.name}
              {festival.venue.address ? ` — ${festival.venue.address}` : ""}
            </p>
          )}

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {festival.genres.map((g) => (
              <NeonBadge key={g} genre={g} size="md" />
            ))}
          </div>

          {/* Price info */}
          {festival.priceRange && (
            <p className="text-sm font-mono text-neon-amber mb-4">
              {festival.priceRange.min != null && festival.priceRange.max != null
                ? `${festival.priceRange.min}€ — ${festival.priceRange.max}€`
                : festival.priceRange.min != null
                  ? `À partir de ${festival.priceRange.min}€`
                  : ""}
            </p>
          )}

          {/* Sale status */}
          {festival.onSaleStatus === "onsale" && (
            <p className="text-xs font-mono text-neon-green mb-4">
              {"✅"} Billets en vente
            </p>
          )}
          {festival.onSaleStatus === "soldout" && (
            <p className="text-xs font-mono text-red-400 mb-4">
              Complet
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            {festival.ticketUrl && (
              <NeonButton variant="pink" href={festival.ticketUrl} size="lg">
                Réserver des billets →
              </NeonButton>
            )}
            {festival.websiteUrl &&
              festival.websiteUrl !== festival.ticketUrl && (
                <NeonButton
                  variant="cyan"
                  href={festival.websiteUrl}
                  size="md"
                >
                  Site officiel
                </NeonButton>
              )}
          </div>
        </div>
      </div>

      {/* Description */}
      {festival.description && (
        <div className="mb-10 p-6 rounded-xl bg-bg-card border border-border-subtle">
          <h2 className="font-heading text-sm tracking-wider text-neon-violet uppercase mb-3">
            Description
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {festival.description}
          </p>
        </div>
      )}

      {/* Lineup */}
      {festival.lineup.length > 0 && (
        <div className="mb-10">
          <LineupSection festival={festival} />
        </div>
      )}

      {/* Location map placeholder */}
      {festival.venue.coordinates.lat !== 0 && (
        <div className="mb-10 p-6 rounded-xl bg-bg-card border border-border-subtle">
          <h2 className="font-heading text-sm tracking-wider text-neon-cyan uppercase mb-4">
            Localisation
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-text-primary font-medium mb-1">
                {festival.venue.name}
              </p>
              {festival.venue.address && (
                <p className="text-text-secondary text-sm">
                  {festival.venue.address}
                </p>
              )}
              <p className="text-text-secondary text-sm">
                {festival.venue.city},{" "}
                {COUNTRY_LABELS[festival.venue.country]}
              </p>
              <p className="text-text-muted text-xs font-mono mt-2">
                {festival.venue.coordinates.lat.toFixed(4)},{" "}
                {festival.venue.coordinates.lng.toFixed(4)}
              </p>
            </div>
            {/* Mini map via Mapbox Static Images API */}
            <div className="w-full md:w-[300px] h-[200px] rounded-lg overflow-hidden bg-bg-secondary border border-border-subtle">
              {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+ff2d6a(${festival.venue.coordinates.lng},${festival.venue.coordinates.lat})/${festival.venue.coordinates.lng},${festival.venue.coordinates.lat},12,0/300x200@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                  alt={`Carte de ${festival.venue.city}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-mono">
                  Carte non disponible
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
