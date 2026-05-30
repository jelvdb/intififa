"use client";

import { Sticker } from "@/data/stickers";
import { c, typeTint } from "@/lib/theme";

interface StickerGridProps {
  stickers: Sticker[];
  collected: Record<string, boolean>;
  onStickerClick: (sticker: Sticker) => void;
}

const TYPE_EMOJI: Record<string, string> = {
  special: "⭐",
  insert: "🔴",
};

export default function StickerGrid({ stickers, collected, onStickerClick }: StickerGridProps) {
  return (
    // minmax(0, 1fr) keeps every column an equal width and stops long labels
    // from widening a tile / overflowing the row off-screen.
    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
      {stickers.map((sticker) => {
        const isCollected = !!collected[sticker.id];
        const emoji = TYPE_EMOJI[sticker.type] ?? "";
        // Uncollected tiles get a faint type tint; collected tiles go green.
        const bg = isCollected ? c.greenTint : typeTint[sticker.type] ?? c.surfaceMuted;
        const border = isCollected ? c.successBright : c.border;
        return (
          <button
            key={sticker.id}
            className="sticker-btn rounded-lg flex flex-col items-center justify-center gap-0.5 relative overflow-hidden"
            style={{
              aspectRatio: "1 / 1",
              minWidth: 0,
              background: bg,
              border: `1.5px solid ${border}`,
            }}
            onClick={() => onStickerClick(sticker)}
          >
            {isCollected && (
              <span
                className="absolute leading-none font-bold"
                style={{ top: 4, right: 5, fontSize: 9, color: c.greenInk }}
              >
                ✓
              </span>
            )}
            {emoji && !isCollected && (
              <span className="leading-none" style={{ fontSize: 9 }}>{emoji}</span>
            )}
            <span
              className="font-bold leading-none truncate w-full text-center px-0.5"
              style={{
                color: isCollected ? c.greenInk : c.text,
                fontSize: sticker.code.length > 4 ? "13px" : "15px",
              }}
            >
              {sticker.code}
            </span>
            {sticker.type === "player" && sticker.label && (
              <span
                className="leading-none truncate w-full text-center px-0.5"
                style={{ fontSize: "9px", color: isCollected ? c.greenInk : c.textSubtle }}
              >
                {sticker.label.split(" ").pop()}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
