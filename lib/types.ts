export type MCQ = {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type FlashcardItem = {
  front: string;
  back: string;
  topic: string;
  confidenceHint?: string;
};

export type SummaryItem = {
  concept: string;
  text: string;
  topic: string;
};

export type GeneratedStudyPack = {
  flashcards: FlashcardItem[];
  mcqs: MCQ[];
  summaries: SummaryItem[];
  tutorGuide: string[];
  topics: string[];
};

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  extractedText?: string;
  sourceType?: "file" | "pasted";
};

export type StudyMode = "quiz" | "flashcards" | "review";

export type StudySetup = {
  mode: StudyMode;
  questionCount: number;
  focusArea: string;
  timed: boolean;
  tutorMode: boolean;
};

export type StudyStats = {
  totalAnswered: number;
  correctCount: number;
  streakDays: number;
  weakTopics: Record<string, number>;
};

export type UserSettings = {
  studySpaceName: string;
  theme: "ocean" | "sunset" | "forest" | "midnight";
  themeIntensity: "low" | "high";
  animationLevel: "low" | "high";
  fontStyle: "clean" | "academic" | "modern";
  tutorTone: "coach" | "calm" | "direct";
};

export type ProcessedConcept = {
  topic: string;
  importance: number;
  statements: string[];
};
