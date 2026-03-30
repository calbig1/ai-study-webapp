"use client";

type ProgressBarProps = {
  value: number;
  label?: string;
};

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600 sm:text-sm">
        <span>{label ?? "Progress"}</span>
        <span>{bounded}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${bounded}%` }}
          aria-label="Study progress"
        />
      </div>
    </div>
  );
}
