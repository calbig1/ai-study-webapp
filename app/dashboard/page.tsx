"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { accuracyPercent, getStats, getUploads } from "@/lib/storage";
import { UploadItem } from "@/lib/types";

export default function DashboardPage() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const stats = getStats();
    setUploads(getUploads().slice(0, 6));
    setAccuracy(accuracyPercent(stats));
    setStreak(stats.streakDays);
  }, []);

  const cards = useMemo(
    () => [
      { label: "Accuracy", value: `${accuracy}%` },
      { label: "Streak", value: `${streak}d` },
      { label: "Uploads", value: `${uploads.length}` }
    ],
    [accuracy, streak, uploads.length]
  );

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="panel-grid sm:grid-cols-3">
          {cards.map((card) => (
            <ThreeDCard key={card.label}>
              <p className="text-xs uppercase text-blue-200">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
            </ThreeDCard>
          ))}
        </div>

        <ThreeDCard className="mt-3">
          <h2 className="text-xl font-bold text-white">Continue where you left off</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/study-session" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
              Continue Studying
            </Link>
            <Link href="/quiz-mode" className="rounded-xl border border-blue-200/30 px-4 py-3 text-sm text-blue-100">
              Quiz Mode
            </Link>
            <Link href="/flashcards" className="rounded-xl border border-blue-200/30 px-4 py-3 text-sm text-blue-100">
              Flashcards
            </Link>
          </div>
        </ThreeDCard>

        <ThreeDCard className="mt-3">
          <h3 className="text-lg font-bold text-white">Recent uploads</h3>
          <div className="mt-3 space-y-2">
            {uploads.length === 0 && <p className="text-sm text-blue-100/75">No files yet. Upload to start a session.</p>}
            {uploads.map((u) => (
              <div key={u.id} className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-3 text-sm text-blue-50">
                {u.name}
              </div>
            ))}
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
