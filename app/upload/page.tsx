"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

type Step = "idle" | "analyzing" | "review" | "applying";

export default function UploadPage() {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [photos, setPhotos] = useState<{ filename: string; date: string; note: string }[]>([]);

  useEffect(() => {
    fetch("/api/state").then((r) => r.json()).then((s) => setPhotos(s.photos ?? []));
  }, []);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleAnalyze(f: File) {
    setStep("analyzing");
    const fd = new FormData();
    fd.append("photo", f);
    const res = await fetch("/api/analyze-all", { method: "POST", body: fd });
    const data = await res.json();
    setResult(data);
    setStep("review");
  }

  const handleApprove = useCallback(async () => {
    if (!result || !file) return;
    setStep("applying");

    const { newStickers, duplicateStickers, extraLabels } = result;

    // Apply regular stickers
    if (newStickers.length > 0 || duplicateStickers.length > 0) {
      await fetch("/api/apply-stickers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStickers, duplicateStickers }),
      });
    }

    // Add extra stickers one by one
    for (const label of extraLabels) {
      await fetch("/api/extras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", label }),
      });
    }

    // Save the photo
    const totalNew = newStickers.length + extraLabels.length;
    const note = [
      newStickers.length > 0 && `${newStickers.length} nieuw`,
      duplicateStickers.length > 0 && `${duplicateStickers.length} dubbel`,
      extraLabels.length > 0 && `${extraLabels.length} extra`,
    ].filter(Boolean).join(" · ");

    const fd2 = new FormData();
    fd2.append("photo", file);
    fd2.append("note", note || "Geen stickers herkend");
    await fetch("/api/upload", { method: "POST", body: fd2 });

    reset();

    // Refresh state and navigate to collection if new stickers were added
    if (totalNew > 0) {
      router.push("/");
    } else {
      const stateRes = await fetch("/api/state");
      const s = await stateRes.json();
      setPhotos(s.photos ?? []);
    }
  }, [result, file, router]);

  function reset() {
    setStep("idle");
    setFile(null);
    setPreview(null);
    setResult(null);
  }

  const hasResults = result && (
    result.newStickers.length + result.duplicateStickers.length +
    result.extraLabels.length + result.unknownCodes.length > 0
  );

  return (
    <div className="min-h-dvh pb-24">
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-4"
        style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold">📷 Foto opladen</h1>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Herkent automatisch nieuwe, dubbele en extra stickers
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 max-w-lg mx-auto flex flex-col gap-4">

        {/* Camera / gallery buttons or preview */}
        {step === "idle" || step === "analyzing" ? (
          <>
            {preview ? (
              /* Preview + analyze */
              <div className="flex flex-col gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="preview"
                  className="w-full rounded-2xl object-contain max-h-64"
                  style={{ background: "#1a1a2e" }}
                />
                <div className="flex gap-3">
                  <button
                    className="flex-1 rounded-2xl py-3 font-bold text-sm"
                    style={{ background: "#1e2a3a", color: "#94a3b8" }}
                    onClick={reset}
                    disabled={step === "analyzing"}
                  >
                    Andere foto
                  </button>
                  <button
                    className="flex-1 rounded-2xl py-3 font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
                    onClick={() => file && handleAnalyze(file)}
                    disabled={step === "analyzing"}
                  >
                    {step === "analyzing" ? (
                      <><span className="animate-spin inline-block">⟳</span> Herkennen...</>
                    ) : "Analyseren"}
                  </button>
                </div>
              </div>
            ) : (
              /* Pick source */
              <div className="flex flex-col gap-3">
                <button
                  className="rounded-2xl py-6 flex flex-col items-center gap-2 font-bold text-sm"
                  style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a" }}
                  onClick={() => cameraRef.current?.click()}
                >
                  <span className="text-4xl">📸</span>
                  <span>Camera openen</span>
                  <span className="text-xs font-normal" style={{ color: "#64748b" }}>
                    Maak direct een foto
                  </span>
                </button>

                <button
                  className="rounded-2xl py-6 flex flex-col items-center gap-2 font-bold text-sm"
                  style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a" }}
                  onClick={() => galleryRef.current?.click()}
                >
                  <span className="text-4xl">🖼️</span>
                  <span>Galerij kiezen</span>
                  <span className="text-xs font-normal" style={{ color: "#64748b" }}>
                    Kies een bestaande foto
                  </span>
                </button>

                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { handleFile(f); handleAnalyze(f); }
                  }}
                />
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>
            )}
          </>
        ) : null}

        {/* Review */}
        {(step === "review" || step === "applying") && result && (
          <div className="flex flex-col gap-3">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="preview"
                className="w-full rounded-2xl object-contain max-h-48"
                style={{ background: "#1a1a2e" }}
              />
            )}

            {result.newStickers.length > 0 && (
              <ResultSection
                title="Nieuw"
                emoji="✨"
                color="#4ade80"
                bg="#0d2b1a"
                items={result.newStickers.map((id) => {
                  const f = stickerMap.get(id);
                  return f ? `${f.sticker.code} — ${f.sticker.label}` : id;
                })}
                flags={result.newStickers.map((id) => stickerMap.get(id)?.section.flag ?? "")}
              />
            )}

            {result.duplicateStickers.length > 0 && (
              <ResultSection
                title="Dubbel"
                emoji="🔁"
                color="#fbbf24"
                bg="#2a1f0a"
                items={result.duplicateStickers.map((id) => {
                  const f = stickerMap.get(id);
                  return f ? `${f.sticker.code} — ${f.sticker.label}` : id;
                })}
                flags={result.duplicateStickers.map((id) => stickerMap.get(id)?.section.flag ?? "")}
              />
            )}

            {result.extraLabels.length > 0 && (
              <ResultSection
                title="Extra sticker"
                emoji="⭐"
                color="#a78bfa"
                bg="#1a1030"
                items={result.extraLabels}
                flags={result.extraLabels.map(() => "⭐")}
              />
            )}

            {result.unknownCodes.length > 0 && (
              <div className="rounded-2xl p-4" style={{ background: "#1a1218", border: "1.5px solid #3f1f2a" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "#f87171" }}>
                  ⚠️ Niet herkend ({result.unknownCodes.length})
                </p>
                <p className="text-xs" style={{ color: "#64748b" }}>{result.unknownCodes.join(", ")}</p>
              </div>
            )}

            {!hasResults && (
              <div className="text-center py-8" style={{ color: "#64748b" }}>
                <p className="text-3xl mb-2">🤔</p>
                <p className="font-semibold">Geen stickers herkend</p>
                <p className="text-sm mt-1">Probeer een duidelijkere foto</p>
              </div>
            )}

            <div className="flex gap-3 mt-1">
              <button
                className="flex-1 rounded-2xl py-4 font-bold text-sm"
                style={{ background: "#1e2a3a", color: "#94a3b8" }}
                onClick={reset}
                disabled={step === "applying"}
              >
                Annuleren
              </button>
              {hasResults && (
                <button
                  className="flex-1 rounded-2xl py-4 font-bold text-sm disabled:opacity-50"
                  style={{
                    background: step === "applying" ? "#334155" : "linear-gradient(135deg, #e8c84a, #f97316)",
                    color: "#0f0f1a",
                  }}
                  onClick={handleApprove}
                  disabled={step === "applying"}
                >
                  {step === "applying" ? "Opslaan..." : "Goedkeuren"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {step === "idle" && photos.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#94a3b8" }}>Eerder opgeladen</h3>
            <div className="flex flex-col gap-2">
              {photos.slice(0, 5).map((p) => (
                <div
                  key={p.filename}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: "#1a1a2e" }}
                >
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
    </div>
  );
}

function ResultSection({
  title, emoji, color, bg, items, flags,
}: {
  title: string; emoji: string; color: string; bg: string; items: string[]; flags: string[];
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: bg, border: `1.5px solid ${color}33` }}>
      <p className="text-sm font-bold mb-3" style={{ color }}>
        {emoji} {title} ({items.length})
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-lg leading-none w-6 shrink-0">{flags[i]}</span>
            <span className="text-sm" style={{ color: "#e2e8f0" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
