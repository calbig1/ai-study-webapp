"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { accuracyPercent, getPack, getSettings, getStats, getUploads, topWeakTopics } from "@/lib/storage";
import { GeneratedStudyPack, UploadItem } from "@/lib/types";

export default function DashboardPage() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [pack, setPack] = useState<GeneratedStudyPack>(getPack());
  const [accuracy, setAccuracy] = useState(0);
  const [streak, setStreak] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("AetherStudy");
  const [weak, setWeak] = useState<string[]>([]);

  useEffect(() => {
    const stats = getStats();
    setUploads(getUploads().slice(0, 6));
    setPack(getPack());
    setAccuracy(accuracyPercent(stats));
    setStreak(stats.streakDays);
    setWorkspaceName(getSettings().studySpaceName || "AetherStudy");
    setWeak(topWeakTopics(stats));
  }, []);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-white">{workspaceName}</h1>
            <p className="mt-2 text-sm text-blue-100/85">Your study home now surfaces active topics, tutor guidance, and the next best action.</p>
            <div className="mt-5 panel-grid sm:grid-cols-3">
              {[
                { label: "Accuracy", value: `${accuracy}%` },
                { label: "Streak", value: `${streak}d` },
                { label: "Topics", value: `${pack.topics.length}` }
              ].map((card) => (
                <div key={card.label} className="rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase text-blue-200">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-white">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/study-session" className="rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white">
                Continue Studying
              </Link>
              <Link href="/tutor" className="rounded-xl border border-blue-200/30 px-4 py-3 text-sm text-blue-100">
                Open AI Tutor
              </Link>
              <Link href="/study/setup" className="rounded-xl border border-blue-200/30 px-4 py-3 text-sm text-blue-100">
                Change Setup
              </Link>
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Focus now</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(pack.topics.length ? pack.topics : ["Upload notes to generate focused topics"]).slice(0, 6).map((topic) => (
                <span key={topic} className="app-chip rounded-full px-3 py-1 text-xs">
                  {topic}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
              <p className="text-sm font-semibold text-white">Weak areas</p>
              <p className="mt-2 text-sm text-blue-100/80">{weak.length ? weak.join(", ") : "No weak areas tracked yet."}</p>
            </div>
          </ThreeDCard>
        </div>

        <ThreeDCard className="mt-3">
          <h2 className="text-xl font-bold text-white">Tutor guide</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {pack.tutorGuide.length === 0 && <p className="text-sm text-blue-100/75">No tutor guidance yet. Upload actual notes or paste the study guide.</p>}
            {pack.tutorGuide.slice(0, 3).map((line) => (
              <div key={line} className="rounded-xl border border-blue-200/20 bg-slate-950/35 p-4 text-sm text-blue-50">
                {line}
              </div>
            ))}
          </div>
        </ThreeDCard>

        <ThreeDCard className="mt-3">
          <h3 className="text-lg font-bold text-white">Recent uploads</h3>
          <div className="mt-3 space-y-2">
            {uploads.length === 0 && <p className="text-sm text-blue-100/75">No files yet. Upload or paste notes to start a session.</p>}
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
