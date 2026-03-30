"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Flashcard from "@/components/Flashcard";
import ProgressBar from "@/components/ProgressBar";
import QuizCard from "@/components/QuizCard";
import ReviewCard from "@/components/ReviewCard";
import { getPack, getSetup, getUploads, setPack, updateStatsForAnswer } from "@/lib/storage";
import { FlashcardItem, GeneratedStudyPack, MCQ, StudySetup, SummaryItem } from "@/lib/types";

export default function StudyPage() {
  const [setup, setSetupState] = useState<StudySetup | null>(null);
  const [pack, setPackState] = useState<GeneratedStudyPack | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const currentSetup = getSetup();
      setSetupState(currentSetup);

      const uploads = getUploads();
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uploads, setup: currentSetup })
        });

        if (response.ok) {
          const data = (await response.json()) as GeneratedStudyPack;
          setPack(data);
          setPackState(data);
        } else {
          setPackState(getPack());
        }
      } catch {
        setPackState(getPack());
      }

      setLoading(false);
    };

    load();
  }, []);

  const mode = setup?.mode ?? "quiz";

  const quizItems = useMemo<MCQ[]>(() => {
    if (!pack) {
      return [];
    }
    return pack.mcqs.slice(0, setup?.questionCount ?? pack.mcqs.length);
  }, [pack, setup?.questionCount]);

  const flashcardItems = useMemo<FlashcardItem[]>(() => (pack ? pack.flashcards : []), [pack]);
  const reviewItems = useMemo<SummaryItem[]>(() => (pack ? pack.summaries : []), [pack]);

  const activeItemsCount =
    mode === "quiz" ? quizItems.length : mode === "flashcards" ? flashcardItems.length : reviewItems.length;

  const completed = index >= activeItemsCount;
  const progress = activeItemsCount === 0 ? 0 : Math.min(100, Math.round((index / activeItemsCount) * 100));

  const currentQuiz = mode === "quiz" && !completed ? quizItems[index] : null;
  const currentFlashcard = mode === "flashcards" && !completed ? flashcardItems[index] : null;
  const currentReview = mode === "review" && !completed ? reviewItems[index] : null;

  const next = () => {
    setFeedback(null);
    setFlipped(false);
    setIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-4">
        <p className="text-sm font-semibold text-slate-600">Preparing your study session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pb-8">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex-1">
            <ProgressBar value={completed ? 100 : progress} label="Session progress" />
          </div>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 sm:text-sm">
            Exit
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
        {activeItemsCount === 0 && (
          <section className="rounded-2xl bg-white p-6 text-center shadow-soft">
            <h1 className="text-xl font-bold text-slate-900">No study items yet</h1>
            <p className="mt-2 text-sm text-slate-600">Upload notes first, then generate your session.</p>
            <Link href="/upload" className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
              Go to Upload
            </Link>
          </section>
        )}

        {completed && activeItemsCount > 0 && (
          <section className="animate-fade-slide rounded-2xl bg-white p-6 text-center shadow-soft">
            <h1 className="text-2xl font-bold text-slate-900">Session complete</h1>
            <p className="mt-2 text-sm text-slate-600">Great work. Keep the streak going.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/progress" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                View Progress
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIndex(0);
                  setFeedback(null);
                  setFlipped(false);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Restart
              </button>
            </div>
          </section>
        )}

        {!completed && activeItemsCount > 0 && (
          <div key={`${mode}-${index}`}>
            {mode === "quiz" && currentQuiz && (
              <div className="space-y-4">
                <QuizCard
                  item={currentQuiz}
                  onAnswer={(correct) => {
                    if (feedback) {
                      return;
                    }
                    updateStatsForAnswer(correct, currentQuiz.topic);
                    setFeedback({ correct, explanation: currentQuiz.explanation });
                  }}
                />

                {feedback && (
                  <section
                    className={`rounded-2xl border p-4 ${
                      feedback.correct ? "border-correct/40 bg-correct/10" : "border-incorrect/40 bg-incorrect/10"
                    }`}
                  >
                    <p className={`text-sm font-bold ${feedback.correct ? "text-correct" : "text-incorrect"}`}>
                      {feedback.correct ? "Correct" : "Incorrect"}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">{feedback.explanation}</p>
                    <button
                      type="button"
                      onClick={next}
                      className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      Next Question
                    </button>
                  </section>
                )}
              </div>
            )}

            {mode === "flashcards" && currentFlashcard && (
              <Flashcard
                item={currentFlashcard}
                flipped={flipped}
                onFlip={() => setFlipped((prev) => !prev)}
                onRate={(difficulty) => {
                  updateStatsForAnswer(difficulty === "easy", currentFlashcard.topic);
                  next();
                }}
              />
            )}

            {mode === "review" && currentReview && (
              <ReviewCard
                item={currentReview}
                onNext={() => {
                  updateStatsForAnswer(true, currentReview.topic);
                  next();
                }}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
