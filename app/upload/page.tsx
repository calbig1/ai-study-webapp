"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UploadBox from "@/components/UploadBox";
import { setUploads } from "@/lib/storage";
import { UploadItem } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();

  const handleUploaded = (items: UploadItem[]) => {
    setUploads(items);
    router.push("/study/setup");
  };

  return (
    <main className="min-h-screen bg-bg pb-10">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <section className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900">Upload Materials</h1>
          <p className="mt-1 text-sm text-slate-600">Add notes, slides, PDFs, and images.</p>
          <div className="mt-5">
            <UploadBox onUploaded={handleUploaded} />
          </div>
        </section>
      </div>
    </main>
  );
}
