import { getCachedDataset } from "@/lib/data/cache";
import { notFound } from "next/navigation";
import { FestivalDetail } from "@/components/festivals/FestivalDetail";
import { StructuredData } from "@/components/seo/StructuredData";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const dataset = await getCachedDataset();
  if (!dataset) return [];
  return dataset.festivals.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dataset = await getCachedDataset();
  const festival = dataset?.festivals.find((f) => f.slug === slug);

  if (!festival) return { title: "Festival non trouvé" };

  const headlinersText = festival.headliners
    .slice(0, 5)
    .map((a) => a.name)
    .join(", ");

  return {
    title: `${festival.name} — ${festival.venue.city}`,
    description: `${festival.name} du ${festival.startDate} au ${festival.endDate} à ${festival.venue.city}. Lineup : ${headlinersText}`,
    openGraph: {
      title: festival.name,
      description: `Festival de musique à ${festival.venue.city}, ${festival.venue.countryName}`,
      images: festival.imageUrl ? [festival.imageUrl] : [],
      type: "website",
    },
  };
}

export default async function FestivalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dataset = await getCachedDataset();
  const festival = dataset?.festivals.find((f) => f.slug === slug);

  if (!festival) notFound();

  return (
    <>
      <StructuredData festival={festival} />
      <FestivalDetail festival={festival} />
    </>
  );
}
