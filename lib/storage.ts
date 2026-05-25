import fs from "fs";
import path from "path";

const STATE_FILE = path.join(process.cwd(), "stickers-state.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export interface AppState {
  collected: Record<string, boolean>;
  photos: { filename: string; date: string; note: string }[];
}

export function readState(): AppState {
  if (!fs.existsSync(STATE_FILE)) {
    return { collected: {}, photos: [] };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

export function writeState(state: AppState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}
