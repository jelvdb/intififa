"use client";

import { useState } from "react";
import { Section, Sticker } from "@/data/stickers";
import { c } from "@/lib/theme";
import StickerGrid from "./StickerGrid";

interface CountrySectionProps {
  section: Section;
  collected: Record<string, boolean>;
  onStickerClick: (sticker: Sticker, section: Section) => void;
}

export default function CountrySection({ section, collected, onStickerClick }: CountrySectionProps) {
  const [open, setOpen] = useState(true);
  const collectedStickers = section.stickers.filter((s) => collected[s.id]);
  const sectionCollected = collectedStickers.length;
  const total = section.stickers.length;
  const done = sectionCollected === total;
  const collectedNumbers = collectedStickers
    .map((s) => parseInt(s.id.split("-")[1], 10))
    .sort((a, b) => a - b)
    .join(" · ");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: c.surface, border: done ? `1.5px solid ${c.successBright}` : `1.5px solid ${c.border}` }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-2.5"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="leading-none" style={{ fontSize: "1.75rem" }}>{section.flag}</span>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm" style={{ color: c.text }}>{section.name}</span>
            {done && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: c.greenTint, color: c.greenInk }}>
                ✓ Compleet
              </span>
            )}
          </div>
          {collectedNumbers && (
            <p className="leading-none mt-0.5 truncate" style={{ fontSize: 10, color: c.textSubtle }}>
              {collectedNumbers}
            </p>
          )}
        </div>
        <div className="text-right min-w-[40px]">
          <span className="text-sm font-bold" style={{ color: done ? c.greenInk : c.purpleInk }}>
            {sectionCollected}/{total}
          </span>
        </div>
        <span
          className="text-sm"
          style={{
            color: c.textSubtle,
            display: "inline-block",
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-3 pb-4">
          <StickerGrid
            stickers={section.stickers}
            collected={collected}
            onStickerClick={(sticker) => onStickerClick(sticker, section)}
          />
        </div>
      )}
    </div>
  );
}
