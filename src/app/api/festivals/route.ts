import { NextResponse } from "next/server";
import { getCachedDataset } from "@/lib/data/cache";

export async function GET() {
  const dataset = await getCachedDataset();

  if (!dataset) {
    return NextResponse.json(
      { error: "Dataset not available. Run /api/cron/refresh first." },
      { status: 503 }
    );
  }

  return NextResponse.json(dataset, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
    },
  });
}
