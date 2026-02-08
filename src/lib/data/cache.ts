import type { FestivalDataset } from "../types";
import { runNormalizationPipeline } from "./normalizer";

export async function getCachedDataset(): Promise<FestivalDataset> {
  return runNormalizationPipeline();
}
