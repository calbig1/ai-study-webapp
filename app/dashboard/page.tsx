"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { accuracyPercent, getStats, getUploads } from "@/lib/storage";
import { UploadItem } from "@/lib/types";

export default function DashboardPage() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const list = getUploads();
    const stats = getStats();
    setUploads(list.slice(0, 5));
    setAccuracy(accuracyPercent(stats));
    setStreak(stats.streakDays);
  }, []);

  const progressLabel = useMemo(() => `${accuracy}%`, [accuracy]);

  return (
    <main className="min-h-screen bg-bg pb-10">
      <Navbar />
      <div className="mx-auto max-w-5xl space-y-6 px-4 pt-6 sm:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Your study space for this week.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatCard label="Progress" value={progressLabel} />
            <StatCard label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} />
            <StatCard label="Recent Uploads" value={`${uploads.length}`} />
          </div>
          <Link
            href="/study"
            className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Continue Studying
          </Link>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Recent uploads</h2>
          <div className="mt-4 space-y-3">
            {uploads.length === 0 && <p className="text-sm text-slate-500">No uploads yet. Start by adding notes.</p>}
            {uploads.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">{item.type || "Unknown"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </article>
  );
}
