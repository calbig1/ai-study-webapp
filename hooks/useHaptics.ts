"use client";

export function useHaptics() {
  const tap = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(12);
    }
  };

  const success = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([12, 10, 20]);
    }
  };

  return { tap, success };
}
