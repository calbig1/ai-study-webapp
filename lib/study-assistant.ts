export type SolverResult = {
  subject: string;
  finalAnswer: string;
  steps: string[];
  simpleExplain: string;
  harderVersion: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export function solveProblem(input: string): SolverResult {
  const text = input.trim();
  const lowered = text.toLowerCase();

  if (/\d/.test(text) && (/[x+\-*/=]/.test(text) || lowered.includes("solve"))) {
    return {
      subject: "Mathematics",
      finalAnswer: "x = 6",
      steps: [
        "Identify the equation and isolate the variable term.",
        "Move constants to the other side by inverse operations.",
        "Divide by the coefficient of x.",
        "Check by substituting x back into the original expression."
      ],
      simpleExplain: "Think of x like a mystery box. Undo operations one by one until the box is alone.",
      harderVersion: "Solve 3(2x − 5) + 7 = 4x + 19 and explain each transformation."
    };
  }

  if (lowered.includes("force") || lowered.includes("acceleration") || lowered.includes("newton")) {
    return {
      subject: "Physics",
      finalAnswer: "Use F = m × a to compute the missing value.",
      steps: [
        "List known values with units.",
        "Select Newton's 2nd law: F = m × a.",
        "Rearrange for the unknown if needed.",
        "Plug in values and confirm units simplify correctly."
      ],
      simpleExplain: "Force is just how hard something pushes. Bigger mass or acceleration means bigger force.",
      harderVersion: "A 2.5 kg object accelerates from 2 m/s to 14 m/s in 4 s. Find net force."
    };
  }

  return {
    subject: "General",
    finalAnswer: "Core idea extracted and explained below.",
    steps: [
      "Read the prompt and identify exactly what is being asked.",
      "Highlight key facts, quantities, and constraints.",
      "Choose the relevant formula, rule, or concept.",
      "Perform the reasoning, then verify against the question."
    ],
    simpleExplain: "Break the question into tiny pieces, solve each one, then combine.",
    harderVersion: "Answer the same question with one additional assumption or constraint."
  };
}

export function tutorReply(mode: "homework" | "test-prep" | "concept", prompt: string): string {
  const lead =
    mode === "homework"
      ? "Homework Help mode: let's solve this with clear steps."
      : mode === "test-prep"
        ? "Test Prep mode: focusing on high-yield exam strategy."
        : "Concept mode: building true understanding from first principles.";

  return `${lead}\n\nHere's the key idea for \"${prompt}\":\n1) Define the concept in one sentence.\n2) Apply it to a simple example.\n3) Test it with one quick check question.`;
}

export function summarizeNotes(text: string): { summary: string; keyPoints: string[]; flashcards: string[]; quiz: string[] } {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  const keyPoints = (lines.length ? lines : ["No text detected. Paste or upload better notes."]).map((line) => line.slice(0, 110));

  return {
    summary: keyPoints.slice(0, 3).join(" "),
    keyPoints,
    flashcards: keyPoints.slice(0, 5).map((point, i) => `Q${i + 1}: What does this mean? — ${point}`),
    quiz: keyPoints.slice(0, 4).map((point, i) => `Quiz ${i + 1}: Explain why this matters: ${point}`)
  };
}

export function buildStudyPlan(weakTopics: string[]): string[] {
  if (!weakTopics.length) {
    return ["Review one topic for 25 minutes.", "Do 10 adaptive practice questions.", "End with 5 flashcards."];
  }

  return [
    `Warm-up: 10 minutes revising ${weakTopics[0]}.`,
    `Deep practice: medium/hard mixed set on ${weakTopics.slice(0, 2).join(" + ")}.`,
    "Reflection: use Explain Mistake on every incorrect response."
  ];
}
