"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import ProgressBar from "@/components/ProgressBar";
import AIResponseBox from "@/components/AIResponseBox";
import { getPack, getSetup, getUploads, setPack } from "@/lib/storage";
import { GeneratedStudyPack } from "@/lib/types";
import QuestionEngine from "@/components/QuestionEngine";

export default function StudySessionPage() {
  const [pack, setPackState] = useState<GeneratedStudyPack>(getPack());
  const [setup] = useState(getSetup);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploads: getUploads(), setup })
      });

      if (response.ok) {
        const fresh = (await response.json()) as GeneratedStudyPack;
        setPack(fresh);
        setPackState(fresh);
      }
    };

    run().catch(() => undefined);
  }, [setup]);

  const modeCount = useMemo(
    () => (setup.mode === "quiz" ? pack.mcqs.length : setup.mode === "flashcards" ? pack.flashcards.length : pack.summaries.length),
    [pack, setup.mode]
  );

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <ProgressBar value={modeCount === 0 ? 0 : 30} label="Session progress" />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-blue-100">Mode: {setup.mode}</p>
            <Link href="/dashboard" className="rounded-lg border border-blue-200/30 px-3 py-1 text-xs text-blue-100">
              Exit
            </Link>
          </div>
        </ThreeDCard>

        <ThreeDCard className="mt-3">
          {setup.mode === "quiz" && <QuestionEngine items={pack.mcqs.slice(0, setup.questionCount)} />}

          {setup.mode === "flashcards" && (
            <AIResponseBox
              title="Flashcard Flow"
              body="Use the dedicated flashcard route for swipe + 3D flip experience."
              tone="neutral"
            />
          )}

          {setup.mode === "review" && (
            <AIResponseBox title="Rapid Review" body={pack.summaries[0]?.text || "Upload content to begin."} tone="success" />
          )}

          <div className="mt-4 flex gap-2">
            <Link href="/quiz-mode" className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
              Quiz Route
            </Link>
            <Link href="/flashcards" className="rounded-xl border border-blue-200/30 px-3 py-2 text-xs text-blue-100">
              Flashcards Route
            </Link>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
