"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const path = usePathname();

  const tabs = [
    { href: "/",           label: "Collectie", icon: "📚" },
    { href: "/duplicates", label: "Dubbels",   icon: "🔁" },
    { href: "/extras",     label: "Extra",     icon: "⭐" },
    { href: "/upload",     label: "Foto",      icon: "📷" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex"
      style={{ background: "#12121f", borderTop: "1px solid #1e2a3a" }}
    >
      {tabs.map((tab) => {
        const active = path === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={{ color: active ? "#e8c84a" : "#475569" }}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-xs font-semibold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
