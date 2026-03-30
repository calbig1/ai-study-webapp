import { FlashcardItem, GeneratedStudyPack, MCQ, StudySetup, StudyStats, SummaryItem, UploadItem } from "@/lib/types";

const KEYS = {
  uploads: "study_uploads_v1",
  pack: "study_pack_v1",
  setup: "study_setup_v1",
  stats: "study_stats_v1"
} as const;

const defaultStats: StudyStats = {
  totalAnswered: 0,
  correctCount: 0,
  streakDays: 1,
  weakTopics: {}
};

const defaultSetup: StudySetup = {
  mode: "quiz",
  questionCount: 10,
  focusArea: ""
};

export const samplePack: GeneratedStudyPack = {
  flashcards: [
    { front: "Define opportunity cost.", back: "The value of the next best alternative you give up when making a choice.", topic: "Economics" },
    { front: "What is mitosis?", back: "A cell division process that produces two genetically identical daughter cells.", topic: "Biology" }
  ],
  mcqs: [
    {
      question: "Which event most directly increased tensions between Britain and the colonies before 1776?",
      choices: ["Missouri Compromise", "Townshend Acts", "Marshall Plan", "Monroe Doctrine"],
      answerIndex: 1,
      explanation: "The Townshend Acts imposed taxes and intensified colonial resistance.",
      topic: "US History"
    },
    {
      question: "In a standard supply-demand model, what usually happens when demand increases and supply stays constant?",
      choices: ["Price decreases", "Price increases", "Quantity decreases", "No change"],
      answerIndex: 1,
      explanation: "Higher demand shifts the demand curve right, typically raising equilibrium price.",
      topic: "Economics"
    }
  ],
  summaries: [
    { concept: "Photosynthesis", text: "Plants convert light energy, water, and carbon dioxide into glucose and oxygen. It powers most food chains.", topic: "Biology" },
    { concept: "Judicial Review", text: "Courts can evaluate whether laws or executive actions violate the Constitution.", topic: "Government" }
  ]
};

export function getUploads(): UploadItem[] {
  return read<UploadItem[]>(KEYS.uploads, []);
}

export function setUploads(data: UploadItem[]): void {
  write(KEYS.uploads, data);
}

export function getPack(): GeneratedStudyPack {
  return read<GeneratedStudyPack>(KEYS.pack, samplePack);
}

export function setPack(data: GeneratedStudyPack): void {
  write(KEYS.pack, data);
}

export function getSetup(): StudySetup {
  return read<StudySetup>(KEYS.setup, defaultSetup);
}

export function setSetup(data: StudySetup): void {
  write(KEYS.setup, data);
}

export function getStats(): StudyStats {
  return read<StudyStats>(KEYS.stats, defaultStats);
}

export function setStats(data: StudyStats): void {
  write(KEYS.stats, data);
}

export function updateStatsForAnswer(isCorrect: boolean, topic: string): void {
  const stats = getStats();
  stats.totalAnswered += 1;
  if (isCorrect) {
    stats.correctCount += 1;
  } else {
    stats.weakTopics[topic] = (stats.weakTopics[topic] ?? 0) + 1;
  }
  setStats(stats);
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function estimateUploadProgress(current: number): number {
  const next = current + Math.floor(Math.random() * 24) + 18;
  return Math.min(next, 100);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const level = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** level;
  return `${value.toFixed(level === 0 ? 0 : 1)} ${units[level]}`;
}

export function topWeakTopics(stats: StudyStats): string[] {
  return Object.entries(stats.weakTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([topic]) => topic);
}

export function accuracyPercent(stats: StudyStats): number {
  if (stats.totalAnswered === 0) {
    return 0;
  }
  return Math.round((stats.correctCount / stats.totalAnswered) * 100);
}
