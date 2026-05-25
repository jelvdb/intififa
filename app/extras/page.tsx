"use client";

import { useCallback, useEffect, useState } from "react";

interface ExtraSticker {
  id: string;
  label: string;
  count: number;
}

export default function ExtrasPage() {
  const [extras, setExtras] = useState<ExtraSticker[]>([]);

  useEffect(() => {
    fetch("/api/state")
      .then((r) => r.json())
      .then((s) => setExtras(s.extras ?? []));
  }, []);

  const handleDelta = useCallback(async (id: string, delta: number) => {
    setExtras((prev) =>
      prev
        .map((e) => e.id === id ? { ...e, count: Math.max(0, e.count + delta) } : e)
        .filter((e) => e.count > 0)
    );
    await fetch("/api/extras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delta", id, delta }),
    });
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setExtras((prev) => prev.filter((e) => e.id !== id));
    await fetch("/api/extras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
  }, []);

  const totalExtras = extras.reduce((sum, e) => sum + e.count, 0);

  return (
    <div className="min-h-dvh pb-24">
      <div
        className="sticky top-0 z-30 px-4 py-4"
        style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">⭐ Extra stickers</h1>
            <p className="text-xs" style={{ color: "#64748b" }}>
              {extras.length} soort{extras.length !== 1 ? "en" : ""} · {totalExtras} totaal
            </p>
          </div>
          <div
            className="rounded-xl px-3 py-1.5 text-sm font-bold"
            style={{ background: "#1a1a2e", color: "#e8c84a" }}
          >
            {totalExtras}×
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 max-w-lg mx-auto flex flex-col gap-2">
        {extras.length === 0 ? (
          <div className="text-center py-16" style={{ color: "#475569" }}>
            <div className="text-4xl mb-3">⭐</div>
            <p className="font-semibold">Geen extra stickers</p>
            <p className="text-sm mt-1">Upload een foto via de Foto-tab om extra stickers te herkennen</p>
          </div>
        ) : (
          extras.map((entry) => (
            <ExtraRow
              key={entry.id}
              entry={entry}
              onDelta={handleDelta}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ExtraRow({
  entry,
  onDelta,
  onDelete,
}: {
  entry: ExtraSticker;
  onDelta: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a" }}
    >
      <span className="text-xl leading-none">⭐</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "#f1f5f9" }}>{entry.label}</div>
        <div className="text-xs" style={{ color: "#475569" }}>Extra sticker</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: "#0f1a2e", color: "#94a3b8" }}
          onClick={() => onDelta(entry.id, -1)}
        >−</button>
        <span className="w-5 text-center font-bold text-sm" style={{ color: "#e8c84a" }}>{entry.count}</span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: "#0f1a2e", color: "#94a3b8" }}
          onClick={() => onDelta(entry.id, +1)}
        >+</button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm ml-1"
          style={{ background: "#1a0f0f", color: "#f87171" }}
          onClick={() => onDelete(entry.id)}
        >✕</button>
      </div>
    </div>
  );
}
