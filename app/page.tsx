"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [sort, setSort] = useState<"default" | "alpha" | "collected">("default");

  const collectedCount = Object.keys(collected).length;

  const filtered = (() => {
    let list = search.trim()
      ? sections.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      : [...sections];
    if (sort === "alpha") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "collected") {
      list = [...list].sort((a, b) => {
        const aCount = a.stickers.filter((s) => collected[s.id]).length;
        const bCount = b.stickers.filter((s) => collected[s.id]).length;
        return bCount - aCount;
      });
    }
    return list;
  })();

  const sortButtons: { key: typeof sort; label: string }[] = [
    { key: "default", label: "Volgorde" },
    { key: "alpha", label: "A–Z" },
    { key: "collected", label: "Verzameld" },
  ];

  // Build letter → first section-id map for A–Z nav
  const letterMap = useMemo(() => {
    if (sort !== "alpha") return {} as Record<string, string>;
    const map: Record<string, string> = {};
    for (const section of filtered) {
      const letter = section.name[0].toUpperCase();
      if (!map[letter]) map[letter] = section.id;
    }
    return map;
  }, [filtered, sort]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter: string) => {
    const id = letterMap[letter];
    if (!id) return;
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-dvh pb-24">
      <StatsBar total={totalStickers} collected={collectedCount} />

      <div className="px-4 pt-4 pb-2 max-w-lg mx-auto flex flex-col gap-2">
        <input
          className="w-full rounded-xl px-4 py-2.5 text-sm"
          style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a", color: "#f1f5f9" }}
          placeholder="🔍 Zoek land..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {sortButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors"
              style={{
                background: sort === key ? "#2563eb" : "#1a1a2e",
                border: `1.5px solid ${sort === key ? "#2563eb" : "#1e2a3a"}`,
                color: sort === key ? "#fff" : "#94a3b8",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {/* Alphabet sidebar – only in A–Z mode */}
        {sort === "alpha" && (
          <nav
            className="fixed top-1/2 -translate-y-1/2 flex flex-col z-30"
            style={{ left: 2 }}
          >
            {alphabet.map((letter) => {
              const active = !!letterMap[letter];
              return (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  disabled={!active}
                  className="leading-none font-bold"
                  style={{
                    fontSize: 10,
                    width: 16,
                    padding: "2px 0",
                    color: active ? "#e8c84a" : "#1e2a3a",
                    cursor: active ? "pointer" : "default",
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </nav>
        )}

        <div className="flex flex-col gap-2 px-4 max-w-lg mx-auto">
          {filtered.map((section) => (
            <div key={section.id} id={`section-${section.id}`}>
              <CountrySection
                section={section}
                collected={collected}
                onStickerClick={handleStickerClick}
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center py-10 text-sm" style={{ color: "#64748b" }}>
              Geen landen gevonden voor &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
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
