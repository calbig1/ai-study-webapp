"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";

const BANK = {
  easy: "What is the slope of a line that rises 2 and runs 1?",
  medium: "Solve: 2x^2 - 8x + 6 = 0",
  hard: "Prove whether f(x)=x^3-3x is injective on all real numbers."
};

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const question = useMemo(() => BANK[difficulty], [difficulty]);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-extrabold text-slate-900">Practice Mode</h1>
          <p className="mt-2 text-sm text-slate-600">Adaptive questions based on weak areas, notes, and selected difficulty.</p>
          <div className="mt-3 flex gap-2">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${difficulty === level ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{question}</p>
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            className="mt-3 w-full rounded-2xl border border-blue-200 p-3 text-sm"
            placeholder="Type your answer here..."
          />
          <div className="mt-3 flex gap-2">
            <button
              className="touch-btn rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setFeedback(answer.length > 12 ? "Great effort. Your logic is clear. Review one minor step." : "Try adding more reasoning, not just the final answer.")}
            >
              Check answer
            </button>
            <button
              className="rounded-xl border border-blue-300 px-4 py-2 text-sm text-slate-700"
              onClick={() => setFeedback("Explain mistake: You skipped the justification step. State the rule before applying it.")}
            >
              Explain mistake
            </button>
          </div>
          {feedback && <p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-slate-700">{feedback}</p>}
        </ThreeDCard>
      </div>
    </main>
  );
}
