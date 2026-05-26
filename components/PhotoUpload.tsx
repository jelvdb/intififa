"use client";

import { useState, useRef, useEffect } from "react";
import PhotoReviewModal, { type AnalysisResult, type CorrectedResult } from "./PhotoReviewModal";
import { requireAuth } from "@/lib/auth";

interface Photo {
  filename: string;
  date: string;
  note: string;
}

interface Props {
  photos: Photo[];
  onUploaded: (photos: Photo[], newIds: string[], dupIds: string[]) => void;
}

type Step = "idle" | "open" | "analyzing" | "review" | "applying";

const PROGRESS_STEPS = [
  { label: "Foto verwerken",            icon: "🖼️" },
  { label: "AI herkent stickers",       icon: "🤖" },
  { label: "Vergelijken met collectie", icon: "📋" },
];

export default function PhotoUpload({ photos, onUploaded }: Props) {
  const [step, setStep] = useState<Step>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animate progress steps while analyzing
  useEffect(() => {
    if (step !== "analyzing") return;
    setProgressStep(0);
    const t1 = setTimeout(() => setProgressStep(1), 700);
    return () => clearTimeout(t1);
  }, [step]);

  function handleFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleAnalyze() {
    if (!file) return;
    setStep("analyzing");

    const fd = new FormData();
    fd.append("photo", file);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60_000);

      const res = await fetch("/api/analyze-photo", { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`API fout: ${res.status}`);

      const data = await res.json();
      setProgressStep(2);
      setResult(data);

      await new Promise((r) => setTimeout(r, 700));
      setStep("review");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Onbekende fout";
      alert(`Analyse mislukt: ${msg}\n\nProbeer opnieuw.`);
      setStep("open");
      setProgressStep(0);
    }
  }

  async function handleApprove(corrected: CorrectedResult) {
    if (!file) return;
    setStep("applying");

    await fetch("/api/apply-stickers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corrected),
    });

    const fd = new FormData();
    fd.append("photo", file);
    const note = `${corrected.newStickers.length} nieuw · ${corrected.duplicateStickers.length} dubbel`;
    fd.append("note", note);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
    if (uploadRes.ok) {
      const stateRes = await fetch("/api/state");
      const state = await stateRes.json();
      onUploaded(state.photos, corrected.newStickers, corrected.duplicateStickers);
    }

    reset();
  }

  function reset() {
    setStep("idle");
    setFile(null);
    setPreview(null);
    setResult(null);
    setProgressStep(0);
  }

  return (
    <>
      {/* FAB */}
      <button
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-bold shadow-lg text-sm"
        style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
        onClick={async () => {
          if (await requireAuth()) setStep("open");
        }}
      >
        📷 Foto opladen
      </button>

      {/* ── Upload sheet ── */}
      {step === "open" && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-bold">📷 Stickers opladen</h2>
              <button className="text-2xl" style={{ color: "#94a3b8" }} onClick={reset}>✕</button>
            </div>

            {/* Drop zone */}
            <button
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8"
              style={{ borderColor: "#334d80", background: "#1a1a2e" }}
              onClick={() => inputRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-52 rounded-xl object-contain" />
              ) : (
                <>
                  <span className="text-4xl">📸</span>
                  <span className="text-sm" style={{ color: "#94a3b8" }}>Tik om foto te kiezen</span>
                  <span className="text-xs" style={{ color: "#475569" }}>Leg stickers naast elkaar, codekant boven</span>
                </>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <button
              disabled={!file}
              className="rounded-2xl py-4 font-bold text-sm disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
              onClick={handleAnalyze}
            >
              Analyseren
            </button>

            {/* History */}
            {photos.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#94a3b8" }}>Eerder opgeladen</h3>
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
        </div>
      )}

      {/* ── Progress screen ── */}
      {step === "analyzing" && preview && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 px-8" style={{ background: "#0f0f1a" }}>
          {/* Animated photo */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="foto"
              className="rounded-3xl object-cover"
              style={{ width: 220, height: 220, opacity: 0.75 }}
            />
            {/* Scan line */}
            <div
              className="absolute inset-x-0 rounded-3xl overflow-hidden"
              style={{ top: 0, bottom: 0 }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, transparent, #e8c84a, transparent)",
                  animation: "scanline 1.8s ease-in-out infinite",
                }}
              />
            </div>
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                boxShadow: "0 0 40px #e8c84a44",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {PROGRESS_STEPS.map((s, i) => {
              const done = i < progressStep;
              const active = i === progressStep;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300"
                    style={{
                      background: done ? "#16a34a" : active ? "#1e3a5f" : "#1a1a2e",
                      border: `2px solid ${done ? "#16a34a" : active ? "#3b82f6" : "#1e2a3a"}`,
                    }}
                  >
                    {done ? "✓" : active ? (
                      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                    ) : s.icon}
                  </div>
                  <span
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: done ? "#4ade80" : active ? "#f1f5f9" : "#334155" }}
                  >
                    {s.label}
                    {active && <span style={{ animation: "blink 1s step-end infinite" }}>...</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes scanline {
              0%   { top: 0; }
              50%  { top: calc(100% - 2px); }
              100% { top: 0; }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* ── Review modal ── */}
      {(step === "review" || step === "applying") && result && preview && (
        <PhotoReviewModal
          preview={preview}
          result={result}
          onApprove={handleApprove}
          onCancel={reset}
          applying={step === "applying"}
        />
      )}
    </>
  );
}
