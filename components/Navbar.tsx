"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/study-session", label: "Session" },
  { href: "/upload", label: "Upload" },
  { href: "/library", label: "Library" },
  { href: "/settings", label: "Settings" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 mb-4 rounded-2xl border border-blue-200/20 bg-slate-950/40 px-3 py-2 backdrop-blur">
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" className="font-bold tracking-tight text-blue-100">
          AetherStudy
        </Link>
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
                active ? "bg-blue-500 text-white" : "bg-blue-900/30 text-blue-100"
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
