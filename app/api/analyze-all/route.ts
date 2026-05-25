import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import sharp from "sharp";
import { readState } from "@/lib/storage";
import { sections } from "@/data/stickers";

const codeToId = new Map<string, string>();
for (const section of sections) {
  for (const sticker of section.stickers) {
    codeToId.set(sticker.code.toUpperCase(), sticker.id);
  }
}

async function toJpegBase64(buffer: Buffer): Promise<string> {
  const jpeg = await sharp(buffer).rotate().jpeg({ quality: 90 }).toBuffer();
  return jpeg.toString("base64");
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("photo") as File;
  if (!file) return NextResponse.json({ error: "No photo" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());

  let base64: string;
  try {
    base64 = await toJpegBase64(bytes);
  } catch {
    // Fallback: send raw bytes as-is (shouldn't happen for valid images)
    base64 = bytes.toString("base64");
  }

  const client = new Anthropic();

  const msg = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64 },
          },
          {
            type: "text",
            text: `This photo contains Panini FIFA World Cup 2026 stickers. There are two types:

1. REGULAR STICKER BACKS: The back shows a code at the top right like "BEL 5", "CRO 13", "FWC 9". List these under "codes" with no spaces: ["BEL5","CRO13"]

2. EXTRA STICKER FRONTS: The front of special "Extra Sticker" cards showing a player face with their name. List these under "extras" as short descriptions: ["Lionel Messi - Argentina"]

Return ONLY JSON: {"codes": [...], "extras": [...]}
Only include items you can read with confidence.`,
          },
        ],
      },
    ],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "{}";
  let codes: string[] = [];
  let extraLabels: string[] = [];
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      codes = Array.isArray(parsed.codes) ? parsed.codes : [];
      extraLabels = Array.isArray(parsed.extras) ? parsed.extras : [];
    }
  } catch {
    codes = [];
    extraLabels = [];
  }

  const state = readState();
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

  return NextResponse.json({ newStickers, duplicateStickers, unknownCodes, extraLabels });
}
