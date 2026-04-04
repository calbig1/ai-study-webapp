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
        <div className="grid gap-3 lg:grid-cols-2">
          <ThreeDCard>
            <h1 className="text-2xl font-extrabold text-slate-900">Progress Tracker</h1>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Metric label="Accuracy" value={`${accuracy}%`} />
              <Metric label="Answered" value={`${stats.totalAnswered}`} />
              <Metric label="Streak" value={`${stats.streakDays}d`} />
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Topics mastered: {Math.max(0, pack.topics.length - weak.length)}</div>
          </ThreeDCard>
          <ThreeDCard>
            <h2 className="text-lg font-bold text-slate-900">Weak areas</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {weak.length ? weak.map((topic) => <span key={topic} className="rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-700">{topic}</span>) : <p className="text-sm text-slate-600">No weak topics detected yet.</p>}
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-blue-50 p-3">
      <p className="text-xs uppercase text-blue-600">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
