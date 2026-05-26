"use client";

import { Sticker } from "@/data/stickers";

interface StickerGridProps {
  stickers: Sticker[];
  collected: Record<string, boolean>;
  onStickerClick: (sticker: Sticker) => void;
}

const TYPE_STYLE: Record<string, { bg: string; border: string; emoji: string }> = {
  foil:         { bg: "#0f1a2e", border: "#334d80", emoji: "" },
  player:       { bg: "#0f1a2e", border: "#334d80", emoji: "" },
  "team-photo": { bg: "#0f1a2e", border: "#334d80", emoji: "" },
  special:      { bg: "#1a1a0f", border: "#ca8a04", emoji: "⭐" },
  insert:       { bg: "#1a0f0f", border: "#dc2626", emoji: "🔴" },
};

export default function StickerGrid({ stickers, collected, onStickerClick }: StickerGridProps) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
      {stickers.map((sticker) => {
        const isCollected = !!collected[sticker.id];
        const style = TYPE_STYLE[sticker.type] ?? TYPE_STYLE.player;
        return (
          <button
            key={sticker.id}
            className="sticker-btn rounded-lg flex flex-col items-center justify-center gap-0.5 relative"
            style={{
              height: 88,
              background: isCollected ? "#0d2b1a" : style.bg,
              border: `1.5px solid ${isCollected ? "#16a34a" : style.border}`,
              opacity: isCollected ? 1 : 0.65,
            }}
            onClick={() => onStickerClick(sticker)}
          >
            {isCollected && (
              <div
                className="absolute inset-0 rounded-lg"
                style={{ background: "rgba(22,163,74,0.12)" }}
              />
            )}
            {isCollected && (
              <span
                className="absolute leading-none font-bold"
                style={{ top: 5, right: 7, fontSize: 10, color: "#4ade80" }}
              >
                ✓
              </span>
            )}
            {style.emoji && !isCollected && (
              <span className="text-xs leading-none">{style.emoji}</span>
            )}
            <span className="font-bold leading-none" style={{ color: isCollected ? "#4ade80" : "#f1f5f9", fontSize: sticker.code.length > 5 ? "15px" : "18px" }}>
              {sticker.code}
            </span>
            {sticker.type === "player" && sticker.label && (
              <span
                className="leading-none truncate w-full text-center px-1"
                style={{ fontSize: "12px", color: isCollected ? "#4ade80" : "#64748b" }}
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
