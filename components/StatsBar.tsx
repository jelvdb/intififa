"use client";

interface StatsBarProps {
  total: number;
  collected: number;
}

export default function StatsBar({ total, collected }: StatsBarProps) {
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="sticky top-11 z-30 px-4 py-3" style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">🏆 Collectie</h1>
          <p className="text-xs" style={{ color: "#64748b" }}>
            {collected} verzameld · {total - collected} nog te gaan
          </p>
        </div>
        <div
          className="rounded-xl px-3 py-1.5 text-sm font-bold"
          style={{ background: "#1a1a2e", color: "#e8c84a" }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
