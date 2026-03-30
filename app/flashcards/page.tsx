"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import Flashcard from "@/components/Flashcard";
import AIResponseBox from "@/components/AIResponseBox";
import { getPack, updateStatsForAnswer } from "@/lib/storage";

export default function FlashcardsPage() {
  const pack = getPack();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = pack.flashcards[index];

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <ThreeDCard>
            <h1 className="text-2xl font-black text-white">Flashcards</h1>
            <p className="mt-2 text-sm text-blue-100">Tap to flip, swipe to move, and use the hint to make sure you actually understand the topic.</p>
            <div className="mt-4">
              {current ? (
                <Flashcard
                  item={current}
                  flipped={flipped}
                  onFlip={() => setFlipped((v) => !v)}
                  onRate={(difficulty) => {
                    updateStatsForAnswer(difficulty === "easy", current.topic);
                    setFlipped(false);
                    setIndex((i) => (i + 1) % pack.flashcards.length);
                  }}
                />
              ) : (
                <p className="text-sm text-blue-100">No flashcards yet. Upload content first.</p>
              )}
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Tutor prompt</p>
            <AIResponseBox
              title={current?.topic || "No topic loaded"}
              body={current?.confidenceHint || "Upload notes with actual study content to generate topic-specific flashcards."}
              tone="neutral"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {pack.topics.slice(0, 6).map((topic) => (
                <span key={topic} className="app-chip rounded-full px-3 py-1 text-xs">
                  {topic}
                </span>
              ))}
            </div>
          </ThreeDCard>
        </div>
      </div>
    </main>
  );
}
