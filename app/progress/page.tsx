"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { accuracyPercent, getStats, topWeakTopics } from "@/lib/storage";

export default function ProgressPage() {
  const [accuracy, setAccuracy] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [weak, setWeak] = useState<string[]>([]);

  useEffect(() => {
    const stats = getStats();
    setAccuracy(accuracyPercent(stats));
    setAnswered(stats.totalAnswered);
    setWeak(topWeakTopics(stats));
  }, []);

  const completionBars = useMemo(
    () => [
      { label: "Accuracy", value: accuracy },
      { label: "Questions Completed", value: Math.min(answered, 100) },
      { label: "Consistency", value: Math.min(20 + Math.floor(answered * 0.8), 100) }
    ],
    [accuracy, answered]
  );

  return (
    <main className="min-h-screen bg-bg pb-10">
      <Navbar />
      <div className="mx-auto max-w-4xl space-y-6 px-4 pt-6 sm:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900">Progress</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Accuracy" value={`${accuracy}%`} />
            <Metric label="Questions completed" value={`${answered}`} />
            <Metric label="Weak topics" value={`${weak.length}`} />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Performance bars</h2>
          <div className="mt-4 space-y-4">
            {completionBars.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">Weak topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {weak.length === 0 && <p className="text-sm text-slate-500">No weak topics detected yet.</p>}
            {weak.map((topic) => (
              <span key={topic} className="rounded-full border border-incorrect/30 bg-incorrect/10 px-3 py-1 text-xs font-semibold text-incorrect">
                {topic}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}
