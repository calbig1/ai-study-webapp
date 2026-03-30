"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import UploadBox from "@/components/UploadBox";
import { setUploads } from "@/lib/storage";
import { UploadItem } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();

  const onDone = (items: UploadItem[]) => {
    setUploads(items);
    router.push("/study/setup");
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-black text-white">Upload Materials</h1>
          <p className="mt-2 text-sm text-blue-100">Images, PDFs, DOCX, and notes. AI will filter and prioritize test-worthy concepts.</p>
          <div className="mt-4">
            <UploadBox onUploaded={onDone} />
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
