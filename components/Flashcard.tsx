"use client";

import { FlashcardItem } from "@/lib/types";

type FlashcardProps = {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  onRate: (difficulty: "easy" | "hard") => void;
};

export default function Flashcard({ item, flipped, onFlip, onRate }: FlashcardProps) {
  return (
    <section className="animate-fade-slide space-y-4 rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Flashcards</p>
      <button
        type="button"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:bg-slate-100"
        onClick={onFlip}
      >
        <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{flipped ? "Back" : "Front"}</p>
        <p className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{flipped ? item.back : item.front}</p>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-xl border border-correct/40 bg-correct/10 px-4 py-3 text-sm font-semibold text-correct"
          onClick={() => onRate("easy")}
        >
          Easy
        </button>
        <button
          type="button"
          className="rounded-xl border border-incorrect/40 bg-incorrect/10 px-4 py-3 text-sm font-semibold text-incorrect"
          onClick={() => onRate("hard")}
        >
          Hard
        </button>
      </div>
    </section>
  );
}
