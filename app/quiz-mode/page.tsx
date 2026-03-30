"use client";

import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import QuestionEngine from "@/components/QuestionEngine";
import { getPack, getSetup } from "@/lib/storage";

export default function QuizModePage() {
  const pack = getPack();
  const setup = getSetup();
  const items = useMemo(() => pack.mcqs.slice(0, setup.questionCount), [pack.mcqs, setup.questionCount]);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-black text-white">Quiz Mode</h1>
          <p className="mt-2 text-sm text-blue-100">One question at a time. Real exam-style options.</p>
          <div className="mt-4">
            <QuestionEngine items={items} />
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
