import { NextRequest, NextResponse } from "next/server";
import { readState, writeState } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const { newStickers, duplicateStickers } = await request.json();

  if (!Array.isArray(newStickers) || !Array.isArray(duplicateStickers)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const state = await readState();

  for (const id of newStickers) {
    state.collected[id] = true;
  }

  for (const id of duplicateStickers) {
    state.duplicates[id] = (state.duplicates[id] ?? 0) + 1;
  }

  await writeState(state);
  return NextResponse.json({ ok: true, collected: state.collected, duplicates: state.duplicates });
}
