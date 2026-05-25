"use client";

import { useCallback, useEffect, useState } from "react";
import { sections, totalStickers, Sticker, Section } from "@/data/stickers";
import StatsBar from "@/components/StatsBar";
import CountrySection from "@/components/CountrySection";
import StickerDetailModal from "@/components/StickerDetailModal";

interface SelectedSticker {
  sticker: Sticker;
  section: Section;
}

export default function Home() {
  const [collected, setCollected] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedSticker | null>(null);

  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((s) => setCollected(s.collected ?? {}));
  }, []);

  const handleToggle = useCallback(async (stickerId: string) => {
    const next = !collected[stickerId];
    setCollected((prev) => {
      const copy = { ...prev };
      if (next) copy[stickerId] = true;
      else delete copy[stickerId];
      return copy;
    });
    await fetch("/api/stickers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stickerId, collected: next }),
    });
  }, [collected]);

  const handleStickerClick = useCallback((sticker: Sticker, section: Section) => {
    setSelected({ sticker, section });
  }, []);

  const handleModalToggle = useCallback(() => {
    if (!selected) return;
    handleToggle(selected.sticker.id);
    setSelected(null);
  }, [selected, handleToggle]);

  const collectedCount = Object.keys(collected).length;
  const filtered = search.trim()
    ? sections.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : sections;

  return (
    <div className="min-h-dvh pb-24">
      <StatsBar total={totalStickers} collected={collectedCount} />

      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
        <input
          className="w-full rounded-xl px-4 py-2.5 text-sm"
          style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a", color: "#f1f5f9" }}
          placeholder="🔍 Zoek land..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 px-4 max-w-lg mx-auto">
        {filtered.map((section) => (
          <CountrySection
            key={section.id}
            section={section}
            collected={collected}
            onStickerClick={handleStickerClick}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: "#64748b" }}>
            Geen landen gevonden voor &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {selected && (
        <StickerDetailModal
          sticker={selected.sticker}
          section={selected.section}
          collected={!!collected[selected.sticker.id]}
          onToggle={handleModalToggle}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
