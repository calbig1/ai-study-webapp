"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/storage";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/scan-solver", label: "Scan" },
  { href: "/ai-chat", label: "AI Chat" },
  { href: "/notes", label: "Notes" },
  { href: "/practice", label: "Practice" },
  { href: "/flashcards", label: "Cards" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [studySpaceName, setStudySpaceName] = useState("AetherStudy");

  useEffect(() => {
    const sync = () => setStudySpaceName(getSettings().studySpaceName || "AetherStudy");
    sync();
    window.addEventListener("aether:settings-changed", sync);
    return () => window.removeEventListener("aether:settings-changed", sync);
  }, []);

  return (
    <header className="sticky top-0 z-20 mb-4 rounded-2xl border border-blue-200/30 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div>
          <Link href="/dashboard" className="font-bold tracking-tight text-slate-900">
            {studySpaceName}
          </Link>
          <p className="text-[11px] text-slate-500">Your AI study co-pilot</p>
        </div>
        <Link href="/scan-solver" className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
          Solve now
        </Link>
      </div>
      <nav className="mt-2 flex flex-wrap gap-2">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                active ? "bg-[var(--primary)] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
