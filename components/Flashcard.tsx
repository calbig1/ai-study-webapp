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
    <section className="space-y-4 rounded-2xl border border-blue-200 bg-white p-4" ref={ref}>
      <p className="text-xs uppercase tracking-wide text-blue-600">Flashcards</p>

      <button type="button" onClick={onFlip} className="w-full rounded-2xl bg-slate-50 p-5 text-left">
        <p className="text-xs uppercase text-slate-500">{flipped ? "Back" : "Front"}</p>
        <p className="mt-3 text-lg font-bold text-slate-900">{flipped ? item.back : item.front}</p>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onRate("easy")} className="rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
          Easy
        </button>
        <button type="button" onClick={() => onRate("hard")} className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-700">
          Hard
        </button>
      </div>
    </section>
  );
}
