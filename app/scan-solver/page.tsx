"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { solveProblem } from "@/lib/study-assistant";

export default function ScanSolverPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof solveProblem> | null>(null);

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-extrabold text-slate-900">Scan Solver</h1>
          <p className="mt-2 text-sm text-slate-600">Upload a photo or paste your question. AI detects subject and solves it step-by-step.</p>
          <textarea
            className="mt-4 w-full rounded-2xl border border-blue-200 bg-white p-3 text-sm text-slate-700 outline-none"
            rows={5}
            placeholder="Paste OCR text or type your problem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-3 flex gap-2">
            <button className="touch-btn rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white" onClick={() => setResult(solveProblem(input))}>
              Analyze & Solve
            </button>
            <label className="touch-btn rounded-xl border border-blue-300 px-4 py-2 text-sm text-slate-700">
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={() => setInput("Image uploaded. OCR simulation ready.")} />
            </label>
          </div>
        </ThreeDCard>

        {result && (
          <ThreeDCard className="mt-3">
            <p className="text-sm font-semibold text-blue-600">Subject: {result.subject}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Final answer</h2>
            <p className="mt-1 text-slate-700">{result.finalAnswer}</p>
            <h3 className="mt-4 text-sm font-semibold uppercase text-slate-500">Step-by-step</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {result.steps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-700">Explain like I&apos;m 10: {result.simpleExplain}</button>
              <button className="rounded-xl bg-slate-100 px-3 py-3 text-sm text-slate-700">Show harder version: {result.harderVersion}</button>
            </div>
          </ThreeDCard>
        )}
      </div>
    </main>
  );
}
