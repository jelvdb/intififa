"use client";

interface StatsBarProps {
  total: number;
  collected: number;
}

export default function StatsBar({ total, collected }: StatsBarProps) {
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-30 px-4 py-3" style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <img
          src="/paninti.png"
          alt="Panini"
          style={{ height: 28, width: "auto", opacity: 0.92 }}
        />
        <span className="text-xs font-bold" style={{ color: "#e8c84a" }}>
          {pct}% ({collected} van {total})
        </span>
      </div>
    </div>
  );
}
