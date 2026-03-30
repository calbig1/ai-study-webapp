"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getSetup, setSetup } from "@/lib/storage";
import { StudyMode } from "@/lib/types";

const modes: { id: StudyMode; title: string; desc: string }[] = [
  { id: "quiz", title: "Quiz Mode", desc: "One MCQ at a time with instant feedback." },
  { id: "flashcards", title: "Flashcards", desc: "Flip one card, rate it, keep moving." },
  { id: "review", title: "Rapid Review", desc: "One concept at a time in 1-2 lines." }
];

export default function StudySetupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<StudyMode>("quiz");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [focusArea, setFocusArea] = useState("");

  useEffect(() => {
    const saved = getSetup();
    setMode(saved.mode);
    setQuestionCount(saved.questionCount);
    setFocusArea(saved.focusArea);
  }, []);

  const start = () => {
    setSetup({ mode, questionCount, focusArea });
    router.push("/study");
  };

  return (
    <main className="min-h-screen bg-bg pb-10">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900">Study Setup</h1>
          <p className="mt-1 text-sm text-slate-600">Choose one mode and begin.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {modes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === item.id ? "border-primary bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <p className="text-base font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Number of questions (optional)
              <input
                type="number"
                min={5}
                max={40}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value || 10))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Focus area (optional)
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="Ex: Cell respiration"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={start}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
          >
            Start Studying
          </button>
        </section>
      </div>
    </main>
  );
}
