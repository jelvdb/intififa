"use client";

import { useState, useRef } from "react";

interface Photo {
  filename: string;
  date: string;
  note: string;
}

interface PhotoUploadProps {
  photos: Photo[];
  onUploaded: (photos: Photo[]) => void;
}

export default function PhotoUpload({ photos, onUploaded }: PhotoUploadProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("photo", file);
    fd.append("note", note);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const stateRes = await fetch("/api/state");
      const state = await stateRes.json();
      onUploaded(state.photos);
      setFile(null);
      setPreview(null);
      setNote("");
    }
    setLoading(false);
  }

  return (
    <>
      {/* FAB */}
      <button
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-bold shadow-lg text-sm"
        style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
        onClick={() => setOpen(true)}
      >
        📷 Foto opladen
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-bold">📷 Dagelijkse foto</h2>
              <button className="text-2xl" style={{ color: "#94a3b8" }} onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Upload zone */}
            <button
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8"
              style={{ borderColor: "#334d80", background: "#1a1a2e" }}
              onClick={() => inputRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="max-h-48 rounded-xl object-contain" />
              ) : (
                <>
                  <span className="text-4xl">📸</span>
                  <span className="text-sm" style={{ color: "#94a3b8" }}>Tik om een foto te kiezen</span>
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

            {/* Note */}
            <input
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a", color: "#f1f5f9" }}
              placeholder="Notitie (optioneel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button
              disabled={!file || loading}
              className="rounded-xl py-3 font-bold text-sm disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
              onClick={handleUpload}
            >
              {loading ? "Uploaden..." : "Opslaan"}
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
    </>
  );
}
