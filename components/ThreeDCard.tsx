"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ThreeDCard({ children, className = "" }: Props) {
  return <section className={`glass-panel perspective-card rounded-2xl p-4 sm:p-5 ${className}`}>{children}</section>;
}
