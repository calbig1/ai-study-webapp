import { GeneratedStudyPack, StudySetup, StudyStats, UploadItem, UserSettings } from "@/lib/types";

const KEYS = {
  uploads: "aether_uploads_v2",
  pack: "aether_pack_v2",
  setup: "aether_setup_v2",
  stats: "aether_stats_v2",
  settings: "aether_settings_v2"
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
  focusArea: "",
  timed: false,
  tutorMode: true
};

const defaultSettings: UserSettings = {
  studySpaceName: "AetherStudy",
  theme: "ocean",
  themeIntensity: "high",
  animationLevel: "high",
  fontStyle: "clean",
  tutorTone: "coach"
};

const samplePack: GeneratedStudyPack = {
  flashcards: [],
  mcqs: [],
  summaries: [],
  tutorGuide: [],
  topics: []
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

export function getSettings(): UserSettings {
  return read<UserSettings>(KEYS.settings, defaultSettings);
}

export function setSettings(data: UserSettings): void {
  write(KEYS.settings, data);
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

export function accuracyPercent(stats: StudyStats): number {
  if (stats.totalAnswered === 0) {
    return 0;
  }
  return Math.round((stats.correctCount / stats.totalAnswered) * 100);
}

export function topWeakTopics(stats: StudyStats): string[] {
  return Object.entries(stats.weakTopics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
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

export function estimateUploadProgress(current: number): number {
  const next = current + Math.floor(Math.random() * 21) + 14;
  return Math.min(100, next);
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
  window.dispatchEvent(new Event("aether:settings-changed"));
}
