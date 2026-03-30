"use client";

import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { getUploads } from "@/lib/storage";

export default function LibraryPage() {
  const uploads = getUploads();

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-black text-white">Library</h1>
          <p className="mt-2 text-sm text-blue-100">Saved materials and parsed study content.</p>
          <div className="mt-4 space-y-2">
            {uploads.length === 0 && <p className="text-sm text-blue-100/75">No saved items yet.</p>}
            {uploads.map((u) => (
              <div key={u.id} className="rounded-xl border border-blue-200/25 bg-slate-950/35 p-3 text-sm text-blue-50">
                {u.name}
              </div>
            ))}
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
