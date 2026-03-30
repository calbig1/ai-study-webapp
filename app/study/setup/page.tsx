"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import AnimatedButton from "@/components/AnimatedButton";
import { getSetup, setSetup } from "@/lib/storage";
import { StudyMode } from "@/lib/types";

const modes: { id: StudyMode; title: string; desc: string }[] = [
  { id: "quiz", title: "Quiz Mode", desc: "Exam-style MCQs with tutor feedback." },
  { id: "flashcards", title: "Flashcards", desc: "3D flip cards with confidence tracking." },
  { id: "review", title: "Rapid Review", desc: "Fast concept passes for cramming." }
];

export default function StudySetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<StudyMode>("quiz");
  const [questionCount, setQuestionCount] = useState(12);
  const [focusArea, setFocusArea] = useState("");
  const [timed, setTimed] = useState(false);

  useEffect(() => {
    const saved = getSetup();
    setMode(saved.mode);
    setQuestionCount(saved.questionCount);
    setFocusArea(saved.focusArea);
    setTimed(saved.timed);
  }, []);

  const start = () => {
    setSetup({ mode, questionCount, focusArea, timed });
    router.push("/study-session");
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-black text-white">Study Setup</h1>
          <p className="mt-2 text-sm text-blue-100">Pick one mode and stay in that flow.</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {modes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`rounded-xl border p-3 text-left ${
                  mode === m.id ? "border-blue-300 bg-blue-500/30" : "border-blue-200/25 bg-slate-950/25"
                }`}
              >
                <p className="font-semibold text-white">{m.title}</p>
                <p className="mt-1 text-xs text-blue-100/85">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-blue-100">
              Number of questions
              <input
                type="number"
                min={5}
                max={40}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value || 10))}
                className="mt-1 w-full rounded-xl border border-blue-200/30 bg-slate-950/40 px-3 py-2 text-white"
              />
            </label>
            <label className="text-sm text-blue-100">
              Focus area
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="mt-1 w-full rounded-xl border border-blue-200/30 bg-slate-950/40 px-3 py-2 text-white"
              />
            </label>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-blue-100">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
            Timed mode
          </label>

          <AnimatedButton className="mt-5 w-full" onClick={start}>
            Start Session
          </AnimatedButton>
        </ThreeDCard>
      </div>
    </main>
  );
}
