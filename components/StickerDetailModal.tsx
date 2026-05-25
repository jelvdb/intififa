"use client";

import { Sticker, Section } from "@/data/stickers";

interface Props {
  sticker: Sticker;
  section: Section;
  collected: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  foil:        "✨ Foil",
  player:      "⚽ Speler",
  "team-photo": "📸 Teamfoto",
  special:     "⭐ Speciaal",
  insert:      "🔴 Insert",
};

const TYPE_COLOR: Record<string, string> = {
  foil:        "#e8c84a",
  player:      "#60a5fa",
  "team-photo": "#a78bfa",
  special:     "#fbbf24",
  insert:      "#f87171",
};

export default function StickerDetailModal({ sticker, section, collected, onToggle, onClose }: Props) {
  const color = TYPE_COLOR[sticker.type] ?? "#60a5fa";
  const isPlayer = sticker.type === "player";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-safe"
        style={{ background: "#1a1a2e", maxHeight: "85dvh", overflowY: "auto" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "#334155" }} />
        </div>

        <div className="px-6 pt-2 pb-8 max-w-lg mx-auto">
          {/* Country header */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{section.flag}</span>
            <span className="font-semibold" style={{ color: "#94a3b8" }}>{section.name}</span>
            <div className="ml-auto">
              <button onClick={onClose} className="text-xl" style={{ color: "#475569" }}>✕</button>
            </div>
          </div>

          {/* Sticker card */}
          <div
            className="rounded-2xl p-5 mb-6 flex flex-col items-center gap-3 text-center"
            style={{ background: "#0f1120", border: `2px solid ${color}` }}
          >
            <span
              className="text-4xl font-black tracking-tight font-mono"
              style={{ color }}
            >
              {sticker.code}
            </span>
            <span className="text-xl font-bold leading-tight" style={{ color: "#f1f5f9" }}>
              {sticker.label}
            </span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: `${color}22`, color }}
            >
              {TYPE_LABEL[sticker.type] ?? sticker.type}
            </span>

            {isPlayer && (
              <p className="text-xs mt-1" style={{ color: "#475569" }}>
                {section.name} · FIFA WK 2026
              </p>
            )}
          </div>

          {/* Toggle button */}
          {collected ? (
            <button
              className="w-full rounded-2xl py-4 font-bold text-base flex items-center justify-center gap-2"
              style={{ background: "#14532d", border: "2px solid #16a34a", color: "#4ade80" }}
              onClick={onToggle}
            >
              ✓ Verzameld — tik om te verwijderen
            </button>
          ) : (
            <button
              className="w-full rounded-2xl py-4 font-bold text-base"
              style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
              onClick={onToggle}
            >
              Afvinken als verzameld
            </button>
          )}
        </div>
      </div>
    </>
  );
}
