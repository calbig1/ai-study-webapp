"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import Flashcard from "@/components/Flashcard";
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
        <ThreeDCard>
          <h1 className="text-2xl font-extrabold text-slate-900">Flashcards</h1>
          <p className="mt-2 text-sm text-slate-600">Swipe-style revision with spaced repetition feedback.</p>
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
              <p className="text-sm text-slate-600">No flashcards yet. Generate them in Smart Notes.</p>
            )}
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
