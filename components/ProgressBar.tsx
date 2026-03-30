"use client";

type Props = {
  value: number;
  label?: string;
};

export default function ProgressBar({ value, label = "Progress" }: Props) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-blue-100">
        <span>{label}</span>
        <span>{bounded}%</span>
      </div>
      <div className="progress-tube">
        <div className="progress-fill" style={{ width: `${bounded}%` }} />
      </div>
    </div>
  );
}
