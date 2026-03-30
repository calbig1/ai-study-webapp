"use client";

import Link from "next/link";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import AnimatedButton from "@/components/AnimatedButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell flex min-h-screen items-center">
        <ThreeDCard className="w-full">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Premium Study Platform</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
            Upload notes. Study smarter. Ace your test.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-blue-100/85 sm:text-base">
            AetherStudy filters raw material, prioritizes what matters, and delivers one focused question at a time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/onboarding">
              <AnimatedButton>Get Started</AnimatedButton>
            </Link>
            <Link href="/upload" className="rounded-xl border border-blue-200/30 px-4 py-3 text-sm font-semibold text-blue-100">
              Upload Material
            </Link>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
