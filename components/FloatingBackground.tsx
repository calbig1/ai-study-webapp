"use client";

import { useEffect, useState } from "react";

type Props = {
  intensity?: "low" | "high";
};

export default function FloatingBackground({ intensity = "high" }: Props) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY * (intensity === "high" ? 0.12 : 0.06));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [intensity]);

  return (
    <div className="float-layer" aria-hidden>
      <div className="float-blob a" style={{ transform: `translateY(${y * 0.5}px)` }} />
      <div className="float-blob b" style={{ transform: `translateY(${y * 0.7}px)` }} />
      <div className="float-blob c" style={{ transform: `translateY(${y}px)` }} />
    </div>
  );
}
