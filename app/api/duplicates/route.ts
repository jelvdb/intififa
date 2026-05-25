import { NextRequest, NextResponse } from "next/server";
import { readState, writeState } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const { stickerId, delta } = await request.json();
  if (!stickerId || typeof delta !== "number") {
    return NextResponse.json({ error: "Missing stickerId or delta" }, { status: 400 });
  }

  const state = readState();
  const current = state.duplicates[stickerId] ?? 0;
  const next = Math.max(0, current + delta);

  if (next === 0) {
    delete state.duplicates[stickerId];
  } else {
    state.duplicates[stickerId] = next;
  }

  writeState(state);
  return NextResponse.json({ ok: true, duplicates: state.duplicates });
}
