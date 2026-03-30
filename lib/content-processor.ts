import { FlashcardItem, GeneratedStudyPack, MCQ, ProcessedConcept, SummaryItem } from "@/lib/types";

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
  "class",
  "teacher",
  "student",
  "worksheet",
  "answer",
  "question",
  "objective",
  "directions",
  "instruction"
]);

const stopwords = new Set([
  "about",
  "after",
  "again",
  "because",
  "between",
  "could",
  "every",
  "first",
  "from",
  "have",
  "into",
  "more",
  "most",
  "other",
  "over",
  "some",
  "than",
  "that",
  "their",
  "there",
  "these",
  "they",
  "this",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would"
]);

export function filterAcademicContent(input: string): string[] {
  return input
    .split(/\n+/)
    .flatMap((chunk) => chunk.split(/(?<=[.!?;:])\s+/))
    .map((line) => normalizeLine(line))
    .filter((line) => line.length > 22)
    .filter((line) => hasMeaningfulDensity(line));
}

export function rankConcepts(lines: string[], focusArea = ""): ProcessedConcept[] {
  const topicHints = collectTopicHints(lines, focusArea);
  const concepts = new Map<string, ProcessedConcept>();

  for (const line of lines) {
    const topic = pickTopic(line, topicHints, focusArea);
    const score = scoreLine(line, topic, focusArea);
    const existing = concepts.get(topic);

    if (existing) {
      existing.importance = Math.min(100, existing.importance + score);
      if (!existing.statements.includes(line)) {
        existing.statements.push(line);
      }
    } else {
      concepts.set(topic, {
        topic,
        importance: Math.min(100, score),
        statements: [line]
      });
    }
  }

  return [...concepts.values()]
    .filter((concept) => concept.statements.length > 0)
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 12);
}

export function buildPackFromConcepts(concepts: ProcessedConcept[], focusArea = "", tutorTone = "coach"): GeneratedStudyPack {
  const topics = concepts.map((concept) => concept.topic);
  const flashcards = concepts.map((concept) => buildFlashcard(concept));
  const summaries = concepts.map((concept) => buildSummary(concept));
  const mcqs = concepts.map((concept, index) => buildMcq(concept, concepts, index));
  const tutorGuide = buildTutorGuide(concepts, focusArea, tutorTone);

  return { flashcards, mcqs, summaries, tutorGuide, topics };
}

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").replace(/[^\S\r\n]+/g, " ").trim();
}

function hasMeaningfulDensity(line: string): boolean {
  const words = tokenize(line);
  const meaningful = words.filter((word) => word.length > 3 && !filler.has(word) && !stopwords.has(word));
  return meaningful.length >= 3;
}

function tokenize(line: string): string[] {
  return line.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(Boolean);
}

function collectTopicHints(lines: string[], focusArea: string): string[] {
  const counts = new Map<string, number>();

  for (const line of lines) {
    for (const entity of extractEntities(line)) {
      counts.set(entity, (counts.get(entity) ?? 0) + 3);
    }

    for (const word of tokenize(line)) {
      if (word.length < 5 || filler.has(word) || stopwords.has(word)) {
        continue;
      }
      counts.set(toTitle(word), (counts.get(toTitle(word)) ?? 0) + 1);
    }
  }

  if (focusArea.trim()) {
    counts.set(toTitle(focusArea.trim()), (counts.get(toTitle(focusArea.trim())) ?? 0) + 10);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic)
    .filter((topic) => topic.length > 2)
    .slice(0, 16);
}

function extractEntities(line: string): string[] {
  const matches = line.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g) ?? [];
  return matches.filter((match) => !filler.has(match.toLowerCase()) && match.toLowerCase() !== "unit");
}

function pickTopic(line: string, topicHints: string[], focusArea: string): string {
  const lowered = line.toLowerCase();
  const focus = focusArea.trim();

  if (focus && lowered.includes(focus.toLowerCase())) {
    return toTitle(focus);
  }

  const matchingHint = topicHints.find((hint) => lowered.includes(hint.toLowerCase()));
  if (matchingHint) {
    return matchingHint;
  }

  const entity = extractEntities(line)[0];
  if (entity) {
    return entity;
  }

  const words = tokenize(line).filter((word) => word.length > 4 && !stopwords.has(word) && !filler.has(word));
  return toTitle(words.slice(0, 2).join(" ") || "Key Topic");
}

function scoreLine(line: string, topic: string, focusArea: string): number {
  let score = 18;
  const lowered = line.toLowerCase();

  if (lowered.includes(topic.toLowerCase())) {
    score += 20;
  }
  if (focusArea && lowered.includes(focusArea.toLowerCase())) {
    score += 24;
  }
  if (/\b\d{3,4}\b/.test(line) || /\bcentury\b/i.test(line)) {
    score += 10;
  }
  if (/\bcaused\b|\bled to\b|\bresulted in\b|\bsignificant\b|\bimportant\b|\bbecause\b/i.test(line)) {
    score += 18;
  }
  if (line.includes(":")) {
    score += 8;
  }
  return Math.min(40, score);
}

function buildFlashcard(concept: ProcessedConcept): FlashcardItem {
  const [primary, secondary] = concept.statements;
  return {
    front: `What should you remember about ${concept.topic}?`,
    back: secondary ? `${primary} ${secondary}` : primary,
    topic: concept.topic,
    confidenceHint: "Say it in your own words, then connect it to why it matters."
  };
}

function buildSummary(concept: ProcessedConcept): SummaryItem {
  const core = concept.statements[0];
  const support = concept.statements[1];
  return {
    concept: concept.topic,
    text: support ? `${core} ${support}` : core,
    topic: concept.topic
  };
}

function buildMcq(concept: ProcessedConcept, concepts: ProcessedConcept[], index: number): MCQ {
  const distractors = concepts
    .filter((candidate) => candidate.topic !== concept.topic)
    .slice(index, index + 3)
    .map((candidate) => candidate.topic);

  while (distractors.length < 3) {
    distractors.push(`A minor detail about ${concept.topic.toLowerCase()}`);
  }

  const correct = summarizeStatement(concept.statements[0]);
  const choices = shuffle([
    correct,
    `It mainly refers to ${distractors[0].toLowerCase()}.`,
    `It is mostly a vocabulary label with no historical significance.`,
    `It only matters as a decorative example rather than a tested idea.`
  ]);

  return {
    question: `Which answer best explains the significance of ${concept.topic}?`,
    choices,
    answerIndex: choices.indexOf(correct),
    explanation: concept.statements.slice(0, 2).join(" "),
    topic: concept.topic,
    difficulty: concept.importance > 65 ? "hard" : concept.importance > 45 ? "medium" : "easy"
  };
}

function buildTutorGuide(concepts: ProcessedConcept[], focusArea: string, tutorTone: string): string[] {
  const intro =
    tutorTone === "direct"
      ? "Focus on the names, causes, consequences, and why each topic mattered."
      : tutorTone === "calm"
        ? "Start with the big idea, then attach one or two memorable specifics to it."
        : "Learn the headline first, then the evidence that makes it test-worthy.";

  const focusLine = focusArea.trim()
    ? `Your session is centered on ${focusArea.trim()}, so prioritize details that directly support that unit.`
    : "Your session is built around the most repeated and most testable ideas from the upload.";

  const conceptLines = concepts.slice(0, 3).map((concept) => {
    const anchor = concept.statements[0] ?? "";
    return `${concept.topic}: ${anchor}`;
  });

  return [intro, focusLine, ...conceptLines];
}

function summarizeStatement(statement: string): string {
  const trimmed = statement.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 120) {
    return trimmed;
  }
  return `${trimmed.slice(0, 117).trim()}...`;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort((a, b) => `${a}`.localeCompare(`${b}`));
}

function toTitle(input: string): string {
  return input
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
