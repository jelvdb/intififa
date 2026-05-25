"use client";

import { Sticker } from "@/data/stickers";

interface StickerGridProps {
  stickers: Sticker[];
  collected: Record<string, boolean>;
  onStickerClick: (sticker: Sticker) => void;
}

const TYPE_STYLE: Record<string, { bg: string; border: string; emoji: string }> = {
  foil:         { bg: "#2a2010", border: "#e8c84a", emoji: "✨" },
  player:       { bg: "#0f1a2e", border: "#334d80", emoji: "" },
  "team-photo": { bg: "#1a0f2e", border: "#7c3aed", emoji: "📸" },
  special:      { bg: "#1a1a0f", border: "#ca8a04", emoji: "⭐" },
  insert:       { bg: "#1a0f0f", border: "#dc2626", emoji: "🔴" },
};

export default function StickerGrid({ stickers, collected, onStickerClick }: StickerGridProps) {
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(58px, 1fr))" }}>
      {stickers.map((sticker) => {
        const isCollected = !!collected[sticker.id];
        const style = TYPE_STYLE[sticker.type] ?? TYPE_STYLE.player;
        return (
          <button
            key={sticker.id}
            className="sticker-btn rounded-lg flex flex-col items-center justify-center gap-0.5 relative"
            style={{
              height: 64,
              background: isCollected ? "#0d2b1a" : style.bg,
              border: `1.5px solid ${isCollected ? "#16a34a" : style.border}`,
              opacity: isCollected ? 1 : 0.65,
            }}
            onClick={() => onStickerClick(sticker)}
          >
            {isCollected && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg"
                style={{ background: "rgba(22,163,74,0.18)" }}
              >
                <span className="text-lg">✓</span>
              </div>
            )}
            {style.emoji && !isCollected && (
              <span className="text-xs leading-none">{style.emoji}</span>
            )}
            <span className="font-bold leading-none" style={{ color: isCollected ? "#4ade80" : "#f1f5f9", fontSize: sticker.code.length > 5 ? "9px" : "10px" }}>
              {sticker.code}
            </span>
          </button>
        );
      })}
    </div>
  );
}
