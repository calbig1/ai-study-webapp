"use client";

import { SummaryItem } from "@/lib/types";

type Props = {
  item: SummaryItem;
  onNext: () => void;
};

export default function ReviewCard({ item, onNext }: Props) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-blue-200">Rapid Review</p>
      <h2 className="mt-2 text-2xl font-extrabold text-white">{item.concept}</h2>
      <p className="mt-3 text-sm leading-6 text-blue-100">{item.text}</p>
      <button type="button" onClick={onNext} className="mt-5 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
        Continue
      </button>
    </section>
  );
}
