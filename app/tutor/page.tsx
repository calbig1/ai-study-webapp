"use client";

import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getPack, getSettings } from "@/lib/storage";

export default function TutorPage() {
  const pack = getPack();
  const settings = getSettings();

  return (
    <main className="min-h-screen">
      <FloatingBackground intensity={settings.themeIntensity} />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">AI Tutor</p>
            <h1 className="mt-2 text-3xl font-black text-white">Walk me through it</h1>
            <p className="mt-2 text-sm text-blue-100/85">
              This mode pulls the strongest ideas from your current pack and explains them the way your selected tutor tone would.
            </p>
            <div className="mt-4 space-y-3">
              {pack.tutorGuide.length === 0 && <p className="text-sm text-blue-100/75">No tutor guide yet. Upload a stronger source or paste your class notes.</p>}
              {pack.tutorGuide.map((line) => (
                <div key={line} className="rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4 text-sm text-blue-50">
                  {line}
                </div>
              ))}
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Explain these topics</p>
            <div className="mt-3 space-y-3">
              {pack.summaries.slice(0, 5).map((summary) => (
                <div key={summary.concept} className="rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
                  <p className="text-sm font-semibold text-white">{summary.concept}</p>
                  <p className="mt-2 text-sm text-blue-100/85">{summary.text}</p>
                </div>
              ))}
              {pack.summaries.length === 0 && <p className="text-sm text-blue-100/75">No summaries generated yet.</p>}
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}
