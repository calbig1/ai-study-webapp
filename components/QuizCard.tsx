"use client";

import { MCQ } from "@/lib/types";

type QuizCardProps = {
  item: MCQ;
  onAnswer: (isCorrect: boolean) => void;
};

export default function QuizCard({ item, onAnswer }: QuizCardProps) {
  const handleAnswer = (choiceIndex: number) => {
    onAnswer(choiceIndex === item.answerIndex);
  };

  return (
    <section className="animate-fade-slide rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz Mode</p>
      <h2 className="mb-5 text-xl font-bold leading-tight text-slate-900 sm:text-2xl">{item.question}</h2>
      <div className="space-y-3">
        {item.choices.map((choice, index) => (
          <button
            key={choice}
            type="button"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-indigo-50 sm:text-base"
            onClick={() => handleAnswer(index)}
          >
            {choice}
          </button>
        ))}
      </div>
    </section>
  );
}
