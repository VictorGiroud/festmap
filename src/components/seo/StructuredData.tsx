import type { Festival } from "@/lib/types";

interface Props {
  festival: Festival;
}

export function StructuredData({ festival }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicFestival",
    name: festival.name,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: {
      "@type": "Place",
      name: festival.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: festival.venue.city,
        addressRegion: festival.venue.region,
        addressCountry: festival.venue.country,
      },
      geo:
        festival.venue.coordinates.lat !== 0
          ? {
              "@type": "GeoCoordinates",
              latitude: festival.venue.coordinates.lat,
              longitude: festival.venue.coordinates.lng,
            }
          : undefined,
    },
    performer: festival.headliners.map((a) => ({
      "@type": "MusicGroup",
      name: a.name,
    })),
    image: festival.imageUrl,
    url: festival.websiteUrl,
    offers: festival.ticketUrl
      ? {
          "@type": "Offer",
          url: festival.ticketUrl,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
