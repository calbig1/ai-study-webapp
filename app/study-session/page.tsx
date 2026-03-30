"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import ProgressBar from "@/components/ProgressBar";
import AIResponseBox from "@/components/AIResponseBox";
import { getPack, getSettings, getSetup, getUploads, setPack } from "@/lib/storage";
import { GeneratedStudyPack } from "@/lib/types";
import QuestionEngine from "@/components/QuestionEngine";
import ReviewCard from "@/components/ReviewCard";

export default function StudySessionPage() {
  const [pack, setPackState] = useState<GeneratedStudyPack>(getPack());
  const [setup] = useState(getSetup);
  const [settings] = useState(getSettings);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const run = async () => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploads: getUploads(), setup, settings })
      });

      if (response.ok) {
        const fresh = (await response.json()) as GeneratedStudyPack;
        setPack(fresh);
        setPackState(fresh);
      }
    };

    run().catch(() => undefined);
  }, [settings, setup]);

  const modeItems = useMemo(
    () => (setup.mode === "quiz" ? pack.mcqs : setup.mode === "flashcards" ? pack.flashcards : pack.summaries),
    [pack, setup.mode]
  );

  const progressValue = modeItems.length === 0 ? 0 : Math.round((Math.min(setup.questionCount, modeItems.length) / Math.max(modeItems.length, 1)) * 100);
  const reviewItem = pack.summaries[reviewIndex];

  return (
    <main className="min-h-screen">
      <FloatingBackground intensity={settings.themeIntensity} />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <ThreeDCard>
            <ProgressBar value={progressValue} label="Session progress" />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-blue-100">Mode: {setup.mode}</p>
              <Link href="/dashboard" className="rounded-lg border border-blue-200/30 px-3 py-1 text-xs text-blue-100">
                Exit
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {pack.topics.slice(0, 6).map((topic) => (
                <span key={topic} className="app-chip rounded-full px-3 py-1 text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Tutor overview</p>
            <div className="mt-3 space-y-2">
              {pack.tutorGuide.length === 0 && <p className="text-sm text-blue-100/75">No tutor notes yet. Upload notes or paste a real study guide.</p>}
              {pack.tutorGuide.slice(0, 3).map((line) => (
                <p key={line} className="text-sm text-blue-100/85">
                  {line}
                </p>
              ))}
            </div>
            <Link href="/tutor" className="mt-4 inline-flex rounded-xl border border-blue-200/30 px-4 py-3 text-sm text-blue-100">
              Open Tutor Mode
            </Link>
          </ThreeDCard>
        </div>

        <ThreeDCard className="mt-3">
          {setup.mode === "quiz" && <QuestionEngine items={pack.mcqs.slice(0, setup.questionCount)} tutorGuide={pack.tutorGuide} />}

          {setup.mode === "flashcards" && (
            <AIResponseBox
              title="Flashcard Flow"
              body={pack.flashcards[0]?.confidenceHint || "Use the dedicated flashcard route for confidence-based review."}
              tone="neutral"
            />
          )}

          {setup.mode === "review" &&
            (reviewItem ? (
              <ReviewCard item={reviewItem} onNext={() => setReviewIndex((prev) => (prev + 1) % pack.summaries.length)} />
            ) : (
              <AIResponseBox title="Rapid Review" body="Upload content to begin." tone="success" />
            ))}

          <div className="mt-4 flex gap-2">
            <Link href="/quiz-mode" className="rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
              Quiz Route
            </Link>
            <Link href="/flashcards" className="rounded-xl border border-blue-200/30 px-3 py-2 text-xs text-blue-100">
              Flashcards Route
            </Link>
            <Link href="/tutor" className="rounded-xl border border-blue-200/30 px-3 py-2 text-xs text-blue-100">
              Tutor Route
            </Link>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
