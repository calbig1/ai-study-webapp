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

  const canContinue = uploads.length > 0 && uploads.every((item) => item.progress === 100);

  const summary = useMemo(() => {
    const total = uploads.reduce((acc, item) => acc + item.size, 0);
    return `${uploads.length} file${uploads.length === 1 ? "" : "s"} • ${formatFileSize(total)}`;
  }, [uploads]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const parsed = await Promise.all(
      Array.from(fileList).map(async (file) => {
        const extractedText = file.type.startsWith("image/")
          ? await extractImageAcademicText(file.name)
          : file.name.replace(/[_\-.]/g, " ");

        return {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type || "unknown",
          progress: 0,
          extractedText
        } satisfies UploadItem;
      })
    );

    setUploads((prev) => [...prev, ...parsed]);

    parsed.forEach((item) => {
      const timer = window.setInterval(() => {
        setUploads((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, progress: estimateUploadProgress(entry.progress) } : entry))
        );
      }, 200);

      window.setTimeout(() => {
        window.clearInterval(timer);
        setUploads((current) => current.map((entry) => (entry.id === item.id ? { ...entry, progress: 100 } : entry)));
      }, 900 + Math.random() * 1100);
    });
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
          accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.txt"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-base font-semibold text-white">Drop files here or tap to upload</p>
        <p className="mt-1 text-sm text-blue-100/80">AI filtering handles docs + images</p>
      </label>

      {uploads.length > 0 && (
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
          </div>

          <button
            type="button"
            onClick={() => onUploaded(uploads)}
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
