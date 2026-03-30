"use client";

import { SummaryItem } from "@/lib/types";

type ReviewCardProps = {
  item: SummaryItem;
  onNext: () => void;
};

export default function ReviewCard({ item, onNext }: ReviewCardProps) {
  return (
    <section className="animate-fade-slide space-y-4 rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rapid Review</p>
      <h2 className="text-2xl font-bold text-slate-900">{item.concept}</h2>
      <p className="text-base leading-relaxed text-slate-600">{item.text}</p>
      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
      >
        Next Concept
      </button>
    </section>
  );
}
