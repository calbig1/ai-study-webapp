"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { summarizeNotes } from "@/lib/study-assistant";

export default function NotesPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<ReturnType<typeof summarizeNotes> | null>(null);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-extrabold text-slate-900">Smart Notes</h1>
          <p className="mt-2 text-sm text-slate-600">Upload PDF/image or paste text. AI builds summary, key points, flashcards, and quizzes.</p>
          <textarea
            rows={8}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-4 w-full rounded-2xl border border-blue-200 p-3 text-sm"
            placeholder="Paste your class notes here..."
          />
          <div className="mt-3 flex gap-2">
            <label className="rounded-xl border border-blue-300 px-4 py-2 text-sm text-slate-700">
              Upload file
              <input type="file" className="hidden" accept=".pdf,image/*,.txt" onChange={() => setNotes("Uploaded file detected. Paste extracted text for richer output.")} />
            </label>
            <button onClick={() => setResult(summarizeNotes(notes))} className="touch-btn rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white">
              Generate smart notes
            </button>
          </div>
        </ThreeDCard>

        {result && (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <ThreeDCard>
              <h2 className="text-lg font-bold text-slate-900">Summary + key points</h2>
              <p className="mt-2 text-sm text-slate-600">{result.summary}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {result.keyPoints.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </ThreeDCard>
            <ThreeDCard>
              <h2 className="text-lg font-bold text-slate-900">Flashcards + quiz</h2>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-500">Flashcards</p>
              <ul className="mt-1 space-y-2 text-sm text-slate-600">
                {result.flashcards.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Quiz</p>
              <ul className="mt-1 space-y-2 text-sm text-slate-600">
                {result.quiz.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </ThreeDCard>
          </div>
        )}
      </div>
    </main>
  );
}
