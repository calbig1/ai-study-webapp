"use client";

import { useEffect } from "react";
import { getSettings } from "@/lib/storage";

export default function ThemeController() {
  useEffect(() => {
    const apply = () => {
      const settings = getSettings();
      const root = document.documentElement;

      root.dataset.theme = settings.theme;
      root.dataset.font = settings.fontStyle;
      root.dataset.motion = settings.animationLevel;
      root.dataset.intensity = settings.themeIntensity;
      document.title = settings.studySpaceName || "AetherStudy";
    };

    apply();
    window.addEventListener("storage", apply);
    window.addEventListener("aether:settings-changed", apply);

    return () => {
      window.removeEventListener("storage", apply);
      window.removeEventListener("aether:settings-changed", apply);
    };
  }, []);

  return null;
}
