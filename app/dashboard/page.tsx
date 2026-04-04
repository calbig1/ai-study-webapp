"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { accuracyPercent, getStats, getUploads, topWeakTopics } from "@/lib/storage";
import { buildStudyPlan } from "@/lib/study-assistant";

export default function DashboardPage() {
  const [name, setName] = useState("there");
  const [streak, setStreak] = useState(1);
  const [accuracy, setAccuracy] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const [plan, setPlan] = useState<string[]>([]);

  useEffect(() => {
    const stats = getStats();
    const weak = topWeakTopics(stats);
    setName("there");
    setStreak(stats.streakDays);
    setAccuracy(accuracyPercent(stats));
    setRecent(getUploads().slice(0, 4).map((u) => u.name));
    setPlan(buildStudyPlan(weak));
  }, []);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <p className="text-sm font-semibold text-blue-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">What are you studying today, {name}?</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Quick href="/scan-solver" label="Scan Problem" />
            <Quick href="/ai-chat" label="Ask AI" />
            <Quick href="/notes" label="Upload Notes" />
          </div>
        </ThreeDCard>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <ThreeDCard>
            <h2 className="text-lg font-bold text-slate-900">Daily streak</h2>
            <p className="mt-2 text-4xl font-extrabold text-blue-600">{streak} days 🔥</p>
            <p className="mt-2 text-sm text-slate-600">Accuracy this week: {accuracy}%</p>
          </ThreeDCard>
          <ThreeDCard>
            <h2 className="text-lg font-bold text-slate-900">AI study plan</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {plan.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </ThreeDCard>
        </div>

        <ThreeDCard className="mt-3">
          <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            {recent.length ? recent.map((item) => <p key={item}>• {item}</p>) : <p>No activity yet. Start by scanning a problem.</p>}
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}

function Quick({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="touch-btn rounded-2xl bg-[var(--surface-soft)] px-4 py-4 text-center text-sm font-semibold text-slate-700">
      {label}
    </Link>
  );
}
