import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readState } from "@/lib/storage";
import { sections } from "@/data/stickers";

export const maxDuration = 60; // seconds — needed for Claude image analysis

const codeToId = new Map<string, string>();
for (const section of sections) {
  for (const sticker of section.stickers) {
    codeToId.set(sticker.code.toUpperCase(), sticker.id);
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("photo") as File;
  if (!file) return NextResponse.json({ error: "No photo" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  // Browsers convert HEIC to JPEG on upload; default to jpeg if type is missing/heic
  const rawType = file.type;
  const mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" =
    rawType === "image/png" ? "image/png"
    : rawType === "image/webp" ? "image/webp"
    : "image/jpeg";

  const client = new Anthropic();

  const msg = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `This photo shows the backs of Panini FIFA World Cup 2026 stickers. Each sticker has a code printed at the top right in the format COUNTRY+NUMBER, like "BEL 5", "CRO 13", "FWC 9", "RSA 1", "MEX 5".

List ALL sticker codes you can see. Return ONLY a JSON array of strings with no spaces in the codes, e.g.: ["BEL5","CRO13","FWC9","RSA1"]

Only include codes you can read with confidence.`,
          },
        ],
      },
    ],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "[]";
  let codes: string[] = [];
  try {
    const match = text.match(/\[[\s\S]*?\]/);
    codes = match ? JSON.parse(match[0]) : [];
  } catch {
    codes = [];
  }

  const state = await readState();
  const newStickers: string[] = [];
  const duplicateStickers: string[] = [];
  const unknownCodes: string[] = [];

  for (const code of codes) {
    const id = codeToId.get(code.toUpperCase().replace(/\s/g, ""));
    if (!id) {
      unknownCodes.push(code);
      continue;
    }
    if (state.collected[id]) {
      duplicateStickers.push(id);
    } else {
      newStickers.push(id);
    }
  }

  return NextResponse.json({ codes, newStickers, duplicateStickers, unknownCodes });
}
