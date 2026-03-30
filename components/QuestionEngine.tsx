"use client";

import { useMemo, useState } from "react";
import type { MCQ } from "@/lib/types";
import AIResponseBox from "@/components/AIResponseBox";
import AnimatedButton from "@/components/AnimatedButton";

type Props = {
  items: MCQ[];
};

export default function QuestionEngine({ items }: Props) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<null | { ok: boolean; msg: string }>(null);

  const current = useMemo(() => items[idx], [idx, items]);

  if (!current) {
    return <AIResponseBox title="No questions" body="Upload more material to generate a fresh session." tone="warning" />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-blue-300/20 bg-blue-900/25 p-4">
        <p className="text-xs uppercase tracking-wide text-blue-200">Question {idx + 1}</p>
        <h3 className="mt-2 text-xl font-bold text-white">{current.question}</h3>
        <div className="mt-4 space-y-2">
          {current.choices.map((choice, i) => (
            <button
              key={choice}
              type="button"
              onClick={() =>
                setFeedback({
                  ok: i === current.answerIndex,
                  msg: i === current.answerIndex ? current.explanation : `Not quite. ${current.explanation}`
                })
              }
              className="w-full rounded-xl border border-blue-200/20 bg-slate-950/30 px-3 py-2 text-left text-sm text-blue-50 transition hover:border-blue-300/45"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <AIResponseBox title={feedback.ok ? "Nice work" : "Tutor feedback"} body={feedback.msg} tone={feedback.ok ? "success" : "neutral"} />
      )}

      <div className="flex justify-end">
        <AnimatedButton
          onClick={() => {
            setFeedback(null);
            setIdx((prev) => (prev + 1) % items.length);
          }}
        >
          Next Question
        </AnimatedButton>
      </div>
    </div>
  );
}
