import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import PinModal from "@/components/PinModal";

export const metadata: Metadata = {
  title: "Paninti 🏆 WK 2026 Stickerboek",
  description: "Panini FIFA World Cup 2026 sticker tracker",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {children}
        <BottomNav />
        <PinModal />
      </body>
    </html>
  );
}
