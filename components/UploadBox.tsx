"use client";

import { useMemo, useState } from "react";
import { UploadItem } from "@/lib/types";
import { estimateUploadProgress, formatFileSize } from "@/lib/storage";
import { extractImageAcademicText } from "@/lib/image-parser";

type UploadBoxProps = {
  onUploaded: (items: UploadItem[]) => void;
};

export default function UploadBox({ onUploaded }: UploadBoxProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pastedNotes, setPastedNotes] = useState("");

  const canContinue =
    (uploads.length > 0 || pastedNotes.trim().length > 40) &&
    uploads.every((item) => item.progress === 100);

  const summary = useMemo(() => {
    const total = uploads.reduce((acc, item) => acc + item.size, 0);
    const sourceCount = uploads.length + (pastedNotes.trim() ? 1 : 0);
    return `${sourceCount} source${sourceCount === 1 ? "" : "s"} • ${formatFileSize(total)}`;
  }, [pastedNotes, uploads]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const parsed = await Promise.all(
      Array.from(fileList).map(async (file) => {
        const extractedText = await extractFileText(file);

        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type || "unknown",
          progress: 0,
          extractedText,
          sourceType: "file"
        } satisfies UploadItem;
      })
    );

    setUploads((prev) => [...prev, ...parsed]);

    parsed.forEach((item) => {
      const timer = window.setInterval(() => {
        setUploads((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, progress: estimateUploadProgress(entry.progress) } : entry))
        );
      }, 180);

      window.setTimeout(() => {
        window.clearInterval(timer);
        setUploads((current) => current.map((entry) => (entry.id === item.id ? { ...entry, progress: 100 } : entry)));
      }, 850 + Math.random() * 950);
    });
  };

  const finalizeUploads = () => {
    const noteItem =
      pastedNotes.trim().length > 0
        ? [
            {
              id: crypto.randomUUID(),
              name: "Pasted class notes",
              size: pastedNotes.length,
              type: "text/plain",
              progress: 100,
              extractedText: pastedNotes.trim(),
              sourceType: "pasted" as const
            }
          ]
        : [];

    onUploaded([...uploads, ...noteItem]);
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging ? "border-blue-300 bg-blue-700/20" : "border-blue-200/30 bg-blue-950/30"
        }`}
      >
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.txt,.md,.rtf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-base font-semibold text-white">Drop files here or tap to upload</p>
        <p className="mt-1 text-sm text-blue-100/80">Text files are read directly. For tougher docs, paste the most important notes below.</p>
      </label>

      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Paste notes or a study guide excerpt</p>
            <p className="mt-1 text-xs text-blue-100/80">This gives the tutor real content to study instead of just file names.</p>
          </div>
          <span className="app-chip rounded-full px-3 py-1 text-xs">{pastedNotes.length} chars</span>
        </div>
        <textarea
          value={pastedNotes}
          onChange={(e) => setPastedNotes(e.target.value)}
          rows={7}
          placeholder="Paste the Unit 7 notes, Aztec/Inca comparisons, key terms, teacher review sheet, or anything you actually need to study."
          className="mt-3 w-full rounded-2xl border border-blue-200/25 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100/45"
        />
      </div>

      {(uploads.length > 0 || pastedNotes.trim()) && (
        <div className="glass-panel rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-100">{summary}</p>
          <div className="mt-3 space-y-3">
            {uploads.map((item) => (
              <div key={item.id} className="rounded-xl border border-blue-200/20 bg-slate-950/35 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-blue-50">{item.name}</p>
                  <span className="text-xs text-blue-100">{item.progress}%</span>
                </div>
                <div className="progress-tube">
                  <div className="progress-fill" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}

            {pastedNotes.trim() && (
              <div className="rounded-xl border border-blue-200/20 bg-slate-950/35 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-blue-50">Pasted class notes</p>
                  <span className="text-xs text-blue-100">Ready</span>
                </div>
                <p className="text-xs text-blue-100/70">{pastedNotes.trim().slice(0, 180)}...</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={finalizeUploads}
            disabled={!canContinue}
            className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Continue to Setup
          </button>
        </div>
      )}
    </div>
  );
}

async function extractFileText(file: File): Promise<string> {
  if (file.type.startsWith("image/")) {
    return extractImageAcademicText(file.name);
  }

  if (file.type.startsWith("text/") || /\.(txt|md|csv|rtf)$/i.test(file.name)) {
    const raw = await file.text();
    return raw.slice(0, 12000);
  }

  return file.name.replace(/[_\-.]/g, " ");
}
