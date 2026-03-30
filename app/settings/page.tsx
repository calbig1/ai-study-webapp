"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getSettings, setSettings } from "@/lib/storage";
import type { UserSettings } from "@/lib/types";

const palettes: UserSettings["theme"][] = ["ocean", "sunset", "forest", "midnight"];

export default function SettingsPage() {
  const [settings, setLocal] = useState<UserSettings>({
    studySpaceName: "AetherStudy",
    theme: "ocean",
    themeIntensity: "high",
    animationLevel: "high",
    fontStyle: "clean",
    tutorTone: "coach"
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
      <FloatingBackground intensity={settings.themeIntensity} />
      <div className="mobile-shell">
        <Navbar />
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <ThreeDCard>
            <h1 className="text-2xl font-black text-white">Settings</h1>
            <p className="mt-2 text-sm text-blue-100">Theme, naming, motion, typography, and tutor behavior now apply across the app.</p>

            <div className="mt-5 space-y-5">
              <label className="block text-sm text-blue-100">
                Study space name
                <input
                  type="text"
                  value={settings.studySpaceName}
                  onChange={(e) => update({ studySpaceName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-blue-200/30 bg-slate-950/40 px-3 py-2 text-white"
                />
              </label>

              <div>
                <p className="text-sm text-blue-100">Color scheme</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {palettes.map((palette) => (
                    <button
                      key={palette}
                      type="button"
                      onClick={() => update({ theme: palette })}
                      className={`rounded-xl border px-3 py-3 text-sm capitalize ${
                        settings.theme === palette ? "border-blue-200 bg-blue-500/30 text-white" : "border-blue-200/30 text-blue-100"
                      }`}
                    >
                      {palette}
                    </button>
                  ))}
                </div>
              </div>

              <Choice title="Theme intensity" value={settings.themeIntensity} options={["low", "high"]} onChange={(value) => update({ themeIntensity: value as "low" | "high" })} />
              <Choice title="Animation level" value={settings.animationLevel} options={["low", "high"]} onChange={(value) => update({ animationLevel: value as "low" | "high" })} />
              <Choice title="Font style" value={settings.fontStyle} options={["clean", "academic", "modern"]} onChange={(value) => update({ fontStyle: value as UserSettings["fontStyle"] })} />
              <Choice title="Tutor tone" value={settings.tutorTone} options={["coach", "calm", "direct"]} onChange={(value) => update({ tutorTone: value as UserSettings["tutorTone"] })} />
            </div>
          </ThreeDCard>

          <ThreeDCard>
            <p className="text-xs uppercase text-blue-200">Live preview</p>
            <h2 className="mt-2 text-xl font-bold text-white">{settings.studySpaceName}</h2>
            <p className="mt-2 text-sm text-blue-100">
              Palette: <span className="capitalize">{settings.theme}</span>
            </p>
            <p className="mt-1 text-sm text-blue-100">
              Tutor: <span className="capitalize">{settings.tutorTone}</span>
            </p>
            <div className="mt-4 rounded-2xl border border-blue-200/20 bg-slate-950/35 p-4">
              <p className="text-sm font-semibold text-white">What changes now</p>
              <ul className="mt-3 space-y-2 text-sm text-blue-100/85">
                <li>The shell colors and background intensity update immediately.</li>
                <li>The study space name appears in navigation and browser title.</li>
                <li>Tutor guidance and generation style follow your selected tone.</li>
              </ul>
            </div>
          </ThreeDCard>
        </div>
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
            className={`rounded-lg border px-3 py-2 text-xs capitalize ${
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
