"use client";

import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { accuracyPercent, getPack, getStats, topWeakTopics } from "@/lib/storage";

export default function ProgressPage() {
  const stats = getStats();
  const pack = getPack();
  const accuracy = accuracyPercent(stats);
  const weak = topWeakTopics(stats);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <ThreeDCard>
            <h1 className="text-2xl font-black text-white">Progress</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Metric label="Accuracy" value={`${accuracy}%`} />
              <Metric label="Answered" value={`${stats.totalAnswered}`} />
              <Metric label="Streak" value={`${stats.streakDays}d`} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-4">
                <p className="text-xs uppercase text-blue-200">Generated topics</p>
                <p className="mt-2 text-2xl font-black text-white">{pack.topics.length}</p>
              </div>
              <div className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-4">
                <p className="text-xs uppercase text-blue-200">Tutor prompts</p>
                <p className="mt-2 text-2xl font-black text-white">{pack.tutorGuide.length}</p>
              </div>
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <h2 className="text-lg font-bold text-white">Weak concepts</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {weak.length === 0 && <p className="text-sm text-blue-100">No weak topics detected yet.</p>}
              {weak.map((topic) => (
                <span key={topic} className="rounded-full border border-rose-200/25 bg-rose-500/20 px-3 py-1 text-xs text-rose-100">
                  {topic}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
              <p className="text-sm font-semibold text-white">Topics in current pack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pack.topics.slice(0, 8).map((topic) => (
                  <span key={topic} className="app-chip rounded-full px-3 py-1 text-xs">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-3">
      <p className="text-xs uppercase text-blue-200">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
