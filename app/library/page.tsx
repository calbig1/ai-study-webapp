"use client";

import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getPack, getUploads } from "@/lib/storage";

export default function LibraryPage() {
  const uploads = getUploads();
  const pack = getPack();

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <ThreeDCard>
            <h1 className="text-2xl font-black text-white">Library</h1>
            <p className="mt-2 text-sm text-blue-100">Saved materials and parsed study content.</p>
            <div className="mt-4 space-y-2">
              {uploads.length === 0 && <p className="text-sm text-blue-100/75">No saved items yet.</p>}
              {uploads.map((u) => (
                <div key={u.id} className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-3 text-sm text-blue-50">
                  <div className="font-medium">{u.name}</div>
                  <div className="mt-1 text-xs text-blue-100/70">{u.type || "unknown"}{u.sourceType ? ` • ${u.sourceType}` : ""}</div>
                </div>
              ))}
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Current study pack</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Stat label="Questions" value={`${pack.mcqs.length}`} />
              <Stat label="Flashcards" value={`${pack.flashcards.length}`} />
              <Stat label="Summaries" value={`${pack.summaries.length}`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {pack.topics.slice(0, 10).map((topic) => (
                <span key={topic} className="app-chip rounded-full px-3 py-1 text-xs">
                  {topic}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
              <p className="text-sm font-semibold text-white">Tutor notes</p>
              <div className="mt-3 space-y-2 text-sm text-blue-100/85">
                {pack.tutorGuide.length === 0 && <p>No tutor notes generated yet.</p>}
                {pack.tutorGuide.slice(0, 4).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-200/20 bg-slate-950/35 p-4">
      <p className="text-xs uppercase text-blue-200">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
