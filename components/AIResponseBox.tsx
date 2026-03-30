"use client";

type Props = {
  title: string;
  body: string;
  tone?: "neutral" | "success" | "warning";
};

export default function AIResponseBox({ title, body, tone = "neutral" }: Props) {
  const toneClass =
    tone === "success"
      ? "border-emerald-300/50 bg-emerald-400/10"
      : tone === "warning"
        ? "border-amber-300/40 bg-amber-400/10"
        : "border-blue-300/30 bg-blue-500/10";

  return (
    <div className={`rounded-xl border p-3 text-sm ${toneClass}`}>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-blue-100/90">{body}</p>
    </div>
  );
}
