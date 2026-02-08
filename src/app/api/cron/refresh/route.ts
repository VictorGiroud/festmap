import { NextRequest, NextResponse } from "next/server";
import { runNormalizationPipeline } from "@/lib/data/normalizer";
import { setCachedDataset } from "@/lib/data/cache";

export const maxDuration = 300; // 5 min max for Vercel

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dataset = await runNormalizationPipeline();
    await setCachedDataset(dataset);

    return NextResponse.json({
      success: true,
      festivalCount: dataset.totalCount,
      lastRefreshed: dataset.lastRefreshed,
    });
  } catch (error) {
    console.error("Cron refresh failed:", error);
    return NextResponse.json(
      { error: "Refresh failed", details: String(error) },
      { status: 500 }
    );
  }
}
