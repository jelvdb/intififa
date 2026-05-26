"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { sections } from "@/data/stickers";
import type { Sticker, Section } from "@/data/stickers";

const stickerMap = new Map<string, { sticker: Sticker; section: Section }>();
for (const section of sections) {
  for (const sticker of section.stickers) {
    stickerMap.set(sticker.id, { sticker, section });
  }
}

interface AnalysisResult {
  newStickers: string[];
  duplicateStickers: string[];
  unknownCodes: string[];
  extraLabels: string[];
}

type StickerStatus = "new" | "duplicate" | "ignore";
type ExtraStatus = "include" | "ignore";
type Step = "idle" | "analyzing" | "review" | "applying";

const STATUS_CFG = {
  new:       { label: "Nieuw",  emoji: "✨", color: "#4ade80", bg: "#0a2218", border: "#4ade8033" },
  duplicate: { label: "Dubbel", emoji: "🔁", color: "#fbbf24", bg: "#241a08", border: "#fbbf2433" },
  ignore:    { label: "Negeer", emoji: "✕",  color: "#475569", bg: "#131a24", border: "#47556933" },
};
const STATUS_CYCLE: Record<StickerStatus, StickerStatus> = { new: "duplicate", duplicate: "ignore", ignore: "new" };

const PROGRESS_STEPS = [
  { label: "Foto verwerken",            icon: "🖼️" },
  { label: "AI herkent stickers",       icon: "🤖" },
  { label: "Vergelijken met collectie", icon: "📋" },
];

export default function UploadPage() {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [photos, setPhotos] = useState<{ filename: string; date: string; note: string }[]>([]);

  // Per-sticker correction state
  const [statuses, setStatuses] = useState<Record<string, StickerStatus>>({});
  const [extraStatuses, setExtraStatuses] = useState<Record<number, ExtraStatus>>({});

  useEffect(() => {
    fetch("/api/state").then((r) => r.json()).then((s) => setPhotos(s.photos ?? []));
  }, []);

  async function toJpeg(f: File): Promise<File> {
    // Convert any format (HEIC, PNG, …) to JPEG via canvas
    return new Promise((resolve) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            resolve(blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : f);
          },
          "image/jpeg",
          0.92,
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(f); };
      img.src = url;
    });
  }

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleAnalyze(f: File) {
    setProgressStep(0);
    setStep("analyzing");
    const t1 = setTimeout(() => setProgressStep(1), 700);

    const jpeg = await toJpeg(f);
    const fd = new FormData();
    fd.append("photo", jpeg);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);
      const res = await fetch("/api/analyze-all", { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(timeout);
      clearTimeout(t1);

      if (!res.ok) throw new Error(`API fout: ${res.status}`);
      const data: AnalysisResult = await res.json();

      // Init correction state
      const s: Record<string, StickerStatus> = {};
      for (const id of data.newStickers) s[id] = "new";
      for (const id of data.duplicateStickers) s[id] = "duplicate";
      setStatuses(s);
      const es: Record<number, ExtraStatus> = {};
      data.extraLabels.forEach((_, i) => { es[i] = "include"; });
      setExtraStatuses(es);

      setProgressStep(2);
      setResult(data);
      await new Promise((r) => setTimeout(r, 700));
      setStep("review");
    } catch (e: unknown) {
      clearTimeout(t1);
      const msg = e instanceof Error ? e.message : "Onbekende fout";
      alert(`Analyse mislukt: ${msg}\n\nProbeer opnieuw.`);
      setStep("idle");
      setProgressStep(0);
    }
  }

  const handleApprove = useCallback(async () => {
    if (!result || !file) return;
    setStep("applying");

    const newStickers = Object.entries(statuses).filter(([, s]) => s === "new").map(([id]) => id);
    const duplicateStickers = Object.entries(statuses).filter(([, s]) => s === "duplicate").map(([id]) => id);
    const includedExtras = result.extraLabels.filter((_, i) => extraStatuses[i] === "include");

    if (newStickers.length > 0 || duplicateStickers.length > 0) {
      await fetch("/api/apply-stickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStickers, duplicateStickers }),
      });
    }

    for (const label of includedExtras) {
      await fetch("/api/extras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", label }),
      });
    }

    const noteParts = [
      newStickers.length > 0 && `${newStickers.length} nieuw`,
      duplicateStickers.length > 0 && `${duplicateStickers.length} dubbel`,
      includedExtras.length > 0 && `${includedExtras.length} extra`,
    ].filter(Boolean);
    const note = noteParts.join(" · ") || "Geen stickers opgeslagen";

    const fd2 = new FormData();
    fd2.append("photo", file);
    fd2.append("note", note);
    await fetch("/api/upload", { method: "POST", body: fd2 });

    reset();
    if (newStickers.length + includedExtras.length > 0) {
      router.push("/");
    } else {
      const s = await fetch("/api/state").then((r) => r.json());
      setPhotos(s.photos ?? []);
    }
  }, [result, file, statuses, extraStatuses, router]);

  function reset() {
    setStep("idle");
    setFile(null);
    setPreview(null);
    setResult(null);
    setStatuses({});
    setExtraStatuses({});
    setProgressStep(0);
  }

  const allIds = result ? [...result.newStickers, ...result.duplicateStickers] : [];
  const activeCount =
    allIds.filter((id) => statuses[id] !== "ignore").length +
    (result?.extraLabels.filter((_, i) => extraStatuses[i] === "include").length ?? 0);

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-4" style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}>
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold">📷 Foto opladen</h1>
          <p className="text-xs" style={{ color: "#64748b" }}>Herkent nieuwe, dubbele en extra stickers</p>
        </div>
      </div>

      {/* ── Idle: pick source ── */}
      {step === "idle" && !file && (
        <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-3">
          <button
            className="rounded-2xl py-6 flex flex-col items-center gap-2 font-bold text-sm"
            style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a" }}
            onClick={async () => {
              if (await requireAuth()) cameraRef.current?.click();
            }}
          >
            <span className="text-4xl">📸</span>
            <span>Camera openen</span>
            <span className="text-xs font-normal" style={{ color: "#64748b" }}>Maak direct een foto</span>
          </button>

          <button
            className="rounded-2xl py-6 flex flex-col items-center gap-2 font-bold text-sm"
            style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a" }}
            onClick={async () => {
              if (await requireAuth()) galleryRef.current?.click();
            }}
          >
            <span className="text-4xl">🖼️</span>
            <span>Galerij kiezen</span>
            <span className="text-xs font-normal" style={{ color: "#64748b" }}>Kies een bestaande foto</span>
          </button>

          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); handleAnalyze(f); } }} />
          <input ref={galleryRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {photos.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-semibold mb-2" style={{ color: "#64748b" }}>Eerder opgeladen</h3>
              <div className="flex flex-col gap-2">
                {photos.slice(0, 5).map((p) => (
                  <div key={p.filename} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "#1a1a2e" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/uploads/${p.filename}`} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: "#94a3b8" }}>
                        {new Date(p.date).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      {p.note && <div className="text-sm truncate">{p.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── File selected, not yet analyzed ── */}
      {step === "idle" && file && preview && (
        <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="w-full rounded-2xl object-contain" style={{ maxHeight: 320 }} />
          <div className="flex gap-3">
            <button className="flex-1 rounded-2xl py-3 font-bold text-sm" style={{ background: "#1e2a3a", color: "#94a3b8" }} onClick={reset}>
              Andere foto
            </button>
            <button
              className="flex-1 rounded-2xl py-3 font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
              onClick={() => handleAnalyze(file)}
            >
              Analyseren
            </button>
          </div>
        </div>
      )}

      {/* ── Progress screen ── */}
      {step === "analyzing" && preview && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 px-8" style={{ background: "#0f0f1a" }}>
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" className="rounded-3xl object-cover" style={{ width: 220, height: 220, opacity: 0.7 }} />
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div style={{
                position: "absolute", left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg, transparent, #e8c84a, transparent)",
                animation: "scanline 1.8s ease-in-out infinite",
              }} />
            </div>
            <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: "0 0 40px #e8c84a44" }} />
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            {PROGRESS_STEPS.map((s, i) => {
              const done = i < progressStep;
              const active = i === progressStep;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: done ? "#16a34a" : active ? "#1e3a5f" : "#1a1a2e", border: `2px solid ${done ? "#16a34a" : active ? "#3b82f6" : "#1e2a3a"}` }}>
                    {done ? "✓" : active ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> : s.icon}
                  </div>
                  <span className="text-sm font-medium" style={{ color: done ? "#4ade80" : active ? "#f1f5f9" : "#334155" }}>
                    {s.label}{active && <span style={{ animation: "blink 1s step-end infinite" }}>...</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes scanline { 0% { top: 0 } 50% { top: calc(100% - 2px) } 100% { top: 0 } }
            @keyframes spin { to { transform: rotate(360deg) } }
            @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
          `}</style>
        </div>
      )}

      {/* ── Review + applying ── */}
      {(step === "review" || step === "applying") && result && preview && (
        <div className="px-4 pt-4 pb-4 max-w-lg mx-auto flex flex-col gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="w-full rounded-2xl object-contain" style={{ maxHeight: 200 }} />

          {/* Summary */}
          <div className="flex gap-2 flex-wrap">
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#0a2218", color: "#4ade80" }}>
              ✨ {allIds.filter((id) => statuses[id] === "new").length} nieuw
            </span>
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#241a08", color: "#fbbf24" }}>
              🔁 {allIds.filter((id) => statuses[id] === "duplicate").length} dubbel
            </span>
            {result.extraLabels.length > 0 && (
              <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#1a1030", color: "#a78bfa" }}>
                ⭐ {result.extraLabels.filter((_, i) => extraStatuses[i] === "include").length} extra
              </span>
            )}
          </div>

          <p className="text-xs" style={{ color: "#475569" }}>Tik op de badge om te corrigeren</p>

          {/* Regular stickers */}
          {allIds.map((id) => {
            const found = stickerMap.get(id);
            if (!found) return null;
            const { sticker, section } = found;
            const s = statuses[id] ?? "new";
            const cfg = STATUS_CFG[s];
            return (
              <div key={id} className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                <span className="text-xl leading-none shrink-0">{section.flag}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs font-bold mr-2" style={{ color: cfg.color }}>{sticker.code}</span>
                  <span className="text-sm" style={{ color: "#e2e8f0" }}>{sticker.label}</span>
                </div>
                <button
                  onClick={() => setStatuses((prev) => ({ ...prev, [id]: STATUS_CYCLE[prev[id] ?? "new"] }))}
                  className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shrink-0"
                  style={{ background: `${cfg.color}22`, color: cfg.color }}
                  disabled={step === "applying"}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              </div>
            );
          })}

          {/* Extra stickers */}
          {result.extraLabels.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>⭐ Extra stickers</p>
              {result.extraLabels.map((label, i) => {
                const included = extraStatuses[i] === "include";
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2"
                    style={{ background: included ? "#1a1030" : "#131a24", border: `1.5px solid ${included ? "#a78bfa33" : "#47556933"}` }}>
                    <span className="text-xl leading-none">⭐</span>
                    <span className="flex-1 text-sm" style={{ color: included ? "#e2e8f0" : "#475569" }}>{label}</span>
                    <button
                      onClick={() => setExtraStatuses((prev) => ({ ...prev, [i]: prev[i] === "include" ? "ignore" : "include" }))}
                      className="rounded-full px-3 py-1 text-xs font-bold shrink-0"
                      style={{ background: included ? "#a78bfa22" : "#47556922", color: included ? "#a78bfa" : "#475569" }}
                      disabled={step === "applying"}
                    >
                      {included ? "✓ Opslaan" : "✕ Negeer"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Unknown codes */}
          {result.unknownCodes.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#1a1218", border: "1.5px solid #f8717133" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#f87171" }}>⚠️ Niet herkend ({result.unknownCodes.length})</p>
              <p className="text-xs" style={{ color: "#64748b" }}>{result.unknownCodes.join("  ·  ")}</p>
            </div>
          )}

          {allIds.length === 0 && result.extraLabels.length === 0 && (
            <div className="text-center py-8" style={{ color: "#64748b" }}>
              <p className="text-4xl mb-3">🤔</p>
              <p className="font-semibold">Geen stickers herkend</p>
              <p className="text-sm mt-1">Probeer een scherpere foto, codekant omhoog</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button className="flex-1 rounded-2xl py-4 font-bold text-sm" style={{ background: "#1e2a3a", color: "#94a3b8" }}
              onClick={reset} disabled={step === "applying"}>
              Annuleren
            </button>
            <button
              className="flex-1 rounded-2xl py-4 font-bold text-sm disabled:opacity-40"
              style={{
                background: step === "applying" || activeCount === 0 ? "#334155" : "linear-gradient(135deg, #e8c84a, #f97316)",
                color: "#0f0f1a",
              }}
              onClick={handleApprove}
              disabled={step === "applying" || activeCount === 0}
            >
              {step === "applying" ? "Opslaan..." : activeCount > 0 ? `Bevestigen (${activeCount})` : "Niets te bevestigen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
