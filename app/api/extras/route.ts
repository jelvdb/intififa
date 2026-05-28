import { NextRequest, NextResponse } from "next/server";
import { readState, writeState } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, label, delta } = body;

    const state = await readState();

    if (action === "add") {
      if (!label?.trim()) return NextResponse.json({ error: "Missing label" }, { status: 400 });
      const newEntry = { id: `extra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: label.trim(), count: 1 };
      state.extras = [...state.extras, newEntry];
    } else if (action === "delta") {
      state.extras = state.extras
        .map((e) => e.id === id ? { ...e, count: Math.max(0, e.count + delta) } : e)
        .filter((e) => e.count > 0);
    } else if (action === "delete") {
      state.extras = state.extras.filter((e) => e.id !== id);
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await writeState(state);
    return NextResponse.json({ ok: true, extras: state.extras });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
