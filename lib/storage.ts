import fs from "fs";
import path from "path";

const STATE_FILE = path.join(process.cwd(), "stickers-state.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export interface AppState {
  collected: Record<string, boolean>;
  duplicates: Record<string, number>;
  photos: { filename: string; date: string; note: string }[];
}

export function readState(): AppState {
  if (!fs.existsSync(STATE_FILE)) {
    return { collected: {}, duplicates: {}, photos: [] };
  }
  const s = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  return { collected: {}, duplicates: {}, photos: [], ...s };
}

export function writeState(state: AppState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}
