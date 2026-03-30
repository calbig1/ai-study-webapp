import { GeneratedStudyPack, UploadItem } from "@/lib/types";
import { buildPackFromConcepts, filterAcademicContent, rankConcepts } from "@/lib/content-processor";

const tutorPrompt = `You are an elite academic tutor.

Your task is NOT to summarize everything.

Instead, follow this process:

1. Analyze the content and extract ONLY meaningful academic concepts.
   - Ignore filler words, repeated phrases, and non-essential details.
   - Focus on what a teacher would test.

2. Identify the most important ideas and rank them.

3. Convert those ideas into clear internal understanding.

4. Generate high-quality study questions:
   - Multiple choice (4 strong, realistic options)
   - Short answer
   - Conceptual reasoning
   - Application-based questions

5. Avoid:
   - Obvious or trivial questions
   - Rewriting sentences into questions
   - Low-value details

6. Make questions feel like real exam questions.`;

export async function generateStudyPack(input: {
  uploads: UploadItem[];
  focusArea?: string;
}): Promise<GeneratedStudyPack> {
  const raw = `${input.focusArea || ""}\n${input.uploads.map((u) => `${u.name} ${u.extractedText || ""}`).join("\n")}`;
  const filtered = filterAcademicContent(raw);
  const ranked = rankConcepts(filtered);

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          input: `${tutorPrompt}\n\nContent:\n${filtered.join("\n")}`
        })
      });

      if (response.ok) {
        const payload = await response.json();
        if (payload?.output_text) {
          const lines = filterAcademicContent(payload.output_text);
          return buildPackFromConcepts(rankConcepts(lines));
        }
      }
    } catch {
      // fallback below
    }
  }

  return buildPackFromConcepts(ranked);
}
