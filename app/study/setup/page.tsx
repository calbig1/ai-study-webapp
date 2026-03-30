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
  { id: "quiz", title: "Quiz Mode", desc: "One test-style question at a time with explanations and progress." },
  { id: "flashcards", title: "Flashcards", desc: "Memory flips, confidence checks, and repeated weak-topic review." },
  { id: "review", title: "Rapid Review", desc: "Fast summaries and significance notes for cram sessions." }
];

export default function StudySetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<StudyMode>("quiz");
  const [questionCount, setQuestionCount] = useState(12);
  const [focusArea, setFocusArea] = useState("");
  const [timed, setTimed] = useState(false);
  const [tutorMode, setTutorMode] = useState(true);

  useEffect(() => {
    const saved = getSetup();
    setMode(saved.mode);
    setQuestionCount(saved.questionCount);
    setFocusArea(saved.focusArea);
    setTimed(saved.timed);
    setTutorMode(saved.tutorMode);
  }, []);

  const start = () => {
    setSetup({ mode, questionCount, focusArea, timed, tutorMode });
    router.push("/study-session");
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <ThreeDCard>
            <h1 className="text-2xl font-black text-white">Study Setup</h1>
            <p className="mt-2 text-sm text-blue-100">Tell the app what matters so it stays on-topic instead of guessing from random page language.</p>

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
                  placeholder="Example: Unit 7 - Aztecs and Incas"
                  className="mt-1 w-full rounded-xl border border-blue-200/30 bg-slate-950/40 px-3 py-2 text-white"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-blue-200/20 bg-slate-950/25 px-3 py-3 text-sm text-blue-100">
                <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
                Timed mode
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-blue-200/20 bg-slate-950/25 px-3 py-3 text-sm text-blue-100">
                <input type="checkbox" checked={tutorMode} onChange={(e) => setTutorMode(e.target.checked)} />
                Include tutor walkthroughs
              </label>
            </div>

            <AnimatedButton className="mt-5 w-full" onClick={start}>
              Start Session
            </AnimatedButton>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Recommended flow</p>
            <h2 className="mt-2 text-xl font-bold text-white">From upload to focused study</h2>
            <div className="mt-4 space-y-3 text-sm text-blue-100/85">
              <p>Use a specific focus area when the upload contains multiple chapters or review sheets.</p>
              <p>Turn tutor mode on if you want guided explanations and clear significance support.</p>
              <p>Quiz mode is best for real recall. Rapid review is best right before the test.</p>
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}
