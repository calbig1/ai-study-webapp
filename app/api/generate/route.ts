import { NextRequest, NextResponse } from "next/server";
import { generateStudyPack } from "@/lib/ai-engine";
import { removeVisualNoise } from "@/lib/image-parser";
import type { UploadItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      uploads?: UploadItem[];
      setup?: { focusArea?: string };
    };

    const uploads = (body.uploads || []).map((file) => ({
      ...file,
      extractedText: removeVisualNoise(file.extractedText || file.name)
    }));

    const pack = await generateStudyPack({
      uploads,
      focusArea: body.setup?.focusArea
    });

    return NextResponse.json(pack);
  } catch {
    return NextResponse.json({ flashcards: [], mcqs: [], summaries: [] }, { status: 200 });
  }
}
