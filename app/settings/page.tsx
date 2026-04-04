"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getSettings, setSettings } from "@/lib/storage";
import type { UserSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setLocal] = useState<UserSettings>({
    studySpaceName: "AetherStudy",
    theme: "ocean",
    themeIntensity: "high",
    animationLevel: "high",
    fontStyle: "clean",
    tutorTone: "coach"
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => setLocal(getSettings()), []);

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
          <h1 className="text-2xl font-extrabold text-slate-900">Settings / Profile</h1>
          <div className="mt-4 space-y-4">
            <label className="block text-sm text-slate-600">
              Study space name
              <input
                value={settings.studySpaceName}
                onChange={(e) => update({ studySpaceName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-blue-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Grade level
              <input className="mt-1 w-full rounded-xl border border-blue-200 px-3 py-2" placeholder="e.g. Grade 11 / College freshman" />
            </label>
            <label className="block text-sm text-slate-600">
              Subjects
              <input className="mt-1 w-full rounded-xl border border-blue-200 px-3 py-2" placeholder="Math, Physics, Chemistry" />
            </label>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm text-slate-700">Dark mode</span>
              <button onClick={() => setDarkMode((v) => !v)} className="rounded-full bg-white px-3 py-1 text-xs">{darkMode ? "On" : "Off"}</button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm text-slate-700">Notifications</span>
              <button onClick={() => setNotifications((v) => !v)} className="rounded-full bg-white px-3 py-1 text-xs">{notifications ? "On" : "Off"}</button>
            </div>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
