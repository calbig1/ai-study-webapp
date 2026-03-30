export type MCQ = {
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
  topic: string;
};

export type FlashcardItem = {
  front: string;
  back: string;
  topic: string;
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
};

export type UploadItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
};

export type StudyMode = "quiz" | "flashcards" | "review";

export type StudySetup = {
  mode: StudyMode;
  questionCount: number;
  focusArea: string;
};

export type StudyStats = {
  totalAnswered: number;
  correctCount: number;
  streakDays: number;
  weakTopics: Record<string, number>;
};
