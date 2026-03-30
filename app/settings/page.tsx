"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getSettings, setSettings } from "@/lib/storage";
import type { UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setLocal] = useState<UserSettings>({
    themeIntensity: "high",
    animationLevel: "high",
    fontStyle: "clean"
  });

  useEffect(() => {
    setLocal(getSettings());
  }, []);

  const update = (patch: Partial<UserSettings>) => {
    const next = { ...settings, ...patch };
    setLocal(next);
    setSettings(next);
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="mt-2 text-sm text-blue-100">Theme, animation, and typography customization.</p>

          <div className="mt-4 space-y-4">
            <Choice title="Theme intensity" value={settings.themeIntensity} options={["low", "high"]} onChange={(value) => update({ themeIntensity: value as "low" | "high" })} />
            <Choice title="Animation level" value={settings.animationLevel} options={["low", "high"]} onChange={(value) => update({ animationLevel: value as "low" | "high" })} />
            <Choice title="Font style" value={settings.fontStyle} options={["clean", "academic", "modern"]} onChange={(value) => update({ fontStyle: value as UserSettings["fontStyle"] })} />
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}

function Choice({
  title,
  value,
  options,
  onChange
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-blue-100">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-lg border px-3 py-2 text-xs ${
              value === option ? "border-blue-200 bg-blue-500/30 text-white" : "border-blue-200/30 text-blue-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
