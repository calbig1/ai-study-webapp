"use client";

import { MCQ } from "@/lib/types";

type Props = {
  item: MCQ;
  onAnswer: (isCorrect: boolean) => void;
};

export default function QuizCard({ item, onAnswer }: Props) {
  return (
    <section className="glass-panel rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-blue-200">Quiz Mode</p>
      <h2 className="mt-2 text-xl font-bold text-white">{item.question}</h2>
      <div className="mt-4 space-y-2">
        {item.choices.map((choice, i) => (
          <button
            key={choice}
            type="button"
            onClick={() => onAnswer(i === item.answerIndex)}
            className="w-full rounded-xl border border-blue-200/25 bg-slate-950/40 px-3 py-3 text-left text-sm text-blue-50"
          >
            {choice}
          </button>
        ))}
      </div>
    </section>
  );
}
