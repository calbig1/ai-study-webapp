"use client";

import Link from "next/link";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell flex min-h-screen items-center">
        <ThreeDCard className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">AI Study App</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">Solve faster. Understand deeper. Study smarter.</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Built for students 15–23: camera solver, smart notes, adaptive practice, AI tutor chat, flashcards, and progress tracking in one clean experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard" className="touch-btn rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white">
              Open dashboard
            </Link>
            <Link href="/scan-solver" className="touch-btn rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
              Scan a problem
            </Link>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
