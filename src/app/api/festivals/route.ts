import { NextResponse } from "next/server";
import { getCachedDataset } from "@/lib/data/cache";

export async function GET() {
  const dataset = await getCachedDataset();

  return NextResponse.json(dataset, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
