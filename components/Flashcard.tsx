"use client";

import { useRef } from "react";
import { FlashcardItem } from "@/lib/types";
import { useSwipe } from "@/hooks/useSwipe";

type FlashcardProps = {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  onRate: (difficulty: "easy" | "hard") => void;
};

export default function Flashcard({ item, flipped, onFlip, onRate }: FlashcardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSwipe(ref, { onLeft: () => onRate("hard"), onRight: () => onRate("easy") });

  return (
    <section className="space-y-4 rounded-2xl glass-panel p-4" ref={ref}>
      <p className="text-xs uppercase tracking-wide text-blue-200">Flashcards</p>

      <button type="button" onClick={onFlip} className="w-full [perspective:1000px]">
        <div className={`flip-3d relative h-56 w-full ${flipped ? "flipped" : ""}`}>
          <div className="flip-face absolute inset-0 rounded-2xl border border-blue-200/30 bg-slate-950/40 p-5 text-left">
            <p className="text-xs uppercase text-blue-200">Front</p>
            <p className="mt-3 text-xl font-bold text-white">{item.front}</p>
          </div>
          <div className="flip-face flip-back absolute inset-0 rounded-2xl border border-blue-200/30 bg-blue-900/35 p-5 text-left">
            <p className="text-xs uppercase text-blue-200">Back</p>
            <p className="mt-3 text-lg text-blue-50">{item.back}</p>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onRate("easy")} className="rounded-xl bg-emerald-500/25 px-4 py-3 text-sm font-semibold text-emerald-200">
          Easy
        </button>
        <button type="button" onClick={() => onRate("hard")} className="rounded-xl bg-rose-500/25 px-4 py-3 text-sm font-semibold text-rose-200">
          Hard
        </button>
      </div>
    </section>
  );
}
