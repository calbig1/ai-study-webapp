"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function AnimatedButton({ children, className = "", onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-btn perspective-card rounded-xl border border-blue-300/30 bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-3 font-semibold text-white glow-edge ${className}`}
    >
      {children}
    </button>
  );
}
