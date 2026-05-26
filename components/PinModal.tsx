"use client";

import { useEffect, useRef, useState } from "react";
import { getPinResolver, clearPinResolver } from "@/lib/auth";

export default function PinModal() {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => {
      setPin("");
      setError(false);
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    const errorHandler = () => {
      setError(true);
      setPin("");
      setOpen(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    window.addEventListener("pin-modal-open", handler);
    window.addEventListener("pin-modal-error", errorHandler);
    return () => {
      window.removeEventListener("pin-modal-open", handler);
      window.removeEventListener("pin-modal-error", errorHandler);
    };
  }, []);

  function submit() {
    if (!pin) return;
    const resolve = getPinResolver();
    if (resolve) resolve(pin);
    clearPinResolver();
    setOpen(false);
  }

  function cancel() {
    const resolve = getPinResolver();
    if (resolve) resolve(null);
    clearPinResolver();
    setOpen(false);
    setPin("");
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100]" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={cancel} />
      <div
        className="fixed inset-x-4 z-[101] rounded-3xl p-6 flex flex-col gap-4 max-w-sm mx-auto"
        style={{ background: "#1a1a2e", border: "1.5px solid #1e2a3a", top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">🔒</div>
          <h2 className="font-bold text-base">PIN invoeren</h2>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>Vereist om wijzigingen te maken</p>
        </div>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={8}
          placeholder="••••"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full rounded-2xl px-4 py-3 text-center text-xl font-bold tracking-widest outline-none"
          style={{
            background: "#0f0f1a",
            border: `1.5px solid ${error ? "#f87171" : "#1e2a3a"}`,
            color: "#f1f5f9",
          }}
          autoComplete="current-password"
        />

        {error && (
          <p className="text-center text-sm" style={{ color: "#f87171" }}>Verkeerde PIN, probeer opnieuw</p>
        )}

        <div className="flex gap-3">
          <button
            className="flex-1 rounded-2xl py-3 font-bold text-sm"
            style={{ background: "#1e2a3a", color: "#94a3b8" }}
            onClick={cancel}
          >
            Annuleren
          </button>
          <button
            className="flex-1 rounded-2xl py-3 font-bold text-sm disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #e8c84a, #f97316)", color: "#0f0f1a" }}
            onClick={submit}
            disabled={!pin}
          >
            Bevestigen
          </button>
        </div>
      </div>
    </>
  );
}
