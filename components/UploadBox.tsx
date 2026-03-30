"use client";

import { useMemo, useState } from "react";
import { UploadItem } from "@/lib/types";
import { estimateUploadProgress, formatFileSize } from "@/lib/storage";

type UploadBoxProps = {
  onUploaded: (items: UploadItem[]) => void;
};

const accepted = ".png,.jpg,.jpeg,.webp,.pdf,.docx";

export default function UploadBox({ onUploaded }: UploadBoxProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);

  const canContinue = uploads.length > 0 && uploads.every((item) => item.progress === 100);

  const summary = useMemo(() => {
    const total = uploads.reduce((acc, item) => acc + item.size, 0);
    return `${uploads.length} file${uploads.length === 1 ? "" : "s"} • ${formatFileSize(total)}`;
  }, [uploads]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const next = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type || "unknown",
      progress: 0
    }));

    setUploads((prev) => [...prev, ...next]);

    next.forEach((item) => {
      const timer = window.setInterval(() => {
        setUploads((current) =>
          current.map((entry) => {
            if (entry.id !== item.id) {
              return entry;
            }
            return { ...entry, progress: estimateUploadProgress(entry.progress) };
          })
        );
      }, 220);

      window.setTimeout(() => {
        window.clearInterval(timer);
        setUploads((current) =>
          current.map((entry) => (entry.id === item.id ? { ...entry, progress: 100 } : entry))
        );
      }, 1100 + Math.random() * 900);
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
        className={`block cursor-pointer rounded-2xl border-2 border-dashed bg-white p-8 text-center transition ${
          dragging ? "border-primary bg-indigo-50" : "border-slate-300"
        }`}
      >
        <input
          type="file"
          accept={accepted}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-base font-semibold text-slate-800">Drop files here or tap to upload</p>
        <p className="mt-1 text-sm text-slate-500">Images, PDFs, DOCX</p>
      </label>

      {uploads.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">{summary}</p>
          {uploads.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-100 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                <span className="text-xs font-semibold text-slate-500">{item.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-primary transition-all duration-200" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUploaded(uploads)}
            disabled={!canContinue}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue to Study Setup
          </button>
        </div>
      )}
    </div>
  );
}
