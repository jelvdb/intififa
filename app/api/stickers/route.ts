import { NextRequest, NextResponse } from "next/server";
import { readState, writeState } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const { stickerId, collected } = await request.json();
  if (!stickerId) return NextResponse.json({ error: "Missing stickerId" }, { status: 400 });

  const state = await readState();
  if (collected) {
    state.collected[stickerId] = true;
  } else {
    delete state.collected[stickerId];
  }
  await writeState(state);
  return NextResponse.json({ ok: true, collected: state.collected });
}
