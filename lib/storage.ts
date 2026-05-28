import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const STATE_KEY = "paninti:state";
const STATE_FILE = path.join(process.cwd(), "stickers-state.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export interface ExtraSticker {
  id: string;
  label: string;
  count: number;
}

export interface AppState {
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
  photos: { filename: string; date: string; note: string }[];
  extras: ExtraSticker[];
}

const emptyState = (): AppState => ({ collected: {}, duplicates: {}, photos: [], extras: [] });

// Upstash when configured (production / shared online collection),
// local JSON file as fallback for development without credentials.
const useRedis = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

export async function readState(): Promise<AppState> {
  if (useRedis) {
    const stored = await getRedis().get<AppState>(STATE_KEY);
    return { ...emptyState(), ...(stored ?? {}) };
  }
  if (!fs.existsSync(STATE_FILE)) return emptyState();
  return { ...emptyState(), ...JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) };
}

export async function writeState(state: AppState): Promise<void> {
  if (useRedis) {
    await getRedis().set(STATE_KEY, state);
    return;
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}
