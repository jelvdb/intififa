import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pin } = await req.json();
  const correct = process.env.AUTH_PIN;

  if (!correct) {
    // No PIN configured — allow all (local dev only)
    return NextResponse.json({ ok: true });
  }

  if (pin !== correct) {
    return NextResponse.json({ error: "Verkeerde PIN" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
