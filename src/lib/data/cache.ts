import { Redis } from "@upstash/redis";
import type { FestivalDataset } from "../types";
import { promises as fs } from "fs";
import path from "path";

const CACHE_KEY = "festivals:summer2026";
const LOCAL_CACHE_PATH = path.join(process.cwd(), "src/lib/data/festivals-cache.json");

function getRedis(): Redis | null {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return null;
}

export async function getCachedDataset(): Promise<FestivalDataset | null> {
  const redis = getRedis();

  if (redis) {
    return redis.get<FestivalDataset>(CACHE_KEY);
  }

  // Fallback to local JSON file for development
  try {
    const data = await fs.readFile(LOCAL_CACHE_PATH, "utf-8");
    return JSON.parse(data) as FestivalDataset;
  } catch {
    return null;
  }
}

export async function setCachedDataset(dataset: FestivalDataset): Promise<void> {
  const redis = getRedis();

  if (redis) {
    // TTL 48h as safety net (cron refreshes daily)
    await redis.set(CACHE_KEY, dataset, { ex: 172800 });
  }

  // Always write local cache for development
  await fs.writeFile(LOCAL_CACHE_PATH, JSON.stringify(dataset, null, 2), "utf-8");
}
