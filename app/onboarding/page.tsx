"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import AnimatedButton from "@/components/AnimatedButton";

const subjects = ["Biology", "History", "Economics", "Math", "Literature", "Chemistry"];

export default function OnboardingPage() {
  const router = useRouter();
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (name: string) => {
    setPicked((prev) => (prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]));
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <ThreeDCard>
          <h1 className="text-3xl font-black text-white">Personalize your tutor</h1>
          <p className="mt-2 text-sm text-blue-100">Choose your subjects so AI prioritizes relevant exam concepts.</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  picked.includes(s) ? "border-blue-200 bg-blue-500/30 text-white" : "border-blue-200/25 text-blue-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <AnimatedButton className="mt-6 w-full" onClick={() => router.push("/dashboard")}>
            Continue to Dashboard
          </AnimatedButton>
        </ThreeDCard>
      </div>
    </main>
  );
}
