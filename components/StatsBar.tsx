"use client";

interface StatsBarProps {
  total: number;
  collected: number;
}

export default function StatsBar({ total, collected }: StatsBarProps) {
  const missing = total - collected;
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="sticky top-0 z-30 px-4 py-3" style={{ background: "#0f0f1a", borderBottom: "1px solid #1e2a3a" }}>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
            FIFA WK 2026
          </span>
          <span className="text-xs font-bold" style={{ color: "#e8c84a" }}>
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "#1a2540" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #e8c84a, #f97316)",
            }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard value={total} label="Totaal" color="#94a3b8" />
          <StatCard value={collected} label="Verzameld" color="#4ade80" />
          <StatCard value={missing} label="Mist nog" color="#f87171" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl p-2 text-center" style={{ background: "#1a1a2e" }}>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: "#64748b" }}>
        {label}
      </div>
    </div>
  );
}
