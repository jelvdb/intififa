import { NextRequest, NextResponse } from "next/server";
import { readState, writeState, ensureUploadsDir } from "@/lib/storage";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  ensureUploadsDir();
  const formData = await request.formData();
  const file = formData.get("photo") as File;
  const note = (formData.get("note") as string) ?? "";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const date = new Date().toISOString();
  const safeName = `${date.replace(/[:.]/g, "-")}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "")}`;
  const filePath = path.join(process.cwd(), "public", "uploads", safeName);

  await writeFile(filePath, buffer);

  const state = await readState();
  state.photos.unshift({ filename: safeName, date, note });
  await writeState(state);

  return NextResponse.json({ ok: true, filename: safeName });
}
