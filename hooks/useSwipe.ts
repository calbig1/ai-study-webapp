"use client";

import { useEffect } from "react";

type SwipeHandlers = {
  onLeft?: () => void;
  onRight?: () => void;
};

export function useSwipe(ref: React.RefObject<HTMLElement>, handlers: SwipeHandlers) {
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let startX = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX ?? 0;
    };

    const onEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const delta = endX - startX;
      if (delta < -40) {
        handlers.onLeft?.();
      }
      if (delta > 40) {
        handlers.onRight?.();
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [ref, handlers]);
}
