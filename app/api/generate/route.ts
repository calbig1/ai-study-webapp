import { NextRequest, NextResponse } from "next/server";

type UploadInput = { name: string; type: string };
type SetupInput = { mode?: "quiz" | "flashcards" | "review"; questionCount?: number; focusArea?: string };

type GeneratedPack = {
  flashcards: { front: string; back: string; topic: string }[];
  mcqs: { question: string; choices: string[]; answerIndex: number; explanation: string; topic: string }[];
  summaries: { concept: string; text: string; topic: string }[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { uploads?: UploadInput[]; setup?: SetupInput };
    const uploads = body.uploads ?? [];
    const setup = body.setup ?? {};

    const generated = await generatePack(uploads, setup);
    return NextResponse.json(generated);
  } catch {
    return NextResponse.json({ flashcards: [], mcqs: [], summaries: [] }, { status: 200 });
  }
}

async function generatePack(uploads: UploadInput[], setup: SetupInput): Promise<GeneratedPack> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";

  if (apiKey) {
    try {
      const prompt = buildPrompt(uploads, setup);
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          input: prompt,
          text: {
            format: {
              type: "json_schema",
              name: "study_pack",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  flashcards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        front: { type: "string" },
                        back: { type: "string" },
                        topic: { type: "string" }
                      },
                      required: ["front", "back", "topic"],
                      additionalProperties: false
                    }
                  },
                  mcqs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        choices: {
                          type: "array",
                          items: { type: "string" },
                          minItems: 4,
                          maxItems: 4
                        },
                        answerIndex: { type: "number" },
                        explanation: { type: "string" },
                        topic: { type: "string" }
                      },
                      required: ["question", "choices", "answerIndex", "explanation", "topic"],
                      additionalProperties: false
                    }
                  },
                  summaries: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        concept: { type: "string" },
                        text: { type: "string" },
                        topic: { type: "string" }
                      },
                      required: ["concept", "text", "topic"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["flashcards", "mcqs", "summaries"],
                additionalProperties: false
              }
            }
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const outputText = data?.output_text;
        if (outputText) {
          return JSON.parse(outputText) as GeneratedPack;
        }
      }
    } catch {
      // Falls through to deterministic fallback.
    }
  }

  return fallbackPack(uploads, setup);
}

function buildPrompt(uploads: UploadInput[], setup: SetupInput): string {
  const names = uploads.map((u) => u.name).join(", ");
  return [
    "You generate realistic student study material.",
    "Return ONLY valid JSON.",
    "Use clear but slightly challenging test-like wording.",
    `Focus area: ${setup.focusArea || "general course coverage"}`,
    `Requested count: ${setup.questionCount || 10}`,
    `File names: ${names || "none provided"}`,
    "Required shape: { flashcards: [], mcqs: [], summaries: [] }"
  ].join("\n");
}

function fallbackPack(uploads: UploadInput[], setup: SetupInput): GeneratedPack {
  const topics = inferTopics(uploads, setup.focusArea || "");
  const count = Math.max(6, Math.min(setup.questionCount || 10, 25));

  return {
    flashcards: topics.slice(0, count).map((topic) => ({
      front: `Define ${topic}.`,
      back: `${topic} is a key concept that connects theory to likely exam applications in context-based questions.`,
      topic
    })),
    mcqs: topics.slice(0, count).map((topic) => ({
      question: `Which statement best explains ${topic}?`,
      choices: [
        `${topic} only applies in one rare case.`,
        `${topic} connects cause, evidence, and result in a testable way.`,
        `${topic} has no practical impact.`,
        `${topic} cannot be compared across examples.`
      ],
      answerIndex: 1,
      explanation: `${topic} is usually tested through cause-effect and evidence-based comparisons.`,
      topic
    })),
    summaries: topics.slice(0, count).map((topic) => ({
      concept: topic,
      text: `${topic} can be reviewed quickly by linking the definition, a concrete example, and why it matters in real exam prompts.`,
      topic
    }))
  };
}

function inferTopics(uploads: UploadInput[], focus: string): string[] {
  const pool = `${focus} ${uploads.map((f) => f.name).join(" ")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);

  const fallback = [
    "Evidence",
    "Causation",
    "Systems",
    "Interpretation",
    "Methodology",
    "Structure",
    "Outcomes",
    "Comparisons",
    "Significance",
    "Context"
  ];

  const deduped = Array.from(new Set(pool.map((w) => `${w[0].toUpperCase()}${w.slice(1)}`)));
  return (deduped.length ? deduped : fallback).slice(0, 18);
}
