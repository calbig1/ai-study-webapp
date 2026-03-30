"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/storage";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/study-session", label: "Session" },
  { href: "/tutor", label: "Tutor" },
  { href: "/upload", label: "Upload" },
  { href: "/library", label: "Library" },
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
    <header className="sticky top-0 z-20 mb-4 rounded-2xl border border-blue-200/20 bg-slate-950/40 px-3 py-2 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <div>
          <Link href="/dashboard" className="font-bold tracking-tight text-blue-100">
            {studySpaceName}
          </Link>
          <p className="text-[11px] text-blue-100/65">Study smarter, not wider</p>
        </div>
        <Link href="/progress" className="rounded-lg border border-blue-300/25 px-2 py-1 text-xs text-blue-100">
          Progress
        </Link>
      </div>
      <nav className="mt-2 flex flex-wrap gap-2">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                active ? "bg-[var(--primary)] text-white" : "bg-blue-900/30 text-blue-100"
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
