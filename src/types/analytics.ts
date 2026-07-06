import { CodingAttempt, Question, Interview } from "@prisma/client"

export interface ExtendedCodingAttempt extends CodingAttempt {
  question: Question & { interview: Interview }
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface LanguageStat {
  language: string;
  count: number;
  successRate: number;
  avgRuntime: number;
  avgMemory: number;
  avgScore: number;
}

export interface AnalyticsData {
  attempts: ExtendedCodingAttempt[];
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  successRate: number;
  avgRuntime: number;
  avgMemory: number;
  avgAiScore: number;
  currentStreak: number;
  longestStreak: number;
  totalCodingTime: number; // mock or calculate based on count * average time to write
  totalExecutions: number;
  favoriteLanguage: string;
  commonTimeComplexity: string;
  commonSpaceComplexity: string;
  dailyActivity: DailyActivity[];
  languageStats: LanguageStat[];
  unlockedAchievements: string[];
  user?: {
    name: string;
    email: string;
  };
}
