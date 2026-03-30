import { GeneratedStudyPack, ProcessedConcept } from "@/lib/types";

const filler = new Set([
  "note",
  "notes",
  "page",
  "chapter",
  "example",
  "turn",
  "figure",
  "table",
  "homework",
  "class"
]);

export function filterAcademicContent(input: string): string[] {
  return input
    .split(/\n|\.|\!/)
    .map((line) => line.trim())
    .filter((line) => line.length > 18)
    .filter((line) => {
      const tokens = line.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
      const meaningful = tokens.filter((t) => t.length > 3 && !filler.has(t));
      return meaningful.length >= 3;
    });
}

export function rankConcepts(lines: string[]): ProcessedConcept[] {
  const map = new Map<string, ProcessedConcept>();

  for (const line of lines) {
    const words = line.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 4);
    const key = words.slice(0, 2).join(" ") || "core concept";
    const score = Math.min(100, 30 + words.length * 3);

    const existing = map.get(key);
    if (existing) {
      existing.importance = Math.min(100, existing.importance + 6);
      existing.statements.push(line);
    } else {
      map.set(key, {
        topic: toTitle(key),
        importance: score,
        statements: [line]
      });
    }
  }

  return [...map.values()].sort((a, b) => b.importance - a.importance).slice(0, 12);
}

export function buildPackFromConcepts(concepts: ProcessedConcept[]): GeneratedStudyPack {
  const flashcards = concepts.map((c) => ({
    front: `Explain ${c.topic}.`,
    back: c.statements[0],
    topic: c.topic
  }));

  const mcqs = concepts.map((c, index) => ({
    question: `Which choice best captures the key idea of ${c.topic}?`,
    choices: [
      "A detail that does not impact outcomes",
      "A core concept that links mechanism, evidence, and likely exam applications",
      "A random example with no conceptual weight",
      "An optional fact rarely tested"
    ],
    answerIndex: 1,
    explanation: c.statements[0],
    topic: c.topic,
    difficulty: index % 3 === 0 ? "hard" as const : "medium" as const
  }));

  const summaries = concepts.map((c) => ({
    concept: c.topic,
    text: c.statements.slice(0, 2).join(" "),
    topic: c.topic
  }));

  return { flashcards, mcqs, summaries };
}

function toTitle(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
